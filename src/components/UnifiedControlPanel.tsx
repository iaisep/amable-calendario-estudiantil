
import { useState } from 'react';
import { CalendarIcon, Target, Download, Settings } from 'lucide-react';
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
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Course {
  id: string;
  name: string;
}

interface Subject {
  name: string;
  duration: number;
  color: string;
}

interface UnifiedControlPanelProps {
  courses: Course[];
  selectedCourse: string;
  onCourseChange: (courseId: string) => void;
  startDate: Date;
  onStartDateChange: (date: Date) => void;
  subjects: Subject[];
  currentSubject: string;
  onProgressAdjust: (subjectName: string, newStartDate: Date) => void;
  loading?: boolean;
}

export const UnifiedControlPanel = ({
  courses,
  selectedCourse,
  onCourseChange,
  startDate,
  onStartDateChange,
  subjects,
  currentSubject,
  onProgressAdjust,
  loading = false
}: UnifiedControlPanelProps) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [adjustmentDate, setAdjustmentDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'config' | 'progress'>('config');

  const WEBHOOK_URL = 'https://workflow.universidadisep.com/webhook/42231ec0-e1ae-497e-b08c-7b2a8e2bf479';

  const handleProgressAdjustment = async () => {
    if (!selectedSubject) {
      toast({
        title: "Error",
        description: "Por favor selecciona una materia",
        variant: "destructive",
      });
      return;
    }

    onProgressAdjust(selectedSubject, adjustmentDate);
    
    // Trigger webhook
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          action: "progress_adjustment",
          subject: selectedSubject,
          adjustmentDate: adjustmentDate.toISOString(),
          course: selectedCourse,
        }),
      });
    } catch (error) {
      console.log("Webhook trigger attempted:", error);
    }
    
    toast({
      title: "Progreso actualizado",
      description: `El calendario se ha ajustado para empezar "${selectedSubject}" el ${format(adjustmentDate, "PPP", { locale: es })}`,
    });
  };

  const downloadPDF = async () => {
    try {
      const calendarElement = document.getElementById('calendar-container');
      if (!calendarElement) {
        toast({
          title: "Error",
          description: "No se pudo encontrar el calendario para exportar",
          variant: "destructive",
        });
        return;
      }

      // Create a temporary container to capture the full calendar
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '-9999px';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '1200px';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.padding = '20px';
      document.body.appendChild(tempContainer);

      // Clone the calendar content
      const calendarClone = calendarElement.cloneNode(true) as HTMLElement;
      tempContainer.appendChild(calendarClone);

      // Generate canvas from the temporary container
      const canvas = await html2canvas(tempContainer, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 1240,
        height: tempContainer.scrollHeight + 40,
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 40) / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      // Add ISEP header
      pdf.setFontSize(20);
      pdf.setTextColor(27, 21, 107); // ISEP Dark Purple
      pdf.text('Tu Calendario ISEP', pdfWidth / 2, 20, { align: 'center' });
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      const courseName = courses.find(c => c.id === selectedCourse)?.name || 'Calendario';
      pdf.save(`${courseName}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast({
        title: "PDF generado",
        description: "Tu calendario completo ha sido descargado exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error al generar PDF",
        description: "Hubo un problema al crear el archivo PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="liquid-glass-card p-6 space-y-6">
      {/* Header with tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('config')}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === 'config' 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:bg-white/10"
            )}
          >
            <Settings className="w-4 h-4 mr-2 inline" />
            Configuración
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === 'progress' 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:bg-white/10"
            )}
          >
            <Target className="w-4 h-4 mr-2 inline" />
            Progreso
          </button>
        </div>
      </div>

      {/* Configuration Tab */}
      {activeTab === 'config' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="course-select" className="text-sm font-medium">
              Seleccionar Curso
            </Label>
            <Select value={selectedCourse} onValueChange={onCourseChange}>
              <SelectTrigger className="w-full liquid-glass">
                <SelectValue placeholder={courses.length === 0 ? "Cargando cursos..." : "Elige tu curso..."} />
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

          {selectedCourse && (
            <>
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-sm">
                  <p className="font-medium text-primary mb-1">Curso Seleccionado:</p>
                  <p className="text-primary/80">
                    {courses.find(c => c.id === selectedCourse)?.name}
                  </p>
                  <p className="text-xs text-primary/60 mt-2">
                    Inicio: {format(startDate, "PPP", { locale: es })}
                  </p>
                </div>
              </div>

              <Button
                onClick={downloadPDF}
                className="w-full bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90 text-white shadow-lg"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Calendario PDF
              </Button>
            </>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Fecha de Inicio del Curso
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal liquid-glass",
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
              <PopoverContent className="w-auto p-0 liquid-glass" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && onStartDateChange(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && subjects.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              ¿Qué materia estás cursando hoy?
            </Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={loading}>
              <SelectTrigger className="w-full liquid-glass">
                <SelectValue placeholder={loading ? "Cargando materias..." : "Selecciona materia actual..."} />
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
                    "w-full justify-start text-left font-normal liquid-glass",
                    !adjustmentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {adjustmentDate ? (
                    format(adjustmentDate, "PPP", { locale: es })
                  ) : (
                    <span>Selecciona fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 liquid-glass" align="start">
                <Calendar
                  mode="single"
                  selected={adjustmentDate}
                  onSelect={(date) => date && setAdjustmentDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            onClick={handleProgressAdjustment}
            className="w-full bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90 text-white"
          >
            <Target className="w-4 h-4 mr-2" />
            Recalcular Calendario
          </Button>

          <Button
            onClick={downloadPDF}
            className="w-full bg-gradient-to-r from-accent to-secondary hover:from-accent/90 hover:to-secondary/90 text-white shadow-lg"
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Calendario PDF
          </Button>

          {currentSubject && (
            <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
              <p className="text-sm text-secondary">
                <strong>Materia actual:</strong> {currentSubject}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
