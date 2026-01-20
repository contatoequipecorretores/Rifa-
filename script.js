// Configuração da aplicação
const config = {
    totalTickets: 100,
    ticketPrice: 15,
    discountThreshold: 3, // A partir de 3 números
    discountPercent: 5 // 5% de desconto
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
        // Inicializar todos os 100 números (garanta que TODOS apareçam)
        for (let i = 1; i <= config.totalTickets; i++) {
            this.tickets.set(i, {
                number: i,
                sold: false,
                buyer: null,
                email: null,
                phone: null,
                date: null
            });
        }
        // Verificação final - garantir que o número 100 existe
        if (!this.tickets.has(100)) {
            this.tickets.set(100, {
                number: 100,
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
                console.log('Erro ao carregar dados, inicializando novo');
                this.init();
                return;
            }
        }
        // Garantir que TODOS os números de 1 a 100 existem após carregar
        for (let i = 1; i <= config.totalTickets; i++) {
            if (!this.tickets.has(i)) {
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
            btn.textContent = String(number).padStart(3, '0');
            
            if (ticket.sold) {
                btn.classList.add('sold');
                btn.disabled = true;
                btn.title = `Vendido para: ${ticket.buyer}`;
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
            number: number,
            price: config.ticketPrice
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
                        <div class="cart-item-number">R$ 15,00</div>
                    </div>
                    <div class="cart-item-price">R$ 15,00</div>
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

            // Atualizar resumo
            this.updatePricing();
        }
    }

    updatePricing() {
        const subtotal = this.cart.length * config.ticketPrice;
        const discount = this.cart.length >= config.discountThreshold 
            ? (subtotal * config.discountPercent) / 100 
            : 0;
        const total = subtotal - discount;

        document.getElementById('subtotal').textContent = 
            this.formatCurrency(subtotal);
        document.getElementById('discount').textContent = 
            this.formatCurrency(discount);
        document.getElementById('total').textContent = 
            this.formatCurrency(total);

        // Atualizar dados do checkout
        document.getElementById('checkoutTickets').textContent = 
            `${this.cart.length} número${this.cart.length > 1 ? 's' : ''}`;
        document.getElementById('checkoutTotal').textContent = 
            this.formatCurrency(total);
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
        // Atualização em tempo real - sincroniza com localStorage de outros abas/dispositivos
        const saved = localStorage.getItem('rifaData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                const newTickets = new Map(data.tickets);
                let changed = false;
                
                // Verificar se algum número mudou de status
                newTickets.forEach((ticket, number) => {
                    const currentTicket = this.tickets.get(number);
                    if (currentTicket && currentTicket.sold !== ticket.sold) {
                        this.tickets.set(number, ticket);
                        changed = true;
                    }
                });
                
                // Garantir que TODOS os números existem (especialmente o 100)
                for (let i = 1; i <= config.totalTickets; i++) {
                    if (!this.tickets.has(i)) {
                        this.tickets.set(i, newTickets.get(i) || {
                            number: i,
                            sold: false,
                            buyer: null,
                            email: null,
                            phone: null,
                            date: null
                        });
                        changed = true;
                    }
                }
                
                if (changed) {
                    this.renderTickets();
                }
                
                // Atualizar histórico de vendas
                if (data.sales && JSON.stringify(data.sales) !== JSON.stringify(this.sales)) {
                    this.sales = data.sales;
                }
            } catch (e) {
                console.log('Erro ao sincronizar', e);
            }
        }
    }

    clearCart() {
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            this.cart = [];
            this.renderTickets();
            this.updateCart();
            this.showNotification('Carrinho limpo');
        }
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Adicione números ao carrinho!', true);
            return;
        }

        document.getElementById('checkoutModal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('checkoutModal').style.display = 'none';
    }

    processPayment() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const payment = document.querySelector('input[name="payment"]:checked').value;

        if (!name) {
            this.showNotification('Preencha o nome!', true);
            return;
        }

        if (!email) {
            this.showNotification('Preencha o e-mail!', true);
            return;
        }

        if (!phone) {
            this.showNotification('Preencha o WhatsApp!', true);
            return;
        }

        // Processar compra
        this.finalizePurchase({
            name,
            email,
            phone,
            cpf,
            payment
        });
    }

    finalizePurchase(buyer) {
        const subtotal = this.cart.length * config.ticketPrice;
        const discount = this.cart.length >= config.discountThreshold 
            ? (subtotal * config.discountPercent) / 100 
            : 0;
        const total = subtotal - discount;

        const sale = {
            id: 'RIFA-' + Date.now(),
            date: new Date().toLocaleString('pt-BR'),
            buyer: buyer.name,
            email: buyer.email,
            phone: buyer.phone,
            cpf: buyer.cpf,
            payment: buyer.payment,
            tickets: [...this.cart],
            subtotal,
            discount,
            total
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

        // Preparar mensagem de confirmação
        const ticketList = this.cart
            .sort((a, b) => a.number - b.number)
            .map(t => String(t.number).padStart(3, '0'))
            .join(', ');

        const confirmationMessage = `
🎰 COMPRA CONFIRMADA!

ID da Compra: ${sale.id}
Comprador: ${buyer.name}
Números: ${ticketList}
Total: ${this.formatCurrency(total)}
Forma de Pagamento: ${buyer.payment === 'pix' ? 'PIX' : 'Acordar via WhatsApp'}

📧 Verifique seu e-mail para mais detalhes.
💬 Você também receberá uma mensagem no WhatsApp.
        `.trim();

        // Enviar para WhatsApp (simulado)
        if (buyer.payment === 'whatsapp') {
            const whatsappMessage = encodeURIComponent(
                `Oi ${buyer.name}! 👋\n\n` +
                `Obrigado pela compra! 🎉\n\n` +
                confirmationMessage.replace(/\n/g, '%0A')
            );
            // window.open(`https://wa.me/55${buyer.phone.replace(/\D/g, '')}?text=${whatsappMessage}`);
        }

        // Limpar formulário e carrinho
        this.resetCheckoutForm();
        this.cart = [];
        this.renderTickets();
        this.updateCart();
        this.closeModal();

        // Mostrar confirmação
        alert(confirmationMessage);
        this.showNotification('✓ Compra realizada com sucesso!');

        // Log da venda
        console.log('Venda registrada:', sale);
    }

    resetCheckoutForm() {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('cpf').value = '';
        document.querySelector('input[name="payment"][value="pix"]').checked = true;
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
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
            const modal = document.getElementById('checkoutModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // 🔴 SINCRONIZAÇÃO EM TEMPO REAL - OUVE MUDANÇAS NO LOCALSTORAGE
        window.addEventListener('storage', (e) => {
            if (e.key === 'rifaData') {
                console.log('📱 Sincronização detectada de outro dispositivo/aba');
                this.loadFromStorage();
                this.renderTickets();
                this.updateStats();
            }
        });

        // Formatação de telefone
        const phoneInput = document.getElementById('phone');
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

        // Formatação de CPF
        const cpfInput = document.getElementById('cpf');
        cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = value;
                } else if (value.length <= 6) {
                    value = `${value.slice(0, 3)}.${value.slice(3)}`;
                } else if (value.length <= 9) {
                    value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
                } else {
                    value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9, 11)}`;
                }
            }
            e.target.value = value;
        });
    }

    // Método para gerar relatório de vendas (para admin)
    generateSalesReport() {
        console.log('=== RELATÓRIO DE VENDAS ===');
        console.log(`Total de vendas: ${this.sales.length}`);
        console.log(`Números vendidos: ${Array.from(this.tickets.values()).filter(t => t.sold).length}/100`);
        console.log(`Faturamento: ${this.formatCurrency(this.sales.reduce((sum, s) => sum + s.total, 0))}`);
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

// Adicionar alguns dados de demonstração se for primeira vez
window.addEventListener('load', () => {
    // Simulação de vendas anteriores para demo
    if (localStorage.getItem('rifaData') === null) {
        // Vender alguns números para demo
        const demoNumbers = [5, 12, 18, 23, 31, 42, 57, 64, 71, 88];
        demoNumbers.forEach((num, idx) => {
            const ticket = app.tickets.get(num);
            ticket.sold = true;
            ticket.buyer = `Cliente Demo ${idx + 1}`;
            ticket.email = `cliente${idx + 1}@example.com`;
            ticket.phone = '(11) 9999-9999';
            ticket.date = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toLocaleString('pt-BR');
        });
        app.saveToStorage();
        app.renderTickets();
    }
});

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
