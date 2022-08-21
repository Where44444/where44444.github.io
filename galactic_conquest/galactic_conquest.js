//Temps
var fireBaseInitialized = false;
var database = null;
var firebaseSnapshot = null;
var donationTo = "republic";
var startingCredits = 1000;

var sound_theme;
var sound_error;
var sound_select;
var sound_select_cancel;
var sound_select_long;
var sound_fleet_constructed;
var sound_fleet_defeated;
var sound_geonosis;
var sound_naboo;
var sound_kamino;
var sound_kashyyyk;
var sound_felucia;
var sound_yavin4;
var sound_tatooine;
var sound_hoth;
var sound_endor;
var sound_movement_cancelled;
var sound_select_a_bonus_for_this_battle;
var sound_select_a_bonus_to_purchase;
var sound_select_destination;
var sound_select_fleet;
var sound_victory;
var sound_defeat;
loadSounds();

function loadSounds() {
  sound_theme = document.getElementById("sound_theme");
  sound_error = document.getElementById("sound_error");
  sound_select = document.getElementById("sound_select");
  sound_select_cancel = document.getElementById("sound_select_cancel");
  sound_select_long = document.getElementById("sound_select_long");
  sound_fleet_constructed = [
    document.getElementById("sound_error"),
    document.getElementById("sound_republic_fleet_constructed"),
    document.getElementById("sound_cis_fleet_constructed"),
    document.getElementById("sound_rebel_fleet_constructed"),
    document.getElementById("sound_empire_fleet_constructed"),
    document.getElementById("sound_resist_fleet_constructed"),
    document.getElementById("sound_firstorder_fleet_constructed")
  ];
  // sound_fleet_defeated = [
  //   [document.getElementById("sound_error"), document.getElementById("sound_error"), document.getElementById("sound_error")],
  //   [document.getElementById("sound_republic_fleet_defeated_1"), document.getElementById("sound_republic_fleet_defeated_2"), document.getElementById("sound_republic_fleet_defeated_3")],
  //   [document.getElementById("sound_cis_fleet_defeated_1"), document.getElementById("sound_cis_fleet_defeated_2"), document.getElementById("sound_cis_fleet_defeated_3")]];
  sound_geonosis = [null, document.getElementById("sound_republic_geonosis"), document.getElementById("sound_cis_geonosis")];
  sound_naboo = [null, document.getElementById("sound_republic_naboo"), document.getElementById("sound_cis_naboo")];
  sound_kamino = [null, document.getElementById("sound_republic_kamino"), document.getElementById("sound_cis_kamino")];
  sound_kashyyyk = [null, document.getElementById("sound_republic_kashyyyk"), document.getElementById("sound_cis_kashyyyk")];
  sound_felucia = [null, document.getElementById("sound_republic_felucia"), document.getElementById("sound_cis_felucia")];
  sound_yavin4 = [null, null, null, document.getElementById("sound_rebel_yavin4"), document.getElementById("sound_empire_yavin4")];
  sound_tatooine = [null, null, null, document.getElementById("sound_rebel_tatooine"), document.getElementById("sound_empire_tatooine")];
  sound_hoth = [null, null, null, document.getElementById("sound_rebel_hoth"), document.getElementById("sound_empire_hoth")];
  sound_endor = [null, null, null, document.getElementById("sound_rebel_endor"), document.getElementById("sound_empire_endor")];
  sound_movement_cancelled = [
    document.getElementById("sound_error"),
    document.getElementById("sound_republic_movement_cancelled"),
    document.getElementById("sound_cis_movement_cancelled"),
    document.getElementById("sound_rebel_movement_cancelled"),
    document.getElementById("sound_empire_movement_cancelled"),
    document.getElementById("sound_resist_movement_cancelled"),
    document.getElementById("sound_firstorder_movement_cancelled")];
  sound_select_a_bonus_for_this_battle = [
    document.getElementById("sound_error"),
    document.getElementById("sound_republic_select_a_bonus_for_this_battle"),
    document.getElementById("sound_cis_select_a_bonus_for_this_battle"),
    document.getElementById("sound_rebel_select_a_bonus_for_this_battle"),
    document.getElementById("sound_empire_select_a_bonus_for_this_battle"),
    document.getElementById("sound_resist_select_a_bonus_for_this_battle"),
    document.getElementById("sound_firstorder_select_a_bonus_for_this_battle")];
  sound_select_a_bonus_to_purchase = [
    document.getElementById("sound_error"),
    document.getElementById("sound_republic_select_a_bonus_to_purchase"),
    document.getElementById("sound_cis_select_a_bonus_to_purchase"),
    document.getElementById("sound_rebel_select_a_bonus_to_purchase"),
    document.getElementById("sound_empire_select_a_bonus_to_purchase"),
    document.getElementById("sound_resist_select_a_bonus_to_purchase"),
    document.getElementById("sound_firstorder_select_a_bonus_to_purchase")
  ];
  sound_select_destination = [
    [document.getElementById("sound_error"), document.getElementById("sound_error")],
    [document.getElementById("sound_republic_select_destination_1"), document.getElementById("sound_republic_select_destination_2")],
    [document.getElementById("sound_cis_select_destination_1"), document.getElementById("sound_cis_select_destination_2")],
    [document.getElementById("sound_rebel_select_destination_1"), document.getElementById("sound_rebel_select_destination_2")],
    [document.getElementById("sound_empire_select_destination_1"), document.getElementById("sound_empire_select_destination_2")],
    [document.getElementById("sound_resist_select_destination_1"), document.getElementById("sound_resist_select_destination_2")],
    [document.getElementById("sound_firstorder_select_destination_1"), document.getElementById("sound_firstorder_select_destination_2")]
  ];
  sound_select_fleet = [
    [document.getElementById("sound_error"), document.getElementById("sound_error"), document.getElementById("sound_error")],
    [document.getElementById("sound_republic_select_fleet_1"), document.getElementById("sound_republic_select_fleet_2"), document.getElementById("sound_republic_select_fleet_3")],
    [document.getElementById("sound_cis_select_fleet_1"), document.getElementById("sound_cis_select_fleet_2"), document.getElementById("sound_cis_select_fleet_3")],
    [document.getElementById("sound_rebel_select_fleet_1"), document.getElementById("sound_rebel_select_fleet_2"), document.getElementById("sound_rebel_select_fleet_3")],
    [document.getElementById("sound_empire_select_fleet_1"), document.getElementById("sound_empire_select_fleet_2"), document.getElementById("sound_empire_select_fleet_3")],
    [document.getElementById("sound_resist_select_fleet_1"), document.getElementById("sound_resist_select_fleet_2"), document.getElementById("sound_resist_select_fleet_3")],
    [document.getElementById("sound_firstorder_select_fleet_1"), document.getElementById("sound_firstorder_select_fleet_2"), document.getElementById("sound_firstorder_select_fleet_3")]
  ];
  sound_victory = [
    document.getElementById("sound_error"),
    document.getElementById("sound_republic_victory"),
    document.getElementById("sound_cis_victory"),
    document.getElementById("sound_rebel_victory"),
    document.getElementById("sound_empire_victory"),
    document.getElementById("sound_resist_victory"),
    document.getElementById("sound_firstorder_victory")
  ];
  sound_defeat = document.getElementById("sound_defeat");
}

var cursor_over_button = false;


var soundEnabled = false;
var w4PosMap = new Map();
var w4SizeMap = new Map();
var w4FontMap = new Map();
var w4FontElements = [
  "version_text",
  "donate_earth_button",
  "autosave_text",
  "restart_text",
  "restart_screen_text",
  "restart_yes_text",
  "restart_no_text",
  "bonus_attack_name",
  "bonus_attack_description",
  "skip_text",
  "use_text",
  "bonus_attack_ai_name",
  "bonus_attack_ai_description",
  "su_mode",
  "su_location",
  "su_difficulty",
  "su_length",
  "su_points",
  "su_enemy_ai",
  "su_friendly_ai",
  "su_enemy_hero",
  "su_friendly_hero",
  "su_enemy_reinforcement",
  "su_friendly_reinforcement",
  "su_enemy_vehicle",
  "su_friendly_vehicle",
  "mi_mode",
  "mi_location",
  "mi_difficulty",
  "mi_points",
  "mi_friendly_hero",
  "mi_friendly_reinforcement",
  "mi_enemy_vehicle",
  "sf_gamemode",
  "sf_location",
  "sf_sfavailable",
  "sf_playerteamsize",
  "sf_enemyteamsize",
  "sf_playas",
  "sf_difficulty",
  "sf_recharge",
  "results_text",
  "victory_text",
  "defeat_text",
  "credits_results_player_name",
  "credits_results_player_description",
  "credits_results_player_amounts",
  "credits_results_ai_name",
  "credits_results_ai_description",
  "credits_results_ai_amounts",
  "credits_results_ok_text",
  "republic_text",
  "cis_text",
  "rebel_text",
  "empire_text",
  "resist_text",
  "firstorder_text",
  "zoom_out_text",
  "zoom_in_text",
  "move_mode_text",
  "bonus_mode_text",
  "move_text",
  "help_text",
  "build_text",
  "end_text",
  "buy_text",
  "point_name",
  "point_cost",
  "point_description",
  "credits_team",
  "credits_text",
  "bonus_name",
  "bonus_cost",
  "bonus_description",
  "help_screen_text",
  "help_prev_text",
  "help_ok_text",
  "help_next_text",
  "donate_input",
  "donate_republic_text",
  "donate_cis_text",
  "donate_senate_text",
  "donate_yes_text",
  "donate_no_text",
  "donate_total1_text",
  "donate_total2_text",
  "donate_total_amounts_text",
  "donate_credits_text",
  "bug_report_text"
];

var w4PosSizeElements = [
  "donate_screen_background",
  "donate_input",
  "donate_screen_credits",
  "donate_republic_button",
  "donate_republic_text",
  "donate_republic_logo",
  "donate_cis_button",
  "donate_cis_text",
  "donate_cis_logo",
  "donate_senate_button",
  "donate_senate_text",
  "donate_senate_logo",
  "donate_yes_button",
  "donate_yes_text",
  "donate_no_button",
  "donate_no_text",
  "donate_total1_text",
  "donate_total2_text",
  "donate_total_amounts_text",
  "donate_total1_credits",
  "donate_credits_button",
  "donate_credits_text",
  "donate_credits_logo",
  "credits_results_credits_logo1",
  "credits_results_credits_logo2",
  "credits_results_credits_logo3",
  "credits_results_credits_logo4",
  "credits_results_credits_logo5",
  "credits_results_credits_logo6",
  "point_credits_logo",
  "point_credits_logo1",
  "point_credits_logo2",
  "credits_credits_logo",
  "bonus_credits_logo",
  "version_text",
  "donate_earth_button",
  "autosave_text",
  "restart_button",
  "restart_text",
  "restart_screen_background",
  "restart_screen_text",
  "restart_yes_div",
  "restart_yes_button",
  "restart_yes_text",
  "restart_no_div",
  "restart_no_button",
  "restart_no_text",
  "end_game_img",
  "attack_planet_background",
  "lightFleet_attack",
  "darkFleet_attack",
  "bonus_attack_background",
  "bonus_attack_owned0",
  "bonus_attack_owned1",
  "bonus_attack_owned2",
  "bonus_attack_description_background",
  "bonus_attack_name",
  "bonus_attack_description",
  "skip_button",
  "skip_text",
  "use_button",
  "use_text",
  "bonus_attack_ai_background",
  "bonus_attack_ai_owned",
  "bonus_attack_ai_description_background",
  "bonus_attack_ai_name",
  "bonus_attack_ai_description",
  "attack_settings_img",
  "su_mode",
  "su_location",
  "su_difficulty",
  "su_length",
  "su_points",
  "su_enemy_ai",
  "su_friendly_ai",
  "su_enemy_hero",
  "su_friendly_hero",
  "su_enemy_reinforcement",
  "su_friendly_reinforcement",
  "su_enemy_vehicle",
  "su_friendly_vehicle",
  "su_difficulty_blue",
  "su_points_blue",
  "su_garrison_blue",
  "su_leader_blue",
  "su_sabotage_blue",
  "su_difficulty_red",
  "su_sabotage_red",
  "su_difficulty_blue_img",
  "su_points_blue_img",
  "su_garrison_blue_img",
  "su_leader_blue_img",
  "su_sabotage_blue_img",
  "su_difficulty_red_img",
  "su_sabotage_red_img",
  "mi_mode",
  "mi_location",
  "mi_difficulty",
  "mi_points",
  "mi_friendly_hero",
  "mi_friendly_reinforcement",
  "mi_enemy_vehicle",
  "mi_difficulty_blue",
  "mi_points_blue",
  "mi_leader_blue",
  "mi_garrison_blue",
  "mi_sabotage_blue",
  "mi_difficulty_red",
  "mi_sabotage_red",
  "mi_difficulty_blue_img",
  "mi_points_blue_img",
  "mi_leader_blue_img",
  "mi_garrison_blue_img",
  "mi_sabotage_blue_img",
  "mi_difficulty_red_img",
  "mi_sabotage_red_img",
  "sf_gamemode",
  "sf_location",
  "sf_sfavailable",
  "sf_playerteamsize",
  "sf_enemyteamsize",
  "sf_playas",
  "sf_difficulty",
  "sf_recharge",
  "sf_sfavailable_blue",
  "sf_enemysize_blue",
  "sf_playas_blue",
  "sf_difficulty_blue",
  "sf_recharge_blue",
  "sf_difficulty_red",
  "sf_recharge_red",
  "sf_sfavailable_blue_img",
  "sf_enemysize_blue_img",
  "sf_playas_blue_img",
  "sf_difficulty_blue_img",
  "sf_recharge_blue_img",
  "sf_difficulty_red_img",
  "sf_recharge_red_img",
  "results_text",
  "victory_button",
  "victory_text",
  "defeat_button",
  "defeat_text",
  "credits_results_background",
  "credits_results_player_name",
  "credits_results_player_description",
  "credits_results_player_amounts",
  "credits_results_ai_background",
  "credits_results_ai_name",
  "credits_results_ai_description",
  "credits_results_ai_amounts",
  "credits_results_ok_button",
  "credits_results_ok_text",
  "team_background",
  "republic_button",
  "republic_text",
  "republic_logo",
  "cis_button",
  "cis_text",
  "cis_logo",
  "rebel_button",
  "rebel_text",
  "rebel_logo",
  "empire_button",
  "empire_text",
  "empire_logo",
  "resist_button",
  "resist_text",
  "resist_logo",
  "firstorder_button",
  "firstorder_text",
  "firstorder_logo",
  "zoom_out_button",
  "zoom_out_text",
  "zoom_in_button",
  "zoom_in_text",
  "move_mode_button",
  "move_mode_text",
  "bonus_mode_button",
  "bonus_mode_text",
  "move_button",
  "move_text",
  "help_button",
  "help_text",
  "build_button",
  "build_text",
  "end_button",
  "end_text",
  "buy_button",
  "buy_text",
  "point_description_background",
  "point_name",
  "point_cost",
  "point_description",
  "credits_team",
  "credits_logo",
  "credits_text",
  "bonus_owned0",
  "bonus_owned1",
  "bonus_owned2",
  "bonus0_img",
  "bonus1_img",
  "bonus2_img",
  "bonus3_img",
  "bonus4_img",
  "bonus_description_background",
  "bonus_name",
  "bonus_cost",
  "bonus_description",
  "help_screen_background",
  "help_screen_text",
  "help_prev_button",
  "help_prev_text",
  "help_ok_button",
  "help_ok_text",
  "help_next_button",
  "help_next_text",
  "lightFleet0",
  "lightFleet1",
  "lightFleet2",
  "lightFleet3",
  "lightFleet4",
  "lightFleet5",
  "lightFleet6",
  "lightFleet7",
  "lightFleet8",
  "lightFleet9",
  "lightFleet10",
  "lightFleet11",
  "lightFleet12",
  "lightFleet13",
  "lightFleet14",
  "lightFleet15",
  "lightFleet16",
  "lightFleet17",
  "lightFleet18",
  "lightFleet19",
  "lightFleet20",
  "lightFleet21",
  "lightFleet22",
  "lightFleet23",
  "lightFleet24",
  "lightFleet25",
  "darkFleet0",
  "darkFleet1",
  "darkFleet2",
  "darkFleet3",
  "darkFleet4",
  "darkFleet5",
  "darkFleet6",
  "darkFleet7",
  "darkFleet8",
  "darkFleet9",
  "darkFleet10",
  "darkFleet11",
  "darkFleet12",
  "darkFleet13",
  "darkFleet14",
  "darkFleet15",
  "darkFleet16",
  "darkFleet17",
  "darkFleet18",
  "darkFleet19",
  "darkFleet20",
  "darkFleet21",
  "darkFleet22",
  "darkFleet23",
  "darkFleet24",
  "darkFleet25",
  "light_home",
  "dark_home",
  "felucia",
  "geonosis",
  "kamino",
  "kashyyyk",
  "naboo",
  "loop_felucia",
  "loop_geonosis",
  "loop_kamino",
  "loop_kashyyyk",
  "loop_naboo",
  "yavin4",
  "tatooine",
  "scarif",
  "hoth",
  "deathstar2",
  "kessel",
  "endor",
  "loop_yavin4",
  "loop_tatooine",
  "loop_scarif",
  "loop_hoth",
  "loop_deathstar2",
  "loop_kessel",
  "loop_endor",
  "ajankloss",
  "takodana",
  "jakku",
  "starkillerbase",
  "loop_ajankloss",
  "loop_takodana",
  "loop_jakku",
  "loop_starkillerbase",
  "point1",
  "point2",
  "point3",
  "point4",
  "point5",
  "point6",
  "point7",
  "point8",
  "point9",
  "point10",
  "point11",
  "point12",
  "point13",
  "point14",
  "point15",
  "point16",
  "point17",
  "point18",
  "point19",
  "point20",
  "point21",
  "point22",
  "point23",
  "loop_point1",
  "loop_point2",
  "loop_point3",
  "loop_point4",
  "loop_point5",
  "loop_point6",
  "loop_point7",
  "loop_point8",
  "loop_point9",
  "loop_point10",
  "loop_point11",
  "loop_point12",
  "loop_point13",
  "loop_point14",
  "loop_point15",
  "loop_point16",
  "loop_point17",
  "loop_point18",
  "loop_point19",
  "loop_point20",
  "loop_point21",
  "loop_point22",
  "loop_point23",
  "point2_point1",
  "point2_point18",
  "point3_point18",
  "point3_point19",
  "point19_point17",
  "point22_point17",
  "point18_point22",
  "point4_point22",
  "point22_point7",
  "point17_point21",
  "point7_point21",
  "point21_point5",
  "point5_point20",
  "point6_point20",
  "point7_point12",
  "point12_point6",
  "point12_point9",
  "point6_point8",
  "point4_point12",
  "point2_point4",
  "point1_point4",
  "point9_point8",
  "point16_point9",
  "point10_point8",
  "point16_point10",
  "point14_point16",
  "point11_point10",
  "point14_point11",
  "point11_point23",
  "point13_point23",
  "point13_point14",
  "point15_point13",
  "point1_point15",
  "galaxy",
  "space_background",
  "bonus_owned_background",
  "sound_button",
  "sound_image",
  "bug_report_text"
];

var galaxyRot = 0;
var loopSize = 0.2;
var loopOpacity = 1.8;
var animationSpeed = 1000 / 60;
var wipeAnimation = 0;

let na = 0;
let republic = 1;
let cis = 2;
let rebel = 3;
let empire = 4;
let resist = 5;
let firstorder = 6;
let senate = 7;

let point1 = 1;
let point2 = 2;
let point3 = 3;
let point4 = 4;
let point5 = 5;
let point6 = 6;
let point7 = 7;
let point8 = 8;
let point9 = 9;
let point10 = 10;
let point11 = 11;
let point12 = 12;
let point13 = 13;
let point14 = 14;
let point15 = 15;
let point16 = 16;
let point17 = 17;
let point18 = 18;
let point19 = 19;
let point20 = 20;
let point21 = 21;
let point22 = 22;
let point23 = 23;

let ajankloss = 8;
let takodana = 9;
let jakku = 10;
let starkillerbase = 3; //Moved to allow both ships to always spawn on empty points

let yavin4 = 12;
let tatooine = 13;
let scarif = 14;
let hoth = 15;
let deathstar2 = 16;
let kessel = 17;
let endor = 18;

let felucia = 19;
let geonosis = 20;
let kamino = 21;
let kashyyyk = 22;
let naboo = 23;

let republic_home = kamino;
let cis_home = geonosis;

let rebel_home = yavin4;
let empire_home = deathstar2;

let resist_home = ajankloss;
let firstorder_home = starkillerbase;

let num_neutral_points = 18;
let NUM_POINTS = 23;

let ERA_PLANETS = [
  [],
  [felucia, geonosis, kamino, kashyyyk, naboo],
  [felucia, geonosis, kamino, kashyyyk, naboo],
  [yavin4, tatooine, scarif, hoth, deathstar2, kessel, endor],
  [yavin4, tatooine, scarif, hoth, deathstar2, kessel, endor],
  [ajankloss, takodana, jakku, starkillerbase],
  [ajankloss, takodana, jakku, starkillerbase]
];

//Player
var supplies = 1;
var garrison = 2;
var sabotage = 3;
var communications_jammer = 4;
var leader = 5;
//AI
var ai_sabotage = 6;
var ai_increase_difficulty = 7;
var bonusCreditCosts = [200, 200, 600, 700, 800, 400, 600];

var pointPosX = new Map();
var pointPosY = new Map();
var sizePosYDivider = 1000;
var lightStartPoint = point1;
var darkStartPoint = point11;

//23 Points
var point_index_to_string =
  ["na",
    "point1",
    "point2",
    "point3",
    "point4",
    "point5",
    "point6",
    "point7",
    "point8",
    "point9",
    "point10",
    "point11",
    "point12",
    "point13",
    "point14",
    "point15",
    "point16",
    "point17",
    "point18",
    "point19",
    "point20",
    "point21",
    "point22",
    "point23"];

