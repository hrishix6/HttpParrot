import React, { useEffect } from 'react';
import { HighlightedInput } from '@/components/ui/highlighted-input';
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import {
  initQueryItems,
  selectUrl,
  selectUserEditingUrl,
  setUrl,
  userDoneEditingUrl
} from './redux/request.section.reducer';
import { getQueryItems } from './utils/form.helpers';

export function RequestUrl() {
  const dispatch = useAppDispatch();
  const isUserEditingUrl = useAppSelector(selectUserEditingUrl);
  const url = useAppSelector(selectUrl);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setUrl(e.target.value));
  };

  const handleBlur = () => {
    console.log('focus gone, user has stopped editing..');
    dispatch(userDoneEditingUrl());
  };

  useEffect(() => {
    let bouncerId: any;
    if (isUserEditingUrl) {
      const queryStr = url && url.split('?')[1];
      if (queryStr) {
        bouncerId = setTimeout(() => {
          dispatch(initQueryItems(getQueryItems(queryStr)));
        }, 500);
      } else {
        dispatch(initQueryItems([]));
      }
    }
    return () => {
      clearTimeout(bouncerId);
    };
  }, [url, isUserEditingUrl]);

  return (
    <HighlightedInput
      size="md"
      placeholder="url"
      value={url}
      onChange={handleUrlChange}
      onBlur={handleBlur}
    />
  );
}
