/*jslint nomen: true*/
/*global window, document, $, _, Backbone*/
$(function () {
    "use strict";
    return;
    var i,
        models = window.models = {},
        collections = window.collections = {},
        views = window.views = {},
        viewdata = {
            el: '.content',
            collections: collections
        },
        oproject,
        otodo,
        Workspace = Backbone.Router.extend({
            routes: {
                "projects": "projects",
                "projects:tab": "projects",
                "projects/:id": "project",
                "projects/:id/todo_lists": "project_todo_lists",
                "projects/:id/todo_lists/:tlid": "project_todo_list",
                "projects/:id/todo_lists/:tlid/:tiid": "project_todo_item",
                "projects/:id/todo_lists/:tlid/:tiid/comments": "project_todo_item_comments",
                "projects/:id/time_entries/todo_items/:tiid": "todo_time_entries",
                "projects/:id/time_entries": "project_time_entries",
                "projects/:id/people": "project_people",
                "projects/:id/posts": "project_posts",
                "projects/:id/posts/:pid": "project_post",
                "projects/:id/posts/:pid/comments": "project_post_comments",
                "projects/:id/files": "project_files",
                "projects/:id/files/:fid": "project_file",
                "projects/:id/calendar": "project_calendar",
                "projects/:id/calendar/:cid": "project_calendar_entry",
                "projects/:id/calendar/:cid/comments": "project_calendar_entry_comments",
                "projects/:id/categories": "project_categories",
                "projects/:id/categories/:cid": "project_category",
                "companies": "companies",
                "companies/:id": "company",
                "people": "people",
                "people:tab": "people",
                "people/:id": "person",
                "me": "me",
                "todos": "todos",
                "time_report": "time_report",
                "*actions": "defaultRoute"
            }
        });
    models.mydata = new window.MyModel();
    models.project = new window.Project();
    models.company = new window.Company();
    models.person = new window.Person();
    collections.projects = new window.Projects();
    collections.companies = new window.Companies();
    collections.people = new window.People();
    collections.todos = new window.TodoLists();
    collections.times = new window.TimeEntries();
    views.current = null;
    views.projects = new window.ProjectsView(_.extend({
        collection: collections.projects
    }, viewdata));
    views.companies = new window.CompaniesView(_.extend({
        collection: collections.companies
    }, viewdata));
    views.people = new window.AllPeopleView(_.extend({
        collection: collections.people
    }, viewdata));
    views.time_report = new window.TimeReportView(_.extend({
        collection: collections.times
    }, viewdata));
    views.todos = new window.TodosView(_.extend({
        collection: collections.todos,
        mydata: models.mydata
    }, viewdata));
    for (i in collections) {
        if (collections.hasOwnProperty(i)) {
            collections[i].on("reset", window.onReset);
            collections[i].on("sync", window.onReset);
        }
    }
    collections.project_people = new window.People();
    collections.project_categories = new window.Categories();
    collections.project_posts = new window.Posts();
    collections.project_files = new window.Attachments();
    collections.project_todo_lists = new window.TodoLists();
    collections.project_calendar = new window.Calendar();
    collections.project_time_entries = new window.TimeEntries();
    collections.todo_items = new window.TodoItems();
    collections.todo_time_entries = new window.TodoTimeEntries();
    collections.project_todo_item_comments = new window.TodoComments();
    collections.project_post_comments = new window.PostComments();
    collections.project_calendar_entry_comments = new window.CalendarEntryComments();
    views.company_view = new window.CompanyView(_.extend({
        model: models.company
    }, viewdata));
    views.person_view = new window.PersonView(_.extend({
        model: models.person
    }, viewdata));
    oproject = _.extend({
        model: models.project
    }, viewdata);
    views.project_view = new window.ProjectView(oproject);
    views.project_people = new window.PeopleView(oproject);
    views.project_categories = new window.CategoriesView(oproject);
    views.project_category = new window.CategoryView(oproject);
    views.project_posts = new window.PostsView(oproject);
    views.project_post = new window.PostView(oproject);
    views.project_calendar = new window.CalendarView(oproject);
    views.project_calendar_entry = new window.CalendarEntryView(oproject);
    views.project_files = new window.FilesView(oproject);
    views.project_file = new window.FileView(oproject);
    views.project_time_entries = new window.TimeEntriesView(oproject);
    views.todo_time_entries = new window.TodoTimeEntriesView(oproject);
    views.project_post_comments = new window.PostCommentsView(oproject);
    views.project_calendar_entry_comments = new window.CalendarEntryCommentsView(oproject);
    views.todo = function (prid, item) {
        if (!views.todo[item.id]) {
            views.todo[item.id] = new window.TodoView({model: item, collections: collections, project_id: prid});
        }
        return views.todo[item.id];
    };
    otodo = _.extend({
        todo: views.todo
    }, oproject);
    views.project_todo_lists = new window.TodoListsView(otodo);
    views.project_todo_list = new window.TodoListView(otodo);
    views.project_todo_item = new window.TodoItemView(otodo);
    views.project_todo_item_comments = new window.TodoItemCommentsView(otodo);
    window.workspace = new Workspace();
    window.workspace.on("route", function (route, params) {
        var id, cur_item;
        if (_.contains(["projects", "companies", "people", "time_report", "todos"], route)) {
            views.current = views[route].render();
        } else if (_.contains(["project_people", "project_categories", "project_time_entries", "project_posts", "project_files", "project_calendar", "project_todo_lists"], route)) {
            id = parseInt(params[0], 10);
            if (collections.projects.get(id)) {
                views[route].model = collections.projects.get(id);
            } else {
                views[route].model.id = id;
            }
            views[route].collection = collections[route].get_or_create(id);
            views.current = views[route].render();
        } else if (_.contains(["project_post", "project_file", "project_calendar_entry", "project_category", "project_todo_list"], route)) {
            id = parseInt(params[0], 10);
            cur_item = parseInt(params[1], 10);
            if (collections.projects.get(id)) {
                views[route].model = collections.projects.get(id);
            } else {
                views[route].model.id = id;
            }
            views[route].cur_item = cur_item;
            switch (route) {
            case "project_calendar_entry":
                views[route].collection = collections.project_calendar.get_or_create(id);
                break;
            case "project_category":
                views[route].collection = collections.project_categories.get_or_create(id);
                break;
            default:
                views[route].collection = collections[route + "s"].get_or_create(id);
            }
            views.current = views[route].render();
        } else if (_.contains(["project_calendar_entry_comments", "project_post_comments", "todo_time_entries"], route)) {
            id = parseInt(params[0], 10);
            cur_item = parseInt(params[1], 10);
            if (collections.projects.get(id)) {
                views[route].model = collections.projects.get(id);
            } else {
                views[route].model.id = id;
            }
            views[route].cur_item = cur_item;
            views[route].collection = collections[route].get_or_create(cur_item);
            views.current = views[route].render();
        }
        if (views.current) {
            document.title = views.current.name() + " - BB";
        }
//         add_hash();
        if (views.current && views.current.deps) {
            views.current.deps();
        }
        $(_.filter($(".navbar ul.nav li").removeClass("active"), function (i) {
            return $(i).find("a:visible")[0] && document.location.hash.indexOf($(i).find("a:visible")[0].hash) !== -1;
        })).addClass("active");
        $(_.filter($("div.content ul.projectnav li").removeClass("active"), function (i) {
            return $(i).find("a:visible")[0] && document.location.hash.indexOf($(i).find("a:visible")[0].hash) !== -1;
        })).filter(":last").addClass("active");
    }).on("route:project_todo_item", function (id, tlid, tiid) {
        if (collections.projects.get(id)) {
            views.project_todo_item.model = collections.projects.get(id);
        } else {
            views.project_todo_item.model.id = id;
        }
        views.project_todo_item.cur_item = tlid;
        views.project_todo_item.todo_item = tiid;
        views.project_todo_item.collection = collections.project_todo_lists.get_or_create(id);
        views.current = views.project_todo_item.render();
    }).on("route:project_todo_item_comments", function (id, tlid, tiid) {
        if (collections.projects.get(id)) {
            views.project_todo_item_comments.model = collections.projects.get(id);
        } else {
            views.project_todo_item_comments.model.id = id;
        }
        views.project_todo_item_comments.cur_item = tlid;
        views.project_todo_item_comments.todo_item = tiid;
        views.project_todo_item_comments.todo_lists = collections.project_todo_lists.get_or_create(id);
        views.project_todo_item_comments.collection = collections.project_todo_item_comments.get_or_create(tiid);
        views.current = views.project_todo_item_comments.render();
    }).on("route:project", function (id) {
        if (collections.projects.get(id)) {
            views.project_view.model = collections.projects.get(id);
        } else {
            views.project_view.model.id = id;
        }
        views.current = views.project_view.render();
    }).on("route:company", function (id) {
        if (collections.companies.get(id)) {
            views.company_view.model = collections.companies.get(id);
        } else {
            views.company_view.model.id = id;
        }
        views.current = views.company_view.render();
    }).on("route:person", function (id) {
        if (collections.people.get(id)) {
            views.person_view.model = collections.people.get(id);
        } else {
            views.person_view.model.id = id;
        }
        views.current = views.person_view.render();
    }).on("route:me", function () {
        views.person_view.model = models.mydata;
        views.current = views.person_view.render();
    }).on("route:defaultRoute", function (action) {
        this.navigate("projects", {
            trigger: true
        });
    });
    views.navbar = new window.NavView({
        model: models.mydata,
        el: '.navbar'
    }).render();
    models.mydata.once("sync", function () {
        Backbone.history.start();
    });
    models.mydata.fetch();
});

