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
    Backbone.View.prototype.render = function () {
        this.$el.html(this.template());
        return this
    };
    uniq_hash = [];
    var add_hash = function () {
        var cur_hashs = _.uniq(_.map($("a"), function (i) {
            return i.hash
        }));
        cur_hashs.map(function (i) {
            if (uniq_hash.indexOf(i) == -1) {
                uniq_hash.push(i)
            }
        });
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
    var PostsView = Backbone.View.extend({
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce()
        },
        template: _.template($('#project-posts-template').html()),
        name: function () {
            return this.model.get('name') + " > Posts"
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
    var CalendarView = Backbone.View.extend({
        deps: function () {
            this.collection.fetchonce() && this.options.collections.projects.fetchonce()
        },
        template: _.template($('#project-calendar-template').html()),
        name: function () {
            return this.model.get('name') + " > Calendar"
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
    views.times = new TimeReportView(_.extend({
        collection: collections.times
    }, viewdata));
    views.todos = new TodosView(_.extend({
        collection: collections.todos,
        mydata: models.mydata
    }, viewdata));
    for (i in collections) {
        collections[i].on("reset", onReset)
    };
    Object.prototype.get_or_create = function (id) {
        if (!this[id] && this[0]) {
            this[id] = this[0].clone();
            this[id].parent_id = id;
            this[id].on("reset", onReset);
        }
        return this[id]
    };
    collections.project_people = {
        0: new People()
    };
    collections.project_categories = {
        0: new Categories()
    };
    collections.project_posts = {
        0: new Posts()
    };
    collections.project_files = {
        0: new Attachments()
    };
    collections.project_todo_lists = {
        0: new TodoLists()
    };
    collections.project_calendar = {
        0: new Calendar()
    };
    collections.project_time_entries = {
        0: new TimeEntries()
    };
    collections.todo_items = {
        0: new TodoItems()
    };
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
    views.project_posts = new PostsView(oproject)
    views.project_todo_lists = new TodoListsView(oproject)
    views.project_calendar = new CalendarView(oproject)
    views.project_files = new FilesView(oproject)
    views.project_time_entries = new TimeEntriesView(oproject)
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
            "projects/:id": "project",
            "projects/:id/todo_lists": "project_todo_lists",
            "projects/:id/time_entries": "project_time_entries",
            "projects/:id/people": "project_people",
            "projects/:id/posts": "project_posts",
            "projects/:id/files": "project_files",
            "projects/:id/milestones": "project_calendar",
            "projects/:id/categories": "project_categories",
            "companies": "companies",
            "companies/:id": "company",
            "people": "people",
            "people/:id": "person",
            "me": "me",
            "todo_lists": "todo_lists",
            "time_entries/report": "timereport",
            "*actions": "defaultRoute"
        }
    });
    workspace = new Workspace();
    workspace.on("all", function (action) {
        views.current && $('title').html(views.current.name() + " - BB");
        add_hash();
        action !== 'route' && views.current && views.current.deps && views.current.deps();
        $(_.filter($(".navbar ul.nav li").removeClass("active"), function (i) {
            return $(i).find("a:visible")[0] && document.location.hash.indexOf($(i).find("a:visible")[0].hash) !== -1
        })).addClass("active")
    }).on("route:projects", function () {
        views.current = views.projects.render()
    }).on("route:project", function (id) {
        if (collections.projects.get(id)) {
            views.project_view.model = collections.projects.get(id)
        } else {
            views.project_view.model.id = id
        }
        views.current = views.project_view.render()
    }).on("route:companies", function () {
        views.current = views.companies.render()
    }).on("route:company", function (id) {
        if (collections.companies.get(id)) {
            views.company_view.model = collections.companies.get(id)
        } else {
            views.company_view.model.id = id
        }
        views.current = views.company_view.render()
    }).on("route:people", function () {
        views.current = views.people.render()
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
    }).on("route:timereport", function () {
        views.current = views.times.render()
    }).on("route:todo_lists", function () {
        views.current = views.todos.render()
    }).on("route:project_people", function (id) {
        if (collections.projects.get(id)) {
            views.project_people.model = collections.projects.get(id)
        } else {
            views.project_people.model.id = id
        }
        views.project_people.collection = collections.project_people.get_or_create(id);
        views.current = views.project_people.render()
    }).on("route:project_categories", function (id) {
        if (collections.projects.get(id)) {
            views.project_categories.model = collections.projects.get(id)
        } else {
            views.project_categories.model.id = id
        }
        views.project_categories.collection = collections.project_categories.get_or_create(id);
        views.current = views.project_categories.render()
    }).on("route:project_time_entries", function (id) {
        if (collections.projects.get(id)) {
            views.project_time_entries.model = collections.projects.get(id)
        } else {
            views.project_time_entries.model.id = id
        }
        views.project_time_entries.collection = collections.project_time_entries.get_or_create(id);
        views.current = views.project_time_entries.render()
    }).on("route:project_posts", function (id) {
        if (collections.projects.get(id)) {
            views.project_posts.model = collections.projects.get(id)
        } else {
            views.project_posts.model.id = id
        }
        views.project_posts.collection = collections.project_posts.get_or_create(id);
        views.current = views.project_posts.render()
    }).on("route:project_files", function (id) {
        if (collections.projects.get(id)) {
            views.project_files.model = collections.projects.get(id)
        } else {
            views.project_files.model.id = id
        }
        views.project_files.collection = collections.project_files.get_or_create(id);
        views.current = views.project_files.render()
    }).on("route:project_calendar", function (id) {
        if (collections.projects.get(id)) {
            views.project_calendar.model = collections.projects.get(id)
        } else {
            views.project_calendar.model.id = id
        }
        views.project_calendar.collection = collections.project_calendar.get_or_create(id);
        views.current = views.project_calendar.render()
    }).on("route:project_todo_lists", function (id) {
        if (collections.projects.get(id)) {
            views.project_todo_lists.model = collections.projects.get(id)
        } else {
            views.project_todo_lists.model.id = id
        }
        views.project_todo_lists.collection = collections.project_todo_lists.get_or_create(id);
        views.current = views.project_todo_lists.render()
    }).on("route:defaultRoute", function (action) {
        this.navigate("projects", {
            trigger: true
        });
    });
    views.navbar = new NavView({
        model: models.mydata,
        el: '.navbar'
    }).render();
    models.mydata.fetch();
    models.mydata.once("sync", function () {
        Backbone.history.start();
    })
});