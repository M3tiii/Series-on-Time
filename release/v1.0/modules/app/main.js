import $ from 'jquery';
import kb from 'knockback';
import Component from '../component';
import ViewModel from './viewModel';
import Header from '../header/main';
import Panel from '../panel/main';
import Footer from '../footer/main';
import {
    getSeries,
    getSeason
} from '../../js/utility';

let APP = Component({
    templateName: "app",
    templateView: {},
    viewModel: ViewModel(),

    sections: [Header, Panel, Footer],

    initialize: function() {
        this.loadSection(Header).then(() => {
            this.loadSection(Footer).then(() => {
                this.loadSection(Panel).then(() => {
                    this.afterSections();
                });
            });
        });
    },

    afterSections: function() {
        console.log('Append template');
        this.appendTemplate(this.afterTemplate);
    },

    afterTemplate: function() {
        console.log('Panel init');
        Panel.init();
    }
});

export default APP;
