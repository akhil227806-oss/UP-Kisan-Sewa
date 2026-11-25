
import rawPublications from "./research_publications.json";

export interface ResearchPublication {
  id: string;
  category: string;
  category_hi: string;
  title: string;
  title_hi: string;
  authors: string;
  journal: string;
  year: string;
  doi?: string;
  url: string;
  pdf_url?: string;
  abstract: string;
  abstract_hi?: string;
  image_url: string;
  image_caption: string;
}

export const RESEARCH_PUBLICATIONS: ResearchPublication[] = rawPublications as ResearchPublication[];
