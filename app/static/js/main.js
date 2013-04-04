$(function () {
    models = {};
    collections = {};
    var viewdata = {
        el: '.content',
        collections: collections
    };
    models.mydata = new MyModel();
    models.project = new Project();
    models.company = new Company();
    models.person = new Person();
    collections.projects = new Projects();
    collections.companies = new Companies();
    collections.people = new People();
    collections.todos = new TodoLists();
    collections.times = new TimeEntries();
    views = {};
    views.current = null;
    views.projects = new ProjectsView(_.extend({
        collection: collections.projects
    }, viewdata));
    views.companies = new CompaniesView(_.extend({
        collection: collections.companies
    }, viewdata));
    views.people = new AllPeopleView(_.extend({
        collection: collections.people
    }, viewdata));
    views.time_report = new TimeReportView(_.extend({
        collection: collections.times
    }, viewdata));
    views.todos = new TodosView(_.extend({
        collection: collections.todos,
        mydata: models.mydata
    }, viewdata));
    for (var i in collections) {
        collections[i].on("reset", onReset);
        collections[i].on("sync", onReset);
    }
    collections.project_people = new People();
    collections.project_categories = new Categories();
    collections.project_posts = new Posts();
    collections.project_files = new Attachments();
    collections.project_todo_lists = new TodoLists();
    collections.project_calendar = new Calendar();
    collections.project_time_entries = new TimeEntries();
    collections.todo_items = new TodoItems();
    collections.todo_time_entries = new TodoTimeEntries();
    collections.project_todo_item_comments = new TodoComments();
    collections.project_post_comments = new PostComments();
    collections.project_calendar_entry_comments = new CalendarEntryComments();
    views.company_view = new CompanyView(_.extend({
        model: models.company
    }, viewdata));
    views.person_view = new PersonView(_.extend({
        model: models.person
    }, viewdata));
    var oproject = _.extend({
        model: models.project
    }, viewdata);
    views.project_view = new ProjectView(oproject);
    views.project_people = new PeopleView(oproject);
    views.project_categories = new CategoriesView(oproject);
    views.project_category = new CategoryView(oproject);
    views.project_posts = new PostsView(oproject);
    views.project_post = new PostView(oproject);
    views.project_calendar = new CalendarView(oproject);
    views.project_calendar_entry = new CalendarEntryView(oproject);
    views.project_files = new FilesView(oproject);
    views.project_file = new FileView(oproject);
    views.project_time_entries = new TimeEntriesView(oproject);
    views.todo_time_entries = new TodoTimeEntriesView(oproject);
    views.project_post_comments = new PostCommentsView(oproject);
    views.project_calendar_entry_comments = new CalendarEntryCommentsView(oproject);
    views.todo = function(prid, item){
        if(!views.todo[item.id]) views.todo[item.id] = new TodoView({model: item, collections: collections, project_id: prid});
        return views.todo[item.id];
    };
    var otodo = _.extend({
        todo: views.todo
    }, oproject);
    views.project_todo_lists = new TodoListsView(otodo);
    views.project_todo_list = new TodoListView(otodo);
    views.project_todo_item = new TodoItemView(otodo);
    views.project_todo_item_comments = new TodoItemCommentsView(otodo);
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
        var id;
        if (_.contains(["projects","companies","people","time_report","todos"], route)) {
            views.current = views[route].render();
        } else if (_.contains(["project_people", "project_categories", "project_time_entries", "project_posts", "project_files", "project_calendar", "project_todo_lists"], route)) {
            id = parseInt(params[0],10);
            if (collections.projects.get(id)) {
                views[route].model = collections.projects.get(id);
            } else {
                views[route].model.id = id;
            }
            views[route].collection = collections[route].get_or_create(id);
            views.current = views[route].render();
        } else if (_.contains(["project_post", "project_file", "project_calendar_entry", "project_category", "project_todo_list"], route)) {
            id = parseInt(params[0],10);
            var cur_item = parseInt(params[1],10);
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
                    views[route].collection = collections[route+"s"].get_or_create(id);
            } 
            views.current = views[route].render();
        } else if (_.contains(["project_calendar_entry_comments", "project_post_comments", "todo_time_entries"], route)) {
            id = parseInt(params[0],10);
            var parent_id = parseInt(params[1],10);
            if (collections.projects.get(id)) {
                views[route].model = collections.projects.get(id);
            } else {
                views[route].model.id = id;
            }
            views[route].cur_item = parent_id;
            views[route].collection = collections[route].get_or_create(parent_id);
            views.current = views[route].render();
        }
        if (views.current) document.title = views.current.name() + " - BB";
//         add_hash();
        if (views.current && views.current.deps) views.current.deps();
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
//     views.navbar = new NavView({
//         model: models.mydata,
//         el: '.navbar'
//     }).render();
//     models.mydata.once("sync", function () {
//         Backbone.history.start();
//     });
//     models.mydata.fetch();
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

BB.addRegions({
    navRegion: "#navbar",
    headerRegion: "#header",
    mainRegion: "#content"
});

BB.addInitializer(function(options) {
    var me = new BB.People.Me();
    var projects = new BB.Projects.Collection();
    var companies = new BB.Companies.Collection();
    var navbarView = new BB.People.NavBarView({
        model: me
    });
    var projectsView = new BB.Projects.View({
        collection: projects
    });
    var companiesView = new BB.Companies.View({
        collection: companies
    });
    var projectsHeader = new BB.Projects.Header({
        collection: projects
    });
    var companiesHeader = new BB.Companies.Header({
        collection: companies
    });
//     var projectsLayout = new BB.Projects.Layout();
    BB.navRegion.show(navbarView);
//     BB.mainRegion.show(projectsView);
//     BB.mainRegion.show(projectsLayout);
//     BB.headerRegion.show(projectsHeader);
//     BB.mainRegion.show(projectsView);
    BB.headerRegion.show(companiesHeader);
    BB.mainRegion.show(companiesView);
//     projectsLayout.content.show(projectsView);
//     projectsLayout.header.show(projectsHeader);
    me.fetch();
    projects.fetch();
    companies.fetch();
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
        //   tagName: "table",
        id: "projects",
        //   className: "table-striped table-bordered",
        template: "#projects-template",
        itemView: Projects.ItemView,
        emptyView: Projects.EmptyView,
        templateHelpers: function(){return {view:this}},
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
//         templateHelpers: function(){
//             return {
//                 view: this,
//                 hh: this.name()
//             };
//         },
        name: function () {
            return "Projects";
        }
    });
    Projects.Layout = Backbone.Marionette.Layout.extend({
        className: "projectslayout",
        template: "#projectslayout-template",
        regions: {
            header: "#header",
            content: "#maincontent"
        }
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
//         tagName: "li",
        template: "#onecompany-template"
    });
    Companies.EmptyView = Backbone.Marionette.ItemView.extend({
        template: "#emptycompanies-template"
    });

    Companies.View = Backbone.Marionette.CompositeView.extend({
        //   tagName: "table",
        id: "companies",
        //   className: "table-striped table-bordered",
        template: "#companies-template",
        itemView: Companies.ItemView,
        emptyView: Companies.EmptyView,
        name: function () {
            return "Companies";
        },
        appendHtml: function(collectionView, itemView){
            collectionView.$("dl").append(itemView.el);
        },
        initialize: function () {
            this.collection.bind("sync", this.render, this);
        }
    });
    Companies.Header = Backbone.Marionette.View.extend({
        className: "page-header",
        template: "#header1-template",
        name: function () {
            return "Companies";
        }
    });

});

BB.module('People', function (People, App, Backbone) {
    People.Person = Backbone.Model.extend({
        urlRoot: "/api/people/",
        name: function () {
            return this.get('first-name') + ' ' + this.get('last-name');
        }
    });
    People.People = Backbone.Collection.extend({
        parent_id: null, // project id
        url: function () {
            if (this.parent_id) return '/api/projects/' + this.parent_id + '/people.xml';
            return '/api/people.xml';
        },
        model: People.Person
    });
    People.Me = People.Person.extend({
        url: "/api/me.xml"
    });
    People.NavBarView = Backbone.Marionette.View.extend({
        template: "#nav-template",
        className: "navbar-inner",
        initialize: function () {
            this.model.bind("change", this.render, this);
        }
    });
});

$(document).ready(function() {
    BB.start();
});
