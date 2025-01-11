import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { BlogCardSkeleton } from '@/components/blog/BlogCardSkeleton';

// Import all blog posts
const blogPosts = import.meta.glob('../content/blog/*.md', { eager: true });

interface SearchResult {
  type: 'blog' | 'guide' | 'faq';
  title: string;
  excerpt: string;
  url: string;
  category?: string;
  date?: string;
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [processedPosts, setProcessedPosts] = useState<Map<string, SearchResult>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Process blog posts once on mount
  useEffect(() => {
    const posts = new Map<string, SearchResult>();
    
    Object.entries(blogPosts).forEach(([path, content]: [string, any]) => {
      const frontmatter = content.default.split('---')[1];
      const parsedFrontmatter = frontmatter.split('\n').reduce((acc: any, line: string) => {
        const [key, ...value] = line.split(':');
        if (key && value.length) {
          acc[key.trim()] = value.join(':').trim().replace(/^["']|["']$/g, '');
        }
        return acc;
      }, {});

      const url = `/blog/${path.replace('../content/blog/', '').replace('.md', '')}`;
      posts.set(url, {
        type: 'blog' as const,
        title: parsedFrontmatter.title,
        excerpt: parsedFrontmatter.excerpt,
        url,
        category: parsedFrontmatter.category,
        date: parsedFrontmatter.date
      });
    });

    setProcessedPosts(posts);
  }, []);

  useEffect(() => {
    const searchContent = async () => {
      setIsLoading(true);
      try {
        // Filter processed posts based on search query
        const blogResults = Array.from(processedPosts.values()).filter(post => 
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(query.toLowerCase())
        );

        setResults(blogResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      searchContent();
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query]);

  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-6">Search Results</h1>
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
          <Input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-6">
            {results.map((result, index) => (
              <motion.div
                key={result.url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <a href={result.url} className="block hover:opacity-80 transition-opacity">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-xl font-semibold">{result.title}</h2>
                      <span className="text-sm text-[hsl(var(--gold))] px-2 py-1 bg-gradient-to-r from-[hsl(var(--gold))]/10 to-[hsl(var(--gold))]/5 rounded-full border border-[hsl(var(--gold))]/20">
                        {result.type}
                      </span>
                    </div>
                    <p className="text-white/80 mb-4">{result.excerpt}</p>
                    {result.category && (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <span>{result.category}</span>
                        {result.date && (
                          <>
                            <span>•</span>
                            <span>{new Date(result.date).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    )}
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : query ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-white/60">No results found for "{query}"</p>
            </div>
          </Card>
        ) : null}
      </motion.div>
    </div>
  );
}