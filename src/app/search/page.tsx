'use client';

import {useState, useCallback, useRef, useEffect} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {v4 as uuidv4} from 'uuid';

interface Document {
  id: string;
  title: string;
  content: string;
}

const Search = () => {
  const [documents, setDocuments] = useState<Document[]>(() => {
    if (typeof window !== 'undefined') {
      const storedDocuments = localStorage.getItem('documents');
      return storedDocuments ? JSON.parse(storedDocuments) : [];
    }
    return [];
  });
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [results, setResults] = useState<
    {
      document: Document;
      highlightedContent: string;
      relevance: number;
    }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSetQuery = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const calculateCosineSimilarity = (query: string, document: Document): number => {
    if (!query || !document) {
      return 0;
    }

    const documentText = `${document.title} ${document.content}`;

    const queryTerms = query.toLowerCase().split(/\s+/);
    const documentTerms = documentText.toLowerCase().split(/\s+/);

    const allTerms = [...new Set([...queryTerms, ...documentTerms])];

    const queryVector = allTerms.map(term => queryTerms.filter(qTerm => qTerm === term).length);
    const documentVector = allTerms.map(term => documentTerms.filter(dTerm => dTerm === term).length);

    let dotProduct = 0;
    let queryMagnitude = 0;
    let documentMagnitude = 0;

    for (let i = 0; i < allTerms.length; i++) {
      dotProduct += queryVector[i] * documentVector[i];
      queryMagnitude += queryVector[i] ** 2;
      documentMagnitude += documentVector[i] ** 2;
    }

    queryMagnitude = Math.sqrt(queryMagnitude);
    documentMagnitude = Math.sqrt(documentMagnitude);

    if (queryMagnitude === 0 || documentMagnitude === 0) {
      return 0;
    }

    const cosineSimilarity = dotProduct / (queryMagnitude * documentMagnitude);
    return cosineSimilarity;
  };

  const simulateHighlight = (documentContent: string, documentTitle: string, query: string): string => {
    const queryWords = query.toLowerCase().split(" ");
    let highlighted = documentContent;

    queryWords.forEach(word => {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedWord, 'gi');
      highlighted = highlighted.replace(regex, match => `<mark style="background-color: #ffff00;">${match}</mark>`);
    });

    highlighted = highlighted.replace(/\n/g, '<br /><br />');
    return highlighted;
  };

  const handleSearch = useCallback(() => {
    setSearching(true);
    setNoResults(false);

    if (!query) {
      setResults([]);
      setSearching(false);
      setNoResults(true);
      return;
    }

    const searchResults = documents
      .map(doc => {
        const relevance = calculateCosineSimilarity(query, doc);
        if (relevance > 0) {
          const highlightedContent = simulateHighlight(doc.content, doc.title, query);
          return { document: doc, highlightedContent, relevance };
        }
        return null;
      })
      .filter(result => result !== null)
      .sort((a, b) => b!.relevance - a!.relevance)
       .map(result => ({
         ...result,
         relevance: parseFloat((result!.relevance * 100).toFixed(2))
       })) as { document: Document; highlightedContent: string; relevance: number; }[];
+
    setResults(searchResults);
    setSearching(false);
    setNoResults(searchResults.length === 0);
  }, [query, documents]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <>
      <div className="container mx-auto fade-in">
        <h1 className="text-3xl font-semibold mb-6 text-center text-secondary subtle-pulse">Pencarian Dokumen</h1>

        <section className="mb-8">
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Masukkan kata kunci"
              value={query}
              onChange={(e) => debouncedSetQuery(e.target.value)}
              className="flex-grow shadow-sm"
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
            <Button onClick={handleSearch} className="px-6 py-3 hover:bg-accent-foreground hover:text-accent transition-colors shadow-md">Cari</Button>
          </div>
        </section>
      </div>

      <section className="fade-in mt-8">
        <h2 className="text-center text-xl font-semibold mb-4">Hasil Pencarian</h2>
        <div className="mt-4">
          {searching && <div className="text-center text-muted-foreground">Mencari...</div>}
          {results.length > 0 ? (
            results.map(({ document, highlightedContent, relevance }, index) => (
              <div key={index} className="mb-6 pb-4 pt-4 px-8 border-b border-border">
                <div className="mt-2">
                  <div className="text-xl font-bold mb-2">Judul : {document.title}</div>
                  <div className="flex justify-between items-center">
                    <span dangerouslySetInnerHTML={{ __html: highlightedContent }} />
                    <span className="text-blue-500 font-bold">Relevansi: {relevance}%</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              {searching ? null : (
                noResults ? (
                  <p className="text-5xl font-extrabold text-muted-foreground subtle-pulse">Tidak ada hasil ditemukan.</p>
                ) : null
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Search;
