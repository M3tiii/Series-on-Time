import kb from 'knockback';
import episod from '../models/episod';

class Season extends Backbone.Collection {
  constructor(...args) {
    super(...args);
  };
  url(){
    return "http://api.themoviedb.org/3/tv/" + this.seasonId + "/season/" + this.seasonNumber + "?api_key=cc4b67c52acb514bdf4931f7cedfd12b";
  };
  parse(response){
    this.overview = response.overview;
    this.airDate = response.air_date;
    return response.episodes;
  };
  setQuery(seasonId, seasonNumber){
    this.seasonId = seasonId;
    this.seasonNumber = seasonNumber;
  };
}

export default Season;
