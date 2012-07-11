// =============
// jQuery plugin
// =============

;(function($) {

  $.rawnet = $.rawnet || {};

  // ==============
  // Cookie manager
  // source: MDN ==
  // ==============

  $.rawnet.cookies =  {
    // get cookie value by key
    get: function(key) {  
      if (!key || !this.exists(key)) { return null; }  
      return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));  
    },

    // set cookie value by key
    // optional:
    // - end: number (ms to expiry), string (GMT expiry date), or date object
    // - path: defaults to current path
    // - domain: defaults to current domain
    // - secure: defaults to false
    set: function(key, value, end, path, domain, secure) {  
      if (!key || /^(?:expires|max\-age|path|domain|secure)$/.test(key)) { return; }  
      var expires = "";  
      if (end) {  
        switch (typeof end) {  
          case "number": expires = "; max-age=" + end; break;  
          case "string": expires = "; expires=" + end; break;  
          case "object": if (end.hasOwnProperty("toGMTString")) { expires = "; expires=" + end.toGMTString(); } break;  
        }  
      }  
      document.cookie = escape(key) + "=" + escape(value) + expires + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "") + (secure ? "; secure" : "");  
    },

    // remove cookie by key
    remove: function(key) {  
      if (!key || !this.exists(key)) { return; }  
      var expDate = new Date();  
      expDate.setDate(expDate.getDate() - 1);  
      document.cookie = escape(key) + "=; expires=" + expDate.toGMTString() + "; path=/";  
    },

    // cookie existance by key
    exists: function(key) { return (new RegExp("(?:^|;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie); }  
  }

  // =============
  // Cookie notice
  // =============

  $.rawnet.cookieLaw = function(options) {
    // pass if the cookie is already present
    if (!$.rawnet.cookies.exists('ok_with_cookies')) {

      options = options || {};

      // jQuery objects
      var $container = $('<div/>'),
          $inner     = $('<div/>').appendTo($container),
          $link      = $('<a/>'),
          $button    = $('<a/>');

      // allow setting the target, eg _blank
      if (options.target) {
        $link.attr('target', options.target);
      }

      // text message to display with (optional) link to a policy document
      $inner.text((options.siteName || 'This site') + ' places cookies on your computer to help make this website better by tracking visits.');
      if (options.policyUrl) {
        $link.attr('href', options.policyUrl).text('click here');
        $inner.append(' To find out more about cookies ').append($link).append('.');
      }

      // "close" button
      $button.text('Close').attr('href', '#accept').appendTo($inner);

      // css for the container element
      $container.css({
        'background-color': 'white',
        'width': 'auto',
        'height': '40px',
        'border-top': 'solid 1px black',
        'position': 'fixed',
        'bottom': 0,
        'left': 0,
        'right': 0,
        '-webkit-box-shadow': '0 0 6px black',
        '-moz-box-shadow': '0 0 6px black',
        'box-shadow': '0 0 6px black',
        'z-index': 100
      });

      // css for the inner element
      $inner.css({
        'font-family': 'Arial',
        'width': '1000px',
        'height': '100%',
        'margin': '0 auto',
        'line-height': '40px',
        'color': '#666',
        'text-align': 'center',
        'font-size': '12px'
      });

      // css for the text link
      $link.css({
        'color': 'blue',
        'text-decoration': 'underline',
        'font-family': 'Arial',
        'font-size': '12px'
      });

      // css for the button link
      $button.css({
        'background-color': 'black',
        'font-size': '12px',
        'color': 'white',
        'padding': '5px 10px',
        'margin-left': '20px',
        'text-decoration': 'none'
      });

      // hijack button clicks
      $button.click(function(e) {
        e.preventDefault();
        $.rawnet.cookies.set('ok_with_cookies', '1', 31536000, '/'); // 1 year expiry
        $container.stop().animate({ bottom: -40 }, 300, function() {
          $container.remove();
        });
      });

      // inject into the page
      $container.appendTo('body');

    }
  }
    
}(jQuery));