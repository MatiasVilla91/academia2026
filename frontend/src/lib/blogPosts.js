export const blogPosts = [
  {
    slug: 'que-es-el-tarot',
    title: 'Qué es el Tarot: Historia, Arcanos y Cómo Empezar a Leer las Cartas',
    description:
      'Descubrí el origen del tarot, la diferencia entre arcanos mayores y menores, las tiradas más populares y cómo aprender a leer las cartas desde cero.',
    date: '2026-04-30',
    category: 'tarot',
    readTime: 5,
    content: [
      {
        type: 'p',
        text: 'El tarot es un sistema de 78 cartas que se usa como herramienta de introspección, guía espiritual y lectura del inconsciente. Aunque su origen popular se asocia al misticismo, las primeras barajas de tarot aparecieron en el norte de Italia en el siglo XV como simples juegos de naipes. No fue hasta el siglo XVIII que ocultistas franceses comenzaron a utilizarlas con fines adivinatorios y esotéricos.',
      },
      {
        type: 'h2',
        text: 'Los 78 arcanos: ¿qué hay en una baraja de tarot?',
      },
      {
        type: 'p',
        text: 'La baraja se divide en dos grandes grupos:',
      },
      {
        type: 'ul',
        items: [
          'Arcanos Mayores (22 cartas): representan fuerzas arquetípicas, ciclos de vida y lecciones espirituales profundas. Empiezan con El Loco (0) y terminan con El Mundo (XXI). Cada carta lleva una energía universal: El Mago (acción y voluntad), La Sacerdotisa (intuición), La Torre (ruptura y transformación), entre otros.',
          'Arcanos Menores (56 cartas): divididos en cuatro palos —Bastos, Copas, Espadas y Pentáculos— que corresponden a los elementos fuego, agua, aire y tierra respectivamente. Reflejan situaciones cotidianas, emociones y dinámicas del día a día.',
        ],
      },
      {
        type: 'h2',
        text: '¿Para qué sirve el tarot?',
      },
      {
        type: 'p',
        text: 'Contrario a lo que muchos creen, el tarot no predice el futuro de manera determinista. Su verdadero poder está en actuar como espejo del inconsciente: las cartas invitan a reflexionar sobre una situación, explorar distintos ángulos y conectar con la intuición propia.',
      },
      {
        type: 'p',
        text: 'Las lecturas pueden usarse para:',
      },
      {
        type: 'ul',
        items: [
          'Obtener claridad en momentos de decisión',
          'Explorar emociones y patrones internos',
          'Establecer intenciones para un nuevo ciclo',
          'Conectar con la espiritualidad y el autoconocimiento',
        ],
      },
      {
        type: 'h2',
        text: 'Las tiradas más populares para empezar',
      },
      {
        type: 'p',
        text: 'Si estás dando tus primeros pasos, estas tiradas son ideales:',
      },
      {
        type: 'ol',
        items: [
          'Carta del día: sacá una sola carta cada mañana y reflexioná sobre qué mensaje trae para tu jornada.',
          'Tirada de tres cartas: pasado – presente – futuro, o situación – acción – resultado.',
          'Cruz celta: diez cartas que ofrecen una visión completa de una situación.',
        ],
      },
      {
        type: 'h2',
        text: '¿Cómo aprender a leer el tarot desde cero?',
      },
      {
        type: 'p',
        text: 'No existe un único camino correcto. Algunas personas estudian los significados de memoria; otras se dejan guiar por las imágenes y sus reacciones intuitivas. Lo más recomendado para principiantes es:',
      },
      {
        type: 'ol',
        items: [
          'Elegir una baraja que te llame visualmente (el Rider-Waite es el más usado para aprender).',
          'Estudiar los arcanos mayores primero antes de abordar los menores.',
          'Llevar un diario de tarot donde anotes tus lecturas y reflexiones.',
          'Practicar con tiradas simples antes de abordar las más complejas.',
        ],
      },
      {
        type: 'h2',
        text: 'El tarot como camino de autoconocimiento',
      },
      {
        type: 'p',
        text: 'Más allá de la adivinación, el tarot es una puerta al mundo interior. Cada consulta es una invitación a pausar, mirar hacia adentro y encontrar respuestas que muchas veces ya tenemos. No importa si empezás con curiosidad o con una pregunta concreta: el tarot siempre tiene algo para mostrarte.',
      },
    ],
  },
];

export function getPost(slug) {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}
