# 🌐 INTEGRAÇÃO COM PAGAMENTOS
================================

## Documentação para integrar PIX e WhatsApp

### PIX - Receber Pagamentos

#### Opção 1: Mostrar QR Code PIX

No arquivo "index.html", substitua a seção de pagamento por:

```html
<div class="payment-methods">
    <h3>Forma de Pagamento</h3>
    
    <label class="payment-option">
        <input type="radio" name="payment" value="pix" checked>
        <span>💳 PIX</span>
    </label>
    
    <div id="pixSection" style="margin-top: 15px; padding: 15px; background: #f0f0f0; border-radius: 8px;">
        <p style="font-weight: 600; margin-bottom: 10px;">Chave PIX:</p>
        <code style="padding: 10px; display: block; background: white; border-radius: 4px; word-break: break-all;">
            SEU_EMAIL_OU_CHAVE_PIX@banco.com
        </code>
        <p style="font-size: 0.85em; margin-top: 10px; color: #666;">
            Copie a chave acima ou escaneie o QR code no seu app bancário
        </p>
    </div>
    
    <label class="payment-option">
        <input type="radio" name="payment" value="whatsapp">
        <span>💬 WhatsApp</span>
    </label>
</div>
```

#### Opção 2: Integrar com Gateway

Para aceitar PIX diretamente no site, você precisa de um gateway como:
- **Mercado Pago** (https://www.mercadopago.com.br)
- **PagSeguro** (https://www.pageseguro.com.br)
- **Stripe** (https://stripe.com/br)

Isso requer um backend (Node.js, Python, etc).


### WhatsApp - Integração

#### Opção 1: Link Direto (Simples)

No script.js, já temos:

```javascript
const whatsappMessage = encodeURIComponent(
    `Oi ${buyer.name}! 👋\n\n` +
    `Obrigado pela compra! 🎉\n\n` +
    confirmationMessage.replace(/\n/g, '%0A')
);
// Descomente a linha abaixo para ativar:
// window.open(`https://wa.me/55${buyer.phone.replace(/\D/g, '')}?text=${whatsappMessage}`);
```

Para ativar, remova o comentário "//" da linha `window.open`.

Mude "SEU_NUMERO" para seu número com código do país:
```javascript
window.open(`https://wa.me/5511987654321?text=${whatsappMessage}`);
```


#### Opção 2: API WhatsApp (Avançado)

Requer integração com WhatsApp Business API:
1. Acesse https://developers.facebook.com
2. Crie uma app
3. Configure WhatsApp Business
4. Obtenha token de acesso
5. Integre com backend

Exemplo com Node.js:
```javascript
const twilio = require('twilio');

const client = twilio(account_sid, auth_token);

client.messages.create({
    body: 'Sua mensagem aqui',
    from: 'whatsapp:+55SEUUMERO',
    to: `whatsapp:+55${buyer.phone}`
});
```


### Email - Notificação de Compra

Para enviar emails, use um serviço como:
- **Mailgun** (https://www.mailgun.com)
- **SendGrid** (https://sendgrid.com)
- **Nodemailer** (se usar Node.js)

Exemplo com Nodemailer:
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'seu@email.com',
        pass: 'sua_senha'
    }
});

const mailOptions = {
    from: 'seu@email.com',
    to: buyer.email,
    subject: 'Rifa - Comprovante de Compra',
    html: `
        <h1>Obrigado pela compra!</h1>
        <p>ID: ${sale.id}</p>
        <p>Números: ${ticketList}</p>
        <p>Total: ${total}</p>
    `
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log(info);
});
```


### Backend Recomendado (Para Escalar)

Se quiser migrar para um backend completo:

#### Opção 1: Node.js + Express
```bash
npm init -y
npm install express cors dotenv nodemailer
```

#### Opção 2: Python + Flask
```bash
pip install flask python-dotenv flask-cors
```

#### Opção 3: Usar Serverless
- **AWS Lambda** (https://aws.amazon.com/lambda)
- **Google Cloud Functions** (https://cloud.google.com/functions)
- **Netlify Functions** (https://docs.netlify.com/functions/overview)

Netlify Functions é a melhor opção para quem está usando Netlify!


### Banco de Dados

Para armazenar dados em produção:
- **Firebase** (https://firebase.google.com) - Recomendado para iniciantes
- **MongoDB** (https://www.mongodb.com)
- **PostgreSQL** (https://www.postgresql.org)
- **Supabase** (https://supabase.com) - Alternativa open-source ao Firebase


### Configurar Variáveis de Ambiente

Crie um arquivo ".env" na raiz:

```
PIX_KEY=seu_email@banco.com
WHATSAPP_TOKEN=token_aqui
EMAIL_USER=seu@email.com
EMAIL_PASS=sua_senha
DATABASE_URL=mongodb://usuario:senha@host/db
```

Nunca compartilhe esse arquivo!


### Checklist de Segurança

✓ Sempre valide dados no backend
✓ Use HTTPS (Netlify oferece grátis)
✓ Nunca exponha chaves de API
✓ Sanitize inputs para evitar XSS
✓ Use tokens CSRF para formulários
✓ Faça backup regulares dos dados
✓ Implemente rate limiting
✓ Use autenticação se necessário


### Próximos Passos

1. **MVP Simples** (O que você tem agora):
   - Frontend em HTML/CSS/JS
   - localStorage para persistência
   - Link compartilhável

2. **Versão Intermediária**:
   - Backend simples (Node/Python)
   - API para salvar dados
   - Integração com WhatsApp API

3. **Versão Pro**:
   - Gateway de pagamento integrado
   - Sistema de admin dashboard
   - Relatórios e analytics
   - Múltiplas rifas simultâneas


### Suporte e Recursos

- **Netlify Docs**: https://docs.netlify.com
- **MDN Web Docs**: https://developer.mozilla.org
- **Firebase Docs**: https://firebase.google.com/docs
- **Node.js Docs**: https://nodejs.org/docs
- **WhatsApp API**: https://developers.facebook.com/docs/whatsapp


💡 Comece simples e escale conforme necessário!

Boa sorte! 🚀
