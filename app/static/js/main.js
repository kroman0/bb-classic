/*jslint nomen: true, white: true*/
/*global document*/
(function(root, factory) {
    'use strict';
    if (typeof root.define === 'function' && root.define.amd) {
        // AMD. Register as the bbmain module.
        root.define('bbmain', [
            'jquery',
            'underscore',
            'backbone',
            'bbgeneral',
            'bbmodels',
            'bbcollections',
            'bbviews',
            'backboneanalytics'
        ], factory);
    } else {
        // Browser globals
        root.BB = factory(
            root.jQuery,
            root._,
            root.Backbone,
            root.bbgeneral,
            root.bbmodels,
            root.bbcollections,
            root.bbviews
        );
    }
}(this, function($, _, Backbone, bbgeneral, bbmodels, bbcollections, bbviews) {
    'use strict';
    return;
    var i,
        models = {},
        collections = {},
        views = {},
        onReset = bbgeneral.onReset,
        viewdata = {
            el: '.content',
            collections: collections
        },
        oproject,
        otodo,
        otime,
        Workspace = Backbone.Router.extend({
            routes: {
                'projects': 'projects',
                'projects:tab': 'projects',
                'projects/:id': 'project',
                'projects/:id/todo_lists': 'project_todo_lists',
                'projects/:id/todo_lists/:tlid': 'project_todo_list',
                'projects/:id/todo_lists/:tlid/:tiid': 'project_todo_item',
                'projects/:id/todo_lists/:tlid/:tiid/comments': 'project_todo_item_comments',
                'projects/:id/time_entries/todo_items/:tiid': 'todo_time_entries',
                'projects/:id/time_entries': 'project_time_entries',
                'projects/:id/people': 'project_people',
                'projects/:id/posts': 'project_posts',
                'projects/:id/posts/:pid': 'project_post',
                'projects/:id/posts/:pid/comments': 'project_post_comments',
                'projects/:id/files': 'project_files',
                'projects/:id/files/:fid': 'project_file',
                'projects/:id/calendar': 'project_calendar',
                'projects/:id/calendar/:cid': 'project_calendar_entry',
                'projects/:id/calendar/:cid/comments': 'project_calendar_entry_comments',
                'projects/:id/categories': 'project_categories',
                'projects/:id/categories/:cid': 'project_category',
                'companies': 'companies',
                'companies/:id': 'company',
                'people': 'people',
                'people:tab': 'people',
                'people/:id': 'person',
                'me': 'me',
                'todos': 'todos',
                'time_report': 'time_report',
                '*actions': 'defaultRoute'
            }
        }),
        workspace = new Workspace();
    models.mydata = new bbmodels.MyModel();
    models.project = new bbmodels.Project();
    models.company = new bbmodels.Company();
    models.person = new bbmodels.Person();
    collections.projects = new bbcollections.Projects();
    collections.companies = new bbcollections.Companies();
    collections.people = new bbcollections.People();
    collections.todos = new bbcollections.TodoLists();
    collections.times = new bbcollections.TimeEntries();
    views.current = null;
    views.projects = new bbviews.ProjectsView(_.extend({
        collection: collections.projects
    }, viewdata));
    views.companies = new bbviews.CompaniesView(_.extend({
        collection: collections.companies
    }, viewdata));
    views.people = new bbviews.AllPeopleView(_.extend({
        collection: collections.people
    }, viewdata));
    views.time_report = new bbviews.TimeReportView(_.extend({
        collection: collections.times
    }, viewdata));
    views.todos = new bbviews.TodosView(_.extend({
        collection: collections.todos,
        mydata: models.mydata
    }, viewdata));
    for (i in collections) {
        if (collections.hasOwnProperty(i)) {
            collections[i].on('reset', onReset);
        }
    }
    collections.project_people = new bbcollections.People();
    collections.project_categories = new bbcollections.Categories();
    collections.project_posts = new bbcollections.Posts();
    collections.project_files = new bbcollections.Attachments();
    collections.project_todo_lists = new bbcollections.TodoLists();
    collections.project_calendar = new bbcollections.Calendar();
    collections.project_time_entries = new bbcollections.TimeEntries();
    collections.todo_items = new bbcollections.TodoItems();
    collections.todo_time_entries = new bbcollections.TodoTimeEntries();
    collections.project_todo_item_comments = new bbcollections.TodoComments();
    collections.project_post_comments = new bbcollections.PostComments();
    collections.project_calendar_entry_comments = new bbcollections.CalendarEntryComments();
    views.company_view = new bbviews.CompanyView(_.extend({
        model: models.company
    }, viewdata));
    views.person_view = new bbviews.PersonView(_.extend({
        model: models.person
    }, viewdata));
    oproject = _.extend({
        model: models.project
    }, viewdata);
    views.project_view = new bbviews.ProjectView(oproject);
    views.project_people = new bbviews.PeopleView(oproject);
    views.project_categories = new bbviews.CategoriesView(oproject);
    views.project_category = new bbviews.CategoryView(oproject);
    views.project_posts = new bbviews.PostsView(oproject);
    views.project_post = new bbviews.PostView(oproject);
    views.project_calendar = new bbviews.CalendarView(oproject);
    views.project_calendar_entry = new bbviews.CalendarEntryView(oproject);
    views.project_files = new bbviews.FilesView(oproject);
    views.project_file = new bbviews.FileView(oproject);
    otime = _.extend({
        mydata: models.mydata
    }, oproject);
    views.project_time_entries = new bbviews.TimeEntriesView(otime);
    views.todo_time_entries = new bbviews.TodoTimeEntriesView(otime);
    views.project_post_comments = new bbviews.PostCommentsView(oproject);
    views.project_calendar_entry_comments = new bbviews.CalendarEntryCommentsView(oproject);
    views.todo = function(prid, item) {
        if (!views.todo[item.id]) {
            views.todo[item.id] = new bbviews.TodoView({model: item, collections: collections, project_id: prid});
        }
        return views.todo[item.id];
    };
    otodo = _.extend({
        todo: views.todo
    }, oproject);
    views.project_todo_lists = new bbviews.TodoListsView(otodo);
    views.project_todo_list = new bbviews.TodoListView(otodo);
    views.project_todo_item = new bbviews.TodoItemView(otodo);
    views.project_todo_item_comments = new bbviews.TodoItemCommentsView(otodo);
    workspace.on('route', function(route, params) {
        var id, cur_item;
        if (_.contains(['projects', 'companies', 'people', 'time_report', 'todos'], route)) {
            views.current = views[route].render();
        } else if (_.contains(['project_people', 'project_categories', 'project_time_entries', 'project_posts', 'project_files', 'project_calendar', 'project_todo_lists'], route)) {
            id = parseInt(params[0], 10);
            if (collections.projects.get(id)) {
                views[route].model = collections.projects.get(id);
            } else {
                views[route].model.id = id;
            }
            views[route].collection = collections[route].get_or_create(id);
            views.current = views[route].render();
        } else if (_.contains(['project_post', 'project_file', 'project_calendar_entry', 'project_category', 'project_todo_list', 'project_calendar_entry_comments', 'project_post_comments', 'todo_time_entries'], route)) {
            id = parseInt(params[0], 10);
            cur_item = parseInt(params[1], 10);
            if (collections.projects.get(id)) {
                views[route].model = collections.projects.get(id);
            } else {
                views[route].model.id = id;
            }
            views[route].cur_item = cur_item;
            switch (route) {
            case 'project_calendar_entry':
                views[route].collection = collections.project_calendar.get_or_create(id);
                break;
            case 'project_category':
                views[route].collection = collections.project_categories.get_or_create(id);
                break;
            case 'project_post':
            case 'project_file':
            case 'project_todo_list':
                views[route].collection = collections[route + 's'].get_or_create(id);
                break;
            default:
                views[route].collection = collections[route].get_or_create(cur_item);
            }
            views.current = views[route].render();
        }
        if (views.current) {
            document.title = views.current.PageTitle();
        }
//         add_hash();
        if (views.current && views.current.deps) {
            views.current.deps();
        }
        $(_.filter($('.navbar ul.nav li').removeClass('active'), function(i) {
            return $(i).find('a:visible')[0] && document.location.hash.indexOf($(i).find('a:visible')[0].hash) !== -1;
        })).addClass('active');
        $(_.filter($('div.content ul.projectnav li').removeClass('active'), function(i) {
            return $(i).find('a:visible')[0] && document.location.hash.indexOf($(i).find('a:visible')[0].hash) !== -1;
        })).filter(':last').addClass('active');
    }).on('route:project_todo_item', function(id, tlid, tiid) {
        if (collections.projects.get(id)) {
            views.project_todo_item.model = collections.projects.get(id);
        } else {
            views.project_todo_item.model.id = id;
        }
        views.project_todo_item.cur_item = tlid;
        views.project_todo_item.todo_item = tiid;
        views.project_todo_item.collection = views.project_todo_item.todo_lists = collections.project_todo_lists.get_or_create(id);
        views.current = views.project_todo_item.render();
    }).on('route:project_todo_item_comments', function(id, tlid, tiid) {
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
    }).on('route:project', function(id) {
        if (collections.projects.get(id)) {
            views.project_view.model = collections.projects.get(id);
        } else {
            views.project_view.model.id = id;
        }
        views.current = views.project_view.render();
    }).on('route:company', function(id) {
        if (collections.companies.get(id)) {
            views.company_view.model = collections.companies.get(id);
        } else {
            views.company_view.model.id = id;
        }
        views.current = views.company_view.render();
    }).on('route:person', function(id) {
        if (collections.people.get(id)) {
            views.person_view.model = collections.people.get(id);
        } else {
            views.person_view.model.id = id;
        }
        views.current = views.person_view.render();
    }).on('route:me', function() {
        views.person_view.model = models.mydata;
        views.current = views.person_view.render();
    }).on('route:defaultRoute', function() {
        this.navigate('projects', {
            trigger: true
        });
    });
    views.navbar = new bbviews.NavView({
        model: models.mydata,
        el: '.navbar'
    }).render();
    models.mydata.once('sync', function() {
        Backbone.history.start();
    });
    models.mydata.fetch();
    return {
        models: models,
        collections: collections,
        views: views,
        workspace: workspace
    };
}));

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



