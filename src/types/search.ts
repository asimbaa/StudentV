export interface SearchResult {
  type: 'blog' | 'guide' | 'faq';
  title: string;
  excerpt: string;
  url: string;
  category?: string;
  date?: string;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
}
