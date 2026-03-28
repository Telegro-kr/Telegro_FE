const HTML_ENTITY_MAP: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
};

const decodeHtmlEntities = (value: string) =>
  value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, rawCode) => {
    const code = rawCode.toLowerCase();

    if (code in HTML_ENTITY_MAP) {
      return HTML_ENTITY_MAP[code];
    }

    if (code.startsWith('#x')) {
      const parsed = Number.parseInt(code.slice(2), 16);
      return Number.isNaN(parsed) ? entity : String.fromCodePoint(parsed);
    }

    if (code.startsWith('#')) {
      const parsed = Number.parseInt(code.slice(1), 10);
      return Number.isNaN(parsed) ? entity : String.fromCodePoint(parsed);
    }

    return entity;
  });

export const stripHtmlToText = (value?: string) =>
  decodeHtmlEntities(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
