var Project = Backbone.Model.extend({
    icon: function () {
        switch (this.get('status')) {
            case "active":
                return "icon-play";
            case "archived":
                return "icon-stop";
            case "on_hold":
                return "icon-pause";
        }
    }
});
var Company = Backbone.Model.extend();
var Person = Backbone.Model.extend({
    name: function () {
        return this.get('first-name') + ' ' + this.get('last-name')
    }
});
var Post = Backbone.Model.extend();
var Attachment = Backbone.Model.extend();
var CalendarEntry = Backbone.Model.extend();
var Category = Backbone.Model.extend();
var TimeEntry = Backbone.Model.extend();
var TodoItem = Backbone.Model.extend();
var TodoList = Backbone.Model.extend();
var Comment = Backbone.Model.extend();
var MyModel = Person.extend({
    defaults: {
        id: null,
    },
    url: "/api/me.xml"
});
