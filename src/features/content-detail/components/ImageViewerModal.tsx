import React from 'react';
import { X } from 'lucide-react';
import { ContentFile } from '../../../types/content';

interface ImageViewerModalProps {
  files: ContentFile[];
  initialIndex: number;
  onClose: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  files,
  initialIndex,
  onClose,
}) => {
  const [index, setIndex] = React.useState(initialIndex);
  const currentFile = files[index];

  // TODO(확인필요): 전체화면 이미지 핀치줌 제스처 라이브러리 연동 여부 확인 필요
  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col justify-between p-4 select-none animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between text-white py-2 z-10">
        <span className="text-[14px] font-bold">
          {index + 1} / {files.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="p-2 -mr-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer text-white"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {currentFile && (
          <img
            src={currentFile.contentFileUrl}
            alt={`전체화면 미디어 ${index + 1}`}
            className="max-w-full max-h-[85vh] object-contain transition-transform"
          />
        )}
      </div>

      {/* Navigation Thumbnails / Indicator */}
      {files.length > 1 && (
        <div className="flex items-center justify-center gap-2 py-3 z-10 overflow-x-auto no-scrollbar">
          {files.map((file, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setIndex(idx)}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                index === idx ? 'border-[#14B8B0] scale-105' : 'border-transparent opacity-60'
              }`}
            >
              <img src={file.contentFileUrl} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
