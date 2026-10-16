/**
 * 마크다운 기호(**, ###, -, [링크](url) 등)를 제거하여 순수 텍스트로 변환하는 유틸
 */
export function stripMarkdown(markdownText: string | null | undefined): string {
  if (!markdownText) return '';

  return markdownText
    // 헤더 기호 제거 (###, ##, #)
    .replace(/^#{1,6}\s+/gm, '')
    // 굵게/기울임 기호 제거 (***text***, **text**, *text*, __text__, _text_)
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // 취소선 제거 (~~text~~)
    .replace(/~~(.*?)~~/g, '$1')
    // 링크 ([text](url)) -> text
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    // 이미지 (![alt](url)) -> 제거
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // 인용문 (> text)
    .replace(/^>\s+/gm, '')
    // 목록 기호 (- item, * item, + item, 1. item)
    .replace(/^[\*\-+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // 인라인 코드 (`code`)
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
    // 수평선 (---, ***)
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // 연속 줄바꿈 및 다중 공백을 하나의 공백으로 치환
    .replace(/\s+/g, ' ')
    .trim();
}
