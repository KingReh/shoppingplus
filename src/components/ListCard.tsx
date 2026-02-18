import React, { useState, useRef } from 'react';
import { formatCurrency, formatDate, listTotalValue, listProgress } from '@/hooks/useShoppingLists';
import { ShoppingList } from '@/types/shopping';
import { Progress } from '@/components/ui/progress';
import { ShoppingCart, Calendar, Package } from 'lucide-react';
import { SwipeableRow, DeleteReveal, DuplicateReveal } from './SwipeableRow';
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

interface ListCardProps {
  list: ShoppingList;
  onClick: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function ListCard({ list, onClick, onDelete, onDuplicate }: ListCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const total = listTotalValue(list);
  const progress = listProgress(list);
  const boughtCount = list.items.filter(i => i.bought).length;

  return (
    <>
      <SwipeableRow
        onSwipeLeft={() => setShowDeleteDialog(true)}
        onSwipeRight={onDuplicate}
        leftContent={<DeleteReveal />}
        rightContent={<DuplicateReveal />}
      >
        <div className="list-card" onClick={onClick}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="font-semibold text-base text-card-foreground truncate">{list.title}</h3>
              <div className="flex items-center gap-1.5 mt-0.5 text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span className="text-xs">{formatDate(list.createdAt)}</span>
              </div>
            </div>
            {total > 0 && (
              <span className="text-sm font-bold text-primary shrink-0">{formatCurrency(total)}</span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              <span>{list.items.length} {list.items.length === 1 ? 'item' : 'itens'}</span>
            </div>
            {list.items.length > 0 && (
              <div className="flex items-center gap-1">
                <ShoppingCart className="w-3 h-3" />
                <span>{boughtCount}/{list.items.length} comprados</span>
              </div>
            )}
          </div>

          {list.items.length > 0 && (
            <div className="space-y-1">
              <Progress value={progress} className="h-1.5" />
              <span className="text-xs text-muted-foreground">{Math.round(progress)}% concluído</span>
            </div>
          )}
        </div>
      </SwipeableRow>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-[90vw] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar lista?</AlertDialogTitle>
            <AlertDialogDescription>
              A lista "{list.title}" e todos os seus itens serão removidos permanentemente.
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
