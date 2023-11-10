import { RequestMethod } from '@/common/types';
import { Badge } from '@/components/ui/badge';

interface Props {
  method: RequestMethod;
}

export function RequestMethodBadge({ method }: Props) {
  let colorClass = '';
  switch (method) {
    case 'post':
      colorClass = 'bg-blue-700 text-white';
      break;
    case 'delete':
      colorClass = 'bg-red-800 text-white';
      break;
    case 'put':
      colorClass = 'bg-purple-700 text-white';
      break;
    case 'patch':
      colorClass = 'bg-cyan-600 text-white';
      break;
    case 'head':
      colorClass = 'bg-orange-700 text-white';
      break;
    case 'options':
      colorClass = 'bg-stone-700 text-white';
      break;
    default:
      colorClass = '';
      break;
  }

  return (
    <Badge
      className={`${colorClass}`}
    >{`${method[0].toUpperCase()}${method.slice(1)}`}</Badge>
  );
}
