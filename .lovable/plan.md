
## 🛒 Aplicativo de Gestão de Compras de Supermercado — Mobile

Um app mobile completo e intuitivo para gerenciar listas de compras, funcionando 100% offline com dados salvos localmente no dispositivo.

---

### 📱 Tela Principal — Minhas Listas
- Header com título do app, botão de configurações (tema claro/escuro) e campo de busca
- Cards de listas exibindo: título, data, quantidade de itens, valor total estimado e progresso de itens comprados (barra de progresso)
- Empty state amigável quando não há listas
- Swipe para esquerda no card: deletar lista (com confirmação)
- Swipe para direita no card: duplicar lista
- Botão FAB flutuante para criar nova lista

---

### 📋 Tela de Detalhes da Lista
- Header com título editável inline, botão voltar e menu de ações (⋯)
- **Menu de ações**: compartilhar via apps, copiar como texto, exportar para impressão, duplicar lista, deletar lista
- **Filtros e ordenação**: chips para filtrar por categoria, ordenar por nome/preço/categoria/status, agrupar por categoria
- **Ações em massa**: marcar todos, desmarcar todos, limpar comprados
- Lista de itens com scroll suave
- Swipe esquerda no item: deletar (com confirmação)
- Swipe direita no item: marcar como comprado
- Long press no item: menu de opções
- Drag and drop para reordenar manualmente
- Botão FAB para adicionar novo item
- **Rodapé fixo** com: valor total da lista, total de itens e itens comprados

---

### 📝 Modal de Adicionar / Editar Item (Bottom Sheet)
- Campo **Item**: texto com autocomplete de produtos sugeridos enquanto digita
- Campo **Quantidade**: input numérico com botões − e + para ajuste rápido, aceita decimais
- Campo **Categoria**: select com as 12 categorias definidas (Hortifruti, Açougue, etc.)
- Campo **Valor Unitário**: máscara monetária BRL automática (R$ 0,00), teclado numérico
- Campo **Valor Total**: calculado automaticamente (Qtd × Valor), somente leitura
- Checkbox **Comprado**: marcação com efeito de texto riscado
- Validações com mensagens de erro claras
- Foco automático no campo Item ao abrir

---

### 💾 Armazenamento e Dados
- Tudo salvo no **localStorage** do dispositivo — sem necessidade de internet
- Auto-save a cada alteração
- Funcionalidade 100% offline

---

### 🎨 Design e Experiência
- Layout **mobile-first** com áreas de toque mínimas de 44×44px
- Tema **claro e escuro** alternável
- Animações e transições fluidas
- Estados de loading, empty state e feedbacks visuais de ações
- Cores por categoria para identificação rápida dos itens

---

### ⚙️ Tela de Configurações
- Alternância de tema claro/escuro
- Ordenação padrão dos itens
- Sobre o app

---

### 📊 Extras (implementados junto)
- Histórico de listas arquivadas com opção de restaurar
- Compartilhamento via Web Share API nativa do celular
- Cópia da lista como texto formatado para clipboard

**Stack**: React + TypeScript + Tailwind CSS + localStorage — sem backend necessário.
