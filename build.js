;(function(){
'use strict';

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    throwError()
    return
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  function throwError () {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.exts = [
    '',
    '.js',
    '.json',
    '/index.js',
    '/index.json'
 ];

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  for (var i = 0; i < 5; i++) {
    var fullPath = path + require.exts[i];
    if (require.modules.hasOwnProperty(fullPath)) return fullPath;
    if (require.aliases.hasOwnProperty(fullPath)) return require.aliases[fullPath];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {

  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' === path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }
  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throwError()
    return
  }
  require.aliases[to] = from;

  function throwError () {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' === c) return path.slice(1);
    if ('.' === c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = segs.length;
    while (i--) {
      if (segs[i] === 'deps') {
        break;
      }
    }
    path = segs.slice(0, i + 2).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("ksanaforge-boot/index.js", function(exports, require, module){
var ksana={"platform":"remote"};

if (typeof process !="undefined") {
	if (process.versions["node-webkit"]) {
  	ksana.platform="node-webkit"
  	if (typeof nodeRequire!="undefined") ksana.require=nodeRequire;
  }
} else if (typeof chrome!="undefined" && chrome.fileSystem){
	ksana.platform="chrome";
}

if (typeof React=="undefined") window.React=require('../react');
//require("../cortex");
var Require=function(arg){return require("../"+arg)};
var boot=function(appId,main,maindiv) {
	main=main||"main";
	maindiv=maindiv||"main";
	ksana.appId=appId;
	ksana.mainComponent=React.renderComponent(Require(main)(),document.getElementById(maindiv));
}
window.ksana=ksana;
window.Require=Require;
module.exports=boot;
});
require.register("brighthas-bootstrap/dist/js/bootstrap.js", function(exports, require, module){
/*!
* Bootstrap v3.0.0 by @fat and @mdo
* Copyright 2013 Twitter, Inc.
* Licensed under http://www.apache.org/licenses/LICENSE-2.0
*
* Designed and built with all the love in the world by @mdo and @fat.
*/

// if (!jQuery) { throw new Error("Bootstrap requires jQuery") }

/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */
//if (typeof jQuery=="undefined") var jQuery =  require("jquery");

+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#scrollspy
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tabs
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#affix
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(jQuery);
});
require.register("ksana-document/index.js", function(exports, require, module){
﻿var API={document:require('./document')
	,xml:require('./xml')
	,api:require('./api')
	,tokenizers:require('./tokenizers')
	,typeset:require('./typeset')
	,crypto:require('./sha1')
	,customfunc:require('./customfunc')
	,configs:require('./configs')
	,languages:require('./languages')
	,kde:require("./kde") //database engine
	,kse:require('./kse') // search engine
	,kdb:require("./kdb")
	,html5fs:require("./html5fs")
}
if (typeof process!="undefined") {
	API.persistent=require('./persistent');
	API.indexer_kd=require('./indexer_kd');
	API.indexer=require('./indexer');
	API.projects=require('./projects');
	//API.kdb=require('./kdb');  // file format
	API.kdbw=require('./kdbw');  // create ydb
	API.xml4kdb=require('./xml4kdb');  
	API.build=require("./buildfromxml");
	API.tei=require("./tei");
	API.regex=require("./regex");
	API.setPath=function(path) {
		console.log("API set path ",path)
		API.kde.setPath(path);
	}
}
module.exports=API;
});
require.register("ksana-document/document.js", function(exports, require, module){
/*
  Multiversion text with external durable markups
  define a "fail to migrate markup" by setting length to -1
*/
(function(){"use strict";})();
var createMarkup=function(textlen,start,len,payload) {
	if (textlen==-1) textlen=1024*1024*1024; //max string size 1GB
	//the only function create a new markup instance, be friendly to V8 Hidden Class

	if (len<0) len=textlen;
	if (start<0) start=0;
	if (start>textlen) start=textlen;
	if (start+len>textlen) {
		len-=start+len-textlen;
		if (len<0) len=0;
	}

	return {start:start,len:len,payload:payload};
};
var cloneMarkup=function(m) {
	if (typeof m=='undefined') return null;
	return createMarkup(-1,m.start,m.len,JSON.parse(JSON.stringify(m.payload)));
};
/*
TODO , handle migration of fission page
*/
var migrateMarkup=function(markup, rev) {
	var end=markup.start+markup.len;
	var text=rev.payload.text||"";
	var newlen=(text.length-rev.len);
	var revend=rev.start+rev.len;
	var m=cloneMarkup(markup); //return a new copy

	if (end<=rev.start) return m;
	else if (revend<=markup.start) {
		m.start+=newlen;
		return m;
	} else { //overlap
		//  markup    x    xx      xx    xyz      xyyyz        xyz  
		//  delete   ---   ---    ---     ---      ---        ---     
		//  dout     |     |      |		   x        xz          z            
		//  insert   +++   +++    +++     +++      +++        +++
		//  iout     +++x  +++xx  +++xx  x+++yz   x+++yyyz    +++ xyz
		if (rev.start>markup.start) {
			var adv=rev.start-markup.start;  //markup in advance of rev
			var remain=( markup.len -adv) + newlen ; // remaining character after 
			if (remain<0) remain=0;
			m.len = adv + remain ;
		} else {
			m.start=rev.start;
			var behind=markup.start-rev.start;
			m.len=markup.len - (rev.len-behind);
		}
		if (m.len<0) m.len=0;
		return m;
	}
};
var applyChanges=function(sourcetext ,revisions) {
	revisions.sort(function(r1,r2){return r2.start-r1.start;});
	var text2=sourcetext;
	revisions.map(function(r){
		text2=text2.substring(0,r.start)+r.payload.text+text2.substring(r.start+r.len);
	});
	return text2;
};
var addMarkup=function(start,len,payload) {
	this.__markups__().push(createMarkup(this.inscription.length,start, len, payload ));
	this.doc.markDirty();
};
var addRevision=function(start,len,str) {
	var valid=this.__revisions__().every(function(r) {
		return (r.start+r.len<=start || r.start>=start+len);
	});
	var newrevision=createMarkup(this.inscription.length,start,len,{text:str});
	if (valid) this.__revisions__().push(newrevision);
	this.doc.markDirty();
	return valid;
};

var diff2revision=function(diff) {
	var out=[],offset=0,i=0;
	while (i<diff.length) {
		var d=diff[i];
		if (0==d[0]) {
			offset+=d[1].length;
		} else  if (d[0]<0) { //delete
			if (i<diff.length-1 && diff[i+1][0]==1) { //combine to modify
				out.push({start:offset,len:d[1].length,payload:{text:diff[i+1][1]}});
				i++;
			} else {
				out.push({start:offset,len:d[1].length,payload:{text:""}});
			}
			offset+=d[1].length;
		} else { //insert
			out.push({start:offset,len:0,payload:{text:d[1]}});
			//offset-=d[1].length;
		}
		i++;
	}
	return out;
}


var addRevisionsFromDiff=function(diff,opts) { //Google Diff format
	var revisions=diff2revision(diff);
	this.addRevisions(revisions,opts);
	return revisions.length;
}

var addMarkups=function(newmarkups,opts) {
	if (!newmarkups) return;
	if (!newmarkups.length) return;
	if (opts &&opts.clear) this.clearMarkups();
	var maxlength=this.inscription.length;
	var markups=this.__markups__();
	for (var i=0;i<newmarkups.length;i++) {
		var m=newmarkups[i];
		var newmarkup=createMarkup(maxlength, m.start, m.len, m.payload);
		markups.push(newmarkup);
	}
};
var addRevisions=function(newrevisions,opts) {
	if (!(newrevisions instanceof Array)) return;
	if (!newrevisions.length) return;
	if (opts &&opts.clear) this.clearRevisions();
	var revisions=this.__revisions__();
	var maxlength=this.inscription.length;
	for (var i=0;i<newrevisions.length;i++) {
		var m=newrevisions[i];
		var newrevision=createMarkup(maxlength, m.start, m.len, m.payload );
		revisions.push(newrevision);	
	}
};
var downgradeMarkups=function(markups) {
	var downgraded=[];

	for (var i in markups) {
		var m=markups[i];
		for (var j=0;j<this.revert.length;j++) {
			m=migrateMarkup(m,this.revert[j]);
		}
		downgraded.push(m);
	}
	return downgraded;
};
var upgradeMarkups=function(markups,revs) {
	var migratedmarkups=[];
	markups.map(function(m){
		var s=m.start, l=m.len, delta=0, deleted=false;
		revs.map(function(rev){
			if (rev.start<=s) { //this will affect the offset
				delta+= (rev.payload.text.length-rev.len);
			}
			if (rev.start<=s && rev.start+rev.len>=s+l) {
				deleted=true;
			}
		});
		var m2=cloneMarkup(m);
		m2.start+=delta;
		if (deleted) m2.len=0;
		migratedmarkups.push(m2);
	});
	return migratedmarkups;
};
var upgradeMarkupsTo=function(M,targetPage) {
	var pg=targetPage, lineage=[], doc=this.doc;
	while (true) {
			var pid=pg.parentId;
			if (!pid) break; // root	
			if (pid==pg.id)break;
			lineage.unshift(pg);
			pg=doc.getPage(pid);
	}
	lineage.map(function(pg){
		var parentPage=doc.getPage(pg.parentId);
		var rev=revertRevision(pg.revert,parentPage.inscription);
		M=parentPage.upgradeMarkups(M,rev);
	});
	return M;
};

var downgradeMarkupsTo=function(M,targetPage) {
	var pg=this,doc=this.doc;
	var ancestorId=targetPage.id;
	while (true) {
			var pid=pg.parentId;
			if (!pid) break; // root	
			M=pg.downgradeMarkups(M);
			if (pid==ancestorId)break;
			pg=doc.getPage(pid);
	}
	return M;
};
var offsprings=function() {
	var out=[];
	var page=this;
	while (page.__mutant__().length) {
		var mu=page.__mutant__();
		page=mu[mu.length-1];
		out.push(page);
	}
	return out;
}
var version=function() {  //return version number of this page
	var v=0, page=this, doc=this.doc;
	while (page.parentId) {
		v++;
		page=doc.getPage(page.parentId);
	}
	return v;
}

var hasAncestor=function(ancestor) {
	var ancestorId=ancestor.id;
	var pg=this,doc=this.doc;
	
	while (true) {
		if (!pg.parentId) return false; // root	
		if (pg.parentId==ancestorId) return true;
		pg=doc.getPage(pg.parentId);
	}
	return false;
};
var getAncestors=function() {
	var pg=this,ancestor=[], doc=this.doc;
	while (true) {
			var pid=pg.parentId;
			if (!pid) break; // root	
			pg=doc.getPage(pid);
			ancestor.unshift(pg);
	}
	return ancestor;
};

var clear=function(M,start,len,author) { //return number of item removed
	var count=0;
	if (typeof start=='undefined') {
		count=M.length;
	  M.splice(0, M.length);
	  return count;
	}
	if (len<0) len=this.inscription.length;
	var end=start+len;
	for (var i=M.length-1;i>=0;--i) {
		if (M[i].start>=start && M[i].start+M[i].len<=end) {
			if (author && author!=M[i].payload.author) continue;
			M.splice(i,1);
			count++;
		}
	}
	this.doc.markDirty();
	return count;
};
var clearRevisions=function(start,len,author) {
	clear.apply(this,[this.__revisions__(),start,len,author]);
	this.doc.markDirty();
};
var clearMarkups=function(start,len,author) {
	clear.apply(this,[this.__markups__(),start,len,author]);
	this.doc.markDirty();
};
var getOrigin=function() {
	var pg=this;
	while (pg && pg.parentId) {
		pg=this.doc.getPage(pg.parentId);
	}
	return pg;
}
var isLeafPage=function() {
	return (this.__mutant__().length===0);
};
//convert revert and revision back and forth
var revertRevision=function(revs,parentinscription) {
	var revert=[], offset=0;
	revs.sort(function(m1,m2){return m1.start-m2.start;});
	revs.map(function(r){
		var newinscription="";
		var	m=cloneMarkup(r);
		var newtext=parentinscription.substr(r.start,r.len);
		m.start+=offset;
		var text=m.payload.text||"";
		m.len=text.length;
		m.payload.text=newtext;
		offset+=m.len-newtext.length;
		revert.push(m);
	});
	revert.sort(function(a,b){return b.start-a.start;});
	return revert;
};
var markupAt=function(pos,markups) {
	var markups=markups||this.__markups__();
	return markups.filter(function(m){
		var len=m.len;if (!m.len) len=1;
		return (pos>=m.start && pos<m.start+len);
	});
};
var revisionAt=function(pos) {
	return this.__revisions__().filter(function(m){
		return (pos>=m.start && pos<=m.start+m.len);
	});
};

var compressRevert=function(R) {
	var out=[];
	for (var i in R) {
		if (R[i].payload.text==="") {
			out.push([R[i].start,R[i].len]);
		} else out.push([R[i].start,R[i].len,R[i].payload.text]);
	}
	return out;
};
var decompressRevert=function(R) {
	var out=[];
	for (var i=0;i<R.length;i++) {
		if (R[i].length) { //array format
			out.push({start:R[i][0],len:R[i][1], payload:{text:R[i][2]||""}})
		} else {
			out.push({start:R[i].s,len:R[i].l, payload:{text:R[i].t||""}});	
		}
	}
	return out;
};

var toJSONString=function(opts) {
	var obj={};
	opts=opts||{};
	if (this.name) obj.n=this.name;
	if (opts.withtext) obj.t=this.inscription;
	if (this.parentId) obj.p=this.parentId;
	if (this.revert) obj.r=compressRevert(this.revert);
	var meta=this.__meta__();
	/*
	if (meta.daugtherStart) {
		obj.ds=meta.daugtherStart;
		obj.dc=meta.daugtherCount;
	}
	*/
	return JSON.stringify(obj);
};
var compressedRevert=function() {
	return compressRevert(this.revert);
}
var filterMarkup=function(cb) {
	return this.__markups__().filter(function(m){
		return cb(m);
	});
}
var findMarkup=function(query) { //same like jquery
	var name=query.name;
	var output=[];
	this.__markups__().map(function(M){
		if (M.payload.name==name) {
			output.push(M);
		}
	});
	return output;
};
/*
var fission=function(breakpoints,opts){
	var meta=this.__meta__();
	var movetags=function(newpage,start,end) {
		var M=this.__markups__();
		M.map(function(m){
			if (m.start>=start && m.start<end) {
				newpage.addMarkup(m.start-start,m.len, m.payload);
			}
		});
	};
	meta.daugtherStart=this.doc.version;
	meta.daugtherCount=breakpoints.length+1;
	// create page ,add transclude from
	var start=0, t="";
	for (var i=0;i<=breakpoints.length;i++) {
		var end=breakpoints[i]||this.inscription.length;
		t=this.inscription.substring(start,end);
		var transclude={id:this.id, start:start };//
		var newpage=this.doc.createPage({text:t, transclude:transclude});
		newpage.__setParentId__(this.id);
		movetags.apply(this,[newpage,start,end]);
		start=end;
	}

	//when convert to json, remove the inscription in origin text
	//and retrived from fission mutant
};
*/
var toggleMarkup=function(start,len,payload) {
	var M=this.__markups__();
	for (var i=0;i<M.length;i++){
		if (start===M[i].start && len==M[i].len && payload.type==M[i].payload.type) {
			M.splice(i, 1);
			return;
		} 
	}
	this.addMarkup(start,len,payload);
};

var mergeMarkup = function(markups,offsets,type) {
	markups=markups||this.__markups__();
	var M=require("./markup");
	M.addTokenOffset(markups,offsets);
	var res= M.merge(markups, type||"suggest");
	return M.applyTokenOffset(res,offsets);
}

var strikeout=function(start,length,user,type) {
	this.clearMarkups(start,length,user);
	markups=this.__markups__();
	var M=require("./markup");
	type=type||"suggest";
	return M.strikeout(markups,start,length,user,type);
}

var preview=function(opts) { 
	//suggestion is from UI , with insert in payload
	var revisions=require("./markup").suggestion2revision(opts.suggestions);
	return this.doc.evolvePage(this,{preview:true,revisions:revisions,markups:[]});
}

/*
  change to prototype
*/
var newPage = function(opts) {
	var PG={};
	var inscription="";
	var hasInscription=false;
	var markups=[];
	var revisions=[];
	var mutant=[];

	opts=opts||{};
	opts.id=opts.id || 0; //root id==0
	var parentId=0 ,name="";
	if (typeof opts.parent==='object') {
		inscription=opts.parent.inscription;
		name=opts.parent.name;
		hasInscription=true;
		parentId=opts.parent.id;
	}
	var doc=opts.doc;
	var meta= {name:name,id:opts.id, parentId:parentId, revert:null };

	//these are the only 2 function changing inscription,use by Doc only
	var checkLength=function(ins) {
		if (ins.length>doc.maxInscriptionLength) {
			console.error("exceed size",ins.length, ins.substring(0,100));
			ins=ins.substring(0,doc.maxInscriptionLength);
		}
		return ins;
	};
	PG.__selfEvolve__  =function(revs,M) { 
		//TODO ;make sure inscription is loaded
		var newinscription=applyChanges(inscription, revs);
		var migratedmarkups=[];
		meta.revert=revertRevision(revs,inscription);
		inscription=checkLength(newinscription);
		hasInscription=true;
		markups=upgradeMarkups(M,revs);
	};
	Object.defineProperty(PG,'inscription',{
		get : function() {
			if (meta.id===0) return ""; //root page
			if (hasInscription) return inscription;
			/*
			if (meta.daugtherStart) {
				inscription="";
				for (var i=0;i<meta.daugtherCount;i++) {//combine from daugther
					var pg=this.doc.getPage(meta.daugtherStart+i);
					inscription+=pg.inscription;
				}
			} else {
			*/
				var mu=this.getMutant(0); //revert from Mutant
				inscription=checkLength(applyChanges(mu.inscription,mu.revert));				
			//}
			hasInscription=true;
			return inscription;
	}});
	//protected functions

	PG.__markups__     = function() { return markups;} ; 
	PG.__revisions__   = function() { return revisions;} ;
	PG.hasRevision     = function() { return revisions.length>0;} ;
	Object.defineProperty(PG,'id',{value:meta.id});
	Object.defineProperty(PG,'doc',{value:doc});
	Object.defineProperty(PG,'parentId',{get:function() {return meta.parentId;}});
	PG.__setParentId__ = function(i) { meta.parentId=i;	};
	PG.getMarkup       = function(i){ return cloneMarkup(markups[i]);} ;//protect from modification
	Object.defineProperty(PG,'markupCount',{get:function(){return markups.length;}});

	Object.defineProperty(PG,'revert',{get:function(){return meta.revert;}});
	PG.__setRevert__   = function(r) { meta.revert=decompressRevert(r);};
	//PG.__setDaugther__ = function(s,c) { meta.daugtherStart=s;meta.daugtherCount=c;};
	PG.getRevision     = function(i) { return cloneMarkup(revisions[i]);};
	PG.getMutant       = function(i) { return mutant[i]; };
	PG.__mutant__      = function()  { return mutant;};
	PG.__setmutant__   = function(c)  { mutant=c;};
	Object.defineProperty(PG,'revisionCount',{get:function(){return revisions.length;}});
		
	PG.setName           = function(n){ meta.name=n; return this;};
	Object.defineProperty(PG,'name',{get:function(){return meta.name;}});
	PG.__meta__        = function() {return meta;};
	Object.defineProperty(PG,'version',{get:version});
	//Object.defineProperty(PG,'daugtherStart',{get:function(){return meta.daugtherStart;}});
	//Object.defineProperty(PG,'daugtherCount',{get:function(){return meta.daugtherCount;}});
	PG.clearRevisions    = clearRevisions;
	PG.clearMarkups      = clearMarkups;
	PG.addMarkup         = addMarkup;
	PG.toggleMarkup      = toggleMarkup;
	PG.addMarkups        = addMarkups;
	PG.addRevision       = addRevision;
	PG.addRevisions      = addRevisions;
	PG.addRevisionsFromDiff=addRevisionsFromDiff;
	PG.hasAncestor       = hasAncestor;
	PG.upgradeMarkups    = upgradeMarkups;
	PG.downgradeMarkups  = downgradeMarkups;
	PG.upgradeMarkupsTo  = upgradeMarkupsTo;
	PG.downgradeMarkupsTo=downgradeMarkupsTo;
	PG.getAncestors      = getAncestors;
	PG.isLeafPage        = isLeafPage;
	PG.markupAt          = markupAt;
	PG.revisionAt        = revisionAt;
//	PG.getmutant          = getmutant;
	PG.toJSONString      = toJSONString;
	PG.findMarkup				 = findMarkup;
	PG.filterMarkup			 = filterMarkup;
//	PG.fission           = fission;
	PG.mergeMarkup       = mergeMarkup;
	PG.strikeout         = strikeout;
	PG.preview           = preview;
	PG.getOrigin       = getOrigin;
	PG.revertRevision = revertRevision;
	PG.offsprings       = offsprings;
	PG.compressedRevert=compressedRevert;
	Object.freeze(PG);
	return PG;
};
var createDocument = function(docjson,markupjson) {
	var DOC={};
	var pages=[];
	var names={};
	var meta={doctype:"dg1.0",filename:""};
	var dirty=0;
	var tags={};
	var sep="_.id";


	var createFromJSON=function(json) {
			rootPage.clearRevisions();
			var t=json.text||json.t ,page;
			if (t) {
				rootPage.addRevision(0,0,json.text || json.t);
				page=evolvePage(rootPage);				
			} else {
				page=createPage();
			}
			var name=json.n||json.name||"";
			if (!names[name]) {
				names[name]=pages.length-1;
			} else if (!json.p) {
				console.warn("repeat name "+name);
			}
			page.setName(name);
			if (json.p) page.__setParentId__(json.p);
			if (json.r) page.__setRevert__(json.r);
			/*
			if (json.ds) {
				page.__setDaugther__(json.ds,json.dc);
			}
			*/
			page.addMarkups(json.markups,true);
			page.addRevisions(json.revisions,true);
			return page;
	};
	var endCreatePages=function(opts) {
		//build mutant array
		if (opts&&opts.clear) pages.map(function(P){
			var mu=P.__mutant__();
			mu=[];
		});
		pages.map(function(P,idx,pages){
			if (P.parentId) pages[P.parentId].__mutant__().push(P);
		});		
	}
	var addMarkups=function(markups) {
		if (markups) for (var i=0;i<markups.length;i++){
			var m=markups[i];
			var pageid=m.i;
			pages[pageid].addMarkup(m.start,m.len,m.payload);
		}		
	}
	var createPages=function(json,markups) {
		var count=0,i;
		for (i=0;i<json.length;i++) {
			if (i==0 && !json[i].t) continue; //might be header
			createPage(json[i]);
		}

		endCreatePages({clear:true});
		addMarkups(markups);
		return this;
	};
	var createPage=function(input) {
		var id=pages.length,page;
		if (typeof input=='undefined' || typeof input.getMarkup=='function') {
			//root page
			var parent=input||0;
			page=newPage({id:id,parent:parent,doc:DOC});
			pages.push(page) ;
		} else if (typeof input=='string') { 
			page=createFromJSON({text:input});
		} else {
			page=createFromJSON(input);
		}
		return page;
	};
	var evolvePage=function(pg,opts) {//apply revisions and upgrate markup
		var nextgen;
		opts=opts||{};
		if (opts.preview) { 
			nextgen=newPage({parent:pg,doc:DOC,id:-1});  //id cannot null
		} else {
			nextgen=createPage(pg);	
		}
		if (pg.id) pg.__mutant__().push(nextgen);
		var revisions=opts.revisions||pg.__revisions__();
		var markups=opts.markups||pg.__markups__();
		nextgen.__selfEvolve__( revisions ,markups );

		return nextgen;
	};

	var findMRCA=function(pg1,pg2) {
		var ancestors1=pg1.getAncestors();
		var ancestors2=pg2.getAncestors();
		var common=0; //rootPage id
		while (ancestors1.length && ancestors2.length &&
		   ancestors1[0].id==ancestors2[0].id) {
			common=ancestors1[0];
			ancestors1.shift();ancestors2.shift();
		}
		return common;
	};

	var migrate=function(from,to) { //migrate markups of A to B
		if (typeof from=='number') from=this.getPage(from);
		var M=from.__markups__();
		var out=null;
		if (typeof to=='undefined') {
			out=from.downgradeMarkups(M);
		} else {
			if (typeof to=='number') to=this.getPage(to);
			if (from.id===to.id) {
				return M;
			} else if (to.hasAncestor(from)) {
				out=from.upgradeMarkupsTo(M,to);
			} else if (from.hasAncestor(to)){
				out=from.downgradeMarkupsTo(M,to);
			} else {
				var ancestor=findMRCA(from,to);
				out=from.downgradeMarkupsTo(M,ancestor);
				out=ancestor.upgradeMarkupsTo(out,to);
			}
		}
		return out;
	};
	var findPage=function(name) {
		for (var i=0;i<this.pageCount;i++) {
			if (name===pages[i].name) return pages[i];
		}
		return null;
	};
	var getLeafPages=function() {
		var arr=[],i=0;
		for (i=0;i<this.pageCount;i++) {arr[i]=true;}
		for (i=0;i<this.pageCount;i++) {
			var pid=pages[i].parentId;
			arr[pid]=false;
		}
		var leafpages=[];
		arr.map(function(p,i){ if (p) leafpages.push(i); });
		return {leafPages:leafpages, isLeafPages:arr};
	};
	/*
		convert revert to a string.
		starting with ascii 1
	*/
	var toJSONString=function() {
		var out=["["+JSON.stringify(meta)], s=",";
		var isLeafPages=this.getLeafPages().isLeafPages;
		for (var i=0;i<pages.length;i++) {
			if (i===0) continue;
			s+=pages[i].toJSONString({"withtext":isLeafPages[i]});
			out.push(s);
			s=",";
		}
		out[out.length-1]+="]";
		//make line number save as version number
		return out.join('\n');
	};

	//get a page , if version is not specified, return lastest
	//version ==0 first version, version==1 second ..
	var pageByName=function(name,version) {
		var parr=names[name];
		if (!parr) {
			return null; //pagename not found
		}
		if (typeof version=="undefined") {
			version=-1; //lastest
		}
		var pg=pages[parr];
		if (version==0) return pg; //the first version
		while (pg.__mutant__().length) {
			var mu=pg.__mutant__();
			pg=mu[mu.length-1];
			version--; 
			if  (version==0) break;
		}
		return pg;
	};

	var map=function(context,callback) {
		var cb=callback,ctx=context;
		if (typeof context=="function") {
			cb=context;
			ctx=this;
		}
		for (var i=1;i<this.pageCount;i++) {
			var pg=pages[i];
			if (pg.parentId!=0)  continue; //not a root page, 
			while (pg.__mutant__().length) {
				var mu=pg.__mutant__();
				pg=mu[mu.length-1];
			}
			cb.apply(ctx,[pg,i-1]);
		}
	}
	var pageNames=function() {
		out=[];
		for (var i=1;i<this.pageCount;i++) {
			var pg=pages[i];
			if (pg.parentId!=0)  continue; //not a root page, 
			out.push(pg.name);
		}
		return out;
	}

	var rootPage=createPage();

	DOC.getPage=function(id) {return pages[id];};
	DOC.markDirty=function() {dirty++;};
	DOC.markClean=function() {dirty=0;};
	DOC.setTags=function(T)  {tags=T;};
	DOC.setSep=function(s)  {sep=s;};
	/*
		external markups must be saved with version number.
	*/


	Object.defineProperty(DOC,'meta',{value:meta});
	Object.defineProperty(DOC,'maxInscriptionLength',{value:8192});
	Object.defineProperty(DOC,'version',{get:function(){return pages.length;}});
	Object.defineProperty(DOC,'pageCount',{get:function(){return pages.length;}});
	Object.defineProperty(DOC,'dirty',{get:function() {return dirty>0; }});
	Object.defineProperty(DOC,'ags',{get:function() {return tags;}});
	Object.defineProperty(DOC,'sep',{get:function() {return sep;}});

	
	DOC.createPage=createPage;
	DOC.createPages=createPages;
	DOC.addMarkups=addMarkups;
	DOC.evolvePage=evolvePage;
	DOC.findMRCA=findMRCA;
	DOC.migrate=migrate; 
	DOC.downgrade=migrate; //downgrade to parent
	DOC.migrateMarkup=migrateMarkup; //for testing
	DOC.getLeafPages=getLeafPages;
	DOC.findPage=findPage;
	DOC.pageByName=pageByName;
	DOC.toJSONString=toJSONString;

	DOC.map=map;
	DOC.pageNames=pageNames;
	DOC.endCreatePages=endCreatePages;

	if (docjson) DOC.createPages(docjson,markupjson);
	dirty=0;
	
	Object.freeze(DOC);
	return DOC;
};
/*
	TODO move user markups to tags
*/
/*
var splitInscriptions=function(doc,starts) {
	var combined="",j=0;
	var inscriptions=[],oldunitoffsets=[0];
	for (var i=1;i<doc.pageCount;i++) {
		var page=doc.getPage(i);
		var pageStart=doc.maxInscriptionLength*i;
 		combined+=page.inscription;
		oldunitoffsets.push(combined.length);
	}
	var last=0,newunitoffsets=[0];
	starts.map(function(S){
		var till=oldunitoffsets[ S[0] ]+ S[1];
		newunitoffsets.push(till);
		inscriptions.push( combined.substring(last,till));
		last=till;
	})
	inscriptions.push( combined.substring(last));
	newunitoffsets.push(combined.length);
	return {inscriptions:inscriptions,oldunitoffsets:oldunitoffsets , newunitoffsets:newunitoffsets};
}

var sortedIndex = function (array, tofind) {
  var low = 0, high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    array[mid] < tofind ? low = mid + 1 : high = mid;
  }
  return low;
};

var addOldUnit=function() {
// convert old unit into tags 
}

var reunitTags=function(tags,R,newtagname) {
	var out=[];
	tags.map(function(T){
		if (T.name===newtagname) return;
		var tag=JSON.parse(JSON.stringify(T));
		var pos=R.oldunitoffsets[T.sunit]+T.soff;
		var p=sortedIndex(R.newunitoffsets,pos+1)-1;
		if (p==-1) p=0;
		tag.sunit=p;tag.soff=pos-R.newunitoffsets[p];

		eunit=T.eunit||T.sunit;eoff=T.eoff||T.soff;
		if (eunit!=T.sunit || eoff!=T.soff) {
			pos=R.oldunitoffsets[eunit]+eoff;
			p=sortedIndex(R.newunitoffsets,pos)-1;
			if (p==-1) p=0;
			if (eunit!=T.sunit) tag.eunit=p;
			if (eoff!=T.soff)   tag.eoff=pos-R.newunitoffsets[p];
		}
		out.push(tag);
	});
	return out;
}
var reunit=function(doc,tagname,opts) {
	var unitstarts=[];
	doc.tags.map(function(T){
		if (T.name===tagname)	unitstarts.push([T.sunit,T.soff]);
	});

	var R=splitInscriptions(doc,unitstarts);
	var newdoc=createDocument();
	R.inscriptions.map(function(text){newdoc.createPage(text)});

	newdoc.tags=reunitTags(doc.tags,R,tagname);
	return newdoc;
}
*/
// reunit is too complicated, change to fission
// a big chunk of text divide into smaller unit
//
module.exports={ createDocument: createDocument};
});
require.register("ksana-document/api.js", function(exports, require, module){
if (typeof nodeRequire=='undefined')var nodeRequire=require;
var appPath=""; //for servermode
var getProjectPath=function(p) {
  var path=nodeRequire('path');
  return path.resolve(p.filename);
};


var enumProject=function() { 
  return nodeRequire("ksana-document").projects.names();
};
var enumKdb=function(paths) {
  if (typeof paths=="string") {
    paths=[paths];
  }
  if (appPath) {
	  for (var i in paths) {
	  	  paths[i]=require('path').resolve(appPath,paths[i]);
	  }
  }
  var db=nodeRequire("ksana-document").projects.getFiles(paths,function(p){
    return p.substring(p.length-4)==".kdb";
  });
  return db.map(function(d){
    return d.shortname.substring(0,d.shortname.length-4)
  });
}
var loadDocumentJSON=function(opts) {
  var persistent=nodeRequire('ksana-document').persistent;
  var ppath=getProjectPath(opts.project);
  var path=nodeRequire('path');
  //if empty file, create a empty
  var docjson=persistent.loadLocal(  path.resolve(ppath,opts.file));
  return docjson;
};
var findProjectPath=function(dbid) {
  var fs=nodeRequire("fs");
  var path=nodeRequire('path');
  var tries=[ //TODO , allow any depth
               "./ksana_databases/"+dbid
               ,"../ksana_databases/"+dbid
               ,"../../ksana_databases/"+dbid
               ,"../../../ksana_databases/"+dbid
               ];
    for (var i=0;i<tries.length;i++){
      if (fs.existsSync(tries[i])) {
        return path.resolve(tries[i]);
      }
    }
    return null;
}
var saveMarkup=function(opts) {
  var path=nodeRequire('path');
  var persistent=nodeRequire('ksana-document').persistent;
  var filename=opts.filename;
  if (opts.dbid) {
    var projectpath=findProjectPath(opts.dbid);
    if (projectpath) filename=path.resolve(projectpath,filename);
  } 
  return persistent.saveMarkup(opts.markups, filename,opts.pageid||opts.i);
};
var saveDocument=function(opts) {
  var persistent=nodeRequire('ksana-document').persistent;
  return persistent.saveDocument(opts.doc , opts.filename);
};
var getUserSettings=function(user) {
  var fs=nodeRequire('fs');
  var defsettingfilename='./settings.json';
  if (typeof user=="undefined") {
    if (fs.existsSync(defsettingfilename)) {
      return JSON.parse(fs.readFileSync(defsettingfilename,'utf8'));  
    }
  }
  return {};
}
var buildIndex=function(projname) {
  nodeRequire('ksana-document').indexer_kd.start(projname);
}
var buildStatus=function(session) {
  return nodeRequire("ksana-document").indexer_kd.status(session);
}
var stopIndex=function(session) {
  return nodeRequire("ksana-document").indexer_kd.stop(session);
} 
var getProjectFolders=function(p) {
  return nodeRequire("ksana-document").projects.folders(p.filename);
}
var getProjectFiles=function(p) {
  return nodeRequire("ksana-document").projects.files(p.filename);
}

var search=function(opts,cb) {
  var Kde=nodeRequire("ksana-document").kde;
  Kde.createLocalEngine(opts.dbid,function(engine){
    nodeRequire("./kse").search(engine,opts.q,opts,cb);
  });
};
search.async=true;
var get=function(opts,cb) {
  require("./kde").openLocal(opts.db,function(engine){
      if (!engine) {
        throw "database not found "+opts.db;
      }
      engine.get(opts.key,opts.recursive,function(data){cb(0,data)});
  });
}
var setPath=function(path) {
  appPath=path;
  nodeRequire("ksana-document").setPath(path);
}
get.async=true;

var markup=require('./markup.js');
var users=require('./users');
var installservice=function(services) {
	var API={ 
        enumProject:enumProject
        ,enumKdb:enumKdb
        ,getProjectFolders:getProjectFolders
        ,getProjectFiles:getProjectFiles
        ,loadDocumentJSON:loadDocumentJSON
        ,saveMarkup:saveMarkup
        ,saveDocument:saveDocument
        ,login:users.login
        ,getUserSettings:getUserSettings
        ,buildIndex:buildIndex
        ,buildStatus:buildStatus
        ,stopIndex:stopIndex
        ,search:search
        ,get:get
        ,setPath:setPath
	  ,version: function() { return require('./package.json').version; }
	};
	if (services) {
		services.document=API;
	}
	return API;
};

module.exports=installservice;
});
require.register("ksana-document/xml.js", function(exports, require, module){
var D=require('./document');
var template_accelon=require('./template_accelon');
var formatJSON = function(json,meta) {
		var out=["["],s="";
		if (meta) {
			out[0]+=JSON.stringify(meta);
			s=",";
		}
		json.map(function(obj) {
			if (obj.toJSONString) s+=obj.toJSONString();
			else s+=JSON.stringify(obj);
			out.push(s);
			s=",";
		});
		out[out.length-1]+="]";
		return out.join('\n');
};
var importXML=function(lines,opts) {
	opts=opts||{};
	if (opts.template=='accelon') {
		return template_accelon(lines,opts);
	}
	return null;
};
var exportXML=function() {
	
};
module.exports={importXML:importXML,exportXML:exportXML,
	formatJSON:formatJSON};
});
require.register("ksana-document/template_accelon.js", function(exports, require, module){
var D=require('./document');
var unitsep=/<pb n="([^"]*?)"\/>/g  ;
/*
	inline tag
*/
var tags=[];
var tagstack=[];
var parseXMLTag=function(s) {
	var name="",i=0;
	if (s[0]=='/') {
		return {name:s.substring(1),type:'end'};
	}

	while (s[i] && (s.charCodeAt(i)>0x30)) {name+=s[i];i++;}

	var type="start";
	if (s[s.length-1]=='/') { type="emtpy"; }
	var attr={},count=0;
	s=s.substring(name.length+1);
	s.replace(/(.*?)="([^"]*?)"/g,function(m,m1,m2) {
		attr[m1]=m2;
		count++;
	});
	if (!count) attr=undefined;
	return {name:name,type:type,attr:attr};
};
var parseUnit=function(unitseq,unittext,doc) {
	// name,sunit, soff, eunit, eoff , attributes
	var totaltaglength=0;
	var parsed=unittext.replace(/<(.*?)>/g,function(m,m1,off){
		var tag=parseXMLTag(m1);
		tag.seq=unitseq;
		var offset=off-totaltaglength;
		totaltaglength+=m.length;
		if (tag.type=='end') {
			tag=tagstack.pop();
			if (tag.name!=m1.substring(1)) {
				throw 'unbalanced tag at unit  '+unittext;
			}
			if (tag.sunit!=unitseq) tag.eunit=unitseq;
			if (tag.soff!=offset) tag.eoff=offset;
		} else {
			tag.sunit=unitseq;tag.soff=offset;
			if (tag.type=='start') tagstack.push(tag);
			tags.push(tag);
		}
		return ""; //remove the tag from inscription
	});
	return {inscription:parsed, tags:tags};
};
var splitUnit=function(buf,sep) {
	var units=[], unit="", last=0 ,name="";
	buf.replace(sep,function(m,m1,offset){
		units.push([name,buf.substring(last,offset)]);
		name=m1;
		last=offset+m.length; 
	});
	units.push([name,buf.substring(last)]);
	return units;
};
var addMarkups=function(tags,page){
	tags.map(function(T){
		var start=T.soff;
		var len=0;
		if (T.eoff>T.soff) len=T.eoff-T.soff;
		var payload={name:T.name};
		if (T.attr) payload.attr=T.attr;
		page.addMarkup(start,len,payload);
	});
};
var importxml=function(buf,opts) {
	var doc=D.createDocument();
	if (opts.whole) {
		var name=opts.name||"";
		var out=parseUnit(0,buf,doc);
		if (opts.trim) out.inscription=out.inscription.trim();
		var page=doc.createPage({name:name,text:out.inscription});
		addMarkups(out.tags,page);
	} else {
		var units=splitUnit(buf,opts.sep || unitsep);
		units.map(function(U,i){
			var out=parseUnit(i,U[1],doc);
			if (opts.trim) out.inscription=out.inscription.trim();
			doc.createPage({text:out.inscription,name:U[0]});
		});		
	}

	if (tagstack.length) {
		throw 'tagstack not null'+JSON.stringify(tagstack);
	}
	doc.setTags(tags);
	return doc;
};
module.exports=importxml;
});
require.register("ksana-document/persistent.js", function(exports, require, module){
if (typeof nodeRequire!="function") nodeRequire=require; 
var maxFileSize=512*1024;//for github
var D=require("./document");
var fs=nodeRequire("fs"); 
/*
var open=function(fn,mfn) {
	var kd,kdm="";
	var kd=fs.readFileSync(fn,'utf8');
	if (!mfn) mfn=fn+"m";
	if (fs.existsSync(mfn)) {
		kdm=fs.readFileSync(mfn,'utf8');	
	}

	return {kd:kd,kdm:kdm}
}
*/
var loadLocal=function(fn,mfn) {
//if (!fs.existsSync(fn)) throw "persistent.js::open file not found ";
	if (fs.existsSync(fn)){
		var content=fs.readFileSync(fn,'utf8');
		var kd=null,kdm=null;
		try {
			kd=JSON.parse(content);
		} catch (e) {
			kd=[{"create":new Date()}];
		}		
	}
		
	if (!mfn) mfn=fn.substr(0,fn.lastIndexOf("."))+".kdm";
	if (fs.existsSync(mfn)) {
		kdm=JSON.parse(fs.readFileSync(mfn,'utf8'));	
	}
	return {kd:kd,kdm:kdm};
}
/* load json and create document */
var createLocal=function(fn,mfn) {
	var json=loadLocal(fn,mfn);
	var doc=D.createDocument(json.kd,json.kdm);
	doc.meta.filename=fn;
	return doc;
};
var serializeDocument=function(doc) {
	var out=[];
	for (var i=1;i<doc.pageCount;i++) {
		var P=doc.getPage(i);
		var obj={n:P.name, t:P.inscription};
		if (P.parentId) obj.p=P.parentId;
		out.push(JSON.stringify(obj));
	}
	return 	"[\n"+out.join("\n,")+"\n]";
};
var serializeXMLTag=function(doc) {
	if (!doc.tags)return;
	var out=[];
	for (var i=0;i<doc.tags.length;i++) {
		out.push(JSON.stringify(doc.tags[i]));
	}
	return 	"[\n"+out.join("\n,")+"\n]";
};
var serializeMarkup=function(doc) {
	var out=[];
	var sortfunc=function(a,b) {
		return a.start-b.start;
	};
	for (var i=0;i<doc.pageCount;i++) {
		var M=doc.getPage(i).__markups__();

		var markups=JSON.parse(JSON.stringify(M)).sort(sortfunc);

		for (var j=0;j<markups.length;j++) {
			var m=markups[j];
			m.i=i;
			out.push(JSON.stringify(m));
		}
	}
	return 	"[\n"+out.join("\n,")+"\n]";
};


var saveMarkup=function(markups,filename,pageid) { //same author
	if (!markups || !markups.length) return null;
	var author=markups[0].payload.author, others=[];
	var mfn=filename+'m';
	var json=loadLocal(filename,mfn);
	if (!json.kdm || !json.kdm.length) {
		others=[];
	} else {
		others=json.kdm.filter(function(m){return m.i!=pageid || m.payload.author != author});	
	}
	for (var i=0;i<markups.length;i++) {
		markups[i].i=pageid;
	}
	others=others.concat(markups);
	var sortfunc=function(a,b) {
		//each page less than 64K
		return (a.i*65536 +a.start) - (b.i*65536 +b.start);
	}
	others.sort(sortfunc);
	var out=[];
	for (var i=0;i<others.length;i++) {
		out.push(JSON.stringify(others[i]));
	}
	return fs.writeFile(mfn,"[\n"+out.join("\n,")+"\n]",'utf8',function(err){
		//		
	});
}
var saveMarkupLocal=function(doc,mfn) {
	if (!doc.meta.filename && !mfn) throw "missing filename";
	if (!doc.dirty) return;
	if (typeof mfn=="undefined") {
		mfn=doc.meta.filename+"m";
	}
	var out=serializeMarkup(doc);
	return fs.writeFile(mfn,out,'utf8',function(err){
		if (!err) doc.markClean();
	});
};

var saveDocument=function(doc,fn) {
	if (!fn) fn=doc.meta.filename;
	var out=serializeDocument(doc);
	if (out.length>maxFileSize) {
		console.error('file size too big ',out.length);
	}
	return fs.writeFileSync(fn,out,'utf8');
};

var saveDocumentTags=function(doc,fn) {
	if (!fn) fn=doc.meta.filename;
	var out=serializeXMLTag(doc);
	return fs.writeFileSync(fn,out,'utf8');
};

module.exports={
	loadLocal:loadLocal,
	createLocal:createLocal,
	saveDocument:saveDocument,
	saveDocumentTags:saveDocumentTags,
	saveMarkup:saveMarkup,
	serializeDocument:serializeDocument,
	serializeMarkup:serializeMarkup,
	serializeXMLTag:serializeXMLTag
};
});
require.register("ksana-document/tokenizers.js", function(exports, require, module){
var tibetan =function(s) {
	//continuous tsheg grouped into same token
	//shad and space grouped into same token
	var offset=0;
	var tokens=[],offsets=[];
	s=s.replace(/\r\n/g,'\n').replace(/\r/g,'\n');
	var arr=s.split('\n');

	for (var i=0;i<arr.length;i++) {
		var last=0;
		var str=arr[i];
		str.replace(/[།་ ]+/g,function(m,m1){
			tokens.push(str.substring(last,m1)+m);
			offsets.push(offset+last);
			last=m1+m.length;
		});
		if (last<str.length) {
			tokens.push(str.substring(last));
			offsets.push(last);
		}
		if (i===arr.length-1) break;
		tokens.push('\n');
		offsets.push(offset+last);
		offset+=str.length+1;
	}

	return {tokens:tokens,offsets:offsets};
};
var isSpace=function(c) {
	return (c==" ") || (c==",") || (c==".");
}
var isCJK =function(c) {return ((c>=0x3000 && c<=0x9FFF) 
|| (c>=0xD800 && c<0xDC00) || (c>=0xFF00) ) ;}
var simple1=function(s) {
	var offset=0;
	var tokens=[],offsets=[];
	s=s.replace(/\r\n/g,'\n').replace(/\r/g,'\n');
	arr=s.split('\n');

	var pushtoken=function(t,off) {
		var i=0;
		if (t.charCodeAt(0)>255) {
			while (i<t.length) {
				var c=t.charCodeAt(i);
				offsets.push(off+i);
				tokens.push(t[i]);
				if (c>=0xD800 && c<=0xDFFF) {
					tokens[tokens.length-1]+=t[i]; //extension B,C,D
				}
				i++;
			}
		} else {
			tokens.push(t);
			offsets.push(off);	
		}
	}
	for (var i=0;i<arr.length;i++) {
		var last=0,sp="";
		str=arr[i];
		str.replace(/[_0-9A-Za-z]+/g,function(m,m1){
			while (isSpace(sp=str[last]) && last<str.length) {
				tokens[tokens.length-1]+=sp;
				last++;
			}
			pushtoken(str.substring(last,m1)+m , offset+last);
			offsets.push(offset+last);
			last=m1+m.length;
		});

		if (last<str.length) {
			while (isSpace(sp=str[last]) && last<str.length) {
				tokens[tokens.length-1]+=sp;
				last++;
			}
			pushtoken(str.substring(last), offset+last);
			
		}		
		offsets.push(offset+last);
		offset+=str.length+1;
		if (i===arr.length-1) break;
		tokens.push('\n');
	}

	return {tokens:tokens,offsets:offsets};

};

var simple=function(s) {
	var token='';
	var tokens=[], offsets=[] ;
	var i=0; 
	var lastspace=false;
	var addtoken=function() {
		if (!token) return;
		tokens.push(token);
		offsets.push(i);
		token='';
	}
	while (i<s.length) {
		var c=s.charAt(i);
		var code=s.charCodeAt(i);
		if (isCJK(code)) {
			addtoken();
			token=c;
			if (code>=0xD800 && code<0xDC00) { //high sorragate
				token+=s.charAt(i+1);i++;
			}
			addtoken();
		} else {
			if (c=='&' || c=='<' || c=='?'
			|| c=='|' || c=='~' || c=='`' || c==';' 
			|| c=='>' || c==':' || c=='{' || c=='}'
			|| c=='=' || c=='@' || c=='[' || c==']' || c=='(' || c==')' || c=="-"
			|| code==0xf0b || code==0xf0d // tibetan space
			|| (code>=0x2000 && code<=0x206f)) {
				addtoken();
				if (c=='&' || c=='<') {
					var endchar='>';
					if (c=='&') endchar=';'
					while (i<s.length && s.charAt(i)!=endchar) {
						token+=s.charAt(i);
						i++;
					}
					token+=endchar;
					addtoken();
				} else {
					token=c;
					addtoken();
				}
				token='';
			} else {
				if (isSpace(c)) {
					token+=c;
					lastspace=true;
				} else {
					if (lastspace) addtoken();
					lastspace=false;
					token+=c;
				}
			}
		}
		i++;
	}
	addtoken();
	return {tokens:tokens,offsets:offsets};
}
module.exports={simple:simple,tibetan:tibetan};
});
require.register("ksana-document/markup.js", function(exports, require, module){
/*
	merge needs token offset, not char offset
*/
var splitDelete=function(m) {
	var out=[];
	for (i=0;i<m.l;i++) {
		var m2=JSON.parse(JSON.stringify(m));
		m2.s=m.s+i;
		m2.l=1;
		out.push(m2);
	}
	return out;
}
var quantize=function(markup) {
	var out=[],i=0,m=JSON.parse(JSON.stringify(markup));
	if (m.payload.insert) {
			m.s=m.s+m.l-1;
			m.l=1;
			out.push(m)
	} else {
		if (m.payload.text=="") { //delete
			out=splitDelete(m);
		} else { //replace
			if (m.l>1) {//split to delete and replace
				var m2=JSON.parse(JSON.stringify(m));
				m.payload.text="";
				m.l--;
				out=splitDelete(m);
				m2.s=m2.s+m2.l-1;
				m2.l=1;
				out.push(m2);
			} else {
				out.push(m);
			}
		}
	}
	return out;
}
var plural={
	"suggest":"suggests"
}
var combinable=function(p1,p2) {
	var t="";
	for (var i=0;i<p1.choices.length;i++) t+=p1.choices[i].text;
	for (var i=0;i<p2.choices.length;i++) t+=p2.choices[i].text;
	return (t==="");
}
var combine=function(markups) {
	var out=[],i=1,at=0;

	while (i<markups.length) {
		if (combinable(markups[at].payload,markups[i].payload)) {
			markups[at].l++;
		} else {
			out.push(markups[at]);
			at=i;
		}
		i++;
	}
	out.push(markups[at]);
	return out;
}
var merge=function(markups,type){
	var out=[],i=0;
	for (i=0;i<markups.length;i++) {
		if (markups[i].payload.type===type)	out=out.concat(quantize(markups[i]));
	}
	var type=plural[type];
	if (typeof type=="undefined") throw "cannot merge "+type;
	if (!out.length) return [];
	out.sort(function(a,b){return a.s-b.s;});
	var out2=[{s:out[0].s, l:1, payload:{type:type,choices:[out[0].payload]}}];
	for (i=1;i<out.length;i++) {
		if (out[i].s===out2[out2.length-1].s ) {
			out2[out2.length-1].payload.choices.push(out[i].payload);
		} else {
			out2.push({s:out[i].s,l:1,payload:{type:type,choices:[out[i].payload]}});
		}
	}
	return combine(out2);
}
var addTokenOffset=function(markups,offsets) {
	for (var i=0;i<markups.length;i++) {
		var m=markups[i],at,at2;
		at=offsets.indexOf(m.start); //need optimized
		if (m.len) at2=offsets.indexOf(m.start+m.len);
		if (at==-1 || at2==-1) {
			console.trace("markup position not at token boundary");
			break;
		}

		m.s=at;
		if (m.len) m.l=at2-at;
	}
	return markups;
}

var applyTokenOffset=function(markups,offsets) {
	for (var i=0;i<markups.length;i++) {
		var m=markups[i];
		m.start=offsets[m.s];
		m.len=offsets[m.s+m.l] - offsets[m.s];
		delete m.s;
		delete m.l;
	}
	return markups;
}

var suggestion2revision=function(markups) {
	var out=[];
	for (var i=0;i<markups.length;i++) {
		var m=markups[i];
		var payload=m.payload;
		if (payload.insert) {
			out.push({start:m.start+m.len,len:0,payload:payload});
		} else {
			out.push({start:m.start,len:m.len,payload:payload});
		}
	}
	return out;
}

var strikeout=function(markups,start,len,user,type) {
	var payload={type:type,author:user,text:""};
	markups.push({start:start,len:len,payload:payload});
}
module.exports={merge:merge,quantize:quantize,
	addTokenOffset:addTokenOffset,applyTokenOffset:applyTokenOffset,
	strikeout:strikeout, suggestion2revision : suggestion2revision
}
});
require.register("ksana-document/typeset.js", function(exports, require, module){
/*
		if (=="※") {
			arr[i]=React.DOM.br();
		}
*/

var classical=function(arr) {
	var i=0,inwh=false,inwarichu=false,start=0;
	var out=[];

	var newwarichu=function(now) {
		var warichu=arr.slice(start,now);
		var height=Math.round( (warichu.length)/2);
		var w1=warichu.slice(0,height);
		var w2=warichu.slice(height);

		var w=[React.DOM.span({className:"warichu-right"},w1),
		       React.DOM.span({className:"warichu-left"},w2)];
		out.push(React.DOM.span({"className":"warichu"},w));
		start=now;
	}

	var linebreak=function(now) {
		if (inwarichu) {
			newwarichu(now,true);
			start++;
		}
		out.push(React.DOM.br());
	}
	while (i<arr.length) {
		var ch=arr[i].props.ch;
		if (ch=='※') {
			linebreak(i);
		}	else if (ch=='【') { //for shuowen
			start=i+1;
			inwh=true;
		}	else if (ch=='】') {
			var wh=arr.slice(start,i);
			out.push(React.DOM.span({"className":"wh"},wh));
			inwh=false;
		} else if (ch=='﹝') {

			start=i+1;
			inwarichu=true;
		} else if (ch=='﹞') {
			if (!inwarichu) { //in previous page
				out=[];
				inwarichu=true;
				start=0; //reset
				i=0;
				continue;
			}
			newwarichu(i);
			inwarichu=false;
		} else{
			if (!inwh && !inwarichu && ch!='↩') out.push(arr[i]);
		}
		i++;
	}
	if (inwarichu) newwarichu(arr.length-1);

	return React.DOM.span({"className":"vertical"},out);
}
module.exports={classical:classical}
});
require.register("ksana-document/sha1.js", function(exports, require, module){
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(e,m){var p={},j=p.lib={},l=function(){},f=j.Base={extend:function(a){l.prototype=this;var c=new l;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
n=j.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=m?c:4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var c=this.words,q=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)c[d+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[d+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=e.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*e.random()|0);return new n.init(c,a)}}),b=p.enc={},h=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++){var f=c[d>>>2]>>>24-8*(d%4)&255;b.push((f>>>4).toString(16));b.push((f&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d+=2)b[d>>>3]|=parseInt(a.substr(d,
2),16)<<24-4*(d%8);return new n.init(b,c/2)}},g=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(c[d>>>2]>>>24-8*(d%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new n.init(b,c)}},r=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(g.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return g.parse(unescape(encodeURIComponent(a)))}},
k=j.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,d=c.sigBytes,f=this.blockSize,h=d/(4*f),h=a?e.ceil(h):e.max((h|0)-this._minBufferSize,0);a=h*f;d=e.min(4*a,d);if(a){for(var g=0;g<a;g+=f)this._doProcessBlock(b,g);g=b.splice(0,a);c.sigBytes-=d}return new n.init(g,d)},clone:function(){var a=f.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=k.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){k.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,b){return(new a.init(b)).finalize(c)}},_createHmacHelper:function(a){return function(b,f){return(new s.HMAC.init(a,
f)).finalize(b)}}});var s=p.algo={};return p}(Math);
(function(){var e=CryptoJS,m=e.lib,p=m.WordArray,j=m.Hasher,l=[],m=e.algo.SHA1=j.extend({_doReset:function(){this._hash=new p.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var b=this._hash.words,h=b[0],g=b[1],e=b[2],k=b[3],j=b[4],a=0;80>a;a++){if(16>a)l[a]=f[n+a]|0;else{var c=l[a-3]^l[a-8]^l[a-14]^l[a-16];l[a]=c<<1|c>>>31}c=(h<<5|h>>>27)+j+l[a];c=20>a?c+((g&e|~g&k)+1518500249):40>a?c+((g^e^k)+1859775393):60>a?c+((g&e|g&k|e&k)-1894007588):c+((g^e^
k)-899497514);j=k;k=e;e=g<<30|g>>>2;g=h;h=c}b[0]=b[0]+h|0;b[1]=b[1]+g|0;b[2]=b[2]+e|0;b[3]=b[3]+k|0;b[4]=b[4]+j|0},_doFinalize:function(){var f=this._data,e=f.words,b=8*this._nDataBytes,h=8*f.sigBytes;e[h>>>5]|=128<<24-h%32;e[(h+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(h+64>>>9<<4)+15]=b;f.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=j.clone.call(this);e._hash=this._hash.clone();return e}});e.SHA1=j._createHelper(m);e.HmacSHA1=j._createHmacHelper(m)})();
module.exports=CryptoJS;
});
require.register("ksana-document/users.js", function(exports, require, module){
if (typeof nodeRequire=='undefined')var nodeRequire=require;

var passwords=[];

var loadpasswd=function(){
	var defpasswdfilename='./passwd.json';
	var fs=nodeRequire('fs');
    if (fs.existsSync(defpasswdfilename)) {
    	passwords=JSON.parse(fs.readFileSync(defpasswdfilename,'utf8'));  
    }
}
var login=function(opts) {
	opts=opts||{};
	var password=opts.password||opts.pw;
	var out={name:opts.name,error:"user not found"};
	if (!passwords.length) loadpasswd();
	for (var i=0;i<passwords.length;i++) {
		var u=passwords[i];
		if (u.name==opts.name) {
			if (u.pw!=password) {
				out.error="wrong password";
			} else {
				out=JSON.parse(JSON.stringify(u));
				delete out.pw;
				out.error="";
				return out;
			}
		}
	}
	return out;
}
module.exports={login:login}
});
require.register("ksana-document/customfunc.js", function(exports, require, module){
/* 
  custom func for building and searching ydb

  keep all version
  
  getAPI(version); //return hash of functions , if ver is omit , return lastest
	
  postings2Tree      // if version is not supply, get lastest
  tokenize(text,api) // convert a string into tokens(depends on other api)
  normalizeToken     // stemming and etc
  isSpaceChar        // not a searchable token
  isSkipChar         // 0 vpos

  for client and server side
  
*/
var configs=require("./configs");
var config_simple="simple1";
var optimize=function(json,config) {
	config=config||config_simple;
	return json;
}

var getAPI=function(config) {
	config=config||config_simple;
	var func=configs[config].func;
	func.optimize=optimize;
	if (config=="simple1") {
		//add common custom function here
	} else if (config=="tibetan1") {

	} else throw "config "+config +"not supported";

	return func;
}

module.exports={getAPI:getAPI};
});
require.register("ksana-document/configs.js", function(exports, require, module){
var tokenizers=require('./tokenizers');

var normalize1=function(token) {
	return token.replace(/[ \.,]/g,'').trim();
}
var isSkip1=function(token) {
	var t=token.trim();
	return (t=="" || t=="　" || t=="※" || t=="\n");
}
var normalize_tibetan=function(token) {
	return token.replace(/[།་ ]/g,'').trim();
}

var isSkip_tibetan=function(token) {
	var t=token.trim();
	return (t=="" || t=="　" || t=="\n");	
}
var simple1={
	func:{
		tokenize:tokenizers.simple
		,normalize: normalize1
		,isSkip:	isSkip1
	}
	
}
var tibetan1={
	func:{
		tokenize:tokenizers.tibetan
		,normalize:normalize_tibetan
		,isSkip:isSkip_tibetan
	}
}
module.exports={"simple1":simple1,"tibetan1":tibetan1}
});
require.register("ksana-document/projects.js", function(exports, require, module){
/*
  given a project id, find all folders and files
  projects be should under ksana_databases, like node_modules
*/
if (typeof nodeRequire=='undefined')nodeRequire=require;
function getFiles(dirs,filtercb){	
  var fs=nodeRequire('fs');
  var path=nodeRequire('path');
  var out=[];
  var shortnames={}; //shortname must be unique
  if (typeof dirs=='string')dirs=[dirs];

  for (var j=0;j<dirs.length;j++ ) {
    var dir=dirs[j];
    if (!fs.existsSync(dir))continue;
    var files = fs.readdirSync(dir);
    for(var i in files){
      if (!files.hasOwnProperty(i)) continue;
      if (files[i][0]==".") continue;//skip hidden file
      var name = dir+'/'+files[i],config=null;
      if (filtercb(name)) {
          var json=name+'/ksana.json';
          if (fs.existsSync(json)) {          
            config=JSON.parse(fs.readFileSync(name+'/ksana.json','utf8'));
            var stat=fs.statSync(json);
            config.lastModified=stat.mtime;
            config.shortname=files[i];
            config.filename=name;
          } else {
            config={name:name,filename:name,shortname:files[i]};
          }
          var pathat=config.filename.lastIndexOf('/');
          config.withfoldername=config.filename.substring(1+config.filename.lastIndexOf('/',pathat-1));

          if (!shortnames[files[i]]) out.push(config);
          shortnames[files[i]]=true;
      }
    }
  }
  return out;
}

var listFolders=function(path) {
  var fs=nodeRequire('fs');
  var folders= getFiles( path ,function(name){
      return fs.statSync(name).isDirectory();
  });
  if (!folders.length)return folders;
  if (parseInt(folders[0].shortname)) {
    folders.sort(function(a,b) {
      return parseInt(a.shortname)-parseInt(b.shortname);
    });
  } else {
    folders.sort(function(a,b) {
      if (a.shortname==b.shortname) return 0; 
      else if (a.shortname>b.shortname) return 1; else return -1;
    });
  }
  return folders;
};
var listFiles=function(path) {
  var fs=nodeRequire('fs');
  var files= getFiles( path,function(name){
      return name.indexOf(".kd")===name.length-3;
  });
  if (!files.length)return files;
  if (parseInt(files[0].shortname)) {
    files.sort(function(a,b) {
      return parseInt(a.shortname)-parseInt(b.shortname);
    });
  } else {
    files.sort(function(a,b) {
      if (a.shortname==b.shortname) return 0; 
      else if (a.shortname>b.shortname) return 1; else return -1;
    });
  }
  return files;
};

var listProject=function() {
  var fs=nodeRequire('fs');
	//search for local 
	var folders= getFiles(['./ksana_databases','../ksana_databases','../../ksana_databases'],function(name){
      if (fs.statSync(name).isDirectory()){
        return fs.existsSync(name+'/ksana.json');
      }
  });

	return folders;
}

var fullInfo=function(projname) {
  var fs=nodeRequire('fs');
  if (fs.existsSync(projname+'/ksana.json')) {//user provide a folder
    var normalized=require('path').resolve(projname);
    normalized=normalized.substring(normalized.lastIndexOf(require('path').sep)+1);
    var projectpath=projname;
    var name=normalized;
  } else { //try id
    var proj=listProject().filter(function(f){ return f.shortname==projname});
    if (!proj.length) return null;
    var projectpath=proj[0].filename;
    var name=proj[0].shortname;
  }

  var files=[];  
  var ksana=JSON.parse(fs.readFileSync(projectpath+'/ksana.json','utf8'));    

  listFolders(projectpath).map(function(f){
    var ff=listFiles(f.filename);
    files=files.concat(ff);
  })
  return {name:name,filename:projectpath,ksana:ksana,files: files.map(function(f){return f.filename})};
}

module.exports={getFiles:getFiles,names:listProject,folders:listFolders,files:listFiles,fullInfo:fullInfo};
});
require.register("ksana-document/indexer.js", function(exports, require, module){
if (typeof nodeRequire=='undefined')nodeRequire=require;
var indexing=false; //only allow one indexing task
var status={pageCount:0,progress:0,done:false}; //progress ==1 completed
var session={};
var api=null;
var xml4kdb=null;
var isSkip=null;
var normalize=null;
var tokenize=null;

var putPosting=function(tk) {
	var	postingid=session.json.tokens[tk];
	var out=session.json;
	if (!postingid) {
		out.postingCount++;
		posting=out.postings[out.postingCount]=[];
		session.json.tokens[tk]=out.postingCount;
	} else {
		posting=out.postings[postingid];
	}
	posting.push(session.vpos);
}
var putPage=function(inscription) {
	var tokenized=tokenize(inscription);
	for (var i=0;i<tokenized.tokens.length;i++) {
		var t=tokenized.tokens[i];
		if (isSkip(t)) {
			 session.vpos--;
		} else {
			var normalized=normalize(t);
			if (normalized) 	putPosting(normalized);
 		}
 		session.vpos++;
	}
	session.indexedTextLength+= inscription.length;
}
var upgradeDocument=function(d,dnew) {
	var Diff=nodeRequire("./diff");	
	dnew.map(function(pg){
		var oldpage=d.pageByName(pg.name);
		var ninscription=dnew.inscription;
		if (oldpage) {
			var diff=new Diff();
			var oinscription=oldpage.inscription;
			var df=diff.diff_main(oinscription, pg.inscription);

			var revisioncount=oldpage.addRevisionsFromDiff(df);
			if (revisioncount) d.evolvePage(oldpage);
		} else {
			d.createPage({n:pgname,t:ninscription});
		}
	});	
}
var shortFilename=function(fn) {
	var arr=fn.split('/');
	while (arr.length>2) arr.shift();
	return arr.join('/');
}
var putDocument=function(parsed,cb) {
	var D=nodeRequire("./document");

	var indexpages=function(doc) {
		var fileInfo={pageNames:[],pageOffset:[],parentId:[],reverts:[]};
		var fileContent=[];
		var shortfn=shortFilename(status.filename);
		session.json.files.push(fileInfo);
		session.json.fileContents.push(fileContent);
		session.json.fileNames.push(shortfn);
		session.json.fileOffsets.push(session.vpos);
		var hasParentId=false, hasRevert=false;
		fileInfo.pageOffset.push(session.vpos);
		session.pagecount+=doc.pageCount-1;
		for (var i=1;i<doc.pageCount;i++) {
			var pg=doc.getPage(i);
			if (pg.isLeafPage()) {
				fileContent.push(pg.inscription);
				putPage(pg.inscription);
			} else {
				fileContent.push("");
			}
			fileInfo.pageNames.push(pg.name);
			fileInfo.pageOffset.push(session.vpos);
			fileInfo.parentId.push(pg.parentId);
			if (pg.parentId) hasParentId=true;
			var revertstr="";
			if (pg.parentId) revertstr=JSON.stringify(pg.compressedRevert());
			if (revertstr) hasRevert=true;
			fileInfo.reverts.push( revertstr );
		}
		if (!hasParentId) delete fileInfo["parentId"];
		if (!hasRevert) delete fileInfo["reverts"];
		cb(parsed);//finish
	}
	var dnew=D.createDocument(parsed.texts);

	if (session.kdb) {
		session.kdb.getDocument(status.filename,function(d){
			if (d) {
				upgradeDocument(d,dnew);
				indexpages(d);
				status.pageCount+=d.pageCount;
			} else { //no such page in old kdb
				indexpages(dnew);
				status.pageCount+=dnew.pageCount;
			}
		});
	} else {
		indexpages(dnew);
		status.pageCount+=dnew.pageCount;
	}
}

var parseBody=function(body,sep,cb) {
	var res=xml4kdb.parseXML(body, {sep:sep});
	putDocument(res,cb);
}


var putFile=function(fn,cb) {
	var fs=nodeRequire("fs");
	var texts=fs.readFileSync(fn,session.config.inputEncoding).replace(/\r\n/g,"\n");
	var bodyend=session.config.bodyend;
	var bodystart=session.config.bodystart;
	var callbacks=session.config.callbacks||{};
	var started=false,stopped=false;

	if (callbacks.onFile) callbacks.onFile.apply(session,[fn,status]);
	var start=bodystart ? texts.indexOf(bodystart) : 0 ;
	var end=bodyend? texts.indexOf(bodyend): texts.length;
	if (!bodyend) bodyendlen=0;
	else bodyendlen=bodyend.length;
	//assert.equal(end>start,true);

	// split source xml into 3 parts, before <body> , inside <body></body> , and after </body>

	if (callbacks.beforebodystart) callbacks.beforebodystart.apply(session,[texts.substring(0,start),status]);
	var body=texts.substring(start,end+bodyendlen);
	parseBody(body,session.config.pageSeparator,function(parsed){
		if (callbacks.afterbodyend) {
			status.parsed=parsed;
			status.bodytext=body;
			status.starttext=texts.substring(0,start);
			var ending="";
			if (bodyend) ending=texts.substring(end+bodyend.length);
			if (ending) callbacks.afterbodyend.apply(session,[ending,status]);
			status.parsed=null;
			status.bodytext=null;
			status.starttext=null;
		}
		cb(); //parse body finished
	});	
}
var initSession=function(config) {
	var json={
		postings:[[0]] //first one is always empty, because tokenid cannot be 0		
		,files:[]
		,fileContents:[]
		,fileNames:[]
		,fileOffsets:[]
		,tokens:{}
		,postingCount:0
	};
	config.inputEncoding=config.inputEncoding||"utf8";
	var session={vpos:1, json:json , kdb:null, filenow:0,done:false
		           ,indexedTextLength:0,config:config,files:config.files,pagecount:0};
	return session;
}

var initIndexer=function(mkdbconfig) {
	var Kde=nodeRequire("./kde");

	session=initSession(mkdbconfig);
	api=nodeRequire("ksana-document").customfunc.getAPI(mkdbconfig.config);
	xml4kdb=nodeRequire("ksana-document").xml4kdb;

	normalize=api["normalize"];
	isSkip=api["isSkip"];
	tokenize=api["tokenize"];

	var folder=session.config.outdir||".";
	session.kdbfn=require("path").resolve(folder, session.config.name+'.kdb');

	if (!session.config.reset && nodeRequire("fs").existsSync(session.kdbfn)) {
		//if old kdb exists and not reset 
		Kde.openLocal(session.kdbfn,function(db){
			session.kdb=db;
			setTimeout(indexstep,1);
		});
	} else {
		setTimeout(indexstep,1);
	}
}

var start=function(mkdbconfig) {
	if (indexing) return null;
	indexing=true;
	if (!mkdbconfig.files.length) return null;//nothing to index

	initIndexer(mkdbconfig);
  	return status;
}


var indexstep=function() {
	
	if (session.filenow<session.files.length) {
		status.filename=session.files[session.filenow];
		status.progress=session.filenow/session.files.length;
		putFile(status.filename,function(){
			session.filenow++;
			setTimeout(indexstep,1); //rest for 1 ms to response status			
		});
	} else {
		finalize(function() {
			status.done=true;
			indexing=false;
			if (session.config.finalized) {
				session.config.finalized(session,status);
			}
		});	
	}
}

var getstatus=function() {
  return status;
}
var stop=function() {
  status.done=true;
  status.message="User Abort";
  indexing=false;
  return status;
}
var backupFilename=function(ydbfn) {
	//user has a chance to recover from previous ydb
	return ydbfn+"k"; //todo add date in the middle
}

var backup=function(ydbfn) {
	var fs=nodeRequire("fs");
	var fs=nodeRequire('fs');
	if (fs.existsSync(ydbfn)) {
		var bkfn=ydbfn+'k';
		try {
			if (fs.existsSync(bkfn)) fs.unlinkSync(bkfn);
			fs.renameSync(ydbfn,bkfn);
		} catch (e) {
			console.log(e);
		}
	}
}
var createMeta=function() {
	var meta={};
	meta.config=session.config.config;
	meta.name=session.config.name;
	meta.vsize=session.vpos;
	meta.pagecount=session.pagecount;
	return meta;
}
var guessSize=function() {
	var size=session.vpos * 5;
	if (size<1024*1024) size=1024*1024;
	return  size;
}
var buildpostingslen=function(tokens,postings) {
	var out=[];
	for (var i=0;i<tokens.length;i++) {
		out.push(postings[i].length);
	}
	return out;
}
var optimize4kdb=function(json) {
	var keys=[];
	for (var key in json.tokens) {
		keys.push([key,json.tokens[key]]);
	}
	keys.sort(function(a,b){return a[1]-b[1]});//sort by token id
	var newtokens=keys.map(function(k){return k[0]});
	json.tokens=newtokens;
	for (var i=0;i<json.postings.length;i++) json.postings[i].sorted=true; //use delta format to save space
	json.postingslen=buildpostingslen(json.tokens,json.postings);
	return json;
}

var finalize=function(cb) {	
	var Kde=nodeRequire("./kde");

	if (session.kdb) Kde.closeLocal(session.kdbfn);

	session.json.fileOffsets.push(session.vpos); //serve as terminator
	session.json.meta=createMeta();
	
	if (!session.config.nobackup) backup(session.kdbfn);
	status.message='writing '+session.kdbfn;
	//output=api("optimize")(session.json,session.ydbmeta.config);
	var opts={size:session.config.estimatesize};
	if (!opts.size) opts.size=guessSize();

	var kdbw =nodeRequire("ksana-document").kdbw(session.kdbfn,opts);
	//console.log(JSON.stringify(session.json,""," "));

	var json=optimize4kdb(session.json);
	console.log("output to",session.kdbfn);
	kdbw.save(json,null,{autodelete:true});
	
	kdbw.writeFile(session.kdbfn,function(total,written) {
		status.progress=written/total;
		status.outputfn=session.kdbfn;
		if (total==written) cb();
	});
}
module.exports={start:start,stop:stop,status:getstatus};
});
require.register("ksana-document/indexer_kd.js", function(exports, require, module){
if (typeof nodeRequire=='undefined')nodeRequire=require;

/*
  text:       [ [page_text][page_text] ]
  pagenames:  []
  tokentree:  []
  
  search engine API: 
  getToken        //return raw posting
  getText(vpos)   //return raw page text
    getPageText   
  vpos2pgoff      //virtual posting to page offset
  groupBy         //convert raw posting to group (with optional converted offset) 
  findMarkupInRange
*/


var indexing=false; //only allow one indexing task
var projinfo=null;
var status={progress:0,done:false}; //progress ==1 completed
var session={};
var api=null;
var isSkip=null;
var normalize=null;
var tokenize=null;

var putPosting=function(tk) {
	var	postingid=session.json.tokens[tk];
	var out=session.json;

	if (!postingid) {
		out.postingCount++;
		posting=out.postings[out.postingCount]=[];
		session.json.tokens[tk]=out.postingCount;
	} else {
		posting=out.postings[postingid];
	}
	posting.push(session.vpos);
}
var putExtra=function(arr_of_key_vpos_payload) {
	//which markup to be added in the index
	//is depended on application requirement...
	//convert markup start position to vpos
	// application  key-values  pairs
	//    ydb provide search for key , return array of vpos
	//        and given range of vpos, return all key in the range
  // structure
  // key , 
}

var putPage=function(docPage) {
	var tokenized=tokenize(docPage.inscription);

	for (var i=0;i<tokenized.tokens.length;i++) {
		var t=tokenized.tokens[i];

		if (isSkip(t)) {
			 session.vpos--;
		} else {
			var normalized=normalize(t);
			if (normalized) 	putPosting(normalized);
 		}
 		session.vpos++;
	}

	session.indexedTextLength+= docPage.inscription.length;
}
var shortFilename=function(fn) {
	var arr=fn.split('/');
	while (arr.length>2) arr.shift();
	return arr.join('/');
}
var putFile=function(fn) {
	var persistent=nodeRequire("ksana-document").persistent;
	var doc=persistent.createLocal(fn);
	var shortfn=shortFilename(fn);

	var fileInfo={pageNames:[],pageOffset:[]};
	var fileContent=[];
	session.json.files.push(fileInfo);
	session.json.fileContents.push(fileContent);
	session.json.fileNames.push(shortfn);
	session.json.fileOffsets.push(session.vpos);
	status.message="indexing "+fn;

	for (var i=1;i<doc.pageCount;i++) {
		var pg=doc.getPage(i);
		fileContent.push(pg.inscription);
		fileInfo.pageNames.push(pg.name);
		fileInfo.pageOffset.push(session.vpos);
		putPage(pg);
	}
	fileInfo.pageOffset.push(session.vpos); //ending terminator
}
var initSession=function() {
	var json={
		files:[]
		,fileContents:[]
		,fileNames:[]
		,fileOffsets:[]
		,postings:[[0]] //first one is always empty, because tokenid cannot be 0
		,tokens:{}
		,postingCount:0
	};
	var session={vpos:1, json:json ,
		           indexedTextLength:0,
		           options: projinfo.ksana.ydbmeta };
	return session;
}
var initIndexer=function() {
	session=initSession();
	session.filenow=0;
	session.files=projinfo.files;
	status.done=false;
	api=nodeRequire("ksana-document").customfunc.getAPI(session.options.config);
	
	normalize=api["normalize"];
	isSkip=api["isSkip"];
	tokenize=api["tokenize"];
	setTimeout(indexstep,1);
}

var getMeta=function() {
	var meta={};
	meta.config=session.options.config;
	meta.name=projinfo.name;
	meta.vsize=session.vpos;
	return meta;
}

var backupFilename=function(ydbfn) {
	//user has a chance to recover from previous ydb
	return ydbfn+"k"; //todo add date in the middle
}

var backup=function(ydbfn) {
	var fs=nodeRequire('fs');
	if (fs.existsSync(ydbfn)) {
		var bkfn=ydbfn+'k';
		if (fs.existsSync(bkfn)) fs.unlinkSync(bkfn);
		fs.renameSync(ydbfn,bkfn);
	}
}
var finalize=function(cb) {
	var opt=session.options;
	var kdbfn=projinfo.name+'.kdb';

	session.json.fileOffsets.push(session.vpos); //serve as terminator
	session.json.meta=getMeta();
	
	backup(kdbfn);
	status.message='writing '+kdbfn;
	//output=api("optimize")(session.json,session.ydbmeta.config);

	var kdbw =nodeRequire("ksana-document").kdbw(kdbfn);
	
	kdbw.save(session.json,null,{autodelete:true});
	
	kdbw.writeFile(kdbfn,function(total,written) {
		status.progress=written/total;
		status.outputfn=kdbfn;
		if (total==written) cb();
	});
}

var indexstep=function() {
	
	if (session.filenow<session.files.length) {
		status.filename=session.files[session.filenow];
		status.progress=session.filenow/session.files.length;
		putFile(status.filename);
		session.filenow++;
		setTimeout(indexstep,1); //rest for 1 ms to response status
	} else {
		finalize(function() {
			status.done=true;
			indexing=false;
		});	
	}
}

var status=function() {
  return status;
}
var start=function(projname) {
	if (indexing) return null;
	indexing=true;

	projinfo=nodeRequire("ksana-document").projects.fullInfo(projname);

	if (!projinfo.files.length) return null;//nothing to index

	initIndexer();
 	status.projectname=projname;
  	return status;
}

var stop=function() {
  status.done=true;
  status.message="User Abort";
  indexing=false;
  return status;
}
module.exports={start:start,stop:stop,status:status};
});
require.register("ksana-document/kdb.js", function(exports, require, module){
/*
	KDB version 3.0 GPL
	yapcheahshen@gmail.com
	2013/12/28
	asyncronize version of yadb

  remove dependency of Q, thanks to
  http://stackoverflow.com/questions/4234619/how-to-avoid-long-nesting-of-asynchronous-functions-in-node-js

  
*/
var Kfs=require('./kdbfs');	

var DT={
	uint8:'1', //unsigned 1 byte integer
	int32:'4', // signed 4 bytes integer
	utf8:'8',  
	ucs2:'2',
	bool:'^', 
	blob:'&',
	utf8arr:'*', //shift of 8
	ucs2arr:'@', //shift of 2
	uint8arr:'!', //shift of 1
	int32arr:'$', //shift of 4
	vint:'`',
	pint:'~',	

	array:'\u001b',
	object:'\u001a' 
	//ydb start with object signature,
	//type a ydb in command prompt shows nothing
}


var Create=function(path,opts,cb) {
	/* loadxxx functions move file pointer */
	// load variable length int
	if (typeof opts=="function") {
		cb=opts;
		opts={};
	}
	
	var loadVInt =function(opts,blocksize,count,cb) {
		//if (count==0) return [];
		var that=this;
		this.fs.readBuf_packedint(opts.cur,blocksize,count,true,function(o){
			opts.cur+=o.adv;
			cb.apply(that,[o.data]);
		});
	}
	var loadVInt1=function(opts,cb) {
		var that=this;
		loadVInt.apply(this,[opts,6,1,function(data){
			cb.apply(that,[data[0]]);
		}])
	}
	//for postings
	var loadPInt =function(opts,blocksize,count,cb) {
		var that=this;
		this.fs.readBuf_packedint(opts.cur,blocksize,count,false,function(o){
			opts.cur+=o.adv;
			cb.apply(that,[o.data]);
		});
	}
	// item can be any type (variable length)
	// maximum size of array is 1TB 2^40
	// structure:
	// signature,5 bytes offset, payload, itemlengths
	var getArrayLength=function(opts,cb) {
		var that=this;
		var dataoffset=0;

		this.fs.readUI8(opts.cur,function(len){
			var lengthoffset=len*4294967296;
			opts.cur++;
			that.fs.readUI32(opts.cur,function(len){
				opts.cur+=4;
				dataoffset=opts.cur; //keep this
				lengthoffset+=len;
				opts.cur+=lengthoffset;

				loadVInt1.apply(that,[opts,function(count){
					loadVInt.apply(that,[opts,count*6,count,function(sz){						
						cb({count:count,sz:sz,offset:dataoffset});
					}]);
				}]);
				
			});
		});
	}

	var loadArray = function(opts,blocksize,cb) {
		var that=this;
		getArrayLength.apply(this,[opts,function(L){
				var o=[];
				var endcur=opts.cur;
				opts.cur=L.offset;

				if (opts.lazy) { 
						var offset=L.offset;
						L.sz.map(function(sz){
							o.push("\0"+offset.toString(16)
								   +"\0"+sz.toString(16));
							offset+=sz;
						})
				} else {
					var taskqueue=[];
					for (var i=0;i<L.count;i++) {
						taskqueue.push(
							(function(sz){
								return (
									function(data){
										if (typeof data=='object' && data.__empty) {
											 //not pushing the first call
										}	else o.push(data);
										opts.blocksize=sz;
										load.apply(that,[opts, taskqueue.shift()]);
									}
								);
							})(L.sz[i])
						);
					}
					//last call to child load
					taskqueue.push(function(data){
						o.push(data);
						opts.cur=endcur;
						cb.apply(that,[o]);
					});
				}

				if (opts.lazy) cb.apply(that,[o]);
				else {
					taskqueue.shift()({__empty:true});
				}
			}
		])
	}		
	// item can be any type (variable length)
	// support lazy load
	// structure:
	// signature,5 bytes offset, payload, itemlengths, 
	//                    stringarray_signature, keys
	var loadObject = function(opts,blocksize,cb) {
		var that=this;
		var start=opts.cur;
		getArrayLength.apply(this,[opts,function(L) {
			opts.blocksize=blocksize-opts.cur+start;
			load.apply(that,[opts,function(keys){ //load the keys
				if (opts.keys) { //caller ask for keys
					keys.map(function(k) { opts.keys.push(k)});
				}

				var o={};
				var endcur=opts.cur;
				opts.cur=L.offset;
				if (opts.lazy) { 
					var offset=L.offset;
					for (var i=0;i<L.sz.length;i++) {
						//prefix with a \0, impossible for normal string
						o[keys[i]]="\0"+offset.toString(16)
							   +"\0"+L.sz[i].toString(16);
						offset+=L.sz[i];
					}
				} else {
					var taskqueue=[];
					for (var i=0;i<L.count;i++) {
						taskqueue.push(
							(function(sz,key){
								return (
									function(data){
										if (typeof data=='object' && data.__empty) {
											//not saving the first call;
										} else {
											o[key]=data; 
										}
										opts.blocksize=sz;
										load.apply(that,[opts, taskqueue.shift()]);
									}
								);
							})(L.sz[i],keys[i-1])

						);
					}
					//last call to child load
					taskqueue.push(function(data){
						o[keys[keys.length-1]]=data;
						opts.cur=endcur;

						cb.apply(that,[o]);
					});
				}
				if (opts.lazy) cb.apply(that,[o]);
				else {
					taskqueue.shift()({__empty:true});
				}
			}]);
		}]);
	}

	//item is same known type
	var loadStringArray=function(opts,blocksize,encoding,cb) {
		var that=this;
		this.fs.readStringArray(opts.cur,blocksize,encoding,function(o){
			opts.cur+=blocksize;
			cb.apply(that,[o]);
		});
	}
	var loadIntegerArray=function(opts,blocksize,unitsize,cb) {
		var that=this;
		loadVInt1.apply(this,[opts,function(count){
			var o=that.fs.readFixedArray(opts.cur,count,unitsize,function(o){
				opts.cur+=count*unitsize;
				cb.apply(that,[o]);
			});
		}]);
	}
	var loadBlob=function(blocksize,cb) {
		var o=this.fs.readBuf(this.cur,blocksize);
		this.cur+=blocksize;
		return o;
	}	
	var loadbysignature=function(opts,signature,cb) {
		  var blocksize=opts.blocksize||this.fs.size; 
			opts.cur+=this.fs.signature_size;
			var datasize=blocksize-this.fs.signature_size;
			//basic types
			if (signature===DT.int32) {
				opts.cur+=4;
				this.fs.readI32(opts.cur-4,cb);
			} else if (signature===DT.uint8) {
				opts.cur++;
				this.fs.readUI8(opts.cur-1,cb);
			} else if (signature===DT.utf8) {
				var c=opts.cur;opts.cur+=datasize;
				this.fs.readString(c,datasize,'utf8',cb);	
			} else if (signature===DT.ucs2) {
				var c=opts.cur;opts.cur+=datasize;
				this.fs.readString(c,datasize,'ucs2',cb);	
			} else if (signature===DT.bool) {
				opts.cur++;
				this.fs.readUI8(opts.cur-1,function(data){cb(!!data)});
			} else if (signature===DT.blob) {
				loadBlob(datasize,cb);
			}
			//variable length integers
			else if (signature===DT.vint) {
				loadVInt.apply(this,[opts,datasize,datasize,cb]);
			}
			else if (signature===DT.pint) {
				loadPInt.apply(this,[opts,datasize,datasize,cb]);
			}
			//simple array
			else if (signature===DT.utf8arr) {
				loadStringArray.apply(this,[opts,datasize,'utf8',cb]);
			}
			else if (signature===DT.ucs2arr) {
				loadStringArray.apply(this,[opts,datasize,'ucs2',cb]);
			}
			else if (signature===DT.uint8arr) {
				loadIntegerArray.apply(this,[opts,datasize,1,cb]);
			}
			else if (signature===DT.int32arr) {
				loadIntegerArray.apply(this,[opts,datasize,4,cb]);
			}
			//nested structure
			else if (signature===DT.array) {
				loadArray.apply(this,[opts,datasize,cb]);
			}
			else if (signature===DT.object) {
				loadObject.apply(this,[opts,datasize,cb]);
			}
			else {
				console.error('unsupported type',signature,opts)
				cb.apply(this,[null]);//make sure it return
				//throw 'unsupported type '+signature;
			}
	}

	var load=function(opts,cb) {
		opts=opts||{}; // this will served as context for entire load procedure
		opts.cur=opts.cur||0;
		var that=this;
		this.fs.readSignature(opts.cur, function(signature){
			loadbysignature.apply(that,[opts,signature,cb])
		});
		return this;
	}
	var CACHE=null;
	var KEY={};
	var reset=function(cb) {
		if (!CACHE) {
			load.apply(this,[{cur:0,lazy:true},function(data){
				CACHE=data;
				cb.call(this);
			}]);	
		} else {
			cb.call(this);
		}
	}

	var exists=function(path,cb) {
		if (path.length==0) return true;
		var key=path.pop();
		var that=this;
		get.apply(this,[path,false,function(data){
			if (!path.join('\0')) return (!!KEY[key]);
			var keys=KEY[path.join('\0')];
			path.push(key);//put it back
			if (keys) cb.apply(that,[keys.indexOf(key)>-1]);
			else cb.apply(that,[false]);
		}]);
	}

	var getSync=function(path) {
		if (!CACHE) return undefined;	
		var o=CACHE;
		for (var i=0;i<path.length;i++) {
			var r=o[path[i]] ;
			if (r===undefined) return undefined;
			o=r;
		}
		return o;
	}
	var get=function(path,recursive,cb) {
		if (typeof path=='undefined') path=[];
		if (typeof path=="string") path=[path];
		if (typeof recursive=='function') {
			cb=recursive;
			recursive=false;
		}
		recursive=recursive||false;
		var that=this;
		if (typeof cb!='function') return getSync(path);

		reset.apply(this,[function(){

			var o=CACHE;

			if (path.length==0) {
				cb(Object.keys(CACHE));
				return;
			} 
			
			var pathnow="",taskqueue=[],opts={},r=null;
			var lastkey="";
			for (var i=0;i<path.length;i++) {
				var task=(function(key,k){

					return (function(data){
						if (!(typeof data=='object' && data.__empty)) {
							if (typeof o[lastkey]=='string' && o[lastkey][0]=="\0") o[lastkey]={};
							o[lastkey]=data; 
							o=o[lastkey];
							r=data[key];
							KEY[pathnow]=opts.keys;
						} else {
							data=o[key];
							r=data;
						}

						if (r===undefined) {
							taskqueue=null;
							cb.apply(that,[r]); //return empty value
						} else {							
							if (parseInt(k)) pathnow+="\0";
							pathnow+=key;
							if (typeof r=='string' && r[0]=="\0") { //offset of data to be loaded
								var p=r.substring(1).split("\0").map(function(item){return parseInt(item,16)});
								var cur=p[0],sz=p[1];
								opts.lazy=!recursive || (k<path.length-1) ;
								opts.blocksize=sz;opts.cur=cur,opts.keys=[];
								load.apply(that,[opts, taskqueue.shift()]);
								lastkey=key;
							} else {
								var next=taskqueue.shift();
								next.apply(that,[r]);
							}
						}
					})
				})
				(path[i],i);
				
				taskqueue.push(task);
			}

			if (taskqueue.length==0) {
				cb.apply(that,[o]);
			} else {
				//last call to child load
				taskqueue.push(function(data){
					var key=path[path.length-1];
					o[key]=data; KEY[pathnow]=opts.keys;
					cb.apply(that,[data]);
				});
				taskqueue.shift()({__empty:true});			
			}

		}]); //reset
	}
	// get all keys in given path
	var getkeys=function(path,cb) {
		if (!path) path=[]
		var that=this;
		get.apply(this,[path,false,function(){
			if (path && path.length) {
				cb.apply(that,[KEY[path.join("\0")]]);
			} else {
				cb.apply(that,[Object.keys(CACHE)]); 
				//top level, normally it is very small
			}
		}]);
	}

	var setupapi=function() {
		this.load=load;
//		this.cur=0;
		this.cache=function() {return CACHE};
		this.key=function() {return KEY};
		this.free=function() {
			CACHE=null;
			KEY=null;
			this.fs.free();
		}
		this.setCache=function(c) {CACHE=c};
		this.keys=getkeys;
		this.get=get;   // get a field, load if needed
		this.exists=exists;
		this.DT=DT;
		
		//install the sync version for node
		if (typeof process!="undefined") require("./kdb_sync")(this);
		//if (cb) setTimeout(cb.bind(this),0);
		if (cb) cb(this);
	}
	var that=this;
	var kfs=new Kfs(path,opts,function(){
		that.size=this.size;
		setupapi.call(that);
	});
	this.fs=kfs;
	return this;
}

Create.datatypes=DT;

if (module) module.exports=Create;
//return Create;

});
require.register("ksana-document/kdbfs.js", function(exports, require, module){
/* OS dependent file operation */
if (typeof nodeRequire=='undefined')var nodeRequire=require;
if (typeof process=="undefined") {
	var fs=require('./html5fs');
	var Buffer=function(){ return ""};
	var html5fs=true;
} else {
	var fs=nodeRequire('fs');
	var Buffer=nodeRequire("buffer").Buffer;
}

var signature_size=1;
var verbose=0, readLog=function(){};
var _readLog=function(readtype,bytes) {
	console.log(readtype,bytes,"bytes");
}
if (verbose) readLog=_readLog;

var unpack_int = function (ar, count , reset) {
   count=count||ar.length;
   /*
	if (typeof ijs_unpack_int == 'function') {
		var R = ijs_unpack_int(ar, count, reset)
		return R
	};
	*/
  var r = [], i = 0, v = 0;
  do {
	var shift = 0;
	do {
	  v += ((ar[i] & 0x7F) << shift);
	  shift += 7;	  
	} while (ar[++i] & 0x80);
	r.push(v); if (reset) v=0;
	count--;
  } while (i<ar.length && count);
  return {data:r, adv:i };
}
var Open=function(path,opts,cb) {
	opts=opts||{};

	var readSignature=function(pos,cb) {
		var buf=new Buffer(signature_size);
		var that=this;
		fs.read(this.handle,buf,0,signature_size,pos,function(err,len,buffer){
			if (html5fs) var signature=String.fromCharCode((new Uint8Array(buffer))[0])
			else var signature=buffer.toString('utf8',0,signature_size);
			cb.apply(that,[signature]);
		});
	}

	//this is quite slow
	//wait for StringView +ArrayBuffer to solve the problem
	//https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/ylgiNY_ZSV0
	//if the string is always ucs2
	//can use Uint16 to read it.
	//http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  var decodeutf8 = function (utftext) {
        var string = "";
        var i = 0;
        var c=0,c1 = 0, c2 = 0;
 				for (var i=0;i<utftext.length;i++) {
 					if (utftext.charCodeAt(i)>127) break;
 				}
 				if (i>=utftext.length) return utftext;

        while ( i < utftext.length ) {
 
            c = utftext.charCodeAt(i);
 
            if (c < 128) {
                string += utftext[i];
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
 
        }
 
        return string;
  }

	var readString= function(pos,blocksize,encoding,cb) {
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		var that=this;
		fs.read(this.handle,buffer,0,blocksize,pos,function(err,len,buffer){
			readLog("string",len);
			if (html5fs) {
				if (encoding=='utf8') {
					var str=decodeutf8(String.fromCharCode.apply(null, new Uint8Array(buffer)))
				} else { //ucs2 is 3 times faster
					var str=String.fromCharCode.apply(null, new Uint16Array(buffer))	
				}
				
				cb.apply(that,[str]);
			} 
			else cb.apply(that,[buffer.toString(encoding)]);	
		});
	}

	//work around for chrome fromCharCode cannot accept huge array
	//https://code.google.com/p/chromium/issues/detail?id=56588
	var buf2stringarr=function(buf,enc) {
		if (enc=="utf8") 	var arr=new Uint8Array(buf);
		else var arr=new Uint16Array(buf);
		var i=0,codes=[],out=[];
		while (i<arr.length) {
			if (arr[i]) {
				codes.push(arr[i]);
			} else {
				var s=String.fromCharCode.apply(null,codes);
				if (enc=="utf8") out.push(decodeutf8(s));
				else out.push(s);
				codes=[];				
			}
			i++;
		}
		
		s=String.fromCharCode.apply(null,codes);
		if (enc=="utf8") out.push(decodeutf8(s));
		else out.push(s);

		return out;
	}
	var readStringArray = function(pos,blocksize,encoding,cb) {
		var that=this,out=null;
		if (blocksize==0) return [];
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		fs.read(this.handle,buffer,0,blocksize,pos,function(err,len,buffer){
		  
		  if (html5fs) {
	  		readLog("stringArray",buffer.byteLength);
			if (encoding=='utf8') {
				out=buf2stringarr(buffer,"utf8");
			} else { //ucs2 is 3 times faster
				out=buf2stringarr(buffer,"ucs2");
			}
		  } else {
			readLog("stringArray",buffer.length);
			out=buffer.toString(encoding).split('\0');
		  } 	
		  cb.apply(that,[out]);
		});
	}
	var readUI32=function(pos,cb) {
		var buffer=new Buffer(4);
		var that=this;
		fs.read(this.handle,buffer,0,4,pos,function(err,len,buffer){
			readLog("ui32",len);
			if (html5fs){
				//v=(new Uint32Array(buffer))[0];
				var v=new DataView(buffer).getUint32(0, false)
				cb(v);
			}
			else cb.apply(that,[buffer.readInt32BE(0)]);	
		});
		
	}

	var readI32=function(pos,cb) {
		var buffer=new Buffer(4);
		var that=this;
		fs.read(this.handle,buffer,0,4,pos,function(err,len,buffer){
			readLog("i32",len);
			if (html5fs){
				var v=new DataView(buffer).getInt32(0, false)
				cb(v);
			}
			else  	cb.apply(that,[buffer.readInt32BE(0)]);	
		});
	}
	var readUI8=function(pos,cb) {
		var buffer=new Buffer(1);
		var that=this;

		fs.read(this.handle,buffer,0,1,pos,function(err,len,buffer){
			readLog("ui8",len);
			if (html5fs)cb( (new Uint8Array(buffer))[0]) ;
			else  			cb.apply(that,[buffer.readUInt8(0)]);	
			
		});
	}
	var readBuf=function(pos,blocksize,cb) {
		var that=this;
		var buf=new Buffer(blocksize);
		fs.read(this.handle,buf,0,blocksize,pos,function(err,len,buffer){
			readLog("buf",len);
			/*
			var buff=[];
			for (var i=0;i<len;i++) {
				buff[i]=buffer.charCodeAt(i);
			}
			*/
			var buff=new Uint8Array(buffer)
			cb.apply(that,[buff]);
		});
	}
	var readBuf_packedint=function(pos,blocksize,count,reset,cb) {
		var that=this;
		readBuf.apply(this,[pos,blocksize,function(buffer){
			cb.apply(that,[unpack_int(buffer,count,reset)]);	
		}]);
		
	}
	var readFixedArray_html5fs=function(pos,count,unitsize,cb) {
		var func=null;
		/*
		var buf2UI32BE=function(buf,p) {
			return buf.charCodeAt(p)*256*256*256
					+buf.charCodeAt(p+1)*256*256
					+buf.charCodeAt(p+2)*256+buf.charCodeAt(p+3);
		}
		var buf2UI16BE=function(buf,p) {
			return buf.charCodeAt(p)*256
					+buf.charCodeAt(p+1);
		}
		var buf2UI8=function(buf,p) {
			return buf.charCodeAt(p);
		}
		*/
		if (unitsize===1) {
			func='getUint8';//Uint8Array;
		} else if (unitsize===2) {
			func='getUint16';//Uint16Array;
		} else if (unitsize===4) {
			func='getUint32';//Uint32Array;
		} else throw 'unsupported integer size';

		fs.read(this.handle,null,0,unitsize*count,pos,function(err,len,buffer){
			readLog("fix array",len);
			var out=[];
			if (unitsize==1) {
				out=new Uint8Array(buffer);
			} else {
				for (var i = 0; i < len / unitsize; i++) { //endian problem
				//	out.push( func(buffer,i*unitsize));
					out.push( v=new DataView(buffer)[func](i,false) );
				}
			}

			cb.apply(that,[out]);
		});
	}
	// signature, itemcount, payload
	var readFixedArray = function(pos ,count, unitsize,cb) {
		var func=null;
		var that=this;
		
		if (unitsize* count>this.size && this.size)  {
			console.log("array size exceed file size",this.size)
			return;
		}
		
		if (html5fs) return readFixedArray_html5fs.apply(this,[pos,count,unitsize,cb]);

		var items=new Buffer( unitsize* count);
		if (unitsize===1) {
			func=items.readUInt8;
		} else if (unitsize===2) {
			func=items.readUInt16BE;
		} else if (unitsize===4) {
			func=items.readUInt32BE;
		} else throw 'unsupported integer size';
		//console.log('itemcount',itemcount,'buffer',buffer);

		fs.read(this.handle,items,0,unitsize*count,pos,function(err,len,buffer){
			readLog("fix array",len);
			var out=[];
			for (var i = 0; i < items.length / unitsize; i++) {
				out.push( func.apply(items,[i*unitsize]));
			}
			cb.apply(that,[out]);
		});
	}

	var free=function() {
		//console.log('closing ',handle);
		fs.closeSync(this.handle);
	}
	var setupapi=function() {
		var that=this;
		this.readSignature=readSignature;
		this.readI32=readI32;
		this.readUI32=readUI32;
		this.readUI8=readUI8;
		this.readBuf=readBuf;
		this.readBuf_packedint=readBuf_packedint;
		this.readFixedArray=readFixedArray;
		this.readString=readString;
		this.readStringArray=readStringArray;
		this.signature_size=signature_size;
		this.free=free;
		if (html5fs) {
		    var fn=path;
		    if (path.indexOf("filesystem:")==0) fn=path.substr(path.lastIndexOf("/"));
		    fs.fs.root.getFile(fn,{},function(entry){
		      entry.getMetadata(function(metadata) { 
		        that.size=metadata.size;
		        if (cb) setTimeout(cb.bind(that),0);
		        });
		    });
		} else {
			var stat=fs.fstatSync(this.handle);
			this.stat=stat;
			this.size=stat.size;		
			if (cb)	setTimeout(cb.bind(this),0);	
		}
	}
	
	//handle=fs.openSync(path,'r');
	//console.log('watching '+path);
	var that=this;
	if (html5fs) {
		fs.open(path,function(h){
			that.handle=h;
			that.html5fs=true;
			setupapi.call(that);
			that.opened=true;
		})
	} else {
		this.handle=fs.openSync(path,'r');//,function(err,handle){
		this.opened=true;
		setupapi.call(this);
	}
	//console.log('file size',path,this.size);	
	return this;
}
module.exports=Open;

});
require.register("ksana-document/kdbw.js", function(exports, require, module){
/*
  convert any json into a binary buffer
  the buffer can be saved with a single line of fs.writeFile
*/

var DT={
	uint8:'1', //unsigned 1 byte integer
	int32:'4', // signed 4 bytes integer
	utf8:'8',  
	ucs2:'2',
	bool:'^', 
	blob:'&',
	utf8arr:'*', //shift of 8
	ucs2arr:'@', //shift of 2
	uint8arr:'!', //shift of 1
	int32arr:'$', //shift of 4
	vint:'`',
	pint:'~',	

	array:'\u001b',
	object:'\u001a' 
	//ydb start with object signature,
	//type a ydb in command prompt shows nothing
}
var key_writing="";//for debugging
var pack_int = function (ar, savedelta) { // pack ar into
  if (!ar || ar.length === 0) return []; // empty array
  var r = [],
  i = 0,
  j = 0,
  delta = 0,
  prev = 0;
  
  do {
	delta = ar[i];
	if (savedelta) {
		delta -= prev;
	}
	if (delta < 0) {
	  console.trace('negative',prev,ar[i],ar)
	  throw 'negetive';
	  break;
	}
	
	r[j++] = delta & 0x7f;
	delta >>= 7;
	while (delta > 0) {
	  r[j++] = (delta & 0x7f) | 0x80;
	  delta >>= 7;
	}
	prev = ar[i];
	i++;
  } while (i < ar.length);
  return r;
}
var Kfs=function(path,opts) {
	
	var handle=null;
	opts=opts||{};
	opts.size=opts.size||65536*2048; 
	console.log('kdb estimate size:',opts.size);
	var dbuf=new Buffer(opts.size);
	var cur=0;//dbuf cursor
	
	var writeSignature=function(value,pos) {
		dbuf.write(value,pos,value.length,'utf8');
		if (pos+value.length>cur) cur=pos+value.length;
		return value.length;
	}
	var writeOffset=function(value,pos) {
		dbuf.writeUInt8(Math.floor(value / (65536*65536)),pos);
		dbuf.writeUInt32BE( value & 0xFFFFFFFF,pos+1);
		if (pos+5>cur) cur=pos+5;
		return 5;
	}
	var writeString= function(value,pos,encoding) {
		encoding=encoding||'ucs2';
		if (value=="") throw "cannot write null string";
		if (encoding==='utf8')dbuf.write(DT.utf8,pos,1,'utf8');
		else if (encoding==='ucs2')dbuf.write(DT.ucs2,pos,1,'utf8');
		else throw 'unsupported encoding '+encoding;
			
		var len=Buffer.byteLength(value, encoding);
		dbuf.write(value,pos+1,len,encoding);
		
		if (pos+len+1>cur) cur=pos+len+1;
		return len+1; // signature
	}
	var writeStringArray = function(value,pos,encoding) {
		encoding=encoding||'ucs2';
		if (encoding==='utf8') dbuf.write(DT.utf8arr,pos,1,'utf8');
		else if (encoding==='ucs2')dbuf.write(DT.ucs2arr,pos,1,'utf8');
		else throw 'unsupported encoding '+encoding;
		
		var v=value.join('\0');
		var len=Buffer.byteLength(v, encoding);
		if (0===len) throw "empty string array " + key_writing;
		dbuf.write(v,pos+1,len,encoding);
		if (pos+len+1>cur) cur=pos+len+1;
		return len+1;
	}
	var writeI32=function(value,pos) {
		dbuf.write(DT.int32,pos,1,'utf8');
		dbuf.writeInt32BE(value,pos+1);
		if (pos+5>cur) cur=pos+5;
		return 5;
	}
	var writeUI8=function(value,pos) {
		dbuf.write(DT.uint8,pos,1,'utf8');
		dbuf.writeUInt8(value,pos+1);
		if (pos+2>cur) cur=pos+2;
		return 2;
	}
	var writeBool=function(value,pos) {
		dbuf.write(DT.bool,pos,1,'utf8');
		dbuf.writeUInt8(Number(value),pos+1);
		if (pos+2>cur) cur=pos+2;
		return 2;
	}		
	var writeBlob=function(value,pos) {
		dbuf.write(DT.blob,pos,1,'utf8');
		value.copy(dbuf, pos+1);
		var written=value.length+1;
		if (pos+written>cur) cur=pos+written;
		return written;
	}		
	/* no signature */
	var writeFixedArray = function(value,pos,unitsize) {
		//console.log('v.len',value.length,items.length,unitsize);
		if (unitsize===1) var func=dbuf.writeUInt8;
		else if (unitsize===4)var func=dbuf.writeInt32BE;
		else throw 'unsupported integer size';
		if (!value.length) {
			throw "empty fixed array "+key_writing;
		}
		for (var i = 0; i < value.length ; i++) {
			func.apply(dbuf,[value[i],i*unitsize+pos])
		}
		var len=unitsize*value.length;
		if (pos+len>cur) cur=pos+len;
		return len;
	}

	this.writeI32=writeI32;
	this.writeBool=writeBool;
	this.writeBlob=writeBlob;
	this.writeUI8=writeUI8;
	this.writeString=writeString;
	this.writeSignature=writeSignature;
	this.writeOffset=writeOffset; //5 bytes offset
	this.writeStringArray=writeStringArray;
	this.writeFixedArray=writeFixedArray;
	Object.defineProperty(this, "buf", {get : function(){ return dbuf; }});
	
	return this;
}

var Create=function(path,opts) {
	opts=opts||{};
	var kfs=new Kfs(path,opts);
	var cur=0;

	var handle={};
	
	//no signature
	var writeVInt =function(arr) {
		var o=pack_int(arr,false);
		kfs.writeFixedArray(o,cur,1);
		cur+=o.length;
	}
	var writeVInt1=function(value) {
		writeVInt([value]);
	}
	//for postings
	var writePInt =function(arr) {
		var o=pack_int(arr,true);
		kfs.writeFixedArray(o,cur,1);
		cur+=o.length;
	}
	
	var saveVInt = function(arr,key) {
		var start=cur;
		key_writing=key;
		cur+=kfs.writeSignature(DT.vint,cur);
		writeVInt(arr);
		var written = cur-start;
		pushitem(key,written);
		return written;		
	}
	var savePInt = function(arr,key) {
		var start=cur;
		key_writing=key;
		cur+=kfs.writeSignature(DT.pint,cur);
		writePInt(arr);
		var written = cur-start;
		pushitem(key,written);
		return written;	
	}

	
	var saveUI8 = function(value,key) {
		var written=kfs.writeUI8(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}
	var saveBool=function(value,key) {
		var written=kfs.writeBool(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}
	var saveI32 = function(value,key) {
		var written=kfs.writeI32(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}	
	var saveString = function(value,key,encoding) {
		encoding=encoding||stringencoding;
		key_writing=key;
		var written=kfs.writeString(value,cur,encoding);
		cur+=written;
		pushitem(key,written);
		return written;
	}
	var saveStringArray = function(arr,key,encoding) {
		encoding=encoding||stringencoding;
		key_writing=key;
		var written=kfs.writeStringArray(arr,cur,encoding);
		cur+=written;
		pushitem(key,written);
		return written;
	}
	
	var saveBlob = function(value,key) {
		key_writing=key;
		var written=kfs.writeBlob(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}

	var folders=[];
	var pushitem=function(key,written) {
		var folder=folders[folders.length-1];	
		if (!folder) return ;
		folder.itemslength.push(written);
		if (key) {
			if (!folder.keys) throw 'cannot have key in array';
			folder.keys.push(key);
		}
	}	
	var open = function(opt) {
		var start=cur;
		var key=opt.key || null;
		var type=opt.type||DT.array;
		cur+=kfs.writeSignature(type,cur);
		cur+=kfs.writeOffset(0x0,cur); // pre-alloc space for offset
		var folder={
			type:type, key:key,
			start:start,datastart:cur,
			itemslength:[] };
		if (type===DT.object) folder.keys=[];
		folders.push(folder);
	}
	var openObject = function(key) {
		open({type:DT.object,key:key});
	}
	var openArray = function(key) {
		open({type:DT.array,key:key});
	}
	var saveInts=function(arr,key,func) {
		func.apply(handle,[arr,key]);
	}
	var close = function(opt) {
		if (!folders.length) throw 'empty stack';
		var folder=folders.pop();
		//jump to lengths and keys
		kfs.writeOffset( cur-folder.datastart, folder.datastart-5);
		var itemcount=folder.itemslength.length;
		//save lengths
		writeVInt1(itemcount);
		writeVInt(folder.itemslength);
		
		if (folder.type===DT.object) {
			//use utf8 for keys
			cur+=kfs.writeStringArray(folder.keys,cur,'utf8');
		}
		written=cur-folder.start;
		pushitem(folder.key,written);
		return written;
	}
	
	
	var stringencoding='ucs2';
	var stringEncoding=function(newencoding) {
		if (newencoding) stringencoding=newencoding;
		else return stringencoding;
	}
	
	var allnumber_fast=function(arr) {
		if (arr.length<5) return allnumber(arr);
		if (typeof arr[0]=='number'
		    && Math.round(arr[0])==arr[0] && arr[0]>=0)
			return true;
		return false;
	}
	var allstring_fast=function(arr) {
		if (arr.length<5) return allstring(arr);
		if (typeof arr[0]=='string') return true;
		return false;
	}	
	var allnumber=function(arr) {
		for (var i=0;i<arr.length;i++) {
			if (typeof arr[i]!=='number') return false;
		}
		return true;
	}
	var allstring=function(arr) {
		for (var i=0;i<arr.length;i++) {
			if (typeof arr[i]!=='string') return false;
		}
		return true;
	}
	var getEncoding=function(key,encs) {
		var enc=encs[key];
		if (!enc) return null;
		if (enc=='delta' || enc=='posting') {
			return savePInt;
		} else if (enc=="variable") {
			return saveVInt;
		}
		return null;
	}
	var save=function(J,key,opts) {
		opts=opts||{};
		
		if (typeof J=="null" || typeof J=="undefined") {
			throw 'cannot save null value of ['+key+'] folders'+JSON.stringify(folders);
			return;
		}
		var type=J.constructor.name;
		if (type==='Object') {
			openObject(key);
			for (var i in J) {
				save(J[i],i,opts);
				if (opts.autodelete) delete J[i];
			}
			close();
		} else if (type==='Array') {
			if (allnumber_fast(J)) {
				if (J.sorted) { //number array is sorted
					saveInts(J,key,savePInt);	//posting delta format
				} else {
					saveInts(J,key,saveVInt);	
				}
			} else if (allstring_fast(J)) {
				saveStringArray(J,key);
			} else {
				openArray(key);
				for (var i=0;i<J.length;i++) {
					save(J[i],null,opts);
					if (opts.autodelete) delete J[i];
				}
				close();
			}
		} else if (type==='String') {
			saveString(J,key);
		} else if (type==='Number') {
			if (J>=0&&J<256) saveUI8(J,key);
			else saveI32(J,key);
		} else if (type==='Boolean') {
			saveBool(J,key);
		} else if (type==='Buffer') {
			saveBlob(J,key);
		} else {
			throw 'unsupported type '+type;
		}
	}
	
	var free=function() {
		while (folders.length) close();
		kfs.free();
	}
	var currentsize=function() {
		return cur;
	}

	Object.defineProperty(handle, "size", {get : function(){ return cur; }});

	var writeFile=function(fn,opts,cb) {
		var fs=require('fs');
		var totalbyte=handle.currentsize();
		var written=0,batch=0;
		
		if (typeof cb=="undefined" || typeof opts=="function") { //do not have
			cb=opts;
		}
		opts=opts||{};
		batchsize=opts.batchsize||1024*1024*16; //16 MB

		if (fs.existsSync(fn)) fs.unlinkSync(fn);

		var writeCb=function(total,written,cb,next) {
			return function(err) {
				if (err) throw "write error"+err;
				cb(total,written);
				batch++;
				next();
			}
		}

		var next=function() {
			if (batch<batches) {
				var bufstart=batchsize*batch;
				var bufend=bufstart+batchsize;
				if (bufend>totalbyte) bufend=totalbyte;
				var sliced=kfs.buf.slice(bufstart,bufend);
				written+=sliced.length;
				fs.appendFile(fn,sliced,writeCb(totalbyte,written, cb,next));
			}
		}
		var batches=1+Math.floor(handle.size/batchsize);
		next();
	}
	handle.free=free;
	handle.saveI32=saveI32;
	handle.saveUI8=saveUI8;
	handle.saveBool=saveBool;
	handle.saveString=saveString;
	handle.saveVInt=saveVInt;
	handle.savePInt=savePInt;
	handle.saveInts=saveInts;
	handle.saveBlob=saveBlob;
	handle.save=save;
	handle.openArray=openArray;
	handle.openObject=openObject;
	handle.stringEncoding=stringEncoding;
	//this.integerEncoding=integerEncoding;
	handle.close=close;
	handle.writeFile=writeFile;
	handle.currentsize=currentsize;
	return handle;
}

module.exports=Create;
});
require.register("ksana-document/kdb_sync.js", function(exports, require, module){
/*
  syncronize version of kdb, taken from yadb
*/
var Kfs=require('./kdbfs_sync');

var Sync=function(kdb) {
	DT=kdb.DT;
	kfs=Kfs(kdb.fs);
	var cur=0;
	/* loadxxx functions move file pointer */
	// load variable length int
	var loadVInt =function(blocksize,count) {
		if (count==0) return [];
		var o=kfs.readBuf_packedintSync(cur,blocksize,count,true);
		cur+=o.adv;
		return o.data;
	}
	var loadVInt1=function() {
		return loadVInt(6,1)[0];
	}
	//for postings
	var loadPInt =function(blocksize,count) {
		var o=kfs.readBuf_packedintSync(cur,blocksize,count,false);
		cur+=o.adv;
		return o.data;
	}
	// item can be any type (variable length)
	// maximum size of array is 1TB 2^40
	// structure:
	// signature,5 bytes offset, payload, itemlengths
	var loadArray = function(blocksize,lazy) {
		var lengthoffset=kfs.readUI8Sync(cur)*4294967296;
		lengthoffset+=kfs.readUI32Sync(cur+1);
		cur+=5;
		var dataoffset=cur;
		cur+=lengthoffset;
		var count=loadVInt1();
		var sz=loadVInt(count*6,count);
		var o=[];
		var endcur=cur;
		cur=dataoffset; 
		for (var i=0;i<count;i++) {
			if (lazy) { 
				//store the offset instead of loading from disk
				var offset=dataoffset;
				for (var i=0;i<sz.length;i++) {
				//prefix with a \0, impossible for normal string
					o.push("\0"+offset.toString(16)
						   +"\0"+sz[i].toString(16));
					offset+=sz[i];
				}
			} else {			
				o.push(load({blocksize:sz[i]}));
			}
		}
		cur=endcur;
		return o;
	}		
	// item can be any type (variable length)
	// support lazy load
	// structure:
	// signature,5 bytes offset, payload, itemlengths, 
	//                    stringarray_signature, keys
	var loadObject = function(blocksize,lazy, keys) {
		var start=cur;
		var lengthoffset=kfs.readUI8Sync(cur)*4294967296;
		lengthoffset+=kfs.readUI32Sync(cur+1);cur+=5;
		var dataoffset=cur;
		cur+=lengthoffset;
		var count=loadVInt1();
		var lengths=loadVInt(count*6,count);
		var keyssize=blocksize-cur+start;	
		var K=load({blocksize:keyssize});
		var o={};
		var endcur=cur;
		
		if (lazy) { 
			//store the offset instead of loading from disk
			var offset=dataoffset;
			for (var i=0;i<lengths.length;i++) {
				//prefix with a \0, impossible for normal string
				o[K[i]]="\0"+offset.toString(16)
					   +"\0"+lengths[i].toString(16);
				offset+=lengths[i];
			}
		} else {
			cur=dataoffset; 
			for (var i=0;i<count;i++) {
				o[K[i]]=(load({blocksize:lengths[i]}));
			}
		}
		if (keys) K.map(function(r) { keys.push(r)});
		cur=endcur;
		return o;
	}		
	//item is same known type
	var loadStringArray=function(blocksize,encoding) {
		var o=kfs.readStringArraySync(cur,blocksize,encoding);
		cur+=blocksize;
		return o;
	}
	var loadIntegerArray=function(blocksize,unitsize) {
		var count=loadVInt1();
		var o=kfs.readFixedArraySync(cur,count,unitsize);
		cur+=count*unitsize;
		return o;
	}
	var loadBlob=function(blocksize) {
		var o=kfs.readBufSync(cur,blocksize);
		cur+=blocksize;
		return o;
	}	
	
	var load=function(opts) {
		opts=opts||{};
		var blocksize=opts.blocksize||kfs.size; 
		var signature=kfs.readSignatureSync(cur);
		cur+=kfs.signature_size;
		var datasize=blocksize-kfs.signature_size;
		//basic types
		if (signature===DT.int32) {
			cur+=4;
			return kfs.readI32Sync(cur-4);
		} else if (signature===DT.uint8) {
			cur++;
			return kfs.readUI8Sync(cur-1);
		} else if (signature===DT.utf8) {
			var c=cur;cur+=datasize;
			return kfs.readStringSync(c,datasize,'utf8');	
		} else if (signature===DT.ucs2) {
			var c=cur;cur+=datasize;
			return kfs.readStringSync(c,datasize,'ucs2');	
		} else if (signature===DT.bool) {
			cur++;
			return !!(kfs.readUI8Sync(cur-1));
		} else if (signature===DT.blob) {
			return loadBlob(datasize);
		}
		//variable length integers
		else if (signature===DT.vint) return loadVInt(datasize);
		else if (signature===DT.pint) return loadPInt(datasize);
		//simple array
		else if (signature===DT.utf8arr) return loadStringArray(datasize,'utf8');
		else if (signature===DT.ucs2arr) return loadStringArray(datasize,'ucs2');
		else if (signature===DT.uint8arr) return loadIntegerArray(datasize,1);
		else if (signature===DT.int32arr) return loadIntegerArray(datasize,4);
		//nested structure
		else if (signature===DT.array) return loadArray(datasize,opts.lazy);
		else if (signature===DT.object) {
			return loadObject(datasize,opts.lazy,opts.keys);
		}
		else throw 'unsupported type '+signature;
	}
	var reset=function() {
		cur=0;
		kdb.setCache(load({lazy:true}));
	}
	var getall=function() {
		var output={};
		var keys=getkeys();
		for (var i in keys) {
			output[keys[i]]= get([keys[i]],true);
		}
		return output;
		
	}
	var exists=function(path) {
		if (path.length==0) return true;
		var key=path.pop();
		get(path);
		if (!path.join('\0')) return (!!kdb.key()[key]);
		var keys=kdb.key()[path.join('\0')];
		path.push(key);//put it back
		if (keys) return (keys.indexOf(key)>-1);
		else return false;
	}
	var get=function(path,recursive) {
		recursive=recursive||false;
		if (!kdb.cache()) reset();

		if (typeof path=="string") path=[path];
		var o=kdb.cache();
		if (path.length==0 &&recursive) return getall();
		var pathnow="";
		for (var i=0;i<path.length;i++) {
			var r=o[path[i]] ;

			if (r===undefined) return undefined;
			if (parseInt(i)) pathnow+="\0";
			pathnow+=path[i];
			if (typeof r=='string' && r[0]=="\0") { //offset of data to be loaded
				var keys=[];
				var p=r.substring(1).split("\0").map(
					function(item){return parseInt(item,16)});
				cur=p[0];
				var lazy=!recursive || (i<path.length-1) ;
				o[path[i]]=load({lazy:lazy,blocksize:p[1],keys:keys});
				kdb.key()[pathnow]=keys;
				o=o[path[i]];
			} else {
				o=r; //already in cache
			}
		}
		return o;
	}
	// get all keys in given path
	var getkeys=function(path) {
		if (!path) path=[]
		get(path); // make sure it is loaded
		if (path && path.length) {
			return kdb.key()[path.join("\0")];
		} else {
			return Object.keys(kdb.cache()); 
			//top level, normally it is very small
		}
		
	}

	kdb.loadSync=load;
	kdb.keysSync=getkeys;
	kdb.getSync=get;   // get a field, load if needed
	kdb.existsSync=exists;
	return kdb;
}

if (module) module.exports=Sync;

});
require.register("ksana-document/kdbfs_sync.js", function(exports, require, module){
/* OS dependent file operation */

var fs=require('fs');
var signature_size=1;

var unpack_int = function (ar, count , reset) {
   count=count||ar.length;
   /*
	if (typeof ijs_unpack_int == 'function') {
		var R = ijs_unpack_int(ar, count, reset)
		return R
	};
	*/
  var r = [], i = 0, v = 0;
  do {
	var shift = 0;
	do {
	  v += ((ar[i] & 0x7F) << shift);
	  shift += 7;	  
	} while (ar[++i] & 0x80);
	r.push(v); if (reset) v=0;
	count--;
  } while (i<ar.length && count);
  return {data:r, adv:i };
}
var Sync=function(kfs) {
	var handle=kfs.handle;

	var readSignature=function(pos) {
		var buf=new Buffer(signature_size);
		fs.readSync(handle,buf,0,signature_size,pos);
		var signature=buf.toString('utf8',0,signature_size);
		return signature;
	}
	var readString= function(pos,blocksize,encoding) {
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		fs.readSync(handle,buffer,0,blocksize,pos);
		return buffer.toString(encoding);
	}

	var readStringArray = function(pos,blocksize,encoding) {
		if (blocksize==0) return [];
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		fs.readSync(handle,buffer,0,blocksize,pos);
		var out=buffer.toString(encoding).split('\0');
		return out;
	}
	var readUI32=function(pos) {
		var buffer=new Buffer(4);
		fs.readSync(handle,buffer,0,4,pos);
		return buffer.readUInt32BE(0);
	}
	var readI32=function(pos) {
		var buffer=new Buffer(4);
		fs.readSync(handle,buffer,0,4,pos);
		return buffer.readInt32BE(0);
	}
	var readUI8=function(pos) {
		var buffer=new Buffer(1);
		fs.readSync(handle,buffer,0,1,pos);
		return buffer.readUInt8(0);
	}
	var readBuf=function(pos,blocksize) {
		var buf=new Buffer(blocksize);
		fs.readSync(handle,buf,0,blocksize,pos);
	
		return buf;
	}
	var readBuf_packedint=function(pos,blocksize,count,reset) {
		var buf=readBuf(pos,blocksize);
		return unpack_int(buf,count,reset);
	}
	// signature, itemcount, payload
	var readFixedArray = function(pos ,count, unitsize) {
		var func;
		
		if (unitsize* count>this.size && this.size)  {
			throw "array size exceed file size"
			return;
		}
		
		var items=new Buffer( unitsize* count);
		if (unitsize===1) {
			func=items.readUInt8;
		} else if (unitsize===2) {
			func=items.readUInt16BE;
		} else if (unitsize===4) {
			func=items.readUInt32BE;
		} else throw 'unsupported integer size';
		//console.log('itemcount',itemcount,'buffer',buffer);
		fs.readSync(handle,items,0,unitsize*count,pos);
		var out=[];
		for (var i = 0; i < items.length / unitsize; i++) {
			out.push( func.apply(items,[i*unitsize]) );
		}
		return out;
	}
	
	kfs.readSignatureSync=readSignature;
	kfs.readI32Sync=readI32;
	kfs.readUI32Sync=readUI32;
	kfs.readUI8Sync=readUI8;
	kfs.readBufSync=readBuf;
	kfs.readBuf_packedintSync=readBuf_packedint;
	kfs.readFixedArraySync=readFixedArray;
	kfs.readStringSync=readString;
	kfs.readStringArraySync=readStringArray;
	kfs.signature_sizeSync=signature_size;
	
	return kfs;
}
module.exports=Sync;

});
require.register("ksana-document/html5fs.js", function(exports, require, module){
/*
http://stackoverflow.com/questions/3146483/html5-file-api-read-as-text-and-binary

automatic open file without user interaction
http://stackoverflow.com/questions/18251432/read-a-local-file-using-javascript-html5-file-api-offline-website

extension id
 chrome.runtime.getURL("vrimul.ydb")
"chrome-extension://nfdipggoinlpfldmfibcjdobcpckfgpn/vrimul.ydb"
 tell user to switch to the directory

 getPackageDirectoryEntry
*/

var read=function(handle,buffer,offset,length,position,cb) {	 //buffer and offset is not used
     var xhr = new XMLHttpRequest();
      xhr.open('GET', handle.url , true);
      var range=[position,length+position-1];
      xhr.setRequestHeader('Range', 'bytes='+range[0]+'-'+range[1]);
      xhr.responseType = 'arraybuffer';
      xhr.send();
      xhr.onload = function(e) {
          cb(0,this.response.byteLength,this.response);
      }; 
}

var close=function(handle) {
	//nop
}
var fstatSync=function(handle) {
  throw "not implement yet";
}
var fstat=function(handle,cb) {
  throw "not implement yet";
}
var _open=function(fn_url,cb) {
    var handle={};
    if (fn_url.indexOf("filesystem:")==0){
      handle.url=fn_url;
      handle.fn=fn_url.substr( fn_url.lastIndexOf("/")+1);
    } else {
      handle.fn=fn_url;
      var url=API.files.filter(function(f){ return (f[0]==fn_url)});
      if (url.length) handle.url=url[0][1];
    }
    cb(handle);//url as handle
}
var open=function(fn_url,cb) {
    if (!API.initialized) {init(1024*1024,function(){
      _open.apply(this,[fn_url,cb]);
    },this)} else _open.apply(this,[fn_url,cb]);
}
var load=function(filename,mode,cb) {
  open(filename,mode,cb,true);
}
var get_date=function(url,callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, true); // Notice "HEAD" instead of "GET", //  to get only the header
    xhr.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          callback(xhr.getResponseHeader("Last-Modified"));
        } else {
          if (this.status!==200&&this.status!==206) {
            callback("");
          }
        }
    };
    xhr.send();
}
var  getDownloadSize=function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, true); // Notice "HEAD" instead of "GET", //  to get only the header
    xhr.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          callback(parseInt(xhr.getResponseHeader("Content-Length")));
        } else {
          if (this.status!==200&&this.status!==206) {
            callback(0);//no such file     
          }
        }
    };
    xhr.send();
};
var checkUpdate=function(url,fn,cb) {
    get_date(url,function(d){
      API.fs.root.getFile(fn, {create: false, exclusive: false}, function(fileEntry) {
          fileEntry.getMetadata(function(metadata){
            var localDate=Date.parse(metadata.modificationTime);
            var urlDate=Date.parse(d);
            cb(urlDate>localDate);
          });
    },function(){//error
      cb(false); //missing local file
    });
  });
}
var download=function(url,fn,cb,statuscb,context) {
   var totalsize=0,batches=null,written=0;
   var createBatches=function(size) {
      var bytes=1024*1024, out=[];
      var b=Math.floor(size / bytes);
      var last=size %bytes;
      for (var i=0;i<=b;i++) {
        out.push(i*bytes);
      }
      out.push(b*bytes+last);
      return out;
   }
   var finish=function(srcEntry) { //remove old file and rename temp.kdb 
         rm(fn,function(){
            srcEntry.moveTo(srcEntry.filesystem.root, fn,function(){
              setTimeout( cb.bind(context,false) , 0) ; 
            },function(e){
              console.log("faile",e)
            });
         },this); 
   }
   var tempfn="temp.kdb";
    var batch=function(b) {
       var xhr = new XMLHttpRequest();
       var requesturl=url+"?"+Math.random();
       xhr.open('get', requesturl, true);
       xhr.setRequestHeader('Range', 'bytes='+batches[b]+'-'+(batches[b+1]-1));
       xhr.responseType = 'blob';    
       var create=(b==0);
       xhr.addEventListener('load', function() {
         var blob=this.response;
         API.fs.root.getFile(tempfn, {create: create, exclusive: false}, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
              fileWriter.seek(fileWriter.length);
              fileWriter.write(blob);
              written+=blob.size;
              fileWriter.onwriteend = function(e) {
                var abort=false;
                if (statuscb) {
                  abort=statuscb.apply(context,[ fileWriter.length / totalsize,totalsize ]);
                  if (abort) {
                      setTimeout( cb.bind(context,false) , 0) ;                     
                  }
                }
                b++;
                if (!abort) {
                  if (b<batches.length-1) {
                     setTimeout(batch.bind(this,b),0);
                  } else {
                      finish(fileEntry);
                  }                  
                }
              };
            }, console.error);
          }, console.error);
       },false);
       xhr.send();
    }
     //main
     getDownloadSize(url,function(size){
       totalsize=size;
       if (!size) {
          if (cb) cb.apply(context,[false]);
       } else {//ready to download
        rm(tempfn,function(){
           batches=createBatches(size);
           if (statuscb) statuscb.apply(context,[ 0, totalsize ]);
           batch(0);          
        },this);
      }
     });
}

var readFile=function(filename,cb,context) {
  API.fs.root.getFile(filename, function(fileEntry) {
      var reader = new FileReader();
      reader.onloadend = function(e) {
          if (cb) cb.apply(cb,[this.result]);
        };            
    }, console.error);
}
var writeFile=function(filename,buf,cb,context){
   API.fs.root.getFile(filename, {create: true, exclusive: true}, function(fileEntry) {
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.write(buf);
        fileWriter.onwriteend = function(e) {
          if (cb) cb.apply(cb,[buf.byteLength]);
        };            
      }, console.error);
    }, console.error);
}

var readdir=function(cb,context) {
   var dirReader = API.fs.root.createReader();
   var out=[],that=this;
    // Need to recursively read directories until there are no more results.
    dirReader.readEntries(function(entries) {
      if (entries.length) {
          for (var i = 0, entry; entry = entries[i]; ++i) {
            if (entry.isFile) {
              out.push([entry.name,entry.toURL ? entry.toURL() : entry.toURI()]);
            }
          }
      }
      API.files=out;
      if (cb) cb.apply(context,[out]);
    }, function(){
      if (cb) cb.apply(context,[null]);
    });
}
var getFileURL=function(filename) {
  if (!API.files ) return null;
  var file= API.files.filter(function(f){return f[0]==filename});
  if (file.length) return file[0][1];
}
var rm=function(filename,cb,context) {
   var url=getFileURL(filename);
   if (url) rmURL(url,cb,context);
   else if (cb) cb.apply(context,[false]);
}

var rmURL=function(filename,cb,context) {
    webkitResolveLocalFileSystemURL(filename, function(fileEntry) {
      fileEntry.remove(function() {
        if (cb) cb.apply(context,[true]);
      }, console.error);
    },  function(e){
      if (cb) cb.apply(context,[false]);//no such file
    });
}
var initfs=function(grantedBytes,cb,context) {
      webkitRequestFileSystem(PERSISTENT, grantedBytes,  function(fs) {
      API.fs=fs;
      API.quota=grantedBytes;
      readdir(function(){
        API.initialized=true;
        cb.apply(context,[grantedBytes,fs]);
      },context);
    }, console.error);
}
var init=function(quota,cb,context) {
  navigator.webkitPersistentStorage.requestQuota(quota, 
      function(grantedBytes) {

        initfs(grantedBytes,cb,context);
    }, console.error 
  );
}
var queryQuota=function(cb,context) {
    var that=this;
    navigator.webkitPersistentStorage.queryUsageAndQuota( 
     function(usage,quota){
        initfs(quota,function(){
          cb.apply(context,[usage,quota]);
        },context);
    });
}
//if (typeof navigator!="undefined" && navigator.webkitPersistentStorage) init(1024*1024);
var API={
  load:load
  ,open:open
  ,read:read
  ,fstatSync:fstatSync
  ,fstat:fstat,close:close
  ,init:init
  ,readdir:readdir
  ,checkUpdate:checkUpdate
  ,rm:rm
  ,rmURL:rmURL
  ,getFileURL:getFileURL
  ,getDownloadSize:getDownloadSize
  ,writeFile:writeFile
  ,readFile:readFile
  ,download:download
  ,queryQuota:queryQuota}

  module.exports=API;
});
require.register("ksana-document/kse.js", function(exports, require, module){
/*
  Ksana Search Engine.

  need a KDE instance to be functional
  
*/

var _search=function(engine,q,opts,cb) {
	if (typeof engine=="string") {//browser only
		//search on remote server
		var kde=Require("ksana-document").kde;
		var $kse=Require("ksanaforge-kse").$yase; 
		opts.dbid=engine;
		opts.q=q;
		$kse.search(opts,cb);
	} else {//nw or brower
		return require("./search")(engine,q,opts,cb);		
	}
}

var _highlightPage=function(engine,fileid,pageid,opts,cb){
	if (opts.q) {
		require("./search").main(engine,opts.q,opts,function(Q){
			api.excerpt.highlightPage(Q,fileid,pageid,opts,cb);
		});
	} else {
		api.excerpt.getPage(engine,fileid,pageid,cb);
	}
}
var api={
	search:_search
	,concordance:require("./concordance")
	,regex:require("./regex")
	,highlightPage:_highlightPage
	,excerpt:require("./excerpt")
}
module.exports=api;
});
require.register("ksana-document/kde.js", function(exports, require, module){
/* Ksana Database Engine
   middleware for client and server.
   each ydb has one engine instance.
   all data from server will be cache at client side to save network roundtrip.
*/
if (typeof nodeRequire=='undefined')var nodeRequire=require;
var pool={},localPool={};
var apppath="";

var _getSync=function(keys,recursive) {
	var out=[];
	for (var i in keys) {
		out.push(this.getSync(keys[i],recursive));	
	}
	return out;
}
var _gets=function(keys,recursive,cb) { //get many data with one call
	if (!keys) return ;
	if (typeof keys=='string') {
		keys=[keys];
	}
	var engine=this, output=[];

	var makecb=function(key){
		return function(data){
				if (!(data && typeof data =='object' && data.__empty)) output.push(data);
				engine.get(key,recursive,taskqueue.shift());
		};
	};

	var taskqueue=[];
	for (var i=0;i<keys.length;i++) {
		if (typeof keys[i]=="null") { //this is only a place holder for key data already in client cache
			output.push(null);
		} else {
			taskqueue.push(makecb(keys[i]));
		}
	};

	taskqueue.push(function(data){
		output.push(data);
		cb(output,keys); //return to caller
	});

	taskqueue.shift()({__empty:true}); //run the task
}

var toDoc=function(pagenames,texts,parents,reverts) {
	if (typeof Require!="undefined") {
		var D=Require("ksana-document").document;
	} else {
		var D=nodeRequire("./document");	
	}
	var d=D.createDocument() ,revert=null;
	for (var i=0;i<texts.length;i++) {
		if (reverts && reverts[i].trim()) revert=JSON.parse(reverts[i]);
		else revert=null;
		var p=null;
		if (parents) p=parents[i];
		d.createPage({n:pagenames[i],t:texts[i],p:p,r:revert});
	}
	d.endCreatePages();
	return d;
}
var getDocument=function(filename,cb){
	var engine=this;
	var filenames=engine.get("fileNames");
	
	var i=filenames.indexOf(filename);
	if (i==-1) {
		cb(null);
	} else {
		var files=engine.get(["files",i],true,function(file){
			var pagenames=file.pageNames;
			var parentId=file.parentId;
			var reverts=file.reverts;
			engine.get(["fileContents",i],true,function(data){
				cb(toDoc(pagenames,data,parentId,reverts));
			});			
		});
	}
}

var createLocalEngine=function(kdb,cb,context) {
	var engine={lastAccess:new Date(), kdb:kdb, queryCache:{}, postingCache:{}};

	if (kdb.fs.html5fs) {
		var customfunc=Require("ksana-document").customfunc;
	} else {
		var customfunc=nodeRequire("ksana-document").customfunc;	
	}	
	if (typeof context=="object") engine.context=context;
	engine.get=function(key,recursive,cb) {

		if (typeof recursive=="function") {
			cb=recursive;
			recursive=false;
		}
		if (!key) {
			if (cb) cb(null);
			return null;
		}

		if (typeof cb!="function") {
			if (kdb.fs.html5fs) {
				return engine.kdb.get(key,recursive,cb);
			} else {
				return engine.kdb.getSync(key,recursive);
			}
		}

		if (typeof key=="string") {
			return engine.kdb.get([key],recursive,cb);
		} else if (typeof key[0] =="string") {
			return engine.kdb.get(key,recursive,cb);
		} else if (typeof key[0] =="object") {
			return _gets.apply(engine,[key,recursive,cb]);
		} else {
			cb(null);	
		}
	};	
	engine.fileOffset=fileOffset;
	engine.folderOffset=folderOffset;
	engine.pageOffset=pageOffset;
	engine.getDocument=getDocument;
	//only local engine allow getSync
	if (!kdb.fs.html5fs)	engine.getSync=engine.kdb.getSync;
	var preload=[["meta"],["fileNames"],["fileOffsets"],["tokens"],["postingslen"]];

	var setPreload=function(res) {
		engine.dbname=res[0].name;
		engine.customfunc=customfunc.getAPI(res[0].config);
		engine.ready=true;
	}
	if (typeof cb=="function") {
		_gets.apply(engine,[  preload, true,function(res){
			setPreload(res);
			cb.apply(engine.context,[engine]);
		}]);
	} else {
		setPreload(_getSync.apply(engine,[preload,true]));
	}
	return engine;
}

var getRemote=function(key,recursive,cb) {
	var $kse=Require("ksanaforge-kse").$ksana; 
	var engine=this;
	if (!engine.ready) {
		console.error("remote connection not established yet");
		return;
	} 
	if (typeof recursive=="function") {
		cb=recursive;
		recursive=false;
	}
	recursive=recursive||false;
	if (typeof key=="string") key=[key];

	if (key[0] instanceof Array) { //multiple keys
		var keys=[],output=[];
		for (var i=0;i<key.length;i++) {
			var cachekey=key[i].join("\0");
			var data=engine.cache[cachekey];
			if (typeof data!="undefined") {
				keys.push(null);//  place holder for LINE 28
				output.push(data); //put cached data into output
			} else{
				engine.fetched++;
				keys.push(key[i]); //need to ask server
				output.push(null); //data is unknown yet
			}
		}
		//now ask server for unknown datum
		engine.traffic++;
		var opts={key:keys,recursive:recursive,db:engine.kdbid};
		$kse("get",opts).done(function(datum){
			//merge the server result with cached 
			for (var i=0;i<output.length;i++) {
				if (datum[i] && keys[i]) {
					var cachekey=keys[i].join("\0");
					engine.cache[cachekey]=datum[i];
					output[i]=datum[i];
				}
			}
			cb.apply(engine.context,[output]);	
		});
	} else { //single key
		var cachekey=key.join("\0");
		var data=engine.cache[cachekey];
		if (typeof data!="undefined") {
			if (cb) cb.apply(engine.context,[data]);
			return data;//in cache , return immediately
		} else {
			engine.traffic++;
			engine.fetched++;
			var opts={key:key,recursive:recursive,db:engine.kdbid};
			$kse("get",opts).done(function(data){
				engine.cache[cachekey]=data;
				if (cb) cb.apply(engine.context,[data]);	
			});
		}
	}
}
var pageOffset=function(fn,pagename,cb) {
	var engine=this;
	var filenames=engine.get("fileNames");
	var i=filenames.indexOf(fn);
	if (i==-1) return null;

	engine.get(["files",i],function(fileinfo){
		var j=fileinfo.pageNames.indexOf(pagename);
		if (j){
			cb.apply(engine.context,[{start: fileinfo.pageOffset[j] , end:fileinfo.pageOffset[j+1]}]);	
		} else cb.apply(engine.context,[null]);
	});
}
var fileOffset=function(fn) {
	var engine=this;
	var filenames=engine.get("fileNames");
	var offsets=engine.get("fileOffsets");
	var i=filenames.indexOf(fn);
	if (i==-1) return null;
	return {start: offsets[i], end:offsets[i+1]};
}

var folderOffset=function(folder) {
	var engine=this;
	var start=0,end=0;
	var filenames=engine.get("fileNames");
	var offsets=engine.get("fileOffsets");
	for (var i=0;i<filenames.length;i++) {
		if (filenames[i].substring(0,folder.length)==folder) {
			if (!start) start=offsets[i];
			end=offsets[i];
		} else if (start) break;
	}
	return {start:start,end:end};
}

var createEngine=function(kdbid,context,cb) {
	if (typeof context=="function"){
		cb=context;
	}
	//var link=Require("./link");
	var customfunc=Require("ksana-document").customfunc;
	var $kse=Require("ksanaforge-kse").$ksana; 
	var engine={lastAccess:new Date(), kdbid:kdbid, cache:{} , 
	postingCache:{}, queryCache:{}, traffic:0,fetched:0};
	engine.setContext=function(ctx) {this.context=ctx};
	engine.get=getRemote;
	engine.fileOffset=fileOffset;
	engine.folderOffset=folderOffset;
	engine.pageOffset=pageOffset;
	engine.getDocument=getDocument;
	if (typeof context=="object") engine.context=context;

	//engine.findLinkBy=link.findLinkBy;
	$kse("get",{key:[["meta"],["fileNames"],["fileOffsets"],["tokens"],["postingslen"]], recursive:true,db:kdbid}).done(function(res){
		engine.dbname=res[0].name;

		engine.cache["fileNames"]=res[1];
		engine.cache["fileOffsets"]=res[2];
		engine.cache["tokens"]=res[3];
		engine.cache["postingslen"]=res[4];
//		engine.cache["tokenId"]=res[4];
//		engine.cache["files"]=res[2];

		engine.customfunc=customfunc.getAPI(res[0].config);
		engine.cache["meta"]=res[0]; //put into cache manually

		engine.ready=true;
		//console.log("remote kde connection ["+kdbid+"] established.");
		if (cb) cb.apply(context,[engine]);
	})


	return engine;
}
 
var closeLocal=function(kdbid) {
	var engine=localPool[kdbid];
	if (engine) {
		engine.kdb.free();
		delete localPool[kdbid];
	}
}
var close=function(kdbid) {
	var engine=pool[kdbid];
	if (engine) delete pool[kdbid];
}
var open=function(kdbid,cb,context) {
	if (typeof io=="undefined") { //for offline mode
		return openLocal(kdbid,cb,context);
	}

	var engine=pool[kdbid];
	if (engine) {
		if (cb) cb.apply(engine.context,[engine]);
		return engine;
	}
	engine=createEngine(kdbid,context,cb);

	pool[kdbid]=engine;
	return engine;
}
var openLocalNode=function(kdbid,cb,context) {
	var fs=nodeRequire('fs');
	var Kdb=nodeRequire('ksana-document').kdb;
	var engine=localPool[kdbid];
	if (engine) {
		if (cb) cb(engine);
		return engine;
	}

	var kdbfn=kdbid;
	if (kdbfn.indexOf(".kdb")==-1) kdbfn+=".kdb";

	var tries=["./"+kdbfn  //TODO , allow any depth
	           ,apppath+"/"+kdbfn,
	           ,apppath+"/ksana_databases/"+kdbfn
	           ,apppath+"/"+kdbfn,
	           ,"./ksana_databases/"+kdbfn
	           ,"../"+kdbfn
	           ,"../ksana_databases/"+kdbfn
	           ,"../../"+kdbfn
	           ,"../../ksana_databases/"+kdbfn
	           ,"../../../"+kdbfn
	           ,"../../../ksana_databases/"+kdbfn
	           ];

	for (var i=0;i<tries.length;i++) {
		
		if (fs.existsSync(tries[i])) {
			//console.log("kdb path: "+nodeRequire('path').resolve(tries[i]));
			kdb=new Kdb(tries[i]);
			if (kdb) {
				if (typeof cb=="function") {
					createLocalEngine(kdb,function(engine){
						localPool[kdbid]=engine;
						cb(engine);
					},context);					
				} else {
					engine=localPool[kdbid]=createLocalEngine(kdb,null,context);
				}
				return engine;
			}
		}
	}
	if (cb) cb(null);
	return null;

}

var openLocalHtml5=function(kdbid,cb,context) {
	var Kdb=Require('ksana-document').kdb;
	

	var engine=localPool[kdbid];
	if (engine) {
		if (cb) cb(engine);
		return engine;
	}
	var Kdb=Require('ksana-document').kdb;
	var kdbfn=kdbid;
	if (kdbfn.indexOf(".kdb")==-1) kdbfn+=".kdb";
	new Kdb(kdbfn,function(handle){
		createLocalEngine(handle,function(engine){
			localPool[kdbid]=engine;
			cb.apply(engine.context,[engine]);
		},context);		
	});
}
//omit cb for syncronize open
var openLocal=function(kdbid,cb,context)  {
	if (kdbid.indexOf("filesystem:")>-1 || typeof process=="undefined") {
		openLocalHtml5(kdbid,cb,context);
	} else {
		openLocalNode(kdbid,cb,context);
	}
}
var setPath=function(path) {
	apppath=path;
	console.log("set path",path)
}

module.exports={openLocal:openLocal, open:open, close:close, setPath:setPath, closeLocal:closeLocal};
});
require.register("ksana-document/boolsearch.js", function(exports, require, module){
/*
  TODO
  and not

*/

// http://jsfiddle.net/neoswf/aXzWw/
var plist=require('./plist');
function intersect(I, J) {
  var i = j = 0;
  var result = [];

  while( i < I.length && j < J.length ){
     if      (I[i] < J[j]) i++; 
     else if (I[i] > J[j]) j++; 
     else {
       result.push(I[i]);
       i++;j++;
     }
  }
  return result;
}

/* return all items in I but not in J */
function subtract(I, J) {
  var i = j = 0;
  var result = [];

  while( i < I.length && j < J.length ){
    if (I[i]==J[j]) {
      i++;j++;
    } else if (I[i]<J[j]) {
      while (I[i]<J[j]) result.push(I[i++]);
    } else {
      while(J[j]<I[i]) j++;
    }
  }

  if (j==J.length) {
    while (i<I.length) result.push(I[i++]);
  }

  return result;
}

var union=function(a,b) {
	if (!a || !a.length) return b;
	if (!b || !b.length) return a;
    var result = [];
    var ai = 0;
    var bi = 0;
    while (true) {
        if ( ai < a.length && bi < b.length) {
            if (a[ai] < b[bi]) {
                result.push(a[ai]);
                ai++;
            } else if (a[ai] > b[bi]) {
                result.push(b[bi]);
                bi++;
            } else {
                result.push(a[ai]);
                result.push(b[bi]);
                ai++;
                bi++;
            }
        } else if (ai < a.length) {
            result.push.apply(result, a.slice(ai, a.length));
            break;
        } else if (bi < b.length) {
            result.push.apply(result, b.slice(bi, b.length));
            break;
        } else {
            break;
        }
    }
    return result;
}
var OPERATION={'include':intersect, 'union':union, 'exclude':subtract};

var boolSearch=function(opts) {
  opts=opts||{};
  ops=opts.op||this.opts.op;
  this.docs=[];
	if (!this.phrases.length) return;
	var r=this.phrases[0].docs;
  /* ignore operator of first phrase */
	for (var i=1;i<this.phrases.length;i++) {
		var op= ops[i] || 'union';
		r=OPERATION[op](r,this.phrases[i].docs);
	}
	this.docs=plist.unique(r);
	return this;
}
module.exports={search:boolSearch}
});
require.register("ksana-document/search.js", function(exports, require, module){
var plist=require("./plist");
var boolsearch=require("./boolsearch");
var excerpt=require("./excerpt");
var parseTerm = function(engine,raw,opts) {
	if (!raw) return;
	var res={raw:raw,variants:[],term:'',op:''};
	var term=raw, op=0;
	var firstchar=term[0];
	var termregex="";
	if (firstchar=='-') {
		term=term.substring(1);
		firstchar=term[0];
		res.exclude=true; //exclude
	}
	term=term.trim();
	var lastchar=term[term.length-1];
	term=engine.customfunc.normalize(term);
	
	if (term.indexOf("%")>-1) {
		var termregex="^"+term.replace(/%+/g,".*")+"$";
		if (firstchar=="%") 	termregex=".*"+termregex.substr(1);
		if (lastchar=="%") 	termregex=termregex.substr(0,termregex.length-1)+".*";
	}

	if (termregex) {
		res.variants=expandTerm(engine,termregex);
	}

	res.key=term;
	return res;
}
var expandTerm=function(engine,regex) {
	var r=new RegExp(regex);
	var tokens=engine.get("tokens");
	var postingslen=engine.get("postingslen");
	var out=[];
	for (var i=0;i<tokens.length;i++) {
		var m=tokens[i].match(r);
		if (m) {
			out.push([m[0],postingslen[i]]);
		}
	}
	out.sort(function(a,b){return b[1]-a[1]});
	return out;
}
var isWildcard=function(raw) {
	return !!raw.match(/[\*\?]/);
}

var isOrTerm=function(term) {
	term=term.trim();
	return (term[term.length-1]===',');
}
var orterm=function(engine,term,key) {
		var t={text:key};
		if (engine.customfunc.simplifiedToken) {
			t.simplified=engine.customfunc.simplifiedToken(key);
		}
		term.variants.push(t);
}
var orTerms=function(engine,tokens,now) {
	var raw=tokens[now];
	var term=parseTerm(engine,raw);
	if (!term) return;
	orterm(engine,term,term.key);
	while (isOrTerm(raw))  {
		raw=tokens[++now];
		var term2=parseTerm(engine,raw);
		orterm(engine,term,term2.key);
		for (var i in term2.variants){
			term.variants[i]=term2.variants[i];
		}
		term.key+=','+term2.key;
	}
	return term;
}

var getOperator=function(raw) {
	var op='';
	if (raw[0]=='+') op='include';
	if (raw[0]=='-') op='exclude';
	return op;
}
var parsePhrase=function(q) {
	var match=q.match(/(".+?"|'.+?'|\S+)/g)
	match=match.map(function(str){
		var n=str.length, h=str.charAt(0), t=str.charAt(n-1)
		if (h===t&&(h==='"'|h==="'")) str=str.substr(1,n-2)
		return str;
	})
	return match;
}
var parseWildcard=function(raw) {
	var n=parseInt(raw,10) || 1;
	var qcount=raw.split('?').length-1;
	var scount=raw.split('*').length-1;
	var type='';
	if (qcount) type='?';
	else if (scount) type='*';
	return {wildcard:type, width: n , op:'wildcard'};
}

var newPhrase=function() {
	return {termid:[],posting:[],raw:''};
} 
var parseQuery=function(q) {
	var match=q.match(/(".+?"|'.+?'|\S+)/g)
	match=match.map(function(str){
		var n=str.length, h=str.charAt(0), t=str.charAt(n-1)
		if (h===t&&(h==='"'|h==="'")) str=str.substr(1,n-2)
		return str
	})
	//console.log(input,'==>',match)
	return match;
}
var loadPhrase=function(phrase) {
	/* remove leading and ending wildcard */
	var Q=this;
	var cache=Q.engine.postingCache;
	if (cache[phrase.key]) {
		phrase.posting=cache[phrase.key];
		return Q;
	}
	if (phrase.termid.length==1) {
		cache[phrase.key]=phrase.posting=Q.terms[phrase.termid[0]].posting;
		return Q;
	}

	var i=0, r=[],dis=0;
	while(i<phrase.termid.length) {
	  var T=Q.terms[phrase.termid[i]];
		if (0 === i) {
			r = T.posting;
		} else {
		    if (T.op=='wildcard') {
		    	T=Q.terms[phrase.termid[i++]];
		    	var width=T.width;
		    	var wildcard=T.wildcard;
		    	T=Q.terms[phrase.termid[i]];
		    	var mindis=dis;
		    	if (wildcard=='?') mindis=dis+width;
		    	if (T.exclude) r = plist.plnotfollow2(r, T.posting, mindis, dis+width);
		    	else r = plist.plfollow2(r, T.posting, mindis, dis+width);		    	
		    	dis+=(width-1);
		    }else {
		    	if (T.posting) {
		    		if (T.exclude) r = plist.plnotfollow(r, T.posting, dis);
		    		else r = plist.plfollow(r, T.posting, dis);
		    	}
		    }
		}
		dis++;	i++;
		if (!r) return Q;
  }
  phrase.posting=r;
  cache[phrase.key]=r;
  return Q;
}
var trimSpace=function(engine,query) {
	var i=0;
	var isSkip=engine.customfunc.isSkip;
	while (isSkip(query[i]) && i<query.length) i++;
	return query.substring(i);
}
var getPageWithHit=function(fileid,offsets) {
	var Q=this,engine=Q.engine;
	var pagewithhit=plist.groupbyposting2(Q.byFile[fileid ], offsets);
	pagewithhit.shift(); //the first item is not used (0~Q.byFile[0] )
	var out=[];
	pagewithhit.map(function(p,idx){if (p.length) out.push(idx)});
	return out;
}
var pageWithHit=function(fileid,cb) {
	var Q=this,engine=Q.engine;
	if (typeof cb=="function") {
		engine.get(["files",fileid,"pageOffset"],function(offsets){
			cb(getPageWithHit.apply(this,[fileid,offsets]));
		})
	} else {
		var offsets=engine.getSync(["files",fileid,"pageOffset"]);
		return getPageWithHit.apply(this,[fileid,offsets]);
	}
}

var newQuery =function(engine,query,opts) {
	if (!query) return;
	opts=opts||{};
	query=trimSpace(engine,query);

	var phrases=query;
	if (typeof query=='string') {
		phrases=parseQuery(query);
	}
	
	var phrase_terms=[], terms=[],variants=[],termcount=0,operators=[];
	var pc=0,termid=0;//phrase count
	for  (var i=0;i<phrases.length;i++) {
		var op=getOperator(phrases[pc]);
		if (op) phrases[pc]=phrases[pc].substring(1);

		/* auto add + for natural order ?*/
		//if (!opts.rank && op!='exclude' &&i) op='include';
		operators.push(op);
		
		var j=0,tokens=engine.customfunc.tokenize(phrases[pc]).tokens;
		phrase_terms.push(newPhrase());
		while (j<tokens.length) {
			var raw=tokens[j];
			if (isWildcard(raw)) {
				if (phrase_terms[pc].termid.length==0)  { //skip leading wild card
					j++
					continue;
				}
				terms.push(parseWildcard(raw));
				termid=termcount++;
			} else if (isOrTerm(raw)){
				var term=orTerms.apply(this,[tokens,j]);
				terms.push(term);
				j+=term.key.split(',').length-1;
				termid=termcount++;
			} else {
				var term=parseTerm(engine,raw);
				termid=terms.map(function(a){return a.key}).indexOf(term.key);
				if (termid==-1) {
					terms.push(term);
					termid=termcount++;
				};
			}
			phrase_terms[pc].termid.push(termid);
			j++;
		}
		phrase_terms[pc].key=phrases[pc];

		//remove ending wildcard
		var P=phrase_terms[pc] , T=null;
		do {
			T=terms[P.termid[P.termid.length-1]];
			if (!T) break;
			if (T.wildcard) P.termid.pop(); else break;
		} while(T);
		
		if (P.termid.length==0) {
			phrase_terms.pop();
		} else pc++;
	}
	opts.op=operators;

	var Q={dbname:engine.dbname,engine:engine,opts:opts,query:query,
		phrases:phrase_terms,terms:terms
	};
	Q.tokenize=function() {return engine.customfunc.tokenize.apply(engine,arguments);}
	Q.isSkip=function() {return engine.customfunc.isSkip.apply(engine,arguments);}
	Q.normalize=function() {return engine.customfunc.normalize.apply(engine,arguments);}
	Q.pageWithHit=pageWithHit;

	//Q.getRange=function() {return that.getRange.apply(that,arguments)};
	//API.queryid='Q'+(Math.floor(Math.random()*10000000)).toString(16);
	return Q;
}
var loadPostings=function(engine,terms,cb) {
	//
	var tokens=engine.get("tokens");
	   //var tokenIds=terms.map(function(t){return tokens[t.key]});

	var tokenIds=terms.map(function(t){ return 1+tokens.indexOf(t.key)});
	var postingid=[];
	for (var i=0;i<tokenIds.length;i++) {
		postingid.push( tokenIds[i]); // tokenId==0 , empty token
	}
	var postingkeys=postingid.map(function(t){return ["postings",t]});
	engine.get(postingkeys,function(postings){
		postings.map(function(p,i) { terms[i].posting=p });
		if (cb) cb();
	});
}
var groupBy=function(Q,posting) {
	phrases.forEach(function(P){
		var key=P.key;
		var docfreq=docfreqcache[key];
		if (!docfreq) docfreq=docfreqcache[key]={};
		if (!docfreq[that.groupunit]) {
			docfreq[that.groupunit]={doclist:null,freq:null};
		}		
		if (P.posting) {
			var res=matchPosting(engine,P.posting);
			P.freq=res.freq;
			P.docs=res.docs;
		} else {
			P.docs=[];
			P.freq=[];
		}
		docfreq[that.groupunit]={doclist:P.docs,freq:P.freq};
	});
	return this;
}
var groupByFolder=function(engine,filehits) {
	var files=engine.get("fileNames");
	var prevfolder="",hits=0,out=[];
	for (var i=0;i<filehits.length;i++) {
		var fn=files[i];
		var folder=fn.substring(0,fn.indexOf('/'));
		if (prevfolder && prevfolder!=folder) {
			out.push(hits);
			hits=0;
		}
		hits+=filehits[i].length;
		prevfolder=folder;
	}
	out.push(hits);
	return out;
}
var phrase_intersect=function(engine,Q) {
	var intersected=null;
	var fileOffsets=Q.engine.get("fileOffsets");
	var empty=[],emptycount=0,hashit=0;
	for (var i=0;i<Q.phrases.length;i++) {
		var byfile=plist.groupbyposting2(Q.phrases[i].posting,fileOffsets);
		byfile.shift();byfile.pop();
		if (intersected==null) {
			intersected=byfile;
		} else {
			for (var j=0;j<byfile.length;j++) {
				if (!(byfile[j].length && intersected[j].length)) {
					intersected[j]=empty; //reuse empty array
					emptycount++;
				} else hashit++;
			}
		}
	}

	Q.byFile=intersected;
	Q.byFolder=groupByFolder(engine,Q.byFile);
	var out=[];
	//calculate new rawposting
	for (var i=0;i<Q.byFile.length;i++) {
		if (Q.byFile[i].length) out=out.concat(Q.byFile[i]);
	}
	Q.rawresult=out;
	countFolderFile(Q);
	console.log(emptycount,hashit);
}
var countFolderFile=function(Q) {
	Q.fileWithHitCount=0;
	Q.byFile.map(function(f){if (f.length) Q.fileWithHitCount++});
			
	Q.folderWithHitCount=0;
	Q.byFolder.map(function(f){if (f) Q.folderWithHitCount++});
}
var main=function(engine,q,opts,cb){
	if (typeof opts=="function") cb=opts;
	opts=opts||{};
	
	var Q=engine.queryCache[q];
	if (!Q) Q=newQuery(engine,q,opts);
	if (!Q) {
		if (engine.context) cb.apply(engine.context,[{rawresult:[]}]);
		else cb({rawresult:[]});
		return;
	};

	engine.queryCache[q]=Q;
	
	loadPostings(engine,Q.terms,function(){
	
		if (!Q.phrases[0].posting) {
			cb.apply(engine.context,[{rawresult:[]}]);
			return;			
		}
		if (!Q.phrases[0].posting.length) { //
			Q.phrases.forEach(loadPhrase.bind(Q));
		}
		if (Q.phrases.length==1) {
			Q.rawresult=Q.phrases[0].posting;
		} else {
			phrase_intersect(engine,Q);
		}
		var fileOffsets=Q.engine.get("fileOffsets");
		
		if (!Q.byFile && Q.rawresult && !opts.nogroup) {
			Q.byFile=plist.groupbyposting2(Q.rawresult, fileOffsets);
			Q.byFile.shift();Q.byFile.pop();
			Q.byFolder=groupByFolder(engine,Q.byFile);

			countFolderFile(Q);
		}
		if (opts.range) {
			excerpt.resultlist(engine,Q,opts,function(data) {
				Q.excerpt=data;
				if (engine.context) cb.apply(engine.context,[Q]);
				else cb(Q);
			});
		} else {
			if (engine.context) cb.apply(engine.context,[Q]);
			else cb(Q);
		}		
	});
}

module.exports=main;
});
require.register("ksana-document/plist.js", function(exports, require, module){

var unpack = function (ar) { // unpack variable length integer list
  var r = [],
  i = 0,
  v = 0;
  do {
	var shift = 0;
	do {
	  v += ((ar[i] & 0x7F) << shift);
	  shift += 7;
	} while (ar[++i] & 0x80);
	r.push(v);
  } while (i < ar.length);
  return r;
}

/*
   arr:  [1,1,1,1,1,1,1,1,1]
   levels: [0,1,1,2,2,0,1,2]
   output: [5,1,3,1,1,3,1,1]
*/

var groupsum=function(arr,levels) {
  if (arr.length!=levels.length+1) return null;
  var stack=[];
  var output=new Array(levels.length);
  for (var i=0;i<levels.length;i++) output[i]=0;
  for (var i=1;i<arr.length;i++) { //first one out of toc scope, ignored
    if (stack.length>levels[i-1]) {
      while (stack.length>levels[i-1]) stack.pop();
    }
    stack.push(i-1);
    for (var j=0;j<stack.length;j++) {
      output[stack[j]]+=arr[i];
    }
  }
  return output;
}
/* arr= 1 , 2 , 3 ,4 ,5,6,7 //token posting
  posting= 3 , 5  //tag posting
  out = 3 , 2, 2
*/
var countbyposting = function (arr, posting) {
  if (!posting.length) return [arr.length];
  var out=[];
  for (var i=0;i<posting.length;i++) out[i]=0;
  out[posting.length]=0;
  var p=0,i=0,lasti=0;
  while (i<arr.length && p<posting.length) {
    if (arr[i]<=posting[p]) {
      while (p<posting.length && i<arr.length && arr[i]<=posting[p]) {
        out[p]++;
        i++;
      }      
    } 
    p++;
  }
  out[posting.length] = arr.length-i; //remaining
  return out;
}

var groupbyposting=function(arr,gposting) { //relative vpos
  if (!gposting.length) return [arr.length];
  var out=[];
  for (var i=0;i<=gposting.length;i++) out[i]=[];
  
  var p=0,i=0,lasti=0;
  while (i<arr.length && p<gposting.length) {
    if (arr[i]<gposting[p]) {
      while (p<gposting.length && i<arr.length && arr[i]<gposting[p]) {
        var start=0;
        if (p>0) start=gposting[p-1];
        out[p].push(arr[i++]-start);  // relative
      }      
    } 
    p++;
  }
  //remaining
  while(i<arr.length) out[out.length-1].push(arr[i++]-gposting[gposting.length-1]);
  return out;
}
var groupbyposting2=function(arr,gposting) { //absolute vpos
  if (!gposting.length) return [arr.length];
  var out=[];
  for (var i=0;i<=gposting.length;i++) out[i]=[];
  
  var p=0,i=0,lasti=0;
  while (i<arr.length && p<gposting.length) {
    if (arr[i]<gposting[p]) {
      while (p<gposting.length && i<arr.length && arr[i]<gposting[p]) {
        var start=0;
        if (p>0) start=gposting[p-1]; //absolute
        out[p].push(arr[i++]);
      }      
    } 
    p++;
  }
  //remaining
  while(i<arr.length) out[out.length-1].push(arr[i++]-gposting[gposting.length-1]);
  return out;
}
var groupbyblock2 = function(ar, ntoken,slotshift,opts) {
  if (!ar.length) return [{},{}];
  
  slotshift = slotshift || 16;
  var g = Math.pow(2,slotshift);
  var i = 0;
  var r = {}, ntokens={};
  var groupcount=0;
  do {
    var group = Math.floor(ar[i] / g) ;
    if (!r[group]) {
      r[group] = [];
      ntokens[group]=[];
      groupcount++;
    }
    r[group].push(ar[i] % g);
    ntokens[group].push(ntoken[i]);
    i++;
  } while (i < ar.length);
  if (opts) opts.groupcount=groupcount;
  return [r,ntokens];
}
var groupbyslot = function (ar, slotshift, opts) {
  if (!ar.length)
	return {};
  
  slotshift = slotshift || 16;
  var g = Math.pow(2,slotshift);
  var i = 0;
  var r = {};
  var groupcount=0;
  do {
	var group = Math.floor(ar[i] / g) ;
	if (!r[group]) {
	  r[group] = [];
	  groupcount++;
	}
	r[group].push(ar[i] % g);
	i++;
  } while (i < ar.length);
  if (opts) opts.groupcount=groupcount;
  return r;
}
/*
var identity = function (value) {
  return value;
};
var sortedIndex = function (array, obj, iterator) { //taken from underscore
  iterator || (iterator = identity);
  var low = 0,
  high = array.length;
  while (low < high) {
	var mid = (low + high) >> 1;
	iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
  }
  return low;
};*/

var indexOfSorted = function (array, obj) { 
  var low = 0,
  high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    array[mid] < obj ? low = mid + 1 : high = mid;
  }
  return low;
};
var plhead=function(pl, pltag, opts) {
  opts=opts||{};
  opts.max=opts.max||1;
  var out=[];
  if (pltag.length<pl.length) {
    for (var i=0;i<pltag.length;i++) {
       k = indexOfSorted(pl, pltag[i]);
       if (k>-1 && k<pl.length) {
        if (pl[k]==pltag[i]) {
          out.push(pltag[i]);
          if (out.length>=opts.max) break;
        }
      }
    }
  } else {
    for (var i=0;i<pl.length;i++) {
       k = indexOfSorted(pltag, pl[i]);
       if (k>-1 && k<pltag.length) {
        if (pltag[k]==pl[i]) {
          out.push(pltag[k]);
          if (out.length>=opts.max) break;
        }
      }
    }
  }
  return out;
}
/*
 pl2 occur after pl1, 
 pl2>=pl1+mindis
 pl2<=pl1+maxdis
*/
var plfollow2 = function (pl1, pl2, mindis, maxdis) {
  var r = [],i=0;
  var swap = 0;
  
  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + mindis);
    var t = (pl2[k] >= (pl1[i] +mindis) && pl2[k]<=(pl1[i]+maxdis)) ? k : -1;
    if (t > -1) {
      r.push(pl1[i]);
      i++;
    } else {
      if (k>=pl2.length) break;
      var k2=indexOfSorted (pl1,pl2[k]-maxdis);
      if (k2>i) {
        var t = (pl2[k] >= (pl1[i] +mindis) && pl2[k]<=(pl1[i]+maxdis)) ? k : -1;
        if (t>-1) r.push(pl1[k2]);
        i=k2;
      } else break;
    }
  }
  return r;
}

var plnotfollow2 = function (pl1, pl2, mindis, maxdis) {
  var r = [],i=0;
  
  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + mindis);
    var t = (pl2[k] >= (pl1[i] +mindis) && pl2[k]<=(pl1[i]+maxdis)) ? k : -1;
    if (t > -1) {
      i++;
    } else {
      if (k>=pl2.length) {
        r=r.concat(pl1.slice(i));
        break;
      } else {
        var k2=indexOfSorted (pl1,pl2[k]-maxdis);
        if (k2>i) {
          r=r.concat(pl1.slice(i,k2));
          i=k2;
        } else break;
      }
    }
  }
  return r;
}
/* this is incorrect */
var plfollow = function (pl1, pl2, distance) {
  var r = [],i=0;

  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + distance);
    var t = (pl2[k] === (pl1[i] + distance)) ? k : -1;
    if (t > -1) {
      r.push(pl1[i]);
      i++;
    } else {
      if (k>=pl2.length) break;
      var k2=indexOfSorted (pl1,pl2[k]-distance);
      if (k2>i) {
        t = (pl2[k] === (pl1[k2] + distance)) ? k : -1;
        if (t>-1) {
           r.push(pl1[k2]);
           k2++;
        }
        i=k2;
      } else break;
    }
  }
  return r;
}
var plnotfollow = function (pl1, pl2, distance) {
  var r = [];
  var r = [],i=0;
  var swap = 0;
  
  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + distance);
    var t = (pl2[k] === (pl1[i] + distance)) ? k : -1;
    if (t > -1) { 
      i++;
    } else {
      if (k>=pl2.length) {
        r=r.concat(pl1.slice(i));
        break;
      } else {
        var k2=indexOfSorted (pl1,pl2[k]-distance);
        if (k2>i) {
          r=r.concat(pl1.slice(i,k2));
          i=k2;
        } else break;
      }
    }
  }
  return r;
}
var pland = function (pl1, pl2, distance) {
  var r = [];
  var swap = 0;
  
  if (pl1.length > pl2.length) { //swap for faster compare
    var t = pl2;
    pl2 = pl1;
    pl1 = t;
    swap = distance;
    distance = -distance;
  }
  for (var i = 0; i < pl1.length; i++) {
    var k = indexOfSorted(pl2, pl1[i] + distance);
    var t = (pl2[k] === (pl1[i] + distance)) ? k : -1;
    if (t > -1) {
      r.push(pl1[i] - swap);
    }
  }
  return r;
}
var combine=function (postings) {
  var out=[];
  for (var i in postings) {
    out=out.concat(postings[i]);
  }
  out.sort(function(a,b){return a-b});
  return out;
}

var unique = function(ar){
   if (!ar || !ar.length) return [];
   var u = {}, a = [];
   for(var i = 0, l = ar.length; i < l; ++i){
    if(u.hasOwnProperty(ar[i])) continue;
    a.push(ar[i]);
    u[ar[i]] = 1;
   }
   return a;
}



var plphrase = function (postings,ops) {
  var r = [];
  for (var i=0;i<postings.length;i++) {
	if (!postings[i])
	  return [];
	if (0 === i) {
	  r = postings[0];
	} else {
    if (ops[i]=='andnot') {
      r = plnotfollow(r, postings[i], i);  
    }else {
      r = pland(r, postings[i], i);  
    }
	}
  }
  
  return r;
}
//return an array of group having any of pl item
var matchPosting=function(pl,gupl,start,end) {
  start=start||0;
  end=end||-1;
  if (end==-1) end=Math.pow(2, 53); // max integer value

  var count=0, i = j= 0,  result = [] ,v=0;
  var docs=[], freq=[];
  if (!pl) return {docs:[],freq:[]};
  while( i < pl.length && j < gupl.length ){
     if (pl[i] < gupl[j] ){ 
       count++;
       v=pl[i];
       i++; 
     } else {
       if (count) {
        if (v>=start && v<end) {
          docs.push(j);
          freq.push(count);          
        }
       }
       j++;
       count=0;
     }
  }
  if (count && j<gupl.length && v>=start && v<end) {
    docs.push(j);
    freq.push(count);
    count=0;
  }
  else {
    while (j==gupl.length && i<pl.length && pl[i] >= gupl[gupl.length-1]) {
      i++;
      count++;
    }
    if (v>=start && v<end) {
      docs.push(j);
      freq.push(count);      
    }
  } 
  return {docs:docs,freq:freq};
}

var trim=function(arr,start,end) {
  var s=indexOfSorted(arr,start);
  var e=indexOfSorted(arr,end);
  return arr.slice(s,e+1);
}
var plist={};
plist.unpack=unpack;
plist.plphrase=plphrase;
plist.plhead=plhead;
plist.plfollow2=plfollow2;
plist.plnotfollow2=plnotfollow2;
plist.plfollow=plfollow;
plist.plnotfollow=plnotfollow;
plist.unique=unique;
plist.indexOfSorted=indexOfSorted;
plist.matchPosting=matchPosting;
plist.trim=trim;

plist.groupbyslot=groupbyslot;
plist.groupbyblock2=groupbyblock2;
plist.countbyposting=countbyposting;
plist.groupbyposting=groupbyposting;
plist.groupbyposting2=groupbyposting2;
plist.groupsum=groupsum;
plist.combine=combine;
module.exports=plist;
return plist;
});
require.register("ksana-document/excerpt.js", function(exports, require, module){
var plist=require("./plist");

var getPhraseWidths=function (Q,phraseid,voffs) {
	var res=[];
	for (var i in voffs) {
		res.push(getPhraseWidth(Q,phraseid,voffs[i]));
	}
	return res;
}
var getPhraseWidth=function (Q,phraseid,voff) {
	var P=Q.phrases[phraseid];
	var width=0,varwidth=false;
	if (P.termid.length<2) return P.termid.length;
	var lasttermposting=Q.terms[P.termid[P.termid.length-1]].posting;

	for (var i in P.termid) {
		var T=Q.terms[P.termid[i]];
		if (T.op=='wildcard') {
			width+=T.width;
			if (T.wildcard=='*') varwidth=true;
		} else {
			width++;
		}
	}
	if (varwidth) { //width might be smaller due to * wildcard
		var at=plist.indexOfSorted(lasttermposting,voff);
		var endpos=lasttermposting[at];
		if (endpos-voff<width) width=endpos-voff+1;
	}

	return width;
}
/* return [voff, phraseid, phrasewidth, optional_tagname] by slot range*/
var hitInRange=function(Q,startvoff,endvoff) {
	var res=[];
	if (!Q || !Q.rawresult.length) return res;
	for (var i=0;i<Q.phrases.length;i++) {
		var P=Q.phrases[i];
		if (!P.posting) continue;
		var s=plist.indexOfSorted(P.posting,startvoff);
		var e=plist.indexOfSorted(P.posting,endvoff);
		var r=P.posting.slice(s,e);
		var width=getPhraseWidths(Q,i,r);

		res=res.concat(r.map(function(voff,idx){ return [voff,i,width[idx]] }));
	}
	// order by voff, if voff is the same, larger width come first.
	// so the output will be
	// <tag1><tag2>one</tag2>two</tag1>
	//TODO, might cause overlap if same voff and same width
	//need to check tag name
	res.sort(function(a,b){return a[0]==b[0]? b[2]-a[2] :a[0]-b[0]});

	return res;
}

var getFileInfo=function(engine,arr,cb) {
	var taskqueue=[],out=[];
	for (var i=0;i<arr.length;i++) {
		taskqueue.push(
			(function(idx){
				return (
					function(data){
						if (typeof data=='object' && data.__empty) {
							 //not pushing the first call
						} else out.push(data);
						engine.get(["files",idx],true,taskqueue.shift());
					}
				);
		})(arr[i]));
	}
	//last call 
	taskqueue.push(function(data){
		out.push(data);
		cb(out);
	});
	taskqueue.shift()({__empty:true});
}

/*
given a vpos range start, file, convert to filestart, fileend
   filestart : starting file
   start   : vpos start
   showfile: how many files to display
   showpage: how many pages to display

output:
   array of fileid with hits
*/
var getFileWithHits=function(engine,Q,range) {
	var fileOffsets=engine.get("fileOffsets");
	var out=[],filecount=100;
	if (range.start) {
		var first=range.start , start=0 , end;
		for (var i=0;i<fileOffsets.length;i++) {
			if (fileOffsets[i]>first) break;
			start=i;
		}		
	} else {
		start=range.filestart || 0;
		if (range.maxfile) {
			filecount=range.maxfile;
		} else if (range.showpage) {
			throw "not implement yet"
		}
	}

	var fileWithHits=[];
	for (var i=start;i<Q.byFile.length;i++) {
		if(Q.byFile[i].length>0) {
			fileWithHits.push(i);
			range.nextFileStart=i;
			if (fileWithHits.length>=filecount) {
				break;
			}
		}
	}
	if (i>=Q.byFile.length) { //no more file
		Q.excerptStop=true;
	}
	return fileWithHits;
}
var resultlist=function(engine,Q,opts,cb) {
	var output=[];
	if (!Q.rawresult || !Q.rawresult.length) {
		cb(output);
		return;
	} 
	if (opts.range) {
		if (opts.range.maxhit && !opts.range.maxfile) {
			opts.range.maxfile=opts.range.maxhit;
		}
	}
	var fileWithHits=getFileWithHits(engine,Q,opts.range);
	if (!fileWithHits.length) {
		cb(output);
		return;
	}
	getFileInfo(engine,fileWithHits,function(files) {
		var output=[];
		for (var i=0;i<files.length;i++) {
			var pagewithhit=plist.groupbyposting2(Q.byFile[ fileWithHits[i] ],  files[i].pageOffset);
			pagewithhit.shift(); //the first item is not used (0~Q.byFile[0] )
			for (var j=0; j<pagewithhit.length;j++) {
				if (!pagewithhit[j].length) continue;
				//var offsets=pagewithhit[j].map(function(p){return p- fileOffsets[i]});
				var name=files[i].pageNames[j];
				output.push(  {file: fileWithHits[i] , page:j,  pagename:name});
			}
		}

		var pagekeys=output.map(function(p){
			return ["fileContents",p.file,p.page];
		});
		//prepare the text
		engine.get(pagekeys,function(pages){
			var seq=0;
			if (pages) for (var i=0;i<pages.length;i++) {
				var k=fileWithHits.indexOf(output[i].file);
				var startvpos=files[k].pageOffset[output[i].page];
				var endvpos=files[k].pageOffset[output[i].page+1];
				var hl={};
				
				if (opts.nohighlight) {
					hl.text=pages[i];
					hl.hits=hitInRange(Q,startvpos,endvpos);
				} else {
					var o={text:pages[i],startvpos:startvpos, endvpos: endvpos, Q:Q,fulltext:opts.fulltext};
					hl=highlight(Q,o);
				}
				output[i].text=hl.text;
				output[i].hits=hl.hits;
				output[i].seq=seq;
				seq+=hl.hits.length;

				output[i].start=startvpos;
				if (opts.range.maxhit && seq>opts.range.maxhit) {
					output.length=i;
					break;
				}
			}
			cb(output);
		});
	});
}
var injectTag=function(Q,opts){
	var hits=opts.hits;
	var tag=opts.tag||'hl';
	var output='',O=[],j=0;;
	var surround=opts.surround||5;

	var tokens=Q.tokenize(opts.text).tokens;
	var voff=opts.voff;
	var i=0,previnrange=!!opts.fulltext ,inrange=!!opts.fulltext;
	while (i<tokens.length) {
		inrange=opts.fulltext || (j<hits.length && voff+surround>=hits[j][0] ||
				(j>0 && j<=hits.length &&  hits[j-1][0]+surround*2>=voff));	

		if (previnrange!=inrange) {
			output+=opts.abridge||"...";
		}
		previnrange=inrange;

		if (Q.isSkip(tokens[i])) {
			if (inrange) output+=tokens[i];
			i++;
			continue;
		}
		if (i<tokens.length && j<hits.length && voff==hits[j][0]) {
			var nphrase=hits[j][1] % 10, width=hits[j][2];
			var tag=hits[j][3] || tag;
			if (width) {
				output+= '<'+tag+' n="'+nphrase+'">';
				while (width && i<tokens.length) {
					output+=tokens[i];
					if (!Q.isSkip(tokens[i])) {voff++;width--;}
					i++;
				}
				output+='</'+tag+'>';
			} else {
				output+= '<'+tag+' n="'+nphrase+'"/>';
			}
			while (j<hits.length && voff>hits[j][0]) j++;
		} else {
			if (inrange && i<tokens.length) output+=tokens[i];
			i++;
			voff++;
		}
		
	}
	var remain=10;
	while (i<tokens.length) {
		if (inrange) output+= tokens[i];
		i++;
		remain--;
		if (remain<=0) break;
	}
	O.push(output);
	output="";

	return O.join("");
}
var highlight=function(Q,opts) {
	if (!opts.text) return {text:"",hits:[]};
	var opt={text:opts.text,
		hits:null,tag:'hl',abridge:opts.abridge,voff:opts.startvpos,
		fulltext:opts.fulltext
	};

	opt.hits=hitInRange(opts.Q,opts.startvpos,opts.endvpos);
	return {text:injectTag(Q,opt),hits:opt.hits};
}

var getPage=function(engine,fileid,pageid,cb) {
	var fileOffsets=engine.get("fileOffsets");
	var pagekeys=["fileContents",fileid,pageid];

	engine.get(pagekeys,function(text){
		cb.apply(engine.context,[{text:text,file:fileid,page:pageid}]);
	});
}

var highlightPage=function(Q,fileid,pageid,opts,cb) {
	if (typeof opts=="function") {
		cb=opts;
	}
	if (!Q || !Q.engine) return cb(null);

	getPage(Q.engine,fileid,pageid,function(page){
		Q.engine.get(["files",fileid,"pageOffset"],true,function(pageOffset){
			var startvpos=pageOffset[page.page];
			var endvpos=pageOffset[page.page+1];

			var opt={text:page.text,hits:null,tag:'hl',voff:startvpos,fulltext:true};
			opt.hits=hitInRange(Q,startvpos,endvpos);
			cb.apply(Q.engine.context,[{text:injectTag(Q,opt),hits:opt.hits}]);
		});
	});
}
module.exports={resultlist:resultlist, 
	hitInRange:hitInRange, 
	highlightPage:highlightPage,
	getPage:getPage};
});
require.register("ksana-document/link.js", function(exports, require, module){
var findLinkBy=function(page,start,len,cb) {
	if (!page) {
		cb([]);
		return;
	}
	var markups=page.markupAt(start);
	markups=markups.filter(function(m){
		return m.payload.type=="linkby";
	})
	cb(markups);
}
module.exports={findLinkBy:findLinkBy};

});
require.register("ksana-document/tibetan/wylie.js", function(exports, require, module){
var opt = { check:false, check_strict:false, print_warnings:false, fix_spacing:false }

function setopt(arg_opt) {
	for (i in arg_opt) opt[i] = arg_opt[i]
	if (opt.check_strict && !opt.check) { 
		throw 'check_strict requires check.'
	}
}

function newHashSet() {
	var x = []
	x.add = function (K) {
		if (this.indexOf(K) < 0) this.push(K)
	}
	x.contains = function (K) {
		return this.indexOf(K) >= 0
	}
	return x
}

function newHashMap() {
	var x = {}
	x.k = [], x.v = []
	x.put = function (K, V) {
		var i = this.k.indexOf(K)
		if (i < 0) this.k.push(K), this.v.push(V); else this.v[i] = V
	}
	x.containsKey = function (K) {
		return this.k.indexOf(K) >= 0
	}
	x.get = function (K) {
		var i = this.k.indexOf(K)
		if (i >= 0) return this.v[i]
	}
	return x
}
var tmpSet;
// mappings are ported from Java code
// *** Wylie to Unicode mappings ***
// list of wylie consonant => unicode
var m_consonant = new newHashMap();
m_consonant.put("k", 	"\u0f40");
m_consonant.put("kh", 	"\u0f41");
m_consonant.put("g", 	"\u0f42");
m_consonant.put("gh", 	"\u0f42\u0fb7");
m_consonant.put("g+h", 	"\u0f42\u0fb7");
m_consonant.put("ng", 	"\u0f44");
m_consonant.put("c", 	"\u0f45");
m_consonant.put("ch", 	"\u0f46");
m_consonant.put("j", 	"\u0f47");
m_consonant.put("ny", 	"\u0f49");
m_consonant.put("T", 	"\u0f4a");
m_consonant.put("-t", 	"\u0f4a");
m_consonant.put("Th", 	"\u0f4b");
m_consonant.put("-th", 	"\u0f4b");
m_consonant.put("D", 	"\u0f4c");
m_consonant.put("-d", 	"\u0f4c");
m_consonant.put("Dh", 	"\u0f4c\u0fb7");
m_consonant.put("D+h", 	"\u0f4c\u0fb7");
m_consonant.put("-dh", 	"\u0f4c\u0fb7");
m_consonant.put("-d+h", "\u0f4c\u0fb7");
m_consonant.put("N", 	"\u0f4e");
m_consonant.put("-n", 	"\u0f4e");
m_consonant.put("t", 	"\u0f4f");
m_consonant.put("th", 	"\u0f50");
m_consonant.put("d", 	"\u0f51");
m_consonant.put("dh", 	"\u0f51\u0fb7");
m_consonant.put("d+h", 	"\u0f51\u0fb7");
m_consonant.put("n", 	"\u0f53");
m_consonant.put("p", 	"\u0f54");
m_consonant.put("ph", 	"\u0f55");
m_consonant.put("b", 	"\u0f56");
m_consonant.put("bh", 	"\u0f56\u0fb7");
m_consonant.put("b+h", 	"\u0f56\u0fb7");
m_consonant.put("m", 	"\u0f58");
m_consonant.put("ts", 	"\u0f59");
m_consonant.put("tsh", 	"\u0f5a");
m_consonant.put("dz", 	"\u0f5b");
m_consonant.put("dzh", 	"\u0f5b\u0fb7");
m_consonant.put("dz+h", "\u0f5b\u0fb7");
m_consonant.put("w", 	"\u0f5d");
m_consonant.put("zh", 	"\u0f5e");
m_consonant.put("z", 	"\u0f5f");
m_consonant.put("'", 	"\u0f60");
m_consonant.put("\u2018", 	"\u0f60");	// typographic quotes
m_consonant.put("\u2019", 	"\u0f60");
m_consonant.put("y", 	"\u0f61");
m_consonant.put("r", 	"\u0f62");
m_consonant.put("l", 	"\u0f63");
m_consonant.put("sh", 	"\u0f64");
m_consonant.put("Sh", 	"\u0f65");
m_consonant.put("-sh", 	"\u0f65");
m_consonant.put("s", 	"\u0f66");
m_consonant.put("h", 	"\u0f67");
m_consonant.put("W", 	"\u0f5d");
m_consonant.put("Y", 	"\u0f61");
m_consonant.put("R", 	"\u0f6a");
m_consonant.put("f", 	"\u0f55\u0f39");
m_consonant.put("v", 	"\u0f56\u0f39");

// subjoined letters
var m_subjoined = new newHashMap();
m_subjoined.put("k", 	"\u0f90");
m_subjoined.put("kh", 	"\u0f91");
m_subjoined.put("g", 	"\u0f92");
m_subjoined.put("gh", 	"\u0f92\u0fb7");
m_subjoined.put("g+h", 	"\u0f92\u0fb7");
m_subjoined.put("ng", 	"\u0f94");
m_subjoined.put("c", 	"\u0f95");
m_subjoined.put("ch", 	"\u0f96");
m_subjoined.put("j", 	"\u0f97");
m_subjoined.put("ny", 	"\u0f99");
m_subjoined.put("T", 	"\u0f9a");
m_subjoined.put("-t", 	"\u0f9a");
m_subjoined.put("Th", 	"\u0f9b");
m_subjoined.put("-th", 	"\u0f9b");
m_subjoined.put("D", 	"\u0f9c");
m_subjoined.put("-d", 	"\u0f9c");
m_subjoined.put("Dh", 	"\u0f9c\u0fb7");
m_subjoined.put("D+h", 	"\u0f9c\u0fb7");
m_subjoined.put("-dh", 	"\u0f9c\u0fb7");
m_subjoined.put("-d+h",	"\u0f9c\u0fb7");
m_subjoined.put("N", 	"\u0f9e");
m_subjoined.put("-n", 	"\u0f9e");
m_subjoined.put("t", 	"\u0f9f");
m_subjoined.put("th", 	"\u0fa0");
m_subjoined.put("d", 	"\u0fa1");
m_subjoined.put("dh", 	"\u0fa1\u0fb7");
m_subjoined.put("d+h", 	"\u0fa1\u0fb7");
m_subjoined.put("n", 	"\u0fa3");
m_subjoined.put("p", 	"\u0fa4");
m_subjoined.put("ph", 	"\u0fa5");
m_subjoined.put("b", 	"\u0fa6");
m_subjoined.put("bh", 	"\u0fa6\u0fb7");
m_subjoined.put("b+h", 	"\u0fa6\u0fb7");
m_subjoined.put("m", 	"\u0fa8");
m_subjoined.put("ts", 	"\u0fa9");
m_subjoined.put("tsh", 	"\u0faa");
m_subjoined.put("dz", 	"\u0fab");
m_subjoined.put("dzh", 	"\u0fab\u0fb7");
m_subjoined.put("dz+h",	"\u0fab\u0fb7");
m_subjoined.put("w", 	"\u0fad");
m_subjoined.put("zh", 	"\u0fae");
m_subjoined.put("z", 	"\u0faf");
m_subjoined.put("'", 	"\u0fb0");
m_subjoined.put("\u2018", 	"\u0fb0");	// typographic quotes
m_subjoined.put("\u2019", 	"\u0fb0");
m_subjoined.put("y", 	"\u0fb1");
m_subjoined.put("r", 	"\u0fb2");
m_subjoined.put("l", 	"\u0fb3");
m_subjoined.put("sh", 	"\u0fb4");
m_subjoined.put("Sh", 	"\u0fb5");
m_subjoined.put("-sh", 	"\u0fb5");
m_subjoined.put("s", 	"\u0fb6");
m_subjoined.put("h", 	"\u0fb7");
m_subjoined.put("a", 	"\u0fb8");
m_subjoined.put("W", 	"\u0fba");
m_subjoined.put("Y", 	"\u0fbb");
m_subjoined.put("R", 	"\u0fbc");

// vowels
var m_vowel = new newHashMap();
m_vowel.put("a", 	"\u0f68");
m_vowel.put("A", 	"\u0f71");
m_vowel.put("i", 	"\u0f72");
m_vowel.put("I", 	"\u0f71\u0f72");
m_vowel.put("u", 	"\u0f74");
m_vowel.put("U", 	"\u0f71\u0f74");
m_vowel.put("e", 	"\u0f7a");
m_vowel.put("ai", 	"\u0f7b");
m_vowel.put("o", 	"\u0f7c");
m_vowel.put("au", 	"\u0f7d");
m_vowel.put("-i", 	"\u0f80");
m_vowel.put("-I", 	"\u0f71\u0f80");

// final symbols to unicode
var m_final_uni = new newHashMap();
m_final_uni.put("M", 	"\u0f7e");
m_final_uni.put("~M`", 	"\u0f82");
m_final_uni.put("~M", 	"\u0f83");
m_final_uni.put("X", 	"\u0f37");
m_final_uni.put("~X", 	"\u0f35");
m_final_uni.put("H", 	"\u0f7f");
m_final_uni.put("?", 	"\u0f84");
m_final_uni.put("^", 	"\u0f39");

// final symbols organized by class
var m_final_class = new newHashMap();
m_final_class.put("M", 	"M");
m_final_class.put("~M`", "M");
m_final_class.put("~M",  "M");
m_final_class.put("X", 	"X");
m_final_class.put("~X", "X");
m_final_class.put("H", 	"H");
m_final_class.put("?", 	"?");
m_final_class.put("^", 	"^");

// other stand-alone symbols
var m_other = new newHashMap();
m_other.put("0", 	"\u0f20");
m_other.put("1", 	"\u0f21");
m_other.put("2", 	"\u0f22");
m_other.put("3", 	"\u0f23");
m_other.put("4", 	"\u0f24");
m_other.put("5", 	"\u0f25");
m_other.put("6", 	"\u0f26");
m_other.put("7", 	"\u0f27");
m_other.put("8", 	"\u0f28");
m_other.put("9", 	"\u0f29");
m_other.put(" ", 	"\u0f0b");
m_other.put("*", 	"\u0f0c");
m_other.put("/", 	"\u0f0d");
m_other.put("//", 	"\u0f0e");
m_other.put(";", 	"\u0f0f");
m_other.put("|", 	"\u0f11");
m_other.put("!", 	"\u0f08");
m_other.put(":", 	"\u0f14");
m_other.put("_", 	" ");
m_other.put("=", 	"\u0f34");
m_other.put("<", 	"\u0f3a");
m_other.put(">", 	"\u0f3b");
m_other.put("(", 	"\u0f3c");
m_other.put(")", 	"\u0f3d");
m_other.put("@", 	"\u0f04");
m_other.put("#", 	"\u0f05");
m_other.put("$", 	"\u0f06");
m_other.put("%", 	"\u0f07");

// special characters: flag those if they occur out of context
var m_special = new newHashSet();
m_special.add(".");
m_special.add("+");
m_special.add("-");
m_special.add("~");
m_special.add("^");
m_special.add("?");
m_special.add("`");
m_special.add("]");

// superscripts: hashmap of superscript => set of letters or stacks below
var m_superscripts = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("j");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("ts");
tmpSet.add("dz");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("m+y");
tmpSet.add("b+w");
tmpSet.add("ts+w");
tmpSet.add("g+w");
m_superscripts.put("r", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("c");
tmpSet.add("j");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("p");
tmpSet.add("b");
tmpSet.add("h");
m_superscripts.put("l", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("p");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("ts");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("p+y");
tmpSet.add("b+y");
tmpSet.add("m+y");
tmpSet.add("k+r");
tmpSet.add("g+r");
tmpSet.add("p+r");
tmpSet.add("b+r");
tmpSet.add("m+r");
tmpSet.add("n+r");
m_superscripts.put("s", tmpSet);

// subscripts => set of letters above
var m_subscripts = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("p");
tmpSet.add("ph");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("r+k");
tmpSet.add("r+g");
tmpSet.add("r+m");
tmpSet.add("s+k");
tmpSet.add("s+g");
tmpSet.add("s+p");
tmpSet.add("s+b");
tmpSet.add("s+m");
m_subscripts.put("y", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("t");
tmpSet.add("th");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("p");
tmpSet.add("ph");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("sh");
tmpSet.add("s");
tmpSet.add("h");
tmpSet.add("dz");
tmpSet.add("s+k");
tmpSet.add("s+g");
tmpSet.add("s+p");
tmpSet.add("s+b");
tmpSet.add("s+m");
tmpSet.add("s+n");
m_subscripts.put("r", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("b");
tmpSet.add("r");
tmpSet.add("s");
tmpSet.add("z");
m_subscripts.put("l", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("c");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("ts");
tmpSet.add("tsh");
tmpSet.add("zh");
tmpSet.add("z");
tmpSet.add("r");
tmpSet.add("l");
tmpSet.add("sh");
tmpSet.add("s");
tmpSet.add("h");
tmpSet.add("g+r");
tmpSet.add("d+r");
tmpSet.add("ph+y");
tmpSet.add("r+g");
tmpSet.add("r+ts");
m_subscripts.put("w", tmpSet);

// prefixes => set of consonants or stacks after
var m_prefixes = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("c");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("ts");
tmpSet.add("zh");
tmpSet.add("z");
tmpSet.add("y");
tmpSet.add("sh");
tmpSet.add("s");
m_prefixes.put("g", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("p");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("p+y");
tmpSet.add("b+y");
tmpSet.add("m+y");
tmpSet.add("k+r");
tmpSet.add("g+r");
tmpSet.add("p+r");
tmpSet.add("b+r");
m_prefixes.put("d", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("c");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("ts");
tmpSet.add("zh");
tmpSet.add("z");
tmpSet.add("sh");
tmpSet.add("s");
tmpSet.add("r");
tmpSet.add("l");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("k+r");
tmpSet.add("g+r");
tmpSet.add("r+l");
tmpSet.add("s+l");
tmpSet.add("r+k");
tmpSet.add("r+g");
tmpSet.add("r+ng");
tmpSet.add("r+j");
tmpSet.add("r+ny");
tmpSet.add("r+t");
tmpSet.add("r+d");
tmpSet.add("r+n");
tmpSet.add("r+ts");
tmpSet.add("r+dz");
tmpSet.add("s+k");
tmpSet.add("s+g");
tmpSet.add("s+ng");
tmpSet.add("s+ny");
tmpSet.add("s+t");
tmpSet.add("s+d");
tmpSet.add("s+n");
tmpSet.add("s+ts");
tmpSet.add("r+k+y");
tmpSet.add("r+g+y");
tmpSet.add("s+k+y");
tmpSet.add("s+g+y");
tmpSet.add("s+k+r");
tmpSet.add("s+g+r");
tmpSet.add("l+d");
tmpSet.add("l+t");
tmpSet.add("k+l");
tmpSet.add("s+r");
tmpSet.add("z+l");
tmpSet.add("s+w");
m_prefixes.put("b", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("ch");
tmpSet.add("j");
tmpSet.add("ny");
tmpSet.add("th");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("tsh");
tmpSet.add("dz");
tmpSet.add("kh+y");
tmpSet.add("g+y");
tmpSet.add("kh+r");
tmpSet.add("g+r");
m_prefixes.put("m", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("ch");
tmpSet.add("j");
tmpSet.add("th");
tmpSet.add("d");
tmpSet.add("ph");
tmpSet.add("b");
tmpSet.add("tsh");
tmpSet.add("dz");
tmpSet.add("kh+y");
tmpSet.add("g+y");
tmpSet.add("ph+y");
tmpSet.add("b+y");
tmpSet.add("kh+r");
tmpSet.add("g+r");
tmpSet.add("d+r");
tmpSet.add("ph+r");
tmpSet.add("b+r");
m_prefixes.put("'", tmpSet);
m_prefixes.put("\u2018", tmpSet);
m_prefixes.put("\u2019", tmpSet);

// set of suffix letters
// also included are some Skt letters b/c they occur often in suffix position in Skt words
var m_suffixes = new newHashSet();
m_suffixes.add("'");
m_suffixes.add("\u2018");
m_suffixes.add("\u2019");
m_suffixes.add("g");
m_suffixes.add("ng");
m_suffixes.add("d");
m_suffixes.add("n");
m_suffixes.add("b");
m_suffixes.add("m");
m_suffixes.add("r");
m_suffixes.add("l");
m_suffixes.add("s");
m_suffixes.add("N");
m_suffixes.add("T");
m_suffixes.add("-n");
m_suffixes.add("-t");

// suffix2 => set of letters before
var m_suff2 = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("b");
tmpSet.add("m");
m_suff2.put("s", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("n");
tmpSet.add("r");
tmpSet.add("l");
m_suff2.put("d", tmpSet);

// root letter index for very ambiguous three-stack syllables
var m_ambiguous_key = new newHashMap();
m_ambiguous_key.put("dgs", 	1);
m_ambiguous_key.put("dms", 	1);
m_ambiguous_key.put("'gs", 	1);
m_ambiguous_key.put("mngs", 	0);
m_ambiguous_key.put("bgs", 	0);
m_ambiguous_key.put("dbs", 	1);

var m_ambiguous_wylie = new newHashMap();
m_ambiguous_wylie.put("dgs", 	"dgas");
m_ambiguous_wylie.put("dms", 	"dmas");
m_ambiguous_wylie.put("'gs", 	"'gas");
m_ambiguous_wylie.put("mngs", 	"mangs");
m_ambiguous_wylie.put("bgs", 	"bags");
m_ambiguous_wylie.put("dbs", 	"dbas");

// *** Unicode to Wylie mappings ***

// top letters
var m_tib_top = new newHashMap();
m_tib_top.put('\u0f40', 	"k");
m_tib_top.put('\u0f41', 	"kh");
m_tib_top.put('\u0f42', 	"g");
m_tib_top.put('\u0f43', 	"g+h");
m_tib_top.put('\u0f44', 	"ng");
m_tib_top.put('\u0f45', 	"c");
m_tib_top.put('\u0f46', 	"ch");
m_tib_top.put('\u0f47', 	"j");
m_tib_top.put('\u0f49', 	"ny");
m_tib_top.put('\u0f4a', 	"T");
m_tib_top.put('\u0f4b', 	"Th");
m_tib_top.put('\u0f4c', 	"D");
m_tib_top.put('\u0f4d', 	"D+h");
m_tib_top.put('\u0f4e', 	"N");
m_tib_top.put('\u0f4f', 	"t");
m_tib_top.put('\u0f50', 	"th");
m_tib_top.put('\u0f51', 	"d");
m_tib_top.put('\u0f52', 	"d+h");
m_tib_top.put('\u0f53', 	"n");
m_tib_top.put('\u0f54', 	"p");
m_tib_top.put('\u0f55', 	"ph");
m_tib_top.put('\u0f56', 	"b");
m_tib_top.put('\u0f57', 	"b+h");
m_tib_top.put('\u0f58', 	"m");
m_tib_top.put('\u0f59', 	"ts");
m_tib_top.put('\u0f5a', 	"tsh");
m_tib_top.put('\u0f5b', 	"dz");
m_tib_top.put('\u0f5c', 	"dz+h");
m_tib_top.put('\u0f5d', 	"w");
m_tib_top.put('\u0f5e', 	"zh");
m_tib_top.put('\u0f5f', 	"z");
m_tib_top.put('\u0f60', 	"'");
m_tib_top.put('\u0f61', 	"y");
m_tib_top.put('\u0f62', 	"r");
m_tib_top.put('\u0f63', 	"l");
m_tib_top.put('\u0f64', 	"sh");
m_tib_top.put('\u0f65', 	"Sh");
m_tib_top.put('\u0f66', 	"s");
m_tib_top.put('\u0f67', 	"h");
m_tib_top.put('\u0f68', 	"a");
m_tib_top.put('\u0f69', 	"k+Sh");
m_tib_top.put('\u0f6a', 	"R");

// subjoined letters
var m_tib_subjoined = new newHashMap();
m_tib_subjoined.put('\u0f90', 	"k");
m_tib_subjoined.put('\u0f91', 	"kh");
m_tib_subjoined.put('\u0f92', 	"g");
m_tib_subjoined.put('\u0f93', 	"g+h");
m_tib_subjoined.put('\u0f94', 	"ng");
m_tib_subjoined.put('\u0f95', 	"c");
m_tib_subjoined.put('\u0f96', 	"ch");
m_tib_subjoined.put('\u0f97', 	"j");
m_tib_subjoined.put('\u0f99', 	"ny");
m_tib_subjoined.put('\u0f9a', 	"T");
m_tib_subjoined.put('\u0f9b', 	"Th");
m_tib_subjoined.put('\u0f9c', 	"D");
m_tib_subjoined.put('\u0f9d', 	"D+h");
m_tib_subjoined.put('\u0f9e', 	"N");
m_tib_subjoined.put('\u0f9f', 	"t");
m_tib_subjoined.put('\u0fa0', 	"th");
m_tib_subjoined.put('\u0fa1', 	"d");
m_tib_subjoined.put('\u0fa2', 	"d+h");
m_tib_subjoined.put('\u0fa3', 	"n");
m_tib_subjoined.put('\u0fa4', 	"p");
m_tib_subjoined.put('\u0fa5', 	"ph");
m_tib_subjoined.put('\u0fa6', 	"b");
m_tib_subjoined.put('\u0fa7', 	"b+h");
m_tib_subjoined.put('\u0fa8', 	"m");
m_tib_subjoined.put('\u0fa9', 	"ts");
m_tib_subjoined.put('\u0faa', 	"tsh");
m_tib_subjoined.put('\u0fab', 	"dz");
m_tib_subjoined.put('\u0fac', 	"dz+h");
m_tib_subjoined.put('\u0fad', 	"w");
m_tib_subjoined.put('\u0fae', 	"zh");
m_tib_subjoined.put('\u0faf', 	"z");
m_tib_subjoined.put('\u0fb0', 	"'");
m_tib_subjoined.put('\u0fb1', 	"y");
m_tib_subjoined.put('\u0fb2', 	"r");
m_tib_subjoined.put('\u0fb3', 	"l");
m_tib_subjoined.put('\u0fb4', 	"sh");
m_tib_subjoined.put('\u0fb5', 	"Sh");
m_tib_subjoined.put('\u0fb6', 	"s");
m_tib_subjoined.put('\u0fb7', 	"h");
m_tib_subjoined.put('\u0fb8', 	"a");
m_tib_subjoined.put('\u0fb9', 	"k+Sh");
m_tib_subjoined.put('\u0fba', 	"W");
m_tib_subjoined.put('\u0fbb', 	"Y");
m_tib_subjoined.put('\u0fbc', 	"R");

// vowel signs:
// a-chen is not here because that's a top character, not a vowel sign.
// pre-composed "I" and "U" are dealt here; other pre-composed Skt vowels are more
// easily handled by a global replace in toWylie(), b/c they turn into subjoined "r"/"l".

var m_tib_vowel = new newHashMap();
m_tib_vowel.put('\u0f71', 	"A");
m_tib_vowel.put('\u0f72', 	"i");
m_tib_vowel.put('\u0f73', 	"I");
m_tib_vowel.put('\u0f74', 	"u");
m_tib_vowel.put('\u0f75', 	"U");
m_tib_vowel.put('\u0f7a', 	"e");
m_tib_vowel.put('\u0f7b', 	"ai");
m_tib_vowel.put('\u0f7c', 	"o");
m_tib_vowel.put('\u0f7d', 	"au");
m_tib_vowel.put('\u0f80', 	"-i");

// long (Skt) vowels
var m_tib_vowel_long = new newHashMap();
m_tib_vowel_long.put("i", 	"I");
m_tib_vowel_long.put("u", 	"U");
m_tib_vowel_long.put("-i", 	"-I");

// final symbols => wylie
var m_tib_final_wylie = new newHashMap();
m_tib_final_wylie.put('\u0f7e', 	"M");
m_tib_final_wylie.put('\u0f82', 	"~M`");
m_tib_final_wylie.put('\u0f83', 	"~M");
m_tib_final_wylie.put('\u0f37', 	"X");
m_tib_final_wylie.put('\u0f35', 	"~X");
m_tib_final_wylie.put('\u0f39', 	"^");
m_tib_final_wylie.put('\u0f7f', 	"H");
m_tib_final_wylie.put('\u0f84', 	"?");

// final symbols by class
var m_tib_final_class = new newHashMap();
m_tib_final_class.put('\u0f7e', 	"M");
m_tib_final_class.put('\u0f82', 	"M");
m_tib_final_class.put('\u0f83', 	"M");
m_tib_final_class.put('\u0f37', 	"X");
m_tib_final_class.put('\u0f35', 	"X");
m_tib_final_class.put('\u0f39', 	"^");
m_tib_final_class.put('\u0f7f', 	"H");
m_tib_final_class.put('\u0f84', 	"?");

// special characters introduced by ^
var m_tib_caret = new newHashMap();
m_tib_caret.put("ph", 	"f");
m_tib_caret.put("b", 	"v");

// other stand-alone characters
var m_tib_other = new newHashMap();
m_tib_other.put(' ', 		"_");
m_tib_other.put('\u0f04', 	"@");
m_tib_other.put('\u0f05', 	"#");
m_tib_other.put('\u0f06', 	"$");
m_tib_other.put('\u0f07', 	"%");
m_tib_other.put('\u0f08', 	"!");
m_tib_other.put('\u0f0b', 	" ");
m_tib_other.put('\u0f0c', 	"*");
m_tib_other.put('\u0f0d', 	"/");
m_tib_other.put('\u0f0e', 	"//");
m_tib_other.put('\u0f0f', 	";");
m_tib_other.put('\u0f11', 	"|");
m_tib_other.put('\u0f14', 	":");
m_tib_other.put('\u0f20', 	"0");
m_tib_other.put('\u0f21', 	"1");
m_tib_other.put('\u0f22', 	"2");
m_tib_other.put('\u0f23', 	"3");
m_tib_other.put('\u0f24', 	"4");
m_tib_other.put('\u0f25', 	"5");
m_tib_other.put('\u0f26', 	"6");
m_tib_other.put('\u0f27', 	"7");
m_tib_other.put('\u0f28', 	"8");
m_tib_other.put('\u0f29', 	"9");
m_tib_other.put('\u0f34', 	"=");
m_tib_other.put('\u0f3a', 	"<");
m_tib_other.put('\u0f3b', 	">");
m_tib_other.put('\u0f3c', 	"(");
m_tib_other.put('\u0f3d', 	")");

// all these stacked consonant combinations don't need "+"s in them
var m_tib_stacks = new newHashSet();
m_tib_stacks.add("b+l");
m_tib_stacks.add("b+r");
m_tib_stacks.add("b+y");
m_tib_stacks.add("c+w");
m_tib_stacks.add("d+r");
m_tib_stacks.add("d+r+w");
m_tib_stacks.add("d+w");
m_tib_stacks.add("dz+r");
m_tib_stacks.add("g+l");
m_tib_stacks.add("g+r");
m_tib_stacks.add("g+r+w");
m_tib_stacks.add("g+w");
m_tib_stacks.add("g+y");
m_tib_stacks.add("h+r");
m_tib_stacks.add("h+w");
m_tib_stacks.add("k+l");
m_tib_stacks.add("k+r");
m_tib_stacks.add("k+w");
m_tib_stacks.add("k+y");
m_tib_stacks.add("kh+r");
m_tib_stacks.add("kh+w");
m_tib_stacks.add("kh+y");
m_tib_stacks.add("l+b");
m_tib_stacks.add("l+c");
m_tib_stacks.add("l+d");
m_tib_stacks.add("l+g");
m_tib_stacks.add("l+h");
m_tib_stacks.add("l+j");
m_tib_stacks.add("l+k");
m_tib_stacks.add("l+ng");
m_tib_stacks.add("l+p");
m_tib_stacks.add("l+t");
m_tib_stacks.add("l+w");
m_tib_stacks.add("m+r");
m_tib_stacks.add("m+y");
m_tib_stacks.add("n+r");
m_tib_stacks.add("ny+w");
m_tib_stacks.add("p+r");
m_tib_stacks.add("p+y");
m_tib_stacks.add("ph+r");
m_tib_stacks.add("ph+y");
m_tib_stacks.add("ph+y+w");
m_tib_stacks.add("r+b");
m_tib_stacks.add("r+d");
m_tib_stacks.add("r+dz");
m_tib_stacks.add("r+g");
m_tib_stacks.add("r+g+w");
m_tib_stacks.add("r+g+y");
m_tib_stacks.add("r+j");
m_tib_stacks.add("r+k");
m_tib_stacks.add("r+k+y");
m_tib_stacks.add("r+l");
m_tib_stacks.add("r+m");
m_tib_stacks.add("r+m+y");
m_tib_stacks.add("r+n");
m_tib_stacks.add("r+ng");
m_tib_stacks.add("r+ny");
m_tib_stacks.add("r+t");
m_tib_stacks.add("r+ts");
m_tib_stacks.add("r+ts+w");
m_tib_stacks.add("r+w");
m_tib_stacks.add("s+b");
m_tib_stacks.add("s+b+r");
m_tib_stacks.add("s+b+y");
m_tib_stacks.add("s+d");
m_tib_stacks.add("s+g");
m_tib_stacks.add("s+g+r");
m_tib_stacks.add("s+g+y");
m_tib_stacks.add("s+k");
m_tib_stacks.add("s+k+r");
m_tib_stacks.add("s+k+y");
m_tib_stacks.add("s+l");
m_tib_stacks.add("s+m");
m_tib_stacks.add("s+m+r");
m_tib_stacks.add("s+m+y");
m_tib_stacks.add("s+n");
m_tib_stacks.add("s+n+r");
m_tib_stacks.add("s+ng");
m_tib_stacks.add("s+ny");
m_tib_stacks.add("s+p");
m_tib_stacks.add("s+p+r");
m_tib_stacks.add("s+p+y");
m_tib_stacks.add("s+r");
m_tib_stacks.add("s+t");
m_tib_stacks.add("s+ts");
m_tib_stacks.add("s+w");
m_tib_stacks.add("sh+r");
m_tib_stacks.add("sh+w");
m_tib_stacks.add("t+r");
m_tib_stacks.add("t+w");
m_tib_stacks.add("th+r");
m_tib_stacks.add("ts+w");
m_tib_stacks.add("tsh+w");
m_tib_stacks.add("z+l");
m_tib_stacks.add("z+w");
m_tib_stacks.add("zh+w");

// a map used to split the input string into tokens for fromWylie().
// all letters which start tokens longer than one letter are mapped to the max length of
// tokens starting with that letter.  
var m_tokens_start = new newHashMap();
m_tokens_start.put('S', 2);
m_tokens_start.put('/', 2);
m_tokens_start.put('d', 4);
m_tokens_start.put('g', 3);
m_tokens_start.put('b', 3);
m_tokens_start.put('D', 3);
m_tokens_start.put('z', 2);
m_tokens_start.put('~', 3);
m_tokens_start.put('-', 4);
m_tokens_start.put('T', 2);
m_tokens_start.put('a', 2);
m_tokens_start.put('k', 2);
m_tokens_start.put('t', 3);
m_tokens_start.put('s', 2);
m_tokens_start.put('c', 2);
m_tokens_start.put('n', 2);
m_tokens_start.put('p', 2);
m_tokens_start.put('\r', 2);

// also for tokenization - a set of tokens longer than one letter
var m_tokens = new newHashSet();
m_tokens.add("-d+h");
m_tokens.add("dz+h");
m_tokens.add("-dh");
m_tokens.add("-sh");
m_tokens.add("-th");
m_tokens.add("D+h");
m_tokens.add("b+h");
m_tokens.add("d+h");
m_tokens.add("dzh");
m_tokens.add("g+h");
m_tokens.add("tsh");
m_tokens.add("~M`");
m_tokens.add("-I");
m_tokens.add("-d");
m_tokens.add("-i");
m_tokens.add("-n");
m_tokens.add("-t");
m_tokens.add("//");
m_tokens.add("Dh");
m_tokens.add("Sh");
m_tokens.add("Th");
m_tokens.add("ai");
m_tokens.add("au");
m_tokens.add("bh");
m_tokens.add("ch");
m_tokens.add("dh");
m_tokens.add("dz");
m_tokens.add("gh");
m_tokens.add("kh");
m_tokens.add("ng");
m_tokens.add("ny");
m_tokens.add("ph");
m_tokens.add("sh");
m_tokens.add("th");
m_tokens.add("ts");
m_tokens.add("zh");
m_tokens.add("~M");
m_tokens.add("~X");
m_tokens.add("\r\n");

// A class to encapsulate the return value of fromWylieOneStack.
var WylieStack = function() {
	this.uni_string = ''
	this.tokens_used = 0
	this.single_consonant = ''
	this.single_cons_a = ''
	this.warns = []
	this.visarga = false
	return this
}

// Looking from i onwards within tokens, returns as many consonants as it finds,
// up to and not including the next vowel or punctuation.  Skips the caret "^".
// Returns: a string of consonants joined by "+" signs.
function consonantString(tokens, i) { // strings, int
	var out = [];
	var t = '';
	while (tokens[i] != null) {
		t = tokens[i++];
		if (t == '+' || t == '^') continue;
		if (consonant(t) == null) break;
		out.push(t);
	}
	return out.join("+");
}

// Looking from i backwards within tokens, at most up to orig_i, returns as 
// many consonants as it finds, up to and not including the next vowel or
// punctuation.  Skips the caret "^".
// Returns: a string of consonants (in forward order) joined by "+" signs.
function consonantStringBackwards(tokens, i, orig_i) {
	var out = [];
	var t = '';
	while (i >= orig_i && tokens[i] != null) {
		t = tokens[i--];
		if (t == '+' || t == '^') continue;
		if (consonant(t) == null) break;
		out.unshift(t);
	}
	return out.join("+");
}

// A class to encapsulate the return value of fromWylieOneTsekbar.
var WylieTsekbar = function() {
	this.uni_string = ''
	this.tokens_used = 0
	this.warns = []
	return this
}
// A class to encapsulate an analyzed tibetan stack, while converting Unicode to Wylie.
var ToWylieStack = function() {
	this.top = ''
	this.stack = []
	this.caret = false
	this.vowels = []
	this.finals = []
	this.finals_found = newHashMap()
	this.visarga = false
	this.cons_str = ''
	this.single_cons = ''
	this.prefix = false
	this.suffix = false
	this.suff2 = false
	this.dot = false
	this.tokens_used = 0
	this.warns = []
	return this
}

// A class to encapsulate the return value of toWylieOneTsekbar.
var ToWylieTsekbar = function() {
	this.wylie = ''
	this.tokens_used = 0
	this.warns = []
	return this
}

// Converts successive stacks of Wylie into unicode, starting at the given index
// within the array of tokens. 
// 
// Assumes that the first available token is valid, and is either a vowel or a consonant.
// Returns a WylieTsekbar object
// HELPER CLASSES AND STRUCTURES
var State = { PREFIX: 0, MAIN: 1, SUFF1: 2, SUFF2: 3, NONE: 4 }
	// split a string into Wylie tokens; 
	// make sure there is room for at least one null element at the end of the array
var splitIntoTokens = function(str) {
	var tokens = [] // size = str.length + 2
	var i = 0;
	var maxlen = str.length;
	TOKEN:
	while (i < maxlen) {
		var c = str.charAt(i);
		var mlo = m_tokens_start.get(c);
		// if there are multi-char tokens starting with this char, try them
		if (mlo != null) {
			for (var len = mlo; len > 1; len--) {
				if (i <= maxlen - len) {
					var tr = str.substring(i, i + len);
					if (m_tokens.contains(tr)) {
						tokens.push(tr);
						i += len;
						continue TOKEN;
					}
				}
			}
		}
		// things starting with backslash are special
		if (c == '\\' && i <= maxlen - 2) {
			if (str.charAt(i + 1) == 'u' && i <= maxlen - 6) {
				tokens.push(str.substring(i, i + 6));		// \\uxxxx
				i += 6;
			} else if (str.charAt(i + 1) == 'U' && i <= maxlen - 10) {
				tokens.push(str.substring(i, i + 10));		// \\Uxxxxxxxx
				i += 10;
			} else {
				tokens.push(str.substring(i, i + 2));		// \\x
				i += 2;
			}
			continue TOKEN;
		}
		// otherwise just take one char
		tokens.push(c.toString());
		i += 1;
	}
	return tokens;
}

// helper functions to access the various hash tables
var consonant = function(s) { return m_consonant.get(s) }
var subjoined = function(s) { return m_subjoined.get(s) }
var vowel = function(s) { return m_vowel.get(s) }
var final_uni = function(s) { return m_final_uni.get(s) }
var final_class = function(s) { return m_final_class.get(s) }
var other = function(s) { return m_other.get(s) }
var isSpecial = function(s) { return m_special.contains(s) }
var isSuperscript = function(s) { return m_superscripts.containsKey(s) }
var superscript = function(sup, below) {
	var tmpSet = m_superscripts.get(sup);
	if (tmpSet == null) return false;
	return tmpSet.contains(below);
}
var isSubscript = function(s) { return m_subscripts.containsKey(s) }
var subscript = function(sub, above) {
	var tmpSet = m_subscripts.get(sub);
	if (tmpSet == null) return false;
	return tmpSet.contains(above);
}
var isPrefix = function(s) { return m_prefixes.containsKey(s) }
var prefix = function(pref, after) {
	var tmpSet = m_prefixes.get(pref);
	if (tmpSet == null) return false;
	return tmpSet.contains(after);
}
var isSuffix = function(s) { return m_suffixes.contains(s) }
var isSuff2 = function(s) { return m_suff2.containsKey(s) }
var suff2 = function(suff, before) {
	var tmpSet = m_suff2.get(suff);
	if (tmpSet == null) return false;
	return tmpSet.contains(before);
}
var ambiguous_key = function(syll) { return m_ambiguous_key.get(syll) }
var ambiguous_wylie = function(syll) { return m_ambiguous_wylie.get(syll) }
var tib_top = function(c) { return m_tib_top.get(c) }
var tib_subjoined = function(c) { return m_tib_subjoined.get(c) }
var tib_vowel = function(c) { return m_tib_vowel.get(c) }
var tib_vowel_long = function(s) { return m_tib_vowel_long.get(s) }
var tib_final_wylie = function(c) { return m_tib_final_wylie.get(c) }
var tib_final_class = function(c) { return m_tib_final_class.get(c) }
var tib_caret = function(s) { return m_tib_caret.get(s) }
var tib_other = function(c) { return m_tib_other.get(c) }
var tib_stack = function(s) { return m_tib_stacks.contains(s) }

// does this string consist of only hexadecimal digits?
function validHex(t) {
	for (var i = 0; i < t.length; i++) {
		var c = t.charAt(i);
		if (!((c >= 'a' && c <= 'f') || (c >= '0' && c <= '9'))) return false;
	}
	return true;
}

// generate a warning if we are keeping them; prints it out if we were asked to
// handle a Wylie unicode escape, \\uxxxx or \\Uxxxxxxxx
function unicodeEscape (warns, line, t) { // [], int, str
	var hex = t.substring(2);
	if (hex == '') return null;
	if (!validHex(hex)) {
		warnl(warns, line, "\"" + t + "\": invalid hex code.");
		return "";
	}
	return String.fromCharCode(parseInt(hex, 16))
}

function warn(warns, str) {
	if (warns != null) warns.push(str);
	if (opt.print_warnings) console.log(str);
}

// warn with line number
function warnl(warns, line, str) {
	warn(warns, "line " + line + ": " + str);
}

function fromWylieOneTsekbar(tokens, i) { // (str, int)
	var orig_i = i
	var t = tokens[i]
	// variables for tracking the state within the syllable as we parse it
	var stack = null
	var prev_cons = ''
	var visarga = false
	// variables for checking the root letter, after parsing a whole tsekbar made of only single
	// consonants and one consonant with "a" vowel
	var check_root = true
	var consonants = [] // strings
	var root_idx = -1
	var out = ''
	var warns = []
	// the type of token that we are expecting next in the input stream
	//   - PREFIX : expect a prefix consonant, or a main stack
	//   - MAIN   : expect only a main stack
	//   - SUFF1  : expect a 1st suffix 
	//   - SUFF2  : expect a 2nd suffix
	//   - NONE   : expect nothing (after a 2nd suffix)
	//
	// the state machine is actually more lenient than this, in that a "main stack" is allowed
	// to come at any moment, even after suffixes.  this is because such syllables are sometimes
	// found in abbreviations or other places.  basically what we check is that prefixes and 
	// suffixes go with what they are attached to.
	//
	// valid tsek-bars end in one of these states: SUFF1, SUFF2, NONE
	var state = State.PREFIX;

	// iterate over the stacks of a tsek-bar
	STACK:
	while (t != null && (vowel(t) != null || consonant(t) != null) && !visarga) {
		// translate a stack
		if (stack != null) prev_cons = stack.single_consonant;
		stack = fromWylieOneStack(tokens, i);
		i += stack.tokens_used;
		t = tokens[i];
		out += stack.uni_string;
		warns = warns.concat(stack.warns);
		visarga = stack.visarga;
		if (!opt.check) continue;
		// check for syllable structure consistency by iterating a simple state machine
		// - prefix consonant
		if (state == State.PREFIX && stack.single_consonant != null) {
			consonants.push(stack.single_consonant);
			if (isPrefix(stack.single_consonant)) {
			var next = t;
			if (opt.check_strict) next = consonantString(tokens, i);
			if (next != null && !prefix(stack.single_consonant, next)) {
				next = next.replace(/\+/g, "");
				warns.push("Prefix \"" + stack.single_consonant + "\" does not occur before \"" + next + "\".");
			}
		} else {
			warns.push("Invalid prefix consonant: \"" + stack.single_consonant + "\".");
		}
		state = State.MAIN;
		// - main stack with vowel or multiple consonants
		} else if (stack.single_consonant == null) {
		state = State.SUFF1;
		// keep track of the root consonant if it was a single cons with an "a" vowel
		if (root_idx >= 0) {
			check_root = false;
		} else if (stack.single_cons_a != null) {
			consonants.push(stack.single_cons_a);
			root_idx = consonants.length - 1;
		}
		// - unexpected single consonant after prefix
		} else if (state == State.MAIN) {
			warns.push("Expected vowel after \"" + stack.single_consonant + "\".");
			// - 1st suffix
		} else if (state == State.SUFF1) {
			consonants.push(stack.single_consonant);
			// check this one only in strict mode b/c it trips on lots of Skt stuff
			if (opt.check_strict) {
				if (!isSuffix(stack.single_consonant)) {
					warns.push("Invalid suffix consonant: \"" + stack.single_consonant + "\".");
				}
			}
			state = State.SUFF2;
			// - 2nd suffix
		} else if (state == State.SUFF2) {
			consonants.push(stack.single_consonant);
			if (isSuff2(stack.single_consonant)) {
				if (!suff2(stack.single_consonant, prev_cons)) {
					warns.push("Second suffix \"" + stack.single_consonant 
					+ "\" does not occur after \"" + prev_cons + "\".");
				}
			} else {
				warns.push("Invalid 2nd suffix consonant: \"" + stack.single_consonant  + "\".");
			}
			state = State.NONE;
			// - more crap after a 2nd suffix
		} else if (state == State.NONE) {
			warns.push("Cannot have another consonant \"" + stack.single_consonant + "\" after 2nd suffix.");
		}
	}

	if (state == State.MAIN && stack.single_consonant != null && isPrefix(stack.single_consonant)) {
	warns.push("Vowel expected after \"" + stack.single_consonant + "\".");
	}

	// check root consonant placement only if there were no warnings so far, and the syllable 
	// looks ambiguous.  not many checks are needed here because the previous state machine 
	// already takes care of most illegal combinations.
	if (opt.check && warns.length == 0 && check_root && root_idx >= 0) {
		// 2 letters where each could be prefix/suffix: root is 1st
		if (consonants.length == 2 && root_idx != 0 
		&& prefix(consonants[0], consonants[1]) && isSuffix(consonants[1]))
		{
			warns.push("Syllable should probably be \"" + consonants[0] + "a" + consonants[1] + "\".");

			// 3 letters where 1st can be prefix, 2nd can be postfix before "s" and last is "s":
			// use a lookup table as this is completely ambiguous.
		} else if (consonants.length == 3 && isPrefix(consonants[0]) &&
			suff2("s", consonants[1]) && consonants[2] == "s")
		{
			var cc = consonants.join("");
			cc = cc.replace(/\u2018/g, '\'');
			cc = cc.replace(/\u2019/g, '\'');	// typographical quotes
			var expect_key = ambiguous_key(cc);
	//		console.log('typeof expect_key', typeof expect_key)
			if (expect_key != null && expect_key != root_idx) {
				warns.push("Syllable should probably be \"" + ambiguous_wylie(cc) + "\".");
			}
		}
	}
	// return the stuff as a WylieTsekbar struct
	var ret = new WylieTsekbar();
	ret.uni_string = out;
	ret.tokens_used = i - orig_i;
	ret.warns = warns;
	return ret;
}

    // Converts one stack's worth of Wylie into unicode, starting at the given index
    // within the array of tokens.
    // Assumes that the first available token is valid, and is either a vowel or a consonant.
    // Returns a WylieStack object.
function fromWylieOneStack(tokens, i) {
	var orig_i = i
	var t = '', t2 = '', o = ''
	var out = ''
	var warns = []
	var consonants = 0		// how many consonants found
	var vowel_found = null; // any vowels (including a-chen)
	var vowel_sign = null; // any vowel signs (that go under or above the main stack)
	var single_consonant = null; // did we find just a single consonant?
	var plus = false;		// any explicit subjoining via '+'?
	var caret = 0;			// find any '^'?
	var final_found = new newHashMap(); // keep track of finals (H, M, etc) by class

	// do we have a superscript?
	t = tokens[i]
	t2 = tokens[i + 1]
	if (t2 != null && isSuperscript(t) && superscript(t, t2)) {
		if (opt.check_strict) {
			var next = consonantString(tokens, i + 1);
			if (!superscript(t, next)) {
				next = next.replace(/\+/g, '')
				warns.push("Superscript \"" + t + "\" does not occur above combination \"" + next + "\".");
			}
		}
		out += consonant(t);
		consonants++;
		i++;
		while (tokens[i] != null && tokens[i] == ("^")) { caret++; i++; }
	}
	// main consonant + stuff underneath.
	// this is usually executed just once, but the "+" subjoining operator makes it come back here
	MAIN: 
	while (true) {
		// main consonant (or a "a" after a "+")
		t = tokens[i];
		if (consonant(t) != null || (out.length > 0 && subjoined(t) != null)) {
			if (out.length > 0) {
				out += (subjoined(t));
			} else {
				out += (consonant(t));
			}
			i++;

			if (t == "a") {
				vowel_found = "a";
			} else {
				consonants++;
				single_consonant = t;
			}

			while (tokens[i] != null && tokens[i] == "^") {
				caret++;
				i++;
			}
			// subjoined: rata, yata, lata, wazur.  there can be up two subjoined letters in a stack.
			for (var z = 0; z < 2; z++) {
				t2 = tokens[i];
				if (t2 != null && isSubscript(t2)) {
					// lata does not occur below multiple consonants 
					// (otherwise we mess up "brla" = "b.r+la")
					if (t2 == "l" && consonants > 1) break;
					// full stack checking (disabled by "+")
					if (opt.check_strict && !plus) {
						var prev = consonantStringBackwards(tokens, i-1, orig_i);
						if (!subscript(t2, prev)) {
							prev = prev.replace(/\+/g, "");
							warns.push("Subjoined \"" + t2 + "\" not expected after \"" + prev + "\".");
						}
						// simple check only
					} else if (opt.check) {
						if (!subscript(t2, t) && !(z == 1 && t2 == ("w") && t == ("y"))) {
							warns.push("Subjoined \"" + t2 + "\"not expected after \"" + t + "\".");
						}
					}
					out += subjoined(t2);
					i++;
					consonants++;
					while (tokens[i] != null && tokens[i] == ("^")) { caret++; i++; }
					t = t2;
				} else {
					break;
				}
			}
		}

		// caret (^) can come anywhere in Wylie but in Unicode we generate it at the end of 
		// the stack but before vowels if it came there (seems to be what OpenOffice expects),
		// or at the very end of the stack if that's how it was in the Wylie.
		if (caret > 0) {
			if (caret > 1) {
				warns.push("Cannot have more than one \"^\" applied to the same stack.");
			}
			final_found.put(final_class("^"), "^");
			out += (final_uni("^"));
			caret = 0;
		}
		// vowel(s)
		t = tokens[i];
		if (t != null && vowel(t) != null) {
			if (out.length == 0) out += (vowel("a"));
			if (t != "a") out += (vowel(t));
			i++;
			vowel_found = t;
			if (t != "a") vowel_sign = t;
		}
		// plus sign: forces more subjoining
		t = tokens[i];
		if (t != null && t == ("+")) {
			i++;
			plus = true;
			// sanity check: next token must be vowel or subjoinable consonant.  
			t = tokens[i];
			if (t == null || (vowel(t) == null && subjoined(t) == null)) {
				if (opt.check) warns.push("Expected vowel or consonant after \"+\".");
				break MAIN;
			}
			// consonants after vowels doesn't make much sense but process it anyway
			if (opt.check) {
				if (vowel(t) == null && vowel_sign != null) {
					warns.push("Cannot subjoin consonant (" + t + ") after vowel (" + vowel_sign + ") in same stack.");
				} else if (t == ("a") && vowel_sign != null) {
					warns.push("Cannot subjoin a-chen (a) after vowel (" + vowel_sign + ") in same stack.");
				}
			}
			continue MAIN;
		}
		break MAIN;
	}
	// final tokens
	t = tokens[i];
	while (t != null && final_class(t) != null) {
		var uni = final_uni(t);
		var klass = final_class(t);
		// check for duplicates
		if (final_found.containsKey(klass)) {
			if (final_found.get(klass) == t) {
				warns.push("Cannot have two \"" + t + "\" applied to the same stack.");
			} else {
				warns.push("Cannot have \"" + t + "\" and \"" + final_found.get(klass)
					+ "\" applied to the same stack.");
			}
		} else {
			final_found.put(klass, t);
			out += (uni);
		}
		i++;
		single_consonant = null;
		t = tokens[i];
	}
	// if next is a dot "." (stack separator), skip it.
	if (tokens[i] != null && tokens[i] == (".")) i++;
	// if we had more than a consonant and no vowel, and no explicit "+" joining, backtrack and 
	// return the 1st consonant alone
	if (consonants > 1 && vowel_found == null) {
		if (plus) {
			if (opt.check) warns.push("Stack with multiple consonants should end with vowel.");
		} else {
			i = orig_i + 1;
			consonants = 1;
			single_consonant = tokens[orig_i];
			out = '';
			out += (consonant(single_consonant));
		}
	}
	// calculate "single consonant"
	if (consonants != 1 || plus) {
		single_consonant = null;
	}
	// return the stuff as a WylieStack struct
	var ret = new WylieStack();
	ret.uni_string = out;
	ret.tokens_used = i - orig_i;
	if (vowel_found != null) {
		ret.single_consonant = null;
	} else {
		ret.single_consonant = single_consonant;
	}

	if (vowel_found != null && vowel_found == ("a")) {
		ret.single_cons_a = single_consonant;
	} else {
		ret.single_cons_a = null;
	}
	ret.warns = warns;
	ret.visarga = final_found.containsKey("H");
	return ret;
}

	// Converts a Wylie (EWTS) string to unicode.  If 'warns' is not 'null', puts warnings into it.
function fromWylie(str, warns) {
		var out = '', line = 1, units = 0, i = 0
		if (opt.fix_spacing) { str = str.replace(/^\s+/, '') }
		var tokens = splitIntoTokens(str);
		ITER:while (tokens[i] != null) {
			var t = tokens[i], o = null
			// [non-tibetan text] : pass through, nesting brackets
			if (t == "[") {
				var nesting = 1;
				i++;
					ESC:while (tokens[i] != null) {
					t = tokens[i++];
					if (t == "[") nesting++;
					if (t == "]") nesting--;
					if (nesting == 0) continue ITER;
					// handle unicode escapes and \1-char escapes within [comments]...
					if (t.charAt(0) == '\\' && (t.charAt(1) == 'u' || t.charAt(1) == 'U')) {
						o = unicodeEscape(warns, line, t);
						if (o != null) {
							out += o;
							continue ESC;
						}
					}
					if (t.charAt(0) == '\\') {
						o = t.substring(1);
					} else {
						o = t;
					}
					out += o;
				}
				warnl(warns, line, "Unfinished [non-Wylie stuff].");
				break ITER;
			}
			// punctuation, numbers, etc
			o = other(t);
			if (o != null) {
				out += o;
				i++;
				units++;
				// collapse multiple spaces?
				if (t == " " && opt.fix_spacing) {
					while (tokens[i] != null && tokens[i] == " ") i++;
				}
				continue ITER;
			}
			// vowels & consonants: process tibetan script up to a tsek, punctuation or line noise
			if (vowel(t) != null || consonant(t) != null) {
				var tb = fromWylieOneTsekbar(tokens, i);
				var word = '';
				for (var j = 0; j < tb.tokens_used; j++) {
					word += (tokens[i+j]);
				}
				out += tb.uni_string;
				i += tb.tokens_used;
				units++;
				for (var w = 0; w < tb.warns.length; w++) {
					warnl(warns, line, "\"" + word + "\": " + tb.warns[w]);
				}
				continue ITER;
			}
			// *** misc unicode and line handling stuff ***
			// ignore BOM and zero-width space
			if (t == "\ufeff" || t == "\u200b") {
				i++;
				continue ITER;
			}
			// \\u, \\U unicode characters
			if (t.charAt(0) == '\\' && (t.charAt(1) == 'u' || t.charAt(1) == 'U')) {
				o = unicodeEscape(warns, line, t);
				if (o != null) {
					i++;
					out += o;
					continue ITER;
				}
			}
			// backslashed characters
			if (t.charAt(0) == '\\') {
				out += t.substring(1);
				i++;
				continue ITER;
			}
			// count lines
			if (t == "\r\n" || t == "\n" || t == "\r") {
				line++;
				out += t;
				i++;
				// also eat spaces after newlines (optional)
				if (opt.fix_spacing) {
					while (tokens[i] != null && tokens[i] == " ") i++;
				}
				continue ITER;
			}
			// stuff that shouldn't occur out of context: special chars and remaining [a-zA-Z]
			var c = t.charAt(0);
			if (isSpecial(t) || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
				warnl(warns, line, "Unexpected character \"" + t + "\".");
			}
			// anything else: pass through
			out += t;
			i++;
		}
		if (units == 0) warn(warns, "No Tibetan characters found!");
		return out
	}
	
	// given a character, return a string like "\\uxxxx", with its code in hex
function formatHex(t) { //char
		// not compatible with GWT...
		// return String.format("\\u%04x", (int)t);
		var sb = '';
		sb += '\\u';
		var s = t.charCodeAt(0).toString(16);
		for (var i = s.length; i < 4; i++) sb += '0';
		sb += s;
		return sb;
	}

	// handles spaces (if any) in the input stream, turning them into '_'.
	// this is abstracted out because in non-escaping mode, we only want to turn spaces into _
	// when they come in the middle of Tibetan script.
function handleSpaces(str, i, out) { //return int
	var found = 0;
	var orig_i = i;
	while (i < str.length && str.charAt(i) == ' ') {
		i++;
		found++;
	}
	if (found == 0 || i == str.length) return 0;
	var t = str.charAt(i);
	if (tib_top(t) == null && tib_other(t) == null) return 0;
	// found 'found' spaces between two tibetan bits; generate the same number of '_'s
	for (i = 0; i < found; i++) out += '_';
	return found;
}

// for space-handling in escaping mode: is the next thing coming (after a number of spaces)
// some non-tibetan bit, within the same line?
function followedByNonTibetan(str, i) {
	var len = str.length;
	while (i < len && str.charAt(i) == ' ') i++;
	if (i == len) return false;
	var t = str.charAt(i);
	return tib_top(t) == null && tib_other(t) == null && t != '\r' && t != '\n';
}

// Convert Unicode to Wylie: one tsekbar
function toWylieOneTsekbar(str, len, i) {
	var orig_i = i;
	var warns = [];
	var stacks = [];// ArrayList<ToWylieStack>;
	ITER: 
	while (true) {
		var st = toWylieOneStack(str, len, i);
		stacks.push(st);
		warns = warns.concat(st.warns);
		i += st.tokens_used;
		if (st.visarga) break ITER;
		if (i >= len || tib_top(str.charAt(i)) == null) break ITER;
	}
	// figure out if some of these stacks can be prefixes or suffixes (in which case
	// they don't need their "a" vowels)
	var last = stacks.length - 1;
	if (stacks.length > 1 && stacks[0].single_cons != null) {
		// we don't count the wazur in the root stack, for prefix checking
		var cs = stacks[1].cons_str.replace(/\+w/g, "")
		if (prefix(stacks[0].single_cons, cs)) stacks[0].prefix = true;
	}
	if (stacks.length > 1 && stacks[last].single_cons != null 
	&& isSuffix(stacks[last].single_cons)) {
		stacks[last].suffix = true;
	}
	if (stacks.length > 2 && stacks[last].single_cons != null 
	&& stacks[last - 1].single_cons != null
	&& isSuffix(stacks[last - 1].single_cons)
	&& suff2(stacks[last].single_cons, stacks[last - 1].single_cons)) {
		stacks[last].suff2 = true;
		stacks[last - 1].suffix = true;
	}
	// if there are two stacks and both can be prefix-suffix, then 1st is root
	if (stacks.length == 2 && stacks[0].prefix && stacks[1].suffix) {
	    stacks[0].prefix = false;
	}
	// if there are three stacks and they can be prefix, suffix and suff2, then check w/ a table
	if (stacks.length == 3 && stacks[0].prefix && stacks[1].suffix && stacks[2].suff2) {
		var strb = []
		for (var si = 0; si < stacks.length; si++) strb.push(stacks[si].single_cons)
		var ztr = strb.join('')
		var root = ambiguous_key(ztr)
		if (root == null) {
			warns.push("Ambiguous syllable found: root consonant not known for \"" + ztr + "\".")
			// make it up...  (ex. "mgas" for ma, ga, sa)
			root = 1
		}
		stacks[root].prefix = stacks[root].suffix = false
		stacks[root + 1].suff2 = false
	}
	// if the prefix together with the main stack could be mistaken for a single stack, add a "."
	if (stacks[0].prefix && tib_stack(stacks[0].single_cons + "+" + stacks[1].cons_str)) 
		stacks[0].dot = true;
	// put it all together
	var out = ''
	for (var si = 0; si < stacks.length; si++) out += putStackTogether(stacks[si])
	var ret = new ToWylieTsekbar();
	ret.wylie = out;
	ret.tokens_used = i - orig_i;
	ret.warns = warns;
	return ret;
}
	 
// Unicode to Wylie: one stack at a time
function toWylieOneStack(str, len, i) {
	var orig_i = i;
	var ffinal = null, vowel = null, klass = null;
	// split the stack into a ToWylieStack object:
	//   - top symbol
	//   - stacked signs (first is the top symbol again, then subscribed main characters...)
	//   - caret (did we find a stray tsa-phru or not?)
	//   - vowel signs (including small subscribed a-chung, "-i" Skt signs, etc)
	//   - final stuff (including anusvara, visarga, halanta...)
	//   - and some more variables to keep track of what has been found
	var st = new ToWylieStack();
	// assume: tib_top(t) exists
	var t = str.charAt(i++);
	st.top = tib_top(t);
	st.stack.push(tib_top(t));
	// grab everything else below the top sign and classify in various categories
	while (i < len) {
		t = str.charAt(i);
		var o;
		if ((o = tib_subjoined(t)) != null) {
			i++;
			st.stack.push(o);
			// check for bad ordering
			if (st.finals.length > 0) {
				st.warns.push("Subjoined sign \"" + o + "\" found after final sign \"" + ffinal + "\".");
			} else if (st.vowels.length > 0) {
				st.warns.push("Subjoined sign \"" + o + "\" found after vowel sign \"" + vowel + "\".");
			}
		} else if ((o = tib_vowel(t)) != null) {
			i++;
			st.vowels.push(o);
			if (vowel == null) vowel = o;
			// check for bad ordering
			if (st.finals.length > 0) {
				st.warns.push("Vowel sign \"" + o + "\" found after final sign \"" + ffinal + "\".");
			}
		} else if ((o = tib_final_wylie(t)) != null) {
			i++;
			klass = tib_final_class(t);
			if (o == "^") {
				st.caret = true;
			} else {
				if (o == "H") st.visarga = true;
				st.finals.push(o);
				if (ffinal == null) ffinal = o;
				// check for invalid combinations
				if (st.finals_found.containsKey(klass)) {
					st.warns.push("Final sign \"" + o 
					+ "\" should not combine with found after final sign \"" + ffinal + "\".");
				} else {
					st.finals_found.put(klass, o);
				}
			}
		} else break;
	}
	// now analyze the stack according to various rules
	// a-chen with vowel signs: remove the "a" and keep the vowel signs
	if (st.top == "a" && st.stack.length == 1 && st.vowels.length > 0) st.stack.shift();
	// handle long vowels: A+i becomes I, etc.
	if (st.vowels.length > 1 && st.vowels[0] == "A" && tib_vowel_long(st.vowels[1]) != null) {
		var l = tib_vowel_long(st.vowels[1]);
		st.vowels.shift();
		st.vowels.shift();
		st.vowels.unshift(l);
	}
	// special cases: "ph^" becomes "f", "b^" becomes "v"
	if (st.caret && st.stack.length == 1 && tib_caret(st.top) != null) {
		var l = tib_caret(st.top);
		st.top = l;
		st.stack.shift();
		st.stack.unshift(l);
		st.caret = false;
	}
	st.cons_str = st.stack.join("+");
	// if this is a single consonant, keep track of it (useful for prefix/suffix analysis)
	if (st.stack.length == 1 && st.stack[0] != ("a") && !st.caret 
	&& st.vowels.length == 0 && st.finals.length == 0) {
		st.single_cons = st.cons_str;
	}
	// return the analyzed stack
	st.tokens_used = i - orig_i;
	return st;
}

// Puts an analyzed stack together into Wylie output, adding an implicit "a" if needed.
function putStackTogether(st) {
	var out = '';
	// put the main elements together... stacked with "+" unless it's a regular stack
	if (tib_stack(st.cons_str)) {
	    out += st.stack.join("");
	} else out += (st.cons_str);
	// caret (tsa-phru) goes here as per some (halfway broken) Unicode specs...
	if (st.caret) out += ("^");
	// vowels...
	if (st.vowels.length > 0) {
		out += st.vowels.join("+");
	} else if (!st.prefix && !st.suffix && !st.suff2
	&& (st.cons_str.length == 0 || st.cons_str.charAt(st.cons_str.length - 1) != 'a')) {
		out += "a"
	}
	// final stuff
	out += st.finals.join("");
	if (st.dot) out += ".";
	return out;
}

	// Converts from Unicode strings to Wylie (EWTS) transliteration.
	//
	// Arguments are:
	//    str   : the unicode string to be converted
	//    escape: whether to escape non-tibetan characters according to Wylie encoding.
	//            if escape == false, anything that is not tibetan will be just passed through.
	//
	// Returns: the transliterated string.
	//
	// To get the warnings, call getWarnings() afterwards.

function toWylie(str, warns, escape) {
	if (escape == undefined) escape = true
	var out = ''
	var line = 1
	var units = 0
	// globally search and replace some deprecated pre-composed Sanskrit vowels
	str = str.replace(/\u0f76/g, "\u0fb2\u0f80")
	str = str.replace(/\u0f77/g, "\u0fb2\u0f71\u0f80")
	str = str.replace(/\u0f78/g, "\u0fb3\u0f80")
	str = str.replace(/\u0f79/g, "\u0fb3\u0f71\u0f80")
	str = str.replace(/\u0f81/g, "\u0f71\u0f80")
	var i = 0
	var len = str.length
	// iterate over the string, codepoint by codepoint
	ITER:
	while (i < len) {
		var t = str.charAt(i);
		// found tibetan script - handle one tsekbar
		if (tib_top(t) != null) {
			var tb = toWylieOneTsekbar(str, len, i);
			out += tb.wylie;
			i += tb.tokens_used;
			units++;
			for (var w = 0; w < tb.warns.length; w++) warnl(warns, line, tb.warns[w]);
			if (!escape) i += handleSpaces(str, i, out);
			continue ITER;
		}
		// punctuation and special stuff. spaces are tricky:
		// - in non-escaping mode: spaces are not turned to '_' here (handled by handleSpaces)
		// - in escaping mode: don't do spaces if there is non-tibetan coming, so they become part
		//   of the [escaped block].
		var o = tib_other(t);
		if (o != null && (t != ' ' || (escape && !followedByNonTibetan(str, i)))) {
			out += o;
			i++;
			units++;
			if (!escape) i += handleSpaces(str, i, out);
			continue ITER;
		}
		// newlines, count lines.  "\r\n" together count as one newline.
		if (t == '\r' || t == '\n') {
			line++;
			i++;
			out += t;
			if (t == '\r' && i < len && str.charAt(i) == '\n') {
				i++;
				out += ('\n');
			}
			continue ITER;
		}
		// ignore BOM and zero-width space
		if (t == '\ufeff' || t == '\u200b') {
			i++;
			continue ITER;
		}
		// anything else - pass along?
		if (!escape) {
			out += (t);
			i++;
			continue ITER;
		}
		// other characters in the tibetan plane, escape with \\u0fxx
		if (t >= '\u0f00' && t <= '\u0fff') {
			var c = formatHex(t);
			out += c;
			i++;
			// warn for tibetan codepoints that should appear only after a tib_top
			if (tib_subjoined(t) != null || tib_vowel(t) != null || tib_final_wylie(t) != null) {
				warnl(warns, line, "Tibetan sign " + c + " needs a top symbol to attach to.");
			}
			continue ITER;
		}
		// ... or escape according to Wylie:
		// put it in [comments], escaping [] sequences and closing at line ends
		out += "[";
		while (tib_top(t) == null && (tib_other(t) == null || t == ' ') && t != '\r' && t != '\n') {
			// \escape [opening and closing] brackets
			if (t == '[' || t == ']') {
				out += "\\";
				out += t;
			// unicode-escape anything in the tibetan plane (i.e characters not handled by Wylie)
			} else if (t >= '\u0f00' && t <= '\u0fff') {
				out += formatHex(t);
				// and just pass through anything else!
			} else {
				out += t;
			}
			if (++i >= len) break;
			t = str.charAt(i);
		}
		 out += "]";
	}
	return out;
}
module.exports= {
		fromWylie: fromWylie,
		toWylie: toWylie,
		setopt: setopt,
		getopt: function() { return opt },
		five: function() {
			return 555;
		}
}



});
require.register("ksana-document/languages.js", function(exports, require, module){
var tibetan={
	romanize:require("./tibetan/wylie")
}
var chinese={};
var languages={
	tibetan:tibetan
	,chinese:chinese
}

module.exports=languages;
});
require.register("ksana-document/diff.js", function(exports, require, module){
/**
 * Diff Match and Patch
 *
 * Copyright 2006 Google Inc.
 * http://code.google.com/p/google-diff-match-patch/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Computes the difference between two texts to create a patch.
 * Applies the patch onto another text, allowing for errors.
 * @author fraser@google.com (Neil Fraser)
 */

/**
 * Class containing the diff, match and patch methods.
 * @constructor
 */
function diff_match_patch() {

  // Defaults.
  // Redefine these in your program to override the defaults.

  // Number of seconds to map a diff before giving up (0 for infinity).
  this.Diff_Timeout = 1.0;
  // Cost of an empty edit operation in terms of edit characters.
  this.Diff_EditCost = 4;
  // At what point is no match declared (0.0 = perfection, 1.0 = very loose).
  this.Match_Threshold = 0.5;
  // How far to search for a match (0 = exact location, 1000+ = broad match).
  // A match this many characters away from the expected location will add
  // 1.0 to the score (0.0 is a perfect match).
  this.Match_Distance = 1000;
  // When deleting a large block of text (over ~64 characters), how close do
  // the contents have to be to match the expected contents. (0.0 = perfection,
  // 1.0 = very loose).  Note that Match_Threshold controls how closely the
  // end points of a delete need to match.
  this.Patch_DeleteThreshold = 0.5;
  // Chunk size for context length.
  this.Patch_Margin = 4;

  // The number of bits in an int.
  this.Match_MaxBits = 32;
}


//  DIFF FUNCTIONS


/**
 * The data structure representing a diff is an array of tuples:
 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
 */
var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;

/** @typedef {{0: number, 1: string}} */
diff_match_patch.Diff;


/**
 * Find the differences between two texts.  Simplifies the problem by stripping
 * any common prefix or suffix off the texts before diffing.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean=} opt_checklines Optional speedup flag. If present and false,
 *     then don't run a line-level diff first to identify the changed areas.
 *     Defaults to true, which does a faster, slightly less optimal diff.
 * @param {number} opt_deadline Optional time when the diff should be complete
 *     by.  Used internally for recursive calls.  Users should set DiffTimeout
 *     instead.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 */
diff_match_patch.prototype.diff_main = function(text1, text2, opt_checklines,
    opt_deadline) {
  // Set a deadline by which time the diff must be complete.
  if (typeof opt_deadline == 'undefined') {
    if (this.Diff_Timeout <= 0) {
      opt_deadline = Number.MAX_VALUE;
    } else {
      opt_deadline = (new Date).getTime() + this.Diff_Timeout * 1000;
    }
  }
  var deadline = opt_deadline;

  // Check for null inputs.
  if (text1 == null || text2 == null) {
    throw new Error('Null input. (diff_main)');
  }

  // Check for equality (speedup).
  if (text1 == text2) {
    if (text1) {
      return [[DIFF_EQUAL, text1]];
    }
    return [];
  }

  if (typeof opt_checklines == 'undefined') {
    opt_checklines = true;
  }
  var checklines = opt_checklines;

  // Trim off common prefix (speedup).
  var commonlength = this.diff_commonPrefix(text1, text2);
  var commonprefix = text1.substring(0, commonlength);
  text1 = text1.substring(commonlength);
  text2 = text2.substring(commonlength);

  // Trim off common suffix (speedup).
  commonlength = this.diff_commonSuffix(text1, text2);
  var commonsuffix = text1.substring(text1.length - commonlength);
  text1 = text1.substring(0, text1.length - commonlength);
  text2 = text2.substring(0, text2.length - commonlength);

  // Compute the diff on the middle block.
  var diffs = this.diff_compute_(text1, text2, checklines, deadline);

  // Restore the prefix and suffix.
  if (commonprefix) {
    diffs.unshift([DIFF_EQUAL, commonprefix]);
  }
  if (commonsuffix) {
    diffs.push([DIFF_EQUAL, commonsuffix]);
  }
  this.diff_cleanupMerge(diffs);
  return diffs;
};


/**
 * Find the differences between two texts.  Assumes that the texts do not
 * have any common prefix or suffix.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean} checklines Speedup flag.  If false, then don't run a
 *     line-level diff first to identify the changed areas.
 *     If true, then run a faster, slightly less optimal diff.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_compute_ = function(text1, text2, checklines,
    deadline) {
  var diffs;

  if (!text1) {
    // Just add some text (speedup).
    return [[DIFF_INSERT, text2]];
  }

  if (!text2) {
    // Just delete some text (speedup).
    return [[DIFF_DELETE, text1]];
  }

  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  var i = longtext.indexOf(shorttext);
  if (i != -1) {
    // Shorter text is inside the longer text (speedup).
    diffs = [[DIFF_INSERT, longtext.substring(0, i)],
             [DIFF_EQUAL, shorttext],
             [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
    // Swap insertions for deletions if diff is reversed.
    if (text1.length > text2.length) {
      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
    }
    return diffs;
  }

  if (shorttext.length == 1) {
    // Single character string.
    // After the previous speedup, the character can't be an equality.
    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
  }

  // Check to see if the problem can be split in two.
  var hm = this.diff_halfMatch_(text1, text2);
  if (hm) {
    // A half-match was found, sort out the return data.
    var text1_a = hm[0];
    var text1_b = hm[1];
    var text2_a = hm[2];
    var text2_b = hm[3];
    var mid_common = hm[4];
    // Send both pairs off for separate processing.
    var diffs_a = this.diff_main(text1_a, text2_a, checklines, deadline);
    var diffs_b = this.diff_main(text1_b, text2_b, checklines, deadline);
    // Merge the results.
    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
  }

  if (checklines && text1.length > 100 && text2.length > 100) {
    return this.diff_lineMode_(text1, text2, deadline);
  }

  return this.diff_bisect_(text1, text2, deadline);
};


/**
 * Do a quick line-level diff on both strings, then rediff the parts for
 * greater accuracy.
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_lineMode_ = function(text1, text2, deadline) {
  // Scan the text on a line-by-line basis first.
  var a = this.diff_linesToChars_(text1, text2);
  text1 = a.chars1;
  text2 = a.chars2;
  var linearray = a.lineArray;

  var diffs = this.diff_main(text1, text2, false, deadline);

  // Convert the diff back to original text.
  this.diff_charsToLines_(diffs, linearray);
  // Eliminate freak matches (e.g. blank lines)
  this.diff_cleanupSemantic(diffs);

  // Rediff any replacement blocks, this time character-by-character.
  // Add a dummy entry at the end.
  diffs.push([DIFF_EQUAL, '']);
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        break;
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete >= 1 && count_insert >= 1) {
          // Delete the offending records and add the merged ones.
          diffs.splice(pointer - count_delete - count_insert,
                       count_delete + count_insert);
          pointer = pointer - count_delete - count_insert;
          var a = this.diff_main(text_delete, text_insert, false, deadline);
          for (var j = a.length - 1; j >= 0; j--) {
            diffs.splice(pointer, 0, a[j]);
          }
          pointer = pointer + a.length;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
    pointer++;
  }
  diffs.pop();  // Remove the dummy entry at the end.

  return diffs;
};


/**
 * Find the 'middle snake' of a diff, split the problem in two
 * and return the recursively constructed diff.
 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisect_ = function(text1, text2, deadline) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  var max_d = Math.ceil((text1_length + text2_length) / 2);
  var v_offset = max_d;
  var v_length = 2 * max_d;
  var v1 = new Array(v_length);
  var v2 = new Array(v_length);
  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
  // integers and undefined.
  for (var x = 0; x < v_length; x++) {
    v1[x] = -1;
    v2[x] = -1;
  }
  v1[v_offset + 1] = 0;
  v2[v_offset + 1] = 0;
  var delta = text1_length - text2_length;
  // If the total number of characters is odd, then the front path will collide
  // with the reverse path.
  var front = (delta % 2 != 0);
  // Offsets for start and end of k loop.
  // Prevents mapping of space beyond the grid.
  var k1start = 0;
  var k1end = 0;
  var k2start = 0;
  var k2end = 0;
  for (var d = 0; d < max_d; d++) {
    // Bail out if deadline is reached.
    if ((new Date()).getTime() > deadline) {
      break;
    }

    // Walk the front path one step.
    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
      var k1_offset = v_offset + k1;
      var x1;
      if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
        x1 = v1[k1_offset + 1];
      } else {
        x1 = v1[k1_offset - 1] + 1;
      }
      var y1 = x1 - k1;
      while (x1 < text1_length && y1 < text2_length &&
             text1.charAt(x1) == text2.charAt(y1)) {
        x1++;
        y1++;
      }
      v1[k1_offset] = x1;
      if (x1 > text1_length) {
        // Ran off the right of the graph.
        k1end += 2;
      } else if (y1 > text2_length) {
        // Ran off the bottom of the graph.
        k1start += 2;
      } else if (front) {
        var k2_offset = v_offset + delta - k1;
        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
          // Mirror x2 onto top-left coordinate system.
          var x2 = text1_length - v2[k2_offset];
          if (x1 >= x2) {
            // Overlap detected.
            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
          }
        }
      }
    }

    // Walk the reverse path one step.
    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
      var k2_offset = v_offset + k2;
      var x2;
      if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
        x2 = v2[k2_offset + 1];
      } else {
        x2 = v2[k2_offset - 1] + 1;
      }
      var y2 = x2 - k2;
      while (x2 < text1_length && y2 < text2_length &&
             text1.charAt(text1_length - x2 - 1) ==
             text2.charAt(text2_length - y2 - 1)) {
        x2++;
        y2++;
      }
      v2[k2_offset] = x2;
      if (x2 > text1_length) {
        // Ran off the left of the graph.
        k2end += 2;
      } else if (y2 > text2_length) {
        // Ran off the top of the graph.
        k2start += 2;
      } else if (!front) {
        var k1_offset = v_offset + delta - k2;
        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
          var x1 = v1[k1_offset];
          var y1 = v_offset + x1 - k1_offset;
          // Mirror x2 onto top-left coordinate system.
          x2 = text1_length - x2;
          if (x1 >= x2) {
            // Overlap detected.
            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
          }
        }
      }
    }
  }
  // Diff took too long and hit the deadline or
  // number of diffs equals number of characters, no commonality at all.
  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
};


/**
 * Given the location of the 'middle snake', split the diff in two parts
 * and recurse.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} x Index of split point in text1.
 * @param {number} y Index of split point in text2.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisectSplit_ = function(text1, text2, x, y,
    deadline) {
  var text1a = text1.substring(0, x);
  var text2a = text2.substring(0, y);
  var text1b = text1.substring(x);
  var text2b = text2.substring(y);

  // Compute both diffs serially.
  var diffs = this.diff_main(text1a, text2a, false, deadline);
  var diffsb = this.diff_main(text1b, text2b, false, deadline);

  return diffs.concat(diffsb);
};


/**
 * Split two texts into an array of strings.  Reduce the texts to a string of
 * hashes where each Unicode character represents one line.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {{chars1: string, chars2: string, lineArray: !Array.<string>}}
 *     An object containing the encoded text1, the encoded text2 and
 *     the array of unique strings.
 *     The zeroth element of the array of unique strings is intentionally blank.
 * @private
 */
diff_match_patch.prototype.diff_linesToChars_ = function(text1, text2) {
  var lineArray = [];  // e.g. lineArray[4] == 'Hello\n'
  var lineHash = {};   // e.g. lineHash['Hello\n'] == 4

  // '\x00' is a valid character, but various debuggers don't like it.
  // So we'll insert a junk entry to avoid generating a null character.
  lineArray[0] = '';

  /**
   * Split a text into an array of strings.  Reduce the texts to a string of
   * hashes where each Unicode character represents one line.
   * Modifies linearray and linehash through being a closure.
   * @param {string} text String to encode.
   * @return {string} Encoded string.
   * @private
   */
  function diff_linesToCharsMunge_(text) {
    var chars = '';
    // Walk the text, pulling out a substring for each line.
    // text.split('\n') would would temporarily double our memory footprint.
    // Modifying text would create many large strings to garbage collect.
    var lineStart = 0;
    var lineEnd = -1;
    // Keeping our own length variable is faster than looking it up.
    var lineArrayLength = lineArray.length;
    while (lineEnd < text.length - 1) {
      lineEnd = text.indexOf('\n', lineStart);
      if (lineEnd == -1) {
        lineEnd = text.length - 1;
      }
      var line = text.substring(lineStart, lineEnd + 1);
      lineStart = lineEnd + 1;

      if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) :
          (lineHash[line] !== undefined)) {
        chars += String.fromCharCode(lineHash[line]);
      } else {
        chars += String.fromCharCode(lineArrayLength);
        lineHash[line] = lineArrayLength;
        lineArray[lineArrayLength++] = line;
      }
    }
    return chars;
  }

  var chars1 = diff_linesToCharsMunge_(text1);
  var chars2 = diff_linesToCharsMunge_(text2);
  return {chars1: chars1, chars2: chars2, lineArray: lineArray};
};


/**
 * Rehydrate the text in a diff from a string of line hashes to real lines of
 * text.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {!Array.<string>} lineArray Array of unique strings.
 * @private
 */
diff_match_patch.prototype.diff_charsToLines_ = function(diffs, lineArray) {
  for (var x = 0; x < diffs.length; x++) {
    var chars = diffs[x][1];
    var text = [];
    for (var y = 0; y < chars.length; y++) {
      text[y] = lineArray[chars.charCodeAt(y)];
    }
    diffs[x][1] = text.join('');
  }
};


/**
 * Determine the common prefix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the start of each
 *     string.
 */
diff_match_patch.prototype.diff_commonPrefix = function(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerstart = 0;
  while (pointermin < pointermid) {
    if (text1.substring(pointerstart, pointermid) ==
        text2.substring(pointerstart, pointermid)) {
      pointermin = pointermid;
      pointerstart = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Determine the common suffix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of each string.
 */
diff_match_patch.prototype.diff_commonSuffix = function(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 ||
      text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerend = 0;
  while (pointermin < pointermid) {
    if (text1.substring(text1.length - pointermid, text1.length - pointerend) ==
        text2.substring(text2.length - pointermid, text2.length - pointerend)) {
      pointermin = pointermid;
      pointerend = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Determine if the suffix of one string is the prefix of another.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of the first
 *     string and the start of the second string.
 * @private
 */
diff_match_patch.prototype.diff_commonOverlap_ = function(text1, text2) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  // Eliminate the null case.
  if (text1_length == 0 || text2_length == 0) {
    return 0;
  }
  // Truncate the longer string.
  if (text1_length > text2_length) {
    text1 = text1.substring(text1_length - text2_length);
  } else if (text1_length < text2_length) {
    text2 = text2.substring(0, text1_length);
  }
  var text_length = Math.min(text1_length, text2_length);
  // Quick check for the worst case.
  if (text1 == text2) {
    return text_length;
  }

  // Start by looking for a single character match
  // and increase length until no match is found.
  // Performance analysis: http://neil.fraser.name/news/2010/11/04/
  var best = 0;
  var length = 1;
  while (true) {
    var pattern = text1.substring(text_length - length);
    var found = text2.indexOf(pattern);
    if (found == -1) {
      return best;
    }
    length += found;
    if (found == 0 || text1.substring(text_length - length) ==
        text2.substring(0, length)) {
      best = length;
      length++;
    }
  }
};


/**
 * Do the two texts share a substring which is at least half the length of the
 * longer text?
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {Array.<string>} Five element Array, containing the prefix of
 *     text1, the suffix of text1, the prefix of text2, the suffix of
 *     text2 and the common middle.  Or null if there was no match.
 * @private
 */
diff_match_patch.prototype.diff_halfMatch_ = function(text1, text2) {
  if (this.Diff_Timeout <= 0) {
    // Don't risk returning a non-optimal diff if we have unlimited time.
    return null;
  }
  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
    return null;  // Pointless.
  }
  var dmp = this;  // 'this' becomes 'window' in a closure.

  /**
   * Does a substring of shorttext exist within longtext such that the substring
   * is at least half the length of longtext?
   * Closure, but does not reference any external variables.
   * @param {string} longtext Longer string.
   * @param {string} shorttext Shorter string.
   * @param {number} i Start index of quarter length substring within longtext.
   * @return {Array.<string>} Five element Array, containing the prefix of
   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
   *     of shorttext and the common middle.  Or null if there was no match.
   * @private
   */
  function diff_halfMatchI_(longtext, shorttext, i) {
    // Start with a 1/4 length substring at position i as a seed.
    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
    var j = -1;
    var best_common = '';
    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
      var prefixLength = dmp.diff_commonPrefix(longtext.substring(i),
                                               shorttext.substring(j));
      var suffixLength = dmp.diff_commonSuffix(longtext.substring(0, i),
                                               shorttext.substring(0, j));
      if (best_common.length < suffixLength + prefixLength) {
        best_common = shorttext.substring(j - suffixLength, j) +
            shorttext.substring(j, j + prefixLength);
        best_longtext_a = longtext.substring(0, i - suffixLength);
        best_longtext_b = longtext.substring(i + prefixLength);
        best_shorttext_a = shorttext.substring(0, j - suffixLength);
        best_shorttext_b = shorttext.substring(j + prefixLength);
      }
    }
    if (best_common.length * 2 >= longtext.length) {
      return [best_longtext_a, best_longtext_b,
              best_shorttext_a, best_shorttext_b, best_common];
    } else {
      return null;
    }
  }

  // First check if the second quarter is the seed for a half-match.
  var hm1 = diff_halfMatchI_(longtext, shorttext,
                             Math.ceil(longtext.length / 4));
  // Check again based on the third quarter.
  var hm2 = diff_halfMatchI_(longtext, shorttext,
                             Math.ceil(longtext.length / 2));
  var hm;
  if (!hm1 && !hm2) {
    return null;
  } else if (!hm2) {
    hm = hm1;
  } else if (!hm1) {
    hm = hm2;
  } else {
    // Both matched.  Select the longest.
    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
  }

  // A half-match was found, sort out the return data.
  var text1_a, text1_b, text2_a, text2_b;
  if (text1.length > text2.length) {
    text1_a = hm[0];
    text1_b = hm[1];
    text2_a = hm[2];
    text2_b = hm[3];
  } else {
    text2_a = hm[0];
    text2_b = hm[1];
    text1_a = hm[2];
    text1_b = hm[3];
  }
  var mid_common = hm[4];
  return [text1_a, text1_b, text2_a, text2_b, mid_common];
};


/**
 * Reduce the number of edits by eliminating semantically trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemantic = function(diffs) {
  var changes = false;
  var equalities = [];  // Stack of indices where equalities are found.
  var equalitiesLength = 0;  // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0;  // Index of current position.
  // Number of characters that changed prior to the equality.
  var length_insertions1 = 0;
  var length_deletions1 = 0;
  // Number of characters that changed after the equality.
  var length_insertions2 = 0;
  var length_deletions2 = 0;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {  // Equality found.
      equalities[equalitiesLength++] = pointer;
      length_insertions1 = length_insertions2;
      length_deletions1 = length_deletions2;
      length_insertions2 = 0;
      length_deletions2 = 0;
      lastequality = diffs[pointer][1];
    } else {  // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_INSERT) {
        length_insertions2 += diffs[pointer][1].length;
      } else {
        length_deletions2 += diffs[pointer][1].length;
      }
      // Eliminate an equality that is smaller or equal to the edits on both
      // sides of it.
      if (lastequality && (lastequality.length <=
          Math.max(length_insertions1, length_deletions1)) &&
          (lastequality.length <= Math.max(length_insertions2,
                                           length_deletions2))) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0,
                     [DIFF_DELETE, lastequality]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        // Throw away the equality we just deleted.
        equalitiesLength--;
        // Throw away the previous equality (it needs to be reevaluated).
        equalitiesLength--;
        pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
        length_insertions1 = 0;  // Reset the counters.
        length_deletions1 = 0;
        length_insertions2 = 0;
        length_deletions2 = 0;
        lastequality = null;
        changes = true;
      }
    }
    pointer++;
  }

  // Normalize the diff.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
  this.diff_cleanupSemanticLossless(diffs);

  // Find any overlaps between deletions and insertions.
  // e.g: <del>abcxxx</del><ins>xxxdef</ins>
  //   -> <del>abc</del>xxx<ins>def</ins>
  // e.g: <del>xxxabc</del><ins>defxxx</ins>
  //   -> <ins>def</ins>xxx<del>abc</del>
  // Only extract an overlap if it is as big as the edit ahead or behind it.
  pointer = 1;
  while (pointer < diffs.length) {
    if (diffs[pointer - 1][0] == DIFF_DELETE &&
        diffs[pointer][0] == DIFF_INSERT) {
      var deletion = diffs[pointer - 1][1];
      var insertion = diffs[pointer][1];
      var overlap_length1 = this.diff_commonOverlap_(deletion, insertion);
      var overlap_length2 = this.diff_commonOverlap_(insertion, deletion);
      if (overlap_length1 >= overlap_length2) {
        if (overlap_length1 >= deletion.length / 2 ||
            overlap_length1 >= insertion.length / 2) {
          // Overlap found.  Insert an equality and trim the surrounding edits.
          diffs.splice(pointer, 0,
              [DIFF_EQUAL, insertion.substring(0, overlap_length1)]);
          diffs[pointer - 1][1] =
              deletion.substring(0, deletion.length - overlap_length1);
          diffs[pointer + 1][1] = insertion.substring(overlap_length1);
          pointer++;
        }
      } else {
        if (overlap_length2 >= deletion.length / 2 ||
            overlap_length2 >= insertion.length / 2) {
          // Reverse overlap found.
          // Insert an equality and swap and trim the surrounding edits.
          diffs.splice(pointer, 0,
              [DIFF_EQUAL, deletion.substring(0, overlap_length2)]);
          diffs[pointer - 1][0] = DIFF_INSERT;
          diffs[pointer - 1][1] =
              insertion.substring(0, insertion.length - overlap_length2);
          diffs[pointer + 1][0] = DIFF_DELETE;
          diffs[pointer + 1][1] =
              deletion.substring(overlap_length2);
          pointer++;
        }
      }
      pointer++;
    }
    pointer++;
  }
};


/**
 * Look for single edits surrounded on both sides by equalities
 * which can be shifted sideways to align the edit to a word boundary.
 * e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemanticLossless = function(diffs) {
  /**
   * Given two strings, compute a score representing whether the internal
   * boundary falls on logical boundaries.
   * Scores range from 6 (best) to 0 (worst).
   * Closure, but does not reference any external variables.
   * @param {string} one First string.
   * @param {string} two Second string.
   * @return {number} The score.
   * @private
   */
  function diff_cleanupSemanticScore_(one, two) {
    if (!one || !two) {
      // Edges are the best.
      return 6;
    }

    // Each port of this function behaves slightly differently due to
    // subtle differences in each language's definition of things like
    // 'whitespace'.  Since this function's purpose is largely cosmetic,
    // the choice has been made to use each language's native features
    // rather than force total conformity.
    var char1 = one.charAt(one.length - 1);
    var char2 = two.charAt(0);
    var nonAlphaNumeric1 = char1.match(diff_match_patch.nonAlphaNumericRegex_);
    var nonAlphaNumeric2 = char2.match(diff_match_patch.nonAlphaNumericRegex_);
    var whitespace1 = nonAlphaNumeric1 &&
        char1.match(diff_match_patch.whitespaceRegex_);
    var whitespace2 = nonAlphaNumeric2 &&
        char2.match(diff_match_patch.whitespaceRegex_);
    var lineBreak1 = whitespace1 &&
        char1.match(diff_match_patch.linebreakRegex_);
    var lineBreak2 = whitespace2 &&
        char2.match(diff_match_patch.linebreakRegex_);
    var blankLine1 = lineBreak1 &&
        one.match(diff_match_patch.blanklineEndRegex_);
    var blankLine2 = lineBreak2 &&
        two.match(diff_match_patch.blanklineStartRegex_);

    if (blankLine1 || blankLine2) {
      // Five points for blank lines.
      return 5;
    } else if (lineBreak1 || lineBreak2) {
      // Four points for line breaks.
      return 4;
    } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
      // Three points for end of sentences.
      return 3;
    } else if (whitespace1 || whitespace2) {
      // Two points for whitespace.
      return 2;
    } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
      // One point for non-alphanumeric.
      return 1;
    }
    return 0;
  }

  var pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
        diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      var equality1 = diffs[pointer - 1][1];
      var edit = diffs[pointer][1];
      var equality2 = diffs[pointer + 1][1];

      // First, shift the edit as far left as possible.
      var commonOffset = this.diff_commonSuffix(equality1, edit);
      if (commonOffset) {
        var commonString = edit.substring(edit.length - commonOffset);
        equality1 = equality1.substring(0, equality1.length - commonOffset);
        edit = commonString + edit.substring(0, edit.length - commonOffset);
        equality2 = commonString + equality2;
      }

      // Second, step character by character right, looking for the best fit.
      var bestEquality1 = equality1;
      var bestEdit = edit;
      var bestEquality2 = equality2;
      var bestScore = diff_cleanupSemanticScore_(equality1, edit) +
          diff_cleanupSemanticScore_(edit, equality2);
      while (edit.charAt(0) === equality2.charAt(0)) {
        equality1 += edit.charAt(0);
        edit = edit.substring(1) + equality2.charAt(0);
        equality2 = equality2.substring(1);
        var score = diff_cleanupSemanticScore_(equality1, edit) +
            diff_cleanupSemanticScore_(edit, equality2);
        // The >= encourages trailing rather than leading whitespace on edits.
        if (score >= bestScore) {
          bestScore = score;
          bestEquality1 = equality1;
          bestEdit = edit;
          bestEquality2 = equality2;
        }
      }

      if (diffs[pointer - 1][1] != bestEquality1) {
        // We have an improvement, save it back to the diff.
        if (bestEquality1) {
          diffs[pointer - 1][1] = bestEquality1;
        } else {
          diffs.splice(pointer - 1, 1);
          pointer--;
        }
        diffs[pointer][1] = bestEdit;
        if (bestEquality2) {
          diffs[pointer + 1][1] = bestEquality2;
        } else {
          diffs.splice(pointer + 1, 1);
          pointer--;
        }
      }
    }
    pointer++;
  }
};

// Define some regex patterns for matching boundaries.
diff_match_patch.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
diff_match_patch.whitespaceRegex_ = /\s/;
diff_match_patch.linebreakRegex_ = /[\r\n]/;
diff_match_patch.blanklineEndRegex_ = /\n\r?\n$/;
diff_match_patch.blanklineStartRegex_ = /^\r?\n\r?\n/;

/**
 * Reduce the number of edits by eliminating operationally trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupEfficiency = function(diffs) {
  var changes = false;
  var equalities = [];  // Stack of indices where equalities are found.
  var equalitiesLength = 0;  // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0;  // Index of current position.
  // Is there an insertion operation before the last equality.
  var pre_ins = false;
  // Is there a deletion operation before the last equality.
  var pre_del = false;
  // Is there an insertion operation after the last equality.
  var post_ins = false;
  // Is there a deletion operation after the last equality.
  var post_del = false;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {  // Equality found.
      if (diffs[pointer][1].length < this.Diff_EditCost &&
          (post_ins || post_del)) {
        // Candidate found.
        equalities[equalitiesLength++] = pointer;
        pre_ins = post_ins;
        pre_del = post_del;
        lastequality = diffs[pointer][1];
      } else {
        // Not a candidate, and can never become one.
        equalitiesLength = 0;
        lastequality = null;
      }
      post_ins = post_del = false;
    } else {  // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_DELETE) {
        post_del = true;
      } else {
        post_ins = true;
      }
      /*
       * Five types to be split:
       * <ins>A</ins><del>B</del>XY<ins>C</ins><del>D</del>
       * <ins>A</ins>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<ins>C</ins>
       * <ins>A</del>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<del>C</del>
       */
      if (lastequality && ((pre_ins && pre_del && post_ins && post_del) ||
                           ((lastequality.length < this.Diff_EditCost / 2) &&
                            (pre_ins + pre_del + post_ins + post_del) == 3))) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0,
                     [DIFF_DELETE, lastequality]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        equalitiesLength--;  // Throw away the equality we just deleted;
        lastequality = null;
        if (pre_ins && pre_del) {
          // No changes made which could affect previous entry, keep going.
          post_ins = post_del = true;
          equalitiesLength = 0;
        } else {
          equalitiesLength--;  // Throw away the previous equality.
          pointer = equalitiesLength > 0 ?
              equalities[equalitiesLength - 1] : -1;
          post_ins = post_del = false;
        }
        changes = true;
      }
    }
    pointer++;
  }

  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};


/**
 * Reorder and merge like edit sections.  Merge equalities.
 * Any edit section can move as long as it doesn't cross an equality.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupMerge = function(diffs) {
  diffs.push([DIFF_EQUAL, '']);  // Add a dummy entry at the end.
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  var commonlength;
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete + count_insert > 1) {
          if (count_delete !== 0 && count_insert !== 0) {
            // Factor out any common prefixies.
            commonlength = this.diff_commonPrefix(text_insert, text_delete);
            if (commonlength !== 0) {
              if ((pointer - count_delete - count_insert) > 0 &&
                  diffs[pointer - count_delete - count_insert - 1][0] ==
                  DIFF_EQUAL) {
                diffs[pointer - count_delete - count_insert - 1][1] +=
                    text_insert.substring(0, commonlength);
              } else {
                diffs.splice(0, 0, [DIFF_EQUAL,
                                    text_insert.substring(0, commonlength)]);
                pointer++;
              }
              text_insert = text_insert.substring(commonlength);
              text_delete = text_delete.substring(commonlength);
            }
            // Factor out any common suffixies.
            commonlength = this.diff_commonSuffix(text_insert, text_delete);
            if (commonlength !== 0) {
              diffs[pointer][1] = text_insert.substring(text_insert.length -
                  commonlength) + diffs[pointer][1];
              text_insert = text_insert.substring(0, text_insert.length -
                  commonlength);
              text_delete = text_delete.substring(0, text_delete.length -
                  commonlength);
            }
          }
          // Delete the offending records and add the merged ones.
          if (count_delete === 0) {
            diffs.splice(pointer - count_insert,
                count_delete + count_insert, [DIFF_INSERT, text_insert]);
          } else if (count_insert === 0) {
            diffs.splice(pointer - count_delete,
                count_delete + count_insert, [DIFF_DELETE, text_delete]);
          } else {
            diffs.splice(pointer - count_delete - count_insert,
                count_delete + count_insert, [DIFF_DELETE, text_delete],
                [DIFF_INSERT, text_insert]);
          }
          pointer = pointer - count_delete - count_insert +
                    (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
        } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
          // Merge this equality with the previous one.
          diffs[pointer - 1][1] += diffs[pointer][1];
          diffs.splice(pointer, 1);
        } else {
          pointer++;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
  }
  if (diffs[diffs.length - 1][1] === '') {
    diffs.pop();  // Remove the dummy entry at the end.
  }

  // Second pass: look for single edits surrounded on both sides by equalities
  // which can be shifted sideways to eliminate an equality.
  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
  var changes = false;
  pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
        diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      if (diffs[pointer][1].substring(diffs[pointer][1].length -
          diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
        // Shift the edit over the previous equality.
        diffs[pointer][1] = diffs[pointer - 1][1] +
            diffs[pointer][1].substring(0, diffs[pointer][1].length -
                                        diffs[pointer - 1][1].length);
        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
        diffs.splice(pointer - 1, 1);
        changes = true;
      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
          diffs[pointer + 1][1]) {
        // Shift the edit over the next equality.
        diffs[pointer - 1][1] += diffs[pointer + 1][1];
        diffs[pointer][1] =
            diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
            diffs[pointer + 1][1];
        diffs.splice(pointer + 1, 1);
        changes = true;
      }
    }
    pointer++;
  }
  // If shifts were made, the diff needs reordering and another shift sweep.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};


/**
 * loc is a location in text1, compute and return the equivalent location in
 * text2.
 * e.g. 'The cat' vs 'The big cat', 1->1, 5->8
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {number} loc Location within text1.
 * @return {number} Location within text2.
 */
diff_match_patch.prototype.diff_xIndex = function(diffs, loc) {
  var chars1 = 0;
  var chars2 = 0;
  var last_chars1 = 0;
  var last_chars2 = 0;
  var x;
  for (x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {  // Equality or deletion.
      chars1 += diffs[x][1].length;
    }
    if (diffs[x][0] !== DIFF_DELETE) {  // Equality or insertion.
      chars2 += diffs[x][1].length;
    }
    if (chars1 > loc) {  // Overshot the location.
      break;
    }
    last_chars1 = chars1;
    last_chars2 = chars2;
  }
  // Was the location was deleted?
  if (diffs.length != x && diffs[x][0] === DIFF_DELETE) {
    return last_chars2;
  }
  // Add the remaining character length.
  return last_chars2 + (loc - last_chars1);
};


/**
 * Convert a diff array into a pretty HTML report.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} HTML representation.
 */
diff_match_patch.prototype.diff_prettyHtml = function(diffs) {
  var html = [];
  var pattern_amp = /&/g;
  var pattern_lt = /</g;
  var pattern_gt = />/g;
  var pattern_para = /\n/g;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0];    // Operation (insert, delete, equal)
    var data = diffs[x][1];  // Text of change.
    var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;')
        .replace(pattern_gt, '&gt;').replace(pattern_para, '&para;<br>');
    switch (op) {
      case DIFF_INSERT:
        html[x] = '<ins style="background:#e6ffe6;">' + text + '</ins>';
        break;
      case DIFF_DELETE:
        html[x] = '<del style="background:#ffe6e6;">' + text + '</del>';
        break;
      case DIFF_EQUAL:
        html[x] = '<span>' + text + '</span>';
        break;
    }
  }
  return html.join('');
};


/**
 * Compute and return the source text (all equalities and deletions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Source text.
 */
diff_match_patch.prototype.diff_text1 = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('');
};


/**
 * Compute and return the destination text (all equalities and insertions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Destination text.
 */
diff_match_patch.prototype.diff_text2 = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_DELETE) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('');
};


/**
 * Compute the Levenshtein distance; the number of inserted, deleted or
 * substituted characters.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {number} Number of changes.
 */
diff_match_patch.prototype.diff_levenshtein = function(diffs) {
  var levenshtein = 0;
  var insertions = 0;
  var deletions = 0;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0];
    var data = diffs[x][1];
    switch (op) {
      case DIFF_INSERT:
        insertions += data.length;
        break;
      case DIFF_DELETE:
        deletions += data.length;
        break;
      case DIFF_EQUAL:
        // A deletion and an insertion is one substitution.
        levenshtein += Math.max(insertions, deletions);
        insertions = 0;
        deletions = 0;
        break;
    }
  }
  levenshtein += Math.max(insertions, deletions);
  return levenshtein;
};


/**
 * Crush the diff into an encoded string which describes the operations
 * required to transform text1 into text2.
 * E.g. =3\t-2\t+ing  -> Keep 3 chars, delete 2 chars, insert 'ing'.
 * Operations are tab-separated.  Inserted text is escaped using %xx notation.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Delta text.
 */
diff_match_patch.prototype.diff_toDelta = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    switch (diffs[x][0]) {
      case DIFF_INSERT:
        text[x] = '+' + encodeURI(diffs[x][1]);
        break;
      case DIFF_DELETE:
        text[x] = '-' + diffs[x][1].length;
        break;
      case DIFF_EQUAL:
        text[x] = '=' + diffs[x][1].length;
        break;
    }
  }
  return text.join('\t').replace(/%20/g, ' ');
};


/**
 * Given the original text1, and an encoded string which describes the
 * operations required to transform text1 into text2, compute the full diff.
 * @param {string} text1 Source string for the diff.
 * @param {string} delta Delta text.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.diff_fromDelta = function(text1, delta) {
  var diffs = [];
  var diffsLength = 0;  // Keeping our own length var is faster in JS.
  var pointer = 0;  // Cursor in text1
  var tokens = delta.split(/\t/g);
  for (var x = 0; x < tokens.length; x++) {
    // Each token begins with a one character parameter which specifies the
    // operation of this token (delete, insert, equality).
    var param = tokens[x].substring(1);
    switch (tokens[x].charAt(0)) {
      case '+':
        try {
          diffs[diffsLength++] = [DIFF_INSERT, decodeURI(param)];
        } catch (ex) {
          // Malformed URI sequence.
          throw new Error('Illegal escape in diff_fromDelta: ' + param);
        }
        break;
      case '-':
        // Fall through.
      case '=':
        var n = parseInt(param, 10);
        if (isNaN(n) || n < 0) {
          throw new Error('Invalid number in diff_fromDelta: ' + param);
        }
        var text = text1.substring(pointer, pointer += n);
        if (tokens[x].charAt(0) == '=') {
          diffs[diffsLength++] = [DIFF_EQUAL, text];
        } else {
          diffs[diffsLength++] = [DIFF_DELETE, text];
        }
        break;
      default:
        // Blank tokens are ok (from a trailing \t).
        // Anything else is an error.
        if (tokens[x]) {
          throw new Error('Invalid diff operation in diff_fromDelta: ' +
                          tokens[x]);
        }
    }
  }
  if (pointer != text1.length) {
    throw new Error('Delta length (' + pointer +
        ') does not equal source text length (' + text1.length + ').');
  }
  return diffs;
};


//  MATCH FUNCTIONS


/**
 * Locate the best instance of 'pattern' in 'text' near 'loc'.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 */
diff_match_patch.prototype.match_main = function(text, pattern, loc) {
  // Check for null inputs.
  if (text == null || pattern == null || loc == null) {
    throw new Error('Null input. (match_main)');
  }

  loc = Math.max(0, Math.min(loc, text.length));
  if (text == pattern) {
    // Shortcut (potentially not guaranteed by the algorithm)
    return 0;
  } else if (!text.length) {
    // Nothing to match.
    return -1;
  } else if (text.substring(loc, loc + pattern.length) == pattern) {
    // Perfect match at the perfect spot!  (Includes case of null pattern)
    return loc;
  } else {
    // Do a fuzzy compare.
    return this.match_bitap_(text, pattern, loc);
  }
};


/**
 * Locate the best instance of 'pattern' in 'text' near 'loc' using the
 * Bitap algorithm.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 * @private
 */
diff_match_patch.prototype.match_bitap_ = function(text, pattern, loc) {
  if (pattern.length > this.Match_MaxBits) {
    throw new Error('Pattern too long for this browser.');
  }

  // Initialise the alphabet.
  var s = this.match_alphabet_(pattern);

  var dmp = this;  // 'this' becomes 'window' in a closure.

  /**
   * Compute and return the score for a match with e errors and x location.
   * Accesses loc and pattern through being a closure.
   * @param {number} e Number of errors in match.
   * @param {number} x Location of match.
   * @return {number} Overall score for match (0.0 = good, 1.0 = bad).
   * @private
   */
  function match_bitapScore_(e, x) {
    var accuracy = e / pattern.length;
    var proximity = Math.abs(loc - x);
    if (!dmp.Match_Distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy;
    }
    return accuracy + (proximity / dmp.Match_Distance);
  }

  // Highest score beyond which we give up.
  var score_threshold = this.Match_Threshold;
  // Is there a nearby exact match? (speedup)
  var best_loc = text.indexOf(pattern, loc);
  if (best_loc != -1) {
    score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
    // What about in the other direction? (speedup)
    best_loc = text.lastIndexOf(pattern, loc + pattern.length);
    if (best_loc != -1) {
      score_threshold =
          Math.min(match_bitapScore_(0, best_loc), score_threshold);
    }
  }

  // Initialise the bit arrays.
  var matchmask = 1 << (pattern.length - 1);
  best_loc = -1;

  var bin_min, bin_mid;
  var bin_max = pattern.length + text.length;
  var last_rd;
  for (var d = 0; d < pattern.length; d++) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from 'loc' we can stray at this
    // error level.
    bin_min = 0;
    bin_mid = bin_max;
    while (bin_min < bin_mid) {
      if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
        bin_min = bin_mid;
      } else {
        bin_max = bin_mid;
      }
      bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
    }
    // Use the result from this iteration as the maximum for the next.
    bin_max = bin_mid;
    var start = Math.max(1, loc - bin_mid + 1);
    var finish = Math.min(loc + bin_mid, text.length) + pattern.length;

    var rd = Array(finish + 2);
    rd[finish + 1] = (1 << d) - 1;
    for (var j = finish; j >= start; j--) {
      // The alphabet (s) is a sparse hash, so the following line generates
      // warnings.
      var charMatch = s[text.charAt(j - 1)];
      if (d === 0) {  // First pass: exact match.
        rd[j] = ((rd[j + 1] << 1) | 1) & charMatch;
      } else {  // Subsequent passes: fuzzy match.
        rd[j] = (((rd[j + 1] << 1) | 1) & charMatch) |
                (((last_rd[j + 1] | last_rd[j]) << 1) | 1) |
                last_rd[j + 1];
      }
      if (rd[j] & matchmask) {
        var score = match_bitapScore_(d, j - 1);
        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (score <= score_threshold) {
          // Told you so.
          score_threshold = score;
          best_loc = j - 1;
          if (best_loc > loc) {
            // When passing loc, don't exceed our current distance from loc.
            start = Math.max(1, 2 * loc - best_loc);
          } else {
            // Already passed loc, downhill from here on in.
            break;
          }
        }
      }
    }
    // No hope for a (better) match at greater error levels.
    if (match_bitapScore_(d + 1, loc) > score_threshold) {
      break;
    }
    last_rd = rd;
  }
  return best_loc;
};


/**
 * Initialise the alphabet for the Bitap algorithm.
 * @param {string} pattern The text to encode.
 * @return {!Object} Hash of character locations.
 * @private
 */
diff_match_patch.prototype.match_alphabet_ = function(pattern) {
  var s = {};
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] = 0;
  }
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] |= 1 << (pattern.length - i - 1);
  }
  return s;
};


//  PATCH FUNCTIONS


/**
 * Increase the context until it is unique,
 * but don't let the pattern expand beyond Match_MaxBits.
 * @param {!diff_match_patch.patch_obj} patch The patch to grow.
 * @param {string} text Source text.
 * @private
 */
diff_match_patch.prototype.patch_addContext_ = function(patch, text) {
  if (text.length == 0) {
    return;
  }
  var pattern = text.substring(patch.start2, patch.start2 + patch.length1);
  var padding = 0;

  // Look for the first and last matches of pattern in text.  If two different
  // matches are found, increase the pattern length.
  while (text.indexOf(pattern) != text.lastIndexOf(pattern) &&
         pattern.length < this.Match_MaxBits - this.Patch_Margin -
         this.Patch_Margin) {
    padding += this.Patch_Margin;
    pattern = text.substring(patch.start2 - padding,
                             patch.start2 + patch.length1 + padding);
  }
  // Add one chunk for good luck.
  padding += this.Patch_Margin;

  // Add the prefix.
  var prefix = text.substring(patch.start2 - padding, patch.start2);
  if (prefix) {
    patch.diffs.unshift([DIFF_EQUAL, prefix]);
  }
  // Add the suffix.
  var suffix = text.substring(patch.start2 + patch.length1,
                              patch.start2 + patch.length1 + padding);
  if (suffix) {
    patch.diffs.push([DIFF_EQUAL, suffix]);
  }

  // Roll back the start points.
  patch.start1 -= prefix.length;
  patch.start2 -= prefix.length;
  // Extend the lengths.
  patch.length1 += prefix.length + suffix.length;
  patch.length2 += prefix.length + suffix.length;
};


/**
 * Compute a list of patches to turn text1 into text2.
 * Use diffs if provided, otherwise compute it ourselves.
 * There are four ways to call this function, depending on what data is
 * available to the caller:
 * Method 1:
 * a = text1, b = text2
 * Method 2:
 * a = diffs
 * Method 3 (optimal):
 * a = text1, b = diffs
 * Method 4 (deprecated, use method 3):
 * a = text1, b = text2, c = diffs
 *
 * @param {string|!Array.<!diff_match_patch.Diff>} a text1 (methods 1,3,4) or
 * Array of diff tuples for text1 to text2 (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>} opt_b text2 (methods 1,4) or
 * Array of diff tuples for text1 to text2 (method 3) or undefined (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>} opt_c Array of diff tuples
 * for text1 to text2 (method 4) or undefined (methods 1,2,3).
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_make = function(a, opt_b, opt_c) {
  var text1, diffs;
  if (typeof a == 'string' && typeof opt_b == 'string' &&
      typeof opt_c == 'undefined') {
    // Method 1: text1, text2
    // Compute diffs from text1 and text2.
    text1 = /** @type {string} */(a);
    diffs = this.diff_main(text1, /** @type {string} */(opt_b), true);
    if (diffs.length > 2) {
      this.diff_cleanupSemantic(diffs);
      this.diff_cleanupEfficiency(diffs);
    }
  } else if (a && typeof a == 'object' && typeof opt_b == 'undefined' &&
      typeof opt_c == 'undefined') {
    // Method 2: diffs
    // Compute text1 from diffs.
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(a);
    text1 = this.diff_text1(diffs);
  } else if (typeof a == 'string' && opt_b && typeof opt_b == 'object' &&
      typeof opt_c == 'undefined') {
    // Method 3: text1, diffs
    text1 = /** @type {string} */(a);
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(opt_b);
  } else if (typeof a == 'string' && typeof opt_b == 'string' &&
      opt_c && typeof opt_c == 'object') {
    // Method 4: text1, text2, diffs
    // text2 is not used.
    text1 = /** @type {string} */(a);
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(opt_c);
  } else {
    throw new Error('Unknown call format to patch_make.');
  }

  if (diffs.length === 0) {
    return [];  // Get rid of the null case.
  }
  var patches = [];
  var patch = new diff_match_patch.patch_obj();
  var patchDiffLength = 0;  // Keeping our own length var is faster in JS.
  var char_count1 = 0;  // Number of characters into the text1 string.
  var char_count2 = 0;  // Number of characters into the text2 string.
  // Start with text1 (prepatch_text) and apply the diffs until we arrive at
  // text2 (postpatch_text).  We recreate the patches one by one to determine
  // context info.
  var prepatch_text = text1;
  var postpatch_text = text1;
  for (var x = 0; x < diffs.length; x++) {
    var diff_type = diffs[x][0];
    var diff_text = diffs[x][1];

    if (!patchDiffLength && diff_type !== DIFF_EQUAL) {
      // A new patch starts here.
      patch.start1 = char_count1;
      patch.start2 = char_count2;
    }

    switch (diff_type) {
      case DIFF_INSERT:
        patch.diffs[patchDiffLength++] = diffs[x];
        patch.length2 += diff_text.length;
        postpatch_text = postpatch_text.substring(0, char_count2) + diff_text +
                         postpatch_text.substring(char_count2);
        break;
      case DIFF_DELETE:
        patch.length1 += diff_text.length;
        patch.diffs[patchDiffLength++] = diffs[x];
        postpatch_text = postpatch_text.substring(0, char_count2) +
                         postpatch_text.substring(char_count2 +
                             diff_text.length);
        break;
      case DIFF_EQUAL:
        if (diff_text.length <= 2 * this.Patch_Margin &&
            patchDiffLength && diffs.length != x + 1) {
          // Small equality inside a patch.
          patch.diffs[patchDiffLength++] = diffs[x];
          patch.length1 += diff_text.length;
          patch.length2 += diff_text.length;
        } else if (diff_text.length >= 2 * this.Patch_Margin) {
          // Time for a new patch.
          if (patchDiffLength) {
            this.patch_addContext_(patch, prepatch_text);
            patches.push(patch);
            patch = new diff_match_patch.patch_obj();
            patchDiffLength = 0;
            // Unlike Unidiff, our patch lists have a rolling context.
            // http://code.google.com/p/google-diff-match-patch/wiki/Unidiff
            // Update prepatch text & pos to reflect the application of the
            // just completed patch.
            prepatch_text = postpatch_text;
            char_count1 = char_count2;
          }
        }
        break;
    }

    // Update the current character count.
    if (diff_type !== DIFF_INSERT) {
      char_count1 += diff_text.length;
    }
    if (diff_type !== DIFF_DELETE) {
      char_count2 += diff_text.length;
    }
  }
  // Pick up the leftover patch if not empty.
  if (patchDiffLength) {
    this.patch_addContext_(patch, prepatch_text);
    patches.push(patch);
  }

  return patches;
};


/**
 * Given an array of patches, return another array that is identical.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_deepCopy = function(patches) {
  // Making deep copies is hard in JavaScript.
  var patchesCopy = [];
  for (var x = 0; x < patches.length; x++) {
    var patch = patches[x];
    var patchCopy = new diff_match_patch.patch_obj();
    patchCopy.diffs = [];
    for (var y = 0; y < patch.diffs.length; y++) {
      patchCopy.diffs[y] = patch.diffs[y].slice();
    }
    patchCopy.start1 = patch.start1;
    patchCopy.start2 = patch.start2;
    patchCopy.length1 = patch.length1;
    patchCopy.length2 = patch.length2;
    patchesCopy[x] = patchCopy;
  }
  return patchesCopy;
};


/**
 * Merge a set of patches onto the text.  Return a patched text, as well
 * as a list of true/false values indicating which patches were applied.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @param {string} text Old text.
 * @return {!Array.<string|!Array.<boolean>>} Two element Array, containing the
 *      new text and an array of boolean values.
 */
diff_match_patch.prototype.patch_apply = function(patches, text) {
  if (patches.length == 0) {
    return [text, []];
  }

  // Deep copy the patches so that no changes are made to originals.
  patches = this.patch_deepCopy(patches);

  var nullPadding = this.patch_addPadding(patches);
  text = nullPadding + text + nullPadding;

  this.patch_splitMax(patches);
  // delta keeps track of the offset between the expected and actual location
  // of the previous patch.  If there are patches expected at positions 10 and
  // 20, but the first patch was found at 12, delta is 2 and the second patch
  // has an effective expected position of 22.
  var delta = 0;
  var results = [];
  for (var x = 0; x < patches.length; x++) {
    var expected_loc = patches[x].start2 + delta;
    var text1 = this.diff_text1(patches[x].diffs);
    var start_loc;
    var end_loc = -1;
    if (text1.length > this.Match_MaxBits) {
      // patch_splitMax will only provide an oversized pattern in the case of
      // a monster delete.
      start_loc = this.match_main(text, text1.substring(0, this.Match_MaxBits),
                                  expected_loc);
      if (start_loc != -1) {
        end_loc = this.match_main(text,
            text1.substring(text1.length - this.Match_MaxBits),
            expected_loc + text1.length - this.Match_MaxBits);
        if (end_loc == -1 || start_loc >= end_loc) {
          // Can't find valid trailing context.  Drop this patch.
          start_loc = -1;
        }
      }
    } else {
      start_loc = this.match_main(text, text1, expected_loc);
    }
    if (start_loc == -1) {
      // No match found.  :(
      results[x] = false;
      // Subtract the delta for this failed patch from subsequent patches.
      delta -= patches[x].length2 - patches[x].length1;
    } else {
      // Found a match.  :)
      results[x] = true;
      delta = start_loc - expected_loc;
      var text2;
      if (end_loc == -1) {
        text2 = text.substring(start_loc, start_loc + text1.length);
      } else {
        text2 = text.substring(start_loc, end_loc + this.Match_MaxBits);
      }
      if (text1 == text2) {
        // Perfect match, just shove the replacement text in.
        text = text.substring(0, start_loc) +
               this.diff_text2(patches[x].diffs) +
               text.substring(start_loc + text1.length);
      } else {
        // Imperfect match.  Run a diff to get a framework of equivalent
        // indices.
        var diffs = this.diff_main(text1, text2, false);
        if (text1.length > this.Match_MaxBits &&
            this.diff_levenshtein(diffs) / text1.length >
            this.Patch_DeleteThreshold) {
          // The end points match, but the content is unacceptably bad.
          results[x] = false;
        } else {
          this.diff_cleanupSemanticLossless(diffs);
          var index1 = 0;
          var index2;
          for (var y = 0; y < patches[x].diffs.length; y++) {
            var mod = patches[x].diffs[y];
            if (mod[0] !== DIFF_EQUAL) {
              index2 = this.diff_xIndex(diffs, index1);
            }
            if (mod[0] === DIFF_INSERT) {  // Insertion
              text = text.substring(0, start_loc + index2) + mod[1] +
                     text.substring(start_loc + index2);
            } else if (mod[0] === DIFF_DELETE) {  // Deletion
              text = text.substring(0, start_loc + index2) +
                     text.substring(start_loc + this.diff_xIndex(diffs,
                         index1 + mod[1].length));
            }
            if (mod[0] !== DIFF_DELETE) {
              index1 += mod[1].length;
            }
          }
        }
      }
    }
  }
  // Strip the padding off.
  text = text.substring(nullPadding.length, text.length - nullPadding.length);
  return [text, results];
};


/**
 * Add some padding on text start and end so that edges can match something.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} The padding string added to each side.
 */
diff_match_patch.prototype.patch_addPadding = function(patches) {
  var paddingLength = this.Patch_Margin;
  var nullPadding = '';
  for (var x = 1; x <= paddingLength; x++) {
    nullPadding += String.fromCharCode(x);
  }

  // Bump all the patches forward.
  for (var x = 0; x < patches.length; x++) {
    patches[x].start1 += paddingLength;
    patches[x].start2 += paddingLength;
  }

  // Add some padding on start of first diff.
  var patch = patches[0];
  var diffs = patch.diffs;
  if (diffs.length == 0 || diffs[0][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.unshift([DIFF_EQUAL, nullPadding]);
    patch.start1 -= paddingLength;  // Should be 0.
    patch.start2 -= paddingLength;  // Should be 0.
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  } else if (paddingLength > diffs[0][1].length) {
    // Grow first equality.
    var extraLength = paddingLength - diffs[0][1].length;
    diffs[0][1] = nullPadding.substring(diffs[0][1].length) + diffs[0][1];
    patch.start1 -= extraLength;
    patch.start2 -= extraLength;
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  // Add some padding on end of last diff.
  patch = patches[patches.length - 1];
  diffs = patch.diffs;
  if (diffs.length == 0 || diffs[diffs.length - 1][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.push([DIFF_EQUAL, nullPadding]);
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  } else if (paddingLength > diffs[diffs.length - 1][1].length) {
    // Grow last equality.
    var extraLength = paddingLength - diffs[diffs.length - 1][1].length;
    diffs[diffs.length - 1][1] += nullPadding.substring(0, extraLength);
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  return nullPadding;
};


/**
 * Look through the patches and break up any which are longer than the maximum
 * limit of the match algorithm.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 */
diff_match_patch.prototype.patch_splitMax = function(patches) {
  var patch_size = this.Match_MaxBits;
  for (var x = 0; x < patches.length; x++) {
    if (patches[x].length1 <= patch_size) {
      continue;
    }
    var bigpatch = patches[x];
    // Remove the big old patch.
    patches.splice(x--, 1);
    var start1 = bigpatch.start1;
    var start2 = bigpatch.start2;
    var precontext = '';
    while (bigpatch.diffs.length !== 0) {
      // Create one of several smaller patches.
      var patch = new diff_match_patch.patch_obj();
      var empty = true;
      patch.start1 = start1 - precontext.length;
      patch.start2 = start2 - precontext.length;
      if (precontext !== '') {
        patch.length1 = patch.length2 = precontext.length;
        patch.diffs.push([DIFF_EQUAL, precontext]);
      }
      while (bigpatch.diffs.length !== 0 &&
             patch.length1 < patch_size - this.Patch_Margin) {
        var diff_type = bigpatch.diffs[0][0];
        var diff_text = bigpatch.diffs[0][1];
        if (diff_type === DIFF_INSERT) {
          // Insertions are harmless.
          patch.length2 += diff_text.length;
          start2 += diff_text.length;
          patch.diffs.push(bigpatch.diffs.shift());
          empty = false;
        } else if (diff_type === DIFF_DELETE && patch.diffs.length == 1 &&
                   patch.diffs[0][0] == DIFF_EQUAL &&
                   diff_text.length > 2 * patch_size) {
          // This is a large deletion.  Let it pass in one chunk.
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          empty = false;
          patch.diffs.push([diff_type, diff_text]);
          bigpatch.diffs.shift();
        } else {
          // Deletion or equality.  Only take as much as we can stomach.
          diff_text = diff_text.substring(0,
              patch_size - patch.length1 - this.Patch_Margin);
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          if (diff_type === DIFF_EQUAL) {
            patch.length2 += diff_text.length;
            start2 += diff_text.length;
          } else {
            empty = false;
          }
          patch.diffs.push([diff_type, diff_text]);
          if (diff_text == bigpatch.diffs[0][1]) {
            bigpatch.diffs.shift();
          } else {
            bigpatch.diffs[0][1] =
                bigpatch.diffs[0][1].substring(diff_text.length);
          }
        }
      }
      // Compute the head context for the next patch.
      precontext = this.diff_text2(patch.diffs);
      precontext =
          precontext.substring(precontext.length - this.Patch_Margin);
      // Append the end context for this patch.
      var postcontext = this.diff_text1(bigpatch.diffs)
                            .substring(0, this.Patch_Margin);
      if (postcontext !== '') {
        patch.length1 += postcontext.length;
        patch.length2 += postcontext.length;
        if (patch.diffs.length !== 0 &&
            patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL) {
          patch.diffs[patch.diffs.length - 1][1] += postcontext;
        } else {
          patch.diffs.push([DIFF_EQUAL, postcontext]);
        }
      }
      if (!empty) {
        patches.splice(++x, 0, patch);
      }
    }
  }
};


/**
 * Take a list of patches and return a textual representation.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} Text representation of patches.
 */
diff_match_patch.prototype.patch_toText = function(patches) {
  var text = [];
  for (var x = 0; x < patches.length; x++) {
    text[x] = patches[x];
  }
  return text.join('');
};


/**
 * Parse a textual representation of patches and return a list of Patch objects.
 * @param {string} textline Text representation of patches.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.patch_fromText = function(textline) {
  var patches = [];
  if (!textline) {
    return patches;
  }
  var text = textline.split('\n');
  var textPointer = 0;
  var patchHeader = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
  while (textPointer < text.length) {
    var m = text[textPointer].match(patchHeader);
    if (!m) {
      throw new Error('Invalid patch string: ' + text[textPointer]);
    }
    var patch = new diff_match_patch.patch_obj();
    patches.push(patch);
    patch.start1 = parseInt(m[1], 10);
    if (m[2] === '') {
      patch.start1--;
      patch.length1 = 1;
    } else if (m[2] == '0') {
      patch.length1 = 0;
    } else {
      patch.start1--;
      patch.length1 = parseInt(m[2], 10);
    }

    patch.start2 = parseInt(m[3], 10);
    if (m[4] === '') {
      patch.start2--;
      patch.length2 = 1;
    } else if (m[4] == '0') {
      patch.length2 = 0;
    } else {
      patch.start2--;
      patch.length2 = parseInt(m[4], 10);
    }
    textPointer++;

    while (textPointer < text.length) {
      var sign = text[textPointer].charAt(0);
      try {
        var line = decodeURI(text[textPointer].substring(1));
      } catch (ex) {
        // Malformed URI sequence.
        throw new Error('Illegal escape in patch_fromText: ' + line);
      }
      if (sign == '-') {
        // Deletion.
        patch.diffs.push([DIFF_DELETE, line]);
      } else if (sign == '+') {
        // Insertion.
        patch.diffs.push([DIFF_INSERT, line]);
      } else if (sign == ' ') {
        // Minor equality.
        patch.diffs.push([DIFF_EQUAL, line]);
      } else if (sign == '@') {
        // Start of next patch.
        break;
      } else if (sign === '') {
        // Blank line?  Whatever.
      } else {
        // WTF?
        throw new Error('Invalid patch mode "' + sign + '" in: ' + line);
      }
      textPointer++;
    }
  }
  return patches;
};


/**
 * Class representing one patch operation.
 * @constructor
 */
diff_match_patch.patch_obj = function() {
  /** @type {!Array.<!diff_match_patch.Diff>} */
  this.diffs = [];
  /** @type {?number} */
  this.start1 = null;
  /** @type {?number} */
  this.start2 = null;
  /** @type {number} */
  this.length1 = 0;
  /** @type {number} */
  this.length2 = 0;
};


/**
 * Emmulate GNU diff's format.
 * Header: @@ -382,8 +481,9 @@
 * Indicies are printed as 1-based, not 0-based.
 * @return {string} The GNU diff string.
 */
diff_match_patch.patch_obj.prototype.toString = function() {
  var coords1, coords2;
  if (this.length1 === 0) {
    coords1 = this.start1 + ',0';
  } else if (this.length1 == 1) {
    coords1 = this.start1 + 1;
  } else {
    coords1 = (this.start1 + 1) + ',' + this.length1;
  }
  if (this.length2 === 0) {
    coords2 = this.start2 + ',0';
  } else if (this.length2 == 1) {
    coords2 = this.start2 + 1;
  } else {
    coords2 = (this.start2 + 1) + ',' + this.length2;
  }
  var text = ['@@ -' + coords1 + ' +' + coords2 + ' @@\n'];
  var op;
  // Escape the body of the patch with %xx notation.
  for (var x = 0; x < this.diffs.length; x++) {
    switch (this.diffs[x][0]) {
      case DIFF_INSERT:
        op = '+';
        break;
      case DIFF_DELETE:
        op = '-';
        break;
      case DIFF_EQUAL:
        op = ' ';
        break;
    }
    text[x + 1] = op + encodeURI(this.diffs[x][1]) + '\n';
  }
  return text.join('').replace(/%20/g, ' ');
};


// Export these global variables so that they survive Google's JS compiler.
// In a browser, 'this' will be 'window'.
// Users of node.js should 'require' the uncompressed version since Google's
// JS compiler may break the following exports for non-browser environments.
/*
this['diff_match_patch'] = diff_match_patch;
this['DIFF_DELETE'] = DIFF_DELETE;
this['DIFF_INSERT'] = DIFF_INSERT;
this['DIFF_EQUAL'] = DIFF_EQUAL;
*/

module.exports=diff_match_patch;

});
require.register("ksana-document/xml4kdb.js", function(exports, require, module){
if (typeof nodeRequire=='undefined')nodeRequire=require;

var tags=[];
var tagstack=[];
var parseXMLTag=function(s) {
	var name="",i=0;
	if (s[0]=='/') {
		return {name:s.substring(1),type:'end'};
	}
	while (s[i] && (s.charCodeAt(i)>0x30)) {name+=s[i];i++;}
	var type="start";
	if (s[s.length-1]=='/') { type="emtpy"; }
	var attr={},count=0;
	s=s.substring(name.length+1);
	s.replace(/(.*?)="([^"]*?)"/g,function(m,m1,m2) {
		attr[m1]=m2;
		count++;
	});
	if (!count) attr=undefined;
	return {name:name,type:type,attr:attr};
};
var parseUnit=function(unittext) {
	// name,sunit, soff, eunit, eoff , attributes
	var totaltaglength=0,tags=[];
	var parsed=unittext.replace(/<(.*?)>/g,function(m,m1,off){
		tags.push([off-totaltaglength , m1]);
		totaltaglength+=m.length;
		return ""; //remove the tag from inscription
	});
	return {inscription:parsed, tags:tags};
};
var splitUnit=function(buf,sep) {
	var units=[], unit="", last=0 ,name="";
	buf.replace(sep,function(m,m1,offset){
		units.push([name,buf.substring(last,offset)]);
		name=m1;
		last=offset;//+m.length;   //keep the separator
	});
	units.push([name,buf.substring(last)]);
	return units;
};
var defaultsep="_.id";
var emptypagename="_";
var parseXML=function(buf, opts){
	opts=opts||{};
	var sep=opts.sep||defaultsep;
	var unitsep=new RegExp('<'+sep.replace(".",".*? ")+'="([^"]*?)"' , 'g')  ;
	var units=splitUnit(buf, unitsep);
	var texts=[], tags=[];
	units.map(function(U,i){
		var out=parseUnit(U[1]);
		texts.push({n:U[0]||emptypagename,t:out.inscription});
		tags.push(out.tags);
	});
	return {texts:texts,tags:tags,sep:sep};
};
var D=nodeRequire("ksana-document").document;

var importJson=function(json) {
	d=D.createDocument();
	for (var i=0;i<json.texts.length;i++) {
		var markups=json.tags[i];
		d.createPage(json.texts[i]);
	}
	//d.setRawXMLTags(json.tags);
	d.setSep(json.sep);
	return d;
}
/*
    doc.tags hold raw xml tags, offset will be adjusted by evolvePage.
    should not add or delete page, otherwise the export XML is not valid.
*/
/*
		var o=pg.getOrigin();
		if (o.id && this.tags[o.id-1] && this.tags[o.id-1].length) {
			this.tags[o.id-1]=pg.upgradeXMLTags(this.tags[o.id-1], pg.__revisions__());	
		}
*/
var upgradeXMLTags=function(tags,revs) {
	var migratedtags=[],i=0, delta=0;
	for (var j=0;j<tags.length;j++) {
		var t=tags[j];
		var s=t[0], l=t[1].length, deleted=false;
		while (i<revs.length && revs[i].start<=s) {
			var rev=revs[i];
			if (rev.start<=s && rev.start+rev.len>=s+l) {
				deleted=true;
			}
			delta+= (rev.payload.text.length-rev.len);
			i++;
		}
		var m2=[t[0]+delta,t[1]];
		migratedtags.push(m2);
	};
	return migratedtags;
}

var migrateRawTags=function(doc,tags) {
	var out=[];
	for (var i=0;i<tags.length;i++) {
		var T=tags[i];

		var pg=doc.getPage(i+1);
		var offsprings=pg.offsprings();
		for (var j=0;j<offsprings.length;j++) {
			var o=offsprings[j];
			var rev=pg.revertRevision(o.revert,pg.inscription);
			T=upgradeXMLTags(T,rev);
			pg=o;
		}		
		out.push(T);
	}
	return out;
}
var exportXML=function(doc,originalrawtags){
	var out=[],tags=null;
	rawtags=migrateRawTags(doc,originalrawtags);
	doc.map(function(pg,i){
		var tags=rawtags[i];  //get the xml tags
		var tagnow=0,text="";
		var t=pg.inscription;
		for (var j=0;j<t.length;j++) {
			if (tagnow<tags.length) {
				if (tags[tagnow][0]==j) {
					text+="<"+tags[tagnow][1]+">";
					tagnow++;
				}
			}
			text+=t[j];
		}
		if (tagnow<tags.length && j==tags[tagnow][0]) text+="<"+tags[tagnow][1]+">";
		out.push(text);
	})

	return out.join("");
};
module.exports={parseXML:parseXML, importJson:importJson, exportXML:exportXML}
});
require.register("ksana-document/buildfromxml.js", function(exports, require, module){
var outback = function (s) {
    while (s.length < 70) s += ' ';
    var l = s.length; 
    for (var i = 0; i < l; i++) s += String.fromCharCode(8);
    process.stdout.write(s);
}
var movefile=function(sourcefn,targetfolder) {
	var fs = require("fs");
	var source = fs.createReadStream(sourcefn);
	var path=require("path");
	var targetfn=path.resolve(process.cwd(),"..")+path.sep+path.basename(sourcefn);
	var destination = fs.createWriteStream(targetfn);
	console.log(targetfn);
	source.pipe(destination, { end: false });
	source.on("end", function(){
	    fs.unlinkSync(sourcefn);
	});
	return targetfn;
}
var mkdbjs="mkdb.js";
var build=function(path){
  var fs=require("fs");

  if (!fs.existsSync(mkdbjs)) {
      throw "no "+mkdbjs  ;
  }
  var starttime=new Date();
  console.log("START",starttime);
  if (!path) path=".";
  var fn=require("path").resolve(path,mkdbjs);
  var mkdbconfig=require(fn);
  var glob = require("glob");
  var indexer=require("ksana-document").indexer;
  var timer=null;

  glob(mkdbconfig.glob, function (err, files) {
    if (err) {
      throw err;
    }
    mkdbconfig.files=files.sort();
    var session=indexer.start(mkdbconfig);
    if (!session) {
      console.log("No file to index");
      return;
    }
    timer=setInterval( getstatus, 1000);
  });
  var getstatus=function() {
    var status=indexer.status();
    outback((Math.floor(status.progress*1000)/10)+'%'+status.message);
    if (status.done) {
    	var endtime=new Date();
    	console.log("END",endtime, "elapse",(endtime-starttime) /1000,"seconds") ;
      //status.outputfn=movefile(status.outputfn,"..");
      clearInterval(timer);
    }
  }
}

module.exports=build;
});
require.register("ksana-document/tei.js", function(exports, require, module){

var anchors=[];
var parser=null,filename="";
var context=null, config={};
var tagmodules=[];

var warning=function(err) {
	if (config.warning) {
		config.warning(err,filename);
	} else {
		console.log(err,filename);	
	}	
}
var ontext=function(e) {
	if (context.handler) context.text+=e;
}
var onopentag=function(e) {
	context.paths.push(e.name);
	context.parents.push(e);
	context.now=e;	
	context.path=context.paths.join("/");
	if (!context.handler) {
		var handler=context.handlers[context.path];
		if (handler) 	context.handler=handler;
		var close_handler=context.close_handlers[context.path];
		if (close_handler) 	context.close_handler=close_handler;
		if (context.handler)  context.handler(true);
	} else {
		context.handler();
	}
	
}

var onclosetag=function(e) {
	context.now=context.parents[context.parents.length-1];

	var handler=context.close_handlers[context.path];
	if (handler) {
		if (context.close_handler) context.close_handler(true);
		context.handler=null;//stop handling
		context.close_handler=null;//stop handling
		context.text="";
	} else if (context.close_handler) {
		context.close_handler();
	}
	context.paths.pop();
	context.parents.pop();
	context.path=context.paths.join("/");		
}
var addHandler=function(path,tagmodule) {
	if (tagmodule.handler) context.handlers[path]=tagmodule.handler;
	if (tagmodule.close_handler) context.close_handlers[path]=tagmodule.close_handler;
	if (tagmodule.reset) tagmodule.reset();
	tagmodule.warning=warning;
	tagmodules.push(tagmodule);
}
var closeAnchor=function(pg,T,anchors,id,texts) {
	var beg="beg"+id.substr(3);
	for (var j=anchors.length-1;j>=0;j--) {
		if (anchors[j][3]!=beg) continue;
		var anchor=anchors[j];
		
		if (pg==anchor[0]) { //same page
			anchor[2]=T[0]-anchor[1]; // length
		} else { //assume end anchor in just next page// ref. pT01p0003b2901
			var pagelen=texts[anchor[0]].t.length;
			anchors[j][2]= (pagelen-anchor[1])  + T[0];
		}
		return;
	}
	warning("cannot find beg pointer for anchor:"+id);
}
// [pg, start, len, id]
var createAnchors=function(parsed) {
	var anchors=[];
	var tags=parsed.tags;
	for (var pg=0;pg<tags.length;pg++){
		var pgtags=tags[pg];
		for (var i=0;i<pgtags.length;i++) {
				var T=pgtags[i];
				if (T[1].indexOf("anchor xml:id=")!=0) continue;
				var id=T[1].substr(15);
				id=id.substr(0,id.indexOf('"'));
				if (id.substr(0,3)=="end") {
					closeAnchor(pg,T,anchors,id,parsed.texts);
				} else {
					anchors.push([pg,T[0],0,id]);	
				}
			}
	}
	return anchors;	
}
var resolveAnchors=function(anchors,texts) {
	tagmodules.map(function(m){
		m.resolve(anchors,texts);
	})
}
var  createMarkups=function(parsed) {
	anchors=createAnchors(parsed);
	resolveAnchors(anchors,parsed.text);

	for (var i=0;i<anchors.length;i++) {
		if (anchors[i][4] && !anchors[i][4].length) {
			config.warning("unresolve anchor"+anchors[i][3]);
		}
	}
	return anchors;
}
var handlersResult=function() {
	var out={};
	tagmodules.map(function(m){
		out[m.name]=m.result();
	})
}

var parseP5=function(xml,parsed,fn,_config) {
	parser=require("sax").parser(true);
	filename=fn;
	context={ paths:[] , parents:[], handlers:{}, close_handlers:{}, text:"" ,now:null};
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
	parser.ontext=ontext;
	config=_config;
	tagmodules=[];

	parser.write(xml);
	context=null;
	parser=null;
	if (parsed) return createMarkups(parsed);
	else return handlersResult();
}
parseP5.addHandler=addHandler;
module.exports=parseP5;
});
require.register("ksana-document/concordance.js", function(exports, require, module){
/*
  concordance without suffix array.

  法 takes 25 seconds.

  improvement:
	less page scan.        
*/
var search=require("./search");
var Kde=require("./kde");
var excerpt=excerpt=require("./excerpt");
var status={progress:0}, forcestop=false;
var texts=[],starts=[],ends=[];
var config=null,engine=null;
var nest=0;
var verbose=false;

var scanpage=function(obj,npage,pat,backward) {
	var page=texts[npage];
	page.replace(pat,function(m,m1){
			if (!obj[m1]) obj[m1]=[];
			var o=obj[m1];
			if (o[o.length-1]!=npage) o.push(npage);
	});
}
var trimunfrequent=function(out,total,config) {
	for (var i=0;i<out.length;i++) {
		var hit=out[i][1].length;
		if ( (hit / total) < config.threshold || hit < config.threshold_count) {
			out.length=i;
			break;
		}
	}
}
var findNeighbors=function(filter,q,backward) {
	var cjkbmp="([\\u4E00-\\u9FFF])";
	if (verbose) console.log("findn",q,filter.length,backward)
	var p=q+cjkbmp;
	nest++;
	if (backward) terms=starts;
	else terms=ends;

	if (backward) p=cjkbmp+q ;  //starts

	var pat=new RegExp(p,"g");
	var obj={},out=[];
	for (var i=0;i<filter.length;i++) {
		var npage=i;
		if (typeof filter[i]=="number") npage=filter[i];
		scanpage(obj,npage,pat,backward);
	}
	for (var i in obj) out.push([i,obj[i]]);
	out.sort(function(a,b){return b[1].length-a[1].length});

	var total=0;
	for (var i=0;i<out.length;i++) total+=out[i][1].length;

	trimunfrequent(out,total,config);
	var newterms=[];
	if (nest<5) for (var i=0;i<out.length;i++) {
		var term=q+out[i][0];
		var termhit=out[i][1].length;
		if (backward) term=out[i][0]+q;
		var childterms=findNeighbors(out[i][1],term,backward);

		terms.push([term,termhit,q]);

		if (childterms.length==1 && childterms[0][1]/config.mid_threshold > termhit) {
			terms[terms.length-1][3]=childterms[0][0];
		}
		newterms.push([term,termhit,q]);
	}
	nest--;
	return newterms;
}

var finalize=function() {
	if (verbose) console.timeEnd("fetchtext");
	if (verbose) console.time("neighbor");
	findNeighbors(texts,config.q,false); //forward
	findNeighbors(texts,config.q,true); //backward	
	starts.sort(function(a,b){return b[1]-a[1]});
	ends.sort(function(a,b){return b[1]-a[1]});
	status.output={
		totalpagecount:engine.get("meta").pagecount,
		pagecount:texts.length,starts:starts,ends:ends};
	if (verbose) console.timeEnd("neighbor");
	status.done=true;
}
var opts={nohighlight:true};

var worker=function() {
	var Q=this;
	var pages=Q.pageWithHit(this.now);
	status.progress=this.now/Q.byFile.length;
	for (var j=0;j<pages.length;j++) {
		texts.push( engine.getSync(["fileContents",this.now,pages[j]]));	
	}
	this.now++
	if (this.now<Q.byFile.length) {
		setImmediate( worker.bind(this)) ;
		if (forcestop || Q.excerptStop) 	finalize();
	} else finalize();
}

var start=function(_config) {
	if (verbose) console.time("search");
	config=_config;
	config.threshold=config.threshold||0.005;
	config.threshold_count=config.threshold_count||20;
	config.mid_threshold=config.mid_threshold || 0.9 ; //if child has 80% hit, remove parent
	config.termlimit=config.termlimit||500;
	config.nestlevel=config.nestlevel||5;
	var open=Kde.open;
	if (typeof Require=="undefined") open=Kde.openLocal;

	open(config.db,function(_engine){
		engine=_engine;
		search(engine,config.q,opts,function(Q){
			Q.now=0;
			if (verbose) console.timeEnd("search");
			if (verbose) console.time("fetchtext");
			worker.call(Q);
		});
	});
}
var stop=function() {
	forcestop=true;
}

var getstatus=function() {
	return status;
}

module.exports={start:start,stop:stop,status:getstatus};

//module.exports=concordance;
});
require.register("ksana-document/regex.js", function(exports, require, module){
/*
   regex search.
   scan only possible pages

   remove regular expression operator  ^ $  [  ]  {  }  (  )  . \d \t \n

   $,^  begin and end not supported 
   support [^] exclusion later

   report match term with hit
*/
var search=require("./search");
var Kde=require("./kde");
var status={progress:0}, forcestop=false;
var texts=[],terms=[];
var config=null,engine=null;

var opts={nohighlight:true, range:{filestart:0, maxfile:100}};

var worker=function() {
	search(engine,config.q_unregex,opts,function(Q){
		var excerpts=Q.excerpt.map(function(q){return q.text.replace(/\n/g,"")});
		texts=texts.concat(excerpts);
		opts.range.filestart=opts.range.nextFileStart;
		status.progress=opts.range.nextFileStart/Q.byFile.length;
		if (forcestop || Q.excerptStop) {
			finalize();
		} else setTimeout(worker,0);
	});
}

var filter=function() {
	var pat=new RegExp(config.q,"g");
	var matches={};
	
	for (var i=0;i<texts.length;i++) {
		var m=texts[i].match(pat);
		if (m) {
			for (var j=0;j<m.length;j++) {
				if (!matches[m[j]]) matches[m[j]]=0;
				matches[m[j]]++;
			}
		}
	}

	terms=[];
	for (var i in matches) {
		if (matches[i]>=config.threshold) terms.push( [i,matches[i]]);	
	} 
	terms.sort(function(a,b){return b[1]-a[1]});
	return terms;
}
var finalize=function() {
	filter();
	status.output={
		totalpagecount:engine.get("meta").pagecount,
		pagecount:texts.length,
		terms:terms
	};
	status.done=true;
}
var unregex=function(q) {
	var out=q.replace(/\.+/g," ");
	out=out.replace(/\\./g," "); //remove \d \n \t
	return out;
}
var start=function(_config){
	config=_config;
	var open=Kde.open;
	config.threshold=config.threshold||5;
	if (typeof Require=="undefined") open=Kde.openLocal;
	config.q_unregex=unregex(config.q);
	open(config.db,function(_engine){
		engine=_engine;
		setTimeout(worker,0);
	});
}
var stop=function() {
	forcestop=true;
}

var getstatus=function() {
	return status;
}
module.exports={start:start,stop:stop,status:getstatus};
});
require.register("ksanaforge-fileinstaller/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* todo , optional kdb */

var htmlfs=Require("htmlfs");    
var checkbrowser=Require("checkbrowser");  
  
var html5fs=Require("ksana-document").html5fs;
var filelist = React.createClass({displayName: 'filelist',
	getInitialState:function() {
		return {downloading:false,progress:0};
	},
	updatable:function(f) {
        	var classes="btn btn-warning";
        	if (this.state.downloading) classes+=" disabled";
		if (f.hasUpdate) return React.DOM.button({className: classes, 
			'data-filename': f.filename, 'data-url': f.url, 
	            onClick: this.download
	       }, "Update")
		else return null;
	},
	showLocal:function(f) {
        var classes="btn btn-danger";
        if (this.state.downloading) classes+=" disabled";
	  return React.DOM.tr(null, React.DOM.td(null, f.filename), 
	      React.DOM.td(null), 
	      React.DOM.td({className: "pull-right"}, 
	      this.updatable(f), React.DOM.button({className: classes, 
	               onClick: this.deleteFile, 'data-filename': f.filename}, "Delete")
	        
	      )
	  )
	},  
	showRemote:function(f) { 
	  var classes="btn btn-warning";
	  if (this.state.downloading) classes+=" disabled";
	  return (React.DOM.tr({'data-id': f.filename}, React.DOM.td(null, 
	      f.filename), 
	      React.DOM.td(null, f.desc), 
	      React.DOM.td(null, 
	      React.DOM.span({'data-filename': f.filename, 'data-url': f.url, 
	            className: classes, 
	            onClick: this.download}, "Download")
	      )
	  ));
	},
	showFile:function(f) {
	//	return <span data-id={f.filename}>{f.url}</span>
		return (f.ready)?this.showLocal(f):this.showRemote(f);
	},
	reloadDir:function() {
		this.props.action("reload");
	},
	download:function(e) {
		var url=e.target.dataset["url"];
		var filename=e.target.dataset["filename"];
		this.setState({downloading:true,progress:0,url:url});
		this.userbreak=false;
		html5fs.download(url,filename,function(){
			this.reloadDir();
			this.setState({downloading:false,progress:1});
			},function(progress,total){
				if (progress==0) {
					this.setState({message:"total "+total})
			 	}
			 	this.setState({progress:progress});
			 	//if user press abort return true
			 	return this.userbreak;
			}
		,this);
	},
	deleteFile:function( e) {
		var filename=e.target.attributes["data-filename"].value;
		this.props.action("delete",filename);
	},
	allFilesReady:function(e) {
		return this.props.files.every(function(f){ return f.ready});
	},
	dismiss:function() {
		$(this.refs.dialog1.getDOMNode()).modal('hide');
		this.props.action("dismiss");
	},
	abortdownload:function() {
		this.userbreak=true;
	},
	showProgress:function() {
	     if (this.state.downloading) {
	      var progress=Math.round(this.state.progress*100);
	      return (
	      	React.DOM.div(null, 
	      	"Downloading from ", this.state.url, 
	      React.DOM.div({key: "progress", className: "progress col-md-8"}, 
	          React.DOM.div({className: "progress-bar", role: "progressbar", 
	              'aria-valuenow': progress, 'aria-valuemin': "0", 
	              'aria-valuemax': "100", style: {width: progress+"%"}}, 
	            progress, "%"
	          )
	        ), 
	        React.DOM.button({onClick: this.abortdownload, 
	        	className: "btn btn-danger col-md-4"}, "Abort")
	        )
	        );
	      } else {
	      		if ( this.allFilesReady() ) {
	      			return React.DOM.button({onClick: this.dismiss, className: "btn btn-success"}, "Ok")
	      		} else return null;
	      		
	      }
	},
	showUsage:function() {
		var percent=this.props.remainPercent;
           return (React.DOM.div(null, React.DOM.span({className: "pull-left"}, "Usage:"), React.DOM.div({className: "progress"}, 
		  React.DOM.div({className: "progress-bar progress-bar-success progress-bar-striped", role: "progressbar", style: {width: percent+"%"}}, 
		    	percent+"%"
		  )
		)));
	},
	render:function() {
	  	return (
		React.DOM.div({ref: "dialog1", className: "modal fade", 'data-backdrop': "static"}, 
		    React.DOM.div({className: "modal-dialog"}, 
		      React.DOM.div({className: "modal-content"}, 
		        React.DOM.div({className: "modal-header"}, 
		          React.DOM.h4({className: "modal-title"}, "File Installer")
		        ), 
		        React.DOM.div({className: "modal-body"}, 
		        	React.DOM.table({className: "table"}, 
		        	React.DOM.tbody(null, 
		          	this.props.files.map(this.showFile)
		          	)
		          )
		        ), 
		        React.DOM.div({className: "modal-footer"}, 
		        	this.showUsage(), 
		           this.showProgress()
		        )
		      )
		    )
		  )
		);
	},	
	componentDidMount:function() {
		$(this.refs.dialog1.getDOMNode()).modal('show');
	}
});
/*TODO kdb check version*/
var filemanager = React.createClass({displayName: 'filemanager',
	getInitialState:function() {
		var quota=this.getQuota();
		return {browserReady:false,noupdate:true,
			requestQuota:quota,remain:0};
	},
	getQuota:function() {
		var q=this.props.quota||"128M";
		var unit=q[q.length-1];
		var times=1;
		if (unit=="M") times=1024*1024;
		else if (unit="K") times=1024;
		return parseInt(q) * times;
	},
	missingKdb:function() {
		var missing=this.props.needed.filter(function(kdb){
			for (var i in html5fs.files) {
				if (html5fs.files[i][0]==kdb.filename) return false;
			}
			return true;
		},this);
		return missing;
	},
	getRemoteUrl:function(fn) {
		var f=this.props.needed.filter(function(f){return f.filename==fn});
		if (f.length ) return f[0].url;
	},
	genFileList:function(existing,missing){
		var out=[];
		for (var i in existing) {
			var url=this.getRemoteUrl(existing[i][0]);
			out.push({filename:existing[i][0], url :url, ready:true });
		}
		for (var i in missing) {
			out.push(missing[i]);
		}
		return out;
	},
	reload:function() {
		html5fs.readdir(function(files){
  			this.setState({files:this.genFileList(files,this.missingKdb())});
  		},this);
	 },
	deleteFile:function(fn) {
	  html5fs.rm(fn,function(){
	  	this.reload();
	  },this);
	},
	onQuoteOk:function(quota,usage) {
		var files=this.genFileList(html5fs.files,this.missingKdb());
		var that=this;
		that.checkIfUpdate(files,function(hasupdate) {
			var missing=this.missingKdb();
			var autoclose=this.props.autoclose;
			if (missing.length) autoclose=false;
			that.setState({autoclose:autoclose,
				quota:quota,usage:usage,files:files,
				missing:missing,
				noupdate:!hasupdate,
				remain:quota-usage});
		});
	},  
	onBrowserOk:function() {
	  this.totalDownloadSize();
	}, 
	dismiss:function() {
		this.props.onReady(this.state.usage,this.state.quota);
		setTimeout(function(){
			$(".modal.in").modal('hide');
		},500);
	}, 
	totalDownloadSize:function() {
		var files=this.missingKdb();
		var taskqueue=[],totalsize=0;
		for (var i=0;i<files.length;i++) {
			taskqueue.push(
				(function(idx){
					return (function(data){
						if (!(typeof data=='object' && data.__empty)) totalsize+=data;
						html5fs.getDownloadSize(files[idx].url,taskqueue.shift());
					});
				})(i)
			);
		}
		var that=this;
		taskqueue.push(function(data){	
			totalsize+=data;
			setTimeout(function(){that.setState({requireSpace:totalsize,browserReady:true})},0);
		});
		taskqueue.shift()({__empty:true});
	},
	checkIfUpdate:function(files,cb) {
		var taskqueue=[];
		for (var i=0;i<files.length;i++) {
			taskqueue.push(
				(function(idx){
					return (function(data){
						if (!(typeof data=='object' && data.__empty)) files[idx-1].hasUpdate=data;
						html5fs.checkUpdate(files[idx].url,files[idx].filename,taskqueue.shift());
					});
				})(i)
			);
		}
		var that=this;
		taskqueue.push(function(data){	
			files[files.length-1].hasUpdate=data;
			var hasupdate=files.some(function(f){return f.hasUpdate});
			if (cb) cb.apply(that,[hasupdate]);
		});
		taskqueue.shift()({__empty:true});
	},
	render:function(){
    		if (!this.state.browserReady) {   
      			return checkbrowser({feature: "fs", onReady: this.onBrowserOk})
    		} if (!this.state.quota || this.state.remain<this.state.requireSpace) {  
    			var quota=this.state.requestQuota;
    			if (this.state.usage+this.state.requireSpace>quota) {
    				quota=(this.state.usage+this.state.requireSpace)*1.5;
    			}
      			return htmlfs({quota: quota, autoclose: "true", onReady: this.onQuoteOk})
      		} else {
			if (!this.state.noupdate || this.missingKdb().length || !this.state.autoclose) {
				var remain=Math.round((this.state.usage/this.state.quota)*100);				
				return filelist({action: this.action, files: this.state.files, remainPercent: remain})
			} else {
				setTimeout( this.dismiss ,0);
				return React.DOM.span(null, "Success");
			}
      		}
	},
	action:function() {
	  var args = Array.prototype.slice.call(arguments);
	  var type=args.shift();
	  var res=null, that=this;
	  if (type=="delete") {
	    this.deleteFile(args[0]);
	  }  else if (type=="reload") {
	  	this.reload();
	  } else if (type=="dismiss") {
	  	this.dismiss();
	  }
	}
});

module.exports=filemanager;
});
require.register("ksanaforge-checkbrowser/index.js", function(exports, require, module){
/** @jsx React.DOM */

var checkfs=function() {
	return (navigator && navigator.webkitPersistentStorage);
}
var featurechecks={
	"fs":checkfs
}
var checkbrowser = React.createClass({displayName: 'checkbrowser',
	getInitialState:function() {
		var missingFeatures=this.getMissingFeatures();
		return {ready:false, missing:missingFeatures};
	},
	getMissingFeatures:function() {
		var feature=this.props.feature.split(",");
		var status=[];
		feature.map(function(f){
			var checker=featurechecks[f];
			if (checker) checker=checker();
			status.push([f,checker]);
		});
		return status.filter(function(f){return !f[1]});
	},
	downloadbrowser:function() {
		window.location="https://www.google.com/chrome/"
	},
	renderMissing:function() {
		var showMissing=function(m) {
			return React.DOM.div(null, m);
		}
		return (
		 React.DOM.div({ref: "dialog1", className: "modal fade", 'data-backdrop': "static"}, 
		    React.DOM.div({className: "modal-dialog"}, 
		      React.DOM.div({className: "modal-content"}, 
		        React.DOM.div({className: "modal-header"}, 
		          React.DOM.button({type: "button", className: "close", 'data-dismiss': "modal", 'aria-hidden': "true"}, "×"), 
		          React.DOM.h4({className: "modal-title"}, "Browser Check")
		        ), 
		        React.DOM.div({className: "modal-body"}, 
		          React.DOM.p(null, "Sorry but the following feature is missing"), 
		          this.state.missing.map(showMissing)
		        ), 
		        React.DOM.div({className: "modal-footer"}, 
		          React.DOM.button({onClick: this.downloadbrowser, type: "button", className: "btn btn-primary"}, "Download Google Chrome")
		        )
		      )
		    )
		  )
		 );
	},
	renderReady:function() {
		return React.DOM.span(null, "browser ok")
	},
	render:function(){
		return  (this.state.missing.length)?this.renderMissing():this.renderReady();
	},
	componentDidMount:function() {
		if (!this.state.missing.length) {
			this.props.onReady();
		} else {
			$(this.refs.dialog1.getDOMNode()).modal('show');
		}
	}
});

module.exports=checkbrowser;
});
require.register("ksanaforge-htmlfs/index.js", function(exports, require, module){
/** @jsx React.DOM */
var html5fs=Require("ksana-document").html5fs;
var htmlfs = React.createClass({displayName: 'htmlfs',
	getInitialState:function() { 
		return {ready:false, quota:0,usage:0,Initialized:false,autoclose:this.props.autoclose};
	},
	initFilesystem:function() {
		var quota=this.props.quota||1024*1024*128; // default 128MB
		quota=parseInt(quota);
		html5fs.init(quota,function(q){
			this.dialog=false;
			$(this.refs.dialog1.getDOMNode()).modal('hide');
			this.setState({quota:q,autoclose:true});
		},this);
	},
	welcome:function() {
		return (
		React.DOM.div({ref: "dialog1", className: "modal fade", id: "myModal", 'data-backdrop': "static"}, 
		    React.DOM.div({className: "modal-dialog"}, 
		      React.DOM.div({className: "modal-content"}, 
		        React.DOM.div({className: "modal-header"}, 
		          React.DOM.h4({className: "modal-title"}, "Welcome")
		        ), 
		        React.DOM.div({className: "modal-body"}, 
		          "Browser will ask for your confirmation."
		        ), 
		        React.DOM.div({className: "modal-footer"}, 
		          React.DOM.button({onClick: this.initFilesystem, type: "button", 
		            className: "btn btn-primary"}, "Initialize File System")
		        )
		      )
		    )
		  )
		 );
	},
	renderDefault:function(){
		var used=Math.floor(this.state.usage/this.state.quota *100);
		var more=function() {
			if (used>50) return React.DOM.button({type: "button", className: "btn btn-primary"}, "Allocate More");
			else null;
		}
		return (
		React.DOM.div({ref: "dialog1", className: "modal fade", id: "myModal", 'data-backdrop': "static"}, 
		    React.DOM.div({className: "modal-dialog"}, 
		      React.DOM.div({className: "modal-content"}, 
		        React.DOM.div({className: "modal-header"}, 
		          React.DOM.h4({className: "modal-title"}, "Sandbox File System")
		        ), 
		        React.DOM.div({className: "modal-body"}, 
		          React.DOM.div({className: "progress"}, 
		            React.DOM.div({className: "progress-bar", role: "progressbar", style: {width: used+"%"}}, 
		               used, "%"
		            )
		          ), 
		          React.DOM.span(null, this.state.quota, " total , ", this.state.usage, " in used")
		        ), 
		        React.DOM.div({className: "modal-footer"}, 
		          React.DOM.button({onClick: this.dismiss, type: "button", className: "btn btn-default", 'data-dismiss': "modal"}, "Close"), 
		          more()
		        )
		      )
		    )
		  )
		  );
	},
	dismiss:function() {
		var that=this;
		setTimeout(function(){
			that.props.onReady(that.state.quota,that.state.usage);	
		},0);
	},
	queryQuota:function() {
		html5fs.queryQuota(function(usage,quota){
			this.setState({usage:usage,quota:quota,initialized:true});
		},this);
	},
	render:function() {
		var that=this;
		if (!this.state.quota || this.state.quota<this.props.quota) {
			if (this.state.initialized) {
				this.dialog=true;
				return this.welcome();	
			} else {
				return React.DOM.span(null, "checking quota")
			}			
		} else {
			if (!this.state.autoclose) {
				this.dialog=true;
				return this.renderDefault(); 
			}
			this.dismiss();
			this.dialog=false;
			return React.DOM.span(null)
		}
	},
	componentDidMount:function() {
		if (!this.state.quota) {
			this.queryQuota();

		};
	},
	componentDidUpdate:function() {
		if (this.dialog) $(this.refs.dialog1.getDOMNode()).modal('show');
	}
});

module.exports=htmlfs;
});
require.register("idiom_search_react-main/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */


var api=Require("api");
var results=Require("results");
var main = React.createClass({displayName: 'main',
  getInitialState: function() {
    return {bar: "world", res: [], tofind:[], field:[]};
  },
  dosearch: function() {
    var tofind=this.refs.tofind.getDOMNode().value;
    var res=api.search(tofind);
    this.setState({res:res, tofind:tofind, field:"key"});
  },
  dosearchDef: function() {
    var tofind=this.refs.tofind.getDOMNode().value;
    var res=api.searchDef(tofind);
    this.setState({res:res, tofind:tofind, field:"def"});
  },
  render: function() {
    return (
      React.DOM.div(null, 
        React.DOM.input({ref: "tofind", defaultValue: "花"}), 
        React.DOM.button({onClick: this.dosearch}, "Search"), 
        React.DOM.button({onClick: this.dosearchDef}, "Search Def"), 
        results({res: this.state.res, tofind: this.state.tofind, field: this.state.field})
      )
    );
  }
});
module.exports=main;
});
require.register("idiom_search_react-comp1/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var comp1 = React.createClass({displayName: 'comp1',
  getInitialState: function() {
    return {bar: "world"};
  },
  render: function() {
    return (
      React.DOM.div(null, 
        "Hello,", this.state.bar
      )
    );
  }
});
module.exports=comp1;
});
require.register("idiom_search_react-results/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var main=Require("main");
var results = React.createClass({displayName: 'results',
  getInitialState: function() {
    return {bar: "world"}
  },
  renderItem: function(item){
    var field=this.props.field;
    console.log(item[field]);
    var tofind=this.props.tofind;
    var key=item.key.replace(tofind,function(tofind){return "<span class='tofind'>"+tofind+"</span>"});
    var def=item.def.replace(tofind,function(tofind){return "<span class='tofind'>"+tofind+"</span>"});

    return React.DOM.div(null, React.DOM.span({dangerouslySetInnerHTML: {__html: key}}), " ", React.DOM.br(null), 
    React.DOM.span({dangerouslySetInnerHTML: {__html: def}}))
    //return <div>{item}</div>;
  },
  render: function() {
    return (
      React.DOM.div(null, 
        this.props.res.map(this.renderItem)
      )
    );
  }
});
module.exports=results;
});
require.register("idiom_search_react-dataset/index.js", function(exports, require, module){
//var othercomponent=Require("other"); 
//new module filename must be added to scripts section of ./component.js and export here
var dataset = {
 idioms: require("./idioms")
}

module.exports=dataset;
});
require.register("idiom_search_react-dataset/idioms.js", function(exports, require, module){
var idioms=[{"key":"妙手回春",
"zu":"ㄇ｜ㄠˋ　ㄕㄡˇ　ㄏㄨㄟˊ　ㄔㄨㄣ",
"han":"miào shǒu huí chūn",
"def":"「妙手」，技能高超的人。語出晉．蔡洪〈圍棋賦〉。「回春」，冬盡春來，比喻使病危者復生。※語或出宋．蘇軾〈浪淘沙．昨日出東城〉詞。「妙手回春」比喻醫師的醫術高明，能治好重病。後亦用於比喻將頹勢扭轉過來。△「著手成春」、「起死回生」"},{"key":"天翻地覆",
"zu":"ㄊ｜ㄢ　ㄈㄢ　ㄉ｜ˋ　ㄈㄨˋ",
"han":"tiān fān dì fù",
"def":"形容巨大地改變原有的情狀。語出唐．劉商〈胡笳十八拍．第六拍〉。"},{"key":"肝腦塗地",
"zu":"ㄍㄢ　ㄋㄠˇ　ㄊㄨˊ　ㄉ｜ˋ",
"han":"gān nǎo tú dì",
"def":"肝腦濺灑在地上。形容死狀極慘。語本《戰國策．燕策一》。後亦用於比喻盡忠竭力，不惜犧牲生命之意。"},{"key":"快馬加鞭",
"zu":"ㄎㄨㄞˋ　ㄇㄚˇ　ㄐ｜ㄚ　ㄅ｜ㄢ",
"han":"kuài mǎ jiā biān",
"def":"對跑很快的馬，再加以鞭策，使它跑得更快。形容快上加快。語本宋．王安石〈送純甫如江南〉詩。△「馬不停蹄」"},{"key":"志同道合",
"zu":"ㄓˋ　ㄊㄨㄥˊ　ㄉㄠˋ　ㄏㄜˊ",
"han":"zhì tóng dào hé",
"def":"彼此的志趣和理想一致。＃語本漢．王充《論衡．逢遇》。△「合志同方」、「情投意合」"},{"key":"冷言冷語",
"zu":"ㄌㄥˇ　｜ㄢˊ　ㄌㄥˇ　ㄩˇ",
"han":"lěng yán lěng yǔ",
"def":"含有譏諷意味的冷冰冰的話。語出《虛堂和尚語錄．卷二．婺州雲黃山寶林禪寺語錄》。△「冷嘲熱諷」"},{"key":"千里鵝毛",
"zu":"ㄑ｜ㄢ　ㄌ｜ˇ　ㄜˊ　ㄇㄠˊ",
"han":"qiān lǐ é máo",
"def":"鵝毛，形容價值不高之物。「千里鵝毛」指從千里之外贈送輕微的禮物。比喻禮物雖輕但情意深重。※語或本宋．歐陽修〈梅聖俞寄銀杏〉詩。"},{"key":"衣錦還鄉",
"zu":"｜ˋ　ㄐ｜ㄣˇ　ㄏㄨㄢˊ　ㄒ｜ㄤ",
"han":"yì jǐn huán xiāng",
"def":"衣，音｜ˋ，動詞，穿著的意思。「衣錦還鄉」指身穿錦繡的衣服返回故鄉。形容人功成名就後榮歸故鄉。＃語出《梁書．卷九．柳慶遠列傳》。△「衣錦夜行」"},{"key":"言之有物",
"zu":"｜ㄢˊ　ㄓ　｜ㄡˇ　ㄨˋ",
"han":"yán zhī yǒu wù",
"def":"指言論或文章有根據、有內容。語本《易經．家人卦．象》。△「言之無物」"},{"key":"投機取巧",
"zu":"ㄊㄡˊ　ㄐ｜　ㄑㄩˇ　ㄑ｜ㄠˇ",
"han":"tóu jī qǔ qiǎo",
"def":"利用時機，獲取利益。※語或本《莊子．天地》。"},{"key":"磨杵成針",
"zu":"ㄇㄛˊ　ㄔㄨˇ　ㄔㄥˊ　ㄓㄣ",
"han":"mó chǔ chéng zhēn",
"def":"杵，舂米、擣藥時用的棒槌。「磨杵成針」指把鐵棒磨成針。典出宋．祝穆《方輿勝覽．卷五三．磨鍼溪》。後用「磨杵成針」比喻只要有恆心，努力去做，無論多麼困難的事，都可以成功。"},{"key":"流言蜚語",
"zu":"ㄌ｜ㄡˊ　｜ㄢˊ　ㄈㄟ　ㄩˇ",
"han":"liú yán fēi yǔ",
"def":"「流言」和「蜚語」義同，都是指沒有根據的話，用於毀謗他人。＃「流言」語出《書經．金縢》。「蜚語」語本《鶡冠子．武靈王》。「流言蜚語」本指製造不實的傳言，用來詆毀他人。後泛指謠言。「蜚」亦作「飛」。△「風言風語」"},{"key":"溫故知新",
"zu":"ㄨㄣ　ㄍㄨˋ　ㄓ　ㄒ｜ㄣ",
"han":"wēn gù zhī xīn",
"def":"複習學過的課業，而能領悟出新的道理。語出《論語．為政》。"},{"key":"狼心狗肺",
"zu":"ㄌㄤˊ　ㄒ｜ㄣ　ㄍㄡˇ　ㄈㄟˋ",
"han":"láng xīn gǒu fèi",
"def":"比喻人心腸狠毒，毫無良心。※語或出《醒世恆言．卷三○．李汧公窮邸遇俠客》。△「狼心狗行」"},{"key":"殺人越貨",
"zu":"ㄕㄚ　ㄖㄣˊ　ㄩㄝˋ　ㄏㄨㄛˋ",
"han":"shā rén yuè huò",
"def":"殺人搶劫。語本《書經．康誥》。△「謀財害命」"},{"key":"頑石點頭",
"zu":"ㄨㄢˊ　ㄕˊ　ㄉ｜ㄢˇ　ㄊㄡˊ",
"han":"wán shí diǎn tóu",
"def":"連頑冥沒有性靈的石頭都點頭了。比喻說理透澈，使人心服。語本《蓮社高賢傳．道生法師》。"},{"key":"罪魁禍首",
"zu":"ㄗㄨㄟˋ　ㄎㄨㄟˊ　ㄏㄨㄛˋ　ㄕㄡˇ",
"han":"zuì kuí huò shǒu",
"def":"「罪魁」，犯罪首惡者。語出宋．文天祥《指南錄．卷一．紀事》。「禍首」，肇禍為首者。語出《東觀漢記．卷一五．申屠剛》。「罪魁禍首」指領導或策劃肇禍犯罪的首要人物。"},{"key":"冤家路窄",
"zu":"ㄩㄢ　ㄐ｜ㄚ　ㄌㄨˋ　ㄓㄞˇ",
"han":"yuān jiā lù zhǎi",
"def":"仇人或不願見到的人，偏在狹小的路上相遇，無法躲避。※語或出《西遊記．第四五回》。"},{"key":"珠圓玉潤",
"zu":"ㄓㄨ　ㄩㄢˊ　ㄩˋ　ㄖㄨㄣˋ",
"han":"zhū yuán yù rùn",
"def":"像珠子一般渾圓，像玉石一般溫潤。語本唐．張文琮〈詠水〉詩。後用「珠圓玉潤」比喻文詞、歌聲、字跡的流利、圓潤、娟秀。"},{"key":"焦頭爛額",
"zu":"ㄐ｜ㄠ　ㄊㄡˊ　ㄌㄢˋ　ㄜˊ",
"han":"jiāo tóu làn é",
"def":"燒焦頭，灼爛額。形容救火時為火燒灼得很嚴重。＃語本《漢書．卷六八．霍光傳》。後用「焦頭爛額」比喻做事陷入十分狼狽窘迫的困境或犧牲慘重。△「頭破血流」"},{"key":"德高望重",
"zu":"ㄉㄜˊ　ㄍㄠ　ㄨㄤˋ　ㄓㄨㄥˋ",
"han":"dé gāo wàng zhòng",
"def":"形容人品德高尚，極有聲望。語本《晉書．卷六四．簡文三子列傳．會稽文孝王道子》。△「年高德劭」"},{"key":"銳不可當",
"zu":"ㄖㄨㄟˋ　ㄅㄨˋ　ㄎㄜˇ　ㄉㄤ",
"han":"ruì bù kě dāng",
"def":"「銳不可當」的「銳」，典源作「鋒」。形容氣勢威猛，所向無敵。※語或本《史記．卷九二．淮陰侯列傳》。△「勢不可當」、「勢如破竹」"},{"key":"胡作非為",
"zu":"ㄏㄨˊ　ㄗㄨㄛˋ　ㄈㄟ　ㄨㄟˊ",
"han":"hú zuò fēi wéi",
"def":"指不顧法紀或不講道理的任意妄為。語本《舊五代史．卷一○六．漢書．張瓘傳》。"},{"key":"漏網之魚",
"zu":"ㄌㄡˋ　ㄨㄤˇ　ㄓ　ㄩˊ",
"han":"lòu wǎng zhī yú",
"def":"從網眼中逃出去的魚，比喻僥倖逃脫法網的人。語本《史記．卷一二二．酷吏列傳．序》。後亦用「漏網之魚」比喻驚慌逃竄的人。△「破觚為圜」、「斲雕為樸」"},{"key":"適可而止",
"zu":"ㄕˋ　ㄎㄜˇ　ㄦˊ　ㄓˇ",
"han":"shì kě ér zhǐ",
"def":"指事情做到恰到好處就該停止。語出宋．朱熹《四書章句集注．論語集注．鄉黨》。"},{"key":"無所適從",
"zu":"ㄨˊ　ㄙㄨㄛˇ　ㄕˋ　ㄘㄨㄥˊ",
"han":"wú suǒ shì cóng",
"def":"適，古音ㄉ｜ˊ，專主。「無所適從」指不知聽從誰才好。◎語本《左傳．僖公五年》。後世借以比喻不知怎麼辦才好。△「不知所從」"},{"key":"賞心悅目",
"zu":"ㄕㄤˇ　ㄒ｜ㄣ　ㄩㄝˋ　ㄇㄨˋ",
"han":"shǎng xīn yuè mù",
"def":"「賞心」，心情愉悅。語出南朝宋．謝靈運〈擬魏太子鄴中集詩八首序〉。「悅目」，愉悅眼目，使人感到歡喜。語出漢．劉向《說苑．卷一九．修文》。「賞心悅目」形容情景美好，使心目都感到快樂舒暢。△「悅心娛目」、「蕩心悅目」"},{"key":"錙銖必較",
"zu":"ㄗ　ㄓㄨ　ㄅ｜ˋ　ㄐ｜ㄠˋ",
"han":"zī zhū bì jiào",
"def":"「錙銖必較」，典源作「計較錙銖」。連很少的錢或很小的事情都非常計較。※語或本北齊．顏之推《顏氏家訓．治家》。△「斤斤計較」"},{"key":"苟且偷安",
"zu":"ㄍㄡˇ　ㄑ｜ㄝˇ　ㄊㄡ　ㄢ",
"han":"gǒu qiě tōu ān",
"def":"「苟且」，行事馬虎草率，得過且過。語出《漢書．卷八六．何武王嘉師丹傳．王嘉》。「偷安」，貪圖眼前的安逸，不顧將來可能發生的危難。語出漢．賈誼《新書．數寧》。「苟且偷安」形容得過且過，只圖眼前安逸，不顧將來。"},{"key":"指日可待",
"zu":"ㄓˇ　ㄖˋ　ㄎㄜˇ　ㄉㄞˋ",
"han":"zhǐ rì kě dài",
"def":"指日，可以指出日期，比喻不久之後。「指日可待」指願望或期盼不久即將實現。＃語出宋．司馬光〈乞開言路狀〉。△「計日而待」"},{"key":"蛛絲馬跡",
"zu":"ㄓㄨ　ㄙ　ㄇㄚˇ　ㄐ｜",
"han":"zhū sī mǎ jī",
"def":"蛛網的細絲與馬蹄的痕跡。比喻可供尋查推求的細微線索。◎語本唐．楊筠松《龍經．上經撼龍經．破軍星》。"},{"key":"藏頭露尾",
"zu":"ㄘㄤˊ　ㄊㄡˊ　ㄌㄡˋ　ㄨㄟˇ",
"han":"cáng tóu lòu wěi",
"def":"把頭藏起來，卻露出尾巴。形容言多隱諱，舉止畏縮的樣子。※語或本元．王曄《桃花女．第二折》。△「藏頭露影」"},{"key":"離鄉背井",
"zu":"ㄌ｜ˊ　ㄒ｜ㄤ　ㄅㄟˋ　ㄐ｜ㄥˇ",
"han":"lí xiāng bèi jǐng",
"def":"背，是背離。井，借指家鄉。「離鄉背井」指離開故鄉，在外地生活。語本《古尊宿語錄．卷三七．鼓山先興聖國師（神晏）和尚法堂玄要廣集》。△「離鄉背土」"},{"key":"尋花問柳",
"zu":"ㄒㄩㄣˊ　ㄏㄨㄚ　ㄨㄣˋ　ㄌ｜ㄡˇ",
"han":"xún huā wèn liǔ",
"def":"出外遊賞春天的景色。語本唐．杜甫〈嚴中丞枉駕見過〉詩。後用「尋花問柳」比喻狎妓。"},{"key":"苦心孤詣",
"zu":"ㄎㄨˇ　ㄒ｜ㄣ　ㄍㄨ　｜ˋ",
"han":"kǔ xīn gū yì",
"def":"費盡心思，專心研究，達到他人所無法達到的境地。※語本清．屈復〈論詩絕句〉二四首之一三。△「煞費苦心」"},{"key":"飢不擇食",
"zu":"ㄐ｜　ㄅㄨˋ　ㄗㄜˊ　ㄕˊ",
"han":"jī bù zé shí",
"def":"飢餓的人不選擇食物。＃語本《孟子．公孫丑上》。後用「飢不擇食」比喻急需時不暇選擇。△「以解倒懸」、「事半功倍」、「渴不擇飲」"},{"key":"豐衣足食",
"zu":"ㄈㄥ　｜　ㄗㄨˊ　ㄕˊ",
"han":"fēng yī zú shí",
"def":"衣食充足。形容生活富裕。語出唐．齊己〈病中勉送小師往清涼山禮大聖〉詩。△「暖衣餘食」"},{"key":"繁文縟節",
"zu":"ㄈㄢˊ　ㄨㄣˊ　ㄖㄨˋ　ㄐ｜ㄝˊ",
"han":"fán wén rù jié",
"def":"繁瑣的儀式或禮節。語本唐．元稹〈授王永太常博士制〉。"},{"key":"斯文掃地",
"zu":"ㄙ　ㄨㄣˊ　ㄙㄠˇ　ㄉ｜ˋ",
"han":"sī wén sǎo dì",
"def":"「斯文」，指有關禮樂教化的典章制度。亦泛指文人或儒士。語出《論語．子罕》。「掃地」，指毀壞廢棄。語本《漢書．卷三三．魏豹等傳》。「斯文掃地」指禮樂教化的典章制度被毀壞廢棄或文人不受尊重；後亦指文人不顧操守，自甘墮落。△「五經掃地」、「衣冠掃地」"},{"key":"拭目以待",
"zu":"ㄕˋ　ㄇㄨˋ　｜ˇ　ㄉㄞˋ",
"han":"shì mù yǐ dài",
"def":"擦亮眼睛等待著。比喻期待事情的發展及結果。語本《漢書．卷七六．趙尹韓張兩王傳．張敞》。"},{"key":"風調雨順",
"zu":"ㄈㄥ　ㄊ｜ㄠˊ　ㄩˇ　ㄕㄨㄣˋ",
"han":"fēng tiáo yǔ shùn",
"def":"風雨及時而適量。形容豐年安樂，天下太平的景象。語出《六韜》。"},{"key":"刻骨銘心",
"zu":"ㄎㄜˋ　ㄍㄨˇ　ㄇ｜ㄥˊ　ㄒ｜ㄣ",
"han":"kè gǔ míng xīn",
"def":"刻在骨頭，刻在心上。形容感受深刻，難以忘懷。語本唐．李白〈上安州李長史書〉。△「沒齒不忘」、「銘肌鏤骨」"},{"key":"疊床架屋",
"zu":"ㄉ｜ㄝˊ　ㄔㄨㄤˊ　ㄐ｜ㄚˋ　ㄨ",
"han":"dié chuáng jià wū",
"def":"床上疊床，屋下架屋。比喻重複模仿，無所創新。語本北齊．顏之推《顏氏家訓．序致》。後多用「疊床架屋」比喻重複累贅。△「床上安床」、「屋下架屋」"},{"key":"風花雪月",
"zu":"ㄈㄥ　ㄏㄨㄚ　ㄒㄩㄝˇ　ㄩㄝˋ",
"han":"fēng huā xuě yuè",
"def":"指四時美好的景色。語本唐．鄭谷〈府中寓止寄趙大諫〉詩。後用「風花雪月」比喻男女間歡愛之事。亦用於比喻浮華空泛的言情詩文。"},{"key":"觸目驚心",
"zu":"ㄔㄨˋ　ㄇㄨˋ　ㄐ｜ㄥ　ㄒ｜ㄣ",
"han":"chù mù jīng xīn",
"def":"目光所及，令人內心深受衝擊。語本《南齊書．卷二二．豫章文獻王列傳》。形容事情景況，令人震驚。△「劌目怵心」、「劌目鉥心」"},{"key":"移樽就教",
"zu":"｜ˊ　ㄗㄨㄣ　ㄐ｜ㄡˋ　ㄐ｜ㄠˋ",
"han":"yí zūn jiù jiào",
"def":"「樽」，典源作「尊」。「尊」同「樽」。帶著酒壺移坐到他人席上共飲，以便請教。※語或本唐．白居易〈李留守相公見過池上汎舟舉酒話及翰林舊事因成四韻以獻之〉詩。比喻主動向人求教。"},{"key":"委曲求全",
"zu":"ㄨㄟˇ　ㄑㄩ　ㄑ｜ㄡˊ　ㄑㄩㄢˊ",
"han":"wěi qū qiú quán",
"def":"委曲自己，遷就別人，以求保全。語本《老子．第二二章》。△「逆來順受」"},{"key":"康莊大道",
"zu":"ㄎㄤ　ㄓㄨㄤ　ㄉㄚˋ　ㄉㄠˋ",
"han":"kāng zhuāng dà dào",
"def":"四通八達的大路。語本《史記．卷七四．孟子荀卿列傳》。後用「康莊大道」比喻光明的前途。"},{"key":"南腔北調",
"zu":"ㄋㄢˊ　ㄑ｜ㄤ　ㄅㄟˇ　ㄉ｜ㄠˋ",
"han":"nán qiāng běi diào",
"def":"形容人說話的語音不純，夾雜著南北方音。※語或出清．袁枚《隨園詩話．卷一二》。後亦用「南腔北調」指南北各種腔調。"},{"key":"風塵僕僕",
"zu":"ㄈㄥ　ㄔㄣˊ　ㄆㄨˊ　ㄆㄨˊ",
"han":"fēng chén pú pú",
"def":"「風塵」，旅行時冒風受塵，因以之比喻旅行艱辛。＃語出漢．秦嘉〈與妻書〉。「僕僕」，勞頓的樣子。語出※宋．高斯得〈經筵進講故事〉。「風塵僕僕」形容奔波忙碌，旅途勞累。"},{"key":"咫尺天涯",
"zu":"ㄓˇ　ㄔˇ　ㄊ｜ㄢ　｜ㄚˊ",
"han":"zhǐ chǐ tiān yá",
"def":"咫，周代八寸叫咫。咫尺，比喻距離很近。「咫尺天涯」比喻相距雖近，卻有如相隔天涯一般，無緣相見。語本唐．李中〈宮詞〉二首之一。△「尺幅千里」"},{"key":"事在人為",
"zu":"ㄕˋ　ㄗㄞˋ　ㄖㄣˊ　ㄨㄟˊ",
"han":"shì zài rén wéi",
"def":"事情的成功與否決定於人的努力。語本漢．趙曄《吳越春秋．勾踐陰謀外傳》。"},{"key":"排山倒海",
"zu":"ㄆㄞˊ　ㄕㄢ　ㄉㄠˇ　ㄏㄞˇ",
"han":"pái shān dǎo hǎi",
"def":"形容力量巨大，氣勢壯闊。＃語本袁山松《後漢書》。△「移山倒海」、「雷霆萬鈞」"},{"key":"眾矢之的",
"zu":"ㄓㄨㄥˋ　ㄕˇ　ㄓ　ㄉ｜ˋ",
"han":"zhòng shǐ zhī dì",
"def":"指眾人射箭的靶子。比喻眾人一致攻擊的目標。※語或本《明史．卷二三一．顧憲成等傳》。"},{"key":"情投意合",
"zu":"ㄑ｜ㄥˊ　ㄊㄡˊ　｜ˋ　ㄏㄜˊ",
"han":"qíng tóu yì hé",
"def":"彼此的感情和心意相契合。語本漢．馮衍〈與陰就書〉。△「志同道合」"},{"key":"小時了了",
"zu":"ㄒ｜ㄠˇ　ㄕˊ　ㄌ｜ㄠˇ　ㄌ｜ㄠˇ",
"han":"xiǎo shí liǎo liǎo",
"def":"人在幼年時聰慧敏捷。語出南朝宋．劉義慶《世說新語．言語》。△「小時了了，大未必佳」"},{"key":"空谷足音",
"zu":"ㄎㄨㄥ　ㄍㄨˇ　ㄗㄨˊ　｜ㄣ",
"han":"kōng gǔ zú yīn",
"def":"居於荒野，久處寂寞，聽到人的腳步聲就高興。語本《莊子．徐无鬼》。後用「空谷足音」比喻難得的人物、言論或事物。"},{"key":"金玉其外，敗絮其中",
"zu":"ㄐ｜ㄣ　ㄩˋ　ㄑ｜ˊ　ㄨㄞˋ　ㄅㄞˋ　ㄒㄩˋ　ㄑ｜ˊ　ㄓㄨㄥ",
"han":"jīn yù qí wài bài xù qí zhōng",
"def":"外表像金玉般華美，內裡卻盡是破棉絮。形容外表美好而內質破敗。語出明．劉基〈賣柑者言〉。△「華而不實」、「虛有其表」"},{"key":"一言難盡",
"zu":"｜　｜ㄢˊ　ㄋㄢˊ　ㄐ｜ㄣˋ",
"han":"yī yán nán jìn",
"def":"事情非常複雜，無法用簡單的話把它說得清楚。※語或出《京本通俗小說．志誠張主管》。"},{"key":"一笑置之",
"zu":"｜　ㄒ｜ㄠˋ　ㄓˋ　ㄓ",
"han":"yī xiào zhì zhī",
"def":"指笑一笑就把它擱放在一旁。形容不當成一回事。＃語出《石門文字禪．卷二六．題所錄詩》。"},{"key":"物極必反",
"zu":"ㄨˋ　ㄐ｜ˊ　ㄅ｜ˋ　ㄈㄢˇ",
"han":"wù jí bì fǎn",
"def":"事物發展到極點，必然會轉向發展。◎語本《文子．九守》。"},{"key":"推陳出新",
"zu":"ㄊㄨㄟ　ㄔㄣˊ　ㄔㄨ　ㄒ｜ㄣ",
"han":"tuī chén chū xīn",
"def":"「推陳出新」之「出」，典源作「致」。推，排除、去除。致，招致、引來。「推陳出新」本指促進體內的新陳代謝。語本宋．費袞《梁谿漫志．卷九．張文潛粥記》。後用「推陳出新」比喻排除老舊的，創造出嶄新的事物或方法。"},{"key":"深謀遠慮",
"zu":"ㄕㄣ　ㄇㄡˊ　ㄩㄢˇ　ㄌㄩˋ",
"han":"shēn móu yuǎn lǜ",
"def":"計畫周密而慮事深遠。◎語出漢．賈誼〈過秦論上〉。△「深思熟慮」"},{"key":"一語道破",
"zu":"｜　ㄩˇ　ㄉㄠˋ　ㄆㄛˋ",
"han":"yī yǔ dào pò",
"def":"一句話就把事理的真相說穿。※語或本元．李道純〈滿庭芳．寂寞山居〉詞。△「一針見血」"},{"key":"魂不附體",
"zu":"ㄏㄨㄣˊ　ㄅㄨˋ　ㄈㄨˋ　ㄊ｜ˇ",
"han":"hún bù fù tǐ",
"def":"魂魄脫離肉體。語本《南史．卷三二．徐嗣伯列傳》。後用「魂不附體」形容驚嚇過度而心不能自主。△「魂飛魄散」"},{"key":"層出不窮",
"zu":"ㄘㄥˊ　ㄔㄨ　ㄅㄨˋ　ㄑㄩㄥˊ",
"han":"céng chū bù qióng",
"def":"形容接連出現，沒有止盡。※語或本宋．葉適《水心別集．卷四．進卷．兵權上》。△「層見疊出」"},{"key":"物換星移",
"zu":"ㄨˋ　ㄏㄨㄢˋ　ㄒ｜ㄥ　｜ˊ",
"han":"wù huàn xīng yí",
"def":"事物改變，星辰移動。比喻景物的變遷，世事的更替。語出唐．王勃〈滕王閣〉詩。"},{"key":"執迷不悟",
"zu":"ㄓˊ　ㄇ｜ˊ　ㄅㄨˋ　ㄨˋ",
"han":"zhí mí bù wù",
"def":"堅持錯誤的觀念而不醒悟。※＃語或本晉．釋道恆〈釋駁論〉。△「迷而不悟」、「冥頑不靈」"},{"key":"一葉知秋",
"zu":"｜　｜ㄝˋ　ㄓ　ㄑ｜ㄡ",
"han":"yī yè zhī qiū",
"def":"看見一片葉子落下，就知道秋天的來臨。比喻由細微的徵兆，可推知事物的演變和趨勢。語本《淮南子．說山》。"},{"key":"一擲千金",
"zu":"｜　ㄓˊ　ㄑ｜ㄢ　ㄐ｜ㄣ",
"han":"yī zhí qiān jīn",
"def":"形容不惜金錢的豪舉。語出唐．吳象之〈少年行〉。△「一擲百萬」、「揮金如土」"},{"key":"入不敷出",
"zu":"ㄖㄨˋ　ㄅㄨˋ　ㄈㄨ　ㄔㄨ",
"han":"rù bù fū chū",
"def":"敷，足夠。收入不夠支出。※語或出清．朱彝尊《竹垞詩話．卷下．臣士下．倪嘉慶》。△「寅吃卯糧」"},{"key":"動輒得咎",
"zu":"ㄉㄨㄥˋ　ㄓㄜˊ　ㄉㄜˊ　ㄐ｜ㄡˋ",
"han":"dòng zhé dé jiù",
"def":"輒，總是。咎，罪過。「動輒得咎」指一有舉動就會遭受責罰。形容人處境困難，極易受到責難。語出唐．韓愈〈進學解〉。"},{"key":"海枯石爛",
"zu":"ㄏㄞˇ　ㄎㄨ　ㄕˊ　ㄌㄢˋ",
"han":"hǎi kū shí làn",
"def":"「海枯」，海水枯乾。語出唐．杜荀鶴〈感寓〉詩。「石爛」，石頭粉碎。語出唐．杜牧〈題桐葉〉詩。「海枯石爛」一語因海枯石爛萬年難見，所以比喻歷時久遠。又依常理，海不會枯，石不會爛，所以比喻意志堅定，永不改變。"},{"key":"十全十美",
"zu":"ㄕˊ　ㄑㄩㄢˊ　ㄕˊ　ㄇㄟˇ",
"han":"shí quán shí měi",
"def":"十全，指治療十個人，十個人都能痊癒。※語或本《周禮．天官冢宰下．醫師》。後用「十全十美」比喻圓滿美好毫無缺陷的境界。△「盡善盡美」"},{"key":"人山人海",
"zu":"ㄖㄣˊ　ㄕㄢ　ㄖㄣˊ　ㄏㄞˇ",
"han":"rén shān rén hǎi",
"def":"人群如山海般眾多，無法估計，形容人聚集得非常多。※語或出宋．西湖老人《西湖老人繁勝錄．諸行市》。△「萬人空巷」"},{"key":"不假思索",
"zu":"ㄅㄨˋ　ㄐ｜ㄚˇ　ㄙ　ㄙㄨㄛˇ",
"han":"bù jiǎ sī suǒ",
"def":"假，借。「不假思索」指不經過思考探求，立即做出反應。語出宋．黃榦〈復黃會卿書〉。"},{"key":"不動聲色",
"zu":"ㄅㄨˋ　ㄉㄨㄥˋ　ㄕㄥ　ㄙㄜˋ",
"han":"bù dòng shēng sè",
"def":"一聲不響，不流露感情。語本唐．韓愈〈司徒兼侍中中書令許國公贈太尉韓公神道碑銘〉。後用「不動聲色」形容人遇事不張揚的冷靜態度。"},{"key":"神機妙算",
"zu":"ㄕㄣˊ　ㄐ｜　ㄇ｜ㄠˋ　ㄙㄨㄢˋ",
"han":"shén jī miào suàn",
"def":"機，機謀。算，算計。「神機妙算」指神奇的謀略，巧妙的算計。形容計策高明、預料準確。語本唐．劉知幾〈儀坤廟樂章〉詩。△「錦囊妙計」"},{"key":"輕諾寡信",
"zu":"ㄑ｜ㄥ　ㄋㄨㄛˋ　ㄍㄨㄚˇ　ㄒ｜ㄣˋ",
"han":"qīng nuò guǎ xìn",
"def":"輕易答應別人的請求，卻很少實踐諾言。語本《老子．第六三章》。"},{"key":"冠冕堂皇",
"zu":"ㄍㄨㄢ　ㄇ｜ㄢˇ　ㄊㄤˊ　ㄏㄨㄤˊ",
"han":"guān miǎn táng huáng",
"def":"冠，帽子。冕，古代官員的禮帽。「冠冕」，引申為首、體面之意。語出《三國志．卷三七．蜀書．龐統法正傳．龐統》。「堂皇」，古代官員辦事的大堂，引申為氣勢宏偉的樣子。語出《漢書．卷六七．楊胡朱梅云傳．胡建》。「冠冕堂皇」形容莊嚴體面、氣派高貴的樣子。亦用於形容表面上光明正大的樣子。△「南州冠冕」"},{"key":"大同小異",
"zu":"ㄉㄚˋ　ㄊㄨㄥˊ　ㄒ｜ㄠˇ　｜ˋ",
"han":"dà tóng xiǎo yì",
"def":"形容事物略有差異，但大體相同。語本《莊子．天下》。△「學富五車」"},{"key":"大言不慚",
"zu":"ㄉㄚˋ　｜ㄢˊ　ㄅㄨˋ　ㄘㄢˊ",
"han":"dà yán bù cán",
"def":"說大話而不感到難為情。語出宋．朱熹《四書章句集注．論語集注．憲問》。"},{"key":"無微不至",
"zu":"ㄨˊ　ㄨㄟˊ　ㄅㄨˋ　ㄓˋ",
"han":"wú wéi bù zhì",
"def":"沒有細節不照顧到的，形容做事非常細心周到。靡，無。語本宋．魏了翁〈辭免督視軍馬乞以參贊軍事從丞相行奏劄〉。△「無所不至」"},{"key":"大謬不然",
"zu":"ㄉㄚˋ　ㄇ｜ㄡˋ　ㄅㄨˋ　ㄖㄢˊ",
"han":"dà miù bù rán",
"def":"謬，錯誤。「大謬不然」指大錯特錯，與事實完全不符。語出漢．司馬遷〈報任少卿書〉。△「奮不顧身」、「戴盆望天」"},{"key":"生花妙筆",
"zu":"ㄕㄥ　ㄏㄨㄚ　ㄇ｜ㄠˋ　ㄅ｜ˇ",
"han":"shēng huā miào bǐ",
"def":"筆頭上生出花來。比喻文筆美妙，寫作能力極佳。＃典出唐．馮贄《雲仙雜記．卷一○．筆頭生花》。△「夢筆生花」"},{"key":"趨炎附勢",
"zu":"ㄑㄩ　｜ㄢˊ　ㄈㄨˋ　ㄕˋ",
"han":"qū yán fù shì",
"def":"「趨炎附勢」之「趨」，典源作「趣」。「趣」通「趨」，此指依附。炎，指有權勢的人。「趨炎附勢」指奉承依附有權勢的人。語本晉．王沈〈釋時論〉。△「攀龍附鳳」"},{"key":"翻雲覆雨",
"zu":"ㄈㄢ　ㄩㄣˊ　ㄈㄨˋ　ㄩˇ",
"han":"fān yún fù yǔ",
"def":"翻過手來是雲，覆過手去是雨。形容人世反覆無常。語本唐．杜甫〈貧交行〉。後亦用「翻雲覆雨」形容人玩弄手段或比喻男女間床笫之事。"},{"key":"擢髮難數",
"zu":"ㄓㄨㄛˊ　ㄈㄚˇ　ㄋㄢˊ　ㄕㄨˇ",
"han":"zhuó fǎ nán shǔ",
"def":"擢，拔取。「擢髮難數」指把頭髮拔盡，也無法用以計數所犯的罪行。形容罪狀極多，難以計數。語本《史記．卷七九．范雎蔡澤列傳．范雎》。"},{"key":"不合時宜",
"zu":"ㄅㄨˋ　ㄏㄜˊ　ㄕˊ　｜ˊ",
"han":"bù hé shí yí",
"def":"不符合時勢趨尚。語出《漢書．卷一一．哀帝紀》。"},{"key":"不遺餘力",
"zu":"ㄅㄨˋ　｜ˊ　ㄩˊ　ㄌ｜ˋ",
"han":"bù yí yú lì",
"def":"不保留一點力氣。形容竭盡全力，毫無保留。語出《戰國策．趙策三》。△「盡心竭力」"},{"key":"不得要領",
"zu":"ㄅㄨˋ　ㄉㄜˊ　｜ㄠˋ　ㄌ｜ㄥˇ",
"han":"bù dé yào lǐng",
"def":"要，通「腰」。領，衣領。「要領」指衣服的腰部和領子，比喻事物的重點。「不得要領」指無法掌握要點或主旨。語本《史記．卷一二三．大宛列傳》。"},{"key":"一錢不值",
"zu":"｜　ㄑ｜ㄢˊ　ㄅㄨˋ　ㄓˊ",
"han":"yī qián bù zhí",
"def":"一文錢也不值，比喻毫無價值。語本《史記．卷一○七．魏其武安侯列傳》。△「灌夫罵坐」"},{"key":"藕斷絲連",
"zu":"ㄡˇ　ㄉㄨㄢˋ　ㄙ　ㄌ｜ㄢˊ",
"han":"ǒu duàn sī lián",
"def":"蓮藕斷了，藕絲仍相連。比喻沒有完全斷絕關係。語本唐．孟郊〈去婦〉詩。"},{"key":"心驚肉跳",
"zu":"ㄒ｜ㄣ　ㄐ｜ㄥ　ㄖㄡˋ　ㄊ｜ㄠˋ",
"han":"xīn jīng ròu tiào",
"def":"形容恐懼不安，心神不寧。※語或本元．無名氏《爭報恩．第三折》。"},{"key":"天真爛漫",
"zu":"ㄊ｜ㄢ　ㄓㄣ　ㄌㄢˋ　ㄇㄢˋ",
"han":"tiān zhēn làn màn",
"def":"「天真爛漫」之「爛漫」，典源作「爛熳」。「爛熳」同「爛漫」。「天真爛漫」形容性情率真，毫不假飾。＃語本宋．龔開〈高馬小兒圖〉詩。"},{"key":"囊空如洗",
"zu":"ㄋㄤˊ　ㄎㄨㄥ　ㄖㄨˊ　ㄒ｜ˇ",
"han":"náng kōng rú xǐ",
"def":"囊，口袋。口袋裡空空的，像洗過一樣。形容窮到極點身上連一個錢也沒有。※語或出《警世通言．卷三二．杜十娘怒沈百寶箱》。△「兩袖清風」"},{"key":"螳螂捕蟬",
"zu":"ㄊㄤˊ　ㄌㄤˊ　ㄅㄨˇ　ㄔㄢˊ",
"han":"táng láng bǔ chán",
"def":"螳螂只顧著捕蟬，不知有大鳥在身後正要啄食牠。＃典出《莊子．山木》。後用「螳螂捕蟬」比喻眼光短淺，只貪圖眼前的利益而忽略背後隱藏的危險。"},{"key":"心平氣和",
"zu":"ㄒ｜ㄣ　ㄆ｜ㄥˊ　ㄑ｜ˋ　ㄏㄜˊ",
"han":"xīn píng qì hé",
"def":"心氣平和，不急不怒。語本《左傳．昭公二十年》。△「平心靜氣」"},{"key":"予取予求",
"zu":"ㄩˊ　ㄑㄩˇ　ㄩˊ　ㄑ｜ㄡˊ",
"han":"yú qǔ yú qiú",
"def":"從我這裡求索取用。語出《左傳．僖公七年》。後用「予取予求」比喻任意取求，需索無度。"},{"key":"高瞻遠矚",
"zu":"ㄍㄠ　ㄓㄢ　ㄩㄢˇ　ㄓㄨˇ",
"han":"gāo zhān yuǎn zhǔ",
"def":"「高瞻」，由高處觀看，形容識見廣闊。語出漢．王充《論衡．別通》。「遠矚」，注視遠處，形容眼光寬遠。語出北魏．張淵〈觀象賦〉。後用「高瞻遠矚」形容見識遠大。或形容往遠處眺望，看得更全面。"},{"key":"三顧茅廬",
"zu":"ㄙㄢ　ㄍㄨˋ　ㄇㄠˊ　ㄌㄨˊ",
"han":"sān gù máo lú",
"def":"指漢末劉備往訪諸葛亮，凡三次，才得見。◎語本三國蜀．諸葛亮〈前出師表〉。後用「三顧茅廬」比喻對賢才真心誠意的邀請、拜訪。△「初出茅廬」"},{"key":"龍飛鳳舞",
"zu":"ㄌㄨㄥˊ　ㄈㄟ　ㄈㄥˋ　ㄨˇ",
"han":"lóng fēi fèng wǔ",
"def":"一) 形容書法筆勢飄逸多姿。語本南朝梁．武帝〈草書狀〉。後亦用「龍飛鳳舞」形容字跡潦草零亂。(二) 形容山勢蜿蜒起伏，氣勢磅礴。語本宋．岳珂《桯史．卷二．行都南北內》。"},{"key":"心直口快",
"zu":"ㄒ｜ㄣ　ㄓˊ　ㄎㄡˇ　ㄎㄨㄞˋ",
"han":"xīn zhí kǒu kuài",
"def":"性情直率，說話不隱諱。語出宋．文天祥〈紀事詩序〉。△「快人快語」"},{"key":"心血來潮",
"zu":"ㄒ｜ㄣ　ㄒ｜ㄝˇ　ㄌㄞˊ　ㄔㄠˊ",
"han":"xīn xiě lái cháo",
"def":"思緒像浪潮般的突起。指神仙對人事的感應與預知。※語或出《封神演義．第三四回》。後用「心血來潮 」形容突然興起的念頭。△「靈機一動」"},{"key":"盤根錯節",
"zu":"ㄆㄢˊ　ㄍㄣ　ㄘㄨㄛˋ　ㄐ｜ㄝˊ",
"han":"pán gēn cuò jié",
"def":"樹木的根株盤曲、節目交錯。比喻事情複雜，不易分解。＃語出晉．袁宏《後漢紀．卷一六》。"},{"key":"權宜之計",
"zu":"ㄑㄩㄢˊ　｜ˊ　ㄓ　ㄐ｜ˋ",
"han":"quán yí zhī jì",
"def":"權宜，暫時變通的處置。「權宜之計」指因應某種時機而暫用的計謀。語出《後漢書．卷六六．陳王列傳．王允》。"},{"key":"耀武揚威",
"zu":"｜ㄠˋ　ㄨˇ　｜ㄤˊ　ㄨㄟ",
"han":"yào wǔ yáng wēi",
"def":"指炫耀武力，誇示威風。語本漢．士孫瑞〈劍銘〉。後用「耀武揚威」形容人得意張揚的樣子。△「飛揚跋扈」、「揚旗曜武」"},{"key":"平心靜氣",
"zu":"ㄆ｜ㄥˊ　ㄒ｜ㄣ　ㄐ｜ㄥˋ　ㄑ｜ˋ",
"han":"píng xīn jìng qì",
"def":"形容心情平和，態度冷靜。語本《韓詩外傳．卷二》。△「心平氣和」"},{"key":"以身作則",
"zu":"｜ˇ　ㄕㄣ　ㄗㄨㄛˋ　ㄗㄜˊ",
"han":"yǐ shēn zuò zé",
"def":"以自身行為作為他人的榜樣。語本《後漢書．卷四一．第五鍾離宋寒列傳．第五倫》。"},{"key":"史無前例",
"zu":"ㄕˇ　ㄨˊ　ㄑ｜ㄢˊ　ㄌ｜ˋ",
"han":"shǐ wú qián lì",
"def":"指以往從未發生過。語本《南齊書．卷四六．陸慧曉列傳》。"},{"key":"殫精竭慮",
"zu":"ㄉㄢ　ㄐ｜ㄥ　ㄐ｜ㄝˊ　ㄌㄩˋ",
"han":"dān jīng jié lǜ",
"def":"殫，竭盡。「殫精竭慮」指竭盡精力與思慮。＃語本唐．白居易〈策林一．策頭〉。"},{"key":"隨遇而安",
"zu":"ㄙㄨㄟˊ　ㄩˋ　ㄦˊ　ㄢ",
"han":"suí yù ér ān",
"def":"指能安於所處的環境。語本《石門文字禪．卷二二．舫齋記》。後亦用「隨遇而安」比喻安於現狀，不思長進。△「安之若素」"},{"key":"衣冠楚楚",
"zu":"｜　ㄍㄨㄢ　ㄔㄨˇ　ㄔㄨˇ",
"han":"yī guān chǔ chǔ",
"def":"「衣冠楚楚」之「冠」，典源作「裳」，裳和冠均為服裝重要的部分。穿衣佩裳或穿衣戴冠都有服裝整齊之意。楚楚，鮮明出眾的樣子。「衣裳楚楚」或「衣冠楚楚」，都是指服裝整齊而鮮明出眾。語本《詩經．曹風．蜉蝣》。後用「衣冠楚楚」形容男子服裝整齊而鮮明出眾。"},{"key":"光風霽月",
"zu":"ㄍㄨㄤ　ㄈㄥ　ㄐ｜ˋ　ㄩㄝˋ",
"han":"guāng fēng jì yuè",
"def":"霽月，指雨後的明月。「光風霽月」形容雨過天青後的明淨景象。＃語本唐．無名氏〈楚泊亭〉詩二首之一。後亦用「光風霽月」比喻政治清明，時世太平的局面。或用於形容人品光明磊落。"},{"key":"少不更事",
"zu":"ㄕㄠˋ　ㄅㄨˋ　ㄍㄥ　ㄕˋ",
"han":"shào bù gēng shì",
"def":"更事，經歷世事。「少不更事」指年紀輕，經歷世事少，欠缺經驗。語本《晉書．卷六九．周顗列傳》。"},{"key":"回頭是岸",
"zu":"ㄏㄨㄟˊ　ㄊㄡˊ　ㄕˋ　ㄢˋ",
"han":"huí tóu shì àn",
"def":"有所覺悟而決心改正。※語或出《朱子語類．卷五九．孟子．告子上》。後用「回頭是岸」比喻悔過自新或促人向善。△「苦海無邊」、「苦海無邊，回頭是岸」"},{"key":"神通廣大",
"zu":"ㄕㄣˊ　ㄊㄨㄥ　ㄍㄨㄤˇ　ㄉㄚˋ",
"han":"shén tōng guǎng dà",
"def":"神通，原為佛教用語，指能清楚明白直接看見，知道一切遠時、遠地各種情況的一種神祕智力。「神通廣大」則指廣大之神力。※語或本《敦煌變文集新書．卷二．維摩詰經講經文》。後用「神通廣大」形容人的本領、手段高明巧妙。△「三頭六臂」"},{"key":"孤苦伶仃",
"zu":"ㄍㄨ　ㄎㄨˇ　ㄌ｜ㄥˊ　ㄉ｜ㄥ",
"han":"gū kǔ líng dīng",
"def":"「孤苦伶仃」之「伶仃 」，典源作「零丁 」。「零丁 」同「伶仃 」。形容孤單貧苦，無依無助。語本晉．李密〈陳情表〉。△「孑然一身」、「形單影隻」"},{"key":"回心轉意",
"zu":"ㄏㄨㄟˊ　ㄒ｜ㄣ　ㄓㄨㄢˇ　｜ˋ",
"han":"huí xīn zhuǎn yì",
"def":"「回心轉意」之「回」、「轉」，都是扭轉的意思。「回心轉意」指改變心意。語出《朱子語類．卷一一七．朱子．訓門人五》。"},{"key":"獨當一面",
"zu":"ㄉㄨˊ　ㄉㄤ　｜　ㄇ｜ㄢˋ",
"han":"dú dāng yī miàn",
"def":"獨力擔當某一方面的重任。語本《史記．卷五五．留侯世家》。"},{"key":"興師問罪",
"zu":"ㄒ｜ㄥ　ㄕ　ㄨㄣˋ　ㄗㄨㄟˋ",
"han":"xīng shī wèn zuì",
"def":"出兵討伐有罪者。※語或出唐．樊綽《蠻書．卷四．名類》。後亦用「興師問罪」指前去宣布他人罪狀，並嚴加譴責。"},{"key":"名不副實",
"zu":"ㄇ｜ㄥˊ　ㄅㄨˋ　ㄈㄨˋ　ㄕˊ",
"han":"míng bù fù shí",
"def":"空有虛名，不合實際。＃語本《漢書．卷九九．王莽傳上》。△「有名無實」"},{"key":"目不交睫",
"zu":"ㄇㄨˋ　ㄅㄨˋ　ㄐ｜ㄠ　ㄐ｜ㄝˊ",
"han":"mù bù jiāo jié",
"def":"睫，眼皮上下的細毛。「目不交睫」指眼皮不合攏，即完全不睡覺。比喻人忙碌或心情不安而不能入眠。＃語本《史記．卷一○一．袁盎鼂錯列傳．袁盎》。"},{"key":"寥若晨星",
"zu":"ㄌ｜ㄠˊ　ㄖㄨㄛˋ　ㄔㄣˊ　ㄒ｜ㄥ",
"han":"liáo ruò chén xīng",
"def":"清晨廣大遼闊的天空，星星十分稀疏。形容數量稀少。＃語本晉．張華〈情詩〉五首之二。△「屈指可數」、「寥寥無幾」"},{"key":"針鋒相對",
"zu":"ㄓㄣ　ㄈㄥ　ㄒ｜ㄤ　ㄉㄨㄟˋ",
"han":"zhēn fēng xiāng duì",
"def":"「針鋒相對」，典源作「針鋒相投」，原指雙方言語投合，如針與鋒同為尖銳而相對應。語本《景德傳燈錄．卷二五．天臺山德韶國師》。後來轉換成「針鋒相對」，比喻相互對立，不相上下。△「短兵相接」"},{"key":"吉人天相",
"zu":"ㄐ｜ˊ　ㄖㄣˊ　ㄊ｜ㄢ　ㄒ｜ㄤˋ",
"han":"jí rén tiān xiàng",
"def":"「吉人」，吉善的人。語出《左傳．宣公三年》。「天相」，上天給予幫助。語本《左傳．昭公四年》。後世用「吉人天相」形容吉善的人自有上天的幫助。"},{"key":"安貧樂道",
"zu":"ㄢ　ㄆ｜ㄣˊ　ㄌㄜˋ　ㄉㄠˋ",
"han":"ān pín lè dào",
"def":"能安於貧困的處境，並仍以信守道義為樂。語出《文子．上仁》。"},{"key":"安居樂業",
"zu":"ㄢ　ㄐㄩ　ㄌㄜˋ　｜ㄝˋ",
"han":"ān jū lè yè",
"def":"生活安定和樂，而且喜好自己的職業。語本《漢書．卷九一．貨殖傳．序》。"},{"key":"不識抬舉",
"zu":"ㄅㄨˋ　ㄕˋ　ㄊㄞˊ　ㄐㄩˇ",
"han":"bù shì tái jǔ",
"def":"指責人不接受或不自知別人的禮遇優待。※語或出《西遊記．第六四回》。"},{"key":"餘音繞梁",
"zu":"ㄩˊ　｜ㄣ　ㄖㄠˋ　ㄌ｜ㄤˊ",
"han":"yú yīn rào liáng",
"def":"餘留的歌聲環繞屋梁，迴旋不去。語本《列子．湯問》。後用「餘音繞梁」形容歌聲或音樂美妙感人，餘味不絕；或用來形容話語之意味深長。△「響遏行雲」"},{"key":"輕描淡寫",
"zu":"ㄑ｜ㄥ　ㄇ｜ㄠˊ　ㄉㄢˋ　ㄒ｜ㄝˇ",
"han":"qīng miáo dàn xiě",
"def":"指戲劇中著力不多的描繪或敘述。※語或本明．祁彪佳《遠山堂曲品．能品．弄珠樓》。後用「輕描淡寫」形容言論或寫作時，避開關鍵，將重點輕輕帶過。"},{"key":"彈丸之地",
"zu":"ㄉㄢˋ　ㄨㄢˊ　ㄓ　ㄉ｜ˋ",
"han":"dàn wán zhī dì",
"def":"像彈丸一樣大小的地方。比喻狹小的地方。語出《戰國策．趙策三》。"},{"key":"自欺欺人",
"zu":"ㄗˋ　ㄑ｜　ㄑ｜　ㄖㄣˊ",
"han":"zì qī qī rén",
"def":"不但欺騙自己，也欺騙他人。＃語出《石門文字禪．卷二五．題古塔主兩種自己》。△「掩耳盜鈴」"},{"key":"有始無終",
"zu":"｜ㄡˇ　ㄕˇ　ㄨˊ　ㄓㄨㄥ",
"han":"yǒu shǐ wú zhōng",
"def":"有開頭而無收尾。比喻做事半途而廢，不能貫徹到底。語本《詩經．大雅．蕩》。△「虎頭蛇尾」"},{"key":"爾虞我詐",
"zu":"ㄦˇ　ㄩˊ　ㄨㄛˇ　ㄓㄚˋ",
"han":"ěr yú wǒ zhà",
"def":"彼此互相詐騙。語本《左傳．宣公十五年》。後用「爾虞我詐」形容人與人之間的互相猜疑，玩弄欺騙手段。△「易子而食」、「析骸以爨」、「鉤心鬥角」"},{"key":"刎頸之交",
"zu":"ㄨㄣˇ　ㄐ｜ㄥˇ　ㄓ　ㄐ｜ㄠ",
"han":"wěn jǐng zhī jiāo",
"def":"刎頸，用刀割脖子。「刎頸之交」指彼此可為對方割頸以明心意。比喻可同生共死的至交好友。語出《史記．卷八一．廉頗藺相如列傳》。△「負荊請罪」"},{"key":"義正辭嚴",
"zu":"｜ˋ　ㄓㄥˋ　ㄘˊ　｜ㄢˊ",
"han":"yì zhèng cí yán",
"def":"義理正當，措詞嚴厲。語本宋．歐陽修〈讀張李二生文贈石先生〉詩。△「理直氣壯」、「義正辭約」、「辭順理正」"},{"key":"改頭換面",
"zu":"ㄍㄞˇ　ㄊㄡˊ　ㄏㄨㄢˋ　ㄇ｜ㄢˋ",
"han":"gǎi tóu huàn miàn",
"def":"指眾生在六道輪迴中不斷地改變形相而神識依舊不變。語出唐．寒山〈詩〉其二一二。後用「改頭換面」比喻形式雖改變，而實質未變。亦用於比喻一個人澈底改變，有重新做人之意。△「改頭換尾」"},{"key":"意氣用事",
"zu":"｜ˋ　ㄑ｜ˋ　ㄩㄥˋ　ㄕˋ",
"han":"yì qì yòng shì",
"def":"處理事務但憑情緒，缺乏理智。※語或出明．唐順之〈寄黃士尚書〉。"},{"key":"路不拾遺",
"zu":"ㄌㄨˋ　ㄅㄨˋ　ㄕˊ　｜ˊ",
"han":"lù bù shí yí",
"def":"「路不拾遺」之「路」，典源作「道」。在路上看見別人的失物，不會據為己有。形容社會風氣良好。＃語本《戰國策．秦策一》。"},{"key":"群龍無首",
"zu":"ㄑㄩㄣˊ　ㄌㄨㄥˊ　ㄨˊ　ㄕㄡˇ",
"han":"qún lóng wú shǒu",
"def":"「群龍無首」之「無」，典源作「无」。「无」同「無」。群龍出現，卻無領袖。語本《易經．乾卦》。後用「群龍無首」比喻一群人中缺乏領導者。"},{"key":"妙手空空",
"zu":"ㄇ｜ㄠˋ　ㄕㄡˇ　ㄎㄨㄥ　ㄎㄨㄥ",
"han":"miào shǒu kōng kōng",
"def":"指唐代傳奇小說中的劍俠。語出唐．裴鉶《傳奇》。後用「妙手空空」稱呼小偷、扒手。亦用來表示兩手空空，一無所有；或指稱缺乏資財而善於挪移應付的人。"},{"key":"求全責備",
"zu":"ㄑ｜ㄡˊ　ㄑㄩㄢˊ　ㄗㄜˊ　ㄅㄟˋ",
"han":"qiú quán zé bèi",
"def":"「求全」，要求完美。語出《孟子．離婁上》。「責備」，苛求完備。語本《管子．形勢解》。「求全責備」指對人或事要求完美無缺。△「吹毛求疵」"},{"key":"改邪歸正",
"zu":"ㄍㄞˇ　ㄒ｜ㄝˊ　ㄍㄨㄟ　ㄓㄥˋ",
"han":"gǎi xié guī zhèng",
"def":"「改」、「歸」，典源分別作「背」、「向」。指改正錯誤的行為，返回正途。語本漢．應劭《漢官》。△「棄暗投明」"},{"key":"滔滔不絕",
"zu":"ㄊㄠ　ㄊㄠ　ㄅㄨˋ　ㄐㄩㄝˊ",
"han":"tāo tāo bù jué",
"def":"「絕」，典源作「竭」。水勢盛大，連續不斷。＃語本《樂府詩集．卷一二．郊廟歌辭一二．漢宗廟樂舞辭．積善舞》。後用「滔滔不絕」形容說話連續不斷。"},{"key":"逐臭之夫",
"zu":"ㄓㄨˊ　ㄔㄡˋ　ㄓ　ㄈㄨ",
"han":"zhú chòu zhī fū",
"def":"追逐臭味的人。典出《呂氏春秋．孝行覽．遇合》。後用「逐臭之夫」比喻有怪癖的人。"},{"key":"道聽塗說",
"zu":"ㄉㄠˋ　ㄊ｜ㄥ　ㄊㄨˊ　ㄕㄨㄛ",
"han":"dào tīng tú shuō",
"def":"在路上聽到一些沒有根據的話，不加求證就又在路途中說給其他的人聽。泛指沒有經過證實、缺乏根據的話。語出《論語．陽貨》。△「以訛傳訛」"},{"key":"楚楚可憐",
"zu":"ㄔㄨˇ　ㄔㄨˇ　ㄎㄜˇ　ㄌ｜ㄢˊ",
"han":"chǔ chǔ kě lián",
"def":"形容樹木枝葉纖弱柔美的樣子。語出南朝宋．劉義慶《世說新語．言語》。後用「楚楚可憐」形容姿態纖弱嬌媚，惹人憐愛，亦用於形容神情淒楚或處境不佳，令人憐憫。"},{"key":"無濟於事",
"zu":"ㄨˊ　ㄐ｜ˋ　ㄩˊ　ㄕˋ",
"han":"wú jì yú shì",
"def":"「無濟於事」之「濟」，典源作「補」。濟，助益。「無濟於事」指對事情毫無幫助。※語或本宋．劉摯〈論分析助役〉。△「杯水車薪」"},{"key":"忠心耿耿",
"zu":"ㄓㄨㄥ　ㄒ｜ㄣ　ㄍㄥˇ　ㄍㄥˇ",
"han":"zhōng xīn gěng gěng",
"def":"形容極為忠誠。※語或本漢．劉向《九歎．惜賢》。"},{"key":"陽春白雪",
"zu":"｜ㄤˊ　ㄔㄨㄣ　ㄅㄞˊ　ㄒㄩㄝˇ",
"han":"yáng chūn bái xuě",
"def":"「陽春白雪」是較為深奧難懂的音樂。相對於通俗音樂而言。語出戰國楚．宋玉〈對楚王問〉。後亦用「陽春白雪」比喻精深高雅的文學藝術作品。△「下里巴人」、「曲高和寡」"},{"key":"絡繹不絕",
"zu":"ㄌㄨㄛˋ　｜ˋ　ㄅㄨˋ　ㄐㄩㄝˊ",
"han":"luò yì bù jué",
"def":"「絡繹不絕」之「絡繹」，典源作「駱驛」、「絡驛」。絡繹，往來不絕、相連不斷。「絡繹不絕」形容連續不斷的樣子。◎語本《後漢書．卷三一．郭杜孔張廉王蘇羊賈陸列傳．郭伋》。△「川流不息」"},{"key":"顧此失彼",
"zu":"ㄍㄨˋ　ㄘˇ　ㄕ　ㄅ｜ˇ",
"han":"gù cǐ shī bǐ",
"def":"注意這個，卻忽略了那個。謂作戰時不能全面防守。語本《隋書．卷五七．薛道衡列傳》。後多用「顧此失彼」指做事時不能全面兼顧。△「捉襟見肘」"},{"key":"言聽計從",
"zu":"｜ㄢˊ　ㄊ｜ㄥ　ㄐ｜ˋ　ㄘㄨㄥˊ",
"han":"yán tīng jì cóng",
"def":"指聽從某人說的話、出的計謀。形容某人深受信任。＃語本《史記．卷九二．淮陰侯列傳》。△「百依百順」、「解衣推食」"},{"key":"合浦珠還",
"zu":"ㄏㄜˊ　ㄆㄨˇ　ㄓㄨ　ㄏㄨㄢˊ",
"han":"hé pǔ zhū huán",
"def":"合浦郡沿海的珠蚌，離去後又回來。＃典出三國吳．謝承《後漢書》。後用「合浦珠還」比喻物品失而復得，亦用於比喻人離開而復返。"},{"key":"困獸猶鬥",
"zu":"ㄎㄨㄣˋ　ㄕㄡˋ　｜ㄡˊ　ㄉㄡˋ",
"han":"kùn shòu yóu dòu",
"def":"被圍困的野獸尚且作最後的搏鬥。比喻處於絕境，仍然奮力抵抗。◎語出《左傳．宣公十二年》。△「負嵎頑抗」"},{"key":"信手拈來",
"zu":"ㄒ｜ㄣˋ　ㄕㄡˇ　ㄋ｜ㄢˊ　ㄌㄞˊ",
"han":"xìn shǒu nián lái",
"def":"拈，即「拈提」，禪師舉古例來說法開示。「信手拈來」指隨手引用材料，自如而不費力。◎語出《五燈會元．卷一四．大洪報恩禪師》。後亦用「信手拈來」比喻做事時，隨手而為，毫不費力。"},{"key":"順手牽羊",
"zu":"ㄕㄨㄣˋ　ㄕㄡˇ　ㄑ｜ㄢ　｜ㄤˊ",
"han":"shùn shǒu qiān yáng",
"def":"以右手牽馬、羊，方便進獻。比喻方便行事，毫不費力。語本《禮記．曲禮上》。後用「順手牽羊」比喻乘機順便取走他人財物。"},{"key":"無獨有偶",
"zu":"ㄨˊ　ㄉㄨˊ　｜ㄡˇ　ㄡˇ",
"han":"wú dú yǒu ǒu",
"def":"指某種少見的人、事、物，偏有類同者出現恰巧湊成一對的情況。或指兩項事物恰巧相同或類似。※語或本《二程集．河南程氏遺書．卷一一．師訓》。"},{"key":"盛氣凌人",
"zu":"ㄕㄥˋ　ㄑ｜ˋ　ㄌ｜ㄥˊ　ㄖㄣˊ",
"han":"shèng qì líng rén",
"def":"凌，欺侮。「盛氣凌人」指用傲慢的氣勢壓迫別人。語本宋．樓鑰《攻媿集．卷八八敷文閣學士宣奉大夫致仕贈特進汪公行狀》。△「仗氣凌人」、「咄咄逼人」"},{"key":"爭先恐後",
"zu":"ㄓㄥ　ㄒ｜ㄢ　ㄎㄨㄥˇ　ㄏㄡˋ",
"han":"zhēng xiān kǒng hòu",
"def":"「爭先」，爭著在前。語出《左傳．襄公二十七年》。「恐後」，惟恐落於他人之後。語本《漢書．卷一四．諸侯王表》。「爭先恐後」指競相爭先，惟恐落後。"},{"key":"迥然不同",
"zu":"ㄐㄩㄥˇ　ㄖㄢˊ　ㄅㄨˋ　ㄊㄨㄥˊ",
"han":"jiǒng rán bù tóng",
"def":"迥然，相差很大的樣子。「迥然不同」指彼此不同，相差很大。※＃語或出宋．張戒《歲寒堂詩話．卷上》。△「截然不同」"},{"key":"如出一轍",
"zu":"ㄖㄨˊ　ㄔㄨ　｜　ㄔㄜˋ",
"han":"rú chū yī chè",
"def":"轍，車輛駛過，車輪所留下的行跡。行徑相同，車轍一致。比喻前後所發生的事情非常相似。◎語出宋．洪邁《容齋續筆．卷一一．名將晚謬》。△「一模一樣」"},{"key":"發人深省",
"zu":"ㄈㄚ　ㄖㄣˊ　ㄕㄣ　ㄒ｜ㄥˇ",
"han":"fā rén shēn xǐng",
"def":"啟發人深刻思考而有所醒悟。語本唐．杜甫〈遊龍門奉先寺〉詩。△「發人猛省」"},{"key":"朋比為奸",
"zu":"ㄆㄥˊ　ㄅ｜ˋ　ㄨㄟˊ　ㄐ｜ㄢ",
"han":"péng bì wéi jiān",
"def":"互相勾結做壞事。語本《新唐書．卷一五二．李絳列傳》。△「朋黨比周」"},{"key":"惴惴不安",
"zu":"ㄓㄨㄟˋ　ㄓㄨㄟˋ　ㄅㄨˋ　ㄢ",
"han":"zhuì zhuì bù ān",
"def":"形容因恐懼擔憂而心神不安寧。◎語本《詩經．秦風．黃鳥》。"},{"key":"隨心所欲",
"zu":"ㄙㄨㄟˊ　ㄒ｜ㄣ　ㄙㄨㄛˇ　ㄩˋ",
"han":"suí xīn suǒ yù",
"def":"完全順隨自己的心意去做事。語本《論語．為政》。"},{"key":"惜墨如金",
"zu":"ㄒ｜ˊ　ㄇㄛˋ　ㄖㄨˊ　ㄐ｜ㄣ",
"han":"xí mò rú jīn",
"def":"不輕於落墨。原指作畫時墨色宜一遍遍地薄塗，最後才能達到漸次深入、濃淡有致的深厚效果，而不宜一次大量使用濃墨。＃語出宋．費樞《釣磯立談》。後用「惜墨如金」比喻寫字、作畫態度謹慎，不輕易下筆。"},{"key":"歡天喜地",
"zu":"ㄏㄨㄢ　ㄊ｜ㄢ　ㄒ｜ˇ　ㄉ｜ˋ",
"han":"huān tiān xǐ dì",
"def":"非常歡喜高興的樣子。※語或出《京本通俗小說．錯斬崔寧》。△「歡欣鼓舞」"},{"key":"循規蹈矩",
"zu":"ㄒㄩㄣˊ　ㄍㄨㄟ　ㄉㄠˋ　ㄐㄩˇ",
"han":"xún guī dào jǔ",
"def":"遵守禮法，不踰越法度。語本《隋書．卷一四．音樂志中》。△「安分守己」"},{"key":"若無其事",
"zu":"ㄖㄨㄛˋ　ㄨˊ　ㄑ｜ˊ　ㄕˋ",
"han":"ruò wú qí shì",
"def":"好像沒有那麼一回事。形容神態鎮靜、自然。※語或出《雪巖外傳．第一○回》。"},{"key":"苦盡甘來",
"zu":"ㄎㄨˇ　ㄐ｜ㄣˋ　ㄍㄢ　ㄌㄞˊ",
"han":"kǔ jìn gān lái",
"def":"艱難困苦的境遇已經結束，轉而逐步進入佳境。※＃語或出《劉知遠諸宮調．第一二》。△「甘盡苦來」"},{"key":"津津有味",
"zu":"ㄐ｜ㄣ　ㄐ｜ㄣ　｜ㄡˇ　ㄨㄟˋ",
"han":"jīn jīn yǒu wèi",
"def":"形容興味濃厚的樣子。※語或本明．毛以遂〈曲律跋〉。後亦用「津津有味」形容食慾盎然或食物的美味。"},{"key":"花天酒地",
"zu":"ㄏㄨㄚ　ㄊ｜ㄢ　ㄐ｜ㄡˇ　ㄉ｜ˋ",
"han":"huā tiān jiǔ dì",
"def":"原指在美好的環境中飲酒作樂。※語或出清．捧花生《秦淮畫舫錄．卷上．紀麗．高桂子》。後來「花天酒地」多用來形容沉迷酒色，荒誕腐化的生活。△「醉生夢死」"},{"key":"席不暇暖",
"zu":"ㄒ｜ˊ　ㄅㄨˋ　ㄒ｜ㄚˊ　ㄋㄨㄢˇ",
"han":"xí bù xiá nuǎn",
"def":"席子還沒坐暖就得起身離去再忙別的事。形容奔走極為忙碌，沒有休息的時候。＃語本《淮南子．脩務》。△「孔席不暖，墨突不黔」、「墨突不黔」"},{"key":"奄奄一息",
"zu":"｜ㄢ　｜ㄢ　｜　ㄒ｜ˊ",
"han":"yān yān yī xí",
"def":"僅存微弱的一口氣。形容生命已到了最後時刻。語本晉．李密〈陳情表〉。△「日薄西山」"},{"key":"玩世不恭",
"zu":"ㄨㄢˊ　ㄕˋ　ㄅㄨˋ　ㄍㄨㄥ",
"han":"wán shì bù gōng",
"def":"以不莊重、不嚴謹的生活態度待人處世。語本《漢書．卷六五．東方朔傳》。"},{"key":"街談巷議",
"zu":"ㄐ｜ㄝ　ㄊㄢˊ　ㄒ｜ㄤˋ　｜ˋ",
"han":"jiē tán xiàng yì",
"def":"大街小巷中的談說議論。＃語出漢．張衡〈西京賦〉。△「擘肌分理」"},{"key":"顧名思義",
"zu":"ㄍㄨˋ　ㄇ｜ㄥˊ　ㄙ　｜ˋ",
"han":"gù míng sī yì",
"def":"本指為人子女者，見其名而思其命名之義。語出《三國志．卷二七．魏書．徐胡二王傳．王昶》。後用「顧名思義」比喻看到名稱，就聯想到它的含義。"},{"key":"馬耳東風",
"zu":"ㄇㄚˇ　ㄦˇ　ㄉㄨㄥ　ㄈㄥ",
"han":"mǎ ěr dōng fēng",
"def":"東風吹過馬耳邊，瞬間消逝。比喻充耳不聞、無動於衷。語本唐．李白〈答王十二寒夜獨酌有懷〉詩。△「耳邊風」、「秋風過耳」"},{"key":"歡欣鼓舞",
"zu":"ㄏㄨㄢ　ㄒ｜ㄣ　ㄍㄨˇ　ㄨˇ",
"han":"huān xīn gǔ wǔ",
"def":"歡樂興奮的樣子。語出宋．蘇軾〈上知府王龍圖書〉。△「歡天喜地」"},{"key":"面紅耳赤",
"zu":"ㄇ｜ㄢˋ　ㄏㄨㄥˊ　ㄦˇ　ㄔˋ",
"han":"miàn hóng ěr chì",
"def":"形容人因緊張、焦急、害羞等而滿臉發紅的樣子。語本《朱子語類．卷二九．論語．公冶長下》。"},{"key":"閉月羞花",
"zu":"ㄅ｜ˋ　ㄩㄝˋ　ㄒ｜ㄡ　ㄏㄨㄚ",
"han":"bì yuè xiū huā",
"def":"「閉月羞花」之「閉月」，典源作「蔽月」，月兒自覺比不上美人，而躲避隱藏。語本三國魏．曹植〈洛神賦〉。「羞花」，形容女子容顏姣好，使花自感羞愧。語本唐．李白〈西施〉詩。「閉月羞花」形容女子容貌十分姣好。△「沉魚落雁」"},{"key":"唯唯諾諾",
"zu":"ㄨㄟˇ　ㄨㄟˇ　ㄋㄨㄛˋ　ㄋㄨㄛˋ",
"han":"wěi wěi nuò nuò",
"def":"連聲稱是。比喻順從而無所違逆。語本《韓非子．八姦》。△「唯命是聽」"},{"key":"欲速不達",
"zu":"ㄩˋ　ㄙㄨˋ　ㄅㄨˋ　ㄉㄚˊ",
"han":"yù sù bù dá",
"def":"想要求快反而不能達到目的。語出《論語．子路》。 "},{"key":"前事不忘，後事之師",
"zu":"ㄑ｜ㄢˊ　ㄕˋ　ㄅㄨˋ　ㄨㄤˋ　ㄏㄡˋ　ㄕˋ　ㄓ　ㄕ",
"han":"qián shì bù wàng hòu shì zhī shī",
"def":"記取過去的經驗教訓，可作為今後行事的鑑鏡。＃語出《戰國策．趙策一》。"},{"key":"懲前毖後",
"zu":"ㄔㄥˊ　ㄑ｜ㄢˊ　ㄅ｜ˋ　ㄏㄡˋ",
"han":"chéng qián bì hòu",
"def":"以從前的過失為教訓，戒慎自己不再犯錯。語本《詩經．周頌．小毖》。"},{"key":"五日京兆",
"zu":"ㄨˇ　ㄖˋ　ㄐ｜ㄥ　ㄓㄠˋ",
"han":"wǔ rì jīng zhào",
"def":"京兆，京師地區的行政長官。「五日京兆」指只能再做五日的京兆了。比喻即將去職。語出《漢書．卷七六．趙尹韓張兩王傳．張敞》。後用以比喻任職時間不久或沒有長遠打算。△「忘恩負義」"},{"key":"無可奈何",
"zu":"ㄨˊ　ㄎㄜˇ　ㄋㄞˋ　ㄏㄜˊ",
"han":"wú kě nài hé",
"def":"毫無辦法、沒有辦法可想。＃語出《戰國策．燕策三》。△「切齒腐心」、「迫不得已」、「望洋興嘆」"},{"key":"改弦更張",
"zu":"ㄍㄞˇ　ㄒ｜ㄢˊ　ㄍㄥ　ㄓㄤ",
"han":"gǎi xián gēng zhāng",
"def":"更，變換。張，給樂器上弦。指若琴瑟聲音不諧調，便得更換其弦。語本漢．董仲舒〈元光元年舉賢良對策〉。後用「改弦更張」比喻改革變更，重新做起。△「改弦易轍」"},{"key":"少見多怪",
"zu":"ㄕㄠˇ　ㄐ｜ㄢˋ　ㄉㄨㄛ　ㄍㄨㄞˋ",
"han":"shǎo jiàn duō guài",
"def":"因為少見而感到驚異奇怪。譏諷人見識不廣，遇平常之事亦以為驚怪。語本漢．牟融《理惑論》。△「大驚小怪」"},{"key":"知難而退",
"zu":"ㄓ　ㄋㄢˊ　ㄦˊ　ㄊㄨㄟˋ",
"han":"zhī nán ér tuì",
"def":"作戰時遇形勢不利就先行退兵。◎語出《左傳．僖公二十八年》。後用「知難而退」泛指行事遇到困難就退縮不前或伺機退卻。"},{"key":"始作俑者",
"zu":"ㄕˇ　ㄗㄨㄛˋ　ㄩㄥˇ　ㄓㄜˇ",
"han":"shǐ zuò yǒng zhě",
"def":"俑，古代用來殉葬的人偶。「始作俑者」指最初製作人俑來殉葬的人。孔子認為雖然用假人陪葬，在意念上實在仍與用真人陪葬無異，所以指責最初發明俑的人，一定會得到報應，絕子絕孫。語出《孟子．梁惠王上》。後用「始作俑者」比喻首創惡例的人。"},{"key":"撥亂反正",
"zu":"ㄅㄛ　ㄌㄨㄢˋ　ㄈㄢˇ　ㄓㄥˋ",
"han":"bō luàn fǎn zhèng",
"def":"扭轉亂象，歸於正道。語出《公羊傳．哀公十四年》。"},{"key":"醉翁之意不在酒",
"zu":"ㄗㄨㄟˋ　ㄨㄥ　ㄓ　｜ˋ　ㄅㄨˋ　ㄗㄞˋ　ㄐ｜ㄡˇ",
"han":"zuì wēng zhī yì bù zài jiǔ",
"def":"本指喝酒時意不在酒，而在寄情於山水中。語出宋．歐陽修〈醉翁亭記〉。後也用「醉翁之意不在酒」比喻別有用心。"},{"key":"精衛填海",
"zu":"ㄐ｜ㄥ　ㄨㄟˋ　ㄊ｜ㄢˊ　ㄏㄞˇ",
"han":"jīng wèi tián hǎi",
"def":"本指炎帝幼女女娃溺死東海，化為精衛鳥，憤而銜木石以填東海的故事。典出《山海經．北山經》。後用「精衛填海」比喻心懷冤憤，立志報仇。亦比喻意志堅定，不懼艱苦。"},{"key":"實事求是",
"zu":"ㄕˊ　ㄕˋ　ㄑ｜ㄡˊ　ㄕˋ",
"han":"shí shì qiú shì",
"def":"做事切實，加求真確。語出《漢書．卷五三．景十三王傳．河間獻王劉德》。"},{"key":"聞一知十",
"zu":"ㄨㄣˊ　｜　ㄓ　ㄕˊ",
"han":"wén yī zhī shí",
"def":"得知一件事，便可推知十件相關的事。形容人稟賦聰敏，善於類推。語出《論語．公冶長》。△「舉一反三」"},{"key":"倚馬可待",
"zu":"｜ˇ　ㄇㄚˇ　ㄎㄜˇ　ㄉㄞˋ",
"han":"yǐ mǎ kě dài",
"def":"東晉桓溫領兵北伐，命令袁虎依靠在馬前草擬一篇告示，袁虎不一會兒即寫滿七張紙，而且文情並茂。＃典出南朝宋．劉義慶《世說新語．文學》。後用「倚馬可待」比喻文思敏捷，寫作迅速。"},{"key":"多難興邦",
"zu":"ㄉㄨㄛ　ㄋㄢˋ　ㄒ｜ㄥ　ㄅㄤ",
"han":"duō nàn xīng bāng",
"def":"國家多難，則上下團結奮發，促使邦國更加興盛。語本《左傳．昭公四年》。"},{"key":"為人作嫁",
"zu":"ㄨㄟˋ　ㄖㄣˊ　ㄗㄨㄛˋ　ㄐ｜ㄚˋ",
"han":"wèi rén zuò jià",
"def":"為別人做出嫁時穿的衣裳。語出唐．秦韜玉〈貧女〉詩。後用「為人作嫁」比喻徒然為他人辛苦，自己卻得不到好處。"},{"key":"風燭殘年",
"zu":"ㄈㄥ　ㄓㄨˊ　ㄘㄢˊ　ㄋ｜ㄢˊ",
"han":"fēng zhú cán nián",
"def":"「風燭」，燈燭在風中搖曳，明暗不定，也極易滅熄。比喻人生命可危。語本古辭〈怨詩行〉。「殘年」，暮年。語出《列子．湯問》。「風燭殘年」形容人身體孱弱，不久於世的晚年。"},{"key":"要言不煩",
"zu":"｜ㄠˋ　｜ㄢˊ　ㄅㄨˋ　ㄈㄢˊ",
"han":"yào yán bù fán",
"def":"說話精要，不囉嗦。語出《輅別傳》。△「言簡意賅」"},{"key":"米珠薪桂",
"zu":"ㄇ｜ˇ　ㄓㄨ　ㄒ｜ㄣ　ㄍㄨㄟˋ",
"han":"mǐ zhū xīn guì",
"def":"米如珍珠，柴如桂木。比喻物價昂貴。語本《戰國策．楚策三》。"},{"key":"自以為是",
"zu":"ㄗˋ　｜ˇ　ㄨㄟˊ　ㄕˋ",
"han":"zì yǐ wéi shì",
"def":"自認觀點與做法正確，不肯虛心接受別人的意見。＃語出《孟子．盡心下》。△「同流合汙」"},{"key":"豺狼當道",
"zu":"ㄔㄞˊ　ㄌㄤˊ　ㄉㄤ　ㄉㄠˋ",
"han":"chái láng dāng dào",
"def":"豺狼橫在道路中間，比喻壞人橫行作惡。語本《漢書．卷七七．蓋諸葛劉鄭孫母將何傳．孫寶》。後亦用以比喻奸人掌握大權，專斷橫行。"},{"key":"談何容易",
"zu":"ㄊㄢˊ　ㄏㄜˊ　ㄖㄨㄥˊ　｜ˋ",
"han":"tán hé róng yì",
"def":"本指人臣進言不容易。語出《漢書．卷六五．東方朔傳》。今用「談何容易」指嘴裡說說容易，實際做起來卻很困難。"},{"key":"問道於盲",
"zu":"ㄨㄣˋ　ㄉㄠˋ　ㄩˊ　ㄇㄤˊ",
"han":"wèn dào yú máng",
"def":"向盲人問路。比喻向無知的人求教。語本唐．韓愈〈答陳生書〉。△「借聽於聾」"},{"key":"英雄無用武之地",
"zu":"｜ㄥ　ㄒㄩㄥˊ　ㄨˊ　ㄩㄥˋ　ㄨˇ　ㄓ　ㄉ｜ˋ",
"han":"yīng xióng wú yòng wǔ zhī dì",
"def":"人雖有才能，卻無施展的機會。語本《三國志．卷三五．蜀書．諸葛亮傳》。△「懷才不遇」"},{"key":"城下之盟",
"zu":"ㄔㄥˊ　ㄒ｜ㄚˋ　ㄓ　ㄇㄥˊ",
"han":"chéng xià zhī méng",
"def":"敵國軍隊兵臨城下，抵擋不住，被迫與敵人簽訂的和約。◎語出《左傳．桓公十二年》。後用「城下之盟」泛指被迫簽訂的屈辱性條約。"},{"key":"弄璋之喜",
"zu":"ㄋㄨㄥˋ　ㄓㄤ　ㄓ　ㄒ｜ˇ",
"han":"nòng zhāng zhī xǐ",
"def":"恭喜人生男孩的賀詞。語本《詩經．小雅．斯干》。"},{"key":"如虎添翼",
"zu":"ㄖㄨˊ　ㄏㄨˇ　ㄊ｜ㄢ　｜ˋ",
"han":"rú hǔ tiān yì",
"def":"猛虎生出雙翅。比喻強有力者又增添生力軍，使之更強。語本三國蜀．諸葛亮《將苑．兵權》。△「為虎傅翼」、「錦上添花」"},{"key":"叱吒風雲",
"zu":"ㄔˋ　ㄓㄚˋ　ㄈㄥ　ㄩㄣˊ",
"han":"chì zhà fēng yún",
"def":"「叱吒風雲」之「吒」，典源作「咤」。「咤」同「吒」。大聲怒喝，連風雲都為之變色。形容威風凜凜，足以左右世局。語出《晉書．卷一二五．乞伏熾磐載記》。"},{"key":"一朝一夕",
"zu":"｜　ㄓㄠ　｜　ㄒ｜ˋ",
"han":"yī zhāo yī xì",
"def":"朝，早晨。夕，傍晚。「一朝一夕」形容時間短暫。語出《易經．坤卦．文言》。"},{"key":"孑然一身",
"zu":"ㄐ｜ㄝˊ　ㄖㄢˊ　｜　ㄕㄣ",
"han":"jié rán yī shēn",
"def":"孑然，孤獨的樣子。「孑然一身」形容孤獨一個人。語本《三國志．卷五七．吳書．虞陸張駱吾朱傳．陸瑁》。△「形單影隻」、「孤苦伶仃」"},{"key":"格殺勿論",
"zu":"ㄍㄜˊ　ㄕㄚ　ㄨˋ　ㄌㄨㄣˋ",
"han":"gé shā wù lùn",
"def":"擊殺凶惡的人不以殺人論罪。＃語本《周禮．秋官．朝士》漢．鄭眾．注。"},{"key":"一場春夢",
"zu":"｜　ㄔㄤˇ　ㄔㄨㄣ　ㄇㄥˋ",
"han":"yī chǎng chūn mèng",
"def":"春夢，言春天易睡，夢境亦美，但容易醒。「一場春夢」指做了一個易醒的春日美夢；比喻世事變幻，轉眼成空。語出唐．盧延讓〈哭李郢端公〉詩。"},{"key":"借題發揮",
"zu":"ㄐ｜ㄝˋ　ㄊ｜ˊ　ㄈㄚ　ㄏㄨㄟ",
"han":"jiè tí fā huī",
"def":"假借某事為藉口，表達自己真正的意思，或想做的事。※語或出明．王衡《鬱輪袍．第二折》。"},{"key":"氣壯山河",
"zu":"ㄑ｜ˋ　ㄓㄨㄤˋ　ㄕㄢ　ㄏㄜˊ",
"han":"qì zhuàng shān hé",
"def":"形容氣勢如高山大河般雄壯豪邁。語本唐．張說〈洛州張司馬集序〉。"},{"key":"不同凡響",
"zu":"ㄅㄨˋ　ㄊㄨㄥˊ　ㄈㄢˊ　ㄒ｜ㄤˇ",
"han":"bù tóng fán xiǎng",
"def":"「不同凡響」典源作「非凡響」，意謂不是平凡的音樂。後用來比喻特出、不平凡的人或事物。※語或本唐．程太虛〈漱玉泉〉詩。△「不同凡庸」、「與眾不同」"},{"key":"英雄氣短",
"zu":"｜ㄥ　ㄒㄩㄥˊ　ㄑ｜ˋ　ㄉㄨㄢˇ",
"han":"yīng xióng qì duǎn",
"def":"有才識志氣的人因遭受挫折而喪失進取心。語本《增廣尚友錄統編．卷三．蘇丕》。後用「英雄氣短」形容有才識志氣的人因沉迷於愛情而喪失進取心。△「兒女情長」、「兒女情長，英雄氣短」、「風雲氣短」"},{"key":"神出鬼沒",
"zu":"ㄕㄣˊ　ㄔㄨ　ㄍㄨㄟˇ　ㄇㄛˋ",
"han":"shén chū guǐ mò",
"def":"本指用兵神奇靈活，變化莫測。語本《淮南子．兵略》。後亦用「神出鬼沒」形容出沒無常，變化莫測。"},{"key":"高風亮節",
"zu":"ㄍㄠ　ㄈㄥ　ㄌ｜ㄤˋ　ㄐ｜ㄝˊ",
"han":"gāo fēng liàng jié",
"def":"「高風」，高尚的品格。語出《後漢書．卷二八下．馮衍傳》。「亮節」，堅貞的氣節。語出晉．陸雲〈晉故豫章內史夏府君誄〉。「高風亮節」形容人的品格高尚，氣節堅貞。"},{"key":"眉開眼笑",
"zu":"ㄇㄟˊ　ㄎㄞ　｜ㄢˇ　ㄒ｜ㄠˋ",
"han":"méi kāi yǎn xiào",
"def":"眉頭舒展，眼含笑意。形容愉悅欣喜的神情。※語或本《喻世明言．卷四．閒雲菴阮三償冤債》。△「眉飛色舞」"},{"key":"寅吃卯糧",
"zu":"｜ㄣˊ　ㄔ　ㄇㄠˇ　ㄌ｜ㄤˊ",
"han":"yín chī mǎo liáng",
"def":"寅年就吃掉了後一年卯年的食糧。※語或本明．畢自嚴〈蠲錢糧疏〉。後用「寅吃卯糧」比喻收入不夠支出，預支以後的用項。△「入不敷出」"},{"key":"涓滴歸公",
"zu":"ㄐㄩㄢ　ㄉ｜　ㄍㄨㄟ　ㄍㄨㄥ",
"han":"juān dī guī gōng",
"def":"涓，細小的流水。涓滴，水滴，比喻極微小的錢財或物品。「涓滴歸公」指即使是極微小的錢財或物品，也要上繳給公家，形容為人廉潔。※語或出《清史稿．卷二○．文宗紀》。"},{"key":"骨瘦如柴",
"zu":"ㄍㄨˇ　ㄕㄡˋ　ㄖㄨˊ　ㄔㄞˊ",
"han":"gǔ shòu rú chái",
"def":"人身骨架瘦得露出來，根根像木材一樣。形容非常消瘦的樣子。語出敦煌變文《維摩詰經講經文》。△「形銷骨立」"},{"key":"根深蒂固",
"zu":"ㄍㄣ　ㄕㄣ　ㄉ｜ˋ　ㄍㄨˋ",
"han":"gēn shēn dì gù",
"def":"「根深蒂固」之「蒂」，典源作「蔕」，音義同。比喻根基堅固，不可動搖。語本《老子．第五九章》。△「積重難返」"},{"key":"烽火連天",
"zu":"ㄈㄥ　ㄏㄨㄛˇ　ㄌ｜ㄢˊ　ㄊ｜ㄢ",
"han":"fēng huǒ lián tiān",
"def":"「烽火」，古代邊防據點用來報警的煙火，比喻戰爭。語出《史記．卷四．周本紀》。「連天」，景物與天空相連。語出《後漢書．卷一．光武帝紀》。「烽火連天」比喻戰爭接連不斷。"},{"key":"望而卻步",
"zu":"ㄨㄤˋ　ㄦˊ　ㄑㄩㄝˋ　ㄅㄨˋ",
"han":"wàng ér què bù",
"def":"看見了就退縮不前。指危險或能力不及的事，令人看了就退卻不前。※語或本明．徐光啟〈復周無逸學憲書〉。"},{"key":"一念之差",
"zu":"｜　ㄋ｜ㄢˋ　ㄓ　ㄔㄚ",
"han":"yī niàn zhī chā",
"def":"一個念頭的差錯。※語或出宋．蘇軾〈次韻致政張朝奉仍招晚飲〉詩。"},{"key":"理直氣壯",
"zu":"ㄌ｜ˇ　ㄓˊ　ㄑ｜ˋ　ㄓㄨㄤˋ",
"han":"lǐ zhí qì zhuàng",
"def":"理由正大、充分，則氣盛勢壯而無所畏懼。※＃語或出《喻世明言．卷三一．鬧陰司司馬貌斷獄》。△「詞強理直」、「振振有辭」、「義正辭嚴」"},{"key":"星羅棋布",
"zu":"ㄒ｜ㄥ　ㄌㄨㄛˊ　ㄑ｜ˊ　ㄅㄨˋ",
"han":"xīng luó qí bù",
"def":"如羅列在天上的群星、分布在棋盤上的棋子。形容布列繁密。語本《後漢書．卷四○．班彪列傳上》。△「鱗次櫛比」"},{"key":"同室操戈",
"zu":"ㄊㄨㄥˊ　ㄕˋ　ㄘㄠ　ㄍㄜ",
"han":"tóng shì cāo gē",
"def":"「同室」，同住在一個房子的人，引申為自家人。語出《孟子．離婁下》。「操戈」，拿著兵器追殺。語本《左傳．昭公元年》。「同室操戈」指自家人彼此持戈相殺，用以比喻兄弟不睦或內部的爭鬥。△「入室操戈」"},{"key":"率由舊章",
"zu":"ㄕㄨㄞˋ　｜ㄡˊ　ㄐ｜ㄡˋ　ㄓㄤ",
"han":"shuài yóu jiù zhāng",
"def":"典章制度完全取法於前代。指一切遵循舊規。語出《詩經．大雅．假樂》。△「蕭規曹隨」"},{"key":"明眸皓齒",
"zu":"ㄇ｜ㄥˊ　ㄇㄡˊ　ㄏㄠˋ　ㄔˇ",
"han":"míng móu hào chǐ",
"def":"明亮的眼睛，潔白的牙齒。形容美女容貌明麗。亦可借指明目皓齒的美女。語本三國魏．曹植〈洛神賦〉。"},{"key":"獨木難支",
"zu":"ㄉㄨˊ　ㄇㄨˋ　ㄋㄢˊ　ㄓ",
"han":"dú mù nán zhī",
"def":"比喻事情非常重大，非一人之力所能支持。＃語本《慎子．知忠》。"},{"key":"不時之需",
"zu":"ㄅㄨˋ　ㄕˊ　ㄓ　ㄒㄩ",
"han":"bù shí zhī xū",
"def":"「不時之需」之「需」，典源作「須」。「須」義同「需」。指隨時的需用。＃語本宋．蘇軾〈後赤壁賦〉。"},{"key":"赤地千里",
"zu":"ㄔˋ　ㄉ｜ˋ　ㄑ｜ㄢ　ㄌ｜ˇ",
"han":"chì dì qiān lǐ",
"def":"赤，光禿、裸露的意思。「赤地千里」形容災荒後廣大土地寸草不生的荒涼景象。語本《漢書．卷七五．眭兩夏侯京翼李傳．夏侯勝》。"},{"key":"貪贓枉法",
"zu":"ㄊㄢ　ㄗㄤ　ㄨㄤˇ　ㄈㄚˇ",
"han":"tān zāng wǎng fǎ",
"def":"指貪汙受賄，破壞法紀。※語或本元．無名氏《陳州糶米．第二折》。△「受賕枉法」"},{"key":"逍遙法外",
"zu":"ㄒ｜ㄠ　｜ㄠˊ　ㄈㄚˇ　ㄨㄞˋ",
"han":"xiāo yáo fǎ wài",
"def":"犯罪者逃避了應受的法律制裁，仍自由自在。語本《莊子．讓王》。"},{"key":"長驅直入",
"zu":"ㄔㄤˊ　ㄑㄩ　ㄓˊ　ㄖㄨˋ",
"han":"cháng qū zhí rù",
"def":"長距離一路挺進，毫無阻擋。語本《漢書．卷五二．竇田灌韓傳．韓安國》。"},{"key":"見仁見智",
"zu":"ㄐ｜ㄢˋ　ㄖㄣˊ　ㄐ｜ㄢˋ　ㄓˋ",
"han":"jiàn rén jiàn zhì",
"def":"對同一件事，每個人看法各異。語本《易經．繫辭上》。"},{"key":"博古通今",
"zu":"ㄅㄛˊ　ㄍㄨˇ　ㄊㄨㄥ　ㄐ｜ㄣ",
"han":"bó gǔ tōng jīn",
"def":"學問淵博，通曉古今。語本《孔子家語．卷三．觀周》。"},{"key":"欺世盜名",
"zu":"ㄑ｜　ㄕˋ　ㄉㄠˋ　ㄇ｜ㄥˊ",
"han":"qī shì dào míng",
"def":"「欺世」，欺騙世人。※語或本《韓非子．詭使》。「盜名」，盜取名譽。語出《荀子．不苟》。「欺世盜名」比喻欺騙世人，盜取名譽。△「沽名釣譽」"},{"key":"惱羞成怒",
"zu":"ㄋㄠˇ　ㄒ｜ㄡ　ㄔㄥˊ　ㄋㄨˋ",
"han":"nǎo xiū chéng nù",
"def":"因羞愧到極點而惱恨發怒。※語或本《兒女英雄傳．第一六回》。"},{"key":"椎心泣血",
"zu":"ㄓㄨㄟ　ㄒ｜ㄣ　ㄑ｜ˋ　ㄒ｜ㄝˇ",
"han":"zhuī xīn qì xiě",
"def":"自捶胸脯，眼中哭出血來。形容哀痛到了極點。語出漢．李陵〈答蘇武書〉。"},{"key":"驚濤駭浪",
"zu":"ㄐ｜ㄥ　ㄊㄠˊ　ㄏㄞˋ　ㄌㄤˋ",
"han":"jīng táo hài làng",
"def":"猛烈的風浪。語本三國魏．王粲〈浮淮賦〉。後亦用「驚濤駭浪」比喻險惡的環境。"},{"key":"鞭辟入裡",
"zu":"ㄅ｜ㄢ　ㄅ｜ˋ　ㄖㄨˋ　ㄌ｜ˇ",
"han":"biān bì rù lǐ",
"def":"鞭辟，鞭策、激勵。「鞭辟入裡」指研究學問要自我鞭策，深入精微之處。語本《二程集．河南程氏遺書．卷一一．師訓》。後用「鞭辟入裡」形容評論見解深刻透澈。△「入木三分」"},{"key":"一團和氣",
"zu":"｜　ㄊㄨㄢˊ　ㄏㄜˊ　ㄑ｜ˋ",
"han":"yī tuán hé qì",
"def":"一片祥和的氣氛，也形容一個人態度和藹可親。※語或出《二程集．河南程氏外書．卷一二．傳聞雜記》。"},{"key":"傷天害理",
"zu":"ㄕㄤ　ㄊ｜ㄢ　ㄏㄞˋ　ㄌ｜ˇ",
"han":"shāng tiān hài lǐ",
"def":"指為人處事違背天理，泯滅人性。※語或出《聊齋志異．卷八．呂無病》。△「反天滅理」"},{"key":"明鏡高懸",
"zu":"ㄇ｜ㄥˊ　ㄐ｜ㄥˋ　ㄍㄠ　ㄒㄩㄢˊ",
"han":"míng jìng gāo xuán",
"def":"傳說秦宮有方鏡，能照見人的五臟六腑，鑑別人心邪正。典出《西京雜記．卷三》。後用「明鏡高懸」比喻官吏辦事明察無私，執法公正嚴明。"},{"key":"高山流水",
"zu":"ㄍㄠ　ㄕㄢ　ㄌ｜ㄡˊ　ㄕㄨㄟˇ",
"han":"gāo shān liú shuǐ",
"def":"形容樂曲高妙。＃語本《列子．湯問》。後亦用「高山流水」比喻知音才懂的音樂。"},{"key":"花團錦簇",
"zu":"ㄏㄨㄚ　ㄊㄨㄢˊ　ㄐ｜ㄣˇ　ㄘㄨˋ",
"han":"huā tuán jǐn cù",
"def":"花朵錦繡聚集在一起。形容繁花茂盛。※＃語或本唐．施肩吾〈少婦游春詞〉。後亦用「花團錦簇」形容五彩繽紛、繁華美麗。"},{"key":"不二法門",
"zu":"ㄅㄨˋ　ㄦˋ　ㄈㄚˇ　ㄇㄣˊ",
"han":"bù èr fǎ mén",
"def":"佛教用語。不二，不是兩個極端；法門，修行入道的門徑。「不二法門」指觀察事物的道理，要離開相對的兩個極端的看法，才能得其實在，所以「不二法門」是指到達絕對真理的方法。語出《維摩詰所說經．卷中．入不二法門品第九》。後用「不二法門」比喻唯一的方法或途徑。"},{"key":"無懈可擊",
"zu":"ㄨˊ　ㄒ｜ㄝˋ　ㄎㄜˇ　ㄐ｜ˊ",
"han":"wú xiè kě jí",
"def":"沒有任何破綻可讓人攻擊。形容非常嚴密，沒有缺失。語本《孫子．計篇》三國魏．曹操．注。"},{"key":"大書特書",
"zu":"ㄉㄚˋ　ㄕㄨ　ㄊㄜˋ　ㄕㄨ",
"han":"dà shū tè shū",
"def":"將值得書寫的事蹟，鄭重地記錄下來。語出唐．韓愈〈答元侍御書〉。"},{"key":"亡命之徒",
"zu":"ㄨㄤˊ　ㄇ｜ㄥˋ　ㄓ　ㄊㄨˊ",
"han":"wáng mìng zhī tú",
"def":"本指脫離名籍而逃亡在外的人。語本《史記．卷八九．張耳陳餘列傳．張耳》。後亦用「亡命之徒」比喻不顧性命作奸犯科的人。"},{"key":"依然故我",
"zu":"｜　ㄖㄢˊ　ㄍㄨˋ　ㄨㄛˇ",
"han":"yī rán gù wǒ",
"def":"依舊和從前的我一樣，指情況依舊，沒有任何變化。※語或出宋．陳著〈賀新郎．北馬飛江過〉詞。△「依然如故」"},{"key":"兔死狐悲",
"zu":"ㄊㄨˋ　ㄙˇ　ㄏㄨˊ　ㄅㄟ",
"han":"tù sǐ hú bēi",
"def":"兔子死了，狐狸感到悲傷。比喻因同類的不幸遭遇而感到悲傷。語本敦煌變文《鷰子賦》。△「物傷其類」"},{"key":"感激涕零",
"zu":"ㄍㄢˇ　ㄐ｜　ㄊ｜ˋ　ㄌ｜ㄥˊ",
"han":"gǎn jī tì líng",
"def":"感激得涕淚俱下，形容非常感謝。語本唐．劉禹錫〈平蔡州〉詩三首之二。"},{"key":"赤手空拳",
"zu":"ㄔˋ　ㄕㄡˇ　ㄎㄨㄥ　ㄑㄩㄢˊ",
"han":"chì shǒu kōng quán",
"def":"「赤手」，空手。語出宋．蘇軾〈送范純粹守慶州〉詩。「空拳」，手中沒任何東西。語出漢．桓寬《鹽鐵論．論勇》。「赤手空拳」指手中空無一物。亦用於形容沒有一點憑藉。△「手無寸鐵」、「赤手空弮」"},{"key":"拍案叫絕",
"zu":"ㄆㄞ　ㄢˋ　ㄐ｜ㄠˋ　ㄐㄩㄝˊ",
"han":"pāi àn jiào jué",
"def":"案，桌子。絕，絕妙、好到極點。「拍案叫絕」，拍桌子叫好，形容非常讚賞。※＃語或出《紅樓夢．第七○回》。"},{"key":"別有天地",
"zu":"ㄅ｜ㄝˊ　｜ㄡˇ　ㄊ｜ㄢ　ㄉ｜ˋ",
"han":"bié yǒu tiān dì",
"def":"形容風景秀麗，引人入勝。＃語出唐．李白〈山中問答〉詩。 後亦用「別有天地」指另有一番境界。△「別有洞天」"},{"key":"遇人不淑",
"zu":"ㄩˋ　ㄖㄣˊ　ㄅㄨˋ　ㄕㄨˊ",
"han":"yù rén bù shú",
"def":"女子誤嫁了不好的丈夫。語出《詩經．王風．中谷有蓷》。"},{"key":"大庭廣眾",
"zu":"ㄉㄚˋ　ㄊ｜ㄥˊ　ㄍㄨㄤˇ　ㄓㄨㄥˋ",
"han":"dà tíng guǎng zhòng",
"def":"「大庭廣眾」典源作「廣庭大眾」。廣，大同義。「大庭廣眾」指人多且公開的場合。＃語本《公孫龍子．跡府》。△「眾目睽睽」"},{"key":"暗度陳倉",
"zu":"ㄢˋ　ㄉㄨˋ　ㄔㄣˊ　ㄘㄤ",
"han":"àn dù chén cāng",
"def":"漢高祖劉邦聽從韓信建議，表面上公開派人修築棧道，暗中卻由陳倉出兵，進而平定三秦。比喻出其不意、從旁突擊的戰略。典出《史記．卷八．高祖本紀》。後用「暗度陳倉」比喻暗中進行的活動，亦用於比喻男女私通。"},{"key":"耳目一新",
"zu":"ㄦˇ　ㄇㄨˋ　｜　ㄒ｜ㄣ",
"han":"ěr mù yī xīn",
"def":"形容所見所聞都有一種新奇、清新的感覺。＃語本《魏書．卷一六．道武七王列傳．河南王曜》。"},{"key":"當務之急",
"zu":"ㄉㄤ　ㄨˋ　ㄓ　ㄐ｜ˊ",
"han":"dāng wù zhī jí",
"def":"當前最急迫要做的事。語本《孟子．盡心上》。△「燃眉之急」"},{"key":"福至心靈",
"zu":"ㄈㄨˊ　ㄓˋ　ㄒ｜ㄣ　ㄌ｜ㄥˊ",
"han":"fú zhì xīn líng",
"def":"形容運氣來時，心思突然變得靈敏起來。語出宋．畢仲詢《幙府燕閒錄》。"},{"key":"衣冠禽獸",
"zu":"｜　ㄍㄨㄢ　ㄑ｜ㄣˊ　ㄕㄡˋ",
"han":"yī guān qín shòu",
"def":"空有外表而行同禽獸。比喻品德敗壞的人。※語或出明．陳汝元《金蓮記．第七齣》。△「人面獸心」、「衣冠梟獍」"},{"key":"死心塌地",
"zu":"ㄙˇ　ㄒ｜ㄣ　ㄊㄚ　ㄉ｜ˋ",
"han":"sǐ xīn tā dì",
"def":"形容心意已定，不再改變。※＃語或出元．王實甫《西廂記．第三本．第三折》。「死心塌地」亦用來表示心裡踏實或放心之意。"},{"key":"新陳代謝",
"zu":"ㄒ｜ㄣ　ㄔㄣˊ　ㄉㄞˋ　ㄒ｜ㄝˋ",
"han":"xīn chén dài xiè",
"def":"「新陳代謝」之「陳」，典源作「故」。代，更代、輪流。謝，凋謝。有代謝必有代生，「新故代謝」指時序循環中的事物更迭交替。語本漢．蔡邕〈筆賦〉。後用「新陳代謝」形容新舊事態的更新除舊，或為生物體細胞中各種化學反應的總稱。"},{"key":"搖旗吶喊",
"zu":"｜ㄠˊ　ㄑ｜ˊ　ㄋㄚˋ　ㄏㄢˇ",
"han":"yáo qí nà hǎn",
"def":"打仗時，揮舞旗幟，嘶喊以助聲威。※語或出元．喬吉《兩世姻緣．第三折》。後亦用「搖旗吶喊」比喻為他人助長聲勢。"},{"key":"搖搖欲墜",
"zu":"｜ㄠˊ　｜ㄠˊ　ㄩˋ　ㄓㄨㄟˋ",
"han":"yáo yáo yù zhuì",
"def":"搖搖晃晃得快要倒下來。形容就要掉下來或就要垮臺的樣子。※語或出《三國演義．第一○四回》。△「岌岌可危」"},{"key":"有教無類",
"zu":"｜ㄡˇ　ㄐ｜ㄠˋ　ㄨˊ　ㄌㄟˋ",
"han":"yǒu jiào wú lèi",
"def":"指施教的對象，沒有貴賤貧富的分別。語出《論語．衛靈公》。"},{"key":"有名無實",
"zu":"｜ㄡˇ　ㄇ｜ㄥˊ　ㄨˊ　ㄕˊ",
"han":"yǒu míng wú shí",
"def":"指虛有其名而無實際內容。＃語本《國語．晉語八》。△「名不副實」"},{"key":"槁木死灰",
"zu":"ㄍㄠˇ　ㄇㄨˋ　ㄙˇ　ㄏㄨㄟ",
"han":"gǎo mù sǐ huī",
"def":"形體寂靜如枯槁的木頭，沒有生氣，精神凝聚猶如冷卻的灰塵，不能重新起火。形容人清虛寂靜，對外物無動於衷。語本《莊子．齊物論》。後用「槁木死灰」形容人因遭受挫折變故而灰心絕望的樣子。"},{"key":"有目共睹",
"zu":"｜ㄡˇ　ㄇㄨˋ　ㄍㄨㄥˋ　ㄉㄨˇ",
"han":"yǒu mù gòng dǔ",
"def":"凡是有眼睛的人都看得見。指事實極為明顯，眾所周知。語本漢．徐幹《中論．卷上．貴驗》。"},{"key":"慘不忍睹",
"zu":"ㄘㄢˇ　ㄅㄨˋ　ㄖㄣˇ　ㄉㄨˇ",
"han":"cǎn bù rěn dǔ",
"def":"形容情狀悽慘，令人不忍目睹。※語或出清．許奉恩《里乘．卷八．倪公春岩》。△「傷心慘目」"},{"key":"小巧玲瓏",
"zu":"ㄒ｜ㄠˇ　ㄑ｜ㄠˇ　ㄌ｜ㄥˊ　ㄌㄨㄥˊ",
"han":"xiǎo qiǎo líng lóng",
"def":"形容極細緻精巧。語本宋．辛棄疾〈臨江仙．莫笑吾家蒼壁小〉詞。"},{"key":"憐香惜玉",
"zu":"ㄌ｜ㄢˊ　ㄒ｜ㄤ　ㄒ｜ˊ　ㄩˋ",
"han":"lián xiāng xí yù",
"def":"「憐香」，喜愛花香。語出唐．徐夤〈蝴蝶〉詩二首之一。「惜玉」，珍視寶玉。語出金．元好問〈荊棘中杏花〉詩。「憐香惜玉」比喻愛憐、善待女性。"},{"key":"耳鬢廝磨",
"zu":"ㄦˇ　ㄅ｜ㄣˋ　ㄙ　ㄇㄛˊ",
"han":"ěr bìn sī mó",
"def":"耳旁的鬢髮相互摩擦，形容親暱。※◎語或出《紅樓夢．第七二回》。"},{"key":"寡不敵眾",
"zu":"ㄍㄨㄚˇ　ㄅㄨˋ　ㄉ｜ˊ　ㄓㄨㄥˋ",
"han":"guǎ bù dí zhòng",
"def":"人少的抵擋不過人多勢眾的。＃語出《逸周書．卷九．芮良夫》。"},{"key":"語無倫次",
"zu":"ㄩˇ　ㄨˊ　ㄌㄨㄣˊ　ㄘˋ",
"han":"yǔ wú lún cì",
"def":"說話顛三倒四，毫無條理。語出宋．蘇軾《東坡志林．卷二》。△「不知所云」"},{"key":"寥寥無幾",
"zu":"ㄌ｜ㄠˊ　ㄌ｜ㄠˊ　ㄨˊ　ㄐ｜ˇ",
"han":"liáo liáo wú jǐ",
"def":"數量極少。※語或出明．胡應麟《詩藪．內編．古體下．七言》。△「屈指可數」、「寥若晨星」"},{"key":"目瞪口呆",
"zu":"ㄇㄨˋ　ㄉㄥˋ　ㄎㄡˇ　ㄉㄞ",
"han":"mù dèng kǒu dāi",
"def":"形容受驚或受窘以致神情痴呆的樣子。語本唐．皇甫枚《三水小牘．卷下．夏侯禎黷女靈皇甫枚為禱乃免》。△「呆若木雞」"},{"key":"生殺予奪",
"zu":"ㄕㄥ　ㄕㄚ　ㄩˇ　ㄉㄨㄛˊ",
"han":"shēng shā yǔ duó",
"def":"生存、殺害、給予、奪取。比喻人切身的一切事情。＃語本《周禮．春官．內史》。"},{"key":"摩頂放踵",
"zu":"ㄇㄛˊ　ㄉ｜ㄥˇ　ㄈㄤˇ　ㄓㄨㄥˇ",
"han":"mó dǐng fǎng zhǒng",
"def":"摩，磨。頂，頭頂。放，音ㄈㄤˇ，至。踵，腳後跟。「摩頂放踵」指磨禿頭頂，走破腳後跟。語出《孟子．盡心上》。後用「摩頂放踵」比喻捨己救世，不辭勞苦。△「一毛不拔」、「鞠躬盡瘁」"},{"key":"珠聯璧合",
"zu":"ㄓㄨ　ㄌ｜ㄢˊ　ㄅ｜ˋ　ㄏㄜˊ",
"han":"zhū lián bì hé",
"def":"日月如併合的玉璧，星辰如成串的珍珠，指一種天象。古人認為是祥瑞的徵兆。語本《漢書．卷二一．律曆志上》。後用「珠聯璧合」比喻人才或美好的事物相匹配或同時薈集。常用作祝賀新婚的頌辭。"},{"key":"未卜先知",
"zu":"ㄨㄟˋ　ㄅㄨˇ　ㄒ｜ㄢ　ㄓ",
"han":"wèi bǔ xiān zhī",
"def":"未曾占卜就能知道吉凶。形容有預知未來的能力。※語或出元．王曄《桃花女．第三折》。△「料事如神」"},{"key":"火樹銀花",
"zu":"ㄏㄨㄛˇ　ㄕㄨˋ　｜ㄣˊ　ㄏㄨㄚ",
"han":"huǒ shù yín huā",
"def":"「火樹」，像火一般燦爛的樹。語出晉．傅玄〈庭燎〉詩。「銀花」，銀色的花朵，後指燈。語出南朝梁．簡文帝〈彌陀佛像銘〉。「火樹銀花」形容燈火通明燦爛的景象。"},{"key":"半推半就",
"zu":"ㄅㄢˋ　ㄊㄨㄟ　ㄅㄢˋ　ㄐ｜ㄡˋ",
"han":"bàn tuī bàn jiù",
"def":"就，本指到職、就位，俯就。引申為依隨，順從的意思。「半推半就」形容假意推辭終久俯允的樣子。語出元．王實甫《西廂記．第四本．第一折》。"},{"key":"平地風波",
"zu":"ㄆ｜ㄥˊ　ㄉ｜ˋ　ㄈㄥ　ㄅㄛ",
"han":"píng dì fēng bō",
"def":"平地上起風波，比喻突然發生事故或變化。語本唐．劉禹錫〈竹枝詞〉九首之七。"},{"key":"調虎離山",
"zu":"ㄉ｜ㄠˋ　ㄏㄨˇ　ㄌ｜ˊ　ㄕㄢ",
"han":"diào hǔ lí shān",
"def":"引誘老虎離開牠盤踞的山頭。比喻用計誘使對方離開他的據點，以便趁機行事，達成目的。※語或出《西遊記．第五三回》。△「賺虎離窩」"},{"key":"瞠乎其後",
"zu":"ㄔㄥ　ㄏㄨ　ㄑ｜ˊ　ㄏㄡˋ",
"han":"chēng hū qí hòu",
"def":"瞠，音ㄔㄥ，張大眼睛直視。「瞠乎其後」比喻落後很多，追趕不上。語本《莊子．田子方》。△「亦步亦趨」、「奔逸絕塵」、「望塵莫及」"},{"key":"天馬行空",
"zu":"ㄊ｜ㄢ　ㄇㄚˇ　ㄒ｜ㄥˊ　ㄎㄨㄥ",
"han":"tiān mǎ xíng kōng",
"def":"天馬，指天帝所乘的神馬。「天馬行空」，形容神馬奔馳。語本《漢書．卷二二．禮樂志》。後用「天馬行空」比喻文才氣勢豪放不拘，亦用於形容浮誇不著邊際。△「天馬脫御」、「天馬脫羈」、「脫羈天馬」"},{"key":"烏煙瘴氣",
"zu":"ㄨ　｜ㄢ　ㄓㄤˋ　ㄑ｜ˋ",
"han":"wū yān zhàng qì",
"def":"瘴氣，山林間因溼熱蒸鬱而成的毒氣。「烏煙瘴氣」形容人事渾濁、氣氛不諧，就像黑色的煙霧，有毒的瘴氣。※◎語或出《兒女英雄傳．第二一回》。後亦用「烏煙瘴氣」形容環境汙穢不潔。"},{"key":"參差不齊",
"zu":"ㄘㄣ　ㄘ　ㄅㄨˋ　ㄑ｜ˊ",
"han":"cēn cī bù qí",
"def":"雜亂不整齊。＃語出漢．揚雄《法言．序》。△「良莠不齊」"},{"key":"噬臍莫及",
"zu":"ㄕˋ　ㄑ｜ˊ　ㄇㄛˋ　ㄐ｜ˊ",
"han":"shì qí mò jí",
"def":"「噬臍莫及」之「臍」，典源作「齊」。「齊」通「臍」，臍就是肚臍。用嘴咬自己的肚臍，是做不到的事。比喻後悔已遲。語本《左傳．莊公六年》。"},{"key":"賠了夫人又折兵",
"zu":"ㄆㄟˊ　˙ㄌㄜ　ㄈㄨ　ㄖㄣˊ　｜ㄡˋ　ㄓㄜˊ　ㄅ｜ㄥ",
"han":"péi le fū rén yòu zhé bīng",
"def":"送給人夫人，又折損了自己的兵將，大大吃虧。相傳周瑜曾施計，假裝要將孫權的妹妹嫁給劉備，以取荊州，結果弄巧成拙，不但沒得到荊州，反而孫權的妹妹真的被娶走，並且又折損了許多兵將。後用「賠了夫人又折兵」以比喻不但沒有占到便宜，反而吃大虧。語出元．無名氏《隔江鬥智．第二折》。"},{"key":"天誅地滅",
"zu":"ㄊ｜ㄢ　ㄓㄨ　ㄉ｜ˋ　ㄇ｜ㄝˋ",
"han":"tiān zhū dì miè",
"def":"誅，殺。滅，消滅。「天誅地滅」指所作所為天地不容。多用於發誓、賭咒。語出宋．朱暉《絕倒錄．養脾丸》。"},{"key":"天羅地網",
"zu":"ㄊ｜ㄢ　ㄌㄨㄛˊ　ㄉ｜ˋ　ㄨㄤˇ",
"han":"tiān luó dì wǎng",
"def":"天空地面遍布羅網。比喻防範極為嚴密，無法逃脫。＃語出《大宋宣和遺事．亨集》。"},{"key":"龍蟠虎踞",
"zu":"ㄌㄨㄥˊ　ㄆㄢˊ　ㄏㄨˇ　ㄐㄩˋ",
"han":"lóng pán hǔ jù",
"def":"「龍蟠虎踞」之「蟠」，典源作「盤」。蟠，盤伏、盤曲。「龍蟠虎踞」形容像神龍盤曲、猛虎蹲坐著。＃語本《西京雜記．卷六》。後用「龍蟠虎踞」形容地勢雄偉險要。"},{"key":"切膚之痛",
"zu":"ㄑ｜ㄝˋ　ㄈㄨ　ㄓ　ㄊㄨㄥˋ",
"han":"qiè fū zhī tòng",
"def":"切，接近。「切膚之痛」指與自身密切相關的痛苦。語本《易經．剝卦》。後用「切膚之痛」比喻極為深刻難忘的感受與經驗。"},{"key":"手忙腳亂",
"zu":"ㄕㄡˇ　ㄇㄤˊ　ㄐ｜ㄠˇ　ㄌㄨㄢˋ",
"han":"shǒu máng jiǎo luàn",
"def":"形容做事慌亂，失了條理。※＃語或本《景德傳燈錄．卷一九．韶州雲門山文偃禪師》。亦可形容十分忙碌的樣子。△「七手八腳」"},{"key":"鬼使神差",
"zu":"ㄍㄨㄟˇ　ㄕˇ　ㄕㄣˊ　ㄔㄞ",
"han":"guǐ shǐ shén chāi",
"def":"冥冥中有鬼神相助。比喻被莫名力量驅使而不由自主。＃語出元．李致遠《還牢末．第四折》。△「陰錯陽差」"},{"key":"聳人聽聞",
"zu":"ㄙㄨㄥˇ　ㄖㄣˊ　ㄊ｜ㄥ　ㄨㄣˊ",
"han":"sǒng rén tīng wén",
"def":"「聳人聽聞」之「聳人」，典源作「聳動」。使人聽後大為驚駭。※語或本宋．周密《齊東野語．卷七．洪君疇》。△「危言聳聽」、「駭人聽聞」、「聳動人聽」"},{"key":"一五一十",
"zu":"｜　ㄨˇ　｜　ㄕˊ",
"han":"yī wǔ yī shí",
"def":"一) 本指計數的動作，亦用以形容計數的仔細。※語或出《醒世姻緣傳．第三四回》。(二) 比喻把事情從頭至尾詳細說出，無所遺漏。※語或出《水滸傳．第二四回》。△「如數家珍」"},{"key":"氣宇軒昂",
"zu":"ㄑ｜ˋ　ㄩˇ　ㄒㄩㄢ　ㄤˊ",
"han":"qì yǔ xuān áng",
"def":"「氣宇軒昂」之「氣」，典源作「器」，也有氣度之意。「氣宇」，指人的胸襟、氣度。語本晉．王隱《晉書》。「軒昂」，形容意態不凡。語出《三國志．卷四六．吳書．孫破虜討逆傳．孫堅》。「氣宇軒昂」形容神采飛揚，氣度不凡。"},{"key":"隱惡揚善",
"zu":"｜ㄣˇ　ㄜˋ　｜ㄤˊ　ㄕㄢˋ",
"han":"yǐn è yáng shàn",
"def":"隱藏他人的惡行，宣揚他人的善行。語出《禮記．中庸》。△「遏惡揚善」"},{"key":"軒然大波",
"zu":"ㄒㄩㄢ　ㄖㄢˊ　ㄉㄚˋ　ㄅㄛ",
"han":"xuān rán dà bō",
"def":"高揚壯大的波濤。語出唐．韓愈〈岳陽樓別竇司直〉詩。後用「軒然大波」比喻大的糾紛或風波。"},{"key":"粗枝大葉",
"zu":"ㄘㄨ　ㄓ　ㄉㄚˋ　｜ㄝˋ",
"han":"cū zhī dà yè",
"def":"「粗枝大葉」之「粗」，典源作「麤」。「麤」同「粗」。簡略概括。※語或本《朱子語類．卷七八．尚書一．綱領》。後用「粗枝大葉」比喻疏略，做事不細密。亦用於比喻大體的輪廓。△「粗心大意」"},{"key":"出口成章",
"zu":"ㄔㄨ　ㄎㄡˇ　ㄔㄥˊ　ㄓㄤ",
"han":"chū kǒu chéng zhāng",
"def":"從口中說出的話有章法有文理。語本《詩經．小雅．都人士》。後用「出口成章」比喻才思敏捷，談吐風雅。"},{"key":"雞皮鶴髮",
"zu":"ㄐ｜　ㄆ｜ˊ　ㄏㄜˋ　ㄈㄚˇ",
"han":"jī pí hè fǎ",
"def":"白髮皺皮。形容老人的形貌。語本北周．庾信〈竹杖賦〉。"},{"key":"人去樓空",
"zu":"ㄖㄣˊ　ㄑㄩˋ　ㄌㄡˊ　ㄎㄨㄥ",
"han":"rén qù lóu kōng",
"def":"表示舊地重遊時人事已非，或對故人的思念。語本唐．崔顥〈黃鶴樓〉詩。後亦用「人去樓空」形容畏罪潛逃，不知去向。"},{"key":"三頭六臂",
"zu":"ㄙㄢ　ㄊㄡˊ　ㄌ｜ㄡˋ　ㄅ｜ˋ",
"han":"sān tóu liù bì",
"def":"「三頭六臂」之「六臂」，原作「八臂」，指有三顆頭、八條臂膀，為一種天神的長相。語本《法苑珠林．卷五．六道篇．脩羅部．述意部》。後用「三頭六臂」比喻人本領大，力強可畏。△「神通廣大」"},{"key":"出水芙蓉",
"zu":"ㄔㄨ　ㄕㄨㄟˇ　ㄈㄨˊ　ㄖㄨㄥˊ",
"han":"chū shuǐ fú róng",
"def":"芙蓉，荷花的別名。「出水芙蓉」指初出水面初開的荷花，光潔清新。用於比喻詩文清新可愛。語本南朝梁．鍾嶸《詩品．卷中．宋光祿大夫顏延之詩》。後用「出水芙蓉」比喻女子嬌柔豔麗。△「錯彩鏤金」"},{"key":"觸景生情",
"zu":"ㄔㄨˋ　ㄐ｜ㄥˇ　ㄕㄥ　ㄑ｜ㄥˊ",
"han":"chù jǐng shēng qíng",
"def":"看見眼前景象而引發內心種種情緒。語本元．戴良〈錢氏三樓詩序〉。△「見景生情」、「睹物興情」"},{"key":"黃袍加身",
"zu":"ㄏㄨㄤˊ　ㄆㄠˊ　ㄐ｜ㄚ　ㄕㄣ",
"han":"huáng páo jiā shēn",
"def":"黃袍，皇帝所服之袍。「黃袍加身」指被擁戴為皇帝。＃典出《宋史．卷一．太祖本紀》。"},{"key":"一箭雙雕",
"zu":"｜　ㄐ｜ㄢˋ　ㄕㄨㄤ　ㄉ｜ㄠ",
"han":"yī jiàn shuāng diāo",
"def":"一箭射中兩雕。指射箭技術高超。＃典出《北史．卷二二．長孫道生列傳》。後用「一箭雙雕」比喻一次舉動，可以同時達到兩個目標。△「一舉兩得」"},{"key":"三寸不爛之舌",
"zu":"ㄙㄢ　ㄘㄨㄣˋ　ㄅㄨˋ　ㄌㄢˋ　ㄓ　ㄕㄜˊ",
"han":"sān cùn bù làn zhī shé",
"def":"形容人口才極佳，能言善道。◎語本《史記．卷七六．平原君虞卿列傳．平原君》。△「一言九鼎」"},{"key":"捨本逐末",
"zu":"ㄕㄜˇ　ㄅㄣˇ　ㄓㄨˊ　ㄇㄛˋ",
"han":"shě běn zhú mò",
"def":"指人民不務農業而從事工、商。＃語本《呂氏春秋．士容論．上農》。後用「捨本逐末」指人不求事物的根本大端，只重視微末小節。△「舍本治末」、「捨本就末」"},{"key":"一心一意",
"zu":"｜　ㄒ｜ㄣ　｜　｜ˋ",
"han":"yī xīn yī yì",
"def":"同心同意。亦用於指心意專一，毫無他念。＃語本《杜氏新書》。△「全心全意」"},{"key":"相得益彰",
"zu":"ㄒ｜ㄤ　ㄉㄜˊ　｜ˋ　ㄓㄤ",
"han":"xiāng dé yì zhāng",
"def":"「相得益彰」之「彰」，典源作「章」。指互相配合、映襯，更能顯出各自的優點。語本漢．王褒〈聖主得賢臣頌〉。△「相映成趣」、「聚精會神」"},{"key":"韋編三絕",
"zu":"ㄨㄟˊ　ㄅ｜ㄢ　ㄙㄢ　ㄐㄩㄝˊ",
"han":"wéi biān sān jué",
"def":"韋，熟皮。舊時用以串聯竹簡成冊。「韋編三絕」本指孔子勤讀《易》，致使編竹簡的皮繩多次斷裂。語出《史記．卷四七．孔子世家》。後用以比喻讀書勤奮努力。"},{"key":"一了百了",
"zu":"｜　ㄌ｜ㄠˇ　ㄅㄞˇ　ㄌ｜ㄠˇ",
"han":"yī liǎo bǎi liǎo",
"def":"原指一樣事情明白了解，其他各事亦可類推而明白了解。＃語本《朱子語類．卷八．學．總論為學之方》。後人望文生義，以「了」為「了結」之義，「一了百了」遂指主要的事一了結，其餘相關的事也隨之了結。"},{"key":"腰纏萬貫",
"zu":"｜ㄠ　ㄔㄢˊ　ㄨㄢˋ　ㄍㄨㄢˋ",
"han":"yāo chán wàn guàn",
"def":"貫，為古代計算錢幣的單位，一千錢為一貫。「腰纏萬貫」指身上有大筆的錢財。比喻財富極多。典出南朝梁．殷芸《小說．卷六．吳蜀人》。△「腰纏騎鶴」、「騎鶴揚州」"},{"key":"額手稱慶",
"zu":"ㄜˊ　ㄕㄡˇ　ㄔㄥ　ㄑ｜ㄥˋ",
"han":"é shǒu chēng qìng",
"def":"舉手齊額，表示慶賀、高興。※語或出《東周列國志．第三七回》。△「以手加額」"},{"key":"一無所有",
"zu":"｜　ㄨˊ　ㄙㄨㄛˇ　｜ㄡˇ",
"han":"yī wú suǒ yǒu",
"def":"什麼都沒有。※語或出敦煌變文《山遠公話》。"},{"key":"心如刀割",
"zu":"ㄒ｜ㄣ　ㄖㄨˊ　ㄉㄠ　ㄍㄜ",
"han":"xīn rú dāo gē",
"def":"謂內心痛苦，像被刀割一樣。語本漢．蔡邕〈太傅胡廣碑〉。△「肝腸寸斷」"},{"key":"文不對題",
"zu":"ㄨㄣˊ　ㄅㄨˋ　ㄉㄨㄟˋ　ㄊ｜ˊ",
"han":"wén bù duì tí",
"def":"文章內容和題目不相符合。※語或出清．宣鼎《夜雨秋燈錄三集．卷二．科場》。後亦用「文不對題」指話語與話題不符。"},{"key":"心驚膽戰",
"zu":"ㄒ｜ㄣ　ㄐ｜ㄥ　ㄉㄢˇ　ㄓㄢˋ",
"han":"xīn jīng dǎn zhàn",
"def":"形容十分驚慌害怕。語本敦煌變文《維摩詰經講經文》。"},{"key":"水性楊花",
"zu":"ㄕㄨㄟˇ　ㄒ｜ㄥˋ　｜ㄤˊ　ㄏㄨㄚ",
"han":"shuǐ xìng yáng huā",
"def":"水性隨勢而流，楊花隨風飄飛散落。比喻女子用情不專，淫蕩輕薄。※語或本《永樂大典戲文三種．小孫屠．第九齣》。"},{"key":"心煩意亂",
"zu":"ㄒ｜ㄣ　ㄈㄢˊ　｜ˋ　ㄌㄨㄢˋ",
"han":"xīn fán yì luàn",
"def":"「心煩意亂」之「意」，典源作「慮」。「心煩意亂」指心情煩躁，思緒凌亂。語本戰國楚．屈原〈卜居〉。△「意擾心愁」"},{"key":"心滿意足",
"zu":"ㄒ｜ㄣ　ㄇㄢˇ　｜ˋ　ㄗㄨˊ",
"han":"xīn mǎn yì zú",
"def":"心理滿足如意。語本《漢書．卷九九．王莽傳中》。△「稱心如意」"},{"key":"文不加點",
"zu":"ㄨㄣˊ　ㄅㄨˋ　ㄐ｜ㄚ　ㄉ｜ㄢˇ",
"han":"wén bù jiā diǎn",
"def":"形容文思敏捷、下筆成章，通篇無所塗改。＃語出漢．禰衡〈鸚鵡賦〉。"},{"key":"以貌取人",
"zu":"｜ˇ　ㄇㄠˋ　ㄑㄩˇ　ㄖㄣˊ",
"han":"yǐ mào qǔ rén",
"def":"容貌的美醜作為認識、評斷或任用人才的標準。＃語本《韓非子．顯學》。△「以言取人」"},{"key":"寸步不離",
"zu":"ㄘㄨㄣˋ　ㄅㄨˋ　ㄅㄨˋ　ㄌ｜ˊ",
"han":"cùn bù bù lí",
"def":"緊緊跟隨著，一小步也不離開。比喻關係密切，總是在一起。語出《述異記》。"},{"key":"大聲疾呼",
"zu":"ㄉㄚˋ　ㄕㄥ　ㄐ｜ˊ　ㄏㄨ",
"han":"dà shēng jí hū",
"def":"疾，急促。「大聲疾呼」指大聲而急促的呼喊。語本唐．韓愈〈後十九日復上書〉。後亦用「大聲疾呼」比喻大力地提倡、號召。"},{"key":"不置可否",
"zu":"ㄅㄨˋ　ㄓˋ　ㄎㄜˇ　ㄈㄡˇ",
"han":"bù zhì kě fǒu",
"def":"不說可以，也不說不可以。形容不表示任何意見。※語或本宋．汪藻〈尚書禮部侍郎致仕贈大中大夫衛公墓誌銘〉。△「模稜兩可」"},{"key":"打退堂鼓",
"zu":"ㄉㄚˇ　ㄊㄨㄟˋ　ㄊㄤˊ　ㄍㄨˇ",
"han":"dǎ tuì táng gǔ",
"def":"古代官吏審理案件完畢後，擊鼓離堂休息。※＃語或本元．關漢卿《竇娥冤．第二折》。後用「打退堂鼓」比喻中途退縮放棄。"},{"key":"四通八達",
"zu":"ㄙˋ　ㄊㄨㄥ　ㄅㄚ　ㄉㄚˊ",
"han":"sì tōng bā dá",
"def":"四方相通的道路。形容交通便利。＃語本《史記．卷九七．酈生陸賈列傳．酈食其》。後亦用「四通八達」指人。亦用於形容對事理明白曉暢、融會貫通。"},{"key":"無妄之災",
"zu":"ㄨˊ　ㄨㄤˋ　ㄓ　ㄗㄞ",
"han":"wú wàng zhī zāi",
"def":"「無妄之災」之「無」，典源作「无」。无，古「無」字。古時一人把牛繫在路上，卻被路人牽走，而使當地人平白受到懷疑和搜捕。比喻意外的災禍。語本《易經．无妄卦》。"},{"key":"甘之如飴",
"zu":"ㄍㄢ　ㄓ　ㄖㄨˊ　｜ˊ",
"han":"gān zhī rú yí",
"def":"指苦難來臨，甘心承受。語本漢．趙曄《吳越春秋．勾踐歸國外傳》。"},{"key":"不約而同",
"zu":"ㄅㄨˋ　ㄩㄝ　ㄦˊ　ㄊㄨㄥˊ",
"han":"bù yuē ér tóng",
"def":"彼此並未事先約定，而意見或行為卻相同。語本《史記．卷一一二．平津侯主父列傳．主父偃》。△「不謀而合」"},{"key":"名列前茅",
"zu":"ㄇ｜ㄥˊ　ㄌ｜ㄝˋ　ㄑ｜ㄢˊ　ㄇㄠˊ",
"han":"míng liè qián máo",
"def":"茅，通「旄」。旄，旄牛。前茅，古代行軍打仗時，前行的兵士所拿的竿頂用旄牛尾裝飾的指揮旗幟。一說茅即茅草，春秋時代楚國行軍，有人拿著茅草當旗幟走在軍隊前面，或擔任斥候。「名列前茅」，指其名列於隊伍前面。語本《左傳．宣公十二年》。後用「名列前茅」比喻成績優異，名次排在前面。△「獨占鰲頭」"},{"key":"名韁利鎖",
"zu":"ㄇ｜ㄥˊ　ㄐ｜ㄤ　ㄌ｜ˋ　ㄙㄨㄛˇ",
"han":"míng jiāng lì suǒ",
"def":"功名的韁繩和利祿的鎖鏈。比喻人受名利的羈絆而不得自由。＃語本《漢書．卷一○○．敘傳上》。"},{"key":"失魂落魄",
"zu":"ㄕ　ㄏㄨㄣˊ　ㄌㄨㄛˋ　ㄆㄛˋ",
"han":"shī hún luò pò",
"def":"魂、魄，皆古人想像中一種能脫離人體而獨立存在的精神。「失魂落魄」形容人極度驚慌或精神恍惚、失其主宰。※語或出《初刻拍案驚奇．卷二五》。△「魂不守舍」"},{"key":"付之一笑",
"zu":"ㄈㄨˋ　ㄓ　｜　ㄒ｜ㄠˋ",
"han":"fù zhī yī xiào",
"def":"形容態度毫不在意，一笑置之。語本宋．蘇軾〈次韻王郎子立風雨有感〉詩。"},{"key":"因時制宜",
"zu":"｜ㄣ　ㄕˊ　ㄓˋ　｜ˊ",
"han":"yīn shí zhì yí",
"def":"根據不同時期的情況，採取合宜的措施應對。語本《淮南子．氾論》。△「因地制宜」、「因事制宜」"},{"key":"不識之無",
"zu":"ㄅㄨˋ　ㄕˋ　ㄓ　ㄨˊ",
"han":"bù shì zhī wú",
"def":"連「之」、「無」二字都不認識，比喻不識字或毫無學問。＃典出唐．白居易〈與元九書〉。"},{"key":"支吾其詞",
"zu":"ㄓ　ㄨˊ　ㄑ｜ˊ　ㄘˊ",
"han":"zhī wú qí cí",
"def":"形容以含混牽強的言語，搪塞應付他人。※語或出《官場現形記．第二八回》。"},{"key":"禍不單行",
"zu":"ㄏㄨㄛˋ　ㄅㄨˋ　ㄉㄢ　ㄒ｜ㄥˊ",
"han":"huò bù dān xíng",
"def":"比喻不幸的事接二連三地發生。語本漢．劉向《說苑．卷一三．權謀》。△「福無雙至」、「福無雙至，禍不單行」"},{"key":"現身說法",
"zu":"ㄒ｜ㄢˋ　ㄕㄣ　ㄕㄨㄛ　ㄈㄚˇ",
"han":"xiàn shēn shuō fǎ",
"def":"本指佛、菩薩顯現種種化身，向眾生宣說佛法。＃語本《大佛頂首楞嚴經．卷六》。後用「現身說法」比喻以親身經歷為例證，來說明道理或勸導別人。"},{"key":"設身處地",
"zu":"ㄕㄜˋ　ㄕㄣ　ㄔㄨˇ　ㄉ｜ˋ",
"han":"shè shēn chǔ dì",
"def":"假想自己處在他人地位或情況中。語本宋．朱熹《四書章句集注．中庸章句．第二○章》。"},{"key":"光天化日",
"zu":"ㄍㄨㄤ　ㄊ｜ㄢ　ㄏㄨㄚˋ　ㄖˋ",
"han":"guāng tiān huà rì",
"def":"「光天」，指陽光普照之天。語出《書經．益稷》。「化日」，指承平無事之日。語本漢．王符〈愛日篇〉。「光天化日」指政治清明的太平盛世。後亦用「光天化日」比喻在大白天裡，人人都看得清楚的場合。"},{"key":"粗茶淡飯",
"zu":"ㄘㄨ　ㄔㄚˊ　ㄉㄢˋ　ㄈㄢˋ",
"han":"cū chá dàn fàn",
"def":"「粗茶淡飯」之「粗」，典源作「麤」。「麤」通「粗」。簡單清淡的飲食。語本宋．黃庭堅〈四休居士詩并序〉。△「家常便飯」"},{"key":"鐘鳴鼎食",
"zu":"ㄓㄨㄥ　ㄇ｜ㄥˊ　ㄉ｜ㄥˇ　ㄕˊ",
"han":"zhōng míng dǐng shí",
"def":"「鐘鳴鼎食」之「鐘」，典源作「鍾」。「鍾」通「鐘」。古代富貴人家吃飯時，擊鐘為號，列鼎而食。形容富貴之家的奢侈豪華。＃語本《史記．卷一二九．貨殖列傳》。"},{"key":"鐵石心腸",
"zu":"ㄊ｜ㄝˇ　ㄕˊ　ㄒ｜ㄣ　ㄔㄤˊ",
"han":"tiě shí xīn cháng",
"def":"像鐵石鑄成的心腸。形容人剛強而不為感情所動的秉性。語本《魏武故事》。"},{"key":"安身立命",
"zu":"ㄢ　ㄕㄣ　ㄌ｜ˋ　ㄇ｜ㄥˋ",
"han":"ān shēn lì mìng",
"def":"「安身」，居處得以容身。語出《呂氏春秋．有始覽．諭大》。「立命」，修身養性以奉天命。語出《孟子．盡心上》。「安身立命」指居處得以容身，生活便有著落，精神上亦有所寄託。"},{"key":"躍然紙上",
"zu":"ㄩㄝˋ　ㄖㄢˊ　ㄓˇ　ㄕㄤˋ",
"han":"yuè rán zhǐ shàng",
"def":"像在紙上跳動一般。形容描繪的對象非常生動逼真。※語或出清．薛雪《一瓢詩話》。△「栩栩如生」"},{"key":"安然無恙",
"zu":"ㄢ　ㄖㄢˊ　ㄨˊ　｜ㄤˋ",
"han":"ān rán wú yàng",
"def":"恙，禍患、疾病、憂慮。「安然無恙」指平安沒有疾病、禍患、憂慮等事故。語本《戰國策．齊策四》。"},{"key":"廬山真面目",
"zu":"ㄌㄨˊ　ㄕㄢ　ㄓㄣ　ㄇ｜ㄢˋ　ㄇㄨˋ",
"han":"lú shān zhēn miàn mù",
"def":"比喻事物的真相或原本面目。語出宋．蘇軾〈題西林壁〉詩。"},{"key":"深思熟慮",
"zu":"ㄕㄣ　ㄙ　ㄕㄡˊ　ㄌㄩˋ",
"han":"shēn sī shóu lǜ",
"def":"「深思」，深遠的思考。語出戰國楚．屈原〈漁父〉。「熟慮」，考慮周密。語出《史記．卷七二．穰侯列傳》。後用「深思熟慮」指仔細而深入地考慮。△「深謀遠慮」"},{"key":"平分秋色",
"zu":"ㄆ｜ㄥˊ　ㄈㄣ　ㄑ｜ㄡ　ㄙㄜˋ",
"han":"píng fēn qiū sè",
"def":"「平分秋色」，典源作「平分四時」，意思是一年被平均分成春夏秋冬四時。※＃語或本戰國楚．宋玉〈九辯〉。「平分秋色」指中秋時分。亦用於指平均分配好處。亦用於形容二者一樣出色，分不出高下。"},{"key":"躍躍欲試",
"zu":"ㄩㄝˋ　ㄩㄝˋ　ㄩˋ　ㄕˋ",
"han":"yuè yuè yù shì",
"def":"心動技癢，急切地想嘗試一下。※語或本宋．穆修〈送李秀才歸泉南序〉。△「蠢蠢欲動」"},{"key":"自強不息",
"zu":"ㄗˋ　ㄑ｜ㄤˊ　ㄅㄨˋ　ㄒ｜ˊ",
"han":"zì qiáng bù xí",
"def":"自己不斷努力向上，永不懈怠。語出《易經．乾卦．象》。"},{"key":"掩人耳目",
"zu":"｜ㄢˇ　ㄖㄣˊ　ㄦˇ　ㄇㄨˋ",
"han":"yǎn rén ěr mù",
"def":"遮蔽別人的耳目。比喻用假象欺騙、蒙蔽他人。語本《大宋宣和遺事．亨集》。"},{"key":"耳熟能詳",
"zu":"ㄦˇ　ㄕㄡˊ　ㄋㄥˊ　ㄒ｜ㄤˊ",
"han":"ěr shóu néng xiáng",
"def":"聽得非常熟悉，而能詳盡地知道或說出來。語本宋．歐陽修〈瀧岡阡表〉。"},{"key":"自食其力",
"zu":"ㄗˋ　ㄕˊ　ㄑ｜ˊ　ㄌ｜ˋ",
"han":"zì shí qí lì",
"def":"憑藉自己的勞力養活自己。語本《漢書．卷二四．食貨志上》。"},{"key":"老驥伏櫪",
"zu":"ㄌㄠˇ　ㄐ｜ˋ　ㄈㄨˊ　ㄌ｜ˋ",
"han":"lǎo jì fú lì",
"def":"好馬雖老了，伏在馬槽邊，仍想奔跑千里的路程。比喻年雖老而仍懷雄心壯志。＃語本三國魏．武帝〈步出夏門行〉。△「老當益壯」"},{"key":"行雲流水",
"zu":"ㄒ｜ㄥˊ　ㄩㄣˊ　ㄌ｜ㄡˊ　ㄕㄨㄟˇ",
"han":"xíng yún liú shuǐ",
"def":"一) 飄動的浮雲，流動的水。形容待人處事或文章字畫飄逸自然，無拘無束。＃語出宋．蘇軾〈與謝民師推官書〉。(二) 比喻平淡自然的事物。語出《警世通言．卷二．莊子休鼓盆成大道》。△「出神入化」"},{"key":"安分守己",
"zu":"ㄢ　ㄈㄣˋ　ㄕㄡˇ　ㄐ｜ˇ",
"han":"ān fèn shǒu jǐ",
"def":"安於本分，謹守其身。語出宋．袁文《瓮牖閑評．卷八》。△「循規蹈矩」"},{"key":"瞠目結舌",
"zu":"ㄔㄥ　ㄇㄨˋ　ㄐ｜ㄝˊ　ㄕㄜˊ",
"han":"chēng mù jié shé",
"def":"「瞠目」，睜大眼睛。※語或出宋．洪邁《夷堅志．丁志．卷一．金陵邸》。「結舌」，說不出話。語出《漢書．卷七五．眭兩夏侯京翼李傳．李尋》。「瞠目結舌」形容吃驚、受窘的樣子。△「張口結舌」"},{"key":"臨深履薄",
"zu":"ㄌ｜ㄣˊ　ㄕㄣ　ㄌㄩˇ　ㄅㄛˊ",
"han":"lín shēn lǚ bó",
"def":"臨，靠近。履，踩踏。「臨深履薄」指走近深淵，踩在薄冰上。比喻戒慎恐懼，十分小心。語本《詩經．小雅．小旻》。△「如臨深淵」、「如履薄冰」、「暴虎馮河」、「戰戰兢兢」"},{"key":"見義勇為",
"zu":"ㄐ｜ㄢˋ　｜ˋ　ㄩㄥˇ　ㄨㄟˊ",
"han":"jiàn yì yǒng wéi",
"def":"看到合乎正義的事，就奮勇去做。語本《論語．為政》。△「急公好義」"},{"key":"忍無可忍",
"zu":"ㄖㄣˇ　ㄨˊ　ㄎㄜˇ　ㄖㄣˇ",
"han":"rěn wú kě rěn",
"def":"「忍無可忍」之「無」，典源作「不」。「忍不可忍」原指忍受不能夠忍受的事。語本《三國志．卷二四．魏書．韓崔高孫王傳．孫禮》。後用「忍無可忍」指忍耐到了極點，無法再忍受。"},{"key":"捷足先登",
"zu":"ㄐ｜ㄝˊ　ㄗㄨˊ　ㄒ｜ㄢ　ㄉㄥ",
"han":"jié zú xiān dēng",
"def":"捷，快速。「捷足先登」比喻行動最快者先達到目的。語本《史記．卷九二．淮陰侯列傳》。△「逐鹿中原」"},{"key":"形單影隻",
"zu":"ㄒ｜ㄥˊ　ㄉㄢ　｜ㄥˇ　ㄓ",
"han":"xíng dān yǐng zhī",
"def":"隻，孤獨的、單獨的。「形單影隻」指身形與影子都是孤獨的。形容孤單無伴。語出唐．韓愈〈祭十二郎文〉。△「孑然一身」、「孤苦伶仃」"},{"key":"李代桃僵",
"zu":"ㄌ｜ˇ　ㄉㄞˋ　ㄊㄠˊ　ㄐ｜ㄤ",
"han":"lǐ dài táo jiāng",
"def":"李樹代替桃樹受蟲咬而枯死。語本樂府古辭〈雞鳴〉。後用「李代桃僵」比喻以此代彼或代人受過。"},{"key":"隱姓埋名",
"zu":"｜ㄣˇ　ㄒ｜ㄥˋ　ㄇㄞˊ　ㄇ｜ㄥˊ",
"han":"yǐn xìng mái míng",
"def":"隱瞞姓名，不讓別人知道真實的身分。＃語出元．王子一《誤入桃源．第一折》。△「晦跡埋名」"},{"key":"輾轉反側",
"zu":"ㄓㄢˇ　ㄓㄨㄢˇ　ㄈㄢˇ　ㄘㄜˋ",
"han":"zhǎn zhuǎn fǎn cè",
"def":"形容因心事重重而翻來覆去睡不著覺。語出《詩經．周南．關雎》。△「窈窕淑女」、「夢寐以求」"},{"key":"冷嘲熱諷",
"zu":"ㄌㄥˇ　ㄔㄠˊ　ㄖㄜˋ　ㄈㄥˋ",
"han":"lěng cháo rè fèng",
"def":"形容尖酸、刻薄的嘲笑和諷刺。※語或本清．袁枚《牘外餘言》。△「冷言冷語」、「冷敲熱罵」、「熱唱冷嘲」"},{"key":"張口結舌",
"zu":"ㄓㄤ　ㄎㄡˇ　ㄐ｜ㄝˊ　ㄕㄜˊ",
"han":"zhāng kǒu jié shé",
"def":"結舌，舌頭打結。「張口結舌」形容恐懼慌張，或理屈說不出話的樣子。◎語本《莊子．秋水》。△「邯鄲學步」、「啞口無言」、「瞠目結舌」"},{"key":"安如泰山",
"zu":"ㄢ　ㄖㄨˊ　ㄊㄞˋ　ㄕㄢ",
"han":"ān rú tài shān",
"def":"「安如泰山」之「泰山」，典源作「太山」。「太山」即「泰山」。形容安定穩固如泰山一般，不可動搖。＃語本漢．焦贛《焦氏易林．卷一．坤之中孚》。"},{"key":"百聞不如一見",
"zu":"ㄅㄞˇ　ㄨㄣˊ　ㄅㄨˋ　ㄖㄨˊ　｜　ㄐ｜ㄢˋ",
"han":"bǎi wén bù rú yī jiàn",
"def":"聽別人述說千百遍，不如親眼看一次來得真確。語出《漢書．卷六九．趙充國辛慶忌傳．趙充國》。△「聞之不若見之」"},{"key":"魂飛魄散",
"zu":"ㄏㄨㄣˊ　ㄈㄟ　ㄆㄛˋ　ㄙㄢˋ",
"han":"hún fēi pò sàn",
"def":"一) 魂魄離開身體，形容非常恐懼害怕。※語或出宋．劉宰〈鴉去鵲來篇〉詩。△「魂不附體」、「魂亡魄失」(二) 魂魄離開身體，指死亡。※語或本《西遊記．第四一回》。(三) 魂魄離開身體，形容心神不寧、恍惚迷亂。※語或出宋．羅燁《醉翁談錄．甲集．卷二．張氏夜奔呂星哥》。"},{"key":"細水長流",
"zu":"ㄒ｜ˋ　ㄕㄨㄟˇ　ㄔㄤˊ　ㄌ｜ㄡˊ",
"han":"xì shuǐ cháng liú",
"def":"「細水長流」典源作「小水長流」，細、小同義；長、常義近。謂水流細而能常久流動，比喻力量微小而能持之以恆，終有所成。語本《佛遺教經》。後亦用「細水長流」形容節約使用財物，而長久不缺。"},{"key":"養尊處優",
"zu":"｜ㄤˇ　ㄗㄨㄣ　ㄔㄨˇ　｜ㄡ",
"han":"yǎng zūn chǔ yōu",
"def":"自處尊貴，生活優裕。語出宋．蘇洵〈上韓樞密書〉。△「嬌生慣養」"},{"key":"難能可貴",
"zu":"ㄋㄢˊ　ㄋㄥˊ　ㄎㄜˇ　ㄍㄨㄟˋ",
"han":"nán néng kě guì",
"def":"難能，不容易做到。「難能可貴」指做到了不容易做到的事，所以特別可貴。＃語出宋．蘇軾〈荀卿論〉。"},{"key":"脫胎換骨",
"zu":"ㄊㄨㄛ　ㄊㄞ　ㄏㄨㄢˋ　ㄍㄨˇ",
"han":"tuō tāi huàn gǔ",
"def":"「脫胎」，脫去凡胎。語出唐．呂巖〈寄白龍洞劉道人〉詩。「換骨」，脫換凡人之俗骨而成仙。語出唐．呂巖〈七言〉詩其二。「脫胎換骨」原指經過修煉和服食丹藥，脫去凡胎，換俗骨為仙骨。後用以比喻澈底改變，亦用以比喻作詩文雖效法別人，但不露痕跡，且能創出新意。△「洗心革面」"},{"key":"養虎遺患",
"zu":"｜ㄤˇ　ㄏㄨˇ　｜ˊ　ㄏㄨㄢˋ",
"han":"yǎng hǔ yí huàn",
"def":"飼養老虎，最後為自己帶來災禍。比喻不除去仇敵、惡人，將給自己留下後患。語出《史記．卷七．項羽本紀》。△「縱虎歸山」、「養癰遺患」"},{"key":"奮不顧身",
"zu":"ㄈㄣˋ　ㄅㄨˋ　ㄍㄨˋ　ㄕㄣ",
"han":"fèn bù gù shēn",
"def":"奮勇向前，不顧生死。＃語出漢．司馬遷〈報任少卿書〉。△「大謬不然」、「戴盆望天」"},{"key":"身敗名裂",
"zu":"ㄕㄣ　ㄅㄞˋ　ㄇ｜ㄥˊ　ㄌ｜ㄝˋ",
"han":"shēn bài míng liè",
"def":"事業、地位喪失，名譽毀壞。指人澈底失敗。※語或本宋．辛棄疾〈賀新郎．綠樹聽鵜鴃〉詞。△「身歿名滅」、「聲名狼藉」"},{"key":"潛移默化",
"zu":"ㄑ｜ㄢˊ　｜ˊ　ㄇㄛˋ　ㄏㄨㄚˋ",
"han":"qián yí mò huà",
"def":"人的思想、性格或習慣受到影響，不知不覺中起了變化。語本北齊．顏之推《顏氏家訓．慕賢》。△「耳濡目染」"},{"key":"輕而易舉",
"zu":"ㄑ｜ㄥ　ㄦˊ　｜ˋ　ㄐㄩˇ",
"han":"qīng ér yì jǔ",
"def":"重量輕而容易舉起。形容非常輕鬆，毫不費力。語出宋．朱熹《詩集傳．卷一八．大雅．烝民》。"},{"key":"漠不關心",
"zu":"ㄇㄛˋ　ㄅㄨˋ　ㄍㄨㄢ　ㄒ｜ㄣ",
"han":"mò bù guān xīn",
"def":"冷冷淡淡，不加關心。※語或出明．朱之瑜〈與岡崎昌純書〉二首之二。△「漫不經心」"},{"key":"笑逐顏開",
"zu":"ㄒ｜ㄠˋ　ㄓㄨˊ　｜ㄢˊ　ㄎㄞ",
"han":"xiào zhú yán kāi",
"def":"逐，隨著。開，舒展。「笑逐顏開」指笑容隨著顏面舒展開來。形容心中喜悅而眉開眼笑的樣子。語出《京本通俗小說．西山一窟鬼》。"},{"key":"牛衣對泣",
"zu":"ㄋ｜ㄡˊ　｜　ㄉㄨㄟˋ　ㄑ｜ˋ",
"han":"niú yī duì qì",
"def":"牛衣，給牛隻禦寒遮雨的衣物，多用麻草編成。「牛衣對泣」指漢代王章家貧，沒有被子蓋，生大病時只能睡在牛衣之中，他自料必死，於是對妻涕泣訣別。典出《漢書．卷七六．趙尹韓張兩王傳．王章》。後用「牛衣對泣」比喻夫妻共度貧困的生活。"},{"key":"舞文弄墨",
"zu":"ㄨˇ　ㄨㄣˊ　ㄋㄨㄥˋ　ㄇㄛˋ",
"han":"wǔ wén nòng mò",
"def":"一) 墨，繩墨、法度。指玩弄法條作弊，敗壞法紀。語本《隋書．卷八五．王充列傳》。△「舞文弄法」(二) 指寫作、寫字，借以比喻賣弄筆墨文辭。※語或出《三國演義．第四三回》。"},{"key":"披肝瀝膽",
"zu":"ㄆ｜　ㄍㄢ　ㄌ｜ˋ　ㄉㄢˇ",
"han":"pī gān lì dǎn",
"def":"比喻赤誠相待，忠貞不二。語出隋．李德林〈天命論〉。△「肝膽相照」、「肝膽照人」、「披肝膽」"},{"key":"事與願違",
"zu":"ㄕˋ　ㄩˇ　ㄩㄢˋ　ㄨㄟˊ",
"han":"shì yǔ yuàn wéi",
"def":"事實和願望相違背。＃語出三國魏．嵇康〈幽憤〉詩。"},{"key":"暢所欲言",
"zu":"ㄔㄤˋ　ㄙㄨㄛˇ　ㄩˋ　｜ㄢˊ",
"han":"chàng suǒ yù yán",
"def":"痛痛快快、毫無顧忌地把想說的話全部講出來。語本宋．黃庭堅〈與王周彥長書〉。"},{"key":"目不見睫",
"zu":"ㄇㄨˋ　ㄅㄨˋ　ㄐ｜ㄢˋ　ㄐ｜ㄝˊ",
"han":"mù bù jiàn jié",
"def":"眼睛看不見自己的睫毛。比喻見遠而不能見近。＃語本《韓非子．喻老》。後亦用「目不見睫」比喻人無自知之明，不能看見自己的過失。"},{"key":"兩面三刀",
"zu":"ㄌ｜ㄤˇ　ㄇ｜ㄢˋ　ㄙㄢ　ㄉㄠ",
"han":"liǎng miàn sān dāo",
"def":"比喻陰險狡猾，耍兩面手法，挑撥是非。語出元．李行道《灰闌記．第二折》。"},{"key":"拋頭露面",
"zu":"ㄆㄠ　ㄊㄡˊ　ㄌㄨˋ　ㄇ｜ㄢˋ",
"han":"pāo tóu lù miàn",
"def":"舊時婦女守在閨房，不輕易出門。因此外出不規避生人，稱為「拋頭露面」。※語或本《封神演義．第三二回》。後泛指公開出現在大眾面前。"},{"key":"雨後春筍",
"zu":"ㄩˇ　ㄏㄡˋ　ㄔㄨㄣ　ㄙㄨㄣˇ",
"han":"yǔ hòu chūn sǔn",
"def":"春筍在雨後長得又多又快。＃語本宋．趙蕃〈過易簡彥從〉詩。後用以比喻事物在某一時期新生之後大量湧現，迅速發展。"},{"key":"盡忠報國",
"zu":"ㄐ｜ㄣˋ　ㄓㄨㄥ　ㄅㄠˋ　ㄍㄨㄛˊ",
"han":"jìn zhōng bào guó",
"def":"竭盡忠誠，報效國家。＃語出《周書．卷四○．顏之儀列傳》。"},{"key":"金城湯池",
"zu":"ㄐ｜ㄣ　ㄔㄥˊ　ㄊㄤ　ㄔˊ",
"han":"jīn chéng tāng chí",
"def":"金城，金屬造的城。湯池，沸水流動的護城河。「金城湯池」形容堅固險阻的城池。＃語出《漢書．卷四五．蒯伍江息夫傳．蒯通》。"},{"key":"戮力同心",
"zu":"ㄌㄨˋ　ㄌ｜ˋ　ㄊㄨㄥˊ　ㄒ｜ㄣ",
"han":"lù lì tóng xīn",
"def":"齊心合力，團結一致。＃語出《墨子．尚賢中》。△「同心同德」、「同心協力」、「群策群力」"},{"key":"枉費心機",
"zu":"ㄨㄤˇ　ㄈㄟˋ　ㄒ｜ㄣ　ㄐ｜",
"han":"wǎng fèi xīn jī",
"def":"白白地浪費心思。形容徒勞無功。語出宋．劉克莊〈諸公載酒賀余休致水村農卿有詩次韻〉詩一○首之一○。△「枉費思慮」"},{"key":"憂心如焚",
"zu":"｜ㄡ　ㄒ｜ㄣ　ㄖㄨˊ　ㄈㄣˊ",
"han":"yōu xīn rú fén",
"def":"內心憂慮有如火在焚燒。形容非常焦急憂慮。語本《詩經．小雅．節南山》。△「憂心忡忡」"},{"key":"以毒攻毒",
"zu":"｜ˇ　ㄉㄨˊ　ㄍㄨㄥ　ㄉㄨˊ",
"han":"yǐ dú gōng dú",
"def":"用有毒的藥物來治療毒瘡等疾病。語本唐．神清《北山集．卷六．譏異說》。後亦用「以毒攻毒」比喻用狠毒的手段來對付狠毒的手段或人。"},{"key":"目無全牛",
"zu":"ㄇㄨˋ　ㄨˊ　ㄑㄩㄢˊ　ㄋ｜ㄡˊ",
"han":"mù wú quán niú",
"def":"眼中沒有整頭牛的形體，比喻道的修養不受外形限制的境界。典出《莊子．養生主》。後用「目無全牛」比喻技藝純熟高超。△「庖丁解牛」、「善刀而藏」、「遊刃有餘」、「躊躇滿志」"},{"key":"搜索枯腸",
"zu":"ㄙㄡ　ㄙㄨㄛˇ　ㄎㄨ　ㄔㄤˊ",
"han":"sōu suǒ kū cháng",
"def":"搜尋枯空的肚腸。語本唐．盧仝〈走筆謝孟諫議寄新茶〉詩 。後用「搜索枯腸」比喻竭力思索。△「兩腋生風」、「挖空心思」"},{"key":"金戈鐵馬",
"zu":"ㄐ｜ㄣ　ㄍㄜ　ㄊ｜ㄝˇ　ㄇㄚˇ",
"han":"jīn gē tiě mǎ",
"def":"「金戈」，金屬製的戈。語出南朝齊．謝朓〈為皇太子侍華光殿曲水宴〉詩。「鐵馬」，披上裝甲的馬。語出南朝梁．陸倕〈石闕銘〉。「金戈鐵馬」形容戰士的雄壯英姿，或比喻戰事。"},{"key":"近水樓臺",
"zu":"ㄐ｜ㄣˋ　ㄕㄨㄟˇ　ㄌㄡˊ　ㄊㄞˊ",
"han":"jìn shuǐ lóu tái",
"def":"靠近水邊的樓臺。比喻占得地利之便，先得機會。語出宋．俞文豹《清夜錄．卷五○》。　"},{"key":"四分五裂",
"zu":"ㄙˋ　ㄈㄣ　ㄨˇ　ㄌ｜ㄝˋ",
"han":"sì fēn wǔ liè",
"def":"四方受敵，國土易被分解割裂。語出《戰國策．魏策一》。後用「四分五裂」形容分散而不完整、不團結。△「高枕無憂」"},{"key":"壽比南山",
"zu":"ㄕㄡˋ　ㄅ｜ˇ　ㄋㄢˊ　ㄕㄢ",
"han":"shòu bǐ nán shān",
"def":"壽命如南山那樣長久。為祝人長壽之辭。語本《詩經．小雅．天保》。"},{"key":"美中不足",
"zu":"ㄇㄟˇ　ㄓㄨㄥ　ㄅㄨˋ　ㄗㄨˊ",
"han":"měi zhōng bù zú",
"def":"事物雖美，但仍有缺陷。※語或出明．吾丘瑞《運甓記．第二三齣》。"},{"key":"枯木逢春",
"zu":"ㄎㄨ　ㄇㄨˋ　ㄈㄥˊ　ㄔㄨㄣ",
"han":"kū mù féng chūn",
"def":"乾枯的樹木遇上了春天，又恢復了生命力。語本敦煌變文《山遠公話》。後用「枯木逢春」比喻雖處於絕境卻重獲生機，或劣境忽然轉好。"},{"key":"腹背受敵",
"zu":"ㄈㄨˋ　ㄅㄟˋ　ㄕㄡˋ　ㄉ｜ˊ",
"han":"fù bèi shòu dí",
"def":"前、後都受到敵人的攻擊。＃語出《魏書．卷三五．崔浩列傳》。"},{"key":"過猶不及",
"zu":"ㄍㄨㄛˋ　｜ㄡˊ　ㄅㄨˋ　ㄐ｜ˊ",
"han":"guò yóu bù jí",
"def":"做事過分就好比做得不夠一樣，皆不妥當；指事情要做得恰到好處。語出《論語．先進》。"},{"key":"咬牙切齒",
"zu":"｜ㄠˇ　｜ㄚˊ　ㄑ｜ㄝˋ　ㄔˇ",
"han":"yǎo yá qiè chǐ",
"def":"咬緊牙齒，表示非常悲痛憤恨。※語或本《韓非子．守道》。△「痛心疾首」"},{"key":"威風凜凜",
"zu":"ㄨㄟ　ㄈㄥ　ㄌ｜ㄣˇ　ㄌ｜ㄣˇ",
"han":"wēi fēng lǐn lǐn",
"def":"威武的氣概逼人，令人敬畏的樣子。語出宋．吳自牧《夢粱錄．卷二．州府節制諸軍春教》。△「英風凜凜」"},{"key":"身無長物",
"zu":"ㄕㄣ　ㄨˊ　ㄓㄤˋ　ㄨˋ",
"han":"shēn wú zhàng wù",
"def":"長物，多餘的物品。長，音ㄓㄤˋ。「身無長物」指身邊沒有任何多餘的物品。比喻節儉或貧困。語本南朝宋．劉義慶《世說新語．德行》。"},{"key":"義無反顧",
"zu":"｜ˋ　ㄨˊ　ㄈㄢˇ　ㄍㄨˋ",
"han":"yì wú fǎn gù",
"def":"秉持正義，勇往直前，絕不退縮。語本漢．司馬相如〈喻巴蜀檄〉。△「責無旁貸」、「義不容辭」、「當仁不讓」、「寡廉鮮恥」"},{"key":"裝模作樣",
"zu":"ㄓㄨㄤ　ㄇㄛˊ　ㄗㄨㄛˋ　｜ㄤˋ",
"han":"zhuāng mó zuò yàng",
"def":"「裝模作樣」原作「作模作樣」，指勤下工夫，苦心經營，極為堅持的模樣。語本《鎮州臨濟慧照禪師語錄》。後演變作「裝模作樣」，謂故意做作，不是出於自然的表現。△「裝腔作勢」、「矯揉造作」"},{"key":"裝腔作勢",
"zu":"ㄓㄨㄤ　ㄑ｜ㄤ　ㄗㄨㄛˋ　ㄕˋ",
"han":"zhuāng qiāng zuò shì",
"def":"「裝腔作勢」之「裝腔」，典源作「□模」。「□」，妝的俗字，與「裝」音同義近，常混用。「裝腔作勢」指故意裝出某種腔調或姿態。※語或本元．蕭德祥《殺狗勸夫．第四折》。△「裝模作樣」、「矯揉造作」"},{"key":"愁眉苦臉",
"zu":"ㄔㄡˊ　ㄇㄟˊ　ㄎㄨˇ　ㄌ｜ㄢˇ",
"han":"chóu méi kǔ liǎn",
"def":"眉頭緊皺，苦喪著臉。形容憂傷、愁苦的神色。※語或出《儒林外史．第四七回》。△「愁眉不展」、「愁眉淚眼」"},{"key":"枵腹從公",
"zu":"ㄒ｜ㄠ　ㄈㄨˋ　ㄘㄨㄥˊ　ㄍㄨㄥ",
"han":"xiāo fù cóng gōng",
"def":"枵腹，空著肚子。「枵腹從公」指餓著肚子辦理公務，形容不顧己身，勤於公事。※語或出《活地獄．楔子》。"},{"key":"入室操戈",
"zu":"ㄖㄨˋ　ㄕˋ　ㄘㄠ　ㄍㄜ",
"han":"rù shì cāo gē",
"def":"進入房間中，拿起主人的戈來攻擊主人。比喻持對方的論點來反駁對方。＃語本《後漢書．卷三五．張曹鄭列傳．鄭玄》。△「同室操戈」"},{"key":"趁火打劫",
"zu":"ㄔㄣˋ　ㄏㄨㄛˇ　ㄉㄚˇ　ㄐ｜ㄝˊ",
"han":"chèn huǒ dǎ jié",
"def":"趁人家裡失火時搶劫財物。比喻乘人之危，從中取利。※語或出清．徐珂《清稗類鈔．盜賊類．趁火打劫》。"},{"key":"勢均力敵",
"zu":"ㄕˋ　ㄐㄩㄣ　ㄌ｜ˋ　ㄉ｜ˊ",
"han":"shì jūn lì dí",
"def":"「勢均力敵」之「均」，典源作「鈞」。「鈞」通「均」。指雙方力量情勢相當，不分上下。＃語本《逸周書．卷八．史記解》。△「智均力敵」、「旗鼓相當」"},{"key":"相知恨晚",
"zu":"ㄒ｜ㄤ　ㄓ　ㄏㄣˋ　ㄨㄢˇ",
"han":"xiāng zhī hèn wǎn",
"def":"憾恨相知不早。語本《史記．卷一○七．魏其武安侯列傳》。△「相見恨晚」"},{"key":"貽笑大方",
"zu":"｜ˊ　ㄒ｜ㄠˋ　ㄉㄚˋ　ㄈㄤ",
"han":"yí xiào dà fāng",
"def":"貽笑，遺留笑柄。「貽笑大方」指被識見廣博或精通此道的內行人所譏笑。語本《莊子．秋水》。△「大方之家」、「望洋興嘆」"},{"key":"無能為力",
"zu":"ㄨˊ　ㄋㄥˊ　ㄨㄟˊ　ㄌ｜ˋ",
"han":"wú néng wéi lì",
"def":"「無能為力」，典源作「無能為」。指沒有能力做好某事。語本《左傳．隱公四年》。△「無能為役」"},{"key":"方寸已亂",
"zu":"ㄈㄤ　ㄘㄨㄣˋ　｜ˇ　ㄌㄨㄢˋ",
"han":"fāng cùn yǐ luàn",
"def":"方寸，指心。「方寸已亂」形容心緒煩亂。語本《三國志．卷三五．蜀書．諸葛亮傳》。"},{"key":"殺人如麻",
"zu":"ㄕㄚ　ㄖㄣˊ　ㄖㄨˊ　ㄇㄚˊ",
"han":"shā rén rú má",
"def":"所殺的人如亂麻一般多。形容殺人極多。※＃語或本《史記．卷二七．天官書》。"},{"key":"風平浪靜",
"zu":"ㄈㄥ　ㄆ｜ㄥˊ　ㄌㄤˋ　ㄐ｜ㄥˋ",
"han":"fēng píng làng jìng",
"def":"無風無浪。語出宋．楊萬里〈泊光口〉詩。後用「風平浪靜」比喻平靜無事或情勢穩定。△「風恬浪靜」"},{"key":"子虛烏有",
"zu":"ㄗˇ　ㄒㄩ　ㄨ　｜ㄡˇ",
"han":"zǐ xū wū yǒu",
"def":"子虛和烏有都是漢代司馬相如〈子虛賦〉中虛構的人物。＃典出《史記．卷一一七．司馬相如列傳》。後用「子虛烏有」比喻為假設而非實有的事物。"},{"key":"通宵達旦",
"zu":"ㄊㄨㄥ　ㄒ｜ㄠ　ㄉㄚˊ　ㄉㄢˋ",
"han":"tōng xiāo dá dàn",
"def":"一整夜到天亮。※語或本《北齊書．卷四．文宣帝紀》。後亦用「通宵達旦」形容徹夜地工作。△「夜以繼日」"},{"key":"氣急敗壞",
"zu":"ㄑ｜ˋ　ㄐ｜ˊ　ㄅㄞˋ　ㄏㄨㄞˋ",
"han":"qì jí bài huài",
"def":"上氣不接下氣，狼狽不堪的樣子。形容十分慌張的樣子。※語或出《水滸傳．第五回》。後亦用「氣急敗壞」形容惱怒的樣子。"},{"key":"雪上加霜",
"zu":"ㄒㄩㄝˇ　ㄕㄤˋ　ㄐ｜ㄚ　ㄕㄨㄤ",
"han":"xuě shàng jiā shuāng",
"def":"雪害又加上霜害，是害上加害。比喻苦上加苦。※◎語或本《景德傳燈錄．卷八．大陽和尚》。後用「雪上加霜」比喻禍患接踵而至，使傷害加重。"},{"key":"尸位素餐",
"zu":"ㄕ　ㄨㄟˋ　ㄙㄨˋ　ㄘㄢ",
"han":"shī wèi sù cān",
"def":"「尸位」，空居職位而無所作為。語出《書經．五子之歌》。「素餐」，無功勞而空享俸祿。語出《詩經．魏風．伐檀》。「尸位素餐」指空居職位享受俸祿而不盡職守。"},{"key":"循序漸進",
"zu":"ㄒㄩㄣˊ　ㄒㄩˋ　ㄐ｜ㄢˋ　ㄐ｜ㄣˋ",
"han":"xún xù jiàn jìn",
"def":"按照一定的次序與步驟逐漸推進。語本唐．韓愈〈答竇秀才書〉。△「按部就班」"},{"key":"野心勃勃",
"zu":"｜ㄝˇ　ㄒ｜ㄣ　ㄅㄛˊ　ㄅㄛˊ",
"han":"yě xīn bó bó",
"def":"「野心」，山野中野獸之心。比喻心性放縱，難以制服。語出《左傳．宣公四年》。「勃勃」，旺盛的樣子。語出《淮南子．時則》。「野心勃勃」形容狂妄非分之心或企圖。"},{"key":"無法無天",
"zu":"ㄨˊ　ㄈㄚˇ　ㄨˊ　ㄊ｜ㄢ",
"han":"wú fǎ wú tiān",
"def":"沒有法紀、天理。形容人肆意妄為毫無顧忌。※語或出明．月榭主人《釵釧記．審問》。"},{"key":"人言可畏",
"zu":"ㄖㄣˊ　｜ㄢˊ　ㄎㄜˇ　ㄨㄟˋ",
"han":"rén yán kě wèi",
"def":"指眾人的流言蜚語是可怕的。語本《詩經．鄭風．將仲子》。"},{"key":"坐立不安",
"zu":"ㄗㄨㄛˋ　ㄌ｜ˋ　ㄅㄨˋ　ㄢ",
"han":"zuò lì bù ān",
"def":"形容焦急、煩躁，心神不寧的樣子。※語或本《周書．卷四七．藝術列傳．姚僧垣》。△「忐忑不安」"},{"key":"好高騖遠",
"zu":"ㄏㄠˋ　ㄍㄠ　ㄨˋ　ㄩㄢˇ",
"han":"hào gāo wù yuǎn",
"def":"騖，追求，從事。「好高騖遠」指一味地嚮往高遠的目標而不切實際。語本《宋史．卷四二七．道學列傳一．程顥》。△「好高務外」、「好高慕大」"},{"key":"孺子可教",
"zu":"ㄖㄨˊ　ㄗˇ　ㄎㄜˇ　ㄐ｜ㄠˋ",
"han":"rú zǐ kě jiào",
"def":"孺子，小孩子。「孺子可教」指年輕人可以教誨栽培。用於稱許之意。語出《史記．卷五五．留侯世家》。"},{"key":"將信將疑",
"zu":"ㄐ｜ㄤ　ㄒ｜ㄣˋ　ㄐ｜ㄤ　｜ˊ",
"han":"jiāng xìn jiāng yí",
"def":"將，又、且。「將信將疑」表示又有點相信，又有點疑惑。形容對事情的真假，無法明確判斷。語出唐．李華〈弔古戰場文〉。△「半信不信」"},{"key":"一傅眾咻",
"zu":"｜　ㄈㄨˋ　ㄓㄨㄥˋ　ㄒ｜ㄡ",
"han":"yī fù zhòng xiū",
"def":"傅，教導。咻，喧擾。「一傅眾咻」指一個人教，眾人在旁喧嘩干擾。比喻學習受到干擾，難有成效。語本《孟子．滕文公下》。後亦用於比喻寡不勝眾。"},{"key":"微乎其微",
"zu":"ㄨㄟˊ　ㄏㄨ　ㄑ｜ˊ　ㄨㄟˊ",
"han":"wéi hū qí wéi",
"def":"「微」有衰微或微小、精微等意。「微乎其微」形容極其衰微。語本《爾雅．釋訓》。後用「微乎其微」形容事物極其細小或精微。"},{"key":"蓬頭垢面",
"zu":"ㄆㄥˊ　ㄊㄡˊ　ㄍㄡˋ　ㄇ｜ㄢˋ",
"han":"péng tóu gòu miàn",
"def":"形容人頭髮散亂、面容骯髒的樣子。語本《漢書．卷九九．王莽傳上》。△「不修邊幅」"},{"key":"草草了事",
"zu":"ㄘㄠˇ　ㄘㄠˇ　ㄌ｜ㄠˇ　ㄕˋ",
"han":"cǎo cǎo liǎo shì",
"def":"「草草」，匆促、急忙的樣子。※語或出唐．杜甫〈送長孫九侍御赴武威判官詩〉。「了事」，解決事情。※語或出《新五代史．卷五四．雜傳．鄭珏》。「草草了事」指匆忙隨便地解決事情。△「草率從事」"},{"key":"紛至沓來",
"zu":"ㄈㄣ　ㄓˋ　ㄊㄚˋ　ㄌㄞˊ",
"han":"fēn zhì tà lái",
"def":"紛，眾多。沓，重覆。「紛至沓來」形容事物紛紛不斷地到來。＃語出宋．朱熹〈答何叔京書〉其六。△「接踵而來」"},{"key":"洞天福地",
"zu":"ㄉㄨㄥˋ　ㄊ｜ㄢ　ㄈㄨˊ　ㄉ｜ˋ",
"han":"dòng tiān fú dì",
"def":"洞天，道教中稱神仙統治之處。福地，道教中稱真人統治與得道之所。「洞天福地」即指神仙居住或修道的地方。語本唐．李冲昭《南嶽小錄．敘嶽》。後亦用「洞天福地」形容環境極為優美舒適的名山勝境。"},{"key":"揚長而去",
"zu":"｜ㄤˊ　ㄔㄤˊ　ㄦˊ　ㄑㄩˋ",
"han":"yáng cháng ér qù",
"def":"掉頭不理，大模大樣地離去。※語或本《金瓶梅詞話．第二三回》。"},{"key":"不辨菽麥",
"zu":"ㄅㄨˋ　ㄅ｜ㄢˋ　ㄕㄨˊ　ㄇㄞˋ",
"han":"bù biàn shú mài",
"def":"菽，豆子。「不辨菽麥」指無法分別豆子與麥子。形容人愚昧無知、缺乏常識。語出《左傳．成公十八年》。△「頗別菽麥」"},{"key":"得魚忘筌",
"zu":"ㄉㄜˊ　ㄩˊ　ㄨㄤˋ　ㄑㄩㄢˊ",
"han":"dé yú wàng quán",
"def":"筌，捕魚用的竹器。「得魚忘筌」指捕到魚後，便忘掉了捕魚的器具。比喻悟道者忘其形骸。語出《莊子．外物》。後亦用「得魚忘筌」比喻人在達到目的成功後就忘掉賴以成功的手段或憑藉物。△「得兔忘蹄」、「得意忘言」"},{"key":"綱舉目張",
"zu":"ㄍㄤ　ㄐㄩˇ　ㄇㄨˋ　ㄓㄤ",
"han":"gāng jǔ mù zhāng",
"def":"綱，網的大繩。目，網的孔眼。「綱舉目張」比喻能執其要領，則細節自能順理而成。＃語本《呂氏春秋．離俗覽．用民》。後亦用「綱舉目張」比喻條理分明。"},{"key":"鷸蚌相爭",
"zu":"ㄩˋ　ㄅㄤˋ　ㄒ｜ㄤ　ㄓㄥ",
"han":"yù bàng xiāng zhēng",
"def":"比喻雙方爭執不相讓，必會造成兩敗俱傷，讓第三者獲得利益。典出《戰國策．燕策二》。△「漁人得利」、「鷸蚌相持，漁人得利」"},{"key":"鑄成大錯",
"zu":"ㄓㄨˋ　ㄔㄥˊ　ㄉㄚˋ　ㄘㄨㄛˋ",
"han":"zhù chéng dà cuò",
"def":"錯，銼刀，即「鑢」。磋治骨角銅鐵的工具。「鑄成大錯」指以鐵鑄出大的銼刀。以「錯」亦有「錯誤」之意，因而雙關比喻造成重大的錯誤。＃典出《資治通鑑．卷二六五．唐紀八一．昭宣帝天祐三年》。"},{"key":"瞭如指掌",
"zu":"ㄌ｜ㄠˇ　ㄖㄨˊ　ㄓˇ　ㄓㄤˇ",
"han":"liǎo rú zhǐ zhǎng",
"def":"瞭，明白、清楚。指掌，指著自己的手掌。「瞭如指掌」表示對事情的了解如手掌般的清楚。語本《論語．八佾》。後用「瞭如指掌」比喻對事情的狀況了解得非常清楚。△「一目了然」"},{"key":"與虎謀皮",
"zu":"ㄩˇ　ㄏㄨˇ　ㄇㄡˊ　ㄆ｜ˊ",
"han":"yǔ hǔ móu pí",
"def":"比喻所謀者與對方有利害衝突，事情必辦不成。※語或本《符子》。"},{"key":"尋章摘句",
"zu":"ㄒㄩㄣˊ　ㄓㄤ　ㄓㄞ　ㄐㄩˋ",
"han":"xún zhāng zhāi jù",
"def":"讀書時著重搜求、摘取漂亮詞句，而少深入研究。語出《吳書》。後亦用以指寫作時，多套用前人的章法、語句，而不講究創意。"},{"key":"堅壁清野",
"zu":"ㄐ｜ㄢ　ㄅ｜ˋ　ㄑ｜ㄥ　｜ㄝˇ",
"han":"jiān bì qīng yě",
"def":"堅壁，堅固堡壁，使敵人不易攻破；清野，清除郊野的糧草房舍，轉移可用的人員和物資，使敵人欠缺補給而無法久戰。「堅壁清野」指一種作戰策略，使敵人即使在攻下據點之後，也無法長期占領。＃語出《後漢書．卷七○．鄭孔荀列傳．荀彧》。"},{"key":"應聲蟲",
"zu":"｜ㄥˋ　ㄕㄥ　ㄔㄨㄥˊ",
"han":"yìng shēng chóng",
"def":"隨聲答和的昆蟲。＃典出唐．劉餗《隋唐嘉話．卷中》。後用以比喻胸無定見，隨聲附和的人。"},{"key":"曾參殺人",
"zu":"ㄗㄥ　ㄕㄣ　ㄕㄚ　ㄖㄣˊ",
"han":"zēng shēn shā rén",
"def":"本指謠傳，久聽而信，後比喻流言可畏或稱誣枉的災禍。典出《戰國策．秦策二》。△「曾母投杼」"},{"key":"倒屣相迎",
"zu":"ㄉㄠˋ　ㄒ｜ˇ　ㄒ｜ㄤ　｜ㄥˊ",
"han":"dào xǐ xiāng yíng",
"def":"因急著迎接客人，而將鞋子穿倒了。語本《三國志．卷二一．魏書．王衛二劉傅傳．王粲》。後用「倒屣相迎」比喻熱情迎接賓客。△「屣履出迎」"},{"key":"堂堂正正",
"zu":"ㄊㄤˊ　ㄊㄤˊ　ㄓㄥˋ　ㄓㄥˋ",
"han":"táng táng zhèng zhèng",
"def":"堂堂，壯盛；正正，嚴整。「堂堂正正」指軍陣強大整齊。語本《孫子．軍爭》。後用「堂堂正正」形容光明正大。△「以逸待勞」"},{"key":"盡善盡美",
"zu":"ㄐ｜ㄣˋ　ㄕㄢˋ　ㄐ｜ㄣˋ　ㄇㄟˇ",
"han":"jìn shàn jìn měi",
"def":"形式優美，內容完好。語本《論語．八佾》。後用「盡善盡美」形容事物的完善美滿已達極限。△「十全十美」"},{"key":"首屈一指",
"zu":"ㄕㄡˇ　ㄑㄩ　｜　ㄓˇ",
"han":"shǒu qū yī zhǐ",
"def":"彎下手指計算時，首先彎曲大拇指。用以表示第一或最優秀。※語或本宋．高斯得〈次韻不浮弟自金陵相過〉詩。△「數一數二」"},{"key":"眾望所歸",
"zu":"ㄓㄨㄥˋ　ㄨㄤˋ　ㄙㄨㄛˇ　ㄍㄨㄟ",
"han":"zhòng wàng suǒ guī",
"def":"深得眾人擁護、愛戴。＃語出《高僧傳．卷一．晉長安帛遠》。"},{"key":"肅然起敬",
"zu":"ㄙㄨˋ　ㄖㄢˊ　ㄑ｜ˇ　ㄐ｜ㄥˋ",
"han":"sù rán qǐ jìng",
"def":"因受感動而莊嚴地興起欽佩恭敬之心。語本南朝宋．劉義慶《世說新語．規箴》。"},{"key":"鴻鵠之志",
"zu":"ㄏㄨㄥˊ　ㄏㄨˊ　ㄓ　ㄓˋ",
"han":"hóng hú zhī zhì",
"def":"鴻鵠，即天鵝，秋天南飛避寒，一飛千里。「鴻鵠之志」言像鴻鵠一舉千里般的壯志，比喻志向遠大。語出《呂氏春秋．士容論》。"},{"key":"坦腹東床",
"zu":"ㄊㄢˇ　ㄈㄨˋ　ㄉㄨㄥ　ㄔㄨㄤˊ",
"han":"tǎn fù dōng chuáng",
"def":"坦露腹部，臥於東床。指當女婿，或指稱女婿。＃典出晉．王隱《晉書》。"},{"key":"鳥盡弓藏",
"zu":"ㄋ｜ㄠˇ　ㄐ｜ㄣˋ　ㄍㄨㄥ　ㄘㄤˊ",
"han":"niǎo jìn gōng cáng",
"def":"飛鳥射盡之後，就將弓箭收藏起來。比喻事成之後，有功之人卻遭到殺戮或疏遠的命運。＃語本《淮南子．說林》。△「兔死狗烹」、「鳥盡弓藏，兔死狗烹」"},{"key":"揭竿而起",
"zu":"ㄐ｜ㄝ　ㄍㄢ　ㄦˊ　ㄑ｜ˇ",
"han":"jiē gān ér qǐ",
"def":"高舉竹竿作為號召、指揮群眾的旗幟。本指秦末陳涉倉促起義，反抗暴秦的事跡。＃語本漢．賈誼〈過秦論〉。後用「揭竿而起」比喻起義舉事。"},{"key":"逼上梁山",
"zu":"ㄅ｜　ㄕㄤˋ　ㄌ｜ㄤˊ　ㄕㄢ",
"han":"bī shàng liáng shān",
"def":"《水滸傳》中寫林冲因遭到誣陷，刺配滄州，終被逼上梁山，落草為寇。典出《水滸傳．第一一回》。後用「逼上梁山」比喻被迫走上絕路，而做出自己不想做或不應做的事。"},{"key":"形影不離",
"zu":"ㄒ｜ㄥˊ　｜ㄥˇ　ㄅㄨˋ　ㄌ｜ˊ",
"han":"xíng yǐng bù lí",
"def":"形容關係密切，不能分開。語本《呂氏春秋．孝行覽．首時》。後亦用「形影不離」形容關係親密，無時無處不在一起。△「如影隨形」、「形影相隨」"},{"key":"下里巴人",
"zu":"ㄒ｜ㄚˋ　ㄌ｜ˇ　ㄅㄚ　ㄖㄣˊ",
"han":"xià lǐ bā rén",
"def":"戰國時代楚國的民間通俗歌曲。語出戰國楚．宋玉〈對楚王問〉。後用「下里巴人」泛指通俗的文學藝術。△「曲高和寡」、「陽春白雪」"},{"key":"不謀而合",
"zu":"ㄅㄨˋ　ㄇㄡˊ　ㄦˊ　ㄏㄜˊ",
"han":"bù móu ér hé",
"def":"事前未經商量，後來意見作為卻一致。語本《漢書．卷一○○．敘傳上》。△「不約而同」、「不謀而信」"},{"key":"一決雌雄",
"zu":"｜　ㄐㄩㄝˊ　ㄘ　ㄒㄩㄥˊ",
"han":"yī jué cī xióng",
"def":"比喻互相較量以決定勝敗、高下。語本《史記．卷七．項羽本紀》。△「一決勝負」、「決一死戰」"},{"key":"反覆無常",
"zu":"ㄈㄢˇ　ㄈㄨˋ　ㄨˊ　ㄔㄤˊ",
"han":"fǎn fù wú cháng",
"def":"形容變動不定，沒有定準。※語或本南朝梁．費昶〈行路難〉詩二首之一。△「出爾反爾」、「朝三暮四」、「朝秦暮楚」"},{"key":"方枘圓鑿",
"zu":"ㄈㄤ　ㄖㄨㄟˋ　ㄩㄢˊ　ㄗㄠˊ",
"han":"fāng ruì yuán záo",
"def":"枘，一端削成方形的短木頭。鑿，器物上可鑲嵌東西的下凹部分。方的枘配上圓的鑿，比喻不能相容。＃語本戰國楚．宋玉〈九辯〉。△「格格不入」"},{"key":"依樣畫葫蘆",
"zu":"｜　｜ㄤˋ　ㄏㄨㄚˋ　ㄏㄨˊ　ㄌㄨˊ",
"han":"yī yàng huà hú lú",
"def":"依照葫蘆的樣子畫葫蘆。比喻一味模仿，毫無創見。※＃語或出宋．魏泰《東軒筆錄．卷一》。△「如法炮製」"},{"key":"秋風過耳",
"zu":"ㄑ｜ㄡ　ㄈㄥ　ㄍㄨㄛˋ　ㄦˇ",
"han":"qiū fēng guò ěr",
"def":"秋風從耳邊吹過。比喻漠不關心、毫不在意。語出漢．趙曄《吳越春秋．吳王壽夢傳》。△「耳邊風」、「馬耳東風」"},{"key":"氣象萬千",
"zu":"ㄑ｜ˋ　ㄒ｜ㄤˋ　ㄨㄢˋ　ㄑ｜ㄢ",
"han":"qì xiàng wàn qiān",
"def":"形容景象千變萬化，極為壯觀。語出宋．范仲淹〈岳陽樓記〉。"},{"key":"哀鴻遍野",
"zu":"ㄞ　ㄏㄨㄥˊ　ㄅ｜ㄢˋ　｜ㄝˇ",
"han":"āi hóng biàn yě",
"def":"找不到棲身之所的鴻鴈，悲傷哀痛地鳴叫。語本《詩經．小雅．鴻鴈》。後用「哀鴻遍野」比喻到處都是流離失所的難民。"},{"key":"師心自用",
"zu":"ㄕ　ㄒ｜ㄣ　ㄗˋ　ㄩㄥˋ",
"han":"shī xīn zì yòng",
"def":"師心，以自我之意為師。「師心自用」指人固執己見，自以為是。語本《莊子．齊物論》。△「剛愎自用」"},{"key":"簞食壺漿",
"zu":"ㄉㄢ　ㄙˋ　ㄏㄨˊ　ㄐ｜ㄤ",
"han":"dān sì hú jiāng",
"def":"以簞盛食，以壺盛漿來迎王師。指軍隊受到人民的擁護與愛戴，紛紛慰勞犒賞。語出《孟子．梁惠王下》。△「水深火熱」"},{"key":"駭人聽聞",
"zu":"ㄏㄞˋ　ㄖㄣˊ　ㄊ｜ㄥ　ㄨㄣˊ",
"han":"hài rén tīng wén",
"def":"令人聽了十分震驚。語本《隋書．卷六九．王劭列傳》。△「危言聳聽」、「聳人聽聞」"},{"key":"厲兵秣馬",
"zu":"ㄌ｜ˋ　ㄅ｜ㄥ　ㄇㄛˋ　ㄇㄚˇ",
"han":"lì bīng mò mǎ",
"def":"磨利兵器，餵飽馬匹。指完成作戰準備。語出《左傳．僖公三十三年》。後亦用「厲兵秣馬」比喻完成事前準備工作。△「嚴陣以待」"},{"key":"燕雀處堂",
"zu":"｜ㄢˋ　ㄑㄩㄝˋ　ㄔㄨˇ　ㄊㄤˊ",
"han":"yàn què chǔ táng",
"def":"在住家築巢的燕雀，不知火就要燒到屋梁，完全沒有警覺災禍將至。比喻身處危境而不自知，毫無警惕之心。＃語本《孔叢子．論勢》。"},{"key":"結草銜環",
"zu":"ㄐ｜ㄝˊ　ㄘㄠˇ　ㄒ｜ㄢˊ　ㄏㄨㄢˊ",
"han":"jié cǎo xián huán",
"def":"「結草」，指魏顆救父妾，而獲老人結草禦敵的故事。比喻死後報恩。典出《左傳．宣公十五年》。「銜環」，指楊寶救一隻黃雀，後得黃衣童子以四枚白玉環相報的故事。比喻報恩。典出南朝梁．吳均《續齊諧記》。「結草銜環」比喻至死不忘感恩圖報。"},{"key":"疾風勁草",
"zu":"ㄐ｜ˊ　ㄈㄥ　ㄐ｜ㄥˋ　ㄘㄠˇ",
"han":"jí fēng jìng cǎo",
"def":"「疾風勁草」，典源作「疾風知勁草」，指經過猛烈大風的吹襲，才知道堅韌的草挺立不倒。比喻在艱難困苦的環境下，才能考驗出人的堅強意志和節操。＃語本《東觀漢記．卷一○．王霸列傳》。"},{"key":"偃武修文",
"zu":"｜ㄢˇ　ㄨˇ　ㄒ｜ㄡ　ㄨㄣˊ",
"han":"yǎn wǔ xiū wén",
"def":"偃息武備，提倡文教。語出《書經．武成》。"},{"key":"禍起蕭牆",
"zu":"ㄏㄨㄛˋ　ㄑ｜ˇ　ㄒ｜ㄠ　ㄑ｜ㄤˊ",
"han":"huò qǐ xiāo qiáng",
"def":"蕭牆，用以區隔內外的門屏，指內部。「禍起蕭牆」比喻禍亂發生於內部。語本《論語．季氏》。△「分崩離析」"},{"key":"甚囂塵上",
"zu":"ㄕㄣˋ　ㄒ｜ㄠ　ㄔㄣˊ　ㄕㄤˋ",
"han":"shèn xiāo chén shàng",
"def":"喧譁嘈雜，塵沙飛揚，原指軍隊作戰前的準備情況。語出《左傳．成公十六年》。後用「甚囂塵上」形容傳聞四起，議論紛紛；或指極為猖狂、囂張。"},{"key":"捉襟見肘",
"zu":"ㄓㄨㄛ　ㄐ｜ㄣ　ㄒ｜ㄢˋ　ㄓㄡˇ",
"han":"zhuō jīn xiàn zhǒu",
"def":"「捉襟見肘」之「襟」，典源作「衿」。「衿」同「襟」。見，音ㄒ｜ㄢˋ，露出。「捉襟見肘」形容人衣衫破敗，才抓住衣襟蔽胸，又露出了手肘。＃語本《莊子．讓王》。後用「捉襟見肘」比喻短缺不足、窮於應付的窘態。△「納屨踵決」、「踵決肘見」、「顧此失彼」"},{"key":"超群絕倫",
"zu":"ㄔㄠ　ㄑㄩㄣˊ　ㄐㄩㄝˊ　ㄌㄨㄣˊ",
"han":"chāo qún jué lún",
"def":"高過一般的等級，無人可比。形容才能出眾。語本《三國志．卷三六．蜀書．關張馬黃趙傳．關羽》。△「出類拔萃」"},{"key":"良藥苦口",
"zu":"ㄌ｜ㄤˊ　｜ㄠˋ　ㄎㄨˇ　ㄎㄡˇ",
"han":"liáng yào kǔ kǒu",
"def":"能治好病的藥，多味苦難嚥。比喻諫言多不順耳，但卻有益於人。＃語本《韓非子．外儲說左上》。△「忠言逆耳」、「良藥苦口，忠言逆耳」"},{"key":"忘年之交",
"zu":"ㄨㄤˋ　ㄋ｜ㄢˊ　ㄓ　ㄐ｜ㄠ",
"han":"wàng nián zhī jiāo",
"def":"不拘年歲行輩而結交為友。＃語本晉．張隱《文士傳》。△「爾汝之交」"},{"key":"自出機杼",
"zu":"ㄗˋ　ㄔㄨ　ㄐ｜　ㄓㄨˋ",
"han":"zì chū jī zhù",
"def":"比喻詩文的組織、構思，別出心裁，獨創新意。語出《魏書．卷八二．祖瑩列傳》。後用「自出機杼」比喻獨創新意、風格。△「別出心裁」"},{"key":"防患未然",
"zu":"ㄈㄤˊ　ㄏㄨㄢˋ　ㄨㄟˋ　ㄖㄢˊ",
"han":"fáng huàn wèi rán",
"def":"趁禍患還未發生之前就加以防備。語本《易經．既濟卦》。△「未雨綢繆」、「防微杜漸」"}]


module.exports=idioms;
});
require.register("idiom_search_react-api/index.js", function(exports, require, module){
//var othercomponent=Require("other"); 
//new module filename must be added to scripts section of ./component.js and export here
var api = {
 search: require("./search"),
 searchDef: require("./searchDef")
}

module.exports=api;
});
require.register("idiom_search_react-api/search.js", function(exports, require, module){
var dataset=Require("dataset"); 
var search=function(tofind){
	return dataset.idioms.filter(function(item){
		return item.key.indexOf(tofind)>-1;
	})
	/*return [ 
	  "走馬看花",
	  "花花世界",
	  "花好月圓"
	]*/
}; 

module.exports=search;
});
require.register("idiom_search_react-api/searchDef.js", function(exports, require, module){
var dataset=Require("dataset"); 
var searchDef=function(tofind){
	return dataset.idioms.filter(function(item){
		return item.def.indexOf(tofind)>-1;
	})
	/*return [ 
	  "走馬看花",
	  "花花世界",
	  "花好月圓"
	]*/
}; 

module.exports=searchDef;
});
require.register("idiom_search_react/index.js", function(exports, require, module){
var boot=require("boot");
boot("idiom_search_react","main","main");
});






















require.alias("ksanaforge-boot/index.js", "idiom_search_react/deps/boot/index.js");
require.alias("ksanaforge-boot/index.js", "idiom_search_react/deps/boot/index.js");
require.alias("ksanaforge-boot/index.js", "boot/index.js");
require.alias("ksanaforge-boot/index.js", "ksanaforge-boot/index.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "idiom_search_react/deps/bootstrap/dist/js/bootstrap.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "idiom_search_react/deps/bootstrap/index.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "bootstrap/index.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "brighthas-bootstrap/index.js");
require.alias("ksana-document/index.js", "idiom_search_react/deps/ksana-document/index.js");
require.alias("ksana-document/document.js", "idiom_search_react/deps/ksana-document/document.js");
require.alias("ksana-document/api.js", "idiom_search_react/deps/ksana-document/api.js");
require.alias("ksana-document/xml.js", "idiom_search_react/deps/ksana-document/xml.js");
require.alias("ksana-document/template_accelon.js", "idiom_search_react/deps/ksana-document/template_accelon.js");
require.alias("ksana-document/persistent.js", "idiom_search_react/deps/ksana-document/persistent.js");
require.alias("ksana-document/tokenizers.js", "idiom_search_react/deps/ksana-document/tokenizers.js");
require.alias("ksana-document/markup.js", "idiom_search_react/deps/ksana-document/markup.js");
require.alias("ksana-document/typeset.js", "idiom_search_react/deps/ksana-document/typeset.js");
require.alias("ksana-document/sha1.js", "idiom_search_react/deps/ksana-document/sha1.js");
require.alias("ksana-document/users.js", "idiom_search_react/deps/ksana-document/users.js");
require.alias("ksana-document/customfunc.js", "idiom_search_react/deps/ksana-document/customfunc.js");
require.alias("ksana-document/configs.js", "idiom_search_react/deps/ksana-document/configs.js");
require.alias("ksana-document/projects.js", "idiom_search_react/deps/ksana-document/projects.js");
require.alias("ksana-document/indexer.js", "idiom_search_react/deps/ksana-document/indexer.js");
require.alias("ksana-document/indexer_kd.js", "idiom_search_react/deps/ksana-document/indexer_kd.js");
require.alias("ksana-document/kdb.js", "idiom_search_react/deps/ksana-document/kdb.js");
require.alias("ksana-document/kdbfs.js", "idiom_search_react/deps/ksana-document/kdbfs.js");
require.alias("ksana-document/kdbw.js", "idiom_search_react/deps/ksana-document/kdbw.js");
require.alias("ksana-document/kdb_sync.js", "idiom_search_react/deps/ksana-document/kdb_sync.js");
require.alias("ksana-document/kdbfs_sync.js", "idiom_search_react/deps/ksana-document/kdbfs_sync.js");
require.alias("ksana-document/html5fs.js", "idiom_search_react/deps/ksana-document/html5fs.js");
require.alias("ksana-document/kse.js", "idiom_search_react/deps/ksana-document/kse.js");
require.alias("ksana-document/kde.js", "idiom_search_react/deps/ksana-document/kde.js");
require.alias("ksana-document/boolsearch.js", "idiom_search_react/deps/ksana-document/boolsearch.js");
require.alias("ksana-document/search.js", "idiom_search_react/deps/ksana-document/search.js");
require.alias("ksana-document/plist.js", "idiom_search_react/deps/ksana-document/plist.js");
require.alias("ksana-document/excerpt.js", "idiom_search_react/deps/ksana-document/excerpt.js");
require.alias("ksana-document/link.js", "idiom_search_react/deps/ksana-document/link.js");
require.alias("ksana-document/tibetan/wylie.js", "idiom_search_react/deps/ksana-document/tibetan/wylie.js");
require.alias("ksana-document/languages.js", "idiom_search_react/deps/ksana-document/languages.js");
require.alias("ksana-document/diff.js", "idiom_search_react/deps/ksana-document/diff.js");
require.alias("ksana-document/xml4kdb.js", "idiom_search_react/deps/ksana-document/xml4kdb.js");
require.alias("ksana-document/buildfromxml.js", "idiom_search_react/deps/ksana-document/buildfromxml.js");
require.alias("ksana-document/tei.js", "idiom_search_react/deps/ksana-document/tei.js");
require.alias("ksana-document/concordance.js", "idiom_search_react/deps/ksana-document/concordance.js");
require.alias("ksana-document/regex.js", "idiom_search_react/deps/ksana-document/regex.js");
require.alias("ksana-document/index.js", "idiom_search_react/deps/ksana-document/index.js");
require.alias("ksana-document/index.js", "ksana-document/index.js");
require.alias("ksana-document/index.js", "ksana-document/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "idiom_search_react/deps/fileinstaller/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "idiom_search_react/deps/fileinstaller/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "fileinstaller/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-fileinstaller/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-fileinstaller/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-checkbrowser/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-fileinstaller/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-fileinstaller/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-htmlfs/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "ksanaforge-fileinstaller/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "idiom_search_react/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "idiom_search_react/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-checkbrowser/index.js");
require.alias("ksanaforge-htmlfs/index.js", "idiom_search_react/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "idiom_search_react/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-htmlfs/index.js");
require.alias("idiom_search_react-main/index.js", "idiom_search_react/deps/main/index.js");
require.alias("idiom_search_react-main/index.js", "idiom_search_react/deps/main/index.js");
require.alias("idiom_search_react-main/index.js", "main/index.js");
require.alias("idiom_search_react-main/index.js", "idiom_search_react-main/index.js");
require.alias("idiom_search_react-comp1/index.js", "idiom_search_react/deps/comp1/index.js");
require.alias("idiom_search_react-comp1/index.js", "idiom_search_react/deps/comp1/index.js");
require.alias("idiom_search_react-comp1/index.js", "comp1/index.js");
require.alias("idiom_search_react-comp1/index.js", "idiom_search_react-comp1/index.js");
require.alias("idiom_search_react-results/index.js", "idiom_search_react/deps/results/index.js");
require.alias("idiom_search_react-results/index.js", "idiom_search_react/deps/results/index.js");
require.alias("idiom_search_react-results/index.js", "results/index.js");
require.alias("idiom_search_react-results/index.js", "idiom_search_react-results/index.js");
require.alias("idiom_search_react-dataset/index.js", "idiom_search_react/deps/dataset/index.js");
require.alias("idiom_search_react-dataset/idioms.js", "idiom_search_react/deps/dataset/idioms.js");
require.alias("idiom_search_react-dataset/index.js", "idiom_search_react/deps/dataset/index.js");
require.alias("idiom_search_react-dataset/index.js", "dataset/index.js");
require.alias("idiom_search_react-dataset/index.js", "idiom_search_react-dataset/index.js");
require.alias("idiom_search_react-api/index.js", "idiom_search_react/deps/api/index.js");
require.alias("idiom_search_react-api/search.js", "idiom_search_react/deps/api/search.js");
require.alias("idiom_search_react-api/searchDef.js", "idiom_search_react/deps/api/searchDef.js");
require.alias("idiom_search_react-api/index.js", "idiom_search_react/deps/api/index.js");
require.alias("idiom_search_react-api/index.js", "api/index.js");
require.alias("idiom_search_react-api/index.js", "idiom_search_react-api/index.js");
require.alias("idiom_search_react/index.js", "idiom_search_react/index.js");
if (typeof exports == 'object') {
  module.exports = require('idiom_search_react');
} else if (typeof define == 'function' && define.amd) {
  define(function(){ return require('idiom_search_react'); });
} else {
  window['idiom_search_react'] = require('idiom_search_react');
}})();