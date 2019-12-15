//Temps
var sound_theme                                = document.getElementById("sound_theme");
var sound_error                                = document.getElementById("sound_error");
var sound_select                               = document.getElementById("sound_select"); 
var sound_select_cancel                        = document.getElementById("sound_select_cancel");
var sound_select_long                          = document.getElementById("sound_select_long");
var sound_felucia                                    = [document.getElementById("sound_error"), document.getElementById("sound_republic_felucia"                        ), document.getElementById("sound_cis_felucia"                        )];
var sound_fleet_constructed                          = [document.getElementById("sound_error"), document.getElementById("sound_republic_fleet_constructed"              ), document.getElementById("sound_cis_fleet_constructed"              )];
var sound_fleet_defeated                             = [
  [document.getElementById("sound_error"                    ), document.getElementById("sound_error"                    ), document.getElementById("sound_error"                    )], 
  [document.getElementById("sound_republic_fleet_defeated_1"), document.getElementById("sound_republic_fleet_defeated_2"), document.getElementById("sound_republic_fleet_defeated_3")],
  [document.getElementById("sound_cis_fleet_defeated_1"     ), document.getElementById("sound_cis_fleet_defeated_2"     ), document.getElementById("sound_cis_fleet_defeated_3"     )] ];
var sound_geonosis                                   = [document.getElementById("sound_error"), document.getElementById("sound_republic_geonosis"                       ), document.getElementById("sound_cis_geonosis"                       )];
var sound_kamino                                     = [document.getElementById("sound_error"), document.getElementById("sound_republic_kamino"                         ), document.getElementById("sound_cis_kamino"                         )];
var sound_kashyyyk                                   = [document.getElementById("sound_error"), document.getElementById("sound_republic_kashyyyk"                       ), document.getElementById("sound_cis_kashyyyk"                       )];
var sound_movement_cancelled                         = [document.getElementById("sound_error"), document.getElementById("sound_republic_movement_cancelled"             ), document.getElementById("sound_cis_movement_cancelled"             )];
var sound_naboo                                      = [document.getElementById("sound_error"), document.getElementById("sound_republic_naboo"                          ), document.getElementById("sound_cis_naboo"                          )];
var sound_select_a_bonus_for_this_battle             = [document.getElementById("sound_error"), document.getElementById("sound_republic_select_a_bonus_for_this_battle" ), document.getElementById("sound_cis_select_a_bonus_for_this_battle" )];
var sound_select_a_bonus_to_purchase                 = [document.getElementById("sound_error"), document.getElementById("sound_republic_select_a_bonus_to_purchase"     ), document.getElementById("sound_cis_select_a_bonus_to_purchase"     )];
var sound_select_destination                         = [
  [document.getElementById("sound_error"                        ), document.getElementById("sound_error"                        )],
  [document.getElementById("sound_republic_select_destination_1"), document.getElementById("sound_republic_select_destination_2")], 
  [document.getElementById("sound_cis_select_destination_1"     ), document.getElementById("sound_cis_select_destination_2"     )] ];
var sound_select_fleet                               = [
  [document.getElementById("sound_error"                  ), document.getElementById("sound_error"                  ), document.getElementById("sound_error"                  )],
  [document.getElementById("sound_republic_select_fleet_1"), document.getElementById("sound_republic_select_fleet_2"), document.getElementById("sound_republic_select_fleet_3")], 
  [document.getElementById("sound_cis_select_fleet_1"     ), document.getElementById("sound_cis_select_fleet_2"     ), document.getElementById("sound_cis_select_fleet_3"     )] ];
var sound_victory = [document.getElementById("sound_error"), document.getElementById("sound_republic_victory"                       ), document.getElementById("sound_cis_victory"                       )];
var sound_defeat = document.getElementById("sound_defeat");
var cursor_over_button = false;

var imgs_loaded = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
var soundEnabled = false;
var w4PosMap = new Map();
var w4SizeMap = new Map();
var w4FontMap = new Map();
var w4FontElements = [
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
  "ia_location",
  "ia_difficulty",
  "ia_length",
  "ia_points",
  "ia_heroes",
  "ia_difficulty_blue",
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
  "help_next_text"
];

var w4PosSizeElements = [
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
  "venator_attack",
  "dreadnought_attack",
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
  "ia_location",
  "ia_difficulty",
  "ia_length",
  "ia_points",
  "ia_heroes",
  "ia_difficulty_blue",
  "ia_length_blue",
  "ia_points_blue",
  "ia_heroes_blue",
  "ia_difficulty_blue_img",
  "ia_length_blue_img",
  "ia_points_blue_img",
  "ia_heroes_blue_img",
  "ia_difficulty_red",
  "ia_points_red",
  "ia_difficulty_red_img",
  "ia_points_red_img",
  "sf_gamemode",
  "sf_location",
  "sf_sfavailable",
  "sf_playerteamsize",
  "sf_enemyteamsize",
  "sf_playas",
  "sf_difficulty",
  "sf_recharge",
  "sf_sfavailable_blue",
  "sf_playas_blue",
  "sf_difficulty_blue",
  "sf_recharge_blue",
  "sf_sfavailable_blue_img",
  "sf_playas_blue_img",
  "sf_difficulty_blue_img",
  "sf_recharge_blue_img",
  "sf_difficulty_red",
  "sf_recharge_red",
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
  "venator0",
  "venator1",
  "venator2",
  "venator3",
  "venator4",
  "venator5",
  "venator6",
  "venator7",
  "venator8",
  "venator9",
  "venator10",
  "venator11",
  "venator12",
  "venator13",
  "venator14",
  "venator15",
  "venator16",
  "venator17",
  "venator18",
  "venator19",
  "venator20",
  "venator21",
  "venator22",
  "venator23",
  "venator24",
  "venator25",
  "dreadnought0",
  "dreadnought1",
  "dreadnought2",
  "dreadnought3",
  "dreadnought4",
  "dreadnought5",
  "dreadnought6",
  "dreadnought7",
  "dreadnought8",
  "dreadnought9",
  "dreadnought10",
  "dreadnought11",
  "dreadnought12",
  "dreadnought13",
  "dreadnought14",
  "dreadnought15",
  "dreadnought16",
  "dreadnought17",
  "dreadnought18",
  "dreadnought19",
  "dreadnought20",
  "dreadnought21",
  "dreadnought22",
  "dreadnought23",
  "dreadnought24",
  "dreadnought25",
  "republic_home",
  "cis_home",
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
  "point2_point1",
  "point2_point18",
  "point3_point18",
  "point3_felucia",
  "felucia_point17",
  "kashyyyk_point17",
  "point18_kashyyyk",
  "point4_kashyyyk",
  "kashyyyk_point7",
  "point17_kamino",
  "point7_kamino",
  "kamino_point5",
  "point5_geonosis",
  "point6_geonosis",
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
  "point11_naboo",
  "point13_naboo",
  "point13_point14",
  "point15_point13",
  "point1_point15",
  "galaxy",
  "space_background",
  "bonus_owned_background",
  "sound_button",
  "sound_image"
];

var galaxyRot = 0;
var loopSize = 0.2;
var loopOpacity = 1.8;
var animationSpeed = 1000/60;
var wipeAnimation = 0;

var na = 0;
var republic = 1;
var cis = 2;

var point1 = 1;
var point2 = 2;
var point3 = 3;
var point4 = 4;
var point5 = 5;
var point6 = 6;
var point7 = 7;
var point8 = 8;
var point9 = 9;
var point10 = 10;
var point11 = 11;
var point12 = 12;
var point13 = 13;
var point14 = 14;
var point15 = 15;
var point16 = 16;
var point17 = 17;
var point18 = 18;
var felucia =  19;
var geonosis = 20;
var kamino   = 21;
var kashyyyk = 22;
var naboo    = 23;

var num_neutral_points = 18;

//Player
var increase_time = 1;
var decrease_time = 2;
var increase_battle_points = 3;
var disable_enemy_heroes = 4;
var decrease_difficulty = 5;
//AI
var decrease_battle_points = 6;
var increase_difficulty = 7;

var pointPosX = new Map();
var pointPosY = new Map();
var sizePosYDivider = 1000;
var republicStartPoints = [point1];
var cisStartPoints = [point14];

//23 Points
var point_index_to_string = 
             ["na"      ,
              "point1"  ,
              "point2"  ,
              "point3"  ,
              "point4"  ,
              "point5"  ,
              "point6"  ,
              "point7"  ,
              "point8"  ,
              "point9"  ,
              "point10" ,
              "point11" ,
              "point12" ,
              "point13" ,
              "point14" ,
              "point15" ,
              "point16" ,
              "point17" ,
              "point18" ,
              "felucia" ,
              "geonosis",
              "kamino"  ,
              "kashyyyk",
              "naboo"   ];
//33 Point Pairs
var pointPairs = [ [point2 , point1     ], 
                   [point2 , point18    ], 
                   [point3 , point18    ], 
                   [point3 , felucia    ], 
                   [felucia , point17   ], 
                   [kashyyyk , point17  ], 
                   [point18 , kashyyyk  ], 
                   [point4 , kashyyyk   ], 
                   [kashyyyk , point7   ], 
                   [point17 , kamino    ], 
                   [point7 , kamino     ], 
                   [kamino , point5     ], 
                   [point5 , geonosis   ], 
                   [point6 , geonosis   ], 
                   [point7 , point12    ], 
                   [point12 , point6    ], 
                   [point12 , point9    ], 
                   [point6 , point8     ], 
                   [point4 , point12    ], 
                   [point2 , point4     ], 
                   [point1 , point4     ], 
                   [point9 , point8     ], 
                   [point16 , point9    ], 
                   [point10 , point8    ], 
                   [point16 , point10   ], 
                   [point14 , point16   ], 
                   [point11 , point10   ], 
                   [point14 , point11   ],
                   [point11 , naboo     ], 
                   [point13 , naboo     ], 
                   [point13 , point14   ], 
                   [point15 , point13   ], 
                   [point1 , point15    ] ];
          
var pointMap = new Map();

var planetVictoryResources = new Map();
var planetBonuses = new Map();

var bonusSelectPos = [0, 1, 2, 3, 4];
var bonusWidth = [200,200,200,200,200];
var bonusScale = [1,1,1,1,1];
var targetSelectPos = 0; //Target for first image
var bonusAnimationRunning = false;
var selectedBonus = 0;
var republicBonusNames = ["LAAT Troop Insertion", "Negotiations", "LAAT/c Vehicle Insertion", "Bounty Hunters", "Signal Jammer"];
var cisBonusNames = ["HMP Troop Insertion", "Negotiations", "C-9979 Vehicle Insertion", "Bounty Hunters", "Bacta Poisoning"];
var bonusDescriptions = [
"Ground Combat: Increases the length of time the battle lasts<br>Starfighters: Increases the amount of starfighter reinforcements available<br>for both sides", 
"Ground Combat: Decreases the length of time the battle lasts<br>Starfighters: Decreases the amount of starfighter reinforcements available<br>for both sides",
"Ground Combat: Increases rate at which you gain battle points<br>Starfighters: Increases the rate at which your abilities recharge",
"Ground Combat: Prevents enemy heroes from fighting<br>Starfighters: Enables hero starfighters at no cost",
"Reduces combat ability of the enemy (difficulty)",
"Ground Combat: Decreases rate at which you gain battle points<br>Starfighters: Decreases the rate at which your abilities recharge",
"Enhances combat ability of the enemy (difficulty)"];

var bonusDescriptionsStarfighters = [
  "Increases the amount of starfighter reinforcements available for both sides", 
  "Decreases the amount of starfighter reinforcements available for both sides",
  "Increases the rate at which your abilities recharge",
  "Enables hero starfighters at no cost",
  "Reduces combat ability of the enemy (difficulty)",
  "Decreases the rate at which your abilities recharge",
  "Enhances combat ability of the enemy (difficulty)"];

var bonusDescriptionsGround = [
  "Increases the length of time the battle lasts", 
  "Decreases the length of time the battle lasts",
  "Increases rate at which you gain battle points",
  "Prevents enemy heroes from fighting",
  "Reduces combat ability of the enemy (difficulty)",
  "Decreases rate at which you gain battle points",
  "Enhances combat ability of the enemy (difficulty)"];

var bonusCreditCosts = [200, 200, 400, 600 ,600, 400, 600];

var src0a = "galactic_conquest/laat.gif";      
var src1a = "galactic_conquest/negotiations.gif";  
var src2a = "galactic_conquest/laatc.gif";           
var src3a = "galactic_conquest/bounty_hunters.gif";
var src4a = "galactic_conquest/shield_generator.gif"; 

var help_page = 0;  //                                                                                                              <br>                                                 <br>                                                         <br>                                                          <br>                          
var help_galaxy_view_content = ["Galactic Conquest<br>&nbsp&nbsp&nbsp(1/7) ><br>The goal of Galactic Conquest is to construct fleets<br>and navigate them through space as you attempt to<br>conquer the galaxy, one planet at a time.",
                                         "Navigating the Galaxy<br>< (2/7) ><br>Use your arrow keys or swipe your screen to navigate<br>around the galaxy. The [+] and [-] buttons in the top<br>left corner will zoom in and out, giving you close-up<br>views of individual worlds or an all-encompassing<br>galactic view for strategic planning.",
                                              "Planet Ownership<br>< (3/7) ><br>Blue stars represent planets under your control, while<br>red represents planets under enemy control. Smaller<br>white spots are always neutral and represent points in<br>space that can be used to travel between worlds.",
                                                 "Moving Fleets<br>< (4/7) ><br>Select a fleet with a press. When a fleet is selected,<br>a dashed line will indicate its plotted course. Change<br>the direction with your mouse and confirm the move by<br>clicking the [Move] button.",
                                           "Constructing Fleets<br>< (5/7) ><br>Fleets can be constructed on planets you own by selecting<br>the unoccupied planet and pressing [Build]. The <br>first fleet is always free, but the price will increase<br>as more are deployed. A fleet must be moved from a<br>planet before another can be constructed.",
                                               "Earning Credits<br>< (6/7) ><br>Credits are awarded to each side after battle. Planetary<br>battles are worth more than space, the amount varying<br>by planet. Credits are also awarded after planetary<br>battles based on how many planets you own.",
                                         "Upgrades<br>< (7/7)&nbsp&nbsp&nbsp<br>Credits can be used to build additonal fleets and purchase<br>bonuses. Before moving, try accessing these options<br>by pressing their corresponding buttons."];

var help_bonus_view_content = [           "Bonuses<br>&nbsp&nbsp&nbsp(1/3) ><br>Bonuses are inexpensive, but expire after a single use.<br>Up to three of any type can be stored for use, but only<br>one can be used per battle. Browse bonuses by pressing<br>the left and right of the centered bonus, and purchase<br>by pressing [Buy].",
                                            "Purchasing Bonuses<br>< (2/3) ><br>After choosing a bonus, apply it to one of the three<br>slots by pressing the desired slot. Applying a new<br>bonus to an occupied slot will overwrite the original bonus.",
                                    "Using Bonuses<br>< (3/3)&nbsp&nbsp&nbsp<br>Effects and costs of bonuses vary. Learn the best combat<br>situations in which to use each bonus type, and try to<br>keep multiple bonuses in your posession for use under<br>unexpected circumstances."];
//States
var state_team_select   = 1;
var state_galaxy_view   = 2;
var state_bonus_view    = 3;
var state_ai_moving     = 4;
var state_attack_planet = 5;
var state_end_game      = 18;
//Sub States
var sub_buying          = 6;
var sub_kamino_air      = 7;
var sub_ryloth          = 8;
var sub_felucia         = 9;
var sub_geonosis        = 10;
var sub_kamino_ground   = 11;
var sub_kashyyyk        = 12;
var sub_naboo           = 13;
var sub_attack_bonus    = 14;
var sub_show_ai_bonus   = 15;
var sub_attack_settings = 16;
var sub_credits_results = 17;

//Saves
var version                         = 2;
var team                            = republic; //OR cis
var state                           = state_team_select; //state_team_select
var sub_state                       = sub_credits_results;
var planetOwners                    = [na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na];
var selectedPlanet                  = geonosis;
var attackingPlanet                 = geonosis;
var selectedLoopId                  = "#loop_geonosis"
var dreadnoughtPlanets              = [na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na];
var selectedDreadnought             = [geonosis, "dreadnought0"];
var venatorPlanets                  = [na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na];
var selectedVenator                 = [kamino, "venator0"];
var credits                         = 1000;
var ai_credits                      = 1000;
var fleet_cost                      = 1000;
var ai_fleet_cost                   = 1000;
var ai_bonus                        = na;
var player_bonus                    = na;
var hasMovedThisTurn                = false;
var canMove                         = false;
var owned_bonuses                   = [[na, "galactic_conquest/bonus_background.png"], [na, "galactic_conquest/bonus_background.png"], [na, "galactic_conquest/bonus_background.png"]];
var selected_attack_bonus           = na;
var buy_needs_confirmation          = false;
var wasVictory                      = false;
var playerPlanetaryBonus            = 0;
var aiPlanetaryBonus                = 0;
var playerVictoryBonus              = 0;
var aiVictoryBonus                  = 0;
var ai_destination                  = na;
var foundRoutes                     = []; //[[num_traversals, first], ... ]
var ai_selectedFleet                = na;
var wipeToPlanetAnimationRunning    = false;
var wipeToGalaxyAnimationRunning    = false;
var ai_moving_animation1_running    = false;
var ai_moving_animation2_running    = false;
var loadAttackBonusAnimationRunning = false;
var ai_building_animation_running   = false;
var loadVictoryDefeatAnimationRunning = false;
var shoawAIBonusAnimationRunning    = false;
var spaceBattle = false;
var zoom_level = 1;

