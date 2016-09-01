import $ from 'jquery';
import kb from 'knockback';

let ViewModel = function() {
  this.isLoaded = kb.observable(null, "isLoaded");
  this.seriesName = kb.observable(null, "seriesName");

  this.hide = function() {
    $("#myModal").hide();
  };
  this.show = function() {
    $("#myModal").show();
  };
  this.close = function () {
    this.hide();
  };
};

export default function() {
  return new ViewModel();
};