var planetName_index_to_string = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
planetName_index_to_string[geonosis] = "Geonosis";
planetName_index_to_string[naboo] = "Naboo";
planetName_index_to_string[kamino] = "Kamino";
planetName_index_to_string[kashyyyk] = "Kashyyyk";
planetName_index_to_string[felucia] = "Felucia";
planetName_index_to_string[yavin4] = "Yavin IV";
planetName_index_to_string[tatooine] = "Tatooine";
planetName_index_to_string[scarif] = "Scarif";
planetName_index_to_string[hoth] = "Hoth";
planetName_index_to_string[deathstar2] = "Death Star II";
planetName_index_to_string[kessel] = "Kessel";
planetName_index_to_string[endor] = "Endor";
planetName_index_to_string[ajankloss] = "Ajan Kloss";
planetName_index_to_string[takodana] = "Takodana";
planetName_index_to_string[jakku] = "Jakku";
planetName_index_to_string[starkillerbase] = "Starkiller Base";

var planet_index_to_string = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
planet_index_to_string[geonosis] = "geonosis";
planet_index_to_string[naboo] = "naboo";
planet_index_to_string[kamino] = "kamino";
planet_index_to_string[kashyyyk] = "kashyyyk";
planet_index_to_string[felucia] = "felucia";
planet_index_to_string[yavin4] = "yavin4";
planet_index_to_string[tatooine] = "tatooine";
planet_index_to_string[scarif] = "scarif";
planet_index_to_string[hoth] = "hoth";
planet_index_to_string[deathstar2] = "deathstar2";
planet_index_to_string[kessel] = "kessel";
planet_index_to_string[endor] = "endor";
planet_index_to_string[ajankloss] = "ajankloss";
planet_index_to_string[takodana] = "takodana";
planet_index_to_string[jakku] = "jakku";
planet_index_to_string[starkillerbase] = "starkillerbase";
//33 Point Pairs
var pointPairs = [
  [point2, point1],
  [point2, point18],
  [point3, point18],
  [point3, point19],
  [point19, point17],
  [point22, point17],
  [point18, point22],
  [point4, point22],
  [point22, point7],
  [point17, point21],
  [point7, point21],
  [point21, point5],
  [point5, point20],
  [point6, point20],
  [point7, point12],
  [point12, point6],
  [point12, point9],
  [point6, point8],
  [point4, point12],
  [point2, point4],
  [point1, point4],
  [point9, point8],
  [point16, point9],
  [point10, point8],
  [point16, point10],
  [point14, point16],
  [point11, point10],
  [point14, point11],
  [point11, point23],
  [point13, point23],
  [point13, point14],
  [point15, point13],
  [point1, point15]];

var pointMap = new Map();

var planetVictoryResources = new Map();
var planetBonuses = new Map();

var bonusSelectPos = [0, 1, 2, 3, 4];
var bonusWidth = [200, 200, 200, 200, 200];
var bonusScale = [1, 1, 1, 1, 1];
var targetSelectPos = 0; //Target for first image
var bonusAnimationRunning = false;
var selectedBonus = 0;
let bonusNames = ["Supplies", "Garrison", "Sabotage", "Communications Jammer", "Leader"];
var bonusDescriptions = [
  "Ground Combat: Increases the rate at which you gain battle points<br>Starfighters: Increases the rate at which your abilities recharge",
  "Ground Combat: Increases friendly unit count<br>Starfighters: Increases starfighters available",
  "Ground Combat: Decrease enemy vehicle count<br>Starfighters: Decrease enemy team size",
  "Reduce enemy difficulty",
  "Ground Combat: Leader assists on the battlefield<br>Starfighters: Leader assists in their starfighter",
  "Ground Combat: Decreases the rate at which you gain battle points<br>Starfighters: Decreases the rate at which your abilities recharge",
  "Increases enemy difficulty"
];

var bonusDescriptionsGround = [
  "Increases the rate at which you gain battle points",
  "Increases friendly unit count",
  "Decrease enemy vehicle count",
  "Reduce enemy difficulty",
  "Leader assists on the battlefield",
  "Decreases the rate at which you gain battle points",
  "Increases enemy difficulty"
];

var bonusDescriptionsStarfighters = [
  "Increases the rate at which your abilities recharge",
  "Increases starfighters available",
  "Decrease enemy team size",
  "Reduce enemy difficulty",
  "Leader assists in their starfighter",
  "Decreases the rate at which your abilities recharge",
  "Increases enemy difficulty"
];


var src0a = "galactic_conquest/supplies.gif";
var src1a = "galactic_conquest/garrison.gif";
var src2a = "galactic_conquest/seismic_charge.gif";
var src3a = "galactic_conquest/shield_generator.gif";
var src4a = "galactic_conquest/leader.gif";

var help_page = 0;  //                                                                                                              <br>                                                 <br>                                                         <br>                                                          <br>                          
var help_galaxy_view_content = ["Galactic Conquest<br>&nbsp&nbsp&nbsp(1/7) ><br>The goal of Galactic Conquest is to construct fleets<br>and navigate them through space as you attempt to<br>conquer the galaxy, one planet at a time.",
  "Navigating the Galaxy<br>< (2/7) ><br>Use your arrow keys or swipe your screen to navigate<br>around the galaxy. The [+] and [-] buttons in the top<br>left corner will zoom in and out, giving you close-up<br>views of individual worlds or an all-encompassing<br>galactic view for strategic planning.",
  "Planet Ownership<br>< (3/7) ><br>Blue stars represent planets under your control, while<br>red represents planets under enemy control. Smaller<br>white spots are always neutral and represent points in<br>space that can be used to travel between worlds.",
  "Moving Fleets<br>< (4/7) ><br>Select a fleet with a press. When a fleet is selected,<br>a dashed line will indicate its plotted course. Change<br>the direction with your mouse and confirm the move by<br>clicking the [Move] button.",
  "Constructing Fleets<br>< (5/7) ><br>Fleets can be constructed on planets you own by selecting<br>the unoccupied planet and pressing [Build]. The <br>first fleet is always free, but the price will increase<br>as more are deployed. A fleet must be moved from a<br>planet before another can be constructed.",
  "Earning Credits<br>< (6/7) ><br>Credits are awarded to each side after battle. Planetary<br>battles are worth more than space, the amount varying<br>by planet. Credits are also awarded after planetary<br>battles based on how many planets you own.",
  "Upgrades<br>< (7/7)&nbsp&nbsp&nbsp<br>Credits can be used to build additonal fleets and purchase<br>bonuses. Before moving, try accessing these options<br>by pressing their corresponding buttons."];

var help_bonus_view_content = ["Bonuses<br>&nbsp&nbsp&nbsp(1/3) ><br>Bonuses are inexpensive, but expire after a single use.<br>Up to three of any type can be stored for use, but only<br>one can be used per battle. Browse bonuses by pressing<br>the left and right of the centered bonus, and purchase<br>by pressing [Buy].",
  "Purchasing Bonuses<br>< (2/3) ><br>After choosing a bonus, apply it to one of the three<br>slots by pressing the desired slot. Applying a new<br>bonus to an occupied slot will overwrite the original bonus.",
  "Using Bonuses<br>< (3/3)&nbsp&nbsp&nbsp<br>Effects and costs of bonuses vary. Learn the best combat<br>situations in which to use each bonus type, and try to<br>keep multiple bonuses in your posession for use under<br>unexpected circumstances."];
//States
var state_team_select = 1;
var state_galaxy_view = 2;
var state_bonus_view = 3;
var state_ai_moving = 4;
var state_attack_planet = 5;
var state_end_game = 6;
//Sub States
var sub_buying = 7;
var sub_attack = 8;
var sub_attack_bonus = 13;
var sub_show_ai_bonus = 14;
var sub_attack_settings = 15;
var sub_credits_results = 16;

//Saves
var version = 1.5;
var variableVersion = 2; //Change this when new variables are added to reset cookies
var team = republic; //OR cis
var ai_team = cis;
var state = state_team_select; //state_team_select
var sub_state = sub_credits_results;
var planetOwners = [na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na];
var selectedPlanet = geonosis;
var attackingPlanet = geonosis;
var selectedLoopId = "#loop_point1"
var darkPlanets = [na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na];
var selectedDarkFleet = [geonosis, "darkFleet0"];
var lightPlanets = [na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na];
var selectedLightFleet = [kamino, "lightFleet0"];
var credits = startingCredits;
var ai_credits = startingCredits;
var fleet_cost = 1000;
var ai_fleet_cost = 1000;
var ai_bonus = na;
var player_bonus = na;
var hasMovedThisTurn = false;
var canMove = false;
var owned_bonuses = [[na, "galactic_conquest/bonus_background.png"], [na, "galactic_conquest/bonus_background.png"], [na, "galactic_conquest/bonus_background.png"]];
var selected_attack_bonus = na;
var buy_needs_confirmation = false;
var wasVictory = false;
var playerPlanetaryBonus = 0;
var aiPlanetaryBonus = 0;
var playerVictoryBonus = 0;
var aiVictoryBonus = 0;
var ai_destination = na;
var foundRoutes = []; //[[num_traversals, first], ... ]
var ai_selectedFleet = na;
var wipeToPlanetAnimationRunning = false;
var wipeToGalaxyAnimationRunning = false;
var ai_moving_animation1_running = false;
var ai_moving_animation2_running = false;
var loadAttackBonusAnimationRunning = false;
var ai_building_animation_running = false;
var loadVictoryDefeatAnimationRunning = false;
var showAIBonusAnimationRunning = false;
var spaceBattle = false;
var zoom_level = 1;

function onLoadCheck() {
  document.getElementById("version_text").innerHTML = "Version " + version;

  pointPosX.set(point1, 1207);
  pointPosX.set(point2, 1496);
  pointPosX.set(point3, 1852);
  pointPosX.set(point4, 1514);
  pointPosX.set(point5, 2010);
  pointPosX.set(point6, 1468);
  pointPosX.set(point7, 1748);
  pointPosX.set(point8, 1267);
  pointPosX.set(point9, 1206);
  pointPosX.set(point10, 876);
  pointPosX.set(point11, 757);
  pointPosX.set(point12, 1478);
  pointPosX.set(point13, 702);
  pointPosX.set(point14, 933);
  pointPosX.set(point15, 1019);
  pointPosX.set(point16, 1028);
  pointPosX.set(point17, 1900);
  pointPosX.set(point18, 1723);
  pointPosX.set(felucia, 1985);
  pointPosX.set(geonosis, 1667);
  pointPosX.set(kamino, 1995);
  pointPosX.set(kashyyyk, 1789);
  pointPosX.set(naboo, 544);

  pointPosY.set(point1, 671);
  pointPosY.set(point2, 615);
  pointPosY.set(point3, 648);
  pointPosY.set(point4, 738);
  pointPosY.set(point5, 993);
  pointPosY.set(point6, 997);
  pointPosY.set(point7, 861);
  pointPosY.set(point8, 1096);
  pointPosY.set(point9, 954);
  pointPosY.set(point10, 1017);
  pointPosY.set(point11, 931);
  pointPosY.set(point12, 863);
  pointPosY.set(point13, 788);
  pointPosY.set(point14, 871);
  pointPosY.set(point15, 684);
  pointPosY.set(point16, 938);
  pointPosY.set(point17, 785);
  pointPosY.set(point18, 681);
  pointPosY.set(felucia, 725);
  pointPosY.set(geonosis, 1005);
  pointPosY.set(kamino, 866);
  pointPosY.set(kashyyyk, 749);
  pointPosY.set(naboo, 949);

  planetVictoryResources.set(felucia, 500);
  planetVictoryResources.set(geonosis, 1000);
  planetVictoryResources.set(kamino, 1000);
  planetVictoryResources.set(kashyyyk, 500);
  planetVictoryResources.set(naboo, 600);
  planetBonuses.set(felucia, 30);
  planetBonuses.set(geonosis, 100);
  planetBonuses.set(kamino, 100);
  planetBonuses.set(kashyyyk, 30);
  planetBonuses.set(naboo, 30);

  planetVictoryResources.set(yavin4, 1000);
  planetVictoryResources.set(tatooine, 500);
  planetVictoryResources.set(scarif, 500);
  planetVictoryResources.set(hoth, 500);
  planetVictoryResources.set(deathstar2, 1000);
  planetVictoryResources.set(kessel, 600);
  planetVictoryResources.set(endor, 500);
  planetBonuses.set(yavin4, 100);
  planetBonuses.set(tatooine, 30);
  planetBonuses.set(scarif, 30);
  planetBonuses.set(hoth, 30);
  planetBonuses.set(deathstar2, 100);
  planetBonuses.set(kessel, 30);
  planetBonuses.set(endor, 30);

  planetVictoryResources.set(ajankloss, 1000);
  planetVictoryResources.set(takodana, 600);
  planetVictoryResources.set(jakku, 500);
  planetVictoryResources.set(starkillerbase, 1000);
  planetBonuses.set(ajankloss, 100);
  planetBonuses.set(takodana, 30);
  planetBonuses.set(jakku, 30);
  planetBonuses.set(starkillerbase, 100);

  pointMap.set(felucia, [point3, point17]);
  pointMap.set(geonosis, [point5, point6]);
  pointMap.set(kamino, [point5, point7, point17]);
  pointMap.set(kashyyyk, [point4, point7, point17, point18]);
  pointMap.set(point12, [point4, point6, point7, point9]);
  pointMap.set(point1, [point2, point4, point15]);
  pointMap.set(point2, [point1, point4, point18]);
  pointMap.set(point3, [felucia, point18]);
  pointMap.set(point4, [kashyyyk, point12, point1, point2]);
  pointMap.set(point5, [geonosis, kamino]);
  pointMap.set(point6, [geonosis, point12, point8]);
  pointMap.set(point7, [kamino, kashyyyk, point12]);
  pointMap.set(point8, [point6, point9, point10]);
  pointMap.set(point9, [point12, point8, point16]);
  pointMap.set(point10, [point8, point11, point16]);
  pointMap.set(point11, [point10, naboo, point14]);
  pointMap.set(naboo, [point11, point13]);
  pointMap.set(point13, [naboo, point14, point15]);
  pointMap.set(point14, [point11, point13, point16]);
  pointMap.set(point15, [point1, point13]);
  pointMap.set(point16, [point9, point10, point14]);
  pointMap.set(point17, [felucia, kamino, kashyyyk]);
  pointMap.set(point18, [kashyyyk, point2, point3]);

  for (i = 1; i <= NUM_POINTS; ++i) {
    var ele = document.getElementById(point_index_to_string[i]);
    ele.style.left = pointPosX.get(i) + "px";
    ele.style.top = pointPosY.get(i) + "px";
    ele = document.getElementById("loop_" + point_index_to_string[i]);
    ele.style.left = pointPosX.get(i) + "px";
    ele.style.top = pointPosY.get(i) + "px";

    var ele = document.getElementById(planet_index_to_string[i]);
    if (ele != null) {
      ele.style.left = pointPosX.get(i) + "px";
      ele.style.top = pointPosY.get(i) + "px";
      ele = document.getElementById("loop_" + planet_index_to_string[i]);
      ele.style.left = pointPosX.get(i) + "px";
      ele.style.top = pointPosY.get(i) + "px";
    }
  }

  hideAllLoops();
  bonus_select(-2);
  for (var i = 0; i < w4PosSizeElements.length; ++i) {
    var name = w4PosSizeElements[i];
    var left2 = document.getElementById(name).style.left;
    left2 = Number(left2.substring(0, left2.length - 2));
    var top2 = document.getElementById(name).style.top;
    top2 = Number(top2.substring(0, top2.length - 2));

    var width2 = document.getElementById(name).style.width;
    width2 = Number(width2.substring(0, width2.length - 2));
    var height2 = document.getElementById(name).style.height;
    height2 = Number(height2.substring(0, height2.length - 2));

    w4PosMap.set(name, [left2, top2]);
    w4SizeMap.set(name, [width2, height2]);
  }
  for (i = 0; i < w4FontElements.length; ++i) {
    var name = w4FontElements[i];
    var font2 = document.getElementById(name).style.fontSize;
    font2 = Number(font2.substring(0, font2.length - 2));

    w4FontMap.set(name, font2);
  }
  setZoomSizes();

  //Generate lines
  i = 0;
  for (i = 0; i < 33; ++i) {
    var size0 = (pointPosY.get(pointPairs[i][0]) / sizePosYDivider) * 100;
    var halfsize0 = size0 / 2;
    var size1 = (pointPosY.get(pointPairs[i][1]) / sizePosYDivider) * 100;
    var halfsize1 = size1 / 2;
    document.getElementById(point_index_to_string[pointPairs[i][0]]).style.width = (size0 * zoom_level) + "px";
    document.getElementById(point_index_to_string[pointPairs[i][0]]).style.height = (size0 * zoom_level) + "px";
    document.getElementById(point_index_to_string[pointPairs[i][1]]).style.width = (size1 * zoom_level) + "px";
    document.getElementById(point_index_to_string[pointPairs[i][1]]).style.height = (size1 * zoom_level) + "px";
    w4SizeMap.set(point_index_to_string[pointPairs[i][0]], [size0, size0]);
    w4SizeMap.set(point_index_to_string[pointPairs[i][1]], [size1, size1]);

    if (document.getElementById(planet_index_to_string[pointPairs[i][0]]) != null) {
      document.getElementById(planet_index_to_string[pointPairs[i][0]]).style.width = (size0 * zoom_level) + "px";
      document.getElementById(planet_index_to_string[pointPairs[i][0]]).style.height = (size0 * zoom_level) + "px";
      w4SizeMap.set(planet_index_to_string[pointPairs[i][0]], [size0, size0]);
    }
    if (document.getElementById(planet_index_to_string[pointPairs[i][1]]) != null) {
      document.getElementById(planet_index_to_string[pointPairs[i][1]]).style.width = (size1 * zoom_level) + "px";
      document.getElementById(planet_index_to_string[pointPairs[i][1]]).style.height = (size1 * zoom_level) + "px";
      w4SizeMap.set(planet_index_to_string[pointPairs[i][1]], [size1, size1]);
    }

    document.getElementById("loop_" + point_index_to_string[pointPairs[i][0]]).style.width = (size0 * zoom_level) + "px";
    document.getElementById("loop_" + point_index_to_string[pointPairs[i][0]]).style.height = (size0 * zoom_level) + "px";
    document.getElementById("loop_" + point_index_to_string[pointPairs[i][1]]).style.width = (size1 * zoom_level) + "px";
    document.getElementById("loop_" + point_index_to_string[pointPairs[i][1]]).style.height = (size1 * zoom_level) + "px";
    w4SizeMap.set("loop_" + point_index_to_string[pointPairs[i][0]], [size0, size0]);
    w4SizeMap.set("loop_" + point_index_to_string[pointPairs[i][1]], [size1, size1]);

    if (document.getElementById("loop_" + planet_index_to_string[pointPairs[i][0]]) != null) {
      document.getElementById("loop_" + planet_index_to_string[pointPairs[i][0]]).style.width = (size0 * zoom_level) + "px";
      document.getElementById("loop_" + planet_index_to_string[pointPairs[i][0]]).style.height = (size0 * zoom_level) + "px";
      w4SizeMap.set("loop_" + planet_index_to_string[pointPairs[i][0]], [size0, size0]);
    }
    if (document.getElementById("loop_" + planet_index_to_string[pointPairs[i][1]]) != null) {
      document.getElementById("loop_" + planet_index_to_string[pointPairs[i][1]]).style.width = (size1 * zoom_level) + "px";
      document.getElementById("loop_" + planet_index_to_string[pointPairs[i][1]]).style.height = (size1 * zoom_level) + "px";
      w4SizeMap.set("loop_" + planet_index_to_string[pointPairs[i][1]], [size1, size1]);
    }

    var x0 = pointPosX.get(pointPairs[i][0]) + halfsize0;
    var x1 = pointPosX.get(pointPairs[i][1]) + halfsize1;
    var y0 = pointPosY.get(pointPairs[i][0]) + halfsize0;
    var y1 = pointPosY.get(pointPairs[i][1]) + halfsize1;
    var xdist = x0 - x1;
    var ydist = y0 - y1;
    var dist = Math.floor(Math.sqrt(xdist * xdist + ydist * ydist));
    document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.width = (dist * 2 * zoom_level) + "px";
    document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.height = (3 * zoom_level) + "px";
    w4SizeMap.set(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]], [dist * 2, 3]);
    // document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.left  = ((Math.floor(xdist/2) + x1) * zoom_level) + "px";
    // document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.top   = ((Math.floor(ydist/2) + y1) * zoom_level) + "px";
    document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.left = ((x1 - dist) * zoom_level) + "px";
    document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.top = (y1 * zoom_level) + "px";
    w4PosMap.set(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]], [x1 - dist, y1]);
    // document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.transform = "translateX(" + dist/-2 + "px) rotate(" + ((Math.atan(xdist/ydist) * (-180/Math.PI)) - 90) + "deg)";
    document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.transform = "rotate(" + ((Math.atan(xdist / ydist) * (-180 / Math.PI)) - 90) + "deg)";

  }

  darkPlanets[0] = getShipStartPoint(cis);
  lightPlanets[0] = getShipStartPoint(republic);
  selectedDarkFleet[0] = darkPlanets[0];
  selectedLightFleet[0] = lightPlanets[0];
  setElements();
  loadState();
  initializeFireBase();
}

function setZoomSizes() {
  var i = 0;
  for (i = 0; i < w4PosSizeElements.length; ++i) {
    var name = w4PosSizeElements[i];
    var pos = w4PosMap.get(name);
    var size = w4SizeMap.get(name);
    document.getElementById(name).style.left = (pos[0] * zoom_level) + "px";
    document.getElementById(name).style.top = (pos[1] * zoom_level) + "px";
    document.getElementById(name).style.width = (size[0] * zoom_level) + "px";
    document.getElementById(name).style.height = (size[1] * zoom_level) + "px";
    document.getElementById(name).style.clip = "";
  }

  for (i = 0; i < w4FontElements.length; ++i) {
    var name = w4FontElements[i];
    var font = w4FontMap.get(name);
    document.getElementById(name).style.fontSize = (font * zoom_level) + "px";
  }
}
// function getRandomPoint(){
//   var num = Math.floor(Math.random() * points.length);
//   if(num == points.length)
//      --num;
//   return points[num];
// }

function getShipStartPoint(team2) {
  if (isTeamLight(team2)) {
    if (doesArrayInclude(darkPlanets, lightStartPoint)) {
      var i = 1;
      for (i = 1; i < NUM_POINTS; ++i) {
        if (!doesArrayInclude(darkPlanets, i)) {
          return i;
        }
      }
    }
    return lightStartPoint;
  }
  else {
    if (doesArrayInclude(lightPlanets, darkStartPoint)) {
      var i = 1;
      for (i = 1; i < NUM_POINTS; ++i) {
        if (!doesArrayInclude(lightPlanets, i)) {
          return i;
        }
      }
    }
    return darkStartPoint;
  }
}


