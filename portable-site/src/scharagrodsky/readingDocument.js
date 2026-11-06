import academic from './academic-source.json';
import alignment from './alignment.json';
import { buildScharagrodskyDocument } from './buildReadingDocument.js';

export const scharagrodskyReadingDocument = buildScharagrodskyDocument(academic, alignment);
