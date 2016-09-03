import kb from 'knockback';
import Series from '../collections/series';
import Season from '../collections/season';

let _movieCollection = new Backbone.Collection();
const _key = 'series-on-time';

function calculateDays(_toDate) {
    const toDate = new Date(_toDate);
    const sinceDate = new Date();
    const timeValue = 24 * 60 * 60 * 1000;
    sinceDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);
    return Math.round((toDate.getTime() - sinceDate.getTime()) / (timeValue));
}

function onErrorHandler(context, response, options) {
    console.log('Fetch onerrorhandler');
    console.log(context, response.responseText);
};

export default class Movie extends Backbone.Model {
    constructor(id, name, airDate, poster) {
        super();
        self = this.attributes;
        self.id = id;
        self.name = name;
        self.airDate = airDate;
        self.poster = poster;
        self.isActual = false;
        if (!name || !poster || !airDate || calculateDays(airDate) < 0) {
            console.log('Fetching series: ', this);
            this._fetchSeries();
        } else {
            self.days = calculateDays(airDate);
            this._afterFetch();
        }
    };

    _afterFetch() {
        _movieCollection.add(this);
        this.set({
            'isActual': true
        });
        Movie.modelsLoaded++;
        // console.log('afterFetch', Movie.modelsLoaded, Movie.modelsToLoad);
        if (Movie.modelsLoaded === Movie.modelsToLoad)
            Movie.callReady(); // TODO call too on some error
        if (Movie.modelsLoaded >= Movie.modelsToLoad) {
            Movie.save();
            _movieCollection.sort(_movieCollection.comparator);
        }
    };

    idAttribute() {
        return 'id';
    };

    _setActualEpisode() {
        let _days = null;
        let _airDate = null;
        const lastSeason = this.get('lastSeason');
        const actualEpisode = lastSeason.filter((model) => {
            return model.get('days') >= 0;
        });
        if (actualEpisode.length) {
            _days = _.first(actualEpisode).get('days');
            _airDate = _.first(actualEpisode).get('air_date');
        }
        this.set({
            'days': _days,
            'airDate': _airDate
        });
    };

    _calcActualEpisode() {
        let lastSeason = this.get('lastSeason');
        lastSeason.each(function(model) {
            const days = calculateDays(model.get('air_date'));
            model.set({
                'days': days
            });
        }, this);
    };

    _fetchSeries() {
        this.attributes.series = new Series(this.attributes.id);
        this.attributes.series.fetch({
            success: () => {
                this.set({
                    'name': this.attributes.series.get('name'),
                    'poster': this.attributes.series.get('poster_path')
                })
                const numberOfSeasons = this.get('series').get('number_of_seasons');
                if (numberOfSeasons > 0)
                    this._fetchLastSeason(numberOfSeasons);
            },
            error: onErrorHandler
        });
    };

    _fetchLastSeason(numberOfSeasons) {
        this.attributes.lastSeason = new Season(this.get('id'), numberOfSeasons);
        this.attributes.lastSeason.fetch({
            success: () => {
                this._calcActualEpisode();
                this._setActualEpisode();
                this._afterFetch();
            },
            error: onErrorHandler
        });

    };

    _fetchAllSeason() { // #TODO
        const numberOfSeasons = this.get('series').get('number_of_seasons');
        for (let i = 0; i <= numberOfSeasons; i++) {
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
        const storage = [this.get('id'), this.get('name'), this.get('airDate'), this.get('poster')];
        return storage;
    };

    static add(id, name = '', airDate = '', poster = '') {
        new Movie(id, name, airDate, poster);
    };

    static remove(_id) {
        _movieCollection.remove([{
            id: _id
        }]);
        Movie.save();
    };

    static get() {
        return _movieCollection;
    };

    static load(callback) {
        Movie.callReady = callback; //# TODO !!!
        Movie.modelsLoaded = 0;
        Movie.modelsToLoad = 0;
        _movieCollection.reset();
        _movieCollection.comparator = function(model) {
            return model.get('days');
        };
        const _data = JSON.parse(localStorage.getItem(_key));
        // console.log(_data);
        if (_data && _data.length) {
            Movie.modelsToLoad = _data.length;
            _data.forEach((prop) => {
                Movie.add(...prop);
            });
        } else
            Movie.callReady();
    };

    static save() {
        let _data = [];
        _movieCollection.forEach((movie) => {
            _data.push(movie._getJSON());
        });
        localStorage.setItem(_key, JSON.stringify(_data));
    };
}
