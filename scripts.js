var mr_firstSectionHeight,
    mr_nav,
    mr_fixedAt,
    mr_navOuterHeight,
    mr_navScrolled = false,
    mr_navFixed = false,
    mr_outOfSight = false,
    mr_floatingProjectSections,
    mr_scrollTop = 0;

jQuery(document).ready(function() { 
    "use strict";

    // Smooth scroll to inner links
        var innerLinks = jQuery('a.inner-link');

        if(innerLinks.length){
            innerLinks.each(function(){
                var link = jQuery(this);
                var href = link.attr('href');
                if(href.charAt(0) !== "#"){
                    link.removeClass('inner-link');
                }
            });

            var offset = 0;
            if(jQuery('body[data-smooth-scroll-offset]').length){
                offset = jQuery('body').attr('data-smooth-scroll-offset');
                offset = offset*1;
            }
            
            smoothScroll.init({
                selector: '.inner-link',
                selectorHeader: null,
                speed: 750,
                easing: 'easeInOutCubic',
                offset: offset
            });
        }

    // Update scroll variable for scrolling functions

    addEventListener('scroll', function() {
        mr_scrollTop = window.pageYOffset;
    }, false);

    // Append .background-image-holder <img>'s as CSS backgrounds

    jQuery('.background-image-holder').each(function() {
        var imgSrc = jQuery(this).children('img').attr('src');
        jQuery(this).css('background', 'url("' + imgSrc + '")');
        jQuery(this).children('img').hide();
        jQuery(this).css('background-position', 'initial');
    });

    // Fade in background images

    setTimeout(function() {
        jQuery('.background-image-holder').each(function() {
            jQuery(this).addClass('fadeIn');
        });
    }, 200);

    // Initialize Tooltips

    jQuery('[data-toggle="tooltip"]').tooltip();

    // Icon bulleted lists

    jQuery('ul[data-bullet]').each(function(){
        var bullet = jQuery(this).attr('data-bullet');
        jQuery(this).find('li').prepend('<i class="'+bullet+'"></i>');
    });

    // Progress Bars

    jQuery('.progress-bar').each(function() {
        jQuery(this).css('width', jQuery(this).attr('data-progress') + '%');
    });

    // Navigation

    if (!jQuery('nav').hasClass('fixed') && !jQuery('nav').hasClass('absolute')) {

        // Make nav container height of nav

        jQuery('.nav-container').css('min-height', jQuery('nav').outerHeight(true));

        jQuery(window).resize(function() {
            jQuery('.nav-container').css('min-height', jQuery('nav').outerHeight(true));
        });

        // Compensate the height of parallax element for inline nav

        if (jQuery(window).width() > 768) {
            jQuery('.parallax:nth-of-type(1) .background-image-holder').css('top', -(jQuery('nav').outerHeight(true)));
        }

        // Adjust fullscreen elements

        if (jQuery(window).width() > 768) {
            jQuery('section.fullscreen:nth-of-type(1)').css('height', (jQuery(window).height() - jQuery('nav').outerHeight(true)));
        }

    } else {
        jQuery('body').addClass('nav-is-overlay');
    }

    if (jQuery('nav').hasClass('bg-dark')) {
        jQuery('.nav-container').addClass('bg-dark');
    }


    // Fix nav to top while scrolling

    mr_nav = jQuery('body .nav-container nav:first');
    mr_navOuterHeight = jQuery('body .nav-container nav:first').outerHeight();
        mr_fixedAt = typeof mr_nav.attr('data-fixed-at') !== typeof undefined ? parseInt(mr_nav.attr('data-fixed-at').replace('px', '')) : parseInt(jQuery('section:nth-of-type(1)').outerHeight());
    window.addEventListener("scroll", updateNav, false);

    // Menu dropdown positioning

    jQuery('.menu > li > ul').each(function() {
        var menu = jQuery(this).offset();
        var farRight = menu.left + jQuery(this).outerWidth(true);
        if (farRight > jQuery(window).width() && !jQuery(this).hasClass('mega-menu')) {
            jQuery(this).addClass('make-right');
        } else if (farRight > jQuery(window).width() && jQuery(this).hasClass('mega-menu')) {
            var isOnScreen = jQuery(window).width() - menu.left;
            var difference = jQuery(this).outerWidth(true) - isOnScreen;
            jQuery(this).css('margin-left', -(difference));
        }
    });

    // Mobile Menu

    jQuery('.mobile-toggle').click(function() {
        jQuery('.nav-bar').toggleClass('nav-open');
        jQuery(this).toggleClass('active');
    });

    jQuery('.menu li').click(function(e) {
        if (!e) e = window.event;
        e.stopPropagation();
        if (jQuery(this).find('ul').length) {
            jQuery(this).toggleClass('toggle-sub');
        } else {
            jQuery(this).parents('.toggle-sub').removeClass('toggle-sub');
        }
    });

    jQuery('.menu li a').click(function() {
        if (jQuery(this).hasClass('inner-link')){
            jQuery(this).closest('.nav-bar').removeClass('nav-open');
        }
    });

    jQuery('.module.widget-handle').click(function() {
        jQuery(this).toggleClass('toggle-widget-handle');
    });

    jQuery('.search-widget-handle .search-form input').click(function(e){
        if (!e) e = window.event;
        e.stopPropagation();
    });
    
    // Offscreen Nav
    
    if(jQuery('.offscreen-toggle').length){
    	jQuery('body').addClass('has-offscreen-nav');
    }
    else{
        jQuery('body').removeClass('has-offscreen-nav');
    }
    
    jQuery('.offscreen-toggle').click(function(){
    	jQuery('.main-container').toggleClass('reveal-nav');
    	jQuery('nav').toggleClass('reveal-nav');
    	jQuery('.offscreen-container').toggleClass('reveal-nav');
    });
    
    jQuery('.main-container').click(function(){
    	if(jQuery(this).hasClass('reveal-nav')){
    		jQuery(this).removeClass('reveal-nav');
    		jQuery('.offscreen-container').removeClass('reveal-nav');
    		jQuery('nav').removeClass('reveal-nav');
    	}
    });
    
    jQuery('.offscreen-container a').click(function(){
    	jQuery('.offscreen-container').removeClass('reveal-nav');
    	jQuery('.main-container').removeClass('reveal-nav');
    	jQuery('nav').removeClass('reveal-nav');
    });

    // Populate filters
    
    jQuery('.projects').each(function() {

        var filters = "";

        jQuery(this).find('.project').each(function() {

            var filterTags = jQuery(this).attr('data-filter').split(',');

            filterTags.forEach(function(tagName) {
                if (filters.indexOf(tagName) == -1) {
                    filters += '<li data-filter="' + tagName + '">' + capitaliseFirstLetter(tagName) + '</li>';
                }
            });
            jQuery(this).closest('.projects')
                .find('ul.filters').empty().append('<li data-filter="all" class="active">All</li>').append(filters);
        });
    });

    jQuery('.filters li').click(function() {
        var filter = jQuery(this).attr('data-filter');
        jQuery(this).closest('.filters').find('li').removeClass('active');
        jQuery(this).addClass('active');

        jQuery(this).closest('.projects').find('.project').each(function() {
            var filters = jQuery(this).attr('data-filter');

            if (filters.indexOf(filter) == -1) {
                jQuery(this).addClass('inactive');
            } else {
                jQuery(this).removeClass('inactive');
            }
        });

        if (filter == 'all') {
            jQuery(this).closest('.projects').find('.project').removeClass('inactive');
        }
    });

    // Twitter Feed
       jQuery('.tweets-feed').each(function(index) {
           jQuery(this).attr('id', 'tweets-' + index);
       }).each(function(index) {
           var element = jQuery('#tweets-' + index);
           var TweetConfig = {
               "domId": '',
               "maxTweets": element.attr('data-amount'),
               "enableLinks": true,
               "showUser": true,
               "showTime": true,
               "dateFunction": '',
               "showRetweet": false,
               "customCallback": handleTweets
           };

           if(typeof element.attr('data-widget-id') !== typeof undefined){
                TweetConfig.id = element.attr('data-widget-id');
            }else if(typeof element.attr('data-feed-name') !== typeof undefined && element.attr('data-feed-name') !== "" ){
                TweetConfig.profile = {"screenName": element.attr('data-feed-name').replace('@', '')};
            }else{
                TweetConfig.profile = {"screenName": 'twitter'};
            }

           function handleTweets(tweets) {
               var x = tweets.length;
               var n = 0;
               var element = document.getElementById('tweets-' + index);
               var html = '<ul class="slides">';
               while (n < x) {
                   html += '<li>' + tweets[n] + '</li>';
                   n++;
               }
               html += '</ul>';
               element.innerHTML = html;

               if (jQuery('.tweets-slider').length) {
                    jQuery('.tweets-slider').flexslider({
                        directionNav: false,
                        controlNav: false
                    });
                }       
               return html;
           }
           twitterFetcher.fetch(TweetConfig);
      });

    // Instagram Feed
    
    if(jQuery('.instafeed').length){
    	jQuery.fn.spectragram.accessData = {
			accessToken: '1406933036.dc95b96.2ed56eddc62f41cbb22c1573d58625a2',
			clientID: '87e6d2b8a0ef4c7ab8bc45e80ddd0c6a'
		};	

        jQuery('.instafeed').each(function() {
            var feedID = jQuery(this).attr('data-user-name');
            jQuery(this).children('ul').spectragram('getUserFeed', {
                query: feedID,
                max: 12
            });
        });
    }   

   

    // Flickr Feeds

    if(jQuery('.flickr-feed').length){
        jQuery('.flickr-feed').each(function(){
            var userID = jQuery(this).attr('data-user-id');
            var albumID = jQuery(this).attr('data-album-id');
            jQuery(this).flickrPhotoStream({ id: userID, setId: albumID, container: '<li class="masonry-item" />' });   
            setTimeout(function(){
                initializeMasonry();
                window.dispatchEvent(new Event('resize'));
            }, 1000); 
        });

    }

    // Image Sliders
    if(jQuery('.slider-all-controls, .slider-paging-controls, .slider-arrow-controls, .slider-thumb-controls, .logo-carousel').length){
        jQuery('.slider-all-controls').flexslider({
            start: function(slider){
                if(slider.find('.slides li:first-child').find('.fs-vid-background video').length){
                   slider.find('.slides li:first-child').find('.fs-vid-background video').get(0).play(); 
                }
            },
            after: function(slider){
                if(slider.find('.fs-vid-background video').length){
                    if(slider.find('li:not(.flex-active-slide)').find('.fs-vid-background video').length){
                        slider.find('li:not(.flex-active-slide)').find('.fs-vid-background video').get(0).pause();
                    }
                    if(slider.find('.flex-active-slide').find('.fs-vid-background video').length){
                        slider.find('.flex-active-slide').find('.fs-vid-background video').get(0).play();
                    }
                }
            }
        });
        jQuery('.slider-paging-controls').flexslider({
            animation: "slide",
            directionNav: false
        });
        jQuery('.slider-arrow-controls').flexslider({
            controlNav: false
        });
        jQuery('.slider-thumb-controls .slides li').each(function() {
            var imgSrc = jQuery(this).find('img').attr('src');
            jQuery(this).attr('data-thumb', imgSrc);
        });
        jQuery('.slider-thumb-controls').flexslider({
            animation: "slide",
            controlNav: "thumbnails",
            directionNav: true
        });
        jQuery('.logo-carousel').flexslider({
            minItems: 1,
            maxItems: 4,
            move: 1,
            itemWidth: 200,
            itemMargin: 0,
            animation: "slide",
            slideshow: true,
            slideshowSpeed: 3000,
            directionNav: false,
            controlNav: false
        });
    }
    
    // Lightbox gallery titles
    
    jQuery('.lightbox-grid li a').each(function(){
    	var galleryTitle = jQuery(this).closest('.lightbox-grid').attr('data-gallery-title');
    	jQuery(this).attr('data-lightbox', galleryTitle);
    });

    // Prepare embedded video modals

    jQuery('iframe[data-provider]').each(function(){
        var provider = jQuery(this).attr('data-provider');
        var videoID = jQuery(this).attr('data-video-id');
        var autoplay = jQuery(this).attr('data-autoplay');
        var vidURL = '';

        if(provider == 'vimeo'){
            vidURL = "http://player.vimeo.com/video/"+videoID+"?badge=0&title=0&byline=0&title=0&autoplay="+autoplay;
            jQuery(this).attr('data-src', vidURL);
        }else if (provider == 'youtube'){
            vidURL = "https://www.youtube.com/embed/"+videoID+"?showinfo=0&autoplay="+autoplay;
            jQuery(this).attr('data-src', vidURL);
        }else{
            console.log('Only Vimeo and Youtube videos are supported at this time');
        }
    });
    
    // Multipurpose Modals
    
    jQuery('.foundry_modal[modal-link]').remove();

    if(jQuery('.foundry_modal').length && (!jQuery('.modal-screen').length)){
        // Add a div.modal-screen if there isn't already one there.
        var modalScreen = jQuery('<div />').addClass('modal-screen').appendTo('body');

    }

    jQuery('.foundry_modal').click(function(){
        jQuery(this).addClass('modal-acknowledged');
    });

    jQuery(document).on('wheel mousewheel scroll', '.foundry_modal, .modal-screen', function(evt){
        jQuery(this).get(0).scrollTop += (evt.originalEvent.deltaY); 
        return false;
    });
    
    jQuery('.modal-container:not([modal-link])').each(function(index) {
        if(jQuery(this).find('iframe[src]').length){
        	jQuery(this).find('.foundry_modal').addClass('iframe-modal');
        	var iframe = jQuery(this).find('iframe');
        	iframe.attr('data-src',iframe.attr('src'));
            iframe.attr('src', '');

        }
        jQuery(this).find('.btn-modal').attr('modal-link', index);

        // Only clone and append to body if there isn't already one there
        if(!jQuery('.foundry_modal[modal-link="'+index+'"]').length){
            jQuery(this).find('.foundry_modal').clone().appendTo('body').attr('modal-link', index).prepend(jQuery('<i class="ti-close close-modal">'));
        }
    });
    
    jQuery('.btn-modal').unbind('click').click(function(){
    	var linkedModal = jQuery('.foundry_modal[modal-link="' + jQuery(this).attr('modal-link') + '"]'),
            autoplayMsg = "";
        jQuery('.modal-screen').toggleClass('reveal-modal');
        if(linkedModal.find('iframe').length){
            if(linkedModal.find('iframe').attr('data-autoplay') === '1'){
                var autoplayMsg = '&autoplay=1'
            }
        	linkedModal.find('iframe').attr('src', (linkedModal.find('iframe').attr('data-src') + autoplayMsg));
        }
        if(linkedModal.find('video').length){
            linkedModal.find('video').get(0).play();
        }
        linkedModal.toggleClass('reveal-modal');
        return false; 
    });
    
    // Autoshow modals
	
	jQuery('.foundry_modal[data-time-delay]').each(function(){
		var modal = jQuery(this);
		var delay = modal.attr('data-time-delay');
		modal.prepend(jQuery('<i class="ti-close close-modal">'));
    	if(typeof modal.attr('data-cookie') != "undefined"){
        	if(!mr_cookies.hasItem(modal.attr('data-cookie'))){
                setTimeout(function(){
        			modal.addClass('reveal-modal');
        			jQuery('.modal-screen').addClass('reveal-modal');
        		},delay);
            }
        }else{
            setTimeout(function(){
                modal.addClass('reveal-modal');
                jQuery('.modal-screen').addClass('reveal-modal');
            },delay);
        }
	});

    // Exit modals
    jQuery('.foundry_modal[data-show-on-exit]').each(function(){
        var modal = jQuery(this);
        var exitSelector = jQuery(modal.attr('data-show-on-exit'));
        // If a valid selector is found, attach leave event to show modal.
        if(jQuery(exitSelector).length){
            modal.prepend(jQuery('<i class="ti-close close-modal">'));
            jQuery(document).on('mouseleave', exitSelector, function(){
                if(!jQuery('body .reveal-modal').length){
                    if(typeof modal.attr('data-cookie') !== typeof undefined){
                        if(!mr_cookies.hasItem(modal.attr('data-cookie'))){
                            modal.addClass('reveal-modal');
                            jQuery('.modal-screen').addClass('reveal-modal');
                        }
                    }else{
                        modal.addClass('reveal-modal');
                        jQuery('.modal-screen').addClass('reveal-modal');
                    }
                }
            });
        }
    });

    // Autoclose modals

    jQuery('.foundry_modal[data-hide-after]').each(function(){
        var modal = jQuery(this);
        var delay = modal.attr('data-hide-after');
        if(typeof modal.attr('data-cookie') != "undefined"){
            if(!mr_cookies.hasItem(modal.attr('data-cookie'))){
                setTimeout(function(){
                if(!modal.hasClass('modal-acknowledged')){
                    modal.removeClass('reveal-modal');
                    jQuery('.modal-screen').removeClass('reveal-modal');
                }
                },delay); 
            }
        }else{
            setTimeout(function(){
                if(!modal.hasClass('modal-acknowledged')){
                    modal.removeClass('reveal-modal');
                    jQuery('.modal-screen').removeClass('reveal-modal');
                }
            },delay); 
        }
    });
    
    jQuery('.close-modal:not(.modal-strip .close-modal)').unbind('click').click(function(){
    	var modal = jQuery(this).closest('.foundry_modal');
        modal.toggleClass('reveal-modal');
        if(typeof modal.attr('data-cookie') !== "undefined"){
            mr_cookies.setItem(modal.attr('data-cookie'), "true", Infinity);
        }
    	if(modal.find('iframe').length){
            modal.find('iframe').attr('src', '');
        }
        jQuery('.modal-screen').removeClass('reveal-modal');
    });
    
    jQuery('.modal-screen').unbind('click').click(function(){
        if(jQuery('.foundry_modal.reveal-modal').find('iframe').length){
            jQuery('.foundry_modal.reveal-modal').find('iframe').attr('src', '');
        }
    	jQuery('.foundry_modal.reveal-modal').toggleClass('reveal-modal');
    	jQuery(this).toggleClass('reveal-modal');
    });
    
    jQuery(document).keyup(function(e) {
		 if (e.keyCode == 27) { // escape key maps to keycode `27`
            if(jQuery('.foundry_modal').find('iframe').length){
                jQuery('.foundry_modal').find('iframe').attr('src', '');
            }
			jQuery('.foundry_modal').removeClass('reveal-modal');
			jQuery('.modal-screen').removeClass('reveal-modal');
		}
	});
    
    // Modal Strips
    
    jQuery('.modal-strip').each(function(){
    	if(!jQuery(this).find('.close-modal').length){
    		jQuery(this).append(jQuery('<i class="ti-close close-modal">'));
    	}
    	var modal = jQuery(this);

        if(typeof modal.attr('data-cookie') != "undefined"){
           
            if(!mr_cookies.hasItem(modal.attr('data-cookie'))){
            	setTimeout(function(){
            		modal.addClass('reveal-modal');
            	},1000);
            }
        }else{
            setTimeout(function(){
                    modal.addClass('reveal-modal');
            },1000);
        }
    });
    
    jQuery('.modal-strip .close-modal').click(function(){
        var modal = jQuery(this).closest('.modal-strip');
        if(typeof modal.attr('data-cookie') != "undefined"){
            mr_cookies.setItem(modal.attr('data-cookie'), "true", Infinity);
        }
    	jQuery(this).closest('.modal-strip').removeClass('reveal-modal');
    	return false;
    });


    // Video Modals

    jQuery('.close-iframe').click(function() {
        jQuery(this).closest('.modal-video').removeClass('reveal-modal');
        jQuery(this).siblings('iframe').attr('src', '');
        jQuery(this).siblings('video').get(0).pause();
    });

    // Checkboxes

    jQuery('.checkbox-option').on("click",function() {
        jQuery(this).toggleClass('checked');
        var checkbox = jQuery(this).find('input');
        if (checkbox.prop('checked') === false) {
            checkbox.prop('checked', true);
        } else {
            checkbox.prop('checked', false);
        }
    });

    // Radio Buttons

    jQuery('.radio-option').click(function() {

        var checked = jQuery(this).hasClass('checked'); // Get the current status of the radio

        var name = jQuery(this).find('input').attr('name'); // Get the name of the input clicked

        if (!checked) {

            jQuery('input[name="'+name+'"]').parent().removeClass('checked');

            jQuery(this).addClass('checked');

            jQuery(this).find('input').prop('checked', true);

        }

    });


    // Accordions

    jQuery('.accordion li').click(function() {
        if (jQuery(this).closest('.accordion').hasClass('one-open')) {
            jQuery(this).closest('.accordion').find('li').removeClass('active');
            jQuery(this).addClass('active');
        } else {
            jQuery(this).toggleClass('active');
        }
        if(typeof window.mr_parallax !== "undefined"){
            setTimeout(mr_parallax.windowLoad, 500);
        }
    });

    // Tabbed Content

    jQuery('.tabbed-content').each(function() {
        jQuery(this).append('<ul class="content"></ul>');
    });

    jQuery('.tabs li').each(function() {
        var originalTab = jQuery(this),
            activeClass = "";
        if (originalTab.is('.tabs>li:first-child')) {
            activeClass = ' class="active"';
        }
        var tabContent = originalTab.find('.tab-content').detach().wrap('<li' + activeClass + '></li>').parent();
        originalTab.closest('.tabbed-content').find('.content').append(tabContent);
    });

    jQuery('.tabs li').click(function() {
        jQuery(this).closest('.tabs').find('li').removeClass('active');
        jQuery(this).addClass('active');
        var liIndex = jQuery(this).index() + 1;
        jQuery(this).closest('.tabbed-content').find('.content>li').removeClass('active');
        jQuery(this).closest('.tabbed-content').find('.content>li:nth-of-type(' + liIndex + ')').addClass('active');
    });

    // Local Videos

    jQuery('section').closest('body').find('.local-video-container .play-button').click(function() {
        jQuery(this).siblings('.background-image-holder').removeClass('fadeIn');
        jQuery(this).siblings('.background-image-holder').css('z-index', -1);
        jQuery(this).css('opacity', 0);
        jQuery(this).siblings('video').get(0).play();
    });

    // Youtube Videos

    jQuery('section').closest('body').find('.player').each(function() {
        var section = jQuery(this).closest('section');
        section.find('.container').addClass('fadeOut');
        var src = jQuery(this).attr('data-video-id');
        var startat = jQuery(this).attr('data-start-at');
        jQuery(this).attr('data-property', "{videoURL:'http://youtu.be/" + src + "',containment:'self',autoPlay:true, mute:true, startAt:" + startat + ", opacity:1, showControls:false}");
    });

	if(jQuery('.player').length){
        jQuery('.player').each(function(){

            var section = jQuery(this).closest('section');
            var player = section.find('.player');
            player.YTPlayer();
            player.on("YTPStart",function(e){
                section.find('.container').removeClass('fadeOut');
                section.find('.masonry-loader').addClass('fadeOut');
            });

        });
    }

    // Interact with Map once the user has clicked (to prevent scrolling the page = zooming the map

    jQuery('.map-holder').click(function() {
        jQuery(this).addClass('interact');
    });
    
    if(jQuery('.map-holder').length){
    	jQuery(window).scroll(function() {
			if (jQuery('.map-holder.interact').length) {
				jQuery('.map-holder.interact').removeClass('interact');
			}
		});
    }
    
    // Countdown Timers

    if (jQuery('.countdown').length) {
        jQuery('.countdown').each(function() {
            var date = jQuery(this).attr('data-date');
            jQuery(this).countdown(date, function(event) {
                jQuery(this).text(
                    event.strftime('%D days %H:%M:%S')
                );
            });
        });
    }
    
    //                                                            //
    //                                                            //
    // Contact form code                                          //
    //                                                            //
    //                                                            //

    jQuery('form.form-email, form.form-newsletter').submit(function(e) {

        // return false so form submits through jQuery rather than reloading page.
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;

        var thisForm = jQuery(this).closest('form.form-email, form.form-newsletter'),
            submitButton = thisForm.find('button[type="submit"]'),
            error = 0,
            originalError = thisForm.attr('original-error'),
            preparedForm, iFrame, userEmail, userFullName, userFirstName, userLastName, successRedirect, formError, formSuccess;

        // Mailchimp/Campaign Monitor Mail List Form Scripts
        iFrame = jQuery(thisForm).find('iframe.mail-list-form');

        thisForm.find('.form-error, .form-success').remove();
        submitButton.attr('data-text', submitButton.text());
        thisForm.append('<div class="form-error" style="display: none;">' + thisForm.attr('data-error') + '</div>');
        thisForm.append('<div class="form-success" style="display: none;">' + thisForm.attr('data-success') + '</div>');
        formError = thisForm.find('.form-error');
        formSuccess = thisForm.find('.form-success');
        thisForm.addClass('attempted-submit');

        // Do this if there is an iframe, and it contains usable Mail Chimp / Campaign Monitor iframe embed code
        if ((iFrame.length) && (typeof iFrame.attr('srcdoc') !== "undefined") && (iFrame.attr('srcdoc') !== "")) {

            console.log('Mail list form signup detected.');
            if (typeof originalError !== typeof undefined && originalError !== false) {
                formError.html(originalError);
            }
            userEmail = jQuery(thisForm).find('.signup-email-field').val();
            userFullName = jQuery(thisForm).find('.signup-name-field').val();
            if (jQuery(thisForm).find('input.signup-first-name-field').length) {
                userFirstName = jQuery(thisForm).find('input.signup-first-name-field').val();
            } else {
                userFirstName = jQuery(thisForm).find('.signup-name-field').val();
            }
            userLastName = jQuery(thisForm).find('.signup-last-name-field').val();

            // validateFields returns 1 on error;
            if (validateFields(thisForm) !== 1) {
                preparedForm = prepareSignup(iFrame);

                preparedForm.find('#mce-EMAIL, #fieldEmail').val(userEmail);
                preparedForm.find('#mce-LNAME, #fieldLastName').val(userLastName);
                preparedForm.find('#mce-FNAME, #fieldFirstName').val(userFirstName);
                preparedForm.find('#mce-NAME, #fieldName').val(userFullName);
                thisForm.removeClass('attempted-submit');

                // Hide the error if one was shown
                formError.fadeOut(200);
                // Create a new loading spinner in the submit button.
                submitButton.html(jQuery('<div />').addClass('form-loading')).attr('disabled', 'disabled');
                
                try{
                    jQuery.ajax({
                        url: preparedForm.attr('action'),
                        crossDomain: true,
                        data: preparedForm.serialize(),
                        method: "GET",
                        cache: false,
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        success: function(data){
                            // Request was a success, what was the response?
                            if (data.result != "success" && data.Status != 200) {
                                
                                // Error from Mail Chimp or Campaign Monitor

                                // Keep the current error text in a data attribute on the form
                                formError.attr('original-error', formError.text());
                                // Show the error with the returned error text.
                                formError.html(data.msg).fadeIn(1000);
                                formSuccess.fadeOut(1000);

                                submitButton.html(submitButton.attr('data-text')).removeAttr('disabled');
                            } else {
                                
                                // Got Success from Mail Chimp
                                
                                submitButton.html(submitButton.attr('data-text')).removeAttr('disabled');

                                successRedirect = thisForm.attr('success-redirect');
                                // For some browsers, if empty `successRedirect` is undefined; for others,
                                // `successRedirect` is false.  Check for both.
                                if (typeof successRedirect !== typeof undefined && successRedirect !== false && successRedirect !== "") {
                                    window.location = successRedirect;
                                }

                                thisForm.find('input[type="text"]').val("");
                                thisForm.find('textarea').val("");
                                formSuccess.fadeIn(1000);

                                formError.fadeOut(1000);
                                setTimeout(function() {
                                    formSuccess.fadeOut(500);
                                }, 5000);
                            }
                        }
                    });
                }catch(err){
                    // Keep the current error text in a data attribute on the form
                    formError.attr('original-error', formError.text());
                    // Show the error with the returned error text.
                    formError.html(err.message).fadeIn(1000);
                    formSuccess.fadeOut(1000);
                    setTimeout(function() {
                        formError.fadeOut(500);
                    }, 5000);

                    submitButton.html(submitButton.attr('data-text')).removeAttr('disabled');
                }
            

                
            } else {
                formError.fadeIn(1000);
                setTimeout(function() {
                    formError.fadeOut(500);
                }, 5000);
            }
        } else {
            // If no iframe detected then this is treated as an email form instead.
            console.log('Send email form detected.');
            if (typeof originalError !== typeof undefined && originalError !== false) {
                formError.text(originalError);
            }

            error = validateFields(thisForm);

            if (error === 1) {
                formError.fadeIn(200);
                setTimeout(function() {
                    formError.fadeOut(500);
                }, 3000);
            } else {

                thisForm.removeClass('attempted-submit');

                // Hide the error if one was shown
                formError.fadeOut(200);
                
                // Create a new loading spinner in the submit button.
                submitButton.html(jQuery('<div />').addClass('form-loading')).attr('disabled', 'disabled');

                jQuery.ajax({
                    type: "POST",
                    url: "mail/mail.php",
                    data: thisForm.serialize()+"&url="+window.location.href,
                    success: function(response) {
                        // Swiftmailer always sends back a number representing numner of emails sent.
                        // If this is numeric (not Swift Mailer error text) AND greater than 0 then show success message.

                        submitButton.html(submitButton.attr('data-text')).removeAttr('disabled');

                        if (jQuery.isNumeric(response)) {
                            if (parseInt(response) > 0) {
                                // For some browsers, if empty 'successRedirect' is undefined; for others,
                                // 'successRedirect' is false.  Check for both.
                                successRedirect = thisForm.attr('success-redirect');
                                if (typeof successRedirect !== typeof undefined && successRedirect !== false && successRedirect !== "") {
                                    window.location = successRedirect;
                                }


                                thisForm.find('input[type="text"]').val("");
                                thisForm.find('textarea').val("");
                                thisForm.find('.form-success').fadeIn(1000);

                                formError.fadeOut(1000);
                                setTimeout(function() {
                                    formSuccess.fadeOut(500);
                                }, 5000);
                            }
                        }
                        // If error text was returned, put the text in the .form-error div and show it.
                        else {
                            // Keep the current error text in a data attribute on the form
                            formError.attr('original-error', formError.text());
                            // Show the error with the returned error text.
                            formError.text(response).fadeIn(1000);
                            formSuccess.fadeOut(1000);
                        }
                    },
                    error: function(errorObject, errorText, errorHTTP) {
                        // Keep the current error text in a data attribute on the form
                        formError.attr('original-error', formError.text());
                        // Show the error with the returned error text.
                        formError.text(errorHTTP).fadeIn(1000);
                        formSuccess.fadeOut(1000);
                        submitButton.html(submitButton.attr('data-text')).removeAttr('disabled');
                    }
                });
            }
        }
        return false;
    });

    jQuery('.validate-required, .validate-email').on('blur change', function() {
        validateFields(jQuery(this).closest('form'));
    });

    jQuery('form').each(function() {
        if (jQuery(this).find('.form-error').length) {
            jQuery(this).attr('original-error', jQuery(this).find('.form-error').text());
        }
    });

    function validateFields(form) {
            var name, error, originalErrorMessage;

            jQuery(form).find('.validate-required[type="checkbox"]').each(function() {
                if (!jQuery('[name="' + jQuery(this).attr('name') + '"]:checked').length) {
                    error = 1;
                    name = jQuery(this).attr('name').replace('[]', '');
                    form.find('.form-error').text('Please tick at least one ' + name + ' box.');
                }
            });

            jQuery(form).find('.validate-required').each(function() {
                if (jQuery(this).val() === '') {
                    jQuery(this).addClass('field-error');
                    error = 1;
                } else {
                    jQuery(this).removeClass('field-error');
                }
            });

            jQuery(form).find('.validate-email').each(function() {
                if (!(/(.+)@(.+){2,}\.(.+){2,}/.test(jQuery(this).val()))) {
                    jQuery(this).addClass('field-error');
                    error = 1;
                } else {
                    jQuery(this).removeClass('field-error');
                }
            });

            if (!form.find('.field-error').length) {
                form.find('.form-error').fadeOut(1000);
            }

            return error;
        }

    //
    //    
    // End contact form code
    //
    //


    // Get referrer from URL string 
    if (getURLParameter("ref")) {
        jQuery('form.form-email').append('<input type="text" name="referrer" class="hidden" value="' + getURLParameter("ref") + '"/>');
    }

    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|jQuery)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    }

    // Disable parallax on mobile

    if ((/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
        jQuery('section').removeClass('parallax');
    }
    
    // Disqus Comments
    
    if(jQuery('.disqus-comments').length){
		/* * * CONFIGURATION VARIABLES * * */
		var disqus_shortname = jQuery('.disqus-comments').attr('data-shortname');

		/* * * DON'T EDIT BELOW THIS LINE * * */
		(function() {
			var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
			dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
			(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
		})();
    }

    // Load Google MAP API JS with callback to initialise when fully loaded
    if(document.querySelector('[data-maps-api-key]') && !document.querySelector('.gMapsAPI')){
        if(jQuery('[data-maps-api-key]').length){
            var script = document.createElement('script');
            var apiKey = jQuery('[data-maps-api-key]:first').attr('data-maps-api-key');
            script.type = 'text/javascript';
            script.src = 'https://maps.googleapis.com/maps/api/js?key='+apiKey+'&callback=initializeMaps';
            script.className = 'gMapsAPI';
            document.body.appendChild(script);  
        } 
    }

}); 

