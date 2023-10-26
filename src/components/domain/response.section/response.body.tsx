import { useEffect } from 'react';
import Prism from 'prismjs';
import { useAppSelector } from '../../../redux/hoooks';
import {
  selectResponseBody,
  selectResponseBodyLoading,
  selectResponseBodytype
} from '../../../redux/response.section/response.reducer';
import { Spinner } from '@/components/ui/spinner';

export function ResponseBody() {
  const body = useAppSelector(selectResponseBody);
  const bodytype = useAppSelector(selectResponseBodytype);
  const loading = useAppSelector(selectResponseBodyLoading);

  const langType = ['js', 'css', 'html', 'xml'].includes(bodytype)
    ? bodytype
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
