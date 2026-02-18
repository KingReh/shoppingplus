import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sun, Moon, Monitor, ShoppingCart } from 'lucide-react';
import { AppSettings } from '@/types/shopping';

type SortField = 'name' | 'price' | 'category' | 'status';

export default function Settings() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useTheme();

  const themeOptions: { value: AppSettings['theme']; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Claro', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Escuro', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: 'Sistema', icon: <Monitor className="w-4 h-4" /> },
  ];

  const sortOptions: { value: SortField; label: string }[] = [
    { value: 'name', label: 'Nome' },
    { value: 'price', label: 'Preço' },
    { value: 'category', label: 'Categoria' },
    { value: 'status', label: 'Status' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <header className="mobile-header px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="touch-target" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">Configurações</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Theme */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Aparência</h2>
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <p className="text-sm font-medium">Tema</p>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateSettings({ theme: opt.value })}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-sm font-medium transition-colors ${
                    settings.theme === opt.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-foreground'
                  }`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Default Sort */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Ordenação Padrão</h2>
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <p className="text-sm font-medium">Ordenar itens por padrão por</p>
            <div className="grid grid-cols-2 gap-2">
              {sortOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateSettings({ defaultSort: opt.value })}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-colors ${
                    settings.defaultSort === opt.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Sobre</h2>
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--primary))' }}>
                <ShoppingCart className="w-6 h-6" style={{ color: 'hsl(var(--primary-foreground))' }} />
              </div>
              <div>
                <p className="font-semibold">Compras</p>
                <p className="text-xs text-muted-foreground">Gestão de listas de supermercado</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1 pt-1 border-t border-border">
              <p>✅ 100% offline — sem internet necessária</p>
              <p>✅ Dados salvos localmente no dispositivo</p>
              <p>✅ Tema claro e escuro</p>
              <p>✅ Compartilhamento via apps</p>
            </div>
            <p className="text-xs text-muted-foreground text-center pt-1">Versão 1.0.0</p>
          </div>
        </section>
      </main>
    </div>
  );
}
