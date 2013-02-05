var onReset = function () {
    Backbone.history.loadUrl();
};
Backbone.Collection.prototype.fetchonce = function () {
    var fetched = this.fetched;
    if (!fetched) {
        this.fetched = true
        this.fetch({cache:true});
    }
    return fetched
};
Backbone.Collection.prototype.get_or_create = function (id) {
    if (!this[id]) {
        this[id] = this.clone();
        this[id].parent_id = id;
        this[id].on("reset", onReset);
    }
    return this[id]
};
Backbone.View.prototype.render = function () {
    this.$el.html(_.template($(this.template).html(), this, {variable: 'view'}));
    return this
};
uniq_hash = [];
var add_hash = function () {
    if(window.workspace){
        var rs = /^[#\/]|\s+$/g;
        var rr = _.map(_.filter(_.keys(workspace.routes),function(i){return i.indexOf("*")===-1}),function(i){return workspace._routeToRegExp(i)});
        var cur_hashs = _.uniq(_.map($("a"), function (i) {return i.hash.replace(rs,'')}));
        while ((h = cur_hashs.pop())) {
            if (_.every(rr,function(i){return !i.test(h)})) {
                if (uniq_hash.indexOf(h) == -1) {
                    uniq_hash.push(h)
                }
            }
        }
    }
};
