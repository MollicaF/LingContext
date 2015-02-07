/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

crit = [//[Condition,P1,P2,P3,Distance, Ellipse, Line, Prompt2]
		//["Dist",'B','D','C','default','none','none',0,"top",],
		["None",'a','A','A','default','none','none',1,"top","top"],
		["Small",'a','A','A','default','none','R1',2,"right","top"],
		["Med",'a','A','A','default','none','L1',3,"left","top"],
		["Large",'a','A','A','default','none','R2',4,"right","top"],
		["Small",'a','A','A','default','none','L2',5,"left","top"],
		["Med",'a','A','A','default','none','R3',6,"right","top"],
		//["Large",'a','A','A','default','none','L3',7,"left","top"],
		// Fillers
		["None",'D','C','B','default','none','none',0,"left","right"],
		["None",'C','B','D','default','none','none',0,"top","left"],
		["None",'B','D','C','default','none','none',0,"right","top"],
		["None",'D','C','B','default','none','none',0,"left","right"],
		["None",'C','B','D','default','none','none',0,"top","left"],
		["None",'B','D','C','default','none','none',0,"right","top"]
	];
	
shuffled = _.shuffle(crit);

stims = [["None",'B','D','C','default','none','none',0,"right","top"],
		["Large",'a','A','A','default','none','L3',7,"left","top"]];

for (var e=0;e<12;e++) {
	stims.push(shuffled.shift());
}

// END OF STIMULI XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


var psiTurk = PsiTurk(uniqueId, adServerLoc);

var mycondition = condition;  
var mycounterbalance = counterbalance;

var MakeMusic = function() {
	var test_sound = new Howl( {
		urls:['/static/images/koala.wav']
	});
	test_sound.play();
};

var pages = [
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages); 

var instructionPages = [ 
	"instructions/instruct-ready.html"
];

/****************
* Trial         *
****************/

