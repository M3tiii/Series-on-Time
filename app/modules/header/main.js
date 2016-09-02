import $ from 'jquery';
import kb from 'knockback';
import Component from '../component';
import ViewModel from './viewModel';

let Header = Component({
    templateName: "Header",
    templateView: {},
    viewModel: ViewModel()
});

export default Header;
