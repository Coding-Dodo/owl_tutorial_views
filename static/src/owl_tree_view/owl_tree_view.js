odoo.define("owl_tutorial_views.OWLTreeView", function (require) {
  "use strict";

  const OWLTreeController = require("owl_tutorial_views.OWLTreeController");
  const OWLTreeModel = require("owl_tutorial_views.OWLTreeModel");
  const OWLTreeRenderer = require("owl_tutorial_views.OWLTreeRenderer");
  const AbstractView = require("web.AbstractView");
  const core = require("web.core");
  const RendererWrapper = require("web.RendererWrapper");
  const view_registry = require("web.view_registry");

  const _lt = core._lt;

  const OWLTreeView = AbstractView.extend({
    accesskey: "m",
    display_name: _lt("OWLTreeView"),
    icon: "fa-indent",
    config: _.extend({}, AbstractView.prototype.config, {
      Controller: OWLTreeController,
      Model: OWLTreeModel,
      Renderer: OWLTreeRenderer,
    }),
    viewType: "owl_tree",
    searchMenuTypes: ["filter", "favorite"],

    /**
     * @override
     */
    init: function () {
      this._super.apply(this, arguments);
    },

    getRenderer(parent, state) {
      state = Object.assign(state || {}, this.rendererParams);
      return new RendererWrapper(parent, this.config.Renderer, state);
    },
  });

  view_registry.add("owl_tree", OWLTreeView);

  return OWLTreeView;
});
