var Project = Backbone.Model.extend({
    urlRoot: "/api/projects/",
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
var Company = Backbone.Model.extend({
    urlRoot: "/api/companies/"
});
var Person = Backbone.Model.extend({
    urlRoot: "/api/people/",
    name: function () {
        return this.get('first-name') + ' ' + this.get('last-name');
    }
});
var Post = Backbone.Model.extend({
    urlRoot: "/api/posts/"
});
var Attachment = Backbone.Model.extend();
var CalendarEntry = Backbone.Model.extend({
    urlRoot: "/api/projects/#{project_id}/calendar_entries/"
});
var Category = Backbone.Model.extend({
    urlRoot: "/api/categories/"
});
var TimeEntry = Backbone.Model.extend({
    urlRoot: "/api/time_entries/"
});
var TodoItem = Backbone.Model.extend({
    urlRoot: "/api/todo_items/"
});
var TodoList = Backbone.Model.extend({
    urlRoot: "/api/todo_lists/"
});
var Comment = Backbone.Model.extend({
    urlRoot: "/api/comments/"
});
var MyModel = Person.extend({
    defaults: {
        id: null
    },
    url: "/api/me.xml"
});