'use strict';

var BB = window.BB = new Backbone.Marionette.Application();

Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(templateId) {
    var template = window.templates[templateId];
    if (!template || template.length === 0) {
      throwError("Could not find template: '" + templateId + "'", 'NoTemplateError');
    }
    return template;
};

BB.collections = {};
BB.views = {};

BB.addRegions({
    navRegion: '#navbar',
    headerRegion: '#header',
    mainRegion: '#content'
});

BB.module('Projects', function(Projects, App, Backbone, Marionette, $, _) {
    // Project Model
    // -------------
    Projects.Model = Backbone.Model.extend({
        urlRoot: '/api/projects/',
        icon: function() {
            switch (this.get('status')) {
            case 'active':
                return 'icon-play';
            case 'archived':
                return 'icon-stop';
            case 'on_hold':
                return 'icon-pause';
            }
        }
    });

    // Project Collection
    // ------------------
    Projects.Collection = Backbone.Collection.extend({
        url: '/api/projects.xml',
        model: Projects.Model
    });
    Projects.ItemView = Marionette.ItemView.extend({
        tagName: 'li',
        template: '#oneproject-template'
    });
    Projects.EmptyView = Marionette.ItemView.extend({
        template: '#emptyprojects-template'
    });

    Projects.View = Marionette.CompositeView.extend({
        id: 'projects',
        template: '#projects-template',
        itemView: Projects.ItemView,
        emptyView: Projects.EmptyView,
        templateHelpers: function() {return {view: this}; },
        name: function() {
            return 'Projects';
        },
        appendHtml: function(collectionView, itemView) {
            if (itemView.model.get('company')) {
                var coid = itemView.model.get('company').id,
                    status = itemView.model.get('status'),
                    holder = '#projects_' + status + '_' + coid + ' ul';
                collectionView.$(holder).append(itemView.el);
            } else {
                collectionView.$el.append(itemView.el);
            }
        },
        initialize: function() {
            this.collection.bind('sync', this.render, this);
        }
    });
    Projects.Header = Marionette.View.extend({
        className: 'page-header',
        template: '#header1-template',
        render: function() {
            this.$el.html(_.template(window.templates[this.template], this.name(), {variable: 'name'}));
            return this;
        },
        name: function() {
            return 'Projects';
        }
    });
    App.on('initialize:before', function(options) {
        App.collections.projects = new Projects.Collection();
        App.views.projectsView = new Projects.View({
            collection: App.collections.projects
        });
        App.views.projectsHeader = new Projects.Header({
            collection: App.collections.projects
        });
    });
});

