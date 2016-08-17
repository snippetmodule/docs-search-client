(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  app.views.Search = (function(superClass) {
    var SEARCH_PARAM;

    extend(Search, superClass);

    function Search() {
      this.onRoot = bind(this.onRoot, this);
      this.onClick = bind(this.onClick, this);
      this.onEnd = bind(this.onEnd, this);
      this.onResults = bind(this.onResults, this);
      this.stackoverflow = bind(this.stackoverflow, this);
      this.google = bind(this.google, this);
      this.searchUrl = bind(this.searchUrl, this);
      this.onInput = bind(this.onInput, this);
      this.onReady = bind(this.onReady, this);
      this.autoFocus = bind(this.autoFocus, this);
      return Search.__super__.constructor.apply(this, arguments);
    }

    SEARCH_PARAM = app.config.search_param;

    Search.el = '._search';

    Search.activeClass = '_search-active';

    Search.elements = {
      input: '._search-input',
      resetLink: '._search-clear'
    };

    Search.events = {
      input: 'onInput',
      click: 'onClick',
      submit: 'onSubmit'
    };

    Search.shortcuts = {
      typing: 'autoFocus',
      altG: 'google',
      altS: 'stackoverflow'
    };

    Search.routes = {
      root: 'onRoot',
      after: 'autoFocus'
    };

    Search.prototype.init = function() {
      this.addSubview(this.scope = new app.views.SearchScope(this.el));
      this.searcher = new app.Searcher;
      this.searcher.on('results', this.onResults).on('end', this.onEnd);
      app.on('ready', this.onReady);
      $.on(window, 'hashchange', this.searchUrl);
      $.on(window, 'focus', this.autoFocus);
    };

    Search.prototype.focus = function() {
      if (document.activeElement !== this.input) {
        this.input.focus();
      }
    };

    Search.prototype.autoFocus = function() {
      if (!$.isTouchScreen()) {
        this.focus();
      }
    };

    Search.prototype.reset = function() {
      this.el.reset();
      this.onInput();
      this.autoFocus();
    };

    Search.prototype.onReady = function() {
      this.value = '';
      this.delay(this.onInput);
    };

    Search.prototype.onInput = function() {
      if ((this.value == null) || this.value === this.input.value) {
        return;
      }
      this.value = this.input.value;
      if (this.value.length) {
        this.search();
      } else {
        this.clear();
      }
    };

    Search.prototype.search = function(url) {
      if (url == null) {
        url = false;
      }
      this.addClass(this.constructor.activeClass);
      this.trigger('searching');
      this.hasResults = null;
      this.flags = {
        urlSearch: url,
        initialResults: true
      };
      this.searcher.find(this.scope.getScope().entries.all(), 'text', this.value);
    };

    Search.prototype.searchUrl = function() {
      var value;
      if (!app.router.isRoot()) {
        return;
      }
      this.scope.searchUrl();
      if (!(value = this.extractHashValue())) {
        return;
      }
      this.input.value = this.value = value;
      this.search(true);
      return true;
    };

    Search.prototype.clear = function() {
      this.removeClass(this.constructor.activeClass);
      return this.trigger('clear');
    };

    Search.prototype.externalSearch = function(url) {
      var value;
      if (value = this.value) {
        if (this.scope.name()) {
          value = (this.scope.name()) + " " + value;
        }
        $.popup("" + url + (encodeURIComponent(value)));
        this.reset();
      }
    };

    Search.prototype.google = function() {
      this.externalSearch("https://www.google.com/search?q=");
    };

    Search.prototype.stackoverflow = function() {
      this.externalSearch("https://stackoverflow.com/search?q=");
    };

    Search.prototype.onResults = function(results) {
      if (results.length) {
        this.hasResults = true;
      }
      this.trigger('results', results, this.flags);
      this.flags.initialResults = false;
    };

    Search.prototype.onEnd = function() {
      if (!this.hasResults) {
        this.trigger('noresults');
      }
    };

    Search.prototype.onClick = function(event) {
      if (event.target === this.resetLink) {
        $.stopEvent(event);
        this.reset();
        this.focus();
      }
    };

    Search.prototype.onSubmit = function(event) {
      $.stopEvent(event);
    };

    Search.prototype.onRoot = function(context) {
      if (!context.init) {
        this.reset();
      }
      if (context.hash) {
        this.delay(this.searchUrl);
      }
    };

    Search.prototype.extractHashValue = function() {
      var value;
      if ((value = this.getHashValue()) != null) {
        app.router.replaceHash();
        return value;
      }
    };

    Search.prototype.getHashValue = function() {
      var error, ref;
      try {
        return (ref = (new RegExp("#" + SEARCH_PARAM + "=(.*)")).exec($.urlDecode(location.hash))) != null ? ref[1] : void 0;
      } catch (error) {

      }
    };

    return Search;

  })(app.View);

}).call(this);