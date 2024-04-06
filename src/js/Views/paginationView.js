import View from "./View";
import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View{
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler){
        this._parentElement.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn--inline');

            if(!btn) return;

            const gotoPage = +btn.dataset.goto;

            handler(gotoPage);
        })
    }

    _generateMarkup(){
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length/this._data.resutlsPerPage);

        // 1 curPage === 1 && numPage > 1
        if(curPage === 1 && numPages > 1){
            return `
            <button data-goto= ${curPage + 1} class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `
        }
        
        // 2 curPage === numPage && numPage > 1

        if(curPage === numPages && numPages > 1){
            return `
            <button data-goto= ${curPage - 1} class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>
            `
        }

        // 3 curPage < numPage

        if(curPage < numPages){
            return `
            <button data-goto= ${curPage - 1} class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>
            <button data-goto= ${curPage + 1} class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `
        }

        // 4 curPage === numPages && numPages === 1
        return ``;
    }
}

export default new PaginationView();