$(document).ready(function () {

  function galaxy_Rotate_Anim() {
    $("#galaxy").css("transform", "scaleX(1.5) scaleY(.6) rotate(" + galaxyRot + "deg)");
    galaxyRot -= 0.05;
    if (galaxyRot < -1080)
      galaxyRot = -0.05;
    setTimeout(function () {
      galaxy_Rotate_Anim();
    }, animationSpeed);
  }

  function selectedPlanetLoop() {
    $(selectedLoopId).css("transform", "scaleX(" + loopSize + ") scaleY(" + loopSize + ")");
    $(selectedLoopId).css("opacity", loopOpacity);
    loopSize += 0.01;
    loopOpacity -= 0.02;
    if (loopSize > 1) {
      loopSize = 0.2;
      loopOpacity = 1.8;
    }
    setTimeout(function () {
      selectedPlanetLoop();
    }, animationSpeed);
  }

  selectedPlanetLoop();
  galaxy_Rotate_Anim();

});

function setElements() {

  //Set fleet sprite positions
  //Light
  var offX, offY;
  switch (team) {
    case republic:
    case cis:
      offX = 30;
      offY = -20;
      break;
    case rebel:
    case empire:
      offX = 30;
      offY = -20;
      break;
    case resist:
    case firstorder:
      offX = -60;
      offY = -20;
      break;
  }
  for (var i = 0; i < lightPlanets.length; ++i) {
    document.getElementById("lightFleet" + i).style.display = "none";
    if (lightPlanets[i] != na) {
      var venator = document.getElementById("lightFleet" + i);
      var x = pointPosX.get(lightPlanets[i]);
      var y = pointPosY.get(lightPlanets[i]);
      var size = Math.floor((y * 150) / sizePosYDivider);
      venator.style.left = ((x + offX) * zoom_level) + "px";
      venator.style.top = ((y + offY) * zoom_level) + "px";
      w4PosMap.set("lightFleet" + i, [x + offX, y + offY]);
      venator.style.height = (size * zoom_level) + "px";
      venator.style.width = (size * zoom_level) + "px";
      w4SizeMap.set("lightFleet" + i, [size, size]);
      venator.style.zIndex = y;
      venator.style.display = "block";
    }
  }
  //Dark
  switch (team) {
    case republic:
    case cis:
      offX = -40;
      offY = -30;
      break;
    case rebel:
    case empire:
      offX = -110;
      offY = -70;
      break;
    case resist:
    case firstorder:
      offX = 20;
      offY = -50;
      break;
  }
  for (var i = 0; i < darkPlanets.length; ++i) {
    document.getElementById("darkFleet" + i).style.display = "none";
    if (darkPlanets[i] != na) {
      var dread = document.getElementById("darkFleet" + i);
      x = pointPosX.get(darkPlanets[i]);
      y = pointPosY.get(darkPlanets[i]);
      size = Math.floor((y * 200) / sizePosYDivider);
      dread.style.left = ((x + offX) * zoom_level) + "px";
      dread.style.top = ((y + offY) * zoom_level) + "px";
      w4PosMap.set("darkFleet" + i, [x + offX, y + offY]);
      dread.style.height = (size * zoom_level) + "px";
      dread.style.width = (size * zoom_level) + "px";
      w4SizeMap.set("darkFleet" + i, [size, size]);
      dread.style.zIndex = y;
      dread.style.display = "block";
    }
  }

  for (i = 1; i < planetOwners.length; ++i) {
    var planet = i;
    var team2 = planetOwners[i];
    if (team2 != na) {
      if (team2 == team) {
        document.getElementById(planet_index_to_string[planet]).src = "galactic_conquest/blue_planet_idle.png";
        document.getElementById("loop_" + planet_index_to_string[planet]).src = "galactic_conquest/blue_planet_loop.png";
      }
      else {
        document.getElementById(planet_index_to_string[planet]).src = "galactic_conquest/red_planet_idle.png";
        document.getElementById("loop_" + planet_index_to_string[planet]).src = "galactic_conquest/red_planet_loop.png";
      }
    }
  }
  if (doesArrayInclude(ERA_PLANETS[team], selectedPlanet))
    document.getElementById("loop_" + planet_index_to_string[selectedPlanet]).style.display = "block";
  else
    document.getElementById("loop_" + point_index_to_string[selectedPlanet]).style.display = "block";
  setLineStyles(selectedPlanet, selectedPlanet);

  if (state == state_team_select) {
    document.getElementById("galaxy_all").style.display = "block";
    document.getElementById("planet_screen").style.display = "none";
    document.getElementById("team_select").style.display = "block";
    document.getElementById("move_div").style.display = "none";
    document.getElementById("help_div").style.display = "none";
    document.getElementById("build_div").style.display = "none";
    document.getElementById("end_div").style.display = "none";
    document.getElementById("move_mode_div").style.display = "none";
    document.getElementById("bonus_mode_div").style.display = "none";
    document.getElementById("buy_div").style.display = "none";
    document.getElementById("bonus_view_div").style.display = "none";
    document.getElementById("credits_display").style.display = "none";
    document.getElementById("point_description_div").style.display = "none";
    document.getElementById("end_game_div").style.display = "none";
  }
  else if (state == state_galaxy_view) {
    document.getElementById("galaxy_all").style.display = "block";
    document.getElementById("planet_screen").style.display = "none";
    document.getElementById("team_select").style.display = "none";
    if (canMove && !hasMovedThisTurn)
      document.getElementById("move_div").style.display = "block";
    else
      document.getElementById("move_div").style.display = "none";
    document.getElementById("help_div").style.display = "block";
    if (doesArrayInclude(lightPlanets, selectedPlanet) || doesArrayInclude(darkPlanets, selectedPlanet) || planetOwners[selectedPlanet] != team)
      document.getElementById("build_div").style.display = "none";
    else
      document.getElementById("build_div").style.display = "block";
    document.getElementById("end_div").style.display = "block";
    document.getElementById("move_mode_div").style.display = "block";
    document.getElementById("bonus_mode_div").style.display = "block";
    document.getElementById("buy_div").style.display = "none";
    document.getElementById("bonus_view_div").style.display = "none";
    document.getElementById("credits_display").style.display = "block";
    document.getElementById("point_description_div").style.display = "block";

    document.getElementById("move_mode_button").src = "galactic_conquest/button_glow_long.png";
    document.getElementById("move_mode_text").style.color = "#F4AE0A";
    document.getElementById("bonus_mode_button").src = "galactic_conquest/button_grey_long.png";
    document.getElementById("bonus_mode_text").style.color = "#E5E5E5";
    document.getElementById("end_game_div").style.display = "none";
  }
  else if (state == state_bonus_view) {
    document.getElementById("galaxy_all").style.display = "block";
    document.getElementById("planet_screen").style.display = "none";
    document.getElementById("team_select").style.display = "none";
    document.getElementById("move_div").style.display = "none";
    document.getElementById("build_div").style.display = "none";
    document.getElementById("end_div").style.display = "none";
    document.getElementById("bonus_view_div").style.display = "block";
    document.getElementById("credits_display").style.display = "block";
    document.getElementById("point_description_div").style.display = "none";

    document.getElementById("bonus_mode_button").src = "galactic_conquest/button_glow_long.png";
    document.getElementById("bonus_mode_text").style.color = "#F4AE0A";
    document.getElementById("move_mode_button").src = "galactic_conquest/button_grey_long.png";
    document.getElementById("move_mode_text").style.color = "#E5E5E5";
    document.getElementById("end_game_div").style.display = "none";
    if (sub_state == sub_buying) {
      document.getElementById("bonus0_img").style.display = "none";
      document.getElementById("bonus1_img").style.display = "none";
      document.getElementById("bonus2_img").style.display = "none";
      document.getElementById("bonus3_img").style.display = "none";
      document.getElementById("bonus4_img").style.display = "none";
      document.getElementById("buy_div").style.display = "none";
      document.getElementById("help_div").style.display = "none";
      document.getElementById("move_mode_div").style.display = "none";
      document.getElementById("bonus_mode_div").style.display = "none";
      document.getElementById("bonus_name").innerHTML = "";
      document.getElementById("bonus_cost").innerHTML = "";
      document.getElementById("bonus_description").innerHTML = "Select a slot";
      document.getElementById("bonus_credits_logo").style.display = "none";
    }
    else {
      document.getElementById("bonus0_img").style.display = "block";
      document.getElementById("bonus1_img").style.display = "block";
      document.getElementById("bonus2_img").style.display = "block";
      document.getElementById("bonus3_img").style.display = "block";
      document.getElementById("bonus4_img").style.display = "block";
      document.getElementById("buy_div").style.display = "block";
      document.getElementById("help_div").style.display = "block";
      document.getElementById("move_mode_div").style.display = "block";
      document.getElementById("bonus_mode_div").style.display = "block";
      document.getElementById("bonus_credits_logo").style.display = "block";
    }
  }
  else if (state == state_ai_moving) {
    document.getElementById("galaxy_all").style.display = "block";
    document.getElementById("planet_screen").style.display = "none";
    document.getElementById("team_select").style.display = "none";
    document.getElementById("move_div").style.display = "none";
    document.getElementById("help_div").style.display = "none";
    document.getElementById("build_div").style.display = "none";
    document.getElementById("end_div").style.display = "none";
    document.getElementById("move_mode_div").style.display = "none";
    document.getElementById("bonus_mode_div").style.display = "none";
    document.getElementById("buy_div").style.display = "none";
    document.getElementById("bonus_view_div").style.display = "none";
    document.getElementById("credits_display").style.display = "block";
    document.getElementById("point_description_div").style.display = "none";
    document.getElementById("end_game_div").style.display = "none";
  }
  else if (state == state_end_game) {
    document.getElementById("galaxy_all").style.display = "none";
    document.getElementById("planet_screen").style.display = "none";
    document.getElementById("team_select").style.display = "none";
    document.getElementById("move_div").style.display = "none";
    document.getElementById("help_div").style.display = "none";
    document.getElementById("build_div").style.display = "none";
    document.getElementById("end_div").style.display = "none";
    document.getElementById("move_mode_div").style.display = "none";
    document.getElementById("bonus_mode_div").style.display = "none";
    document.getElementById("buy_div").style.display = "none";
    document.getElementById("bonus_view_div").style.display = "none";
    document.getElementById("credits_display").style.display = "none";
    document.getElementById("point_description_div").style.display = "none";
    document.getElementById("end_game_div").style.display = "block";
    switch (team) {
      case republic:
        if (countOwnedPlanets(republic) == 0)
          document.getElementById("end_game_img").src = "galactic_conquest/backgrounds/defeat_republic.jpg";
        if (countOwnedPlanets(cis) == 0)
          document.getElementById("end_game_img").src = "galactic_conquest/backgrounds/victory_republic.jpg";
        break;
      case cis:
        if (countOwnedPlanets(republic) == 0)
          document.getElementById("end_game_img").src = "galactic_conquest/backgrounds/victory_cis.jpg";
        if (countOwnedPlanets(cis) == 0)
          document.getElementById("end_game_img").src = "galactic_conquest/backgrounds/defeat_cis.jpg";
        break;
      case rebel:
        if (countOwnedPlanets(rebel) == 0)
          document.getElementById("end_game_img").src = "galactic_conquest/backgrounds/defeat_rebel.jpg";
        if (countOwnedPlanets(empire) == 0)
          document.getElementById("end_game_img").src = "galactic_conquest/backgrounds/victory_rebel.jpg";
        break;
      case empire:
        if (countOwnedPlanets(rebel) == 0)
          document.getElementById("end_game_img").src = "galactic_conquest/backgrounds/victory_empire.jpg";
        if (countOwnedPlanets(empire) == 0)
          document.getElementById("end_game_img").src = "galactic_conquest/backgrounds/defeat_empire.jpg";
        break;
      case resist:
        if (countOwnedPlanets(resist) == 0)
          document.getElementById("end_game_img").src = "galactic_conquest/backgrounds/defeat_resist.jpg";
        if (countOwnedPlanets(firstorder) == 0)
          document.getElementById("end_game_img").src = "galactic_conquest/backgrounds/victory_resist.jpg";
        break;
      case firstorder:
        if (countOwnedPlanets(resist) == 0)
          document.getElementById("end_game_img").src = "galactic_conquest/backgrounds/victory_firstorder.jpg";
        if (countOwnedPlanets(firstorder) == 0)
          document.getElementById("end_game_img").src = "galactic_conquest/backgrounds/defeat_firstorder.jpg";
        break;
    }
  }
  else if (state == state_attack_planet) {
    document.getElementById("bonus_attack_ai_div").style.display = "none";
    document.getElementById("bonus_attack_div").style.display = "none";
    document.getElementById("attack_settings_div").style.display = "none";
    document.getElementById("credits_results_div").style.display = "none";
    document.getElementById("end_game_div").style.display = "none";

    document.getElementById("planet_screen").style.display = "block";

    if (doesArrayInclude(lightPlanets, attackingPlanet))
      document.getElementById("lightFleet_attack").style.display = "block";
    else
      document.getElementById("lightFleet_attack").style.display = "none";

    if (doesArrayInclude(darkPlanets, attackingPlanet))
      document.getElementById("darkFleet_attack").style.display = "block";
    else
      document.getElementById("darkFleet_attack").style.display = "none";

    if ((team == republic || team == cis) && attackingPlanet == kamino && spaceBattle) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/kamino_space.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/venator_reverse.png";
    }
    else if ((team == rebel || team == empire) && attackingPlanet == endor && spaceBattle) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/endor_space.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/mc80.png";
    }
    else if ((team == resist || team == firstorder) && (attackingPlanet == ajankloss || attackingPlanet == takodana) && spaceBattle) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/dqar.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/mc85.png";
    }
    else if ((team == republic || team == cis) && spaceBattle) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/ryloth.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/venator.png";
    }
    else if ((team == rebel || team == empire) && spaceBattle) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/fondor.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/mc80.png";
    }
    else if ((team == resist || team == firstorder) && spaceBattle) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/unknown_regions.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/mc85.png";
    }
    else if ((team == republic || team == cis) && attackingPlanet == felucia) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/felucia.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/venator_reverse.png";
    }
    else if ((team == republic || team == cis) && attackingPlanet == geonosis) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/geonosis.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/venator.png";
    }
    else if ((team == republic || team == cis) && attackingPlanet == kamino) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/kamino.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/venator_reverse.png";
    }
    else if ((team == republic || team == cis) && attackingPlanet == kashyyyk) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/kashyyyk.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/venator.png";
    }
    else if ((team == republic || team == cis) && attackingPlanet == naboo) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/naboo.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/venator_reverse.png";
    }
    else if ((team == rebel || team == empire) && attackingPlanet == yavin4) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/yavin4.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/mc80.png";
    }
    else if ((team == rebel || team == empire) && attackingPlanet == tatooine) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/tatooine.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/mc80.png";
    }
    else if ((team == rebel || team == empire) && attackingPlanet == scarif) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/scarif.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/mc80.png";
    }
    else if ((team == rebel || team == empire) && attackingPlanet == hoth) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/hoth.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/mc80.png";
    }
    else if ((team == rebel || team == empire) && attackingPlanet == deathstar2) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/deathstar2.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/mc80.png";
    }
    else if ((team == rebel || team == empire) && attackingPlanet == kessel) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/kessel.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/mc80.png";
    }
    else if ((team == rebel || team == empire) && attackingPlanet == endor) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/endor.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/mc80.png";
    }
    else if ((team == resist || team == firstorder) && attackingPlanet == ajankloss) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/ajankloss.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/mc85.png";
    }
    else if ((team == resist || team == firstorder) && attackingPlanet == takodana) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/takodana.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/mc85.png";
    }
    else if ((team == resist || team == firstorder) && attackingPlanet == jakku) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/jakku.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/mc85.png";
    }
    else if ((team == resist || team == firstorder) && attackingPlanet == starkillerbase) {
      document.getElementById("attack_planet_background").src = "galactic_conquest/backgrounds/starkillerbase.jpg";
      document.getElementById("lightFleet_attack").src = "galactic_conquest/mc85.png";
    }

    if (sub_state == sub_attack_bonus) {
      document.getElementById("galaxy_all").style.display = "none";
      document.getElementById("bonus_attack_div").style.display = "block";
      document.getElementById("bonus_attack_ai_div").style.display = "none";
      document.getElementById("attack_settings_div").style.display = "none";
    }
    else if (sub_state == sub_show_ai_bonus) {
      document.getElementById("bonus_attack_div").style.display = "none";
      document.getElementById("bonus_attack_ai_div").style.display = "block";
      document.getElementById("attack_settings_div").style.display = "none";
      if (ai_bonus == ai_increase_difficulty) {
        document.getElementById("bonus_attack_ai_owned").src = "galactic_conquest/shield_generator_border.gif";
        document.getElementById("bonus_attack_ai_name").innerHTML = "Enemy used enhanced communications";
      }
      else {
        document.getElementById("bonus_attack_ai_owned").src = "galactic_conquest/seismic_charge_border.gif";
        document.getElementById("bonus_attack_ai_name").innerHTML = "Enemy used Vehicle Sabotage";
      }
      if (doesArrayInclude(darkPlanets, attackingPlanet) && doesArrayInclude(lightPlanets, attackingPlanet)) {
        document.getElementById("bonus_attack_ai_description").innerHTML = bonusDescriptionsStarfighters[ai_bonus - 1];
      }
      else {
        document.getElementById("bonus_attack_ai_description").innerHTML = bonusDescriptionsGround[ai_bonus - 1];
      }
    }
    else if (sub_state == sub_attack_settings) {
      document.getElementById("victory_div").style.display = "block";
      document.getElementById("defeat_div").style.display = "block";
      document.getElementById("results_text").style.display = "block";

      document.getElementById("sf_gamemode").style.display = "none";
      document.getElementById("sf_location").style.display = "none";
      document.getElementById("sf_sfavailable").style.display = "none";
      document.getElementById("sf_playerteamsize").style.display = "none";
      document.getElementById("sf_enemyteamsize").style.display = "none";
      document.getElementById("sf_playas").style.display = "none";
      document.getElementById("sf_difficulty").style.display = "none";
      document.getElementById("sf_recharge").style.display = "none";
      document.getElementById("sf_sfavailable_blue").style.display = "none";
      document.getElementById("sf_enemysize_blue").style.display = "none";
      document.getElementById("sf_playas_blue").style.display = "none";
      document.getElementById("sf_difficulty_blue").style.display = "none";
      document.getElementById("sf_recharge_blue").style.display = "none";
      document.getElementById("sf_sfavailable_blue_img").style.display = "none";
      document.getElementById("sf_enemysize_blue_img").style.display = "none";
      document.getElementById("sf_playas_blue_img").style.display = "none";
      document.getElementById("sf_difficulty_blue_img").style.display = "none";
      document.getElementById("sf_recharge_blue_img").style.display = "none";
      document.getElementById("sf_difficulty_red").style.display = "none";
      document.getElementById("sf_recharge_red").style.display = "none";
      document.getElementById("sf_difficulty_red_img").style.display = "none";
      document.getElementById("sf_recharge_red_img").style.display = "none";

      document.getElementById("mi_mode").style.display = "none";
      document.getElementById("mi_location").style.display = "none";
      document.getElementById("mi_difficulty").style.display = "none";
      document.getElementById("mi_points").style.display = "none";
      document.getElementById("mi_friendly_hero").style.display = "none";
      document.getElementById("mi_friendly_reinforcement").style.display = "none";
      document.getElementById("mi_enemy_vehicle").style.display = "none";
      document.getElementById("mi_difficulty_blue").style.display = "none";
      document.getElementById("mi_points_blue").style.display = "none";
      document.getElementById("mi_garrison_blue").style.display = "none";
      document.getElementById("mi_leader_blue").style.display = "none";
      document.getElementById("mi_sabotage_blue").style.display = "none";
      document.getElementById("mi_difficulty_blue_img").style.display = "none";
      document.getElementById("mi_points_blue_img").style.display = "none";
      document.getElementById("mi_garrison_blue_img").style.display = "none";
      document.getElementById("mi_leader_blue_img").style.display = "none";
      document.getElementById("mi_sabotage_blue_img").style.display = "none";
      document.getElementById("mi_difficulty_red").style.display = "none";
      document.getElementById("mi_sabotage_red").style.display = "none";
      document.getElementById("mi_difficulty_red_img").style.display = "none";
      document.getElementById("mi_sabotage_red_img").style.display = "none";

      document.getElementById("su_mode").style.display = "none";
      document.getElementById("su_location").style.display = "none";
      document.getElementById("su_difficulty").style.display = "none";
      document.getElementById("su_length").style.display = "none";
      document.getElementById("su_points").style.display = "none";
      document.getElementById("su_enemy_ai").style.display = "none";
      document.getElementById("su_friendly_ai").style.display = "none";
      document.getElementById("su_enemy_hero").style.display = "none";
      document.getElementById("su_friendly_hero").style.display = "none";
      document.getElementById("su_enemy_reinforcement").style.display = "none";
      document.getElementById("su_friendly_reinforcement").style.display = "none";
      document.getElementById("su_enemy_vehicle").style.display = "none";
      document.getElementById("su_friendly_vehicle").style.display = "none";
      document.getElementById("su_difficulty_blue").style.display = "none";
      document.getElementById("su_points_blue").style.display = "none";
      document.getElementById("su_garrison_blue").style.display = "none";
      document.getElementById("su_leader_blue").style.display = "none";
      document.getElementById("su_sabotage_blue").style.display = "none";
      document.getElementById("su_difficulty_blue_img").style.display = "none";
      document.getElementById("su_points_blue_img").style.display = "none";
      document.getElementById("su_garrison_blue_img").style.display = "none";
      document.getElementById("su_leader_blue_img").style.display = "none";
      document.getElementById("su_sabotage_blue_img").style.display = "none";
      document.getElementById("su_difficulty_red").style.display = "none";
      document.getElementById("su_sabotage_red").style.display = "none";
      document.getElementById("su_difficulty_red_img").style.display = "none";
      document.getElementById("su_sabotage_red_img").style.display = "none";

      document.getElementById("bonus_attack_div").style.display = "none";
      document.getElementById("bonus_attack_ai_div").style.display = "none";
      document.getElementById("attack_settings_div").style.display = "block";
      //Starfighters
      if (doesArrayInclude(darkPlanets, attackingPlanet) && doesArrayInclude(lightPlanets, attackingPlanet)) {
        document.getElementById("attack_settings_img").src = "galactic_conquest/starfighter_team_battle.png";
        w4SizeMap.set("attack_settings_img", [1000, 1000]);
        w4PosMap.set("attack_settings_img", [700, 400]);
        setZoomSizes();
        document.getElementById("sf_gamemode").style.display = "block";
        document.getElementById("sf_location").style.display = "block";
        document.getElementById("sf_sfavailable").style.display = "block";
        document.getElementById("sf_playerteamsize").style.display = "block";
        document.getElementById("sf_enemyteamsize").style.display = "block";
        document.getElementById("sf_playas").style.display = "block";
        document.getElementById("sf_difficulty").style.display = "block";
        document.getElementById("sf_recharge").style.display = "block";

        if ((team == republic || team == cis) && attackingPlanet == kamino)
          document.getElementById("sf_location").innerHTML = "KAMINO";
        else if ((team == rebel || team == empire) && attackingPlanet == endor)
          document.getElementById("sf_location").innerHTML = "ENDOR";
        else if ((team == resist || team == firstorder) && (attackingPlanet == ajankloss || attackingPlanet == takodana))
          document.getElementById("sf_location").innerHTML = "D'QAR";
        else if (team == republic || team == cis)
          document.getElementById("sf_location").innerHTML = "RYLOTH";
        else if (team == rebel || team == empire)
          document.getElementById("sf_location").innerHTML = "FONDOR";
        else
          document.getElementById("sf_location").innerHTML = "UNKNOWN REGIONS";


        //SUPPLIES
        document.getElementById("sf_recharge").innerHTML = "DEFAULT";
        if (player_bonus == supplies && ai_bonus != ai_sabotage)
          document.getElementById("sf_recharge").innerHTML = "FAST";
        else if (player_bonus != supplies && ai_bonus == ai_sabotage)
          document.getElementById("sf_recharge").innerHTML = "SLOW";

        //GARRISON
        if (player_bonus == garrison)
          document.getElementById("sf_sfavailable").innerHTML = "150";
        else
          document.getElementById("sf_sfavailable").innerHTML = "100";

        //SABOTAGE
        if (player_bonus == sabotage)
          document.getElementById("sf_enemyteamsize").innerHTML = "8";
        else
          document.getElementById("sf_enemyteamsize").innerHTML = "10";

        //LEADER
        if (player_bonus == leader)
          document.getElementById("sf_playas").innerHTML = "FREE FOR ALL";
        else
          document.getElementById("sf_playas").innerHTML = "STARFIGHTERS ONLY";

        //COMMUNICATIONS_JAMMER
        document.getElementById("sf_difficulty").innerHTML = "NORMAL";
        if (player_bonus == communications_jammer && ai_bonus != ai_increase_difficulty)
          document.getElementById("sf_difficulty").innerHTML = "ROOKIE";
        else if (player_bonus != communications_jammer && ai_bonus == ai_increase_difficulty)
          document.getElementById("sf_difficulty").innerHTML = "EXPERT";


        switch (player_bonus) {
          case supplies:
            document.getElementById("sf_recharge_blue").style.display = "block";
            document.getElementById("sf_recharge_blue_img").style.display = "block";
            break;
          case garrison:
            document.getElementById("sf_sfavailable_blue").style.display = "block";
            document.getElementById("sf_sfavailable_blue_img").style.display = "block";
            break;
          case sabotage:
            document.getElementById("sf_enemysize_blue").style.display = "block";
            document.getElementById("sf_enemysize_blue_img").style.display = "block";
            break;
          case leader:
            document.getElementById("sf_playas_blue").style.display = "block";
            document.getElementById("sf_playas_blue_img").style.display = "block";
            break;
          case communications_jammer:
            document.getElementById("sf_difficulty_blue").style.display = "block";
            document.getElementById("sf_difficulty_blue_img").style.display = "block";
            break;
        }
        switch (ai_bonus) { //CIS AI
          case ai_increase_difficulty:
            document.getElementById("sf_difficulty_red").style.display = "block";
            document.getElementById("sf_difficulty_red_img").style.display = "block";
            break;
          case ai_sabotage:
            document.getElementById("sf_recharge_red").style.display = "block";
            document.getElementById("sf_recharge_red_img").style.display = "block";
            break;
        }

      }
      else { //Ground
        //------------Missions------------
        if (attackingPlanet == kessel || attackingPlanet == endor || attackingPlanet == starkillerbase) {
          document.getElementById("attack_settings_img").src = "galactic_conquest/missions.png";
          w4SizeMap.set("attack_settings_img", [1000, 1000]);
          w4PosMap.set("attack_settings_img", [700, 400]);
          setZoomSizes();
          document.getElementById("mi_mode").style.display = "block";
          document.getElementById("mi_location").style.display = "block";
          document.getElementById("mi_difficulty").style.display = "block";
          document.getElementById("mi_points").style.display = "block";
          document.getElementById("mi_friendly_hero").style.display = "block";
          document.getElementById("mi_friendly_reinforcement").style.display = "block";
          document.getElementById("mi_enemy_vehicle").style.display = "block";
          if ((attackingPlanet == kessel && team == empire)
            || (attackingPlanet == endor && team == empire)
            || (attackingPlanet == starkillerbase && team == firstorder))
            document.getElementById("mi_mode").innerHTML = "MISSIONS (DEFEND)";
          else
            document.getElementById("mi_mode").innerHTML = "MISSIONS (ATTACK)";
          document.getElementById("mi_location").innerHTML = planetName_index_to_string[attackingPlanet].toUpperCase();

          //COMMUNICATIONS JAMMER
          document.getElementById("mi_difficulty").innerHTML = "NORMAL";
          if (player_bonus == communications_jammer && ai_bonus != ai_increase_difficulty)
            document.getElementById("mi_difficulty").innerHTML = "ROOKIE";
          else if (player_bonus != communications_jammer && ai_bonus == ai_increase_difficulty)
            document.getElementById("mi_difficulty").innerHTML = "EXPERT";

          //SUPPLIES
          document.getElementById("mi_points").innerHTML = "DEFAULT";
          if (player_bonus == supplies && ai_bonus != ai_sabotage)
            document.getElementById("mi_points").innerHTML = "FAST";
          else if (player_bonus != supplies && ai_bonus == ai_sabotage)
            document.getElementById("mi_points").innerHTML = "SLOW";

          //GARRISON
          if (player_bonus == garrison)
            document.getElementById("mi_friendly_reinforcement").innerHTML = "10";
          else
            document.getElementById("mi_friendly_reinforcement").innerHTML = "4";

          //LEADER
          if (player_bonus == leader)
            document.getElementById("mi_friendly_hero").innerHTML = "1";
          else
            document.getElementById("mi_friendly_hero").innerHTML = "0";

          //SABOTAGE
          if (player_bonus == sabotage)
            document.getElementById("mi_enemy_vehicle").innerHTML = "OFF";
          else
            document.getElementById("mi_enemy_vehicle").innerHTML = "ON";

          switch (player_bonus) {
            case communications_jammer:
              document.getElementById("mi_difficulty_blue").style.display = "block";
              document.getElementById("mi_difficulty_blue_img").style.display = "block";
              break;
            case supplies:
              document.getElementById("mi_points_blue").style.display = "block";
              document.getElementById("mi_points_blue_img").style.display = "block";
              break;
            case garrison:
              document.getElementById("mi_garrison_blue").style.display = "block";
              document.getElementById("mi_garrison_blue_img").style.display = "block";
              break;
            case leader:
              document.getElementById("mi_leader_blue").style.display = "block";
              document.getElementById("mi_leader_blue_img").style.display = "block";
              break;
            case sabotage:
              document.getElementById("mi_sabotage_blue").style.display = "block";
              document.getElementById("mi_sabotage_blue_img").style.display = "block";
              break;
          }
          switch (ai_bonus) { //CIS AI
            case ai_increase_difficulty:
              document.getElementById("mi_difficulty_red").style.display = "block";
              document.getElementById("mi_difficulty_red_img").style.display = "block";
              break;
            case ai_sabotage:
              document.getElementById("mi_sabotage_red").style.display = "block";
              document.getElementById("mi_sabotage_red_img").style.display = "block";
              break;
          }
          //-----------Supremacy------------
        } else {
          document.getElementById("attack_settings_img").src = "galactic_conquest/instant_action.png";
          w4SizeMap.set("attack_settings_img", [1000, 1350]);
          w4PosMap.set("attack_settings_img", [700, 50]);
          setZoomSizes();
          document.getElementById("su_mode").style.display = "block";
          document.getElementById("su_location").style.display = "block";
          document.getElementById("su_difficulty").style.display = "block";
          document.getElementById("su_length").style.display = "block";
          document.getElementById("su_points").style.display = "block";
          document.getElementById("su_enemy_ai").style.display = "block";
          document.getElementById("su_friendly_ai").style.display = "block";
          document.getElementById("su_enemy_hero").style.display = "block";
          document.getElementById("su_friendly_hero").style.display = "block";
          document.getElementById("su_enemy_reinforcement").style.display = "block";
          document.getElementById("su_friendly_reinforcement").style.display = "block";
          document.getElementById("su_enemy_vehicle").style.display = "block";
          document.getElementById("su_friendly_vehicle").style.display = "block";

          document.getElementById("su_location").innerHTML = planetName_index_to_string[attackingPlanet].toUpperCase();

          //COMMUNICATIONS JAMMER
          document.getElementById("su_difficulty").innerHTML = "NORMAL";
          if (player_bonus == communications_jammer && ai_bonus != ai_increase_difficulty)
            document.getElementById("su_difficulty").innerHTML = "ROOKIE";
          else if (player_bonus != communications_jammer && ai_bonus == ai_increase_difficulty)
            document.getElementById("su_difficulty").innerHTML = "EXPERT";

          //SUPPLIES
          document.getElementById("su_points").innerHTML = "DEFAULT";
          if (player_bonus == supplies && ai_bonus != ai_sabotage)
            document.getElementById("su_points").innerHTML = "FAST";
          else if (player_bonus != supplies && ai_bonus == ai_sabotage)
            document.getElementById("su_points").innerHTML = "SLOW";

          //GARRISON
          if (player_bonus == garrison)
            document.getElementById("su_friendly_ai").innerHTML = "30";
          else
            document.getElementById("su_friendly_ai").innerHTML = "20";

          //LEADER
          if (player_bonus == leader)
            document.getElementById("su_friendly_hero").innerHTML = "1";
          else
            document.getElementById("su_friendly_hero").innerHTML = "0";

          //SABOTAGE
          if (player_bonus == sabotage)
            document.getElementById("su_enemy_vehicle").innerHTML = "0";
          else
            document.getElementById("su_enemy_vehicle").innerHTML = "1";

          switch (player_bonus) {
            case communications_jammer:
              document.getElementById("su_difficulty_blue").style.display = "block";
              document.getElementById("su_difficulty_blue_img").style.display = "block";
              break;
            case supplies:
              document.getElementById("su_points_blue").style.display = "block";
              document.getElementById("su_points_blue_img").style.display = "block";
              break;
            case garrison:
              document.getElementById("su_garrison_blue").style.display = "block";
              document.getElementById("su_garrison_blue_img").style.display = "block";
              break;
            case leader:
              document.getElementById("su_leader_blue").style.display = "block";
              document.getElementById("su_leader_blue_img").style.display = "block";
              break;
            case sabotage:
              document.getElementById("su_sabotage_blue").style.display = "block";
              document.getElementById("su_sabotage_blue_img").style.display = "block";
              break;
          }
          switch (ai_bonus) { //CIS AI
            case ai_increase_difficulty:
              document.getElementById("su_difficulty_red").style.display = "block";
              document.getElementById("su_difficulty_red_img").style.display = "block";
              break;
            case ai_sabotage:
              document.getElementById("su_sabotage_red").style.display = "block";
              document.getElementById("su_sabotage_red_img").style.display = "block";
              break;
          }

        }
      }
    }
    else if (sub_state == sub_credits_results) {
      document.getElementById("credits_results_div").style.display = "block";
      var numPlayerPlanets = 0;
      var numAIPlanets = 0;
      switch (team) {
        case republic:
          document.getElementById("credits_results_player_name").innerHTML = "Galactic Republic";
          document.getElementById("credits_results_ai_name").innerHTML = "Separatist Alliance";
          numPlayerPlanets = countOwnedPlanets(republic);
          numAIPlanets = countOwnedPlanets(cis);
          break;
        case cis:
          document.getElementById("credits_results_player_name").innerHTML = "Separatist Alliance";
          document.getElementById("credits_results_ai_name").innerHTML = "Galactic Republic";
          numPlayerPlanets = countOwnedPlanets(cis);
          numAIPlanets = countOwnedPlanets(republic);
          break;
        case rebel:
          document.getElementById("credits_results_player_name").innerHTML = "Rebel Alliance";
          document.getElementById("credits_results_ai_name").innerHTML = "Galactic Empire";
          numPlayerPlanets = countOwnedPlanets(rebel);
          numAIPlanets = countOwnedPlanets(empire);
          break;
        case empire:
          document.getElementById("credits_results_player_name").innerHTML = "Galactic Empire";
          document.getElementById("credits_results_ai_name").innerHTML = "Rebel Alliance";
          numPlayerPlanets = countOwnedPlanets(empire);
          numAIPlanets = countOwnedPlanets(rebel);
          break;
        case resist:
          document.getElementById("credits_results_player_name").innerHTML = "Resistance";
          document.getElementById("credits_results_ai_name").innerHTML = "First Order";
          numPlayerPlanets = countOwnedPlanets(resist);
          numAIPlanets = countOwnedPlanets(firstorder);
          break;
        case firstorder:
          document.getElementById("credits_results_player_name").innerHTML = "First Order";
          document.getElementById("credits_results_ai_name").innerHTML = "Resistance";
          numPlayerPlanets = countOwnedPlanets(firstorder);
          numAIPlanets = countOwnedPlanets(resist);
          break;
      }

      var playerPlural = "";
      if (numPlayerPlanets != 1)
        playerPlural = "s";

      var aiPlural = "";
      if (numAIPlanets != 1)
        aiPlural = "s";

      if (wasVictory) {
        document.getElementById("credits_results_player_description").innerHTML = "Victory<br>" + numPlayerPlanets + " Planet" + playerPlural + "<br>TOTAL";
        document.getElementById("credits_results_ai_description").innerHTML = "Defeat<br>" + numAIPlanets + " Planet" + aiPlural + "<br>TOTAL";
      }
      else {
        document.getElementById("credits_results_player_description").innerHTML = "Defeat<br>" + numPlayerPlanets + " Planet" + playerPlural + "<br>TOTAL";
        document.getElementById("credits_results_ai_description").innerHTML = "Victory<br>" + numAIPlanets + " Planet" + aiPlural + "<br>TOTAL";
      }

      var totalPlayerBonus = playerVictoryBonus + playerPlanetaryBonus;
      var totalAIBonus = aiVictoryBonus + aiPlanetaryBonus;
      document.getElementById("credits_results_player_amounts").innerHTML = playerVictoryBonus + "<br>" + playerPlanetaryBonus + "<br>" + totalPlayerBonus;
      document.getElementById("credits_results_ai_amounts").innerHTML = aiVictoryBonus + "<br>" + aiPlanetaryBonus + "<br>" + totalAIBonus;
    }
    document.getElementById("bonus_attack_owned0").src = owned_bonuses[0][1];
    document.getElementById("bonus_attack_owned1").src = owned_bonuses[1][1];
    document.getElementById("bonus_attack_owned2").src = owned_bonuses[2][1];
    document.getElementById("bonus_attack_name").innerHTML = "";
    document.getElementById("bonus_attack_description").innerHTML = "You have no bonuses";
    if (owned_bonuses[0][0] != na || owned_bonuses[1][0] != na || owned_bonuses[2][0] != na) {
      i = 0;
      for (i = 0; i < 3; ++i) {
        if (owned_bonuses[i][0] != na) {
          select_attack_bonus(i);
          break;
        }
      }
      document.getElementById("use_div").style.display = "block";
    }
    else {
      document.getElementById("use_div").style.display = "none";
    }
  } //End state == state_attack_planet

  document.getElementById("credits_text").innerHTML = credits;
  if (credits < bonusCreditCosts[selectedBonus])
    document.getElementById("bonus_cost").style.color = "red";
  else
    document.getElementById("bonus_cost").style.color = "white";

  if (credits < fleet_cost)
    document.getElementById("point_cost").style.color = "red";
  else
    document.getElementById("point_cost").style.color = "white";

  document.getElementById("bonus_owned0").src = owned_bonuses[0][1];
  document.getElementById("bonus_owned1").src = owned_bonuses[1][1];
  document.getElementById("bonus_owned2").src = owned_bonuses[2][1];

}//End setElements()

