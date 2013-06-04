/*jshint multistr: true*/
/*jslint white: true*/
var templates = {};
templates['#time-template'] = '\n\
<tr <% if(item.get("hours")>2){ %>class="warning"<% } %> data-id="<%- item.id %>">\n\
    <td><%- item.get("date") %></td>\n\
    <td><%- item.get("hours") %></td>\n\
    <td><a href="#people/<%- item.get("person-id") %>"><i class="icon-user"></i><%- item.get("person-name") %></a></td>\n\
    <td>\n\
        <% if (item.get("todo-item-id")) { %>\n\
            <a href="#projects/<%- item.get("project-id") %>/time_entries/todo_items/<%- item.get("todo-item-id") %>"><i class="icon-file"></i></a>\n\
        <% } else { %>\n\
            <a href="#projects/<%- item.get("project-id") %>/time_entries"><i class="icon-folder-close"></i></a>\n\
        <% } %>\n\
        <%- item.get("description") %>\n\
    </td>\n\
    <td>\n\
        <button id="edit" title="Edit"><i class="icon-edit"></i></button>\n\
        <button id="remove" title="Remove"><i class="icon-trash"></i></button>\n\
    </td>\n\
</tr>';
templates['#time-templateedit'] = '\n\
<tr class="edittime" data-id="<%- item.id %>">\n\
    <td><input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="input-small" name="date" placeholder="YYYY-MM-DD" value="<%- item.get("date") %>"></td>\n\
    <td><input type="text" class="input-small" name="hours" placeholder="hours" value="<%- item.get("hours") %>"></td>\n\
    <td>\n\
        <div>\n\
            <i class="icon-user"></i><select name="person-id">\n\
                <% BB.collections.people.each(function (i) { %>\n\
                    <option value="<%- i.id %>" <% if (i.id==item.get("person-id")) { %>selected="selected"<% } %>><%- i.name() %></option>\n\
                <% }) %>\n\
            </select>\n\
        </div>\n\
    </td>\n\
    <td>\n\
        <% if (item.get("todo-item-id")) { %>\n\
            <a href="#projects/<%- item.get("project-id") %>/time_entries/todo_items/<%- item.get("todo-item-id") %>"><i class="icon-file"></i></a>\n\
        <% } else { %>\n\
            <a href="#projects/<%- item.get("project-id") %>/time_entries"><i class="icon-folder-close"></i></a>\n\
        <% } %>\n\
        <input type="text" class="input-small" name="description" value="<%- item.get("description") %>">\n\
    </td>\n\
    <td>\n\
        <button id="save" title="Save"><i class="icon-ok"></i></button>\n\
        <button id="reset" title="Cancel"><i class="icon-off"></i></button>\n\
    </td>\n\
</tr>';
templates['#pager-template'] = '\n\
<% if(view.collection.hasPrevious() || view.collection.hasNext()){ %>\n\
<ul class="pager">\n\
    <li class="<%- view.pagerid %> previous<% if(!view.collection.hasPrevious()){ %> disabled<% } %>">\n\
        <a href="#">&larr; Previous Page</a>\n\
    </li>\n\
    <li class="<%- view.pagerid %> next<% if(!view.collection.hasNext()){ %> disabled<% } %>">\n\
        <a href="#">Next Page &rarr;</a>\n\
    </li>\n\
</ul>\n\
<% } %>';
templates['#header-template'] = '\n\
<div class="page-header">\n\
    <h1><%- view.name() %></h1>\n\
    <% if (view.model && view.model.get("company")) { %><small><a href="#companies/<%- view.model.get("company").id %>"><%- view.model.get("company").name %></a></small><% } %>\n\
</div>';
templates['#project-nav-template'] = '\n\
<ul class="nav nav-tabs projectnav">\n\
    <li><a href="#projects/<%- view.model.id %>">Overview</a></li>\n\
    <li><a href="#projects/<%- view.model.id %>/posts">Messages</a></li>\n\
    <li><a href="#projects/<%- view.model.id %>/todo_lists">To-Dos</a></li>\n\
    <li><a href="#projects/<%- view.model.id %>/calendar">Calendar</a></li>\n\
    <li><a href="#projects/<%- view.model.id %>/time_entries">Time</a></li>\n\
    <li><a href="#projects/<%- view.model.id %>/files">Files</a></li>\n\
    <li class="pull-right"><a href="#projects/<%- view.model.id %>/people">People</a></li>\n\
    <li class="pull-right"><a href="#projects/<%- view.model.id %>/categories">Categories</a></li>\n\
</ul>';
templates['#time-report-template'] = '\n\
<%= view.renderheader() %>\n\
<div id="time_report" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="makereportlabel" aria-hidden="true">\n\
<div class="modal-header">\n\
<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n\
<h3 id="makereportlabel">Make report</h3>\n\
</div>\n\
<form id="makereport">\n\
    <div class="modal-body">\n\
    <div class="input-prepend">\n\
        <span class="add-on">From</span>\n\
        <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyymmdd" type="text" class="input-small" name="from" placeholder="YYYYMMDD">\n\
    </div>\n\
    <br />\n\
    <div class="input-prepend">\n\
        <span class="add-on">To</span>\n\
        <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyymmdd" type="text" class="input-small" name="to" placeholder="YYYYMMDD">\n\
    </div>\n\
    <br />\n\
    <div class="input-prepend">\n\
        <span class="add-on">For</span>\n\
        <select name="subject_id" class="input-medium">\n\
            <option value="">All</option>\n\
            <% view.options.collections.people.each(function (i) { %>\n\
                <option value="<%- i.id %>"><%- i.name() %></option>\n\
            <% }) %>\n\
        </select>\n\
    </div>\n\
    <br />\n\
    <div class="input-prepend">\n\
        <span class="add-on">Project</span>\n\
        <select name="filter_project_id" class="input-medium">\n\
            <option value="">All</option>\n\
            <% view.options.collections.projects.each(function (i) { %>\n\
                <option value="<%- i.id %>"><%- i.get("name") %></option>\n\
            <% }) %>\n\
        </select>\n\
    </div>\n\
    <br />\n\
    <div class="input-prepend">\n\
        <span class="add-on">Company</span>\n\
        <select name="filter_company_id" class="input-medium">\n\
            <option value="">All</option>\n\
            <% view.options.collections.companies.each(function (i) { %>\n\
                <option value="<%- i.id %>"><%- i.get("name") %></option>\n\
            <% }) %>\n\
        </select>\n\
    </div>\n\
    </div>\n\
    <div class="modal-footer">\n\
        <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\n\
        <button id="getreport" type="submit" data-dismiss="modal" class="btn btn-primary">Report</button>\n\
    </div>\n\
</form>\n\
</div>\n\
<a href="#time_report" role="button" class="btn btn-primary" data-toggle="modal">Report</a>\n\
<% var tt=view.collection;\n\
if (tt.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No time entries...\n\
</div>\n\
<% } else { %>\n\
<%= view.renderpager() %>\n\
<table class="table table-hover table-condensed table-bordered <%- view.pagerid %>">\n\
    <thead>\n\
        <tr>\n\
            <th>date</th>\n\
            <th>hours</th>\n\
            <th data-sort="person-id">person</th>\n\
            <th>description</th>\n\
            <th data-sort="id">&nbsp;</th>\n\
        </tr>\n\
    </thead>\n\
    <tbody>\n\
        <% var prs=view.options.collections.projects;\n\
        _.each(_.uniq(tt.pluck("project-id")), function (prid) { %>\n\
        <tr class="info">\n\
            <td>\n\
                <a href="#projects/<%- prid %>/time_entries">\n\
                    <%- prs.get(prid)?prs.get(prid).get("name"):prid %>\n\
                </a>\n\
            </td>\n\
            <td>\n\
                <%- _.reduce(_.map(tt.where({"project-id":prid}),function(i){return i.get("hours");}),function(memo, num) { return memo + num; }, 0) %>\n\
            </td>\n\
            <td colspan="3">&nbsp;</td>\n\
        </tr>\n\
        <% _.each(tt.where({"project-id":prid}), function (item) { %>\n\
            <%= view.renderitem(item) %>\n\
        <% }) %>\n\
        <% }) %>\n\
    </tbody>\n\
</table>\n\
<%= view.renderpager() %>\n\
<% } %>';
templates['#projects-template'] = '\n\
<%= view.renderheader() %>\n\
<% var pp=view.collection; if (pp.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No projects...\n\
</div>\n\
<% } else { %>\n\
<div class="tabbable">\n\
<ul class="nav nav-pills">\n\
<% var fprst=_.first(pp.pluck("status"));\n\
   _.each(_.uniq(pp.pluck("status")), function (status) { %>\n\
    <li class="prstatus<% if (fprst==status) { %> active<% } %> pull-right">\n\
        <a href="#projects_<%- status %>" data-toggle="tab"><%- status %></a>\n\
    </li>\n\
<% }) %>\n\
</ul>\n\
<div class="tab-content">\n\
<% _.each(pp.groupBy(function(i){ return i.get("status")}), function (plist, status) { %>\n\
    <div class="tab-pane fade<% if (fprst==status) { %> in active<% } %>" id="projects_<%- status %>">\n\
        <div class="tabbable row-fluid">\n\
        <ul class="nav nav-list span4 pull-right">\n\
        <% var fprcoid=_.first(plist).get("company").id;\n\
        _.each(_.groupBy(plist, function(item){ return item.get("company").id}), function (list, coid) { %>\n\
            <li<% if (fprcoid==coid) { %> class="active"<% } %>>\n\
                <a href="#projects_<%- status %>_<%- coid %>" data-toggle="tab"><%- _.first(list).get("company").name %></a>\n\
            </li>\n\
        <% }) %>\n\
        </ul>\n\
        <div class="tab-content span8">\n\
        <% _.each(_.groupBy(plist, function(item){ return item.get("company").id}), function (list, coid) { %>\n\
            <div class="tab-pane fade<% if (fprcoid==coid) { %> in active<% } %>" id="projects_<%- status %>_<%- coid %>">\n\
                <ul class="unstyled">\n\
                <% _.each(list, function (item) { %>\n\
                    <li>\n\
                        <h3><a href="#projects/<%- item.id %>"><%- item.get("name") %></a></h3>\n\
                    </li>\n\
                <% }) %>\n\
                </ul>\n\
            </div>\n\
        <% }) %>\n\
        </div>\n\
        </div>\n\
    </div>\n\
<% }) %>\n\
</div>\n\
</div>\n\
<% } %>';
templates['#project-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% if (view.model.get("announcement")) { %><p><%= view.model.get("announcement") %></p><% } %>';
templates['#companies-template'] = '\n\
<%= view.renderheader() %>\n\
<% cc=view.collection; if (cc.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No companies...\n\
</div>\n\
<% } else { %>\n\
<dl>\n\
<% cc.each(function (item) { %>\n\
    <dt><h3><a href="#companies/<%- item.id %>"><%- item.get("name") %></a></h3></dt>\n\
    <dd class="row-fluid thumbnail">\n\
        <div class="span4">\n\
            <% if (item.get("web-address")) { %><a href="<%- item.get("web-address") %>"><b><%- item.get("web-address") %></b></a><br /><% } %>\n\
            <% if (item.get("time-zone-id")) { %>Time zone: <%- item.get("time-zone-id") %><br /><% } %>\n\
            <% if (item.get("locale")) { %>Locale: <%- item.get("locale") %><% } %>\n\
        </div>\n\
        <div class="span4">\n\
            <% if (item.get("country")) { %><%- item.get("country") %><br /><% } %>\n\
            <% if (item.get("city")) { %><%- item.get("city") %> <%- item.get("zip") %><br /><% } %>\n\
            <% if (item.get("address-one")) { %><%- item.get("address-one") %><br /><% } %>\n\
            <% if (item.get("address-two")) { %><%- item.get("address-two") %><% } %>\n\
        </div>\n\
        <div class="span4">\n\
            <% if (item.get("state")) { %>State: <%- item.get("state") %><br /><% } %>\n\
            <% if (item.get("phone-number-office")) { %>Office phone: <%- item.get("phone-number-office") %><br /><% } %>\n\
            <% if (item.get("phone-number-fax")) { %>Fax phone: <%- item.get("phone-number-fax") %><br /><% } %>\n\
        </div>\n\
    </dd>\n\
<% }) %>\n\
</dl>\n\
<% } %>';
templates['#company-template'] = '\n\
<%= view.renderheader() %>\n\
<div class="row">\n\
    <div class="span4">\n\
        <h2>Projects</h2>\n\
        <% var cid = view.model.id; var pp=view.options.collections.projects; if (pp.isEmpty()) { %>\n\
        <div class="alert alert-info">\n\
            No projects...\n\
        </div>\n\
        <% } else { %>\n\
        <ul class="unstyled">\n\
        <% _.each(pp.filter(function(i){return i.get("company").id==cid}), function (item) { %>\n\
            <li><i class="<%- item.icon() %>"></i>&nbsp;<a href="#projects/<%- item.id %>"><%- item.get("name") %></a></li>\n\
        <% }) %>\n\
        </ul>\n\
        <% } %>\n\
    </div>\n\
    <div class="span4">\n\
        <h2>People</h2>\n\
        <% var pp=view.options.collections.people; if (pp.isEmpty()) { %>\n\
        <div class="alert alert-info">\n\
            No people...\n\
        </div>\n\
        <% } else { %>\n\
        <ul class="unstyled">\n\
        <% _.each(pp.filter(function(i){return i.get("company-id")==cid}), function (item) { %>\n\
            <li><a href="#people/<%- item.id %>"><i class="icon-user"></i><%- item.name() %></a></li>\n\
        <% }) %>\n\
        </ul>\n\
        <% } %>\n\
    </div>\n\
    <div class="span4">\n\
        <h2>Contact</h2>\n\
        <% if (view.model.get("web-address")) { %>\n\
        <a href="<%- view.model.get("web-address") %>"><b><%- view.model.get("web-address") %></b></a><br />\n\
        <% } %>\n\
        <% if (view.model.get("time-zone-id")) { %>Time zone: <%- view.model.get("time-zone-id") %><br /><% } %>\n\
        <% if (view.model.get("locale")) { %>Locale: <%- view.model.get("locale") %><% } %>\n\
        <% if (view.model.get("country")) { %><%- view.model.get("country") %><br /><% } %>\n\
        <% if (view.model.get("city")) { %><%- view.model.get("city") %> <%- view.model.get("zip") %><br /><% } %>\n\
        <% if (view.model.get("address-one")) { %><%- view.model.get("address-one") %><br /><% } %>\n\
        <% if (view.model.get("address-two")) { %><%- view.model.get("address-two") %><% } %>\n\
        <% if (view.model.get("state")) { %>State: <%- view.model.get("state") %><br /><% } %>\n\
        <% if (view.model.get("phone-number-office")) { %>Office phone: <%- view.model.get("phone-number-office") %><br /><% } %>\n\
        <% if (view.model.get("phone-number-fax")) { %>Fax phone: <%- view.model.get("phone-number-fax") %><br /><% } %>\n\
    </div>\n\
</div>';
templates['#person-template'] = '\n\
<%= view.renderheader() %>\n\
<img class="pull-right img-polaroid" width="55" height="55"\n\
     src="<%- view.model.get("avatar-url") %>"\n\
     alt="<%- view.model.name() %>">\n\
<a href="mailto:<%- view.model.get("email-address") %>"><b><%- view.model.get("email-address") %></b></a><br />\n\
<% if (view.model.get("im-service")&&view.model.get("im-handle")) { %>\n\
    <%- view.model.get("im-service") %>: <% if (view.model.get("im-service")=="Skype") { %>\n\
        <a href="skype:<%- view.model.get("im-handle") %>?call" title="Skype call to <%- view.model.name() %>"><%- view.model.get("im-handle") %></a>\n\
    <% } else { %>\n\
        <%- view.model.get("im-handle") %>\n\
    <% } %>\n\
    <br />\n\
<% } %>\n\
<% if (view.model.get("phone-number-office")) { %>Office phone: <%- view.model.get("phone-number-office") %><br /><% } %>\n\
<% if (view.model.get("phone-number-mobile")) { %>Mobile phone: <%- view.model.get("phone-number-mobile") %><br /><% } %>\n\
<% if (view.model.get("phone-number-home")) { %>Home phone: <%- view.model.get("phone-number-home") %><br /><% } %>\n\
<% if (view.model.get("phone-number-fax")) { %>Fax phone: <%- view.model.get("phone-number-fax") %><br /><% } %>\n\
<% if (view.model.get("time-zone-name")) { %>Time zone: <%- view.model.get("time-zone-name") %><% } %>';
templates['#personitem-template'] = '\n\
<li class="media well well-small">\n\
    <a class="pull-right" href="#people/<%- item.id %>" title="<%- item.name() %>">\n\
        <img class="media-object img-polaroid" src="<%- item.get("avatar-url") %>" alt="<%- item.name() %>">\n\
    </a>\n\
    <div class="media-body">\n\
        <h4 class="media-heading">\n\
            <a href="#people/<%- item.id %>" title="<%- item.name() %>">\n\
                <%- item.name() %>\n\
            </a>\n\
            <% if (item.get("title")) { %>\n\
            <small><%- item.get("title") %></small>\n\
            <% } %>\n\
        </h4>\n\
        <a href="mailto:<%- item.get("email-address") %>"><b><%- item.get("email-address") %></b></a><br />\n\
        <% if (item.get("im-service")&&item.get("im-handle")) { %>\n\
            <%- item.get("im-service") %>: <% if (item.get("im-service")=="Skype") { %>\n\
                <a href="skype:<%- item.get("im-handle") %>?call" title="Skype call to <%- item.name() %>"><%- item.get("im-handle") %></a>\n\
            <% } else { %>\n\
                <%- item.get("im-handle") %>\n\
            <% } %>\n\
            <br />\n\
        <% } %>\n\
        <% if (item.get("phone-number-office")) { %>Office phone: <%- item.get("phone-number-office") %><br /><% } %>\n\
        <% if (item.get("phone-number-mobile")) { %>Mobile phone: <%- item.get("phone-number-mobile") %><br /><% } %>\n\
        <% if (item.get("phone-number-home")) { %>Home phone: <%- item.get("phone-number-home") %><br /><% } %>\n\
        <% if (item.get("phone-number-fax")) { %>Fax phone: <%- item.get("phone-number-fax") %><br /><% } %>\n\
        <% if (item.get("time-zone-name")) { %>Time zone: <%- item.get("time-zone-name") %><% } %>\n\
    </div>\n\
</li>';
templates['#people-template'] = '\n\
<%= view.renderheader() %>\n\
<% var pp=view.collection; var co=view.options.collections.companies;\n\
if (pp.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No people...\n\
</div>\n\
<% } else {\n\
if (co.isEmpty()) { %>\n\
<ul class="media-list">\n\
<% pp.each(function (item) { %>\n\
    <%= view.renderitem(item) %>\n\
<% }) %>\n\
</ul>\n\
<% } else { %>\n\
<div class="tabbable tabs-left row-fluid">\n\
<ul class="nav nav-tabs span3">\n\
<% var fcoid=_.first(pp.pluck("company-id"));\n\
   view.options.collections.companies.each(function (item) { %>\n\
    <li<% if (fcoid==item.id) { %> class="active"<% } %>><a href="#people_c<%- item.id %>" data-toggle="tab"><%- item.get("name") %></a></li>\n\
<% }) %>\n\
</ul>\n\
<div class="tab-content span8">\n\
<% view.options.collections.companies.each(function (cc) { %>\n\
    <div class="tab-pane fade<% if (fcoid==cc.id) { %> in active<% } %>" id="people_c<%- cc.id %>">\n\
        <% var cp=pp.where({"company-id":cc.id}); if (_.isEmpty(cp)) { %>\n\
        <div class="alert alert-info">\n\
            No people in company...\n\
        </div>\n\
        <% } else { %>\n\
        <ul class="media-list">\n\
        <% _.each(cp, function (item) { %>\n\
            <%= view.renderitem(item) %>\n\
        <% }) %>\n\
        </ul>\n\
        <% } %>\n\
    </div>\n\
<% }) %>\n\
</div>\n\
</div>\n\
<% }} %>';
templates['#project-people-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% var pp=view.collection;  var cc=view.options.collections.companies;\n\
if (pp.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No people...\n\
</div>\n\
<% } else {\n\
if (cc.isEmpty()) { %>\n\
<ul class="media-list">\n\
<% pp.each(function (item) { %>\n\
    <%= view.renderitem(item) %>\n\
<% }) %>\n\
</ul>\n\
<% } else { %>\n\
<div class="tabbable tabs-left row-fluid">\n\
<ul class="nav nav-tabs span3">\n\
<% var pc=_.uniq(pp.pluck("company-id")); var fcoid=_.first(pc);\n\
_.each(pc, function (id) { %>\n\
    <li<% if (fcoid==id) { %> class="active"<% } %>><a href="#people_c<%- id %>" data-toggle="tab"><%- cc.get(id)?cc.get(id).get("name"):id %></a></li>\n\
<% }) %>\n\
</ul>\n\
<div class="tab-content span8">\n\
<% _.each(pc, function (id) { %>\n\
    <div class="tab-pane fade<% if (fcoid==id) { %> in active<% } %>" id="people_c<%- id %>">\n\
        <ul class="media-list">\n\
        <% _.each(pp.where({"company-id":id}), function (item) { %>\n\
            <%= view.renderitem(item) %>\n\
        <% }) %>\n\
        </ul>\n\
    </div>\n\
<% }) %>\n\
</div>\n\
</div>\n\
<% }} %>';
templates['#project-time-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% var tt=view.collection; var prid=view.model.id;\n\
var pp=view.options.collections.people;\n\
var mid=view.options.mydata?view.options.mydata.id:0;\n\
if (tt.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No time entries...\n\
</div>\n\
<% } else { %>\n\
<%= view.renderpager() %>\n\
<table class="table table-hover table-condensed table-bordered <%- view.pagerid %>">\n\
    <thead>\n\
        <tr>\n\
            <th>date</th>\n\
            <th>hours</th>\n\
            <th data-sort="person-id">person</th>\n\
            <th>description</th>\n\
            <th data-sort="id">&nbsp;</th>\n\
        </tr>\n\
    </thead>\n\
    <tbody>\n\
        <tr class="addtime">\n\
            <td><input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="input-small" name="date" placeholder="YYYY-MM-DD" value="<%- new Date().toJSON().split("T")[0] %>"></td>\n\
            <td><input type="text" class="input-small" name="hours" placeholder="hours" value="0"></td>\n\
            <td>\n\
                <div>\n\
                    <i class="icon-user"></i><select name="person-id">\n\
                        <% pp.each(function (i) { %>\n\
                            <option value="<%- i.id %>" <% if (i.id==mid) { %>selected="selected"<% } %>><%- i.name() %></option>\n\
                        <% }) %>\n\
                    </select>\n\
                </div>\n\
            </td>\n\
            <td>\n\
                <input type="text" class="input-small" name="description">\n\
            </td>\n\
            <td>\n\
                <button id="add" title="Add"><i class="icon-plus"></i></button>\n\
            </td>\n\
        </tr>\n\
        <% tt.each(function (item) { %>\n\
            <%= view.renderitem(item) %>\n\
        <% }) %>\n\
    </tbody>\n\
</table>\n\
<%= view.renderpager() %>\n\
<% } %>';
templates['#todo-time-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% var tt=view.collection; var prid=view.model.id;\n\
var pp=view.options.collections.people;\n\
var mid=view.options.mydata?view.options.mydata.id:0;\n\
if (tt.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No time entries...\n\
</div>\n\
<% } else { %>\n\
<%= view.renderpager() %>\n\
<table class="table table-hover table-condensed table-bordered <%- view.pagerid %>">\n\
    <thead>\n\
        <tr>\n\
            <th>date</th>\n\
            <th>hours</th>\n\
            <th data-sort="person-id">person</th>\n\
            <th>description</th>\n\
            <th data-sort="id">&nbsp;</th>\n\
        </tr>\n\
    </thead>\n\
    <tbody>\n\
        <tr class="addtime">\n\
            <td><input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="input-small" name="date" placeholder="YYYY-MM-DD" value="<%- new Date().toJSON().split("T")[0] %>"></td>\n\
            <td><input type="text" class="input-small" name="hours" placeholder="hours" value="0"></td>\n\
            <td>\n\
                <div>\n\
                    <i class="icon-user"></i><select name="person-id">\n\
                        <% pp.each(function (i) { %>\n\
                            <option value="<%- i.id %>" <% if (i.id==mid) { %>selected="selected"<% } %>><%- i.name() %></option>\n\
                        <% }) %>\n\
                    </select>\n\
                </div>\n\
            </td>\n\
            <td>\n\
                <input type="text" class="input-small" name="description">\n\
            </td>\n\
            <td>\n\
                <button id="add" title="Add"><i class="icon-plus"></i></button>\n\
            </td>\n\
        </tr>\n\
        <% tt.each(function (item) { %>\n\
            <%= view.renderitem(item) %>\n\
        <% }) %>\n\
    </tbody>\n\
</table>\n\
<%= view.renderpager() %>\n\
<% } %>';
templates['#post-template'] = '\n\
<li class="thumbnail">\n\
    <h3>\n\
        <a href="#projects/<%- item.get("project-id") %>/posts/<%- item.id %>"><%- item.get("title") %></a>\n\
        <% if (item.get("private")) { %><i class="icon-lock"></i><% } %>\n\
        <a href="#projects/<%- item.get("project-id") %>/posts/<%- item.id %>/comments" title="<%- item.get("comments-count") %>">\n\
            <i class="icon-comment"></i>\n\
        </a>\n\
    </h3>\n\
    <small>\n\
        by\n\
        <a href="#people/<%- item.get("author-id") %>">\n\
            <i class="icon-user"></i><%- item.get("author-name") %>\n\
        </a>\n\
        <% if (item.get("category-id")) { %>\n\
        in\n\
        <a href="#projects/<%- item.get("project-id") %>/categories/<%- item.get("category-id") %>">\n\
            <%- item.get("category-name") %>\n\
        </a>\n\
        <% } %>\n\
        on: <%- new Date(item.get("posted-on")) %>\n\
    </small>\n\
    <p><%= item.get("display-body") %></p>\n\
    <% if (item.get("attachments")) { %>\n\
    <ul>\n\
        <% _.each(item.get("attachments"),function (a) { %>\n\
        <li>\n\
            <a href="<%- a["download-url"] %>"><%- a.name %></a>\n\
            <small>\n\
                <%- a["byte-size"] %>B\n\
                <a href="#people/<%- a["person-id"] %>"><i class="icon-user"></i><%- a["author-name"] %></a>\n\
            </small>\n\
        </li>\n\
        <% }) %>\n\
    </ul>\n\
    <% } %>\n\
</li>';
templates['#project-posts-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% var pp=view.collection; var prid=view.model.id;\n\
if (pp.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No posts...\n\
</div>\n\
<% } else { %>\n\
<ul class="unstyled">\n\
<% pp.each(function (item) { %>\n\
    <%= view.renderitem(item) %>\n\
<% }) %>\n\
 </ul>\n\
<% } %>';
templates['#project-post-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% var pp=view.collection; var prid=view.model.id; var item=pp.get(view.cur_item);\n\
if (pp.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No posts...\n\
</div>\n\
<% } else { %>\n\
<ul class="unstyled">\n\
    <%= view.renderitem(item) %>\n\
</ul>\n\
<% } %>';
templates['#project-post-comments-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% var item=view.options.collections.project_posts.get_or_create(view.model.id).get(view.cur_item);\n\
if (item) { %>\n\
<ul class="unstyled">\n\
    <%= view.renderitem(item) %>\n\
</ul>\n\
<% } %>\n\
<%= view.rendercomments(view.collection) %>';
templates['#project-files-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% var ff=view.collection; var prid=view.model.id; var pp=view.options.collections.people;\n\
var cc=view.options.collections.project_categories.get_or_create(view.model.id);\n\
if (ff.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No files...\n\
</div>\n\
<% } else { %>\n\
<%= view.renderpager() %>\n\
<ul class="media-list">\n\
<% ff.each(function (item) { %>\n\
    <li class="media well well-small">\n\
        <h3>\n\
            <a href="#projects/<%- prid %>/files/<%- item.id %>">\n\
                <%- item.get("name") %><% if (item.get("private")) { %><i class="icon-lock"></i><% } %>\n\
            </a>\n\
        </h3>\n\
        <small>\n\
            by\n\
            <a href="#people/<%- item.get("person-id") %>">\n\
                <i class="icon-user"></i><%- pp.get(item.get("person-id"))?pp.get(item.get("person-id")).name():item.get("person-id") %>\n\
            </a>\n\
            <% if (item.get("category-id")) { %>\n\
            in\n\
            <a href="#projects/<%- prid %>/categories/<%- item.get("category-id") %>">\n\
                <%- cc.get(item.get("category-id"))?cc.get(item.get("category-id")).get("name"):item.get("category-id") %>\n\
            </a>\n\
            <% } %>\n\
            on\n\
            <%- new Date(item.get("created-on")) %>,\n\
            <%- item.get("byte-size") %>B\n\
        </small>\n\
        <br/>\n\
        <a class="btn btn-success" href="<%- item.get("download-url") %>">Download</a>\n\
    </li>\n\
<% }) %>\n\
</ul>\n\
<%= view.renderpager() %>\n\
<% } %>';
templates['#project-file-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% var ff=view.collection; var prid=view.model.id; var pp=view.options.collections.people;\n\
var cc=view.options.collections.project_categories.get_or_create(view.model.id); var item=ff.get(view.cur_item);\n\
if (ff.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No files...\n\
</div>\n\
<% } else { %>\n\
<ul class="media-list">\n\
    <li class="media well well-small">\n\
        <h3>\n\
            <a href="#projects/<%- prid %>/files/<%- item.id %>">\n\
                <%- item.get("name") %><% if (item.get("private")) { %><i class="icon-lock"></i><% } %>\n\
            </a>\n\
        </h3>\n\
        <small>\n\
            by\n\
            <a href="#people/<%- item.get("person-id") %>">\n\
                <i class="icon-user"></i><%- pp.get(item.get("person-id"))?pp.get(item.get("person-id")).name():item.get("person-id") %>\n\
            </a>\n\
            <% if (item.get("category-id")) { %>\n\
            in\n\
            <a href="#projects/<%- prid %>/categories/<%- item.get("category-id") %>">\n\
                <%- cc.get(item.get("category-id"))?cc.get(item.get("category-id")).get("name"):item.get("category-id") %>\n\
            </a>\n\
            <% } %>\n\
            on\n\
            <%- new Date(item.get("created-on")) %>,\n\
            <%- item.get("byte-size") %>B\n\
        </small>\n\
        <br/>\n\
        <a class="btn btn-success" href="<%- item.get("download-url") %>">Download</a>\n\
    </li>\n\
</ul>\n\
<% } %>';
templates['#calendar-template'] = '\n\
<li class="thumbnail">\n\
    <h3>\n\
        <a <% if (item.get("completed")) { %>class="muted" <% } %>href="#projects/<%- item.get("project-id") %>/calendar/<%- item.id %>">\n\
            <%- item.get("title") %>\n\
        </a>\n\
        <a href="#projects/<%- item.get("project-id") %>/calendar/<%- item.id %>/comments" title="<%- item.get("comments-count") %>">\n\
            <i class="icon-comment"></i>\n\
        </a>\n\
    </h3>\n\
    <small>\n\
        <% if (item.get("responsible-party-id")) { %>\n\
        <a href="#<%- item.get("responsible-party-type")=="Company"?"companies":"people" %>/<%- item.get("responsible-party-id") %>">\n\
            <% if (item.get("responsible-party-type")=="Person") { %><i class="icon-user"></i><% } %>\n\
            <%- item.get("responsible-party-name") %>\n\
        </a><br />\n\
        <% } %>\n\
        Type: <%- item.get("type") %><br />\n\
        <% if (item.get("start-at")) { %>\n\
        Start at <%- new Date(item.get("start-at")).toDateString() %><br />\n\
        <% } %>\n\
        <% if (item.get("due-at")) { %>\n\
        Due at <%- new Date(item.get("due-at")).toDateString() %><br />\n\
        <% } %>\n\
        <% if (item.get("deadline")) { %>\n\
        Deadline at <%- new Date(item.get("deadline")).toDateString() %><br />\n\
        <% } %>\n\
        Created by\n\
        <a href="#people/<%- item.get("creator-id") %>">\n\
            <i class="icon-user"></i><%- item.get("creator-name") %>\n\
        </a>\n\
        on\n\
        <%- new Date(item.get("created-on")) %>\n\
        <% if (item.get("completed")) { %>\n\
        <br />\n\
        Completed by\n\
        <a href="#people/<%- item.get("completer-id") %>">\n\
            <i class="icon-user"></i><%- item.get("completer-name") %>\n\
        </a>\n\
        at\n\
        <%- new Date(item.get("completed-at")) %>\n\
        <% } %>\n\
    </small>\n\
</li>';
templates['#project-calendar-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% var cc=view.collection; var prid=view.model.id;\n\
if (cc.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No events...\n\
</div>\n\
<% } else { %>\n\
<ul class="unstyled">\n\
<% cc.each(function (item) { %>\n\
    <%= view.renderitem(item) %>\n\
<% }) %>\n\
</ul>\n\
<% } %>';
templates['#project-calendar-entry-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% var cc=view.collection; var prid=view.model.id; var item=cc.get(view.cur_item);\n\
if (cc.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No events...\n\
</div>\n\
<% } else { %>\n\
<ul class="unstyled">\n\
    <%= view.renderitem(item) %>\n\
 </ul>\n\
<% } %>';
templates['#project-calendar-entry-comments-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% var item=view.options.collections.project_calendar.get_or_create(view.model.id).get(view.cur_item);\n\
if (item) { %>\n\
<ul class="unstyled">\n\
    <%= view.renderitem(item) %>\n\
</ul>\n\
<% } %>\n\
<%= view.rendercomments(view.collection) %>';
templates['#category-template'] = '\n\
<dt>\n\
    <h3>\n\
        <a href="#projects/<%- item.get("project-id") %>/categories/<%- item.id %>"><%- item.get("name") %></a>\n\
    </h3>\n\
</dt>\n\
<dd>\n\
    <%- item.get("type") %><br />Elements: <%- item.get("elements-count") %>\n\
</dd>';
templates['#project-categories-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% var cc=view.collection; var prid=view.model.id;\n\
if (cc.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No categories...\n\
</div>\n\
<% } else { %>\n\
<%= view.renderpager() %>\n\
<dl>\n\
<% cc.each(function (item) { %>\n\
    <%= view.renderitem(item) %>\n\
<% }) %>\n\
</dl>\n\
<%= view.renderpager() %>\n\
<% } %>';
templates['#project-category-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% var cc=view.collection; var prid=view.model.id; var item=cc.get(view.cur_item);\n\
if (cc.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No categories...\n\
</div>\n\
<% } else { %>\n\
<dl>\n\
    <%= view.renderitem(item) %>\n\
</dl>\n\
<% } %>';
templates['#todo-template'] = '\n\
<% var item=view.model;\n\
var prid=view.options.project_id;\n\
var list=view.options.collections.project_todo_lists.get_or_create(prid).get(item.get("todo-list-id"));\n\
if (item.get("completed")) { %>\n\
<i class="todo icon-completed" data-todolist-id="<%- item.get("todo-list-id") %>" data-todoitem-id="<%- item.id %>"></i>\n\
<% } else { %>\n\
<i class="todo icon-uncompleted" data-todolist-id="<%- item.get("todo-list-id") %>" data-todoitem-id="<%- item.id %>"></i>\n\
<% } %>\n\
<% if (list&&list.get("tracked")) { %>\n\
<a href="#projects/<%- prid %>/time_entries/todo_items/<%- item.id %>">\n\
    <i class="icon-time"></i>\n\
</a>\n\
<% } %>\n\
<a href="#projects/<%- prid %>/todo_lists/<%- item.get("todo-list-id") %>/<%- item.id %>">\n\
    <%= item.get("content") %>\n\
</a>\n\
<a href="#projects/<%- prid %>/todo_lists/<%- item.get("todo-list-id") %>/<%- item.id %>/comments" title="<%- item.get("comments-count") %>">\n\
    <i class="icon-comment"></i>\n\
</a>';
templates['#todolist-template'] = '\n\
<dt>\n\
    <a <% if (item.get("completed")) { %>class="muted"<% } %>\n\
       href="#projects/<%- item.get("project-id") %>/todo_lists/<%- item.id %>">\n\
        <%- item.get("name") %><% if (item.get("private")) { %><i class="icon-lock"></i><% } %>\n\
    </a>\n\
    <small><%= item.get("description") %></small>\n\
</dt>';
templates['#todo-lists-template'] = '\n\
<%= view.renderheader() %>\n\
<% var td=view.collection;\n\
var pp=view.options.collections.people;\n\
var prs=view.options.collections.projects;\n\
var party=view.collection.responsible_party;\n\
var mid=party==null?view.options.mydata.id:view.collection.responsible_party; %>\n\
<div>\n\
    <div class="pull-right">Show items assigned to:\n\
        <select name="target">\n\
            <option value="" <% if (party=="") { %>selected="selected"<% } %>>Nobody</option>\n\
            <% pp.each(function (i) { %>\n\
                <option value="<%- i.id %>" <% if (i.id==mid) { %>selected="selected"<% } %>><%- i.name() %></option>\n\
            <% }) %>\n\
        </select>\n\
    </div>\n\
    <h3><%- view.description() %> to-do items across all projects</h3>\n\
</div>\n\
<% if (td.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No todo lists...\n\
</div>\n\
<% } else { %>\n\
<dl>\n\
<% _.each(_.uniq(td.pluck("project-id")),function (prid) { %>\n\
    <dt><a href="#projects/<%- prid %>/todo_lists"><%- prs.get(prid)?prs.get(prid).get("name"):prid %></a></dt>\n\
    <dd>\n\
    <dl>\n\
        <% _.each(td.where({"project-id":prid}), function (list) { %>\n\
        <%= view.renderitem(list) %>\n\
        <dd>\n\
        <dl>\n\
        <% _.each(list.get("todo-items"), function (item) { %>\n\
        <dd>\n\
            <% if(false){if (item.completed) { %>\n\
            <i class="todo-lists icon-completed" data-todolist-id="<%- list.id %>" data-todoitem-id="<%- item.id %>"></i>\n\
            <% } else { %>\n\
            <i class="todo-lists icon-uncompleted" data-todolist-id="<%- list.id %>" data-todoitem-id="<%- item.id %>"></i>\n\
            <% } %>\n\
            <% if (list.get("tracked")) { %>\n\
            <a href="#projects/<%- prid %>/time_entries/todo_items/<%- item.id %>">\n\
                <i class="icon-time"></i>\n\
            </a>\n\
            <% }} %>\n\
            <a href="#projects/<%- prid %>/todo_lists/<%- list.id %>/<%- item.id %>">\n\
                <%= item.content %>\n\
            </a>\n\
            <% if(false){ %>\n\
            <a href="#projects/<%- prid %>/todo_lists/<%- list.id %>/<%- item.id %>/comments" title="<%- item["comments-count"] %>">\n\
                <i class="icon-comment"></i>\n\
            </a>\n\
            <% } %>\n\
        </dd>\n\
        <% }) %>\n\
        </dl>\n\
        </dd>\n\
        <% }) %>\n\
    </dl>\n\
    </dd>\n\
<% }) %>\n\
</dl>\n\
<% } %>';
templates['#project-todo-lists-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% var td=view.collection; var todo_items=view.options.collections.todo_items; var prid=view.model.id;\n\
if (td.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No todo lists...\n\
</div>\n\
<% } else { %>\n\
<div class="tabbable row-fluid">\n\
<ul class="nav nav-list span4 pull-right">\n\
<% var ftdst=_.first(td.pluck("completed"));\n\
   _.each(_.uniq(td.pluck("completed")), function (status) { %>\n\
    <li<% if (ftdst==status) { %> class="active"<% } %>>\n\
        <a href="#todolists_<%- status %>" data-toggle="tab">\n\
            <% if (status==true) { %>Finished<% } else { %>Pending<% } %>\n\
        </a>\n\
    </li>\n\
<% }) %>\n\
</ul>\n\
<div class="tab-content span8">\n\
    <% _.each(td.groupBy(function(i){ return i.get("completed")}), function (tlgroup, status) { %>\n\
    <div class="tab-pane fade<% if (ftdst+""==status) { %> in active<% } %>" id="todolists_<%- status %>">\n\
        <dl>\n\
            <% _.each(tlgroup, function (list) { %>\n\
            <%= view.renderitem(list) %>\n\
            <dd>\n\
                <small>\n\
                    Completed: <%- list.get("completed-count") %>\n\
                    <br />\n\
                    Uncompleted: <%- list.get("uncompleted-count") %>\n\
                </small>\n\
            </dd>\n\
            <% }) %>\n\
        </dl>\n\
    </div>\n\
    <% }) %>\n\
</div>\n\
</div>\n\
<% } %>';
templates['#project-todo-list-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% var td=view.collection; var todo_items=view.options.collections.todo_items; var prid=view.model.id;\n\
var ci=view.cur_item; var list=td.get(ci); var ftdst=list&&list.get("completed");\n\
if (td.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No todo lists...\n\
</div>\n\
<% } else { %>\n\
<div class="row-fluid">\n\
<dl class="todoitemsholder span8">\n\
    <%= view.renderitem(list) %>\n\
</dl>\n\
<div class="tabbable span4 pull-right">\n\
<ul class="nav nav-pills">\n\
<% _.each(_.uniq(td.pluck("completed")), function (status) { %>\n\
    <li<% if (ftdst==status) { %> class="active"<% } %>>\n\
        <a href="#todolists_<%- status %>" data-toggle="tab">\n\
            <% if (status==true) { %>Finished<% } else { %>Pending<% } %>\n\
        </a>\n\
    </li>\n\
<% }) %>\n\
</ul>\n\
<div class="tab-content">\n\
<% _.each(td.groupBy(function(i){ return i.get("completed")}), function (tlgroup, status) { %>\n\
    <div class="tab-pane fade<% if (ftdst+""==status) { %> in active<% } %>" id="todolists_<%- status %>">\n\
    <ul class="nav nav-list">\n\
        <% _.each(tlgroup, function (l) { %>\n\
        <li<% if (ci==l.id) { %> class="active"<% } %>>\n\
            <a href="#projects/<%- prid %>/todo_lists/<%- l.id %>">\n\
                <%- l.get("name") %><% if (l.get("private")) { %><i class="icon-lock"></i><% } %>\n\
            </a>\n\
        </li>\n\
        <% }) %>\n\
    </ul>\n\
    </div>\n\
<% }) %>\n\
</div>\n\
</div>\n\
</div>\n\
<% } %>';
templates['#project-todo-item-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% var td=view.collection; var todo_items=view.options.collections.todo_items;\n\
var prid=view.model.id; var list_id=view.cur_item; var item_id=view.todo_item;\n\
var items=todo_items.get_or_create(list_id); var list=td.get(list_id);\n\
var item=items.get(item_id);\n\
if (td.isEmpty()||items.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No todo items...\n\
</div>\n\
<% } else { %>\n\
<dl class="todoitemsholder">\n\
    <%= view.renderitem(list) %>\n\
</dl>\n\
<% } %>';
templates['#project-todo-item-comments-template'] = '\n\
<%= view.renderheader() %>\n\
<%= view.renderprojectnav() %>\n\
<% var td=view.todo_lists; var todo_items=view.options.collections.todo_items;\n\
var prid=view.model.id; var list_id=view.cur_item; var item_id=view.todo_item;\n\
var items=todo_items.get_or_create(list_id);\n\
var item=items.get(item_id);\n\
var ccc=view.collection;\n\
if (td.isEmpty()||items.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No todo items...\n\
</div>\n\
<% } else { %>\n\
<dl class="todoitemsholder">\n\
</dl>\n\
<% } %>\n\
<%= view.rendercomments(ccc) %>';
templates['#comments-template'] = '\n\
<% if (comments.isEmpty()) { %>\n\
<div class="alert alert-info">\n\
    No comments...\n\
</div>\n\
<% } else { %>\n\
<ul class="unstyled">\n\
    <% comments.each(function (item) { %>\n\
    <li class="thumbnail">\n\
        <small>\n\
            <a href="#people/<%- item.get("author-id") %>">\n\
                <i class="icon-user"></i><%- item.get("author-name") %>\n\
            </a>\n\
            <%- new Date(item.get("created-at")) %>\n\
        </small>\n\
        <p><%= item.get("body") %></p>\n\
        <% if (item.get("attachments")) { %>\n\
        <ul>\n\
            <% _.each(item.get("attachments"),function (a) { %>\n\
            <li>\n\
                <a href="<%- a["download-url"] %>"><%- a.name %></a>\n\
                <small>\n\
                    <%- a["byte-size"] %>B\n\
                    <a href="#people/<%- a["person-id"] %>">\n\
                        <i class="icon-user"></i><%- a["author-name"] %>\n\
                    </a>\n\
                </small>\n\
            </li>\n\
            <% }) %>\n\
        </ul>\n\
        <% } %>\n\
    </li>\n\
    <% }) %>\n\
</ul>\n\
<% } %>';
templates['#nav-template'] = '\n\
<div class="navbar-inner">\n\
<button data-target=".nav-collapse" data-toggle="collapse" class="btn btn-navbar" type="button">\n\
    <span class="icon-bar"></span>\n\
    <span class="icon-bar"></span>\n\
    <span class="icon-bar"></span>\n\
</button>\n\
<a class="brand" href="#">BB</a>\n\
<% if (_.isFinite(view.model.id)) { %>\n\
<ul class="nav nav-collapse">\n\
    <li><a href="#projects">Projects</a></li>\n\
    <li><a href="#companies">Companies</a></li>\n\
    <li><a href="#todos">To-Dos</a></li>\n\
    <li><a href="#time_report">Time</a></li>\n\
    <li><a href="#people">People</a></li>\n\
</ul>\n\
<ul class="nav pull-right">\n\
    <li>\n\
        <a href="#me" title="<%- view.model.get("user-name") %>" class="dropdown-toggle" data-toggle="dropdown">\n\
            <%- view.model.name() %> <span class="caret"></span>\n\
        </a>\n\
        <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">\n\
            <li><a href="#me"><i class="icon-user"></i> My profile</a></li>\n\
            <li><a href="#todos"><i class="icon-tasks"></i> My todos</a></li>\n\
            <li><a href="#time_report"><i class="icon-time"></i> My time</a></li>\n\
            <li class="divider"></li>\n\
            <li><a href="/logout"><i class="icon-eject"></i> Logout</a></li>\n\
        </ul>\n\
    </li>\n\
</ul>\n\
<% } else { %>\n\
<ul class="nav pull-right">\n\
    <li>\n\
        <a href="/login" title="Login">Login</a>\n\
    </li>\n\
</ul>\n\
<% } %>\n\
</div>';
(function(root, factory) {
    'use strict';
    if (typeof root.define === 'function' && root.define.amd) {
        // AMD. Register as the bbtemplates module.
        root.define('bbtemplates', [], factory);
    } else {
        // Browser globals
        root.bbtemplates = factory();
    }
}(this, function() {
    'use strict';
    return templates;
}));
