import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { Document, AnalysisResult } from "../types/document";

interface DocumentContextType {
  documents: Document[];
  getDocumentById: (id: string) => Promise<Document | undefined>;
  deleteDocument: (id: string) => Promise<void>;
  addDocument: (doc: Document) => void;
  removeDocument: (id: string) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  resume: Document | null;
  setResume: (doc: Document | null) => void;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  jobDescriptionFile: Document | null;
  setJobDescriptionFile: (doc: Document | null) => void;
  analysis: AnalysisResult | null;
  setAnalysis: (result: AnalysisResult | null) => void;
  coverLetter: string;
  setCoverLetter: (text: string) => void;
  coverLetterFile: Document | null;
  setCoverLetterFile: (doc: Document | null) => void;
}

const STORAGE_KEYS = {
  DOCUMENTS: "documents",
  RESUME: "resume",
  COVER_LETTER: "coverLetter",
  COVER_LETTER_FILE: "coverLetterFile",
  JOB_DESCRIPTION: "jobDescription",
  JOB_DESCRIPTION_FILE: "jobDescriptionFile",
  ANALYSIS: "analysis",
};

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined
);

export const DocumentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [resume, setResume] = useState<Document | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobDescriptionFile, setJobDescriptionFile] = useState<Document | null>(
    null
  );
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [coverLetterFile, setCoverLetterFile] = useState<Document | null>(null);

  const persist = async (key: string, value: any, successMessage?: string) => {
    try {
      if (value === null || value === undefined) {
        await AsyncStorage.removeItem(key);
      } else if (typeof value === "string") {
        await AsyncStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      }

      if (successMessage) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: successMessage,
        });
      }
    } catch (e) {
      console.error(`Failed to persist ${key}`, e);
      Toast.show({
        type: "error",
        text1: "Storage Error",
        text2: `Failed to save ${key}.`,
      });
    }
  };

  const getDocumentById = async (id: string): Promise<Document | undefined> => {
    try {
      return documents.find((doc) => doc.id === id);
    } catch (error) {
      console.error(`Failed to get document with ID ${id}`, error);
      return undefined;
    }
  };

  const deleteDocument = async (id: string): Promise<void> => {
    try {
      const updated = documents.filter((doc) => doc.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updated));
    } catch (error) {
      console.error(`Failed to delete document with ID ${id}`, error);
      Toast.show({
        type: "error",
        text1: "Storage Error",
        text2: `Failed to delete ${id}.`,
      });
    }
  };

  const addDocument = (doc: Document) => {
    setDocuments((prev) => {
      const updated = [...prev, doc];
      persist(STORAGE_KEYS.DOCUMENTS, updated, `${doc.name} added.`);
      return updated;
    });
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => {
      const removed = prev.find((d) => d.id === id);
      const updated = prev.filter((doc) => doc.id !== id);
      persist(
        STORAGE_KEYS.DOCUMENTS,
        updated,
        `${removed?.name ?? "Document"} removed.`
      );
      return updated;
    });
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments((prev) => {
      const updated = prev.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      );
      persist(STORAGE_KEYS.DOCUMENTS, updated, `Document updated.`);
      return updated;
    });
  };

  const handleSetResume = (doc: Document | null) => {
    setResume(doc);
    persist(STORAGE_KEYS.RESUME, doc, doc ? "Resume saved." : undefined);
  };

  const handleSetCoverLetter = (text: string) => {
    setCoverLetter(text);
    persist(STORAGE_KEYS.COVER_LETTER, text, "Cover letter saved.");
  };

  const handleSetCoverLetterFile = (doc: Document | null) => {
    setCoverLetterFile(doc);
    persist(
      STORAGE_KEYS.COVER_LETTER_FILE,
      doc,
      doc ? "Cover letter file saved." : undefined
    );
  };

  const handleSetJobDescription = (text: string) => {
    setJobDescription(text);
    persist(STORAGE_KEYS.JOB_DESCRIPTION, text, "Job description saved.");
  };

  const handleSetJobDescriptionFile = (doc: Document | null) => {
    setJobDescriptionFile(doc);
    persist(
      STORAGE_KEYS.JOB_DESCRIPTION_FILE,
      doc,
      doc ? "Job description file saved." : undefined
    );
  };

  const handleSetAnalysis = (result: AnalysisResult | null) => {
    setAnalysis(result);
    persist(
      STORAGE_KEYS.ANALYSIS,
      result,
      result ? "Resume analysed successfully." : undefined
    );
  };

  const loadFromStorage = async () => {
    try {
      const storedDocuments = await AsyncStorage.getItem(
        STORAGE_KEYS.DOCUMENTS
      );
      const storedResume = await AsyncStorage.getItem(STORAGE_KEYS.RESUME);
      const storedCoverLetter = await AsyncStorage.getItem(
        STORAGE_KEYS.COVER_LETTER
      );
      const storedCoverLetterFile = await AsyncStorage.getItem(
        STORAGE_KEYS.COVER_LETTER_FILE
      );
      const storedJobDescription = await AsyncStorage.getItem(
        STORAGE_KEYS.JOB_DESCRIPTION
      );
      const storedJobDescriptionFile = await AsyncStorage.getItem(
        STORAGE_KEYS.JOB_DESCRIPTION_FILE
      );
      const storedAnalysis = await AsyncStorage.getItem(STORAGE_KEYS.ANALYSIS);

      if (storedDocuments) setDocuments(JSON.parse(storedDocuments));
      if (storedResume) setResume(JSON.parse(storedResume));
      if (storedCoverLetter) setCoverLetter(storedCoverLetter);
      if (storedCoverLetterFile)
        setCoverLetterFile(JSON.parse(storedCoverLetterFile));
      if (storedJobDescription) setJobDescription(storedJobDescription);
      if (storedJobDescriptionFile)
        setJobDescriptionFile(JSON.parse(storedJobDescriptionFile));
      if (storedAnalysis) setAnalysis(JSON.parse(storedAnalysis));
    } catch (e) {
      console.error("Failed to load from storage", e);
    }
  };

  useEffect(() => {
    loadFromStorage();
  }, []);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        getDocumentById,
        deleteDocument,
        addDocument,
        removeDocument,
        updateDocument,
        resume,
        setResume: handleSetResume,
        jobDescription,
        setJobDescription: handleSetJobDescription,
        jobDescriptionFile,
        setJobDescriptionFile: handleSetJobDescriptionFile,
        analysis,
        setAnalysis: handleSetAnalysis,
        coverLetter,
        setCoverLetter: handleSetCoverLetter,
        coverLetterFile,
        setCoverLetterFile: handleSetCoverLetterFile,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
};