function onLoadCheck() {
  var i = 0;
  for(i = 0; i < w4PosSizeElements.length; ++i){
    var name = w4PosSizeElements[i];
    var left2 = document.getElementById(name).style.left;
    left2 = Number(left2.substring(0, left2.length - 2));
    var top2 = document.getElementById(name).style.top;
    top2= Number(top2.substring(0, top2.length - 2));

    var width2 = document.getElementById(name).style.width;
    width2 = Number(width2.substring(0, width2.length - 2));
    var height2 = document.getElementById(name).style.height;
    height2 = Number(height2.substring(0, height2.length - 2));
    
    w4PosMap.set(name, [left2, top2]);
    w4SizeMap.set(name, [width2, height2]);
  }
  for(i = 0; i < w4FontElements.length; ++i){
    var name = w4FontElements[i];
    var font2 = document.getElementById(name).style.fontSize;
    font2 = Number(font2.substring(0, font2.length - 2));
    
    w4FontMap.set(name, font2);
  }
  setZoomSizes();
  planetOwners[felucia ] = cis;
  planetOwners[geonosis] = cis;
  planetOwners[kamino  ] = cis;
  planetOwners[kashyyyk] = cis;
  planetOwners[naboo   ] = cis;
  planetOwners[point1  ] = na;
  planetOwners[point2  ] = na;
  planetOwners[point3  ] = na;
  planetOwners[point4  ] = na;
  planetOwners[point5  ] = na;
  planetOwners[point6  ] = na;
  planetOwners[point7  ] = na;
  planetOwners[point8  ] = na;
  planetOwners[point9  ] = na;
  planetOwners[point10 ] = na;
  planetOwners[point11 ] = na;
  planetOwners[point12 ] = na;
  planetOwners[point13 ] = na;
  planetOwners[point14 ] = na;
  planetOwners[point15 ] = na;
  planetOwners[point16 ] = na;
  planetOwners[point17 ] = na;
  planetOwners[point18 ] = na;

  pointPosX.set(felucia , 1985);
  pointPosX.set(geonosis, 1667);
  pointPosX.set(kamino  , 1995);
  pointPosX.set(kashyyyk, 1789);
  pointPosX.set(naboo   ,  544);
  pointPosX.set(point1  , 1207);
  pointPosX.set(point2  , 1496);
  pointPosX.set(point3  , 1852);
  pointPosX.set(point4  , 1514);
  pointPosX.set(point5  , 2010);
  pointPosX.set(point6  , 1468);
  pointPosX.set(point7  , 1748);
  pointPosX.set(point8  , 1267);
  pointPosX.set(point9  , 1206);
  pointPosX.set(point10 ,  876);
  pointPosX.set(point11 ,  757);
  pointPosX.set(point12 , 1478);
  pointPosX.set(point13 ,  702);
  pointPosX.set(point14 ,  933);
  pointPosX.set(point15 , 1019);
  pointPosX.set(point16 , 1028);
  pointPosX.set(point17 , 1900);
  pointPosX.set(point18 , 1723);

  pointPosY.set(felucia ,  725);
  pointPosY.set(geonosis, 1005);
  pointPosY.set(kamino  ,  866);
  pointPosY.set(kashyyyk,  749);
  pointPosY.set(naboo   ,  949);
  pointPosY.set(point1  ,  671);
  pointPosY.set(point2  ,  615);
  pointPosY.set(point3  ,  648);
  pointPosY.set(point4  ,  738);
  pointPosY.set(point5  ,  993);
  pointPosY.set(point6  ,  997);
  pointPosY.set(point7  ,  861);
  pointPosY.set(point8  ,  1096);
  pointPosY.set(point9  ,  954);
  pointPosY.set(point10 ,  1017);
  pointPosY.set(point11 ,  931);
  pointPosY.set(point12 ,  863);
  pointPosY.set(point13 ,  788);
  pointPosY.set(point14 ,  871);
  pointPosY.set(point15 ,  684);
  pointPosY.set(point16 ,  938);
  pointPosY.set(point17 ,  785);
  pointPosY.set(point18 ,  681);

  planetVictoryResources.set(felucia , 500);
  planetVictoryResources.set(geonosis, 1000);
  planetVictoryResources.set(kamino  , 1000);
  planetVictoryResources.set(kashyyyk, 500);
  planetVictoryResources.set(naboo   , 600);

  planetBonuses.set(felucia , 30);
  planetBonuses.set(geonosis, 100);
  planetBonuses.set(kamino  , 100);
  planetBonuses.set(kashyyyk, 30);
  planetBonuses.set(naboo   , 30);

pointMap.set(felucia , [point3, point17]);            
pointMap.set(geonosis, [point5, point6]);          
pointMap.set(kamino  , [point5, point7, point17]);  
pointMap.set(kashyyyk, [point4, point7, point17, point18]);
pointMap.set(point12 , [point4, point6, point7, point9]);
pointMap.set(point1  , [point2, point4, point15]); 
pointMap.set(point2  , [point1, point4, point18]);  
pointMap.set(point3  , [felucia, point18]);            
pointMap.set(point4  , [kashyyyk, point12, point1, point2]);
pointMap.set(point5  , [geonosis, kamino]);
pointMap.set(point6  , [geonosis, point12, point8]);
pointMap.set(point7  , [kamino, kashyyyk, point12]);
pointMap.set(point8  , [point6, point9, point10]);
pointMap.set(point9  , [point12, point8, point16]);
pointMap.set(point10 , [point8, point11, point16]);
pointMap.set(point11 , [point10, naboo, point14]);
pointMap.set(naboo   , [point11, point13]);         
pointMap.set(point13 , [naboo, point14, point15]);
pointMap.set(point14 , [point11, point13, point16]);
pointMap.set(point15 , [point1, point13]);          
pointMap.set(point16 , [point9, point10, point14]);
pointMap.set(point17 , [felucia, kamino, kashyyyk]);
pointMap.set(point18 , [kashyyyk, point2, point3]);

  //Generate lines
  i = 0;
  for(i = 0; i < 33; ++i){
    var size0 = (pointPosY.get(pointPairs[i][0])/sizePosYDivider) * 100;
    var halfsize0 = size0/2;
    var size1 = (pointPosY.get(pointPairs[i][1])/sizePosYDivider) * 100;
    var halfsize1 = size1/2;
    document.getElementById(point_index_to_string[pointPairs[i][0]]).style.width  = (size0 * zoom_level) + "px";
    document.getElementById(point_index_to_string[pointPairs[i][0]]).style.height = (size0 * zoom_level) + "px";
    document.getElementById(point_index_to_string[pointPairs[i][1]]).style.width  = (size1 * zoom_level) + "px";
    document.getElementById(point_index_to_string[pointPairs[i][1]]).style.height = (size1 * zoom_level) + "px";
    w4SizeMap.set(point_index_to_string[pointPairs[i][0]], [size0, size0]);
    w4SizeMap.set(point_index_to_string[pointPairs[i][1]], [size1, size1]);
    document.getElementById("loop_" + point_index_to_string[pointPairs[i][0]]).style.width  = (size0 * zoom_level) + "px";
    document.getElementById("loop_" + point_index_to_string[pointPairs[i][0]]).style.height = (size0 * zoom_level) + "px";
    document.getElementById("loop_" + point_index_to_string[pointPairs[i][1]]).style.width  = (size1 * zoom_level) + "px";
    document.getElementById("loop_" + point_index_to_string[pointPairs[i][1]]).style.height = (size1 * zoom_level) + "px";
    w4SizeMap.set("loop_" + point_index_to_string[pointPairs[i][0]], [size0, size0]);
    w4SizeMap.set("loop_" + point_index_to_string[pointPairs[i][1]], [size1, size1]);
    var x0 = pointPosX.get(pointPairs[i][0]) + halfsize0;
    var x1 = pointPosX.get(pointPairs[i][1]) + halfsize1;
    var y0 = pointPosY.get(pointPairs[i][0]) + halfsize0;
    var y1 = pointPosY.get(pointPairs[i][1]) + halfsize1;
    var xdist = x0 - x1;
    var ydist = y0 - y1;
    var dist = Math.floor(Math.sqrt(xdist * xdist + ydist * ydist));
    document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.width  = (dist * 2 * zoom_level) + "px";
    document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.height = (3 * zoom_level) + "px";
    w4SizeMap.set(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]], [dist * 2, 3]);
    // document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.left  = ((Math.floor(xdist/2) + x1) * zoom_level) + "px";
    // document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.top   = ((Math.floor(ydist/2) + y1) * zoom_level) + "px";
    document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.left  = ((x1 - dist) * zoom_level) + "px";
    document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.top   = (y1 * zoom_level) + "px";
    w4PosMap.set( point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]], [x1 - dist, y1]);
    // document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.transform = "translateX(" + dist/-2 + "px) rotate(" + ((Math.atan(xdist/ydist) * (-180/Math.PI)) - 90) + "deg)";
    document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.transform = "rotate(" + ((Math.atan(xdist/ydist) * (-180/Math.PI)) - 90) + "deg)";
  
  }

  dreadnoughtPlanets[0] = getShipStartPoint(cis);
  venatorPlanets[0] = getShipStartPoint(republic);
  selectedDreadnought[0] = dreadnoughtPlanets[0];
  selectedVenator[0] = venatorPlanets[0];
  setElements();
  loadState();
}

function setZoomSizes(){
  var i = 0;
  for(i = 0; i < w4PosSizeElements.length; ++i){
    var name = w4PosSizeElements[i];
    var pos = w4PosMap.get(name);
    var size = w4SizeMap.get(name);
    document.getElementById(name).style.left   = (pos[0] * zoom_level) + "px";
    document.getElementById(name).style.top    = (pos[1] * zoom_level) + "px";
    document.getElementById(name).style.width  = (size[0] * zoom_level) + "px";
    document.getElementById(name).style.height = (size[1] * zoom_level) + "px";
    document.getElementById(name).style.clip = "";
  }

  for(i = 0; i < w4FontElements.length; ++i){
    var name = w4FontElements[i];
    var font = w4FontMap.get(name);
    document.getElementById(name).style.fontSize   = (font * zoom_level) + "px";
  }
}
// function getRandomPoint(){
//   var num = Math.floor(Math.random() * points.length);
//   if(num == points.length)
//      --num;
//   return points[num];
// }

function getShipStartPoint(team2){
  if(team2 == republic){
    var num = Math.floor(Math.random() * republicStartPoints.length);
    if(num == republicStartPoints.length)
      --num;
    return republicStartPoints[num];
  }
  else{
    var num = Math.floor(Math.random() * cisStartPoints.length);
    if(num == cisStartPoints.length)
      --num;
    return cisStartPoints[num];
  }
}


$(document).ready(function(){

function galaxy_Rotate_Anim(){
        $("#galaxy").css("transform","scaleX(1.5) scaleY(.6) rotate(" + galaxyRot + "deg)");
        galaxyRot -= 0.05;
        if(galaxyRot < -1080)
          galaxyRot = -0.05;
        setTimeout(function(){
         galaxy_Rotate_Anim();
       }, animationSpeed);
    }

    function selectedPlanetLoop(){
        $(selectedLoopId).css("transform","scaleX(" + loopSize + ") scaleY(" + loopSize + ")");
        $(selectedLoopId).css("opacity",loopOpacity);
        loopSize += 0.01;
        loopOpacity -= 0.02;
        if(loopSize > 1){
          loopSize = 0.2;
          loopOpacity = 1.8;
        }
        setTimeout(function(){
          selectedPlanetLoop();
       }, animationSpeed);
    }

 selectedPlanetLoop();
 galaxy_Rotate_Anim();

});

