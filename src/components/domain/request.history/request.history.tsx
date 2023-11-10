import { useEffect, useState } from 'react';
import { RequestHistoryItem } from './request.history.item';
import { RequestModel } from '@/common/types';
import { RequestHistoryFilter } from './request.history.filter';
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import {
  selectFilter,
  selectHistory,
  setFilter
} from './redux/history.reducer';

export function RequestHistory() {
  const [search, setSearch] = useState('');

  const dispatch = useAppDispatch();

  const filter = useAppSelector(selectFilter);

  const history = useAppSelector(selectHistory);

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

  const filteredHistory = filter
    ? history.filter((x) => requestFilter(x, filter))
    : history;

  useEffect(() => {
    const bouncerId = setTimeout(() => {
      dispatch(setFilter(search));
    }, 300);
    return () => {
      clearTimeout(bouncerId);
    };
  }, [search]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <RequestHistoryFilter filter={search} handleChange={handleFilterChange} />
      <div className="flex-1 overflow-y-auto mt-2">
        {filteredHistory.map((item) => (
          <RequestHistoryItem key={item.id} request={item} />
        ))}
      </div>
    </>
  );
}
