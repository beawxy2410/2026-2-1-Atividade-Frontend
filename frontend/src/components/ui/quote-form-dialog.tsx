"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Quote } from "@/lib/types";
import { getKnownAuthors } from "@/lib/quotes-store";

interface QuoteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialQuote?: Quote | null;
  onSave: (data: { id?: number; quote: string; author: string }) => void;
}

export function QuoteFormDialog({
  open,
  onOpenChange,
  initialQuote,
  onSave,
}: QuoteFormDialogProps) {
  const [quoteText, setQuoteText] = useState("");
  const [author, setAuthor] = useState("");
  const [errors, setErrors] = useState<{ quote?: string; author?: string }>({});
  const knownAuthors = getKnownAuthors();

  useEffect(() => {
    if (open) {
      setQuoteText(initialQuote?.quote ?? "");
      setAuthor(initialQuote?.author ?? "");
      setErrors({});
    }
  }, [open, initialQuote]);

  function validate(): boolean {
    const nextErrors: { quote?: string; author?: string } = {};
    if (!quoteText.trim() || quoteText.trim().length < 5) {
      nextErrors.quote = "A frase deve ter pelo menos 5 caracteres.";
    }
    if (!author.trim() || author.trim().length < 2) {
      nextErrors.author = "Informe o autor da frase.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    onSave({
      id: initialQuote?.id,
      quote: quoteText.trim(),
      author: author.trim(),
    });
    toast.success(initialQuote ? "Frase atualizada!" : "Frase criada!");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>{initialQuote ? "Editar frase" : "Nova frase"}</DialogTitle>
            <DialogDescription>
              Preencha a frase e o autor. Os dados são salvos localmente no navegador.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="quote">Frase</Label>
              <Input
                id="quote"
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                aria-invalid={Boolean(errors.quote)}
              />
              {errors.quote && (
                <p className="text-sm text-destructive">{errors.quote}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="author">Autor</Label>
              <Input
                id="author"
                list="known-authors"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                aria-invalid={Boolean(errors.author)}
              />
              <datalist id="known-authors">
                {knownAuthors.map((a) => (
                  <option key={a} value={a} />
                ))}
              </datalist>
              {errors.author && (
                <p className="text-sm text-destructive">{errors.author}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}