BB.module('Companies', function(Companies, App, Backbone, Marionette, $, _) {
    // Company Model
    // -------------
    Companies.Model = Backbone.Model.extend({
        urlRoot: '/api/companies/'
    });

    // Company Collection
    // ------------------
    Companies.Collection = Backbone.Collection.extend({
        url: '/api/companies.xml',
        model: Companies.Model
    });

    Companies.ItemView = Marionette.ItemView.extend({
        tagName: 'li',
        template: '#onecompany-template'
    });

    Companies.EmptyView = Marionette.ItemView.extend({
        tagName: 'li',
        template: '#emptycompanies-template'
    });

    Companies.View = Marionette.CompositeView.extend({
        tagName: 'ul',
        id: 'companies',
        className: 'unstyled',
        template: '#companies-template',
        itemView: Companies.ItemView,
        emptyView: Companies.EmptyView,
        name: function() {
            return 'Companies';
        },
        appendHtml: function(collectionView, itemView) {
            collectionView.$el.append(itemView.el);
        },
        initialize: function() {
            this.collection.bind('sync', this.render, this);
        }
    });
    Companies.Header = Marionette.View.extend({
        className: 'page-header',
        template: '#header1-template',
        render: function() {
            this.$el.html(_.template(window.templates[this.template], this.name(), {variable: 'name'}));
            return this;
        },
        name: function() {
            return 'Companies';
        }
    });
    App.on('initialize:before', function(options) {
        App.collections.companies = new Companies.Collection();
        App.views.companiesView = new Companies.View({
            collection: App.collections.companies
        });
        App.views.companiesHeader = new Companies.Header({
            collection: App.collections.companies
        });
    });

});

