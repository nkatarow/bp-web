/*

    FILE: app.main.js
    DESCRIPTION: Basic App functions and config
    AUTHOR(S): Nick Katarow

    DEPENDENCIES:
    - jQuery 1.9.1

    TO DO:

*/
var BP = window.BP || {};

$(document).ready(function(){
    BP.init();
});

window.BP = {
	init: function() {
		var self = this,
			ua = window.navigator.userAgent,
			msie = ua.indexOf("MSIE ");

		// Since new IE versions don't even accept conditional comment, we have to sniff if it's IE via JS
		if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
			$('body').append('<link rel="stylesheet" href="/_ui/css/IE.css" media="all">');
            $('html').addClass('ie');
        }

        self.events.parent = this;

        // Init Components
        self.nav.init();

		window.sr = ScrollReveal({ reset: true });
		sr.reveal('.reveal');

	},
    events: {
        windowResize: function (event) {
            var self = this.parent,
                i,
                ii;

            if (event.width >= 1056 && self.nav.isMobile) {
                self.nav.mobileOff();
            } else if (event.width < 1056 && !self.nav.isMobile) {
                self.nav.mobileOn();
            }
        }
    },
    getMediaWidth: function () {
        var self = this,
            width;

        if (typeof matchMedia !== 'undefined') {
            width = self.bruteForceMediaWidth();
        } else {
            width = window.innerWidth || document.documentElement.clientWidth;
        }

        return width;
    },
    bruteForceMediaWidth: function () {
        var i = 0,
            found = false;

        while (!found) {
            if (matchMedia('(width: ' + i + 'px)').matches) {
                found = true;
            } else {
                i++;
            }

            // Prevent infinite loop if something goes horribly wrong
            if (i === 9999) {
                break;
            }
        }

        return i;
    }
};

/*

	Slinky
	A light-weight, responsive, mobile-like navigation menu plugin for jQuery
	Built by Ali Zahid
	Published under the MIT license

*/

;(function($) {
	$.fn.slinky = function(options) {
		// Setup plugin defaults

		var settings = $.extend({
			label: 'Back',
			title: false,
			speed: 300,
			resize: true
		}, options);

		// Convenience method for navigation animation

		var move = function(menu, next, callback) {
			var left = Math.round(parseInt(menu.get(0).style.left)) || 0;

			// Use multiples of 100% for responsive animation

			menu.css('left', -Math.abs(next ? left - 100 : left + 100) + '%');

			// Callback after animation is finished

			if (typeof callback === 'function') {
				setTimeout(callback, settings.speed);
			}
		};

		// Convenience method for resizing menu

		var resize = function(menu, content) {
			menu.height(content.outerHeight());
		};

		return this.each(function() {
			// The root node is where animation happens

			var menu = $(this),
				root = menu.children().first();

			// Set CSS animation duration

			menu.css('transition-duration', settings.speed + 'ms');
			root.css('transition-duration', settings.speed + 'ms');

			// Add .next class to links with sub menus

			$('a + ul', menu).prev().addClass('next');

			// Add header for back button and title

			$('li > ul', menu).prepend('<li class="header">');
			//$('li > ul', menu).append('<li class="footer">');



			// Add back links with appropriate labels

			if (!settings.title && settings.label === true) {
				// Create a link with label from parent

				$('li > ul', menu).each(function() {
					var label = $(this).parent().find('a').first().text(),
						backLink = $('<a>').text(label).prop('href', '#').addClass('back');

					$('> .header', this).append(backLink);
					// $('> .footer', this).append(backLink);
				});
			} else {
				// Create a link with the label from settings

				var label = $(this).parent().find('a').first().text(),
					backLink = $('<a>').text(settings.label).prop('href', '#').addClass('back');

				// $('.footer', menu).append(backLink);
				$('.header', menu).append(backLink);
			}


			// Add title

			// if (settings.title === true) {
			// 	// Create a label with title from the parent
			//
			// 	$('li > ul', menu).each(function() {
			// 		var label = $(this).parent().find('a').first().text(),
			// 			title = $('<h2>').text(label);
			//
			// 		$('> .header', this).append(title);
			// 	});
			// }

			// Setup navigation

			$('a', menu).on('click', function(e) {
				var a = $(this);

				// Disable navigation if link has hash
				// else proceed to URL

				if (/#/.test(this.href)) {
					e.preventDefault();
				}

				// Animate forward or backward
				// Resize menu height to match content, if required

				if (a.hasClass('next')) {
					a.next().show();

					move(root, true);

					if (settings.resize) {
						resize(menu, a.next());
					}
				} else if (a.hasClass('back')) {
					move(root, false, function() {
						a.parent().parent().hide();
					});

					if (settings.resize) {
						resize(menu, a.parent().parent().parents('ul'));
					}
				}
			});
		});

		return this;
	};
}(jQuery));

