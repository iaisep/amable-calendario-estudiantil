
import { useState, useEffect } from 'react';
import { Quote, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const motivationalQuotes = [
  {
    text: "¡Hoy es un gran día para aprender!",
    author: "Anónimo"
  },
  {
    text: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    author: "Robert Collier"
  },
  {
    text: "No te rindas, cada experto fue una vez un principiante.",
    author: "Helen Hayes"
  },
  {
    text: "La educación es el arma más poderosa que puedes usar para cambiar el mundo.",
    author: "Nelson Mandela"
  },
  {
    text: "El único modo de hacer un gran trabajo es amar lo que haces.",
    author: "Steve Jobs"
  },
  {
    text: "Tu única limitación eres tú mismo.",
    author: "Anónimo"
  },
  {
    text: "El conocimiento no es poder hasta que se aplica.",
    author: "Dale Carnegie"
  },
  {
    text: "Cada día es una nueva oportunidad para crecer.",
    author: "Anónimo"
  },
  {
    text: "La perseverancia es la clave del éxito.",
    author: "Benjamin Franklin"
  },
  {
    text: "Aprende como si fueras a vivir para siempre.",
    author: "Mahatma Gandhi"
  },
  {
    text: "El futuro pertenece a quienes creen en la belleza de sus sueños.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "No esperes el momento perfecto, toma el momento y hazlo perfecto.",
    author: "Anónimo"
  },
  {
    text: "La disciplina es elegir entre lo que quieres ahora y lo que quieres más.",
    author: "Abraham Lincoln"
  },
  {
    text: "Cada logro empieza con la decisión de intentarlo.",
    author: "Anónimo"
  },
  {
    text: "Tu potencial es infinito cuando crees en ti mismo.",
    author: "Anónimo"
  }
];

export const MotivationalQuote = () => {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  };

  useEffect(() => {
    // Seleccionar una frase aleatoria al cargar el componente
    getRandomQuote();
  }, []);

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
          onClick={getRandomQuote}
          className="h-8 w-8 p-0 text-orange-600 hover:text-orange-800 hover:bg-orange-100"
        >
          <RefreshCw className="w-4 h-4" />
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
