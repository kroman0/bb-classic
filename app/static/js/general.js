/*jslint white: true*/
(function(root, factory) {
    'use strict';
    if (typeof root.define === 'function' && root.define.amd) {
        // AMD. Register as the bbgeneral module.
        root.define('bbgeneral', ['backbone'], factory);
    } else {
        // Browser globals
        root.bbgeneral = factory(root.Backbone);
    }
}(this, function(Backbone) {
    'use strict';
    var bbgeneral = {};
//         uniq_hash = bbgeneral.uniq_hash = [];
    bbgeneral.onReset = function() {
        Backbone.history.loadUrl();
    };
//     bbgeneral.add_hash = function () {
//         if(window.BB && window.BB.workspace){
//             var h,
//                 rs = /^[#\/]|\s+$/g,
//                 rr = _.map(_.filter(_.keys(window.BB.workspace.routes),function(i){
//                     return i.indexOf("*")===-1;
//                 }),function(i){
//                     return window.BB.workspace._routeToRegExp(i);
//                 }),
//                 cur_hashs = _.uniq(_.map(Backbone.$("a"), function (i) {
//                     return i.hash.replace(rs,'');
//                 })),
//                 inroutes = function(routes, hash) {
//                     return _.every(routes,function(i){
//                         return !i.test(hash);
//                     });
//                 };
//             while ((h = cur_hashs.pop())) {
//                 if (inroutes(rr,h)) {
//                     if (uniq_hash.indexOf(h) === -1) {
//                         uniq_hash.push(h);
//                     }
//                 }
//             }
//         }
//     };
    return bbgeneral;
}));