jQuery(window).load(function() { 
    "use strict";

    // Initialize Masonry

    setTimeout(initializeMasonry, 1000);
   

    mr_firstSectionHeight = jQuery('.main-container section:nth-of-type(1)').outerHeight(true);


}); 
function updateNav() {

    var scrollY = mr_scrollTop;

    if (scrollY <= 0) {
        if (mr_navFixed) {
            mr_navFixed = false;
            mr_nav.removeClass('fixed');
        }
        if (mr_outOfSight) {
            mr_outOfSight = false;
            mr_nav.removeClass('outOfSight');
        }
        if (mr_navScrolled) {
            mr_navScrolled = false;
            mr_nav.removeClass('scrolled');
        }
        return;
    }

    if (scrollY > mr_navOuterHeight + mr_fixedAt) {
        if (!mr_navScrolled) {
            mr_nav.addClass('scrolled');
            mr_navScrolled = true;
            return;
        }
    } else {
        if (scrollY > mr_navOuterHeight) {
           if (!mr_navFixed) {
                mr_nav.addClass('fixed');
                mr_navFixed = true;
            }

            if (scrollY > mr_navOuterHeight +10) {
                if (!mr_outOfSight) {
                    mr_nav.addClass('outOfSight');
                    mr_outOfSight = true;
                }
            } else {
                if (mr_outOfSight) {
                    mr_outOfSight = false;
                    mr_nav.removeClass('outOfSight');
                }
            }
        } else {
            if (mr_navFixed) {
                mr_navFixed = false;
                mr_nav.removeClass('fixed');
            }
            if (mr_outOfSight) {
                mr_outOfSight = false;
                mr_nav.removeClass('outOfSight');
            }
        }

        if (mr_navScrolled) {
            mr_navScrolled = false;
            mr_nav.removeClass('scrolled');
        }

    }
}


