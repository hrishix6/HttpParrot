import { useEffect } from 'react';
import Prism from 'prismjs';
import { useAppSelector } from '../../../redux/hoooks';
import { selectResponseBodyMetadata } from '../../../redux/response.section/response.reducer';

export function ResponseBody() {
  const { body, bodyType } = useAppSelector(selectResponseBodyMetadata);

  const langType = ["js","css","html","xml"].includes(bodyType) ? bodyType: "js";

  useEffect(() => {
    Prism.highlightAll();
  }, [body]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      <pre>
        <code className={`language-${langType} m-0`}>{body}</code>
      </pre>
    </div>
  );
}
