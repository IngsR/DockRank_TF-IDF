"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Document {
  id: string;
  title: string;
  content: string;
}

interface SearchResult {
  document: Document;
  highlightedContent: string;
  relevance: number; // Raw TF-IDF score
  relevancePercentage: number; // Relevance as a percentage
}

// --- TF-IDF Implementation ---

// Tokenize text into words
const tokenize = (text: string): string[] => {
  // Simple tokenization: lower case, split by non-alphanumeric, filter empty
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
};

// Calculate Term Frequency (TF)
const calculateTF = (term: string, tokens: string[]): number => {
  const termCount = tokens.filter(token => token === term).length;
  return termCount / (tokens.length || 1); // Avoid division by zero
};

// Calculate Inverse Document Frequency (IDF) - Pre-calculated for efficiency
const calculateIDF = (term: string, documents: { id: string; tokens: string[] }[]): number => {
  const docsContainingTerm = documents.filter(doc => doc.tokens.includes(term)).length;
  // Add 1 to the denominator (Laplace smoothing) to avoid division by zero if term is not in corpus
  // Add 1 to the result to avoid log(1) = 0 for terms present in all docs
  return Math.log((documents.length + 1) / (docsContainingTerm + 1)) + 1; // Adjusted smoothing
};

// Calculate TF-IDF score for a term in a document
const calculateTFIDF = (term: string, docTokens: string[], allDocsTokens: { id: string; tokens: string[] }[], idfCache: { [term: string]: number }): number => {
    const tf = calculateTF(term, docTokens);
    const idf = idfCache[term] || Math.log((allDocsTokens.length + 1) / 1) + 1; // Use cache or default IDF for unseen terms
    return tf * idf;
};

// --- End TF-IDF Implementation ---


const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// --- Highlight Simulation ---
const simulateHighlight = (documentContent: string, documentTitle: string, query: string): string => {
  const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean); // Tokenize query
  let highlightedText = documentContent.replace(/\n/g, '<br />'); // Preserve line breaks

  queryWords.forEach(word => {
    if (word.length < 1) return; // Skip very short words if desired, or adjust length
    const escapedWord = escapeRegExp(word);
    const regex = new RegExp(`\\b(${escapedWord})\\b`, 'gi'); // Use word boundary \b, case-insensitive
    highlightedText = highlightedText.replace(regex, (match) => `<mark>${match}</mark>`);
  });

  // Prepend the title, bolded and larger
  const titleHtml = `<strong class="text-lg block mb-2">Judul: ${documentTitle}</strong>`;
  highlightedText = titleHtml + highlightedText;


  return highlightedText;
};
// --- End Highlight Simulation ---


export default function Search() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pre-process documents only once or when documents change
  const processedDocuments = useMemo(() => {
    return documents.map(doc => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      tokens: tokenize(`${doc.title} ${doc.content}`) // Combine title and content for TF-IDF
    }));
  }, [documents]);

  // Pre-calculate IDF for all terms in the corpus
  const idfCache = useMemo(() => {
    const cache: { [term: string]: number } = {};
    if (processedDocuments.length === 0) return cache;

    const allCorpusTokens = new Set(processedDocuments.flatMap(doc => doc.tokens));
    for (const term of allCorpusTokens) {
      cache[term] = calculateIDF(term, processedDocuments);
    }
    return cache;
  }, [processedDocuments]);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedDocuments = localStorage.getItem('documents');
        setDocuments(storedDocuments ? JSON.parse(storedDocuments) : []);
      } catch (error) {
        console.error("Gagal memuat dokumen dari localStorage:", error);
        setDocuments([]); // Fallback ke array kosong jika terjadi error
      }
    }
  }, []);

  const debouncedSetQuery = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const handleSearch = useCallback(() => {
    setSearching(true);
    setNoResults(false);
    setResults([]); // Clear previous results

    if (!query || processedDocuments.length === 0) {
      setSearching(false);
      setNoResults(true);
      return;
    }

    const queryTokens = tokenize(query);

    const rawResults = processedDocuments
      .map(doc => {
        let relevanceScore = 0;

        // Calculate relevance based on sum of TF-IDF scores of query terms in the document
        for (const term of queryTokens) {
          if (doc.tokens.includes(term)) {
             relevanceScore += calculateTFIDF(term, doc.tokens, processedDocuments, idfCache);
          }
        }


        if (relevanceScore > 0) { // Only include results with some relevance
          const originalDoc = documents.find(d => d.id === doc.id)!; // Find original doc for highlighting
          const highlightedContent = simulateHighlight(originalDoc.content, originalDoc.title, query);
          return { document: originalDoc, highlightedContent, relevance: relevanceScore, relevancePercentage: 0 }; // Initialize percentage
        }
        return null;
      })
      .filter(result => result !== null) // Filter out null results
      .sort((a, b) => b!.relevance - a!.relevance) as SearchResult[]; // Sort by raw relevance first

    // Normalize relevance scores to percentage
    const maxRelevance = rawResults.length > 0 ? Math.max(...rawResults.map(r => r.relevance)) : 0;

    const finalResults = rawResults.map(result => ({
      ...result,
      relevancePercentage: maxRelevance > 0 ? (result.relevance / maxRelevance) * 100 : 0,
    }));


    setResults(finalResults);
    setSearching(false);
    setNoResults(finalResults.length === 0);
  }, [query, documents, processedDocuments, idfCache]); // Add dependencies

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <div className="container mx-auto fade-in px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6 text-center text-secondary">Pencarian Dokumen</h1>

      <section className="mb-8">
        <div className="flex items-center space-x-4 max-w-2xl mx-auto">
          <Input
            type="text"
            placeholder="Masukkan kata kunci..."
            value={query}
            onChange={(e) => debouncedSetQuery(e.target.value)}
            className="flex-grow shadow-sm rounded-md border-border" // Added border explicitly
            onKeyDown={handleKeyDown}
            ref={inputRef}
            aria-label="Kata kunci pencarian"
          />
          <Button
            onClick={handleSearch}
            className="px-6 py-3 shadow-md hover:shadow-lg transition-shadow rounded-md" // Reverted to original button style
            disabled={searching}
            aria-live="polite"
          >
            {searching ? 'Mencari...' : 'Cari'}
          </Button>
        </div>
      </section>

      <section className="fade-in">
         <h2 className="text-center text-2xl font-semibold mb-6">Hasil Pencarian</h2>
        <div className="mt-4 space-y-6">
          {searching && <div className="text-center text-muted-foreground">Mencari...</div>}
          {results.length > 0 ? (
            results.map(({ document, highlightedContent, relevancePercentage }, index) => (
              <div key={document.id} className="bg-card p-6 rounded-lg border border-border shadow-md hover:shadow-lg transition-shadow relative">
                 <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold">
                   Relevansi: {relevancePercentage.toFixed(2)}% {/* Displaying percentage score */}
                 </div>
                <div className="mt-4 text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: highlightedContent }} />
              </div>
            ))
          ) : (
            !searching && noResults && (
               <div className="flex items-center justify-center h-40">
                  <p className="text-3xl font-bold text-muted-foreground subtle-pulse">Tidak ada hasil ditemukan.</p>
               </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
