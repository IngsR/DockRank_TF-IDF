"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  title: string;
  content: string;
}

export default function AddDocument() {
  const [newDocumentTitle, setNewDocumentTitle] = useState("");
  const [newDocumentContent, setNewDocumentContent] = useState("");
  const { toast } = useToast();

  const handleDocumentUpload = useCallback(() => {
    if (newDocumentTitle && newDocumentContent) {
      const storedDocuments = localStorage.getItem('documents');
      const existingDocuments: Document[] = storedDocuments ? JSON.parse(storedDocuments) : [];

      let counter = 0;
      const newDocument: Document = {
        id: `${counter++}`,
        title: newDocumentTitle,
        content: newDocumentContent,};

      const updatedDocuments = [...existingDocuments, newDocument];

      localStorage.setItem('documents', JSON.stringify(updatedDocuments));

      setNewDocumentTitle("");
      setNewDocumentContent("");

      toast({
        title: "Dokumen Ditambahkan",
        description: "Dokumen berhasil ditambahkan.",
      });
    } else {
      toast({
        title: "Error",
        description: "Silakan isi semua kolom.",
        variant: "destructive",
      });
    }
  }, [newDocumentTitle, newDocumentContent, toast]);

  return (
    <div className="container mx-auto fade-in">
      <h1 className="text-3xl font-semibold mb-6 text-center text-secondary subtle-pulse">TAMBAH DOKUMEN BARU </h1>

      <section className="mb-6 p-4 rounded-lg shadow-md bg-card">
        <Input
          type="text"
          placeholder="Judul Dokumen"
          value={newDocumentTitle}
          onChange={(e) => setNewDocumentTitle(e.target.value)}
          className="mb-4 shadow-sm"
        />
        <Textarea
          placeholder="Isi Dokumen"
          value={newDocumentContent}
          onChange={(e) => setNewDocumentContent(e.target.value)}
          className="mb-4 shadow-sm"
          rows={6}
        />
        <Button onClick={handleDocumentUpload} className="w-full py-3 shadow-md hover:shadow-lg transition-shadow">
          Tambah Dokumen
        </Button>
      </section>
    </div>
  );
}
