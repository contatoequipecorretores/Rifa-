# 🧹 Como Zerar as Reservas

## Opção 1: Via Admin Dashboard (Recomendado)

1. Acesse **admin.html**
2. Faça login com a senha
3. Na seção **"🧹 Ferramentas"**, clique no botão **"🔄 Zerar TODAS as Reservas"**
4. Confirme as duas mensagens de aviso
5. Pronto! Todas as reservas e vendas serão zeradas

## Opção 2: Via Console JavaScript

1. Abra o site (index.html ou admin.html)
2. Pressione `F12` para abrir o Developer Tools (Console)
3. Cole o comando:
   ```javascript
   app.clearAllReservations()
   ```
4. Confirme as duas mensagens de aviso
5. Pronto!

## Alterações Realizadas

✅ **Imagem atualizada**: A nova imagem do produto (`images (34).jpeg`) está sendo exibida na página principal

✅ **Função de limpeza**: Adicionada função `clearAllReservations()` no script.js

✅ **Admin melhorado**: 
- Botão para zerar todas as reservas
- Botão para exportar backup dos dados
- Opção de remover reservas individuais (já existia)

## Funcionalidades de Admin

### Remover Reserva Individual
- Clique no botão 🗑️ **Cancelar** ao lado de cada reserva
- Isso libera os números automaticamente

### Confirmar Pagamento
- Clique no botão 💰 **Confirmar Pagamento** para marcar como pago
- Envia mensagem automática ao cliente

### Exportar Dados
- Clique em 📥 **Exportar Dados (Backup)** 
- Salva um arquivo JSON com todas as informações

### Adicionar Reserva Manualmente
- Preencha os dados do cliente
- Digite os números separados por vírgula
- Clique em ✅ **Adicionar**

---

**Nota**: Todas as ações de limpeza requerem confirmação dupla para segurança!
