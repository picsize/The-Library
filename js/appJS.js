
var url1_width;
var url1_height;
var url2_width;
var url2_height;
var after_resume = false;
var start_time;
var delta_time;
var end_time;
var old_word_time;
var word_time = 0;
var all_time = 0;
var time_left = 0;
var playsound = true;
var panel_is_up = false;
var swiped = false;

//Stage indicates on what page the UI is for the backbutton switch
var stage = 1;

//CurrentSlidePage stands for the current img (out of 3) that used to show the image
//The 3 images cycle endlessly and it is *essential* to load new page to the correct slide
var currentSlidePage = 1;

//Story locals
var storyRoot;
var storyRoot_p;
var category;
var stories;

//Current story data
var currentStory = 1;
var currentWord = 0;
var storyPage = 1;
var storyPageAmount;
var storyData;
var data;

//Media data
var myMedia = null;
var timeOut = null;
var openMedia;
var clickMedia;
var mediaTimer = null;

/**** Flags *****/
var replayFlag = false;
var iframeVis = false;
var storyImagesSet = false;

var popFlag = false;
//POP - Play Or Pause

var currentImage = false;

var mainClick = false;	//Not used currently, not removed for furtre possible use

var ImageLoader = false;

//Help to prevent double clicks
clickFlag = false;
var endOfPage = false;
var ready = false;
// End of Flags


var ITC = 1;

var blinkBubble = null;
var networkInter;

//HTML Elements
var frame;
var imgS1 = document.createElement('img');
var imgS2 = document.createElement('img');




