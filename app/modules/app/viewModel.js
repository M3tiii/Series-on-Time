import $ from 'jquery';
import kb from 'knockback';

var emptyView = function() {
  return {
    name: "app",
    data: null
  };
};

var ViewModel = function() {
  this.sectionHeader = kb.observable(null, "sectionHeader");
  this.sectionHeader(emptyView());
  this.sectionPanel = kb.observable(null, "sectionPanel");
  this.sectionPanel(emptyView());
  this.sectionFooter = kb.observable(null, "sectionFooter");
  this.sectionFooter(emptyView());
};

export default function() {
  return new ViewModel();
}
