import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MediaCarousel } from './MediaCarousel';
import { ContentFile } from '../../../types/content';

describe('MediaCarousel', () => {
  it('renders nothing when files is empty (0 media case)', () => {
    const { container } = render(
      <MediaCarousel files={[]} contentTitle="테스트 제목" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders single image without n/N badge or dots indicator', () => {
    const singleFile: ContentFile[] = [
      {
        contentFileUrl: 'https://cdn.ondaji.com/images/1.jpg',
        contentFileType: 'IMG_FILE',
        displayOrder: 1,
        width: 800,
        height: 600,
      },
    ];

    render(<MediaCarousel files={singleFile} contentTitle="테스트 제목" />);

    // Region exists
    expect(screen.getByRole('region')).toBeDefined();
    // Image exists with alt text
    const img = screen.getByAltText('테스트 제목 이미지 1');
    expect(img).toBeDefined();

    // No 1/1 badge
    expect(screen.queryByText('1/1')).toBeNull();
  });

  it('renders multiple images with n/N badge and accessibility attributes', () => {
    const multipleFiles: ContentFile[] = [
      {
        contentFileUrl: 'https://cdn.ondaji.com/images/1.jpg',
        contentFileType: 'IMG_FILE',
        displayOrder: 1,
        width: 800,
        height: 600,
      },
      {
        contentFileUrl: 'https://cdn.ondaji.com/images/2.jpg',
        contentFileType: 'IMG_FILE',
        displayOrder: 2,
        width: 800,
        height: 600,
      },
      {
        contentFileUrl: 'https://cdn.ondaji.com/images/3.jpg',
        contentFileType: 'IMG_FILE',
        displayOrder: 3,
        width: 800,
        height: 600,
      },
    ];

    render(<MediaCarousel files={multipleFiles} contentTitle="테스트 소식" />);

    // 1/3 badge exists
    expect(screen.getByText('1/3')).toBeDefined();
    // Slides exist
    const slides = screen.getAllByRole('group');
    expect(slides.length).toBe(3);
  });
});
