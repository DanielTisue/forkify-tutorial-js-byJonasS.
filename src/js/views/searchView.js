import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => { elements.searchInput.value = '';};

export const clearResults = () => { elements.searchResultList.innerHTML = '';
elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.forEach(el => {
    el.classList.remove('results__link--active');
  });
  document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
}
// Pasta with tomato and spinach => .split => turns into an array with 5 elements
//['Pasta', 'with', 'Tomato', 'and', 'Spinach']
// Then use reduce in order to 'shorten array' which will shorten title.
/*
first iteration: 0 / acc + cur.length = 5 / newTitle = ['Pasta'] - 5 is less then 17 so the first word is added.

second iteration: 5 / acc + cur.length = 9 / newTitle = ['Pasta']

third iteration: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with']

fourth iteration: 15/ acc +  cur.length = 18 / newTitle = ['Pasta', 'with', 'Tomato']

fifth iteration: 18/..../ which is less than 17 so loop is done and no more words are added to the array.
*/
const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(' ')}...`; // .join  will join items from array into a string! (opposite of splice);
  }
  return title;
}

export const renderRecipe = recipe => {
  const markup = `
  <li>
      <a class="results__link results__link--active" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="Test">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
  </li>
  `;
  elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage; 
  //on page 1 ( (1-1 )= 0) * 10 = (0) start on index 0 of the array) 
  // on page 2 ( (2-1 )= 1) * 10 = (10) start on index 20 ...etc.
  const end = page * resPerPage;
  //page 1: 1 * 10 = 10
  //page 2: 2 * 10 = 20
  //console.log(recipes);
  recipes.slice(start, end).forEach(renderRecipe);
}