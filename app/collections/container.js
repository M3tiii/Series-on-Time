import kb from 'knockback';

class Container extends Backbone.Collection {
  constructor(...args) {
    super(...args);
  };
  localStorage() {
    return new Backbone.LocalStorage('local-save');
  };
}

export default Container;
