import os
import re
from datetime import datetime, timezone
from typing import Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db.mongo import get_db

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

class ChatMessageIn(BaseModel):
    message: str
    session_id: str | None = None
    lang: str = "hi"  # "hi" or "en"

class SuggestedAction(BaseModel):
    label: str
    href: str

class ChatMessageOut(BaseModel):
    status: str
    reply: str
    category: str
    suggested_actions: list[dict[str, str]]
    session_id: str


# Comprehensive Domain Knowledge Base for UP Agriculture
KNOWLEDGE_PATTERNS = [
    {
        "category": "wheat",
        "keywords": ["गेहूं", "wheat", "रतुआ", "rust", "karnal bunt", "गेहू", "बोनी", "पोटाश", "pbw", "hd 2967", "hd 3086"],
        "reply_hi": (
            "🌾 **गेहूं प्रबंधन एवं वैज्ञानिक सलाह:**\n\n"
            "• **उन्नत किस्में:** HD-2967, PBW-502, DBW-187 (करण वंदना), DBW-303।\n"
            "• **बीज दर:** सामान्य बुवाई 100 किग्रा/हेक्टेयर, देर से बुवाई 125 किग्रा/हेक्टेयर।\n"
            "• **पीला रतुआ (Yellow Rust) नियंत्रण:** लक्षण दिखते ही प्रोपिकोनाजोल 25% EC (टिल्ट) 1 मिली प्रति लीटर पानी में मिलाकर छिड़काव करें।\n"
            "• **सिंचाई के महत्वपूर्ण चरण:** सीआरआई (21 दिन), कल्ले निकलते समय (45 दिन), और दाना भरते समय।"
        ),
        "reply_en": (
            "🌾 **Wheat Agronomy & Disease Advisory:**\n\n"
            "• **High-Yielding Varieties:** HD-2967, PBW-502, DBW-187 (Karan Vandana), DBW-303.\n"
            "• **Seed Rate:** 100 kg/ha for normal sowing, 125 kg/ha for late sowing.\n"
            "• **Yellow Rust Management:** At initial symptoms, spray Propiconazole 25% EC @ 1 ml/litre of water.\n"
            "• **Critical Irrigation Stages:** Crown Root Initiation (CRI at 21 days), Tillering (45 days), and Grain Filling stage."
        ),
        "actions": [
            {"label_hi": "गेहूं फसल पैकेज देखें", "label_en": "View Wheat Crop Package", "href": "/crops/wheat"},
            {"label_hi": "पीला रतुआ उपचार", "label_en": "Yellow Rust Treatment", "href": "/diseases"}
        ]
    },
    {
        "category": "rice",
        "keywords": ["धान", "rice", "paddy", "बासमती", "झुलसा", "blight", "dsr", "सीधी बुवाई", "तना छेदक", "बीपीएच"],
        "reply_hi": (
            "🌾 **धान फसल एवं सुरक्षा परामर्श:**\n\n"
            "• **संस्तुत किस्में:** पूसा बासमती 1509, पूसा 1121, सरजू 52, NDR-359।\n"
            "• **खरपतवार नियंत्रण (DSR):** बुवाई के 0-3 दिन के भीतर पेंडिमिथैलिन 30% EC (3.3 लीटर/हेक्टेयर) का छिड़काव करें।\n"
            "• **जीवाणु झुलसा (Bacterial Leaf Blight):** स्ट्रेप्टोसाइक्लिन 15 ग्राम + कॉपर ऑक्सीक्लोराइड 500 ग्राम प्रति 200 लीटर पानी में मिलाकर स्प्रे करें।\n"
            "• **भूरा फुदका (BPH):** तने के निचले भाग पर लक्षण दिखते ही पाइमेट्रोज़िन 50% WG या डिनोटेफ्यूरॉन का प्रयोग करें।"
        ),
        "reply_en": (
            "🌾 **Rice (Paddy) Care & Protection Advisory:**\n\n"
            "• **Recommended Varieties:** Pusa Basmati 1509, Pusa 1121, Sarjoo 52, NDR-359.\n"
            "• **Weed Control (DSR):** Apply Pendimethalin 30% EC @ 3.3 L/ha within 0-3 days of dry direct seeding.\n"
            "• **Bacterial Leaf Blight (BLB):** Spray Streptocycline 15g + Copper Oxychloride 500g in 200 liters of water per acre.\n"
            "• **Brown Planthopper (BPH):** Spray Pymetrozine 50% WG or Dinotefuran 20% SG targeting the base of the hills."
        ),
        "actions": [
            {"label_hi": "धान फसल पैकेज", "label_en": "Rice Crop Package", "href": "/crops/paddy"},
            {"label_hi": "कीट व रोग प्रबंधन", "label_en": "Pest & Disease Guide", "href": "/pests"}
        ]
    },
    {
        "category": "schemes",
        "keywords": ["योजना", "scheme", "pm kisan", "पीएम किसान", "सम्मान निधि", "किस्त", "subsidy", "अनुदान", "कुसुम", "kusum", "तालाब", "bima", "बीमा"],
        "reply_hi": (
            "🏛️ **प्रमुख सरकारी किसान कल्याण योजनाएं:**\n\n"
            "• **PM-किसान सम्मान निधि:** पात्र किसानों को ₹6,000 प्रति वर्ष (₹2,000 की 3 समान किश्तों में DBT)। ई-केवाईसी अनिवार्य है।\n"
            "• **पीएम कुसुम सोलर पम्प:** 2 HP से 10 HP सोलर पम्प पर केंद्र व उ.प्र. सरकार द्वारा 60% तक प्रत्यक्ष अनुदान।\n"
            "• **प्रधानमंत्री फसल बीमा (PMFBY):** रबी में 1.5% और खरीफ में 2% प्रीमियम पर प्राकृतिक आपदा से फसल सुरक्षा।\n"
            "• **उ.प्र. खेत तालाब योजना:** खेत में वर्षा जल संचयन तालाब पर 50% (अधिकतम ₹1,05,000) सब्सिडी।"
        ),
        "reply_en": (
            "🏛️ **Major Government Welfare Schemes for Farmers:**\n\n"
            "• **PM-KISAN Samman Nidhi:** Direct income support of ₹6,000/year in 3 equal installments. Aadhaar e-KYC is mandatory.\n"
            "• **PM KUSUM Solar Pump Scheme:** 60% subsidy on 2 HP to 10 HP solar water pumps across UP.\n"
            "• **PM Fasal Bima Yojana (PMFBY):** Comprehensive crop insurance at 1.5% Rabi & 2% Kharif premium.\n"
            "• **UP Khet Talab Yojana:** 50% grant (up to ₹1,05,000) for digging farm ponds for rainwater harvesting."
        ),
        "actions": [
            {"label_hi": "सरकारी योजनाएं देखें", "label_en": "Explore Govt Schemes", "href": "/schemes"},
            {"label_hi": "पीएम किसान पोर्टल", "label_en": "PM-Kisan Official", "href": "https://pmkisan.gov.in/"}
        ]
    },
    {
        "category": "mandi",
        "keywords": ["मंडी", "mandi", "भाव", "rate", "price", "दाम", "आवक", "agmarknet", "गेहूं भाव", "धान भाव", "आलू भाव"],
        "reply_hi": (
            "📊 **उत्तर प्रदेश मंडी भाव अपडेट (Agmarknet Live):**\n\n"
            "• **गेहूं (Wheat MSP):** ₹2,425 - ₹2,550/कुंतल (विभिन्न मंडियों में औसत दर)।\n"
            "• **धान (Paddy Common):** ₹2,300 - ₹2,350/कुंतल।\n"
            "• **सरसों (Mustard):** ₹5,450 - ₹5,800/कुंतल।\n"
            "• **आलू (Potato):** ₹1,100 - ₹1,450/कुंतल।\n\n"
            "अपने जनपद (अयोध्या, लखनऊ, कानपुर, वाराणसी) की सभी 75 मंडियों के वास्तविक थोक भाव देखने के लिए नीचे क्लिक करें।"
        ),
        "reply_en": (
            "📊 **Uttar Pradesh Mandi Price Update (Agmarknet Daily):**\n\n"
            "• **Wheat (MSP):** ₹2,425 - ₹2,550/quintal modal rate.\n"
            "• **Paddy (Common):** ₹2,300 - ₹2,350/quintal.\n"
            "• **Mustard:** ₹5,450 - ₹5,800/quintal.\n"
            "• **Potato:** ₹1,100 - ₹1,450/quintal.\n\n"
            "To inspect live wholesale arrival volumes and minimum/maximum rates for all 75 UP districts, click below."
        ),
        "actions": [
            {"label_hi": "लाइव मंडी भाव देखें", "label_en": "View Live Mandi Prices", "href": "/mandi"},
            {"label_hi": "फसल कैलेंडर", "label_en": "Crop Calendar", "href": "/crop-calendar"}
        ]
    },
    {
        "category": "soil",
        "keywords": ["मिट्टी", "soil", "मृदा", "परीक्षण", "test", "खाद", "यूरिया", "जिप्सम", "ऊसर", "organic carbon", "जीवांश"],
        "reply_hi": (
            "🌱 **मृदा स्वास्थ्य एवं उर्वरक प्रबंधन:**\n\n"
            "• **नमूना लेने की सही विधि:** खेत के 8-10 स्थानों से अंग्रेजी के 'V' आकार में 15 सेमी गहरा गड्ढा खोदकर मिट्टी इकट्ठा करें और 'चौथाईकरण विधि' से 500 ग्राम नमूना तैयार करें।\n"
            "• **ऊसर (सोडिक) सुधार:** मिट्टी जांच के आधार पर 50% जिप्सम आवश्यकता (GR) + हरी खाद (ढैंचा) का प्रयोग करें।\n"
            "• **संतुलित पोषण:** बिना जांच के अंधाधुंध यूरिया न डालें। 4:2:1 (N:P:K) अनुपात और 25 किग्रा जिंक सल्फेट प्रति हेक्टेयर दें।"
        ),
        "reply_en": (
            "🌱 **Soil Health & Fertilizer Advisory:**\n\n"
            "• **Sampling Protocol:** Collect V-shaped 15 cm deep soil cores from 8-10 zig-zag spots, mix thoroughly, and quarter down to a 500g composite sample.\n"
            "• **Sodic Land Reclamation:** Apply Gypsum based on 50% Gypsum Requirement (GR) followed by ponding and Sesbania (Dhaincha) green manuring.\n"
            "• **Balanced Nutrition:** Maintain recommended N:P:K ratio (4:2:1) and apply 25 kg Zinc Sulphate per hectare for cereal crops."
        ),
        "actions": [
            {"label_hi": "मृदा परीक्षण संदर्शिका", "label_en": "Soil Testing Guide", "href": "/soil-health"},
            {"label_hi": "बीज एवं उर्वरक", "label_en": "Seeds & Fertilizers", "href": "/seeds-fertilizers"}
        ]
    },
    {
        "category": "weather",
        "keywords": ["मौसम", "weather", "बारिश", "rain", "तापमान", "हवा", "पाला", "frost", "imd", "पूर्वानुमान"],
        "reply_hi": (
            "⛅ **मौसम आधारित कृषि सलाह (IMD बुलेटिन):**\n\n"
            "• मौसम पूर्वानुमान की पुष्टि के बाद ही कीटनाशक व नैनो यूरिया का छिड़काव करें।\n"
            "• पाले (Frost) की आशंका होने पर शाम के समय खेत की मेड़ों पर हल्की सिंचाई करें या धुआं करें।\n"
            "• 5-दिवसीय जिलावार वर्षा, आर्द्रता एवं हवा की गति की ताजा रिपोर्ट देखने के लिए नीचे क्लिक करें।"
        ),
        "reply_en": (
            "⛅ **Agro-Weather Advisory (IMD Network):**\n\n"
            "• Check the 5-day rain and wind forecast before undertaking foliar chemical or fertilizer sprays.\n"
            "• In case of frost warning during winter, provide light evening irrigation to raise soil temperature.\n"
            "• Inspect 5-day district-level rainfall, humidity, and temperature trends below."
        ),
        "actions": [
            {"label_hi": "मौसम पूर्वानुमान देखें", "label_en": "Check Weather Forecast", "href": "/weather"},
            {"label_hi": "आपातकालीन हेल्पलाइन", "label_en": "Emergency Helpline", "href": "/helpline"}
        ]
    },
    {
        "category": "helpline",
        "keywords": ["हेल्पलाइन", "helpline", "नंबर", "phone", "कॉल", "संपर्क", "contact", "शिकायत", "call center", "toll free"],
        "reply_hi": (
            "📞 **आधिकारिक किसान संपर्क एवं हेल्पलाइन नंबर:**\n\n"
            "• **किसान कॉल सेंटर (Toll Free):** 1800-180-1551 (प्रातः 6:00 से रात्रि 10:00 तक)\n"
            "• **कृषि विभाग उ.प्र. हेल्पलाइन:** 1800-123-1111\n"
            "• **पीएम-किसान हेल्पलाइन:** 155261 / 011-24300606\n"
            "• **आचार्य नरेंद्र देव कृषि विश्वविद्यालय (ANDUAT):** 05270-262072"
        ),
        "reply_en": (
            "📞 **Official Agriculture Helplines & Support:**\n\n"
            "• **Kisan Call Centre (Toll Free):** 1800-180-1551 (6:00 AM to 10:00 PM)\n"
            "• **UP Agriculture Dept Helpline:** 1800-123-1111\n"
            "• **PM-KISAN Helpline:** 155261 / 011-24300606\n"
            "• **ANDUAT Kumarganj University:** 05270-262072"
        ),
        "actions": [
            {"label_hi": "सभी हेल्पलाइन नंबर", "label_en": "View All Helplines", "href": "/helpline"},
            {"label_hi": "केवीके डायरेक्टरी", "label_en": "KVK Directory", "href": "/kvk"}
        ]
    }
]

