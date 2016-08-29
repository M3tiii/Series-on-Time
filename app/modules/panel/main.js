import $ from 'jquery';
import kb from 'knockback';
import Component from '../component';
import ViewModel from './viewModel';

let Panel = Component ({
	viewTemplateName: "Panel",
	viewModel: ViewModel,
	viewTemplate: {},
});

export default Panel;
