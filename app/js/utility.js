const KEY = '&api_key=cc4b67c52acb514bdf4931f7cedfd12b';

function getSeries(_seriesName) {
    let url = 'http://api.themoviedb.org/3/',
        mode = 'search/tv?query=',
        seriesName = _seriesName,
        key = KEY;
    $.ajax({
        type: 'GET',
        url: url + mode + seriesName + key,
        async: false,
        jsonpCallback: 'testing',
        contentType: 'application/json',
        dataType: 'jsonp',
        success: function(json) {
            console.dir(json);
        },
        error: function(e) {
            console.log(e.message);
        }
    });
}

function getSeason(_seriesId, _seasonNumber) {
    let url = 'http://api.themoviedb.org/3/',
        mode = 'tv/?query=',
        seriesId = _seriesId,
        seasonNumber = _seasonNumber,
        key = KEY;
    $.ajax({
        type: 'GET',
        url: 'http://api.themoviedb.org/3/tv/62560/season/1?&api_key=cc4b67c52acb514bdf4931f7cedfd12b',
        async: false,
        jsonpCallback: 'testing',
        contentType: 'application/json',
        dataType: 'jsonp',
        success: function(json) {
            console.dir(json);
        },
        error: function(e) {
            console.log(e.message);
        }
    });
}

export {
    getSeries,
    getSeason
};