function initializeTeams() {
  document.getElementById("bonus0_img").src = src0a;
  document.getElementById("bonus1_img").src = src1a;
  document.getElementById("bonus2_img").src = src2a;
  document.getElementById("bonus3_img").src = src3a;
  document.getElementById("bonus4_img").src = src4a;

  //Set visible planets and points for selected era
  for (var i = 1; i <= NUM_POINTS; ++i) {
    document.getElementById("point" + i).style.display = "";
    var ele = document.getElementById(planet_index_to_string[i]);
    if (ele != null)
      ele.style.display = "";
    if (doesArrayInclude(ERA_PLANETS[team], i)) {
      document.getElementById("point" + i).style.display = "none";
    }
    else {
      var ele = document.getElementById(planet_index_to_string[i]);
      if (ele != null)
        ele.style.display = "none";
    }
  }
  hideAllLoops();

  var posX_light, posY_light, posX_dark, posY_dark;
  switch (team) { //Era
    case republic:
    case cis:
      posX_light = w4PosMap.get(planet_index_to_string[republic_home])[0] + 20;
      posY_light = w4PosMap.get(planet_index_to_string[republic_home])[1] - 36;
      posX_dark = w4PosMap.get(planet_index_to_string[cis_home])[0] + 20;
      posY_dark = w4PosMap.get(planet_index_to_string[cis_home])[1] - 36;
      document.getElementById("lightFleet_attack").src = "galactic_conquest/venator.png";
      document.getElementById("darkFleet_attack").src = "galactic_conquest/dreadnought.png";
      for (var i = 0; i < 26; ++i) {
        document.getElementById("lightFleet" + i).src = "galactic_conquest/venator.png";
        document.getElementById("darkFleet" + i).src = "galactic_conquest/dreadnought.png";
      }
      break;
    case rebel:
    case empire:
      posX_light = w4PosMap.get(planet_index_to_string[rebel_home])[0] + 20;
      posY_light = w4PosMap.get(planet_index_to_string[rebel_home])[1] - 36;
      posX_dark = w4PosMap.get(planet_index_to_string[empire_home])[0] + 20;
      posY_dark = w4PosMap.get(planet_index_to_string[empire_home])[1] - 36;
      document.getElementById("lightFleet_attack").src = "galactic_conquest/mc80.png";
      document.getElementById("darkFleet_attack").src = "galactic_conquest/imperial.png";
      for (var i = 0; i < 26; ++i) {
        document.getElementById("lightFleet" + i).src = "galactic_conquest/mc80.png";
        document.getElementById("darkFleet" + i).src = "galactic_conquest/imperial.png";
      }
      break;
    case resist:
    case firstorder:
      posX_light = w4PosMap.get(planet_index_to_string[resist_home])[0] + 20;
      posY_light = w4PosMap.get(planet_index_to_string[resist_home])[1] - 36;
      posX_dark = w4PosMap.get(planet_index_to_string[firstorder_home])[0] + 20;
      posY_dark = w4PosMap.get(planet_index_to_string[firstorder_home])[1] - 36;
      document.getElementById("lightFleet_attack").src = "galactic_conquest/mc85.png";
      document.getElementById("darkFleet_attack").src = "galactic_conquest/resurgent.png";
      for (var i = 0; i < 26; ++i) {
        document.getElementById("lightFleet" + i).src = "galactic_conquest/mc85.png";
        document.getElementById("darkFleet" + i).src = "galactic_conquest/resurgent.png";
      }
      break;
  }

  document.getElementById("light_home").style.left = posX_light + "px";
  document.getElementById("light_home").style.top = posY_light + "px";
  document.getElementById("dark_home").style.left = posX_dark + "px";
  document.getElementById("dark_home").style.top = posY_dark + "px";
  w4PosMap.set("light_home", [posX_light, posY_light]);
  w4PosMap.set("dark_home", [posX_dark, posY_dark]);

  switch (team) { //Team
    case republic:
      planetOwners[felucia] = cis;
      planetOwners[geonosis] = cis;
      planetOwners[kamino] = republic;
      planetOwners[kashyyyk] = cis;
      planetOwners[naboo] = cis;
      document.getElementById("light_home").src = "galactic_conquest/republic_logo_blue.png";
      document.getElementById("dark_home").src = "galactic_conquest/cis_logo_red.png";
      setElements();

      // document.getElementById("credits_team").style.left = "840px";
      w4PosMap.set("credits_team", [840, 330]);
      document.getElementById("credits_team").innerHTML = "Republic";
      document.getElementById("credits_logo").src = "galactic_conquest/republic_logo_blue.png";
      document.getElementById("lightFleet0").src = "galactic_conquest/venator_blue.png";
      document.getElementById("darkFleet0").src = "galactic_conquest/dreadnought.png";
      break;
    case cis:
      planetOwners[felucia] = republic;
      planetOwners[geonosis] = cis;
      planetOwners[kamino] = republic;
      planetOwners[kashyyyk] = republic;
      planetOwners[naboo] = republic;
      document.getElementById("light_home").src = "galactic_conquest/republic_logo_red.png";
      document.getElementById("dark_home").src = "galactic_conquest/cis_logo_blue.png";
      setElements();

      // document.getElementById("credits_team").style.left = "840px";
      w4PosMap.set("credits_team", [840, 330]);
      document.getElementById("credits_team").innerHTML = "Separatists";
      document.getElementById("credits_logo").src = "galactic_conquest/cis_logo_blue.png";
      document.getElementById("lightFleet0").src = "galactic_conquest/venator.png";
      document.getElementById("darkFleet0").src = "galactic_conquest/dreadnought_blue.png";
      break;
    case rebel:
      planetOwners[yavin4] = rebel;
      planetOwners[tatooine] = empire;
      planetOwners[scarif] = empire;
      planetOwners[hoth] = empire;
      planetOwners[deathstar2] = empire;
      planetOwners[kessel] = empire;
      planetOwners[endor] = empire;
      document.getElementById("light_home").src = "galactic_conquest/rebel_logo_blue.png";
      document.getElementById("dark_home").src = "galactic_conquest/empire_logo_red.png";
      setElements();

      // document.getElementById("credits_team").style.left = "770px";
      w4PosMap.set("credits_team", [770, 330]);
      document.getElementById("credits_team").innerHTML = "Rebel Alliance";
      document.getElementById("credits_logo").src = "galactic_conquest/rebel_logo_blue.png";
      document.getElementById("lightFleet0").src = "galactic_conquest/mc80_blue.png";
      document.getElementById("darkFleet0").src = "galactic_conquest/imperial.png";
      break;
    case empire:
      planetOwners[yavin4] = rebel;
      planetOwners[tatooine] = rebel;
      planetOwners[scarif] = rebel;
      planetOwners[hoth] = rebel;
      planetOwners[deathstar2] = empire;
      planetOwners[kessel] = rebel;
      planetOwners[endor] = rebel;
      document.getElementById("light_home").src = "galactic_conquest/rebel_logo_red.png";
      document.getElementById("dark_home").src = "galactic_conquest/empire_logo_blue.png";
      setElements();

      // document.getElementById("credits_team").style.left = "720px";
      w4PosMap.set("credits_team", [720, 330]);
      document.getElementById("credits_team").innerHTML = "Galactic Empire";
      document.getElementById("credits_logo").src = "galactic_conquest/empire_logo_blue.png";
      document.getElementById("lightFleet0").src = "galactic_conquest/mc80.png";
      document.getElementById("darkFleet0").src = "galactic_conquest/imperial_blue.png";
      break;
    case resist:
      planetOwners[ajankloss] = resist;
      planetOwners[takodana] = firstorder;
      planetOwners[jakku] = firstorder;
      planetOwners[starkillerbase] = firstorder;
      document.getElementById("light_home").src = "galactic_conquest/resist_logo_blue.png";
      document.getElementById("dark_home").src = "galactic_conquest/firstorder_logo_red.png";
      setElements();

      // document.getElementById("credits_team").style.left = "840px";
      w4PosMap.set("credits_team", [840, 330]);
      document.getElementById("credits_team").innerHTML = "Resistance";
      document.getElementById("credits_logo").src = "galactic_conquest/resist_logo_blue.png";
      document.getElementById("lightFleet0").src = "galactic_conquest/mc85_blue.png";
      document.getElementById("darkFleet0").src = "galactic_conquest/resurgent.png";
      break;
    case firstorder:
      planetOwners[ajankloss] = resist;
      planetOwners[takodana] = resist;
      planetOwners[jakku] = resist;
      planetOwners[starkillerbase] = firstorder;
      document.getElementById("light_home").src = "galactic_conquest/resist_logo_red.png";
      document.getElementById("dark_home").src = "galactic_conquest/firstorder_logo_blue.png";
      setElements();

      // document.getElementById("credits_team").style.left = "840px";
      w4PosMap.set("credits_team", [840, 330]);
      document.getElementById("credits_team").innerHTML = "First Order";
      document.getElementById("credits_logo").src = "galactic_conquest/firstorder_logo_blue.png";
      document.getElementById("lightFleet0").src = "galactic_conquest/mc85.png";
      document.getElementById("darkFleet0").src = "galactic_conquest/resurgent_blue.png";
      break;
  }
  setZoomSizes();
}