var Trial = function() {
	var timestep = 0;
	var stim = [];
	var listen = false;
	var start_time = 0;

	var star_sound = new Howl( {
		urls:['/static/images/star_2.wav']
	});

	var circle_sound = new Howl( {
		urls:['/static/images/circle_1.wav']
	});

	var small_square_sound = new Howl( {
		urls:['/static/images/small_square_1.wav']
	});
	
	var big_square_sound = new Howl( {
		urls:['/static/images/big_square_2.wav']
	});
	
	var other_sound = new Howl ( {
		urls:['/static/images/otherone_2.wav']
	});


	var next = function() {
		timestep = timestep + 1;
		if (timestep == 1) {
			if (stims.length > 0) {
				console.log(stims.length);
				stim = stims.shift();
				console.log(stim);
				switch(stim[7]) {
					case 0:
						circle_sound.play();
						break;
					default:
						small_square_sound.play();
						break;
				}
				set_stage();	
				start_time = new Date().getTime();			
				listen = true;
			} else {
				finish();
			}
		} else if (timestep == 2) {
			switch(stim[7]) {
				case 0:
					star_sound.play();
					break;
				default:
					other_sound.play();
					break;
			}
//	NOTE!!! The start time and listen need to be delayed if we cared about RT
			start_time = new Date().getTime();
			listen = true;
		} else {
			timestep = 0;
			stage.clear();
			setTimeout(next,1000);
		}
	};
	
	var record = function(Loc,Symbol,RT) {
		//						ItemNo,	 GroupF, Grouped,   Acc,  RT_1,Location, Choice, RT_2
		psiTurk.recordTrialData([stim[7],stim[0],grouped,acc_n,RT_n,Loc,Symbol,RT]);
		setTimeout(next,200);
	};
	
	var acc_n = "";
	var RT_n = "";
	var grouped = "";
	
	Raphael.fn.star = function(x, y, r) {
		var path = "M" + x + "," + (y - r);
		
		for (var c = 0; c < 6; c += 1) {
		    var angle = 270 + c * 144,
		        rx = x + r * Math.cos(angle * Math.PI / 180),
		        ry = y + r * Math.sin(angle * Math.PI / 180);

		    path += "L" + rx + "," + ry;
		}    
	   
		return stage.path(path);
	};
	
	Raphael.fn.triangle = function(x,y,s) {
		var right_x = x + (s*0.5);
		var left_x = x - (s*0.5);
		var low_y = y + (s*0.5);
		var high_y = y - (s*0.5);
		var path = "M" + left_x + "," + low_y;
		path += "L" + x + "," + high_y;
		path += "L" + right_x + "," + low_y;
		return stage.path(path);
	};
	
	
	var plot = function(Symbol, X, Y, Loc) {
		if (Symbol=="A") {
			X = X - 16 ;
			Y = Y - 16;
			var letter = stage.rect(X,Y,32,32).attr({'fill':'green','stroke':'green'});
			letter.click(function() {
				if (!listen) {} else {
					listen = false;
					var acc = Loc==stim[9];
					var RT = new Date().getTime() - start_time;
					letter.remove();
					if (timestep == 1) {
						acc_n = acc;
						RT_n = RT;
						setTimeout(next,200);
					} else {
						grouped = stim[8]==Loc;
						record(Loc,Symbol,RT);
					}
				}
			});
		} else if (Symbol=='a') {
			X = X - 9;
			Y = Y - 9;
			var letter = stage.rect(X,Y,18,18).attr({'fill':'green', 'stroke':'green'});
			letter.click(function() {
				if (!listen) {} else {
					listen = false;
					var acc = Loc==stim[9];
					var RT = new Date().getTime() - start_time;
					letter.remove();
					if (timestep == 1) {
						acc_n = acc;
						RT_n = RT;
						setTimeout(next,200);
					} else {
						grouped = stim[8]==Loc;
						record(Loc,Symbol,RT);
					}
				}
			});
		} else if (Symbol=='B') {
			var letter = stage.circle(X,Y,15).attr({'fill':'green','stroke':'green'});
			letter.click(function() {
				if (!listen) {} else {
					listen = false;
					var acc = Loc==stim[9];
					var RT = new Date().getTime() - start_time;
					letter.remove();
					if (timestep == 1) {
						acc_n = acc;
						RT_n = RT;
						setTimeout(next,200);
					} else {
						grouped = stim[8]==Loc;
						record(Loc,Symbol,RT);
					}
				}
			});
		} else if (Symbol=='C') {
			var letter = stage.star(X,Y,15).attr({'fill':'green','stroke':'green'});
			letter.click(function() {
				if (!listen) {} else {
					listen = false;
					var acc = Loc==stim[9];
					var RT = new Date().getTime() - start_time;
					letter.remove();
					if (timestep == 1) {
						acc_n = acc;
						RT_n = RT;
						setTimeout(next,200);
					} else {
						grouped = stim[8]==Loc;
						record(Loc,Symbol,RT);
					}
				}
			});
		} else if (Symbol=='D') {
			var letter = stage.triangle(X,Y,15).attr({'fill':'green','stroke':'green'});
			letter.click(function() {
				if (!listen) {} else {
					listen = false;
					var acc = Loc==stim[9];
					var RT = new Date().getTime() - start_time;
					letter.remove();
					if (timestep == 1) {
						acc_n = acc;
						RT_n = RT;
						setTimeout(next,200);
					} else {
						grouped = stim[8]==Loc;
						record(Loc,Symbol,RT);
					}
				}
			});
		}
	};		
	
	var set_stage = function() {
		switch(stim[5]) {
			case "R":		
				stage.ellipse(355,125,160,70).transform('r45').attr({'fill':'blue','stroke':'blue','fill-opacity':'0.30','stroke-opacity':'0.3'});
				break;
			case "L":		
				stage.ellipse(183,125,160,70).transform('r135').attr({'fill':'blue','stroke':'blue','fill-opacity':'0.30','stroke-opacity':'0.3'});
				break;
			case "F":		
				stage.ellipse(275,180,210,65).attr({'fill':'blue','stroke':'blue','fill-opacity':'0.30','stroke-opacity':'0.3'});
				break;n
			case "none":
				break;
		}
		switch(stim[4]) {
			 case "default":
			 	plot(stim[1],267,60,"top");
			 	plot(stim[2],181,210,"left");
				plot(stim[3],353,210,"right");
				break;
			case "right":	
				plot(stim[1],224,105,"top");
			 	plot(stim[2],181,180,"left");
				plot(stim[3],353,180,"right");
				break;
			case "left":	
				plot(stim[1],310,105,"top");
			 	plot(stim[2],181,180,"left");
				plot(stim[3],353,180,"right");
				break;
		}
		switch(stim[6]) {
			case "R1":		
				stage.path("M 224 151 L 310 226"); //small
				break;
			case "R2":
				stage.path("M 181 112 L 353 263"); //medium
				break;
			case "R3":
				stage.path("M 54 0 L 435 335"); //large
				break;
			case "L1":		
				stage.path("M 224 226 L 310 151"); //small
				break;
			case "L2":
				stage.path("M 181 263 L 353 112"); //medium
				break;
			case "L3":
				stage.path("M 98 335 L 483 0"); //large
				break;
			case "F":		
				stage.path("M 67 143 L 467 143");
				break;
			case "none":
				break;
		}
	};
	
	var finish = function() {
		$("body").keydown(function() {}); // Unbind keys
		psiTurk.saveData({
            success: function(){
                psiTurk.completeHIT();
            }, 
            error: prompt_resubmit});
	};
	
	prompt_resubmit = function() {
		replaceBody(error_message);
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		replaceBody("<h1>Trying to resubmit...</h1>");
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
			}, 
			error: prompt_resubmit
		});
	};
	
	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	psiTurk.showPage('stage.html');
	var task = document.getElementById('task');
	var stage = new Raphael(document.getElementById('canvas'),535,335);
	next();

};

/****************
* Questionnaire *
****************/

var Quest = function() {

	record_responses = function() {

		$('input').each( function(i, val) {
			psiTurk.recordTrialData([this.id, this.value]);
		});
		$('select').each( function(i, val) {
			psiTurk.recordTrialData([this.id, this.value]);		
		});

	};

	psiTurk.showPage('postquestionnaire.html');
	
	$("#next").click(function () {
	    var form = document.getElementById("postquiz");
	    if (form["sound_check"].value != "koala") {
	    	alert("You have failed the sound check. Please try again.");
	    	psiTurk.recordTrialData(["The failed sound check."]);
	    	return false;
	    } else {
		    record_responses();
		    currentview = new Trial();
		}
	});
    
	
};

var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, 
    	function() { currentview = new Quest(); } 
    );
});

