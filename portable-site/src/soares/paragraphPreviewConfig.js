// SOLO para pruebas locales con el documento y audio privados ya auditados.
// No sustituye la configuración principal de Soares ni certifica tiempos acústicos.
import { soaresReaderConfig } from './readerConfig.js';
import paragraphPreview from './paragraphPreviewTimings.json';

export const soaresParagraphPreviewConfig = {
  ...soaresReaderConfig,
  storage: {
    notesKey: 'soares-corrientes-gimnasticas-paragraph-preview-notes-v1',
    stateKey: 'soares-corrientes-gimnasticas-paragraph-preview-state-v1',
  },
  export: {
    ...soaresReaderConfig.export,
    jsonFileName: 'notas-soares-parrafos-PILOTO.json',
    textFileName: 'cuaderno-soares-parrafos-PILOTO.txt',
  },
  sync: {
    ...soaresReaderConfig.sync,
    unit: 'paragraph',
    status: 'paragraph-preview',
    paragraphTimings: paragraphPreview.paragraphTimings,
    launcherDescription: 'Prueba local: el texto acompaña el audio resaltando párrafos según tiempos estimados del VTT.',
    featureTitle: 'Lectura por párrafos · prueba',
    featureDescription: 'Seguimiento aproximado por párrafos. No constituye sincronización acústica certificada.',
    coverMessage: 'Piloto de seguimiento por párrafos derivado de los subtítulos. Los cambios pueden adelantarse o retrasarse; notas y bibliografía no se narran.',
  },
};
