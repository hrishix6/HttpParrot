import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/common/hoooks';
import { discardBody } from './redux/response.reducer';
import { DEFAULT_FILE_NAME } from '@/lib/constants';

interface BinaryBodyProps {
  bodyType: string;
  mimeType: string;
  chunks: Uint8Array;
}

export function BinaryBody({ bodyType, mimeType, chunks }: BinaryBodyProps) {
  const dispatch = useAppDispatch();

  const handleDownloadFile = () => {
    const blob = new Blob([chunks], { type: mimeType });
    const blobUrl = window.URL.createObjectURL(blob);
    const dlink = document.createElement('a');
    dlink.href = blobUrl;
    dlink.download = `${DEFAULT_FILE_NAME}.${bodyType}`;
    dlink.style.display = 'none';
    document.body.appendChild(dlink);
    dlink.click();
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(dlink);
  };

  const handleDiscardFile = () => {
    dispatch(discardBody(null));
  };

  return (
    <div className="absolute top-0 left-0 h-full w-full flex flex-col gap-2 items-center justify-center">
      <h4 className="text-muted-foreground text-lg">
        No preiew available for binary and unsupported text formats.
      </h4>
      <div className="flex items-center justify-center gap-2">
        <Button onClick={handleDownloadFile}>Download</Button>
        <Button onClick={handleDiscardFile} variant={'secondary'}>
          Discard
        </Button>
      </div>
    </div>
  );
}
