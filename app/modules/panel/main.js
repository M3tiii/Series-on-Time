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
        this.viewModel.viewCall();
    },
    isLoaded: function() {
        this.modal.isLoaded = this.modalReady;
        this.modal.viewModel.storage = this.viewModel.storage;
        this.loadSection(this.modal);
    },
    modalReady: function(self) {
        Panel.init();
    }
});

export default Panel;
