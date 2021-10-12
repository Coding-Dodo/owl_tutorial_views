/** @odoo-module alias=owl_tutorial_views.OWLTreeRenderer default=0 **/
const { useState } = owl.hooks;
import AbstractRendererOwl from "web.AbstractRendererOwl";
import QWeb from "web.QWeb";
import session from "web.session";
import { TreeItem } from "@owl_tutorial_views/components/tree_item/TreeItem";

export class OWLTreeRenderer extends AbstractRendererOwl {
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
