import { ChevronDown, FileDown, CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DEFAULT_FILE_NAME, SUPPORTED_TEXT_FORMATS } from '@/lib/constants';
import { copyToClipboard } from '@/lib/utils';

interface ResponseActionsProps {
  bodyType: string;
  mimeType: string;
  body: any;
}

export function ResponseActionsDropDown({
  bodyType,
  mimeType,
  body
}: ResponseActionsProps) {
  const handleCopy = () => {
    copyToClipboard(body).then((result) => {
      if (result) {
        console.log(`copied`);
      } else {
        console.log(`couldn't copy`);
      }
    });
  };
  const handleDownloadFile = () => {
    const blob = new Blob([body], { type: mimeType });
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

  const showCopyOption = SUPPORTED_TEXT_FORMATS.includes(bodyType);
  const disabled = !body;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button size="icon" className="border-solid border-l">
          <ChevronDown className="h-4 w-4" />
          <span className="sr-only">Response actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDownloadFile}>
          <FileDown className="h-4 w-4 mr-2" />
          <span>Save File</span>
        </DropdownMenuItem>
        {showCopyOption && (
          <DropdownMenuItem onClick={handleCopy}>
            <CopyIcon className="h-4 w-4 mr-2" />
            <span>Copy</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
