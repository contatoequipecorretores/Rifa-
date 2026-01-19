// Configuração da aplicação
const config = {
    totalTickets: 100,
    whatsappAdmin: '5515991818457' // Seu WhatsApp correto
};

// Gerador Inteligente de Mensagens
class MessageGenerator {
    constructor() {
        this.templates = [
            (numbers, qty) => `Olá! 👋\n\nEstou interessado em participar da rifa! 🎰\n\nGostaria de reservar os números: ${numbers}\n\nTotal de números: ${qty}`,
            (numbers, qty) => `Oi! 😊\n\nQuero garantir minha chance! Vou levar os números ${numbers} (${qty} no total).`,
            (numbers, qty) => `Opa! Tenho sorte nessa! 🍀\n\nCom licença, gostaria desses números: ${numbers}\n\n(${qty} números no total)`,
            (numbers, qty) => `Testando a sorte! ✨\n\nInteressado em: ${numbers}\n\nQuantidade: ${qty}`,
            (numbers, qty) => `Vamo lá! 🎯\n\nQuero esses números: ${numbers}\n\nTotal: ${qty} entrada(s)`,
            (numbers, qty) => `E aí! Tudo certo? 👍\n\nGostaria de reservar: ${numbers}\n\nSão ${qty} número(s)`,
            (numbers, qty) => `Pode crer! 💪\n\nVou querer esses números aí: ${numbers}\n\n(${qty} ao todo)`,
            (numbers, qty) => `Boa sorte tem que ter! 🎲\n\nReservo esses aqui: ${numbers}\n\nTotal de ${qty}`,
            (numbers, qty) => `Deixa eu tentar! 🍀\n\nOs números que quero são: ${numbers}\n\nQuantidade: ${qty}`,
            (numbers, qty) => `Bora nessa! 🚀\n\nInteressado em: ${numbers}\n\n(${qty} números no total)`,
        ];
    }

    generate(numbers, quantity) {
        const randomIndex = Math.floor(Math.random() * this.templates.length);
        const template = this.templates[randomIndex];
        return template(numbers, quantity);
    }
}

// Classe principal da aplicação
class RifaApp {
    constructor() {
        this.tickets = new Map(); // Mapa de números da rifa
        this.cart = []; // Carrinho de compras
        this.sales = []; // Histórico de vendas
        this.messageGenerator = new MessageGenerator();
        
        this.init();
        this.loadFromStorage();
        this.renderTickets();
        this.setupEventListeners();
        
        // Atualizar em tempo real a cada 2 segundos
        setInterval(() => this.updateRealTime(), 2000);
    }

    init() {
        // Inicializar todos os 100 números (1 a 100) - 100% LIVRES
        for (let i = 1; i <= config.totalTickets; i++) {
            this.tickets.set(i, {
                number: i,
                sold: false,
                buyer: null,
                email: null,
                phone: null,
                date: null,
                paymentStatus: 'pendente' // 'pendente', 'confirmado', 'cancelado'
            });
        }
    }