/////    /////    /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
/////             /////    /////
/////             /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
         /////    /////
         /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
/////    /////    /////    /////

/**
 * ScrollReveal
 * ------------
 * Version : 3.3.1
 * Website : scrollrevealjs.org
 * Repo    : github.com/jlmakes/scrollreveal.js
 * Author  : Julian Lloyd (@jlmakes)
 */

;(function () {
  'use strict'

  var sr
  var _requestAnimationFrame

  function ScrollReveal (config) {
    // Support instantiation without the `new` keyword.
    if (typeof this === 'undefined' || Object.getPrototypeOf(this) !== ScrollReveal.prototype) {
      return new ScrollReveal(config)
    }

    sr = this // Save reference to instance.
    sr.version = '3.3.1'
    sr.tools = new Tools() // *required utilities

    if (sr.isSupported()) {
      sr.tools.extend(sr.defaults, config || {})

      _resolveContainer(sr.defaults)

      sr.store = {
        elements: {},
        containers: []
      }

      sr.sequences = {}
      sr.history = []
      sr.uid = 0
      sr.initialized = false
    } else if (typeof console !== 'undefined' && console !== null) {
      // Note: IE9 only supports console if devtools are open.
      console.log('ScrollReveal is not supported in this browser.')
    }

    return sr
  }

  /**
   * Configuration
   * -------------
   * This object signature can be passed directly to the ScrollReveal constructor,
   * or as the second argument of the `reveal()` method.
   */

  ScrollReveal.prototype.defaults = {
    // 'bottom', 'left', 'top', 'right'
    origin: 'bottom',

    // Can be any valid CSS distance, e.g. '5rem', '10%', '20vw', etc.
    distance: '20px',

    // Time in milliseconds.
    duration: 500,
    delay: 0,

    // Starting angles in degrees, will transition from these values to 0 in all axes.
    rotate: { x: 0, y: 0, z: 0 },

    // Starting opacity value, before transitioning to the computed opacity.
    opacity: 0,

    // Starting scale value, will transition from this value to 1
    scale: 0.9,

    // Accepts any valid CSS easing, e.g. 'ease', 'ease-in-out', 'linear', etc.
    easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)',

    // `<html>` is the default reveal container. You can pass either:
    // DOM Node, e.g. document.querySelector('.fooContainer')
    // Selector, e.g. '.fooContainer'
    container: window.document.documentElement,

    // true/false to control reveal animations on mobile.
    mobile: true,

    // true:  reveals occur every time elements become visible
    // false: reveals occur once as elements become visible
    reset: false,

    // 'always' — delay for all reveal animations
    // 'once'   — delay only the first time reveals occur
    // 'onload' - delay only for animations triggered by first load
    useDelay: 'always',

    // Change when an element is considered in the viewport. The default value
    // of 0.20 means 20% of an element must be visible for its reveal to occur.
    viewFactor: 0.2,

    // Pixel values that alter the container boundaries.
    // e.g. Set `{ top: 48 }`, if you have a 48px tall fixed toolbar.
    // --
    // Visual Aid: https://scrollrevealjs.org/assets/viewoffset.png
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },

    // Callbacks that fire for each completed element reveal, and if
    // `config.reset = true`, for each completed element reset. When creating your
    // callbacks, remember they are passed the element’s DOM node that triggered
    // it as the first argument.
    beforeReveal: function (domEl) {},
    afterReveal: function (domEl) {},
    beforeReset: function (domEl) {},
    afterReset: function (domEl) {}
  }

  /**
   * Check if client supports CSS Transform and CSS Transition.
   * @return {boolean}
   */
  ScrollReveal.prototype.isSupported = function () {
    var style = document.documentElement.style
    return 'WebkitTransition' in style && 'WebkitTransform' in style ||
      'transition' in style && 'transform' in style
  }

  /**
   * Creates a reveal set, a group of elements that will animate when they
   * become visible. If [interval] is provided, a new sequence is created
   * that will ensure elements reveal in the order they appear in the DOM.
   *
   * @param {Node|NodeList|string} [target]   The node, node list or selector to use for animation.
   * @param {Object}               [config]   Override the defaults for this reveal set.
   * @param {number}               [interval] Time between sequenced element animations (milliseconds).
   * @param {boolean}              [sync]     Used internally when updating reveals for async content.
   *
   * @return {Object} The current ScrollReveal instance.
   */
  ScrollReveal.prototype.reveal = function (target, config, interval, sync) {
    var container
    var elements
    var elem
    var elemId
    var sequence
    var sequenceId

    // No custom configuration was passed, but a sequence interval instead.
    // let’s shuffle things around to make sure everything works.
    if (config !== undefined && typeof config === 'number') {
      interval = config
      config = {}
    } else if (config === undefined || config === null) {
      config = {}
    }

    container = _resolveContainer(config)
    elements = _getRevealElements(target, container)

    if (!elements.length) {
      console.log('ScrollReveal: reveal on "' + target + '" failed, no elements found.')
      return sr
    }

    // Prepare a new sequence if an interval is passed.
    if (interval && typeof interval === 'number') {
      sequenceId = _nextUid()

      sequence = sr.sequences[sequenceId] = {
        id: sequenceId,
        interval: interval,
        elemIds: [],
        active: false
      }
    }

    // Begin main loop to configure ScrollReveal elements.
    for (var i = 0; i < elements.length; i++) {
      // Check if the element has already been configured and grab it from the store.
      elemId = elements[i].getAttribute('data-sr-id')
      if (elemId) {
        elem = sr.store.elements[elemId]
      } else {
        // Otherwise, let’s do some basic setup.
        elem = {
          id: _nextUid(),
          domEl: elements[i],
          seen: false,
          revealing: false
        }
        elem.domEl.setAttribute('data-sr-id', elem.id)
      }

      // Sequence only setup
      if (sequence) {
        elem.sequence = {
          id: sequence.id,
          index: sequence.elemIds.length
        }

        sequence.elemIds.push(elem.id)
      }

      // New or existing element, it’s time to update its configuration, styles,
      // and send the updates to our store.
      _configure(elem, config, container)
      _style(elem)
      _updateStore(elem)

      // We need to make sure elements are set to visibility: visible, even when
      // on mobile and `config.mobile === false`, or if unsupported.
      if (sr.tools.isMobile() && !elem.config.mobile || !sr.isSupported()) {
        elem.domEl.setAttribute('style', elem.styles.inline)
        elem.disabled = true
      } else if (!elem.revealing) {
        // Otherwise, proceed normally.
        elem.domEl.setAttribute('style',
          elem.styles.inline +
          elem.styles.transform.initial
        )
      }
    }

    // Each `reveal()` is recorded so that when calling `sync()` while working
    // with asynchronously loaded content, it can re-trace your steps but with
    // all your new elements now in the DOM.

    // Since `reveal()` is called internally by `sync()`, we don’t want to
    // record or intiialize each reveal during syncing.
    if (!sync && sr.isSupported()) {
      _record(target, config, interval)

      // We push initialization to the event queue using setTimeout, so that we can
      // give ScrollReveal room to process all reveal calls before putting things into motion.
      // --
      // Philip Roberts - What the heck is the event loop anyway? (JSConf EU 2014)
      // https://www.youtube.com/watch?v=8aGhZQkoFbQ
      if (sr.initTimeout) {
        window.clearTimeout(sr.initTimeout)
      }
      sr.initTimeout = window.setTimeout(_init, 0)
    }

    return sr
  }

  /**
   * Re-runs `reveal()` for each record stored in history, effectively capturing
   * any content loaded asynchronously that matches existing reveal set targets.
   * @return {Object} The current ScrollReveal instance.
   */
  ScrollReveal.prototype.sync = function () {
    if (sr.history.length && sr.isSupported()) {
      for (var i = 0; i < sr.history.length; i++) {
        var record = sr.history[i]
        sr.reveal(record.target, record.config, record.interval, true)
      }
      _init()
    } else {
      console.log('ScrollReveal: sync failed, no reveals found.')
    }
    return sr
  }

  /**
   * Private Methods
   * ---------------
   */

  function _resolveContainer (config) {
    if (config && config.container) {
      if (typeof config.container === 'string') {
        return window.document.documentElement.querySelector(config.container)
      } else if (sr.tools.isNode(config.container)) {
        return config.container
      } else {
        console.log('ScrollReveal: invalid container "' + config.container + '" provided.')
        console.log('ScrollReveal: falling back to default container.')
      }
    }
    return sr.defaults.container
  }

  /**
   * check to see if a node or node list was passed in as the target,
   * otherwise query the container using target as a selector.
   *
   * @param {Node|NodeList|string} [target]    client input for reveal target.
   * @param {Node}                 [container] parent element for selector queries.
   *
   * @return {array} elements to be revealed.
   */
  function _getRevealElements (target, container) {
    if (typeof target === 'string') {
      return Array.prototype.slice.call(container.querySelectorAll(target))
    } else if (sr.tools.isNode(target)) {
      return [target]
    } else if (sr.tools.isNodeList(target)) {
      return Array.prototype.slice.call(target)
    }
    return []
  }

  /**
   * A consistent way of creating unique IDs.
   * @returns {number}
   */
  function _nextUid () {
    return ++sr.uid
  }

  function _configure (elem, config, container) {
    // If a container was passed as a part of the config object,
    // let’s overwrite it with the resolved container passed in.
    if (config.container) config.container = container
    // If the element hasn’t already been configured, let’s use a clone of the
    // defaults extended by the configuration passed as the second argument.
    if (!elem.config) {
      elem.config = sr.tools.extendClone(sr.defaults, config)
    } else {
      // Otherwise, let’s use a clone of the existing element configuration extended
      // by the configuration passed as the second argument.
      elem.config = sr.tools.extendClone(elem.config, config)
    }

    // Infer CSS Transform axis from origin string.
    if (elem.config.origin === 'top' || elem.config.origin === 'bottom') {
      elem.config.axis = 'Y'
    } else {
      elem.config.axis = 'X'
    }
  }

  function _style (elem) {
    var computed = window.getComputedStyle(elem.domEl)

    if (!elem.styles) {
      elem.styles = {
        transition: {},
        transform: {},
        computed: {}
      }

      // Capture any existing inline styles, and add our visibility override.
      // --
      // See section 4.2. in the Documentation:
      // https://github.com/jlmakes/scrollreveal.js#42-improve-user-experience
      elem.styles.inline = elem.domEl.getAttribute('style') || ''
      elem.styles.inline += '; visibility: visible; '

      // grab the elements existing opacity.
      elem.styles.computed.opacity = computed.opacity

      // grab the elements existing transitions.
      if (!computed.transition || computed.transition === 'all 0s ease 0s') {
        elem.styles.computed.transition = ''
      } else {
        elem.styles.computed.transition = computed.transition + ', '
      }
    }

    // Create transition styles
    elem.styles.transition.instant = _generateTransition(elem, 0)
    elem.styles.transition.delayed = _generateTransition(elem, elem.config.delay)

    // Generate transform styles, first with the webkit prefix.
    elem.styles.transform.initial = ' -webkit-transform:'
    elem.styles.transform.target = ' -webkit-transform:'
    _generateTransform(elem)

    // And again without any prefix.
    elem.styles.transform.initial += 'transform:'
    elem.styles.transform.target += 'transform:'
    _generateTransform(elem)
  }

  function _generateTransition (elem, delay) {
    var config = elem.config

    return '-webkit-transition: ' + elem.styles.computed.transition +
      '-webkit-transform ' + config.duration / 1000 + 's ' +
      config.easing + ' ' +
      delay / 1000 + 's, opacity ' +
      config.duration / 1000 + 's ' +
      config.easing + ' ' +
      delay / 1000 + 's; ' +

      'transition: ' + elem.styles.computed.transition +
      'transform ' + config.duration / 1000 + 's ' +
      config.easing + ' ' +
      delay / 1000 + 's, opacity ' +
      config.duration / 1000 + 's ' +
      config.easing + ' ' +
      delay / 1000 + 's; '
  }

  function _generateTransform (elem) {
    var config = elem.config
    var cssDistance
    var transform = elem.styles.transform

    // Let’s make sure our our pixel distances are negative for top and left.
    // e.g. origin = 'top' and distance = '25px' starts at `top: -25px` in CSS.
    if (config.origin === 'top' || config.origin === 'left') {
      cssDistance = /^-/.test(config.distance)
        ? config.distance.substr(1)
        : '-' + config.distance
    } else {
      cssDistance = config.distance
    }

    if (parseInt(config.distance)) {
      transform.initial += ' translate' + config.axis + '(' + cssDistance + ')'
      transform.target += ' translate' + config.axis + '(0)'
    }
    if (config.scale) {
      transform.initial += ' scale(' + config.scale + ')'
      transform.target += ' scale(1)'
    }
    if (config.rotate.x) {
      transform.initial += ' rotateX(' + config.rotate.x + 'deg)'
      transform.target += ' rotateX(0)'
    }
    if (config.rotate.y) {
      transform.initial += ' rotateY(' + config.rotate.y + 'deg)'
      transform.target += ' rotateY(0)'
    }
    if (config.rotate.z) {
      transform.initial += ' rotateZ(' + config.rotate.z + 'deg)'
      transform.target += ' rotateZ(0)'
    }
    transform.initial += '; opacity: ' + config.opacity + ';'
    transform.target += '; opacity: ' + elem.styles.computed.opacity + ';'
  }

  function _updateStore (elem) {
    var container = elem.config.container

    // If this element’s container isn’t already in the store, let’s add it.
    if (container && sr.store.containers.indexOf(container) === -1) {
      sr.store.containers.push(elem.config.container)
    }

    // Update the element stored with our new element.
    sr.store.elements[elem.id] = elem
  }

  function _record (target, config, interval) {
    // Save the `reveal()` arguments that triggered this `_record()` call, so we
    // can re-trace our steps when calling the `sync()` method.
    var record = {
      target: target,
      config: config,
      interval: interval
    }
    sr.history.push(record)
  }

  function _init () {
    if (sr.isSupported()) {
      // Initial animate call triggers valid reveal animations on first load.
      // Subsequent animate calls are made inside the event handler.
      _animate()

      // Then we loop through all container nodes in the store and bind event
      // listeners to each.
      for (var i = 0; i < sr.store.containers.length; i++) {
        sr.store.containers[i].addEventListener('scroll', _handler)
        sr.store.containers[i].addEventListener('resize', _handler)
      }

      // Let’s also do a one-time binding of window event listeners.
      if (!sr.initialized) {
        window.addEventListener('scroll', _handler)
        window.addEventListener('resize', _handler)
        sr.initialized = true
      }
    }
    return sr
  }

  function _handler () {
    _requestAnimationFrame(_animate)
  }

  function _setActiveSequences () {
    var active
    var elem
    var elemId
    var sequence

    // Loop through all sequences
    sr.tools.forOwn(sr.sequences, function (sequenceId) {
      sequence = sr.sequences[sequenceId]
      active = false

      // For each sequenced elemenet, let’s check visibility and if
      // any are visible, set it’s sequence to active.
      for (var i = 0; i < sequence.elemIds.length; i++) {
        elemId = sequence.elemIds[i]
        elem = sr.store.elements[elemId]
        if (_isElemVisible(elem) && !active) {
          active = true
        }
      }

      sequence.active = active
    })
  }

  function _animate () {
    var delayed
    var elem

    _setActiveSequences()

    // Loop through all elements in the store
    sr.tools.forOwn(sr.store.elements, function (elemId) {
      elem = sr.store.elements[elemId]
      delayed = _shouldUseDelay(elem)

      // Let’s see if we should revealand if so,
      // trigger the `beforeReveal` callback and
      // determine whether or not to use delay.
      if (_shouldReveal(elem)) {
        elem.config.beforeReveal(elem.domEl)
        if (delayed) {
          elem.domEl.setAttribute('style',
            elem.styles.inline +
            elem.styles.transform.target +
            elem.styles.transition.delayed
          )
        } else {
          elem.domEl.setAttribute('style',
            elem.styles.inline +
            elem.styles.transform.target +
            elem.styles.transition.instant
          )
        }

        // Let’s queue the `afterReveal` callback
        // and mark the element as seen and revealing.
        _queueCallback('reveal', elem, delayed)
        elem.revealing = true
        elem.seen = true

        if (elem.sequence) {
          _queueNextInSequence(elem, delayed)
        }
      } else if (_shouldReset(elem)) {
        //Otherwise reset our element and
        // trigger the `beforeReset` callback.
        elem.config.beforeReset(elem.domEl)
        elem.domEl.setAttribute('style',
          elem.styles.inline +
          elem.styles.transform.initial +
          elem.styles.transition.instant
        )
        // And queue the `afterReset` callback.
        _queueCallback('reset', elem)
        elem.revealing = false
      }
    })
  }

  function _queueNextInSequence (elem, delayed) {
    var elapsed = 0
    var delay = 0
    var sequence = sr.sequences[elem.sequence.id]

    // We’re processing a sequenced element, so let's block other elements in this sequence.
    sequence.blocked = true

    // Since we’re triggering animations a part of a sequence after animations on first load,
    // we need to check for that condition and explicitly add the delay to our timer.
    if (delayed && elem.config.useDelay === 'onload') {
      delay = elem.config.delay
    }

    // If a sequence timer is already running, capture the elapsed time and clear it.
    if (elem.sequence.timer) {
      elapsed = Math.abs(elem.sequence.timer.started - new Date())
      window.clearTimeout(elem.sequence.timer)
    }

    // Start a new timer.
    elem.sequence.timer = { started: new Date() }
    elem.sequence.timer.clock = window.setTimeout(function () {
      // Sequence interval has passed, so unblock the sequence and re-run the handler.
      sequence.blocked = false
      elem.sequence.timer = null
      _handler()
    }, Math.abs(sequence.interval) + delay - elapsed)
  }

  function _queueCallback (type, elem, delayed) {
    var elapsed = 0
    var duration = 0
    var callback = 'after'

    // Check which callback we’re working with.
    switch (type) {
      case 'reveal':
        duration = elem.config.duration
        if (delayed) {
          duration += elem.config.delay
        }
        callback += 'Reveal'
        break

      case 'reset':
        duration = elem.config.duration
        callback += 'Reset'
        break
    }

    // If a timer is already running, capture the elapsed time and clear it.
    if (elem.timer) {
      elapsed = Math.abs(elem.timer.started - new Date())
      window.clearTimeout(elem.timer.clock)
    }

    // Start a new timer.
    elem.timer = { started: new Date() }
    elem.timer.clock = window.setTimeout(function () {
      // The timer completed, so let’s fire the callback and null the timer.
      elem.config[callback](elem.domEl)
      elem.timer = null
    }, duration - elapsed)
  }

  function _shouldReveal (elem) {
    if (elem.sequence) {
      var sequence = sr.sequences[elem.sequence.id]
      return sequence.active &&
        !sequence.blocked &&
        !elem.revealing &&
        !elem.disabled
    }
    return _isElemVisible(elem) &&
      !elem.revealing &&
      !elem.disabled
  }

  function _shouldUseDelay (elem) {
    var config = elem.config.useDelay
    return config === 'always' ||
      (config === 'onload' && !sr.initialized) ||
      (config === 'once' && !elem.seen)
  }

  function _shouldReset (elem) {
    if (elem.sequence) {
      var sequence = sr.sequences[elem.sequence.id]
      return !sequence.active &&
        elem.config.reset &&
        elem.revealing &&
        !elem.disabled
    }
    return !_isElemVisible(elem) &&
      elem.config.reset &&
      elem.revealing &&
      !elem.disabled
  }

  function _getContainer (container) {
    return {
      width: container.clientWidth,
      height: container.clientHeight
    }
  }

  function _getScrolled (container) {
    // Return the container scroll values, plus the its offset.
    if (container && container !== window.document.documentElement) {
      var offset = _getOffset(container)
      return {
        x: container.scrollLeft + offset.left,
        y: container.scrollTop + offset.top
      }
    } else {
      // Otherwise, default to the window object’s scroll values.
      return {
        x: window.pageXOffset,
        y: window.pageYOffset
      }
    }
  }

  function _getOffset (domEl) {
    var offsetTop = 0
    var offsetLeft = 0

      // Grab the element’s dimensions.
    var offsetHeight = domEl.offsetHeight
    var offsetWidth = domEl.offsetWidth

    // Now calculate the distance between the element and its parent, then
    // again for the parent to its parent, and again etc... until we have the
    // total distance of the element to the document’s top and left origin.
    do {
      if (!isNaN(domEl.offsetTop)) {
        offsetTop += domEl.offsetTop
      }
      if (!isNaN(domEl.offsetLeft)) {
        offsetLeft += domEl.offsetLeft
      }
      domEl = domEl.offsetParent
    } while (domEl)

    return {
      top: offsetTop,
      left: offsetLeft,
      height: offsetHeight,
      width: offsetWidth
    }
  }

  function _isElemVisible (elem) {
    var offset = _getOffset(elem.domEl)
    var container = _getContainer(elem.config.container)
    var scrolled = _getScrolled(elem.config.container)
    var vF = elem.config.viewFactor

      // Define the element geometry.
    var elemHeight = offset.height
    var elemWidth = offset.width
    var elemTop = offset.top
    var elemLeft = offset.left
    var elemBottom = elemTop + elemHeight
    var elemRight = elemLeft + elemWidth

    return confirmBounds() || isPositionFixed()

    function confirmBounds () {
      // Define the element’s functional boundaries using its view factor.
      var top = elemTop + elemHeight * vF
      var left = elemLeft + elemWidth * vF
      var bottom = elemBottom - elemHeight * vF
      var right = elemRight - elemWidth * vF

      // Define the container functional boundaries using its view offset.
      var viewTop = scrolled.y + elem.config.viewOffset.top
      var viewLeft = scrolled.x + elem.config.viewOffset.left
      var viewBottom = scrolled.y - elem.config.viewOffset.bottom + container.height
      var viewRight = scrolled.x - elem.config.viewOffset.right + container.width

      return top < viewBottom &&
        bottom > viewTop &&
        left > viewLeft &&
        right < viewRight
    }

    function isPositionFixed () {
      return (window.getComputedStyle(elem.domEl).position === 'fixed')
    }
  }

  /**
   * Utilities
   * ---------
   */

  function Tools () {}

  Tools.prototype.isObject = function (object) {
    return object !== null && typeof object === 'object' && object.constructor === Object
  }

  Tools.prototype.isNode = function (object) {
    return typeof window.Node === 'object'
      ? object instanceof window.Node
      : object && typeof object === 'object' &&
        typeof object.nodeType === 'number' &&
        typeof object.nodeName === 'string'
  }

  Tools.prototype.isNodeList = function (object) {
    var prototypeToString = Object.prototype.toString.call(object)
    var regex = /^\[object (HTMLCollection|NodeList|Object)\]$/

    return typeof window.NodeList === 'object'
      ? object instanceof window.NodeList
      : object && typeof object === 'object' &&
        regex.test(prototypeToString) &&
        typeof object.length === 'number' &&
        (object.length === 0 || this.isNode(object[0]))
  }

  Tools.prototype.forOwn = function (object, callback) {
    if (!this.isObject(object)) {
      throw new TypeError('Expected "object", but received "' + typeof object + '".')
    } else {
      for (var property in object) {
        if (object.hasOwnProperty(property)) {
          callback(property)
        }
      }
    }
  }

  Tools.prototype.extend = function (target, source) {
    this.forOwn(source, function (property) {
      if (this.isObject(source[property])) {
        if (!target[property] || !this.isObject(target[property])) {
          target[property] = {}
        }
        this.extend(target[property], source[property])
      } else {
        target[property] = source[property]
      }
    }.bind(this))
    return target
  }

  Tools.prototype.extendClone = function (target, source) {
    return this.extend(this.extend({}, target), source)
  }

  Tools.prototype.isMobile = function () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  /**
   * Polyfills
   * --------
   */

  _requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60)
    }

  /**
   * Module Wrapper
   * --------------
   */
  if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    define(function () {
      return ScrollReveal
    })
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollReveal
  } else {
    window.ScrollReveal = ScrollReveal
  }
}())

