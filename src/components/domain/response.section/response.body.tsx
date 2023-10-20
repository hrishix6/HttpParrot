import { useEffect } from 'react';
import Prism from 'prismjs';

export function ResponseBody() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      <pre>
        <code className="language-js m-0">{`console.log("Hello World")!`}</code>
      </pre>
    </div>
  );
}