function hideTeamSelect(team2) {
  if (state == state_team_select) {
    num_neutral_points = NUM_POINTS - ERA_PLANETS[team2].length;
    bonus_select(-2);
    state = state_galaxy_view;
    team = team2;
    switch (team) {
      case republic:
        ai_team = cis;
        break;
      case cis:
        ai_team = republic;
        break;
      case rebel:
        ai_team = empire;
        break;
      case empire:
        ai_team = rebel;
        break;
      case resist:
        ai_team = firstorder;
        break;
      case firstorder:
        ai_team = resist;
        break;
    }
    initializeTeams();
    hideAllLoops();
    if (isTeamLight()) {
      var p = lightPlanets[getFirstFleetIndex(team2)];
      if (doesArrayInclude(ERA_PLANETS[team], p))
        selectPoint(planet_index_to_string[p], true);
      else
        selectPoint(point_index_to_string[p], true);
    }
    else {
      var p = darkPlanets[getFirstFleetIndex(team2)];
      if (doesArrayInclude(ERA_PLANETS[team], p))
        selectPoint(planet_index_to_string[p], true);
      else
        selectPoint(point_index_to_string[p], true);
    }
    setElements();
    saveState();
    if (soundEnabled) {
      var index = getRandomNumber(2);
      sound_select_fleet[team][index].currentTime = 0;
      sound_select_fleet[team][index].play();
    }
  }
}

function hideAllLoops() {
  for (var i = 1; i <= NUM_POINTS; ++i) {
    document.getElementById("loop_" + point_index_to_string[i]).style.display = "none";
    var ele = document.getElementById("loop_" + planet_index_to_string[i]);
    if (ele != null) {
      ele.style.display = "none";
    }
  }
}

function setLineStyles(oldPlanet, newPlanet) {
  var i = 0;
  for (i = 0; i < 33; ++i) {
    // if(pointPairs[i][0] == oldPlanet || pointPairs[i][1] == oldPlanet){
    var idP = point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]];
    //document.getElementById(idP).src = "galactic_conquest/grey_line.png";
    document.getElementById(idP).style.opacity = "0.2";
    //document.getElementById(idP).style.height  = "3px";
    // }
  }

  i = 0;
  for (i = 0; i < 33; ++i) {
    if (pointPairs[i][0] == newPlanet || pointPairs[i][1] == newPlanet) {
      var idP = point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]];
      //document.getElementById(idP).src = "galactic_conquest/grey_line.png";
      document.getElementById(idP).style.opacity = "0.7";
      //document.getElementById(idP).style.height  = "4px";
    }
  }
}

function onPlanetMouseOver(planet) {
  var index;
  if (doesArrayInclude(planet_index_to_string, planet))
    index = planet_index_to_string.indexOf(planet);
  else
    index = point_index_to_string.indexOf(planet);

  if (state == state_galaxy_view && selectedPlanet != index)
    if (planetOwners[index] == team)
      document.getElementById(planet).src = "galactic_conquest/blue_planet_hover.png";
    else
      document.getElementById(planet).src = "galactic_conquest/red_planet_hover.png";
}

function onPlanetMouseOut(planet) {
  var index;
  if (doesArrayInclude(planet_index_to_string, planet))
    index = planet_index_to_string.indexOf(planet);
  else
    index = point_index_to_string.indexOf(planet);

  if (state == state_galaxy_view && selectedPlanet != index)
    if (planetOwners[index] == team)
      document.getElementById(planet).src = "galactic_conquest/blue_planet_idle.png";
    else
      document.getElementById(planet).src = "galactic_conquest/red_planet_idle.png";
}

function selectPoint(point, overrideState) {
  if (state == state_galaxy_view || overrideState) {
    var point;
    if (doesArrayInclude(planet_index_to_string, point))
      point = planet_index_to_string.indexOf(point);
    else
      point = point_index_to_string.indexOf(point);
    //point is now a number

    var i = 0;
    var selectDestinationSoundPlayed = false;
    //Change back last selected line
    setLinesGreySrc();
    if (isTeamLight()) {
      //Select Venator
      if (doesArrayInclude(lightPlanets, point)) {
        if (soundEnabled && !overrideState && !hasMovedThisTurn) {
          var index = getRandomNumber(1);
          sound_select_destination[team][index].currentTime = 0;
          sound_select_destination[team][index].play();
          selectDestinationSoundPlayed = true;
        }
        var index = lightPlanets.indexOf(point);
        var venator = document.getElementById("lightFleet" + index);
        var i = 0;
        switch (team) {
          case republic:
            for (i = 0; i < 26; ++i)
              document.getElementById("lightFleet" + i).src = "galactic_conquest/venator.png";
            venator.src = "galactic_conquest/venator_blue.png";
            break;
          case rebel:
            for (i = 0; i < 26; ++i)
              document.getElementById("lightFleet" + i).src = "galactic_conquest/mc80.png";
            venator.src = "galactic_conquest/mc80_blue.png";
            break;
          case resist:
            for (i = 0; i < 26; ++i)
              document.getElementById("lightFleet" + i).src = "galactic_conquest/mc85.png";
            venator.src = "galactic_conquest/mc85_blue.png";
            break;
        }
        selectedLightFleet[0] = point;
        selectedLightFleet[1] = "lightFleet" + index;
      }

      //Change to dashed line
      // console.log(point + " " + pointMap.get(point) + " " + selectedLightFleet[0]);
      if (doesArrayInclude(pointMap.get(point), selectedLightFleet[0]) && !hasMovedThisTurn) {
        if (soundEnabled && !overrideState) {
          sound_select.currentTime = 0;
          sound_select.play();
        }
        canMove = true;
        if (document.getElementById(point_index_to_string[point] + "_" + point_index_to_string[selectedLightFleet[0]]) != null)
          document.getElementById(point_index_to_string[point] + "_" + point_index_to_string[selectedLightFleet[0]]).src = "galactic_conquest/white_dash.gif";
        else if (document.getElementById(point_index_to_string[selectedLightFleet[0]] + "_" + point_index_to_string[point]) != null)
          document.getElementById(point_index_to_string[selectedLightFleet[0]] + "_" + point_index_to_string[point]).src = "galactic_conquest/white_dash_reverse.gif";
      }
      else {
        canMove = false;
      }
    }
    else {
      //Select Dreadnought
      if (doesArrayInclude(darkPlanets, point)) {
        if (soundEnabled && !overrideState && !hasMovedThisTurn) {
          var index = getRandomNumber(1);
          sound_select_destination[team][index].currentTime = 0;
          sound_select_destination[team][index].play();
          selectDestinationSoundPlayed = true;
        }
        var index = darkPlanets.indexOf(point);
        var dread = document.getElementById("darkFleet" + index);
        var i = 0;
        switch (team) {
          case cis:
            for (i = 0; i < 26; ++i)
              document.getElementById("darkFleet" + i).src = "galactic_conquest/dreadnought.png";
            dread.src = "galactic_conquest/dreadnought_blue.png";
            break;
          case empire:
            for (i = 0; i < 26; ++i)
              document.getElementById("darkFleet" + i).src = "galactic_conquest/imperial.png";
            dread.src = "galactic_conquest/imperial_blue.png";
            break;
          case firstorder:
            for (i = 0; i < 26; ++i)
              document.getElementById("darkFleet" + i).src = "galactic_conquest/resurgent.png";
            dread.src = "galactic_conquest/resurgent_blue.png";
            break;
        }

        selectedDarkFleet[0] = point;
        selectedDarkFleet[1] = "darkFleet" + index;
      }

      //Change to dashed line
      if (doesArrayInclude(pointMap.get(point), selectedDarkFleet[0]) && !hasMovedThisTurn) {
        if (soundEnabled && !overrideState && !selectDestinationSoundPlayed) {
          sound_select.currentTime = 0;
          sound_select.play();
        }
        canMove = true;
        if (document.getElementById(point_index_to_string[point] + "_" + point_index_to_string[selectedDarkFleet[0]]) != null)
          document.getElementById(point_index_to_string[point] + "_" + point_index_to_string[selectedDarkFleet[0]]).src = "galactic_conquest/white_dash.gif";
        else if (document.getElementById(point_index_to_string[selectedDarkFleet[0]] + "_" + point_index_to_string[point]) != null)
          document.getElementById(point_index_to_string[selectedDarkFleet[0]] + "_" + point_index_to_string[point]).src = "galactic_conquest/white_dash_reverse.gif";
      }
      else {
        canMove = false;
      }
    }

    //If point has point in name
    if (!doesArrayInclude(ERA_PLANETS[team], point)) {
      canBuild = false;
      document.getElementById("point_name").innerHTML = "";
      document.getElementById("point_description").innerHTML = "";
      document.getElementById("point_credits_logo1").style.display = "none";
      document.getElementById("point_credits_logo2").style.display = "none";
      document.getElementById("point_cost").innerHTML = "";
      document.getElementById("point_credits_logo").style.display = "none";

      setLineStyles(selectedPlanet, point);
      hideAllLoops();
      selectedPlanet = point;
      selectedLoopId = "#loop_" + point_index_to_string[point];
      document.getElementById(point_index_to_string[point]).src = "galactic_conquest/grey_point_idle.png";
      document.getElementById("loop_" + point_index_to_string[point]).style.display = "block";
      loopSize = 0.2;
      loopOpacity = 1.8;
      $("#loop_" + point_index_to_string[selectedPlanet]).css("transform", "scaleX(" + loopSize + ") scaleY(" + loopSize + ")");
      $("#loop_" + point_index_to_string[selectedPlanet]).css("opacity", loopOpacity);
    }
    else { //Planets
      if (soundEnabled && !overrideState && !selectDestinationSoundPlayed) {
        switch (point) {
          case felucia:
            sound_felucia[team].currentTime = 0;
            sound_felucia[team].play();
            break;
          case geonosis:
            sound_geonosis[team].currentTime = 0;
            sound_geonosis[team].play();
            break;
          case kamino:
            sound_kamino[team].currentTime = 0;
            sound_kamino[team].play();
            break;
          case kashyyyk:
            sound_kashyyyk[team].currentTime = 0;
            sound_kashyyyk[team].play();
            break;
          case naboo:
            sound_naboo[team].currentTime = 0;
            sound_naboo[team].play();
            break;
          case yavin4:
            sound_yavin4[team].currentTime = 0;
            sound_yavin4[team].play();
            break;
          case tatooine:
            sound_tatooine[team].currentTime = 0;
            sound_tatooine[team].play();
            break;
          case hoth:
            sound_hoth[team].currentTime = 0;
            sound_hoth[team].play();
            break;
          case endor:
            sound_endor[team].currentTime = 0;
            sound_endor[team].play();
            break;
        }
      }
      document.getElementById("point_name").innerHTML = planetName_index_to_string[point];
      if (planetOwners[point] == team && !doesArrayInclude(lightPlanets, point) && !doesArrayInclude(darkPlanets, point)) {
        document.getElementById("point_description").innerHTML = "Fleets can be built and used to invade or fortify planets and engage enemy fleets in space.";
        document.getElementById("point_credits_logo1").style.display = "none";
        document.getElementById("point_credits_logo2").style.display = "none";
        document.getElementById("point_cost").innerHTML = fleet_cost;
        document.getElementById("point_credits_logo").style.display = "block";
      }
      else {
        var desc = "Victory Resources:&nbsp&nbsp&nbsp" + planetVictoryResources.get(point) + "<br>" +
          "Planetary Bonus:&nbsp&nbsp&nbsp" + planetBonuses.get(point);
        switch (point) {
          case geonosis:
            desc += "<br>Droid Foundry (CIS Base Planet)";
            break;
          case kamino:
            desc += "<br>Cloning Facility (Republic Base Planet)";
            break;
          case yavin4:
            desc += "<br>Hidden Rebel Base (Rebel Alliance Base Planet)";
            break;
          case deathstar2:
            desc += "<br>Imperial Space Station (Galactic Empire Base Superstructure)";
            break;
          case ajankloss:
            desc += "<br>Hidden Resistance Base (Resistance Base Planet)";
            break;
          case starkillerbase:
            desc += "<br>First Order Superweapon Planet (First Order Base Planet)";
            break;
        }
        document.getElementById("point_description").innerHTML = desc;
        document.getElementById("point_credits_logo1").style.display = "inherit";
        document.getElementById("point_credits_logo2").style.display = "inherit";
        document.getElementById("point_cost").innerHTML = "";
        document.getElementById("point_credits_logo").style.display = "none";
      }

      setLineStyles(selectedPlanet, point);

      hideAllLoops();
      selectedPlanet = point;
      selectedLoopId = "#loop_" + planet_index_to_string[point];
      if (planetOwners[point] == team) {
        document.getElementById(planet_index_to_string[point]).src = "galactic_conquest/blue_planet_idle.png";
        document.getElementById("loop_" + planet_index_to_string[point]).src = "galactic_conquest/blue_planet_loop.png";
      }
      else {
        document.getElementById(planet_index_to_string[point]).src = "galactic_conquest/red_planet_idle.png";
        document.getElementById("loop_" + planet_index_to_string[point]).src = "galactic_conquest/red_planet_loop.png";
      }
      document.getElementById("loop_" + planet_index_to_string[point]).style.display = "block";
      loopSize = 0.2;
      loopOpacity = 1.8;
      $("#loop_" + planet_index_to_string[selectedPlanet]).css("transform", "scaleX(" + loopSize + ") scaleY(" + loopSize + ")");
      $("#loop_" + planet_index_to_string[selectedPlanet]).css("opacity", loopOpacity);
    }
    // if(!overrideState){
    setElements();
    // }
    saveState();
  }
} //End selectPoint()

function ai_selectpoint(point) {
  if (state == state_ai_moving) {
    var i = 0;

    if (isTeamLight()) {
      //Change back last selected line
      setLinesGreySrc();

      //Select Dreadnought
      if (doesArrayInclude(darkPlanets, point)) {
        var index = darkPlanets.indexOf(point);
        var dread = document.getElementById("darkFleet" + index);
        var i = 0;
        switch (team) {
          case republic:
            for (i = 0; i < 26; ++i)
              document.getElementById("darkFleet" + i).src = "galactic_conquest/dreadnought.png";
            dread.src = "galactic_conquest/dreadnought_red.png";
            break;
          case rebel:
            for (i = 0; i < 26; ++i)
              document.getElementById("darkFleet" + i).src = "galactic_conquest/imperial.png";
            dread.src = "galactic_conquest/imperial_red.png";
            break;
          case resist:
            for (i = 0; i < 26; ++i)
              document.getElementById("darkFleet" + i).src = "galactic_conquest/resurgent.png";
            dread.src = "galactic_conquest/resurgent_red.png";
            break;
        }

        selectedDarkFleet[0] = point;
        selectedDarkFleet[1] = "darkFleet" + index;
      }

      //Change to dashed line
      if (doesArrayInclude(pointMap.get(point), selectedDarkFleet[0])) {
        canMove = true;
        if (document.getElementById(point_index_to_string[point] + "_" + point_index_to_string[selectedDarkFleet[0]]) != null)
          document.getElementById(point_index_to_string[point] + "_" + point_index_to_string[selectedDarkFleet[0]]).src = "galactic_conquest/white_dash.gif";
        else if (document.getElementById(point_index_to_string[selectedDarkFleet[0]] + "_" + point_index_to_string[point]) != null)
          document.getElementById(point_index_to_string[selectedDarkFleet[0]] + "_" + point_index_to_string[point]).src = "galactic_conquest/white_dash_reverse.gif";
      }
    }
    else {
      //Change back last selected line
      setLinesGreySrc();

      //Select Venator
      if (doesArrayInclude(lightPlanets, point)) {
        var index = lightPlanets.indexOf(point);
        var venator = document.getElementById("lightFleet" + index);
        var i = 0;

        switch (team) {
          case cis:
            for (i = 0; i < 26; ++i)
              document.getElementById("lightFleet" + i).src = "galactic_conquest/venator.png";
            venator.src = "galactic_conquest/venator_red.png";
            break;
          case empire:
            for (i = 0; i < 26; ++i)
              document.getElementById("lightFleet" + i).src = "galactic_conquest/mc80.png";
            venator.src = "galactic_conquest/mc80_red.png";
            break;
          case firstorder:
            for (i = 0; i < 26; ++i)
              document.getElementById("lightFleet" + i).src = "galactic_conquest/mc85.png";
            venator.src = "galactic_conquest/mc85_red.png";
            break;
        }

        selectedLightFleet[0] = point;
        selectedLightFleet[1] = "lightFleet" + index;
      }

      //Change to dashed line
      if (doesArrayInclude(pointMap.get(point), selectedLightFleet[0])) {
        canMove = true;
        if (document.getElementById(point_index_to_string[point] + "_" + point_index_to_string[selectedLightFleet[0]]) != null)
          document.getElementById(point_index_to_string[point] + "_" + point_index_to_string[selectedLightFleet[0]]).src = "galactic_conquest/white_dash.gif";
        else if (document.getElementById(point_index_to_string[selectedLightFleet[0]] + "_" + point_index_to_string[point]) != null)
          document.getElementById(point_index_to_string[selectedLightFleet[0]] + "_" + point_index_to_string[point]).src = "galactic_conquest/white_dash_reverse.gif";
      }
    }

    //If point has point in name
    if (!doesArrayInclude(ERA_PLANETS[team], point)) {
      document.getElementById("point_name").innerHTML = "";
      document.getElementById("point_description").innerHTML = "";
      document.getElementById("point_credits_logo1").style.display = "none";
      document.getElementById("point_credits_logo2").style.display = "none";
      document.getElementById("point_cost").innerHTML = "";
      document.getElementById("point_credits_logo").style.display = "none";

      setLineStyles(selectedPlanet, point);
      hideAllLoops();
      selectedPlanet = point;
      selectedLoopId = "#loop_" + point_index_to_string[point];
      document.getElementById(point_index_to_string[point]).src = "galactic_conquest/grey_point_idle.png";
      document.getElementById("loop_" + point_index_to_string[point]).style.display = "block";
      loopSize = 0.2;
      loopOpacity = 1.8;
      $("#loop_" + point_index_to_string[selectedPlanet]).css("transform", "scaleX(" + loopSize + ") scaleY(" + loopSize + ")");
      $("#loop_" + point_index_to_string[selectedPlanet]).css("opacity", loopOpacity);
    }
    else { //Planets
      document.getElementById("point_name").innerHTML = planetName_index_to_string[point];
      if (planetOwners[point] == team && !doesArrayInclude(lightPlanets, point) && !doesArrayInclude(darkPlanets, point)) {
        document.getElementById("point_description").innerHTML = "Fleets can be built and used to invade or fortify planets and engage enemy fleets in space.";
        document.getElementById("point_credits_logo1").style.display = "none";
        document.getElementById("point_credits_logo2").style.display = "none";
        document.getElementById("point_cost").innerHTML = fleet_cost;
        document.getElementById("point_credits_logo").style.display = "block";
      }
      else {
        var desc = "Victory Resources: " + planetVictoryResources.get(point) + "<br>" +
          "Planetary Bonus: " + planetBonuses.get(point);

        switch (point) {
          case geonosis:
            desc += "<br>Droid Foundry (CIS Base Planet)";
            break;
          case kamino:
            desc += "<br>Cloning Facility (Republic Base Planet)";
            break;
          case yavin4:
            desc += "<br>Hidden Rebel Base (Rebel Alliance Base Planet)";
            break;
          case deathstar2:
            desc += "<br>Imperial Space Station (Galactic Empire Base Superstructure)";
            break;
          case ajankloss:
            desc += "<br>Hidden Resistance Base (Resistance Base Planet)";
            break;
          case starkillerbase:
            desc += "<br>First Order Superweapon Planet (First Order Base Planet)";
            break;
        }

        document.getElementById("point_description").innerHTML = desc;
        document.getElementById("point_credits_logo1").style.display = "inherit";
        document.getElementById("point_credits_logo2").style.display = "inherit";
        document.getElementById("point_cost").innerHTML = "";
        document.getElementById("point_credits_logo").style.display = "none";
      }

      setLineStyles(selectedPlanet, point);
      hideAllLoops();
      selectedPlanet = point;
      selectedLoopId = "#loop_" + planet_index_to_string[point];
      if (planetOwners[point] == team) {
        document.getElementById(planet_index_to_string[point]).src = "galactic_conquest/blue_planet_idle.png";
        document.getElementById("loop_" + planet_index_to_string[point]).src = "galactic_conquest/blue_planet_loop.png";
      }
      else {
        document.getElementById(planet_index_to_string[point]).src = "galactic_conquest/red_planet_idle.png";
        document.getElementById("loop_" + planet_index_to_string[point]).src = "galactic_conquest/red_planet_loop.png";
      }
      document.getElementById("loop_" + planet_index_to_string[point]).style.display = "block";
      loopSize = 0.2;
      loopOpacity = 1.8;
      $("#loop_" + planet_index_to_string[selectedPlanet]).css("transform", "scaleX(" + loopSize + ") scaleY(" + loopSize + ")");
      $("#loop_" + planet_index_to_string[selectedPlanet]).css("opacity", loopOpacity);
    }
    setElements();
    saveState();
  }
}