function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function initializeMasonry(){
    jQuery('.masonry').each(function(){
        var container = jQuery(this).get(0);
        var msnry = new Masonry(container, {
            itemSelector: '.masonry-item'
        });

        msnry.on('layoutComplete', function() {

            mr_firstSectionHeight = jQuery('.main-container section:nth-of-type(1)').outerHeight(true);

            // Fix floating project filters to bottom of projects container

            if (jQuery('.filters.floating').length) {
                setupFloatingProjectFilters();
                updateFloatingFilters();
                window.addEventListener("scroll", updateFloatingFilters, false);
            }

            jQuery('.masonry').addClass('fadeIn');
            jQuery('.masonry-loader').addClass('fadeOut');
            if (jQuery('.masonryFlyIn').length) {
                masonryFlyIn();
            }
        });

        msnry.layout();
    });
}

function masonryFlyIn() {
    var jQueryitems = jQuery('.masonryFlyIn .masonry-item');
    var time = 0;

    jQueryitems.each(function() {
        var item = jQuery(this);
        setTimeout(function() {
            item.addClass('fadeIn');
        }, time);
        time += 170;
    });
}

function setupFloatingProjectFilters() {
    mr_floatingProjectSections = [];
    jQuery('.filters.floating').closest('section').each(function() {
        var section = jQuery(this);

        mr_floatingProjectSections.push({
            section: section.get(0),
            outerHeight: section.outerHeight(),
            elemTop: section.offset().top,
            elemBottom: section.offset().top + section.outerHeight(),
            filters: section.find('.filters.floating'),
            filersHeight: section.find('.filters.floating').outerHeight(true)
        });
    });
}

