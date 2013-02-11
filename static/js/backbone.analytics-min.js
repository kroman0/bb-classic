// Created by Kendall Buchanan, (https://github.com/kendagriff)
// Modified by Paul English, (https://github.com/nrub)
// MIT licence
// Version 0.0.2
(function(){var e=Backbone.History.prototype.loadUrl;Backbone.History.prototype.loadUrl=function(t){var n=e.apply(this,arguments),r=this.fragment=this.getFragment(t);return/^\//.test(r)||(r="/"+r),window._gaq!==undefined&&window._gaq.push(["_trackPageview",r]),n}}).call(this);