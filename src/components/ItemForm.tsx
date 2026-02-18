import React, { useState, useEffect, useRef } from 'react';
import { ShoppingItem, Category, CATEGORIES, PRODUCT_SUGGESTIONS } from '@/types/shopping';
import { formatCurrency, formatCurrencyInput, parseCurrency } from '@/hooks/useShoppingLists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Minus, Plus, X } from 'lucide-react';

interface ItemFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: Omit<ShoppingItem, 'id' | 'order'>) => void;
  initialData?: ShoppingItem | null;
  defaultCategory?: Category;
}

const DEFAULT_CATEGORY: Category = 'Mercearia';

export function ItemForm({ open, onClose, onSave, initialData, defaultCategory }: ItemFormProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState<Category>(defaultCategory || DEFAULT_CATEGORY);
  const [unitPriceDisplay, setUnitPriceDisplay] = useState('');
  const [bought, setBought] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name);
        setQuantity(String(initialData.quantity));
        setCategory(initialData.category);
        setUnitPriceDisplay(initialData.unitPrice > 0 ? formatCurrency(initialData.unitPrice) : '');
        setBought(initialData.bought);
      } else {
        setName('');
        setQuantity('1');
        setCategory(defaultCategory || DEFAULT_CATEGORY);
        setUnitPriceDisplay('');
        setBought(false);
      }
      setErrors({});
      setSuggestions([]);
      setShowSuggestions(false);
      setTimeout(() => nameRef.current?.focus(), 300);
    }
  }, [open, initialData, defaultCategory]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (val.length >= 2) {
      const filtered = PRODUCT_SUGGESTIONS.filter(s =>
        s.toLowerCase().startsWith(val.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const adjustQuantity = (delta: number) => {
    const current = parseFloat(quantity) || 0;
    const next = Math.max(0.5, Math.round((current + delta) * 10) / 10);
    setQuantity(String(next));
  };

  const handlePriceChange = (val: string) => {
    const formatted = formatCurrencyInput(val);
    setUnitPriceDisplay(formatted);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = 'Nome deve ter pelo menos 2 caracteres';
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) errs.quantity = 'Quantidade deve ser maior que zero';
    if (!category) errs.category = 'Selecione uma categoria';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const unitPrice = parseCurrency(unitPriceDisplay);
  const totalValue = (parseFloat(quantity) || 0) * unitPrice;

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      name: name.trim(),
      quantity: parseFloat(quantity) || 1,
      category,
      unitPrice,
      bought,
    });
    onClose();
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader className="pb-0">
          <div className="flex items-center justify-between">
            <DrawerTitle>{initialData ? 'Editar Item' : 'Novo Item'}</DrawerTitle>
            <button
              onClick={onClose}
              className="touch-target flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-2 space-y-4">
          {/* Item Name */}
          <div className="space-y-1.5 relative">
            <Label htmlFor="item-name">Item *</Label>
            <Input
              ref={nameRef}
              id="item-name"
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Ex: Arroz, Feijão, Leite..."
              className={errors.name ? 'border-destructive' : ''}
              autoComplete="off"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            {showSuggestions && (
              <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                {suggestions.map(s => (
                  <button
                    key={s}
                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                    onMouseDown={() => {
                      setName(s);
                      setShowSuggestions(false);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <Label>Quantidade *</Label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustQuantity(-0.5)}
                className="touch-target w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <Input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                inputMode="decimal"
                min="0.1"
                step="0.5"
                className={`text-center ${errors.quantity ? 'border-destructive' : ''}`}
              />
              <button
                type="button"
                onClick={() => adjustQuantity(0.5)}
                className="touch-target w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {errors.quantity && <p className="text-xs text-destructive">{errors.quantity}</p>}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Categoria *</Label>
            <Select value={category} onValueChange={v => setCategory(v as Category)}>
              <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
          </div>

          {/* Unit Price */}
          <div className="space-y-1.5">
            <Label htmlFor="unit-price">Valor Unitário</Label>
            <Input
              id="unit-price"
              value={unitPriceDisplay}
              onChange={e => handlePriceChange(e.target.value)}
              placeholder="R$ 0,00"
              inputMode="numeric"
            />
          </div>

          {/* Total Value (read-only) */}
          <div className="space-y-1.5">
            <Label>Valor Total</Label>
            <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted text-sm text-muted-foreground flex items-center">
              {totalValue > 0 ? formatCurrency(totalValue) : 'R$ 0,00'}
            </div>
          </div>

          {/* Bought checkbox */}
          <div className="flex items-center gap-3 py-1">
            <Checkbox
              id="item-bought"
              checked={bought}
              onCheckedChange={v => setBought(!!v)}
              className="w-5 h-5"
            />
            <Label htmlFor="item-bought" className="text-sm cursor-pointer">
              Item já comprado
            </Label>
          </div>
        </div>

        <DrawerFooter className="pt-2">
          <Button onClick={handleSave} className="w-full h-12 text-base rounded-xl">
            {initialData ? 'Salvar Alterações' : 'Adicionar Item'}
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
