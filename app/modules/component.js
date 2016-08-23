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
    let self = this;
		$.get("modules/" + self.viewTemplateName + "/view.html", function(data) {
			self.viewTemplate = data;
			self.loadTemplate();
			let app = kb.renderTemplate(self.viewTemplateName, self.viewModel);
      $('body').append(app);
		});
  };
};

export default function(prop) {
  return _.extend(new Component(), prop);
}