BB.module('People', function(People, App, Backbone, Marionette, $, _) {
    People.Model = Backbone.Model.extend({
        urlRoot: '/api/people/',
        name: function() {
            return this.get('first-name') + ' ' + this.get('last-name');
        }
    });
    People.Collection = Backbone.Collection.extend({
        parent_id: null, // project id
        url: function() {
            if (this.parent_id) {
                return '/api/projects/' + this.parent_id + '/people.xml';
            }
            return '/api/people.xml';
        },
        model: People.Model
    });
    People.ItemView = Marionette.ItemView.extend({
        templateHelpers: function() {return {item: this.model}; },
        tagName: 'li',
        className: 'media well well-small',
        template: '#personitem-template'
    });

    People.EmptyView = Marionette.ItemView.extend({
//         tagName: "li",
        template: '#emptypeople-template'
    });

    People.View = Marionette.CompositeView.extend({
        id: 'people',
        template: '#people-template',
        itemView: People.ItemView,
        emptyView: People.EmptyView,
        templateHelpers: function() {return {view: this}; },
        appendHtml: function(collectionView, itemView) {
            if (itemView.model.get('company')) {
                var coid = itemView.model.get('company').id,
                    holder = '#people_c' + coid + ' ul.media-list';
                if (collectionView.$(holder).length) {
                    collectionView.$(holder).append(itemView.el);
                } else {
                    collectionView.$('ul.media-list').append(itemView.el);
                }
            } else {
                collectionView.$el.append(itemView.el);
            }
        },
        initialize: function() {
            this.collection.bind('sync', this.render, this);
        }
    });
    People.Header = Marionette.View.extend({
        className: 'page-header',
        template: '#header1-template',
        render: function() {
            this.$el.html(_.template(window.templates[this.template], this.name(), {variable: 'name'}));
            return this;
        },
        name: function() {
            return 'People';
        }
    });
    People.PersonView = Marionette.ItemView.extend({
        templateHelpers: function() {return {item: this.model}; },
        template: '#person-template'
    });
    People.PersonHeader = Marionette.View.extend({
        className: 'page-header',
        template: '#header1-template',
        render: function() {
            this.$el.html(_.template(window.templates[this.template], this.name(), {variable: 'name'}));
            return this;
        },
        name: function() {
            return this.model.name();
        }
    });
    App.on('initialize:before', function(options) {
        App.collections.people = new People.Collection();
        App.views.peopleView = new People.View({
            collection: App.collections.people
        });
        App.views.peopleHeader = new People.Header({
            collection: App.collections.people
        });
        App.views.personView = new People.PersonView({
            model: new People.Model()
        });
        App.views.personHeader = new People.PersonHeader({
            model: new People.Model()
        });
    });
});

