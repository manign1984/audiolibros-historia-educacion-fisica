// Programa historia UNAHUR 2024–2025, secciones de contenidos y bibliografía obligatoria.
// La bibliografía figura en una lista general. Cada obra obligatoria se ubica en
// la unidad cuyo contenido corresponde a la lectura ofrecida por la biblioteca.
export const programGroups = [
  { id: 'unidad-1', title: 'Unidad 1', subtitle: 'Introducción a la Historia de la Educación y la Educación Física' },
  { id: 'unidad-2', title: 'Unidad 2', subtitle: 'Conformación del Estado nacional y educación del cuerpo' },
  { id: 'unidad-3', title: 'Unidad 3', subtitle: 'Sistemas educativos y escolarización masiva (1880–1930)' },
  { id: 'unidad-4', title: 'Unidad 4', subtitle: 'La educación y la Educación Física (1930–1955)' },
  { id: 'unidad-5', title: 'Unidad 5', subtitle: 'La educación y la Educación Física (1956–1983 y 1983–2021)' },
  { id: 'complementaria', title: 'Complementaria' },
];

export const programGroupByWork = new Map([
  ['braudel-historia-duraciones', 'unidad-1'],
  ['hobsbawm-historia-siglo-xx', 'unidad-1'],
  ['marcaida-scaltritti-estado-nacional', 'unidad-2'],
  ['soares-corrientes-gimnasticas', 'unidad-2'],
  ['galak-del-dicho-al-hecho', 'unidad-3'],
  ['lionetti-escuela-republicana', 'unidad-3'],
  ['scharagrodsky-constitucion-ef', 'unidad-3'],
  ['tedesco-educacion-sociedad', 'unidad-3'],
  ['aisenstein-melano-martinez-autonomia', 'unidad-4'],
  ['orbuch-peronismo-educacion-fisica', 'unidad-4'],
  ['pineau-fresco-noble', 'unidad-4'],
  ['torre-pastoriza-bienestar', 'unidad-4'],
  ['feldfeber-gluz-politicas', 'unidad-5'],
  ['levoratti-debates-ef', 'unidad-5'],
  ['melano-aisenstein-ultima-dictadura', 'unidad-5'],
  ['pineau-reprimir-discriminar', 'unidad-5'],
  ['puiggros-que-paso', 'unidad-5'],
  ['vassiliades-politicas-docentes', 'unidad-5'],
]);
