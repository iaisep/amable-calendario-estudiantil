import { useState, useEffect, useCallback } from 'react';

interface Course {
  id: string;
  name: string;
  description?: string;
}

interface Subject {
  name: string;
  duration: number;
  color: string;
}

interface MotivationalQuote {
  text: string;
  author: string;
}

interface N8NCourse {
  id1: string;
  name: string;
  description: string;
}

interface N8NSubject {
  name: string;
  duration_days: number;
  color: string;
}

interface N8NQuote {
  text: string;
  author: string;
}

const BASE_URL = 'https://n8ntotal.universidadisep.com/webhook';

export const useApiData = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [quote, setQuote] = useState<MotivationalQuote | null>(null);
  const [loading, setLoading] = useState({
    courses: false,
    subjects: false,
    quote: false,
  });
  const [errors, setErrors] = useState({
    courses: '',
    subjects: '',
    quote: '',
  });

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    setLoading(prev => ({ ...prev, courses: true }));
    setErrors(prev => ({ ...prev, courses: '' }));

    try {
      const response = await fetch(`${BASE_URL}/courses`);
      if (!response.ok) throw new Error('Error al cargar cursos');
      
      const data: N8NCourse[] = await response.json();
      const transformedCourses = data.map(course => ({
        id: course.id1,
        name: course.name,
        description: course.description
      }));
      
      setCourses(transformedCourses);
    } catch (error) {
      setErrors(prev => ({ ...prev, courses: 'Error al cargar cursos' }));
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  }, []);

  // Fetch subjects for a specific course
  const fetchSubjects = useCallback(async (courseId: string) => {
    if (!courseId) {
      setSubjects([]);
      return;
    }

    setLoading(prev => ({ ...prev, subjects: true }));
    setErrors(prev => ({ ...prev, subjects: '' }));

    try {
      const response = await fetch(`${BASE_URL}/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ row: courseId }),
      });
      
      if (!response.ok) throw new Error('Error al cargar materias');
      
      const data: N8NSubject[] = await response.json();
      const transformedSubjects = data.map(subject => ({
        name: subject.name,
        duration: subject.duration_days,
        color: subject.color
      }));
      
      setSubjects(transformedSubjects);
    } catch (error) {
      setErrors(prev => ({ ...prev, subjects: 'Error al cargar materias' }));
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(prev => ({ ...prev, subjects: false }));
    }
  }, []);

  // Fetch motivational quote
  const fetchQuote = useCallback(async () => {
    setLoading(prev => ({ ...prev, quote: true }));
    setErrors(prev => ({ ...prev, quote: '' }));

    try {
      const response = await fetch(`${BASE_URL}/motivational_quotes`);
      if (!response.ok) throw new Error('Error al cargar frase motivacional');
      
      const data: N8NQuote = await response.json();
      setQuote({
        text: data.text,
        author: data.author
      });
    } catch (error) {
      setErrors(prev => ({ ...prev, quote: 'Error al cargar frase motivacional' }));
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(prev => ({ ...prev, quote: false }));
    }
  }, []);

  // Load courses on mount
  useEffect(() => {
    fetchCourses();
    fetchQuote();
  }, [fetchCourses, fetchQuote]);

  return {
    courses,
    subjects,
    quote,
    loading,
    errors,
    fetchSubjects,
    fetchQuote,
    refetchCourses: fetchCourses,
  };
};