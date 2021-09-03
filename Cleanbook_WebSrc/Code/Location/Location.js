class Location extends Asset {
    //  String name;
    //  String address1;
    //  String address2;
    //  String city;
    //  String state;
    //  String zip;
    //  int country;
    //  String phone;
    //  String email;
    //  String securityInfo;
    //  String instructions;
    //  int gpsRadius;
    //  double latitude;
    //  double longitude;

    constructor(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
        if (a === undefined) {
            super("");
            this.constructor0(a);
        }
        else if (b === undefined) {
            super(a.w4id);
            this.constructor1(a);
        } else {
            super(a);
            this.constructor2(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
        }
    }

    constructor0() {
        this.name = "";
        this.address1 = "";
        this.address2 = "";
        this.city = "";
        this.state = "";
        this.zip = "";
        this.country = 0;
        this.phone = "";
        this.email = "";
        this.securityInfo = "";
        this.instructions = "";
        this.gpsRadius = 300;
        this.latitude = 0;
        this.longitude = 0;
    }

    constructor1(location) {
        this.name = location.name;
        this.address1 = location.address1;
        this.address2 = location.address2;
        this.city = location.city;
        this.state = location.state;
        this.zip = location.zip;
        this.country = location.country;
        this.phone = location.phone;
        this.email = location.email;
        this.securityInfo = location.securityInfo;
        this.instructions = location.instructions;
        this.gpsRadius = location.gpsRadius;
        this.latitude = location.latitude;
        this.longitude = location.longitude;
    }

    constructor2(w4id, name, address1, address2, city, state, zip, country, phone, email, securityInfo, instructions, gpsRadius, latitude, longitude) {
        this.name = name;
        this.address1 = address1;
        this.address2 = address2;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.country = country;
        this.phone = phone;
        this.email = email;
        this.securityInfo = securityInfo;
        this.instructions = instructions;
        this.gpsRadius = gpsRadius;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    static fromDS(dataSnapshot) {
        var w4id = dataSnapshot["w4id"];
        var name = dataSnapshot["name"];
        var address1 = dataSnapshot["address1"];
        var address2 = dataSnapshot["address2"];
        var city = dataSnapshot["city"];
        var state = dataSnapshot["state"];
        var zip = dataSnapshot["zip"];
        var country = dataSnapshot["country"];
        var phone = dataSnapshot["phone"];
        var email = dataSnapshot["email"];
        var securityInfo = dataSnapshot["securityInfo"];
        var instructions = dataSnapshot["instructions"];
        var gpsRadius = dataSnapshot["gpsRadius"];
        var latitude = dataSnapshot["latitude"];
        var longitude = dataSnapshot["longitude"];
        return new Location(w4id, name, address1, address2, city, state, zip, country, phone, email, securityInfo, instructions, gpsRadius, latitude, longitude);
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getAddress1() {
        return this.address1;
    }

    setAddress1(address1) {
        this.address1 = address1;
    }

    getAddress2() {
        return this.address2;
    }

    setAddress2(address2) {
        this.address2 = address2;
    }

    getCity() {
        return this.city;
    }

    setCity(city) {
        this.city = city;
    }

    getState() {
        return this.state;
    }

    setState(state) {
        this.state = state;
    }

    getZip() {
        return this.zip;
    }

    setZip(zip) {
        this.zip = zip;
    }

    getCountry() {
        return this.country;
    }

    setCountry(country) {
        this.country = country;
    }

    getPhone() {
        return this.phone;
    }

    setPhone(phone) {
        this.phone = phone;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }

    getSecurityInfo() {
        return this.securityInfo;
    }

    setSecurityInfo(securityInfo) {
        this.securityInfo = securityInfo;
    }

    getInstructions() {
        return this.instructions;
    }

    setInstructions(instructions) {
        this.instructions = instructions;
    }

    getGpsRadius() {
        return this.gpsRadius;
    }

    setGpsRadius(gpsRadius) {
        this.gpsRadius = gpsRadius;
    }

    getLatitude() {
        return this.latitude;
    }

    setLatitude(latitude) {
        this.latitude = latitude;
    }

    getLongitude() {
        return this.longitude;
    }

    setLongitude(longitude) {
        this.longitude = longitude;
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
        return this.name;
    }
}