function updateFloatingFilters() {
    var l = mr_floatingProjectSections.length;
    while (l--) {
        var section = mr_floatingProjectSections[l];

        if ((section.elemTop < mr_scrollTop) && typeof window.mr_variant == "undefined" ) {
            section.filters.css({
                position: 'fixed',
                top: '16px',
                bottom: 'auto'
            });
            if (mr_navScrolled) {
                section.filters.css({
                    transform: 'translate3d(-50%,48px,0)'
                });
            }
            if (mr_scrollTop > (section.elemBottom - 70)) {
                section.filters.css({
                    position: 'absolute',
                    bottom: '16px',
                    top: 'auto'
                });
                section.filters.css({
                    transform: 'translate3d(-50%,0,0)'
                });
            }
        } else {
            section.filters.css({
                position: 'absolute',
                transform: 'translate3d(-50%,0,0)'
            });
        }
    }
}

window.initializeMaps = function(){
    if(typeof google !== "undefined"){
        if(typeof google.maps !== "undefined"){
            jQuery('.map-canvas[data-maps-api-key]').each(function(){
                    var mapInstance   = this,
                        mapJSON       = typeof jQuery(this).attr('data-map-style') !== "undefined" ? jQuery(this).attr('data-map-style'): false,
                        mapStyle      = JSON.parse(mapJSON) || [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}],
                        zoomLevel     = (typeof jQuery(this).attr('data-map-zoom') !== "undefined" && jQuery(this).attr('data-map-zoom') !== "") ? jQuery(this).attr('data-map-zoom') * 1: 17,
                        latlong       = typeof jQuery(this).attr('data-latlong') != "undefined" ? jQuery(this).attr('data-latlong') : false,
                        latitude      = latlong ? 1 *latlong.substr(0, latlong.indexOf(',')) : false,
                        longitude     = latlong ? 1 * latlong.substr(latlong.indexOf(",") + 1) : false,
                        geocoder      = new google.maps.Geocoder(),
                        address       = typeof jQuery(this).attr('data-address') !== "undefined" ? jQuery(this).attr('data-address').split(';'): [""],
                        markerTitle   = "We Are Here",
                        isDraggable = jQuery(document).width() > 766 ? true : false,
                        map, marker, markerImage,
                        mapOptions = {
                            draggable: isDraggable,
                            scrollwheel: false,
                            zoom: zoomLevel,
                            disableDefaultUI: true,
                            styles: mapStyle
                        };

                    if(jQuery(this).attr('data-marker-title') != undefined && jQuery(this).attr('data-marker-title') != "" )
                    {
                        markerTitle = jQuery(this).attr('data-marker-title');
                    }

                    if(address != undefined && address[0] != ""){
                            geocoder.geocode( { 'address': address[0].replace('[nomarker]','')}, function(results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                var map = new google.maps.Map(mapInstance, mapOptions); 
                                map.setCenter(results[0].geometry.location);
                                
                                address.forEach(function(address){
                                    var markerGeoCoder;
                                    
                                    markerImage = {url: window.mr_variant == undefined ? 'img/mapmarker.png' : '../img/mapmarker.png', size: new google.maps.Size(50,50), scaledSize: new google.maps.Size(50,50)};
                                    if(/(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)/.test(address) ){
                                        var latlong = address.split(','),
                                        marker = new google.maps.Marker({
                                                        position: { lat: 1*latlong[0], lng: 1*latlong[1] },
                                                        map: map,
                                                        icon: markerImage,
                                                        title: markerTitle,
                                                        optimised: false
                                                    });
                                    }
                                    else if(address.indexOf('[nomarker]') < 0){
                                        markerGeoCoder = new google.maps.Geocoder();
                                        markerGeoCoder.geocode( { 'address': address.replace('[nomarker]','')}, function(results, status) {
                                            if (status == google.maps.GeocoderStatus.OK) {
                                                marker = new google.maps.Marker({
                                                    map: map,
                                                    icon: markerImage,
                                                    title: markerTitle,
                                                    position: results[0].geometry.location,
                                                    optimised: false
                                                });
                                            }
                                        });
                                    }

                                });
                            } else {
                                console.log('There was a problem geocoding the address.');
                            }
                        });
                    }
                    else if(latitude != undefined && latitude != "" && latitude != false && longitude != undefined && longitude != "" && longitude != false ){
                        mapOptions.center   = { lat: latitude, lng: longitude};
                        map = new google.maps.Map(mapInstance, mapOptions); 
                        marker              = new google.maps.Marker({
                                                    position: { lat: latitude, lng: longitude },
                                                    map: map,
                                                    icon: markerImage,
                                                    title: markerTitle
                                                });

                    }

                }); 
        }
    }
}
initializeMaps();

