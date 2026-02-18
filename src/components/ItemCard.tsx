import React, { useState } from 'react';
import { ShoppingItem } from '@/types/shopping';
import { formatCurrency } from '@/hooks/useShoppingLists';
import { CATEGORY_COLORS } from '@/types/shopping';
import { Checkbox } from '@/components/ui/checkbox';
import { SwipeableRow, DeleteReveal } from './SwipeableRow';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle } from 'lucide-react';

interface ItemCardProps {
  item: ShoppingItem;
  onToggleBought: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export function ItemCard({ item, onToggleBought, onDelete, onEdit }: ItemCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const total = item.quantity * item.unitPrice;

  return (
    <>
      <SwipeableRow
        onSwipeLeft={() => setShowDeleteDialog(true)}
        onSwipeRight={onToggleBought}
        leftContent={<DeleteReveal />}
        rightContent={
          <div className="flex items-center gap-1 text-primary">
            <CheckCircle className="w-5 h-5" />
            <span className="text-xs font-medium">{item.bought ? 'Desmarcar' : 'Comprado'}</span>
          </div>
        }
      >
        <div
          className={`item-card px-4 py-3 flex items-start gap-3 ${item.bought ? 'opacity-60' : ''}`}
          onDoubleClick={onEdit}
        >
          {/* Checkbox */}
          <div className="touch-target flex items-center justify-center" onClick={e => { e.stopPropagation(); onToggleBought(); }}>
            <Checkbox
              checked={item.bought}
              onCheckedChange={onToggleBought}
              className="w-5 h-5 mt-0.5"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0" onClick={onEdit}>
            <div className="flex items-start justify-between gap-2">
              <span className={`text-sm font-medium ${item.bought ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
                {item.name}
              </span>
              {total > 0 && (
                <span className="text-sm font-semibold text-primary shrink-0">
                  {formatCurrency(total)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`category-badge ${CATEGORY_COLORS[item.category]}`}>
                {item.category}
              </span>
              <span className="text-xs text-muted-foreground">
                {item.quantity % 1 === 0 ? item.quantity : item.quantity.toFixed(1)}
                {item.unitPrice > 0 && ` × ${formatCurrency(item.unitPrice)}`}
              </span>
            </div>
          </div>
        </div>
      </SwipeableRow>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-[90vw] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar item?</AlertDialogTitle>
            <AlertDialogDescription>
              "{item.name}" será removido da lista.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={onDelete}
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
