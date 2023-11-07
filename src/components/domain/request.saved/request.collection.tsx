import { useEffect, useState } from 'react';
import { RequestCollectionModel, RequestModel } from '@/common/types';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAppSelector } from '@/common/hoooks';
import { selectFilter } from './redux/request.saved.reducer';
import { RequestSavedItem } from './request.saved.item';
import { CollectionActions } from './request.collection.actions';

interface RequestCollectionProps {
  model: RequestCollectionModel;
  requests: RequestModel[];
}

export function RequestCollection({ model, requests }: RequestCollectionProps) {
  const [open, setOpen] = useState(() => {
    const saved = localStorage.getItem(`col-${model.id}`);
    return saved === 'true';
  });
  const filter = useAppSelector(selectFilter);

  useEffect(() => {
    localStorage.setItem(`col-${model.id}`, `${open}`);
  }, [open]);

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

  const filteredSaved = requests.filter((x) => requestFilter(x, filter));

  return (
    <section>
      <div className="shadow flex items-center justify-between px-2 py-1 border border-solid">
        <p className="ml-2 text-base font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden">
          {model.name}
        </p>
        <div className="flex items-center gap-1">
          <Button variant="link" size="icon" onClick={() => setOpen(!open)}>
            {open ? (
              <ChevronUp className="h-5 w-5 transition-all duration-200" />
            ) : (
              <ChevronDown className="h-5 w-5 transition-all duration-200" />
            )}
            <span className="sr-only">expand or minimize collection</span>
          </Button>
          <CollectionActions model={model} />
        </div>
      </div>
      {open && (
        <div className="mt-1">
          {filteredSaved.map((item) => (
            <RequestSavedItem
              key={item.id}
              request={item}
              collectionName={model.name}
            />
          ))}
        </div>
      )}
    </section>
  );
}
