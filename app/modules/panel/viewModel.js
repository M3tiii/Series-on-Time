import $ from 'jquery';
import kb from 'knockback';

import Series from '../../collections/series';
import Season from '../../collections/season';

import Storage from '../../js/storage';

let ViewModel = function() {
	let self = this;
	this.sectionModal = kb.observable(null, "sectionModal");
	this.sectionModal({name: "app", data: null});
  this.isLoaded = kb.observable(null, "isLoaded");

  this.getPosterPath = function (_poster) {
    const poster = _poster();
    const width = 'w185';
    return 'http://image.tmdb.org/t/p/' + width + poster;
  };

	this.openModal = function () {
		this.sectionModal().data.show();
	};

	this.storageReady = function () {
		self.mainCollection = Storage.get();
    self.container = kb.observableCollection(self.mainCollection, {});
		self.isLoaded(true);
		Storage.save();
	};

  Storage.load(this.storageReady);
};

export default function() {
  return new ViewModel();
};
