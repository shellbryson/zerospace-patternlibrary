// simple module to wrap jQuery and provide it without global namespace
define(['assets/scripts/libs/jquery/dist/jquery'], function (jQuery) {
    return jQuery.noConflict(true);
});
