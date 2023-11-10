import { RequestFormMode } from '@/common/types';

interface Props {
  mode?: RequestFormMode;
  collection?: string;

  request_name?: string;
}

export function RequestMetaHeader({
  mode = 'insert',
  collection = 'Default',
  request_name = 'Unnamed'
}: Props) {
  if (mode === 'insert') {
    return null;
  }
  return (
    <div className="px-2 pt-2">
      <div className="flex items-center gap-2 bg-secondary p-1">
        <p className="bg-background px-2 py-1 font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden">
          {/* <span className="inline-block mr-2 rounded-full bg-primary h-2 w-2"></span> */}
          {collection} / {request_name}
        </p>
      </div>
    </div>
  );
}
