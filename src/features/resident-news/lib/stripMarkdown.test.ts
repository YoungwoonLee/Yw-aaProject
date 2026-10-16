import { describe, it, expect } from 'vitest';
import { stripMarkdown } from './stripMarkdown';

describe('stripMarkdown', () => {
  it('strips headers, bold, list, and link symbols', () => {
    const raw = `### 10월 주민자치회 정기회의 안내
**일시**: 2026.10.15(목)
- 안건 1: 마을 가로등 개선
- 안건 2: [축제 공지](https://ondaji.com) 확인`;

    const cleaned = stripMarkdown(raw);
    expect(cleaned).toContain('10월 주민자치회 정기회의 안내');
    expect(cleaned).toContain('일시: 2026.10.15(목)');
    expect(cleaned).toContain('안건 1: 마을 가로등 개선');
    expect(cleaned).toContain('안건 2: 축제 공지 확인');
    expect(cleaned).not.toContain('###');
    expect(cleaned).not.toContain('**');
    expect(cleaned).not.toContain('http');
  });

  it('handles empty or null gracefully', () => {
    expect(stripMarkdown('')).toBe('');
    expect(stripMarkdown(null)).toBe('');
  });
});
