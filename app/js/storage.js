import kb from 'knockback';
import Series from '../collections/series';
import Season from '../collections/season';

let _movieCollection = new Backbone.Collection();
const _key = 'series-on-time';

export default class Movie {

  constructor(id, name, airDate, poster) {
    this.id = id;
    this.name = name;
    this.airDate = airDate;
    this.poster = poster;
    this.season = [];
    this.lastSeason = new Backbone.Collection();
    this.series = new Backbone.Model();
    this.fetchSeries();
  };

  fetchSeries() {
      const _series = new Series(this.id);
      _series.fetch({
        success: () => {
          this.fetchLastSeason();
        }
      });
      this.series = _series;
  };

  fetchLastSeason() {
    const numberOfSeasons = this.series.attributes.number_of_seasons;
    const _season = new Season(this.id, numberOfSeasons);
    _season.fetch({
      success: () => {
        // #TODO callback
      }
    });
    this.lastSeason = _season;
  };

  fetchAllSeason() {
    const numberOfSeasons = this.series.attributes.number_of_seasons;
    for(let i = 0; i <= numberOfSeasons; i++) {
      let _season = new Season(this.id, i);
      _season.fetch({
        success: () => {
          // #TODO callback
        }
      });
      this.season[i] = _season;
    }
  };

  _getJSON() {
    const storage = [this.id, this.name, this.airDate, this.poster];
    return storage;
  };

  static add(id, name, airDate, poster) {
    _movieCollection.add(new Movie(id, name, airDate, poster));
  };

  static get() {
    return _movieCollection;
  };

  static load(callback) {
    this.isReady = callback;
    _movieCollection.reset();;
    const _data = JSON.parse(localStorage.getItem(_key));
    _data.forEach((prop) => {
      _movieCollection.add( new Movie(...prop) );
    });
  };

  static save() {
    let _data = [];
    _movieCollection.forEach((movie) => {
      _data.push( movie._getJSON() );
    });
    localStorage.add(_key, JSON.stringify(_data) );
  };
}
