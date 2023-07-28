class Main {
    
    static navbar = document.querySelector("nav");
    static btnState = false;
    static btnCart = document.querySelector('#btnCart');
    static cartTableContainer = document.querySelector('.cart-modal-container');
    static modal = document.querySelector("#modal");
    static modalTable = document.querySelector('.cart-modal-container');
    static cart = JSON.parse(window.localStorage.getItem("cart")) || {products:[ ]};

    static async showModal(){
        Main.modal.classList.add('modal-open');
    }

    static async closeModal(){
        Main.modal.classList.remove('modal-open');
        Main.btnCart.classList.remove('btn-pressed');
        Main.btnState = false;
    }

    static async changeStateBtnCart (){
        if (Main.btnState) {
            Main.closeModal();
        } else {
            console.log(Main.cart)
            Main.btnCart.classList.add('btn-pressed');
            await Main.renderTemplateCart(Main.cart);
            Main.priceTotalCart();
            Main.showModal();
            Main.btnState = true;
            document.querySelector('nav ul').classList.toggle('active');
        }

    }
    static async keyEvents(){
        window.addEventListener('keydown', function(ev) {
            if (ev.key === 'Escape') {
                if (Main.modal.classList.contains('modal-open')) Main.closeModal();
                document.querySelector('nav ul').classList.remove('active');
            }
        });
    }
    static async navbarEvents() {
        Main.navbar.addEventListener('click', async ev => {
            if (ev.target == document.querySelector('.menu-container')) {
                document.querySelector('nav ul').classList.toggle('active');
                return;
            }
            if (ev.target == document.querySelector('#btnCart')) {
                Main.changeStateBtnCart();
                return;
            }
            if (Main.btnState) {
                Main.closeModal();
                return;
            }
        });
    }

    static async renderTemplateCart(products) {
        const textoToRender = await fetch('/templates/cart.hbs').then(r => r.text());
        const template = Handlebars.compile(textoToRender);
        const html = template( products );
        Main.cartTableContainer.innerHTML = html;
    }

    static async showConfirmDel(productData = false){
        const confirmAlert = document.querySelector(".modal-confirm");
        confirmAlert.dataset.id = '' || productData.id;
        confirmAlert.dataset.name = '' || productData.name;
        confirmAlert.querySelector('p').innerHTML = '' || `Desea Eliminar el producto ${productData.name}?`
        confirmAlert.classList.toggle('active', !!productData);
    }

    static async confirmDel(product){
        console.log(`❌ Producto: ${product.dataset.name} eliminado del carrito...`);
        product.remove();
        Main.showConfirmDel();
        Main.priceTotalCart();
    }

    static priceTotalCart (){
        let totalPrice = 0;
        if (Main.modalTable.querySelectorAll('.cart-product').length) {
            for (const product of Main.modalTable.querySelectorAll('.cart-product')) {
                const subTotal = product.dataset.price * product.dataset.cant; // Paso a int
                totalPrice += subTotal; // sumo los
                product.querySelector('.cart-product-price').innerHTML = `$ ${product.dataset.price}`;
                product.querySelector('.cart-product-sub_total').innerHTML = `$ ${subTotal}`;
                product.querySelector('.cart-product-cant').innerHTML = product.dataset.cant;
            }
            document.querySelector('.cart-product-total').innerHTML = `$ ${totalPrice}`;
        } else {
            document.querySelector('.cart-product-total').innerHTML = `$ 0`;
        }
    }

    static async CartEvents(){
        Main.modal.addEventListener('click', ev => {

            if ((!ev.target.closest('.cart-modal-container') && Main.btnState) || (ev.target == document.querySelector('.modal-close'))) {
                Main.closeModal();
                return;
            }
            Main.priceTotalCart();
            if ((ev.target.classList.contains('btn-cart-product__del')) || (ev.target.classList.contains('product-del'))) {
                const productData = ev.target.closest('.cart-product').dataset;
                Main.showConfirmDel(productData);
                return;
            }
            if ((ev.target.classList.contains('cart-product-add')) || (ev.target.classList.contains('product-add'))) {
                ev.target.closest('.cart-product').dataset.cant = Number(ev.target.closest('.cart-product').dataset.cant) + 1;
                Main.cart.products[Main.cart.products.findIndex( product => product.id === ev.target.closest('.cart-product').dataset.id)].amount++;
                window.localStorage.setItem("cart",JSON.stringify(Main.cart))
                Main.priceTotalCart();
                return;
            }
            if ((ev.target.classList.contains('cart-product-min')) || (ev.target.classList.contains('product-min'))) {
                if (parseInt(ev.target.closest('.cart-product').dataset.cant) > 0) {
                    ev.target.closest('.cart-product').dataset.cant = Number(ev.target.closest('.cart-product').dataset.cant) - 1;
                    Main.cart.products[Main.cart.products.findIndex( product => product.id === ev.target.closest('.cart-product').dataset.id)].amount--;
                    window.localStorage.setItem("cart",JSON.stringify(Main.cart));
                }
                Main.priceTotalCart();
                return;
            }
        
            if (ev.target.classList.contains('modal-confirm__cancel')) {
                Main.showConfirmDel();
                return;
            }
        
            if (ev.target.classList.contains('modal-confirm__del')) {
                console.log()
                const productId = document.querySelector(".modal-confirm").dataset.id;
        
                Main.cart.products.splice(Main.cart.products.findIndex( product => product.id === productId ), 1)
                window.localStorage.setItem("cart",JSON.stringify(Main.cart))
                Main.confirmDel(document.querySelector('.cart-product[data-id="' + productId + '"]'));
                return;
            }
        });
    }

    async ajax(url, method = 'get') {
        return await fetch(url, { method: method }).then(r => r.text());
    }

    getIdFromHash() {
        let id = location.hash.slice(1);
        if (id[0] === '/') {
            id = id.slice(1);
        }
        return id || 'home';
    }

    getViewUrlFromId(id) {
        return `views/${id}.html`;
    }

    getModuleUrlFromId(id) {
        return `./modules/${id}.js`;
    }

    setActiveLink(id) {
        const links = document.querySelectorAll('.main-nav__link');
        links.forEach(link => {
            if (link.getAttribute('href') === `#/${id}`) {
                link.classList.add('main-nav__link--active');
                link.ariaCurrent = 'page';
            } else {
                link.classList.remove('main-nav__link--active');
                link.removeAttribute('aria-current');
            }
        });
    }

    async initJS(id) {
        const moduleUrl = this.getModuleUrlFromId(id);
        try {
            const {default: module} = await import(moduleUrl);
            if (typeof module.init !== 'function') {
                console.error(`El módulo ${id} no posee un método init().`);
                return;
            }
            module.init();
        } catch (error) {
            console.error(`No se pudo importar el módulo ${moduleUrl}.`);
        }
    }

    async loadTemplate() {
        const id = this.getIdFromHash();
        
        const viewUrl = this.getViewUrlFromId(id);
        const viewContent = await this.ajax(viewUrl);
        document.querySelector('main').innerHTML = viewContent;

        this.setActiveLink(id);

        this.initJS(id);
    }

    async loadTemplates() {
        this.loadTemplate();
        window.addEventListener('hashchange', () => this.loadTemplate());
    }

    async start() {
        await this.loadTemplates();
        Main.navbarEvents();
        Main.CartEvents();
        Main.keyEvents()
    }
}
Handlebars.registerHelper("subTotal", function(object) {
    let respuesta = (object.price + object.amount);
    return new Handlebars.SafeString(respuesta);
});
const main = new Main();
main.start();