// container = new Backbone.Marionette.Region({
//   el: "#container"
// });
// 
// MyLayout = Backbone.Marionette.Layout.extend({
//   template: "#my-layout",
// 
//   regions: {
//     menu: "#menu",
//     content: "#content"
//   }
// });
// 
// // Show the "layout" in the "container" region
// layout = new MyLayout();
// container.show(layout);
// 
// // and show the views in the layout
// layout.menu.show(new MyMenuView());
// layout.content.show(new MyContentView());




BB = new Backbone.Marionette.Application();

BB.collections = {};
BB.views = {};

BB.addRegions({
    navRegion: "#navbar",
    headerRegion: "#header",
    mainRegion: "#content"
});

BB.module('Projects', function (Projects, App, Backbone) {
    // Project Model
    // -------------
    Projects.Model = Backbone.Model.extend({
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

    // Project Collection
    // ------------------
    Projects.Collection = Backbone.Collection.extend({
        url: '/api/projects.xml',
        model: Projects.Model
    });
    Projects.ItemView = Backbone.Marionette.ItemView.extend({
        tagName: "li",
        template: "#oneproject-template"
    });
    Projects.EmptyView = Backbone.Marionette.ItemView.extend({
        template: "#emptyprojects-template"
    });

    Projects.View = Backbone.Marionette.CompositeView.extend({
        id: "projects",
        template: "#projects-template",
        itemView: Projects.ItemView,
        emptyView: Projects.EmptyView,
        templateHelpers: function () {return {view: this}; },
        name: function () {
            return "Projects";
        },
        appendHtml: function(collectionView, itemView){
            if(itemView.model.get('company')) {
                var coid = itemView.model.get('company').id;
                var status = itemView.model.get('status');
                var holder = "#projects_" + status + "_" + coid + " ul";
                collectionView.$(holder).append(itemView.el);
            } else {
                collectionView.$el.append(itemView.el);
            }
        },
        initialize: function () {
            this.collection.bind("sync", this.render, this);
        }
    });
    Projects.Header = Backbone.Marionette.View.extend({
        className: "page-header",
        template: "#header1-template",
        render: function () {
            this.$el.html(_.template($(this.template).html(), this.name(), {variable: 'name'}));
            return this;
        },
        name: function () {
            return "Projects";
        }
    });
    App.on("initialize:before", function(options){
        App.collections.projects = new Projects.Collection();
        App.views.projectsView = new Projects.View({
            collection: App.collections.projects
        });
        App.views.projectsHeader = new Projects.Header({
            collection: App.collections.projects
        });
    });
});

BB.module('Companies', function (Companies, App, Backbone) {
    // Company Model
    // -------------
    Companies.Model = Backbone.Model.extend({
        urlRoot: "/api/companies/"
    });

    // Company Collection
    // ------------------
    Companies.Collection = Backbone.Collection.extend({
        url: '/api/companies.xml',
        model: Companies.Model
    });

    Companies.ItemView = Backbone.Marionette.ItemView.extend({
        tagName: "li",
        template: "#onecompany-template"
    });

    Companies.EmptyView = Backbone.Marionette.ItemView.extend({
        tagName: "li",
        template: "#emptycompanies-template"
    });

    Companies.View = Backbone.Marionette.CompositeView.extend({
        tagName: "ul",
        id: "companies",
        className: "unstyled",
        template: "#companies-template",
        itemView: Companies.ItemView,
        emptyView: Companies.EmptyView,
        name: function () {
            return "Companies";
        },
        appendHtml: function(collectionView, itemView){
            collectionView.$el.append(itemView.el);
        },
        initialize: function () {
            this.collection.bind("sync", this.render, this);
        }
    });
    Companies.Header = Backbone.Marionette.View.extend({
        className: "page-header",
        template: "#header1-template",
        render: function () {
            this.$el.html(_.template($(this.template).html(), this.name(), {variable: 'name'}));
            return this;
        },
        name: function () {
            return "Companies";
        }
    });
    App.on("initialize:before", function(options){
        App.collections.companies = new Companies.Collection();
        App.views.companiesView = new Companies.View({
            collection: App.collections.companies
        });
        App.views.companiesHeader = new Companies.Header({
            collection: App.collections.companies
        });
    });

});

BB.module('People', function (People, App, Backbone) {
    People.Model = Backbone.Model.extend({
        urlRoot: "/api/people/",
        name: function () {
            return this.get('first-name') + ' ' + this.get('last-name');
        }
    });
    People.Collection = Backbone.Collection.extend({
        parent_id: null, // project id
        url: function () {
            if (this.parent_id) return '/api/projects/' + this.parent_id + '/people.xml';
            return '/api/people.xml';
        },
        model: People.Model
    });
    People.ItemView = Backbone.Marionette.ItemView.extend({
        render: function(){
            this.isClosed = false;

            this.triggerMethod("before:render", this);
            this.triggerMethod("item:before:render", this);

            var data = this.serializeData();
            data = this.mixinTemplateHelpers(data);

            var template = this.getTemplate();
            var html = Marionette.Renderer.render(template, {item: this.model});
            this.$el.html(html);
            this.bindUIElements();

            this.triggerMethod("render", this);
            this.triggerMethod("item:rendered", this);

            return this;
        },
        tagName: "li",
        className: "media well well-small",
        template: "#personitem-template"
    });

    People.EmptyView = Backbone.Marionette.ItemView.extend({
//         tagName: "li",
        template: "#emptypeople-template"
    });

    People.View = Backbone.Marionette.CompositeView.extend({
        id: "people",
        template: "#people-template",
        itemView: People.ItemView,
        emptyView: People.EmptyView,
        templateHelpers: function () {return {view: this}; },
        appendHtml: function(collectionView, itemView){
            if(itemView.model.get('company')) {
                var coid = itemView.model.get('company').id;
                var holder = "#people_c" + coid + " ul.media-list";
                collectionView.$(holder).length ? collectionView.$(holder).append(itemView.el) : collectionView.$("ul.media-list").append(itemView.el);
                console.log(holder, collectionView.$(holder).length, collectionView.$el, itemView.$el);
            } else {
                collectionView.$el.append(itemView.el);
            }
        },
        initialize: function () {
            this.collection.bind("sync", this.render, this);
        }
    });
    People.Header = Backbone.Marionette.View.extend({
        className: "page-header",
        template: "#header1-template",
        render: function () {
            this.$el.html(_.template($(this.template).html(), this.name(), {variable: 'name'}));
            return this;
        },
        name: function () {
            return "People";
        }
    });
    App.on("initialize:before", function(options){
        App.collections.people = new People.Collection();
        App.views.peopleView = new People.View({
            collection: App.collections.people
        });
        App.views.peopleHeader = new People.Header({
            collection: App.collections.people
        });
    });
});

BB.module('Base', function (Base, App, Backbone) {
    Base.Me = App.People.Model.extend({
        url: "/api/me.xml"
    });
    var NavBarView = Base.NavBarView = Backbone.Marionette.View.extend({
        template: "#nav-template",
        className: "navbar-inner",
        render: function () {
            this.$el.html(_.template($(this.template).html(), this, {variable: 'view'}));
            return this;
        },
        initialize: function () {
            this.model.bind("change", this.render, this);
        }
    });

    App.on("initialize:before", function(options){
        App.me = new Base.Me();
        var navbarView = new BB.Base.NavBarView({model: App.me});
        App.navRegion.show(navbarView);
    });
});

BB.addInitializer(function(options) {
    BB.me.fetch();
    BB.collections.projects.fetch();
    BB.collections.companies.fetch();
    BB.collections.people.fetch();
});

var Workspace = Backbone.Router.extend({
    routes: {
        "projects": "projects",
        "projects:tab": "projects",
        "projects/:id": "project",
        "projects/:id/todo_lists": "project_todo_lists",
        "projects/:id/todo_lists/:tlid": "project_todo_list",
        "projects/:id/todo_lists/:tlid/:tiid": "project_todo_item",
        "projects/:id/todo_lists/:tlid/:tiid/comments": "project_todo_item_comments",
        "projects/:id/time_entries/todo_items/:tiid": "todo_time_entries",
        "projects/:id/time_entries": "project_time_entries",
        "projects/:id/people": "project_people",
        "projects/:id/posts": "project_posts",
        "projects/:id/posts/:pid": "project_post",
        "projects/:id/posts/:pid/comments": "project_post_comments",
        "projects/:id/files": "project_files",
        "projects/:id/files/:fid": "project_file",
        "projects/:id/calendar": "project_calendar",
        "projects/:id/calendar/:cid": "project_calendar_entry",
        "projects/:id/calendar/:cid/comments": "project_calendar_entry_comments",
        "projects/:id/categories": "project_categories",
        "projects/:id/categories/:cid": "project_category",
        "companies": "companies",
        "companies/:id": "company",
        "people": "people",
        "people:tab": "people",
        "people/:id": "person",
        "me": "me",
        "todos": "todos",
        "time_report": "time_report",
        "*actions": "defaultRoute"
    }
});
workspace = new Workspace();
workspace.on("route", function (route, params) {
    console.log(route, params);
}).on("route:projects", function () {
    BB.headerRegion.show(BB.views.projectsHeader);
    BB.mainRegion.show(BB.views.projectsView);
}).on("route:companies", function () {
    BB.headerRegion.show(BB.views.companiesHeader);
    BB.mainRegion.show(BB.views.companiesView);
}).on("route:people", function () {
    BB.headerRegion.show(BB.views.peopleHeader);
    BB.mainRegion.show(BB.views.peopleView);
}).on("route:defaultRoute", function (action) {
    this.navigate("projects", {
        trigger: true
    });
});

BB.on("initialize:after", function(options){
    if (Backbone.history){
        Backbone.history.start();
    }
});
$(document).ready(function() {
    BB.start();
});
