//Temps
var version = 1;
var galaxyRot = 0;
var loopSize = 0.2;
var loopOpacity = 1.8;
var animationSpeed = 1000/60;
var wipeAnimation = 0;
var wipeAnimationRunning = false;

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
//                 team_background
var object_sizes = [[1400, 800]];
var object_pos =   [];

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
                   [point7 , naboo      ], 
                   [naboo , point6      ], 
                   [naboo , point9      ], 
                   [point6 , point8     ], 
                   [point4 , naboo      ], 
                   [point2 , point4     ], 
                   [point1 , point4     ], 
                   [point9 , point8     ], 
                   [point16 , point9    ], 
                   [point10 , point8    ], 
                   [point16 , point10   ], 
                   [point14 , point16   ], 
                   [point11 , point10   ], 
                   [point14 , point11   ],
                   [point11 , point12   ], 
                   [point13 , point12   ], 
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

var bonusCreditCosts = [200, 200, 400, 600 ,600, 600, 400];

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

var ai_destination = na;
var foundRoutes = []; //[[num_traversals, first], ... ]
var numPlayerPlanets = 0;

//Saves
var team = republic; //OR cis
var state = "team_select";
var sub_state = "attack_settings";
var planetOwners = new Map();
var selectedPlanet = geonosis;
var attackingPlanet = geonosis;
var selectedLoopId = "#loop_geonosis"
var dreadnoughtPlanets = [na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na];
var selectedDreadnought = [geonosis, "dreadnought0"];
var venatorPlanets =     [na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na, na];
var selectedVenator = [kamino, "venator0"];
var credits = 1000;
var ai_credits = 1000;
var fleet_cost = 1000;
var ai_fleet_cost = 1000;
var ai_bonus = na;
var player_bonus = na;
var hasMovedThisTurn = false;
var canMove = false;
var owned_bonuses = [[na, "galactic_conquest/bonus_background.png"], [na, "galactic_conquest/bonus_background.png"], [na, "galactic_conquest/bonus_background.png"]];
var selected_attack_bonus = na;
var buy_needs_confirmation = false;

