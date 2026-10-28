export const CATEGORIES = [
  {
    id: 'metas',
    name: 'Metas y Éxito',
    icon: 'Target',
    color: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Enfoque, ambición y pasos firmes hacia tus sueños.'
  },
  {
    id: 'disciplina',
    name: 'Disciplina y Hábitos',
    icon: 'Flame',
    color: 'from-rose-500 to-red-600',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    description: 'Constancia diaria incluso cuando falta la ganas.'
  },
  {
    id: 'calma',
    name: 'Paz y Anti-Estrés',
    icon: 'Wind',
    color: 'from-teal-400 to-emerald-600',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    description: 'Serenidad mental, superar la ansiedad y vivir el presente.'
  },
  {
    id: 'autoestima',
    name: 'Amor Propio y Confianza',
    icon: 'Heart',
    color: 'from-pink-500 to-purple-600',
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    description: 'Creer en tu valor, resiliencia e inteligencia emocional.'
  },
  {
    id: 'fitness',
    name: 'Energía y Fitness',
    icon: 'Zap',
    color: 'from-cyan-400 to-blue-600',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    description: 'Fuerza física, vitalidad y superación personal.'
  },
  {
    id: 'emprendimiento',
    name: 'Emprendimiento y Liderazgo',
    icon: 'Rocket',
    color: 'from-violet-500 to-indigo-600',
    badgeBg: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    description: 'Visión de futuro, innovación y valentía para crear.'
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 'current_mood',
    step: 1,
    title: '¿Cómo te sientes en esta etapa de tu vida?',
    subtitle: 'Esto nos ayudará a calibrar el tono de tus notificaciones y fotos.',
    multiSelect: false,
    options: [
      {
        id: 'focused',
        label: 'Con ganas de crecer, pero necesito más constancia',
        emoji: '🔥',
        boostCategories: ['disciplina', 'metas'],
        tone: 'energico'
      },
      {
        id: 'overwhelmed',
        label: 'Con algo de estrés o sobrecarga mental',
        emoji: '🌿',
        boostCategories: ['calma', 'autoestima'],
        tone: 'sereno'
      },
      {
        id: 'ambitious',
        label: 'Construyendo un proyecto, estudio o meta grande',
        emoji: '🚀',
        boostCategories: ['emprendimiento', 'metas', 'disciplina'],
        tone: 'directo'
      },
      {
        id: 'rebuilding',
        label: 'Recuperando mi confianza y energía personal',
        emoji: '✨',
        boostCategories: ['autoestima', 'calma', 'fitness'],
        tone: 'inspirador'
      }
    ]
  },
  {
    id: 'main_obstacle',
    step: 2,
    title: '¿Cuál sientes que es tu mayor obstáculo hoy?',
    subtitle: 'Te enviaremos recordatorios precisos para derribarlo.',
    multiSelect: false,
    options: [
      {
        id: 'procrastination',
        label: 'Postergar las cosas importantes (Procrastinación)',
        emoji: '⏳',
        boostCategories: ['disciplina', 'metas']
      },
      {
        id: 'self_doubt',
        label: 'Dudar de mis capacidades o miedo a fallar',
        emoji: '🛡️',
        boostCategories: ['autoestima', 'emprendimiento']
      },
      {
        id: 'burnout',
        label: 'Falta de energía física o agotamiento',
        emoji: '⚡',
        boostCategories: ['fitness', 'calma']
      },
      {
        id: 'distraction',
        label: 'Perder el enfoque entre tantas distracciones',
        emoji: '🎯',
        boostCategories: ['metas', 'disciplina']
      }
    ]
  },
  {
    id: 'favorite_categories',
    step: 3,
    title: '¿Qué pilares quieres fortalecer cada día?',
    subtitle: 'Puedes elegir todas las categorías que quieras.',
    multiSelect: true,
    options: CATEGORIES.map(cat => ({
      id: cat.id,
      label: cat.name,
      description: cat.description,
      emoji: cat.id === 'metas' ? '🎯' : cat.id === 'disciplina' ? '🔥' : cat.id === 'calma' ? '🧘' : cat.id === 'autoestima' ? '💎' : cat.id === 'fitness' ? '💪' : '🚀'
    }))
  },
  {
    id: 'visual_style',
    step: 4,
    title: '¿Qué tipo de fotografías te inspiran más?',
    subtitle: 'Personalizaremos el fondo visual de tus tarjetas y notificaciones.',
    multiSelect: false,
    options: [
      {
        id: 'mountains',
        label: 'Cumbres, naturaleza épica y amaneceres',
        emoji: '🏔️',
        visualTag: 'nature'
      },
      {
        id: 'minimal_dark',
        label: 'Estética nocturna, cosmos y arquitectura minimalista',
        emoji: '🌌',
        visualTag: 'cosmos'
      },
      {
        id: 'action',
        label: 'Acción, deporte, enfoque y superación',
        emoji: '🏃',
        visualTag: 'action'
      },
      {
        id: 'zen',
        label: 'Bosques tranquilos, océano y paz visual',
        emoji: '🌊',
        visualTag: 'zen'
      }
    ]
  },
  {
    id: 'notification_schedule',
    step: 5,
    title: '¿Cuándo prefieres recibir tu dosis de motivación?',
    subtitle: 'Configura tus horarios clave para recibir notificaciones con frase e imagen.',
    isScheduleStep: true
  }
];

