function showSlide(id) {
  $(".slide").hide();
  $("#"+id).show();
}

function random(a,b) {
  if (typeof b == "undefined") {
    a = a || 2;
    return Math.floor(Math.random()*a);
  } else {
    return Math.floor(Math.random()*(b-a+1)) + a;
  }
}

Array.prototype.random = function() {
  return this[random(this.length)];
}

Array.prototype.shuffle = function() {
  var i = this.length, j, tempi, tempj;
  if ( i == 0 ) return false;
  while ( --i ) {
     j       = Math.floor( Math.random() * ( i + 1 ) );
     tempi   = this[i];
     tempj   = this[j];
     this[i] = tempj;
     this[j] = tempi;
  }
  return this;
}


//PRE-LOAD IMAGES
// By creating image object and setting source, images preload
var mask = new Image()
    mask.src =  "https://www.stanford.edu/~klsanch/images/Mask.bmp"

// IMPORTANT NOTE!!!!!!!
//   01 - 06 are boys, 07-12 are men.
var image = ["w01","w02","w03","w04","w05","w06","w07","w08","w09", "w10", "w11", "w12","b01","b02","b03","b04","b05","b06", "b07", "b08", "b09", "b10", "b11", "b12"]
var arrayLength = image.length;

//PRE-LOAD WORDS
var safeWords = ["innocent", "harmless", "friendly", "trustworthy", "peaceful", "safe"]
var threatWords = ["violent", "dangerous", "hostile", "aggressive", "criminal", "threatening"]
var words = safeWords.concat(threatWords);


// Generate face_list
var face_list = [];
for (var i = 0; i < arrayLength; i++) {
  face_list = face_list.concat(Array(words.length).fill(image[i]));
}

// Generate word list
var word_list = []
for (var i = 0; i < arrayLength; i++) {
  word_list = word_list.concat(words);
}

// Calculate number of trials
var num_trials = 288;

