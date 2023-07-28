import productController from '/js/controllers/product.js';

console.warn('🆗: Módulo PageInicio cargado.');

class PageHome {
    

    static async addEventCard(){
        document.querySelector('.cards-container').addEventListener('click', ev => {
            if (ev.target.classList.contains('card-link__add')) {
                const card = ev.target.closest('article');
                document.getElementById("alertCard").innerHTML=`Se Agrego el Producto <br>${card.dataset.name}  <br>al Carrito
                `;
                const product = {id: card.dataset.id, name: card.dataset.name, category: card.dataset.category, price: card.dataset.price, mainPhoto: card.dataset.mainphoto}
                if(Main.cart.products.find( product => product.id === card.dataset.id )){
                    Main.cart.products[Main.cart.products.findIndex( product => product.id === card.dataset.id)].amount++;
                }else{
                    product.amount= 1;
                    Main.cart.products.push(product);
                }
                window.localStorage.setItem("cart",JSON.stringify(Main.cart))
                document.getElementById("alertCard").classList.toggle("show")
                setTimeout(()=>{document.getElementById("alertCard").classList.toggle("show")},1500);
            }
        });
    }

    static async renderTemplateCards(products) {
        const textoToRender = await fetch('/templates/card.hbs').then(r => r.text());
        const template = Handlebars.compile(textoToRender);
        const html = template({ products });
        document.querySelector('.cards-container').innerHTML = html;
        PageHome.addEventCard();
    }

    static async init () {
        console.log('PageInicio.init()');

        const products = await productController.getProducts();
        await PageHome.renderTemplateCards(products);
        
        console.log(`Se encontraron ${products.length} productos.`);

    }
}

export default PageHome;
