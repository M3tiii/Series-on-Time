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
