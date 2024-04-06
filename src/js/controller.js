import { MODAL_CLOSE_SEC } from './config';
import * as model from './model';
import addRecipeView from './Views/addRecipeView';
import bookmarksView from './Views/bookmarksView';
import paginationView from './Views/paginationView';
import recipeView from './Views/recipeView';
import resultsView from './Views/resultsView';
import searchView from './Views/searchView';

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();

    if (!query) return;

    console.log(query);

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    resultsView.renderError();
  }
};

const controlPagination = function (gotoPage) {
  resultsView.render(model.getSearchResultsPage(gotoPage));

  paginationView.render(model.state.search);
};

const controlServings = function (servings) {
  model.updateServings(servings);

  recipeView.update(model.state.recipe);
};

const controlBookMarks = function () {
  if (model.state.recipe.bookMarked) {
    model.deleteBookMark(model.state.recipe.id);
  } else {
    model.addBookMark(model.state.recipe);
  }

  bookmarksView.render(model.state.bookmarks);

  recipeView.update(model.state.recipe);
};

const controlBookMarkRender = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (data) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(data);

    addRecipeView.renderMessage();

    recipeView.render(model.state.recipe);

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    setTimeout(() => {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC*1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookMarkRender);
  recipeView.addHandlerRecipe(controlRecipe);
  recipeView.addhandlerServings(controlServings);
  recipeView.addHandlerBookMark(controlBookMarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerAddRecipe(controlAddRecipe);
};

init();
