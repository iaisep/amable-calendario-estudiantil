
import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MotivationalQuoteProps {
  getRandomQuote?: () => { text: string; author?: string };
}

export const MotivationalQuote = ({ getRandomQuote }: MotivationalQuoteProps) => {
  const [currentQuote, setCurrentQuote] = useState({
    text: "¡Hoy es un gran día para aprender!",
    author: "Anónimo"
  });

  const handleNewQuote = () => {
    if (getRandomQuote) {
      const newQuote = getRandomQuote();
      setCurrentQuote({
        text: newQuote.text,
        author: newQuote.author || "Anónimo"
      });
    }
  };

  useEffect(() => {
    handleNewQuote();
  }, [getRandomQuote]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
          Frase del Día
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewQuote}
          className="text-accent hover:text-accent/80 hover:bg-accent/10"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      <blockquote className="border-l-4 border-accent/50 pl-4 italic">
        <p className="text-muted-foreground mb-2">
          "{currentQuote.text}"
        </p>
        <footer className="text-sm text-accent font-medium">
          — {currentQuote.author}
        </footer>
      </blockquote>
    </div>
  );
};
