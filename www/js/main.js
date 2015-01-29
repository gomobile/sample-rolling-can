/*jslint browser:true, devel:true, white:true, vars:true, eqeq:true */
/*global $:false, intel:false*/
var portrait_width = 768;
var landscape_width = 1024;

//use this to round to a percent (0 to 100)


function roundNumber(num) {
    var dec = 2;
    var result = 100 * Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}

var metatag = null;
var masthead = null;
var tabletop = null;

//normally, global variables are discouraged. Here we use them for two reasons,
 //1) the accelerometer readings are coming potentially 100s of times per second
 // - allocating 15 variables 100s of times per second will be an unnecessary resource drain on slower device like gen1 iTouches
 //2) webkit transforms just make an animation happen - THEY DON'T change the actual CSS position of 
 //of an element that was animated. To keep track of the position a global variable is helpful (current_left, current_top)
 //although we could accomplish this differently with a little more work.
 //
 //NOTE - we said right above that webkit animations don't reposition the an element as reported by CSS. 
 //SO, why don't we then correct CSS's position? Because the can doesn't visually have time to repaint at it's pre-animation position
 //given that we are doing an new webkit animation every 100th of a second based on
 //accelerometer readings - so no need to 
 //invoke the extra overhead of telling the DOM that the element is being repositioned constantly by resetting the CSS
 //pixelLeft and pixelTop of the sodacan.
var label = null;
var container = null;
var current_left = 0;
var current_top = 0;
var absx = 0;
var absy = 0;
var dx = 0;
var dy = 0;

var x_ispos = 1;
var y_ispos = 1;
var o_width = portrait_width;
var o_height = landscape_width;
var labelleft = 0;
var canangle = 0;
var labeldirection = 1;
var lastangle = 0;
var nextrot = 0;
var vectangle = 0;

//the following funciton handles the "physics" of how the can moves
 //calculating roation of the can and the direction of movement etc.
 //can be ignored if you only care about how to grab accelerometer readings
 //and do animations.
 //        //the can wants to slide in the direction of the slope of the table.
 //        //and wants to rotate such that the can is perpendicular to that direction (has reciprocal slope)
 //        //the label of the can want to rotate in the direction opposite to gravity. 


function docanphysics(a) {
    x_ispos = 1;
    y_ispos = 1;

    //take the abs tilt values so we don't
    //get stupid results while doing interim
    //calculations
    absx = Math.abs(a.x);
    absy = Math.abs(a.y);


    if (absx < 0.1) {
        absx = 0;
    }
    if (absy < 0.1) {
        absy = 0;
    }

    //skip the calculations if there is no movement;
    if (absx == absy && absx === 0) {
        return;
    }
    var opp;
    var adj;

    //what is the angle of the vector of motion of the can?
    //first calc without regard to sign of the accelerometer vectors
    lastangle = vectangle;

    vectangle = Math.round(Math.atan2(a.y, a.x) * 180 / Math.PI);

    //        //ignore small variations in rotation so that the can doesn't shake incessantly
    //        if (lastangle > vectangle) {
    //            if (Math.abs(lastangle - vectangle) < 10) {
    //                vectangle = lastangle;
    //            }
    //        }
    //        else {
    //            if (Math.abs(vectangle - lastangle) < 10) {
    //                vectangle = lastangle;
    //            }
    //        }
    //now, adjust the arctan calculation for direction of the accel vectors
    //by adding the correct angle based on the quatrant
    // that the motion occurs in.
    //quadrant 1
    if (x_ispos > 0 && y_ispos > 0) {
        vectangle = 90 - vectangle;
    }
    //quadrant 2
    else if (x_ispos > 0 && y_ispos < 0) {
        vectangle = 90 + vectangle;
    }
    //quadrant 3
    else if (x_ispos < 0 && y_ispos < 0) {
        vectangle = 270 - vectangle;
    }
    //quadrant 4
    else if (x_ispos < 0 && y_ispos > 0) {
        vectangle = 270 + vectangle;
    }

    //make the motion vect angle positive.
    if (vectangle < 0) {
        vectangle = (vectangle + 360) % 360;
    }

    //allow some accelerated movement based on how tilted the device is
    dx = Math.floor(Math.log(roundNumber(absx) * 5));
    dx = Math.max(dx, 0);

    dy = Math.floor(Math.log(roundNumber(absy) * 5));
    dy = Math.max(dy, 0);

    x_ispos = 1;
    y_ispos = 1;

    if (a.x < 0) {
        x_ispos = -1;
    }
    if (a.y < 0) {
        y_ispos = -1;
    }

    //now put back the sign
    dx = dx * x_ispos;
    dy = dy * y_ispos;

    //calculate can movements
    current_left += dx;
    current_top -= dy;

    canangle = (canangle + 360) % 360;

    var a1, a2, a3, a4, af;
    //a1 and a2 then can is within 90
    //a3 and a4 can is upside down relative to 
    //the motion vector
    labeldirection = 1;
    a1 = vectangle + 90 - canangle;
    //document.getElementById('accel_z').innerHTML = "case 1: " ;
    af = a1;
    a2 = vectangle - 90 - canangle;

    if (Math.abs(a2) < Math.abs(af)) {
        af = a2;
        // document.getElementById('accel_z').innerHTML = "case 2: ";
    }
    a3 = vectangle + 90 - canangle + 180;
    if (Math.abs(a3) < Math.abs(af)) {
        af = a3;
        //document.getElementById('accel_z').innerHTML = "case 3: ";
        labeldirection = -1;
    }
    a4 = vectangle - 90 - canangle + 180;
    if (Math.abs(a4) < Math.abs(af)) {
        af = a4;
        // document.getElementById('accel_z').innerHTML = "case 4: a4 = " + a4 + "a3 = " + a3 + "a2 = " + a2 + "a1 = " + a1;
        labeldirection = -1;
    }

    if (af > 180) {
        af = -1 * (360 - af);
    }

    //document.getElementById('accel_y').innerHTML = "vectangle= " + vectangle + "; canangle=" + canangle + " rotpos=" + af; //  + "; rotneg=" + rotneg + "; nextrot=" + nextrot;
    // document.getElementById('accel_x').innerHTML = "a.x = " + a.x + ", a.y = " + a.y;

    //which way should the label spin?
    //it should spin right when moving at 90deg to the
    //motion vector, spin left when moving at 270deg
    if (canangle > vectangle) {
        labeldirection = -1;
    }

    if (Math.abs(canangle - vectangle) > 180) {
        labeldirection = labeldirection * -1;
    }


    //if the movement is right or down then the label and can is upright, label move left
    labelleft += labeldirection * Math.ceil(Math.sqrt(dx * dx + dy * dy));



    if (af > 3) {
        canangle++;
    } else if (af < -3) {
        canangle--;
    }


}

