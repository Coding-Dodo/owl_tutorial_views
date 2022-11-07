{
    "name": "Coding Dodo - OWL Tutorial Views",
    "summary": "Tutorial about Creating an OWL View from scratch.",
    "author": "Coding Dodo",
    "website": "https://codingdodo.com",
    "category": "Tools",
    "version": "15.0.1",
    "depends": ["base", "web", "mail", "product"],
    "data": [
        "views/product_views.xml",
    ],
    "assets": {
        "web.assets_qweb": [
            "/owl_tutorial_views/static/src/components/tree_item/TreeItem.xml",
            "/owl_tutorial_views/static/src/xml/owl_tree_view.xml",
        ],
        "web.assets_backend": [
            "/owl_tutorial_views/static/src/components/tree_item/tree_item.scss",
            "/owl_tutorial_views/static/src/owl_tree_view/owl_tree_view.scss",
            "/owl_tutorial_views/static/src/components/tree_item/TreeItem.js",
            "/owl_tutorial_views/static/src/owl_tree_view/owl_tree_view.js",
            "/owl_tutorial_views/static/src/owl_tree_view/owl_tree_model.js",
            "/owl_tutorial_views/static/src/owl_tree_view/owl_tree_renderer.js",
        ],
    },
}
