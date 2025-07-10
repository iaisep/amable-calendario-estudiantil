
import { CalendarIcon } from 'lucide-react';
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
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Course {
  id: string;
  name: string;
}

interface ConfigurationPanelProps {
  courses: Course[];
  selectedCourse: string;
  onCourseChange: (courseId: string) => void;
  startDate: Date;
  onStartDateChange: (date: Date) => void;
}

export const ConfigurationPanel = ({
  courses,
  selectedCourse,
  onCourseChange,
  startDate,
  onStartDateChange
}: ConfigurationPanelProps) => {
  return (
    <div className="space-y-4">
      {/* Selección de curso */}
      <div className="space-y-2">
        <Label htmlFor="course-select" className="text-sm font-medium">
          Seleccionar Curso
        </Label>
        <Select value={selectedCourse} onValueChange={onCourseChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Elige tu curso..." />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fecha de inicio */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Fecha de Inicio
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                format(startDate, "PPP", { locale: es })
              ) : (
                <span>Selecciona una fecha</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => date && onStartDateChange(date)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Información del curso seleccionado */}
      {selectedCourse && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">Curso Seleccionado:</p>
            <p className="text-blue-700">
              {courses.find(c => c.id === selectedCourse)?.name}
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Inicio: {format(startDate, "PPP", { locale: es })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
