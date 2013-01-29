$(function () {
    var onReset = function () {
        Backbone.history.loadUrl();
    };
    Backbone.Collection.prototype.fetchonce = function () {
        var fetched = this.fetched;
        if (!fetched) {
            this.fetch();
            this.fetched = true
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
        this.$el.html(this.template());
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
    var Projects = Backbone.Collection.extend({
        url: '/api/projects.xml',
        model: Project
    });
    var Company = Backbone.Model.extend();
    var Companies = Backbone.Collection.extend({
        url: '/api/companies.xml',
        model: Company
    });
    var Person = Backbone.Model.extend({
        name: function () {
            return this.get('first-name') + ' ' + this.get('last-name')
        }
    });
    var People = Backbone.Collection.extend({
        parent_id: null, // project id
        url: function () {
            if (this.parent_id) return '/api/projects/' + this.parent_id + '/people.xml';
            return '/api/people.xml';
        },
        model: Person
    });
    var Post = Backbone.Model.extend();
    var Posts = Backbone.Collection.extend({
        parent_id: null, // project id
        url: function () {
            return '/api/projects/' + this.parent_id + '/posts.xml';
        },
        model: Post
    });
    var Attachment = Backbone.Model.extend();
    var Attachments = Backbone.Collection.extend({
        parent_id: null, // project id
        url: function () {
            return '/api/projects/' + this.parent_id + '/attachments.xml';
        },
        model: Attachment
    });
    var CalendarEntry = Backbone.Model.extend();
    var Calendar = Backbone.Collection.extend({
        parent_id: null, // project id
        url: function () {
            return '/api/projects/' + this.parent_id + '/calendar_entries.xml';
        },
        model: CalendarEntry
    });
    var Category = Backbone.Model.extend();
    var Categories = Backbone.Collection.extend({
        parent_id: null, // project id
        url: function () {
            return '/api/projects/' + this.parent_id + '/categories.xml';
        },
        model: Category
    });
    var TimeEntry = Backbone.Model.extend();
    var TimeEntries = Backbone.Collection.extend({
        parent_id: null, // project id or todo item id
        parent: null, // todo or project
        filter_report: null, // report filter
        //         This action accepts the following query parameters:
        //         `from`, `to`, `subject_id`, `todo_item_id`,
        //         `filter_project_id`, and `filter_company_id`. 
        //         Both `from` and `to` should be dates in `YYYYMMDD` format, and can be used to restrict the result to a particular date range.
        //         The `subject_id` parameter lets you constrain the result to a single person’s time entries.
        //         `todo_item_id` restricts the result to only those entries relating to the given todo item.
        //         `filter_project_id` restricts the entries to those for the given project,
        //         and `filter_company_id` restricts the entries to those for the given company.
        url: function () {
            if (this.parent_id && this.parent == 'todo') return '/api/todo_items/' + this.parent_id + '/time_entries.xml';
            if (this.parent_id) return '/api/projects/' + this.parent_id + '/time_entries.xml';
            if (this.filter_report) return '/api/time_entries/report.xml?' + this.filter_report;
            return '/api/time_entries/report.xml';
        },
        model: TimeEntry
    });
    var TodoItem = Backbone.Model.extend();
    var TodoItems = Backbone.Collection.extend({
        parent_id: null,
        url: function () {
            return '/api/todo_lists/' + this.parent_id + '/todo_items.xml'
        },
        model: TodoItem
    });
    var TodoList = Backbone.Model.extend();
    var TodoLists = Backbone.Collection.extend({
        responsible_party: null, // person id
        parent_id: null, // project id
        filter_status: null, // filter for project [all\pending\finished]
        url: function () {
            if (this.parent_id && this.filter_status) return '/api/projects/' + this.parent_id + '/todo_lists.xml?filter=' + this.filter_status;
            if (this.parent_id) return '/api/projects/' + this.parent_id + '/todo_lists.xml';
            if (this.responsible_party == null) return '/api/todo_lists.xml';
            if (this.responsible_party == "") return '/api/todo_lists.xml?responsible_party=';
            return '/api/todo_lists.xml?responsible_party=' + this.responsible_party
        },
        model: TodoList
    });
    var Comment = Backbone.Model.extend();
    var Comments = Backbone.Collection.extend({
        parent_id: null, // parent id
        parent_type: null, // posts|milestones|todo_items
        url: function () {
            return '/api/' + this.parent_type + '/' + this.parent_id + '/comments.xml';
        },
        model: Comment
    });
    var TimeReportView = Backbone.View.extend({
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce() && this.options.collections.companies.fetchonce()
        },
        events: {
            "click #getreport": "getreport"
        },
        getreport: function (e) {
            e.preventDefault();
            this.collection.filter_report = this.$('form#makereport').serialize();
            this.collection.fetch()
        },
        template: _.template($('#time-report-template').html()),
        name: function () {
            return "Time report"
        },
        render: function () {
            this.$el.html(this.template());
            if (this.collection.filter_report) {
                this.$el.find('form#makereport').deserialize(this.collection.filter_report)
            }
            return this;
        }
    });
    var AllPeopleView = Backbone.View.extend({
        deps: function () {
            this.collection.fetchonce() && this.options.collections.companies.fetchonce()
        },
        template: _.template($('#people-template').html()),
        name: function () {
            return "People"
        }
    });
    var ProjectsView = Backbone.View.extend({
        deps: function () {
            this.collection.fetchonce();
        },
        template: _.template($('#projects-template').html()),
        name: function () {
            return "Projects"
        }
    });
    var ProjectView = Backbone.View.extend({
        deps: function () {
            this.options.collections.projects.fetchonce()
        },
        template: _.template($('#project-template').html()),
        name: function () {
            return this.model.get('name')
        }
    });
    var CompaniesView = Backbone.View.extend({
        deps: function () {
            this.collection.fetchonce()
        },
        template: _.template($('#companies-template').html()),
        name: function () {
            return "Companies"
        }
    });
    var CompanyView = Backbone.View.extend({
        deps: function () {
            this.options.collections.companies.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce()
        },
        template: _.template($('#company-template').html()),
        name: function () {
            return this.model.get('name')
        }
    });
    var PeopleView = Backbone.View.extend({
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.companies.fetchonce()
        },
        template: _.template($('#project-people-template').html()),
        name: function () {
            return this.model.get('name') + " > People"
        }
    });
    var TimeEntriesView = Backbone.View.extend({
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce()
        },
        template: _.template($('#project-time-template').html()),
        name: function () {
            return this.model.get('name') + " > Time"
        }
    });
    var PostCommentsView = Backbone.View.extend({
        cur_item: null,
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.project_posts.get_or_create(this.model.id).fetchonce()
        },
        template: _.template($('#project-post-comments-template').html()),
        name: function () {
            var item=this.cur_item&&this.options.collections.project_posts.get_or_create(this.model.id).get(this.cur_item);
            var title=item&&item.get('title');
            return this.model.get('name') + " > Posts > " + title + " > Comments"
        }
    });
    var CalendarEntryCommentsView = Backbone.View.extend({
        cur_item: null,
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.project_calendar.get_or_create(this.model.id).fetchonce()
        },
        template: _.template($('#project-calendar-entry-comments-template').html()),
        name: function () {
            var item=this.cur_item&&this.options.collections.project_calendar.get_or_create(this.model.id).get(this.cur_item);
            var title=item&&item.get('title');
            return this.model.get('name') + " > Calendar > " + title + " > Comments"
        }
    });
    var PostsView = Backbone.View.extend({
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce()
        },
        template: _.template($('#project-posts-template').html()),
        name: function () {
            return this.model.get('name') + " > Posts"
        }
    });
    var PostView = Backbone.View.extend({
        cur_item: null,
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce()
        },
        template: _.template($('#project-post-template').html()),
        name: function () {
            var item=this.cur_item&&this.collection.get(this.cur_item);
            var title=item&&item.get('title');
            return this.model.get('name') + " > Posts > " + title
        }
    });
    var FilesView = Backbone.View.extend({
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce() && this.options.collections.project_categories.get_or_create(this.model.id).fetchonce()
        },
        template: _.template($('#project-files-template').html()),
        name: function () {
            return this.model.get('name') + " > Files"
        }
    });
    var FileView = Backbone.View.extend({
        cur_item: null,
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce() && this.options.collections.project_categories.get_or_create(this.model.id).fetchonce()
        },
        template: _.template($('#project-file-template').html()),
        name: function () {
            var item=this.cur_item&&this.collection.get(this.cur_item);
            var title=item&&item.get('name');
            return this.model.get('name') + " > Files > " + title
        }
    });
    var CalendarView = Backbone.View.extend({
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce()
        },
        template: _.template($('#project-calendar-template').html()),
        name: function () {
            return this.model.get('name') + " > Calendar"
        }
    });
    var CalendarEntryView = Backbone.View.extend({
        cur_item: null,
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce()
        },
        template: _.template($('#project-calendar-entry-template').html()),
        name: function () {
            var item=this.cur_item&&this.collection.get(this.cur_item);
            var title=item&&item.get('title');
            return this.model.get('name') + " > Calendar > " + title
        }
    });
    var CategoriesView = Backbone.View.extend({
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce()
        },
        template: _.template($('#project-categories-template').html()),
        name: function () {
            return this.model.get('name') + " > Categories"
        }
    });
    var CategoryView = Backbone.View.extend({
        cur_item: null,
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce()
        },
        template: _.template($('#project-category-template').html()),
        name: function () {
            var item=this.cur_item&&this.collection.get(this.cur_item);
            var title=item&&item.get('name');
            return this.model.get('name') + " > Categories > " + title
        }
    });
    var PersonView = Backbone.View.extend({
        deps: function () {
            this.options.collections.people.fetchonce() && this.options.collections.companies.fetchonce()
        },
        template: _.template($('#person-template').html()),
        name: function () {
            return this.model.name()
        }
    });
    var TodosView = Backbone.View.extend({
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce()
        },
        events: {
            "change select[name='target']": "selectTarget"
        },
        selectTarget: function (e) {
            this.collection.responsible_party = $(e.target).val();
            this.collection.fetch()
        },
        template: _.template($('#todo-lists-template').html()),
        name: function () {
            if (this.collection.responsible_party) {
                var person = this.options.collections.people && this.options.collections.people.get(this.collection.responsible_party);
                return person ? person.name() + "'s to-dos" : this.collection.responsible_party + "'s to-dos"
            }
            if (this.collection.responsible_party == null) return "My to-dos";
            if (this.collection.responsible_party == "") return "Unassigned to-dos";
            return "To-dos"
        },
        description: function () {
            if (this.collection.responsible_party) {
                var person = this.options.collections.people && this.options.collections.people.get(this.collection.responsible_party);
                return person && person.name() + "'s" || this.collection.responsible_party + "'s"
            }
            if (this.collection.responsible_party == null) return "My";
            if (this.collection.responsible_party == "") return "Unassigned";
            return "All"
        }
    });
    var TodoListsView = Backbone.View.extend({
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.sub()
        },
        template: _.template($('#project-todo-lists-template').html()),
        sub: function () {
            var todo_items = this.options.collections.todo_items;
            var td = _.map(this.collection.pluck('id'), function (id) {
                return todo_items.get_or_create(id)
            });
            var ftd = _.first(td.filter(function (i) {
                return !i.fetched
            }));
            if (ftd) {
                ftd.fetched = true;
                ftd.fetch()
            }
        },
        name: function () {
            if (this.collection.parent_id) {
                return this.model.get('name') + " > To-dos"
            }
            return "To-dos"
        }
    });
    var TodoListView = Backbone.View.extend({
        cur_item: null,
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce();
        },
        template: _.template($('#project-todo-lists-template').html()),
        name: function () {
            var item=this.cur_item&&this.collection.get(this.cur_item);
            var title=item&&item.get('name');
            return this.model.get('name') + " > To-dos > " + title
        }
    });
    var MyModel = Backbone.Model.extend({
        defaults: {
            id: null,
        },
        name: function () {
            return this.get('first-name') + ' ' + this.get('last-name')
        },
        url: "/api/me.xml"
    });
    var NavView = Backbone.View.extend({
        template: _.template($('#nav-template').html()),
        initialize: function () {
            this.model.bind("change", this.render, this);
        }
    });
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
    collections.project_todo_item_comments = new Comments({parent_type:"todo_items"});
    collections.project_post_comments = new Comments({parent_type:"posts"});
    collections.project_calendar_entry_comments = new Comments({parent_type:"milestones"});
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
    views.project_calendar = new CalendarView(oproject)
    views.project_calendar_entry = new CalendarEntryView(oproject)
    views.project_files = new FilesView(oproject)
    views.project_file = new FileView(oproject)
    views.project_time_entries = new TimeEntriesView(oproject)
    views.project_post_comments = new PostCommentsView(oproject)
    views.project_calendar_entry_comments = new CalendarEntryCommentsView(oproject)
    collections.projects.on("reset", function () {
        this.each(function (p) {
            collections.project_people.get_or_create(p.id);
            collections.project_categories.get_or_create(p.id);
            collections.project_posts.get_or_create(p.id);
            collections.project_todo_lists.get_or_create(p.id);
            collections.project_calendar.get_or_create(p.id);
            collections.project_categories.get_or_create(p.id);
            collections.project_files.get_or_create(p.id);
            collections.project_time_entries.get_or_create(p.id);
        })
    });
    var Workspace = Backbone.Router.extend({
        routes: {
            "projects": "projects",
            "projects:tab": "projects",
            "projects/:id": "project",
            "projects/:id/todo_lists": "project_todo_lists",
            "projects/:id/todo_lists/:tlid": "project_todo_list",
            "projects/:id/todo_lists/:tlid/:tiid": "project_todo_item", //TODO projects/:id/todo_items/:tiid
            "projects/:id/todo_lists/:tlid/:tiid/comments": "project_todo_item_comments", //TODO projects/:id/todo_items/:tiid/comments
            "projects/:id/time_entries": "project_time_entries",
            "projects/:id/people": "project_people",
            "projects/:id/posts": "project_posts",
            "projects/:id/posts/:pid": "project_post",
            "projects/:id/posts/:pid/comments": "project_post_comments", //TODO
            "projects/:id/files": "project_files",
            "projects/:id/files/:fid": "project_file",
            "projects/:id/calendar": "project_calendar",
            "projects/:id/calendar/:cid": "project_calendar_entry",
            "projects/:id/calendar/:cid/comments": "project_calendar_entry_comments", //TODO
            "projects/:id/categories": "project_categories",
            "projects/:id/categories/:cid": "project_category",
            "todo_items/:id/time_entries": "todo_time_entries", //TODO
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
            // project_todo_item
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
        } else if (["project_calendar_entry_comments","project_post_comments"].indexOf(route)!==-1) {
            // project_todo_item_comments
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