export const SUPPORTED_COUNTRIES = [
  'China',
  'India',
  'Nepal',
  'Vietnam',
  'Philippines'
] as const;

export type SupportedCountry = typeof SUPPORTED_COUNTRIES[number];

export const STUDY_LEVELS = ['undergraduate', 'postgraduate'] as const;

export const VISA_TYPES = {
  STUDENT: '500',
  GRADUATE: '485',
  SKILLED_INDEPENDENT: '189'
} as const;

export const ENGLISH_TESTS = {
  IELTS: 'IELTS',
  PTE: 'PTE Academic',
  TOEFL: 'TOEFL iBT',
  CAE: 'Cambridge C1 Advanced'
} as const;

export const MIN_SCORES = {
  IELTS: 6.0,
  PTE: 50,
  TOEFL: 60,
  CAE: 169
} as const;