BB.module('Time', function(Time, App, Backbone, Marionette, $, _) {
    Time.Model = Backbone.Model.extend({
        urlRoot: '/api/time_entries/'
    });
    Time.Collection = Backbone.PageableCollection.extend({
        mode: 'client',
        parent_id: null, // project id
        parent: 'projects',
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
            if (_.isFinite(this.parent_id)) {
                return '/api/' + this.parent + '/' + this.parent_id + '/time_entries.xml';
            }
            if (this.filter_report) {
                return '/api/time_entries/report.xml?' + this.filter_report;
            }
            return '/api/time_entries/report.xml';
        },
        model: Time.Model
    });
    Time.ItemView = Marionette.ItemView.extend({
        templateHelpers: function() {return {item: this.model}; },
        tagName: 'tr',
        className: function() {return this.model.get('hours') > 2 ? 'warning' : undefined; },
        template: '#time-template'
    });

    Time.EmptyView = Marionette.ItemView.extend({
//         tagName: "li",
        template: '#emptytime-template'
    });

    Time.View = Marionette.CompositeView.extend({
        id: 'time-report',
        template: '#time-report-template',
        itemView: Time.ItemView,
        emptyView: Time.EmptyView,
        pagerid: 'time-report',
        events: {
            'click .time-report.previous': 'previous',
            'click .time-report.next': 'next',
            'click #getreport': 'getreport'
        },
        previous: function(e) {
            e.preventDefault();
            return this.collection.hasPrevious() && this.collection.getPreviousPage() && this.render();
        },
        next: function(e) {
            e.preventDefault();
            return this.collection.hasNext() && this.collection.getNextPage() && this.render();
        },
        getreport: function(e) {
            e.preventDefault();
            this.collection.filter_report = $.param(_.filter(this.$('form#makereport').serializeArray(), function(i) {return i.value; }));
            this.collection.fetch({cache: true});
        },
        renderpager: function() {
            return _.template(window.templates['#pager-template'], this, {variable: 'view'});
        },
        templateHelpers: function() {return {view: this}; },
        appendHtml: function(collectionView, itemView) {
            if (_.isFinite(itemView.model.get('project-id'))) {
                var prid = itemView.model.get('project-id'),
                    holder = '#times_p' + prid;
                collectionView.$(holder).after(itemView.el);
            } else {
                collectionView.$el.append(itemView.el);
            }
        },
        initialize: function() {
            this.collection.bind('sync', this.render, this);
        }
    });
    Time.Header = Marionette.View.extend({
        className: 'page-header',
        template: '#header1-template',
        render: function() {
            this.$el.html(_.template(window.templates[this.template], this.name(), {variable: 'name'}));
            return this;
        },
        name: function() {
            return 'Time report';
        }
    });
    App.on('initialize:before', function(options) {
        App.collections.times = new Time.Collection();
        App.views.timesView = new Time.View({
            collection: App.collections.times
        });
        App.views.timesHeader = new Time.Header({
            collection: App.collections.times
        });
    });
});


