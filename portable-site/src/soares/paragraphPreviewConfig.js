// Configuración elegida para el candidato de Soares: seguimiento aproximado por párrafos.
// Las marcas del VTT no se presentan como alineación acústica certificada.
import { soaresReaderConfig } from './readerConfig.js';
import paragraphPreview from './paragraphPreviewTimings.json' with { type: 'json' };

export const soaresParagraphPreviewConfig = {
  ...soaresReaderConfig,
  storage: {
    notesKey: 'soares-corrientes-gimnasticas-paragraph-notes-v1',
    stateKey: 'soares-corrientes-gimnasticas-paragraph-state-v1',
  },
  export: {
    ...soaresReaderConfig.export,
    jsonFileName: 'notas-soares-parrafos.json',
    textFileName: 'cuaderno-soares-parrafos.txt',
  },
  sync: {
    ...soaresReaderConfig.sync,
    unit: 'paragraph',
    status: 'paragraph-preview',
    paragraphTimings: paragraphPreview.paragraphTimings,
    launcherDescription: 'Leé y escuchá con resaltado aproximado por párrafos, guiado por los subtítulos del audio.',
    featureTitle: 'Seguimiento por párrafos',
    featureDescription: 'Resaltado aproximado según el VTT; podés leer, escuchar y anotar.',
    coverMessage: 'Seguimiento aproximado por párrafos según los subtítulos. El audio se reproduce desde la biblioteca; las notas y la bibliografía no se narran.',
  },
};
