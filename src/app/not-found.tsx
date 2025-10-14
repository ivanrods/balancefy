import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-6 mx-2">
      <span className=" text-xl font-bold animate-bounce">404</span>
      <h1 className="text-3xl md:text-5xl text-primary font-bold text-center">
        Página não encontrada
      </h1>
      <p className="text-sm md:text-md text-center">
        Desculpe, não conseguimos encontrar a página que você procura.
      </p>

      <Button>
        <Link href="/">Voltar para o início</Link>
      </Button>
    </div>
  );
}
