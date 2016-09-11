import $ from 'jquery';
import kb from 'knockback';
global.jQuery = $;
require('bootstrap');

import multipleSeries from '../../collections/multipleSeries';

let ViewModel = function() {
    this.isLoaded = kb.observable(null, "isLoaded");
    this.seriesName = kb.observable(null, "seriesName");
    this.seriesName.subscribe(() => {
        if (this.seriesName().length >= 3)
            this.search();
    });
    this.hide = function() {
        $("#myModal").hide();
        $('body').css({
            overflow: ''
        });
    };
    this.show = function() {
        $("#myModal").show();
        $('body').css({
            overflow: 'hidden'
        });
        let input = $('.modal-search');
        input.focus();
        input.select();
    };
    this.close = function() {
        if (this.actualCollection)
            this.actualCollection.reset();
        this.seriesName("");
        this.hide();
    };
    this.addSeries = function(_id, _movie) {
        let movie = _movie.model();
        if (!movie.get('saved')) {
            movie.set('saved', true);
            const id = _id();
            this.storage.add(id);
            $('html, body').animate({
                scrollTop: $(".content-wrapper").offset().top
            }, 2000);
        };
    };
    this.getPosterPath = function(_poster) {
        const poster = _poster();
        const width = 'w185';
        return 'http://image.tmdb.org/t/p/' + width + poster;
    };
    this.search = function(name = this.seriesName()) {
        this.actualCollection = new multipleSeries(name);
        this.isLoaded(false);
        this.actualCollection.fetch({
            success: () => {
                this.compareSaved();
                this.actualCollection.sort();
                this.actualSearch = kb.observableCollection(this.actualCollection, {});
                this.isLoaded(true);
            }
        });
    };
    this.compareSaved = function() {
        let base = this.storage.get();
        this.actualCollection.forEach((movie) => {
            let _id = movie.get('id');
            let mirror = base.findWhere({
                id: _id
            });
            mirror ?
                movie.set('saved', true) :
                movie.set('saved', false);
        });
    };
};

export default function() {
    return new ViewModel();
};
