import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Course {
  id: string;
  name: string;
  description?: string;
}

interface Subject {
  id: string;
  name: string;
  duration_days: number;
  color: string;
  order_index: number;
  course_id: string;
}

interface MotivationalQuote {
  id: string;
  text: string;
  author?: string;
}

export const useCalendarData = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [motivationalQuotes, setMotivationalQuotes] = useState<MotivationalQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('name');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los cursos",
        variant: "destructive",
      });
    }
  };

  // Fetch subjects for a specific course
  const fetchSubjects = async (courseId: string) => {
    if (!courseId) {
      setSubjects([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]); // Set empty array on error
      toast({
        title: "Error",
        description: "No se pudieron cargar las materias",
        variant: "destructive",
      });
    }
  };

  // Fetch motivational quotes
  const fetchMotivationalQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('motivational_quotes')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setMotivationalQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las frases motivacionales",
        variant: "destructive",
      });
    }
  };

  // Get random motivational quote
  const getRandomQuote = () => {
    if (motivationalQuotes.length === 0) {
      return {
        text: "¡Hoy es un gran día para aprender!",
        author: "Anónimo"
      };
    }
    
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
  };

  // Transform subjects to match expected format
  const getTransformedSubjects = () => {
    return subjects.map(subject => ({
      name: subject.name,
      duration: subject.duration_days,
      color: subject.color
    }));
  };

  // Transform courses to match expected format
  const getTransformedCourses = () => {
    return courses.map(course => ({
      id: course.id,
      name: course.name
    }));
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchCourses(),
        fetchMotivationalQuotes()
      ]);
      setIsLoading(false);
    };

    initializeData();
  }, []);

  return {
    courses: getTransformedCourses(),
    subjects: getTransformedSubjects(),
    motivationalQuotes,
    isLoading,
    fetchSubjects,
    getRandomQuote,
    refetch: {
      courses: fetchCourses,
      quotes: fetchMotivationalQuotes
    }
  };
};