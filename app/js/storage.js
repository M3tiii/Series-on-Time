import kb from 'knockback';
import Series from '../collections/series';
import Season from '../collections/season';

let _movieCollection = new Backbone.Collection();
let _notFetched = [];
const _key = 'series-on-time';

let attributes = ['id', 'name', 'airDate', 'poster', 'backdrop', 'episodeName'];

function calculateDays(_toDate) {
    const toDate = new Date(_toDate);
    const sinceDate = new Date();
    const timeValue = 24 * 60 * 60 * 1000;
    sinceDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);
    return Math.round((toDate.getTime() - sinceDate.getTime()) / (timeValue));
}

function onErrorHandler(movie, response) {
    console.log('Fetch onerrorhandler');
    console.log(movie, response.responseText);
    if (response.responseJSON.status_code === 25) {
        Movie.modelsFailed++;
        _notFetched.push(movie);
        Movie.resolveNotFetched();
    }

};

export default class Movie extends Backbone.Model {
    constructor(id, ...args) {
        super();
        self = this.attributes;
        self.id = id;
        args.forEach((value, id) => {
            const attrName = attributes[id + 1];
            self[attrName] = value || '';
        });
        self.isActual = false;
        self.isIntro = false;
        if (self.isIntro || !self.airDate || calculateDays(self.airDate) < 0) {
            console.log('Fetching series: ', this);
            this._fetchSeries();
        } else {
            // console.log('Without fetch: ', this);
            self.days = calculateDays(self.airDate);
            this._afterFetch();
        }
    };

    _afterFetch() {
        _movieCollection.add(this);
        this.set({
            'isActual': true
        });
        Movie.modelsLoaded++;
        if (Movie.modelsLoaded + Movie.modelsFailed >= Movie.modelsToLoad) {
            _movieCollection.sort(_movieCollection.comparator);
            Movie.save();
        }
    };

    idAttribute() {
        return 'id';
    };

    _setActualEpisode() {
        let _days, _airDate, _overview, _episodeName, _seasonNumber, _episodeNumber = null;
        const lastSeason = this.get('lastSeason');
        const actualEpisode = lastSeason.filter((model) => {
            return model.get('days') >= 0;
        });
        if (actualEpisode.length) {
            _days = _.first(actualEpisode).get('days');
            _airDate = _.first(actualEpisode).get('air_date');
            _overview = _.first(actualEpisode).get('_overview');
            _episodeName = _.first(actualEpisode).get('name');
            _seasonNumber = _.first(actualEpisode).get('season_number');
            _episodeNumber = _.first(actualEpisode).get('episode_number');
        }
        this.set({
            'days': _days,
            'airDate': _airDate,
            'overview': _overview,
            'episodeName': _episodeName,
            'seasonNumber': _seasonNumber,
            'episodeNumber': _episodeNumber,
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
                    'poster': this.attributes.series.get('poster_path'),
                    'backdrop': this.attributes.series.get('backdrop_path')
                })
                const numberOfSeasons = this.get('series').get('number_of_seasons');
                if (numberOfSeasons > 0)
                    this._fetchLastSeason(numberOfSeasons);
            },
            error: (context, response) => {
                onErrorHandler(this, response);
            }
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
            error: (context, response) => {
                onErrorHandler(this, response);
            }
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
                error: (context, response) => {
                    onErrorHandler(this, response);
                }
            });
            this.attributes.season[i] = _season;
        }
    };

    _getJSON() {
        const storage = [];
        attributes.forEach((property) => {
            storage.push(this.get(property));
        });
        return storage;
    };

    static resolveNotFetched() {
        console.log(_notFetched);
        let movie = _notFetched.shift();
        if (movie) {
            setTimeout(() => {
                console.log('Refetch: ', movie);
                movie._fetchSeries();
            }, 2000);
        }
    };

    static add(id, ...args) {
        new Movie(id, ...args);
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
        Movie.modelsFailed = 0;
        _movieCollection.reset();
        _movieCollection.comparator = function(model) {
            // console.log(!_.isNumber(model.get('days')), model.get('days'));
            return model.get('days');
        };
        const _data = JSON.parse(localStorage.getItem(_key));
        // console.log(_data);
        if (_data && _data.length) {
            Movie.modelsToLoad = _data.length;
            _data.forEach((prop) => {
                Movie.add(...prop);
            });
        }
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
