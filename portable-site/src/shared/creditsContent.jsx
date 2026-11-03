const link = (href, children) => <a href={href} target="_blank" rel="noreferrer">{children}</a>;

export const creditsContent = {
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