/*

    FILE: BP.maps.js
    DESCRIPTION: Dynamically creates google maps element with address entered in CMS
    AUTHOR(S): Nick Katarow

    DEPENDENCIES:
    - Google Maps API
    - jQuery 1.9.1

    TO DO:

*/

BP.maps = {

    init: function (addr) {
        var self = this;
        var styles = [
			{
				"stylers": [
					{ "visibility": "off" }
				]
			},{
				"featureType": "water",
				"elementType": "geometry.fill",
				"stylers": [
					{ "visibility": "on" },
					{ "color": "#bbefff" }
				]
			},{
				"featureType": "landscape",
				"elementType": "geometry",
				"stylers": [
					{ "visibility": "simplified" },
					{ "color": "#ffffff" }
				]
			},{
				"featureType": "road",
				"elementType": "geometry",
				"stylers": [
					{ "visibility": "simplified" },
					{ "color": "#5ecbf7" }
				]
			}
		];

        var geocoder = new google.maps.Geocoder(styles);
        var styledMap = new google.maps.StyledMapType(styles, { name: "Styled Map"} );
		var containerHeight = $('.location-map .right').outerHeight();

		$('#map-canvas').css('height', containerHeight);

        var mapOptions = {
            // center: new google.maps.LatLng(47.8106521, -122.37735520000001),
            zoom: 14,
            draggable: true,
            scrollwheel: false,
            disableDefaultUI: true,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            },
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL
            }
        };

        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');

        self.codeAddress(addr, geocoder, map);
    }, // END: init


    codeAddress: function(addr, geocoder, map) {
        geocoder.geocode( {'address': addr}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);

                var image = {
                    url: '/_ui/img/global/map-pin.png',
                    size: new google.maps.Size(27, 33),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(13, 33)
                };

                var marker = new google.maps.Marker({
                    map: map,
                    icon: image,
                    position: results[0].geometry.location
                });
            } else {
                console.log('Geocode not successful!');
            }
        });
    } // END: codeAddress

}; // END: maps

