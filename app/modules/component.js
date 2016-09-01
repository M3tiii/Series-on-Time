import kb from 'knockback';

class Component {
  constructor() {
    console.log('Create component');
  };

  loadTemplate() {
    const name = this.viewTemplateName;
    const tpl = this.viewTemplate;
    if (this.viewTemplate) {
      let $script = $("<script>", {
        id: name,
        type: "text/html"
      }).text(tpl);
      $('body').append($script);
    }
  };

  loadSection(_module) {
		let module = _module;
		let view = {
        name: module.viewTemplateName,
        data: module.viewModel ? module.viewModel : null,
    };
		$.get("modules/" + module.viewTemplateName + "/view.html")
			.done( data => {
				module.viewTemplate = data;
				module.loadTemplate();
				this.viewModel['section' + view.name](view);
		  });
	};

  appendTemplate() {
		$.get("modules/" + this.viewTemplateName + "/view.html")
      .done( data => {
        this.viewTemplate = data;
  			this.loadTemplate();
  			let app = kb.renderTemplate(this.viewTemplateName, this.viewModel);
        $('body').append(app);
      });
  };
};

export default function(prop) {
  return _.extend(new Component(), prop);
};
