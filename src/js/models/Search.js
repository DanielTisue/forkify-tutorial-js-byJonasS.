import axios from 'axios';
import { key, proxy} from '../config';
export default class Search {
      constructor(query) {
        this.query = query;
      }
      async getResults() {
        try {
          //insert ${proxy} if call is rejected- may or may not work?
          const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
          this.result = res.data.recipes;
          //console.log(this.result);

        } catch (err) {
          alert(err, 'Ohhh shit');
        }
    }
}

 

