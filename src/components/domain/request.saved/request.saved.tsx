import { useEffect, useState } from 'react';
import { RequestSavedFilter } from './request.saved.filter';
import { useAppDispatch, useAppSelector } from '../../../redux/hoooks';
import {
  selectFilter,
  selectSavedRequests,
  setFilter
} from '../../../redux/request.saved/request.saved.reducer';
import { RequestModel } from '../../../types';
import { RequestSavedItem } from './request.saved.item';

export function RequestsSaved() {
  const [search, setSearch] = useState('');

  const dispatch = useAppDispatch();

  const filter = useAppSelector(selectFilter);

  const saved = useAppSelector(selectSavedRequests);

  const requestFilter = (item: RequestModel, filter: string) => {
    if (filter && filter.trim() !== '') {
      let nameMatch = false,
        methodMatch = false,
        urlMatch = false;
      const { name, method, url } = item;
      const filterNormalized = filter.toLowerCase();
      if (name && name.trim() !== '') {
        nameMatch = name.toLowerCase().includes(filterNormalized);
      }

      if (method && method.trim() !== '') {
        methodMatch = method.toLocaleLowerCase().includes(filterNormalized);
      }

      if (url && url.trim() !== '') {
        urlMatch = url.toLocaleLowerCase().includes(filterNormalized);
      }

      return nameMatch || methodMatch || urlMatch;
    }

    return true;
  };

  const filteredSaved = saved.filter((x) => requestFilter(x, filter));

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
      <div className="flex-1 overflow-y-auto mt-2">
        {filteredSaved.map((item) => (
          <RequestSavedItem key={item.id} request={item} />
        ))}
      </div>
    </>
  );
}
