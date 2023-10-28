import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import { Input } from '@/components/ui/input';
import {
  selectUrl,
  selectUrlTokens,
  selectUserEditingUrl,
  setUrl,
  userDoneEditingUrl,
  userWantsToEditUrl
} from './redux/request.section.reducer';
import { Token } from '@/common/types';
import { useEffect, useRef } from 'react';

interface RequestUrlInterpolatedProps {
  tokens: Token[];
}

export function RequestUrlInterpolated({}: RequestUrlInterpolatedProps) {
  const focusRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const url = useAppSelector(selectUrl);
  const isUserEditing = useAppSelector(selectUserEditingUrl);
  const urlTokens = useAppSelector(selectUrlTokens);

  useEffect(() => {
    if (isUserEditing) {
      focusRef.current?.focus();
    }
  }, [isUserEditing]);

  return (
    <>
      {isUserEditing ? (
        <Input
          ref={focusRef}
          placeholder="url"
          value={url}
          onBlur={(_) => {
            console.log('focus gone, user has stopped editing..');
            dispatch(userDoneEditingUrl());
          }}
          onChange={(e) => {
            dispatch(setUrl(e.target.value));
          }}
        />
      ) : (
        <div
          className="flex-1 border-solid border p-2 px-3 py-2 text-sm hover:cursor-pointer"
          onClick={() => {
            console.log('user is trying to edit');
            dispatch(userWantsToEditUrl());
          }}
        >
          {urlTokens.length > 0 ? (
            urlTokens.map((token, i) => {
              if (token.highlight) {
                return (
                  <span key={i} className="text-primary">
                    {token.text}
                  </span>
                );
              }
              return <span key={i}>{token.text}</span>;
            })
          ) : (
            <span>url</span>
          )}
        </div>
      )}
    </>
  );
}
