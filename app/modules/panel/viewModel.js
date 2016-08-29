import $ from 'jquery';
import kb from 'knockback';

import Series from '../../collections/series';
import Season from '../../collections/season';

import Storage from '../../js/storage';

let data = [
	[62560, 'Mr. robot', '1-11', '/esN3gWb1P091xExLddD2nh4zmi3.jpg'],
	[1402, 'Walking dead', '2-22', '/cCDuZqLv6jwnf3cZZq7g3uNLaIu.jpg']
];

let ViewModel = function() {
  localStorage.removeItem('series-on-time');
  localStorage.setItem('series-on-time', JSON.stringify(data) );

  this.getPosterPath = function (_poster) {
    const poster = _poster();
    const width = 'w185';
    return 'http://image.tmdb.org/t/p/' + width + poster;
  }

  this.isLoaded = kb.observable(null, "isLoaded");

  Storage.load(this.ready);
  console.log(Storage.get());

  setTimeout(() => {
    this.mainCollection = Storage.get();
    this.container = kb.observableCollection(this.mainCollection, {});

    this.isLoaded(true);
  }, 2000)

};

export default function() {
  return new ViewModel();
};