appFull = {
    deviceReady: function () {
        appFull.events();
        appFull.begin();
    },
    events: function () {
        document.addEventListener("pause", appFull.onPause, false);
        document.addEventListener("backbutton", appFull.onBackKeyDown, false);

        //Exit function
        $(document).on('click', '.exit_button', function (e) {
            var result = confirm("האם אתה בטוח שברצונך לצאת?");
            if (result) {
                navigator.app.exitApp();
            }
        });

        $(document).on('click', '#close_button', function (e) {
            //clickMedia.play();
            appFull.hideShowIframe();
        });

        //Move to 2nd page
        $(document).on('click', '#page_zero', function () {
            if (!clickFlag) {
                clickFlag = true;
                openMedia.stop();
                var path = window.location.pathname;
                path = path.substr(path, path.length - 10);
                var pathOfFile = 'file://' + path;
                openMedia = new Media(pathOfFile + 'open.mp3');
                openMedia.play();
                Timer = setInterval(function () {
                    openMedia.getCurrentPosition(
                        // success callback
                        function (position) {
                            if (position > 0) {
                                clickFlag = false;
                            }
                        },
                        // error callback
                        function (e) {
                            alert("Error while loading audio");
                        }
                    );
                }, 100);

                $('#page_zero').fadeOut('fast')
                {
                    $('#first_page').fadeIn('fast');
                }
            }
        });



        //Call pause or play function
        $(document).on('click', '#flipbook', function (e) { appFull.pauseOrPlay(); });


        //Call category by click
        $(document).on('click', '.front_image', function (e) {
            if (!clickFlag) {
                appFull.showLoading();
                clickFlag = true;
                //openMedia.stop();
                switch (e.target.id) {
                    case 'leg':
                        category = 'leg';
                        $("#second_page").addClass("leg_bkground");
                        $("#second_page").removeClass("adv_bkground");
                        $("#second_page").removeClass("mash_bkground");
                        $("#cat_image").attr("src", "img/leg_title.png");
                        break;

                    case 'adv':
                        category = 'adv';
                        $("#second_page").addClass("adv_bkground");
                        $("#second_page").removeClass("leg_bkground");
                        $("#second_page").removeClass("mash_bkground");
                        $("#cat_image").attr("src", "img/adv_title.png");
                        break;

                    case 'mash':
                        category = 'mash';
                        $("#second_page").addClass("mash_bkground");
                        $("#second_page").removeClass("leg_bkground");
                        $("#second_page").removeClass("adv_bkground");
                        $("#cat_image").attr("src", "img/mash_title.png");
                        break;
                }
                storyRoot = "http://www.kidnet.co.il/books/server/stories/" + category + "/story";
                storyRoot_p = "http://www.kidnet.co.il/books/server/stories/" + category;
                appFull.getStories(category);
            }
            var path = window.location.pathname;
            path = path.substr(path, path.length - 10)
            var pathOfFile = 'file://' + path;
            panel_up_Media = new Media(pathOfFile + 'mp3/panel_up.mp3');
            into_storys_Media = new Media(pathOfFile + 'mp3/into_storys.mp3');
            back_story_list_Media = new Media(pathOfFile + 'mp3/back_story_list.mp3');
            clickMedia = new Media(pathOfFile + 'click.mp3');
            openMedida = new Media(pathOfFile + 'song.mp3');
            //clickMedia.play();
            //into_storys_Media.play();
        });

    },
    begin: function () {
        clickFlag = true;
        var path = window.location.pathname;
        path = path.substr(path, path.length - 10);
        var pathOfFile = 'file://' + path;

        //Plays first song

        openMedia = new Media(pathOfFile + 'song.mp3');
        openMedia.play();
        Timer = setInterval(function () {
            openMedia.getCurrentPosition(
                // success callback
                function (position) {
                    if (position > 0) {
                        clickFlag = false;
                    }
                },
                // error callback
                function (e) {
                    alert("Error while loading audio");
                }
            );
        }, 100);
    },
    onPause: function () {
        openMedia.stop();
        openMedia.release();

        if (timeOut != null) {
            pauseOrPlay();
        }
    },
    onBackKeyDown: function () {
        e.preventDefault();
        switch (stage) {
            case 1:
                var result = confirm("האם אתה בטוח שברצונך לצאת?");
                if (result) {
                    openMedia.stop();
                    openMedia.release();
                    myMedia.stop();
                    myMedia.release();
                    $("#dot").fadeOut('fast');
                    clearTimeout(timeOut);

                    navigator.app.exitApp();
                }
                break;

            case 2:
                stage = 1;
                appFull.gotoFirstPage()
                break;

            case 3:
                if (clickFlag) {

                }
                else {
                    appFull.gotoStoryList();
                    $("#overlay_panel").css("display", "none");
                    $("#third_page_overlay").css("display", "none");
                    stage = 2;
                }
                break;
        }
    },
    hideShowPagesPanel: function () {
        clickMedia.play();

        $("#third_page_overlay").slideToggle();
        $("#overlay_panel").css("display", "inline");
    },
    blinkTheImage: function () {
        if (currentImage == true) {
            currentImage = false;
            $(".urlImg").attr("src", "img/url_is_open.png");
        }
        else {
            currentImage = true;
            $(".urlImg").attr("src", "img/url_is_close.png");
        }
        blinkBubble = setTimeout(function () { blinkTheImage() }, 500);
    },
    hideShowIframe: function () {
        clickMedia.play();
        if (!clickFlag) {
            if (iframeVis) {
                $("iframe").remove();
                //iframe_remove_Media.play();
                if (blinkBubble != null) {
                    appFull.blinkTheImage();
                }
                $("#close_button").fadeOut('fast');
                $(".urlImg").attr("src", "img/url_is_close.png");
                iframeVis = false;
                clickFlag = false;
                clickMedia.play();
                if (url1_width == 100 && url1_height == 100) {
                    $('#third_page #flipbook, #second_page').attr('style', '');
                }
            }
            else {
                clickMedia.play();
                //openIframe("http://www.kidnet.co.il/books/server/stories/"+category+"/story"+currentStory+"/urls/index"+storyPage+".html");
                var mystring = category + "/story" + currentStory;
                appFull.openIframe("http://www.kidnet.co.il/books/server/stories/games/games.html?" + mystring);
                clickFlag = false;
            }
        }
    },
    openIframe: function (url) {
        $(".recImg").remove();
        iframeVis = true;
        $(".urlImg").attr("src", "img/url_is_open.png");
        clearTimeout(blinkBubble);
        frame = document.createElement('IFRAME');
        frame.width = data.urlData.width[storyPage - 1] + "%";
        frame.height = data.urlData.height[storyPage - 1] + "%";

        url1_width = data.urlData.width[storyPage - 1];
        url1_height = data.urlData.height[storyPage - 1];
        if (url1_width == 100 && url1_height == 100) {
            $("#close_button").fadeIn('fast');
        }
        $(frame).css("position", "fixed");
        $(frame).css("top", data.urlData.y[storyPage - 1] + "%");
        $(frame).css("left", data.urlData.x[storyPage - 1] + "%");
        frame.setAttribute("src", url);
        if (url1_width == 100 && url1_height == 100) {
            $('#third_page #flipbook, #second_page').attr('style', 'display: none');
        }
        document.body.appendChild(frame);
    },
    myTimer: function () {
        myVar2 = setTimeout(function () { alert("אות אינטרנט חלש !"); }, 5000);
    },
    showLoading: function () {
        $("body").append("<img src='loading.gif'  class='quqImg' style='top:40%;left:43%;width:15%;height:20%;' />");
        appFull.myTimer();
        $.mobile.loading("show",
        {
            text: "",
            textVisible: false,
            theme: "z",
            html: ""
        });
    },
    hideLoading: function () {
        clearTimeout(myVar2);
        $(".quqImg").remove();
        $.mobile.loading("hide");
    },
    getPhoneGapPath: function () {
        var path = window.location.pathname;
        path = path.substr(path, path.length - 10);
        return 'file://' + path;
    },
    gotoFirstPage: function () {
        stage = 1;
        var di = document.getElementById('di');
        di.scrollLeft = 0;
        $(".second_page").scrollLeft(0);

        clickMedia.play();
        clickFlag = false;

        $("#second_page").fadeOut('fast', function () {
            $("#first_page").fadeIn('fast');
            appFull.hideLoading();
        });
    },
    showCatPage: function () {
        clickMedia.play();
        stage = 2;

        $("#first_page").fadeOut('fast', function () {
            $("#second_page").fadeIn('fast');
            appFill.hideLoading();
            clickFlag = false;
        });
    },
    setFirstStory: function (amount) {
        alert('setFirstStory');
        stories = amount;
        if (amount != 0) {
            currentStory = 1;
            $(".story_image_holder").remove();
            for (var i = 0; i < amount; i++) {
                var img = document.createElement('img');

                img.className = "story_image_holder";
                img.src = storyRoot + (i + 1) + "/front.png";
                img.setAttribute("onClick", "loadStory(" + (i + 1) + ")");
                $(".story_image").append(img);
            }
            appFull.showCatPage();
        }
    },
    nextStory: function () {
        clickMedia.play();
        if (currentStory < stories) {
            currentStory++;
            $(".story_out_of").text(currentStory + " / " + stories);
            $('.story_image_holder').attr("src", storyRoot + currentStory + "/front.jpg");
        }
    },
    prevStory: function () {
        clickMedia.play();
        if (currentStory > 1) {
            currentStory--;
            $(".story_out_of").text(currentStory + " / " + stories);
            $('.story_image_holder').attr("src", storyRoot + currentStory + "/front.jpg");
        }
    },
    loadStory: function (storyNum) {
        if (!clickFlag) {
            currentStory = storyNum;
            clickFlag = true;
            clickMedia.play();
            appFull.showLoading();
            appFull.getStoryById(storyNum, category);
        }
    },
    play_sound: function () {
        playsound = !playsound;
        clickMedia.play();
        //alert(playsound);
        if (playsound) replayStory();
        if (!playsound) {
            $(".recImg").remove();
            $("body").append("<img src='img/no_sound1.png''  onClick='play_sound()' class='recImg' style='top:1%;left:0.5%;width:11%;height:14%;' />");
        }
    },
    hideOrShowPanel: function () {
        fl = $(".nav_panel").is(":visible");
        if (fl) {
            if (playsound) if (playsound) $("#dot").fadeIn('fast');
            $(".nav_panel").fadeOut('fast');
            $(".recImg").remove();
            panel_is_up = false;
            mainClick = false;
        }
        else {
            $("#dot").fadeOut('fast');
            $(".nav_panel").fadeIn('fast');
            panel_is_up = true;
            if (playsound)
                $("body").append("<img src='img/yes_sound1.png''  onClick='play_sound()' class='recImg' style='top:1%;left:0.5%;width:11%;height:14%;' />");
            if (!playsound)
                $("body").append("<img src='img/no_sound1.png''  onClick='play_sound()' class='recImg' style='top:1%;left:0.5%;width:11%;height:14%;' />");
            mainClick = false;
        }
    },
    pauseOrPlay: function () {
        fl = $(".nav_panel").is(":visible");
        if (endOfPage && fl) { replayStory() }
        else
        {
            if (!clickFlag) {

                appFull.hideOrShowPanel();
                panel_up_Media.play();
                if (timeOut != null) {
                    //Reset what is needed Both UI and Backend
                    end_time = new Date().getTime();
                    clearTimeout(timeOut);
                    timeOut = null;
                    myMedia.pause();
                    $("#pop_img").attr('src', 'img/play.png');
                    $("#dot").fadeOut('fast');

                    //Checks if there's a prev page
                    if (storyPage > 1) {
                        $(".prev").fadeIn('fast');
                    }

                    //Checks if there's a next page
                    if (storyPage < Math.floor(storyPageAmount)) {
                        $(".next").fadeIn('fast');
                    }

                }
                else {

                    //Resume playing
                    after_resume = true;
                    $(".prev").fadeOut('fast');
                    if (playsound) if (playsound) $("#dot").fadeIn('fast');
                    $(".next").fadeOut('fast');
                    $(".recImg").remove();
                    $("#pop_img").attr('src', 'img/pause.png');
                    if (!endOfPage) {
                        if (playsound) myMedia.play();
                    }

                    delta_time = 0
                    if (currentWord == 0) {
                        word_time = storyData.time[storyPage][1] - 600;
                    }
                    delta_time = end_time - start_time;
                    all_time = all_time + delta_time;
                    time_left = word_time - all_time;
                    if (time_left > 0) {
                        timeOut = setTimeout(function () { appFull.moveDot(storyData.location[storyPage].x[currentWord] + "%", storyData.location[storyPage].y[currentWord] + "%") }, time_left);
                        start_time = new Date().getTime();
                    }
                    else {
                        appFull.moveDot(storyData.location[storyPage].x[currentWord] + "%", storyData.location[storyPage].y[currentWord] + "%");
                    }

                }

            }
        }
    },
    replayStory: function () {
        clickMedia.play();
        if (!clickFlag) {
            if (!replayFlag) {
                //UI changes
                after_resume = false;
                appFull.hideOrShowPanel();
                replayFlag = true;
                $("#pop_img").attr('src', 'img/pause.png');
                $(".prev").fadeOut('fast');
                $(".next").fadeOut('fast');
                $(".recImg").remove();
                $("#dot").fadeOut('fast');
                $("iframe").remove();

                //Reset vars needed
                myMedia.stop();
                myMedia.release();
                clearTimeout(timeOut);
                appFull.setStory(data);
            }
        }
    },
    prevStoryPage: function () {
        if (!clickFlag) {
            $(".nav_panel").fadeOut('fast');
            $("#dot").fadeOut('fast');
            clearTimeout(blinkBubble);
            blinkBubble = null;
            appFull.showLoading();
            clickFlag = true;
            popFlag = true;
            clickMedia.play();
            storyPage--;
            myMedia.stop();
            myMedia.release();
            clearTimeout(timeOut);

            appFull.changePrevPage();
            setTimeout(setStory(data), 3500);
        }
    },
    changeNextPage: function () {
        //Check if the next slide +1 is available
        if ((storyPage + 1) < storyPageAmount) {
            //Set the background of the flip container, background must be like the current image.
            //When flipping from 3 to 1 the background is the preview to 1
            $('#flipbook').attr('style', 'background:url(' + storyRoot + currentStory + '/' + (storyPage + 2) + '.jpg)');

            //Switch between the slides to determine which slide should be change
            switch (currentSlidePage) {
                case 1:
                    $("#divS1").find('.img').css(
                    {
                        'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage + 2) + '.jpg)',
                        'background-size': '100% 0px'
                    });
                    currentSlidePage++;
                    break;

                case 2:
                    $("#divS2").find('.img').css(
                    {
                        'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage + 2) + '.jpg)',
                        'background-size': '100% 0px'
                    });
                    currentSlidePage++;
                    break;
                case 3:
                    $("#divS3").find('.img').css(
                    {
                        'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage + 2) + '.jpg)',
                        'background-size': '100% 0px'
                    });
                    currentSlidePage = 1;
                    break;
            }
        }
            //The next slide is the last slide
        else {
            $('#flipbook').attr('style', 'background:url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)');
            //Again switch the slides to determine which one to change. ALL slides are changed to last slide.
            switch (currentSlidePage) {
                case 1:
                    $("#divS1").find('.img').css(
                    {
                        'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                        'background-size': '100% 0px'
                    });
                    $("#divS2").find('.img').css(
                    {
                        'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                        'background-size': '100% 0px'
                    });
                    $("#divS3").find('.img').css(
                    {
                        'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                        'background-size': '100% 0px'
                    });
                    currentSlidePage++;
                    break;

                case 2:
                    $("#divS1").find('.img').css(
                    {
                        'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                        'background-size': '100% 0px'
                    });
                    $("#divS2").find('.img').css(
                    {
                        'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                        'background-size': '100% 0px'
                    });
                    $("#divS3").find('.img').css(
                    {
                        'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                        'background-size': '100% 0px'
                    });
                    currentSlidePage++;
                    break;
                case 3:
                    $("#divS1").find('.img').css(
                    {
                        'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                        'background-size': '100% 0px'
                    });
                    $("#divS2").find('.img').css(
                    {
                        'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                        'background-size': '100% 0px'
                    });
                    $("#divS3").find('.img').css(
                    {
                        'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                        'background-size': '100% 0px'
                    });
                    currentSlidePage = 1;
                    break;
            }
        }
    },
    changePrevPage: function () {
        $('#flipbook').attr('style', 'background:url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)');

        //Slide switching as in "ChangeNextPage()" function
        switch (currentSlidePage) {
            case 1:
                $("#divS3").find('.img').css(
                {
                    'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                    'background-size': '100% 0px'
                });
                currentSlidePage = 3;
                break;

            case 2:
                $("#divS1").find('.img').css(
                {
                    'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                    'background-size': '100% 0px'
                });
                currentSlidePage--;
                break;
            case 3:
                $("#divS2").find('.img').css(
                {
                    'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                    'background-size': '100% 0px'
                });
                currentSlidePage--;
                break;
        }
    },
    nextStoryPage: function () {
        if (!clickFlag) {

            $(".nav_panel").fadeOut('fast');
            $("#dot").fadeOut('fast');
            clearTimeout(blinkBubble);
            blinkBubble = null;
            appFull.showLoading();
            clickFlag = true;
            popFlag = true;
            clickMedia.play();
            storyPage++;

            //Set a timeout before calling the page swaping.
            setTimeout(appFull.changeNextPage, 3000);
            myMedia.stop();
            myMedia.release();


            clearTimeout(timeOut);
            setTimeout(appFull.setStory(data), 3500);
        }
    },
    setStory: function (dataSend) {
        //Check if data is not null
        if (dataSend == null) {
            dataSend = data;
        }

        //If page is in bound
        if (storyPage <= dataSend.amount && storyPage > 0) {
            stage = 3;	//Stage for back button switch

            //Reset settings that might interrupt
            $("#overlay_panel").css("display", "none");
            $("#close_button").fadeOut('fast');
            endOfPage = false;
            $(".pageNum").text(storyPage + " / " + Math.floor(dataSend.amount));
            $("iframe").remove();
            iframeVis = false;
            currentWord = 0;

            //Set page amount & local data var
            storyPageAmount = dataSend.amount;
            data = dataSend;

            //Call for setPagesScroll the refresh the matrix
            appFull.setPagesScroll();

            /*****************************
            NOT FUNCTIONING - HTML issues?
            if(storyPage > 7)
            {
                document.getElementById("overlay_panel").scrollLeft = (storyPage-7)*13.5+"%";
                $("#overlay_panel").animate({ scrollLeft : (storyPage-7)*13.5+"%"}, 'fast');
            }
            *****************************/

            //If image story is not set yet
            if (!storyImagesSet) {
                appFull.setStoryImage();
                storyImagesSet = true;

                $("#dot").fadeOut('fast');
            }


            $(".urlImg").attr("src", "img/url_is_close.png");

            //Check for K parameter and act with iframe as neeeded
            if (data.urlData.k[storyPage - 1] == 2) {
                //Open Iframe

                url2_width = data.urlData.width[storyPage];
                url2_height = data.urlData.height[storyPage];
                //if (url2_width == 100 &&  url2_height == 100 )
                //{
                //$("#close_button").fadeIn('fast');
                //}
                $(".iframe_button").fadeIn('fast')
                openIframe("http://www.kidnet.co.il/books/server/stories/" + category + "/story" + currentStory + "/urls/index" + storyPage + ".html");
                //var mystring = category+currentStory;
                //openIframe("http://www.kidnet.co.il/books/server/stories/games.html?" + mystring);
                $(".iframe_button").fadeIn('fast');
            }
            else if (data.urlData.k[storyPage - 1] == 1) {
                //Show Iframe
                appFull.blinkTheImage();
                $(".iframe_button").fadeIn('fast');
            }
            else if (data.urlData.k[storyPage - 1] == 0) {
                //Hide iframe button
                $(".iframe_button").fadeOut('fast');
            }
            else if (data.urlData.k[storyPage - 1] == 3) {
                //No iframe, blink image
                appFull.blinkTheImage();
            }

            //Fade in / out relevant parts in the UI
            $(".prev").fadeOut('fast');
            $(".next").fadeOut('fast');
            $(".recImg").remove();
            $("#second_page").fadeOut('fast');
            $("#third_page").fadeIn('fast');

            //Set play or pause button to pause
            $("#pop_img").attr('src', 'img/pause.png');

            //Media src
            var voiceSrc = "http://www.kidnet.co.il/books/server/stories/" + category + "/story" + currentStory + "/" + storyPage + ".mp3";

            //Check if replay or new play
            if (replayFlag) {
                if (playsound) myMedia.play();
            }
            else {
                //If not replay then reset Media var
                myMedia = null;
                //if (playsound) { myMedia = new Media(voiceSrc,onSuccess, onError)};
                myMedia = new Media(voiceSrc, appFull.onSuccess, appFull.onError);
            }

            //Set timeout for initial
            setTimeout(function () { myMedia.play({ numberOfLoops: 1 }) }, 900);

            //Set interval to check when media start playing
            mediaTimer = setInterval(function () {
                myMedia.getCurrentPosition(
                    // success callback
                    function (position) {
                        //The media started
                        if (position > 0) {
                            appFull.hideLoading();
                            //alert(playsound);
                            if (!playsound) myMedia.pause();
                            clearInterval(mediaTimer);

                            if (!popFlag) {
                                $(".replay").fadeIn('fast');
                                $(".back_to").fadeIn('fast');
                            }

                            if (!replayFlag) {
                                $(".replay").fadeIn('fast');
                                $(".back_to").fadeIn('fast');
                            }

                            replayFlag = false;
                            popFlag = false;
                            $("#flipbook").css("z-index", "1000000000");

                            //Start the dot movement
                            start_time = new Date().getTime();
                            after_resume = false;
                            all_time = 0;
                            timeOut = setTimeout(function () { appFull.moveDot(data.location[storyPage].x[currentWord] + "%", data.location[storyPage].y[currentWord] + "%") }, appFull.storyData.time[storyPage][1] - 600);

                            //setImagesTemp() Currently not used.
                            clickFlag = false;
                        }
                    },
                    // error callback
                    function (e) {
                        alert("Error while loading audio");
                    }
                );
            }, 50);
        }
    },
    jumpToPage: function (pageTo) {
        if (!clickFlag) {
            //UI changes for page jumping
            $("#dot").fadeOut('fast');
            appFull.hideOrShowPanel()
            clickFlag = true;
            appFull.showLoading();
            $("#dot").fadeOut('fast');
            $("#overlay_panel").css("display", "none");

            //Check if destinated page is current page
            if (pageTo == storyPage) {
                clickMedia.play();
                if (timeOut != null) {
                    clearTimeout(timeOut);
                    timeOut = null;
                    myMedia.pause();
                    $("#pop_img").attr('src', 'img/play.png');
                    if (storyPage > 1) {
                        $(".prev").fadeIn('fast');
                    }
                    if (storyPage < Math.floor(storyPageAmount)) {
                        $(".next").fadeIn('fast');
                    }
                    appFull.hideLoading();
                }
                else {
                    $(".prev").fadeOut('fast');
                    $(".next").fadeOut('fast');
                    $(".recImg").remove();
                    $("#pop_img").attr('src', 'img/pause.png');
                    if (!endOfPage) {
                        if (playsound) myMedia.play();
                    }
                    appFull.moveDot(storyData.location[storyPage].x[currentWord] + "%", storyData.location[storyPage].y[currentWord] + "%");
                }
                clickFlag = false;
            }

                //Check if next page then applay normal NextPage method
            else if (pageTo == storyPage + 1) {
                $('#flipbook').attr('style', 'background:url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)');
                storyPage = pageTo;
                $(".next").trigger("click");
                $(".nav_panel").fadeOut('fast');
                $("#dot").fadeOut('fast');
                clearTimeout(blinkBubble);
                blinkBubble = null;
                appFull.showLoading();
                clickFlag = true;
                popFlag = true;
                clickMedia.play();
                appFull.changeNextPage();
                myMedia.stop();
                myMedia.release();


                clearTimeout(timeOut);
                setStory(data);
            }

                //Check if prev page then applay normal PrevPage method
            else if (pageTo == storyPage - 1) {
                $('#flipbook').attr('style', 'background:url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)');
                storyPage = pageTo;
                $(".prev").trigger("click");
                $(".nav_panel").fadeOut('fast');
                $("#dot").fadeOut('fast');
                clearTimeout(blinkBubble);
                blinkBubble = null;
                appFull.showLoading();
                clickFlag = true;
                popFlag = true;
                clickMedia.play();
                myMedia.stop();
                myMedia.release();
                clearTimeout(timeOut);

                appFull.changePrevPage();
                appFull.setStory(data);
            }

                //If page destinated is not +1 / -1 / current
            else {
                //Check if greater then current page
                if (pageTo > storyPage) {
                    storyPage = pageTo;
                    //Set story page and switch slides
                    switch (currentSlidePage) {
                        case 1:
                            $('#flipbook').attr('style', 'background:url(' + storyRoot + currentStory + '/' + (storyPage + 2) + '.jpg)');
                            $("#divS1").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                                'background-size': '100% 0px'
                            });
                            $("#divS2").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage + 1) + '.jpg)',
                                'background-size': '100% 0px'
                            });

                            $("#divS3").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage + 2) + '.jpg)',
                                'background-size': '100% 0px'
                            });
                            break;

                        case 2:
                            $('#flipbook').attr('style', 'background:url(' + storyRoot + currentStory + '/' + (storyPage + 1) + '.jpg)');
                            $("#divS2").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                                'background-size': '100% 0px'
                            });
                            $("#divS3").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage + 1) + '.jpg)',
                                'background-size': '100% 0px'
                            });

                            $("#divS1").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage + 2) + '.jpg)',
                                'background-size': '100% 0px'
                            });

                            break;
                        case 3:
                            $('#flipbook').attr('style', 'background:url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)');
                            $("#divS3").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                                'background-size': '100% 0px'
                            });
                            $("#divS1").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage + 1) + '.jpg)',
                                'background-size': '100% 0px'
                            });

                            $("#divS2").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage + 2) + '.jpg)',
                                'background-size': '100% 0px'
                            });
                            break;
                    }

                    //Set the story data to play the sound
                    appFull.setStory(data);
                }

                    //If page is lesser then current page
                else if (pageTo < storyPage) {
                    storyPage = pageTo;
                    //Set storyPage and switch slides
                    switch (currentSlidePage) {
                        case 1:
                            $('#flipbook').attr('style', 'background:url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)');
                            $("#divS1").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                                'background-size': '100% 0px'
                            });
                            $("#divS2").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage + 1) + '.jpg)',
                                'background-size': '100% 0px'
                            });

                            $("#divS3").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage + 2) + '.jpg)',
                                'background-size': '100% 0px'
                            });
                            break;

                        case 2:
                            $('#flipbook').attr('style', 'background:url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)');
                            $("#divS2").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                                'background-size': '100% 0px'
                            });
                            $("#divS3").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage + 1) + '.jpg)',
                                'background-size': '100% 0px'
                            });

                            $("#divS1").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage + 2) + '.jpg)',
                                'background-size': '100% 0px'
                            });
                            break;

                        case 3:
                            $('#flipbook').attr('style', 'background:url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)');
                            $("#divS3").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage) + '.jpg)',
                                'background-size': '100% 0px'
                            });
                            $("#divS1").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage + 1) + '.jpg)',
                                'background-size': '100% 0px'
                            });

                            $("#divS2").find('.img').css(
                            {
                                'background-image': 'url(' + storyRoot + currentStory + '/' + (storyPage + 2) + '.jpg)',
                                'background-size': '100% 0px'
                            });
                            break;
                    }

                    //Set Story to play sound
                    appFull.setStory(data);
                }
            }
        }
    },
    setPagesScroll: function () {
        $('.overlay_item').each(function (index, element) {
            $(element).remove();
        });

        //Change UI by amount
        var parent = document.getElementById("overlay_panel");
        var sizeToChange = Math.floor(data.amount + 3) * 80 + "px";

        $("#third_page_overlay").css("min-width", "100%");
        $("#overlay_panel").css("min-width", sizeToChange);

        //Create the matrix
        for (var i = 0; i < (data.amount - 1) ; i++) {
            var page = i + 1;
            var div = document.createElement('span');
            div.className = "overlay_item";
            div.innerHTML = (page);
            div.setAttribute("onClick", "jumpToPage(" + page + ")");

            //Sets current story square green
            if (page == storyPage) {
                div.style.backgroundColor = "green";
            }

            //Set last page color
            if (page == Math.floor(data.amount)) {
                div.style.backgroundColor = "#ff7f00";
            }
            parent.appendChild(div);
        }

    },
    onError: function () {
        // Media error handling, for a reason it calls even when there are no errors. Phonegap system fail to detecet.
        //alert("שגיאה בטעינת הסיפור");
    },
    onSuccess: function () {
        if (!replayFlag) {
            if (!clickFlag) {
                if (data.urlData.k[storyPage - 1] == 3) {
                    $("#dot").fadeOut('fast');
                    url2_width = data.urlData.width[storyPage];
                    url2_height = data.urlData.height[storyPage];
                    $(".iframe_button").fadeIn('fast')
                    appFull.blinkTheImage();
                    appFull.openIframe("http://www.kidnet.co.il/books/server/stories/" + category + "/story" + currentStory + "/urls/index" + storyPage + ".html");
                    //var mystring = category+currentStory;
                    //openIframe("http://www.kidnet.co.il/books/server/stories/games.html?" + mystring);
                    $(".iframe_button").fadeIn('fast');
                }
                appFull.hideOrShowPanel();
                if (storyPage > 1) {
                    $(".prev").fadeIn('fast');
                }
                if (storyPage < Math.floor(storyPageAmount)) {
                    $(".next").fadeIn('fast');
                }
            }
        }
    },
    setImagesTemp: function () {
        for (var i = storyPage; i <= storyPageAmount; i++) {
            //$("#imageS"+i).attr("src", storyRoot+currentStory+"/"+i+".jpg");
        }
    },
    setStoryImage: function () {
        $("#flipbook").empty();
        //Empty the flipbook container and create 3 images.

        var divS = document.createElement('div');
        var imgS1 = document.createElement('img');

        //Img & div class and id's
        imgS1.className = 'first_image';
        imgS1.id = 'imageS1';
        divS.className = 'slide';
        divS.id = 'divS1';
        $(imgS1).attr('src', storyRoot + currentStory + '/' + 1 + '.jpg');
        //$('#pointer_image').attr('src', storyRoot+currentStory+'/pointer.png');
        $('#pointer_image').attr('src', storyRoot_p + '/pointer.gif');
        divS.appendChild(imgS1);
        document.getElementById('flipbook').appendChild(divS);

        var divS = document.createElement('div');
        var imgS1 = document.createElement('img');

        //Img & div class and id's
        imgS1.className = 'first_image';
        imgS1.id = 'imageS2';
        divS.className = 'slide';
        divS.id = 'divS2';
        $(imgS1).attr('src', storyRoot + currentStory + '/' + 2 + '.jpg');
        //$('#pointer_image').attr('src', storyRoot+currentStory+'/pointer.png');
        $('#pointer_image').attr('src', storyRoot_p + '/pointer.gif');
        divS.appendChild(imgS1);
        document.getElementById('flipbook').appendChild(divS)
        $(imgS1).css('visibility ', 'hidden');

        var divS = document.createElement('div');
        var imgS1 = document.createElement('img');

        //Img & div class and id's
        imgS1.className = 'first_image';
        imgS1.id = 'imageS3';
        divS.className = 'slide';
        divS.id = 'divS3';
        $(imgS1).attr('src', storyRoot + currentStory + '/' + 3 + '.jpg');
        $(imgS1).css('visibility ', 'hidden');
        //$('#pointer_image').attr('src', storyRoot+currentStory+'/pointer.png');
        $('#pointer_image').attr('src', storyRoot_p + '/pointer.gif');
        divS.appendChild(imgS1);
        document.getElementById('flipbook').appendChild(divS)
        $("#imageS3").hide();
        var imageLoad = document.getElementById("imageS1");

        imageLoad.onload = function () {
            $("#imageS2").css('visibility ', 'visible');
            $("#imageS3").css('visibility ', 'visible');
            //alert("loaded");
        }

        $('#flipbook').attr('style', 'background:url(' + storyRoot + currentStory + '/' + 3 + '.jpg)');
        $('#flipbook').css('background-size', "100% 100%");
        $('#flipbook').pageFlip();
    },
    moveDot: function (x, y) {
        all_time = 0;

        currentWord++;

        //Fade in dot
        if (playsound) if (playsound) $("#dot").fadeIn('fast');

        //X & Y from data
        x = x.replace(/\s+/g, "").trim();
        y = y.replace(/\s+/g, "").trim();

        //Set dot offset
        $("#dot").css('left', x);
        $("#dot").css('top', y);

        //Word wait time
        word_time = storyData.time[storyPage][currentWord + 1] - storyData.time[storyPage][currentWord];
        //if (delta_time > 0) {word_time = word_time + delta_time}


        //Check if not last word
        if (storyData.time[storyPage][currentWord] != 500000) {
            //Set time out for the next dot
            timeOut = setTimeout(function () { appFull.moveDot(storyData.location[storyPage].x[currentWord] + "%", storyData.location[storyPage].y[currentWord] + "%") }, word_time);
            start_time = new Date().getTime();

        }

        //If last word
        if (storyData.time[storyPage][currentWord + 1] == 500000) {
            //Set and of page flag and fadeout dot
            endOfPage = true;
            $("#dot").fadeOut('fast');
        }
    },
    gotoStoryList: function () {
        //clickMedia.play();
        back_story_list_Media.play();
        playsound = true;
        if (!clickFlag) {
            stage = 2;

            //Reset / Fadeout needed elements on UI and backend
            $("#dot").fadeOut('fast');

            $("iframe").remove();
            $(frame).remove();
            myMedia.stop();
            clearTimeout(timeOut);
            currentWord = 0;
            storyPage = 1;
            currentSlidePage = 1;
            storyPageAmount = 0;
            storyData = null;
            myMedia = null;
            timeOut = null;
            replayFlag = false;

            appFull.hideOrShowPanel();
            storyImagesSet = false;
            clickFlag = false;

            $('.slide').each(function (index, element) {
                $(element).remove();
            });

            $('.overlay_item').each(function (index, element) {
                $(element).remove();
            });

            //Set category by the current one
            $("#third_page").fadeOut('fast', function () {
                switch (category) {
                    case 'leg':
                        category = 'leg';
                        $("#second_page").addClass("leg_bkground");
                        $("#second_page").removeClass("adv_bkground");
                        $("#second_page").removeClass("mash_bkground");
                        $("#cat_image").attr("src", "img/leg_title.png");
                        break;

                    case 'adv':
                        category = 'adv';
                        $("#second_page").addClass("adv_bkground");
                        $("#second_page").removeClass("leg_bkground");
                        $("#second_page").removeClass("mash_bkground");
                        $("#cat_image").attr("src", "img/adv_title.png");
                        break;

                    case 'mash':
                        category = 'mash';
                        $("#second_page").addClass("mash_bkground");
                        $("#second_page").removeClass("leg_bkground");
                        $("#second_page").removeClass("adv_bkground");
                        $("#cat_image").attr("src", "img/mash_title.png");
                        break;
                }
                $("#second_page").fadeIn('fast');
            });
        }
    },
    getStories: function (category) {
        alert('get stories');
        $.ajax({
            type: 'POST',
            url: 'http://www.kidnet.co.il/books/server/server.php',
            dataType: 'json',
            data: { request: 15, cat: category },
            success: function (data) {
                appFull.setFirstStory(data);
            }
        });
    },
    getStoryById: function (id, category) {
        alert('get story by id');
        $.ajax({
            type: 'POST',
            url: 'http://www.kidnet.co.il/books/server/server.php',
            dataType: 'json',
            data: { request: 30, id: id, cat: category },
            success: function (data) {
                storyData = data;
                //alert(data.time[2][1]);
                appFull.setStory(data);
            }
        });
    }
};




document.addEventListener("deviceready", appFull.deviceReady, false);
//$(document).ready(appFull.deviceReady);
