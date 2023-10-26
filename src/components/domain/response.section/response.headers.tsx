import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useAppSelector } from '../../../redux/hoooks';
import { selectResponseHeaders } from '../../../redux/response.section/response.reducer';

export function ResponseHeaders() {
  const headers = useAppSelector(selectResponseHeaders);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
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
    </div>
  );
}