BB.module('Todo', function(Todo, App, Backbone, Marionette, $, _) {
    Todo.Model = Backbone.Model.extend({
        urlRoot: '/api/todo_items/',
        complete: function() {
            this.save('completed', true, {url: _.result(this, 'url').replace('.xml', '/complete.xml')});
        },
        uncomplete: function() {
            this.save('completed', false, {url: _.result(this, 'url').replace('.xml', '/uncomplete.xml')});
        }
    });
    Todo.Collection = Backbone.Collection.extend({
        responsible_party: null, // person id
        parent_id: null, // project id
        filter_status: null, // filter for project [all\pending\finished]
        url: function() {
            if (_.isFinite(this.parent_id) && this.filter_status) {
                return '/api/projects/' + this.parent_id + '/todo_lists.xml?filter=' + this.filter_status;
            }
            if (_.isFinite(this.parent_id)) {
                return '/api/projects/' + this.parent_id + '/todo_lists.xml';
            }
            if (this.responsible_party === null) {
                return '/api/todo_lists.xml';
            }
            if (this.responsible_party === '') {
                return '/api/todo_lists.xml?responsible_party=';
            }
            return '/api/todo_lists.xml?responsible_party=' + this.responsible_party;
        },
        model: Todo.Model
    });
    Todo.ItemView = Marionette.ItemView.extend({
        templateHelpers: function() {return {list: this.model}; },
        tagName: 'dl',
        template: '#todolist-template'
    });

    Todo.EmptyView = Marionette.ItemView.extend({
        tagName: 'li',
        template: '#emptytodos-template'
    });

    Todo.View = Marionette.CompositeView.extend({
        tagName: 'ul',
        id: 'todos',
        className: 'unstyled',
        template: '#todo-lists-template',
        itemView: Todo.ItemView,
        emptyView: Todo.EmptyView,
        events: {
            "change select[name='target']": 'selectTarget'
        },
        selectTarget: function(e) {
            console.log('selectTarget');
            this.collection.responsible_party = $(e.target).val();
            this.collection.fetch({cache: true});
        },
        templateHelpers: function() {return {view: this}; },
        appendHtml: function(collectionView, itemView) {
            if (_.isFinite(itemView.model.get('project-id'))) {
                var prid = itemView.model.get('project-id'),
                    holder = '#todos_p' + prid;
                collectionView.$(holder).append(itemView.el);
            } else {
                collectionView.$el.append(itemView.el);
            }
        },
        initialize: function() {
            this.collection.bind('sync', this.render, this);
        },
        description: function() {
            if (this.collection.responsible_party) {
                var person = App.collections.people && App.collections.people.get(this.collection.responsible_party);
                return person ? person.name() + "'s" : this.collection.responsible_party + "'s";
            }
            if (this.collection.responsible_party === null) {
                return 'My';
            }
            if (this.collection.responsible_party === '') {
                return 'Unassigned';
            }
            return 'All';
        }
    });
    Todo.Header = Marionette.View.extend({
        className: 'page-header',
        template: '#header1-template',
        render: function() {
            this.$el.html(_.template(window.templates[this.template], this.name(), {variable: 'name'}));
            return this;
        },
        name: function() {
            if (this.collection.responsible_party) {
                var person = App.collections.people && App.collections.people.get(this.collection.responsible_party);
                return person ? person.name() + "'s to-dos" : this.collection.responsible_party + "'s to-dos";
            }
            if (this.collection.responsible_party === null) {
                return 'My to-dos';
            }
            if (this.collection.responsible_party === '') {
                return 'Unassigned to-dos';
            }
            return 'To-dos';
        }
    });
    App.on('initialize:before', function(options) {
        App.collections.todos = new Todo.Collection();
        App.views.todosView = new Todo.View({
            collection: App.collections.todos
        });
        App.views.todosHeader = new Todo.Header({
            collection: App.collections.todos
        });
    });

});

