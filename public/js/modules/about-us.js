
console.warn('🆗: Módulo PageNosotros cargado.');

class PageNosotros {

    static async init () {
        document.querySelector('.accordion').addEventListener('click',e=>{
            if(e.target.classList.contains('accordion-title')){ e.target.classList.toggle('accordion-title--open');}
        });
    }
}

export default PageNosotros;