function setElements(){
  var i = 0;
  for(i = 0; i < venatorPlanets.length; ++i){
    document.getElementById("venator" + i).style.display = "none";
    if(venatorPlanets[i] != na){
      var venator = document.getElementById("venator" + i);
      var x = pointPosX.get(venatorPlanets[i]);
      var y = pointPosY.get(venatorPlanets[i]);
      var size = Math.floor((y * 150)/sizePosYDivider);
      venator.style.left = ((x + 30) * zoom_level) + "px";
      venator.style.top  = ((y - 20) * zoom_level) + "px";
      w4PosMap.set("venator" + i, [x + 30, y - 20]);
      venator.style.height = (size * zoom_level) + "px";
      venator.style.width =  (size * zoom_level) + "px";
      w4SizeMap.set("venator" + i, [size, size]);
      venator.style.zIndex = y;
      venator.style.display = "block";
    }
  }

  i = 0;
  for(i = 0; i < dreadnoughtPlanets.length; ++i){
    document.getElementById("dreadnought" + i).style.display = "none";
    if(dreadnoughtPlanets[i] != na){
      var dread = document.getElementById("dreadnought" + i);
      x = pointPosX.get(dreadnoughtPlanets[i]);
      y = pointPosY.get(dreadnoughtPlanets[i]);
      size = Math.floor((y * 200)/sizePosYDivider);
      dread.style.left = ((x - 40) * zoom_level) + "px";
      dread.style.top  = ((y - 30) * zoom_level) + "px";
      w4PosMap.set("dreadnought" + i, [x - 40, y - 30]);
      dread.style.height = (size * zoom_level) + "px";
      dread.style.width =  (size * zoom_level) + "px";
      w4SizeMap.set("dreadnought" + i, [size, size]);
      dread.style.zIndex = y;
      dread.style.display = "block";
    }
  }

    for (i = 1; i < planetOwners.length; ++i) {
      var planet = i;
      var team2 = planetOwners[i];
      if(team2 != na){
        if(team2 == team){
          document.getElementById(point_index_to_string[planet]).src="galactic_conquest/blue_planet_idle.png";
          document.getElementById("loop_" + point_index_to_string[planet]).src="galactic_conquest/blue_planet_loop.png";
        }
        else{
          document.getElementById(point_index_to_string[planet]).src="galactic_conquest/red_planet_idle.png";
          document.getElementById("loop_" + point_index_to_string[planet]).src="galactic_conquest/red_planet_loop.png";
        }
      }
    }
    document.getElementById("loop_" + point_index_to_string[selectedPlanet]).style.display = "block";
    setLineStyles(selectedPlanet, selectedPlanet);

    if(state == state_team_select){
      document.getElementById("galaxy_all").style.display =            "block";
      document.getElementById("planet_screen").style.display =         "none";
      document.getElementById("team_select").style.display =           "block";
      document.getElementById("move_div").style.display =              "none";
      document.getElementById("help_div").style.display =              "none";
      document.getElementById("build_div").style.display =             "none";
      document.getElementById("end_div").style.display =               "none";
      document.getElementById("move_mode_div").style.display =         "none";
      document.getElementById("bonus_mode_div").style.display =        "none";
      document.getElementById("buy_div").style.display =               "none";
      document.getElementById("bonus_view_div").style.display =        "none";
      document.getElementById("credits_display").style.display =       "none";
      document.getElementById("point_description_div").style.display = "none";
      document.getElementById("end_game_div").style.display =          "none";
    }
    else if(state == state_galaxy_view){
      document.getElementById("galaxy_all").style.display =            "block";
      document.getElementById("planet_screen").style.display =         "none";
      document.getElementById("team_select").style.display =           "none";
      if(canMove && !hasMovedThisTurn)
        document.getElementById("move_div").style.display =            "block";
      else
        document.getElementById("move_div").style.display =            "none";
      document.getElementById("help_div").style.display =              "block";
      if(doesArrayInclude(venatorPlanets, selectedPlanet) || doesArrayInclude(dreadnoughtPlanets, selectedPlanet) || planetOwners[selectedPlanet] != team)
        document.getElementById("build_div").style.display =           "none";
      else
        document.getElementById("build_div").style.display =           "block";
      document.getElementById("end_div").style.display =               "block";
      document.getElementById("move_mode_div").style.display =         "block";
      document.getElementById("bonus_mode_div").style.display =        "block";
      document.getElementById("buy_div").style.display =               "none";
      document.getElementById("bonus_view_div").style.display =        "none";
      document.getElementById("credits_display").style.display =       "block";
      document.getElementById("point_description_div").style.display = "block";

      document.getElementById("move_mode_button").src="galactic_conquest/button_glow_long.png";
      document.getElementById("move_mode_text").style.color="#F4AE0A";
      document.getElementById("bonus_mode_button").src="galactic_conquest/button_grey_long.png";
      document.getElementById("bonus_mode_text").style.color="#E5E5E5";
      document.getElementById("end_game_div").style.display =          "none";
    }
    else if(state == state_bonus_view){
      document.getElementById("galaxy_all").style.display =            "block";
      document.getElementById("planet_screen").style.display =         "none";
      document.getElementById("team_select").style.display =           "none";
      document.getElementById("move_div").style.display =              "none";
      document.getElementById("build_div").style.display =             "none";
      document.getElementById("end_div").style.display =               "none";
      document.getElementById("bonus_view_div").style.display =        "block";
      document.getElementById("credits_display").style.display =       "block";
      document.getElementById("point_description_div").style.display = "none";

      document.getElementById("bonus_mode_button").src="galactic_conquest/button_glow_long.png";
      document.getElementById("bonus_mode_text").style.color="#F4AE0A";
      document.getElementById("move_mode_button").src="galactic_conquest/button_grey_long.png";
      document.getElementById("move_mode_text").style.color="#E5E5E5";
      document.getElementById("end_game_div").style.display =          "none";
      if(sub_state == sub_buying){
        document.getElementById("bonus0_img"    ).style.display = "none";
        document.getElementById("bonus1_img"    ).style.display = "none";
        document.getElementById("bonus2_img"    ).style.display = "none";
        document.getElementById("bonus3_img"    ).style.display = "none";
        document.getElementById("bonus4_img"    ).style.display = "none";
        document.getElementById("buy_div"       ).style.display = "none";
        document.getElementById("help_div"      ).style.display = "none";
        document.getElementById("move_mode_div" ).style.display = "none";
        document.getElementById("bonus_mode_div").style.display = "none";
        document.getElementById("bonus_name").innerHTML = "";
        document.getElementById("bonus_cost").innerHTML = "";
        document.getElementById("bonus_description").innerHTML = "Select a slot";
      }
      else{
        document.getElementById("bonus0_img"    ).style.display = "block";
        document.getElementById("bonus1_img"    ).style.display = "block";
        document.getElementById("bonus2_img"    ).style.display = "block";
        document.getElementById("bonus3_img"    ).style.display = "block";
        document.getElementById("bonus4_img"    ).style.display = "block";
        document.getElementById("buy_div"       ).style.display = "block";
        document.getElementById("help_div"      ).style.display = "block";
        document.getElementById("move_mode_div" ).style.display = "block";
        document.getElementById("bonus_mode_div").style.display = "block";
      }
    }
    else if(state == state_ai_moving){
      document.getElementById("galaxy_all").style.display =            "block";
      document.getElementById("planet_screen").style.display =         "none";
      document.getElementById("team_select").style.display =           "none";
      document.getElementById("move_div").style.display =              "none";
      document.getElementById("help_div").style.display =              "none";
      document.getElementById("build_div").style.display =             "none";
      document.getElementById("end_div").style.display =               "none";
      document.getElementById("move_mode_div").style.display =         "none";
      document.getElementById("bonus_mode_div").style.display =        "none";
      document.getElementById("buy_div").style.display =               "none";
      document.getElementById("bonus_view_div").style.display =        "none";
      document.getElementById("credits_display").style.display =       "block";
      document.getElementById("point_description_div").style.display = "none";
      document.getElementById("end_game_div").style.display =          "none";
    }
    else if(state == state_end_game){
      document.getElementById("galaxy_all").style.display =            "none";
      document.getElementById("planet_screen").style.display =         "none";
      document.getElementById("team_select").style.display =           "none";
      document.getElementById("move_div").style.display =              "none";
      document.getElementById("help_div").style.display =              "none";
      document.getElementById("build_div").style.display =             "none";
      document.getElementById("end_div").style.display =               "none";
      document.getElementById("move_mode_div").style.display =         "none";
      document.getElementById("bonus_mode_div").style.display =        "none";
      document.getElementById("buy_div").style.display =               "none";
      document.getElementById("bonus_view_div").style.display =        "none";
      document.getElementById("credits_display").style.display =       "none";
      document.getElementById("point_description_div").style.display = "none";
      document.getElementById("end_game_div").style.display =          "block";
      if(team == republic){
        if(countOwnedPlanets(republic) == 0)
            document.getElementById("end_game_img").src = "galactic_conquest/defeat_republic.png";
        if(countOwnedPlanets(cis) == 0)
            document.getElementById("end_game_img").src = "galactic_conquest/victory_republic.png";
      }
      else{
        if(countOwnedPlanets(republic) == 0)
            document.getElementById("end_game_img").src = "galactic_conquest/victory_cis.png";
        if(countOwnedPlanets(cis) == 0)
            document.getElementById("end_game_img").src = "galactic_conquest/defeat_cis.png";
      }
    }
    else if(state == state_attack_planet){
      document.getElementById("bonus_attack_ai_div").style.display = "none";
      document.getElementById("bonus_attack_div").style.display = "none";
      document.getElementById("attack_settings_div").style.display = "none";
      document.getElementById("credits_results_div").style.display = "none";
      document.getElementById("end_game_div").style.display =        "none";

      document.getElementById("planet_screen").style.display =          "block";

      if(doesArrayInclude(venatorPlanets, attackingPlanet))
        document.getElementById("venator_attack").style.display = "block";
      else
        document.getElementById("venator_attack").style.display = "none";

      if(doesArrayInclude(dreadnoughtPlanets, attackingPlanet))
        document.getElementById("dreadnought_attack").style.display = "block";
      else
        document.getElementById("dreadnought_attack").style.display = "none";

      if(attackingPlanet == kamino && spaceBattle /*&& doesArrayInclude(venatorPlanets, kamino) && doesArrayInclude(dreadnoughtPlanets, kamino)*/) {
        document.getElementById("attack_planet_background").src = "galactic_conquest/kamino_air.png";
        document.getElementById("venator_attack").src = "galactic_conquest/venator_reverse.png";
      }
      else if(/*attackingPlanet < 19 && */ spaceBattle) {
        document.getElementById("attack_planet_background").src = "galactic_conquest/ryloth.png";
        document.getElementById("venator_attack").src = "galactic_conquest/venator.png";
      }
      else if(attackingPlanet == felucia){
        document.getElementById("attack_planet_background").src = "galactic_conquest/felucia.png";
        document.getElementById("venator_attack").src = "galactic_conquest/venator_reverse.png";
      }
      else if(attackingPlanet == geonosis){
        document.getElementById("attack_planet_background").src = "galactic_conquest/geonosis.png";
        document.getElementById("venator_attack").src = "galactic_conquest/venator.png";
      }
      else if(attackingPlanet == kamino){
        document.getElementById("attack_planet_background").src = "galactic_conquest/kamino_ground.png";
        document.getElementById("venator_attack").src = "galactic_conquest/venator_reverse.png";
      }
      else if(attackingPlanet == kashyyyk){
        document.getElementById("attack_planet_background").src = "galactic_conquest/kashyyyk.png";
        document.getElementById("venator_attack").src = "galactic_conquest/venator.png";
      }
      else if(attackingPlanet == naboo){ //Naboo
        document.getElementById("attack_planet_background").src = "galactic_conquest/naboo.png";
        document.getElementById("venator_attack").src = "galactic_conquest/venator_reverse.png";
      }
      // if(sub_state == sub_kamino_air){
      //   document.getElementById("attack_planet_background").src = "galactic_conquest/kamino_air.png";
      //   document.getElementById("venator_attack").src = "galactic_conquest/venator_reverse.png";
      // }
      // else if(sub_state == sub_ryloth){
      //   document.getElementById("attack_planet_background").src = "galactic_conquest/ryloth.png";
      //   document.getElementById("venator_attack").src = "galactic_conquest/venator.png";
      // }
      // else if(sub_state == sub_felucia){
      //   document.getElementById("attack_planet_background").src = "galactic_conquest/felucia.png";
      //   document.getElementById("venator_attack").src = "galactic_conquest/venator_reverse.png";
      // }
      // else if(sub_state == sub_geonosis){
      //   document.getElementById("attack_planet_background").src = "galactic_conquest/geonosis.png";
      //   document.getElementById("venator_attack").src = "galactic_conquest/venator.png";
      // }
      // else if(sub_state == sub_kamino_ground){
      //   document.getElementById("attack_planet_background").src = "galactic_conquest/kamino_ground.png";
      //   document.getElementById("venator_attack").src = "galactic_conquest/venator_reverse.png";
      // }
      // else if(sub_state == sub_kashyyyk){
      //   document.getElementById("attack_planet_background").src = "galactic_conquest/kashyyyk.png";
      //   document.getElementById("venator_attack").src = "galactic_conquest/venator.png";
      // }
      // else if(sub_state == sub_naboo){ //Naboo
      //   document.getElementById("attack_planet_background").src = "galactic_conquest/naboo.png";
      //   document.getElementById("venator_attack").src = "galactic_conquest/venator_reverse.png";
      // }
      
      if(sub_state == sub_attack_bonus){
        document.getElementById("galaxy_all").style.display =             "none";
        document.getElementById("bonus_attack_div").style.display = "block";
        document.getElementById("bonus_attack_ai_div").style.display = "none";
        document.getElementById("attack_settings_div").style.display = "none";
      }
      else if(sub_state == sub_show_ai_bonus){
        document.getElementById("bonus_attack_div").style.display = "none";
        document.getElementById("bonus_attack_ai_div").style.display = "block";
        document.getElementById("attack_settings_div").style.display = "none";
        if(ai_bonus == increase_difficulty){
          if(team == republic){
            document.getElementById("bonus_attack_ai_owned").src = "galactic_conquest/techno_union_border.gif";
            document.getElementById("bonus_attack_ai_name").innerHTML = "Enemy used Techno Union Bribery";
          }
          else{
            document.getElementById("bonus_attack_ai_owned").src = "galactic_conquest/commando_border.gif";
            document.getElementById("bonus_attack_ai_name").innerHTML = "Enemy used Special Training";
          }
        }
        else{
            document.getElementById("bonus_attack_ai_owned").src = "galactic_conquest/seismic_charge_border.gif";
            document.getElementById("bonus_attack_ai_name").innerHTML = "Enemy used Vehicle Sabotage";
        }
        if(doesArrayInclude(dreadnoughtPlanets, attackingPlanet) && doesArrayInclude(venatorPlanets, attackingPlanet)){
          document.getElementById("bonus_attack_ai_description").innerHTML = bonusDescriptionsStarfighters[ai_bonus - 1];
        }
        else{
          document.getElementById("bonus_attack_ai_description").innerHTML = bonusDescriptionsGround[ai_bonus - 1];
        }
      }
      else if(sub_state == sub_attack_settings)
      { 
        document.getElementById("victory_div" ).style.display = "block";
        document.getElementById("defeat_div"  ).style.display = "block";
        document.getElementById("results_text").style.display = "block";

        document.getElementById("sf_gamemode"      ).style.display = "none";
        document.getElementById("sf_location"      ).style.display = "none";
        document.getElementById("sf_sfavailable"   ).style.display = "none";
        document.getElementById("sf_playerteamsize").style.display = "none";
        document.getElementById("sf_enemyteamsize" ).style.display = "none";
        document.getElementById("sf_playas"        ).style.display = "none";
        document.getElementById("sf_difficulty"    ).style.display = "none";
        document.getElementById("sf_recharge"      ).style.display = "none";
        document.getElementById("sf_sfavailable_blue"    ).style.display = "none";
        document.getElementById("sf_playas_blue"         ).style.display = "none";
        document.getElementById("sf_difficulty_blue"     ).style.display = "none";
        document.getElementById("sf_recharge_blue"       ).style.display = "none";
        document.getElementById("sf_sfavailable_blue_img").style.display = "none";
        document.getElementById("sf_playas_blue_img"     ).style.display = "none";
        document.getElementById("sf_difficulty_blue_img" ).style.display = "none";
        document.getElementById("sf_recharge_blue_img"   ).style.display = "none";
        document.getElementById("sf_difficulty_red"      ).style.display = "none";
        document.getElementById("sf_recharge_red"        ).style.display = "none";
        document.getElementById("sf_difficulty_red_img"  ).style.display = "none";
        document.getElementById("sf_recharge_red_img"    ).style.display = "none";

        document.getElementById("ia_location"  ).style.display = "none";
        document.getElementById("ia_difficulty").style.display = "none";
        document.getElementById("ia_length"    ).style.display = "none";
        document.getElementById("ia_points"    ).style.display = "none";
        document.getElementById("ia_heroes"    ).style.display = "none";
        document.getElementById("ia_difficulty_blue"     ).style.display = "none";
        document.getElementById("ia_length_blue"         ).style.display = "none";
        document.getElementById("ia_points_blue"         ).style.display = "none";
        document.getElementById("ia_heroes_blue"         ).style.display = "none";
        document.getElementById("ia_difficulty_blue_img" ).style.display = "none";
        document.getElementById("ia_length_blue_img"     ).style.display = "none";
        document.getElementById("ia_points_blue_img"     ).style.display = "none";
        document.getElementById("ia_heroes_blue_img"     ).style.display = "none";
        document.getElementById("ia_difficulty_red"      ).style.display = "none";
        document.getElementById("ia_points_red"          ).style.display = "none";
        document.getElementById("ia_difficulty_red_img"  ).style.display = "none";
        document.getElementById("ia_points_red_img"      ).style.display = "none";

        document.getElementById("bonus_attack_div").style.display = "none";
        document.getElementById("bonus_attack_ai_div").style.display = "none";
        document.getElementById("attack_settings_div").style.display = "block";
         //Starfighters
        if(doesArrayInclude(dreadnoughtPlanets, attackingPlanet) && doesArrayInclude(venatorPlanets, attackingPlanet)){
          document.getElementById("attack_settings_img").src = "galactic_conquest/starfighter_team_battle.png";
          document.getElementById("sf_gamemode"      ).style.display = "block";
          document.getElementById("sf_location"      ).style.display = "block";
          document.getElementById("sf_sfavailable"   ).style.display = "block";
          document.getElementById("sf_playerteamsize").style.display = "block";
          document.getElementById("sf_enemyteamsize" ).style.display = "block";
          document.getElementById("sf_playas"        ).style.display = "block";
          document.getElementById("sf_difficulty"    ).style.display = "block";
          document.getElementById("sf_recharge"      ).style.display = "block";

          if(attackingPlanet != kamino)
            document.getElementById("sf_location"      ).innerHTML = "RYLOTH";
          else
            document.getElementById("sf_location"      ).innerHTML = "KAMINO";

          document.getElementById("sf_sfavailable"   ).innerHTML = "100";
          if(player_bonus == increase_time)
            document.getElementById("sf_sfavailable"   ).innerHTML = "200";
          if(player_bonus == decrease_time)
            document.getElementById("sf_sfavailable"   ).innerHTML = "50";

          if(player_bonus == disable_enemy_heroes)
            document.getElementById("sf_playas"        ).innerHTML = "FREE FOR ALL";
          else
            document.getElementById("sf_playas"        ).innerHTML = "DEFAULT";

          document.getElementById("sf_difficulty"    ).innerHTML = "NORMAL";
          if(player_bonus == decrease_difficulty && ai_bonus != increase_difficulty)
            document.getElementById("sf_difficulty"    ).innerHTML = "ROOKIE";
          else if(player_bonus != decrease_difficulty && ai_bonus == increase_difficulty)
            document.getElementById("sf_difficulty"    ).innerHTML = "EXPERT";

          document.getElementById("sf_recharge"      ).innerHTML = "DEFAULT";
          if(player_bonus == increase_battle_points && ai_bonus != decrease_battle_points)
            document.getElementById("sf_recharge"      ).innerHTML = "FAST";
          else if(player_bonus != increase_battle_points && ai_bonus == decrease_battle_points)
            document.getElementById("sf_recharge"      ).innerHTML = "SLOW";

          if(team == republic){
            switch(player_bonus){
              case increase_time:
                document.getElementById("sf_sfavailable_blue").style.display = "block";
                document.getElementById("sf_sfavailable_blue_img").style.display = "block";
                document.getElementById("sf_sfavailable_blue_img").src = "galactic_conquest/laat.gif";
              break;
              case decrease_time:
                document.getElementById("sf_sfavailable_blue").style.display = "block";
                document.getElementById("sf_sfavailable_blue_img").style.display = "block";
                document.getElementById("sf_sfavailable_blue_img").src = "galactic_conquest/negotiations.gif";
              break;
              case increase_battle_points:
                document.getElementById("sf_recharge_blue").style.display = "block";
                document.getElementById("sf_recharge_blue_img").style.display = "block";
                document.getElementById("sf_recharge_blue_img").src = "galactic_conquest/laatc.gif";
              break;
              case disable_enemy_heroes:
                document.getElementById("sf_playas_blue").style.display = "block";
                document.getElementById("sf_playas_blue_img").style.display = "block";
                document.getElementById("sf_playas_blue_img").src = "galactic_conquest/bounty_hunters.gif";
              break;
              case decrease_difficulty:
                document.getElementById("sf_difficulty_blue").style.display = "block";
                document.getElementById("sf_difficulty_blue_img").style.display = "block";
                document.getElementById("sf_difficulty_blue_img").src = "galactic_conquest/shield_generator.gif";
              break;
            }
            switch(ai_bonus){ //CIS AI
              case increase_difficulty:
                document.getElementById("sf_difficulty_red").style.display = "block";
                document.getElementById("sf_difficulty_red_img").style.display = "block";
                document.getElementById("sf_difficulty_red_img").src = "galactic_conquest/techno_union.gif";
              break;
              case decrease_battle_points:
                document.getElementById("sf_recharge_red").style.display = "block";
                document.getElementById("sf_recharge_red_img").style.display = "block";
                document.getElementById("sf_recharge_red_img").src = "galactic_conquest/seismic_charge.gif";
              break;
            }
          }
          else { //CIS
            switch(player_bonus){
              case increase_time:
                document.getElementById("sf_sfavailable_blue").style.display = "block";
                document.getElementById("sf_sfavailable_blue_img").style.display = "block";
                document.getElementById("sf_sfavailable_blue_img").src = "galactic_conquest/hmp.gif";
              break;
              case decrease_time:
                document.getElementById("sf_sfavailable_blue").style.display = "block";
                document.getElementById("sf_sfavailable_blue_img").style.display = "block";
                document.getElementById("sf_sfavailable_blue_img").src = "galactic_conquest/negotiations.gif";
              break;
              case increase_battle_points:
                document.getElementById("sf_recharge_blue").style.display = "block";
                document.getElementById("sf_recharge_blue_img").style.display = "block";
                document.getElementById("sf_recharge_blue_img").src = "galactic_conquest/c9979.gif";
              break;
              case disable_enemy_heroes:
                document.getElementById("sf_playas_blue").style.display = "block";
                document.getElementById("sf_playas_blue_img").style.display = "block";
                document.getElementById("sf_playas_blue_img").src = "galactic_conquest/bounty_hunters.gif";
              break;
              case decrease_difficulty:
                document.getElementById("sf_difficulty_blue").style.display = "block";
                document.getElementById("sf_difficulty_blue_img").style.display = "block";
                document.getElementById("sf_difficulty_blue_img").src = "galactic_conquest/fx7.gif";
              break;
            }
            switch(ai_bonus){ //Republic AI
              case increase_difficulty:
                document.getElementById("sf_difficulty_red").style.display = "block";
                document.getElementById("sf_difficulty_red_img").style.display = "block";
                document.getElementById("sf_difficulty_red_img").src = "galactic_conquest/commando.gif";
              break;
              case decrease_battle_points:
                document.getElementById("sf_recharge_red").style.display = "block";
                document.getElementById("sf_recharge_red_img").style.display = "block";
                document.getElementById("sf_recharge_red_img").src = "galactic_conquest/seismic_charge.gif";
              break;
            }
          }
        }
        else{ //Ground
          document.getElementById("attack_settings_img").src = "galactic_conquest/instant_action.png";
          document.getElementById("ia_location"  ).style.display = "block";
          document.getElementById("ia_difficulty").style.display = "block";
          document.getElementById("ia_length"    ).style.display = "block";
          document.getElementById("ia_points"    ).style.display = "block";
          document.getElementById("ia_heroes"    ).style.display = "block";

          document.getElementById("ia_location"  ).innerHTML = point_index_to_string[attackingPlanet].toUpperCase();

          document.getElementById("ia_difficulty"    ).innerHTML = "NORMAL";
          if(player_bonus == decrease_difficulty && ai_bonus != increase_difficulty)
            document.getElementById("ia_difficulty"    ).innerHTML = "ROOKIE";
          else if(player_bonus != decrease_difficulty && ai_bonus == increase_difficulty)
            document.getElementById("ia_difficulty"    ).innerHTML = "EXPERT";

          document.getElementById("ia_length"   ).innerHTML = "MEDIUM";
          if(player_bonus == increase_time)
            document.getElementById("ia_length"   ).innerHTML = "LONG";
          if(player_bonus == decrease_time)
            document.getElementById("ia_length"   ).innerHTML = "SHORT";

          document.getElementById("ia_points"      ).innerHTML = "DEFAULT";
          if(player_bonus == increase_battle_points && ai_bonus != decrease_battle_points)
            document.getElementById("ia_points"      ).innerHTML = "FAST";
          else if(player_bonus != increase_battle_points && ai_bonus == decrease_battle_points)
            document.getElementById("ia_points"      ).innerHTML = "SLOW";

          if(player_bonus == disable_enemy_heroes)
            document.getElementById("ia_heroes"        ).innerHTML = "OFF";
          else
            document.getElementById("ia_heroes"        ).innerHTML = "ON";

          if(team == republic){
            switch(player_bonus){
              case increase_time:
                document.getElementById("ia_length_blue").style.display = "block";
                document.getElementById("ia_length_blue_img").style.display = "block";
                document.getElementById("ia_length_blue_img").src = "galactic_conquest/laat.gif";
              break;
              case decrease_time:
                document.getElementById("ia_length_blue").style.display = "block";
                document.getElementById("ia_length_blue_img").style.display = "block";
                document.getElementById("ia_length_blue_img").src = "galactic_conquest/negotiations.gif";
              break;
              case increase_battle_points:
                document.getElementById("ia_points_blue").style.display = "block";
                document.getElementById("ia_points_blue_img").style.display = "block";
                document.getElementById("ia_points_blue_img").src = "galactic_conquest/laatc.gif";
              break;
              case disable_enemy_heroes:
                document.getElementById("ia_heroes_blue").style.display = "block";
                document.getElementById("ia_heroes_blue_img").style.display = "block";
                document.getElementById("ia_heroes_blue_img").src = "galactic_conquest/bounty_hunters.gif";
              break;
              case decrease_difficulty:
                document.getElementById("ia_difficulty_blue").style.display = "block";
                document.getElementById("ia_difficulty_blue_img").style.display = "block";
                document.getElementById("ia_difficulty_blue_img").src = "galactic_conquest/shield_generator.gif";
              break;
            }
            switch(ai_bonus){ //CIS AI
              case increase_difficulty:
                document.getElementById("ia_difficulty_red").style.display = "block";
                document.getElementById("ia_difficulty_red_img").style.display = "block";
                document.getElementById("ia_difficulty_red_img").src = "galactic_conquest/techno_union.gif";
              break;
              case decrease_battle_points:
                document.getElementById("ia_points_red").style.display = "block";
                document.getElementById("ia_points_red_img").style.display = "block";
                document.getElementById("ia_points_red_img").src = "galactic_conquest/seismic_charge.gif";
              break;
            }
          }
          else { //CIS
            switch(player_bonus){
              case increase_time:
                document.getElementById("ia_length_blue").style.display = "block";
                document.getElementById("ia_length_blue_img").style.display = "block";
                document.getElementById("ia_length_blue_img").src = "galactic_conquest/hmp.gif";
              break;
              case decrease_time:
                document.getElementById("ia_length_blue").style.display = "block";
                document.getElementById("ia_length_blue_img").style.display = "block";
                document.getElementById("ia_length_blue_img").src = "galactic_conquest/negotiations.gif";
              break;
              case increase_battle_points:
                document.getElementById("ia_points_blue").style.display = "block";
                document.getElementById("ia_points_blue_img").style.display = "block";
                document.getElementById("ia_points_blue_img").src = "galactic_conquest/c9979.gif";
              break;
              case disable_enemy_heroes:
                document.getElementById("ia_heroes_blue").style.display = "block";
                document.getElementById("ia_heroes_blue_img").style.display = "block";
                document.getElementById("ia_heroes_blue_img").src = "galactic_conquest/bounty_hunters.gif";
              break;
              case decrease_difficulty:
                document.getElementById("ia_difficulty_blue").style.display = "block";
                document.getElementById("ia_difficulty_blue_img").style.display = "block";
                document.getElementById("ia_difficulty_blue_img").src = "galactic_conquest/fx7.gif";
              break;
            }
            switch(ai_bonus){ //Republic AI
              case increase_difficulty:
                document.getElementById("ia_difficulty_red").style.display = "block";
                document.getElementById("ia_difficulty_red_img").style.display = "block";
                document.getElementById("ia_difficulty_red_img").src = "galactic_conquest/commando.gif";
              break;
              case decrease_battle_points:
                document.getElementById("ia_points_red").style.display = "block";
                document.getElementById("ia_points_red_img").style.display = "block";
                document.getElementById("ia_points_red_img").src = "galactic_conquest/seismic_charge.gif";
              break;
            }
          }
        }
      }
      else if(sub_state == sub_credits_results){
        document.getElementById("credits_results_div").style.display = "block";
        var numPlayerPlanets = 0;
        var numAIPlanets = 0;
        if(team == republic){
          document.getElementById("credits_results_player_name").innerHTML = "Galactic Republic";
          document.getElementById("credits_results_ai_name").innerHTML = "Separatist Alliance";
          numPlayerPlanets = countOwnedPlanets(republic);
          numAIPlanets = countOwnedPlanets(cis);
        }
        else{
          document.getElementById("credits_results_player_name").innerHTML = "Separatist Alliance";
          document.getElementById("credits_results_ai_name").innerHTML = "Galactic Republic";
          numPlayerPlanets = countOwnedPlanets(cis);
          numAIPlanets = countOwnedPlanets(republic);
        }

        var playerPlural = "";
        if(numPlayerPlanets != 1)
          playerPlural = "s";

        var aiPlural = "";
        if(numAIPlanets != 1)
          aiPlural = "s";

        if(wasVictory){
          document.getElementById("credits_results_player_description").innerHTML = "Victory<br>" + numPlayerPlanets + " Planet" + playerPlural + "<br>TOTAL";
          document.getElementById("credits_results_ai_description"    ).innerHTML = "Defeat<br>" + numAIPlanets + " Planet" + aiPlural + "<br>TOTAL";
        }
        else{
          document.getElementById("credits_results_player_description").innerHTML = "Defeat<br>" + numPlayerPlanets + " Planet" + playerPlural + "<br>TOTAL";
          document.getElementById("credits_results_ai_description"    ).innerHTML = "Victory<br>" + numAIPlanets + " Planet" + aiPlural + "<br>TOTAL";
        }

        var totalPlayerBonus = playerVictoryBonus + playerPlanetaryBonus;
        var totalAIBonus = aiVictoryBonus + aiPlanetaryBonus;
        document.getElementById("credits_results_player_amounts").innerHTML = playerVictoryBonus + " Credits<br>" + playerPlanetaryBonus + " Credits<br>" + totalPlayerBonus + " Credits";
        document.getElementById("credits_results_ai_amounts").innerHTML = aiVictoryBonus + " Credits<br>" + aiPlanetaryBonus + " Credits<br>" + totalAIBonus + " Credits";
      }
      document.getElementById("bonus_attack_owned0").src = owned_bonuses[0][1];
      document.getElementById("bonus_attack_owned1").src = owned_bonuses[1][1];
      document.getElementById("bonus_attack_owned2").src = owned_bonuses[2][1];
      document.getElementById("bonus_attack_name").innerHTML = "";
      document.getElementById("bonus_attack_description").innerHTML = "You have no bonuses";
      if(owned_bonuses[0][0] != na || owned_bonuses[1][0] != na || owned_bonuses[2][0] != na ){
        i = 0;
        for(i = 0; i < 3; ++i){
          if(owned_bonuses[i][0] != na){
            select_attack_bonus(i);
            break;
          }
        }
        document.getElementById("use_div").style.display = "block";
      }
      else{
        document.getElementById("use_div").style.display = "none";
      }
    } //End state == state_attack_planet

    document.getElementById("credits_text").innerHTML = credits + " Credits";
    if(credits < bonusCreditCosts[selectedBonus])
      document.getElementById("bonus_cost").style.color = "red";
    else
      document.getElementById("bonus_cost").style.color = "white";

    if(credits < fleet_cost)
      document.getElementById("point_cost").style.color = "red";
    else
      document.getElementById("point_cost").style.color = "white";

    document.getElementById("bonus_owned0").src = owned_bonuses[0][1];
    document.getElementById("bonus_owned1").src = owned_bonuses[1][1];
    document.getElementById("bonus_owned2").src = owned_bonuses[2][1];
    
}//End setElements()

