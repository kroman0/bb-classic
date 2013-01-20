$(function(){
    var error_handling = function(xhr, options) {
//         // window.console && window.console.log($.parseJSON(xhr.responseText).error);
        window.console && window.console.log(xhr.responseText);
    };
    uniq_hash = [];
    var add_hash=function(){
        var cur_hashs=_.uniq(_.map($("a"),function(i){return i.hash}));
        cur_hashs.map(function(i){
            if(uniq_hash.indexOf(i)==-1){uniq_hash.push(i)}
        });
    };
    // Backbone.emulateHTTP = true;
    var Project = Backbone.Model.extend({
        icon: function() {
            switch (this.get('status')) {
                case "active": return "icon-play";
                case "archived": return "icon-stop";
                case "on_hold": return "icon-pause";
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
        name: function() {
            return this.get('first-name')+' '+this.get('last-name')
        }
    });
    var People = Backbone.Collection.extend({
        parent_id: null, // project id
        url: function() {
            if (this.parent_id) return '/api/projects/'+this.parent_id+'/people.xml';
            return '/api/people.xml';
        },
        model: Person
    });
    var Post = Backbone.Model.extend();
    var Posts = Backbone.Collection.extend({
        parent_id: null, // project id
        url: function() {
            return '/api/projects/'+this.parent_id+'/posts.xml';
        },
        model: Post
    });
    var Attachment = Backbone.Model.extend();
    var Attachments = Backbone.Collection.extend({
        parent_id: null, // project id
        url: function() {
            return '/api/projects/'+this.parent_id+'/attachments.xml';
        },
        model: Attachment
    });
    var CalendarEntry = Backbone.Model.extend();
    var Calendar = Backbone.Collection.extend({
        parent_id: null, // project id
        url: function() {
            return '/api/projects/'+this.parent_id+'/calendar_entries.xml';
        },
        model: CalendarEntry
    });
    var Category = Backbone.Model.extend();
    var Categories = Backbone.Collection.extend({
        parent_id: null, // project id
        url: function() {
            return '/api/projects/'+this.parent_id+'/categories.xml';
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
        url: function() {
            if (this.parent_id&&this.parent=='project') return '/api/projects/'+this.parent_id+'/time_entries.xml';
            if (this.parent_id&&this.parent=='todo') return '/api/todo_items/'+this.parent_id+'/time_entries.xml';
            if (this.filter_report) return '/api/time_entries/report.xml?'+this.filter_report;
            return '/api/time_entries/report.xml';
        },
        model: TimeEntry
    });
    var TodoItem = Backbone.Model.extend();
    var TodoItems = Backbone.Collection.extend({
        parent_id: null,
        url: function() {
            return '/api/todo_lists/'+this.parent_id+'/todo_items.xml'
        },
        model: TodoItem
    });
    var TodoList = Backbone.Model.extend();
    var TodoLists = Backbone.Collection.extend({
        responsible_party: null, // person id
        parent_id: null, // project id
        filter_status: null, // filter for project [all\pending\finished]
        url: function() {
            if (this.parent_id && this.filter_status)
                return '/api/projects/'+this.parent_id+'/todo_lists.xml?filter='+this.filter_status;
            if (this.parent_id)
                return '/api/projects/'+this.parent_id+'/todo_lists.xml';
            if (this.responsible_party==null)
                return '/api/todo_lists.xml';
            if (this.responsible_party=="")
                return '/api/todo_lists.xml?responsible_party=';
            return '/api/todo_lists.xml?responsible_party='+this.responsible_party
        },
        model: TodoList
    });
    var TimeReportView = Backbone.View.extend({
        deps: function() {
            if(!this.collection.fetched) {
                this.collection.fetch();
                this.collection.fetched=true;
            } else if(this.options.collections.projects.isEmpty()) {
                this.options.collections.projects.fetch();
            } else if(this.options.collections.people.isEmpty()) {
                this.options.collections.people.fetch();
            } else if(this.options.collections.companies.isEmpty()) {
                this.options.collections.companies.fetch();
            }
            return this
        },
        events: {
            "click #getreport": "getreport"
        },
        getreport: function (e) {
            e.preventDefault();
            this.collection.filter_report=this.$('form#makereport').serialize();
            this.collection.fetch()
        },
        template: _.template($('#time-report-template').html()),
        name: function() {
            return "Time report"
        },
        render: function () {
            $('title').html(this.name()+" - BB");
            this.$el.html(this.template());
            if (this.collection.filter_report) {
                this.$el.find('form#makereport').deserialize(this.collection.filter_report)
            }
            return this;
        }
    });
    var AllPeopleView = Backbone.View.extend({
        deps: function() {
            if(this.collection.isEmpty()) {
                this.collection.fetch();
            } else if (this.options.collections.companies.isEmpty()) {
                this.options.collections.companies.fetch();
            }
            return this
        },
        template: _.template($('#people-template').html()),
        name: function() {
            return "People"
        },
        render: function () {
            $('title').html(this.name()+" - BB");
            this.$el.html(this.template());
            return this;
        }
    });
    var ProjectsView = Backbone.View.extend({
        deps: function() {
            if(this.collection.isEmpty()) {
                this.collection.fetch();
            }
            return this
        },
        template: _.template($('#projects-template').html()),
        render: function () {
            $('title').html("Projects - BB");
            this.$el.html(this.template());
            return this;
        }
    });
    var ProjectView = Backbone.View.extend({
        deps: function() {
            if(this.options.collections.projects.isEmpty()) {
                this.options.collections.projects.fetch();
            }
            return this
        },
        template: _.template($('#project-template').html()),
        name: function () {
            return this.model.get('name')
        },
        render: function () {
            $('title').html(this.name()+" - BB");
            this.$el.html(this.template());
            return this;
        }
    });
    var CompaniesView = Backbone.View.extend({
        deps: function() {
            if(this.collection.isEmpty()) {
                this.collection.fetch();
            }
            return this
        },
        template: _.template($('#companies-template').html()),
        name: function() {
            return "Companies"
        },
        render: function () {
            $('title').html(this.name()+" - BB");
            this.$el.html(this.template());
            return this;
        }
    });
    var CompanyView = Backbone.View.extend({
        deps: function() {
            if (this.options.collections.companies.isEmpty()) {
                this.options.collections.companies.fetch();
            } else if(this.options.collections.projects.isEmpty()) {
                this.options.collections.projects.fetch();
            } else if(this.options.collections.people.isEmpty()) {
                this.options.collections.people.fetch();
            }
            return this
        },
        template: _.template($('#company-template').html()),
        name: function() {
            return this.model.get('name')
        },
        render: function () {
            $('title').html(this.name()+" - BB");
            this.$el.html(this.template());
            return this;
        }
    });
    var PeopleView = Backbone.View.extend({
        deps: function() {
            if(this.collection.isEmpty()) {
                this.collection.fetch();
            } else if(this.options.collections.projects.isEmpty()) {
                this.options.collections.projects.fetch();
            } else if (this.options.collections.companies.isEmpty()) {
                this.options.collections.companies.fetch();
            }
            return this
        },
        template: _.template($('#project-people-template').html()),
        name: function() {
            return this.model.get('name')+" > People"
        },
        render: function () {
            $('title').html(this.name()+" - BB");
            this.$el.html(this.template());
            return this;
        }
    });
    var TimeEntriesView = Backbone.View.extend({
        deps: function() {
            if(!this.collection.fetched) {
                this.collection.fetch();
                this.collection.fetched=true;
            } else if(this.options.collections.projects.isEmpty()) {
                this.options.collections.projects.fetch();
            }
            return this
        },
        template: _.template($('#project-time-template').html()),
        name: function() {
            return this.model.get('name')+" > Time"
        },
        render: function () {
            $('title').html(this.name()+" - BB");
            this.$el.html(this.template());
            return this;
        }
    });
    var PostsView = Backbone.View.extend({
        deps: function() {
            if(this.collection.isEmpty()) {
                this.collection.fetch();
            } else if(this.options.collections.projects.isEmpty()) {
                this.options.collections.projects.fetch();
            }
            return this
        },
        template: _.template($('#project-posts-template').html()),
        name: function() {
            return this.model.get('name')+" > Posts"
        },
        render: function () {
            $('title').html(this.name()+" - BB");
            this.$el.html(this.template());
            return this;
        }
    });
    var FilesView = Backbone.View.extend({
        deps: function() {
            if(this.collection.isEmpty()) {
                this.collection.fetch();
            } else if(this.options.collections.projects.isEmpty()) {
                this.options.collections.projects.fetch();
            } else if(this.options.collections.people.isEmpty()) {
                this.options.collections.people.fetch();
            } else if(this.options.collections.project_categories.get_or_create(this.model.id).isEmpty()) {
                this.options.collections.project_categories.get_or_create(this.model.id).fetch();
            }
            return this
        },
        template: _.template($('#project-files-template').html()),
        name: function() {
            return this.model.get('name')+" > Files"
        },
        render: function () {
            $('title').html(this.name()+" - BB");
            this.$el.html(this.template());
            return this;
        }
    });
    var CalendarView = Backbone.View.extend({
        deps: function() {
            if(this.collection.isEmpty()) {
                this.collection.fetch();
            } else if(this.options.collections.projects.isEmpty()) {
                this.options.collections.projects.fetch();
            }
            return this
        },
        template: _.template($('#project-calendar-template').html()),
        name: function() {
            return this.model.get('name')+" > Calendar"
        },
        render: function () {
            $('title').html(this.name()+" - BB");
            this.$el.html(this.template());
            return this;
        }
    });
    var CategoriesView = Backbone.View.extend({
        deps: function() {
            if(this.collection.isEmpty()) {
                this.collection.fetch();
            } else if(this.options.collections.projects.isEmpty()) {
                this.options.collections.projects.fetch();
            }
            return this
        },
        template: _.template($('#project-categories-template').html()),
        name: function() {
            return this.model.get('name')+" > Categories"
        },
        render: function () {
            $('title').html(this.name()+" - BB");
            this.$el.html(this.template());
            return this;
        }
    });
    var PersonView = Backbone.View.extend({
        deps: function() {
            if(this.options.collections.people.isEmpty()) {
                this.options.collections.people.fetch();
            } else if (this.options.collections.companies.isEmpty()) {
                this.options.collections.companies.fetch();
            }
            return this
        },
        template: _.template($('#person-template').html()),
        name: function () {
            return this.model.name()
        },
        render: function () {
            $('title').html(this.name()+" - BB");
            this.$el.html(this.template());
            return this;
        }
    });
    var TodosView = Backbone.View.extend({
        deps: function() {
            if(this.collection.isEmpty()) {
                this.collection.fetch();
            } else if(this.options.collections.projects.isEmpty()) {
                this.options.collections.projects.fetch();
            } else if(this.options.collections.people.isEmpty()) {
                this.options.collections.people.fetch();
            }
            return this
        },
        events: {
            "change select[name='target']": "selectTarget"
        },
        selectTarget: function (e) {
            this.collection.responsible_party=$(e.target).val();
            this.collection.fetch()
        },
        template: _.template($('#todo-lists-template').html()),
        name: function() {
            if (this.collection.responsible_party) {
                var person = this.options.collections.people && this.options.collections.people.get(this.collection.responsible_party);
                return person ? person.name()+"'s to-dos" : this.collection.responsible_party+"'s to-dos"
            }
            if (this.collection.responsible_party==null) return "My to-dos";
            if (this.collection.responsible_party=="") return "Unassigned to-dos";
            return "To-dos"
        },
        description: function() {
            if (this.collection.responsible_party) {
                var person = this.options.collections.people && this.options.collections.people.get(this.collection.responsible_party);
                return person && person.name()+"'s" || this.collection.responsible_party+"'s"
            }
            if (this.collection.responsible_party==null) return "My";
            if (this.collection.responsible_party=="") return "Unassigned";
            return "All"
        },
        render: function () {
            $('title').html(this.name()+" - BB");
            this.$el.html(this.template());
            return this;
        }
    });
    var TodoListsView = Backbone.View.extend({
        deps: function() {
            if(this.collection.isEmpty()) {
                this.collection.fetch();
            } else if(this.options.collections.projects.isEmpty()) {
                this.options.collections.projects.fetch();
            } else this.sub();
            return this
        },
        template: _.template($('#project-todo-lists-template').html()),
        sub: function() {
            var todo_items=this.options.collections.todo_items;
            var td=_.map(this.collection.pluck('id'), function(id){return todo_items.get_or_create(id)});
            var ftd=_.first(td.filter(function(i){return !i.fetched}));
            if(ftd){
                ftd.fetched=true;
                ftd.fetch();
                console.log("sub", ftd.parent_id);
            }
        },
        name: function() {
            if (this.collection.parent_id) {
                return this.model.get('name')+" > To-dos"
            }
            return "To-dos"
        },
        render: function () {
            $('title').html(this.name()+" - BB");
            this.$el.html(this.template());
            return this;
        }
    });
//     var EditItemView = Backbone.View.extend({
//         initialize:function () {
//             this.model.bind("change", this.render, this);
//         },
//         template: _.template($('#edit-template').html()),
//         events: {
//             "click button[type=submit]": "save",
//             "click button[type=button]": "back"
//         },
//         save: function (e) {
//             e.preventDefault();
//             var valid = $('form').valid();
//             if (!valid) return false;
//             this.model.save({
//                 fname:$('[name=fname]').val(),
//                 lname:$('[name=lname]').val(),
//                 cname:$('[name=cname]').val(),
//                 email:$('[name=email]').val(),
//                 active:$('[name=active]').is(':checked')
//             });
//         },
//         back: function (e) {
//             e.preventDefault();
//             history.back();
//         },
//         render:function () {
//             this.$el.html(this.template($.extend({}, this.model.toJSON(), {
//                 "name": this.model.isNew()?'Add':'Edit',
//                 "action": this.model.isNew()?'Add':'Save'
//             })));
//             $('form').validate({
//                 rules: {
//                     email: {
//                         required: true,
//                         email: true
//                     },
//                 },
//                 highlight: function(label) {
//                     $(label).closest('.control-group').addClass('error');
//                 },
//                 success: function(label) {
//                     label.text('OK!').addClass('valid').closest('.control-group').addClass('success');
//                 }
//             });
//             return this;
//         }
//     });
    var MyModel = Backbone.Model.extend({
        defaults: {
            id: null,
        },
        name: function() {
            return this.get('first-name')+' '+this.get('last-name')
        },
        url: "/api/me.xml"
    });
//     var LoginView = Backbone.View.extend({
//         template: _.template($('#login-template').html()),
//         events: {
//             "click button[type=submit]": "login"
//         },
//         login: function(e){
//             e.preventDefault();
//             this.options.onlogin(this)
//         },
//         render: function () {
//             $('title').html("Login - BB");
//             this.$el.html(this.template());
//             return this;
//         }
//     });
    var NavView = Backbone.View.extend({
        template: _.template($('#nav-template').html()),
        initialize: function(){
            this.model.bind("change", this.render, this);
        },
        render: function () {
            if (!this.model.id) {
                $("body").css("background-color", "#f5f5f5");
            } else {
                $("body").css("background-color", "#FFFFFF");
            };
            this.$el.html(this.template());
            $(_.filter($(".navbar ul.nav li").removeClass("active"),function(i){return $(i).find("a:visible")[0]&&document.location.hash.indexOf($(i).find("a:visible")[0].hash)!==-1})).addClass("active")
            return this;
        }
    });
    models = {};
    collections = {};
    models.mydata = new MyModel();
    // default project
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
//     views.project = {};
//     views.company = {};
//     views.person = {};
    views.projects = new ProjectsView({collection: collections.projects, el: '.content', collections: collections});
    views.companies = new CompaniesView({collection: collections.companies, el: '.content', collections: collections});
    views.people = new AllPeopleView({collection: collections.people, el: '.content', collections: collections});
    views.times = new TimeReportView({collection: collections.times, el: '.content', collections: collections});
    views.todos = new TodosView({collection: collections.todos, el: '.content', collections: collections, mydata: models.mydata});
    // default project views
    var onReset = function(){
        console.log("onReset", views.current);
        Backbone.history.loadUrl();
//         views.current&&views.current.render();
//         views.current&&views.current.deps&&views.current.deps();
    };
    for(i in collections) {collections[i].on("reset", onReset)};
//     todo_lists = new TodoLists();
    collections.project_people = {};
    collections.project_categories = {};
    collections.project_posts = {};
    collections.project_files = {};
    collections.project_todo_lists = {};
    collections.project_calendar = {};
    collections.project_time_entries = {};
    collections.project_people[0] = new People();
    collections.project_categories[0] = new Categories();
    collections.project_posts[0] = new Posts();
    collections.project_files[0] = new Attachments();
    collections.project_todo_lists[0] = new TodoLists();
    collections.project_calendar[0] = new Calendar();
    collections.project_time_entries[0] = new TimeEntries();
    collections.todo_items = {};
    collections.todo_items[0] = new TodoItems();
    Object.prototype.get_or_create=function (id){
        if(!this[id]&&this[0]){
            this[id]=this[0].clone();
            this[id].parent_id=id;
            this[id].on("reset",onReset);
        }
        return this[id]
    };
//     collections.project_people.get = function (id){
//         if(!collections.project_people[id]){
//             collections.project_people[id]=collections.project_people[0].clone();
//             collections.project_people[id].parent_id=id;
//             collections.project_people[id].on("reset",onReset);
//         }
//         return collections.project_people[id]
//     };
//     collections.project_categories.get = function (id){
//         if(!collections.project_categories[id]){
//             collections.project_categories[id]=collections.project_categories[0].clone();
//             collections.project_categories[id].parent_id=id;
//             collections.project_categories[id].on("reset",onReset);
//         }
//         return collections.project_categories[id]
//     };
//     views.login_view = new LoginView({model: models.mydata, el: '.content'});
    views.project_view = new ProjectView({model: models.project, el: '.content', collections: collections});
    views.company_view = new CompanyView({model: models.company, el: '.content', collections: collections});
    views.person_view = new PersonView({model: models.person, el: '.content', collections: collections})
    views.project_people = new PeopleView({model: models.project, el: '.content', collections: collections});
    views.project_categories = new CategoriesView({model: models.project, el: '.content', collections: collections})
    views.project_posts = new PostsView({model: models.project, el: '.content', collections: collections})
    views.project_todo_lists = new TodoListsView({model: models.project, el: '.content', collections: collections})
    views.project_calendar = new CalendarView({model: models.project, el: '.content', collections: collections})
    views.project_files = new FilesView({model: models.project, el: '.content', collections: collections})
    views.project_time_entries = new TimeEntriesView({model: models.project, el: '.content', collections: collections})
    collections.projects.on("reset",function(){
        this.each(function(p){
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
//             "login": "login",
//             "logout": "logout",
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
    workspace.on("all", function(action) {
        add_hash();
        views.current&&views.current.deps&&views.current.deps();
        $(_.filter($(".navbar ul.nav li").removeClass("active"),function(i){return $(i).find("a:visible")[0]&&document.location.hash.indexOf($(i).find("a:visible")[0].hash)!==-1})).addClass("active")
//     }).on("route:login", function() {
//         views.current = views.login_view.render()
//         views.current = new LoginView({
//             el: '.content',
//             onlogin: function(view){
//                 view.model.fetch({
//                     headers: {"Authorization": "Basic " + btoa(view.$("[name=username]").val()+":"+view.$("[name=password]").val())},
//                     success: function(model, xhr, options) {
//                         workspace.navigate("projects", {trigger: true});
//                     },
//                     error: function (model, xhr, options) {
//                         console.log(xhr.responseText)
//                     }
//                 })
//             },
//             model: models.mydata
//         }).render()
//         views.current.delegateEvents({
//             "click button[type=submit]": "login"
//         });
//     }).on("route:logout", function() {
//         $('title').html("Logout &middot; BB");
//         mydata.save({username: ""});
    }).on("route:projects", function() {
        views.current = views.projects.render()
    }).on("route:project", function(id) {
        if(collections.projects.get(id)){views.project_view.model=collections.projects.get(id)}else{views.project_view.model.id=id}
        views.current = views.project_view.render()
    }).on("route:companies", function() {
        views.current = views.companies.render()
    }).on("route:company", function(id) {
        if(collections.companies.get(id)){views.company_view.model=collections.companies.get(id)}else{views.company_view.model.id=id}
        views.current = views.company_view.render()
    }).on("route:people", function() {
        views.current = views.people.render()
    }).on("route:person", function(id) {
        if(collections.people.get(id)){views.person_view.model=collections.people.get(id)}else{views.person_view.model.id=id}
        views.current = views.person_view.render()
    }).on("route:me", function() {
        views.person_view.model=models.mydata
        views.current = views.person_view.render()
    }).on("route:timereport", function() {
        views.current = views.times.render()
    }).on("route:todo_lists", function() {
        views.current = views.todos.render()
    }).on("route:project_people", function(id) {
        if(collections.projects.get(id)){views.project_people.model=collections.projects.get(id)}else{views.project_people.model.id=id}
        views.project_people.collection=collections.project_people.get_or_create(id);
        views.current = views.project_people.render()
    }).on("route:project_categories", function(id) {
        if(collections.projects.get(id)){views.project_categories.model=collections.projects.get(id)}else{views.project_categories.model.id=id}
        views.project_categories.collection=collections.project_categories.get_or_create(id);
        views.current = views.project_categories.render()
    }).on("route:project_time_entries", function(id) {
        if(collections.projects.get(id)){views.project_time_entries.model=collections.projects.get(id)}else{views.project_time_entries.model.id=id}
        views.project_time_entries.collection=collections.project_time_entries.get_or_create(id);
        views.current = views.project_time_entries.render()
    }).on("route:project_posts", function(id) {
        if(collections.projects.get(id)){views.project_posts.model=collections.projects.get(id)}else{views.project_posts.model.id=id}
        views.project_posts.collection=collections.project_posts.get_or_create(id);
        views.current = views.project_posts.render()
    }).on("route:project_files", function(id) {
        if(collections.projects.get(id)){views.project_files.model=collections.projects.get(id)}else{views.project_files.model.id=id}
        views.project_files.collection=collections.project_files.get_or_create(id);
        views.current = views.project_files.render()
    }).on("route:project_calendar", function(id) {
        if(collections.projects.get(id)){views.project_calendar.model=collections.projects.get(id)}else{views.project_calendar.model.id=id}
        views.project_calendar.collection=collections.project_calendar.get_or_create(id);
        views.current = views.project_calendar.render()
    }).on("route:project_todo_lists", function(id) {
        if(collections.projects.get(id)){views.project_todo_lists.model=collections.projects.get(id)}else{views.project_todo_lists.model.id=id}
        views.project_todo_lists.collection=collections.project_todo_lists.get_or_create(id);
        views.current = views.project_todo_lists.render()
//     }).on("route:edit", function(uuid) {
//         $('title').html("Edit Customer &middot; CRM");
//         var item = customers.get(uuid)
//         item.on("sync", function() {
//             workspace.navigate("customer/", {trigger: true});
//         });
//         $('.content').html(new EditItemView({model: item}).render().el);
//     }).on("route:add", function() {
//         $('title').html("Add Customer &middot; CRM");
//         var item = new Customer();
//         item.on("sync", function() {
//             customers.add(this);
//             workspace.navigate("customer/", {trigger: true});
//             this.off("sync");
//         });
//         $('.content').html(new EditItemView({model: item}).render().el);
    }).on("route:defaultRoute", function(action) {
        this.navigate("projects", {trigger: true});
    });
    views.navbar = new NavView({model: models.mydata, el: '.navbar'}).render();
    models.mydata.fetch();
    Backbone.history.start();
//     window.console && window.console.log({'jQuery':jQuery().jquery,'Underscore':_.VERSION,'Backbone':Backbone.VERSION});
});
