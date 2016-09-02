import $ from 'jquery';
import kb from 'knockback';

import Series from '../../collections/series';
import Season from '../../collections/season';

import Storage from '../../js/storage';

let ViewModel = function() {
    let self = this;
    this.Modal = kb.observable(null, "Modal");
    this.Modal({
        name: "app",
        data: null
    });
    this.isLoaded = kb.observable(null, "isLoaded");
    this.removed = kb.observableCollection(null, "removed");
    // localStorage.clear();

    this.getPosterPath = function(_poster) {
        const poster = _poster();
        const width = 'w185';
        if (poster)
            return 'http://image.tmdb.org/t/p/' + width + poster;
    };

    this.openModal = function() {
        this.Modal().data.show();
    };

    this.removeSeries = function(context, ev, _id) {
        const id = _id();
        Storage.remove(id);
        Storage.save();
        this.removed().push(id);
    };

    this.restoreRemoved = function() {
        if (this.removed().length) {
            this.removed().forEach((series) => {
                Storage.add(series)
            });
            Storage.save();
            this.removed([]);
        }
    };

    this.storageReady = function() {
        setTimeout(() => { // TODO replace by callback ready
            self.Modal().data.storage = Storage;
            self.mainCollection = Storage.get();
            self.container = kb.observableCollection(self.mainCollection, {});
            self.isLoaded(true);
            Storage.save();
        }, 200);
    };

    Storage.load(this.storageReady);
};

export default function() {
    return new ViewModel();
};
