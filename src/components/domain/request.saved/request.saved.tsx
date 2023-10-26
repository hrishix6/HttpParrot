import { useState } from 'react';
import { RequestSavedFilter } from './request.saved.filter';

export function RequestsSaved() {
  const [filter, setfilter] = useState('');

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setfilter(e.target.value);
    console.log(e.target.value);
  };

  return (
    <>
      <RequestSavedFilter filter={filter} handleChange={handleFilterChange} />
      <div className="flex-1 overflow-y-auto mt-2"></div>
    </>
  );
}
