import React, { useState, useMemo } from 'react';
import { useShoppingLists } from '@/hooks/useShoppingLists';
import { useTheme } from '@/hooks/useTheme';
import { ListCard } from '@/components/ListCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ShoppingCart, Search, Settings, Plus, X, Archive, RotateCcw } from 'lucide-react';
import { ShoppingList } from '@/types/shopping';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/hooks/useShoppingLists';

export default function Index() {
  const navigate = useNavigate();
  const { activeLists, archivedLists, createList, deleteList, duplicateList, restoreList } = useShoppingLists();
  const { settings, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [showNewListDialog, setShowNewListDialog] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [titleError, setTitleError] = useState('');

  const filteredLists = useMemo(() => {
    const source = showArchived ? archivedLists : activeLists;
    if (!search.trim()) return source;
    const q = search.toLowerCase();
    return source.filter(l => l.title.toLowerCase().includes(q));
  }, [activeLists, archivedLists, search, showArchived]);

  const handleCreateList = () => {
    if (newListTitle.trim().length < 2) {
      setTitleError('O nome deve ter pelo menos 2 caracteres');
      return;
    }
    const list = createList(newListTitle.trim());
    setNewListTitle('');
    setShowNewListDialog(false);
    setTitleError('');
    navigate(`/lista/${list.id}`);
  };

  const handleOpenDialog = () => {
    setNewListTitle('');
    setTitleError('');
    setShowNewListDialog(true);
  };

  const isDark = settings.theme === 'dark';

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="mobile-header px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--primary))' }}>
              <ShoppingCart className="w-4 h-4" style={{ color: 'hsl(var(--primary-foreground))' }} />
            </div>
            <h1 className="text-lg font-bold text-foreground">Compras</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="touch-target"
              onClick={toggleTheme}
              aria-label="Alternar tema"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="touch-target"
              onClick={() => navigate('/configuracoes')}
              aria-label="Configurações"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar listas..."
            className="pl-9 pr-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tab: Ativas / Arquivadas */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setShowArchived(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${!showArchived ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            Minhas Listas ({activeLists.length})
          </button>
          <button
            onClick={() => setShowArchived(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${showArchived ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            Arquivadas ({archivedLists.length})
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-3 pb-28">
        {filteredLists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              {showArchived ? (
                <Archive className="w-9 h-9 text-muted-foreground" />
              ) : (
                <ShoppingCart className="w-9 h-9 text-muted-foreground" />
              )}
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-1">
              {search ? 'Nenhuma lista encontrada' : showArchived ? 'Nenhuma lista arquivada' : 'Nenhuma lista ainda'}
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              {search
                ? `Não há listas com "${search}"`
                : showArchived
                ? 'Listas arquivadas aparecerão aqui'
                : 'Crie sua primeira lista de compras tocando no botão +'}
            </p>
            {!showArchived && !search && (
              <Button onClick={handleOpenDialog} className="mt-6 rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Criar lista
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {showArchived ? (
              filteredLists.map(list => (
                <div key={list.id} className="list-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-base">{list.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(list.createdAt)} · {list.items.length} itens</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      onClick={() => restoreList(list.id)}
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Restaurar
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              filteredLists.map(list => (
                <ListCard
                  key={list.id}
                  list={list}
                  onClick={() => navigate(`/lista/${list.id}`)}
                  onDelete={() => deleteList(list.id)}
                  onDuplicate={() => duplicateList(list.id)}
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* FAB */}
      {!showArchived && (
        <button
          className="fab"
          onClick={handleOpenDialog}
          aria-label="Nova lista"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* New List Dialog */}
      <Dialog open={showNewListDialog} onOpenChange={setShowNewListDialog}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Nova Lista</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Input
              value={newListTitle}
              onChange={e => { setNewListTitle(e.target.value); setTitleError(''); }}
              placeholder="Nome da lista..."
              className={titleError ? 'border-destructive' : ''}
              onKeyDown={e => e.key === 'Enter' && handleCreateList()}
              autoFocus
            />
            {titleError && <p className="text-xs text-destructive mt-1">{titleError}</p>}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowNewListDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreateList} className="rounded-xl">Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