function onPointMouseOver(point) {
  if (state == state_galaxy_view && selectedPlanet != point)
    document.getElementById(point).src = "galactic_conquest/grey_point_hover.png";
}

function onPointMouseOut(point) {
  if (state == state_galaxy_view && selectedPlanet != point)
    document.getElementById(point).src = "galactic_conquest/grey_point_idle.png";
}

function onButtonMouseOverBlue(id) {
  if (soundEnabled && !cursor_over_button) {
    sound_select.currentTime = 0;
    sound_select.play();
  }
  cursor_over_button = true;
  document.getElementById(id + "_button").src = "galactic_conquest/button_glow_long_blue.png";
  // document.getElementById(id + "_text").style.color="#F4AE0A";
}

function onButtonMouseOverRed(id) {
  if (soundEnabled && !cursor_over_button) {
    sound_select.currentTime = 0;
    sound_select.play();
  }
  cursor_over_button = true;
  document.getElementById(id + "_button").src = "galactic_conquest/button_glow_long_red.png";
  // document.getElementById(id + "_text").style.color="#F4350A";
}

function onButtonMouseOutLong(id) {
  cursor_over_button = false;
  document.getElementById(id + "_button").src = "galactic_conquest/button_grey_long.png";
  document.getElementById(id + "_text").style.color = "#E5E5E5";
}

function onButtonMouseOver(id) {
  if (soundEnabled && !cursor_over_button) {
    sound_select.currentTime = 0;
    sound_select.play();
  }
  cursor_over_button = true;
  document.getElementById(id + "_button").src = "galactic_conquest/button_glow.png";
  document.getElementById(id + "_text").style.color = "#F4AE0A";
}

function onButtonMouseOut(id) {
  cursor_over_button = false;
  document.getElementById(id + "_button").src = "galactic_conquest/button_grey.png";
  document.getElementById(id + "_text").style.color = "#E5E5E5";
}

function onButtonModeMouseOver(id) {
  if (state == state_galaxy_view && id != "move_mode") {
    if (soundEnabled && !cursor_over_button) {
      sound_select.currentTime = 0;
      sound_select.play();
    }
    document.getElementById(id + "_button").src = "galactic_conquest/button_glow_long.png";
    document.getElementById(id + "_text").style.color = "#F4AE0A";
  }
  else if (state == state_bonus_view && id != "bonus_mode") {
    if (soundEnabled && !cursor_over_button) {
      sound_select.currentTime = 0;
      sound_select.play();
    }
    document.getElementById(id + "_button").src = "galactic_conquest/button_glow_long.png";
    document.getElementById(id + "_text").style.color = "#F4AE0A";
  }
  cursor_over_button = true;
}

function onButtonModeMouseOut(id) {
  if (state == state_galaxy_view && id != "move_mode") {
    document.getElementById(id + "_button").src = "galactic_conquest/button_grey_long.png";
    document.getElementById(id + "_text").style.color = "#E5E5E5";
  }
  else if (state == state_bonus_view && id != "bonus_mode") {
    document.getElementById(id + "_button").src = "galactic_conquest/button_grey_long.png";
    document.getElementById(id + "_text").style.color = "#E5E5E5";
  }
  cursor_over_button = false;
}

