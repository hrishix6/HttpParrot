import { CodeEditor } from '@/components/ui/editor';

interface TextBodyProps {
  bodyType: string;
  text: string;
}

export function TextBody({ bodyType, text }: TextBodyProps) {
  return (
    <div className="flex-1">
      <CodeEditor
        readonly={true}
        bodyType={bodyType}
        text={text}
        onChange={(_) => {}}
      />
    </div>
  );
}
