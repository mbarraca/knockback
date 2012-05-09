// Generated by CoffeeScript 1.3.1
/*
  knockback_triggered_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/

Knockback.TriggeredObservable = (function() {

  TriggeredObservable.name = 'TriggeredObservable';

  function TriggeredObservable(model, event_name) {
    var observable;
    this.model = model;
    this.event_name = event_name;
    if (!this.model) {
      throw new Error('Observable: model is missing');
    }
    if (!this.event_name) {
      throw new Error('Observable: event_name is missing');
    }
    this.__kb = {};
    this.__kb._onValueChange = _.bind(this._onValueChange, this);
    this.__kb._onModelLoaded = _.bind(this._onModelLoaded, this);
    this.__kb._onModelUnloaded = _.bind(this._onModelUnloaded, this);
    if (Backbone.ModelRef && (this.model instanceof Backbone.ModelRef)) {
      this.model_ref = this.model;
      this.model_ref.retain();
      this.model_ref.bind('loaded', this.__kb._onModelLoaded);
      this.model_ref.bind('unloaded', this.__kb._onModelUnloaded);
      this.model = this.model_ref.getModel();
    }
    this.__kb.value_observable = ko.observable();
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable(_.bind(this._onGetValue, this)));
    observable.destroy = _.bind(this.destroy, this);
    if (!this.model_ref || this.model_ref.isLoaded()) {
      this._onModelLoaded(this.model);
    }
    return observable;
  }

  TriggeredObservable.prototype.destroy = function() {
    kb.utils.wrappedObservable(this).dispose();
    kb.utils.wrappedObservable(this, null);
    this.__kb.value_observable = null;
    if (this.model) {
      this._onModelUnloaded(this.model);
    }
    if (this.model_ref) {
      this.model_ref.unbind('loaded', this.__kb._onModelLoaded);
      this.model_ref.unbind('unloaded', this.__kb._onModelUnloaded);
      this.model_ref.release();
      this.model_ref = null;
    }
    this.options = null;
    this.view_model = null;
    return this.__kb = null;
  };

  TriggeredObservable.prototype._onGetValue = function() {
    return this.__kb.value_observable();
  };

  TriggeredObservable.prototype._onModelLoaded = function(model) {
    this.model = model;
    this.model.bind(this.event_name, this.__kb._onValueChange);
    return this._onValueChange();
  };

  TriggeredObservable.prototype._onModelUnloaded = function() {
    if (this.__kb.localizer && this.__kb.localizer.destroy) {
      this.__kb.localizer.destroy();
      this.__kb.localizer = null;
    }
    this.model.unbind(this.event_name, this.__kb._onValueChange);
    return this.model = null;
  };

  TriggeredObservable.prototype._onValueChange = function() {
    var current_value;
    current_value = this.__kb.value_observable();
    if (current_value !== this.model) {
      return this.__kb.value_observable(this.model);
    } else {
      return this.__kb.value_observable.valueHasMutated();
    }
  };

  return TriggeredObservable;

})();

Knockback.triggeredObservable = function(model, event_name) {
  return new Knockback.TriggeredObservable(model, event_name);
};
