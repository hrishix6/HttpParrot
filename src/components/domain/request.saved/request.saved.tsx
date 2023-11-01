import { useEffect, useState } from 'react';
import { RequestSavedFilter } from './request.saved.filter';
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import {
  selectCollections,
  selectSavedRequests,
  setFilter
} from './redux/request.saved.reducer';
import { RequestCollection } from './request.collection';

export function RequestsSaved() {
  const [search, setSearch] = useState('');
  const dispatch = useAppDispatch();
  const saved = useAppSelector(selectSavedRequests);
  const collections = useAppSelector(selectCollections);

  useEffect(() => {
    const bouncerId = setTimeout(() => {
      dispatch(setFilter(search));
    }, 500);
    return () => {
      clearTimeout(bouncerId);
    };
  }, [search]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <RequestSavedFilter filter={search} handleChange={handleFilterChange} />
      <div className="flex-1 overflow-y-auto mt-2 flex flex-col gap-1">
        {collections.map((item) => (
          <RequestCollection
            key={item.id}
            model={item}
            requests={saved.filter((x) => x.collectionId === item.id)}
          />
        ))}
      </div>
    </>
  );
}
