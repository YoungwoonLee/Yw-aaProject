import { useState, useCallback } from 'react';

export interface ResidentFilterState {
  hdongCodeValue: string;
  interests: string[] | null;
  ageGroups: string[] | null;
  targetGroups: string[] | null;
}

export function useResidentFilters(initialHdong = '4125051000') {
  const [filters, setFilters] = useState<ResidentFilterState>({
    hdongCodeValue: initialHdong,
    interests: null,
    ageGroups: null,
    targetGroups: null,
  });

  const setHdong = useCallback((code: string) => {
    setFilters((prev) => ({ ...prev, hdongCodeValue: code }));
  }, []);

  const setInterestFilters = useCallback((values: string[] | null) => {
    setFilters((prev) => ({
      ...prev,
      interests: values && values.length > 0 && !values.includes('전체') ? values : null,
    }));
  }, []);

  const setAgeGroupFilters = useCallback((values: string[] | null) => {
    setFilters((prev) => ({
      ...prev,
      ageGroups: values && values.length > 0 && !values.includes('전체') ? values : null,
    }));
  }, []);

  const setTargetGroupFilters = useCallback((values: string[] | null) => {
    setFilters((prev) => ({
      ...prev,
      targetGroups: values && values.length > 0 && !values.includes('전체') ? values : null,
    }));
  }, []);

  const resetAllFilters = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      interests: null,
      ageGroups: null,
      targetGroups: null,
    }));
  }, []);

  const isAnyFilterActive =
    Boolean(filters.interests && filters.interests.length > 0) ||
    Boolean(filters.ageGroups && filters.ageGroups.length > 0) ||
    Boolean(filters.targetGroups && filters.targetGroups.length > 0);

  return {
    filters,
    setHdong,
    setInterestFilters,
    setAgeGroupFilters,
    setTargetGroupFilters,
    resetAllFilters,
    isAnyFilterActive,
  };
}
