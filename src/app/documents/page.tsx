"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  title: string;
  content: string;
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedDocuments = localStorage.getItem("documents");
    setDocuments(storedDocuments ? JSON.parse(storedDocuments) : []);
  }, []);

  const handleDeleteDocument = useCallback(
    (id: string) => {
      const updatedDocuments = documents.filter((doc) => doc.id !== id);
      localStorage.setItem("documents", JSON.stringify(updatedDocuments));
      setDocuments(updatedDocuments);

      toast({
        title: "Dokumen Dihapus",
        description: "Dokumen berhasil dihapus.",
      });
    },
    [documents, toast]
  );

  return (
    <div className="container mx-auto fade-in">
      <h1 className="text-3xl font-semibold mb-6 text-center text-secondary">
        My Documents
      </h1>

      <section>
        {documents.length > 0 ? (
          <ul className="space-y-4">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="fade-in hover:shadow-lg transition-shadow p-6 rounded-lg border-2 border-border bg-card shadow-md"
              >
                <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
                <p className="text-gray-700 leading-relaxed">{doc.content}</p>
                <div className="mt-4">
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="hover:bg-red-700 transition-colors"
                  >
                    Hapus
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">
            Tidak ada dokumen ditemukan.
          </p>
        )}
      </section>
    </div>
  );
}
