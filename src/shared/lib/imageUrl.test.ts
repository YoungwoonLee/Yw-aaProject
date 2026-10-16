import { describe, it, expect } from 'vitest';
import { buildContentImageUrl, buildProfileImageUrl } from './imageUrl';

describe('imageUrl builder utilities', () => {
  it('appends content image resize parameters', () => {
    const url = 'https://cdn.ondaji.com/images/sample.jpg';
    const result = buildContentImageUrl(url);
    expect(result).toContain('w=860');
    expect(result).toContain('type=w');
    expect(result).toContain('quality=90');
  });

  it('appends profile image resize parameters', () => {
    const url = 'https://cdn.ondaji.com/profiles/avatar.png';
    const result = buildProfileImageUrl(url);
    expect(result).toContain('w=34');
    expect(result).toContain('h=34');
    expect(result).toContain('type=f');
    expect(result).toContain('quality=90');
  });

  it('handles empty input gracefully', () => {
    expect(buildContentImageUrl('')).toBe('');
    expect(buildProfileImageUrl(null)).toBe('');
  });
});
