/**
 * SVG Sanitizer for dynamic database icons and graphics.
 * Strips XSS attack vectors: script/object/embed/iframe/foreignObject/style/meta/link/audio/video tags,
 * inline on* event handlers, and dangerous URI schemes (javascript:, vbscript:, data:text/html, etc.),
 * while preserving valid vector graphic elements and presentation attributes.
 */

const DANGEROUS_TAGS = [
  'script',
  'object',
  'embed',
  'iframe',
  'link',
  'style',
  'meta',
  'foreignObject',
  'audio',
  'video',
  'applet',
  'base'
];

function decodeEntities(str: string): string {
  return str
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);?/gi, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&colon;/gi, ':');
}

export function sanitizeSvg(svg: string | null | undefined): string {
  if (typeof svg !== 'string' || !svg.trim()) {
    return '';
  }

  let sanitized = svg;
  let previous = '';

  // 1. Strip dangerous tags (and their contents where applicable) iteratively
  while (previous !== sanitized) {
    previous = sanitized;

    for (const tag of DANGEROUS_TAGS) {
      // Strip paired tag with content: <tag ...>...</tag>
      const pairedRegex = new RegExp(`<\\s*${tag}\\b[^>]*>[\\s\\S]*?<\\s*\\/\\s*${tag}\\s*>`, 'gi');
      sanitized = sanitized.replace(pairedRegex, '');

      // Strip self-closing or unclosed single tags: <tag ... /> or </tag>
      const singleRegex = new RegExp(`<\\s*\\/?\\s*${tag}\\b[^>]*\\/?>`, 'gi');
      sanitized = sanitized.replace(singleRegex, '');
    }
  }

  // 2. Strip event handler attributes (e.g. onload=..., onclick=..., onanimationstart=...)
  sanitized = sanitized.replace(/\s+on[a-z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  sanitized = sanitized.replace(/\s+on[a-z0-9_-]+(?=[\s>/])/gi, '');

  // 3. Strip dangerous URI schemes in attributes (href, xlink:href, src, etc.)
  sanitized = sanitized.replace(/\s+([a-z0-9:_-]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, (match, attrName, attrVal) => {
    if (/^on[a-z]/i.test(attrName)) {
      return '';
    }

    const unquoted = attrVal.replace(/^["']|["']$/g, '').trim();
    const normalized = decodeEntities(unquoted).replace(/[\u0000-\u0020]/g, '');

    if (/^(javascript|vbscript|data:text\/html)/i.test(normalized)) {
      return '';
    }

    if (/^data:image\/svg\+xml/i.test(normalized) && /script|onload/i.test(normalized)) {
      return '';
    }

    return match;
  });

  return sanitized;
}
