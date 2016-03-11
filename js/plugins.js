// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

var UTILS = (function () {

    return {

        /**
         * Add an event hadler to an element
         * 
         * @param {EventTarget} elem
         *          element that the handler will listen to
         * @param {String} type
         *          the type of the event the halder will listen to
         * @param {function} hadler
         *          the handler that should be notify when the event occurs
         */
        addEvent: function (elem, type, handler) {
            if (elem.addEventListener) {
                elem.addEventListener(type, handler, false);
            } else if (elem.attachEvent) {
                elem.attachEvent("on" + type, handler);
            } else {
                elem["on" + type] = handler;
            }
        },

        /**
         * Remove an event hadler of an element
         * 
         * @param {EventTarget} elem
         *          element that the handler is listening to
         * @param {String} type
         *          the type of the event the halder is listening to
         * @param {function} hadler
         *          the handler that is listening to the element
         */
        removeEvent: function (elem, type, hadler) {
            if (elem.removeEventListener) {
                elem.removeEventListener(eventType, handler, false);
            } else if (elem.detachEvent) {
                elem.detachEvent("on" + eventType, handler);
            } else {
                elem["on" + type] = null;
            }
        }

    };
});
