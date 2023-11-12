import { useRef, useState } from 'react';

const REGEX = /({{.*?}})/g;

interface HighlightedInputProps {
  id?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  size?: 'md' | 'sm';
}

export function HighlightedInput({
  id,
  placeholder,
  value,
  onChange,
  onBlur,
  size = 'md'
}: HighlightedInputProps) {
  const [inFocus, setInFocus] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const syncScroll = (e: any) => {
    ref.current!.scrollTop = e.target.scrollTop;
    ref.current!.scrollLeft = e.target.scrollLeft;
  };

  const handleBlur = (_: React.FocusEvent<HTMLInputElement, Element>) => {
    setInFocus(false);
    onBlur();
  };

  return (
    <div
      className={`rich-input-container ${
        size == 'sm' ? 'sm' : ''
      } border w-full h-full ${inFocus ? 'border-2 border-primary' : 'border'}`}
    >
      <input
        {...(id ? { id } : {})}
        value={value}
        onChange={onChange}
        onFocus={(_) => setInFocus(true)}
        onBlur={handleBlur}
        onScroll={syncScroll}
        placeholder={placeholder}
        spellCheck={false}
      />
      <div ref={ref} className={`rich-input-renderer`}>
        {value.split(REGEX).map((word, i) => {
          if (word.match(REGEX) !== null) {
            return (
              <span key={i} className="text-primary">
                {word}
              </span>
            );
          } else {
            return (
              <span className="text-base" key={i}>
                {word}
              </span>
            );
          }
        })}
      </div>
    </div>
  );
}