DEFAULT_REPLY_HI = (
    "नमस्ते किसान मित्र! मैं **अवध किसान सहायक (AI Kisan Sahayak)** हूँ।\n\n"
    "मैं आपकी निम्नलिखित विषयों पर सहायता कर सकता हूँ:\n"
    "• फसलों की उन्नत किस्में, बीज दर व बुवाई समय (गेहूं, धान, सरसों, गन्ना, आलू)\n"
    "• फसल रोग एवं कीट नियंत्रण (पीला रतुआ, झुलसा, कीट प्रबंधन)\n"
    "• उत्तर प्रदेश की मंडियों के दैनिक थोक भाव\n"
    "• पीएम किसान सम्मान निधि, सोलर पम्प व सरकारी अनुदान योजनाएं\n"
    "• मिट्टी की जांच व मौसम आधारित कृषि सलाह\n\n"
    "कृपया अपना प्रश्न नीचे लिखें या दिए गए विकल्पों पर क्लिक करें!"
)

DEFAULT_REPLY_EN = (
    "Hello Farmer Friend! I am your **Awadh Kisan Sahayak (AI Agricultural Assistant)**.\n\n"
    "I can assist you with:\n"
    "• Agronomic packages & certified seed varieties (Wheat, Rice, Mustard, Sugarcane, Potato)\n"
    "• Plant disease & pest management (Yellow rust, Blight, Fall armyworm, IPM)\n"
    "• Daily wholesale Mandi arrival rates from Agmarknet\n"
    "• PM-KISAN, PM KUSUM Solar Pump & UP state welfare subsidies\n"
    "• Soil sampling protocols & district agro-weather advisories\n\n"
    "Please type your question or select one of the suggested topics below!"
)


