/** @odoo-module alias=owl_tutorial_views.OWLTreeModel default=0 **/
import { Model } from "@web/views/helpers/model";
import { KeepLast } from "@web/core/utils/concurrency";

export default class OWLTreeModel extends Model {
  setup(params, { orm }) {
    this.modelName = params.resModel;
    this.orm = orm;
    this.keepLast = new KeepLast();
  }

  /**
   * Make an RPC 'write' method call to update the parent_id of
   * an existing record.
   *
   * @param {integer} id ID Of the item we want to update
   * @param {integer} parent_id The parent item ID
   */
  async changeParent(id, parent_id) {
    await this.orm.write(this.modelName, [id], { parent_id: parent_id });
    this.notify();
  }

  /**
   * Refresh a node get fresh data from the server for a given item.
   * A search_read is executed via RPC Call and then the item is modified
   * in place in the hierarchical tree structure.
   *
   * @param {integer} id ID Of the item we want to refresh
   */
  async refreshNode(id) {
    var self = this;
    var result = null;
    let itemUpdated = await this.orm.read(this.modelName, [id], []);

    let path = itemUpdated[0].parent_path;
    let target_node = self.__target_parent_node_with_path(
      path.split("/").filter((i) => i),
      self.data
    );
    target_node = itemUpdated[0];
    result = itemUpdated[0];
    this.notify();
    return result;
  }

  /**
   * Make an RPC call to get the child of the target itm then navigates
   * the nodes to the target the item and assign its "children" property
   * to the result of the RPC call.
   *
   * @param {integer} parentId Category we will "open/expand"
   * @param {string} path The parent_path represents the parents ids like "1/3/32/123/"
   */
  async expandChildrenOf(parentId, path) {
    var self = this;
    let children = await this.orm.searchRead(this.modelName, [
      ["parent_id", "=", parentId],
    ]);
    var target_node = self.__target_parent_node_with_path(
      path.split("/").filter((i) => i),
      self.data
    );
    target_node.children = children;
    target_node.child_id = children.map((i) => i.id);
    target_node.childrenVisible = true;
    this.notify();
  }

  async toggleChildrenVisibleForItem(item) {
    var target_node = this.__target_parent_node_with_path(
      item.parent_path.split("/").filter((i) => i),
      this.data
    );
    target_node.childrenVisible = !target_node.childrenVisible;
    this.notify();
  }

  async _recursivelyOpenParents(item) {
    if (item.parent_id) {
      let parent = await this.orm.read(this.modelName, [item.parent_id[0]], []);
      const directParent = parent[0];
      directParent.children = [item];
      directParent.childrenVisible = true;
      return await this._recursivelyOpenParents(directParent);
    } else {
      return [item];
    }
  }
  /**
   * Search for the Node corresponding to the given path.
   * Paths are present in the property `parent_path` of any nested item they are
   * in the form "1/3/32/123/" we have to split the string to manipulate an Array.
   * Each item in the Array will correspond to an item ID in the tree, each one
   * level deeper than the last.
   *
   * @private
   * @param {Array} path for example ["1", "3", "32", "123"]
   * @param {Array} items the items to search in
   * @param {integer} n The current index of deep inside the tree
   * @returns {Object|undefined} the tree Node corresponding to the path
   **/
  __target_parent_node_with_path(path, items, n = 0) {
    for (const item of items) {
      if (item.id == parseInt(path[n])) {
        if (n < path.length - 1) {
          return this.__target_parent_node_with_path(
            path,
            item.children,
            n + 1
          );
        } else {
          return item;
        }
      }
    }
    return undefined;
  }

  async load(params) {
    let isSearch = false;
    let domain = [["parent_id", "=", false]];
    if (params.domain && params.domain.length > 0) {
      isSearch = true;
      domain = params.domain;
    }
    let result = await this.keepLast.add(
      this.orm.searchRead(this.modelName, domain, [])
    );
    if (isSearch) {
      for (const item of result) {
        this.data = await this._recursivelyOpenParents(item);
      }
    } else {
      this.data = result;
    }
    this.notify();
  }
}
OWLTreeModel.services = ["orm"];
