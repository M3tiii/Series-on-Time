import $ from 'jquery';
import kb from 'knockback';
import Component from '../component';
import ViewModel from './viewModel';
import Modal from '../modal/main';

let Panel = Component({
    templateName: "Panel",
    templateView: {},
    viewModel: ViewModel(),
    modal: Modal,
    init: function() {
        this.loadSection(this.modal);
    },
    isLoaded: function() {

    }
});

export default Panel;
