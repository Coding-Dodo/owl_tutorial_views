odoo.define("owl_tutorial_views.OWLTreeModel", function (require) {
  "use strict";

  var AbstractModel = require("web.AbstractModel");

  const OWLTreeModel = AbstractModel.extend({
    /**
     * Add a groupBy to rowGroupBys or colGroupBys according to provided type.
     *
     * @param {string} groupBy
     * @param {'row'|'col'} type
     */
    expandChildrenOf: async function (parentId, path) {
      var self = this;
      await this._rpc({
        model: this.modelName,
        method: "search_read",
        kwargs: {
          domain: [["parent_id", "=", parentId]],
        },
      }).then(function (children) {
        var target_node = self.__target_parent_node_with_path(
          path.split("/").filter((i) => i),
          self.data.items
        );
        target_node.children = children;
      });
    },

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
    __target_parent_node_with_path: function (path, items, n = 0) {
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
    },

    __get: function () {
      return this.data;
    },

    __load: function (params) {
      this.modelName = params.modelName;
      this.domain = [["parent_id", "=", false]];
      // this.domain = params.domain;
      this.data = {};
      return this._fetchData();
    },

    __reload: function (handle, params) {
      if ("domain" in params) {
        this.domain = params.domain;
      }
      return this._fetchData();
    },

    _fetchData: function () {
      var self = this;
      return this._rpc({
        model: this.modelName,
        method: "search_read",
        kwargs: {
          domain: this.domain,
        },
      }).then(function (result) {
        self.data.items = result;
      });
    },
  });

  return OWLTreeModel;
});
