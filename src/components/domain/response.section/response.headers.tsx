import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useAppSelector } from '@/common/hoooks';
import { selectResponseHeaders } from '../tabs/redux/tabs.reducer';
import { EmptyHeaders } from './empty.headers';

export function ResponseHeaders() {
  const headers = useAppSelector(selectResponseHeaders);

  let headerComponent;

  if (headers.length) {
    headerComponent = (
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Name</TableHead>
            <TableHead className="w-2/3">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {headers.map((h, i) => (
            <TableRow key={i}>
              <TableCell>{h.name}</TableCell>
              <TableCell>{h.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  } else {
    headerComponent = <EmptyHeaders />;
  }

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
      {headerComponent}
    </div>
  );
}
