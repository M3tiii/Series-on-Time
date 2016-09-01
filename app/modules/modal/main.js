import $ from 'jquery';
import kb from 'knockback';
import Component from '../component';
import ViewModel from './viewModel';

let Modal = Component ({
	viewTemplateName: "Modal",
	viewModel: ViewModel(),
	viewTemplate: {},
});

export default Modal;
