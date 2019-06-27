// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

//=====Global State of the App=====
// * search object
// * current recipe object
// * shopping list object
// * liked recipes

const state = {};

//============Search Controller=======================

const controlSearch = async () => {
  // 1) get the query from the view
  const query = searchView.getInput(); //TODO 
  console.log(query);

  if(query) {
    // 2) New search object and add it to state
    state.search = new Search(query);

    // 3) prepare interface for what's going to happen
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    // 4) Search for recipes.
    await state.search.getResults(); // returns a promise because itself is an async function which returns a promise.

    // 5) render results on UI
    //console.log(state.search.result);
    clearLoader();
    searchView.renderResults(state.search.result);
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

const search = new Search('pizza');
//console.log(search);

search.getResults();


//============Recipe Controller=======================
const controlRecipe = async () => {
  // Get ID from the url
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if (id) {
    //prepare the UI for changes

    //create a new recipe obj
    state.recipe = new Recipe(id);
    //get recipe data
    await state.recipe.getRecipe();
    //Calculate servings and time
    state.recipe.calcTime();
    state.recipe.calcServings();
    // Render Recipe
    console.log(state.recipe);
  }

}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));



