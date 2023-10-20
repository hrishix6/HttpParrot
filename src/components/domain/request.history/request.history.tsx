import { useEffect } from 'react';
import { RequestHistoryItem } from './request.history.item';
import { RequestModel } from '../../../types';
import { RequestHistoryFilter } from './request.history.filter';
import { useAppDispatch, useAppSelector } from '../../../redux/hoooks';
import {
  selectFilter,
  selectFilteredHistory,
  selectHistory,
  setFilter,
  setFilteredHistory
} from '../../../redux/request.history/history.reducer';

export function RequestHistory() {
  const dispatch = useAppDispatch();

  const filter = useAppSelector(selectFilter);

  const history = useAppSelector(selectHistory);

  const filteredHistory = useAppSelector(selectFilteredHistory);

  const requestFilter = (item: RequestModel, filter: string) => {
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
  };

  useEffect(() => {
    const bouncerId = setTimeout(() => {
      if (filter) {
        dispatch(
          setFilteredHistory([
            ...history.filter((x) => requestFilter(x, filter))
          ])
        );
      } else {
        dispatch(setFilteredHistory([...history]));
      }
    }, 300);
    return () => {
      clearTimeout(bouncerId);
    };
  }, [filter, history]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilter(e.target.value));
  };

  return (
    <>
      <RequestHistoryFilter filter={filter} handleChange={handleFilterChange} />
      <div className="flex-1 overflow-y-auto mt-2">
        {filteredHistory.map((item) => (
          <RequestHistoryItem key={item.id} request={item} />
        ))}
      </div>
    </>
  );
}
