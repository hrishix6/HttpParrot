import { useEffect, useRef, useState } from 'react';
import { Input } from './input';

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
  placeholder,
  value,
  onChange,
  onBlur,
}: HighlightedInputProps) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [infocus, setInfocus] = useState(false);

  const handleFocusLoss = () => {
    setInfocus(false);
    onBlur();
  };

  const handleFocusGain = () => {
    setInfocus(true);
  };

  useEffect(() => {
    ref.current?.focus();
  }, [infocus]);

  return (
    <div className='w-full'>
      <div
        {...(infocus
          ? {
              style: {
                display: "none",
              },
            }
          : {})}
        className="border h-10 flex items-center px-3 py-2 whitespace-nowrap overflow-hidden text-sm"
        onClick={handleFocusGain}
      >
        {value.split(REGEX).map((word, i) => {
          if (word.match(REGEX) !== null) {
            return (
              <span key={i} className="text-primary">
                {word}
              </span>
            );
          } else {
            return <span className="whitespace-pre" key={i}>{`${word}`}</span>;
          }
        })}
      </div>
      <Input
        {...(infocus
          ? {}
          : {
              style: {
                display: "none",
              },
            })}
        ref={ref}
        type="text"
        onBlur={() => handleFocusLoss()}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  )


  // return (
  //   <div
  //     className={`rich-input-container ${
  //       size == 'sm' ? 'sm' : ''
  //     } border w-full h-full ${inFocus ? 'border-2 border-primary' : 'border'}`}
  //   >
  //     <input
  //       {...(id ? { id } : {})}
  //       value={value}
  //       onChange={onChange}
  //       onFocus={(_) => setInFocus(true)}
  //       onBlur={handleBlur}
  //       onScroll={syncScroll}
  //       placeholder={placeholder}
  //       spellCheck={false}
  //     />
  //     <div ref={ref} className={`rich-input-renderer`}>
  //       {value.split(REGEX).map((word, i) => {
  //         if (word.match(REGEX) !== null) {
  //           return (
  //             <span key={i} className="text-primary">
  //               {word}
  //             </span>
  //           );
  //         } else {
  //           return (
  //             <span className="text-base" key={i}>
  //               {word}
  //             </span>
  //           );
  //         }
  //       })}
  //     </div>
  //   </div>
  // );
}
