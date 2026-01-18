# 🎰 RIFA LAVADORA TANQUINHO NEWMAQ 10KG

Uma plataforma completa e moderna para rifar uma Lavadora Tanquinho Newmaq 10Kg com **100 números** a **R$ 15,00 cada**.

## ✨ Características

✅ **Interface Moderna & Responsiva** - Design atrativo e otimizado para mobile
✅ **100 Números** - Grid interativo com visualização em tempo real
✅ **Carrinho de Compras** - Selecione múltiplos números
✅ **Desconto Progressivo** - 5% de desconto a partir de 3 números
✅ **Atualização em Tempo Real** - Sincronização automática de vendas
✅ **Persistência de Dados** - Usa localStorage para salvar vendas
✅ **Checkout Completo** - Formulário com nome, email, telefone e CPF
✅ **Formas de Pagamento** - PIX ou WhatsApp
✅ **Estatísticas** - Acompanhamento de vendas em tempo real
✅ **Admin Tools** - Relatórios e backup de dados

## 🚀 Deploy no Netlify

### Método 1: Arrastar e Soltar (Mais Fácil!)

1. Acesse [Netlify](https://app.netlify.com)
2. Faça login com sua conta (GitHub, Google, etc.)
3. Arraste a pasta `Rifa-` para a área indicada
4. Pronto! Seu site estará online em segundos

### Método 2: CLI do Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Método 3: GitHub + Netlify

1. Faça push do projeto para GitHub
2. Conecte seu repositório no Netlify
3. Configure build: deixe vazio
4. Cada push atualiza automaticamente

## 📋 Estrutura de Arquivos

```
Rifa-/
├── index.html      # HTML principal
├── style.css       # Estilos CSS
├── script.js       # Lógica JavaScript
├── netlify.toml    # Configuração Netlify
└── README.md       # Este arquivo
```

## 💻 Uso Local

1. Abra `index.html` no navegador
2. Selecione os números desejados
3. Finalize a compra
4. Dados salvos automaticamente no localStorage

## 🎯 Como Usar

**Clientes:** Clique nos números, adicione ao carrinho, preencha dados e compre!
**Admin:** Pressione `Ctrl+Shift+R` para relatório ou `Ctrl+Shift+E` para exportar dados

## 💰 Valores

- **Por número:** R$ 15,00
- **Desconto:** 5% a partir de 3 números
- **Total disponível:** 100 números

## 🌐 Netlify Deploy - Passo a Passo

1. Acesse https://app.netlify.com
2. Clique em "Add new project" → "Deploy manually"
3. Arraste a pasta `Rifa-` para a área
4. Aguarde o deploy
5. Compartilhe o link gerado!

## 🎨 Personalizações

Altere em `script.js`:
```javascript
const config = {
    totalTickets: 100,  // número de tickets
    ticketPrice: 15,    // preço por ticket
};
```

Altere cores em `style.css`:
```css
:root {
    --primary: #FF6B6B;      /* vermelho */
    --secondary: #4ECDC4;    /* verde */
}
```

## 📱 Responsivo

✅ Funciona em desktop, tablet e mobile
✅ Design moderno e atrativo
✅ Barra de progresso em tempo real
✅ Carrinho de compras inteligente

## 💾 Dados

- Salvos em localStorage (sem servidor externo)
- Backup com `Ctrl+Shift+E`
- Relatório com `Ctrl+Shift+R`

## 📝 Licença

Livre para usar, modificar e compartilhar

---

**Boa sorte com sua rifa! 🍀**