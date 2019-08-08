// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as likesView from './views/likesView';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
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
  //console.log(query);

  if(query) {
    // 2) New search object and add it to state
    state.search = new Search(query);

    // 3) prepare interface for what's going to happen
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
      // 4) Search for recipes.
      await state.search.getResults(); // returns a promise because itself is an async function which returns a promise.

      // 5) render results on UI
      //console.log(state.search.result);
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (err) {
      alert('Something\'s wrong with the Search...');
      clearLoader();
    } 
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

//const search = new Search('pizza');
//console.log(search);

//search.getResults();


//============Recipe Controller=======================
const controlRecipe = async () => {
  // Get ID from the url
  const id = window.location.hash.replace('#', '');
  //console.log(id);

  if (id) {
    //prepare the UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //highlight selected search item
    if(state.search) searchView.highlightSelected(id);

    //create a new recipe obj
    state.recipe = new Recipe(id);
    try {
      //get recipe data and parse ingredients
      await state.recipe.getRecipe();
      //console.log(state.recipe.ingredients);
      state.recipe.parseIngredients(); 
      //Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      // Render Recipe
      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
        );
      //console.log(state.recipe);
    } catch (err) {
      alert('Something was wrong with processing the Recipe..');
      console.log(err);
      
    }
  }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/** 
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list){
      state.list = new List();
    } 

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

/** 
 * LIKE CONTROLLER
 */

 //TESTING ONLY
 state.likes = new Likes();
 likesView.toggleLikeMenu(state.likes.getNumLikes());
const controlLike = () => {
  if(!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  //User has not yet liked current recipe
  if(!state.likes.isLiked(currentID)) {
    //Add like to the state
  const newLike = state.likes.addLike(
    currentID,
    state.recipe.title,
    state.recipe.author,
    state.recipe.img,
  );
    //Toggle like button
    likesView.toggleLikeBtn(true);
    //Add Like to UI list
    console.log(state.likes);
  //User has liked the current recipe 
  } else {
    //Remove like to the state
    state.likes.deleteLike(currentID);
    //Toggle like button
    likesView.toggleLikeBtn(false);

    //Remove Like from UI list
    console.log(state.likes);

  }
    likesView.toggleLikeMenu(state.likes.getNumLikes());

}



// Handle delete and update list item events
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    //Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }  
  } else if (e.target.matches('.btn-increase, .btn-increase *')){
       //Increase button is clicked
      state.recipe.updateServings('inc');
      recipeView.updateServingsIngredients(state.recipe);

  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
    //Add ingredients to shopping list
      controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
      //Like Controller
      controlLike();

    }
  
});

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    } 
});


