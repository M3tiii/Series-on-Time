import kb from 'knockback';
import Series from '../collections/series';
import Season from '../collections/season';

let _movieCollection = new Backbone.Collection();
const _key = 'series-on-time';

function calculateDays(_toDate) {
  const toDate = new Date(_toDate);
  const sinceDate = new Date();
  const timeValue = 24*60*60*1000;
  sinceDate.setHours(0,0,0,0);
  toDate.setHours(0,0,0,0);
  return Math.round((toDate.getTime() - sinceDate.getTime())/(timeValue));
}

function onErrorHandler(context, response, options) {
     console.log('Fetch onerrorhandler');
     console.log(context, response.responseText);
 };

export default class Movie extends Backbone.Model {

  constructor(id, name, days, poster) {
    super();
    self = this.attributes;
    self.id = id;
    self.name = name;
    self.days = days;
    self.poster = poster;
    this._fetchSeries();
  };

  idAttribute() {
    return 'id';
  };

  _setPosterPath() {
    const posterPath = this.get('series').get('poster_path');
    this.set({'poster':posterPath});
  };

  _setActualEpisode() {
    const lastSeason = this.get('lastSeason');
    const actualEpisode = lastSeason.filter((model) => {
      return model.get('days') >= 0;
    });
    const _days = actualEpisode.length ? _.first(actualEpisode).get('days') : 'expired';
    this.set({'days': _days});
  };

  _calcActualEpisode() {
    let lastSeason = this.get('lastSeason');
    lastSeason.each(function(model) {
      const days = calculateDays(model.get('air_date'));
      model.set({'days': days});
    }, this);
  };

  _fetchSeries() {
    this.attributes.series = new Series(this.attributes.id);
    this.attributes.series.fetch({
      success: () => {
        this._fetchLastSeason();
      },
      error: onErrorHandler
    });
  };

  _fetchLastSeason() {
    const numberOfSeasons = this.get('series').get('number_of_seasons');
    this.attributes.lastSeason = new Season(this.get('id'), numberOfSeasons);
    this.attributes.lastSeason.fetch({
      success: () => {
        this._calcActualEpisode();
        this._setActualEpisode();
        this._setPosterPath();
        Movie.modelsLoaded++;
        if(Movie.modelsLoaded === Movie.modelsCount)
          Movie.callReady();
      },
      error: () => {console.log(this)}
    });
  };

  _fetchAllSeason() { // #TODO
    const numberOfSeasons = this.get('series').get('number_of_seasons');
    for(let i = 0; i <= numberOfSeasons; i++) {
      let _season = new Season(this.get('id'), i);
      _season.fetch({
        success: () => {
          // #TODO callback
        },
        error: onErrorHandler
      });
      this.attributes.season[i] = _season;
    }
  };

  _getJSON() {
    const storage = [this.attributes.id, this.attributes.name, this.attributes.days, this.attributes.poster];
    return storage;
  };

  static add(id, name = '', days = '', poster = '') {
    _movieCollection.add(new Movie(id, name, days, poster));
  };

  static remove(_id) {
    _movieCollection.remove([{id: _id }]);
  };

  static get() {
    return _movieCollection;
  };

  static load(callback) {
    Movie.callReady = callback; //# TODO
    Movie.modelsLoaded = 0;
    _movieCollection.reset();
    const _data = JSON.parse(localStorage.getItem(_key));
    if(_data && _data.length) {
      Movie.modelsCount = _data.length;
      _data.forEach((prop) => {
        _movieCollection.add( new Movie(...prop) );
      });
    } else
      Movie.callReady();
  };

  static save() {
    let _data = [];
    _movieCollection.forEach((movie) => {
      _data.push( movie._getJSON() );
    });
    localStorage.setItem(_key, JSON.stringify(_data) );
  };
}
