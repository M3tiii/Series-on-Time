import kb from 'knockback';

class Series extends Backbone.Model {
  constructor(seriesId,...args) {
    super(...args);
    this.setQuery(seriesId);
  };
  url() {
    return "http://api.themoviedb.org/3/tv/" + this.seriesId + "?&api_key=cc4b67c52acb514bdf4931f7cedfd12b";
  };
  parse(response) {
    return response;
  };
  setQuery(seriesId) {
    this.seriesId = seriesId;
  };
}

export default Series;
