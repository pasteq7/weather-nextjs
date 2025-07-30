import Link from 'next/link';
import { Cloud, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Cloud className="h-5 w-5 text-muted-foreground" />
        <p className="text-sm font-semibold">Weather</p>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <p>
          Data by <Link href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Open-Meteo</Link>
        </p>
        <p>
          Made by <Link href="https://sylvainbrehaut.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">sB</Link>
        </p>
        <Link href="https://github.com/pasteq7/weather-nextjs" target="_blank" rel="noopener noreferrer" className="hover:text-primary" aria-label="Github repository">
          <Github className="h-5 w-5" />
        </Link>
      </div>
    </footer>
  );
}