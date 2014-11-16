var imgURL;

function fb_login() {
   FB.getLoginStatus(function(response) {
     if (response.status === 'connected') {
         fb_publish();
     } else {
        FB.login(function(response) {
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me', function(response) {
                    console.log('Good to see you, ' + response.name + '.');
                },{scope :'publish_actions'});
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        });
     }
   });
}

function fb_publish() {
    FB.ui({
        method: 'feed',
        link: 'http://danny-yaroslavski.com/dragdrop/landingpage.html',
        picture: imgURL,
        caption: '#Top3IWantToSee',
    }, function(response){});
}

$(document).ready( function() {
    var sources = { first: "images/img1.jpg", second: "images/img2.jpg", third:"images/img3.jpg"};
    var titles = ["BIG HERO 6","Mockingjay","Horrible Bosses"];
    createPNG(sources, titles);

    $("#facebooklink").click( function() { 
        fb_login();
    });
    $("#twitterlink").click( function() {
        $.ajax({
            type: "POST",
            url: "https://api.twitter.com/1.1/direct_messages/new.json?",
            data: "text=hello%2C%20tworld.%20welcome%20to%201.1.&screen_name=theseancook",
            success: function() {alert('success')},
            dataType: ""
        });
    });
});


function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for (var src in sources) {
        numImages++;
    }

    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function(){
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
}

var randomNum;

function createPNG(sources, titles) {

    $(".share").click( function() {
        var expand = $(this).find('.expand');
        if( expand.css('z-index') == '-1') {
            $(this).find('.expand').css({'transform':'scale(100)','z-index':'1'});
        } else {
            $(this).find('.expand').css({'transform':'scale(0)','z-index':'-1'});
        }
    });

    canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    ctx.font="20px Futura";
    ctx.fillStyle="white";

    var pad = 5;
    var pad2 = pad*2;
    var ch = canvas.height;
    var cw = canvas.width;


    loadImages(sources, function(images) {

        //First
        ctx.drawImage(images.first, 0, 0, images.first.width, images.first.height, pad, pad, cw*(3/5)-pad, ch-pad2);
        ctx.fillText(titles[0],cw/6,ch-pad*5);

        ctx.fillStyle="#E74C3C";
        ctx.moveTo(cw*(3/5),ch-pad);
        ctx.lineTo(cw*(3/5),ch-pad*13);
        ctx.lineTo(cw*(3/5)-pad*12,ch-pad);
        ctx.fill();

        //Second
        ctx.drawImage(images.second, 0, 0, images.second.width, images.second.height, cw*(3/5)+pad, pad, cw*(3/5)-120, ch*(3/5)-pad);
        ctx.fillStyle="white";
        ctx.fillText(titles[1],cw*(4/6),ch*(3/5)-pad*5);

        ctx.fillStyle="#E67E22";
        ctx.beginPath();
        ctx.moveTo(cw-pad,ch*(3/5));
        ctx.lineTo(cw-pad,ch*(3/5)-12*pad);
        ctx.lineTo(cw-13*pad,ch*(3/5));
        ctx.fill();

        //Third
        ctx.drawImage(images.third, 0, 0, images.third.width, images.third.height, cw*(3/5)+pad, ch*(3/5)+pad, cw*(3/5)-120, ch*(2/5)-pad2);
        ctx.fillStyle="white";
        ctx.fillText(titles[2],cw*(4/6),ch-pad*5);

        ctx.fillStyle="#F1C40F";
        ctx.beginPath();
        ctx.moveTo(cw-pad,ch-pad);
        ctx.lineTo(cw-pad,ch-pad*12);
        ctx.lineTo(cw-pad*12,ch-pad);
        ctx.fill();

        var finalImg = canvas.toDataURL("image/png");
        var ajax = new XMLHttpRequest();
        randomNum = Math.round(Math.random()*10000000);
        ajax.open("POST",'saveimg.php?loc='+randomNum,false);
        ajax.setRequestHeader('Content-Type', 'application/upload');
        ajax.onreadystatechange=function(){
            if (ajax.readyState==4 && ajax.status==200){
                var myString = location.href;
                var split = myString.split("/");
                split.pop();
                var loc = split.join("/");
                imgURL = loc+"/created/image"+randomNum+".png";
                console.log(imgURL);
            }
        }
        ajax.send(finalImg);

    });
}