// End of Maps




// Prepare Signup Form - It is used to retrieve form details from an iframe Mail Chimp or Campaign Monitor form.

function prepareSignup(iFrame){
    var form   = jQuery('<form />'),
        div    = jQuery('<div />'),
        action;

    jQuery(div).html(iFrame.attr('srcdoc'));
    action = jQuery(div).find('form').attr('action');



    // Alter action for a Mail Chimp-compatible ajax request url.
    if(/list-manage\.com/.test(action)){
       action = action.replace('/post?', '/post-json?') + "&c=?";
       if(action.substr(0,2) == "//"){
           action = 'http:' + action;
       }
    }

    // Alter action for a Campaign Monitor-compatible ajax request url.
    if(/createsend\.com/.test(action)){
       action = action + '?callback=?';
    }


    // Set action on the form
    form.attr('action', action);

    // Clone form input fields from 
    jQuery(div).find('input, select, textarea').not('input[type="submit"]').each(function(){
        jQuery(this).clone().appendTo(form);

    });

    return form;
        

}



/*\
|*|  COOKIE LIBRARY THANKS TO MDN
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|
|*|  Revision #1 - September 4, 2014
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
|*|  https://developer.mozilla.org/User:fusionchess
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * mr_cookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * mr_cookies.getItem(name)
|*|  * mr_cookies.removeItem(name[, path[, domain]])
|*|  * mr_cookies.hasItem(name)
|*|  * mr_cookies.keys()
|*|
\*/

var mr_cookies = {
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\jQuery&") + "\\s*\\=\\s*([^;]*).*jQuery)|^.*jQuery"), "jQuery1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)jQuery/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\jQuery&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|jQuery)|^\s*|\s*(?:\=[^;]*)?(?:\1|jQuery)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

/*\
|*|  END COOKIE LIBRARY
\*/


