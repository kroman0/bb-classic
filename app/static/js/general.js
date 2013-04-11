/*jslint nomen: true*/
/*global window, $, _, Backbone*/
(function () {
    "use strict";
    window.onReset = function () {
        Backbone.history.loadUrl();
    };
    var urlError = function () {
        throw new Error('A "url" property or function must be specified');
    };
    Backbone.Model.prototype.url = function () {
        var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
        if (!this.isNew()) {
            base = base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id) + '.xml';
        }
        return base;
    };
    Backbone.View.prototype.render = function () {
        this.$el.html(_.template($(this.template).html(), this, {variable: 'view'}));
        return this;
    };
    Backbone.View.prototype.renderitem = function (item) {
        return _.template($(this.itemtemplate).html(), item, {variable: 'item'});
    };
    Backbone.View.prototype.rendercomments = function (comments) {
        return _.template($('#comments-template').html(), comments, {variable: 'comments'});
    };
    Backbone.View.prototype.renderpager = function () {
        return _.template($('#pager-template').html(), this, {variable: 'view'});
    };
    Backbone.View.prototype.renderheader = function () {
        return _.template($('#header-template').html(), this, {variable: 'view'});
    };
    Backbone.View.prototype.renderprojectnav = function () {
        return _.template($('#project-nav-template').html(), this, {variable: 'view'});
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
}());