function shuffle (array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

var trial_list = Array.apply(null, {length: num_trials}).map(Number.call, Number).shuffle()
var trial_list_save = trial_list

var practice_list =  trial_list.shuffle().slice(0,8)
var practice_list_save = practice_list


var allKeyBindings = [
      {"p": "threatening", "q": "safe"},
      {"p": "safe", "q": "threatening"} ],
    //allPracticeTrialOrders = [],
    //allTrialOrders = [],
    myKeyBindings = allKeyBindings.random(),
    //pFair = (myKeyBindings["p"] == "safe");
    fairKey = "";
    unfairKey = "";
    if (myKeyBindings["p"] == "threatening") {
      fairKey = "Q";
      unfairKey = "P";
      leftKey = "safe";
      rightKey = "threatening";
    } else {
      fairKey = "P";
      unfairKey = "Q";
      leftKey = "threatening";
      rightKey = "safe";
    }

$("#fair-key").html(fairKey);
$("#unfair-key").html(unfairKey);
$("#left-key").html(leftKey);
$("#right-key").html(rightKey);
$("#left-key2").html(leftKey);
$("#right-key2").html(rightKey);
$("#left-key3").html(leftKey);
$("#right-key3").html(rightKey);
showSlide("instructions");

var timeOut;

var practice = {
  trialOrder: practice_list[0],
  keyBindings: myKeyBindings,
  faceInput: "",
  wordInput: "",
  data: [],
  trialNumber: 0,
  end: function() {
    showSlide("realTrialsInstructions");
  },
  instructions: function() {
    showSlide("practiceInstructions");      
    //$("#imgexample1").html('<img src="'+practice.url1+'">');
    //$("#imgexample2").html('<img src="'+practice.url2+'">');
  },
  next: function() {
    var typeTrial = practice_list[0];
    if (typeof typeTrial == "undefined") {
      return practice.end();
    }

      practice.faceInput = face_list[practice_list[0]];
      practice.wordInput = word_list[practice_list[0]];
      practice_list.shift();

    return practice.face();
  },
  face: function() {
    var url ="https://www.stanford.edu/~klsanch/images/"+practice.faceInput+".bmp";
    showSlide("stage");
    $("#image").html('<img src="'+url+'" width="auto" height="75%"/>');    
    setTimeout(practice.word, 200);
  },
  word: function() {
    var txt = practice.wordInput;
    showSlide("stage");
    $("#image").html('<br><br><br><br><br><br><br><br><br><br><H1>' + txt + '</H1>');
    var startTime = (new Date()).getTime();
    setTimeout(practice.mask1, 200);
  },
  mask1: function() {
    practice.trialNumber++;
    var url ="https://www.stanford.edu/~klsanch/images/Mask.bmp";
    showSlide("stage");
    $("#image").html('<img src="'+url+'"  width="75%" height="75%"/>');
    if (practice.trialNumber > 8) {
      if (practice.trialNumber > 16) {
        var timeOut = setTimeout(practice.slow, 1000); // If trial 17+
      }
      else {
        var timeOut = setTimeout(practice.slow, 2000); // If trial 9-16       
      }
    }
    var keyPressHandler = function(event) {
      var keyCode = event.which;      
      if (keyCode != 81 && keyCode != 80) {
        $(document).one("keydown", keyPressHandler);        
      } else {
        var endTime = (new Date()).getTime(),
            key = (keyCode == 80) ? "p" : "q",
            userParity = experiment.keyBindings[key];
        $("#number").html("");
        if (practice.trialNumber > 8){
          window.clearTimeout(timeOut);
        };
        setTimeout(practice.pass,100);    
      }
    };
    $(document).one("keydown", keyPressHandler);
     },
  pass: function() {
    var url ="https://www.stanford.edu/~cinoolee/PSYC254/images/pass.png";
    showSlide("stage");
    $("#image").html('<br><br><br><br><br><img src="'+url+'">');
    var keyPressHandler = function(event) {
      var keyCode = event.which;      
      if (keyCode != 32) {
        $(document).one("keydown", keyPressHandler);        
      } else {
        setTimeout(practice.next, 750);    
      }
    };
    $(document).one("keydown", keyPressHandler);
  },
  slow: function() {
    $(document).unbind();
    var url ="https://www.stanford.edu/~cinoolee/PSYC254/images/red.png";
    showSlide("stage");
    $("#image").html('<img src="'+url+'" width="50%" height="50%">');
    var keyPressHandler = function(event) {
      var keyCode = event.which;      
      if (keyCode != 32) {
        $(document).one("keydown", keyPressHandler);        
      } else {
        setTimeout(practice.next, 750);    
      }
    };
    $(document).one("keydown", keyPressHandler);
  }
}

var experiment = {
  trial_order:trial_list_save,
  practice_order:practice_list_save,
  //whiteFaceTrials: myTrialWhiteFacesOrder,
  //blackFaceTrials: myTrialBlackFacesOrder,
  //whitewordTrials: myTrialWhitewordsOrder,
  //blackwordTrials: myTrialBlackwordsOrder,
  //trialOrder: myTrialOrder,
  keyBindings: myKeyBindings,
  faceInput: "",
  wordInput: "",
  faceType: "",
  wordType: "",
  data: [],
  demographicsData: [],
  end: function() {
    showSlide("demographics");
  },
  instructions: function() {
    showSlide("practiceInstructions");      
  },
  next: function() {
    var typeTrial = trial_list[0];

    if (typeof typeTrial == "undefined") {
      return experiment.end();
    }


    experiment.faceInput = face_list[trial_list[0]];
    experiment.wordInput = word_list[trial_list[0]];

    trial_list.shift();
    
    experiment.faceType = typeTrial;
    var wordString = experiment.wordInput;
    experiment.wordType =  (safeWords.indexOf(wordString) != -1)?"safe":"threatening";
    return experiment.face();
  },
  face: function() {
    $(document).unbind();
    var url ="https://www.stanford.edu/~klsanch/images/"+experiment.faceInput+".bmp";
    showSlide("stage");
    $("#image").html('<img src="'+url+'" width="auto" height="75%" />');    
    setTimeout(experiment.word, 200);
  },
  word: function() {
    var timeOut = setTimeout(experiment.slow, 950);  
    var txt = experiment.wordInput;
    showSlide("stage");
    $("#image").html('<br><br><br><br><br><br><br><br><br><br><H1>' + txt + '</H1>');
    var realParity = experiment.wordType;
    var startTime = (new Date()).getTime();
    var maskOut=setTimeout(function(){ 
		showSlide("stage");
    	$("#image").html('<img src="https://stanford.edu/~klsanch/images/Mask.bmp" width="75%" height="75%"/>');
  		}
  	,200);
    var keyPressHandler = function(event) {
      var keyCode = event.which;      
      if (keyCode != 81 && keyCode != 80) {
        $(document).one("keydown", keyPressHandler);        
      } else {
        var endTime = (new Date()).getTime(),
            key = (keyCode == 80) ? "p" : "q",
            userParity = experiment.keyBindings[key];
            data = {
           trial_num: num_trials - trial_list.length,
              race: experiment.faceType,
              word: experiment.wordType,
              raceStim: experiment.faceInput,
              wordStim: experiment.wordInput,
              correctResponse: realParity,
              userResponse: userParity,
              correct: realParity == userParity ? 1 : 0,
              rt: endTime - startTime,
              responded: 1
            };
        experiment.data.push(data);
        $("#number").html("");
        window.clearTimeout(timeOut);
        window.clearTimeout(maskOut);
        setTimeout(experiment.pass, 100);    
      }
    };
    $(document).one("keydown", keyPressHandler);

   },
  pass: function() {
    var url ="https://www.stanford.edu/~cinoolee/PSYC254/images/pass.png";
    showSlide("stage");
    $("#image").html('<br><br><br><br><br><img src="'+url+'">');
    var keyPressHandler = function(event) {
      var keyCode = event.which;      
      if (keyCode != 32) {
        $(document).one("keydown", keyPressHandler);        
      } else {
        setTimeout(experiment.next, 750);    
      }
    };
    $(document).one("keydown", keyPressHandler);
  },
  slow: function() {
    $(document).unbind();
    data = {
      trial_num: num_trials - trial_list.length,
      race: experiment.faceType,
      word: experiment.wordType,
      raceStim: experiment.faceInput,
      wordStim: experiment.wordInput,
      correct: 0,
      rt: 0,
      responded: 0
    };     
    experiment.data.push(data);
    var url ="https://www.stanford.edu/~cinoolee/PSYC254/images/red.png";
    if (trial_list.length == 72) { 
      url = "https://www.stanford.edu/~cinoolee/PSYC254/images/break.png"
    }
    showSlide("stage");
    $("#image").html('<img src="'+url+'">');
    var keyPressHandler = function(event) {
      var keyCode = event.which;      
      if (keyCode != 32) {
        $(document).one("keydown", keyPressHandler);        
      } else {
        setTimeout(experiment.next, 750);    
      }
    };
    $(document).one("keydown", keyPressHandler);  }
}

var demographics = {
    saveResult: function() {
    var age = $('input[name="Age"]').val();
    var male = $('input[name="Gender"]:checked').val();
    var ethnicity = $('input[name="Ethnicity"]:checked').val();
    var socioeconomicStatus = $('input[name="SES"]:checked').val();
    var religiousAffiliation = $('input[name="ReligiousAffiliation"]').val();
    var religiousAttendance = $('input[name="ReligiousAttendance"]:checked').val();
    var education = $('input[name="Education"]:checked').val();
    var citizen = $('input[name="Citizen"]:checked').val();
    var political = $('input[name="Political"]:checked').val();
    var comments = $('input[name="Comments"]').val();
    if (typeof age == "undefined" || typeof male == "undefined" || typeof ethnicity == "undefined"
        || socioeconomicStatus == "undefined" || religiousAffiliation == "undefined" || religiousAttendance == "undefined"
        || education == "undefined" || citizen == "undefined" || political == "undefined") {
            window.alert("Please respond to all of the questions on this page.");      
    }
    else {
      data = {
        Age: age,
        Male: male,
        Ethnicity: ethnicity,
        SES: socioeconomicStatus,
        ReligiousAffiliation: religiousAffiliation,
        ReligiousAttendance: religiousAttendance,
        Education: education,
        Citizen: citizen,
        Political: political,
        Comments: comments
      };
      experiment.demographicsData.push(data);    
      showSlide("finished");
      setTimeout(function() { turk.submit(experiment) }, 5000);
    }
  }
}