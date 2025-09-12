import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Button>
        <Link href="/app/dashboard">Iniciar</Link>
      </Button>
    </div>
  );
}