function onLoadCheck() {
  planetOwners.set(felucia,  cis);
  planetOwners.set(geonosis, cis);
  planetOwners.set(kamino  , cis);
  planetOwners.set(kashyyyk, cis);
  planetOwners.set(naboo   , cis);
  planetOwners.set(point1  , na);
  planetOwners.set(point2  , na);
  planetOwners.set(point3  , na);
  planetOwners.set(point4  , na);
  planetOwners.set(point5  , na);
  planetOwners.set(point6  , na);
  planetOwners.set(point7  , na);
  planetOwners.set(point8  , na);
  planetOwners.set(point9  , na);
  planetOwners.set(point10 , na);
  planetOwners.set(point11 , na);
  planetOwners.set(point12 , na);
  planetOwners.set(point13 , na);
  planetOwners.set(point14 , na);
  planetOwners.set(point15 , na);
  planetOwners.set(point16 , na);
  planetOwners.set(point17 , na);
  planetOwners.set(point18 , na);

  pointPosX.set(felucia , 1985);
  pointPosX.set(geonosis, 1667);
  pointPosX.set(kamino  , 1995);
  pointPosX.set(kashyyyk, 1789);
  pointPosX.set(naboo   , 1478);
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
  pointPosX.set(point12 ,  544);
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
  pointPosY.set(naboo   ,  863);
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
  pointPosY.set(point12 ,  949);
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
pointMap.set(naboo ,   [point4, point6, point7, point9]);
pointMap.set(point1  , [point2, point4, point15]); 
pointMap.set(point2  , [point1, point4, point18]);  
pointMap.set(point3  , [felucia, point18]);            
pointMap.set(point4  , [kashyyyk, naboo, point1, point2]);
pointMap.set(point5  , [geonosis, kamino]);
pointMap.set(point6  , [geonosis, naboo, point8]);
pointMap.set(point7  , [kamino, kashyyyk, naboo]);
pointMap.set(point8  , [point6, point9, point10]);
pointMap.set(point9  , [naboo, point8, point16]);
pointMap.set(point10 , [point8, point11, point16]);
pointMap.set(point11 , [point10, point12, point14]);
pointMap.set(point12 , [point11, point13]);         
pointMap.set(point13 , [point12, point14, point15]);
pointMap.set(point14 , [point11, point13, point16]);
pointMap.set(point15 , [point1, point13]);          
pointMap.set(point16 , [point9, point10, point14]);
pointMap.set(point17 , [felucia, kamino, kashyyyk]);
pointMap.set(point18 , [kashyyyk, point2, point3]);

  //Generate lines
  var i = 0;
  for(i = 0; i < 33; ++i){
    var size0 = (pointPosY.get(pointPairs[i][0])/sizePosYDivider) * 100;
    var halfsize0 = size0/2;
    var size1 = (pointPosY.get(pointPairs[i][1])/sizePosYDivider) * 100;
    var halfsize1 = size1/2;
    document.getElementById(point_index_to_string[pointPairs[i][0]]).style.width  = size0 + "px";
    document.getElementById(point_index_to_string[pointPairs[i][0]]).style.height = size0 + "px";
    document.getElementById(point_index_to_string[pointPairs[i][1]]).style.width  = size1 + "px";
    document.getElementById(point_index_to_string[pointPairs[i][1]]).style.height = size1 + "px";
    document.getElementById("loop_" + point_index_to_string[pointPairs[i][0]]).style.width  = size0 + "px";
    document.getElementById("loop_" + point_index_to_string[pointPairs[i][0]]).style.height = size0 + "px";
    document.getElementById("loop_" + point_index_to_string[pointPairs[i][1]]).style.width  = size1 + "px";
    document.getElementById("loop_" + point_index_to_string[pointPairs[i][1]]).style.height = size1 + "px";
    var x0 = pointPosX.get(pointPairs[i][0]) + halfsize0;
    var x1 = pointPosX.get(pointPairs[i][1]) + halfsize1;
    var y0 = pointPosY.get(pointPairs[i][0]) + halfsize0;
    var y1 = pointPosY.get(pointPairs[i][1]) + halfsize1;
    var xdist = x0 - x1;
    var ydist = y0 - y1;
    var dist = Math.floor(Math.sqrt(xdist * xdist + ydist * ydist));
    document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.width = dist + "px";
    document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.left  = Math.floor(xdist/2) + x1 + "px";
    document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.top   = Math.floor(ydist/2) + y1 + "px";
    document.getElementById(point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]]).style.transform = "translateX(" + dist/-2 + "px) rotate(" + ((Math.atan(xdist/ydist) * (-180/Math.PI)) - 90) + "deg)";
  }

  dreadnoughtPlanets[0] = getShipStartPoint(cis);
  venatorPlanets[0] = getShipStartPoint(republic);
  selectedDreadnought[0] = dreadnoughtPlanets[0];
  selectedVenator[0] = venatorPlanets[0];
  setElements();
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
      venator.style.left = x + 30 + "px";
      venator.style.top  = y - 20 + "px";
      venator.style.height = size + "px";
      venator.style.width = size + "px";
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
      dread.style.left = x - 40 + "px";
      dread.style.top  = y - 30 + "px";
      dread.style.height = size + "px";
      dread.style.width = size + "px";
      dread.style.zIndex = y;
      dread.style.display = "block";
    }
  }

    for (var [planet, team2] of planetOwners) {
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

    if(state == "team_select"){
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
    }
    else if(state == "galaxy_view"){
      document.getElementById("galaxy_all").style.display =            "block";
      document.getElementById("planet_screen").style.display =         "none";
      document.getElementById("team_select").style.display =           "none";
      if(canMove && !hasMovedThisTurn)
        document.getElementById("move_div").style.display =            "block";
      else
        document.getElementById("move_div").style.display =            "none";
      document.getElementById("help_div").style.display =              "block";
      if(venatorPlanets.includes(selectedPlanet) || dreadnoughtPlanets.includes(selectedPlanet) || planetOwners.get(selectedPlanet) != team)
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
    }
    else if(state == "bonus_view"){
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
      if(sub_state == "buying"){
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
    else if(state == "ai_moving"){
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
    }
    else if(state == "attack_planet"){
      document.getElementById("bonus_attack_ai_div").style.display = "none";
      document.getElementById("attack_settings_div").style.display = "none";
      document.getElementById("bonus_attack_div").style.display = "none";

      document.getElementById("planet_screen").style.display =          "block";

      if(venatorPlanets.includes(attackingPlanet))
        document.getElementById("venator_attack").style.display = "block";
      else
        document.getElementById("venator_attack").style.display = "none";

      if(dreadnoughtPlanets.includes(attackingPlanet))
        document.getElementById("dreadnought_attack").style.display = "block";
      else
        document.getElementById("dreadnought_attack").style.display = "none";

      if(sub_state == "kamino_air"){
        document.getElementById("attack_planet_background").src = "galactic_conquest/kamino_air.png";
        document.getElementById("venator_attack").src = "galactic_conquest/venator_reverse.png";
      }
      else if(sub_state == "ryloth"){
        document.getElementById("attack_planet_background").src = "galactic_conquest/ryloth.png";
        document.getElementById("venator_attack").src = "galactic_conquest/venator.png";
      }
      else if(sub_state == "felucia"){
        document.getElementById("attack_planet_background").src = "galactic_conquest/felucia.png";
        document.getElementById("venator_attack").src = "galactic_conquest/venator_reverse.png";
      }
      else if(sub_state == "geonosis"){
        document.getElementById("attack_planet_background").src = "galactic_conquest/geonosis.png";
        document.getElementById("venator_attack").src = "galactic_conquest/venator.png";
      }
      else if(sub_state == "kamino_ground"){
        document.getElementById("attack_planet_background").src = "galactic_conquest/kamino_ground.png";
        document.getElementById("venator_attack").src = "galactic_conquest/venator_reverse.png";
      }
      else if(sub_state == "kashyyyk"){
        document.getElementById("attack_planet_background").src = "galactic_conquest/kashyyyk.png";
        document.getElementById("venator_attack").src = "galactic_conquest/venator.png";
      }
      else if(sub_state == "naboo"){ //Naboo
        document.getElementById("attack_planet_background").src = "galactic_conquest/naboo.png";
        document.getElementById("venator_attack").src = "galactic_conquest/venator_reverse.png";
      }
      else if(sub_state == "attack_bonus"){
        document.getElementById("galaxy_all").style.display =             "none";
        document.getElementById("bonus_attack_div").style.display = "block";
        document.getElementById("bonus_attack_ai_div").style.display = "none";
        document.getElementById("attack_settings_div").style.display = "none";
      }
      else if(sub_state == "show_ai_bonus"){
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
        if(dreadnoughtPlanets.includes(attackingPlanet) && venatorPlanets.includes(attackingPlanet)){
          document.getElementById("bonus_attack_ai_description").innerHTML = bonusDescriptionsStarfighters[ai_bonus - 1];
        }
        else{
          document.getElementById("bonus_attack_ai_description").innerHTML = bonusDescriptionsGround[ai_bonus - 1];
        }
      }
      else if(sub_state == "attack_settings")
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
        if(dreadnoughtPlanets.includes(attackingPlanet) && venatorPlanets.includes(attackingPlanet)){
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
    }
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
      planetOwners.set(felucia,  cis);
      planetOwners.set(geonosis, cis);
      planetOwners.set(kamino  , republic);
      planetOwners.set(kashyyyk, cis);
      planetOwners.set(naboo   , cis);
      document.getElementById("republic_home").src = "galactic_conquest/republic_logo_blue.png";
      selectPoint(point_index_to_string[venatorPlanets[getFirstFleetIndex(republic)]], true);
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
    }
    else{
      planetOwners.set(felucia,  republic);
      planetOwners.set(geonosis, cis);
      planetOwners.set(kamino  , republic);
      planetOwners.set(kashyyyk, republic);
      planetOwners.set(naboo   , republic);
      document.getElementById("cis_home").src = "galactic_conquest/cis_logo_blue.png";
      selectPoint(point_index_to_string[dreadnoughtPlanets[getFirstFleetIndex(cis)]], true);
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
      document.getElementById("dreadnought0").src = "galactic_conquest/dreadnought_blue.png";
    }
}

function hideTeamSelect(team2) {
  if(state == "team_select"){
    bonus_select(-2);
    state = "galaxy_view";
    team = team2;
    initializeTeams();
    setElements();
  }
}

function setLineStyles(oldPlanet, newPlanet){
  var i = 0;
    for(i = 0; i < 33; ++i){
      if(pointPairs[i][0] == oldPlanet || pointPairs[i][1] == oldPlanet){
        var idP = point_index_to_string[pointPairs[i][0]] + "_" + point_index_to_string[pointPairs[i][1]];
        //document.getElementById(idP).src = "galactic_conquest/grey_line.png";
        document.getElementById(idP).style.opacity = "0.2";
        //document.getElementById(idP).style.height  = "3px";
      }
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
  if(state == "galaxy_view" && selectedPlanet != point_index_to_string.indexOf(planet))
    if(planetOwners.get(point_index_to_string.indexOf(planet)) == team)
      document.getElementById(planet).src="galactic_conquest/blue_planet_hover.png";
    else
      document.getElementById(planet).src="galactic_conquest/red_planet_hover.png";
}

function onPlanetMouseOut(planet){
  if(state == "galaxy_view" && selectedPlanet != point_index_to_string.indexOf(planet))
    if(planetOwners.get(point_index_to_string.indexOf(planet)) == team)
      document.getElementById(planet).src="galactic_conquest/blue_planet_idle.png";
    else
      document.getElementById(planet).src="galactic_conquest/red_planet_idle.png";
}

function selectPoint(point, overrideState){
  if(state == "galaxy_view" || overrideState){
    point = point_index_to_string.indexOf(point);
    var i = 0;
    if(team == republic){
      //Change back last selected line
      setLinesGreySrc();

      //Select Venator
      if(venatorPlanets.includes(point)){
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
      if(pointMap.get(point).includes(selectedVenator[0]) && !hasMovedThisTurn){
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
        if(dreadnoughtPlanets.includes(point)){
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
        if( pointMap.get(point).includes(selectedDreadnought[0]) && !hasMovedThisTurn){
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
      var pointCapitalized = point_index_to_string[point];
      pointCapitalized = pointCapitalized.substring(0,1).toUpperCase() + pointCapitalized.substring(1, pointCapitalized.length);
      document.getElementById("point_name").innerHTML = pointCapitalized;
      if(planetOwners.get(point) == team && !venatorPlanets.includes(point) && !dreadnoughtPlanets.includes(point)){
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
      if(planetOwners.get(point) == team){
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
  }
} //End selectPoint()

function ai_selectpoint(point){
  if(state == "ai_moving"){
    var i = 0;
    if(team == cis){
      //Change back last selected line
      setLinesGreySrc();

      //Select Venator
      if(venatorPlanets.includes(point)){
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
      if( pointMap.get(point).includes(selectedVenator[0])){
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
        if(dreadnoughtPlanets.includes(point)){
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
        if( pointMap.get(point).includes(selectedDreadnought[0])){
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
      if(planetOwners.get(point) == team && !venatorPlanets.includes(point) && !dreadnoughtPlanets.includes(point)){
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
      if(planetOwners.get(point) == team){
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
  }
}

function onPointMouseOver(point){
  if(state == "galaxy_view" && selectedPlanet != point_index_to_string.indexOf(point))
      document.getElementById(point).src="galactic_conquest/grey_point_hover.png";
}

function onPointMouseOut(point){
  if(state == "galaxy_view" && selectedPlanet != point_index_to_string.indexOf(point))
      document.getElementById(point).src="galactic_conquest/grey_point_idle.png";
}

function onButtonMouseOverBlue(id){
  document.getElementById(id + "_button").src="galactic_conquest/button_glow_long_blue.png"; 
  // document.getElementById(id + "_text").style.color="#F4AE0A";
}

function onButtonMouseOverRed(id){
  document.getElementById(id + "_button").src="galactic_conquest/button_glow_long_red.png"; 
  // document.getElementById(id + "_text").style.color="#F4350A";
}

function onButtonMouseOutLong(id){
  document.getElementById(id + "_button").src="galactic_conquest/button_grey_long.png";
  document.getElementById(id + "_text").style.color="#E5E5E5";
}

function onButtonMouseOver(id){
  document.getElementById(id + "_button").src="galactic_conquest/button_glow.png"; 
  document.getElementById(id + "_text").style.color="#F4AE0A";
}

function onButtonMouseOut(id){
  document.getElementById(id + "_button").src="galactic_conquest/button_grey.png";
  document.getElementById(id + "_text").style.color="#E5E5E5";
}

function onButtonModeMouseOver(id){
  if(state == "galaxy_view" && id != "move_mode"){
      document.getElementById(id + "_button").src="galactic_conquest/button_glow_long.png"; 
      document.getElementById(id + "_text").style.color="#F4AE0A";
  }
  else if(state == "bonus_view" && id != "bonus_mode"){
      document.getElementById(id + "_button").src="galactic_conquest/button_glow_long.png"; 
      document.getElementById(id + "_text").style.color="#F4AE0A";
  }
}

function onButtonModeMouseOut(id){
  if(state == "galaxy_view" && id != "move_mode"){
    document.getElementById(id + "_button").src="galactic_conquest/button_grey_long.png";
    document.getElementById(id + "_text").style.color="#E5E5E5";
  }
  else if(state == "bonus_view" && id != "bonus_mode"){
    document.getElementById(id + "_button").src="galactic_conquest/button_grey_long.png";
    document.getElementById(id + "_text").style.color="#E5E5E5";
  }
}

function move_mode(){
  if(state == "bonus_view"){
    state = "galaxy_view";
    setElements();
  }
}

function bonus_mode(){
  if(state == "galaxy_view"){
    state = "bonus_view";
    setElements();
    bonus_select(-2);
  }
}

function bonus_select(pos){
  targetSelectPos = pos;
  selectedBonus = Math.abs(pos);
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
    $("#bonus0_img").css("width", bonusWidth[0] + "px");
    $("#bonus1_img").css("width", bonusWidth[1] + "px");
    $("#bonus2_img").css("width", bonusWidth[2] + "px");
    $("#bonus3_img").css("width", bonusWidth[3] + "px");
    $("#bonus4_img").css("width", bonusWidth[4] + "px");
    $("#bonus0_img").css("transform", "perspective(50em) rotateY(" + bonusSelectPos[0] * 22.5 + "deg)");
    $("#bonus1_img").css("transform", "perspective(50em) rotateY(" + bonusSelectPos[1] * 22.5 + "deg)");
    $("#bonus2_img").css("transform", "perspective(50em) rotateY(" + bonusSelectPos[2] * 22.5 + "deg)");
    $("#bonus3_img").css("transform", "perspective(50em) rotateY(" + bonusSelectPos[3] * 22.5 + "deg)");
    $("#bonus4_img").css("transform", "perspective(50em) rotateY(" + bonusSelectPos[4] * 22.5 + "deg)");
    $("#bonus0_img").css("left", (Math.sin((bonusSelectPos[0]/4) * 1.570795) * 616) + (1200 - bonusWidth[0]/2) + "px");
    $("#bonus1_img").css("left", (Math.sin((bonusSelectPos[1]/4) * 1.570795) * 616) + (1200 - bonusWidth[1]/2) + "px");
    $("#bonus2_img").css("left", (Math.sin((bonusSelectPos[2]/4) * 1.570795) * 616) + (1200 - bonusWidth[2]/2) + "px");
    $("#bonus3_img").css("left", (Math.sin((bonusSelectPos[3]/4) * 1.570795) * 616) + (1200 - bonusWidth[3]/2) + "px");
    $("#bonus4_img").css("left", (Math.sin((bonusSelectPos[4]/4) * 1.570795) * 616) + (1200 - bonusWidth[4]/2) + "px");
    setTimeout(function(){
      bonus_select_animation();
    }, animationSpeed);
    }
  else
    bonusAnimationRunning = false;
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
  if(state == "bonus_view"){
    if(bonusCreditCosts[selectedBonus] <= credits){
      sub_state = "buying";
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
    }
  }
}

function confirm_buy(index){
  if(buy_needs_confirmation){
    sub_state = "na";
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
  }
}

function select_attack_bonus(index){
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
    if(dreadnoughtPlanets.includes(attackingPlanet) && venatorPlanets.includes(attackingPlanet))
      document.getElementById("bonus_attack_description").innerHTML = bonusDescriptionsStarfighters[owned_bonuses[index][0]-1];
    else
      document.getElementById("bonus_attack_description").innerHTML = bonusDescriptionsGround[owned_bonuses[index][0]-1];
    
  }
}

function wipePlanetAnimation(){
  if(wipeAnimationRunning){
    wipeAnimation += 30;
    document.getElementById("attack_planet_background").style.clip = "rect(0px," + wipeAnimation + "px,1687px,0px)";
    //Size = 630 x 630
    //Ventator    Left =  900 Top = 700
    //Dreadnought Left = 1300 Top = 400
    if(wipeAnimation >= 900 && wipeAnimation <= 1530)
      document.getElementById("venator_attack").style.clip =     "rect(0px," + (wipeAnimation - 900)  + "px,630px,0px)";
    if(wipeAnimation > 1530)
      document.getElementById("venator_attack").style.clip =     "rect(0px,630px,630px,0px)";
    if(wipeAnimation >= 1300 && wipeAnimation <= 1930)
      document.getElementById("dreadnought_attack").style.clip = "rect(0px," + (wipeAnimation - 1300) + "px,630px,0px)";
    if(wipeAnimation > 1930)
      document.getElementById("dreadnought_attack").style.clip = "rect(0px,630px,630px,0px)";
    if(wipeAnimation >= 3000){
      wipeAnimationRunning = false;
      setTimeout(function(){
        sub_state = "attack_bonus";
        setElements();
      }, 2000);
    }
    setTimeout(function(){
      wipePlanetAnimation();
    }, animationSpeed);
  }
}

function loadAttackScreen(){
  wipeAnimationRunning = true;
  wipeAnimation = 0;
  document.getElementById("attack_planet_background").style.clip = "rect(0px,0px,1687px,0px)";
  document.getElementById("venator_attack").style.clip     = "rect(0px,0px,630px,0px)";
  document.getElementById("dreadnought_attack").style.clip = "rect(0px,0px,630px,0px)";
  wipePlanetAnimation();
}

function checkForPlanetAttack(team2, dest){
  //Space Battle
  console.log(team2 + " " + dest);
  if(dest != na){
    if(venatorPlanets.includes(dest) && dreadnoughtPlanets.includes(dest)){
      state = "attack_planet";
      attackingPlanet = dest;
      if(dest == kamino){
        sub_state = "kamino_air";
      }
      else{
        sub_state = "ryloth";
      }
      loadAttackScreen();
    }//Ground Battle
    else if(planetOwners.get(dest) != team2 && planetOwners.get(dest) != na){
      state = "attack_planet";
      attackingPlanet = dest;
      if(dest == felucia){
        sub_state = "felucia";
      }
      else if(dest == geonosis){
        sub_state = "geonosis";
      }
      else if(dest == kamino){
        sub_state = "kamino_ground";
      }
      else if(dest == kashyyyk){
        sub_state = "kashyyyk"
      }
      else { //Naboo
        sub_state = "naboo";
      }
      loadAttackScreen();
    }
  }
}

function move(){
  if(state == "galaxy_view"){
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
  }
}

function help(){
  if(state == "galaxy_view" || state == "bonus_view"){
    help_page = 0;
    document.getElementById("help_screen_div").style.display = "block";
    document.getElementById("help_prev_div"  ).style.display = "none";
    document.getElementById("help_ok_div"    ).style.display = "block";
    document.getElementById("help_next_div"  ).style.display = "block";
    if(state == "galaxy_view"){
      document.getElementById("help_screen_text").innerHTML = help_galaxy_view_content[0];
    }
    else if(state == "bonus_view"){
      document.getElementById("help_screen_text").innerHTML = help_bonus_view_content[0];
    }
  }
}

function help_prev(){
  if(state == "galaxy_view" || state == "bonus_view"){
    if(state == "galaxy_view"){
      --help_page;
      if(help_page > 6)
        help_page = 6;
      document.getElementById("help_screen_text").innerHTML = help_galaxy_view_content[help_page];
      if(help_page == 6)
        document.getElementById("help_next_div"  ).style.display = "none";
      else
        document.getElementById("help_next_div"  ).style.display = "block";
    }
    else if(state == "bonus_view"){
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
  if(state == "galaxy_view" || state == "bonus_view"){
    if(state == "galaxy_view"){
      ++help_page;
      if(help_page > 6)
        help_page = 6;
      document.getElementById("help_screen_text").innerHTML = help_galaxy_view_content[help_page];
      if(help_page == 6)
        document.getElementById("help_next_div"  ).style.display = "none";
      else
        document.getElementById("help_next_div"  ).style.display = "block";
    }
    else if(state == "bonus_view"){
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
  document.getElementById("help_screen_div").style.display = "none";
}

function build(){
  if(state == "galaxy_view"){
    if(credits >= fleet_cost){
      credits -= fleet_cost;
      fleet_cost += 1000;
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
      setElements();
      selectPoint(point_index_to_string[selectedPlanet], true);
    }
  }
}

function end_turn(){
  if(state == "galaxy_view"){
    state = "ai_moving";
    ai_destination = na;
    move_ai();
    if(ai_destination != na){
      if(team == republic) {
        ai_selectpoint(dreadnoughtPlanets[getFirstFleetIndex(cis)]);
        ai_selectpoint(ai_destination);
      }
      else {
        ai_selectpoint(venatorPlanets[getFirstFleetIndex(republic)]);
        ai_selectpoint(ai_destination);
      }
    }
    setTimeout(function(){
      if(ai_destination != na){
        if(team == republic) {
          dreadnoughtPlanets[getFirstFleetIndex(cis)] = ai_destination;
        }
        else {
          venatorPlanets[getFirstFleetIndex(republic)] = ai_destination;
        }
      }
      setElements();
      setTimeout(function(){
        setLinesGreySrc();
        hasMovedThisTurn = false;
        state = "galaxy_view";
        if(team == republic)
          checkForPlanetAttack(cis, ai_destination);
        else
          checkForPlanetAttack(republic, ai_destination);
        setElements();
        if(team == republic) {
          selectPoint(point_index_to_string[selectedVenator[0]], true);
          for(i = 0; i < 26; ++i){
            document.getElementById("dreadnought" + i).src = "galactic_conquest/dreadnought.png";
          }
        }
        else {
          selectPoint(point_index_to_string[selectedDreadnought[0]], true);
          for(i = 0; i < 26; ++i){
            document.getElementById("venator" + i).src = "galactic_conquest/venator.png";
          }
        }
      }, 1000);
    }, 1000);
  }
}

function move_ai(){
  var currentPoint;
  foundRoutes = [];
  if(team == republic){
    currentPoint = dreadnoughtPlanets[getFirstFleetIndex(cis)];
  }
  else{
    currentPoint = venatorPlanets[getFirstFleetIndex(republic)];
  }
  numPlayerPlanets = countOwnedPlanets(team);
  if(numPlayerPlanets == 0){
    var pointsNearby = pointMap.get(currentPoint);
    var index = Math.floor(Math.random() * pointsNearby.length);
    if(index == pointsNearby.length)
      --index;
    ai_destination = pointsNearby[index];
  }
  var listOfPoints = pointMap.get(currentPoint);
  var i = 0;
  for(i = 0; i < listOfPoints.length; ++i){
    var foundPoint = listOfPoints[i];
    if( ( team == republic && !dreadnoughtPlanets.includes(foundPoint) ) || (team == cis && !venatorPlanets.includes(foundPoint) ) ){
      if(planetOwners.get(foundPoint) == team){
        foundRoutes.push([0, foundPoint]);
      }
      else{
        searchNodes(foundPoint, foundPoint, [currentPoint, foundPoint], 1);
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
}

function searchNodes(point, first, points_traversed, num_traversals){
  if(num_traversals > 100){
    console.log("Got to 100 route traversals, returning");
    return;
  }
  var listOfPoints = pointMap.get(point);
  var i = 0;
  for(i = 0; i < listOfPoints.length && foundRoutes.length < 200; ++i){
    var foundPoint = listOfPoints[i];
    if(!points_traversed.includes(foundPoint) &&
      ( ( team == republic && !dreadnoughtPlanets.includes(foundPoint) ) || (team == cis && !venatorPlanets.includes(foundPoint) ) ) ){
      if(planetOwners.get(foundPoint) == team){
        foundRoutes.push([num_traversals, first]);
      }
      else{
        var new_traversed = [];
        var j = 0;
        for(j = 0; j < points_traversed.length; ++j)
          new_traversed.push(points_traversed[j]);
        new_traversed.push(foundPoint);
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
      ai_bonus = increase_difficulty;
      ai_credits -= bonusCreditCosts[ai_bonus - 1];
    }
    else{
      ai_bonus = decrease_battle_points;
      ai_credits -= bonusCreditCosts[ai_bonus - 1];
    }
  }
  else if(ai_credits >= bonusCreditCosts[decrease_battle_points - 1]){
    ai_bonus = decrease_battle_points;
    ai_credits -= bonusCreditCosts[ai_bonus - 1];
  }
}

function loadVictoryDefeat(){
  document.getElementById("victory_div" ).style.display = "none";
  document.getElementById("defeat_div"  ).style.display = "none";
  document.getElementById("results_text").style.display = "none";
  setTimeout(function(){
    setElements();
  }, 3000);
}

function loadAttackSettingsScreen(){
  if(sub_state == "show_ai_bonus"){
    sub_state = "attack_settings";
    setTimeout(function(){
      setElements();
      loadVictoryDefeat();
    }, 5000);
  }
  else{
    sub_state = "attack_settings";
    setElements();
    loadVictoryDefeat();
  }
}

function use() {
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
    sub_state = "show_ai_bonus";
  setElements();
  loadAttackSettingsScreen();
}

function skip(){
  player_bonus = na;
  ai_use_bonus();
  if(ai_bonus != na)
    sub_state = "show_ai_bonus";
  setElements();
  loadAttackSettingsScreen();
}

function countOwnedPlanets(team2){
  var count = 0;
  for (var [planet, team3] of planetOwners) {
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
    if(venatorPlanets.includes(point)){
      venatorPlanets[venatorPlanets.indexOf(point)] = na;
      if(countFleets(republic) == 0){
        venatorPlanets[0] = getShipStartPoint(republic);
        checkForPlanetAttack(team2, venatorPlanets[0]);
      }
    }
    if(team2 == team && !venatorPlanets.includes(point) && selectedVenator[0] == point){
        selectPoint(point_index_to_string[ venatorPlanets[getFirstFleetIndex(team)] ], true);
    }
  }
  else{
    if(dreadnoughtPlanets.includes(point)){
      dreadnoughtPlanets[dreadnoughtPlanets.indexOf(point)] = na;
      if(countFleets(cis) == 0){
        dreadnoughtPlanets[0] = getShipStartPoint(cis);
        checkForPlanetAttack(team2, dreadnoughtPlanets[0]);
      }
    }
    if(team2 == team && !dreadnoughtPlanets.includes(point) && selectedDreadnought[0] == point){
      selectPoint(point_index_to_string[ dreadnoughtPlanets[getFirstFleetIndex(team)] ], true);
    }
  }
}

function victory(){
  if(state == "attack_planet"){
    planetOwners.set(attackingPlanet, team);
    state = "galaxy_view";
    if(team == republic){
      selectPoint(point_index_to_string[selectedVenator[0]], true);
      checkForDestroyFleet(attackingPlanet, cis);
    }
    else{
      selectPoint(point_index_to_string[selectedDreadnought[0]], true);
      checkForDestroyFleet(attackingPlanet, republic);
    }
    setElements();
    if(hasMovedThisTurn)
      end_turn();
  }
}

function defeat(){
  if(state == "attack_planet"){
    if(team == republic)
      planetOwners.set(attackingPlanet, cis);
    else
      planetOwners.set(attackingPlanet, republic);
    state = "galaxy_view";
    if(team == republic){
      selectPoint(point_index_to_string[selectedVenator[0]], true);
    }
    else{
      selectPoint(point_index_to_string[selectedDreadnought[0]], true);
    }
    checkForDestroyFleet(attackingPlanet, team);
    setElements();
    if(hasMovedThisTurn)
      end_turn();
  }
}