import source from './hobsbawm-source.txt?raw';
import timings from './timings.json';
import { buildHobsbawmReadingDocument } from './buildReadingDocument.js';
export const hobsbawmReadingDocument = buildHobsbawmReadingDocument(source, timings);
