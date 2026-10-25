import { describe, it, expect } from 'vitest';
import { sanitizeSvg } from './sanitize-svg';
import seedData from '../../supabase/seed.json';

describe('sanitizeSvg', () => {
  it('returns an empty string for null, undefined, or empty/whitespace input', () => {
    expect(sanitizeSvg(null)).toBe('');
    expect(sanitizeSvg(undefined)).toBe('');
    expect(sanitizeSvg('')).toBe('');
    expect(sanitizeSvg('   ')).toBe('');
    // @ts-expect-error test non-string types
    expect(sanitizeSvg(123)).toBe('');
  });

  it('preserves valid SVG vector graphics intact', () => {
    const valid = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none"><path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor"/></svg>';
    expect(sanitizeSvg(valid)).toBe(valid);

    // Verify all seed icons pass through without being altered
    for (const skill of seedData.skills) {
      expect(sanitizeSvg(skill.logo_svg)).toBe(skill.logo_svg);
    }
    for (const cred of seedData.credentials) {
      expect(sanitizeSvg(cred.scope_icon_svg)).toBe(cred.scope_icon_svg);
    }
    for (const link of seedData.contact_links) {
      expect(sanitizeSvg(link.icon_svg)).toBe(link.icon_svg);
    }
  });

  it('strips script tags and their inner content', () => {
    const input = '<svg><script>alert(1)</script><path d="M1 1h2v2H1z"/></svg>';
    const output = sanitizeSvg(input);
    expect(output).not.toContain('<script');
    expect(output).not.toContain('alert(1)');
    expect(output).toContain('<path d="M1 1h2v2H1z"/>');
  });

  it('strips inline event handler attributes', () => {
    const input = '<svg onload="alert(1)"><circle cx="10" cy="10" r="5" onerror="steal()"/></svg>';
    const output = sanitizeSvg(input);
    expect(output).not.toContain('onload');
    expect(output).not.toContain('onerror');
    expect(output).toContain('<circle cx="10" cy="10" r="5"/>');
  });

  it('strips dangerous javascript: URIs from href attributes', () => {
    const input = '<svg><a href="javascript:alert(1)"><path d="M0 0h10v10H0z"/></a></svg>';
    const output = sanitizeSvg(input);
    expect(output).not.toContain('javascript:');
    expect(output).not.toContain('alert(1)');
    expect(output).toContain('<path d="M0 0h10v10H0z"/>');
  });

  it('strips foreignObject, iframe, and embedded elements', () => {
    const input = '<svg><foreignObject><iframe src="malicious.html"/></foreignObject></svg>';
    const output = sanitizeSvg(input);
    expect(output).not.toContain('foreignObject');
    expect(output).not.toContain('iframe');
    expect(output).not.toContain('malicious.html');
  });

  it('handles obfuscated, uppercase, and nested tags', () => {
    const input = '<svg><SCR<script>IPT>alert("xss")</SCR</script>IPT><rect width="10" height="10"/></svg>';
    const output = sanitizeSvg(input);
    expect(output.toLowerCase()).not.toContain('script');
    expect(output).not.toContain('alert');
    expect(output).toContain('<rect width="10" height="10"/>');
  });
});
