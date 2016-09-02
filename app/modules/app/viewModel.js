import $ from 'jquery';
import kb from 'knockback';

var ViewModel = function() {
    this.Header = kb.observable(null, "Header");
    this.Panel = kb.observable(null, "Panel");
    this.Footer = kb.observable(null, "Footer");
};

export default function() {
    return new ViewModel();
};
