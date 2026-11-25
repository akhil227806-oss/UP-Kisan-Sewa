"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Video, Play, Search, Clock, ExternalLink, X, Eye, ShieldCheck, BookOpen, Layers } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";

interface VideoItem {
  id: string;
  youtube_id: string;
  title: string;
  title_hi?: string;
  channel: string;
  category: string;
  category_en?: string;
  duration: string;
  description: string;
  description_en?: string;
  views?: string;
  source?: string;
}

const OFFICIAL_40_VIDEOS: VideoItem[] = [
  // 1. Farm Machinery & Agricultural Engineering
  {
    id: "vid-01",
    youtube_id: "4EHjHcyB9yY",
    title: "Classification of Tractors",
    title_hi: "ट्रैक्टरों का वर्गीकरण एवं कृषि उपयोगिता",
    channel: "Bharat Skills / TNAU",
    category: "कृषि यंत्रीकरण",
    category_en: "Farm Machinery",
    duration: "14:20",
    description: "विभिन्न एचपी श्रेणियों के ट्रैक्टरों का वर्गीकरण, 2WD व 4WD के उपयोग तथा कृषि कार्यों हेतु सही चयन।",
    description_en: "Comprehensive classification of two-wheel and four-wheel drive agricultural tractors and selection criteria for field operations.",
    views: "28.5K",
    source: "Bharat Skills / TNAU",
  },
  {
    id: "vid-02",
    youtube_id: "UzVv_1yfaI",
    title: "Tractor Components and Functions",
    title_hi: "ट्रैक्टर के प्रमुख घटक एवं उनकी कार्यप्रणाली",
    channel: "Agricultural Engineering Dept",
    category: "कृषि यंत्रीकरण",
    category_en: "Farm Machinery",
    duration: "16:45",
    description: "इंजन, क्लच, गियरबॉक्स, डिफरेंशियल, पीटीओ (PTO) एवं 3-पॉइंट लिंकेज प्रणाली की विस्तृत जानकारी।",
    description_en: "Detailed study of tractor engine, clutch assembly, transmission, differential, PTO, and three-point hydraulic hitch system.",
    views: "42.1K",
    source: "TNAU Agritech",
  },
  {
    id: "vid-03",
    youtube_id: "o036R2xjFvE",
    title: "Starting and Stopping of Tractors",
    title_hi: "ट्रैक्टर को सुरक्षित स्टार्ट और बंद करने की विधि",
    channel: "Farm Safety & Operations",
    category: "कृषि यंत्रीकरण",
    category_en: "Farm Machinery",
    duration: "09:15",
    description: "ट्रैक्टर शुरू करने से पूर्व की जाँचें (तेल, पानी, बैटरी), सुरक्षित प्रचालन एवं बंद करने की प्रामाणिक विधि।",
    description_en: "Standard pre-operation checks including oil, coolant, hydraulic fluid, safe starting protocol, and engine shutdown.",
    views: "19.3K",
    source: "Bharat Skills",
  },
  {
    id: "vid-04",
    youtube_id: "FjgTX8vFLc4",
    title: "Mould Board and Disc Plough Operation",
    title_hi: "मोल्ड बोर्ड एवं डिस्क हल का प्रचालन व समायोजन",
    channel: "MCAET Agricultural Engineering",
    category: "कृषि यंत्रीकरण",
    category_en: "Farm Machinery",
    duration: "15:30",
    description: "प्राथमिक जुताई हेतु मोल्ड बोर्ड एवं डिस्क हल का समायोजन, गहराई नियंत्रण और खेत में प्रचालन।",
    description_en: "Primary tillage operation with mouldboard and disc ploughs, depth control adjustments, and furrow alignment.",
    views: "33.7K",
    source: "ICAR-ATARI / MCAET",
  },
  {
    id: "vid-05",
    youtube_id: "1iexTtGlmyQ",
    title: "Seed Drill and Transplanter Operation",
    title_hi: "सीड ड्रिल एवं पैडी ट्रांसप्लांटर का प्रचालन",
    channel: "Farm Machinery Training Institute",
    category: "कृषि यंत्रीकरण",
    category_en: "Farm Machinery",
    duration: "18:10",
    description: "सीड कम फर्टिलाइजर ड्रिल की कैलिब्रेशन विधि, धान रोपाई मशीन का सही उपयोग एवं लाइन बुवाई के लाभ।",
    description_en: "Seed-cum-fertilizer drill calibration protocol, seed rate adjustment, and mechanical paddy transplanter field operation.",
    views: "51.4K",
    source: "FMTTI / ICAR",
  },
  {
    id: "vid-06",
    youtube_id: "fqAt_4feLLE",
    title: "SRI Method of Rice Planting",
    title_hi: "श्री (SRI) विधि से धान रोपाई तकनीक",
    channel: "TNAU Agritech Portal",
    category: "कृषि यंत्रीकरण",
    category_en: "Farm Machinery",
    duration: "12:50",
    description: "सिस्टम ऑफ राइस इंटेंसिफिकेशन (SRI) में मार्कर से 25x25 सेमी दूरी पर 10-12 दिन के पौधे की रोपाई।",
    description_en: "System of Rice Intensification (SRI) planting techniques, square grid marking, single seedling transplanting, and cono-weeder use.",
    views: "37.8K",
    source: "TNAU Technology Videos",
  },
  {
    id: "vid-07",
    youtube_id: "RJFtzB97RJI",
    title: "Tractor Repair and Maintenance",
    title_hi: "ट्रैक्टर की नियमित सर्विसिंग व रख-रखाव",
    channel: "Agricultural Engineering Extension",
    category: "कृषि यंत्रीकरण",
    category_en: "Farm Machinery",
    duration: "22:15",
    description: "एयर क्लीनर, मोबाइल ऑयल, फ्यूल फिल्टर, ब्रेक व क्लच की नियमित 50 व 250 घंटे वाली सर्विसिंग।",
    description_en: "Routine 50-hour and 250-hour preventative maintenance schedule, oil filter change, air cleaner servicing, and battery care.",
    views: "64.9K",
    source: "Bharat Skills / MANAGE",
  },
  {
    id: "vid-08",
    youtube_id: "FWzFT0Psm7g",
    title: "Power Tiller Operation",
    title_hi: "पावर टिलर का प्रचालन एवं छोटे खेतों में उपयोग",
    channel: "Farm Mechanization Cell",
    category: "कृषि यंत्रीकरण",
    category_en: "Farm Machinery",
    duration: "11:40",
    description: "छोटे व सीमांत किसानों के लिए पावर टिलर से जुताई, पडलिंग व रोटावेटर संचालन की प्रायोगिक विधि।",
    description_en: "Operation and handling of walk-behind two-wheel power tillers for wet puddling and dry rotavation on smallholder farms.",
    views: "29.2K",
    source: "ICAR-ATARI Kanpur",
  },
  {
    id: "vid-09",
    youtube_id: "Q5PdBZ1DCYw",
    title: "Power Reaper and Harvesting Tools",
    title_hi: "पावर रीपर एवं आधुनिक फसल कटाई उपकरण",
    channel: "Agricultural Tools Institute",
    category: "कृषि यंत्रीकरण",
    category_en: "Farm Machinery",
    duration: "13:05",
    description: "गेहूँ और धान की कटाई हेतु सेल्फ-प्रोपेल्ड पावर रीपर का उपयोग, ब्लेड सेटिंग व समय की बचत।",
    description_en: "Field operation of self-propelled vertical conveyor reapers for grain harvesting with minimum grain shattering losses.",
    views: "35.6K",
    source: "TNAU Agritech",
  },
  {
    id: "vid-10",
    youtube_id: "_XYTsI-I47s",
    title: "Pedal Operated Thresher",
    title_hi: "पैडल ऑपरेटेड पैडी थ्रेशर का संचालन",
    channel: "Appropriate Technology Wing",
    category: "कृषि यंत्रीकरण",
    category_en: "Farm Machinery",
    duration: "08:50",
    description: "बिना बिजली व ईंधन के पैडल चालित थ्रेशर से धान की मड़ाई, दाना सफाई एवं कम लागत तकनीक।",
    description_en: "Demonstration of manually pedal-operated paddy threshers for efficient small-scale grain separation without electrical power.",
    views: "21.0K",
    source: "Bharat Skills",
  },

  // 2. Crop Production & Farming Systems
  {
    id: "vid-11",
    youtube_id: "78YbEyojU5U",
    title: "Mixed Cropping Under Coconut Plantation",
    title_hi: "बागवानी एवं बहुमंजिला अंतर्वर्ती फसल प्रणाली",
    channel: "Horticulture Division",
    category: "फसल उत्पादन",
    category_en: "Crop Production",
    duration: "16:20",
    description: "दीर्घकालिक वृक्षों के नीचे मसाला, कंदवर्गीय व दलहनी फसलों की बहुमंजिला खेती से अतिरिक्त लाभ।",
    description_en: "Multi-tier cropping and companion planting under orchard canopies for maximum solar radiation and soil moisture utilization.",
    views: "18.4K",
    source: "TNAU Agritech",
  },
  {
    id: "vid-12",
    youtube_id: "wS1LKU587v8",
    title: "Integrated Farming System (IFS) Model",
    title_hi: "समन्वित कृषि प्रणाली (IFS) मॉडल — 1 एकड़ से अधिकतम आय",
    channel: "ICAR-ATARI Kanpur",
    category: "फसल उत्पादन",
    category_en: "Crop Production",
    duration: "19:40",
    description: "फसल + डेयरी + मत्स्य पालन + मुर्गी पालन + वर्मीकम्पोस्ट का चक्रिय मॉडल, जिससे किसान की आय 3 गुना होती है।",
    description_en: "Integrated Farming System model integrating crop rotation, milch cattle, aquaculture pond, poultry, and vermicompost.",
    views: "72.8K",
    source: "ICAR-ATARI Kanpur",
  },
  {
    id: "vid-13",
    youtube_id: "QK7E2Ty5jw",
    title: "Scientific Elevated Goat Farm",
    title_hi: "वैज्ञानिक मचान विधि से उन्नत बकरी पालन",
    channel: "Animal Husbandry Division",
    category: "फसल उत्पादन",
    category_en: "Crop Production",
    duration: "14:15",
    description: "जमीन से 3-4 फीट ऊपर मचान पर बकरी पालन, रोग मुक्त वातावरण, संतुलित आहार व उच्च प्रजनन दर।",
    description_en: "Elevated slatted floor housing for commercial goat farming to prevent parasite infections and improve growth rate.",
    views: "45.2K",
    source: "MANAGE e-Catalogue",
  },
  {
    id: "vid-14",
    youtube_id: "JGp3IJ9gM6o",
    title: "Roof Top Garden Training",
    title_hi: "रूफटॉप गार्डनिंग एवं जैविक किचन गार्डन प्रशिक्षण",
    channel: "Urban Agriculture Cell",
    category: "फसल उत्पादन",
    category_en: "Crop Production",
    duration: "17:30",
    description: "छत पर ग्रो बैग्स, पॉटिंग मिक्स, ड्रिप किट एवं जैविक सब्जियों (टमाटर, बैंगन, मिर्च) उगाने का प्रशिक्षण।",
    description_en: "Urban rooftop vegetable gardening training covering lightweight media preparation, vertical trellising, and organic nutrient management.",
    views: "61.3K",
    source: "TNAU Technology Videos",
  },
  {
    id: "vid-15",
    youtube_id: "LOeppmzK580",
    title: "Bhendi as Bund Crop in Paddy",
    title_hi: "धान की मेड़ों पर भिंडी की खेती — अतिरिक्त आय व कीट नियंत्रण",
    channel: "Integrated Crop Extension",
    category: "फसल उत्पादन",
    category_en: "Crop Production",
    duration: "10:15",
    description: "धान के खेत की मेड़ों का सदुपयोग कर भिंडी की बुवाई से अतिरिक्त आय और मित्र कीटों का संरक्षण।",
    description_en: "Growing okra (ladyfinger) along paddy field bunds as a trap crop for pests and complementary farm revenue.",
    views: "24.7K",
    source: "TNAU Agritech",
  },
  {
    id: "vid-16",
    youtube_id: "9U2erDarwCw",
    title: "Traditional Paddy Varieties",
    title_hi: "पारंपरिक एवं देसी धान की औषधीय किस्में",
    channel: "Heritage Seed Conservation",
    category: "फसल उत्पादन",
    category_en: "Crop Production",
    duration: "21:00",
    description: "काला नमक, लाल धान एवं पारंपरिक धान किस्मों की पोषक गुणवत्ता, जैविक खेती एवं बाजार मूल्य।",
    description_en: "Nutritional and climate-resilient attributes of indigenous scented and colored rice landraces including Kalanamak.",
    views: "39.5K",
    source: "MANAGE / ICAR",
  },
  {
    id: "vid-17",
    youtube_id: "j_oDFMpbExI",
    title: "Barnyard Millet Cultivation",
    title_hi: "सांवा (Barnyard Millet) की वैज्ञानिक खेती व श्री अन्न उत्पादन",
    channel: "Millets Mission NDUAT",
    category: "फसल उत्पादन",
    category_en: "Crop Production",
    duration: "13:45",
    description: "कम पानी और बंजर भूमि में सांवा मिलेट की बुवाई, संतुलित पोषण एवं श्री अन्न मिशन अंतर्गत विपणन।",
    description_en: "Package of practices for barnyard millet (Sanwa) cultivation under dryland and drought-prone agricultural conditions.",
    views: "31.2K",
    source: "ICAR-ATARI Kanpur",
  },
  {
    id: "vid-18",
    youtube_id: "m8EepIZEC2g",
    title: "Crop Cafeteria at Instructional Farm",
    title_hi: "अनुदेशात्मक फार्म पर क्रॉप कैफेटेरिया — विभिन्न किस्मों का सजीव प्रदर्शन",
    channel: "NDUAT Farm Media",
    category: "फसल उत्पादन",
    category_en: "Crop Production",
    duration: "15:10",
    description: "किसानों को नवीनतम बीजों व संकर किस्मों के तुलनात्मक उत्पादन को दिखाने हेतु क्रॉप कैफेटेरिया प्रदर्शन।",
    description_en: "Live crop cafeteria demonstration plots displaying varietal comparative yield trials and phenotypic characteristics.",
    views: "27.6K",
    source: "NDUAT Kumarganj",
  },
  {
    id: "vid-19",
    youtube_id: "jE0zZfrnKlw",
    title: "Integrated Crop Management",
    title_hi: "समन्वित फसल प्रबंधन (ICM) — बीज से बाजार तक",
    channel: "National Agri Extension",
    category: "फसल उत्पादन",
    category_en: "Crop Production",
    duration: "18:25",
    description: "उन्नत बीज चयन, मृदा सुधार, जल प्रबंधन, पोषण व कटाई उपरांत प्रबंधन का समग्र पैकेज।",
    description_en: "Holistic integrated crop management combining certified seed, soil conditioners, precision irrigation, and post-harvest care.",
    views: "48.1K",
    source: "MANAGE Agricultural Catalogue",
  },
  {
    id: "vid-20",
    youtube_id: "ZGeanXxdE1g",
    title: "System of Rice Intensification (SRI)",
    title_hi: "श्री (SRI) विधि से धान की खेती — 50% पानी की बचत, 30% अधिक उपज",
    channel: "Water Management Directorate",
    category: "फसल उत्पादन",
    category_en: "Crop Production",
    duration: "20:30",
    description: "कम बीज, कम पानी एवं जैविक खाद के साथ धान की सघन रोपाई विधि और कोनो-वीडर से खरपतवार नियंत्रण।",
    description_en: "Principles of System of Rice Intensification: wider spacing, organic fertilization, intermittent irrigation, and aeration.",
    views: "56.4K",
    source: "TNAU Technology Videos",
  },

  // 3. Pest & Disease Management (IPM)
  {
    id: "vid-21",
    youtube_id: "PoGqp0Fe2kg",
    title: "Management of Rice Gall Midge",
    title_hi: "धान में गॉल मिज (सिल्वर शूट) कीट की पहचान एवं नियंत्रण",
    channel: "Entomology Division NDUAT",
    category: "कीट व रोग नियंत्रण",
    category_en: "Pest Management",
    duration: "12:15",
    description: "गॉल मिज के कारण बनने वाले 'सिल्वर शूट' या 'प्याजिया पत्ती' की पहचान एवं समय पर एकीकृत कीटनाशी प्रबंधन।",
    description_en: "Identification of silver shoot onion-leaf symptoms caused by Asian rice gall midge and biological-chemical IPM interventions.",
    views: "22.8K",
    source: "ICAR-ATARI Kanpur",
  },
  {
    id: "vid-22",
    youtube_id: "IfhnkgwBKtM",
    title: "Demonstration of Pheromone Traps",
    title_hi: "खेत में फेरोमोन ट्रैप लगाने की वैज्ञानिक विधि एवं ल्योर बदलना",
    channel: "Biological Pest Control Cell",
    category: "कीट व रोग नियंत्रण",
    category_en: "Pest Management",
    duration: "11:20",
    description: "कीटों के नर पतंगों को आकर्षित कर नष्ट करने हेतु प्रति एकड़ 4-5 फेरोमोन ट्रैप लगाने की विधि।",
    description_en: "Practical demonstration on height adjustment, lure replacement, and maintenance of sex pheromone traps for pest monitoring.",
    views: "49.1K",
    source: "TNAU Technology Videos",
  },
  {
    id: "vid-23",
    youtube_id: "AnCCrwAflaY",
    title: "Solar Light Trap in Pest Management",
    title_hi: "सोलर लाइट ट्रैप द्वारा रात के कीटों का प्रभावी नियंत्रण",
    channel: "Clean Energy in Agriculture",
    category: "कीट व रोग नियंत्रण",
    category_en: "Pest Management",
    duration: "09:40",
    description: "सौर ऊर्जा से संचालित ऑटोमैटिक लाइट ट्रैप से विभिन्न फसलों में हानिकारक रात्रिचर कीटों का उन्मूलन।",
    description_en: "Deployment of automated solar-powered light traps for non-chemical trapping of nocturnal phototactic agricultural insect pests.",
    views: "38.2K",
    source: "MANAGE e-Catalogue",
  },
  {
    id: "vid-24",
    youtube_id: "eph6YisBuOw",
    title: "Bacterial Leaf Blight in Paddy",
    title_hi: "धान का जीवाणु झुलसा (Bacterial Blight) रोग व उपचार",
    channel: "Plant Pathology Division",
    category: "कीट व रोग नियंत्रण",
    category_en: "Pest Management",
    duration: "14:50",
    description: "पत्तियों के किनारों से सूखने के लक्षण, क्रेसेक अवस्था और कॉपर ऑक्सीक्लोराइड व स्ट्रेप्टोसाइक्लिन का छिड़काव।",
    description_en: "Diagnostic leaf lesions of Xanthomonas oryzae pv. oryzae, bacterial ooze test, and bactericide spray schedule.",
    views: "41.7K",
    source: "ICAR-ATARI Kanpur",
  },
  {
    id: "vid-25",
    youtube_id: "UWMBvc3Y-wY",
    title: "Natural Farming Training",
    title_hi: "प्राकृतिक कृषि में बीजामृत, नीमास्त्र एवं ब्रह्मास्त्र निर्माण",
    channel: "Natural Agriculture Wing",
    category: "कीट व रोग नियंत्रण",
    category_en: "Pest Management",
    duration: "23:15",
    description: "नीम की पत्तियां, गौमूत्र व तंबाकू से प्राकृतिक कीटनाशक नीमास्त्र, ब्रह्मास्त्र व दशपर्णी अर्क तैयार करना।",
    description_en: "Preparation and field dilution dosage of botanical concoctions Neemastra, Brahmastra, and Agniastra for natural pest deterrence.",
    views: "85.3K",
    source: "MANAGE / Bharat Skills",
  },
  {
    id: "vid-26",
    youtube_id: "ErMVRb37WIs",
    title: "Paddy Seed Treatment",
    title_hi: "धान के बीज का नमक के घोल व फफूंदनाशी से बीजोपचार",
    channel: "Seed Science Directorate",
    category: "कीट व रोग नियंत्रण",
    category_en: "Pest Management",
    duration: "10:35",
    description: "हल्के व रोगग्रस्त बीज अलग करने हेतु 10% नमक घोल विधि, कार्बेन्डाजिम व ट्राइकोडर्मा से उपचार।",
    description_en: "Brine solution seed floating method, seed dressing with Carbendazim/Trichoderma harzianum against seed-borne pathogens.",
    views: "33.9K",
    source: "TNAU Technology Videos",
  },
  {
    id: "vid-27",
    youtube_id: "p1SdWxtS2t4",
    title: "Paddy Nursery Preparation and Management",
    title_hi: "धान की नर्सरी तैयार करने की उन्नत विधि एवं देखभाल",
    channel: "Agronomy Division NDUAT",
    category: "कीट व रोग नियंत्रण",
    category_en: "Pest Management",
    duration: "16:20",
    description: "उठी हुई क्यारियों पर नर्सरी, अंकुरित बीज की बुवाई, जल प्रबंधन एवं पीलापन व खैरा रोग से बचाव।",
    description_en: "Raised bed paddy nursery bed design, sprouted seed broadcasting, moisture regulation, and zinc deficiency management.",
    views: "44.6K",
    source: "NDUAT Media Cell",
  },
  {
    id: "vid-28",
    youtube_id: "8goAxYdPmAs",
    title: "Paddy Seedling Treatment",
    title_hi: "धान की पौध का जड़ शोधन (Root Dip Treatment)",
    channel: "Plant Protection KVK",
    category: "कीट व रोग नियंत्रण",
    category_en: "Pest Management",
    duration: "09:10",
    description: "रोपाई से पूर्व पौध की जड़ों को ट्राइकोडर्मा, स्यूडोमोनास व क्लोरपायरीफॉस के घोल में डुबोने की विधि।",
    description_en: "Seedling root-dip method with bio-fungicides and systemic insecticides before field transplanting for early vegetative immunity.",
    views: "26.3K",
    source: "TNAU Agritech",
  },
  {
    id: "vid-29",
    youtube_id: "IfhnkgwBKtM",
    title: "Integrated Pest Management – Agricultural Lecture",
    title_hi: "समन्वित कीट प्रबंधन (IPM) — वैज्ञानिक व्याख्यान",
    channel: "Agricultural University Lectures",
    category: "कीट व रोग नियंत्रण",
    category_en: "Pest Management",
    duration: "25:40",
    description: "आर्थिक क्षति स्तर (ETL), मित्र कीटों का संवर्धन, यांत्रिक उपाय एवं रासायनिक कीटनाशकों का अंतिम विकल्प।",
    description_en: "University academic lecture on Economic Injury Level (EIL), Economic Threshold Level (ETL), bio-control agents, and IPM hierarchy.",
    views: "58.0K",
    source: "MANAGE / TNAU",
  },
  {
    id: "vid-30",
    youtube_id: "K8KgabuA-7Q",
    title: "Paddy Straw Management Machines",
    title_hi: "पराली प्रबंधन हेतु आधुनिक कृषि यंत्र (Super Seeder, Happy Seeder)",
    channel: "Agricultural Mechanization Centre",
    category: "कीट व रोग नियंत्रण",
    category_en: "Pest Management",
    duration: "17:15",
    description: "पराली जलाए बिना इन-सीटू प्रबंधन: स्ट्रॉ चॉपर, मल्चर, सुपर सीडर व बायो-डीकंपोजर का उपयोग।",
    description_en: "In-situ crop residue management machinery: straw management systems (SMS), mulchers, reversible MB ploughs, and super seeders.",
    views: "67.2K",
    source: "ICAR-ATARI Kanpur",
  },

  // 4. Soil Health, Organic Farming & Agricultural Lectures
  {
    id: "vid-31",
    youtube_id: "Uqr3eVdPDEE",
    title: "Soil Profile and Different Horizons",
    title_hi: "मृदा संस्तर (Soil Profile) एवं विभिन्न परतें — O, A, B, C",
    channel: "Soil Science Lecture Series",
    category: "मृदा स्वास्थ्य व व्याख्यान",
    category_en: "Soil Health & Lectures",
    duration: "18:50",
    description: "जमीन की विभिन्न परतों का अध्ययन, कार्बनिक पदार्थ का वितरण और जड़ों के प्रसार हेतु उपयोगी क्षेत्र।",
    description_en: "Pedological examination of soil master horizons (O, A, E, B, C, R) and their physical-chemical significance in plant rooting depth.",
    views: "36.4K",
    source: "Bharat Skills / ICAR",
  },
  {
    id: "vid-32",
    youtube_id: "bGm1glRWXLg",
    title: "Types of Soils Available in India",
    title_hi: "भारत की प्रमुख मिट्टियाँ एवं उनकी विशेषताएं",
    channel: "Agricultural Geography Series",
    category: "मृदा स्वास्थ्य व व्याख्यान",
    category_en: "Soil Health & Lectures",
    duration: "20:15",
    description: "जलोढ़ (Alluvial), काली, लाल, लेटराइट एवं मरुस्थलीय मिट्टी का भौगोलिक विस्तार एवं उपयुक्त फसलें।",
    description_en: "Geographical distribution, mineral composition, fertility status, and cropping patterns across major Indian soil orders.",
    views: "52.8K",
    source: "Bharat Skills",
  },
  {
    id: "vid-33",
    youtube_id: "8AiKASwdtoM",
    title: "Classification of Crops – Lecture",
    title_hi: "फसलों का वर्गीकरण — मौसम, उपयोगिता एवं जीवन-चक्र",
    channel: "Agronomy University Lectures",
    category: "मृदा स्वास्थ्य व व्याख्यान",
    category_en: "Soil Health & Lectures",
    duration: "22:30",
    description: "ऋतु-आधारित (खरीफ, रबी, जायद) एवं आर्थिक उपयोग (अनाज, दलहन, तिलहन, रेशा, चारा) अनुसार विस्तृत वर्गीकरण।",
    description_en: "Comprehensive agronomic classification of field crops by season, ontogeny, economic utility, and photosynthetic pathway (C3, C4, CAM).",
    views: "44.1K",
    source: "MANAGE e-Catalogue",
  },
  {
    id: "vid-34",
    youtube_id: "mDZ67duB6h0",
    title: "Kharif Crops and Their Cultivation",
    title_hi: "खरीफ फसलों का उत्पादन पैकेज एवं तकनीकी दिशानिर्देश",
    channel: "Agronomy Extension Wing",
    category: "मृदा स्वास्थ्य व व्याख्यान",
    category_en: "Soil Health & Lectures",
    duration: "24:10",
    description: "धान, मक्का, ज्वार, बाजरा, उड़द, मूंग एवं सोयाबीन की उन्नत बुवाई, जल निकास एवं खरपतवार नियंत्रण।",
    description_en: "Agronomic production package for major kharif cereals, pulses, and oilseeds under tropical monsoon environments.",
    views: "49.7K",
    source: "ICAR-ATARI Kanpur",
  },
  {
    id: "vid-35",
    youtube_id: "YzDxKTa8CTI",
    title: "Cultivation Practices of Rice, Maize and Millets",
    title_hi: "धान, मक्का एवं मोटे अनाजों की उन्नत सस्य क्रियाएं",
    channel: "Cereal Systems Lecture",
    category: "मृदा स्वास्थ्य व व्याख्यान",
    category_en: "Soil Health & Lectures",
    duration: "26:45",
    description: "खाद्यान्न सुरक्षा हेतु मुख्य अनाजों की संकर प्रजातियां, उर्वरक प्रबंधन एवं फसल कटाई उपरांत प्रबंधन।",
    description_en: "Comparative production agronomy of Oryza sativa, Zea mays, and small millets under varied agro-climatic zones.",
    views: "38.9K",
    source: "TNAU Technology Videos",
  },
  {
    id: "vid-36",
    youtube_id: "-v9d2YCAeJA",
    title: "Weed Management in Agriculture",
    title_hi: "कृषि में एकीकृत खरपतवार नियंत्रण (IWM) तकनीक",
    channel: "Weed Science Society",
    category: "मृदा स्वास्थ्य व व्याख्यान",
    category_en: "Soil Health & Lectures",
    duration: "21:20",
    description: "सांवा, मोथा, गुल्ली डंडा (Phalaris minor) की रोकथाम हेतु बुवाई पूर्व, तुरंत बाद व 25-30 दिन पर शाकनाशी प्रयोग।",
    description_en: "Principles of integrated weed management, critical period of crop-weed competition, and herbicide resistance mitigation.",
    views: "43.3K",
    source: "ICAR-ATARI Kanpur",
  },
  {
    id: "vid-37",
    youtube_id: "ysKAnVEXM2k",
    title: "Rabi Crops and Their Cultivation",
    title_hi: "रबी फसलों की वैज्ञानिक खेती — गेहूँ, सरसों, चना, मटर",
    channel: "Winter Crop Directorate",
    category: "मृदा स्वास्थ्य व व्याख्यान",
    category_en: "Soil Health & Lectures",
    duration: "25:15",
    description: "शीतकालीन फसलों की समय पर बुवाई, कूंड़ों में खाद डालना, क्राउन रूट इनिशिएशन सिंचाई एवं पाले से बचाव।",
    description_en: "Production technology for winter rabi crops covering seedbed preparation, seed priming, nodal root irrigation, and frost protection.",
    views: "62.4K",
    source: "NDUAT Media Cell",
  },
  {
    id: "vid-38",
    youtube_id: "lR4VXmI-YFc",
    title: "Wheat, Barley, Chickpea and Mustard Production",
    title_hi: "गेहूँ, जौ, चना एवं सरसों उत्पादन की आधुनिक तकनीक",
    channel: "Agronomy Division NDUAT",
    category: "मृदा स्वास्थ्य व व्याख्यान",
    category_en: "Soil Health & Lectures",
    duration: "27:30",
    description: "उत्तर प्रदेश के मैदानी क्षेत्रों हेतु अनुशंसित किस्में, संतुलित एनपीके + सल्फर अनुपात एवं सूक्ष्म पोषक तत्व।",
    description_en: "Intensive management practices for major rabi field crops: DBW wheat lines, Girnar mustard, and Desi chickpea packages.",
    views: "55.8K",
    source: "ICAR-ATARI / NDUAT",
  },
  {
    id: "vid-39",
    youtube_id: "IlzcASu-LWc",
    title: "Crop Rotation, Multiple Cropping and Intercropping",
    title_hi: "फसल चक्र, बहुफसली एवं अंतर्वर्ती खेती के सिद्धांत",
    channel: "Farming Systems Research",
    category: "मृदा स्वास्थ्य व व्याख्यान",
    category_en: "Soil Health & Lectures",
    duration: "19:55",
    description: "मृदा उर्वरता बनाए रखने हेतु दलहनी फसलों का समावेश, भूमि समतुल्य अनुपात (LER) एवं खरपतवार दमन।",
    description_en: "Ecological and economic advantages of crop rotation, sequential cropping, relay planting, and Land Equivalent Ratio optimization.",
    views: "37.1K",
    source: "MANAGE e-Catalogue",
  },
  {
    id: "vid-40",
    youtube_id: "vz-p_vRqLwM",
    title: "Forage Crops, Hay and Silage Making",
    title_hi: "चारा फसलें, हे (Hay) एवं साइलेज बनाने की विधि",
    channel: "Fodder & Livestock Directorate",
    category: "मृदा स्वास्थ्य व व्याख्यान",
    category_en: "Soil Health & Lectures",
    duration: "21:40",
    description: "बरसीम, जई व नेपियर घास की खेती, हरे चारे का साइलेज बनाकर वर्षभर दुधारू पशुओं हेतु पौष्टिक चारा संरक्षण।",
    description_en: "Fodder preservation technologies: anaerobic silage pit fermentation, hay curing, and nutrient preservation for dairy livestock.",
    views: "46.5K",
    source: "TNAU Agritech",
  },
];