/*

    Navigation Component
    VERSION 1.0.0
    AUTHORS: Nick Katarow, Gavin Suntop

    DEPENDENCIES:
    - jQuery 1.7.2
    - BP.main.js

*/

BP.nav = {
    init: function () {
        // fn init
        var self = this,
			prev = 0,
            key;

        // ELEMENTS
        self.elPrimaryTrigger       = $('<button class="hamburger hamburger--spin" type="button"><span class="hamburger-box"><span class="hamburger-inner"></span></span></button>');
        self.elPrimaryMenu          = $('#primary');
        self.elSearchClose			= $('<a href="#" class="search-close"></a>');
        self.elNewsletterClose			= $('<a href="#" class="newsletter-close"></a>');

        // PROPERTIES
        self.isMobile           = false;
        self.visibleMenu        = null;
        self.triggersInserted   = false;

        // SETUP
        if (BP.getMediaWidth() < 1056) {
            self.mobileOn();
        } else {
            self.mobileOff();
        }

		if ($('.hero').length) {
			$('#header').addClass('transparent');

			$(window).on('scroll', function(){
				if (!self.checkVisible($('.hero'))) {
					$('#header').removeClass('transparent');
				} else {
					$('#header').addClass('transparent');
				}
			});
		}

		$(window).on('scroll', function(){
			var scrollTop = $(window).scrollTop();
			$('#header').toggleClass('hidden', scrollTop > prev);
			prev = scrollTop;
		});

    	if (!self.isMobile) {
        	$('.search-btn').click(function(event){
        		event.preventDefault();

        		$('#search-form').addClass('active');
				$('#search-form').css('visibility', 'visible');
				$('#header').addClass('black');
				$('body').css('overflow', 'hidden');
				$('.newsletter-btn').addClass('hidden');
				$('.search-btn').addClass('hidden');

				setTimeout(function(){
			        $('#q').focus();
				}, 250);

				$('#search-form').click(function(event){
					if ($(event.target).hasClass('active')){
		        		$('#search-form').removeClass('active');
						$('#header').removeClass('black');
						$('body').css('overflow', 'auto');
						$('.newsletter-btn').removeClass('hidden');
						$('.search-btn').removeClass('hidden');

						setTimeout(function(){
							$('#search-form').css('visibility', 'hidden');
						}, 250);
					}
				})
			});

        	$('.newsletter-btn').click(function(event){
        		event.preventDefault();

        		$('#mc_embed_signup').addClass('active');
				$('#mc_embed_signup').css('visibility', 'visible');
				$('#header').addClass('black');
				$('body').css('overflow', 'hidden');
				$('.newsletter-btn').addClass('hidden');
				$('.search-btn').addClass('hidden');

				setTimeout(function(){
			        $('#q').focus();
				}, 250);

				$('#mc_embed_signup').click(function(event){
					if ($(event.target).hasClass('active')){
		        		$('#mc_embed_signup').removeClass('active');
						$('#header').removeClass('black');
						$('body').css('overflow', 'auto');
						$('.newsletter-btn').removeClass('hidden');
						$('.search-btn').removeClass('hidden');

						setTimeout(function(){
							$('#mc_embed_signup').css('visibility', 'hidden');
						}, 250);
					}
				})
			});
		}


        // OBJECTS
        self.menus = {
            primary: {
                $menu: self.elPrimaryMenu,
                $trigger: self.elPrimaryTrigger
            }
        };

        // EVENT DELEGATION
        function bindTrigger(trigger, menuName) {
            trigger.click(function (event) {
                event.preventDefault();

                if (self.visibleMenu !== menuName) {
                    self.showNav(menuName);
                } else {
                    self.hideNav(menuName);
                }
            });
        }

        for (key in self.menus) {
            bindTrigger(self.menus[key].$trigger, key);
        }
    },
    mobileOn: function () {
        // fn mobileOn
        var self = this;

        if (!self.triggersInserted) {
            self.elPrimaryMenu.before(self.elPrimaryTrigger);

            self.triggersInserted = true;
        } else {
            self.elPrimaryTrigger.show();
        }

        self.elPrimaryMenu.addClass('slinky-menu');

        if (!self.slinkyInitiated) {
            self.elPrimaryMenu.slinky({
            	title: true,
            	speed: 250,
            	resize: false
            });

            self.slinkyInitiated = true;
        }

        self.isMobile = true;
    },
    mobileOff: function () {
        // fn mobileOff
        var self = this;

        self.elPrimaryMenu.removeClass('slinky-menu');

        if (self.triggersInserted) {
            self.elPrimaryTrigger.hide();
        }

        self.isMobile = false;
    },

    hideNav: function (menu) {
        // fn hideNav
        var self = this;

		$('header').removeClass('active');
        self.menus[self.visibleMenu].$menu.removeClass('active');
        self.menus[self.visibleMenu].$trigger.removeClass('is-active');
        self.visibleMenu = null;
    },
    showNav: function (menu) {
        // fn showNav
        var self = this;

        if (self.visibleMenu !== null) {
            self.hideNav(self.visibleMenu);
        }

		$('header').addClass('active');
        self.menus[menu].$menu.addClass('active');
        self.menus[menu].$trigger.addClass('is-active');
        self.visibleMenu = menu;
    },
    checkVisible: function( elm, evalType ) {
        evalType = evalType || "visible";

        var vpH = $(window).height(), // Viewport Height
            st = $(window).scrollTop(), // Scroll Top
            y = $(elm).offset().top - 80,
            elementHeight = $(elm).height();

        if (evalType === "visible") return ((y < (vpH + st)) && (y > (st - elementHeight)));
        if (evalType === "above") return ((y < (vpH + st)));
    }
};
