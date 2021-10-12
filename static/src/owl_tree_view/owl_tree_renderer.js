odoo.define("owl_tutorial_views.OWLTreeRenderer", function (require) {
  "use strict";

  const AbstractRendererOwl = require("web.AbstractRendererOwl");
  const QWeb = require("web.QWeb");
  const session = require("web.session");
  const {
    TreeItem,
  } = require("@owl_tutorial_views/components/tree_item/TreeItem");

  const { useState } = owl.hooks;

  class OWLTreeRenderer extends AbstractRendererOwl {
    constructor(parent, props) {
      super(...arguments);
      this.qweb = new QWeb(this.env.isDebug(), { _s: session.origin });
      this.state = useState({
        localItems: props.items || [],
        countField: "",
      });
      if (this.props.arch.attrs.count_field) {
        Object.assign(this.state, {
          countField: this.props.arch.attrs.count_field,
        });
      }
    }
  }

  const components = { TreeItem };
  Object.assign(OWLTreeRenderer, {
    components,
    defaultProps: {
      items: [],
    },
    props: {
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

  return OWLTreeRenderer;
});
