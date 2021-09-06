class SupplyItem extends Asset {
    // private String name = "";
    // private String brand = "";
    // private String sku = "";
    // private int price = 0;
    // private int quantity = 0;
    // private String suppliedBy = "";
    // private String notes = "";
    // private String locationID = "";
    // private int amountRequested = 0;
    // private String requester = "";
    // private boolean template = false;
    // private String templateID = "";

    constructor(a, b, c, d, e, f, g, h, i, j, k, l, m) {
        if (a === undefined) {
            super("");
            this.constructor0();
        }
        else if (b === undefined) {
            super(a.w4id);
            this.constructor1(a);
        } else {
            super(a);
            this.constructor2(a, b, c, d, e, f, g, h, i, j, k, l, m);
        }
    }

    constructor0() {
        this.name = "";
        this.brand = "";
        this.sku = "";
        this.price = 0;
        this.quantity = 0;
        this.suppliedBy = "";
        this.notes = "";
        this.locationID = "";
        this.amountRequested = 0;
        this.requester = "";
        this.template = false;
        this.templateID = "";
    }

    constructor1(supplyItem) {
        this.constructor2(supplyItem.w4id, supplyItem.name, supplyItem.brand, supplyItem.sku, supplyItem.price, supplyItem.quantity, supplyItem.suppliedBy, supplyItem.notes, supplyItem.locationID, supplyItem.amountRequested, supplyItem.requester, supplyItem.template, supplyItem.templateID);
    }

    constructor2(id, name, brand, sku, price, quantity, suppliedBy, notes, locationID, amountRequested, requester, template, templateID) {
        this.name = name;
        this.brand = brand;
        this.sku = sku;
        this.price = price;
        this.quantity = quantity;
        this.suppliedBy = suppliedBy;
        this.notes = notes;
        this.locationID = locationID;
        this.amountRequested = amountRequested;
        this.requester = requester;
        this.template = template;
        this.templateID = templateID;
    }

    static fromDS(dataSnapshot) {
        var w4id = dataSnapshot["w4id"];
        var name = dataSnapshot["name"];
        var brand = dataSnapshot["brand"];
        var sku = dataSnapshot["sku"];
        var price = dataSnapshot["price"];
        var quantity = dataSnapshot["quantity"];
        var suppliedBy = dataSnapshot["suppliedBy"];
        var notes = dataSnapshot["notes"];
        var locationID = dataSnapshot["locationID"];
        var amountRequested = dataSnapshot["amountRequested"];
        var requester = dataSnapshot["requester"];
        var template = dataSnapshot["template"];
        var templateID = dataSnapshot["templateID"];
        return new SupplyItem(w4id, name, brand, sku, price, quantity, suppliedBy, notes, locationID, amountRequested, requester, template, templateID);
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getBrand() {
        return this.brand;
    }

    setBrand(brand) {
        this.brand = brand;
    }

    getSku() {
        return this.sku;
    }

    setSku(sku) {
        this.sku = sku;
    }

    getPrice() {
        return this.price;
    }

    setPrice(price) {
        this.price = price;
    }

    getQuantity() {
        return this.quantity;
    }

    setQuantity(quantity) {
        this.quantity = quantity;
    }

    getSuppliedBy() {
        return this.suppliedBy;
    }

    setSuppliedBy(suppliedBy) {
        this.suppliedBy = suppliedBy;
    }

    getNotes() {
        return this.notes;
    }

    setNotes(notes) {
        this.notes = notes;
    }

    getLocationID() {
        return this.locationID;
    }

    setLocationID(locationID) {
        this.locationID = locationID;
    }

    getAmountRequested() {
        return this.amountRequested;
    }

    setAmountRequested(amountRequested) {
        this.amountRequested = amountRequested;
    }

    getRequester() {
        return this.requester;
    }

    setRequester(requester) {
        this.requester = requester;
    }

    isTemplate() {
        return this.template;
    }

    setTemplate(template) {
        this.template = template;
    }

    getTemplateID() {
        return this.templateID;
    }

    setTemplateID(templateID) {
        this.templateID = templateID;
    }


    static compareTo(a, o) {

        if (a.getName() < o.getName()) {
            return -1;
        }
        if (a.getName() > o.getName()) {
            return 1;
        }
        return 0;
    }


    method_searchString() {
        var locationName = "";
        var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), this.locationID);
        if (location != null) {
            locationName = location.getName();
        }
        return this.name + " " + locationName;
    }


    method_getTemplateName() {
        return this.name;
    }
}
