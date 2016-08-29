import $ from 'jquery';
import kb from 'knockback';
import Component from '../component';
import ViewModel from './viewModel';
import Header from '../header/main';
import Panel from '../panel/main';
import Footer from '../footer/main';
import {getSeries, getSeason} from '../../js/utility';

let APP = Component ({
	viewTemplateName: "app",
	viewModel: ViewModel(),
	viewTemplate: {},

	sections: [Header, Panel, Footer],

	initialize: function() {
		this.loadSections();
		this.appendTemplate();
	},

	loadSections: function() {
		let self = this;
		this.sections.forEach(module => {
			var view = {
          name: module.viewTemplateName,
          data: module.viewModel ? module.viewModel : null,
      };
			$.get("modules/" + module.viewTemplateName + "/view.html")
				.done( data => {
					module.viewTemplate = data;
					module.loadTemplate();
			  });
			this.viewModel['section' + view.name](view);
		})
  },
});

export default APP;
