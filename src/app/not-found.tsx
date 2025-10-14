import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <span className=" text-xl font-bold animate-bounce">404</span>
      <h1 className="text-5xl text-primary font-bold">Página não encontrada</h1>
      <p>Desculpe, não conseguimos encontrar a página que você procura.</p>

      <Button>
        <Link href="/">Voltar para o início</Link>
      </Button>
    </div>
  );
}
