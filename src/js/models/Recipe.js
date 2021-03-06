import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;      
      //console.log(res);
    } catch(error) {
      console.log(error);
      alert('something went wrong :(');
    }
  }

  
calcTime() {
    // Assuming that we need 15 min for each 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = ['tabelspoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'pound'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'lb', 'lb'];
    const units = [...unitsShort, 'kg', 'g']
    const newIngredients = this.ingredients.map(el => {
      // 1) Uniform Units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });
      // 2) Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
      // 3) Parse ingredients into count, unit ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
      let objIng; // has to set outside the below block because both const and let are block-chained
      if (unitIndex > -1) {
        // There is a unit
        const arrCount = arrIng.slice(0, unitIndex); 
        // Ex. 4 1/2 cups is [4, 1/2]
        // Ex. 4 cups is [4]
        let count;
        if(arrIng[0] === '') {
          count = 1;
        } else if (arrCount.length === 1 ) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        }

      } else if (parseInt(arrIng[0], 10)) {
        // There is no unit, but 1st element is a number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        }
      } else if (unitIndex === -1) {
        // There is NO number and NO number in 1st position
        objIng = {
          count: '1',
          unit: '',
          ingredient: ingredient
        }
      }
      return objIng;
    });
    this.ingredients = newIngredients;
  }

  updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
  };
