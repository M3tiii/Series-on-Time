import $ from 'jquery';
import kb from 'knockback';
import Component from '../component';
import ViewModel from './viewmodel.js';

let Header = Component ({
	viewTemplateName: "Header",
	viewModel: ViewModel,
	viewTemplate: {},
});

export default Header;
