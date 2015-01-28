/*jslint -W033, browser:true, devel:true, white:true, vars:true, eqeq:true */
/*global $:false, intel:false*/

/*
 * This function runs once the page is loaded, but the JavaScript bridge library is not yet active.
 */
var init = function () {
};

window.addEventListener("load", init, false);  

// Prevent Default Scrolling  
var preventDefaultScroll = function(event) 
{
    // Prevent scrolling on this element
    event.preventDefault();
    window.scroll(0,0);
    return false;
};
    
window.document.addEventListener("touchmove", preventDefaultScroll, false);

var onDeviceReady=function(){                             // called when Cordova is ready
   if( window.Cordova && navigator.splashscreen ) {     // Cordova API detected
        navigator.splashscreen.hide() ;                 // hide splash screen
    }
} ;
document.addEventListener("deviceready", onDeviceReady, false) ;

      
//function to exhibit Amble font 
function changeambleregular()
{
    document.getElementById("head_line").className="headline"
    document.getElementById("quotes").className="quote"
    document.getElementById("sub_heading").className="subheading"
    document.getElementById("body_text").className="bodytext"
    document.getElementById("email_input").className="emailinput"
    document.getElementById("buttonid").className="button"
    document.getElementById("type1").className="font colour"
    document.getElementById("type2").className="font"
    document.getElementById("type3").className="font"
    document.getElementById("type4").className="font"
   
}

//function to exhibit CaviarDreams font 
function changecaviardreamsregular()
{
    document.getElementById("head_line").className="headline caviardreams"
    document.getElementById("quotes").className="quote caviardreams"
    document.getElementById("sub_heading").className="subheading caviardreams"
    document.getElementById("body_text").className="bodytext caviardreams"
    document.getElementById("email_input").className="emailinput caviardreams"
    document.getElementById("buttonid").className="button caviardreams"
    document.getElementById("type1").className="font"
    document.getElementById("type2").className="font colour"
    document.getElementById("type3").className="font"
    document.getElementById("type4").className="font"
}

//function to exhibit PTSerif font 
function changeptserifregular()
{
    document.getElementById("head_line").className="headline ptserif"
    document.getElementById("quotes").className="quote ptserif"
    document.getElementById("sub_heading").className="subheading ptserif"
    document.getElementById("body_text").className="bodytext ptserif"
    document.getElementById("email_input").className="emailinput ptserif"
    document.getElementById("buttonid").className="button ptserif"
    document.getElementById("type1").className="font"
    document.getElementById("type2").className="font"
    document.getElementById("type3").className="font colour"
    document.getElementById("type4").className="font"
}

//function to exhibit LRoman font 
function changelmromanregular()
{
    document.getElementById("head_line").className="headline lmroman"
    document.getElementById("quotes").className="quote lmroman"
    document.getElementById("sub_heading").className="subheading lmroman"
    document.getElementById("body_text").className="bodytext lmroman"
    document.getElementById("email_input").className="emailinput lmroman"
    document.getElementById("buttonid").className="button lmroman"
    document.getElementById("type1").className="font"
    document.getElementById("type2").className="font"
    document.getElementById("type3").className="font"
    document.getElementById("type4").className="font colour"
}