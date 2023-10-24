import { useEffect } from 'react';
import Prism from 'prismjs';
import { useAppSelector } from '../../../redux/hoooks';
import { selectResponseBodyMetadata } from '../../../redux/response.section/response.reducer';
import { Spinner } from '@/components/ui/spinner';

export function ResponseBody() {
  const { body, bodyType, loading } = useAppSelector(
    selectResponseBodyMetadata
  );

  const langType = ['js', 'css', 'html', 'xml'].includes(bodyType)
    ? bodyType
    : 'js';

  useEffect(() => {
    Prism.highlightAll();
  }, [body]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
      {body ? (
        <pre>
          <code className={`language-${langType} m-0`}>{body}</code>
        </pre>
      ) : (
        <p className="text-xml">Nothing to see here</p>
      )}
      {loading && (
        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
