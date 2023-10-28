import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import { RequestModel } from '@/common/types';

interface RequestHistoryActionsProps {
  children?: React.ReactNode;
  request: RequestModel;
  handleDelete: (id: string) => void;
  handleViewInRequestSection: (r: RequestModel) => void;
}

export function RequestHistoryItemActions({
  children,
  request,
  handleDelete,
  handleViewInRequestSection
}: RequestHistoryActionsProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem
          onSelect={() => handleViewInRequestSection(request)}
          inset
        >
          View
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => handleDelete(request.id)} inset>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
