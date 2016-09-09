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
    };
    this.close = function() {
        this.seriesName("");
        this.hide();
    };
    this.addSeries = function(_id) {
        const id = _id();
        this.storage.add(id);
        $('html, body').animate({
            scrollTop: $(".content-wrapper").offset().top
        }, 2000);
    };
    this.getPosterPath = function(_poster) {
        const poster = _poster();
        const width = 'w185';
        return 'http://image.tmdb.org/t/p/' + width + poster;
    };
    this.search = function(name = this.seriesName()) {
        let actualCollection = new multipleSeries(name);
        this.isLoaded(false);
        actualCollection.fetch({
            success: () => {
                actualCollection.sort();
                this.actualSearch = kb.observableCollection(actualCollection, {});
                this.isLoaded(true);
            }
        });
    };
};

export default function() {
    return new ViewModel();
};
