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
        this.sectionsLoaded = 0;
        this.sections.forEach(module => {
            this.loadSection(module, () => {
                this.afterSections()
            });
        });
    },

    afterSections: function() {
        this.sectionsLoaded++;
        if (this.sectionsLoaded === this.sections.length)
            this.appendTemplate(this.afterTemplate);
    },

    afterTemplate: function() {
        Panel.init();
    }
});

export default APP;