function initializeTeams(){
  if(team == republic){
      planetOwners[felucia ] = cis;
      planetOwners[geonosis] = cis;
      planetOwners[kamino  ] = republic;
      planetOwners[kashyyyk] = cis;
      planetOwners[naboo   ] = cis;
      document.getElementById("republic_home").src = "galactic_conquest/republic_logo_blue.png";
      document.getElementById("cis_home").src = "galactic_conquest/cis_logo_red.png";
      setElements();
      document.getElementById("bonus0_img").src = "galactic_conquest/laat.gif"            ;
      document.getElementById("bonus1_img").src = "galactic_conquest/negotiations.gif"    ;
      document.getElementById("bonus2_img").src = "galactic_conquest/laatc.gif"           ;
      document.getElementById("bonus3_img").src = "galactic_conquest/bounty_hunters.gif"  ;
      document.getElementById("bonus4_img").src = "galactic_conquest/shield_generator.gif";
      src0a = "galactic_conquest/laat.gif";      
      src1a = "galactic_conquest/negotiations.gif";  
      src2a = "galactic_conquest/laatc.gif";            
      src3a = "galactic_conquest/bounty_hunters.gif";
      src4a = "galactic_conquest/shield_generator.gif"; 
      /*
      src0b = "galactic_conquest/laat_2.png";      
      src1b = "galactic_conquest/negotiations_2.png";    
      src2b = "galactic_conquest/laatc_2.png";            
      src3b = "galactic_conquest/bounty_hunters_2.png";
      src4b = "galactic_conquest/shield_generator_2.png";
      */
      document.getElementById("credits_team").innerHTML = "Republic";
      document.getElementById("credits_logo").src = "galactic_conquest/republic_logo_blue.png";
      document.getElementById("venator0").src = "galactic_conquest/venator_blue.png";
      document.getElementById("dreadnought0").src = "galactic_conquest/dreadnought.png";
    }
    else{
      planetOwners[felucia ] = republic;
      planetOwners[geonosis] = cis;
      planetOwners[kamino  ] = republic;
      planetOwners[kashyyyk] = republic;
      planetOwners[naboo   ] = republic;
      document.getElementById("republic_home").src = "galactic_conquest/republic_logo_red.png";
      document.getElementById("cis_home").src = "galactic_conquest/cis_logo_blue.png";
      setElements();
      document.getElementById("bonus0_img").src = "galactic_conquest/hmp.gif"             ;
      document.getElementById("bonus1_img").src = "galactic_conquest/negotiations.gif"    ;
      document.getElementById("bonus2_img").src = "galactic_conquest/c9979.gif"           ;
      document.getElementById("bonus3_img").src = "galactic_conquest/bounty_hunters.gif"  ;
      document.getElementById("bonus4_img").src = "galactic_conquest/fx7.gif"             ;
      src0a = "galactic_conquest/hmp.gif"             ;
      src1a = "galactic_conquest/negotiations.gif"    ;
      src2a = "galactic_conquest/c9979.gif"           ;  
      src3a = "galactic_conquest/bounty_hunters.gif"  ;
      src4a = "galactic_conquest/fx7.gif"             ;
      /*
      src0b = "galactic_conquest/hmp_2.png"             ;
      src1b = "galactic_conquest/negotiations_2.png"    ;
      src2b = "galactic_conquest/c9979_2.png"           ;
      src3b = "galactic_conquest/bounty_hunters_2.png"  ;
      src4b = "galactic_conquest/fx7_2.png"             ;
      */
      document.getElementById("credits_team").innerHTML = "Separatists";
      document.getElementById("credits_logo").src = "galactic_conquest/cis_logo_blue.png";
      document.getElementById("venator0").src = "galactic_conquest/venator.png";
      document.getElementById("dreadnought0").src = "galactic_conquest/dreadnought_blue.png";
    }
}

function hideTeamSelect(team2) {
  if(state == state_team_select){
    bonus_select(-2);
    state = state_galaxy_view;
    team = team2;
    initializeTeams();
    hideAllLoops();
    if(team == republic)
      selectPoint(point_index_to_string[venatorPlanets[getFirstFleetIndex(republic)]], true);
    else
      selectPoint(point_index_to_string[dreadnoughtPlanets[getFirstFleetIndex(cis)]], true);
    setElements();
    saveState();
    if(soundEnabled){
      var index = getRandomNumber(2);
      sound_select_fleet[team][index].currentTime = 0;
      sound_select_fleet[team][index].play();
    }
  }
}

function hideAllLoops(){
  var i = 1;
  for(i = 1; i < 24; ++i){
    document.getElementById("loop_" + point_index_to_string[i]).style.display = "none";
  }
}

function setLineStyles(oldPlanet, newPlanet){
  var i = 0;
    for(i = 0; i < 33; ++i){
      // if(pointPairs[i][0] == oldPlanet || pointPairs[i][1] == oldPlanet){
        var idP = point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]];
        //document.getElementById(idP).src = "galactic_conquest/grey_line.png";
        document.getElementById(idP).style.opacity = "0.2";
        //document.getElementById(idP).style.height  = "3px";
      // }
    }

    i = 0;
    for(i = 0; i < 33; ++i){
      if(pointPairs[i][0] == newPlanet || pointPairs[i][1] == newPlanet){
        var idP = point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]];
        //document.getElementById(idP).src = "galactic_conquest/grey_line.png";
        document.getElementById(idP).style.opacity = "0.7";
        //document.getElementById(idP).style.height  = "4px";
      }
    }
}

function onPlanetMouseOver(planet){
  if(state == state_galaxy_view && selectedPlanet != point_index_to_string.indexOf(planet))
    if(planetOwners[point_index_to_string.indexOf(planet)] == team)
      document.getElementById(planet).src="galactic_conquest/blue_planet_hover.png";
    else
      document.getElementById(planet).src="galactic_conquest/red_planet_hover.png";
}

function onPlanetMouseOut(planet){
  if(state == state_galaxy_view && selectedPlanet != point_index_to_string.indexOf(planet))
    if(planetOwners[point_index_to_string.indexOf(planet)] == team)
      document.getElementById(planet).src="galactic_conquest/blue_planet_idle.png";
    else
      document.getElementById(planet).src="galactic_conquest/red_planet_idle.png";
}

