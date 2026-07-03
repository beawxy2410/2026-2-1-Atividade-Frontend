"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookMarked, LogOut, Quote as Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { getUser, logout } from "@/lib/auth";
import type { AuthUser, Quote } from "@/lib/types";
import {
    addLocalQuote,
    deleteLocalQuote,
    mergeWithLocalChanges,
    updateLocalQuote,
} from "@/lib/quotes-store";
import { QuoteFormDialog } from "@/components/ui/quote-form-dialog";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
    const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);

    useEffect(() => {
        const currentUser = getUser();
        if (!currentUser) {
            router.replace("/auth");
            return;
        }
        setUser(currentUser);
        loadQuotes();
    }, [router]);

    async function loadQuotes() {
        setIsLoading(true);
        try {
            const response = await fetch("https://dummyjson.com/quotes?limit=20");
            if (!response.ok) throw new Error("Falha ao buscar frases");
            const data: { quotes: Quote[] } = await response.json();
            setQuotes(mergeWithLocalChanges(data.quotes));
        } catch (error) {
            toast.error("Não foi possível carregar as frases.");
        } finally {
            setIsLoading(false);
        }
    }

    function handleLogout() {
        logout();
        router.push("/");
    }

    function handleCreate() {
        setEditingQuote(null);
        setDialogOpen(true);
    }

    function handleEdit(quote: Quote) {
        setEditingQuote(quote);
        setDialogOpen(true);
    }

    function handleSave(data: { id?: number; quote: string; author: string }) {
        if (data.id) {
            const updated: Quote = { id: data.id, quote: data.quote, author: data.author };
            updateLocalQuote(updated);
            setQuotes((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
        } else {
            const created = addLocalQuote({ quote: data.quote, author: data.author });
            setQuotes((prev) => [created, ...prev]);
        }
    }

    function confirmDelete() {
        if (!quoteToDelete) return;
        deleteLocalQuote(quoteToDelete.id);
        setQuotes((prev) => prev.filter((q) => q.id !== quoteToDelete.id));
        toast.success("Frase removida.");
        setQuoteToDelete(null);
    }

    if (!user) return null;

    return (
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-6">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={user.image} alt={user.firstName} />
                        <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold">Olá, {user.firstName}!</h1>
                        <p className="text-muted-foreground">Suas frases favoritas</p>
                    </div>
                </div>
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Sair
                </Button>
            </header>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <BookMarked className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold leading-none">{quotes.length}</p>
                            <p className="text-sm text-muted-foreground">Frases</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold leading-none">
                                {new Set(quotes.map((q) => q.author)).size} 
                            </p>
                            <p className="text-sm text-muted-foreground">Autores</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Separator />

            <div className="flex justify-end">
                <Button onClick={handleCreate}>Nova frase</Button>
            </div>

            {isLoading && <p className="text-muted-foreground">Carregando frases...</p>}

            <div className="flex flex-col gap-3">
                {quotes.map((q) => (
                    <Card key={q.id}>
                        <CardContent className="pt-6">
                            <p className="text-lg italic">&ldquo;{q.quote}&rdquo;</p>
                            <p className="mt-2 text-sm text-muted-foreground">— {q.author}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(q)}>
                                Editar
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setQuoteToDelete(q)}
                            >
                                Apagar
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <QuoteFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                initialQuote={editingQuote}
                onSave={handleSave}
            />

            <AlertDialog open={Boolean(quoteToDelete)} onOpenChange={(open) => !open && setQuoteToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apagar frase?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Essa ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Apagar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
}