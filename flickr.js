/*!
 * William DURAND <william.durand1@gmail.com>
 * MIT Licensed
 *
 * GistID: 5705453
 *
 */
(function (document, jQuery) {
    "use strict";

    var flickrPhotoStream = function (jQueryel, options) {
        var url = [
            'http://api.flickr.com/services/feeds/photoset.gne?nsid=',
            options.id,
            '&set=',
            options.setId,
            '&format=json&jsoncallback=?'
        ].join('');

        return jQuery.getJSON(url).done(function (data) {
            jQuery.each(data.items, function (index, item) {
                var link = item.media.m.replace('_m', '_b');

                jQuery("<img />")
                    .attr("src", item.media.m)
                    .appendTo(jQueryel)
                    .wrap(options.container || '')
                    .wrap([
                        '<a data-lightbox="true" href="',
                        link,
                        options.cssClass ? '" class="' + options.cssClass : '',
                        '" title="',
                        item.title,
                        '"></a>'
                    ].join(''));
            });
        });
    };

    jQuery.fn.flickrPhotoStream = function (options) {
        return flickrPhotoStream(jQuery(this).get(), options || {});
    };
})(document, jQuery);