function selectPoint(point, overrideState){
  if(state == state_galaxy_view || overrideState){
    point = point_index_to_string.indexOf(point);
    var i = 0;
    var selectDestinationSoundPlayed = false;
    if(team == republic){
      //Change back last selected line
      setLinesGreySrc();

      //Select Venator
      if(doesArrayInclude(venatorPlanets, point)){
        if(soundEnabled && !overrideState){
          var index = getRandomNumber(1);
          sound_select_destination[team][index].currentTime = 0;
          sound_select_destination[team][index].play();
          selectDestinationSoundPlayed = true;
        }
        var index = venatorPlanets.indexOf(point);
        var venator = document.getElementById("venator" + index);
        var i = 0;
        for(i = 0; i < 26; ++i){
          document.getElementById("venator" + i).src = "galactic_conquest/venator.png";
        }
        venator.src = "galactic_conquest/venator_blue.png";
        selectedVenator[0] = point;
        selectedVenator[1] = "venator" + index;
      }

      //Change to dashed line
      // console.log(point + " " + pointMap.get(point) + " " + selectedVenator[0]);
      if(doesArrayInclude(pointMap.get(point), selectedVenator[0]) && !hasMovedThisTurn){
        if(soundEnabled && !overrideState){
          sound_select.currentTime = 0;
          sound_select.play();
        }
        canMove = true;
        if(document.getElementById(point_index_to_string[point] + "_" + point_index_to_string[selectedVenator[0]]) != null)
          document.getElementById(point_index_to_string[point] + "_" + point_index_to_string[selectedVenator[0]]).src = "galactic_conquest/white_dash.gif";
        else if(document.getElementById(point_index_to_string[selectedVenator[0]] + "_" + point_index_to_string[point]) != null)
          document.getElementById(point_index_to_string[selectedVenator[0]] + "_" + point_index_to_string[point]).src = "galactic_conquest/white_dash_reverse.gif";
      }
      else{
        canMove = false;
      }
    }
    else{
        //Change back last selected line
        setLinesGreySrc();

        //Select Dreadnought
        if(doesArrayInclude(dreadnoughtPlanets, point)){
          if(soundEnabled && !overrideState){
            var index = getRandomNumber(1);
            sound_select_destination[team][index].currentTime = 0;
            sound_select_destination[team][index].play();
            selectDestinationSoundPlayed = true;
          }
          var index = dreadnoughtPlanets.indexOf(point);
          var dread = document.getElementById("dreadnought" + index);
          var i = 0;
          for(i = 0; i < 26; ++i){
            document.getElementById("dreadnought" + i).src = "galactic_conquest/dreadnought.png";
          }
          dread.src = "galactic_conquest/dreadnought_blue.png";
          selectedDreadnought[0] = point;
          selectedDreadnought[1] = "dreadnought" + index;
        }

        //Change to dashed line
        if(doesArrayInclude(pointMap.get(point), selectedDreadnought[0]) && !hasMovedThisTurn){
          if(soundEnabled && !overrideState && !selectDestinationSoundPlayed){
            sound_select.currentTime = 0;
            sound_select.play();
          }
          canMove = true;
          if(document.getElementById(point_index_to_string[point] + "_" + point_index_to_string[selectedDreadnought[0]]) != null)
            document.getElementById(point_index_to_string[point] + "_" + point_index_to_string[selectedDreadnought[0]]).src = "galactic_conquest/white_dash.gif";
          else if(document.getElementById(point_index_to_string[selectedDreadnought[0]] + "_" + point_index_to_string[point]) != null)
            document.getElementById(point_index_to_string[selectedDreadnought[0]] + "_" + point_index_to_string[point]).src = "galactic_conquest/white_dash_reverse.gif";
        }
        else{
          canMove = false;
        }
    }

    //If point has point in name
    if(point <= num_neutral_points){
      canBuild = false;
      document.getElementById("point_name").innerHTML = "";
      document.getElementById("point_description").innerHTML = "";
      document.getElementById("point_cost").innerHTML = "";

      setLineStyles(selectedPlanet, point);
      document.getElementById("loop_" + point_index_to_string[selectedPlanet]).style.display = "none";
      selectedPlanet = point;
      selectedLoopId = "#loop_" + point_index_to_string[point];
      document.getElementById(point_index_to_string[point]).src="galactic_conquest/grey_point_idle.png";
      document.getElementById("loop_" + point_index_to_string[point]).style.display = "block";
      loopSize = 0.2;
      loopOpacity = 1.8;
      $("#loop_" + point_index_to_string[selectedPlanet]).css("transform","scaleX(" + loopSize + ") scaleY(" + loopSize + ")");
      $("#loop_" + point_index_to_string[selectedPlanet]).css("opacity",loopOpacity);
    }
    else { //Planets
      if(soundEnabled && !overrideState && !selectDestinationSoundPlayed){
        switch(point){
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
        }
      }
      var pointCapitalized = point_index_to_string[point];
      pointCapitalized = pointCapitalized.substring(0,1).toUpperCase() + pointCapitalized.substring(1, pointCapitalized.length);
      document.getElementById("point_name").innerHTML = pointCapitalized;
      if(planetOwners[point] == team && !doesArrayInclude(venatorPlanets, point) && !doesArrayInclude(dreadnoughtPlanets, point)){
        document.getElementById("point_description").innerHTML = "Fleets can be built and used to invade or fortify planets and engage enemy fleets in space.";
        document.getElementById("point_cost").innerHTML = fleet_cost + " Credits";
      }
      else{
        var desc = "Victory Resources: " + planetVictoryResources.get(point) + " Credits<br>" +
        "Planetary Bonus: " + planetBonuses.get(point) + " Credits";
        if(point == geonosis)
          desc += "<br>Droid Foundry (CIS Base Planet)";
        else if (point == kamino)
          desc += "<br>Cloning Facility (Republic Base Planet)";
        document.getElementById("point_description").innerHTML = desc;
        document.getElementById("point_cost").innerHTML = "";
      }

      setLineStyles(selectedPlanet, point);

      document.getElementById("loop_" + point_index_to_string[selectedPlanet]).style.display = "none";
      selectedPlanet = point;
      selectedLoopId = "#loop_" + point_index_to_string[point];
      if(planetOwners[point] == team){
        document.getElementById(point_index_to_string[point]).src="galactic_conquest/blue_planet_idle.png";
        document.getElementById("loop_" + point_index_to_string[point]).src="galactic_conquest/blue_planet_loop.png";
      }
      else{
        document.getElementById(point_index_to_string[point]).src="galactic_conquest/red_planet_idle.png";
        document.getElementById("loop_" + point_index_to_string[point]).src="galactic_conquest/red_planet_loop.png";
      }
      document.getElementById("loop_" + point_index_to_string[point]).style.display = "block";
      loopSize = 0.2;
      loopOpacity = 1.8;
      $("#loop_" + point_index_to_string[selectedPlanet]).css("transform","scaleX(" + loopSize + ") scaleY(" + loopSize + ")");
      $("#loop_" + point_index_to_string[selectedPlanet]).css("opacity",loopOpacity);
    }
    // if(!overrideState){
      setElements();
    // }
    saveState();
  }
} //End selectPoint()

function ai_selectpoint(point){
  if(state == state_ai_moving){
    var i = 0;
    if(team == cis){
      //Change back last selected line
      setLinesGreySrc();

      //Select Venator
      if(doesArrayInclude(venatorPlanets, point)){
        var index = venatorPlanets.indexOf(point);
        var venator = document.getElementById("venator" + index);
        var i = 0;
        for(i = 0; i < 26; ++i){
          document.getElementById("venator" + i).src = "galactic_conquest/venator.png";
        }
        venator.src = "galactic_conquest/venator_red.png";
        selectedVenator[0] = point;
        selectedVenator[1] = "venator" + index;
      }

      //Change to dashed line
      if(doesArrayInclude(pointMap.get(point), selectedVenator[0])){
        canMove = true;
        if(document.getElementById(point_index_to_string[point] + "_" + point_index_to_string[selectedVenator[0]]) != null)
          document.getElementById(point_index_to_string[point] + "_" + point_index_to_string[selectedVenator[0]]).src = "galactic_conquest/white_dash.gif";
        else if(document.getElementById(point_index_to_string[selectedVenator[0]] + "_" + point_index_to_string[point]) != null)
          document.getElementById(point_index_to_string[selectedVenator[0]] + "_" + point_index_to_string[point]).src = "galactic_conquest/white_dash_reverse.gif";
      }
    }
    else{
        //Change back last selected line
        setLinesGreySrc();

        //Select Dreadnought
        if(doesArrayInclude(dreadnoughtPlanets, point)){
          var index = dreadnoughtPlanets.indexOf(point);
          var dread = document.getElementById("dreadnought" + index);
          var i = 0;
          for(i = 0; i < 26; ++i){
            document.getElementById("dreadnought" + i).src = "galactic_conquest/dreadnought.png";
          }
          dread.src = "galactic_conquest/dreadnought_red.png";
          selectedDreadnought[0] = point;
          selectedDreadnought[1] = "dreadnought" + index;
        }

        //Change to dashed line
        if(doesArrayInclude(pointMap.get(point), selectedDreadnought[0])){
          canMove = true;
          if(document.getElementById(point_index_to_string[point] + "_" + point_index_to_string[selectedDreadnought[0]]) != null)
            document.getElementById(point_index_to_string[point] + "_" + point_index_to_string[selectedDreadnought[0]]).src = "galactic_conquest/white_dash.gif";
          else if(document.getElementById(point_index_to_string[selectedDreadnought[0]] + "_" + point_index_to_string[point]) != null)
            document.getElementById(point_index_to_string[selectedDreadnought[0]] + "_" + point_index_to_string[point]).src = "galactic_conquest/white_dash_reverse.gif";
        }
    }

    //If point has point in name
    if(point <= num_neutral_points){
      document.getElementById("point_name").innerHTML = "";
      document.getElementById("point_description").innerHTML = "";
      document.getElementById("point_cost").innerHTML = "";

      setLineStyles(selectedPlanet, point);
      document.getElementById("loop_" + point_index_to_string[selectedPlanet]).style.display = "none";
      selectedPlanet = point;
      selectedLoopId = "#loop_" + point_index_to_string[point];
      document.getElementById(point_index_to_string[point]).src="galactic_conquest/grey_point_idle.png";
      document.getElementById("loop_" + point_index_to_string[point]).style.display = "block";
      loopSize = 0.2;
      loopOpacity = 1.8;
      $("#loop_" + point_index_to_string[selectedPlanet]).css("transform","scaleX(" + loopSize + ") scaleY(" + loopSize + ")");
      $("#loop_" + point_index_to_string[selectedPlanet]).css("opacity",loopOpacity);
    }
    else{ //Planets
      var pointCapitalized = point_index_to_string[point];
      pointCapitalized = pointCapitalized.substring(0,1).toUpperCase() + pointCapitalized.substring(1, pointCapitalized.length);
      document.getElementById("point_name").innerHTML = pointCapitalized;
      if(planetOwners[point] == team && !doesArrayInclude(venatorPlanets, point) && !doesArrayInclude(dreadnoughtPlanets, point)){
        document.getElementById("point_description").innerHTML = "Fleets can be built and used to invade or fortify planets and engage enemy fleets in space.";
        document.getElementById("point_cost").innerHTML = fleet_cost + " Credits";
      }
      else{
        var desc = "Victory Resources: " + planetVictoryResources.get(point) + " Credits<br>" +
        "Planetary Bonus: " + planetBonuses.get(point) + " Credits";
        if(point == "geonosis")
          desc += "<br>Droid Foundry (CIS Base Planet)";
        else if (point == "kamino")
          desc += "<br>Cloning Facility (Republic Base Planet)";
        document.getElementById("point_description").innerHTML = desc;
        document.getElementById("point_cost").innerHTML = "";
      }

      setLineStyles(selectedPlanet, point);

      document.getElementById("loop_" + point_index_to_string[selectedPlanet]).style.display = "none";
      selectedPlanet = point;
      selectedLoopId = "#loop_" + point_index_to_string[point];
      if(planetOwners[point] == team){
        document.getElementById(point_index_to_string[point]).src="galactic_conquest/blue_planet_idle.png";
        document.getElementById("loop_" + point_index_to_string[point]).src="galactic_conquest/blue_planet_loop.png";
      }
      else{
        document.getElementById(point_index_to_string[point]).src="galactic_conquest/red_planet_idle.png";
        document.getElementById("loop_" + point_index_to_string[point]).src="galactic_conquest/red_planet_loop.png";
      }
      document.getElementById("loop_" + point_index_to_string[point]).style.display = "block";
      loopSize = 0.2;
      loopOpacity = 1.8;
      $("#loop_" + point_index_to_string[selectedPlanet]).css("transform","scaleX(" + loopSize + ") scaleY(" + loopSize + ")");
      $("#loop_" + point_index_to_string[selectedPlanet]).css("opacity",loopOpacity);
    }
    setElements();
    saveState();
  }
}

function onPointMouseOver(point){
  if(state == state_galaxy_view && selectedPlanet != point_index_to_string.indexOf(point))
      document.getElementById(point).src="galactic_conquest/grey_point_hover.png";
}

function onPointMouseOut(point){
  if(state == state_galaxy_view && selectedPlanet != point_index_to_string.indexOf(point))
      document.getElementById(point).src="galactic_conquest/grey_point_idle.png";
}

function onButtonMouseOverBlue(id){
  if(soundEnabled && !cursor_over_button){
    sound_select.currentTime = 0;
    sound_select.play();
  }
  cursor_over_button = true;
  document.getElementById(id + "_button").src="galactic_conquest/button_glow_long_blue.png"; 
  // document.getElementById(id + "_text").style.color="#F4AE0A";
}

function onButtonMouseOverRed(id){
  if(soundEnabled && !cursor_over_button){
    sound_select.currentTime = 0;
    sound_select.play();
  }
  cursor_over_button = true;
  document.getElementById(id + "_button").src="galactic_conquest/button_glow_long_red.png"; 
  // document.getElementById(id + "_text").style.color="#F4350A";
}

function onButtonMouseOutLong(id){
  cursor_over_button = false;
  document.getElementById(id + "_button").src="galactic_conquest/button_grey_long.png";
  document.getElementById(id + "_text").style.color="#E5E5E5";
}

function onButtonMouseOver(id){
  if(soundEnabled && !cursor_over_button){
    sound_select.currentTime = 0;
    sound_select.play();
  }
  cursor_over_button = true;
  document.getElementById(id + "_button").src="galactic_conquest/button_glow.png"; 
  document.getElementById(id + "_text").style.color="#F4AE0A";
}

function onButtonMouseOut(id){
  cursor_over_button = false;
  document.getElementById(id + "_button").src="galactic_conquest/button_grey.png";
  document.getElementById(id + "_text").style.color="#E5E5E5";
}

function onButtonModeMouseOver(id){
  if(state == state_galaxy_view && id != "move_mode"){
      if(soundEnabled && !cursor_over_button){
        sound_select.currentTime = 0;
        sound_select.play();
      }
      document.getElementById(id + "_button").src="galactic_conquest/button_glow_long.png"; 
      document.getElementById(id + "_text").style.color="#F4AE0A";
  }
  else if(state == state_bonus_view && id != "bonus_mode"){
      if(soundEnabled && !cursor_over_button){
        sound_select.currentTime = 0;
        sound_select.play();
      }
      document.getElementById(id + "_button").src="galactic_conquest/button_glow_long.png"; 
      document.getElementById(id + "_text").style.color="#F4AE0A";
  }
  cursor_over_button = true;
}

function onButtonModeMouseOut(id){
  if(state == state_galaxy_view && id != "move_mode"){
    document.getElementById(id + "_button").src="galactic_conquest/button_grey_long.png";
    document.getElementById(id + "_text").style.color="#E5E5E5";
  }
  else if(state == state_bonus_view && id != "bonus_mode"){
    document.getElementById(id + "_button").src="galactic_conquest/button_grey_long.png";
    document.getElementById(id + "_text").style.color="#E5E5E5";
  }
  cursor_over_button = false;
}

