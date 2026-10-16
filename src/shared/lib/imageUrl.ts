/**
 * 이미지 URL 리사이즈 옵티마이저 유틸
 * - 본문 이미지: ?w=860&type=w&quality=90
 * - 프로필 이미지: ?w=34&h=34&type=f&quality=90
 */

export function buildContentImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  // 외부 더미/placeholder (예: picsum) 또는 이미 최적화 파라미터가 있는 경우 병합
  try {
    const urlObj = new URL(url, 'https://ondaji.cdn.mock');
    urlObj.searchParams.set('w', '860');
    urlObj.searchParams.set('type', 'w');
    urlObj.searchParams.set('quality', '90');
    return urlObj.origin === 'https://ondaji.cdn.mock'
      ? `${urlObj.pathname}${urlObj.search}`
      : urlObj.toString();
  } catch {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=860&type=w&quality=90`;
  }
}

export function buildProfileImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  try {
    const urlObj = new URL(url, 'https://ondaji.cdn.mock');
    urlObj.searchParams.set('w', '34');
    urlObj.searchParams.set('h', '34');
    urlObj.searchParams.set('type', 'f');
    urlObj.searchParams.set('quality', '90');
    return urlObj.origin === 'https://ondaji.cdn.mock'
      ? `${urlObj.pathname}${urlObj.search}`
      : urlObj.toString();
  } catch {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=34&h=34&type=f&quality=90`;
  }
}
