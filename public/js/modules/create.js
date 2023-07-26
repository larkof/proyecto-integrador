import productController from '/js/controllers/product.js';

console.warn('🆗: Módulo PageCreate cargado.');

class PageCreate {

    static productsTableContainer;

    static async renderTemplateTable(products) {
        const hbsFile = await fetch('templates/products-table.hbs').then(r => r.text());
        const template = Handlebars.compile(hbsFile);
        const html = template({ products });
        PageCreate.productsTableContainer.innerHTML = html;
    }

    static async loadTable() {
        const products = await productController.getProducts();
        console.log(`Se encontraron ${products.length} productos.`);
        PageCreate.renderTemplateTable(products);
    }

    static async prepareTable() {
        PageCreate.productsTableContainer = document.querySelector('.products-table-container');
        await PageCreate.loadTable();
    }

    static async init () {
        console.log('PageCreate.init()');

        PageCreate.prepareTable();
    }

}

export default PageCreate;