function move_mode() {
  if (soundEnabled) {
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  if (state == state_bonus_view) {
    state = state_galaxy_view;
    setElements();
    saveState();
  }
}

function bonus_mode() {
  if (soundEnabled) {
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  if (state == state_galaxy_view) {
    if (soundEnabled) {
      sound_select_a_bonus_to_purchase[team].currentTime = 0;
      sound_select_a_bonus_to_purchase[team].play();
    }
    state = state_bonus_view;
    setElements();
    bonus_select(-2);
    saveState();
  }
}

function bonus_select(pos) {
  targetSelectPos = pos;
  selectedBonus = Math.abs(pos);
  if (soundEnabled) {
    sound_select.currentTime = 0;
    sound_select.play();
  }
  document.getElementById("bonus_name").innerHTML = bonusNames[selectedBonus];
  document.getElementById("bonus_cost").innerHTML = bonusCreditCosts[selectedBonus];
  document.getElementById("bonus_description").innerHTML = bonusDescriptions[selectedBonus];
  if (bonusAnimationRunning == false)
    bonus_select_animation();
  if (credits < bonusCreditCosts[selectedBonus])
    document.getElementById("bonus_cost").style.color = "red";
  else
    document.getElementById("bonus_cost").style.color = "white";
}

function bonus_select_animation() {
  bonusAnimationRunning = true;
  if (Math.abs(targetSelectPos - bonusSelectPos[0]) > 0.01) {
    var diff = 0;
    if (targetSelectPos > bonusSelectPos[0])
      diff = 0.1;
    else
      diff = -0.1;
    bonusSelectPos[0] += diff;
    bonusSelectPos[1] += diff;
    bonusSelectPos[2] += diff;
    bonusSelectPos[3] += diff;
    bonusSelectPos[4] += diff;
    bonusScale[0] = Math.abs(Math.cos((bonusSelectPos[0] / 4) * 1.570795));
    bonusScale[1] = Math.abs(Math.cos((bonusSelectPos[1] / 4) * 1.570795));
    bonusScale[2] = Math.abs(Math.cos((bonusSelectPos[2] / 4) * 1.570795));
    bonusScale[3] = Math.abs(Math.cos((bonusSelectPos[3] / 4) * 1.570795));
    bonusScale[4] = Math.abs(Math.cos((bonusSelectPos[4] / 4) * 1.570795));
    bonusWidth[0] = bonusScale[0] * 200;
    bonusWidth[1] = bonusScale[1] * 200;
    bonusWidth[2] = bonusScale[2] * 200;
    bonusWidth[3] = bonusScale[3] * 200;
    bonusWidth[4] = bonusScale[4] * 200;
    //$("#bonus0_img").css("width", bonusWidth[0] + "px");
    //$("#bonus1_img").css("width", bonusWidth[1] + "px");
    //$("#bonus2_img").css("width", bonusWidth[2] + "px");
    //$("#bonus3_img").css("width", bonusWidth[3] + "px");
    //$("#bonus4_img").css("width", bonusWidth[4] + "px");
    $("#bonus0_img").css("width", (bonusWidth[0] * zoom_level) + "px");
    $("#bonus1_img").css("width", (bonusWidth[1] * zoom_level) + "px");
    $("#bonus2_img").css("width", (bonusWidth[2] * zoom_level) + "px");
    $("#bonus3_img").css("width", (bonusWidth[3] * zoom_level) + "px");
    $("#bonus4_img").css("width", (bonusWidth[4] * zoom_level) + "px");
    $("#bonus0_img").css("transform", "perspective(50em) rotateY(" + bonusSelectPos[0] * 22.5 + "deg)");
    $("#bonus1_img").css("transform", "perspective(50em) rotateY(" + bonusSelectPos[1] * 22.5 + "deg)");
    $("#bonus2_img").css("transform", "perspective(50em) rotateY(" + bonusSelectPos[2] * 22.5 + "deg)");
    $("#bonus3_img").css("transform", "perspective(50em) rotateY(" + bonusSelectPos[3] * 22.5 + "deg)");
    $("#bonus4_img").css("transform", "perspective(50em) rotateY(" + bonusSelectPos[4] * 22.5 + "deg)");
    $("#bonus0_img").css("left", (((Math.sin((bonusSelectPos[0] / 4) * 1.570795) * 616) + (1200 - (bonusWidth[0] / 2))) * zoom_level) + "px");
    $("#bonus1_img").css("left", (((Math.sin((bonusSelectPos[1] / 4) * 1.570795) * 616) + (1200 - (bonusWidth[1] / 2))) * zoom_level) + "px");
    $("#bonus2_img").css("left", (((Math.sin((bonusSelectPos[2] / 4) * 1.570795) * 616) + (1200 - (bonusWidth[2] / 2))) * zoom_level) + "px");
    $("#bonus3_img").css("left", (((Math.sin((bonusSelectPos[3] / 4) * 1.570795) * 616) + (1200 - (bonusWidth[3] / 2))) * zoom_level) + "px");
    $("#bonus4_img").css("left", (((Math.sin((bonusSelectPos[4] / 4) * 1.570795) * 616) + (1200 - (bonusWidth[4] / 2))) * zoom_level) + "px");
    setTimeout(function () {
      bonus_select_animation();
    }, animationSpeed);
  }
  else {
    bonusAnimationRunning = false;
    var oldSize = w4SizeMap.get("bonus0_img");
    var oldPos = w4PosMap.get("bonus0_img");
    w4SizeMap.set("bonus0_img", [bonusWidth[0], oldSize[1]]);
    w4SizeMap.set("bonus1_img", [bonusWidth[1], oldSize[1]]);
    w4SizeMap.set("bonus2_img", [bonusWidth[2], oldSize[1]]);
    w4SizeMap.set("bonus3_img", [bonusWidth[3], oldSize[1]]);
    w4SizeMap.set("bonus4_img", [bonusWidth[4], oldSize[1]]);

    w4PosMap.set("bonus0_img", [(Math.sin((bonusSelectPos[0] / 4) * 1.570795) * 616) + (1200 - (bonusWidth[0] / 2)), oldPos[1]]);
    w4PosMap.set("bonus1_img", [(Math.sin((bonusSelectPos[1] / 4) * 1.570795) * 616) + (1200 - (bonusWidth[1] / 2)), oldPos[1]]);
    w4PosMap.set("bonus2_img", [(Math.sin((bonusSelectPos[2] / 4) * 1.570795) * 616) + (1200 - (bonusWidth[2] / 2)), oldPos[1]]);
    w4PosMap.set("bonus3_img", [(Math.sin((bonusSelectPos[3] / 4) * 1.570795) * 616) + (1200 - (bonusWidth[3] / 2)), oldPos[1]]);
    w4PosMap.set("bonus4_img", [(Math.sin((bonusSelectPos[4] / 4) * 1.570795) * 616) + (1200 - (bonusWidth[4] / 2)), oldPos[1]]);
  }
}

function buy() {
  if (state == state_bonus_view) {
    if (bonusCreditCosts[selectedBonus] <= credits) {
      if (soundEnabled) {
        sound_select_long.currentTime = 0;
        sound_select_long.play();
      }
      sub_state = sub_buying;
      buy_needs_confirmation = true;
      var i = 0;
      for (i = 0; i < 3; ++i) {
        if (owned_bonuses[i][0] == na) {
          owned_bonuses[i][1] = "galactic_conquest/bonus_background_border.gif";
        }
        else {
          owned_bonuses[i][1] = owned_bonuses[i][1].substring(0, owned_bonuses[i][1].length - 4) + "_border.gif";
        }
      }
      setElements();
    } else {
      if (soundEnabled) {
        sound_error.currentTime = 0;
        sound_error.play();
      }
    }
    saveState();
  }
}

function confirm_buy(index) {
  if (buy_needs_confirmation) {
    if (soundEnabled) {
      sound_select_long.currentTime = 0;
      sound_select_long.play();
    }
    sub_state = na;
    buy_needs_confirmation = false;
    credits -= bonusCreditCosts[selectedBonus];
    bonus_select(-selectedBonus);
    var b = na;
    switch (selectedBonus) {
      case 0:
        b = supplies;
        owned_bonuses[index][1] = src0a;
        break;
      case 1:
        b = garrison;
        owned_bonuses[index][1] = src1a;
        break;
      case 2:
        b = sabotage;
        owned_bonuses[index][1] = src2a;
        break;
      case 3:
        b = communications_jammer;
        owned_bonuses[index][1] = src3a;
        break;
      default:
        b = leader;
        owned_bonuses[index][1] = src4a;
        break;
    }
    owned_bonuses[index][0] = b;
    var i = 0;
    for (i = 0; i < 3; ++i) {
      switch (owned_bonuses[i][0]) {
        case supplies:
          owned_bonuses[i][1] = src0a;
          break;
        case garrison:
          owned_bonuses[i][1] = src1a;
          break;
        case sabotage:
          owned_bonuses[i][1] = src2a;
          break;
        case communications_jammer:
          owned_bonuses[i][1] = src3a;
          break;
        case leader:
          owned_bonuses[i][1] = src4a;
          break;
        default:
          owned_bonuses[i][1] = "galactic_conquest/bonus_background.png";
          break;
      }
    }
    setElements();
    saveState();
  }
}

function select_attack_bonus(index) {
  if (soundEnabled) {
    sound_select.currentTime = 0;
    sound_select.play();
  }
  if (owned_bonuses[index][0] != na) {
    document.getElementById("bonus_attack_owned0").src = owned_bonuses[0][1];
    document.getElementById("bonus_attack_owned1").src = owned_bonuses[1][1];
    document.getElementById("bonus_attack_owned2").src = owned_bonuses[2][1];
    selected_attack_bonus = owned_bonuses[index][0];
    switch (index) {
      case 0:
        document.getElementById("bonus_attack_owned0").src = owned_bonuses[index][1].substring(0, owned_bonuses[index][1].length - 4) + "_border.gif";
        break;
      case 1:
        document.getElementById("bonus_attack_owned1").src = owned_bonuses[index][1].substring(0, owned_bonuses[index][1].length - 4) + "_border.gif";
        break;
      default:
        document.getElementById("bonus_attack_owned2").src = owned_bonuses[index][1].substring(0, owned_bonuses[index][1].length - 4) + "_border.gif";
        break;
    }
    document.getElementById("bonus_attack_name").innerHTML = bonusNames[owned_bonuses[index][0] - 1];
    if (doesArrayInclude(darkPlanets, attackingPlanet) && doesArrayInclude(lightPlanets, attackingPlanet))
      document.getElementById("bonus_attack_description").innerHTML = bonusDescriptionsStarfighters[owned_bonuses[index][0] - 1];
    else
      document.getElementById("bonus_attack_description").innerHTML = bonusDescriptionsGround[owned_bonuses[index][0] - 1];
  }
  saveState();
}

function wipeToGalaxyAnimation(firstStartup) {
  if (firstStartup) {
    wipeToGalaxyAnimationRunning = true;
    wipeAnimation = 0;
    saveState();
  }
  if (wipeToGalaxyAnimationRunning) {
    wipeAnimation += 30;                                                  //Top Right Bottom Left
    document.getElementById("attack_planet_background").style.clip = "rect(0px," + (3000 * zoom_level) + "px," + (1687 * zoom_level) + "px," + (wipeAnimation * zoom_level) + "px)";
    //Size = 630 x 630
    //Ventator    Left =  900 Top = 700
    //Dreadnought Left = 1300 Top = 400
    if (wipeAnimation >= 900 && wipeAnimation <= 1530) {
      document.getElementById("lightFleet_attack").style.clip = "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px," + ((wipeAnimation - 900) * zoom_level) + "px)";
      // console.log("1 " + wipeAnimation + " " + document.getElementById("lightFleet_attack").style.clip);
    }
    if (wipeAnimation < 900) {
      document.getElementById("lightFleet_attack").style.clip = "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px,0px)";
      // console.log("2 " + wipeAnimation + " " + document.getElementById("lightFleet_attack").style.clip);
    }
    else if (wipeAnimation > 1530) {
      document.getElementById("lightFleet_attack").style.clip = "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px)";
      // console.log("3 " + wipeAnimation + " " + document.getElementById("lightFleet_attack").style.clip);
    }

    if (wipeAnimation >= 1300 && wipeAnimation <= 1930)
      document.getElementById("darkFleet_attack").style.clip = "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px," + ((wipeAnimation - 1300) * zoom_level) + "px)";
    if (wipeAnimation < 1300)
      document.getElementById("darkFleet_attack").style.clip = "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px,0px)";
    else if (wipeAnimation > 1930)
      document.getElementById("darkFleet_attack").style.clip = "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px)";
    if (wipeAnimation >= 3000) {
      wipeToGalaxyAnimationRunning = false;
      if (!hasMovedThisTurn && soundEnabled) {
        var index = getRandomNumber(2);
        sound_select_fleet[team][index].currentTime = 0;
        sound_select_fleet[team][index].play();
      }
      saveState();
    }
    setTimeout(function () { //Not state sensitive
      wipeToGalaxyAnimation(false);
    }, animationSpeed);
  }
  else {
    setElements();
    document.getElementById("attack_planet_background").style.clip = "rect(0px," + (3000 * zoom_level) + "px," + (1687 * zoom_level) + "px," + (3000 * zoom_level) + "px)";
    document.getElementById("lightFleet_attack").style.clip = "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px)";
    document.getElementById("darkFleet_attack").style.clip = "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px)";
  }
}

function loadAttackBonusAnimation(time) {
  loadAttackBonusAnimationRunning = true;
  saveState();
  setTimeout(function () {
    sub_state = sub_attack_bonus;
    setElements();
    loadAttackBonusAnimationRunning = false;
    saveState();
  }, time);
}

function wipeToPlanetAnimation(firstStartup) {
  if (firstStartup) {
    wipeToPlanetAnimationRunning = true;
    wipeAnimation = 0;
    saveState();
  }
  wipeAnimation += 30;                                                  //Top Right Bottom Left
  document.getElementById("attack_planet_background").style.clip = "rect(0px," + (wipeAnimation * zoom_level) + "px," + (1687 * zoom_level) + "px,0px)";
  //Size = 630 x 630
  //Ventator    Left =  900 Top = 700
  //Dreadnought Left = 1300 Top = 400
  if (wipeAnimation >= 900 && wipeAnimation <= 1530)
    document.getElementById("lightFleet_attack").style.clip = "rect(0px," + ((wipeAnimation - 900) * zoom_level) + "px," + (630 * zoom_level) + "px,0px)";
  if (wipeAnimation > 1530)
    document.getElementById("lightFleet_attack").style.clip = "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px,0px)";
  else if (wipeAnimation < 900)
    document.getElementById("lightFleet_attack").style.clip = "rect(0px,0px," + (630 * zoom_level) + "px,0px)";

  if (wipeAnimation >= 1300 && wipeAnimation <= 1930)
    document.getElementById("darkFleet_attack").style.clip = "rect(0px," + ((wipeAnimation - 1300) * zoom_level) + "px," + (630 * zoom_level) + "px,0px)";
  if (wipeAnimation > 1930)
    document.getElementById("darkFleet_attack").style.clip = "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px,0px)";
  else if (wipeAnimation < 1300)
    document.getElementById("darkFleet_attack").style.clip = "rect(0px,0px," + (630 * zoom_level) + "px,0px)";

  if (wipeAnimation >= 3000) {
    wipeToPlanetAnimationRunning = false;
    setElements();
    loadAttackBonusAnimation(2000);
    document.getElementById("attack_planet_background").style.clip = "rect(0px," + (3000 * zoom_level) + "px," + (1687 * zoom_level) + "px,0px)";
    document.getElementById("lightFleet_attack").style.clip = "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px,0px)";
    document.getElementById("darkFleet_attack").style.clip = "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px,0px)";
    saveState();
  }
  else {
    setTimeout(function () { //Not state sensitive
      wipeToPlanetAnimation(false);
    }, animationSpeed);
  }
}

function ai_move_animation1(time) {
  ai_moving_animation1_running = true;
  saveState();
  setTimeout(function () {
    if (ai_destination != na) {
      if (isTeamLight())
        darkPlanets[darkPlanets.indexOf(ai_selectedFleet)] = ai_destination;
      else
        lightPlanets[lightPlanets.indexOf(ai_selectedFleet)] = ai_destination;
    }
    setElements();
    ai_move_animation2(1000);
    ai_moving_animation1_running = false;
    saveState();
  }, time);
}

function ai_move_animation2(time) {
  ai_moving_animation2_running = true;
  saveState();
  setTimeout(function () {
    setLinesGreySrc();
    hasMovedThisTurn = false;
    state = state_galaxy_view;
    checkForPlanetAttack(ai_team, ai_destination);
    if (state == state_galaxy_view && soundEnabled) {
      var index = getRandomNumber(2);
      sound_select_fleet[team][index].currentTime = 0;
      sound_select_fleet[team][index].play();
    }
    setElements();
    if (isTeamLight()) {
      selectPoint(point_index_to_string[selectedPlanet], true);
      setElements();
      switch (ai_team) {
        case cis:
          for (i = 0; i < 26; ++i)
            document.getElementById("darkFleet" + i).src = "galactic_conquest/dreadnought.png";
          break;
        case empire:
          for (i = 0; i < 26; ++i)
            document.getElementById("darkFleet" + i).src = "galactic_conquest/imperial.png";
          break;
        case firstorder:
          for (i = 0; i < 26; ++i)
            document.getElementById("darkFleet" + i).src = "galactic_conquest/resurgent.png";
          break;
      }
    }
    else {
      selectPoint(point_index_to_string[selectedPlanet], true);
      setElements();
      switch (ai_team) {
        case cis:
          for (i = 0; i < 26; ++i)
            document.getElementById("lightFleet" + i).src = "galactic_conquest/venator.png";
          break;
        case empire:
          for (i = 0; i < 26; ++i)
            document.getElementById("lightFleet" + i).src = "galactic_conquest/mc80.png";
          break;
        case firstorder:
          for (i = 0; i < 26; ++i)
            document.getElementById("lightFleet" + i).src = "galactic_conquest/mc85.png";
          break;
      }
    }
    ai_moving_animation2_running = false;
    if (isTeamLight())
      selectPoint(point_index_to_string[selectedLightFleet[0]], true);
    else
      selectPoint(point_index_to_string[selectedDarkFleet[0]], true);
    saveState();
  }, time);
}

function ai_build_animation(time) {
  ai_building_animation_running = true;
  saveState();
  setTimeout(function () {
    move_ai(ai_selectedFleet);
    if (ai_destination != na) {
      ai_selectpoint(ai_selectedFleet);
      ai_selectpoint(ai_destination);
    }
    setElements();
    ai_move_animation1(1000);
    ai_building_animation_running = false;
    saveState();
  }, time);
}

function loadAttackScreen() {
  wipeToPlanetAnimation(true);
}

function checkForPlanetAttack(team2, dest) {
  if (dest != na) {
    //Space Battle
    if (doesArrayInclude(lightPlanets, dest) && doesArrayInclude(darkPlanets, dest)) {
      state = state_attack_planet;
      spaceBattle = true;
      attackingPlanet = dest;
      sub_state = sub_attack;

      loadAttackScreen();
    }//Ground Battle
    else if (planetOwners[dest] != team2 && planetOwners[dest] != na) {
      spaceBattle = false;
      state = state_attack_planet;
      attackingPlanet = dest;
      sub_state = sub_attack;
      loadAttackScreen();
    }
    saveState();
  }
}

function move() {
  if (soundEnabled) {
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  if (state == state_galaxy_view && canMove && !hasMovedThisTurn) {
    canMove = false;
    hasMovedThisTurn = true;
    setLinesGreySrc();
    if (isTeamLight()) {
      var index = lightPlanets.indexOf(selectedLightFleet[0]);
      lightPlanets[index] = selectedPlanet;
      selectedLightFleet[0] = selectedPlanet;
    }
    else {
      var index = darkPlanets.indexOf(selectedDarkFleet[0]);
      darkPlanets[index] = selectedPlanet;
      selectedDarkFleet[0] = selectedPlanet;
    }
    checkForPlanetAttack(team, selectedPlanet);
    setElements();
    saveState();
  }
}

function help() {
  if (soundEnabled) {
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  if (state == state_galaxy_view || state == state_bonus_view) {
    help_page = 0;
    document.getElementById("help_screen_div").style.display = "block";
    document.getElementById("help_prev_div").style.display = "none";
    document.getElementById("help_ok_div").style.display = "block";
    document.getElementById("help_next_div").style.display = "block";
    if (state == state_galaxy_view) {
      document.getElementById("help_screen_text").innerHTML = help_galaxy_view_content[0];
    }
    else if (state == state_bonus_view) {
      document.getElementById("help_screen_text").innerHTML = help_bonus_view_content[0];
    }
  }
}

function help_prev() {
  if (soundEnabled) {
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  if (state == state_galaxy_view || state == state_bonus_view) {
    if (state == state_galaxy_view) {
      --help_page;
      if (help_page > 6)
        help_page = 6;
      document.getElementById("help_screen_text").innerHTML = help_galaxy_view_content[help_page];
      if (help_page == 6)
        document.getElementById("help_next_div").style.display = "none";
      else
        document.getElementById("help_next_div").style.display = "block";
    }
    else if (state == state_bonus_view) {
      --help_page;
      if (help_page > 2)
        help_page = 2;
      document.getElementById("help_screen_text").innerHTML = help_bonus_view_content[help_page];
      if (help_page == 2)
        document.getElementById("help_next_div").style.display = "none";
      else
        document.getElementById("help_next_div").style.display = "block";
    }
    if (help_page == 0)
      document.getElementById("help_prev_div").style.display = "none";
    else
      document.getElementById("help_prev_div").style.display = "block";
  }
}

function help_next() {
  if (soundEnabled) {
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  if (state == state_galaxy_view || state == state_bonus_view) {
    if (state == state_galaxy_view) {
      ++help_page;
      if (help_page > 6)
        help_page = 6;
      document.getElementById("help_screen_text").innerHTML = help_galaxy_view_content[help_page];
      if (help_page == 6)
        document.getElementById("help_next_div").style.display = "none";
      else
        document.getElementById("help_next_div").style.display = "block";
    }
    else if (state == state_bonus_view) {
      ++help_page;
      if (help_page > 2)
        help_page = 2;
      document.getElementById("help_screen_text").innerHTML = help_bonus_view_content[help_page];
      if (help_page == 2)
        document.getElementById("help_next_div").style.display = "none";
      else
        document.getElementById("help_next_div").style.display = "block";
    }
    if (help_page == 0)
      document.getElementById("help_prev_div").style.display = "none";
    else
      document.getElementById("help_prev_div").style.display = "block";
  }
}

function help_ok() {
  if (soundEnabled) {
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  document.getElementById("help_screen_div").style.display = "none";
}

function build() {
  if (state == state_galaxy_view) {
    if (credits >= fleet_cost) {
      credits -= fleet_cost;
      fleet_cost += 1000;
      if (soundEnabled) {
        sound_fleet_constructed[team].currentTime = 0;
        sound_fleet_constructed[team].play();
      }
      if (isTeamLight()) {
        var index = lightPlanets.indexOf(na);
        lightPlanets[index] = selectedPlanet;
        selectedLightFleet[0] = selectedPlanet;
        selectedLightFleet[1] = "lightFleet" + index;
      }
      else {
        var index = darkPlanets.indexOf(na);
        darkPlanets[index] = selectedPlanet;
        selectedDarkFleet[0] = selectedPlanet;
        selectedDarkFleet[1] = "darkFleet" + index;
      }
      selectPoint(point_index_to_string[selectedPlanet], true);
      setElements();
    }
    else {
      if (soundEnabled) {
        sound_error.currentTime = 0;
        sound_error.play();
      }
    }
    saveState();
  }
}

function getRandomFleet(team2) {
  var potentialFleets = [];
  var i = 0;
  if (isTeamLight(team2)) {
    for (i = 0; i < lightPlanets.length; ++i) {
      if (lightPlanets[i] != na)
        potentialFleets.push(lightPlanets[i]);
    }
  }
  else {
    for (i = 0; i < darkPlanets.length; ++i) {
      if (darkPlanets[i] != na)
        potentialFleets.push(darkPlanets[i]);
    }
  }
  if (potentialFleets.length > 0) {
    var planetIndex = Math.floor(Math.random() * potentialFleets.length);
    if (planetIndex == potentialFleets.length) {
      --planetIndex;
    }
    return potentialFleets[planetIndex];
  }
  return null;
}

function end_turn() {
  if (soundEnabled) {
    sound_select_cancel.currentTime = 0;
    sound_select_cancel.play();
  }
  if (state == state_galaxy_view) {
    console.log("AI Credits: " + ai_credits);
    state = state_ai_moving;
    ai_destination = na;
    var recentlybuilt = build_ai();
    if (countFleets(ai_team) > 0) {
      ai_selectedFleet = getRandomFleet(ai_team);
    }

    setElements();
    if (recentlybuilt) {
      ai_build_animation(2000);
    }
    else {
      ai_build_animation(0);
    }
    saveState();
  }
}

function build_ai() {
  var buildChance = Math.random();
  if (buildChance < 0.5 && ai_credits >= ai_fleet_cost) {
    var potentialBuildSites = [];
    for (var i = 1; i < planetOwners.length; ++i) {
      var planet = i;
      var team3 = planetOwners[i];
      if (isTeamLight()) {
        if (team3 == ai_team && !doesArrayInclude(darkPlanets, planet))
          potentialBuildSites.push(planet);
      }
      else {
        if (team3 == ai_team && !doesArrayInclude(lightPlanets, planet))
          potentialBuildSites.push(planet);
      }
    }
    if (potentialBuildSites.length > 0) {
      var planetIndex = Math.floor(Math.random() * potentialBuildSites.length);
      if (planetIndex == potentialBuildSites.length) {
        --planetIndex;
      }
      var planetToBuildOn = potentialBuildSites[planetIndex];
      ai_credits -= ai_fleet_cost;
      console.log("AI Credits: " + ai_credits + " After Bought Fleet");
      ai_fleet_cost += 1000;
      if (isTeamLight()) {
        var index = darkPlanets.indexOf(na);
        darkPlanets[index] = planetToBuildOn;
        selectedDarkFleet[0] = planetToBuildOn;
        selectedDarkFleet[1] = "darkFleet" + index;
      }
      else {
        var index = lightPlanets.indexOf(na);
        lightPlanets[index] = planetToBuildOn;
        selectedLightFleet[0] = planetToBuildOn;
        selectedLightFleet[1] = "lightFleet" + index;
      }
      ai_selectpoint(planetToBuildOn);
      setElements();
      return true;
    }
  }
  saveState();
  return false;
}

function move_ai(selectedFleet) {
  var currentPoint = selectedFleet;
  foundRoutes = [];
  var numPlayerPlanets = countOwnedPlanets(team);
  if (numPlayerPlanets == 0) {
    var pointsNearby = pointMap.get(currentPoint);
    var index = Math.floor(Math.random() * pointsNearby.length);
    if (index == pointsNearby.length)
      --index;
    ai_destination = pointsNearby[index];
  }
  // console.log("Venator Planets " + lightPlanets);
  var listOfPoints = pointMap.get(currentPoint);
  var i = 0;
  for (i = 0; i < listOfPoints.length; ++i) {
    var foundPoint = listOfPoints[i];
    if ((isTeamLight() && !doesArrayInclude(darkPlanets, foundPoint)) || (!isTeamLight() && !doesArrayInclude(lightPlanets, foundPoint))) {
      if (planetOwners[foundPoint] == team) {
        foundRoutes.push([0, foundPoint]);
      }
      else {
        var traversed = [currentPoint, foundPoint];
        // console.log("Searching " + point_index_to_string[foundPoint] + "\n" + 1);
        searchNodes(foundPoint, foundPoint, traversed, 1);
      }
    }
  }

  if (foundRoutes.length == 1) {
    ai_destination = foundRoutes[0][1];
  }
  else if (foundRoutes.length > 1) {
    i = 0;
    var smallestIndex1 = 0;
    var smallestIndex2 = 0;
    for (i = 0; i < foundRoutes.length; ++i) {
      if (foundRoutes[i][0] < foundRoutes[smallestIndex1][0])
        smallestIndex1 = i;
    }
    for (i = 0; i < foundRoutes.length; ++i) {
      if (i != smallestIndex1 && foundRoutes[i][0] < foundRoutes[smallestIndex2][0])
        smallestIndex2 = i;
    }
    // var index = Math.random();
    // if (index < 0.8) {
    var index = smallestIndex1;
    // }
    // else {
    //   index = smallestIndex2; //Other route makes AI appear unintelligent, disabled
    // }
    ai_destination = foundRoutes[index][1];
  }
  saveState();
}

function searchNodes(point, first, points_traversed, num_traversals) {
  if (num_traversals > 100) {
    console.log("Got to 100 route traversals, returning");
    return;
  }
  var listOfPoints = pointMap.get(point);
  var i = 0;
  for (i = 0; i < listOfPoints.length; ++i) {
    var foundPoint = listOfPoints[i];
    if (!doesArrayInclude(points_traversed, foundPoint) &&
      ((isTeamLight() && !doesArrayInclude(darkPlanets, foundPoint)) || (!isTeamLight() && !doesArrayInclude(lightPlanets, foundPoint)))) {
      if (planetOwners[foundPoint] == team) {
        foundRoutes.push([num_traversals, first]);
      }
      else {
        var new_traversed = [];
        var j = 0;
        for (j = 0; j < points_traversed.length; ++j)
          new_traversed.push(points_traversed[j]);
        new_traversed.push(foundPoint);
        // console.log("Current: " + point_index_to_string[point] + "\nSearching: " + point_index_to_string[foundPoint] + "\nFirst: " + point_index_to_string[first] + "\n" + (num_traversals + 1));
        searchNodes(foundPoint, first, new_traversed, num_traversals + 1);
      }
    }
  }
}

function setLinesGreySrc() {
  var i = 0;
  for (i = 0; i < 33; ++i) {
    document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).src = "galactic_conquest/grey_line.png";
  }
}

function ai_use_bonus() {
  //Increase Difficulty - 600
  //Decrease Battle Points - 400
  ai_bonus = na;
  if (ai_credits >= bonusCreditCosts[ai_increase_difficulty - 1]) {
    if (Math.random() >= 0.5) {
      ai_bonus = ai_increase_difficulty; //=7
      ai_credits -= bonusCreditCosts[ai_increase_difficulty - 1];
    }
    else if (ai_credits >= bonusCreditCosts[ai_sabotage - 1]) {
      ai_bonus = ai_sabotage; //=6
      ai_credits -= bonusCreditCosts[ai_sabotage - 1];
    }
  }
  else if (ai_credits >= bonusCreditCosts[ai_sabotage - 1]) {
    ai_bonus = ai_sabotage;
    ai_credits -= bonusCreditCosts[ai_sabotage - 1];
  }
  console.log("AI Credits: " + ai_credits + " After Bought Bonus");
  // ai_bonus = ai_increase_difficulty; //TODO Remove
  saveState();
}

function loadVictoryDefeat() {
  loadVictoryDefeatAnimationRunning = true;
  sound_theme.pause();
  document.getElementById("victory_div").style.display = "none";
  document.getElementById("defeat_div").style.display = "none";
  document.getElementById("results_text").style.display = "none";
  setTimeout(function () { //Not state sensitive
    loadVictoryDefeatAnimationRunning = false;
    setElements();
  }, 3000);
}

function showAIBonusAnimation() {
  showAIBonusAnimationRunning = true;
  sub_state = sub_attack_settings;
  setTimeout(function () { //Not state sensitive
    showAIBonusAnimationRunning = false;
    setElements();
    loadVictoryDefeat();
  }, 5000);
}

function loadAttackSettingsScreen() {
  if (sub_state == sub_show_ai_bonus) {
    setElements();
    showAIBonusAnimation();
  }
  else {
    sub_state = sub_attack_settings;
    setElements();
    loadVictoryDefeat();
  }
  saveState();
}

function use() {
  if (soundEnabled) {
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  player_bonus = selected_attack_bonus;
  var i = 0;
  var index = 0;
  for (i = 0; i < 3; i++) {
    if (owned_bonuses[i][0] == selected_attack_bonus) {
      index = i;
      break;
    }
  }
  owned_bonuses[index][0] = na;
  owned_bonuses[index][1] = "galactic_conquest/bonus_background.png";
  ai_use_bonus();
  if (ai_bonus != na)
    sub_state = sub_show_ai_bonus;
  setElements();
  loadAttackSettingsScreen();
  saveState();
}

function skip() { //Skip using bonus
  if (soundEnabled) {
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  player_bonus = na;
  ai_use_bonus();
  if (ai_bonus != na)
    sub_state = sub_show_ai_bonus;
  setElements();
  loadAttackSettingsScreen();
  saveState();
}

function countOwnedPlanets(team2) {
  var count = 0;
  var i = 0;
  for (i = 1; i < planetOwners.length; ++i) {
    var team3 = planetOwners[i];
    if (team3 == team2)
      ++count;
  }
  return count;
}

function countFleets(team2) {
  var count = 0;
  if (isTeamLight(team2)) {
    for (var i = 0; i < 26; ++i) {
      if (lightPlanets[i] != na)
        ++count;
    }
  }
  else {
    for (var i = 0; i < 26; ++i) {
      if (darkPlanets[i] != na)
        ++count;
    }
  }
  return count;
}

function getFirstFleetIndex(team2) {
  if (isTeamLight(team2)) {
    for (var i = 0; i < 26; ++i) {
      if (lightPlanets[i] != na)
        return i;
    }
  }
  else {
    for (var i = 0; i < 26; ++i) {
      if (darkPlanets[i] != na)
        return i;
    }
  }
  return 0;
}

function checkForDestroyFleet(point, team2) {
  if (isTeamLight(team2)) {
    if (doesArrayInclude(lightPlanets, point)) {
      lightPlanets[lightPlanets.indexOf(point)] = na;
      // if (team2 == team && soundEnabled) {
      // var index = getRandomNumber(2);
      // sound_fleet_defeated[team][index].currentTime = 0;
      // sound_fleet_defeated[team][index].play();
      // }
      if (countFleets(team2) == 0) {
        lightPlanets[0] = getShipStartPoint(team2);
        checkForPlanetAttack(team2, lightPlanets[0]);
      } else {
        if (team2 == team)
          fleet_cost -= 1000;
        else
          ai_fleet_cost -= 1000;
      }
    }
    if (team2 == team && !doesArrayInclude(lightPlanets, selectedLightFleet[0])) {
      selectPoint(point_index_to_string[lightPlanets[getFirstFleetIndex(team2)]], true);
      setElements();
    }
  }
  else {
    if (doesArrayInclude(darkPlanets, point)) {
      darkPlanets[darkPlanets.indexOf(point)] = na;
      // if (team2 == team && soundEnabled) {
      // var index = getRandomNumber(2);
      // sound_fleet_defeated[team][index].currentTime = 0;
      // sound_fleet_defeated[team][index].play();
      // }
      if (countFleets(team2) == 0) {
        darkPlanets[0] = getShipStartPoint(team2);
        checkForPlanetAttack(team2, darkPlanets[0]);
      } else {
        if (team2 == team)
          fleet_cost -= 1000;
        else
          ai_fleet_cost -= 1000;
      }
    }
    if (team2 == team && !doesArrayInclude(darkPlanets, selectedDarkFleet[0])) {
      selectPoint(point_index_to_string[darkPlanets[getFirstFleetIndex(team2)]], true);
      setElements();
    }
  }
  saveState();
}

function calculateCreditEarnings() {
  playerPlanetaryBonus = 0;
  aiPlanetaryBonus = 0;
  var i = 0;
  for (i = 1; i < planetOwners.length; ++i) {
    var planet = i;
    var team2 = planetOwners[i];
    if (team2 != na) {
      if (team2 == team) {
        playerPlanetaryBonus += planetBonuses.get(planet);
      }
      else {
        aiPlanetaryBonus += planetBonuses.get(planet);
      }
    }
  }

  playerVictoryBonus = 0;
  aiVictoryBonus = 0;
  if (wasVictory) {
    if (planetOwners[attackingPlanet] != na) { //Planet/Space Battle
      playerVictoryBonus = planetVictoryResources.get(attackingPlanet);
      aiVictoryBonus = 200;
    }
    else { //Point Battle
      playerVictoryBonus = 200;
      aiVictoryBonus = 0;
    }
  }
  else {
    if (planetOwners[attackingPlanet] != na) { //Planet/Space Battle
      aiVictoryBonus = planetVictoryResources.get(attackingPlanet);
      playerVictoryBonus = 200;
    }
    else { //Point Battle
      aiVictoryBonus = 200;
      playerVictoryBonus = 0;
    }
  }
  credits += playerPlanetaryBonus + playerVictoryBonus;
  ai_credits += aiPlanetaryBonus + aiVictoryBonus;
  console.log("AI Credits: " + ai_credits + " After Battle");
  saveState();
}

function victory() {
  if (soundEnabled) {
    sound_select_cancel.currentTime = 0;
    sound_select_cancel.play();
    sound_theme.play();
    sound_victory[republic].pause();
    sound_victory[cis].pause();
    sound_defeat.pause();
  }
  if (state == state_attack_planet) {
    wasVictory = true;
    if (planetOwners[attackingPlanet] != na) {
      planetOwners[attackingPlanet] = team;
    }
    calculateCreditEarnings();
    sub_state = sub_credits_results;
    if (isTeamLight()) {
      selectPoint(point_index_to_string[selectedLightFleet[0]], true);
      checkForDestroyFleet(attackingPlanet, ai_team);
      if (countOwnedPlanets(ai_team) == 0) {
        if (soundEnabled) {
          sound_theme.pause();
          sound_victory[team].currentTime = 0;
          sound_victory[team].play();
        }
        state = state_end_game;
      }
    }
    else {
      selectPoint(point_index_to_string[selectedDarkFleet[0]], true);
      checkForDestroyFleet(attackingPlanet, ai_team);
      if (countOwnedPlanets(ai_team) == 0) {
        if (soundEnabled) {
          sound_theme.pause();
          sound_victory[team].currentTime = 0;
          sound_victory[team].play();
        }
        state = state_end_game;
      }
    }
    setElements();
    saveState();
  }
}

function defeat() {
  if (soundEnabled) {
    sound_select_cancel.currentTime = 0;
    sound_select_cancel.play();
    sound_theme.play();
    sound_victory[republic].pause();
    sound_victory[cis].pause();
    sound_defeat.pause();
  }
  if (state == state_attack_planet) {
    wasVictory = false;
    if (planetOwners[attackingPlanet] != na) {
      if (isTeamLight()) {
        planetOwners[attackingPlanet] = ai_team;
        if (countOwnedPlanets(team) == 0) {
          if (soundEnabled) {
            sound_theme.pause();
            sound_defeat.currentTime = 0;
            sound_defeat.play();
          }
          state = state_end_game;
        }
      }
      else {
        planetOwners[attackingPlanet] = ai_team;
        if (countOwnedPlanets(team) == 0) {
          if (soundEnabled) {
            sound_theme.pause();
            sound_defeat.currentTime = 0;
            sound_defeat.play();
          }
          state = state_end_game;
        }
      }
    }
    calculateCreditEarnings();
    sub_state = sub_credits_results;
    selectPoint(point_index_to_string[selectedPlanet], true);
    checkForDestroyFleet(attackingPlanet, team);
    setElements();
    saveState();
  }
}

function credits_results_ok() {
  if (state == state_attack_planet) {
    if (soundEnabled) {
      sound_select_cancel.currentTime = 0;
      sound_select_cancel.play();
      sound_theme.play();
      sound_victory[team].pause();
      sound_victory[ai_team].pause();
      sound_defeat.pause();
    }
    selectPoint(point_index_to_string[selectedPlanet], true);
    document.getElementById("galaxy_all").style.display = "block";
    document.getElementById("credits_results_div").style.display = "none";
    document.getElementById("planet_screen").style.display = "block";
    document.getElementById("team_select").style.display = "none";
    document.getElementById("move_div").style.display = "none";
    document.getElementById("help_div").style.display = "none";
    document.getElementById("build_div").style.display = "none";
    document.getElementById("end_div").style.display = "none";
    document.getElementById("move_mode_div").style.display = "none";
    document.getElementById("bonus_mode_div").style.display = "none";
    document.getElementById("buy_div").style.display = "none";
    document.getElementById("bonus_view_div").style.display = "none";
    document.getElementById("credits_display").style.display = "block";
    document.getElementById("point_description_div").style.display = "none";
    state = state_galaxy_view;
    wipeToGalaxyAnimation(true);
    saveState();
  }
}

function saveState() {
  var daysToExpire = 365;
  setCookie("version", version, daysToExpire);
  setCookie("variableVersion", variableVersion, daysToExpire);
  setCookie("team", team, daysToExpire);
  setCookie("ai_team", ai_team, daysToExpire);
  setCookie("state", state, daysToExpire);
  setCookie("sub_state", sub_state, daysToExpire);
  setCookie("planetOwners", planetOwners, daysToExpire);
  setCookie("selectedPlanet", selectedPlanet, daysToExpire);
  setCookie("attackingPlanet", attackingPlanet, daysToExpire);
  setCookie("selectedLoopId", selectedLoopId, daysToExpire);
  setCookie("darkPlanets", darkPlanets, daysToExpire);
  setCookie("selectedDarkFleet", selectedDarkFleet, daysToExpire);
  setCookie("lightPlanets", lightPlanets, daysToExpire);
  setCookie("selectedLightFleet", selectedLightFleet, daysToExpire);
  setCookie("credits", credits, daysToExpire);
  setCookie("ai_credits", ai_credits, daysToExpire);
  setCookie("fleet_cost", fleet_cost, daysToExpire);
  setCookie("ai_fleet_cost", ai_fleet_cost, daysToExpire);
  setCookie("ai_bonus", ai_bonus, daysToExpire);
  setCookie("player_bonus", player_bonus, daysToExpire);
  setCookie("hasMovedThisTurn", hasMovedThisTurn, daysToExpire);
  setCookie("canMove", canMove, daysToExpire);
  setCookie("owned_bonuses", owned_bonuses, daysToExpire);
  setCookie("selected_attack_bonus", selected_attack_bonus, daysToExpire);
  setCookie("buy_needs_confirmation", buy_needs_confirmation, daysToExpire);
  setCookie("wasVictory", wasVictory, daysToExpire);
  setCookie("playerPlanetaryBonus", playerPlanetaryBonus, daysToExpire);
  setCookie("aiPlanetaryBonus", aiPlanetaryBonus, daysToExpire);
  setCookie("playerVictoryBonus", playerVictoryBonus, daysToExpire);
  setCookie("aiVictoryBonus", aiVictoryBonus, daysToExpire);
  setCookie("ai_destination", ai_destination, daysToExpire);
  setCookie("foundRoutes", foundRoutes, daysToExpire);
  setCookie("ai_selectedFleet", ai_selectedFleet, daysToExpire);
  setCookie("wipeToPlanetAnimationRunning", wipeToPlanetAnimationRunning, daysToExpire);
  setCookie("wipeToGalaxyAnimationRunning", wipeToGalaxyAnimationRunning, daysToExpire);
  setCookie("ai_moving_animation1_running", ai_moving_animation1_running, daysToExpire);
  setCookie("ai_moving_animation2_running", ai_moving_animation2_running, daysToExpire);
  setCookie("loadAttackBonusAnimationRunning", loadAttackBonusAnimationRunning, daysToExpire);
  setCookie("loadVictoryDefeatAnimationRunning", loadVictoryDefeatAnimationRunning, daysToExpire);
  setCookie("ai_building_animation_running", ai_building_animation_running, daysToExpire);
  setCookie("showAIBonusAnimationRunning", showAIBonusAnimationRunning, daysToExpire);
  setCookie("spaceBattle", spaceBattle, daysToExpire);
  setCookie("zoom_level", zoom_level, daysToExpire);
  // console.log("Saved State");
}

function deleteAllCookies() {
  deleteCookie("version");
  deleteCookie("variableVersion");
  deleteCookie("team");
  deleteCookie("state");
  deleteCookie("sub_state");
  deleteCookie("planetOwners");
  deleteCookie("selectedPlanet");
  deleteCookie("attackingPlanet");
  deleteCookie("selectedLoopId");
  deleteCookie("darkPlanets");
  deleteCookie("selectedDarkFleet");
  deleteCookie("lightPlanets");
  deleteCookie("selectedLightFleet");
  deleteCookie("credits");
  deleteCookie("ai_credits");
  deleteCookie("fleet_cost");
  deleteCookie("ai_fleet_cost");
  deleteCookie("ai_bonus");
  deleteCookie("player_bonus");
  deleteCookie("hasMovedThisTurn");
  deleteCookie("canMove");
  deleteCookie("owned_bonuses");
  deleteCookie("selected_attack_bonus");
  deleteCookie("buy_needs_confirmation");
  deleteCookie("wasVictory");
  deleteCookie("playerPlanetaryBonus");
  deleteCookie("aiPlanetaryBonus");
  deleteCookie("playerVictoryBonus");
  deleteCookie("aiVictoryBonus");
  deleteCookie("ai_destination");
  deleteCookie("foundRoutes");
  deleteCookie("ai_selectedFleet");
  deleteCookie("wipeToPlanetAnimationRunning");
  deleteCookie("wipeToGalaxyAnimationRunning");
  deleteCookie("ai_moving_animation1_running");
  deleteCookie("ai_moving_animation2_running");
  deleteCookie("loadAttackBonusAnimationRunning");
  deleteCookie("loadVictoryDefeatAnimationRunning");
  deleteCookie("ai_building_animation_running");
  deleteCookie("showAIBonusAnimationRunning");
  deleteCookie("spaceBattle");
  deleteCookie("zoom_level");
}

function loadState() {
  var versionTemp = getCookie("variableVersion");
  if (versionTemp == variableVersion) {
    team = getCookie("team");
    ai_team = getCookie("ai_team");
    initializeTeams();
    state = getCookie("state");
    sub_state = getCookie("sub_state");
    planetOwners = getCookie("planetOwners");
    selectedPlanet = getCookie("selectedPlanet");
    attackingPlanet = getCookie("attackingPlanet");
    selectedLoopId = getCookie("selectedLoopId");
    darkPlanets = getCookie("darkPlanets");
    selectedDarkFleet = getCookie("selectedDarkFleet");
    lightPlanets = getCookie("lightPlanets");
    selectedLightFleet = getCookie("selectedLightFleet");
    credits = getCookie("credits");
    ai_credits = getCookie("ai_credits");
    fleet_cost = getCookie("fleet_cost");
    ai_fleet_cost = getCookie("ai_fleet_cost");
    ai_bonus = getCookie("ai_bonus");
    player_bonus = getCookie("player_bonus");
    hasMovedThisTurn = getCookie("hasMovedThisTurn");
    canMove = getCookie("canMove");
    owned_bonuses = getCookie("owned_bonuses");
    selected_attack_bonus = getCookie("selected_attack_bonus");
    buy_needs_confirmation = getCookie("buy_needs_confirmation");
    wasVictory = getCookie("wasVictory");
    playerPlanetaryBonus = getCookie("playerPlanetaryBonus");
    aiPlanetaryBonus = getCookie("aiPlanetaryBonus");
    playerVictoryBonus = getCookie("playerVictoryBonus");
    aiVictoryBonus = getCookie("aiVictoryBonus");
    ai_destination = getCookie("ai_destination");
    foundRoutes = getCookie("foundRoutes");
    ai_selectedFleet = getCookie("ai_selectedFleet");
    wipeToPlanetAnimationRunning = getCookie("wipeToPlanetAnimationRunning");
    wipeToGalaxyAnimationRunning = getCookie("wipeToGalaxyAnimationRunning");
    ai_moving_animation1_running = getCookie("ai_moving_animation1_running");
    ai_moving_animation2_running = getCookie("ai_moving_animation2_running");
    loadAttackBonusAnimationRunning = getCookie("loadAttackBonusAnimationRunning");
    loadVictoryDefeatAnimationRunning = getCookie("loadVictoryDefeatAnimationRunning")
    ai_building_animation_running = getCookie("ai_building_animation_running");
    showAIBonusAnimationRunning = getCookie("showAIBonusAnimationRunning");
    spaceBattle = getCookie("spaceBattle");
    zoom_level = getCookie("zoom_level");
    setZoomSizes();
    selectPoint(point_index_to_string[selectedPlanet], true);
    setElements();
    if (wipeToPlanetAnimationRunning) {
      wipeToPlanetAnimationRunning = false;
      wipeToPlanetAnimation(false);
      console.log("Restarting wipeToPlanetAnimation");
    }
    if (wipeToGalaxyAnimationRunning) {
      wipeToGalaxyAnimationRunning = false;
      wipeToGalaxyAnimation(false);
      console.log("Restarting wipeToGalaxyAnimation");
    }
    if (ai_moving_animation1_running) {
      ai_move_animation1(0);
      console.log("Restarting ai_move_animation1");
    }
    if (ai_moving_animation2_running) {
      ai_move_animation2(0);
      console.log("Restarting ai_move_animation2");
    }
    if (loadAttackBonusAnimationRunning) {
      loadAttackBonusAnimation(0);
      console.log("Restarting loadAttackBonusAnimation");
    }
    if (ai_building_animation_running) {
      ai_build_animation(0);
      console.log("Restarting ai_build_animation");
    }
    console.log("AI Credits: " + ai_credits + " After Loading State");
  }
  else {
    saveState();
  }
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      // console.log("Loaded " + cname + " JSON|" + JSON.parse(c.substring(name.length, c.length)) + "|");
      return JSON.parse(c.substring(name.length, c.length));
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  var jvalue = JSON.stringify(cvalue);
  // console.log("Saved " + cname + " JSON|" + jvalue + "|");
  document.cookie = cname + "=" + jvalue + ";" + expires + "; SameSite=Strict; path=/";
}

function deleteCookie(cname) {
  document.cookie = cname + "= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; path=/";
}

function doesArrayInclude(array, item) {
  var i = 0;
  for (i = 0; i < array.length; ++i) {
    if (array[i] == item)
      return true;
  }
  return false;
}

function zoom_out() {
  if (soundEnabled) {
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  zoom_level -= 0.1;
  if (Math.abs(zoom_level - 1) < 0.05)
    zoom_level = 1;
  else if (Math.abs(zoom_level) < 0.05)
    zoom_level = 0.1;
  setZoomSizes();
  saveState();
  console.log("Zoom " + zoom_level);
}

function zoom_in() {
  if (soundEnabled) {
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  zoom_level += 0.1;
  if (Math.abs(zoom_level - 1) < 0.05)
    zoom_level = 1;
  setZoomSizes();
  saveState();
  console.log("Zoom " + zoom_level);
}

function onSoundMouseOver() {
  if (soundEnabled && !cursor_over_button) {
    sound_select.currentTime = 0;
    sound_select.play();
  }
  document.getElementById("sound_button").src = "galactic_conquest/button_glow.png";
  if (soundEnabled)
    document.getElementById("sound_image").src = "galactic_conquest/astromech_head_yellow.gif";
  else
    document.getElementById("sound_image").src = "galactic_conquest/astromech_head_yellow_cross.gif";
  cursor_over_button = true;
}

function onSoundMouseOut() {
  document.getElementById("sound_button").src = "galactic_conquest/button_grey.png";
  if (soundEnabled)
    document.getElementById("sound_image").src = "galactic_conquest/astromech_head_blue.gif";
  else
    document.getElementById("sound_image").src = "galactic_conquest/astromech_head_blue_cross.gif";
  cursor_over_button = false;
}

function sound_toggle() {
  if (soundEnabled) {
    sound_theme.pause();
    sound_victory[republic].pause();
    sound_victory[cis].pause();
    sound_defeat.pause();
    soundEnabled = false;
    document.getElementById("sound_image").src = "galactic_conquest/astromech_head_yellow_cross.gif";
  }
  else {
    // sound_theme = document.getElementById("sound_theme");
    if (state != state_attack_planet && state != state_end_game) {
      sound_theme.play();
      sound_victory[republic].pause();
      sound_victory[cis].pause();
      sound_defeat.pause();
    }
    sound_select_long.currentTime = 0;
    sound_select_long.play();
    soundEnabled = true;
    document.getElementById("sound_image").src = "galactic_conquest/astromech_head_yellow.gif";
  }
}

var num_imgs = 0;
function img_onLoad() {
  ++num_imgs;
  if (num_imgs == 85) {
    document.getElementById("loading_screen").style.display = "none";
    loadSounds();
    console.log("All images loaded");
  }
}

function getRandomNumber(max) {
  var num = Math.floor(Math.random() * (max + 1));
  if (num > max)
    num--;
  return num;
}

function restart() {

  //Testing restart during animations doesn't appear to cause bugs, and these checks sometimes prevent game from being restarted even when the animation isn't running
  // if (!wipeToGalaxyAnimationRunning &&
  //   !loadAttackBonusAnimationRunning &&
  //   !wipeToPlanetAnimationRunning &&
  //   !ai_moving_animation1_running &&
  //   !ai_moving_animation2_running &&
  //   !ai_building_animation_running &&
  //   !loadVictoryDefeatAnimationRunning &&
  //   !showAIBonusAnimationRunning) {

  if (true) {
    if (soundEnabled) {
      sound_theme.play();
      sound_victory[republic].pause();
      sound_victory[cis].pause();
      sound_victory[rebel].pause();
      sound_victory[empire].pause();
      sound_victory[resist].pause();
      sound_victory[firstorder].pause();
      sound_defeat.pause();
    }
    restart_dialogue(false);
    team = republic; //OR cis
    ai_team = cis;
    state = state_team_select; //state_team_select
    sub_state = sub_credits_results;
    planetOwners = [na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na];
    selectedPlanet = geonosis;
    attackingPlanet = geonosis;
    selectedLoopId = "#loop_point1"
    darkPlanets = [na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na];
    selectedDarkFleet = [geonosis, "darkFleet0"];
    lightPlanets = [na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na];
    selectedLightFleet = [kamino, "lightFleet0"];
    credits = startingCredits;
    ai_credits = startingCredits;
    fleet_cost = 1000;
    ai_fleet_cost = 1000;
    ai_bonus = na;
    player_bonus = na;
    hasMovedThisTurn = false;
    canMove = false;
    owned_bonuses = [[na, "galactic_conquest/bonus_background.png"], [na, "galactic_conquest/bonus_background.png"], [na, "galactic_conquest/bonus_background.png"]];
    selected_attack_bonus = na;
    buy_needs_confirmation = false;
    wasVictory = false;
    playerPlanetaryBonus = 0;
    aiPlanetaryBonus = 0;
    playerVictoryBonus = 0;
    aiVictoryBonus = 0;
    ai_destination = na;
    foundRoutes = []; //[[num_traversals, first], ... ]
    ai_selectedFleet = na;
    wipeToPlanetAnimationRunning = false;
    wipeToGalaxyAnimationRunning = false;
    ai_moving_animation1_running = false;
    ai_moving_animation2_running = false;
    loadAttackBonusAnimationRunning = false;
    loadVictoryDefeatAnimationRunning = false;
    ai_building_animation_running = false;
    showAIBonusAnimationRunning = false;
    spaceBattle = false;
    deleteAllCookies();
    var saved_zoom_level = zoom_level;
    zoom_level = 1;
    setZoomSizes();
    onLoadCheck();
    zoom_level = saved_zoom_level;
    setZoomSizes();
  } else {
    if (soundEnabled) {
      sound_error.currentTime = 0;
      sound_error.play();
    }
  }
}

function restart_dialogue(bool) {
  if (bool) {
    if (soundEnabled) {
      sound_select_long.currentTime = 0;
      sound_select_long.play();
    }
    document.getElementById("restart_screen_div").style.display = "block";
  }
  else {
    if (soundEnabled) {
      sound_select_cancel.currentTime = 0;
      sound_select_cancel.play();
    }
    document.getElementById("restart_screen_div").style.display = "none";
  }
}

function onDonateMouseOver() {
  if (soundEnabled && !cursor_over_button) {
    sound_select.currentTime = 0;
    sound_select.play();
  }
  cursor_over_button = true;
  document.getElementById("donate_earth_button").src = "galactic_conquest/donate_button_glow.png";
}

function onDonateMouseOut() {
  cursor_over_button = false;
  document.getElementById("donate_earth_button").src = "galactic_conquest/donate_button_grey.png";
}

function onTeamSelectMouseOver(team2) {
  if (soundEnabled && !cursor_over_button) {
    sound_select.currentTime = 0;
    sound_select.play();
  }
  cursor_over_button = true;
  document.getElementById(team2 + "_button").src = "galactic_conquest/button_glow_long.png";
  document.getElementById(team2 + "_text").style.color = "#F4AE0A";
  document.getElementById(team2 + "_logo").src = "galactic_conquest/" + team2 + "_logo_yellow.png";
}

function onTeamSelectMouseOut(team2) {
  cursor_over_button = false;
  document.getElementById(team2 + "_button").src = "galactic_conquest/button_grey_long.png";
  document.getElementById(team2 + "_text").style.color = "#E5E5E5";
  document.getElementById(team2 + "_logo").src = "galactic_conquest/" + team2 + "_logo_grey.png";
}

function initializeFireBase() {
  if (!fireBaseInitialized) {

    fireBaseInitialized = true;
    // Your web app's Firebase configuration
    // var firebaseConfig = {
    //   apiKey: "AIzaSyCm-6KDwZV1E7pBWakF8h2owJ4kDZxoRuU",
    //   authDomain: "galactic-conquest-d8c93.firebaseapp.com",
    //   databaseURL: "https://galactic-conquest-d8c93.firebaseio.com",
    //   projectId: "galactic-conquest-d8c93",
    //   storageBucket: "galactic-conquest-d8c93.appspot.com",
    //   messagingSenderId: "110915620435",
    //   appId: "1:110915620435:web:c6749efd42baa75f2300a6",
    //   measurementId: "G-YF182CJ109"
    // };

    var config = {
      apiKey: "AIzaSyCm-6KDwZV1E7pBWakF8h2owJ4kDZxoRuU",
      authDomain: "galactic-conquest-d8c93.firebaseapp.com",
      databaseURL: "https://galactic-conquest-d8c93.firebaseio.com",
      storageBucket: "galactic-conquest-d8c93.appspot.com"
    };
    firebase.initializeApp(config);

    // Get a reference to the database service
    database = firebase.database();

    firebase.database().ref('/credits/').once('value').then(function (snapshot) {
      firebaseSnapshot = snapshot;
      // console.log(firebaseSnapshot.val().republic);
      document.getElementById("donate_total_amounts_text").innerHTML = firebaseSnapshot.val().republic + "<br>" + firebaseSnapshot.val().cis + "<br>" + firebaseSnapshot.val().senate;
      document.getElementById("donate_credits_div").style.display = "block";
    });

    // database.ref('credits/').set({
    //   cis: 3,
    //   republic: 1,
    //   senate: 2
    // });
  }
}

function donate() {
  var num = Number(document.getElementById("donate_input").value);
  if (num > 0 && num <= credits) {
    if (soundEnabled) {
      sound_select_cancel.currentTime = 0;
      sound_select_cancel.play();
    }
    credits -= num;
    setElements();
    var toRepublic = Number(firebaseSnapshot.val().republic);
    var toCis = Number(firebaseSnapshot.val().cis);
    var toSenate = Number(firebaseSnapshot.val().senate);
    if (donationTo == "republic")
      toRepublic += num;
    else if (donationTo == "cis")
      toCis += num;
    else
      toSenate += num;

    database.ref('credits/').set({
      cis: toCis,
      republic: toRepublic,
      senate: toSenate
    });
    document.getElementById("donate_total_amounts_text").innerHTML = toRepublic + "<br>" + toCis + "<br>" + toSenate;

    document.getElementById("donate_screen_div").style.display = "none";
    document.getElementById("donate_credits_div").style.display = "none";

    firebase.database().ref('/credits/').once('value').then(function (snapshot) {
      firebaseSnapshot = snapshot;
      document.getElementById("donate_total_amounts_text").innerHTML = firebaseSnapshot.val().republic + "<br>" + firebaseSnapshot.val().cis + "<br>" + firebaseSnapshot.val().senate;
      document.getElementById("donate_credits_div").style.display = "block";
    });
  }
  else {
    if (soundEnabled) {
      sound_error.currentTime = 0;
      sound_error.play();
    }
  }
}

function setDonationTo(name2) {
  if (soundEnabled) {
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  donationTo = name2;
  onDonateToMouseOut("republic");
  onDonateToMouseOut("cis");
  onDonateToMouseOut("senate");
}

function onDonateToMouseOver(name2) {
  if (donationTo != name2) {
    if (soundEnabled && !cursor_over_button) {
      sound_select.currentTime = 0;
      sound_select.play();
    }
    cursor_over_button = true;
    if (name2 == "credits")
      document.getElementById("donate_" + name2 + "_button").src = "galactic_conquest/button_glow.png";
    else
      document.getElementById("donate_" + name2 + "_button").src = "galactic_conquest/button_glow_long.png";
    document.getElementById("donate_" + name2 + "_text").style.color = "#F4AE0A";
    document.getElementById("donate_" + name2 + "_logo").src = "galactic_conquest/" + name2 + "_logo_yellow.png";
  }
}

function onDonateToMouseOut(name2) {
  if (donationTo != name2) {
    cursor_over_button = false;
    if (name2 == "credits")
      document.getElementById("donate_" + name2 + "_button").src = "galactic_conquest/button_grey.png";
    else
      document.getElementById("donate_" + name2 + "_button").src = "galactic_conquest/button_grey_long.png";
    document.getElementById("donate_" + name2 + "_text").style.color = "#E5E5E5";
    document.getElementById("donate_" + name2 + "_logo").src = "galactic_conquest/" + name2 + "_logo_grey.png";
  }
}

function donateCancel() {
  if (soundEnabled) {
    sound_select_cancel.currentTime = 0;
    sound_select_cancel.play();
  }
  document.getElementById("donate_screen_div").style.display = "none";
}

function openDonateTo() {
  if (soundEnabled) {
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  document.getElementById("donate_screen_div").style.display = "block";
}

function isTeamLight(team2) {
  if (team2 != null)
    return team2 == republic || team2 == rebel || team2 == resist;
  return team == republic || team == rebel || team == resist;
}