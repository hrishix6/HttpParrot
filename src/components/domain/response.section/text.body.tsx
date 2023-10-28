import { useEffect } from 'react';
import { ContentType } from '../../../types';
import Prism from 'prismjs';

interface TextBodyProps {
  bodyType: ContentType;
  text: string;
}

export function TextBody({ bodyType, text }: TextBodyProps) {
  useEffect(() => {
    if (['js', 'css', 'html', 'xml', 'json'].includes(bodyType)) {
      Prism.highlightAll();
    }
  }, [text]);

  const langType = ['js', 'css', 'html', 'xml'].includes(bodyType)
    ? bodyType
    : 'js';

  return (
    <pre>
      <code className={`language-${langType} m-0`}>{text}</code>
    </pre>
  );
}
