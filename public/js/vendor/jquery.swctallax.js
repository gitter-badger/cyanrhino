/*

jQuery SWCTALLAX v0.5.1

This plugin was built by Mike Huebner (mikehuebner.com) @mikehuebner_ for the students of the Southwest CTA Web Design Program or anyone who needs it.
USES {
    The plugin has few uses already, made for backgrounds or objects. This plugin, with the backgrounds, will fill the screen with the background you want.
    Making it so that you can pick if you want to modify a single object, or a whole background to a section.
    Like such:
    <section class="backgroundthingy swctallax">
    </section>
    If you use 
    $('.swctallax').swctallax({
        jump: whatever (0 to 1)
    });
    It will do a whole background but if you do an object like
    <section class="backgroundthingy swctallax">
        <div class="banana"></div>
    </section>
    $('.banana').swctallax({
        jump: 0.348,
        background: "off"
    });
    It will move that single object in a parallax motion.
    It is a bit laggy on phones, but I will figure out a better way to use it that isn't jQuery but HTML5 / CSS3. Which will smooth out the movements.
}
Open Liscense, I don't care who uses it. Just give credit where credit is due!
Need to work on:
    • Browser differences
    • jQuery for IE only
    • Weak CPU Computers
*/
;
(function($) {
    // If you don't like the name SWCTALLAX, change it here in the var sets and at the defaults near the bottom.
    $.fn.swctallax = function(options) {
        // Change the name here too if needed.
        var sets = $.extend({}, $.fn.swctallax.defaults, options);
        // Setting up basic each function
        return this.each(function() {
            // For some reason, only worked if I converted $(this) to $this. Something with OOP I think.
            var $this = $(this);
            // Get the current background position of the item.
            var mainPosition = ($this.css('background-position') || '').split(' ');
            // Get the X
            var mainX = $this.css('background-position-x') || mainPosition[0];
            // Get the Y
            var mainY = $this.css('background-position-y') || mainPosition[1];
            // Set the background so that way it fills without moving, yet.
            $this.css({
                "background-attachment": "fixed"
            });
            // Cover background CSS3
            if (sets.background == "on") {
                $this.css({
                    "z-index": "-1",
                    "-webkit-background-size": "contain",
                    "-moz-background-size": "contain",
                    "-o-background-size": "contain",
                    "background-size": "contain",
                });
            }
            // Fullscreen backgrounds
            if (sets.background == "on" && sets.full == true) {
                var w = window.innerWidth;
                var h = window.innerHeight;
                $this.css({
                    "width": w,
                    "height": h
                });
                $(window).resize(function() {
                    w = window.innerWidth;
                    h = window.innerHeight;
                    $this.css({
                        'height': h,
                        'width': w
                    });
                });
            }
            // Check if it is inview, using the jquery.inview.js plugin.
            $this.bind('inview', function(event, visible) {
                if (visible)
                    $this.addClass('visible');
                else
                    $this.removeClass('visible');
            });
            // On scroll, move the image according to background position.
            $(window).bind('scroll', function() {
                var fromTop = -($(window).scrollTop());
                var xMove = mainX;
                var yMove = (fromTop * sets.jump) + "px";
                $this.css("background-position", xMove + " " + yMove);
                // I want to use CSS3 transforms to modify this instead of jQuery.
                // $this.css("-webkit-transform", "translate3d(0px, " + yMove + "px," + " 0px)");
            });
        });
    };
    // Change the name here too
    $.fn.swctallax.defaults = {
        startPoint: 0, // starting point of document
        endPoint: $(document).height(), // height of the document
        jump: 1, // any number between 0 and 1
        background: "on", // optional "off"
        full: true //fullscreen or not
    };
})(jQuery);
