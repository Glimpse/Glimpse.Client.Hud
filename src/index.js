'use strict';

// DEV TIME CODE
if (FAKE_SERVER) {
    require('fake');
}
// DEV TIME CODE

require('./index.scss');

var $ = require('$jquery');
var util = require('lib/util');
var state = require('./state');
var repository = require('./repository');
var sections = require('./sections/section');

//var details = args.newData.hud;
var setup = state.current();

// get into dom asap to trigger asset loading
function renderHolder() {
    if (document.readyState === 'complete') {
        var url = util.resolveClientUrl(util.currentRequestId(), true);
        var html = '<div class="glimpse"><a class="glimpse-icon" target="_glimpse" href="' + url + '"><div class="glimpse-icon-text">Glimpse</div></a><div class="glimpse-hud"></div></div>'
        var body = $('body');
        var htmlElement
        $(html).appendTo('body');
    }
}
$(renderHolder);

// only load things when we have the data ready to go
repository.getData(function (details) {
    $(function () {

        // set a timeout to render the hud. We'll do exponential backoff on the timer until the document is ready.
        var timeout = 1;

        var onTimeout = function () {
            if (document.readyState === 'complete') {
                // if things were rendered but was overridden
                if (!$('.glimpse').length) {
                    renderHolder();
                }

                // generate the html needed for the sections
                var html = sections.render(details, setup);

                // insert the html into the dom
                var holder = $(html).appendTo('.glimpse-hud');

                // force the correct state from previous load
                state.setup(holder);

                // setup events that we need to listen to
                sections.postRender(holder, details);
            }
            else {
                timeout = timeout * 2;
                setTimeout(onTimeout, timeout);
            }
        }

        setTimeout(onTimeout, 0);
    });
});