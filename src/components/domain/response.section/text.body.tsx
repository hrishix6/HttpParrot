import { useEffect, useState } from 'react';
import Prism from 'prismjs';
import {
  SUPPORTED_TEXT_FORMATS,
  PRISM_SUPPORTED_CSS_LANG
} from '@/lib/constants';
// import { CopyIcon, CopyCheck, CopyX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/utils';

interface TextBodyProps {
  bodyType: string;
  text: string;
}

type CopyStatus = 'idle' | 'copied' | 'failed';

export function TextBody({ bodyType, text }: TextBodyProps) {
  const [copied, setCopied] = useState<CopyStatus>('idle');

  useEffect(() => {
    if (SUPPORTED_TEXT_FORMATS.includes(bodyType)) {
      Prism.highlightAll();
    }
  }, [text]);

  const langType = PRISM_SUPPORTED_CSS_LANG.includes(bodyType)
    ? bodyType
    : 'js';

  const handleCopy = () => {
    copyToClipboard(text).then((result) => {
      if (result) {
        setCopied('copied');
      } else {
        setCopied('failed');
      }
    });
  };

  let btnVariant: 'default' | 'destructive' = 'default';
  switch (copied) {
    case 'copied':
      btnVariant = 'default';
      break;
    case 'failed':
      btnVariant = 'destructive';
      break;
    default:
      btnVariant = 'default';
      break;
  }

  return (
    <>
      <pre>
        <code className={`language-${langType}`}>{text}</code>
      </pre>
      <div className="absolute top-5 right-2 flex items-center">
        <Button
          variant={btnVariant}
          className="transition-all duration-200"
          onClick={handleCopy}
          disabled={copied !== 'idle'}
        >
          Copy
        </Button>
      </div>
    </>
  );
}
