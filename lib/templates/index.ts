import { Template, TemplateType } from '@/types';

export const TEMPLATES: Template[] = [
  {
    id: 'finanzamt',
    name: 'Finanzamt',
    nameRu: 'Налоговая служба',
    description: 'Налоговая декларация, запрос Steuer-ID, продление срока',
    icon: '🏛️',
    color: 'from-blue-500/20 to-blue-600/10',
    examples: [
      'Продление срока подачи декларации',
      'Запрос налогового идентификатора',
      'Возврат переплаченного налога',
    ],
  },
  {
    id: 'anmeldung',
    name: 'Anmeldung',
    nameRu: 'Регистрация по месту жительства',
    description: 'Прописка, смена адреса, снятие с учёта',
    icon: '🏠',
    color: 'from-green-500/20 to-green-600/10',
    examples: [
      'Первичная регистрация',
      'Смена адреса (Ummeldung)',
      'Снятие с учёта при отъезде',
    ],
  },
  {
    id: 'auslaenderbehoerde',
    name: 'Ausländerbehörde',
    nameRu: 'Управление по делам иностранцев',
    description: 'Продление визы, вид на жительство, разрешение на работу',
    icon: '📋',
    color: 'from-purple-500/20 to-purple-600/10',
    examples: [
      'Продление разрешения на проживание',
      'Запрос постоянного вида на жительство',
      'Разрешение на работу',
    ],
  },
  {
    id: 'krankenversicherung',
    name: 'Krankenversicherung',
    nameRu: 'Медицинская страховка',
    description: 'Запись в ГКВ, освобождение от страховки, компенсация',
    icon: '🏥',
    color: 'from-red-500/20 to-red-600/10',
    examples: [
      'Вступление в государственное страхование',
      'Запрос компенсации расходов',
      'Освобождение от обязательного страхования',
    ],
  },
  {
    id: 'jobcenter',
    name: 'Jobcenter',
    nameRu: 'Центр занятости',
    description: 'Пособие по безработице, возражения, изменение данных',
    icon: '💼',
    color: 'from-amber-500/20 to-amber-600/10',
    examples: [
      'Заявление на пособие ALG II',
      'Возражение на решение',
      'Уведомление об изменении дохода',
    ],
  },
];

export const TEMPLATE_MAP: Record<TemplateType, Template> = Object.fromEntries(
  TEMPLATES.map((t) => [t.id, t])
) as Record<TemplateType, Template>;
