
console.warn('🆗: Módulo PageAlta cargado.');

class PageAlta {

    static async init () {
        const form = document.querySelector('form'); // Form Create
    const dataRequired = document.querySelectorAll('form .data-required'); // Node to dataRequired
    const checkBox = document.querySelector('#freeShippingToy'); // CheckBox to FreeShipping
    const checkBoxSymbol = document.querySelector('.checked-container .material-symbols-outlined'); // Check Symbol
    const brandList = []; // Brand List array
    const categoryList = []; // Category List array
    const btnSendForm = document.querySelector('.btn_send'); // Button to send form
    btnSendForm.disabled = true;

    for (const option of document.querySelectorAll('#brandToy option')) {
        brandList.push(option.value);
    }
    for (const option of document.querySelectorAll('#categoryToy option')) {
        categoryList.push(option.value);
    }

    const eReg = {
        name: /^[a-zA-Z0-9\ \_\-]{2,70}$/,
        shortDesc: /^.{10,200}$/,
        longDesc: /^.{10,2000}$/,
    }

    function setValidateInput(classGroup, value) {
        document.querySelector('.' + classGroup + ' i').innerHTML = value ? 'check' : 'cancel';
        document.querySelector('.' + classGroup).classList.toggle('form-valid', value);
        document.querySelector('.' + classGroup).classList.toggle('form-invalid', !value);
    }

    //------------------------------Funtion validate Inputs
    const validateForm = (e) => {

        document.querySelector('.' + e.target.name).classList.remove();
        switch (e.target.name) {
            case "nameToy":
                setValidateInput(e.target.name, eReg.name.test(e.target.value));
                break;
            case "priceToy":
                setValidateInput(e.target.name, (e.target.value > 0));
                break;
            case "stockToy":
                setValidateInput(e.target.name, ((e.target.value >= 0) && (e.target.value != "")));
                break;
            case "brandToy":
                setValidateInput(e.target.name, brandList.includes(e.target.value));
                break;
            case "categoryToy":
                setValidateInput(e.target.name, categoryList.includes(e.target.value));
                break;
            case "shortDescriptionToy":
                setValidateInput(e.target.name, eReg.shortDesc.test(e.target.value));
                break;
            case "longDescriptionToy":
                setValidateInput(e.target.name, eReg.longDesc.test(e.target.value));
                break;
            case "ageFromToy":
            case "ageUpToy":
                setValidateInput(e.target.name, ((e.target.value >= 0) && (e.target.value <= 100) && (e.target.value != "")));
                break;
            case "mainPhotoToy":
                break;
        }
    };

    form.addEventListener('keydown', validateForm);

    //------------------------------Funtion validate FOR; button
    form.addEventListener('change', e => {
        for (const element of form) {
            if (document.querySelector('#mainPhotoToy').value != '') {
                if (element.closest('.label')) {
                    let validate = element.closest('.label').classList.contains('form-valid');
                    btnSendForm.disabled = !validate;
                    btnSendForm.classList.toggle('disabled', !validate);
                }
            }
        }
    });
    checkBox.addEventListener('click', function() {
        checkBoxSymbol.innerHTML = this.checked ? 'select_check_box' : 'indeterminate_check_box';
    });
    }
}

export default PageAlta;
