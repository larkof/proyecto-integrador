import productController from '/js/controllers/product.js';

console.warn('🆗: Módulo PageCreate cargado.');

class PageCreate {

    static productsTableContainer;
    static form;
    static checkBox;
    static checkBoxSymbol;
    static check;
    static brandList = [];
    static categoryList = [];
    static btnSendForm;
    static productCreate={};

    static eReg = {
        name: /^[a-zA-Z0-9\ \_\-]{2,70}$/,
        shortDesc: /^.{10,200}$/,
        longDesc: /^.{10,2000}$/,
    }

    static async deleteProduct(e) {
        if (!confirm('¿Estás seguro de querer eliminar el producto?')) {
            return false;
        }
        const row = e.target.closest('tr');
        const _id = row.querySelector('td').dataset.id;
        console.log(_id)
        const deletedProduct = await productController.deleteProduct(_id);
        PageCreate.loadTable();
        return deletedProduct;
    }

    static async createProduct(product) {
        //console.log(product)
        const CreatedProduct = await productController.saveProduct(product)
        PageCreate.loadTable();
        PageCreate.form.reset();
        return CreatedProduct;
    }

    static async getProductFromRow(row) {
        const rowCells = row.children;
        const product = {};
        for (const cell of rowCells) {
            if(cell.dataset.id){ product["id"] = cell.dataset.id; }
            if (cell.dataset.productProperty) {
                if(cell.dataset.productProperty === 'price'){
                    if(!Number(cell.innerHTML)){
                        return alert("El importe debe ser Numérico");
                    }
                    product[cell.dataset.productProperty] = Number(cell.innerHTML);
                }else{
                    product[cell.dataset.productProperty] = cell.innerHTML;
                }
            }
        }
        const updateProduct = await productController.updateProduct(product.id, product);
        PageCreate.loadTable();
        return updateProduct;
    }

    static async completeForm(e,type) {
        if (type = 2){
            const row = e.target.closest('tr');
            const productToEdit = PageCreate.getProductFromRow(row);
            console.log('productToEdit:', productToEdit);
        }
    }

    static async addTableEvents() {
        PageCreate.productsTableContainer.addEventListener('click', async e => {
            if (e.target.classList.contains('btn-delete')) {
                const deletedProduct = await PageCreate.deleteProduct(e);
                console.log('deletedProduct:', deletedProduct);
                return;
            }
            if (e.target.classList.contains('btn-edit')) {
                PageCreate.completeForm(e, 2);
                return;
            }
        });
    }

    static async addFormEvents(){
        PageCreate.checkBox.addEventListener('click', e =>PageCreate.checkBoxSymbol.innerHTML = PageCreate.checkBox.checked ? 'select_check_box' : 'indeterminate_check_box');

        PageCreate.form.addEventListener('keydown', this.validateForm);

        PageCreate.form.addEventListener('change', e => {
            for (const element of PageCreate.form) {
                if (document.querySelector('#mainPhoto').value != '') {
                    if (element.closest('.label')) {
                        let validate = element.closest('.label').classList.contains('form-valid');
                        PageCreate.btnSendForm.disabled = !validate;
                        PageCreate.btnSendForm.classList.toggle('disabled', !validate);
                    }
                }
            }
        });

        PageCreate.btnSendForm.addEventListener('click',()=>{
            const product= new FormData(PageCreate.form);
            PageCreate.createProduct(product);
        } )

    }
    static async renderTemplateTable(products) {
        const hbsFile = await fetch('templates/products-table.hbs').then(r => r.text());
        const template = Handlebars.compile(hbsFile);
        const html = template({ products });
        PageCreate.productsTableContainer.innerHTML = html;
    }

    static async loadForm(){
        PageCreate.form = document.querySelector('form'); // Form Create
        PageCreate.checkBoxSymbol = document.querySelector('.checked-container .material-symbols-outlined'); 
        PageCreate.checkBox = document.querySelector('#freeShipping'); // CheckBox to FreeShipping
        for (const option of document.querySelectorAll('#brand option')) {
            PageCreate.brandList.push(option.value);
        }
        for (const option of document.querySelectorAll('#category option')) {
            PageCreate.categoryList.push(option.value);
        }
        PageCreate.btnSendForm = document.querySelector('.btn_send'); // Button to send form
        PageCreate.btnSendForm.disabled = true;
        PageCreate.addFormEvents();
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

    static async setValidateInput(classGroup, value) {
        document.querySelector('.' + classGroup + ' i').innerHTML = value ? 'check' : 'cancel';
        document.querySelector('.' + classGroup).classList.toggle('form-valid', value);
        document.querySelector('.' + classGroup).classList.toggle('form-invalid', !value);

    }

    static async validateForm(e){

        document.querySelector('.' + e.target.name).classList.remove();
        switch (e.target.name) {
            case "name":
                PageCreate.setValidateInput(e.target.name, PageCreate.eReg.name.test(e.target.value));
                break;
            case "price":
                PageCreate.setValidateInput(e.target.name, (e.target.value > 0));
                break;
            case "stock":
                PageCreate.setValidateInput(e.target.name, ((e.target.value >= 0) && (e.target.value != "")));
                break;
            case "brand":
                PageCreate.setValidateInput(e.target.name, PageCreate.brandList.includes(e.target.value));
                break;
            case "category":
                PageCreate.setValidateInput(e.target.name, PageCreate.categoryList.includes(e.target.value));
                break;
            case "shortDescription":
                PageCreate.setValidateInput(e.target.name, PageCreate.eReg.shortDesc.test(e.target.value));
                break;
            case "longDescription":
                PageCreate.setValidateInput(e.target.name, PageCreate.eReg.longDesc.test(e.target.value));
                break;
            case "ageFrom":
            case "ageUpTo":
                PageCreate.setValidateInput(e.target.name, ((e.target.value >= 0) && (e.target.value <= 100) && (e.target.value != "")));
                break;
            case "mainPhoto":
                break;
        }
    };

    static async init () {
        console.log('PageCreate.init()');
        PageCreate.loadForm();
        PageCreate.prepareTable();
    }

}

export default PageCreate;