BB.module('Base', function(Base, App, Backbone, Marionette, $, _) {
    Base.Me = App.People.Model.extend({
        url: '/api/me.xml'
    });
    var NavBarView = Base.NavBarView = Marionette.View.extend({
        template: '#nav-template',
        className: 'navbar-inner',
        render: function() {
            this.$el.html(_.template(window.templates[this.template], this, {variable: 'view'}));
            return this;
        },
        initialize: function() {
            this.model.bind('change', this.render, this);
        }
    });

    App.on('initialize:before', function(options) {
        App.me = new Base.Me();
        var navbarView = new Base.NavBarView({model: App.me});
        App.navRegion.show(navbarView);
    });
});

BB.addInitializer(function(options) {
    BB.me.fetch();
    BB.collections.projects.fetch();
    BB.collections.companies.fetch();
    BB.collections.people.fetch();
    BB.collections.times.fetch();
    BB.collections.todos.fetch();
});

var Workspace = Backbone.Router.extend({
    routes: {
        'projects': 'projects',
        'projects:tab': 'projects',
        'projects/:id': 'project',
        'projects/:id/todo_lists': 'project_todo_lists',
        'projects/:id/todo_lists/:tlid': 'project_todo_list',
        'projects/:id/todo_lists/:tlid/:tiid': 'project_todo_item',
        'projects/:id/todo_lists/:tlid/:tiid/comments': 'project_todo_item_comments',
        'projects/:id/time_entries/todo_items/:tiid': 'todo_time_entries',
        'projects/:id/time_entries': 'project_time_entries',
        'projects/:id/people': 'project_people',
        'projects/:id/posts': 'project_posts',
        'projects/:id/posts/:pid': 'project_post',
        'projects/:id/posts/:pid/comments': 'project_post_comments',
        'projects/:id/files': 'project_files',
        'projects/:id/files/:fid': 'project_file',
        'projects/:id/calendar': 'project_calendar',
        'projects/:id/calendar/:cid': 'project_calendar_entry',
        'projects/:id/calendar/:cid/comments': 'project_calendar_entry_comments',
        'projects/:id/categories': 'project_categories',
        'projects/:id/categories/:cid': 'project_category',
        'companies': 'companies',
        'companies/:id': 'company',
        'people': 'people',
        'people:tab': 'people',
        'people/:id': 'person',
        'me': 'me',
        'todos': 'todos',
        'time_report': 'time_report',
        '*actions': 'defaultRoute'
    }
});
var workspace = new Workspace();
workspace.on('route', function(route, params) {
    console.log(route, params);
}).on('route:projects', function() {
    BB.headerRegion.show(BB.views.projectsHeader);
    BB.mainRegion.show(BB.views.projectsView);
}).on('route:companies', function() {
    BB.headerRegion.show(BB.views.companiesHeader);
    BB.mainRegion.show(BB.views.companiesView);
}).on('route:people', function() {
    BB.headerRegion.show(BB.views.peopleHeader);
    BB.mainRegion.show(BB.views.peopleView);
}).on('route:time_report', function() {
    BB.headerRegion.show(BB.views.timesHeader);
    BB.mainRegion.show(BB.views.timesView);
}).on('route:todos', function() {
    BB.headerRegion.show(BB.views.todosHeader);
    BB.mainRegion.show(BB.views.todosView);
}).on('route:me', function() {
    BB.views.personHeader.model = BB.me;
    BB.views.personView.model = BB.me;
    BB.headerRegion.show(BB.views.personHeader);
    BB.mainRegion.show(BB.views.personView);
}).on('route:person', function(id) {
    BB.views.personHeader.model = BB.collections.people.get(id);
    BB.views.personView.model = BB.collections.people.get(id);
    BB.headerRegion.show(BB.views.personHeader);
    BB.mainRegion.show(BB.views.personView);
}).on('route:defaultRoute', function(action) {
    this.navigate('projects', {
        trigger: true
    });
});

BB.on('initialize:after', function(options) {
    if (Backbone.history) {
        Backbone.history.start();
    }
});
$(document).ready(function() {
    BB.start();
});