export const MOTIVATIONAL_QUOTES = [
  // METAS Y ÉXITO
  {
    id: 'q1',
    category: 'metas',
    quote: 'No midas tu progreso con la regla de otra persona. Compite únicamente con quien eras ayer.',
    author: 'Sabiduría Estoica',
    reflection: 'Da hoy un paso de 1% hacia tu meta principal sin mirar a los lados.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-amber-900/90 via-slate-900/85 to-slate-950',
    visualTag: 'nature',
    tone: 'inspirador'
  },
  {
    id: 'q2',
    category: 'metas',
    quote: 'El futuro pertenece a quienes creen en la grandeza de sus sueños y trabajan en silencio por ellos.',
    author: 'Eleanor Roosevelt (Adapt.)',
    reflection: 'Escribe la tarea número 1 que hará que este día valga la pena.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-orange-950/90 via-indigo-950/85 to-slate-950',
    visualTag: 'nature',
    tone: 'energico'
  },
  {
    id: 'q3',
    category: 'metas',
    quote: 'Una meta sin un plan diario es solo un deseo. Convierte tu visión en acciones pequeñas e inevitables.',
    author: 'Antoine de Saint-Exupéry',
    reflection: 'Divide tu objetivo más grande en un bloque de 25 minutos hoy.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-slate-900/90 via-amber-950/80 to-slate-950',
    visualTag: 'cosmos',
    tone: 'directo'
  },
  {
    id: 'q4',
    category: 'metas',
    quote: 'Dentro de un año desearás haber empezado hoy. No esperes el momento perfecto, créalo.',
    author: 'Karen Lamb',
    reflection: 'El momento perfecto no existe; la acción imperfecta supera la inacción.',
    image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-yellow-950/90 via-slate-900/85 to-slate-950',
    visualTag: 'nature',
    tone: 'directo'
  },

  // DISCIPLINA Y HÁBITOS
  {
    id: 'q5',
    category: 'disciplina',
    quote: 'La motivación te pone en marcha, pero es la disciplina la que te hace imparable cuando nadie te ve.',
    author: 'Jim Ryun',
    reflection: 'Cumple la promesa que te hiciste a ti mismo, aunque sea por 10 minutos.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-rose-950/90 via-slate-900/85 to-slate-950',
    visualTag: 'action',
    tone: 'energico'
  },
  {
    id: 'q6',
    category: 'disciplina',
    quote: 'Somos lo que hacemos repetidamente. La excelencia, entonces, no es un acto, sino un hábito.',
    author: 'Aristóteles',
    reflection: 'Tus pequeños rituales de hoy construyen tu identidad de mañana.',
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-red-950/90 via-stone-900/85 to-slate-950',
    visualTag: 'nature',
    tone: 'directo'
  },
  {
    id: 'q7',
    category: 'disciplina',
    quote: 'El dolor de la disciplina pesa gramos; el dolor del arrepentimiento pesa toneladas.',
    author: 'Jim Rohn',
    reflection: 'Elige el esfuerzo presente que te regalará tranquilidad esta noche.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-orange-950/90 via-rose-950/85 to-slate-950',
    visualTag: 'action',
    tone: 'directo'
  },
  {
    id: 'q8',
    category: 'disciplina',
    quote: 'No necesitas tener ganas para hacerlo. Cuando actúas primero, la inspiración te alcanza en el camino.',
    author: 'James Clear',
    reflection: 'Aplica la regla de los 2 minutos: solo empieza la primera acción.',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-rose-900/90 via-slate-900/85 to-slate-950',
    visualTag: 'nature',
    tone: 'energico'
  },

  // PAZ Y ANTI-ESTRÉS
  {
    id: 'q9',
    category: 'calma',
    quote: 'Tienes poder sobre tu mente, no sobre los eventos externos. Date cuenta de esto y encontrarás la fuerza.',
    author: 'Marco Aurelio',
    reflection: 'Respira profundo 3 veces y suelta aquello que no depende de tu control.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-teal-950/90 via-slate-900/85 to-slate-950',
    visualTag: 'zen',
    tone: 'sereno'
  },
  {
    id: 'q10',
    category: 'calma',
    quote: 'Sufrimos más a menudo en la imaginación que en la realidad. Regresa al único lugar donde tienes poder: el ahora.',
    author: 'Séneca',
    reflection: 'Observa tu entorno ahora mismo. Estás a salvo y puedes ir paso a paso.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-emerald-950/90 via-slate-900/85 to-slate-950',
    visualTag: 'zen',
    tone: 'sereno'
  },
  {
    id: 'q11',
    category: 'calma',
    quote: 'Descansar también es parte del progreso. Incluso la tierra necesita invierno para volver a florecer.',
    author: 'Proverbio Oriental',
    reflection: 'Sé amable contigo hoy. Avanzar en paz vale más que correr con ansiedad.',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-cyan-950/90 via-teal-950/85 to-slate-950',
    visualTag: 'zen',
    tone: 'sereno'
  },
  {
    id: 'q12',
    category: 'calma',
    quote: 'Nada en la naturaleza se apresura y, sin embargo, todo se logra a su debido tiempo.',
    author: 'Lao Tzu',
    reflection: 'Baja los hombros, relaja la mandíbula y confía en tu proceso.',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-emerald-900/90 via-slate-900/85 to-slate-950',
    visualTag: 'zen',
    tone: 'sereno'
  },

  // AMOR PROPIO Y CONFIANZA
  {
    id: 'q13',
    category: 'autoestima',
    quote: 'Has sobrevivido al 100% de tus días más difíciles. Tienes dentro de ti una resiliencia que aún no dimensionas.',
    author: 'Anónimo',
    reflection: 'Reconoce todo lo que ya has superado para llegar hasta donde estás hoy.',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-purple-950/90 via-pink-950/80 to-slate-950',
    visualTag: 'nature',
    tone: 'inspirador'
  },
  {
    id: 'q14',
    category: 'autoestima',
    quote: 'Háblate a ti mismo como le hablarías a alguien a quien amas profundamente y quieres ver triunfar.',
    author: 'Brené Brown',
    reflection: 'Cambia hoy la autocrítica dura por aliento constructivo.',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-pink-950/90 via-slate-900/85 to-slate-950',
    visualTag: 'cosmos',
    tone: 'inspirador'
  },
  {
    id: 'q15',
    category: 'autoestima',
    quote: 'Tu valor no disminuye porque alguien no sepa verlo, ni depende de un tropiezo temporal.',
    author: 'Sabiduría Interior',
    reflection: 'Mantén la cabeza alta; cada error es solo información para crecer.',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-fuchsia-950/90 via-indigo-950/85 to-slate-950',
    visualTag: 'nature',
    tone: 'inspirador'
  },
  {
    id: 'q16',
    category: 'autoestima',
    quote: 'Cuando dejas de pedir permiso para brillar y confías en tu propia voz, las puertas correctas se abren.',
    author: 'Marianne Williamson (Adapt.)',
    reflection: 'Hoy actúa desde la seguridad de quien merece cosas extraordinarias.',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-purple-900/90 via-slate-900/85 to-slate-950',
    visualTag: 'cosmos',
    tone: 'energico'
  },

  // ENERGÍA Y FITNESS
  {
    id: 'q17',
    category: 'fitness',
    quote: 'Tu cuerpo puede soportar casi cualquier reto; es a tu mente a la que tienes que convencer.',
    author: 'Mentalidad Atleta',
    reflection: 'Muévete hoy al menos 20 minutos: tu mente te lo agradecerá con dopamina real.',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-blue-950/90 via-cyan-950/85 to-slate-950',
    visualTag: 'action',
    tone: 'energico'
  },
  {
    id: 'q18',
    category: 'fitness',
    quote: 'Nunca te arrepentirás de haber entrenado, de haber elegido comida que te nutre o de haber cuidado tu energía.',
    author: 'Filosofía Vital',
    reflection: 'Hidrátate ahora mismo y regálale movimiento a tu cuerpo.',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-cyan-950/90 via-slate-900/85 to-slate-950',
    visualTag: 'action',
    tone: 'energico'
  },
  {
    id: 'q19',
    category: 'fitness',
    quote: 'La fuerza no proviene de la capacidad física, sino de una voluntad indomable que se levanta una vez más.',
    author: 'Mahatma Gandhi',
    reflection: 'Una repetición más, un kilómetro más, un intento más.',
    image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-sky-950/90 via-indigo-950/85 to-slate-950',
    visualTag: 'action',
    tone: 'directo'
  },

  // EMPRENDIMIENTO Y LIDERAZGO
  {
    id: 'q20',
    category: 'emprendimiento',
    quote: 'Los que están lo suficientemente locos como para pensar que pueden cambiar el mundo son los que lo logran.',
    author: 'Steve Jobs',
    reflection: 'Atrévete a lanzar esa idea aunque todavía no esté 100% pulida.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-indigo-950/90 via-violet-950/85 to-slate-950',
    visualTag: 'cosmos',
    tone: 'energico'
  },
  {
    id: 'q21',
    category: 'emprendimiento',
    quote: 'El fracaso es simplemente la oportunidad de comenzar de nuevo, esta vez con mucha más inteligencia.',
    author: 'Henry Ford',
    reflection: 'Cada obstáculo en tu proyecto es un escalón que filtra a quienes se rinden.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-violet-950/90 via-slate-900/85 to-slate-950',
    visualTag: 'cosmos',
    tone: 'directo'
  },
  {
    id: 'q22',
    category: 'emprendimiento',
    quote: 'Persigue la excelencia y el aporte de valor genuino; el éxito será una consecuencia inevitable.',
    author: 'Naval Ravikant (Adapt.)',
    reflection: 'Enfócate en resolver un problema real hoy con total dedicación.',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1080&q=80',
    gradient: 'from-indigo-900/90 via-slate-900/85 to-slate-950',
    visualTag: 'nature',
    tone: 'inspirador'
  }
];

export const DEFAULT_SCHEDULES = [
  { id: 'morning', label: 'Impulso Matutino', time: '08:30', enabled: true, icon: 'Sunrise' },
  { id: 'afternoon', label: 'Recarga de Tarde', time: '14:30', enabled: true, icon: 'Sun' },
  { id: 'evening', label: 'Reflexión Nocturna', time: '21:00', enabled: true, icon: 'Moon' }
];

