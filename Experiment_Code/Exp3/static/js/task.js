/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

crit = [//[Condition,P1,P2,P3,Distance, Ellipse, Line, Prompt2]
		["None",'B','D','C','default','none','none',0,"right","top"],
		["None",'a','A','A','default','none','none',1,"top","top"],
		["Dist",'a','A_pop','A','left','none','none',4,"right","top"],
		["Dist",'a','A','A_pop','right','none','none',7,"left","top"],
		["Ellipse",'a','A','A_pop','default','L','none',10,"left","top"],
		["Ellipse",'a','A_pop','A','default','R','none',13,"right","top"],
		["Line",'a','A','A_pop','default','none','R',19,"left","top"],
		["Line",'a','A_pop','A','default','none','L',22,"right","top"],
		// Fillers
		["None",'D','C','B','default','none','none',0,"left","right"],
		["None",'C','B','D','default','none','none',0,"top","left"],
		["None",'B','D','C','default','none','none',0,"right","top"],
		["None",'D','C','B','default','none','none',0,"left","right"],
		["None",'C','B','D','default','none','none',0,"top","left"],
		["None",'B','D','C','default','none','none',0,"right","top"]
	];
	
stims = _.shuffle(crit);

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
	var capstep = null;

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

	var the_big_square = new Howl ( {
		urls:['/static/images/the_BIG_square.wav']
	});
	
	var captivate = function(i,that){
		var fadeIn = function(i){   
		    if(i == 5){
		        return;
		    }else{
		        that.animate({ opacity: 1.0 }, 200, "<" , function(){
		            fadeOut(++i) ;
		        });
		    }
		}
		var fadeOut = function(i){  
		    if(i == 5){
		        return;
		    }else{
		        that.animate({ opacity: 0.0 }, 200, "<" , function(){
		            fadeIn(++i);
		        });
		    }
		}
		fadeIn(i);
	}
	
	var point = function(direction) {
		if (direction == 'right') {
			stage.path('M267,135 l21.5,18.75').attr({'arrow-end':'classic-wide-long','stroke-width':3});
		} else {
			stage.path('M267,135 l-21.5,18.75').attr({'arrow-end':'classic-wide-long','stroke-width':3});
		}
	}

	var next = function() {
		timestep = timestep + 1;
		if (timestep == 1) {
			if (stims.length > 0) {
				stim = stims.shift();
				if (stim[2] == "A_pop") {
					point('left');
				}
				if (stim[3] == "A_pop") {
					point('right');
				}
				setTimeout(next,1000);
			} else {
				finish();
			}
		} else if (timestep == 2) {
			stage.clear();
			set_stage();
			switch(stim[7]) {
				case 0:
					circle_sound.play();
					break;
				default:
					small_square_sound.play();
					break;
			}
			start_time = new Date().getTime();			
			listen = true;
		} else if (timestep == 3) {
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
					if (timestep == 2 ) {
						acc_n = acc;
						RT_n = RT;
						setTimeout(next,200);
					} else {
						grouped = stim[8]==Loc;
						record(Loc,Symbol,RT);
					}
				}
			});
		} else if (Symbol=="A_pop") {
			X = X - 16 ;
			Y = Y - 16;
			var letter = stage.rect(X,Y,32,32).attr({'fill':'green','stroke':'green'});
			capstep = letter;
			letter.click(function() {
				if (!listen) {} else {
					listen = false;
					var acc = Loc==stim[9];
					var RT = new Date().getTime() - start_time;
					letter.remove();
					if (timestep == 2) {
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
					if (timestep == 2) {
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
					if (timestep == 2) {
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
					if (timestep == 2) {
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
					if (timestep == 2) {
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
				stage.ellipse(310,135,86,140).transform('r150').attr({'fill':'blue','stroke':'blue','fill-opacity':'0.30','stroke-opacity':'0.3'});
				break;
			case "L":		
				stage.ellipse(224,135,86,140).transform('r30').attr({'fill':'blue','stroke':'blue','fill-opacity':'0.30','stroke-opacity':'0.3'});
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
				plot(stim[1],224,135,"top");
			 	plot(stim[2],181,210,"left");
				plot(stim[3],353,210,"right");
				break;
			case "left":	
				plot(stim[1],310,135,"top");
			 	plot(stim[2],181,210,"left");
				plot(stim[3],353,210,"right");
				break;
		}
		switch(stim[6]) {
			case "R":		
				stage.path("M 181 263 L 353 112"); //medium				
				break;
			case "L":		
				stage.path("M 181 112 L 353 263"); //medium
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

