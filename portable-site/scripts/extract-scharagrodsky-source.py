"""Extract the supplied 18-page PDF without using the abridged narration.

Usage: python scripts/extract-scharagrodsky-source.py SOURCE.pdf
Requires PyMuPDF for this editorial step only; the site consumes checked-in JSON.
Line wrapping/zero-width paragraph terminators are normalized, never OCR-rewritten.
"""
import json, re, sys
from pathlib import Path
import fitz

target = Path(__file__).resolve().parents[1] / 'src/scharagrodsky/academic-source.json'
pdf = fitz.open(sys.argv[1])
assert len(pdf) == 18
headings = [
    ('introduccion', 'Introducción'),
    ('sistema', 'El Sistema Argentino de Educación Física'),
    ('antecedentes', 'Las disputas con la educación física militarizada: sus antecedentes'),
    ('fisiologia', 'Hacia una fisiología ‘política’ del ejercicio. Consecuencias pedagógicas'),
    ('inef', 'El ‘combate’ por el Instituto Nacional de Educación Física'),
    ('treinta', 'Doble golpe: el golpe militar de 1930 y el golpe a la propuesta ‘romerista’'),
    ('finales', 'Consideraciones finales'),
]
sections = [{'id': 'epigrafes', 'title': 'Epígrafes', 'paragraphs': []}]
current = sections[0]
notes, bibliography, title_lines = [], [], []
pending = ''
pending_kind = None
pending_page = None
note_references = []

def clean(text):
    return re.sub(r'\s+', ' ', text.replace('\u200b', '')).strip()

def flush():
    global pending, pending_kind, pending_page
    if clean(pending):
        current['paragraphs'].append({'text': clean(pending), 'kind': pending_kind, 'page': pending_page})
    pending = ''
    pending_kind = None

for pi, page in enumerate(pdf):
    blocks = sorted((b for b in page.get_text('dict')['blocks'] if 'lines' in b), key=lambda b: b['bbox'][1])
    for block in blocks:
        spans = [s for line in block['lines'] for s in line['spans'] if s['text'].strip().strip('\u200b')]
        if not spans:
            continue
        text = ' '.join(''.join(s['text'] for s in line['spans']) for line in block['lines'])
        # Notes use a small superscript at the start of a separate lower-page block.
        first = spans[0]
        number = int(first['text'].strip()) if first['size'] < 7 and first['text'].strip().isdigit() else None
        if number:
            assert number == len(notes) + 1, (pi + 1, number)
            notes.append({'number': number, 'page': pi + 1, 'text': clean(re.sub(r'^\s*' + str(number), '', text, count=1))})
            continue
        # Note 17 runs from page 8 to the lower margin of page 9, before note 18.
        if pi == 8 and 530 < block['bbox'][1] < 550 and text.strip().startswith('ello dejar'):
            notes[-1]['text'] += ' ' + clean(text)
            notes[-1]['continuedOnPage'] = 9
            continue
        if pi >= 14:
            for line in block['lines']:
                value = clean(''.join(s['text'] for s in line['spans']))
                if not value or value in ['Bibliografía', 'Fuentes primarias']:
                    continue
                if line['bbox'][0] < 60 or not bibliography:
                    bibliography.append(value)
                else:
                    bibliography[-1] += ' ' + value
            continue
        if pi == 0 and max(s['size'] for s in spans) > 19:
            title_lines.append(clean(text))
            continue
        if pi == 0 and text.strip().startswith('Pablo Ariel'):
            continue
        for line in block['lines']:
            raw = ''
            for span in line['spans']:
                token = span['text']
                if span['size'] < 7 and token.strip().isdigit():
                    number = int(token.strip())
                    raw += '[[note:' + str(number) + ']]'
                    note_references.append(number)
                else:
                    raw += token
            value = clean(raw)
            if not value:
                continue
            heading = next((h for h in headings if h[1] == value), None)
            if heading:
                flush()
                current = {'id': heading[0], 'title': heading[1], 'paragraphs': []}
                sections.append(current)
                continue
            kind = 'quote' if line['bbox'][0] >= 70 or current['id'] == 'epigrafes' or max(s['size'] for s in line['spans']) <= 10.1 else 'body'
            if pending and pending_kind != kind:
                flush()
            pending_kind = kind
            pending_page = pending_page if pending else pi + 1
            pending += (' ' if pending else '') + raw
            if '\u200b' in raw:
                flush()
        # A distinct quote block is a paragraph; merge across pages only when unfinished.
        if pending and (current['id'] == 'epigrafes' or clean(pending).endswith(('.', ':', '”', '’'))):
            flush()
flush()
assert len(notes) == 29
assert sorted(note_references) == list(range(2, 30)), note_references
assert len(sections) == 8
data = {'title': 'La constitución de la educación física escolar en la Argentina.',
        'subtitle': 'Tensiones, conflictos y disputas con la matriz militar en las primeras décadas del siglo XX',
        'author': 'Pablo Ariel Scharagrodsky', 'sections': sections, 'endnotes': notes, 'bibliography': bibliography}
target.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
print(f'{len(sections)} sections; {sum(len(s["paragraphs"]) for s in sections)} paragraphs; {len(notes)} notes; {len(bibliography)} references')
