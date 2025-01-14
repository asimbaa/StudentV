export interface PersonalProfile {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  currentResidence: string;
}

export interface AcademicRecord {
  degree: string;
  institution: string;
  graduationYear: number;
  gpa: number;
  transcripts: string[];
}

export interface FinancialDocument {
  type: 'bankStatement' | 'sponsorshipLetter' | 'scholarshipProof';
  amount: number;
  currency: string;
  dateIssued: string;
  documentUrl: string;
}

export interface LanguageProficiency {
  test: 'IELTS' | 'TOEFL' | 'PTE';
  overallScore: number;
  speakingScore: number;
  listeningScore: number;
  readingScore: number;
  writingScore: number;
  dateOfTest: string;
}

export interface WorkExperience {
  employer: string;
  position: string;
  startDate: string;
  endDate?: string;
  responsibilities: string[];
  relevantSkills: string[];
}

export interface RiskFactor {
  category: 'financial' | 'academic' | 'documentation' | 'background';
  severity: 'low' | 'medium' | 'high';
  description: string;
  mitigation?: string;
}

export interface ImprovementSuggestion {
  category: string;
  priority: 'low' | 'medium' | 'high';
  suggestion: string;
  impact: string;
  timeframe: string;
}

export interface VisaPredictionResult {
  successProbability: number;
  riskFactors: RiskFactor[];
  improvements: ImprovementSuggestion[];
  customRoadmap: string[];
  confidence: number;
}

export interface VisaPredictorInput {
  personalProfile: PersonalProfile;
  academicRecords: AcademicRecord[];
  financialDocuments: FinancialDocument[];
  languageProficiency: LanguageProficiency;
  workExperience: WorkExperience[];
}
