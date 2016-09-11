import kb from 'knockback';

class Component {
    constructor() {};

    loadTemplate() {
        const _templateName = this.templateName;
        const _templateView = this.templateView;
        if (this.templateView) {
            let $element = $("<script>");
            $element.attr('id', _templateName);
            $element.attr('type', "text/html");
            $element.text(_templateView);
            $('body').append($element);
        }
    };

    loadSection(_module) {
        return new Promise((resolve, reject) => {
            let module = _module;
            let view = {
                name: module.templateName,
                data: module.viewModel ? module.viewModel : null,
            };
            $.get("modules/" + module.templateName + "/view.html")
                .done(data => {
                    console.log('Loaded component: ' + module.templateName);
                    module.templateView = data;
                    module.loadTemplate();
                    this.viewModel[view.name](view);
                    if (_.isFunction(module.isLoaded))
                        module.isLoaded();
                    resolve(module.templateName);
                });
        });

    };

    appendTemplate(success) {
        $.get("modules/" + this.templateName + "/view.html")
            .done(data => {
                this.templateView = data;
                this.loadTemplate();
                let app = kb.renderTemplate(this.templateName, this.viewModel);
                $('body').append(app);
                if (success) success();
            });
    };

    isLoaded() {
        return false;
    }
};

export default function(prop) {
    return _.extend(new Component(), prop);
};;
