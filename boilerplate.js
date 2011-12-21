/*
 *  Project: 
 *  Description: 
 *  Author: 
 *  License: MIT
 */

// The semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.
;(function($) {
  
  // Change this to a name of your choosing :)
  var pluginName = 'rawnet5000';
  
  // The main function accepts zero, one, or two arguments. If given, the first argument 
  // may be a string indicating the action to perform OR an options hash to override the 
  // defaults. If the first argument is a string, the options hash may be passed in as a 
  // second argument.
  
  $.fn[pluginName] = function() {
    var args = Array.prototype.slice.call(arguments),
        actn = 'init',
        opts = {},
        auto = true;
        
    // If the first argument is a string, it represents the action to invoke. The options 
    // hash may be supplied as a second argument.
    if (typeof args[0] == 'string') {
      auto = false;
      actn = args[0];
      opts = args[1] || opts;
    // If the first argument is present but isn't a string, it represents the options hash. 
    // In this situation the action needs to be guessed and for now is assumed to be "init".
    } else {
      opts = args[0] || opts;
    }
    
    // Merge the options passed in into the default global options for our plugin.
    opts = $.extend({}, $.fn[pluginName].options, opts);
    
    // Execute the plugin against each dom element in the jQuery selection.
    return this.each(function() {
      var elem = $(this),
          data = elem.data(pluginName);
          
      // If the action hasn't been supplied explicitly, and elem.data(pluginName) returns 
      // something truthy, then the action is assumed to be "update".
      if (auto && data) {
        actn = 'update';
      }
      
      // Something truthy should be defined in elem.data(pluginName) once the plugin 
      // has been initialised against the element. This may be overridden to store 
      // something else instead, for example a controls object.
      if (!data) {
        elem.data(pluginName, true);
      }
      
      // Call the appropriate action.
      methods[actn].call(elem, opts);
    });
  };
  
  // Global options (can be modified by the plugin user). Any options passed to the main 
  // function will be merged with this set.
  // Usage (outside of this plugin script):
  //   $.fn.pluginName.options.key = 'newValue';
  //   $.fn.pluginName.options = { key: 'newValue' };
  
  $.fn[pluginName].options = {
    
  };
  
  // The main functions used by our plugin. Within these functions, "this" refers to the 
  // target element as a jQuery object.
  
  var methods = {
    init: function(options) {
      // ...
    },
    
    update: function(options) {
      // ...
    }
  }
    
}(jQuery));