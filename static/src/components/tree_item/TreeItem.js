odoo.define(
  "owl_tutorial_views/static/src/components/tree_item/TreeItem.js",
  function (require) {
    "use strict";
    const { Component } = owl;
    const patchMixin = require("web.patchMixin");
    const { useState } = owl.hooks;

    class TreeItem extends Component {
      /**
       * @override
       */
      constructor(...args) {
        super(...args);
        this.state = useState({
          isDraggedOn: false,
        });
      }

      toggleChildren() {
        if (this.props.item.child_id.length > 0) {
          this.trigger("tree_item_clicked", { data: this.props.item });
        }
      }

      onDragstart(event) {
        event.dataTransfer.setData("TreeItem", JSON.stringify(this.props.item));
      }

      onDragover() {}

      onDragenter() {
        Object.assign(this.state, { isDraggedOn: true });
      }

      onDragleave() {
        Object.assign(this.state, { isDraggedOn: false });
      }

      onDrop(event) {
        Object.assign(this.state, { isDraggedOn: false });
        let droppedItem = JSON.parse(event.dataTransfer.getData("TreeItem"));
        if (
          droppedItem.id == this.props.item.id ||
          droppedItem.parent_id[0] == this.props.item.id
        ) {
          console.log("Drop inside itself or same parent has no effect");
          return;
        }
        if (this.props.item.parent_path.startsWith(droppedItem.parent_path)) {
          console.log("Oops, drop inside child item is forbidden.");
          return;
        }
        this.trigger("change_item_tree", {
          itemMoved: droppedItem,
          newParent: this.props.item,
        });
      }
    }

    Object.assign(TreeItem, {
      components: { TreeItem },
      props: {
        item: {},
        countField: "",
      },
      template: "owl_tutorial_views.TreeItem",
    });

    return patchMixin(TreeItem);
  }
);