    loadFromStorage() {
        const saved = localStorage.getItem('rifaData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.tickets = new Map(data.tickets);
                this.sales = data.sales || [];
            } catch (e) {
                console.log('Dados corrompidos, inicializando novo');
                this.init();
            }
        }
    }

    saveToStorage() {
        const data = {
            tickets: Array.from(this.tickets.entries()),
            sales: this.sales
        };
        localStorage.setItem('rifaData', JSON.stringify(data));
    }

    renderTickets() {
        const grid = document.getElementById('ticketsGrid');
        grid.innerHTML = '';

        this.tickets.forEach((ticket, number) => {
            const btn = document.createElement('button');
            btn.className = 'ticket-btn';
            btn.textContent = String(number).padStart(3, '0'); // 000, 001, 002...
            
            if (ticket.sold) {
                btn.classList.add('sold');
                btn.disabled = true;
                btn.title = `Reservado por: ${ticket.buyer}`;
            } else if (this.cart.some(t => t.number === number)) {
                btn.classList.add('selected');
                btn.classList.add('available');
            } else {
                btn.classList.add('available');
            }

            btn.addEventListener('click', () => this.toggleTicket(number));
            grid.appendChild(btn);
        });

        this.updateStats();
    }

    toggleTicket(number) {
        const ticket = this.tickets.get(number);
        
        if (ticket.sold) return; // Não permitir selecionar vendidos

        const isInCart = this.cart.some(t => t.number === number);

        if (isInCart) {
            this.removeFromCart(number);
        } else {
            this.addToCart(number);
        }

        this.renderTickets();
        this.updateCart();
    }

    addToCart(number) {
        const ticket = this.tickets.get(number);
        this.cart.push({
            number: number
        });
        
        this.showNotification(`✓ Número ${String(number).padStart(3, '0')} adicionado!`);
    }

    removeFromCart(number) {
        this.cart = this.cart.filter(t => t.number !== number);
        this.showNotification(`✗ Número ${String(number).padStart(3, '0')} removido`);
    }

    updateCart() {
        const cartSection = document.getElementById('cartSection');
        const emptyMessage = document.getElementById('emptyCartMessage');
        const cartItems = document.getElementById('cartItems');
        const selectedSection = document.getElementById('selectedSection');
        
        if (this.cart.length === 0) {
            cartSection.style.display = 'none';
            emptyMessage.style.display = 'block';
            selectedSection.style.display = 'none';
        } else {
            cartSection.style.display = 'block';
            emptyMessage.style.display = 'none';
            selectedSection.style.display = 'block';

            // Atualizar items do carrinho
            cartItems.innerHTML = this.cart.map((item, idx) => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-label">Número ${String(item.number).padStart(3, '0')}</div>
                    </div>
                    <button class="cart-item-remove" onclick="app.removeFromCart(${item.number}); app.updateCart(); app.renderTickets();">×</button>
                </div>
            `).join('');

            // Atualizar badges
            const badgesContainer = document.getElementById('selectedBadges');
            badgesContainer.innerHTML = this.cart
                .sort((a, b) => a.number - b.number)
                .map(item => `
                    <div class="badge">
                        ${String(item.number).padStart(3, '0')}
                        <span class="remove" onclick="app.removeFromCart(${item.number}); app.updateCart(); app.renderTickets();">×</span>
                    </div>
                `).join('');
        }
    }

    updateStats() {
        const sold = Array.from(this.tickets.values()).filter(t => t.sold).length;
        const available = config.totalTickets - sold;
        const percent = Math.round((sold / config.totalTickets) * 100);

        document.getElementById('soldCount').textContent = sold;
        document.getElementById('availCount').textContent = available;
        document.getElementById('percentSold').textContent = percent;
        
        const fill = document.getElementById('progressFill');
        fill.style.width = percent + '%';
        if (percent > 0) {
            fill.textContent = percent + '%';
        }
    }

    updateRealTime() {
        // Atualização em tempo real - sincroniza com localStorage
        const saved = localStorage.getItem('rifaData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                // Verificar se houve mudanças (vendas de outro usuário)
                const newTickets = new Map(data.tickets);
                let changed = false;
                
                newTickets.forEach((ticket, number) => {
                    const currentTicket = this.tickets.get(number);
                    if (currentTicket && currentTicket.sold !== ticket.sold) {
                        changed = true;
                        this.tickets.set(number, ticket);
                    }
                });
                
                if (changed) {
                    this.renderTickets();
                }
            } catch (e) {
                console.log('Erro ao sincronizar dados');
            }
        }
    }

    clearCart() {
        if (confirm('Tem certeza que deseja limpar os números?')) {
            this.cart = [];
            this.renderTickets();
            this.updateCart();
            this.showNotification('Números removidos');
        }
    }

    sendViaWhatsApp() {
        if (this.cart.length === 0) {
            this.showNotification('Selecione pelo menos um número!', true);
            return;
        }

        // Mostrar modal com dados
        document.getElementById('dataModal').style.display = 'block';
        
        // Mostrar números no modal
        const numbersText = this.cart
            .sort((a, b) => a.number - b.number)
            .map(t => String(t.number).padStart(3, '0'))
            .join(', ');
        
        document.getElementById('modalNumbers').textContent = 'Números: ' + numbersText;
        
        // Limpar formulário
        document.getElementById('name').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('email').value = '';
    }

    submitData() {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!name) {
            this.showNotification('Preencha seu nome!', true);
            return;
        }

        if (!phone) {
            this.showNotification('Preencha seu WhatsApp!', true);
            return;
        }

        // Processar compra
        this.finalizePurchase({
            name,
            phone,
            email
        });
    }

    finalizePurchase(buyer) {
        const sale = {
            id: 'RIFA-' + Date.now(),
            date: new Date().toLocaleString('pt-BR'),
            buyer: buyer.name,
            email: buyer.email,
            phone: buyer.phone,
            tickets: [...this.cart],
            paymentStatus: 'pendente' // Começa como pendente até admin confirmar
        };

        // Marcar números como vendidos
        this.cart.forEach(item => {
            const ticket = this.tickets.get(item.number);
            ticket.sold = true;
            ticket.buyer = buyer.name;
            ticket.email = buyer.email;
            ticket.phone = buyer.phone;
            ticket.date = new Date().toLocaleString('pt-BR');
            ticket.paymentStatus = 'pendente'; // Aguardando confirmação
        });

        // Salvar venda
        this.sales.push(sale);
        this.saveToStorage();

        // Preparar lista de números
        const ticketList = this.cart
            .sort((a, b) => a.number - b.number)
            .map(t => String(t.number).padStart(3, '0'))
            .join(', ');

        // GERAR MENSAGEM INTELIGENTE AUTOMATICAMENTE
        const intelligentMessage = this.messageGenerator.generate(ticketList, this.cart.length);

        // MENSAGEM PARA O CLIENTE (enviada automaticamente pelo sistema)
        const clientMessage = `
${intelligentMessage}

---

*Dados do Cliente:*
Nome: ${buyer.name}
Telefone: ${buyer.phone}

*Status:* Aguardando confirmação de pagamento ⏳
        `.trim();

        // MENSAGEM INTELIGENTE PARA O ADMIN
        const adminMessage = `
🎯 *NOVA RIFA RECEBIDA!* 🎯

*Cliente:* ${buyer.name}
*Telefone:* ${buyer.phone}
${buyer.email ? `*E-mail:* ${buyer.email}` : ''}

*Números Reservados:* ${ticketList}
*Quantidade:* ${this.cart.length}

*Data/Hora:* ${sale.date}
*ID:* ${sale.id}

💬 *Mensagem do Cliente:*
${intelligentMessage}

_Próximos passos: Confirmar pagamento e status_
        `.trim();

        // Enviar para seu WhatsApp (admin)
        const adminMessageEncoded = encodeURIComponent(adminMessage);
        const adminLink = `https://wa.me/${config.whatsappAdmin}?text=${adminMessageEncoded}`;

        const clientMessageEncoded = encodeURIComponent(clientMessage);
        const clientLink = `https://wa.me/55${buyer.phone.replace(/\D/g, '')}?text=${clientMessageEncoded}`;

        // Salvar links
        this.lastAdminLink = adminLink;
        this.lastClientLink = clientLink;

        // Limpar formulário e carrinho
        this.resetForm();
        this.cart = [];
        this.renderTickets();
        this.updateCart();
        this.closeModal();

        // Abrir mensagens no WhatsApp
        // 1º Notificar admin
        window.open(adminLink, '_blank');
        
        // 2º Enviar confirmação ao cliente
        setTimeout(() => {
            window.open(clientLink, '_blank');
        }, 1000);

        // Mostrar confirmação na tela
        this.showNotification('✓ Pedido enviado! Verifique seu WhatsApp', false);
        alert(`✅ Pedido Confirmado!\n\nNúmeros: ${ticketList}\nQtd: ${this.cart.length}\n\nVocê e o admin receberão mensagens no WhatsApp.`);
    }

    resetForm() {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
    }

    closeModal() {
        document.getElementById('dataModal').style.display = 'none';
    }

    showNotification(message, isError = false) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.remove('error');
        if (isError) {
            notification.classList.add('error');
        }
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    setupEventListeners() {
        // Fechar modal ao clicar fora
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('dataModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Formatação de telefone
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 2) {
                        value = `(${value}`;
                    } else if (value.length <= 7) {
                        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                    } else {
                        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
                    }
                }
                e.target.value = value;
            });
        }
    }

    // Método para gerar relatório de vendas (para admin)
    generateSalesReport() {
        console.log('=== RELATÓRIO DE VENDAS ===');
        console.log(`Total de reservas: ${this.sales.length}`);
        console.log(`Números reservados: ${Array.from(this.tickets.values()).filter(t => t.sold).length}/100`);
        console.table(this.sales);
    }

    // Exportar dados (para backup)
    exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            tickets: Array.from(this.tickets.entries()),
            sales: this.sales
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rifa-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Zerar todas as reservas
    clearAllReservations() {
        if (!confirm('⚠️ ATENÇÃO! Isso vai ZERAR TODAS as reservas e vendas!\n\nDeseja continuar?')) {
            return;
        }
        
        if (!confirm('Tem CERTEZA absoluta? Essa ação não pode ser desfeita!')) {
            return;
        }

        // Limpar todos os tickets
        for (let i = 1; i <= config.totalTickets; i++) {
            this.tickets.set(i, {
                number: i,
                sold: false,
                buyer: null,
                email: null,
                phone: null,
                date: null,
                paymentStatus: 'pendente'
            });
        }

        // Limpar todas as vendas
        this.sales = [];

        // Salvar e renderizar
        this.saveToStorage();
        this.renderTickets();
        this.updateStats();

        console.log('✅ Todas as reservas foram zeradas!');
        alert('✅ Reservas zeradas com sucesso!');
    }
}

// Instanciar aplicação
const app = new RifaApp();

// Teclas de atalho para admin
document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+R para gerar relatório
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        app.generateSalesReport();
    }
    // Ctrl+Shift+E para exportar dados
    if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        app.exportData();
    }
    // Ctrl+Shift+Z para zerar dados (confirmação dupla)
    if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
        console.log('💡 Dica: Pressione Ctrl+Shift+Z novamente em 3 segundos para zerar tudo');
        app._zeroConfirmStage1();
    }
});

// Adicionar método para confirmar zeramento de dados
RifaApp.prototype._zeroConfirmStage1 = function() {
    if (!this._zeroConfirmTime) {
        this._zeroConfirmTime = Date.now();
        setTimeout(() => {
            this._zeroConfirmTime = null;
        }, 3000);
    } else if (Date.now() - this._zeroConfirmTime < 3000) {
        this.clearAllReservations();
    }
};
