export type Category =
  | 'Hortifruti'
  | 'Açougue'
  | 'Frios e Laticínios'
  | 'Padaria'
  | 'Mercearia'
  | 'Bebidas'
  | 'Congelados'
  | 'Limpeza'
  | 'Higiene Pessoal'
  | 'Pet Shop'
  | 'Bomboniere'
  | 'Utilidades Domésticas';

export const CATEGORIES: Category[] = [
  'Hortifruti',
  'Açougue',
  'Frios e Laticínios',
  'Padaria',
  'Mercearia',
  'Bebidas',
  'Congelados',
  'Limpeza',
  'Higiene Pessoal',
  'Pet Shop',
  'Bomboniere',
  'Utilidades Domésticas',
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Hortifruti: 'bg-category-hortifruti text-category-hortifruti-fg',
  Açougue: 'bg-category-acougue text-category-acougue-fg',
  'Frios e Laticínios': 'bg-category-frios text-category-frios-fg',
  Padaria: 'bg-category-padaria text-category-padaria-fg',
  Mercearia: 'bg-category-mercearia text-category-mercearia-fg',
  Bebidas: 'bg-category-bebidas text-category-bebidas-fg',
  Congelados: 'bg-category-congelados text-category-congelados-fg',
  Limpeza: 'bg-category-limpeza text-category-limpeza-fg',
  'Higiene Pessoal': 'bg-category-higiene text-category-higiene-fg',
  'Pet Shop': 'bg-category-pet text-category-pet-fg',
  Bomboniere: 'bg-category-bomboniere text-category-bomboniere-fg',
  'Utilidades Domésticas': 'bg-category-utilidades text-category-utilidades-fg',
};

export const CATEGORY_DOT_COLORS: Record<Category, string> = {
  Hortifruti: 'bg-[hsl(var(--category-hortifruti))]',
  Açougue: 'bg-[hsl(var(--category-acougue))]',
  'Frios e Laticínios': 'bg-[hsl(var(--category-frios))]',
  Padaria: 'bg-[hsl(var(--category-padaria))]',
  Mercearia: 'bg-[hsl(var(--category-mercearia))]',
  Bebidas: 'bg-[hsl(var(--category-bebidas))]',
  Congelados: 'bg-[hsl(var(--category-congelados))]',
  Limpeza: 'bg-[hsl(var(--category-limpeza))]',
  'Higiene Pessoal': 'bg-[hsl(var(--category-higiene))]',
  'Pet Shop': 'bg-[hsl(var(--category-pet))]',
  Bomboniere: 'bg-[hsl(var(--category-bomboniere))]',
  'Utilidades Domésticas': 'bg-[hsl(var(--category-utilidades))]',
};

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: Category;
  unitPrice: number;
  bought: boolean;
  order: number;
}

export interface ShoppingList {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  items: ShoppingItem[];
  archived: boolean;
}

export type SortField = 'name' | 'price' | 'category' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  defaultSort: SortField;
  defaultSortDirection: SortDirection;
}

export const PRODUCT_SUGGESTIONS: string[] = [
  'Arroz', 'Feijão', 'Macarrão', 'Farinha de trigo', 'Açúcar', 'Sal',
  'Óleo de soja', 'Azeite de oliva', 'Leite', 'Manteiga', 'Margarina',
  'Queijo mussarela', 'Queijo prato', 'Iogurte', 'Creme de leite',
  'Pão de forma', 'Pão francês', 'Biscoito cream cracker', 'Biscoito recheado',
  'Café', 'Achocolatado', 'Suco de laranja', 'Refrigerante', 'Água mineral',
  'Cerveja', 'Vinho', 'Suco de caixinha',
  'Frango', 'Carne bovina', 'Linguiça', 'Bacon', 'Presunto', 'Mortadela',
  'Ovo', 'Tomate', 'Cebola', 'Alho', 'Batata', 'Cenoura', 'Alface',
  'Banana', 'Maçã', 'Laranja', 'Mamão', 'Melancia', 'Abacate',
  'Detergente', 'Sabão em pó', 'Amaciante', 'Desinfetante', 'Água sanitária',
  'Shampoo', 'Condicionador', 'Sabonete', 'Creme dental', 'Fio dental',
  'Papel higiênico', 'Papel toalha', 'Guardanapo', 'Sacola plástica',
  'Maionese', 'Ketchup', 'Mostarda', 'Molho de tomate', 'Extrato de tomate',
  'Sardinha', 'Atum enlatado', 'Milho enlatado', 'Ervilha enlatada',
  'Sorvete', 'Pizza congelada', 'Lasanha congelada', 'Hambúrguer congelado',
  'Ração para cachorro', 'Ração para gato', 'Areia para gato',
  'Chocolate', 'Bombom', 'Bala', 'Pipoca',
  'Vassoura', 'Rodo', 'Esponja', 'Luva de borracha',
];
