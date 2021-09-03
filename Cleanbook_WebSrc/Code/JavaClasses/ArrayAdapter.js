class ArrayAdapter {
    constructor(context, view, list) {
        this.activity = context;
        this.aa_list = list;
    }

    // getHTML() {
    //     var html = "";
    //     for (var i = 0; i < this.aa_list.length; ++i) {
    //         var view = this.getView(i, null, null);
    //         html += view.ele.outerHTML;
    //     }
    //     return html;
    // }

    getHTMLNodes() {
        var nodes = [];
        for (var i = 0; i < this.aa_list.length; ++i) {
            nodes.push(this.getView(i, null, null).ele);
        }
        return nodes;
    }

    getLastNode() {
        return this.getView(this.aa_list.length - 1, null, null).ele;
    }

    getView() {
    }

    getContext() {
        return this.activity;
    }
}