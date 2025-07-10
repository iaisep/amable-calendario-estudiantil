
import { useState } from 'react';
import { Target, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Subject {
  name: string;
  duration: number;
  color: string;
}

interface ProgressAdjusterProps {
  subjects: Subject[];
  currentSubject: string;
  onProgressAdjust: (subjectName: string, newStartDate: Date) => void;
}

export const ProgressAdjuster = ({
  subjects,
  currentSubject,
  onProgressAdjust
}: ProgressAdjusterProps) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [adjustmentDate, setAdjustmentDate] = useState<Date>(new Date());

  const handleAdjustment = () => {
    if (!selectedSubject) {
      toast({
        title: "Error",
        description: "Por favor selecciona una materia",
        variant: "destructive",
      });
      return;
    }

    onProgressAdjust(selectedSubject, adjustmentDate);
    
    toast({
      title: "Progreso actualizado",
      description: `El calendario se ha ajustado para empezar "${selectedSubject}" el ${format(adjustmentDate, "PPP", { locale: es })}`,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <Target className="w-5 h-5 mr-2 text-green-600" />
        Ajustar Progreso
      </h3>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            ¿Qué materia estás cursando hoy?
          </Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona materia actual..." />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject, index) => (
                <SelectItem key={index} value={subject.name}>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    ></div>
                    <span>{subject.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Fecha de inicio para esta materia
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !adjustmentDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {adjustmentDate ? (
                  format(adjustmentDate, "PPP", { locale: es })
                ) : (
                  <span>Selecciona fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={adjustmentDate}
                onSelect={(date) => date && setAdjustmentDate(date)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          onClick={handleAdjustment}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Recalcular Calendario
        </Button>
      </div>

      {currentSubject && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <strong>Materia actual:</strong> {currentSubject}
          </p>
        </div>
      )}
    </div>
  );
};
