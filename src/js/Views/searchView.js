import View from "./View";
import icons from 'url:../../img/icons.svg'; // Parcel 2

class SearchView extends View{
    _parentElement = document.querySelector('.search');

    getQuery(){
        const query = document.querySelector('.search__field').value;
        document.querySelector('.search__field').value = "";
        return query;
    }

    addHandlerSearch(handler){
        this._parentElement.addEventListener('submit', (e) => {
            e.preventDefault();
            handler();
        })
    }
}

export default new SearchView();