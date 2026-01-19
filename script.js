// Configuração da aplicação
const config = {
    totalTickets: 100,
    whatsappAdmin: '5511991818457' // Seu WhatsApp
};

// Classe principal da aplicação
class RifaApp {
    constructor() {
        this.tickets = new Map(); // Mapa de números da rifa
        this.cart = []; // Carrinho de compras
        this.sales = []; // Histórico de vendas
        
        this.init();
        this.loadFromStorage();
        this.renderTickets();
        this.setupEventListeners();
        
        // Atualizar em tempo real a cada 2 segundos
        setInterval(() => this.updateRealTime(), 2000);
    }

    init() {
        // Inicializar todos os 100 números (0 a 99)
        for (let i = 0; i < config.totalTickets; i++) {
            this.tickets.set(i, {
                number: i,
                sold: false,
                buyer: null,
                email: null,
                phone: null,
                date: null
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
                    <button class="cart-item-remove" onclick="app.removeFromCart(${item.number})">×</button>
                </div>
            `).join('');

            // Atualizar badges
            const badgesContainer = document.getElementById('selectedBadges');
            badgesContainer.innerHTML = this.cart
                .sort((a, b) => a.number - b.number)
                .map(item => `
                    <div class="badge">
                        ${String(item.number).padStart(3, '0')}
                        <span class="remove" onclick="app.removeFromCart(${item.number})">×</span>
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
            tickets: [...this.cart]
        };

        // Marcar números como vendidos
        this.cart.forEach(item => {
            const ticket = this.tickets.get(item.number);
            ticket.sold = true;
            ticket.buyer = buyer.name;
            ticket.email = buyer.email;
            ticket.phone = buyer.phone;
            ticket.date = new Date().toLocaleString('pt-BR');
        });

        // Salvar venda
        this.sales.push(sale);
        this.saveToStorage();

        // Preparar lista de números
        const ticketList = this.cart
            .sort((a, b) => a.number - b.number)
            .map(t => String(t.number).padStart(3, '0'))
            .join(', ');

        const confirmationMessage = `
🎰 NOVA RIFA RECEBIDA!

Cliente: ${buyer.name}
Telefone: ${buyer.phone}
${buyer.email ? `E-mail: ${buyer.email}` : ''}

Números Reservados: ${ticketList}
Total de Números: ${this.cart.length}
Data/Hora: ${sale.date}
ID: ${sale.id}

Próximos passos:
1. Acordar a forma de pagamento
2. Confirmar reserva
3. Aguardar resultado do sorteio
        `.trim();

        // Enviar para seu WhatsApp (admin)
        const adminMessage = encodeURIComponent(confirmationMessage);
        const adminLink = `https://wa.me/${config.whatsappAdmin}?text=${adminMessage}`;

        // Mensagem para o cliente
        const clientMessage = `
Obrigado pela sua participação! 🎉

Seus números: ${ticketList}
Quantidade: ${this.cart.length}

Entramos em contato em breve para confirmar o pagamento.
Boa sorte! 🍀
        `.trim();

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
});
