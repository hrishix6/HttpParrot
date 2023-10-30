import { useState } from 'react';
import { RequestCollectionModel, RequestModel } from '@/common/types';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
import { useAppSelector } from '@/common/hoooks';
import { selectFilter } from './redux/request.saved.reducer';
import { RequestSavedItem } from './request.saved.item';

interface RequestCollectionProps {
  model: RequestCollectionModel;
  requests: RequestModel[];
}

export function RequestCollection({ model, requests }: RequestCollectionProps) {
  const [open, setOpen] = useState(false);
  const filter = useAppSelector(selectFilter);

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
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
            <span className="sr-only">expand or minimize collection</span>
          </Button>
          <Button variant="link" size="icon">
            <Settings2 className="h-4 w-4" />
            <span className="sr-only">Collection options</span>
          </Button>
        </div>
      </div>
      {open && (
        <div className="transition-all ease-out duration-300 mt-1">
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

interface DefaultCollectionProps {
  requests: RequestModel[];
}

export function DefaultCollection({ requests }: DefaultCollectionProps) {
  const model: RequestCollectionModel = {
    id: 'default',
    name: 'Default',
    created: 0
  };

  return <RequestCollection model={model} requests={requests} />;
}
