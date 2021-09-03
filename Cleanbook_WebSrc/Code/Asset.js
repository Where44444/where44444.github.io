class Asset {

    constructor(id) {
        this.w4id = id;
    }

    getW4id() {
        return this.w4id;
    }

    setW4id(w4id) {
        this.w4id = w4id;
    }

    static RESULT_NA = 0;
    static RESULT_EXCEEDS = 1;
    static RESULT_MEETS = 2;
    static RESULT_BELOW = 3;
    static RESULT_NOT_INSPECTED = 4;
    static results1 = [
        MainActivity.NO_ENTRY_SIGN + " N/A",
        MainActivity.BLUE_CIRCLE + " Exceeds Standards",
        MainActivity.BLACK_CIRCLE + " Meets Standards",
        MainActivity.RED_CIRCLE + " Below Standards",
        MainActivity.NO_SIGN + " Not Inspected"
    ];
    static results_noemoji = [
        "N/A",
        "Exceeds Standards",
        "Meets Standards",
        "Below Standards",
        "Not Inspected"
    ];
    static singleResults = [
        [MainActivity.NO_ENTRY_SIGN + " N/A"],
        [MainActivity.BLUE_CIRCLE + " Exceeds Standards"],
        [MainActivity.BLACK_CIRCLE + " Meets Standards"],
        [MainActivity.RED_CIRCLE + " Below Standards"],
        [MainActivity.NO_SIGN + " Not Inspected"]
    ];
    static intToDayOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];
    static intToDayOfWeek3Letter = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ];
    static intToMonth = [
        "December",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    static intToMonth_lower = [
        "",
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december"
    ];

    static intToTimeAndAMPM = [
        "12 AM",
        "1 AM",
        "2 AM",
        "3 AM",
        "4 AM",
        "5 AM",
        "6 AM",
        "7 AM",
        "8 AM",
        "9 AM",
        "10 AM",
        "11 AM",
        "12 PM",
        "1 PM",
        "2 PM",
        "3 PM",
        "4 PM",
        "5 PM",
        "6 PM",
        "7 PM",
        "8 PM",
        "9 PM",
        "10 PM",
        "11 PM",
    ];
    static EMPLOYEE = 0;
    static SUPERVISOR = 1;
    static MANAGER = 2;
    static CLIENT = 3;
    static OWNER = 4;
    static person_types_array = [
        "Employee",
        "Supervisor",
        "Manager",
        "Client",
        "Owner"
    ];

    //All , Assigned                                        locations     Messages      People        Shifts        Time Punches  Inspections   Supplies      Suppliers     Tasks
    static rPermissionsEmployee = [false, true, false, true, false, false, false, true, false, true, false, true, false, true, false, true, false, true];
    static wPermissionsEmployee = [false, false, false, true, false, false, false, false, false, false, false, false, false, true, false, false, false, false];
    static rPermissionsSupervisor = [false, true, false, true, true, false, true, false, true, false, false, true, false, true, false, true, false, true];
    static wPermissionsSupervisor = [false, true, false, true, true, false, true, false, true, false, false, true, false, true, false, true, false, true];
    static rPermissionsManager = [true, false, false, true, true, false, true, false, false, true, false, true, false, true, false, true, true, false];
    static wPermissionsManager = [true, false, false, true, true, false, true, false, false, true, false, true, false, true, false, true, true, false];
    static rPermissionsClient = [false, true, false, true, false, false, false, true, false, false, false, true, false, false, false, false, false, true];
    static wPermissionsClient = [false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    static rPermissionsOwner = [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false];
    static wPermissionsOwner = [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false];
    static permissionsNone = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    static permissionsAll = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
    static PERMISSION_ALL_LOCATIONS = 0;
    static PERMISSION_ASSIGNED_LOCATIONS = 1;
    static PERMISSION_ALL_MESSAGES = 2;
    static PERMISSION_ASSIGNED_MESSAGES = 3;
    static PERMISSION_ALL_PEOPLE = 4;
    static PERMISSION_ASSIGNED_PEOPLE = 5;
    static PERMISSION_ALL_SHIFTS = 6;
    static PERMISSION_ASSIGNED_SHIFTS = 7;
    static PERMISSION_ALL_TIMEPUNCHES = 8;
    static PERMISSION_ASSIGNED_TIMEPUNCHES = 9;
    static PERMISSION_ALL_INSPECTIONS = 10;
    static PERMISSION_ASSIGNED_INSPECTIONS = 11;
    static PERMISSION_ALL_SUPPLIES = 12;
    static PERMISSION_ASSIGNED_SUPPLIES = 13;
    static PERMISSION_ALL_SDS = 14;
    static PERMISSION_ASSIGNED_SDS = 15;
    static PERMISSION_ALL_TASKS = 16;
    static PERMISSION_ASSIGNED_TASKS = 17;
    static HOURS = [
        "12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"
    ];
    static MINUTES = [
        "00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"
    ];
    static MINUTES1 = [
        "00", "01", "02", "03", "04",
        "05", "06", "07", "08", "09",
        "10", "11", "12", "13", "14",
        "15", "16", "17", "18", "19",
        "20", "21", "22", "23", "24",
        "25", "26", "27", "28", "29",
        "30", "31", "32", "33", "34",
        "35", "36", "37", "38", "39",
        "40", "41", "42", "43", "44",
        "45", "46", "47", "48", "49",
        "50", "51", "52", "53", "54",
        "55", "56", "57", "58", "59"
    ];
    static HOURS_0_23 = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"
    ];
    static AM_PM = [
        "AM", "PM"
    ];
    static REPEAT_UNITS = [
        "Daily", "Weekly", "Monthly", "Yearly"
    ];
    static ENDUNIT_NEVER = 0;
    static ENDUNIT_OCCURENCES = 1;
    static ENDUNIT_ONDATE = 2;
    static MONTHLYREPEATTYPE_DAYOFMONTH = 0;
    static MONTHLYREPEATTYPE_DAYOFWEEK = 1;
    static REPEATUNIT_DAILY = 0;
    static REPEATUNIT_WEEKLY = 1;
    static REPEATUNIT_MONTHLY = 2;
    static REPEATUNIT_YEARLY = 3;
    static OCCURS_NONE = 0;
    static OCCURS_FIRST_DAY = 1;
    static OCCURS_SECOND_DAY = 2;
    static OCCURS_TWICE_SAME_SLOT = 3;
    static countries_array = [
        "United States",
        "Canada",
        "United Kingdom",
        "Afghanistan",
        "Åland Islands",
        "Albania",
        "Algeria",
        "American Samoa",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antarctica",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia, Plurinational State of",
        "Bonaire, Sint Eustatius and Saba",
        "Bosnia and Herzegovina",
        "Botswana",
        "Bouvet Island",
        "Brazil",
        "British Indian Ocean Territory",
        "Brunei Darussalam",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cambodia",
        "Cameroon",
        "Cape Verde",
        "Cayman Islands",
        "Central African Republic",
        "Chad",
        "Chile",
        "China",
        "Christmas Island",
        "Cocos (Keeling) Islands",
        "Colombia",
        "Comoros",
        "Congo",
        "Congo, the Democratic Reof the",
        "Cook Islands",
        "Costa Rica",
        "Côte dIvoire",
        "Croatia",
        "Cuba",
        "Curaçao",
        "Cyprus",
        "Czech Republic",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Ethiopia",
        "Falkland Islands (Malvinas)",
        "Faroe Islands",
        "Fiji",
        "Finland",
        "France",
        "French Guiana",
        "French Polynesia",
        "French Southern Territories",
        "Gabon",
        "Gambia",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Greenland",
        "Grenada",
        "Guadeloupe",
        "Guam",
        "Guatemala",
        "Guernsey",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Heard Island and McDonald Islands",
        "Holy See (Vatican City State)",
        "Honduras",
        "Hong Kong",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran, Islamic Reof",
        "Iraq",
        "Ireland",
        "Isle of Man",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jersey",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Korea, Democratic Peoples Reof",
        "Korea, Reof",
        "Kuwait",
        "Kyrgyzstan",
        "Lao Peoples Democratic Republic",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macao",
        "Macedonia, the former Yugoslav Reof",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands",
        "Martinique",
        "Mauritania",
        "Mauritius",
        "Mayotte",
        "Mexico",
        "Micronesia, Federated States of",
        "Moldova, Reof",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Montserrat",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "Niue",
        "Norfolk Island",
        "Northern Mariana Islands",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestinian Territory, Occupied",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Pitcairn",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "Réunion",
        "Romania",
        "Russian Federation",
        "Rwanda",
        "Saint Barthélemy",
        "Saint Helena, Ascension and Tristan da Cunha",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Martin (French part)",
        "Saint Pierre and Miquelon",
        "Saint Vincent and the Grenadines",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Sint Maarten (Dutch part)",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Georgia and the South Sandwich Islands",
        "South Sudan",
        "Spain",
        "Sri Lanka",
        "Sudan",
        "Suriname",
        "Svalbard and Jan Mayen",
        "Swaziland",
        "Sweden",
        "Switzerland",
        "Syrian Arab Republic",
        "Taiwan, Province of China",
        "Tajikistan",
        "Tanzania, United Reof",
        "Thailand",
        "Timor-Leste",
        "Togo",
        "Tokelau",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks and Caicos Islands",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates",
        "United States Minor Outlying Islands",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Venezuela, Bolivarian Reof",
        "Viet Nam",
        "Virgin Islands, British",
        "Virgin Islands, U.S.",
        "Wallis and Futuna",
        "Western Sahara",
        "Yemen",
        "Zambia",
        "Zimbabwe"
    ];

    static getAssetPositionInList(list, id) {
        for (var i = 0; i < list.length; ++i) {
            if (list[i].getW4id() == (id)) {
                return i;
            }
        }
        return -1;
    }

    static getAssetbyId(list, id) {
        for (var i = 0; i < list.length; ++i) {
            if (list[i].getW4id() == (id)) {
                return list[i];
            }
        }
        return null;
    }

    static getSearchedAssets(list, standardSearchString) {
        let match;
        var regexp = new RegExp(standardSearchString, "g");
        var list2 = [];
        for (var i = 0; i < list.length; ++i) {
            var textToSearch = W4_Funcs.standardizeString(list[i].method_searchString());
            if ((match = regexp.exec(textToSearch)) !== null) {
                list2.push(list[i]);
            }
        }
        return list2;
    }

    method_searchString() {
        return this.w4id;
    }

    method_getTemplateName() {
        return this.w4id;
    }
}
