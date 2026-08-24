import accessibleText from './orbuch-texto-accesible.txt?raw';
import { buildOrbuchReadingDocument } from './buildReadingDocument.js';

export const orbuchReadingDocument = buildOrbuchReadingDocument(accessibleText);
