$(document).ready(function()
{var vid = $('#myvid');
$(vid).attr("src", $("a.link:first").attr("href"));
$("a.link:first").addClass("playing");
$("a.link").on("click" , function  (event) {
event.preventDefault();
$(vid).attr("src", $(this).attr("href"));
$(".vids a").removeClass("playing");
$(this).addClass("playing");
$('.btnPlay').addClass('paused');
vid[0].play();
if ($("a.link:first").hasClass("playing")) 
{$(".prevvid").addClass("disabled");}
else {$(".prevvid").removeClass("disabled");}
if ($("a.link:last").hasClass("playing")) {
$(".nextvid").addClass("disabled");}
else {$(".nextvid").removeClass("disabled");}});
vid.on('canplay', function() 
{$('.loading').fadeOut(100);});
var completeloaded = false;
vid.on('canplaythrough', function() {
completeloaded = true;
});
vid.on('ended', function() {
$('.btnPlay').removeClass('paused');
vid[0].pause();
});
vid.on('seeking', function() {
if(!completeloaded) { 
$('.loading').fadeIn(200);
}   
});
vid.on('seeked', function() { });
vid.on('waiting', function() {
$('.loading').fadeIn(200);
});
vid.on('loadedmetadata', function() {
$('.current').text(timeFormat(0));
$('.duration').text(timeFormat(vid[0].duration));
if(vid[0].muted)
{
updateVolume(0, 0);
}else
{
updateVolume(0 , 0.7);
}
});
var startBuffer = function() {
var currentBuffer = vid[0].buffered.end(0);
var maxduration = vid[0].duration;
var perc = 100 * currentBuffer / maxduration;
$('.bufferBar').css('width',perc+'%');
if(currentBuffer < maxduration) {
setTimeout(startBuffer, 500);
}
};  
vid.on('timeupdate', function() {
var currentPos = vid[0].currentTime;
var maxduration = vid[0].duration;
var perc = 100 * currentPos / maxduration;
$('.timeBar').css('width',perc+'%');    
$('.current').text(timeFormat(currentPos)); 
});
vid.on('click', function() { playpause(); } );
$('.btnPlay').on('click', function() { playpause(); } );
var playpause = function() {
if(vid[0].paused || vid[0].ended) {
$('.btnPlay').addClass('paused');
vid[0].play();
}
else {
$('.btnPlay').removeClass('paused');
vid[0].pause();
}
};
var timeDrag = false;
$('.progress').on('mousedown', function(e) {
timeDrag = true;
updatebar(e.pageX);
});
$(document).on('mouseup', function(e) {
if(timeDrag) {
timeDrag = false;
updatebar(e.pageX);
}
});
$(document).on('mousemove', function(e) {
if(timeDrag) {
updatebar(e.pageX);
}
});
var updatebar = function(x) {
var progress = $('.progress');

var maxduration = vid[0].duration;
var position = x - progress.offset().left;
var percentage = 100 * position / progress.width();
if(percentage > 100) {
percentage = 100;
}
if(percentage < 0) {
percentage = 0;
}
$('.timeBar').css('width',percentage+'%');  
vid[0].currentTime = maxduration * percentage / 100;
};
$('.sound').click(function() {
vid[0].muted = !vid[0].muted;
$(this).toggleClass('muted');
if(vid[0].muted) {
$('.volumeBar').css('width',0);
}
else{
$('.volumeBar').css('width', vid[0].volume*100+'%');
}
});
var volumeDrag = false;
$('.volume').on('mousedown', function(e) {
volumeDrag = true;
vid[0].muted = false;
$('.sound').removeClass('muted');
updateVolume(e.pageX);
});
$(document).on('mouseup', function(e) {
if(volumeDrag) {
volumeDrag = false;
updateVolume(e.pageX);
}
});
$(document).on('mousemove', function(e) {
if(volumeDrag) {
updateVolume(e.pageX);
}
});
var updateVolume = function(x, vol) {
var volume = $('.volume');
var percentage;
if(vol) {
percentage = vol * 100;
}
else {
var position = x - volume.offset().left;
percentage = 100 * position / volume.width();
}
if(percentage > 100) {
percentage = 100;
}
if(percentage < 0) {
percentage = 0;
}
$('.volumeBar').css('width',percentage+'%');    
vid[0].volume = percentage / 100;
if(vid[0].volume == 0){
$('.sound').removeClass('sound2').addClass('muted');
}
else if(vid[0].volume > 0.5){
$('.sound').removeClass('muted').addClass('sound2');
}
else{
$('.sound').removeClass('muted').removeClass('sound2');
}
};
$('.spdx50').on('click', function() { fastfowrd(this, 1.5); });
$('.spdx25').on('click', function() { fastfowrd(this, 1.25); });
$('.spdx1').on('click', function() { fastfowrd(this, 1); });
$('.spdx050').on('click', function() { fastfowrd(this, 0.5); });
var fastfowrd = function(obj, spd) {
$('.speedcnt li').removeClass('selected');
$(obj).addClass('selected');
vid[0].playbackRate = spd;
vid[0].play();
$("ul.speedcnt").fadeOut("fast");
$('.btnPlay').addClass('paused');
};
$(".btnspeed").click( function() {

$("ul.speedcnt").slideToggle(100);
});

$('.btnFS').on('click', function() {
if($.isFunction(vid[0].webkitEnterFullscreen)) {
vid[0].webkitEnterFullscreen();
}   
else if ($.isFunction(vid[0].mozRequestFullScreen)) {
vid[0].mozRequestFullScreen();
}
else {
alert('Your browsers doesn\'t support fullscreen');
}
});
$('.btnLight').click(function() {
$(this).toggleClass('lighton');
if(!$(this).hasClass('lighton')) {
$('body').append('<div class="overlay"></div>');
$('.overlay').css({
'position':'absolute',
'width':100+'%',
'height':$(document).height(),
'background':'#000',
'opacity':0.9,
'top':0,
'left':0,
'z-index':999
});
$('.vidcontainer').css({
'z-index':1000
});
}
else {
$('.overlay').remove();
}
});
$(".prevvid").click(function(){
$(vid).attr("src", $(".playing").prev().attr("href"));
vid[0].play();
$(".playing").prev().addClass("playing");
$(".playing:last").removeClass("playing");
$('.btnPlay').addClass('paused');
$(".nextvid").removeClass("disabled");
if ($("a.link:first").hasClass("playing")) {
$(this).addClass("disabled");
}else {
$(this).removeClass("disabled");
};
});
$(".nextvid").click(function(){
$(vid).attr("src", $(".playing").next().attr("href"));
vid[0].play();
$(".playing").next().addClass("playing");
$(".playing:first").removeClass("playing");
$('.btnPlay').addClass('paused');
$(".prevvid").removeClass("disabled");
if ($("a.link:last").hasClass("playing")) {
$(this).addClass("disabled");
}else {
$(this).removeClass("disabled");
};
});
var timeFormat = function(seconds){
var m = Math.floor(seconds/60)<10 ? "0"+Math.floor(seconds/60) : Math.floor(seconds/60);
var s = Math.floor(seconds-(m*60))<10 ? "0"+Math.floor(seconds-(m*60)) : Math.floor(seconds-(m*60));
return m+":"+s;
};
$(".closeme , .bigplay").click(function(){
$("this,.ads,.bigplay").fadeOut(200);
vid[0].play();
$('.btnPlay').addClass('paused');
});
});
function myFunction() {
document.getElementById("myDropdown").classList.toggle("show");
}
window.onclick = function(event) {
if (!event.target.matches('.dropbtn')) {
var dropdowns = document.getElementsByClassName("dropdown-content");
var i;
for (i = 0; i < dropdowns.length; i++) {
var openDropdown = dropdowns[i];
if (openDropdown.classList.contains('show')) {
openDropdown.classList.remove('show');
}
}
}
}
