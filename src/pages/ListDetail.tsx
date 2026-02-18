import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShoppingLists, formatCurrency, listTotalValue, listToText } from '@/hooks/useShoppingLists';
import { ShoppingItem, Category } from '@/types/shopping';
import { ItemCard } from '@/components/ItemCard';
import { ItemForm } from '@/components/ItemForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  ArrowLeft,
  Plus,
  MoreVertical,
  Share2,
  Copy,
  Printer,
  CopyPlus,
  Trash2,
  CheckSquare,
  Square,
  Eraser,
  Filter,
  Search,
  X,
  Archive,
  ShoppingCart,
  Package,
  CheckCircle,
} from 'lucide-react';

type SortOption = 'name' | 'price' | 'category' | 'status';

export default function ListDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getList,
    updateListTitle,
    deleteList,
    duplicateList,
    archiveList,
    addItem,
    updateItem,
    deleteItem,
    toggleItemBought,
    markAllBought,
    clearBoughtItems,
  } = useShoppingLists();

  // All hooks BEFORE any early return
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [showDeleteListDialog, setShowDeleteListDialog] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<Category | 'Todos'>('Todos');
  const [sortBy, setSortBy] = useState<SortOption>('category');
  const [groupByCategory, setGroupByCategory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  const list = getList(id!);

  const processedItems = useMemo(() => {
    if (!list) return [];
    let items = [...list.items];
    if (searchQuery) items = items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (categoryFilter !== 'Todos') items = items.filter(i => i.category === categoryFilter);
    items.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'price': return (b.unitPrice * b.quantity) - (a.unitPrice * a.quantity);
        case 'category': return a.category.localeCompare(b.category);
        case 'status': return Number(a.bought) - Number(b.bought);
        default: return a.order - b.order;
      }
    });
    return items;
  }, [list, categoryFilter, sortBy, searchQuery]);

  const groupedItems = useMemo(() => {
    if (!groupByCategory) return null;
    const groups: Record<string, ShoppingItem[]> = {};
    processedItems.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [processedItems, groupByCategory]);

  // Early return after all hooks
  if (!list) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Lista não encontrada</p>
        <Button className="mt-4" onClick={() => navigate('/')}>Voltar</Button>
      </div>
    );
  }

  const handleTitleEdit = () => {
    setTitleValue(list.title);
    setEditingTitle(true);
  };

  const handleTitleSave = () => {
    if (titleValue.trim().length >= 2) updateListTitle(list.id, titleValue.trim());
    setEditingTitle(false);
  };

  const handleAddItem = (item: Omit<ShoppingItem, 'id' | 'order'>) => {
    addItem(list.id, item);
  };

  const handleEditItem = (item: Omit<ShoppingItem, 'id' | 'order'>) => {
    if (editingItem) updateItem(list.id, editingItem.id, item);
    setEditingItem(null);
  };

  const handleDelete = () => {
    deleteList(list.id);
    navigate('/');
  };

  const handleDuplicate = () => {
    const copy = duplicateList(list.id);
    navigate(`/lista/${copy.id}`);
  };

  const handleShare = async () => {
    const text = listToText(list);
    if (navigator.share) {
      try { await navigator.share({ title: list.title, text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2000);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(listToText(list));
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);
  };

  const handlePrint = () => {
    const text = listToText(list);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`<pre style="font-family:monospace;padding:20px;white-space:pre-wrap">${text}</pre>`);
      win.document.close();
      win.print();
    }
  };

  const total = listTotalValue(list);
  const boughtCount = list.items.filter(i => i.bought).length;
  const usedCategories = [...new Set(list.items.map(i => i.category))];

  const renderItem = (item: ShoppingItem) => (
    <ItemCard
      key={item.id}
      item={item}
      onToggleBought={() => toggleItemBought(list.id, item.id)}
      onDelete={() => deleteItem(list.id, item.id)}
      onEdit={() => { setEditingItem(item); setShowItemForm(true); }}
    />
  );

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="mobile-header px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="touch-target shrink-0"
            onClick={() => navigate('/')}
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          {/* Editable title */}
          <div className="flex-1 min-w-0">
            {editingTitle ? (
              <Input
                value={titleValue}
                onChange={e => setTitleValue(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleTitleSave();
                  if (e.key === 'Escape') setEditingTitle(false);
                }}
                autoFocus
                className="h-8 text-base font-semibold"
              />
            ) : (
              <button
                className="w-full text-left text-base font-semibold text-foreground truncate py-1"
                onClick={handleTitleEdit}
              >
                {list.title}
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="touch-target" onClick={() => setShowSearch(s => !s)} aria-label="Buscar">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="touch-target" onClick={() => setShowFiltersSheet(true)} aria-label="Filtros">
              <Filter className="w-5 h-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="touch-target" aria-label="Mais opções">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />Compartilhar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />{copiedFeedback ? '✓ Copiado!' : 'Copiar texto'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />Exportar / Imprimir
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => markAllBought(list.id, true)}>
                  <CheckSquare className="w-4 h-4 mr-2" />Marcar todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => markAllBought(list.id, false)}>
                  <Square className="w-4 h-4 mr-2" />Desmarcar todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => clearBoughtItems(list.id)}>
                  <Eraser className="w-4 h-4 mr-2" />Limpar comprados
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDuplicate}>
                  <CopyPlus className="w-4 h-4 mr-2" />Duplicar lista
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { archiveList(list.id); navigate('/'); }}>
                  <Archive className="w-4 h-4 mr-2" />Arquivar lista
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setShowDeleteListDialog(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />Deletar lista
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar itens..."
              className="pl-9 pr-9"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        )}

        {/* Category filter chips */}
        {usedCategories.length > 1 && (
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => setCategoryFilter('Todos')}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                categoryFilter === 'Todos' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              Todos ({list.items.length})
            </button>
            {usedCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat === categoryFilter ? 'Todos' : cat)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  categoryFilter === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {cat} ({list.items.filter(i => i.category === cat).length})
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Items list */}
      <main className="flex-1 overflow-y-auto px-4 py-3 pb-40 space-y-2">
        {processedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">
              {searchQuery || categoryFilter !== 'Todos' ? 'Nenhum item encontrado' : 'Lista vazia'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || categoryFilter !== 'Todos'
                ? 'Tente outros filtros'
                : 'Toque em + para adicionar o primeiro item'}
            </p>
          </div>
        ) : groupedItems ? (
          Object.entries(groupedItems).map(([cat, items]) => (
            <div key={cat}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-3 first:mt-0">
                {cat} ({items.length})
              </h4>
              <div className="space-y-2">{items.map(renderItem)}</div>
            </div>
          ))
        ) : (
          processedItems.map(renderItem)
        )}
      </main>

      {/* FAB */}
      <button
        className="fab"
        onClick={() => { setEditingItem(null); setShowItemForm(true); }}
        aria-label="Adicionar item"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border px-4 py-3 z-20">
        <div className="flex items-center justify-between gap-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Itens</div>
            <div className="text-sm font-semibold">{list.items.length}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Comprados</div>
            <div className="text-sm font-semibold" style={{ color: 'hsl(var(--primary))' }}>{boughtCount}/{list.items.length}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="text-base font-bold" style={{ color: 'hsl(var(--primary))' }}>
              {total > 0 ? formatCurrency(total) : 'R$ 0,00'}
            </div>
          </div>
        </div>
      </div>

      {/* Item Form */}
      <ItemForm
        open={showItemForm}
        onClose={() => { setShowItemForm(false); setEditingItem(null); }}
        onSave={editingItem ? handleEditItem : handleAddItem}
        initialData={editingItem}
      />

      {/* Delete List Dialog */}
      <AlertDialog open={showDeleteListDialog} onOpenChange={setShowDeleteListDialog}>
        <AlertDialogContent className="max-w-[90vw] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar lista?</AlertDialogTitle>
            <AlertDialogDescription>
              A lista "{list.title}" e todos os {list.items.length} itens serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Filters Sheet */}
      <Sheet open={showFiltersSheet} onOpenChange={setShowFiltersSheet}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Ordenar e Agrupar</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Ordenar por</p>
              <div className="grid grid-cols-2 gap-2">
                {(['name', 'price', 'category', 'status'] as SortOption[]).map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSortBy(opt)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-colors ${
                      sortBy === opt ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-foreground'
                    }`}
                  >
                    {{ name: 'Nome', price: 'Preço', category: 'Categoria', status: 'Status' }[opt]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Agrupamento</p>
              <button
                onClick={() => setGroupByCategory(g => !g)}
                className={`w-full py-2.5 px-3 rounded-xl text-sm font-medium border transition-colors ${
                  groupByCategory ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-foreground'
                }`}
              >
                {groupByCategory ? '✓ ' : ''}Agrupar por categoria
              </button>
            </div>
            <Button className="w-full rounded-xl" onClick={() => setShowFiltersSheet(false)}>
              Aplicar
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
