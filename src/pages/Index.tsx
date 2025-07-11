
import { useState, useEffect } from 'react';
import { CalendarView } from '@/components/CalendarView';
import { UnifiedControlPanel } from '@/components/UnifiedControlPanel';
import { MotivationalQuote } from '@/components/MotivationalQuote';
import { Card } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { useApiData } from '@/hooks/useApiData';

const Index = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [currentSubject, setCurrentSubject] = useState<string>('');
  
  const { courses, subjects, fetchSubjects, loading } = useApiData();

  useEffect(() => {
    if (selectedCourse) {
      fetchSubjects(selectedCourse);
    }
  }, [selectedCourse, fetchSubjects]);

  const calculateSubjectDates = () => {
    const subjectDates = [];
    let currentDate = new Date(startDate);
    // Ensure we start exactly on the selected start date
    currentDate.setHours(0, 0, 0, 0);
    
    for (const subject of subjects) {
      const endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + subject.duration - 1);
      
      subjectDates.push({
        ...subject,
        startDate: new Date(currentDate),
        endDate: new Date(endDate)
      });
      
      // Move to the next day after the current subject ends
      currentDate = new Date(endDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return subjectDates;
  };

  const handleProgressAdjustment = (subjectName: string, newStartDate: Date) => {
    const subjectIndex = subjects.findIndex(s => s.name === subjectName);
    if (subjectIndex !== -1) {
      // Calculate the new start date based on when this subject should begin
      const previousSubjects = subjects.slice(0, subjectIndex);
      const totalDaysBeforeSubject = previousSubjects.reduce((total, subject) => total + subject.duration, 0);
      
      // Calculate the new course start date
      const newCourseStartDate = new Date(newStartDate);
      newCourseStartDate.setDate(newStartDate.getDate() - totalDaysBeforeSubject);
      
      setStartDate(newCourseStartDate);
      setCurrentSubject(subjectName);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      {/* Header with liquid glass effect */}
      <header className="liquid-glass border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* ISEP Logo */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg">
                <img 
                  src="/lovable-uploads/568f00f3-cf49-42a6-bded-5f49232200a8.png" 
                  alt="ISEP Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Tu Calendario ISEP
                </h1>
                <p className="text-sm text-muted-foreground">Visualiza tu progreso académico</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground liquid-glass px-3 py-2 rounded-lg">
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
            {/* Unified Control Panel */}
            <UnifiedControlPanel
              courses={courses}
              selectedCourse={selectedCourse}
              onCourseChange={setSelectedCourse}
              startDate={startDate}
              onStartDateChange={setStartDate}
              subjects={subjects}
              currentSubject={currentSubject}
              onProgressAdjust={handleProgressAdjustment}
              loading={loading.subjects}
            />

            {/* Frase Motivacional */}
            <Card className="liquid-glass-card p-6 bg-gradient-to-br from-accent/10 to-secondary/10">
              <MotivationalQuote key={selectedCourse} />
            </Card>
          </div>

          {/* Calendario Principal */}
          <div className="lg:col-span-3">
            <div id="calendar-container" className="liquid-glass-card p-6">
              <CalendarView
                subjectDates={calculateSubjectDates()}
                startDate={startDate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
