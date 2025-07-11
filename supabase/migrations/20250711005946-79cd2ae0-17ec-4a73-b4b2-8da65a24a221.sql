-- Crear tabla de cursos
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de materias
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de frases motivacionales
CREATE TABLE public.motivational_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para progreso del usuario (opcional para futuros features)
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  current_subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motivational_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Políticas para cursos (públicos para lectura)
CREATE POLICY "Anyone can view courses" 
ON public.courses 
FOR SELECT 
USING (true);

-- Políticas para materias (públicas para lectura)
CREATE POLICY "Anyone can view subjects" 
ON public.subjects 
FOR SELECT 
USING (true);

-- Políticas para frases motivacionales (públicas para lectura)
CREATE POLICY "Anyone can view active quotes" 
ON public.motivational_quotes 
FOR SELECT 
USING (is_active = true);

-- Políticas para progreso de usuario (solo el usuario puede ver/modificar su progreso)
CREATE POLICY "Users can view their own progress" 
ON public.user_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
ON public.user_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.user_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at
  BEFORE UPDATE ON public.subjects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar algunos datos de ejemplo
INSERT INTO public.courses (name, description) VALUES
('Ingeniería en Sistemas', 'Carrera completa de Ingeniería en Sistemas Computacionales'),
('Administración de Empresas', 'Licenciatura en Administración de Empresas'),
('Psicología', 'Licenciatura en Psicología Clínica');

-- Insertar materias para Ingeniería en Sistemas
INSERT INTO public.subjects (course_id, name, duration_days, color, order_index) 
SELECT c.id, 'Matemáticas I', 42, '#3B82F6', 1 FROM public.courses c WHERE c.name = 'Ingeniería en Sistemas';

INSERT INTO public.subjects (course_id, name, duration_days, color, order_index) 
SELECT c.id, 'Programación Básica', 35, '#10B981', 2 FROM public.courses c WHERE c.name = 'Ingeniería en Sistemas';

INSERT INTO public.subjects (course_id, name, duration_days, color, order_index) 
SELECT c.id, 'Física I', 40, '#F59E0B', 3 FROM public.courses c WHERE c.name = 'Ingeniería en Sistemas';

INSERT INTO public.subjects (course_id, name, duration_days, color, order_index) 
SELECT c.id, 'Matemáticas II', 45, '#EF4444', 4 FROM public.courses c WHERE c.name = 'Ingeniería en Sistemas';

INSERT INTO public.subjects (course_id, name, duration_days, color, order_index) 
SELECT c.id, 'Programación Avanzada', 38, '#8B5CF6', 5 FROM public.courses c WHERE c.name = 'Ingeniería en Sistemas';

-- Insertar frases motivacionales
INSERT INTO public.motivational_quotes (text, author) VALUES
('¡Hoy es un gran día para aprender!', 'Anónimo'),
('El éxito es la suma de pequeños esfuerzos repetidos día tras día.', 'Robert Collier'),
('La educación es el arma más poderosa que puedes usar para cambiar el mundo.', 'Nelson Mandela'),
('No importa cuán lento vayas, siempre y cuando no te detengas.', 'Confucio'),
('El futuro pertenece a aquellos que creen en la belleza de sus sueños.', 'Eleanor Roosevelt'),
('Cada día es una nueva oportunidad para crecer y mejorar.', 'Anónimo'),
('La disciplina es el puente entre metas y logros.', 'Jim Rohn'),
('El aprendizaje nunca agota la mente.', 'Leonardo da Vinci'),
('Tu único límite eres tú mismo.', 'Anónimo'),
('La perseverancia es la clave del éxito.', 'Anónimo');