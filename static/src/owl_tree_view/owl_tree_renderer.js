/** @odoo-module alias=owl_tutorial_views.OWLTreeRenderer **/
const { useState } = owl.hooks;
import AbstractRendererOwl from "web.AbstractRendererOwl";
import { TreeItem } from "@owl_tutorial_views/components/tree_item/TreeItem";

export default class OWLTreeRenderer extends AbstractRendererOwl {
  constructor(parent, props) {
    super(...arguments);
    this.state = useState({
      countField: "",
    });
    if (this.props.archOptions.count_field) {
      Object.assign(this.state, {
        countField: this.props.archOptions.count_field,
      });
    }
  }
}

const components = { TreeItem };
Object.assign(OWLTreeRenderer, {
  components,
  defaultProps: {
    archOptions: {},
  },
  props: {
    archOptions: {
      type: Object,
      optional: true,
    },
    model: {
      type: Object,
    },
  },
  template: "owl_tutorial_views.OWLTreeRenderer",
});
