import React from 'react';
import { HighlightedInput } from '@/components/ui/highlighted-input';
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import { selectUrl } from '../tabs/redux/tabs.reducer';
import { setUrlAsync } from '../tabs/redux/tabs.async.actions';

export function RequestUrl() {
  const dispatch = useAppDispatch();
  const url = useAppSelector(selectUrl);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setUrlAsync(e.target.value));
  };

  return (
    <HighlightedInput
      size="md"
      placeholder="url"
      value={url}
      onChange={handleUrlChange}
      onBlur={() => {}}
    />
  );
}
