import productController from '/js/controllers/product.js';

console.warn('🆗: Módulo PageCreate cargado.');

class PageCreate {

    static productsTableContainer;

    static async deleteProduct(e) {
        if (!confirm('¿Estás seguro de querer eliminar el producto?')) {
            return false;
        }
        const row = e.target.closest('tr');
        const _id = row.querySelector('td[data-product-property="_id"]').innerHTML;
        console.log(_id)
        const deletedProduct = await productController.deleteProduct(_id);
        PageCreate.loadTable();
        return deletedProduct;
    }


    static async addTableEvents() {
        PageCreate.productsTableContainer.addEventListener('click', async e => {
            if (e.target.classList.contains('btn-delete')) {
                const deletedProduct = await PageCreate.deleteProduct(e);
                console.log('deletedProduct:', deletedProduct);
                return;
            }
        });
    }


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
        PageCreate.addTableEvents();
    }

    static async init () {
        console.log('PageCreate.init()');

        PageCreate.prepareTable();
    }

}

export default PageCreate;