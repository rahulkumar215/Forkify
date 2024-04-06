import { AJAX } from './helpers';
import { API_URL, API_KEY, RES_PER_PAGE } from './config';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resutlsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && {key: recipe.key})
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookMarked = true;
    } else {
      state.recipe.bookMarked = false;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    if (data.data.recipes.length === 0)
      throw new Error('Unable to fetch the data');

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key: rec.key})
      };
    });

    state.search.page = 1;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  return state.search.results.slice(
    (page - 1) * state.search.resutlsPerPage,
    page * state.search.resutlsPerPage
  );
};

export const updateServings = function (servings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * servings) / state.recipe.servings;
  });

  state.recipe.servings = servings;
};

export const addBookMark = function (data) {
  state.bookmarks.push(data);

  if (data.id === state.recipe.id) state.recipe.bookMarked = true;

  persistBookMarks();
};

export const persistBookMarks = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmarks));
};

export const deleteBookMark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);

  console.log(index);

  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookMarked = false;

  persistBookMarks();
};

const init = function () {
  const bookMarks = localStorage.getItem('bookmark');

  if (bookMarks) state.bookmarks = JSON.parse(bookMarks);
};

init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(ing => ing[0].startsWith('ingredient') && ing[1].trim() !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim())

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format:)'
          );

        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity === '' ? null : +quantity,
          unit,
          description,
        };
      });

    console.log(ingredients);

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const res = await AJAX(`${API_URL}/?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(res);

    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};
