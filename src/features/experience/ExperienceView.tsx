import React, { useState, useEffect } from 'react';
import { SiotListView } from '../../components/SiotListView';
import { SiotDetailView } from '../../components/SiotDetailView';
import { MyReservationsView } from '../../components/MyReservationsView';
import { SiotCreateFormView } from '../../components/SiotCreateFormView';
import { getSiotProgramById, getSiotPrograms } from '../../api/mock';

export type ExperienceSubScreen = 'list' | 'detail' | 'reservations' | 'create';

interface ExperienceViewProps {
  townName: string;
  containerRef?: React.RefObject<HTMLElement | null>;
  initialScreen?: ExperienceSubScreen;
  initialProgramId?: number;
  onSubScreenChange?: (subScreen: ExperienceSubScreen) => void;
  onShowToast?: (msg: string) => void;
  onRequireLogin?: () => void;
}

export const ExperienceView: React.FC<ExperienceViewProps> = ({
  townName,
  containerRef,
  initialScreen = 'list',
  initialProgramId,
  onSubScreenChange,
  onShowToast,
  onRequireLogin,
}) => {
  const [subScreen, setSubScreen] = useState<ExperienceSubScreen>(
    initialProgramId ? 'detail' : initialScreen
  );
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(
    initialProgramId || null
  );
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    if (initialProgramId) {
      setSelectedProgramId(initialProgramId);
      setSubScreen('detail');
    } else if (initialScreen) {
      setSubScreen(initialScreen);
    }
  }, [initialProgramId, initialScreen]);

  const navigateSub = (next: ExperienceSubScreen, programId?: number) => {
    if (programId !== undefined) {
      setSelectedProgramId(programId);
    }
    setSubScreen(next);
    onSubScreenChange?.(next);
    if (containerRef?.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const selectedProgram =
    selectedProgramId !== null
      ? getSiotProgramById(selectedProgramId) || getSiotPrograms()[0]
      : null;

  if (subScreen === 'detail' && selectedProgram) {
    return (
      <SiotDetailView
        key={`${selectedProgram.id}-${refreshTick}`}
        program={selectedProgram}
        onBack={() => navigateSub('list')}
        onReservationSuccess={() => {
          setRefreshTick((t) => t + 1);
          navigateSub('reservations');
        }}
        onRequireLogin={onRequireLogin}
        onShowToast={onShowToast}
      />
    );
  }

  if (subScreen === 'reservations') {
    return (
      <MyReservationsView
        key={`reservations-${refreshTick}`}
        onBack={() => navigateSub('list')}
        onSelectProgram={(programId) => navigateSub('detail', programId)}
        onShowToast={onShowToast}
      />
    );
  }

  if (subScreen === 'create') {
    return (
      <SiotCreateFormView
        townName={townName}
        onBack={() => navigateSub('list')}
        onSuccess={(newProgramId) => {
          setRefreshTick((t) => t + 1);
          navigateSub('detail', newProgramId);
        }}
        onShowToast={onShowToast}
      />
    );
  }

  return (
    <SiotListView
      key={`list-${refreshTick}`}
      townName={townName}
      onCardClick={(programId) => navigateSub('detail', programId)}
      onViewMyReservations={() => navigateSub('reservations')}
      onCreateClick={() => navigateSub('create')}
    />
  );
};
