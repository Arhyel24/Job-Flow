export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  date: string;
  uri: string;
  category: string;
}

export interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
}

export type WizardStep =
  | "resume"
  | "job-description"
  | "analysis"
  | "cover-letter"
  | "confirmation";

import { FileUp, FileText, FileImage, LayoutGrid } from "lucide-react-native";

export const DOCUMENT_TYPES = [
  {
    id: "resume",
    title: "Resume",
    description: "PDF resume for this application",
    icon: FileUp,
  },
  {
    id: "cover-letter",
    title: "Cover Letter",
    description: "Tailored cover letter",
    icon: FileText,
  },
  {
    id: "job-description",
    title: "Job Description",
    description: "Job posting details",
    icon: FileImage,
  },
  {
    id: "analysis",
    title: "Match Analysis",
    description: "Resume match results",
    icon: LayoutGrid,
  },
];

export const MOCK_DOCUMENTS = [
  {
    id: "1",
    name: "John_Doe_Resume.pdf",
    type: "application/pdf",
    size: 245678,
    uri: "file://resume.pdf",
    date: "2023-05-15",
  },
  {
    id: "2",
    name: "Cover_Letter_Amazon.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 187654,
    uri: "file://cover_letter.docx",
    date: "2023-05-16",
  },
  {
    id: "3",
    name: "Amazon_Job_Posting.pdf",
    type: "application/pdf",
    size: 345678,
    uri: "file://job_posting.pdf",
    date: "2023-05-14",
  },
];
