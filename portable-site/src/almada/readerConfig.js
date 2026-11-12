// Configuración audiovisual propia de Cecilia Almada. Mantiene intacto el lector compartido.
export function createAlmadaReaderConfig(assetBase) {
  return {
    workId: 'almada-privilegiados',
    textOnly: false,
    mark: 'CA',
    shortTitle: 'Los privilegiados',
    authorAndTitle: 'Cecilia Almada · Los privilegiados en la Nueva Argentina',
    experienceName: 'Los privilegiados en la Nueva Argentina',
    editorialReferenceLabel: 'del artículo de Cecilia Almada',
    audiobookExternalUrl: 'https://drive.google.com/file/d/17hNcfspCj6AdsvNYtWiYOTMzgUEXam3j/view',
    audiobookParts: Array.from({ length: 24 }, (_, index) =>
      assetBase + 'audio/audio-' + String(index).padStart(2, '0') + '.part'),
    expectedAudioBytes: 14237103,
    textUrl: assetBase + 'texto-academico.txt',
    sourceUrl: 'https://doi.org/10.21680/2596-0113.2020v3n0ID21434',
    sync: {
      status: 'paragraph-preview',
      unit: 'paragraph',
      launcherTitle: 'Lectura y audio',
      launcherDescription: 'Leé y escuchá el texto, consultá sus notas académicas y guardá tus anotaciones.',
      featureTitle: 'Seguimiento aproximado por párrafos',
      featureDescription: 'Durante la reproducción se destaca el párrafo correspondiente del artículo.',
      coverMessage: 'La lectura sonora acompaña el texto académico con seguimiento aproximado por párrafos.',
    },
    readingEntry: {
      author: 'Cecilia Almada',
      audioMinutes: 24,
      title: 'Los privilegiados en la Nueva Argentina. La cultura física y el deporte en la política del peronismo',
      synopsis: 'Cecilia Almada estudia cómo el primer peronismo convirtió la cultura física y el deporte en instrumentos de política pública. A partir de documentos y testimonios, examina el papel de la Fundación Eva Perón y muestra cómo los campeonatos infantiles combinaron ampliación de derechos, vigilancia sanitaria y formación ciudadana.',
    },
    pageMeta: 'Cecilia Almada · HistELA · 2020',
    footerLabel: 'Texto académico · audiolibro · cuaderno de lectura',
    downloadTextName: 'almada-texto-academico.txt',
    storage: {
      notesKey: 'almada-privilegiados-audio-notes-v1',
      stateKey: 'almada-privilegiados-audio-state-v1',
    },
    export: {
      textFileName: 'cuaderno-almada-privilegiados.txt',
      jsonFileName: 'cuaderno-almada-privilegiados.json',
      shareTitle: 'Cuaderno de lectura · Los privilegiados en la Nueva Argentina',
    },
  };
}
