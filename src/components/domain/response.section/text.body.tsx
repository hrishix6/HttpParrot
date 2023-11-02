import { useEffect } from 'react';
import Prism from 'prismjs';

interface TextBodyProps {
  bodyType: string;
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
    <pre className="max-w-full">
      <code className={`language-${langType} whitespace-pre-wrap`}>{text}</code>
    </pre>
  );
}
