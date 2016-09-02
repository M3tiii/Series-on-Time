import $ from 'jquery';
import kb from 'knockback';
import Component from '../component';
import ViewModel from './viewModel';

let Modal = Component({
    templateName: "Modal",
    templateView: {},
    viewModel: ViewModel()
});

export default Modal;
