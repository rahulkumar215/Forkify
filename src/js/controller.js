import * as model from './model';
import recipeView from "./Views/recipeView"
import searchView from './Views/searchView';

const controlRecipe = async function(){
  try{
    const id = window.location.hash.slice(1);

    if(!id) return;

    recipeView.renderSpinner();

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe)
  }catch(err){
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function(){
    try{

      searchView.renderSpinner();

      await model.loadSearchResults();

      searchView.render(model.state.search.results);
    }catch(err){
      console.log(err);
      searchView.renderError();
    }
}

controlSearchResults();

const init = function(){
  recipeView.addHandlerRecipe(controlRecipe);
}

init();