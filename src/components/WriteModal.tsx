import React, { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { createVillageFeed, createResidentFeed } from '../api/mock';

interface WriteModalProps {
  type: 'village_story' | 'resident_news';
  onClose: () => void;
  onSuccess: (type: 'village_story' | 'resident_news') => void;
}

export const WriteModal: React.FC<WriteModalProps> = ({ type, onClose, onSuccess }) => {
  const isVillageStory = type === 'village_story';
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState(
    isVillageStory
      ? 'https://picsum.photos/id/1050/800/600'
      : 'https://picsum.photos/id/180/800/600'
  );
  const [locationName, setLocationName] = useState('삼성동 골목');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    if (isVillageStory) {
      createVillageFeed({
        title: title.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim(),
        locationName: locationName.trim(),
      });
    } else {
      createResidentFeed({
        title: title.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim(),
      });
    }

    onSuccess(type);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 select-none">
      <div className="bg-white rounded-[20px] max-w-[400px] w-full p-5 shadow-2xl relative animate-fadeIn flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6] mb-4">
          <h2 className="text-[16px] font-extrabold text-[#1E293B]">
            {isVillageStory ? '동네 이야기 작성' : '주민소식 등록'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-[#F3F4F6] rounded-full cursor-pointer"
          >
            <X size={20} color="#64748B" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] mb-1">제목*</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isVillageStory ? "골목길, 빵집, 소소한 일상 이야기" : "공사, 자치회의 등 행정 공지 제목"}
              className="w-full text-[13px] px-3 py-2.5 rounded-[10px] border-[1.5px] border-[#E5E7EB] outline-none focus:border-[#00B4C5]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] mb-1">내용*</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="동네 이웃들과 나눌 따뜻한 이야기를 기록해주세요."
              className="w-full text-[13px] px-3 py-2.5 rounded-[10px] border-[1.5px] border-[#E5E7EB] outline-none focus:border-[#00B4C5] resize-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] mb-1">
              {isVillageStory ? '장소 / 동네 위치' : '발행 기관'}
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder={isVillageStory ? "예: 삼성동 은행나무길" : "예: 주민자치센터"}
              className="w-full text-[13px] px-3 py-2.5 rounded-[10px] border-[1.5px] border-[#E5E7EB] outline-none focus:border-[#00B4C5]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] mb-1">사진 URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 text-[12px] px-3 py-2 rounded-[10px] border border-[#E5E7EB] outline-none focus:border-[#00B4C5]"
              />
              <button
                type="button"
                onClick={() =>
                  setImageUrl(
                    `https://picsum.photos/id/${Math.floor(Math.random() * 200 + 10)}/800/600`
                  )
                }
                className="px-2.5 py-1 text-[11px] bg-[#F3F4F6] text-[#4B5563] font-bold rounded-[8px] hover:bg-[#E5E7EB] cursor-pointer"
              >
                랜덤 사진
              </button>
            </div>
            {imageUrl && (
              <div className="mt-2 w-full h-28 rounded-[8px] overflow-hidden border border-[#EEEEEE]">
                <img src={imageUrl} alt="미리보기" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-[12px] bg-[#F3F4F6] text-[#4B5563] font-bold text-[13px] cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 rounded-[12px] bg-[#00B4C5] text-white font-bold text-[14px] cursor-pointer hover:opacity-90 shadow-sm"
            >
              작성 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
