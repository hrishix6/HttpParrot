import { useEffect } from 'react';
import Prism from 'prismjs';
import {
  SUPPORTED_TEXT_FORMATS,
  PRISM_SUPPORTED_CSS_LANG
} from '@/lib/constants';

interface TextBodyProps {
  bodyType: string;
  text: string;
}

export function TextBody({ bodyType, text }: TextBodyProps) {
  useEffect(() => {
    if (SUPPORTED_TEXT_FORMATS.includes(bodyType)) {
      Prism.highlightAll();
    }
  }, [text]);

  const langType = PRISM_SUPPORTED_CSS_LANG.includes(bodyType)
    ? bodyType
    : 'js';
  return (
    <pre>
      <code className={`language-${langType}`}>{text}</code>
    </pre>
  );
}
