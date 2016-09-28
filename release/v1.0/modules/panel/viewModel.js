import $ from 'jquery';
import kb from 'knockback';

import Series from '../../collections/series';
import Season from '../../collections/season';

import Storage from '../../js/storage';

let ViewModel = function() {
    let self = this;
    this.storage = Storage;
    this.Modal = kb.observable(null, "Modal");
    this.Modal({
        name: "app",
        data: null
    });
    this.isLoaded = kb.observable(null, "isLoaded");
    this.introLoaded = kb.observable(null, "introLoaded");
    this.removed = [];

    this.getPosterPath = function(_poster, _name, _width = 'w185') {
        const poster = _poster();
        const name = _name();
        const width = _width;
        if (poster)
            return 'http://image.tmdb.org/t/p/' + width + poster;
        else
            return 'http://placehold.it/157.5x' + '236' + '/222/fff?text=' + name;
    };

    this.openModal = function() {
        this.Modal().data.show();
    };

    this.removeSeries = function(model, context, ev) {
        const id = model.id();
        this.removed.push([model.id(), model.name(), model.airDate(), model.poster(), model.backdrop(), model.episodeName()]);
        this.storage.remove(id);
        this.restoreButton.show();
    };

    this.restoreRemoved = function(button) {
        const lastRemoved = this.removed.pop();
        if (!this.removed.length)
            this.restoreButton.hide();
        if (lastRemoved) {
            this.storage.add(...lastRemoved);
        }
    };

    this.viewModelReady = function() {
        if (this.storageReady && this.viewReady) {
            setTimeout(() => {
                console.log('Storage ready');

                this.mainCollection = this.storage.get();
                this.container = kb.observableCollection(this.mainCollection, {});

                this.introCollection = new Backbone.Collection();
                this.introContainer = kb.observableCollection(this.introCollection, {});
                this.setIntro();
                this.container.subscribe(() => {
                    this.setIntro();
                })

                this.isLoaded(true);

                this.addButton = $('.add-series');
                this.restoreButton = $('.restore-series');

                this.addButton.click(() => {
                    this.openModal();
                });
                this.restoreButton.click(() => {
                    this.restoreRemoved();
                });
            }, 50);
        }
    };

    this.setIntro = function() {
        let model = this.mainCollection.first();
        if (model && model.get('days') >= 0) {
            this.introCollection.reset();
            this.introCollection.add(model);
            this.introLoaded(true);
        } else {
            this.introCollection.reset();
            this.introLoaded(false);
        }
    }

    this.storageCall = function() {
        self.storageReady = true;
        self.viewModelReady();
    };

    this.viewCall = function() {
        self.viewReady = true;
        self.viewModelReady();
    };

    this.storage.load(this.storageCall);
};

export default function() {
    return new ViewModel();
};
