import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';

interface Props {
  text: string;
  bodyType: string;
  readonly?: boolean;
  onChange: (text: string) => void;
}

export function CodeEditor({
  text,
  bodyType,
  readonly = false,
  onChange
}: Props) {
  const handleValueChange = (nextText: string) => {
    onChange(nextText);
  };

  const handleHightLight = (text: string) => {
    let grammer = languages[bodyType] || languages['plain'];
    let lang = bodyType;
    if (bodyType == 'json') {
      lang = 'js';
      grammer = languages['js'];
    }
    return highlight(text, grammer, lang);
  };

  return (
    <Editor
      value={text}
      onValueChange={handleValueChange}
      highlight={handleHightLight}
      className="bg-black text-slate-50 h-full"
      textareaId="body-editor"
      readOnly={readonly}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 15
      }}
    />
  );
}
