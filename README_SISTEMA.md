# 🎰 RIFA - Sistema Completo

Um sistema de rifa online com admin, autenticação e mensagens inteligentes por WhatsApp.

## ✨ Recursos

### 🎯 Para Clientes
- ✅ Seleção intuitiva de números (000-099)
- ✅ Números começam **todos livres**
- ✅ Sincronização em tempo real
- ✅ Mensagens automáticas inteligentes via WhatsApp
- ✅ Design responsivo e moderno

### 🛠️ Para Admin
- ✅ Dashboard seguro com autenticação
- ✅ Gerenciar reservas manualmente
- ✅ Visualizar todas as transações
- ✅ Enviar mensagens personalizadas
- ✅ Sincronização em tempo real com cliente

### 💬 Sistema de Mensagens Inteligentes
O sistema gera automaticamente mensagens personalizadas baseadas nos números escolhidos:

**Exemplos:**
```
Olá! 👋
Estou interessado em participar da rifa! 🎰
Gostaria de reservar os números: 014, 072, 040
Total de números: 3
```

```
Opa! Tenho sorte nessa! 🍀
Com licença, gostaria desses números: 014, 072, 040
(3 no total)
```

```
Testando a sorte! ✨
Interessado em: 014, 072, 040
Quantidade: 3
```

A mensagem é **gerada aleatoriamente** entre 10 templates diferentes, tornando cada interação única!

## 🚀 Como Usar

### Cliente
1. Acesse: `seu-site.com`
2. Clique nos números que deseja
3. Preencha seu nome e WhatsApp
4. Envie o pedido
5. Receba mensagem no WhatsApp com sua reserva

### Admin
1. Acesse: `seu-site.com/admin.html`
2. **Senha:** `admin123` (altere em `admin.html` linha 8)
3. **Funções:**
   - Visualizar números disponíveis
   - Adicionar reservas manualmente
   - Enviar mensagens personalizadas
   - Confirmar ou remover reservas

## 🔧 Configurações

### Alterar Senha do Admin
Edite `admin.html`, linha 8:
```javascript
password: 'sua_nova_senha_aqui'
```

### Alterar WhatsApp Admin
Edite `script.js`, linha 2:
```javascript
whatsappAdmin: '5511991818457' // Seu número aqui
```

Edite `admin.html`, linha 90:
```javascript
whatsappAdmin: '5511991818457' // Seu número aqui
```

## 🤖 Integração com API de IA (Opcional)

Se deseja usar uma API para gerar mensagens ainda mais inteligentes:

### Opção 1: OpenAI API
```javascript
// Adicionar em script.js
class AIMessageGenerator {
    async generate(numbers, quantity) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer SEU_API_KEY',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'user',
                    content: `Gere uma mensagem natural e amigável para alguém interessado em números de rifa: ${numbers} (${quantity} números). A mensagem deve ser informal, com emojis e entre 30-50 palavras.`
                }]
            })
        });
        const data = await response.json();
        return data.choices[0].message.content;
    }
}
```

### Opção 2: Google Cloud Natural Language
Similar ao OpenAI, integre conforme documentação oficial.

## 📊 Dados Armazenados

Todos os dados são armazenados no `localStorage` do navegador:
- Números reservados
- Histórico de vendas
- Sessão admin

**Para backup:** No admin, pressione `Ctrl+Shift+E`

## 📱 Fluxo de Mensagens

1. **Cliente seleciona números** → Sistema gera mensagem inteligente
2. **Cliente envia** → Mensagem vai para seu WhatsApp
3. **Admin recebe notificação** → Com todos os dados
4. **Admin confirma** → Envia confirmação ao cliente

## 🎨 Customização

### Adicionar Mais Templates de Mensagem
Edite `script.js`, classe `MessageGenerator`:

```javascript
this.templates = [
    // Adicione seus templates aqui
    (numbers, qty) => `Sua mensagem aqui: ${numbers}`,
    (numbers, qty) => `Outra variação: ${numbers}`,
];
```

### Alterar Cores
Edite `style.css`:
```css
:root {
    --primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --accent: #51cf66;
    --danger: #ff6b6b;
}
```

## 🔒 Segurança

- ✅ Autenticação básica no admin
- ✅ Dados no localStorage (local apenas)
- ✅ Sem backend necessário
- ✅ Validação de entrada em todos os campos

**Para produção:**
- Use HTTPS
- Considere migrar para um backend (Node.js, Python, etc)
- Implemente JWT ou outro sistema de autenticação robusto

## 📞 Contato

Para dúvidas ou sugestões sobre este sistema, entre em contato.

---

**Desenvolvido com ❤️ para rifas solidárias**