//this is the event handler for successful accelerometer readings


function suc(a) {
    //readings are from -1 to 1 (with 0 being equilibrium in a plane). Assumes holding in portrait mode
    //with screen pointed straight at your chest.
    //e.g. in the X plane -1 = tilted all the way left, 1 = tilted all the way right.
    //e.g. in the Y plane -1 = tilted all the way left, 1 = tilted all the way right.
    //  document.getElementById('accel_x').innerHTML = "a.x = " + a.x + ", a.y = " + a.y;
	docanphysics(a);

    //make sure the can isn't off the screen
    current_left = Math.max(current_left, 0);
    current_top = Math.max(current_top, -100);

    current_left = Math.min(current_left, o_width - 100);
    current_top = Math.min(current_top, o_height - 200);

    //visible width of label on can is 164
    //total widht of label is 1074
    if (labelleft <= -910) {
        labelleft = -373;
    }
    if (labelleft >= 0) {
        labelleft = -537;
    }

    //labelleft = labelleft % 537;
    //basically, we're going to slide and rotate the can around on the screen based on the physics
    //computed in the previous funciton. The animation calls are really fairly simple ...
    //need to check that container and label have been initialized in case deviceready happens before load
    //use a variable to access the platform-appropriate transform property
    var transformProp = 'webkitTransform';
    if (device.platform.indexOf("Win") !== -1) {
        transformProp = 'transform';
    }

    if (container !== null) {
        container.style[transformProp] = 'translate(' + current_left + 'px, ' + current_top + 'px) rotate(' + canangle + 'deg) scale(.85, .85)';
    }
    if (label !== null) {
        label.style[transformProp] = 'translate(' + labelleft + 'px, 0px)';
    }
}


var fail = function() {
    alert('onError!');
};

var watchAccel = function() {


        var opt = {};
        //opt.frequency = 5;
        opt.frequency = 5000;
        //var timer = intel.xdk.accelerometer.watchAcceleration(suc, opt);
        var timer = navigator.accelerometer.watchAcceleration(suc, fail, opt);

    };

function onDeviceReady() {
    //use viewport
    var landscapewidth = 1360;
    //intel.xdk.display.useViewport(portrait_width, landscapewidth);

    //lock orientation
    intel.xdk.device.setRotateOrientation("portrait");
    intel.xdk.device.setAutoRotate(false);

    //manage power
    intel.xdk.device.managePower(true, false);

    //hide splash screen
    navigator.splashscreen.hide();;

    watchAccel();
}

document.addEventListener("deviceready", onDeviceReady, false);

function onBodyLoad() {
    metatag = document.getElementById("meta_view");
    label = document.getElementById("img_sodalabel");
    container = document.getElementById("div_sodacan");
    masthead = document.getElementById("img_masthead");
}


//*** Prevent Default Scroll ******
var preventDefaultScroll = function(event) {
    // Prevent scrolling on this element
    event.preventDefault();
    window.scroll(0, 0);
    return false;
};

window.document.addEventListener('touchmove', preventDefaultScroll, false);
