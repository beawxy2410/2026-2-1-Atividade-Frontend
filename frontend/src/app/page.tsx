import Link from "next/link";
import { MoonStar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-background to-muted p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Badge variant="secondary" className="gap-1 px-3 py-1 text-sm">
          <MoonStar className="h-3.5 w-3.5" />
          Atividade - POS
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Juliana Beatriz de Lima Araújo
        </h1>
        <p className="text-lg text-muted-foreground">
          Técnico em Informática para Internet · DIATINF · CNAT-IFRN
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Aplicação desenvolvida com Next.js, TypeScript, Tailwind CSS e
            shadcn/ui, consumindo a API pública dummyjson para autenticação
            e citações.
          </p>
          <Button  size="lg" className="w-full gap-2">
            <Link href="/auth">
              Entrar
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}