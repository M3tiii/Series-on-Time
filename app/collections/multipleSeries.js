import kb from 'knockback';

class Series extends Backbone.Collection {
    constructor(query, ...args) {
        super(...args);
        this.setQuery(query);
        this.comparator = function(model) {
            return -model.get('popularity');
        };
    };
    url() {
        return "http://api.themoviedb.org/3/search/tv?api_key=cc4b67c52acb514bdf4931f7cedfd12b&query=" + this.query;
    };
    parse(response) {
        return response.results;
    };
    setQuery(query) {
        this.query = encodeURIComponent(query);
    };
}

export default Series;