function move_mode(){
  if(soundEnabled){
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  if(state == state_bonus_view){
    state = state_galaxy_view;
    setElements();
    saveState();
  }
}

function bonus_mode(){
  if(soundEnabled){
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  if(state == state_galaxy_view){
    if(soundEnabled){
      sound_select_a_bonus_to_purchase[team].currentTime = 0;
      sound_select_a_bonus_to_purchase[team].play();
    }
    state = state_bonus_view;
    setElements();
    bonus_select(-2);
    saveState();
  }
}

function bonus_select(pos){
  targetSelectPos = pos;
  selectedBonus = Math.abs(pos);
  if(soundEnabled){
    sound_select.currentTime = 0;
    sound_select.play();
  }
  if(team == republic)
    document.getElementById("bonus_name").innerHTML = republicBonusNames[selectedBonus];
  else
    document.getElementById("bonus_name").innerHTML = cisBonusNames[selectedBonus];
  document.getElementById("bonus_cost").innerHTML = bonusCreditCosts[selectedBonus] + " Credits";
  document.getElementById("bonus_description").innerHTML = bonusDescriptions[selectedBonus];
  if(bonusAnimationRunning == false)
    bonus_select_animation();
  if(credits < bonusCreditCosts[selectedBonus])
    document.getElementById("bonus_cost").style.color = "red";
  else
    document.getElementById("bonus_cost").style.color = "white";
}

function bonus_select_animation(){
  bonusAnimationRunning = true;
  if(Math.abs(targetSelectPos - bonusSelectPos[0]) > 0.01){
      var diff = 0;
    if(targetSelectPos > bonusSelectPos[0])
      diff = 0.1;
    else
      diff = -0.1;
    bonusSelectPos[0] += diff;
    bonusSelectPos[1] += diff;
    bonusSelectPos[2] += diff;
    bonusSelectPos[3] += diff;
    bonusSelectPos[4] += diff;
    bonusScale[0] = Math.abs(Math.cos((bonusSelectPos[0]/4) * 1.570795));
    bonusScale[1] = Math.abs(Math.cos((bonusSelectPos[1]/4) * 1.570795));
    bonusScale[2] = Math.abs(Math.cos((bonusSelectPos[2]/4) * 1.570795));
    bonusScale[3] = Math.abs(Math.cos((bonusSelectPos[3]/4) * 1.570795));
    bonusScale[4] = Math.abs(Math.cos((bonusSelectPos[4]/4) * 1.570795));
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
    $("#bonus0_img").css("left", (((Math.sin((bonusSelectPos[0]/4) * 1.570795) * 616) + (1200 - (bonusWidth[0]/2))) * zoom_level) + "px");
    $("#bonus1_img").css("left", (((Math.sin((bonusSelectPos[1]/4) * 1.570795) * 616) + (1200 - (bonusWidth[1]/2))) * zoom_level) + "px");
    $("#bonus2_img").css("left", (((Math.sin((bonusSelectPos[2]/4) * 1.570795) * 616) + (1200 - (bonusWidth[2]/2))) * zoom_level) + "px");
    $("#bonus3_img").css("left", (((Math.sin((bonusSelectPos[3]/4) * 1.570795) * 616) + (1200 - (bonusWidth[3]/2))) * zoom_level) + "px");
    $("#bonus4_img").css("left", (((Math.sin((bonusSelectPos[4]/4) * 1.570795) * 616) + (1200 - (bonusWidth[4]/2))) * zoom_level) + "px");
    setTimeout(function(){
      bonus_select_animation();
    }, animationSpeed);
    }
  else{
    bonusAnimationRunning = false;
    var oldSize = w4SizeMap.get("bonus0_img");
    var oldPos = w4PosMap.get("bonus0_img");
    w4SizeMap.set("bonus0_img", [bonusWidth[0], oldSize[1]]);
    w4SizeMap.set("bonus1_img", [bonusWidth[1], oldSize[1]]);
    w4SizeMap.set("bonus2_img", [bonusWidth[2], oldSize[1]]);
    w4SizeMap.set("bonus3_img", [bonusWidth[3], oldSize[1]]);
    w4SizeMap.set("bonus4_img", [bonusWidth[4], oldSize[1]]);

    w4PosMap.set("bonus0_img", [(Math.sin((bonusSelectPos[0]/4) * 1.570795) * 616) + (1200 - (bonusWidth[0]/2)), oldPos[1]]);
    w4PosMap.set("bonus1_img", [(Math.sin((bonusSelectPos[1]/4) * 1.570795) * 616) + (1200 - (bonusWidth[1]/2)), oldPos[1]]);
    w4PosMap.set("bonus2_img", [(Math.sin((bonusSelectPos[2]/4) * 1.570795) * 616) + (1200 - (bonusWidth[2]/2)), oldPos[1]]);
    w4PosMap.set("bonus3_img", [(Math.sin((bonusSelectPos[3]/4) * 1.570795) * 616) + (1200 - (bonusWidth[3]/2)), oldPos[1]]);
    w4PosMap.set("bonus4_img", [(Math.sin((bonusSelectPos[4]/4) * 1.570795) * 616) + (1200 - (bonusWidth[4]/2)), oldPos[1]]);
  }
}

/*

var src0b = "galactic_conquest/laat_2.png";      
var src1b = "galactic_conquest/negotiations_2.png";    
var src2b = "galactic_conquest/laatc_2.png";            
var src3b = "galactic_conquest/bounty_hunters_2.png";
var src4b = "galactic_conquest/shield_generator_2.png";

var owned_bonus_images_b = ["galactic_conquest/bonus_background.png", "galactic_conquest/bonus_background.png", "galactic_conquest/bonus_background.png"];
 
var holoTime = -1;

var holoBonusAnimationRunning = false;

function holoBonusAnimation(){
  if(holoBonusAnimationRunning == true){
    if(holoTime == -1){
      document.getElementById("bonus0_img").src = src0a;
      document.getElementById("bonus1_img").src = src1a;
      document.getElementById("bonus2_img").src = src2a;
      document.getElementById("bonus3_img").src = src3a;
      document.getElementById("bonus4_img").src = src4a;
      document.getElementById("bonus_owned0").src = owned_bonus_images_a[0];
      document.getElementById("bonus_owned1").src = owned_bonus_images_a[1];
      document.getElementById("bonus_owned2").src = owned_bonus_images_a[2];
    }
    else{
      document.getElementById("bonus0_img").src = src0b;
      document.getElementById("bonus1_img").src = src1b;
      document.getElementById("bonus2_img").src = src2b;
      document.getElementById("bonus3_img").src = src3b;
      document.getElementById("bonus4_img").src = src4b;
      document.getElementById("bonus_owned0").src = owned_bonus_images_b[0];
      document.getElementById("bonus_owned1").src = owned_bonus_images_b[1];
      document.getElementById("bonus_owned2").src = owned_bonus_images_b[2];
    }
    holoTime *= -1;
    setTimeout(function(){
      holoBonusAnimation();
      }, 25);
  }
}*/

function buy(){
  if(state == state_bonus_view){
    if(bonusCreditCosts[selectedBonus] <= credits){
      if(soundEnabled){
        sound_select_long.currentTime = 0;
        sound_select_long.play();
      }
      sub_state = sub_buying;
      buy_needs_confirmation = true;
      var i = 0;
      for(i = 0; i < 3; ++i){
        if(owned_bonuses[i][0] == na){
          owned_bonuses[i][1] = "galactic_conquest/bonus_background_border.gif";
        }
        else{
          owned_bonuses[i][1] = owned_bonuses[i][1].substring(0,owned_bonuses[i][1].length - 4) + "_border.gif";
        }
      }
      setElements();
    }else{
      if(soundEnabled){
        sound_error.currentTime = 0;
        sound_error.play();
      }
    }
    saveState();
  }
}

function confirm_buy(index){
  if(buy_needs_confirmation){
    if(soundEnabled){
      sound_select_long.currentTime = 0;
      sound_select_long.play();
    }
    sub_state = na;
    buy_needs_confirmation = false;
    credits -= bonusCreditCosts[selectedBonus];
    bonus_select(-selectedBonus);
    var b = na;
    switch(selectedBonus) {
      case 0:
        b = increase_time;
        owned_bonuses[index][1] = src0a;
      break;
      case 1:
        b = decrease_time;
        owned_bonuses[index][1] = src1a;
      break;
      case 2:
        b = increase_battle_points;
        owned_bonuses[index][1] = src2a;
      break;
      case 3:
        b = disable_enemy_heroes;
        owned_bonuses[index][1] = src3a;
      break;
      default:
        b = decrease_difficulty;
        owned_bonuses[index][1] = src4a;
      break;
    }
    owned_bonuses[index][0] = b;
    var i = 0;
    for(i = 0; i < 3; ++i){
      switch(owned_bonuses[i][0]) {
        case increase_time:
          owned_bonuses[i][1] = src0a;
        break;
        case decrease_time:
          owned_bonuses[i][1] = src1a;
        break;
        case increase_battle_points:
          owned_bonuses[i][1] = src2a;
        break;
        case disable_enemy_heroes:
          owned_bonuses[i][1] = src3a;
        break;
        case decrease_difficulty:
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

function select_attack_bonus(index){
  if(soundEnabled){
    sound_select.currentTime = 0;
    sound_select.play();
  }
  if(owned_bonuses[index][0] != na){
    document.getElementById("bonus_attack_owned0").src = owned_bonuses[0][1];
    document.getElementById("bonus_attack_owned1").src = owned_bonuses[1][1];
    document.getElementById("bonus_attack_owned2").src = owned_bonuses[2][1];
    selected_attack_bonus = owned_bonuses[index][0];
    switch(index) {
      case 0:
        document.getElementById("bonus_attack_owned0").src = owned_bonuses[index][1].substring(0,owned_bonuses[index][1].length - 4) + "_border.gif";
      break;
      case 1:
        document.getElementById("bonus_attack_owned1").src = owned_bonuses[index][1].substring(0,owned_bonuses[index][1].length - 4) + "_border.gif";
      break;
      default:
        document.getElementById("bonus_attack_owned2").src = owned_bonuses[index][1].substring(0,owned_bonuses[index][1].length - 4) + "_border.gif";
      break;
    }
    if(team == republic)
      document.getElementById("bonus_attack_name").innerHTML = republicBonusNames[owned_bonuses[index][0]-1];
    else
      document.getElementById("bonus_attack_name").innerHTML = cisBonusNames[owned_bonuses[index][0]-1];
    if(doesArrayInclude(dreadnoughtPlanets, attackingPlanet) && doesArrayInclude(venatorPlanets, attackingPlanet))
      document.getElementById("bonus_attack_description").innerHTML = bonusDescriptionsStarfighters[owned_bonuses[index][0]-1];
    else
      document.getElementById("bonus_attack_description").innerHTML = bonusDescriptionsGround[owned_bonuses[index][0]-1];
  }
  saveState();
}

function wipeToGalaxyAnimation(firstStartup){
  if(firstStartup){
    wipeToGalaxyAnimationRunning = true;
    wipeAnimation = 0;
    saveState();
  }
  if(wipeToGalaxyAnimationRunning){
    wipeAnimation += 30;                                                  //Top Right Bottom Left
    document.getElementById("attack_planet_background").style.clip = "rect(0px," + (3000 * zoom_level) + "px," + (1687 * zoom_level) + "px," + (wipeAnimation * zoom_level)+ "px)";
    //Size = 630 x 630
    //Ventator    Left =  900 Top = 700
    //Dreadnought Left = 1300 Top = 400
    if(wipeAnimation >= 900 && wipeAnimation <= 1530){
      document.getElementById("venator_attack").style.clip =     "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px," + ((wipeAnimation - 900) * zoom_level) + "px)";
      // console.log("1 " + wipeAnimation + " " + document.getElementById("venator_attack").style.clip);
    }
    if(wipeAnimation < 900){
      document.getElementById("venator_attack").style.clip =     "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px,0px)";
      // console.log("2 " + wipeAnimation + " " + document.getElementById("venator_attack").style.clip);
    }
    else if(wipeAnimation > 1530){
      document.getElementById("venator_attack").style.clip =     "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px)";
      // console.log("3 " + wipeAnimation + " " + document.getElementById("venator_attack").style.clip);
    }
    
    if(wipeAnimation >= 1300 && wipeAnimation <= 1930)
      document.getElementById("dreadnought_attack").style.clip = "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px," + ((wipeAnimation - 1300) * zoom_level) + "px)";
    if(wipeAnimation < 1300)
      document.getElementById("dreadnought_attack").style.clip = "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px,0px)";
    else if(wipeAnimation > 1930)
      document.getElementById("dreadnought_attack").style.clip = "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px)";
    if(wipeAnimation >= 3000) {
      wipeToGalaxyAnimationRunning = false;
      if(!hasMovedThisTurn && soundEnabled){
        var index = getRandomNumber(2);
        sound_select_fleet[team][index].currentTime = 0;
        sound_select_fleet[team][index].play();
      }
      saveState();
    }
    setTimeout(function(){ //Not state sensitive
      wipeToGalaxyAnimation(false);
    }, animationSpeed);
  }
  else{
    setElements();
    document.getElementById("attack_planet_background").style.clip = "rect(0px," + (3000 * zoom_level) + "px," + (1687 * zoom_level) + "px," + (3000 * zoom_level) + "px)";
    document.getElementById("venator_attack").style.clip =           "rect(0px," + (630 * zoom_level) +  "px," + (630 * zoom_level) +  "px," + (630 * zoom_level) +  "px)";
    document.getElementById("dreadnought_attack").style.clip =       "rect(0px," + (630 * zoom_level) +  "px," + (630 * zoom_level) +  "px," + (630 * zoom_level) +  "px)";
  }
}

function loadAttackBonusAnimation(time){
  loadAttackBonusAnimationRunning = true;
  saveState();
  setTimeout(function(){
    sub_state = sub_attack_bonus;
    setElements();
    loadAttackBonusAnimationRunning = false;
    saveState();
  }, time);
}

function wipeToPlanetAnimation(firstStartup){
  if(firstStartup){
    wipeToPlanetAnimationRunning = true;
    wipeAnimation = 0;
    saveState();
  }
  wipeAnimation += 30;                                                  //Top Right Bottom Left
  document.getElementById("attack_planet_background").style.clip = "rect(0px," + (wipeAnimation * zoom_level) + "px," + (1687 * zoom_level) + "px,0px)";
  //Size = 630 x 630
  //Ventator    Left =  900 Top = 700
  //Dreadnought Left = 1300 Top = 400
  if(wipeAnimation >= 900 && wipeAnimation <= 1530)
    document.getElementById("venator_attack").style.clip =     "rect(0px," + ((wipeAnimation - 900) * zoom_level) + "px," + (630 * zoom_level) + "px,0px)";
  if(wipeAnimation > 1530)
    document.getElementById("venator_attack").style.clip =     "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px,0px)";
  else if(wipeAnimation < 900)
    document.getElementById("venator_attack").style.clip =     "rect(0px,0px," + (630 * zoom_level) + "px,0px)";

  if(wipeAnimation >= 1300 && wipeAnimation <= 1930)
    document.getElementById("dreadnought_attack").style.clip = "rect(0px," + ((wipeAnimation - 1300) * zoom_level) + "px," + (630 * zoom_level) + "px,0px)";
  if(wipeAnimation > 1930)
    document.getElementById("dreadnought_attack").style.clip = "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px,0px)";
  else if(wipeAnimation < 1300)
    document.getElementById("dreadnought_attack").style.clip = "rect(0px,0px," + (630 * zoom_level) + "px,0px)";

  if(wipeAnimation >= 3000){
    wipeToPlanetAnimationRunning = false;
    setElements();
    loadAttackBonusAnimation(2000);
    document.getElementById("attack_planet_background").style.clip = "rect(0px," + (3000 * zoom_level) + "px," + (1687 * zoom_level) + "px,0px)";
    document.getElementById("venator_attack").style.clip =     "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px,0px)";
    document.getElementById("dreadnought_attack").style.clip = "rect(0px," + (630 * zoom_level) + "px," + (630 * zoom_level) + "px,0px)";
    saveState();
  }
  else{
    setTimeout(function(){ //Not state sensitive
      wipeToPlanetAnimation(false);
    }, animationSpeed);
  }
}

function ai_move_animation1(time){
  ai_moving_animation1_running = true;
  saveState();
  setTimeout(function(){
    if(ai_destination != na){
      if(team == republic) {
        dreadnoughtPlanets[dreadnoughtPlanets.indexOf(ai_selectedFleet)] = ai_destination;
      }
      else {
        venatorPlanets[venatorPlanets.indexOf(ai_selectedFleet)] = ai_destination;
      }
    }
    setElements();
    ai_move_animation2(1000);
    ai_moving_animation1_running = false;
    saveState();
  }, time);
}

function ai_move_animation2(time){
  ai_moving_animation2_running = true;
  saveState();
  setTimeout(function(){
    setLinesGreySrc();
    hasMovedThisTurn = false;
    state = state_galaxy_view;
    if(team == republic)
      checkForPlanetAttack(cis, ai_destination);
    else
      checkForPlanetAttack(republic, ai_destination);
    if(state == state_galaxy_view && soundEnabled){
      var index = getRandomNumber(2);
      sound_select_fleet[team][index].currentTime = 0;
      sound_select_fleet[team][index].play();
    }
    setElements();
    if(team == republic) {
      selectPoint(point_index_to_string[selectedPlanet], true);
      setElements();
      for(i = 0; i < 26; ++i){
        document.getElementById("dreadnought" + i).src = "galactic_conquest/dreadnought.png";
      }
    }
    else {
      selectPoint(point_index_to_string[selectedPlanet], true);
      setElements();
      for(i = 0; i < 26; ++i){
        document.getElementById("venator" + i).src = "galactic_conquest/venator.png";
      }
    }
    ai_moving_animation2_running = false;
    if(team == republic)
      selectPoint(point_index_to_string[selectedVenator[0]], true);
    else
      selectPoint(point_index_to_string[selectedDreadnought[0]], true);
    saveState();
  }, time);
}

function ai_build_animation(time){
  ai_building_animation_running = true;
  saveState();
  setTimeout(function(){
    move_ai(ai_selectedFleet);
    if(ai_destination != na){
      ai_selectpoint(ai_selectedFleet);
      ai_selectpoint(ai_destination);
    }
    setElements();
    ai_move_animation1(1000);
    ai_building_animation_running = false;
    saveState();
  }, time);
}

function loadAttackScreen(){
  wipeToPlanetAnimation(true);
}

function checkForPlanetAttack(team2, dest){
  if(dest != na){
    //Space Battle
    if(doesArrayInclude(venatorPlanets, dest) && doesArrayInclude(dreadnoughtPlanets, dest)){
      state = state_attack_planet;
      spaceBattle = true;
      attackingPlanet = dest;
      if(dest == kamino){
        sub_state = sub_kamino_air;
      }
      else{
        sub_state = sub_ryloth;
      }
      loadAttackScreen();
    }//Ground Battle
    else if(planetOwners[dest] != team2 && planetOwners[dest] != na){
      spaceBattle = false;
      state = state_attack_planet;
      attackingPlanet = dest;
      if(dest == felucia){
        sub_state = sub_felucia;
      }
      else if(dest == geonosis){
        sub_state = sub_geonosis;
      }
      else if(dest == kamino){
        sub_state = sub_kamino_ground;
      }
      else if(dest == kashyyyk){
        sub_state = sub_kashyyyk
      }
      else { //Naboo
        sub_state = sub_naboo;
      }
      loadAttackScreen();
    }
    saveState();
  }
}

function move(){
  if(soundEnabled){
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  if(state == state_galaxy_view && canMove && !hasMovedThisTurn){
    canMove = false;
    hasMovedThisTurn = true;
    setLinesGreySrc();
    if(team == republic){
      var index = venatorPlanets.indexOf(selectedVenator[0]);
      venatorPlanets[index] = selectedPlanet;
      selectedVenator[0] = selectedPlanet;
    }
    else{
      var index = dreadnoughtPlanets.indexOf(selectedDreadnought[0]);
      dreadnoughtPlanets[index] = selectedPlanet;
      selectedDreadnought[0] = selectedPlanet;
    }
    checkForPlanetAttack(team, selectedPlanet);
    setElements();
    saveState();
  }
}

function help(){
  if(soundEnabled){
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  if(state == state_galaxy_view || state == state_bonus_view){
    help_page = 0;
    document.getElementById("help_screen_div").style.display = "block";
    document.getElementById("help_prev_div"  ).style.display = "none";
    document.getElementById("help_ok_div"    ).style.display = "block";
    document.getElementById("help_next_div"  ).style.display = "block";
    if(state == state_galaxy_view){
      document.getElementById("help_screen_text").innerHTML = help_galaxy_view_content[0];
    }
    else if(state == state_bonus_view){
      document.getElementById("help_screen_text").innerHTML = help_bonus_view_content[0];
    }
  }
}

function help_prev(){
  if(soundEnabled){
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  if(state == state_galaxy_view || state == state_bonus_view){
    if(state == state_galaxy_view){
      --help_page;
      if(help_page > 6)
        help_page = 6;
      document.getElementById("help_screen_text").innerHTML = help_galaxy_view_content[help_page];
      if(help_page == 6)
        document.getElementById("help_next_div"  ).style.display = "none";
      else
        document.getElementById("help_next_div"  ).style.display = "block";
    }
    else if(state == state_bonus_view){
      --help_page;
      if(help_page > 2)
        help_page = 2;
      document.getElementById("help_screen_text").innerHTML = help_bonus_view_content[help_page];
      if(help_page == 2)
        document.getElementById("help_next_div"  ).style.display = "none";
      else
        document.getElementById("help_next_div"  ).style.display = "block";
    }
    if(help_page == 0)
      document.getElementById("help_prev_div"  ).style.display = "none";
    else
      document.getElementById("help_prev_div"  ).style.display = "block";
  }
}

function help_next(){
  if(soundEnabled){
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  if(state == state_galaxy_view || state == state_bonus_view){
    if(state == state_galaxy_view){
      ++help_page;
      if(help_page > 6)
        help_page = 6;
      document.getElementById("help_screen_text").innerHTML = help_galaxy_view_content[help_page];
      if(help_page == 6)
        document.getElementById("help_next_div"  ).style.display = "none";
      else
        document.getElementById("help_next_div"  ).style.display = "block";
    }
    else if(state == state_bonus_view){
      ++help_page;
      if(help_page > 2)
        help_page = 2;
      document.getElementById("help_screen_text").innerHTML = help_bonus_view_content[help_page];
      if(help_page == 2)
        document.getElementById("help_next_div"  ).style.display = "none";
      else
        document.getElementById("help_next_div"  ).style.display = "block";
    }
    if(help_page == 0)
      document.getElementById("help_prev_div"  ).style.display = "none";
    else
      document.getElementById("help_prev_div"  ).style.display = "block";
  }
}

function help_ok(){
  if(soundEnabled){
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  document.getElementById("help_screen_div").style.display = "none";
}

function build(){
  if(state == state_galaxy_view){
    if(credits >= fleet_cost){
      credits -= fleet_cost;
      fleet_cost += 1000;
      if(soundEnabled){
        sound_fleet_constructed[team].currentTime = 0;
        sound_fleet_constructed[team].play();
      }
      if(team == republic){
        var index = venatorPlanets.indexOf(na);
        venatorPlanets[index] = selectedPlanet;
        selectedVenator[0] = selectedPlanet;
        selectedVenator[1] = "venator" + index;
      }
      else{
        var index = dreadnoughtPlanets.indexOf(na);
        dreadnoughtPlanets[index] = selectedPlanet;
        selectedDreadnought[0] = selectedPlanet;
        selectedDreadnought[1] = "dreadnought" + index;
      }
      selectPoint(point_index_to_string[selectedPlanet], true);
      setElements();
    }
    else{
      if(soundEnabled){
        sound_error.currentTime = 0;
        sound_error.play();
      }
    }
    saveState();
  }
}

function getRandomFleet(team2){
  var potentialFleets = [];
  var i = 0;
  if(team2 == republic){
    for (i = 0; i < venatorPlanets.length; ++i){
      if(venatorPlanets[i] != na)
        potentialFleets.push(venatorPlanets[i]);
    }
  }
  else{
    for (i = 0; i < dreadnoughtPlanets.length; ++i){
      if(dreadnoughtPlanets[i] != na)
        potentialFleets.push(dreadnoughtPlanets[i]);
    }
  }
  if(potentialFleets.length > 0){
    var planetIndex = Math.floor(Math.random() * potentialFleets.length);
    if(planetIndex == potentialFleets.length){
      --planetIndex;
    }
    return potentialFleets[planetIndex];
  }
  return null;
}

function end_turn(){
  if(soundEnabled){
    sound_select_cancel.currentTime = 0;
    sound_select_cancel.play();
  }
  if(state == state_galaxy_view){
    console.log("AI Credits: " + ai_credits);
    state = state_ai_moving;
    ai_destination = na;
    var recentlybuilt = build_ai();
    if(team == republic){
      if(countFleets(cis) > 0){
        ai_selectedFleet = getRandomFleet(cis);
      }
    }
    else{
      if(countFleets(republic) > 0){
        ai_selectedFleet = getRandomFleet(republic);
      }
    }
    setElements();
    if(recentlybuilt){
      ai_build_animation(2000);
    }
    else{
      ai_build_animation(0);
    }
    saveState();
  }
}

function build_ai(){
  var buildChance = Math.random();
  if(buildChance < 0.5 && ai_credits >= ai_fleet_cost){
    var potentialBuildSites = [];
    var i = 0;
    for (i = 1; i < planetOwners.length; ++i) {
      var planet = i;
      var team3 = planetOwners[i];
      if(team == republic){
        if(team3 == cis && !doesArrayInclude(dreadnoughtPlanets, planet))
          potentialBuildSites.push(planet);
      }
      else{
        if(team3 == republic && !doesArrayInclude(venatorPlanets, planet))
          potentialBuildSites.push(planet);
      }
    }
    if(potentialBuildSites.length > 0){
      var planetIndex = Math.floor(Math.random() * potentialBuildSites.length);
      if(planetIndex == potentialBuildSites.length){
        --planetIndex;
      }
      var planetToBuildOn = potentialBuildSites[planetIndex];
      ai_credits -= ai_fleet_cost;
      console.log("AI Credits: " + ai_credits + " After Bought Fleet");
      ai_fleet_cost += 1000;
      if(team == republic){
        var index = dreadnoughtPlanets.indexOf(na);
        dreadnoughtPlanets[index] = planetToBuildOn;
        selectedDreadnought[0] = planetToBuildOn;
        selectedDreadnought[1] = "dreadnought" + index;
      }
      else{
        var index = venatorPlanets.indexOf(na);
        venatorPlanets[index] = planetToBuildOn;
        selectedVenator[0] = planetToBuildOn;
        selectedVenator[1] = "venator" + index;
      }
      ai_selectpoint(planetToBuildOn);
      setElements();
      return true;
    }
  }
  saveState();
  return false;
}

function move_ai(selectedFleet){
  var currentPoint = selectedFleet;
  foundRoutes = [];
  var numPlayerPlanets = countOwnedPlanets(team);
  if(numPlayerPlanets == 0){
    var pointsNearby = pointMap.get(currentPoint);
    var index = Math.floor(Math.random() * pointsNearby.length);
    if(index == pointsNearby.length)
      --index;
    ai_destination = pointsNearby[index];
  }
  // console.log("Venator Planets " + venatorPlanets);
  var listOfPoints = pointMap.get(currentPoint);
  var i = 0;
  for(i = 0; i < listOfPoints.length; ++i){
    var foundPoint = listOfPoints[i];
    if( ( team == republic && !doesArrayInclude(dreadnoughtPlanets, foundPoint) ) || (team == cis && !doesArrayInclude(venatorPlanets, foundPoint) ) ){
      if(planetOwners[foundPoint] == team){
        foundRoutes.push([0, foundPoint]);
      }
      else{
        var traversed = [currentPoint, foundPoint];
        // console.log("Searching " + point_index_to_string[foundPoint] + "\n" + 1);
        searchNodes(foundPoint, foundPoint, traversed, 1);
      }
    }
  }

  if(foundRoutes.length == 1){
    ai_destination = foundRoutes[0][1];
  }
  else if(foundRoutes.length > 1){
    i = 0;
    var smallestIndex1 = 0;
    var smallestIndex2 = 0;
    for(i = 0; i < foundRoutes.length; ++i)
    {
      if(foundRoutes[i][0] < foundRoutes[smallestIndex1][0])
        smallestIndex1 = i;
    }
    for(i = 0; i < foundRoutes.length; ++i)
    {
      if(i != smallestIndex1 && foundRoutes[i][0] < foundRoutes[smallestIndex2][0])
        smallestIndex2 = i;
    }
    // var index = smallestIndex1;
    var index = Math.random();
    if(index < 0.8){
      index = smallestIndex1;
    }
    else{
      index = smallestIndex2;
    }
    ai_destination = foundRoutes[index][1];
  }
  saveState();
}

function searchNodes(point, first, points_traversed, num_traversals){
  if(num_traversals > 100){
    console.log("Got to 100 route traversals, returning");
    return;
  }
  var listOfPoints = pointMap.get(point);
  var i = 0;
  for(i = 0; i < listOfPoints.length; ++i){
    var foundPoint = listOfPoints[i];
    if(!doesArrayInclude(points_traversed, foundPoint) &&
      ( ( team == republic && !doesArrayInclude(dreadnoughtPlanets, foundPoint) ) || (team == cis && !doesArrayInclude(venatorPlanets, foundPoint) ) ) ){
      if(planetOwners[foundPoint] == team){
        foundRoutes.push([num_traversals, first]);
      }
      else{
        var new_traversed = [];
        var j = 0;
        for(j = 0; j < points_traversed.length; ++j)
          new_traversed.push(points_traversed[j]);
        new_traversed.push(foundPoint);
        // console.log("Current: " + point_index_to_string[point] + "\nSearching: " + point_index_to_string[foundPoint] + "\nFirst: " + point_index_to_string[first] + "\n" + (num_traversals + 1));
        searchNodes(foundPoint, first, new_traversed, num_traversals + 1);
      }
    }
  }
}

function setLinesGreySrc(){
  var i = 0;
  for(i = 0; i < 33; ++i){
    document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).src = "galactic_conquest/grey_line.png";
  }
}

function ai_use_bonus(){
  //Increase Difficulty - 600
  //Decrease Battle Points - 400
  ai_bonus = na;
  if(ai_credits >= bonusCreditCosts[increase_difficulty - 1]){
    if(Math.random() >= 0.5){
      ai_bonus = increase_difficulty; //=7
      ai_credits -= bonusCreditCosts[increase_difficulty - 1];
    }
    else if(ai_credits >= bonusCreditCosts[decrease_battle_points - 1]){
      ai_bonus = decrease_battle_points; //=6
      ai_credits -= bonusCreditCosts[decrease_battle_points - 1];
    }
  }
  else if(ai_credits >= bonusCreditCosts[decrease_battle_points - 1]){
    ai_bonus = decrease_battle_points;
    ai_credits -= bonusCreditCosts[decrease_battle_points - 1];
  }
  console.log("AI Credits: " + ai_credits + " After Bought Bonus");
  saveState();
}

function loadVictoryDefeat(){
  loadVictoryDefeatAnimationRunning = true;
  sound_theme.pause();
  document.getElementById("victory_div" ).style.display = "none";
  document.getElementById("defeat_div"  ).style.display = "none";
  document.getElementById("results_text").style.display = "none";
  setTimeout(function(){ //Not state sensitive
    loadVictoryDefeatAnimationRunning = false;
    setElements();
  }, 3000);
}

function showAIBonusAnimation(){
  shoawAIBonusAnimationRunning = true;
  sub_state = sub_attack_settings;
  setTimeout(function(){ //Not state sensitive
    shoawAIBonusAnimationRunning = false;
    setElements();
    loadVictoryDefeat();
  }, 5000);
}

function loadAttackSettingsScreen(){
  if(sub_state == sub_show_ai_bonus){
    setElements();
    showAIBonusAnimation();
  }
  else{
    sub_state = sub_attack_settings;
    setElements();
    loadVictoryDefeat();
  }
  saveState();
}

function use() {
  if(soundEnabled){
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  player_bonus = selected_attack_bonus;
  var i = 0;
  var index = 0;
  for(i = 0; i < 3; i++){
    if(owned_bonuses[i][0] == selected_attack_bonus){
      index = i;
      break;
    }
  }
  owned_bonuses[index][0] = na;
  owned_bonuses[index][1] = "galactic_conquest/bonus_background.png";
  ai_use_bonus();
  if(ai_bonus != na)
    sub_state = sub_show_ai_bonus;
  setElements();
  loadAttackSettingsScreen();
  saveState();
}

function skip(){ //Skip using bonus
  if(soundEnabled){
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  player_bonus = na;
  ai_use_bonus();
  if(ai_bonus != na)
    sub_state = sub_show_ai_bonus;
  setElements();
  loadAttackSettingsScreen();
  saveState();
}

function countOwnedPlanets(team2){
  var count = 0;
  var i = 0;
  for (i = 1; i < planetOwners.length; ++i) {
    var team3 = planetOwners[i];
    if(team3 == team2)
      ++count;
  }
  return count;
}

function countFleets(team2){
  var count = 0;
  var i = 0;
  if(team2 == republic){
    for(i = 0; i < 26; ++i){
      if(venatorPlanets[i] != na)
        ++count;
    }
  }
  else{
    for(i = 0; i < 26; ++i){
      if(dreadnoughtPlanets[i] != na)
        ++count;
    }
  }
  return count;
}

function getFirstFleetIndex(team2){
  var i = 0;
  if(team2 == republic){
    for(i = 0; i < 26; ++i){
      if(venatorPlanets[i] != na)
        return i;
    }
  }
  else{
    for(i = 0; i < 26; ++i){
      if(dreadnoughtPlanets[i] != na)
        return i;
    }
  }
  return 0;
}

function checkForDestroyFleet(point, team2){
  if(team2 == republic){
    if(doesArrayInclude(venatorPlanets, point)){
      venatorPlanets[venatorPlanets.indexOf(point)] = na;
      if(team2 == team && soundEnabled){
        var index = getRandomNumber(2);
        sound_fleet_defeated[team][index].currentTime = 0;
        sound_fleet_defeated[team][index].play();
      }
      if(countFleets(republic) == 0){
        venatorPlanets[0] = getShipStartPoint(republic);
        checkForPlanetAttack(team2, venatorPlanets[0]);
      }
    }
    if(team2 == team && !doesArrayInclude(venatorPlanets, selectedVenator[0])){
        selectPoint(point_index_to_string[venatorPlanets[getFirstFleetIndex(republic)]], true);
        setElements();
    }
  }
  else{
    if(doesArrayInclude(dreadnoughtPlanets, point)){
      dreadnoughtPlanets[dreadnoughtPlanets.indexOf(point)] = na;
      if(team2 == team && soundEnabled){
        var index = getRandomNumber(2);
        sound_fleet_defeated[team][index].currentTime = 0;
        sound_fleet_defeated[team][index].play();
      }
      if(countFleets(cis) == 0){
        dreadnoughtPlanets[0] = getShipStartPoint(cis);
        checkForPlanetAttack(team2, dreadnoughtPlanets[0]);
      }
    }
    if(team2 == team && !doesArrayInclude(dreadnoughtPlanets, selectedDreadnought[0])){
      selectPoint(point_index_to_string[dreadnoughtPlanets[getFirstFleetIndex(cis)]], true);
      setElements();
    }
  }
  saveState();
}

function calculateCreditEarnings(){
  playerPlanetaryBonus = 0;
  aiPlanetaryBonus = 0;
  var i = 0;
  for (i = 1; i < planetOwners.length; ++i) {
   var planet = i;
   var team2 = planetOwners[i];
   if(team2 != na){
     if(team2 == team){
       playerPlanetaryBonus += planetBonuses.get(planet);
     }
     else{
       aiPlanetaryBonus += planetBonuses.get(planet);
     }
   }
 }

  playerVictoryBonus = 0;
  aiVictoryBonus = 0;
  if(wasVictory){
    if(planetOwners[attackingPlanet] != na){ //Planet/Space Battle
      playerVictoryBonus = planetVictoryResources.get(attackingPlanet);
      aiVictoryBonus = 200;
    }
    else{ //Point Battle
      playerVictoryBonus = 200;
      aiVictoryBonus = 0;
    }
  }
  else{
    if(planetOwners[attackingPlanet] != na){ //Planet/Space Battle
      aiVictoryBonus = planetVictoryResources.get(attackingPlanet);
      playerVictoryBonus = 200;
    }
    else{ //Point Battle
      aiVictoryBonus = 200;
      playerVictoryBonus = 0;
    }
  }
  credits += playerPlanetaryBonus + playerVictoryBonus;
  ai_credits += aiPlanetaryBonus + aiVictoryBonus;
  console.log("AI Credits: " + ai_credits + " After Battle");
  saveState();
}

function victory(){
  if(soundEnabled){
    sound_select_cancel.currentTime = 0;
    sound_select_cancel.play();
    sound_theme.play();
    sound_victory[republic].pause();
    sound_victory[cis].pause();
    sound_defeat.pause();
  }
  if(state == state_attack_planet){
    wasVictory = true;
    if(planetOwners[attackingPlanet] != na){
      planetOwners[attackingPlanet] = team;
    }
    calculateCreditEarnings();
    sub_state = sub_credits_results;
    if(team == republic){
      selectPoint(point_index_to_string[selectedVenator[0]], true);
      checkForDestroyFleet(attackingPlanet, cis);
      if(countOwnedPlanets(cis) == 0){
        if(soundEnabled){
          sound_theme.pause();
          sound_victory[team].currentTime = 0;
          sound_victory[team].play();
        }
        state = state_end_game;
      }
    }
    else{
      selectPoint(point_index_to_string[selectedDreadnought[0]], true);
      checkForDestroyFleet(attackingPlanet, republic);
      if(countOwnedPlanets(republic) == 0){
        if(soundEnabled){
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

function defeat(){
  if(soundEnabled){
    sound_select_cancel.currentTime = 0;
    sound_select_cancel.play();
    sound_theme.play();
    sound_victory[republic].pause();
    sound_victory[cis].pause();
    sound_defeat.pause();
  }
  if(state == state_attack_planet){
    wasVictory = false;
    if(planetOwners[attackingPlanet] != na){
      if(team == republic){
        planetOwners[attackingPlanet] = cis;
        if(countOwnedPlanets(republic) == 0){
          if(soundEnabled){
            sound_theme.pause();
            sound_defeat.currentTime = 0;
            sound_defeat.play();
          }
          state = state_end_game;
        }
      }
      else{
        planetOwners[attackingPlanet] = republic;
        if(countOwnedPlanets(cis) == 0){
          if(soundEnabled){
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

function credits_results_ok(){
  if(state == state_attack_planet){
    if(soundEnabled){
      sound_select_cancel.currentTime = 0;
      sound_select_cancel.play();
      sound_theme.play();
      sound_victory[republic].pause();
      sound_victory[cis].pause();
      sound_defeat.pause();
    }
    selectPoint(point_index_to_string[selectedPlanet], true);
    document.getElementById("galaxy_all").style.display =            "block";
    document.getElementById("credits_results_div").style.display =   "none";
    document.getElementById("planet_screen").style.display =         "block";
    document.getElementById("team_select").style.display =           "none";
    document.getElementById("move_div").style.display =              "none";
    document.getElementById("help_div").style.display =              "none";
    document.getElementById("build_div").style.display =             "none";
    document.getElementById("end_div").style.display =               "none";
    document.getElementById("move_mode_div").style.display =         "none";
    document.getElementById("bonus_mode_div").style.display =        "none";
    document.getElementById("buy_div").style.display =               "none";
    document.getElementById("bonus_view_div").style.display =        "none";
    document.getElementById("credits_display").style.display =       "block";
    document.getElementById("point_description_div").style.display = "none";
    state = state_galaxy_view;
    wipeToGalaxyAnimation(true);
    saveState();
  }
}

function saveState(){
  var daysToExpire = 365;
  setCookie("version"                        , version                         , daysToExpire);
  setCookie("team"                           , team                            , daysToExpire);
  setCookie("state"                          , state                           , daysToExpire);
  setCookie("sub_state"                      , sub_state                       , daysToExpire);
  setCookie("planetOwners"                   , planetOwners                    , daysToExpire);
  setCookie("selectedPlanet"                 , selectedPlanet                  , daysToExpire);
  setCookie("attackingPlanet"                , attackingPlanet                 , daysToExpire);
  setCookie("selectedLoopId"                 , selectedLoopId                  , daysToExpire);
  setCookie("dreadnoughtPlanets"             , dreadnoughtPlanets              , daysToExpire);
  setCookie("selectedDreadnought"            , selectedDreadnought             , daysToExpire);
  setCookie("venatorPlanets"                 , venatorPlanets                  , daysToExpire);
  setCookie("selectedVenator"                , selectedVenator                 , daysToExpire);
  setCookie("credits"                        , credits                         , daysToExpire);
  setCookie("ai_credits"                     , ai_credits                      , daysToExpire);
  setCookie("fleet_cost"                     , fleet_cost                      , daysToExpire);
  setCookie("ai_fleet_cost"                  , ai_fleet_cost                   , daysToExpire);
  setCookie("ai_bonus"                       , ai_bonus                        , daysToExpire);
  setCookie("player_bonus"                   , player_bonus                    , daysToExpire);
  setCookie("hasMovedThisTurn"               , hasMovedThisTurn                , daysToExpire);
  setCookie("canMove"                        , canMove                         , daysToExpire);
  setCookie("owned_bonuses"                  , owned_bonuses                   , daysToExpire);
  setCookie("selected_attack_bonus"          , selected_attack_bonus           , daysToExpire);
  setCookie("buy_needs_confirmation"         , buy_needs_confirmation          , daysToExpire);
  setCookie("wasVictory"                     , wasVictory                      , daysToExpire);
  setCookie("playerPlanetaryBonus"           , playerPlanetaryBonus            , daysToExpire);
  setCookie("aiPlanetaryBonus"               , aiPlanetaryBonus                , daysToExpire);
  setCookie("playerVictoryBonus"             , playerVictoryBonus              , daysToExpire);
  setCookie("aiVictoryBonus"                 , aiVictoryBonus                  , daysToExpire);
  setCookie("ai_destination"                 , ai_destination                  , daysToExpire);
  setCookie("foundRoutes"                    , foundRoutes                     , daysToExpire);
  setCookie("ai_selectedFleet"               , ai_selectedFleet                , daysToExpire);
  setCookie("wipeToPlanetAnimationRunning"   , wipeToPlanetAnimationRunning    , daysToExpire);
  setCookie("wipeToGalaxyAnimationRunning"   , wipeToGalaxyAnimationRunning    , daysToExpire);
  setCookie("ai_moving_animation1_running"   , ai_moving_animation1_running    , daysToExpire);
  setCookie("ai_moving_animation2_running"   , ai_moving_animation2_running    , daysToExpire);
  setCookie("loadAttackBonusAnimationRunning", loadAttackBonusAnimationRunning , daysToExpire);
  setCookie("ai_building_animation_running"  , ai_building_animation_running   , daysToExpire);
  setCookie("spaceBattle"                    , spaceBattle                     , daysToExpire);
  setCookie("zoom_level"                     , zoom_level                      , daysToExpire);
  // console.log("Saved State");
}

function deleteAllCookies(){
  deleteCookie("version"                        );
  deleteCookie("team"                           );
  deleteCookie("state"                          );
  deleteCookie("sub_state"                      );
  deleteCookie("planetOwners"                   );
  deleteCookie("selectedPlanet"                 );
  deleteCookie("attackingPlanet"                );
  deleteCookie("selectedLoopId"                 );
  deleteCookie("dreadnoughtPlanets"             );
  deleteCookie("selectedDreadnought"            );
  deleteCookie("venatorPlanets"                 );
  deleteCookie("selectedVenator"                );
  deleteCookie("credits"                        );
  deleteCookie("ai_credits"                     );
  deleteCookie("fleet_cost"                     );
  deleteCookie("ai_fleet_cost"                  );
  deleteCookie("ai_bonus"                       );
  deleteCookie("player_bonus"                   );
  deleteCookie("hasMovedThisTurn"               );
  deleteCookie("canMove"                        );
  deleteCookie("owned_bonuses"                  );
  deleteCookie("selected_attack_bonus"          );
  deleteCookie("buy_needs_confirmation"         );
  deleteCookie("wasVictory"                     );
  deleteCookie("playerPlanetaryBonus"           );
  deleteCookie("aiPlanetaryBonus"               );
  deleteCookie("playerVictoryBonus"             );
  deleteCookie("aiVictoryBonus"                 );
  deleteCookie("ai_destination"                 );
  deleteCookie("foundRoutes"                    );
  deleteCookie("ai_selectedFleet"               );
  deleteCookie("wipeToPlanetAnimationRunning"   );
  deleteCookie("wipeToGalaxyAnimationRunning"   );
  deleteCookie("ai_moving_animation1_running"   );
  deleteCookie("ai_moving_animation2_running"   );
  deleteCookie("loadAttackBonusAnimationRunning");
  deleteCookie("ai_building_animation_running"  );
  deleteCookie("spaceBattle"                    );
  deleteCookie("zoom_level"                     );
}

function loadState(){
  var versionTemp                   = getCookie("version"                        );
  if(versionTemp == version){
    team                            = getCookie("team"                           );
    initializeTeams();
    state                           = getCookie("state"                          );
    sub_state                       = getCookie("sub_state"                      );
    planetOwners                    = getCookie("planetOwners"                   );
    selectedPlanet                  = getCookie("selectedPlanet"                 );
    attackingPlanet                 = getCookie("attackingPlanet"                );
    selectedLoopId                  = getCookie("selectedLoopId"                 );
    dreadnoughtPlanets              = getCookie("dreadnoughtPlanets"             );
    selectedDreadnought             = getCookie("selectedDreadnought"            );
    venatorPlanets                  = getCookie("venatorPlanets"                 );
    selectedVenator                 = getCookie("selectedVenator"                );
    credits                         = getCookie("credits"                        );
    ai_credits                      = getCookie("ai_credits"                     );
    fleet_cost                      = getCookie("fleet_cost"                     );
    ai_fleet_cost                   = getCookie("ai_fleet_cost"                  );
    ai_bonus                        = getCookie("ai_bonus"                       );
    player_bonus                    = getCookie("player_bonus"                   );
    hasMovedThisTurn                = getCookie("hasMovedThisTurn"               );
    canMove                         = getCookie("canMove"                        );
    owned_bonuses                   = getCookie("owned_bonuses"                  );
    selected_attack_bonus           = getCookie("selected_attack_bonus"          );
    buy_needs_confirmation          = getCookie("buy_needs_confirmation"         );
    wasVictory                      = getCookie("wasVictory"                     );
    playerPlanetaryBonus            = getCookie("playerPlanetaryBonus"           );
    aiPlanetaryBonus                = getCookie("aiPlanetaryBonus"               );
    playerVictoryBonus              = getCookie("playerVictoryBonus"             );
    aiVictoryBonus                  = getCookie("aiVictoryBonus"                 );
    ai_destination                  = getCookie("ai_destination"                 );
    foundRoutes                     = getCookie("foundRoutes"                    );
    ai_selectedFleet                = getCookie("ai_selectedFleet"               );
    wipeToPlanetAnimationRunning    = getCookie("wipeToPlanetAnimationRunning"   );
    wipeToGalaxyAnimationRunning    = getCookie("wipeToGalaxyAnimationRunning"   );
    ai_moving_animation1_running    = getCookie("ai_moving_animation1_running"   );
    ai_moving_animation2_running    = getCookie("ai_moving_animation2_running"   );
    loadAttackBonusAnimationRunning = getCookie("loadAttackBonusAnimationRunning");
    ai_building_animation_running   = getCookie("ai_building_animation_running"  );
    spaceBattle                     = getCookie("spaceBattle"                    );
    zoom_level                      = getCookie("zoom_level"                     );
    setZoomSizes();
    selectPoint(point_index_to_string[selectedPlanet], true);
    setElements();
    if(wipeToPlanetAnimationRunning){
      wipeToPlanetAnimationRunning = false;
      wipeToPlanetAnimation(false);
      console.log("Restarting wipeToPlanetAnimation");
    }
    if(wipeToGalaxyAnimationRunning){
      wipeToGalaxyAnimationRunning = false;
      wipeToGalaxyAnimation(false);
      console.log("Restarting wipeToGalaxyAnimation");
    }
    if(ai_moving_animation1_running){
      ai_move_animation1(0);
      console.log("Restarting ai_move_animation1");
    }
    if(ai_moving_animation2_running){
      ai_move_animation2(0);
      console.log("Restarting ai_move_animation2");
    }
    if(loadAttackBonusAnimationRunning){
      loadAttackBonusAnimation(0);
      console.log("Restarting loadAttackBonusAnimation");
    }
    if(ai_building_animation_running){
      ai_build_animation(0);
      console.log("Restarting ai_build_animation");
    }
    console.log("AI Credits: " + ai_credits + " After Loading State");
  }
  else{
    saveState();
  }
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
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
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  var jvalue = JSON.stringify(cvalue);
  // console.log("Saved " + cname + " JSON|" + jvalue + "|");
  document.cookie = cname + "=" + jvalue + ";" + expires + "; SameSite=Strict; path=/";
}

function deleteCookie(cname){
  document.cookie = cname + "= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; path=/";
}

function doesArrayInclude(array, item){
  var i = 0;
  for(i = 0; i < array.length; ++i){
    if(array[i] == item)
      return true;
  }
  return false;
}

function zoom_out(){
  if(soundEnabled){
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  zoom_level -= 0.1;
  if(Math.abs(zoom_level - 1) < 0.05)
    zoom_level = 1;
  else if(Math.abs(zoom_level) < 0.05)
    zoom_level = 0.1;
  setZoomSizes();
  saveState();
}

function zoom_in(){
  if(soundEnabled){
    sound_select_long.currentTime = 0;
    sound_select_long.play();
  }
  zoom_level += 0.1;
  if(Math.abs(zoom_level - 1) < 0.05)
    zoom_level = 1;
  setZoomSizes();
  saveState();
}

function onSoundMouseOver() {
  if(soundEnabled && !cursor_over_button){
    sound_select.currentTime = 0;
    sound_select.play();
  }
  document.getElementById("sound_button").src = "galactic_conquest/button_glow.png";
  if(soundEnabled)
    document.getElementById("sound_image").src = "galactic_conquest/astromech_head_yellow.gif";
  else
    document.getElementById("sound_image").src = "galactic_conquest/astromech_head_yellow_cross.gif";
  cursor_over_button = true;
}

function onSoundMouseOut() {
  document.getElementById("sound_button").src = "galactic_conquest/button_grey.png";
  if(soundEnabled)
    document.getElementById("sound_image").src = "galactic_conquest/astromech_head_blue.gif";
  else
    document.getElementById("sound_image").src = "galactic_conquest/astromech_head_blue_cross.gif";
  cursor_over_button = false;
}

function sound_toggle(){
  if(soundEnabled){
    sound_theme.pause();
    sound_victory[republic].pause();
    sound_victory[cis].pause();
    sound_defeat.pause();
    soundEnabled = false;
    document.getElementById("sound_image").src = "galactic_conquest/astromech_head_yellow_cross.gif";
  }
  else{
    // sound_theme = document.getElementById("sound_theme");
    if(state != state_attack_planet && state != state_end_game){
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

function img_onLoad(num){
  imgs_loaded[num] = true;
  if(!doesArrayInclude(imgs_loaded, false)){
    document.getElementById("loading_screen").style.display = "none";
    sound_theme                                = document.getElementById("sound_theme");
    sound_error                                = document.getElementById("sound_error");
    sound_select                               = document.getElementById("sound_select"); 
    sound_select_cancel                        = document.getElementById("sound_select_cancel");
    sound_select_long                          = document.getElementById("sound_select_long");
    sound_felucia                                    = [document.getElementById("sound_error"), document.getElementById("sound_republic_felucia"                        ), document.getElementById("sound_cis_felucia"                        )];
    sound_fleet_constructed                          = [document.getElementById("sound_error"), document.getElementById("sound_republic_fleet_constructed"              ), document.getElementById("sound_cis_fleet_constructed"              )];
    sound_fleet_defeated                             = [
    [document.getElementById("sound_error"                    ), document.getElementById("sound_error"                    ), document.getElementById("sound_error"                    )], 
    [document.getElementById("sound_republic_fleet_defeated_1"), document.getElementById("sound_republic_fleet_defeated_2"), document.getElementById("sound_republic_fleet_defeated_3")],
    [document.getElementById("sound_cis_fleet_defeated_1"     ), document.getElementById("sound_cis_fleet_defeated_2"     ), document.getElementById("sound_cis_fleet_defeated_3"     )] ];
    sound_geonosis                                   = [document.getElementById("sound_error"), document.getElementById("sound_republic_geonosis"                       ), document.getElementById("sound_cis_geonosis"                       )];
    sound_kamino                                     = [document.getElementById("sound_error"), document.getElementById("sound_republic_kamino"                         ), document.getElementById("sound_cis_kamino"                         )];
    sound_kashyyyk                                   = [document.getElementById("sound_error"), document.getElementById("sound_republic_kashyyyk"                       ), document.getElementById("sound_cis_kashyyyk"                       )];
    sound_movement_cancelled                         = [document.getElementById("sound_error"), document.getElementById("sound_republic_movement_cancelled"             ), document.getElementById("sound_cis_movement_cancelled"             )];
    sound_naboo                                      = [document.getElementById("sound_error"), document.getElementById("sound_republic_naboo"                          ), document.getElementById("sound_cis_naboo"                          )];
    sound_select_a_bonus_for_this_battle             = [document.getElementById("sound_error"), document.getElementById("sound_republic_select_a_bonus_for_this_battle" ), document.getElementById("sound_cis_select_a_bonus_for_this_battle" )];
    sound_select_a_bonus_to_purchase                 = [document.getElementById("sound_error"), document.getElementById("sound_republic_select_a_bonus_to_purchase"     ), document.getElementById("sound_cis_select_a_bonus_to_purchase"     )];
    sound_select_destination                         = [
      [document.getElementById("sound_error"                        ), document.getElementById("sound_error"                        )],
      [document.getElementById("sound_republic_select_destination_1"), document.getElementById("sound_republic_select_destination_2")], 
      [document.getElementById("sound_cis_select_destination_1"     ), document.getElementById("sound_cis_select_destination_2"     )] ];
    sound_select_fleet                               = [
      [document.getElementById("sound_error"                  ), document.getElementById("sound_error"                  ), document.getElementById("sound_error"                  )],
      [document.getElementById("sound_republic_select_fleet_1"), document.getElementById("sound_republic_select_fleet_2"), document.getElementById("sound_republic_select_fleet_3")], 
      [document.getElementById("sound_cis_select_fleet_1"     ), document.getElementById("sound_cis_select_fleet_2"     ), document.getElementById("sound_cis_select_fleet_3"     )] ];
    sound_victory = [document.getElementById("sound_error"), document.getElementById("sound_republic_victory"                       ), document.getElementById("sound_cis_victory"                       )];
    sound_defeat = document.getElementById("sound_defeat");
    console.log("All images loaded");
  }
}

function getRandomNumber(max){
  var num = Math.floor(Math.random() * (max + 1));
  if(num > max)
    num--;
  return num;
}

function restart(){
  if(!wipeToGalaxyAnimationRunning     && 
    !loadAttackBonusAnimationRunning   && 
    !wipeToPlanetAnimationRunning      &&
    !ai_moving_animation1_running      &&
    !ai_moving_animation2_running      &&
    !ai_building_animation_running     &&
    !loadVictoryDefeatAnimationRunning &&
    !shoawAIBonusAnimationRunning){
      if(soundEnabled){
        sound_theme.play();
        sound_victory[republic].pause();
        sound_victory[cis].pause();
        sound_defeat.pause();
      }
      restart_dialogue(false);
      team                            = republic; //OR cis
      state                           = state_team_select; //state_team_select
      sub_state                       = sub_credits_results;
      planetOwners                    = [na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na];
      selectedPlanet                  = geonosis;
      attackingPlanet                 = geonosis;
      selectedLoopId                  = "#loop_geonosis"
      dreadnoughtPlanets              = [na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na];
      selectedDreadnought             = [geonosis, "dreadnought0"];
      venatorPlanets                  = [na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na];
      selectedVenator                 = [kamino, "venator0"];
      credits                         = 1000;
      ai_credits                      = 1000;
      fleet_cost                      = 1000;
      ai_fleet_cost                   = 1000;
      ai_bonus                        = na;
      player_bonus                    = na;
      hasMovedThisTurn                = false;
      canMove                         = false;
      owned_bonuses                   = [[na, "galactic_conquest/bonus_background.png"], [na, "galactic_conquest/bonus_background.png"], [na, "galactic_conquest/bonus_background.png"]];
      selected_attack_bonus           = na;
      buy_needs_confirmation          = false;
      wasVictory                      = false;
      playerPlanetaryBonus            = 0;
      aiPlanetaryBonus                = 0;
      playerVictoryBonus              = 0;
      aiVictoryBonus                  = 0;
      ai_destination                  = na;
      foundRoutes                     = []; //[[num_traversals, first], ... ]
      ai_selectedFleet                = na;
      wipeToPlanetAnimationRunning    = false;
      wipeToGalaxyAnimationRunning    = false;
      ai_moving_animation1_running    = false;
      ai_moving_animation2_running    = false;
      loadAttackBonusAnimationRunning = false;
      ai_building_animation_running   = false;
      spaceBattle                     = false;
      deleteAllCookies();
      var saved_zoom_level = zoom_level;
      zoom_level = 1;
      setZoomSizes();
      onLoadCheck();
      zoom_level = saved_zoom_level;
      setZoomSizes();
    }else{
      if(soundEnabled){
        sound_error.currentTime = 0;
        sound_error.play();
      }
    }
}

function restart_dialogue(bool){
  if(bool){
    if(soundEnabled){
      sound_select_long.currentTime = 0;
      sound_select_long.play();
    }
    document.getElementById("restart_screen_div").style.display = "block";
  }
  else{
    if(soundEnabled){
      sound_select_cancel.currentTime = 0;
      sound_select_cancel.play();
    }
    document.getElementById("restart_screen_div").style.display = "none";
  }
}

function onDonateMouseOver(){
  if(soundEnabled && !cursor_over_button){
    sound_select.currentTime = 0;
    sound_select.play();
  }
  cursor_over_button = true;
  document.getElementById("donate_earth_button").src="galactic_conquest/donate_button_glow.png";
}

function onDonateMouseOut(){
  cursor_over_button = false;
  document.getElementById("donate_earth_button").src="galactic_conquest/donate_button_grey.png";
}
