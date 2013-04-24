/*jslint nomen: true*/
/*global window, define*/
define([
    'underscore',
    'backbone',
    'backbone-pageable',
    'bbgeneral',
    'bbmodels'
], function (_, Backbone, PageableCollection, onReset, bbmodels) {
    "use strict";
    var bbcollections = {},
        BBCollectionExtra = {
            fetchonce: function () {
                var fetched = this.fetched;
                if (!fetched) {
                    this.fetched = true;
                    this.fetch({cache: true});
                }
                return fetched;
            },
            get_or_create: function (id) {
                if (!this[id]) {
                    this[id] = this.clone();
                    this[id].parent_id = id;
                    this[id].on("reset", onReset);
                    this[id].on("sync", onReset);
                }
                return this[id];
            }
        },
        BBCollection = Backbone.Collection.extend(BBCollectionExtra),
        BBPCollection = PageableCollection.extend(BBCollectionExtra);
    bbcollections.Projects = BBCollection.extend({
        url: '/api/projects.xml',
        model: bbmodels.Project
    });
    bbcollections.Companies = BBCollection.extend({
        url: '/api/companies.xml',
        model: bbmodels.Company
    });
    bbcollections.People = BBCollection.extend({
        parent_id: null, // project id
        url: function () {
            return _.isFinite(this.parent_id) ? '/api/projects/' + this.parent_id + '/people.xml' : '/api/people.xml';
        },
        model: bbmodels.Person
    });
    bbcollections.Posts = BBCollection.extend({
        parent_id: null, // project id
        url: function () {
            return '/api/projects/' + this.parent_id + '/posts.xml';
        },
        model: bbmodels.Post
    });
    bbcollections.Attachments = BBPCollection.extend({
        mode: 'client',
        parent_id: null, // project id
        url: function () {
            return '/api/projects/' + this.parent_id + '/attachments.xml';
        },
        model: bbmodels.Attachment
    });
    bbcollections.Calendar = BBCollection.extend({
        parent_id: null, // project id
        url: function () {
            return '/api/projects/' + this.parent_id + '/calendar_entries.xml';
        },
        model: bbmodels.CalendarEntry
    });
    bbcollections.Categories = BBPCollection.extend({
        mode: 'client',
        parent_id: null, // project id
        url: function () {
            return '/api/projects/' + this.parent_id + '/categories.xml';
        },
        model: bbmodels.Category
    });
    bbcollections.TimeEntries = BBPCollection.extend({
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
        url: function () {
            if (_.isFinite(this.parent_id)) {
                return '/api/' + this.parent + '/' + this.parent_id + '/time_entries.xml';
            }
            if (this.filter_report) {
                return '/api/time_entries/report.xml?' + this.filter_report;
            }
            return '/api/time_entries/report.xml';
        },
        model: bbmodels.TimeEntry
    });
    bbcollections.TodoTimeEntries = bbcollections.TimeEntries.extend({
        parent: 'todo_items'
    });
    bbcollections.TodoItems = BBCollection.extend({
        parent_id: null,
        url: function () {
            return '/api/todo_lists/' + this.parent_id + '/todo_items.xml';
        },
        model: bbmodels.TodoItem
    });
    bbcollections.TodoLists = BBCollection.extend({
        responsible_party: null, // person id
        parent_id: null, // project id
        filter_status: null, // filter for project [all\pending\finished]
        url: function () {
            if (_.isFinite(this.parent_id) && this.filter_status) {
                return '/api/projects/' + this.parent_id + '/todo_lists.xml?filter=' + this.filter_status;
            }
            if (_.isFinite(this.parent_id)) {
                return '/api/projects/' + this.parent_id + '/todo_lists.xml';
            }
            if (this.responsible_party === null) {
                return '/api/todo_lists.xml';
            }
            if (this.responsible_party === "") {
                return '/api/todo_lists.xml?responsible_party=';
            }
            return '/api/todo_lists.xml?responsible_party=' + this.responsible_party;
        },
        model: bbmodels.TodoList
    });
    bbcollections.PostComments = BBCollection.extend({
        parent_id: null, // parent id
        parent_type: 'posts', // posts|milestones|todo_items
        url: function () {
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
});
