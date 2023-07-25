import productService from '/js/services/product.js';

console.warn('🆗: Módulo PageInicio cargado.');

class PageHome {

    static async init () {
        console.log('PageInicio.init()');

        document.getElementById('btn-get-all').addEventListener('click', async e => {
            const products = await productService.getProducts();
            console.log(products);
        });
        
        document.getElementById('btn-get-one').addEventListener('click', async e => {
            const id = prompt('Ingresar id:');
            const product = await productService.getProduct(id);
            console.log(product);
        });

        document.getElementById('btn-delete').addEventListener('click', async e => {
            const id = prompt('Ingresar id:');
            const deletedProduct = await productService.deleteProduct(id);
            console.log(deletedProduct);
        });

        const inputId = document.getElementById('id');
        const inputName = document.getElementById('name');
        const inputDescription = document.getElementById('description');
        const inputPrice = document.getElementById('price');

        document.getElementById('btn-post').addEventListener('click', async e => {
            e.preventDefault();
            const product = {
                name: inputName.value,
                description: inputDescription.value,
                price: inputPrice.value,
            };
            const newProduct = await productService.saveProduct(product);
            // console.log(product);
            console.log(newProduct);
        });

        document.getElementById('btn-put').addEventListener('click', async e => {
            e.preventDefault();
            const id = inputId.value;
            const product = {
                name: inputName.value,
                description: inputDescription.value,
                price: inputPrice.value,
            };
            const updatedProduct = await productService.updateProduct(id, product);
            // console.log(product);
            console.log(updatedProduct);
        });

    }
}

export default PageHome;
