odoo.define("owl_tutorial_views.OWLTreeRenderer", function (require) {
  "use strict";

  const AbstractRendererOwl = require("web.AbstractRendererOwl");
  const core = require("web.core");
  const patchMixin = require("web.patchMixin");
  const QWeb = require("web.QWeb");
  const session = require("web.session");

  const _t = core._t;

  const { useState } = owl.hooks;

  class OWLTreeRenderer extends AbstractRendererOwl {
    constructor(parent, props) {
      super(...arguments);
      this.qweb = new QWeb(this.env.isDebug(), { _s: session.origin });
      this.state = useState({
        localItems: props.items || [],
      });
    }

    willUpdateProps(nextProps) {
      Object.assign(this.state, {
        localItems: nextProps.items,
      });
    }
  }

  const components = {
    TreeItem: require("owl_tutorial_views/static/src/components/tree_item/TreeItem.js"),
  };
  Object.assign(OWLTreeRenderer, {
    components,
    defaultProps: {
      expandedCategories: [],
      items: [],
    },
    props: {
      expandedCategories: {
        type: Array,
        optional: true,
      },
      arch: {
        type: Object,
        optional: true,
      },
      items: {
        type: Array,
      },
      isEmbedded: {
        type: Boolean,
        optional: true,
      },
      noContentHelp: {
        type: String,
        optional: true,
      },
    },
    template: "owl_tutorial_views.OWLTreeRenderer",
  });

  return patchMixin(OWLTreeRenderer);
});
