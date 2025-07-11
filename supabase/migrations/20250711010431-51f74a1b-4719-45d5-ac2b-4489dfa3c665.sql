-- Agregar materias para los otros cursos

-- Materias para Administración de Empresas
INSERT INTO public.subjects (course_id, name, duration_days, color, order_index) 
SELECT c.id, 'Contabilidad Básica', 35, '#3B82F6', 1 FROM public.courses c WHERE c.name = 'Administración de Empresas';

INSERT INTO public.subjects (course_id, name, duration_days, color, order_index) 
SELECT c.id, 'Marketing Fundamentals', 30, '#10B981', 2 FROM public.courses c WHERE c.name = 'Administración de Empresas';

INSERT INTO public.subjects (course_id, name, duration_days, color, order_index) 
SELECT c.id, 'Recursos Humanos', 28, '#F59E0B', 3 FROM public.courses c WHERE c.name = 'Administración de Empresas';

INSERT INTO public.subjects (course_id, name, duration_days, color, order_index) 
SELECT c.id, 'Finanzas Corporativas', 40, '#EF4444', 4 FROM public.courses c WHERE c.name = 'Administración de Empresas';

-- Materias para Psicología
INSERT INTO public.subjects (course_id, name, duration_days, color, order_index) 
SELECT c.id, 'Psicología General', 45, '#3B82F6', 1 FROM public.courses c WHERE c.name = 'Psicología';

INSERT INTO public.subjects (course_id, name, duration_days, color, order_index) 
SELECT c.id, 'Neuropsicología', 38, '#10B981', 2 FROM public.courses c WHERE c.name = 'Psicología';

INSERT INTO public.subjects (course_id, name, duration_days, color, order_index) 
SELECT c.id, 'Psicología Clínica', 42, '#F59E0B', 3 FROM public.courses c WHERE c.name = 'Psicología';

INSERT INTO public.subjects (course_id, name, duration_days, color, order_index) 
SELECT c.id, 'Terapias Psicológicas', 35, '#EF4444', 4 FROM public.courses c WHERE c.name = 'Psicología';

INSERT INTO public.subjects (course_id, name, duration_days, color, order_index) 
SELECT c.id, 'Práctica Clínica', 50, '#8B5CF6', 5 FROM public.courses c WHERE c.name = 'Psicología';