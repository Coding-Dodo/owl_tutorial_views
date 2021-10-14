/** @odoo-module **/
import { registry } from "@web/core/registry";
import { XMLParser } from "@web/core/utils/xml";
import { useModel } from "@web/views/helpers/model";
import { standardViewProps } from "@web/views/helpers/standard_view_props";
import { Layout } from "@web/views/layout";
import OWLTreeModel from "@owl_tutorial_views/owl_tree_view/owl_tree_model";
import OWLTreeRenderer from "owl_tutorial_views.OWLTreeRenderer";

class OWLTreeView extends owl.Component {
  /**
   * Parse the props.arch Root node and transform the attributes into a JS object
   * the will correspond to the options
   *
   * @private
   * @returns {Object} Options
   **/
  _parseArchOptions() {
    const parser = new XMLParser();
    const arch = parser.parseXML(this.props.arch);
    const options = {};
    for (const attr of arch.getAttributeNames()) {
      options[attr] = arch.getAttribute(attr);
    }
    return options;
  }

  /**
   * Standard setup function of OWL Component, here we parse the XML
   * template to get the options and instantiate the Model.
   **/
  setup() {
    this.archOptions = this._parseArchOptions();
    this.model = useModel(OWLTreeModel, {
      resModel: this.props.resModel,
      domain: this.props.domain,
    });
  }

  /**
   * @param {Object} ev
   * @param {Object} ev.data contains the payload
   */
  async _onTreeItemClicked(ev) {
    ev.stopPropagation();
    if (ev.detail.data.children === undefined) {
      await this.model.expandChildrenOf(
        ev.detail.data.id,
        ev.detail.data.parent_path
      );
    } else {
      this.model.toggleChildrenVisibleForItem(ev.detail.data);
    }
  }

  /**
   * @param {Object} ev
   * @param {Object} ev.data.itemMoved is the item that has been dragged
   * @param {Object} ev.data.newParent is the new target parent of the dropped item
   */
  async _onChangeItemTree(ev) {
    ev.stopPropagation();
    let itemMoved = ev.detail.itemMoved;
    let newParent = ev.detail.newParent;
    await this.model.changeParent(itemMoved.id, newParent.id);

    // Refresh old parent
    let oldParent = await this.model.refreshNode(itemMoved.parent_id[0]);
    await this.model.expandChildrenOf(oldParent.id, oldParent.parent_path);

    // Refresh new parent
    await this.model.expandChildrenOf(
      ev.detail.newParent.id,
      ev.detail.newParent.parent_path
    );
  }
}
OWLTreeView.type = "owl_tree";
OWLTreeView.display_name = "OWLTreeView";
OWLTreeView.icon = "fa-indent";
OWLTreeView.multiRecord = true;
OWLTreeView.searchMenuTypes = ["filter", "favorite"];
OWLTreeView.components = { Layout, OWLTreeRenderer };
OWLTreeView.props = {
  ...standardViewProps,
};
OWLTreeView.template = owl.tags.xml/* xml */ `
<Layout viewType="'owl_tree'">
    <OWLTreeRenderer archOptions="archOptions" model="model" t-on-tree_item_clicked="_onTreeItemClicked" t-on-change_item_tree="_onChangeItemTree"/>
</Layout>`;

registry.category("views").add("owl_tree", OWLTreeView);
