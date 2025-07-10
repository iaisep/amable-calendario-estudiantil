
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Info, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SubjectDate {
  name: string;
  duration: number;
  color: string;
  startDate: Date;
  endDate: Date;
}

interface CalendarViewProps {
  subjectDates: SubjectDate[];
  startDate: Date;
}

export const CalendarView = ({ subjectDates, startDate }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(startDate));

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getSubjectForDate = (date: Date) => {
    return subjectDates.find(subject => {
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      const start = new Date(subject.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(subject.endDate);
      end.setHours(0, 0, 0, 0);
      
      return checkDate >= start && checkDate <= end;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(currentMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Días vacíos al inicio
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-white/10 liquid-glass"></div>
      );
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const subject = getSubjectForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <TooltipProvider key={day}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`h-24 border border-white/10 p-2 relative cursor-pointer transition-all hover:bg-white/10 liquid-glass ${
                  isToday ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                style={{
                  backgroundColor: subject ? `${subject.color}20` : 'transparent'
                }}
              >
                <div className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                  {day}
                </div>
                {subject && (
                  <div
                    className="absolute bottom-1 left-1 right-1 text-xs p-1 rounded text-white font-medium truncate shadow-md"
                    style={{ backgroundColor: subject.color }}
                  >
                    {subject.name}
                  </div>
                )}
                {isToday && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full shadow-md"></div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent className="liquid-glass">
              <div className="text-center">
                <p className="font-medium">{date.toLocaleDateString('es-ES')}</p>
                {subject && (
                  <div className="mt-1">
                    <p className="text-sm">{subject.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {subject.startDate.toLocaleDateString('es-ES')} - {subject.endDate.toLocaleDateString('es-ES')}
                    </p>
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header del calendario */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Planificación académica personalizada
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8 p-0 liquid-glass-button"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
            className="text-xs liquid-glass-button"
          >
            Hoy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="h-8 w-8 p-0 liquid-glass-button"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Leyenda de materias */}
      {subjectDates.length > 0 && (
        <Card className="liquid-glass-card p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Info className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Materias programadas</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {subjectDates.map((subject, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-white border-0 shadow-md"
                style={{ backgroundColor: subject.color }}
              >
                {subject.name} ({subject.duration} días)
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Grid del calendario */}
      <div className="liquid-glass rounded-lg border border-white/20 overflow-hidden">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 bg-primary/5">
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-primary border-r border-white/10 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Días del mes */}
        <div className="grid grid-cols-7">
          {renderCalendarDays()}
        </div>
      </div>

      {subjectDates.length === 0 && (
        <Card className="liquid-glass-card p-8 text-center">
          <div className="text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">No hay materias programadas</h3>
            <p className="text-sm">
              Selecciona un curso en el panel de configuración para ver tu calendario académico.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