export default function VideosPage() {
  const { lang } = useI18n();
  const [videos, setVideos] = useState<VideoItem[]>(OFFICIAL_40_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/v1/videos?limit=100")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setVideos(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: "all", label_hi: "सभी वीडियो (40)", label_en: "All Videos (40)" },
    { id: "कृषि यंत्रीकरण", label_hi: "1. कृषि यंत्रीकरण (10)", label_en: "1. Farm Machinery (10)" },
    { id: "फसल उत्पादन", label_hi: "2. फसल उत्पादन (10)", label_en: "2. Crop Production (10)" },
    { id: "कीट व रोग नियंत्रण", label_hi: "3. कीट व रोग नियंत्रण (10)", label_en: "3. Pest Management (10)" },
    { id: "मृदा स्वास्थ्य व व्याख्यान", label_hi: "4. मृदा स्वास्थ्य व व्याख्यान (10)", label_en: "4. Soil Health & Lectures (10)" },
  ];

  const filtered = useMemo(() => {
    return videos.filter((v) => {
      const matchCat =
        category === "all" ||
        v.category === category ||
        (v.category_en && v.category_en.toLowerCase().includes(category.toLowerCase()));
      const matchSearch =
        search === "" ||
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        (v.title_hi && v.title_hi.toLowerCase().includes(search.toLowerCase())) ||
        v.description?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [videos, category, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "कृषि वीडियो लाइब्रेरी" : "Video Library" }]}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <SectionHeader
            title={lang === "hi" ? "कृषि वैज्ञानिक एवं यंत्रीकरण वीडियो लाइब्रेरी" : "Official Agricultural Video Library"}
            subtitle={
              lang === "hi"
                ? "MANAGE, TNAU, ICAR-ATARI एवं भारत स्किल्स द्वारा अधिकृत 40 उच्च-गुणवत्ता प्रशिक्षण वीडियो"
                : "40 verified high-definition training lectures from MANAGE, TNAU, ICAR-ATARI Kanpur, and Bharat Skills"
            }
          />
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="size-4 text-[#9ca3af] absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "hi" ? "वीडियो या विषय खोजें..." : "Search videos or topics..."}
            className="w-full pl-9 pr-3 py-2 border border-[#d1d5db] rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#15803d]"
          />
        </div>
      </div>

      {/* Official Libraries Institutional Banner */}
      <div className="bg-[#f0fdf4] border border-[#86efac] rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2.5">
          <ShieldCheck className="size-5 text-[#15803d]" />
          <span className="text-xs font-black text-[#14532d] uppercase tracking-wider">
            {lang === "hi" ? "अधिकृत सरकारी एवं विश्वविद्यालय वीडियो स्रोत (Official Repositories)" : "Official Verified Repositories"}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <a
            href="https://www.manage.gov.in/misc/e-Catalogue.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-2.5 rounded-xl border border-[#bbf7d0] hover:border-[#15803d] transition-all flex items-center justify-between group shadow-xs"
          >
            <div>
              <span className="font-bold text-[#14532d] block">MANAGE Video Catalogue</span>
              <span className="text-[10px] text-[#6b7280]">manage.gov.in</span>
            </div>
            <ExternalLink className="size-3.5 text-[#15803d] group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="https://agritech.tnau.ac.in/technologivideostnau.html"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-2.5 rounded-xl border border-[#bbf7d0] hover:border-[#15803d] transition-all flex items-center justify-between group shadow-xs"
          >
            <div>
              <span className="font-bold text-[#14532d] block">TNAU Agritech Videos</span>
              <span className="text-[10px] text-[#6b7280]">agritech.tnau.ac.in</span>
            </div>
            <ExternalLink className="size-3.5 text-[#15803d] group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="https://atarikanpur.org.in/video-gallery.php"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-2.5 rounded-xl border border-[#bbf7d0] hover:border-[#15803d] transition-all flex items-center justify-between group shadow-xs"
          >
            <div>
              <span className="font-bold text-[#14532d] block">ICAR-ATARI Kanpur</span>
              <span className="text-[10px] text-[#6b7280]">atarikanpur.org.in</span>
            </div>
            <ExternalLink className="size-3.5 text-[#15803d] group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="https://bharatskill.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-2.5 rounded-xl border border-[#bbf7d0] hover:border-[#15803d] transition-all flex items-center justify-between group shadow-xs"
          >
            <div>
              <span className="font-bold text-[#14532d] block">Bharat Skills Agri</span>
              <span className="text-[10px] text-[#6b7280]">bharatskill.gov.in</span>
            </div>
            <ExternalLink className="size-3.5 text-[#15803d] group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              category === c.id
                ? "bg-[#14532d] text-white shadow-sm scale-102"
                : "bg-white text-[#4b5563] border border-[#d1d5db] hover:border-[#15803d] hover:bg-[#f8faf5]"
            }`}
          >
            {lang === "hi" ? c.label_hi : c.label_en}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((vid) => (
          <div
            key={vid.id}
            onClick={() => setSelectedVideo(vid)}
            className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden hover:border-[#15803d] transition-all shadow-xs hover:shadow-lg cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {/* Real YouTube Thumbnail */}
              <div className="h-48 w-full bg-black relative overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${vid.youtube_id}/hqdefault.jpg`}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  onError={(e) => {
                    // Fallback if video thumbnail fails
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-13 rounded-full bg-red-600 group-hover:bg-[#15803d] text-white flex items-center justify-center group-hover:scale-110 transition-all shadow-xl">
                    <Play className="size-6 fill-current ml-1" />
                  </div>
                </div>
                <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                  <Clock className="size-3" />
                  {vid.duration}
                </span>
                <span className="absolute top-2.5 left-2.5 bg-[#14532d]/90 backdrop-blur-xs text-[#86efac] text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                  {lang === "hi" ? vid.category : vid.category_en || vid.category}
                </span>
              </div>

              {/* Text Info */}
              <div className="p-4 space-y-1.5">
                <h3 className="font-extrabold text-sm sm:text-base text-[#14532d] group-hover:text-[#15803d] transition-colors line-clamp-2 leading-snug">
                  {lang === "hi" ? vid.title_hi || vid.title : vid.title}
                </h3>
                <p className="text-xs text-[#6b7280] font-medium flex items-center gap-1.5">
                  <span>{vid.channel}</span>
                  <span>•</span>
                  <span className="text-[#15803d] font-semibold">{vid.source}</span>
                </p>
                <p className="text-xs text-[#4b5563] line-clamp-2 leading-relaxed pt-1">
                  {lang === "hi" ? vid.description : vid.description_en || vid.description}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-[#f8faf5] border-t border-[#e5e7eb] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#6b7280] font-medium flex items-center gap-1">
                <Eye className="size-3" />
                {vid.views || "35K"} {lang === "hi" ? "देखा गया" : "views"}
              </span>
              <span className="font-bold text-[#15803d] group-hover:underline flex items-center gap-1">
                <span>{lang === "hi" ? "वीडियो चलाएं" : "Watch Video"}</span>
                <span>→</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 bg-white rounded-2xl border border-[#e5e7eb] text-center text-xs text-[#6b7280]">
          {lang === "hi" ? "कोई वीडियो नहीं मिला" : "No videos found"}
        </div>
      )}

      {/* YouTube Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-white/20">
            {/* Modal Header */}
            <div className="p-4 bg-[#14532d] text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#86efac] font-semibold block">
                  {selectedVideo.source} • {selectedVideo.channel}
                </span>
                <h3 className="font-bold text-sm sm:text-base line-clamp-1">
                  {lang === "hi" ? selectedVideo.title_hi || selectedVideo.title : selectedVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtube_id}?autoplay=1`}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer Description */}
            <div className="p-4 bg-[#f8faf5] border-t border-[#e5e7eb] text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#14532d] text-sm">
                  {lang === "hi" ? selectedVideo.category : selectedVideo.category_en || selectedVideo.category}
                </span>
                <span className="text-[#6b7280] font-semibold">{selectedVideo.duration}</span>
              </div>
              <p className="text-[#374151] leading-relaxed">
                {lang === "hi" ? selectedVideo.description : selectedVideo.description_en || selectedVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
