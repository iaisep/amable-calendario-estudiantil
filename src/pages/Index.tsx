
import { useState, useEffect } from 'react';
import { CalendarView } from '@/components/CalendarView';
import { ConfigurationPanel } from '@/components/ConfigurationPanel';
import { MotivationalQuote } from '@/components/MotivationalQuote';
import { ProgressAdjuster } from '@/components/ProgressAdjuster';
import { Card } from '@/components/ui/card';
import { Calendar, BookOpen, Target } from 'lucide-react';

const Index = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [currentSubject, setCurrentSubject] = useState<string>('');
  const [subjects, setSubjects] = useState<any[]>([]);

  // Datos de ejemplo (en producción vendrían de NocoDB via n8n)
  const sampleCourses = [
    { id: 'prog-2024', name: 'Curso de Programación 2024' },
    { id: 'design-2024', name: 'Diseño Web 2024' },
    { id: 'data-2024', name: 'Ciencia de Datos 2024' }
  ];

  const sampleSubjects = {
    'prog-2024': [
      { name: 'Python Básico', duration: 14, color: '#22c55e' },
      { name: 'JavaScript Fundamentals', duration: 14, color: '#f59e0b' },
      { name: 'React Development', duration: 21, color: '#3b82f6' },
      { name: 'Node.js Backend', duration: 14, color: '#8b5cf6' },
      { name: 'Proyecto Final', duration: 14, color: '#ef4444' }
    ],
    'design-2024': [
      { name: 'Principios de Diseño', duration: 10, color: '#ec4899' },
      { name: 'Adobe Photoshop', duration: 12, color: '#06b6d4' },
      { name: 'Figma Avanzado', duration: 8, color: '#84cc16' },
      { name: 'UX/UI Design', duration: 15, color: '#f97316' }
    ],
    'data-2024': [
      { name: 'Estadística', duration: 18, color: '#6366f1' },
      { name: 'Python para Datos', duration: 16, color: '#22c55e' },
      { name: 'Machine Learning', duration: 20, color: '#dc2626' },
      { name: 'Visualización de Datos', duration: 12, color: '#7c3aed' }
    ]
  };

  useEffect(() => {
    if (selectedCourse) {
      setSubjects(sampleSubjects[selectedCourse as keyof typeof sampleSubjects] || []);
    }
  }, [selectedCourse]);

  const calculateSubjectDates = () => {
    const subjectDates = [];
    let currentDate = new Date(startDate);
    
    for (const subject of subjects) {
      const endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + subject.duration - 1);
      
      subjectDates.push({
        ...subject,
        startDate: new Date(currentDate),
        endDate: new Date(endDate)
      });
      
      currentDate.setDate(endDate.getDate() + 1);
    }
    
    return subjectDates;
  };

  const handleProgressAdjustment = (subjectName: string, newStartDate: Date) => {
    const subjectIndex = subjects.findIndex(s => s.name === subjectName);
    if (subjectIndex !== -1) {
      setStartDate(newStartDate);
      setCurrentSubject(subjectName);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tu Calendario ISEP
                </h1>
                <p className="text-sm text-gray-600">Visualiza tu progreso académico</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4" />
              <span>{subjects.length} materias programadas</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Configuración */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Configuración
              </h2>
              <ConfigurationPanel
                courses={sampleCourses}
                selectedCourse={selectedCourse}
                onCourseChange={setSelectedCourse}
                startDate={startDate}
                onStartDateChange={setStartDate}
              />
            </Card>

            {/* Frase Motivacional */}
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
              <MotivationalQuote />
            </Card>

            {/* Ajuste de Progreso */}
            {subjects.length > 0 && (
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <ProgressAdjuster
                  subjects={subjects}
                  currentSubject={currentSubject}
                  onProgressAdjust={handleProgressAdjustment}
                />
              </Card>
            )}
          </div>

          {/* Calendario Principal */}
          <div className="lg:col-span-3">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CalendarView
                subjectDates={calculateSubjectDates()}
                startDate={startDate}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
