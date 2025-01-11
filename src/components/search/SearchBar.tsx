import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 5;

const quickLinks = [
  { label: 'Visa Types', path: '/visa-types' },
  { label: 'Eligibility Check', path: '/eligibility-check' },
  { label: 'Scholarships', path: '/resources/scholarships' },
  { label: 'Document Checklist', path: '/resources/guides' }
];

export function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsExpanded(true);
      }
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    // Handle clicks outside search
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    // Add to recent searches
    const newRecentSearches = [
      query,
      ...recentSearches.filter(s => s !== query)
    ].slice(0, MAX_RECENT_SEARCHES);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newRecentSearches));

    // Navigate to search results
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setIsExpanded(false);
    setSearchQuery('');
  };

  return (
    <div ref={searchRef} className="relative">
      <button
        onClick={() => {
          setIsExpanded(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-white/60 hover:text-white transition-colors",
          "border border-white/10 rounded-lg",
          "hover:border-white/20 hover:bg-white/5",
          isExpanded && "hidden"
        )}
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:inline">Search</span>
        <kbd className="hidden md:inline px-1.5 py-0.5 text-xs bg-white/10 rounded">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-0 w-full md:w-[400px] z-50"
            >
              <div className="flex items-center gap-2 p-2 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg">
                <Search className="w-5 h-5 text-white/40" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchQuery);
                    }
                  }}
                  placeholder="Search..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/40"
                />
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-white/10 rounded-md transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              <div className="mt-2 p-2 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg">
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <h3 className="px-2 mb-2 text-sm font-medium text-white/60">Recent Searches</h3>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(search)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-white/80 hover:text-white hover:bg-white/5 rounded transition-colors"
                        >
                          <Clock className="w-4 h-4" />
                          <span>{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="px-2 mb-2 text-sm font-medium text-white/60">Quick Links</h3>
                  <div className="space-y-1">
                    {quickLinks.map((link, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          navigate(link.path);
                          setIsExpanded(false);
                        }}
                        className="w-full flex items-center justify-between px-2 py-1.5 text-white/80 hover:text-white hover:bg-white/5 rounded transition-colors"
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}