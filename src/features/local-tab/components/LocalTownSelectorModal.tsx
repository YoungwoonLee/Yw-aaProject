import React, { useState } from 'react';
import { X, Check, MapPin, Search } from 'lucide-react';
import { POPULAR_TOWNS, TownInfo } from '../constants/localData';

interface LocalTownSelectorModalProps {
  isOpen: boolean;
  selectedTown: string;
  onSelectTown: (townName: string) => void;
  onClose: () => void;
}

export const LocalTownSelectorModal: React.FC<LocalTownSelectorModalProps> = ({
  isOpen,
  selectedTown,
  onSelectTown,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredTowns = POPULAR_TOWNS.filter(
    (t) =>
      t.dongName.includes(searchTerm) ||
      t.cityName.includes(searchTerm) ||
      t.tagline.includes(searchTerm)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="town-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] bg-white rounded-t-[24px] sm:rounded-[24px] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-[#F1F5F9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E8F8F7] flex items-center justify-center text-[#14B8B0]">
              <MapPin size={18} />
            </div>
            <div>
              <h2 id="town-modal-title" className="text-[17px] font-bold text-[#1E293B]">
                내 동네(로컬) 선택
              </h2>
              <p className="text-[11px] text-[#64748B]">
                선택한 동네의 생생한 골목 이야기와 로컬박스를 모아봅니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-1.5 rounded-full hover:bg-[#F1F5F9] text-[#64748B] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 bg-[#F8FAFC] border-b border-[#F1F5F9]">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-[#94A3B8]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="동 이름 검색 (예: 도봉동, 방학동, 삼성동)"
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#E2E8F0] text-[13px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#14B8B0] transition-colors"
            />
          </div>
        </div>

        {/* Town List */}
        <div className="p-3 overflow-y-auto flex-1 flex flex-col gap-2 max-h-[420px]">
          {filteredTowns.map((town: TownInfo) => {
            const isSelected = selectedTown === town.dongName;
            return (
              <button
                key={town.dongCode}
                type="button"
                onClick={() => {
                  onSelectTown(town.dongName);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-[#14B8B0] bg-[#E8F8F7]/60 shadow-xs'
                    : 'border-[#F1F5F9] bg-white hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[15px] font-bold text-[#1E293B]">
                      {town.dongName}
                    </span>
                    <span className="text-[11px] font-medium text-[#64748B] bg-black/5 px-2 py-0.5 rounded-full">
                      {town.cityName}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-white bg-[#14B8B0] px-2 py-0.5 rounded-full">
                        선택됨
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#64748B] line-clamp-1">
                    {town.tagline}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#94A3B8]">
                    <span>소식 {town.stats.newsCount}건</span>
                    <span>·</span>
                    <span>로컬박스 {town.stats.localboxCount}곳</span>
                    <span>·</span>
                    <span>{town.weather.icon} {town.weather.temp}</span>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-[#14B8B0] text-white shadow-xs'
                      : 'border border-[#CBD5E1] text-transparent'
                  }`}
                >
                  <Check size={16} strokeWidth={2.5} />
                </div>
              </button>
            );
          })}

          {filteredTowns.length === 0 && (
            <div className="py-12 text-center text-[#94A3B8]">
              <p className="text-[14px]">검색된 동네가 없습니다.</p>
              <p className="text-[12px] mt-1">다른 동 이름을 검색해보세요.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F8FAFC] border-t border-[#F1F5F9] text-center text-[11px] text-[#94A3B8]">
          온닫이는 동네 중심의 하이퍼로컬 소식 서비스를 지향합니다.
        </div>
      </div>
    </div>
  );
};
