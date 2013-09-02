/*jslint nomen: true, white: true*/
(function(root, factory) {
    'use strict';
    if (typeof root.define === 'function' && root.define.amd) {
        // AMD. Register as the bbcollections module.
        root.define('bbcollections', [
            'underscore',
            'backbone',
            'backbonepageable',
            'bbmodels'
        ], factory);
    } else {
        // Browser globals
        root.bbcollections = factory(
            root._,
            root.Backbone,
            root.Backbone.PageableCollection,
            root.bbmodels
        );
    }
}(this, function(_, Backbone, PageableCollection, bbmodels) {
    'use strict';
    var bbcollections = {},
        $ = Backbone.$,
        onReset = function() {
            Backbone.history.loadUrl();
            $('.spinner').addClass('off');
        },
        BBCollectionExtra = {
            initialize: function() {
                this.on('reset', onReset);
                this.on('remove', onReset);
            },
            fetchonce: function() {
                var fetched = this.fetched;
                if (!fetched) {
                    this.fetched = true;
                    this.fetch({cache: true, reset: true});
                }
                return fetched;
            },
            get_or_create: function(id) {
                if (!this[id]) {
                    this[id] = this.clone();
                    this[id].parent_id = id;
                    this[id].on('reset', onReset);
                    this[id].on('remove', onReset);
                }
                return this[id];
            },
            sync: function(method, model, options) {
                $('.spinner').removeClass('off');
                return Backbone.sync.call(this, method, model, options);
            }
        },
        BBCollection = Backbone.Collection.extend(BBCollectionExtra),
        BBPCollection = PageableCollection.extend(BBCollectionExtra),
        PBBCollection = BBCollection.extend({
            parent_id: null // project id
        }),
        PBBPCollection = BBPCollection.extend({
            mode: 'client',
            parent_id: null // project id
        });
    bbcollections.Projects = BBCollection.extend({
        url: '/api/projects.xml',
        model: bbmodels.Project
    });
    bbcollections.Companies = BBCollection.extend({
        url: '/api/companies.xml',
        model: bbmodels.Company
    });
    bbcollections.People = PBBCollection.extend({
        url: function() {
            return _.isFinite(this.parent_id) ? '/api/projects/' + this.parent_id + '/people.xml' : '/api/people.xml';
        },
        model: bbmodels.Person
    });
    bbcollections.Posts = PBBCollection.extend({
        url: function() {
            return '/api/projects/' + this.parent_id + '/posts.xml';
        },
        model: bbmodels.Post
    });
    bbcollections.Attachments = PBBPCollection.extend({
        url: function() {
            return '/api/projects/' + this.parent_id + '/attachments.xml';
        },
        model: bbmodels.Attachment
    });
    bbcollections.Calendar = PBBCollection.extend({
        url: function() {
            return '/api/projects/' + this.parent_id + '/calendar_entries.xml';
        },
        model: bbmodels.CalendarEntry
    });
    bbcollections.Categories = PBBPCollection.extend({
        url: function() {
            return '/api/projects/' + this.parent_id + '/categories.xml';
        },
        model: bbmodels.Category
    });
    bbcollections.TimeEntries = PBBPCollection.extend({
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
                return '/api/time_entries/report.xml?' + Backbone.$.param(this.filter_report);
            }
            return '/api/time_entries/report.xml';
        },
        model: bbmodels.TimeEntry
    });
    bbcollections.TodoTimeEntries = bbcollections.TimeEntries.extend({
        parent: 'todo_items'
    });
    bbcollections.TodoItems = PBBCollection.extend({
        url: function() {
            return '/api/todo_lists/' + this.parent_id + '/todo_items.xml';
        },
        model: bbmodels.TodoItem
    });
    bbcollections.TodoLists = PBBCollection.extend({
        responsible_party: null, // person id
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
        model: bbmodels.TodoList
    });
    bbcollections.PostComments = PBBCollection.extend({
        parent_type: 'posts', // posts|milestones|todo_items
        url: function() {
            return '/api/' + this.parent_type + '/' + this.parent_id + '/comments.xml';
        },
        model: bbmodels.Comment
    });
    bbcollections.TodoComments = bbcollections.PostComments.extend({
        parent_type: 'todo_items'
    });
    bbcollections.CalendarEntryComments = bbcollections.PostComments.extend({
        parent_type: 'milestones'
    });
    return bbcollections;
}));
