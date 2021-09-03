class LayoutInflater {
    constructor(context) {
        this.context = context;
    }

    static from(context) {
        return new LayoutInflater(context);
    }

    inflate(htmlString) {
        return new View(W4_Funcs.createElementFromHTML(htmlString), this.context);
    }
}