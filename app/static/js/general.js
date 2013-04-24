/*jslint nomen: true*/
/*global define*/
define([
    'backbone'
], function (Backbone) {
    "use strict";
    var onReset = function () {
        Backbone.history.loadUrl();
    };
    // uniq_hash = [];
    // var add_hash = function () {
    //     if(window.workspace){
    //         var rs = /^[#\/]|\s+$/g;
    //         var rr = _.map(_.filter(_.keys(workspace.routes),function(i){return i.indexOf("*")===-1;}),function(i){return workspace._routeToRegExp(i);});
    //         var cur_hashs = _.uniq(_.map($("a"), function (i) {return i.hash.replace(rs,'');}));
    //         var inroutes = function(routes, hash) {return _.every(routes,function(i){return !i.test(hash);});};
    //         while ((h = cur_hashs.pop())) {
    //             if (inroutes(rr,h)) {
    //                 if (uniq_hash.indexOf(h) == -1) {
    //                     uniq_hash.push(h);
    //                 }
    //             }
    //         }
    //     }
    // };
    return onReset;
});
