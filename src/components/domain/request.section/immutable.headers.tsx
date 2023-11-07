import { DEFAULT_HEADERS } from '@/lib/constants';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Minus } from 'lucide-react';

interface ImmutableHeadersProps {
  show: boolean;
}

export function ImmutableHeaders({ show }: ImmutableHeadersProps) {
  if (!show) {
    return <></>;
  }

  return (
    <>
      {DEFAULT_HEADERS.map((x) => (
        <div className="flex gap-2 items-center" key={x.id}>
          <div>
            <Checkbox disabled className="block" defaultChecked />
          </div>
          <Input type="text" disabled defaultValue={x.name} />
          <Input type="text" disabled defaultValue={x.value} />
          <div>
            <Button disabled variant={'link'} size={'icon'}>
              <Minus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ))}
    </>
  );
}
