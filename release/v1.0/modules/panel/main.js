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
        this.viewReady = true;
        this.ready();
    },
    isLoaded: function() {
        this.modal.isLoaded = () => {
            this.modalReady = true
            this.ready()
        };
        this.modal.viewModel.storage = this.viewModel.storage;
        this.loadSection(this.modal);
    },
    ready: function() {
        if (this.viewReady && this.modalReady)
            this.viewModel.viewCall();
    }
});

export default Panel;
