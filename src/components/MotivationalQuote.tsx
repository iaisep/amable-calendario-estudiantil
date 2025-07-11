
import { Quote, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApiData } from '@/hooks/useApiData';

export const MotivationalQuote = () => {
  const { quote, fetchQuote, loading } = useApiData();

  const defaultQuote = {
    text: "El futuro pertenece a aquellos que creen en la belleza de sus sueños.",
    author: "Eleanor Roosevelt"
  };

  const currentQuote = quote || defaultQuote;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-orange-800 flex items-center">
          <Quote className="w-5 h-5 mr-2" />
          Motivación Diaria
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchQuote}
          disabled={loading.quote}
          className="h-8 w-8 p-0 text-orange-600 hover:text-orange-800 hover:bg-orange-100"
        >
          <RefreshCw className={`w-4 h-4 ${loading.quote ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="space-y-3">
        <blockquote className="text-orange-900 font-medium italic text-center leading-relaxed">
          "{currentQuote.text}"
        </blockquote>
        <cite className="text-orange-700 text-sm text-center block not-italic">
          — {currentQuote.author}
        </cite>
      </div>

      <div className="h-1 bg-gradient-to-r from-orange-200 via-pink-200 to-orange-200 rounded-full"></div>
    </div>
  );
};