@router.post("/message", response_model=ChatMessageOut)
async def handle_chatbot_message(payload: ChatMessageIn) -> dict[str, Any]:
    """Process farmer natural language queries and provide scientific agronomic guidance."""
    user_msg = payload.message.strip().lower()
    session_id = payload.session_id or f"sess-{int(datetime.now().timestamp())}"
    lang = payload.lang if payload.lang in ["hi", "en"] else "hi"

    matched_entry = None
    # Keyword search across knowledge patterns
    for entry in KNOWLEDGE_PATTERNS:
        for kw in entry["keywords"]:
            if kw in user_msg:
                matched_entry = entry
                break
        if matched_entry:
            break

    if matched_entry:
        reply_text = matched_entry["reply_hi"] if lang == "hi" else matched_entry["reply_en"]
        category = matched_entry["category"]
        actions = [
            {
                "label": a["label_hi"] if lang == "hi" else a["label_en"],
                "href": a["href"]
            }
            for a in matched_entry["actions"]
        ]
    else:
        # General welcoming/clarification response
        reply_text = DEFAULT_REPLY_HI if lang == "hi" else DEFAULT_REPLY_EN
        category = "general"
        actions = [
            {"label": "मंडी भाव" if lang == "hi" else "Mandi Prices", "href": "/mandi"},
            {"label": "सरकारी योजनाएं" if lang == "hi" else "Govt Schemes", "href": "/schemes"},
            {"label": "रोग निवारण" if lang == "hi" else "Crop Diseases", "href": "/diseases"},
            {"label": "विशेषज्ञ से पूछें" if lang == "hi" else "Ask Expert", "href": "/ask-expert"}
        ]

    # Save to MongoDB Atlas collection `chat_logs` asynchronously
    try:
        db = get_db()
        await db.chat_logs.insert_one({
            "session_id": session_id,
            "user_message": payload.message,
            "bot_reply": reply_text,
            "category": category,
            "lang": lang,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
    except Exception as db_err:
        print(f"[warn] Failed to log chat message: {db_err}")

    return {
        "status": "success",
        "reply": reply_text,
        "category": category,
        "suggested_actions": actions,
        "session_id": session_id
    }


@router.get("/quick-prompts")
async def get_quick_prompts(lang: str = "hi") -> dict[str, Any]:
    """Return quick clickable question prompts for the farmer chatbot."""
    if lang == "hi":
        prompts = [
            "गेहूं में पीला रतुआ कैसे रोकें?",
            "PM-Kisan 19वीं किस्त कब आएगी?",
            "आज का मंडी भाव क्या है?",
            "धान में खरपतवार नियंत्रण की विधि",
            "खेत की मिट्टी जांच कैसे कराएं?",
            "सोलर पम्प पर कितनी सब्सिडी मिलती है?"
        ]
    else:
        prompts = [
            "How to control Yellow Rust in wheat?",
            "When will PM-Kisan next installment come?",
            "What are today's mandi prices?",
            "Weed management in direct seeded rice",
            "How to test farm soil?",
            "How much subsidy is on solar pumps?"
        ]
    return {"status": "success", "prompts": prompts}
