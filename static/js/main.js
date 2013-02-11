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
    for (i in collections) {
        collections[i].on("reset", onReset)
    };
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
    views.project_categories = new CategoriesView(oproject)
    views.project_category = new CategoryView(oproject)
    views.project_posts = new PostsView(oproject)
    views.project_post = new PostView(oproject)
    views.project_todo_lists = new TodoListsView(oproject)
    views.project_todo_list = new TodoListView(oproject)
    views.project_todo_item = new TodoItemView(oproject)
    views.project_todo_item_comments = new TodoItemCommentsView(oproject)
    views.project_calendar = new CalendarView(oproject)
    views.project_calendar_entry = new CalendarEntryView(oproject)
    views.project_files = new FilesView(oproject)
    views.project_file = new FileView(oproject)
    views.project_time_entries = new TimeEntriesView(oproject)
    views.todo_time_entries = new TodoTimeEntriesView(oproject)
    views.project_post_comments = new PostCommentsView(oproject)
    views.project_calendar_entry_comments = new CalendarEntryCommentsView(oproject)
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
        if (["projects","companies","people","time_report","todos"].indexOf(route)!==-1) {
            views.current = views[route].render()
        } else if (["project_people","project_categories","project_time_entries","project_posts","project_files","project_calendar","project_todo_lists"].indexOf(route)!==-1) {
            var id = parseInt(params[0]);
            if (collections.projects.get(id)) {
                views[route].model = collections.projects.get(id)
            } else {
                views[route].model.id = id
            }
            views[route].collection = collections[route].get_or_create(id);
            views.current = views[route].render()
        } else if (["project_post","project_file","project_calendar_entry","project_category","project_todo_list"].indexOf(route)!==-1) {
            var id = parseInt(params[0]);
            var cur_item = parseInt(params[1]);
            if (collections.projects.get(id)) {
                views[route].model = collections.projects.get(id);
            } else {
                views[route].model.id = id
            }
            views[route].cur_item = cur_item;
            switch (route) {
                case "project_calendar_entry":
                    views[route].collection = collections["project_calendar"].get_or_create(id);
                    break;
                case "project_category":
                    views[route].collection = collections["project_categories"].get_or_create(id);
                    break;
                default:
                    views[route].collection = collections[route+"s"].get_or_create(id);
            }
            views.current = views[route].render()
        } else if (["project_calendar_entry_comments","project_post_comments","todo_time_entries"].indexOf(route)!==-1) {
            var id = parseInt(params[0]);
            var parent_id = parseInt(params[1]);
            if (collections.projects.get(id)) {
                views[route].model = collections.projects.get(id);
            } else {
                views[route].model.id = id
            }
            views[route].cur_item = parent_id;
            views[route].collection = collections[route].get_or_create(parent_id);
            views.current = views[route].render()
        }
        views.current && $('title').html(views.current.name() + " - BB");
        add_hash();
        views.current && views.current.deps && views.current.deps();
        $(_.filter($(".navbar ul.nav li").removeClass("active"), function (i) {
            return $(i).find("a:visible")[0] && document.location.hash.indexOf($(i).find("a:visible")[0].hash) !== -1
        })).addClass("active")
    }).on("route:project_todo_item", function (id, tlid, tiid) {
        if (collections.projects.get(id)) {
            views.project_todo_item.model = collections.projects.get(id);
        } else {
            views.project_todo_item.model.id = id
        }
        views.project_todo_item.cur_item = tlid;
        views.project_todo_item.todo_item = tiid;
        views.project_todo_item.collection = collections.project_todo_lists.get_or_create(id);
        views.current = views.project_todo_item.render()
    }).on("route:project_todo_item_comments", function (id, tlid, tiid) {
        if (collections.projects.get(id)) {
            views.project_todo_item_comments.model = collections.projects.get(id);
        } else {
            views.project_todo_item_comments.model.id = id
        }
        views.project_todo_item_comments.cur_item = tlid;
        views.project_todo_item_comments.todo_item = tiid;
        views.project_todo_item_comments.todo_lists = collections.project_todo_lists.get_or_create(id);
        views.project_todo_item_comments.collection = collections.project_todo_item_comments.get_or_create(tiid);
        views.current = views.project_todo_item_comments.render()
    }).on("route:project", function (id) {
        if (collections.projects.get(id)) {
            views.project_view.model = collections.projects.get(id)
        } else {
            views.project_view.model.id = id
        }
        views.current = views.project_view.render()
    }).on("route:company", function (id) {
        if (collections.companies.get(id)) {
            views.company_view.model = collections.companies.get(id)
        } else {
            views.company_view.model.id = id
        }
        views.current = views.company_view.render()
    }).on("route:person", function (id) {
        if (collections.people.get(id)) {
            views.person_view.model = collections.people.get(id)
        } else {
            views.person_view.model.id = id
        }
        views.current = views.person_view.render()
    }).on("route:me", function () {
        views.person_view.model = models.mydata
        views.current = views.person_view.render()
    }).on("route:defaultRoute", function (action) {
        this.navigate("projects", {
            trigger: true
        });
    });
    views.navbar = new NavView({
        model: models.mydata,
        el: '.navbar'
    }).render();
    models.mydata.once("sync", function () {
        Backbone.history.start();
    });
    models.mydata.fetch()
});