import $ from 'jquery';
import kb from 'knockback';
import Component from '../component';
import ViewModel from './viewModel';
import Modal from '../modal/main';

let Panel = Component ({
	viewTemplateName: "Panel",
	viewModel: ViewModel(),
	viewTemplate: {},
	modal: Modal,
	init: function() {
		this.loadSection(this.modal);
	},
	isLoaded: function() {
		
	}
});

export default Panel;
