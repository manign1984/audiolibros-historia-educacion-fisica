const link = (href, children) => <a href={href} target="_blank" rel="noreferrer">{children}</a>;

export const creditsContent = {
  arataMarino: {
    references: [
      <>Arata, N., y Mariño, M. (2013). Auroras y tempestades: la educación entre golpes (1955–1976). En <em>La educación en la Argentina: Una historia en 12 lecciones</em> (lección 10). Ediciones Novedades Educativas.</>,
      link('https://www.noveduc.com/us/productos/educacion-en-la-argentina-la/', 'Ediciones Novedades Educativas · información de la obra y sus doce lecciones'),
      link('https://digital.noveduc.com/library/publication/la-educacion-en-la-argentina', 'Edición digital de La educación en la Argentina'),
      link('https://drive.google.com/file/d/1VDx21Jv3R32WhiafyPGEslLji5lRPjCD/view', 'Audiolibro de Auroras y tempestades · narración de la lección 10'),
      link('https://drive.google.com/file/d/1qa4ypdD3Xu9hE8x3NaqvtvngQZyIagLW/view', 'Marcas temporales SRT de la narración'),
      link('https://iice.institutos.filo.uba.ar/integrante/arata-nicol%C3%A1s', 'Instituto de Investigaciones en Ciencias de la Educación (UBA) · Nicolás Arata'),
      link('https://bnm.educacion.gob.ar/marcelo-marino-de-la-tertulia-al-repositorio/', 'Biblioteca Nacional de Maestros · Marcelo Mariño'),
      link('https://www.saiehe.org.ar/anuario/revista/article/view/360', 'Anuario de Historia de la Educación · reseña del libro de Arata y Mariño'),
    ],
    rights: [
      <>Texto académico: Nicolás Arata y Marcelo Mariño, <em>La educación en la Argentina. Una historia en 12 lecciones</em>, Ediciones Novedades Educativas (2013).</>,
      <>Audiolibro y marcas temporales de la lección aportados al proyecto +TEC UNAHUR. La lectura dispone de seguimiento orientativo por párrafos, bibliografía y cuaderno personal de anotaciones.</>,
      <>Composiciones gráficas de Inicio y Autor: elaboración tipográfica original de +TEC UNAHUR. La imagen de autoría doble es una ilustración editorial, no una fotografía de Nicolás Arata y Marcelo Mariño.</>,
    ],
  },
  melano: {
    references: [
      <>Melano, I. (2025). Militares al gobierno, juramentados al poder: la reapertura del INEF Gral. Belgrano en la década del 70. En <em>Formar líderes y salvar a los jóvenes. Claves para comprender la cultura escolar del Instituto Nacional de Educación Física General Belgrano</em> (cap. 6, pp. 131–149). EdUNLu.</>,
      link('https://drive.google.com/file/d/11kPIjFdMMIAwgfiukL0VenWDqloa10oB/view', 'Capítulo 6 · archivo PDF original con notas al pie'),
      link('https://drive.google.com/file/d/15bo6oZeE9vhYWFbytFNyZCCSvcQGIg0f/view', 'Ministerio de Cultura y Educación (1977). Resolución 543/77, 11 de abril'),
      <>Entrevista a Juan Carlos Cutrera publicada en <em>En Movimiento</em>, n.º 3 (1978), pp. 46–47. Fragmento reproducido por Melano en la p. 146.</>,
    ],
    rights: [
      <>Retrato de Ignacio Melano: fotografía facilitada personalmente por el autor para esta página.</>,
      <>Texto académico de la selección preparada a partir del capítulo original: conserva las citas y las veinte notas de la edición impresa. La copia de locución elimina las referencias bibliográficas que no se pronuncian.</>,
      <>Contexto y portada: síntesis y composición contemporáneas del proyecto +TEC UNAHUR. La línea de fechas y la composición de portada no son imágenes de época.</>,
      <>Las fuentes históricas se presentan con identificación de procedencia. No se declara licencia abierta sobre el capítulo ni sobre el retrato.</>,
    ],
  },
  lionetti: {
    references: [
      <>Lionetti, L. (2005). La función republicana de la escuela pública: la formación del ciudadano en Argentina a fines del siglo XIX. <em>Revista Mexicana de Investigación Educativa, 10</em>(27), 1225–1255.</>,
      link('https://ojs.rmie.mx/index.php/rmie/article/view/1511', 'Revista Mexicana de Investigación Educativa · artículo y referencia editorial'),
      link('https://www.scielo.org.mx/scielo.php?lng=es&nrm=iso&pid=S1405-66662005000401225&script=sci_arttext_plus&tlng=es', 'SciELO México · texto de acceso abierto'),
      link('https://iehs.unicen.edu.ar/LuciaLionetti.html', 'IEHS / UNICEN · trayectoria de Lucía Lionetti'),
    ],
    rights: [
      <>Esta edición de la Biblioteca +TEC utiliza el texto académico facilitado para la cátedra. Conserva las notas, la bibliografía y las referencias originales.</>,
      <>El artículo está disponible en acceso abierto desde la revista y SciELO; consultar las condiciones de uso en las fuentes de publicación.</>,
      <>Recorrido de lectura sin audio. Las anotaciones y el progreso se guardan exclusivamente en este navegador y pueden exportarse.</>,
      <>Portada tipográfica y tres perspectivas de Contexto: elaboración didáctica del proyecto +TEC UNAHUR; no son documentos de época.</>,
    ],
  },
  soares: {
    references: [
      <>Soares, C. L. (2006). Las corrientes gimnásticas europeas y su contenido: una historia de rupturas y permanencias. En R. Rozengardt (Coord.), <em>Apuntes de historia para profesores de Educación Física</em> (pp. 223–242). Miño y Dávila.</>,
      <>Versión en español de Esteban Manuel Barcelona. Copia de cátedra de 16 páginas, con 29 notas y bibliografía.</>,
      link('https://www.metmuseum.org/art/collection/search/291656', 'Georges Demeny, [Fencer], 1906 · The Metropolitan Museum of Art, 2010.1'),
      link('https://portal.fe.unicamp.br/noticias/nota-de-falecimento-profa-carmen-lucia-soares/', 'Facultad de Educación · UNICAMP · Retrato y trayectoria'),
    ],
    rights: [
      <>Fotografía de Demeny: dominio público. Crédito: Purchase, Alfred Stieglitz Society Gifts, 2010.</>,
      <>Texto y traducción de la edición utilizada: copia de cátedra incorporada al lector. Audiolibro: grabación del proyecto disponible en el lector de la biblioteca; versión original conservada en Drive. No se declara licencia abierta.</>,
      <>El audio abrevia referencias. Las notas y la bibliografía están disponibles en la lectura y no se narran. El seguimiento por párrafos es aproximado.</>,
      <>Contexto: síntesis didácticas del proyecto. +TEC · Universidad Nacional de Hurlingham.</>,
    ],
  },
  scharagrodsky: {
    references: [
      <>Scharagrodsky, P. A. (2011). La constitución de la educación física escolar en la Argentina. Tensiones, conflictos y disputas con la matriz militar en las primeras décadas del siglo XX. En P. Scharagrodsky (Comp.), <em>La invención del homo gymnasticus: Fragmentos históricos sobre la educación de los cuerpos en movimiento en Occidente</em>. Prometeo.</>,
      <>{link('/assets/scharagrodsky-constitucion-ef.pdf', 'PDF de cátedra · 18 páginas')} · {link('/assets/scharagrodsky-texto-academico.txt', 'Texto académico')} · {link('/assets/scharagrodsky-audiolibro.mp3', 'Audiolibro · 51:23')}.</>,
      link('https://www.memoria.fahce.unlp.edu.ar/library?a=d&c=libros&d=Jpm3195', 'Memoria Académica, UNLP · Identificación del capítulo'),
      link('https://agencia.unq.edu.ar/?p=8369', 'Agencia de Noticias Científicas de la UNQ (2022) · Biografía y retrato'),
    ],
    rights: [
      <>Texto y audiolibro aportados al proyecto para el trabajo de la cátedra. No se declara una licencia abierta.</>,
      <>La grabación no incluye los epígrafes, las notas ni la bibliografía y abrevia referencias entre paréntesis, conservadas en el texto.</>,
      <>Retrato: Agencia de Noticias Científicas de la UNQ. Portada conceptual y síntesis de Contexto: elaboración didáctica del proyecto; no son documentos históricos ni citas literales.</>,
      <>Proyecto +TEC · UNAHUR. Agradecemos a quienes compartieron los materiales para acompañar el estudio y la formación docente.</>,
    ],
  },
  marcaida: {
    references: [
      <>Marcaida, E., &amp; Scaltritti, M. (2013). La construcción del Estado nacional argentino (1852–1880). En <em>Historia argentina contemporánea: Pasados presentes de la política, la economía y el conflicto social</em> (pp. 49–60). Dialektik. Primera edición, segunda reimpresión.</>,
      <>{link('/assets/marcaida-scaltritti-estado-nacional.pdf', 'PDF de cátedra')} · {link('/assets/marcaida-texto-accesible.txt', 'Texto accesible con bibliografía')} · {link('https://cedinpe.unsam.edu.ar/sites/default/files/pdfs/scaltritti-historia_reciente.pdf', 'Edición editorial original')}.</>,
      link('https://drive.google.com/file/d/1OdJmzsqdlV-xaPx7uyYaej8PJBL6QZ9s/view', 'Audiolibro aportado al proyecto · 33:46.'),
      <>Trayectorias: {link('https://www.pagina12.com.ar/diario/universidad/10-195385-2012-06-01.html', 'Elena Marcaida · Página/12, 2012')} · {link('https://centroderecursosnormal1.blogspot.com/2011/05/', 'Mabel Scaltritti · Escuela Normal N.º 1, 2011')} · {link('https://www.bnm.me.gov.ar/giga1/documentos/EL001102.pdf', 'Cuadernos para el aula · Ministerio de Educación')}.</>,
    ],
    rights: [
      <>Lectura, escucha y anotaciones por párrafo. El seguimiento del audio es orientativo.</>,
      <>Texto y audio aportados para el trabajo didáctico. No se declara una licencia abierta ni una autorización de redistribución no documentada.</>,
      <>Portada y diagramas de Contexto: elaboración editorial del proyecto. No son imágenes históricas, mapas territoriales ni citas textuales.</>,
      <>Proyecto +TEC · UNAHUR. Agradecemos a quienes compartieron los materiales para acompañar la lectura y el estudio autónomo.</>,
    ],
  },
  aisenstein: {
    references: [
      <>Aisenstein, Á. (2006). ¿Hacemos tabla rasa del pasado? El saber histórico en la formación docente en Educación Física. En Á. Aisenstein y P. Scharagrodsky (coords.), <em>Tras las huellas de la Educación Física escolar argentina. Cuerpo, género y pedagogía, 1880–1950</em> (pp. 237–246). Prometeo.</>,
      link('https://udesa.edu.ar/cuerpo-docente/angela-aisenstein', <>Universidad de San Andrés. <em>Ángela Aisenstein</em>. Perfil y fotografía académica.</>),
      <>Audiolibro y 320 subtítulos corregidos aportados al proyecto +TEC UNAHUR para esta lectura.</>,
      <>La sección Contexto adapta didácticamente las tres perspectivas de investigación histórica tratadas en el capítulo; no constituye una cita textual.</>,
      link('https://wellcomecollection.org/works/wxnc8jhk', <>GutsMuths, J. C. F. (1793). <em>Gymnastik für die Jugend</em>. Frontispicio de la primera edición. Wellcome Collection.</>),
    ],
    rights: [
      <>Texto académico y grabación aportados para el trabajo didáctico de la cátedra; no se declara una licencia abierta para su redistribución.</>,
      <>Los tiempos de inicio de oración fueron interpolados desde el VTT aportado; requieren una última revisión editorial respecto del audio.</>,
      <>Composición visual del bloque Inicio: incorpora un detalle del frontispicio de <em>Gymnastik für die Jugend</em> (1793), de Johann Christoph Friedrich GutsMuths. La figura central representa a Higía, diosa griega de la salud.</>,
      <>Retrato de Ángela Aisenstein: Universidad de San Andrés, perfil académico.</>,
      <>Proyecto +TEC · UNAHUR. Historia de la Educación Física: lectura accesible y trabajo autónomo.</>,
    ],
  },
  pineau: {
    references: [
      link('/assets/pineau-renovacion-represion-cooptacion.pdf', <>Pineau, P. (1999). Renovación, represión, cooptación: Las estrategias de la Reforma Fresco–Noble (Provincia de Buenos Aires, década del 30). En A. Ascolani (Comp.), <em>La educación en Argentina: Estudios de historia</em> (pp. 223–239). Ediciones del Arca.</>),
      link('https://drive.google.com/file/d/17w1Pw25aGLXu_cR9mRBZgIOnCG2qNAEm/view', <>Pineau, P. (1999). <em>Renovación, represión, cooptación</em> [Audiolibro].</>),
      link('https://revistas.unal.edu.co/index.php/hisysoc/article/view/28146', <>Cataño Balseiro, C. L. (2011). Jörn Rüsen y la conciencia histórica. <em>Historia y Sociedad</em>, (21), 223–245.</>),
      link('https://www.educ.ar/recursos/127077/1930-1943-la-decada-infame', <>Educ.ar. (2015). <em>1930–1943: La década infame</em> [Video].</>),
      link('https://posgrado.filo.uba.ar/pineau-pablo', <>Universidad de Buenos Aires, Facultad de Filosofía y Letras. (s. f.). <em>Pablo Pineau</em>.</>),
      link('https://history.state.gov/milestones/1921-1936/great-depression', <>Office of the Historian. (s. f.). <em>The Great Depression and U.S. foreign policy</em>.</>),
      link('https://encyclopedia.ushmm.org/content/en/article/the-nazi-rise-to-power', <>United States Holocaust Memorial Museum. (s. f.). <em>The Nazi rise to power</em>.</>),
      link('https://www.youtube.com/watch?v=cbrqOu1pQU0', <>Canal Encuentro. (s. f.). <em>Manuel Fresco</em> [Video].</>),
      link('https://ir.grupoclarin.com/historia/', <>Grupo Clarín. (s. f.). <em>Historia</em>.</>),
    ],
    rights: [
      <>Cancha, banderas y jugadores: imágenes desarrolladas para la dinámica pedagógica original.</>,
      <>Portal del Cementerio de Saldungaray: Marcelo G. Morales, CC BY-SA 3.0, Wikimedia Commons.</>,
      <>Imágenes de la línea de tiempo: créditos y licencias indicados en cada hito.</>,
      <>Portada de <em>La educación física: una innovación de mi gobierno</em> (1940): ejemplar aportado al proyecto.</>,
      <>Manuel Fresco: Cámara de Diputados de la Nación, dominio público.</>,
      <>Roberto Noble: Diario Clarín, 1945; dominio público en Argentina, vía Wikimedia Commons.</>,
      <>Pablo Pineau: perfil académico de FFyL-UBA.</>,
      <>Obras de Francisco Salamone en líneas: imágenes aportadas al proyecto. El diseño del recorrido se inspira en su geometría monumental.</>,
      <>Agradecemos a quienes compartieron documentos, registros e imágenes para enriquecer esta experiencia pedagógica.</>,
    ],
  },
  orbuch: {
    references: [
      link('https://periodicos.ufrn.br/histela/article/view/21435', <>Orbuch, I. P. (2020). Educar al cuerpo dentro y fuera del aula. Análisis de dos experiencias en la Nueva Argentina de Perón. <em>History of Education in Latin America, 3</em>, e21435.</>),
      link('/assets/orbuch-gimnasia-compensatoria-1949.pdf', <>Consejo Nacional de Educación Física. (1949). <em>Gimnasia compensatoria en el aula</em>. Autor atribuido: Alejandro Amavet.</>),
      link('/assets/orbuch-gimnasia-oficinas-1950.pdf', <>Consejo Nacional de Educación Física. (1950). <em>Gimnasia de oficinas</em>. Procedencia: Biblioteca César Vázquez.</>),
      <>Torre, J. C., &amp; Pastoriza, E. (2002). La democratización del bienestar. En J. C. Torre (Dir.), <em>Los años peronistas (1943–1955)</em> (pp. 257–312). Sudamericana.</>,
      <>Audiolibro de Orbuch y subtítulos aportados por el proyecto: {link('/assets/orbuch-audiolibro.mp3', 'MP3')} · {link('/assets/orbuch-subtitulos.srt', 'SRT')}.</>,
      link('https://aulaabierta.unahur.edu.ar/index.php/2020/01/08/investigacion-sub-40-ivan-orbuch/', <>Universidad Nacional de Hurlingham. (2020). <em>Investigación Sub 40: Iván Orbuch</em>. Fuente del retrato.</>),
    ],
    rights: [
      <>Cuadernillos de 1949 y 1950: copias digitales completas aportadas a las fuentes del proyecto. Licencia no consignada en los ejemplares digitales.</>,
      <>Texto, audiolibro y SRT aportados por el proyecto. Los 410 segmentos del SRT coinciden con el guion accesible; los tiempos se normalizaron a la duración del MP3.</>,
      <>Mural cívico-popular creado para el sitio original: evoca la cultura gráfica del primer peronismo; no reproduce un afiche histórico ni representa personas identificables.</>,
      <>Retrato de Iván Pablo Orbuch: Universidad Nacional de Hurlingham, perfil institucional <em>Investigación Sub 40</em> (2020).</>,
      <>Fuente Primaria · Historia de la Educación y de la Educación Física. Agradecemos a quienes aportaron textos, documentos y registros para este recorrido.</>,
    ],
  },
  hobsbawm: {
    references: [
      link('/assets/hobsbawm-vista-panoramica.pdf', <>Hobsbawm, E. (1999). Vista panorámica del siglo XX. En <em>Historia del siglo XX</em>. Crítica.</>),
      <>Selección y edición indicadas en el material de cátedra: este recorrido corresponde a la introducción seleccionada, no al libro completo.</>,
      link('https://drive.google.com/file/d/1-6LoX2kQ48lU-api_8N4PzsV2Ueycb41/view?usp=drivesdk', <>Hobsbawm, E. <em>Vista panorámica del siglo XX</em> [Audiolibro]. Grabación aportada por el proyecto.</>),
      link('https://www.bbk.ac.uk/about-us/obituaries/eric-hobsbawm-magnificent-historian-and-colleague', <>Birkbeck, University of London. <em>Eric Hobsbawm: magnificent historian and colleague</em>. Fuente biográfica.</>),
      <>{link('https://commons.wikimedia.org/wiki/File:A%C3%B1os_interesantes,_Eric_Hobsbawm_(cropped).jpg', 'Wikimedia Commons: retrato reproducido en Años interesantes')} (Crítica, 2003).</>,
      <>{link('/assets/hobsbawm-alineacion.srt', 'Tiempos SRT')}: alineación automática con la grabación, revisada por pasajes.</>,
    ],
    rights: [
      <>Texto y audiolibro aportados por el proyecto. La grabación omite seis pasajes, conservados y señalados dentro del lector.</>,
      <>Portada ilustrada compartida por el proyecto; se conserva la imagen original.</>,
      <>Retrato: autoría y fecha fotográfica no consignadas en la ficha. {link('https://creativecommons.org/licenses/by-sa/4.0/', 'CC BY-SA 4.0 según Wikimedia Commons')}. Se conserva el archivo fotográfico de procedencia.</>,
      <>La línea de tiempo es una síntesis didáctica de la lectura.</>,
      <>Proyecto +TEC · UNAHUR. Historia de la Educación Física: un espacio para leer, escuchar y acompañar el trabajo autónomo.</>,
      <>Agradecemos a quienes aportaron el material de cátedra, el audio y las imágenes de este recorrido.</>,
    ],
  },
};
