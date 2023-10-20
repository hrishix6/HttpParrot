import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import { RequestModel } from '../../../types';

interface RequestHistoryActionsProps {
  children?: React.ReactNode;
  request: RequestModel;
  handleDelete: (id: string) => void;
  handleAddToCollection: (r: RequestModel) => void;
  handleViewInRequestSection: (r: RequestModel) => void;
}

export function RequestHistoryItemActions({
  children,
  request,
  handleDelete,
  handleAddToCollection,
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
        <ContextMenuItem onSelect={() => handleAddToCollection(request)} inset>
          Add to Collection
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
