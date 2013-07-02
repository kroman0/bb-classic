/*jslint white: true*/
/*
var templates = {};
templates['#oneproject-template'] = '\n\
<h3><a href="#projects/<%- id %>"><%- name %></a></h3>';
templates['#time-template'] = '\n\
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
</td>';
templates['#time-templateedit'] = '\n\
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
</td>';
templates['#time1-template'] = '\n\
<tr <% if(item.get("hours")>2){ %>class="warning"<% } %> data-id="<%- item.id %>">\n\
    <td><%- item.get("date") %></td>\n\
    <td><%- item.get("hours") %></td>\n\
    <td><a title="<%- item.get("person-name") %>" href="#people/<%- item.get("person-id") %>"><i class="icon-user"></i><%- item.get("person-name") %></a></td>\n\
    <td>\n\
        <% if (item.get("todo-item-id")) { %>\n\
            <a title="Todo time" href="#projects/<%- item.get("project-id") %>/time_entries/todo_items/<%- item.get("todo-item-id") %>"><i class="icon-file"></i></a>\n\
        <% } else { %>\n\
            <a title="Project time" href="#projects/<%- item.get("project-id") %>/time_entries"><i class="icon-folder-close"></i></a>\n\
        <% } %>\n\
        <%- item.get("description") %>\n\
    </td>\n\
    <td>\n\
        <button id="edit" title="Edit"><i class="icon-edit"></i></button>\n\
        <button id="remove" title="Remove"><i class="icon-trash"></i></button>\n\
    </td>\n\
</tr>';
templates['#time1-templateedit'] = '\n\
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
            <a title="Todo time" href="#projects/<%- item.get("project-id") %>/time_entries/todo_items/<%- item.get("todo-item-id") %>"><i class="icon-file"></i></a>\n\
        <% } else { %>\n\
            <a title="Project time" href="#projects/<%- item.get("project-id") %>/time_entries"><i class="icon-folder-close"></i></a>\n\
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
<h1><%- view.name() %></h1>\n\
<% if (view.model && view.model.get("company")) { %>\n\
<small>\n\
    <a href="#companies/<%- view.model.get("company").id %>"><%- view.model.get("company").name %></a>\n\
</small>\n\
<% } %>';
templates['#header1-template'] = '\n\
<h1><%- name %></h1>';
templates['#header2-template'] = '\n\
<div class="page-header">\n\
    <h1><%- view.PageHeader() %></h1>\n\
</div>\n\
<% var path = view.Path();\
if (path) { %>\n\
<ul class="breadcrumb">\n\
<% _.each(path, function(i) { %>\n\
    <li<% var url = i[0], title = i[1]; if (url) { %>>\n\
    <a href="<%- url %>"><%- title %></a> <span class="divider">&gt;</span>\n\
    <% } else { %> class="active">\n\
    <%- title %>\n\
    <% } %></li>\n\
<% }) %>\n\
</ul>\n\
<% } %>';
templates['#project-nav-template'] = '\n\
<ul class="nav nav-tabs projectnav">\n\
    <li><a title="<%- view.model.name() %> project overview" href="#projects/<%- view.model.id %>">Overview</a></li>\n\
    <li><a title="<%- view.model.name() %> project messages" href="#projects/<%- view.model.id %>/posts">Messages</a></li>\n\
    <li><a title="<%- view.model.name() %> project todos" href="#projects/<%- view.model.id %>/todo_lists">To-Dos</a></li>\n\
    <li><a title="<%- view.model.name() %> project calendar" href="#projects/<%- view.model.id %>/calendar">Calendar</a></li>\n\
    <li><a title="<%- view.model.name() %> project time" href="#projects/<%- view.model.id %>/time_entries">Time</a></li>\n\
    <li><a title="<%- view.model.name() %> project files" href="#projects/<%- view.model.id %>/files">Files</a></li>\n\
    <li class="pull-right"><a title="<%- view.model.name() %> project people" href="#projects/<%- view.model.id %>/people">People</a></li>\n\
    <li class="pull-right"><a title="<%- view.model.name() %> project categories" href="#projects/<%- view.model.id %>/categories">Categories</a></li>\n\
</ul>';
templates['#emptytime-template'] = '\n\
<div class="alert alert-info">\n\
    No time entries...\n\
</div>';
templates['#time-report-template'] = '\n\
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
            <% BB.collections.people.each(function (i) { %>\n\
                <option value="<%- i.id %>"><%- i.name() %></option>\n\
            <% }) %>\n\
        </select>\n\
    </div>\n\
    <br />\n\
    <div class="input-prepend">\n\
        <span class="add-on">Project</span>\n\
        <select name="filter_project_id" class="input-medium">\n\
            <option value="">All</option>\n\
            <% BB.collections.projects.each(function (i) { %>\n\
                <option value="<%- i.id %>"><%- i.get("name") %></option>\n\
            <% }) %>\n\
        </select>\n\
    </div>\n\
    <br />\n\
    <div class="input-prepend">\n\
        <span class="add-on">Company</span>\n\
        <select name="filter_company_id" class="input-medium">\n\
            <option value="">All</option>\n\
            <% BB.collections.companies.each(function (i) { %>\n\
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
if (!tt.isEmpty()) { %>\n\
<%= view.renderpager && view.renderpager() %>\n\
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
        <% var prs=BB.collections.projects;\n\
        _.each(_.uniq(tt.pluck("project-id")), function (prid) { %>\n\
        <tr id="times_p<%- prid %>" class="info">\n\
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
            <%= view.renderitem && view.renderitem(item) %>\n\
        <% }) %>\n\
        <% }) %>\n\
    </tbody>\n\
</table>\n\
<%= view.renderpager && view.renderpager() %>\n\
<% } %>';
templates['#emptyprojects-template'] = '\n\
<div class="alert alert-info">\n\
    No projects...\n\
</div>';
templates['#projectslayout-template'] = '\n\
<div id="header"></div>\n\
<div id="maincontent"></div>';
templates['#projects-template'] = '\n\
<% var pp=BB.collections.projects; if (!pp.isEmpty()) { %>\n\
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
templates['#onecompany-template'] = '\n\
<h3><a href="#companies/<%- id %>"><%- name %></a></h3>\n\
<div class="row-fluid thumbnail">\n\
    <div class="span4">\n\
        <% if (obj["web-address"]) { %><a href="<%- obj["web-address"] %>"><b><%- obj["web-address"] %></b></a><br /><% } %>\n\
        <% if (obj["time_zone_id"]) { %>Time zone: <%- obj["time_zone_id"] %><br /><% } %>\n\
        <% if (locale) { %>Locale: <%- locale %><% } %>\n\
    </div>\n\
    <div class="span4">\n\
        <% if (country) { %><%- country %><br /><% } %>\n\
        <% if (city) { %><%- city %> <%- zip %><br /><% } %>\n\
        <% if (obj["address-one"]) { %><%- obj["address-one"] %><br /><% } %>\n\
        <% if (obj["address-two"]) { %><%- obj["address-two"] %><% } %>\n\
    </div>\n\
    <div class="span4">\n\
        <% if (state) { %>State: <%- state %><br /><% } %>\n\
        <% if (obj["phone-number-office"]) { %>Office phone: <%- obj["phone-number-office"] %><br /><% } %>\n\
        <% if (obj["phone-number-fax"]) { %>Fax phone: <%- obj["phone-number-fax"] %><br /><% } %>\n\
    </div>\n\
</div>';
templates['#emptycompanies-template'] = '\n\
<div class="alert alert-info">\n\
    No companies...\n\
</div>';
templates['#companies-template'] = '\n';
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
templates['#emptypeople-template'] = '\n\
<div class="alert alert-info">\n\
    No people...\n\
</div>';
templates['#person-template'] = '\n\
<img class="pull-right img-polaroid" width="55" height="55"\n\
     src="<%- item.get("avatar-url") %>"\n\
     alt="<%- item.name() %>">\n\
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
<% if (item.get("time-zone-name")) { %>Time zone: <%- item.get("time-zone-name") %><% } %>';
templates['#personitem-template'] = '\n\
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
</div>';
templates['#people-template'] = '\n\
<% var pp=view.collection; var co=BB.collections.companies;\n\
if (!pp.isEmpty()) {\n\
if (co.isEmpty()) { %>\n\
<ul class="media-list"></ul>\n\
<% } else { %>\n\
<div class="tabbable tabs-left row-fluid">\n\
<ul class="nav nav-tabs span3">\n\
<% var fcoid=_.first(pp.pluck("company-id"));\n\
   co.each(function (item) { %>\n\
    <li<% if (fcoid==item.id) { %> class="active"<% } %>><a href="#people_c<%- item.id %>" data-toggle="tab"><%- item.get("name") %></a></li>\n\
<% }) %>\n\
</ul>\n\
<div class="tab-content span8">\n\
<% co.each(function (cc) { %>\n\
    <div class="tab-pane fade<% if (fcoid==cc.id) { %> in active<% } %>" id="people_c<%- cc.id %>">\n\
        <% var cp=pp.where({"company-id":cc.id}); if (_.isEmpty(cp)) { %>\n\
        <div class="alert alert-info">\n\
            No people in company...\n\
        </div>\n\
        <% } else { %>\n\
        <ul class="media-list"></ul>\n\
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
            <td><input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="input-small" name="date" placeholder="YYYY-MM-DD" value="<%- moment().format("YYYY-MM-DD") %>"></td>\n\
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
            <td><input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="input-small" name="date" placeholder="YYYY-MM-DD" value="<%- moment().format("YYYY-MM-DD") %>"></td>\n\
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
        <a href="#projects/<%- item.get("project-id") %>/posts/<%- item.id %>/comments" title="<%- item.get("comments-count") %> comments" class="badge badge-inverse">\n\
            <%- item.get("comments-count") %><i class="icon-comment icon-white"></i>\n\
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
        on: <abbr title="<%- item.get("posted-on") %>"><%- moment(item.get("posted-on")).format("LLL") %></abbr>\n\
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
            <abbr title="<%- item.get("created-on") %>"><%- moment(item.get("created-on")).format("LLL") %></abbr>,\n\
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
            <abbr title="<%- item.get("created-on") %>"><%- moment(item.get("created-on")).format("LLL") %></abbr>,\n\
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
        <a href="#projects/<%- item.get("project-id") %>/calendar/<%- item.id %>/comments" title="<%- item.get("comments-count") %> comments" class="badge badge-inverse">\n\
            <%- item.get("comments-count") %><i class="icon-comment icon-white"></i>\n\
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
        Start at <abbr title="<%- item.get("start-at") %>"><%- moment(item.get("start-at")).format("LL") %></abbr><br />\n\
        <% } %>\n\
        <% if (item.get("due-at")) { %>\n\
        Due at <abbr title="<%- item.get("due-at") %>"><%- moment(item.get("due-at")).format("LLL") %></abbr><br />\n\
        <% } %>\n\
        <% if (item.get("deadline")) { %>\n\
        Deadline at <abbr title="<%- item.get("deadline") %>"><%- moment(item.get("deadline")).format("LL") %></abbr><br />\n\
        <% } %>\n\
        Created by\n\
        <a href="#people/<%- item.get("creator-id") %>">\n\
            <i class="icon-user"></i><%- item.get("creator-name") %>\n\
        </a>\n\
        on\n\
        <abbr title="<%- item.get("created-on") %>"><%- moment(item.get("created-on")).format("LLL") %></abbr>\n\
        <% if (item.get("completed")) { %>\n\
        <br />\n\
        Completed by\n\
        <a href="#people/<%- item.get("completer-id") %>">\n\
            <i class="icon-user"></i><%- item.get("completer-name") %>\n\
        </a>\n\
        at\n\
        <abbr title="<%- item.get("completed-at") %>"><%- moment(item.get("completed-at")).format("LLL") %></abbr>\n\
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
<a href="#projects/<%- prid %>/todo_lists/<%- item.get("todo-list-id") %>/<%- item.id %>/comments" title="<%- item.get("comments-count") %> comments" class="badge badge-inverse">\n\
    <%- item.get("comments-count") %><i class="icon-comment icon-white"></i>\n\
</a>';
templates['#todolist-template'] = '\n\
<dt>\n\
    <a <% if (list.get("completed")) { %>class="muted"<% } %>\n\
       href="#projects/<%- list.get("project-id") %>/todo_lists/<%- list.id %>">\n\
        <%- list.get("name") %><% if (list.get("private")) { %><i class="icon-lock"></i><% } %>\n\
    </a>\n\
    <small><%= list.get("description") %></small>\n\
</dt>\n\
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
            <a href="#projects/<%- list.get("project-id") %>/time_entries/todo_items/<%- item.id %>">\n\
                <i class="icon-time"></i>\n\
            </a>\n\
            <% }} %>\n\
            <a href="#projects/<%- list.get("project-id") %>/todo_lists/<%- list.id %>/<%- item.id %>">\n\
                <%= item.content %>\n\
            </a>\n\
            <% if(false){ %>\n\
            <a href="#projects/<%- list.get("project-id") %>/todo_lists/<%- list.id %>/<%- item.id %>/comments" title="<%- item["comments-count"] %> comments" class="badge badge-inverse">\n\
                <%- item.get("comments-count") %><i class="icon-comment icon-white"></i>\n\
            </a>\n\
            <% } %>\n\
        </dd>\n\
        <% }) %>\n\
    </dl>\n\
</dd>';
templates['#emptytodos-template'] = '\n\
<div class="alert alert-info">\n\
    No todo lists...\n\
</div>';
templates['#todo-lists-template'] = '\n\
<% var td=view.collection;\n\
var pp=BB.collections.people;\n\
var prs=BB.collections.projects;\n\
var party=view.collection.responsible_party;\n\
var mid=party==null?BB.me.id:view.collection.responsible_party; %>\n\
<li>\n\
    <div class="pull-right">Show items assigned to:\n\
        <select name="target">\n\
            <option value="" <% if (party=="") { %>selected="selected"<% } %>>Nobody</option>\n\
            <% pp.each(function (i) { %>\n\
                <option value="<%- i.id %>" <% if (i.id==mid) { %>selected="selected"<% } %>><%- i.name() %></option>\n\
            <% }) %>\n\
        </select>\n\
    </div>\n\
    <h3><%- view.description() %> to-do items across all projects</h3>\n\
</li>\n\
<% if (!td.isEmpty()) { %>\n\
<li>\n\
<dl>\n\
<% _.each(_.uniq(td.pluck("project-id")),function (prid) { %>\n\
    <dt><a href="#projects/<%- prid %>/todo_lists"><%- prs.get(prid)?prs.get(prid).get("name"):prid %></a></dt>\n\
    <dd id="todos_p<%- prid %>"></dd>\n\
<% }) %>\n\
</dl>\n\
</li>\n\
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
            <abbr title="<%- item.get("created-at") %>"><%- moment(item.get("created-at")).format("LLL") %></abbr>\n\
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
<% } %>';
*/
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
var templates = {};
templates['#time'] = '<tr <% if(item.get("hours")>2){ %>class="warning"<% } %> data-id="<%- item.id %>">' +
'    <td><%- item.get("date") %></td>' +
'    <td><%- item.get("hours") %></td>' +
'    <td><a title="<%- item.get("person-name") %>" href="#people/<%- item.get("person-id") %>"><i class="icon-user"></i><%- item.get("person-name") %></a></td>' +
'    <td>' +
'        <% if (item.get("todo-item-id")) { %>' +
'            <a title="Todo time" href="#projects/<%- item.get("project-id") %>/time_entries/todo_items/<%- item.get("todo-item-id") %>"><i class="icon-file"></i></a>' +
'        <% } else { %>' +
'            <a title="Project time" href="#projects/<%- item.get("project-id") %>/time_entries"><i class="icon-folder-close"></i></a>' +
'        <% } %>' +
'        <%- item.get("description") %>' +
'    </td>' +
'    <td>' +
'        <button id="edit" title="Edit"><i class="icon-edit"></i></button>' +
'        <button id="remove" title="Remove"><i class="icon-trash"></i></button>' +
'    </td>' +
'</tr>';
templates['#timeedit'] = '<tr class="edittime" data-id="<%- item.id %>">' +
'    <td><input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="input-small" name="date" placeholder="YYYY-MM-DD" value="<%- item.get("date") %>"></td>' +
'    <td><input type="text" class="input-small" name="hours" placeholder="hours" value="<%- item.get("hours") %>"></td>' +
'    <td>' +
'        <div>' +
'            <i class="icon-user"></i><select name="person-id">' +
'                <% view.options.collections.people.each(function (i) { %>' +
'                    <option value="<%- i.id %>" <% if (i.id==item.get("person-id")) { %>selected="selected"<% } %>><%- i.name() %></option>' +
'                <% }) %>' +
'            </select>' +
'        </div>' +
'    </td>' +
'    <td>' +
'        <% if (item.get("todo-item-id")) { %>' +
'            <a title="Todo time" href="#projects/<%- item.get("project-id") %>/time_entries/todo_items/<%- item.get("todo-item-id") %>"><i class="icon-file"></i></a>' +
'        <% } else { %>' +
'            <a title="Project time" href="#projects/<%- item.get("project-id") %>/time_entries"><i class="icon-folder-close"></i></a>' +
'        <% } %>' +
'        <input type="text" class="input-small" name="description" value="<%- item.get("description") %>">' +
'    </td>' +
'    <td>' +
'        <button id="save" title="Save"><i class="icon-ok"></i></button>' +
'        <button id="reset" title="Cancel"><i class="icon-off"></i></button>' +
'    </td>' +
'</tr>';
templates['#pager'] = '<% if(view.collection.hasPrevious() || view.collection.hasNext()){ %>' +
'<ul class="pager">' +
'    <li class="<%- view.pagerid %> previous<% if(!view.collection.hasPrevious()){ %> disabled<% } %>">' +
'        <a href="#">&larr; Previous Page</a>' +
'    </li>' +
'    <li class="<%- view.pagerid %> next<% if(!view.collection.hasNext()){ %> disabled<% } %>">' +
'        <a href="#">Next Page &rarr;</a>' +
'    </li>' +
'</ul>' +
'<% } %>';
templates['#header'] = '<div class="page-header">' +
'    <h1><%- view.PageHeader() %></h1>' +
'</div>' +
'<% var path = view.Path();' +
'if (path) { %>' +
'<ul class="breadcrumb">' +
'<% _.each(path, function(i) { %>' +
'    <li<% var url = i[0], title = i[1]; if (url) { %>>' +
'    <a href="<%- url %>"><%- title %></a> <span class="divider">&gt;</span>' +
'    <% } else { %> class="active">' +
'    <%- title %>' +
'    <% } %></li>' +
'<% }) %>' +
'</ul>' +
'<% } %>';
templates['#project-nav'] = '<ul class="nav nav-tabs projectnav">' +
'    <li><a title="<%- view.model.name() %> project overview" href="#projects/<%- view.model.id %>">Overview</a></li>' +
'    <li><a title="<%- view.model.name() %> project messages" href="#projects/<%- view.model.id %>/posts">Messages</a></li>' +
'    <li><a title="<%- view.model.name() %> project todos" href="#projects/<%- view.model.id %>/todo_lists">To-Dos</a></li>' +
'    <li><a title="<%- view.model.name() %> project calendar" href="#projects/<%- view.model.id %>/calendar">Calendar</a></li>' +
'    <li><a title="<%- view.model.name() %> project time" href="#projects/<%- view.model.id %>/time_entries">Time</a></li>' +
'    <li><a title="<%- view.model.name() %> project files" href="#projects/<%- view.model.id %>/files">Files</a></li>' +
'    <li class="pull-right"><a title="<%- view.model.name() %> project people" href="#projects/<%- view.model.id %>/people">People</a></li>' +
'    <li class="pull-right"><a title="<%- view.model.name() %> project categories" href="#projects/<%- view.model.id %>/categories">Categories</a></li>' +
'</ul>';
templates['#attachment'] = '<li>' +
'    <a href="<%- item["download-url"] %>"><%- item.name %></a>' +
'    <small>' +
'        <%- item["byte-size"] %>B' +
'        <a href="#people/<%- item["person-id"] %>"><i class="icon-user"></i><%- item["author-name"] %></a>' +
'    </small>' +
'</li>';
templates['#attachments'] = '<% if (item.get("attachments")) { %>' +
'    <ul>' +
'        <% _.each(item.get("attachments"),function (a) { %>' +
'<%= view.itemblock(a, "#attachment") %>' +
'        <% }) %>' +
'    </ul>' +
'    <% } %>';
templates['#comment'] = '<li class="thumbnail">' +
'    <small>' +
'        <a href="#people/<%- item.get("author-id") %>"><i class="icon-user"></i><%- item.get("author-name") %></a>' +
'        <abbr title="<%- item.get("created-at") %>"><%- moment(item.get("created-at")).format("LLL") %></abbr>' +
'    </small>' +
'    <p><%= item.get("body") %></p>' +
'<%= view.itemblock(item, "#attachments") %>' +
'</li>';
templates['#comments'] = '<% if (view.collection.isEmpty()) { %>' +
'<div class="alert alert-info">No comments...</div>' +
'<% } else { %>' +
'<ul class="unstyled">' +
'    <% view.collection.each(function (item) { %>' +
'        <%= view.itemblock(item, "#comment") %>' +
'    <% }) %>' +
'</ul>' +
'<% } %>';
templates['#time-thead'] = '<thead>' +
'    <tr>' +
'        <th>date</th><th>hours</th><th data-sort="person-id">person</th><th>description</th><th data-sort="id">&nbsp;</th>' +
'    </tr>' +
'</thead>';
templates['#time-report'] = '<%= view.block("#header") %>' +
'<div id="time_report" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="makereportlabel" aria-hidden="true">' +
'<div class="modal-header">' +
'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
'<h3 id="makereportlabel">Make report</h3>' +
'</div>' +
'<form id="makereport">' +
'    <div class="modal-body">' +
'    <div class="input-prepend">' +
'        <span class="add-on">From</span>' +
'        <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyymmdd" type="text" class="input-small" name="from" placeholder="YYYYMMDD">' +
'    </div>' +
'    <br />' +
'    <div class="input-prepend">' +
'        <span class="add-on">To</span>' +
'        <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyymmdd" type="text" class="input-small" name="to" placeholder="YYYYMMDD">' +
'    </div>' +
'    <br />' +
'    <div class="input-prepend">' +
'        <span class="add-on">For</span>' +
'        <select name="subject_id" class="input-medium">' +
'            <option value="">All</option>' +
'            <% view.options.collections.people.each(function (i) { %>' +
'                <option value="<%- i.id %>"><%- i.name() %></option>' +
'            <% }) %>' +
'        </select>' +
'    </div>' +
'    <br />' +
'    <div class="input-prepend">' +
'        <span class="add-on">Project</span>' +
'        <select name="filter_project_id" class="input-medium">' +
'            <option value="">All</option>' +
'            <% view.options.collections.projects.each(function (i) { %>' +
'                <option value="<%- i.id %>"><%- i.get("name") %></option>' +
'            <% }) %>' +
'        </select>' +
'    </div>' +
'    <br />' +
'    <div class="input-prepend">' +
'        <span class="add-on">Company</span>' +
'        <select name="filter_company_id" class="input-medium">' +
'            <option value="">All</option>' +
'            <% view.options.collections.companies.each(function (i) { %>' +
'                <option value="<%- i.id %>"><%- i.get("name") %></option>' +
'            <% }) %>' +
'        </select>' +
'    </div>' +
'    </div>' +
'    <div class="modal-footer">' +
'        <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>' +
'        <button id="getreport" type="submit" data-dismiss="modal" class="btn btn-primary">Report</button>' +
'    </div>' +
'</form>' +
'</div>' +
'<a href="#time_report" role="button" class="btn btn-primary" data-toggle="modal">Report</a>' +
'<% var tt=view.collection;' +
'if (tt.isEmpty()) { %>' +
'<div class="alert alert-info">No time entries...</div>' +
'<% } else { %>' +
'<%= view.block("#pager") %>' +
'<table class="table table-hover table-condensed table-bordered <%- view.pagerid %>">' +
'    <%= view.block("#time-thead") %>' +
'    <tbody>' +
'        <% var prs=view.options.collections.projects;' +
'        _.each(_.uniq(tt.pluck("project-id")), function (prid) { %>' +
'        <tr class="info">' +
'            <td>' +
'                <a href="#projects/<%- prid %>/time_entries"><%- prs.get(prid)?prs.get(prid).get("name"):prid %></a>' +
'            </td>' +
'            <td>' +
'                <%- _.reduce(_.map(tt.where({"project-id":prid}),function(i){return i.get("hours");}),function(memo, num) { return memo + num; }, 0) %>' +
'            </td>' +
'            <td colspan="3">&nbsp;</td>' +
'        </tr>' +
'        <% _.each(tt.where({"project-id":prid}), function (item) { %>' +
'            <%= view.itemblock(item, "#time") %>' +
'        <% }) %>' +
'        <% }) %>' +
'    </tbody>' +
'</table>' +
'<%= view.block("#pager") %>' +
'<% } %>';
templates['#projects'] = '<%= view.block("#header") %>' +
'<% var pp=view.collection; if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">No projects...</div>' +
'<% } else { %>' +
'<div class="tabbable">' +
'<ul class="nav nav-pills">' +
'<% var fprst=_.first(pp.pluck("status"));' +
'   _.each(_.uniq(pp.pluck("status")), function (status) { %>' +
'    <li class="prstatus<% if (fprst==status) { %> active<% } %> pull-right">' +
'        <a href="#projects_<%- status %>" data-toggle="tab"><%- status %></a>' +
'    </li>' +
'<% }) %>' +
'</ul>' +
'<div class="tab-content">' +
'<% _.each(pp.groupBy(function(i){ return i.get("status")}), function (plist, status) { %>' +
'    <div class="tab-pane fade<% if (fprst==status) { %> in active<% } %>" id="projects_<%- status %>">' +
'        <div class="tabbable row-fluid">' +
'        <ul class="nav nav-list span4 pull-right">' +
'        <% var fprcoid=_.first(plist).get("company").id;' +
'        _.each(_.groupBy(plist, function(item){ return item.get("company").id}), function (list, coid) { %>' +
'            <li<% if (fprcoid==coid) { %> class="active"<% } %>>' +
'                <a href="#projects_<%- status %>_<%- coid %>" data-toggle="tab"><%- _.first(list).get("company").name %></a>' +
'            </li>' +
'        <% }) %>' +
'        </ul>' +
'        <div class="tab-content span8">' +
'        <% _.each(_.groupBy(plist, function(item){ return item.get("company").id}), function (list, coid) { %>' +
'            <div class="tab-pane fade<% if (fprcoid==coid) { %> in active<% } %>" id="projects_<%- status %>_<%- coid %>">' +
'                <ul class="unstyled">' +
'                <% _.each(list, function (item) { %>' +
'                    <li>' +
'                        <h3><a href="#projects/<%- item.id %>"><%- item.get("name") %></a></h3>' +
'                    </li>' +
'                <% }) %>' +
'                </ul>' +
'            </div>' +
'        <% }) %>' +
'        </div>' +
'        </div>' +
'    </div>' +
'<% }) %>' +
'</div>' +
'</div>' +
'<% } %>';
templates['#project'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% if (view.model.get("announcement")) { %><p><%= view.model.get("announcement") %></p><% } %>';
templates['#companies'] = '<%= view.block("#header") %>' +
'<% cc=view.collection; if (cc.isEmpty()) { %>' +
'<div class="alert alert-info">No companies...</div>' +
'<% } else { %>' +
'<dl>' +
'<% cc.each(function (item) { %>' +
'    <dt><h3><a href="#companies/<%- item.id %>"><%- item.get("name") %></a></h3></dt>' +
'    <dd class="row-fluid thumbnail">' +
'        <div class="span4">' +
'            <% if (item.get("web-address")) { %><a href="<%- item.get("web-address") %>"><b><%- item.get("web-address") %></b></a><br /><% } %>' +
'            <% if (item.get("time-zone-id")) { %>Time zone: <%- item.get("time-zone-id") %><br /><% } %>' +
'            <% if (item.get("locale")) { %>Locale: <%- item.get("locale") %><% } %>' +
'        </div>' +
'        <div class="span4">' +
'            <% if (item.get("country")) { %><%- item.get("country") %><br /><% } %>' +
'            <% if (item.get("city")) { %><%- item.get("city") %> <%- item.get("zip") %><br /><% } %>' +
'            <% if (item.get("address-one")) { %><%- item.get("address-one") %><br /><% } %>' +
'            <% if (item.get("address-two")) { %><%- item.get("address-two") %><% } %>' +
'        </div>' +
'        <div class="span4">' +
'            <% if (item.get("state")) { %>State: <%- item.get("state") %><br /><% } %>' +
'            <% if (item.get("phone-number-office")) { %>Office phone: <%- item.get("phone-number-office") %><br /><% } %>' +
'            <% if (item.get("phone-number-fax")) { %>Fax phone: <%- item.get("phone-number-fax") %><br /><% } %>' +
'        </div>' +
'    </dd>' +
'<% }) %>' +
'</dl>' +
'<% } %>';
templates['#company'] = '<%= view.block("#header") %>' +
'<div class="row">' +
'    <div class="span4">' +
'        <h2>Projects</h2>' +
'        <% var cid = view.model.id; var pp=view.options.collections.projects; if (pp.isEmpty()) { %>' +
'        <div class="alert alert-info">No projects...</div>' +
'        <% } else { %>' +
'        <ul class="unstyled">' +
'        <% _.each(pp.filter(function(i){return i.get("company").id==cid}), function (item) { %>' +
'            <li><i class="<%- item.icon() %>"></i>&nbsp;<a href="#projects/<%- item.id %>"><%- item.get("name") %></a></li>' +
'        <% }) %>' +
'        </ul>' +
'        <% } %>' +
'    </div>' +
'    <div class="span4">' +
'        <h2>People</h2>' +
'        <% var pp=view.options.collections.people; if (pp.isEmpty()) { %>' +
'        <div class="alert alert-info">No people...</div>' +
'        <% } else { %>' +
'        <ul class="unstyled">' +
'        <% _.each(pp.filter(function(i){return i.get("company-id")==cid}), function (item) { %>' +
'            <li><a href="#people/<%- item.id %>"><i class="icon-user"></i><%- item.name() %></a></li>' +
'        <% }) %>' +
'        </ul>' +
'        <% } %>' +
'    </div>' +
'    <div class="span4">' +
'        <h2>Contact</h2>' +
'        <% if (view.model.get("web-address")) { %>' +
'        <a href="<%- view.model.get("web-address") %>"><b><%- view.model.get("web-address") %></b></a><br />' +
'        <% } %>' +
'        <% if (view.model.get("time-zone-id")) { %>Time zone: <%- view.model.get("time-zone-id") %><br /><% } %>' +
'        <% if (view.model.get("locale")) { %>Locale: <%- view.model.get("locale") %><% } %>' +
'        <% if (view.model.get("country")) { %><%- view.model.get("country") %><br /><% } %>' +
'        <% if (view.model.get("city")) { %><%- view.model.get("city") %> <%- view.model.get("zip") %><br /><% } %>' +
'        <% if (view.model.get("address-one")) { %><%- view.model.get("address-one") %><br /><% } %>' +
'        <% if (view.model.get("address-two")) { %><%- view.model.get("address-two") %><% } %>' +
'        <% if (view.model.get("state")) { %>State: <%- view.model.get("state") %><br /><% } %>' +
'        <% if (view.model.get("phone-number-office")) { %>Office phone: <%- view.model.get("phone-number-office") %><br /><% } %>' +
'        <% if (view.model.get("phone-number-fax")) { %>Fax phone: <%- view.model.get("phone-number-fax") %><br /><% } %>' +
'    </div>' +
'</div>';
templates['#person'] = '<%= view.block("#header") %>' +
'<img class="pull-right img-polaroid" width="55" height="55"' +
'     src="<%- view.model.get("avatar-url") %>"' +
'     alt="<%- view.model.name() %>">' +
'<a href="mailto:<%- view.model.get("email-address") %>"><b><%- view.model.get("email-address") %></b></a><br />' +
'<% if (view.model.get("im-service")&&view.model.get("im-handle")) { %>' +
'    <%- view.model.get("im-service") %>: <% if (view.model.get("im-service")=="Skype") { %>' +
'        <a href="skype:<%- view.model.get("im-handle") %>?call" title="Skype call to <%- view.model.name() %>"><%- view.model.get("im-handle") %></a>' +
'    <% } else { %>' +
'        <%- view.model.get("im-handle") %>' +
'    <% } %>' +
'    <br />' +
'<% } %>' +
'<% if (view.model.get("phone-number-office")) { %>Office phone: <%- view.model.get("phone-number-office") %><br /><% } %>' +
'<% if (view.model.get("phone-number-mobile")) { %>Mobile phone: <%- view.model.get("phone-number-mobile") %><br /><% } %>' +
'<% if (view.model.get("phone-number-home")) { %>Home phone: <%- view.model.get("phone-number-home") %><br /><% } %>' +
'<% if (view.model.get("phone-number-fax")) { %>Fax phone: <%- view.model.get("phone-number-fax") %><br /><% } %>' +
'<% if (view.model.get("time-zone-name")) { %>Time zone: <%- view.model.get("time-zone-name") %><% } %>';
templates['#personitem'] = '<% var in_project=item.collection.url().indexOf("projects")!==-1 %>' +
'<li class="media well well-small">' +
'    <a class="pull-right" href="#<%- in_project ? "projects/" + item.get("project-id") + "/" : "" %>people/<%- item.id %>" title="<%- item.name() %>"><img class="media-object img-polaroid" src="<%- item.get("avatar-url") %>" alt="<%- item.name() %>"></a>' +
'    <div class="media-body">' +
'        <h4 class="media-heading">' +
'            <a href="#<%- in_project ? "projects/" + item.get("project-id") + "/" : "" %>people/<%- item.id %>" title="<%- item.name() %>"><%- item.name() %></a>' +
'            <% if (item.get("title")) { %>' +
'            <small><%- item.get("title") %></small>' +
'            <% } %>' +
'        </h4>' +
'        <a href="mailto:<%- item.get("email-address") %>"><b><%- item.get("email-address") %></b></a><br />' +
'        <% if (item.get("im-service")&&item.get("im-handle")) { %>' +
'            <%- item.get("im-service") %>: <% if (item.get("im-service")=="Skype") { %>' +
'                <a href="skype:<%- item.get("im-handle") %>?call" title="Skype call to <%- item.name() %>"><%- item.get("im-handle") %></a>' +
'            <% } else { %>' +
'                <%- item.get("im-handle") %>' +
'            <% } %>' +
'            <br />' +
'        <% } %>' +
'        <% if (item.get("phone-number-office")) { %>Office phone: <%- item.get("phone-number-office") %><br /><% } %>' +
'        <% if (item.get("phone-number-mobile")) { %>Mobile phone: <%- item.get("phone-number-mobile") %><br /><% } %>' +
'        <% if (item.get("phone-number-home")) { %>Home phone: <%- item.get("phone-number-home") %><br /><% } %>' +
'        <% if (item.get("phone-number-fax")) { %>Fax phone: <%- item.get("phone-number-fax") %><br /><% } %>' +
'        <% if (item.get("time-zone-name")) { %>Time zone: <%- item.get("time-zone-name") %><% } %>' +
'    </div>' +
'</li>';
templates['#people'] = '<%= view.block("#header") %>' +
'<% var pp=view.collection; var cc=view.options.collections.companies;' +
'if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">No people...</div>' +
'<% } else {' +
'if (cc.isEmpty()) { %>' +
'<ul class="media-list">' +
'<% pp.each(function (item) { %>' +
'    <%= view.itemblock(item, "#personitem") %>' +
'<% }) %>' +
'</ul>' +
'<% } else { %>' +
'<div class="tabbable tabs-left row-fluid">' +
'<ul class="nav nav-tabs span3">' +
'<% var fcoid=_.first(pp.pluck("company-id"));' +
'   cc.each(function (item) { %>' +
'    <li<% if (fcoid==item.id) { %> class="active"<% } %>><a href="#people_c<%- item.id %>" data-toggle="tab"><%- item.name() %></a></li>' +
'<% }) %>' +
'</ul>' +
'<div class="tab-content span8">' +
'<% cc.each(function (cc) { %>' +
'    <div class="tab-pane fade<% if (fcoid==cc.id) { %> in active<% } %>" id="people_c<%- cc.id %>">' +
'        <% var cp=pp.where({"company-id":cc.id}); if (_.isEmpty(cp)) { %>' +
'        <div class="alert alert-info">No people in company...</div>' +
'        <% } else { %>' +
'        <ul class="media-list">' +
'        <% _.each(cp, function (item) { %>' +
'            <%= view.itemblock(item, "#personitem") %>' +
'        <% }) %>' +
'        </ul>' +
'        <% } %>' +
'    </div>' +
'<% }) %>' +
'</div>' +
'</div>' +
'<% }} %>';
templates['#project-people'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var pp=view.collection; var cc=view.options.collections.companies;' +
'if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">No people...</div>' +
'<% } else {' +
'if (cc.isEmpty()) { %>' +
'<ul class="media-list">' +
'<% pp.each(function (item) { %>' +
'    <%= view.itemblock(item, "#personitem") %>' +
'<% }) %>' +
'</ul>' +
'<% } else { %>' +
'<div class="tabbable tabs-left row-fluid">' +
'<ul class="nav nav-tabs span3">' +
'<% var pc=_.uniq(pp.pluck("company-id")); var fcoid=_.first(pc);' +
'_.each(pc, function (id) { %>' +
'    <li<% if (fcoid==id) { %> class="active"<% } %>><a href="#people_c<%- id %>" data-toggle="tab"><%- cc.get(id)?cc.get(id).name():id %></a></li>' +
'<% }) %>' +
'</ul>' +
'<div class="tab-content span8">' +
'<% _.each(pc, function (id) { %>' +
'    <div class="tab-pane fade<% if (fcoid==id) { %> in active<% } %>" id="people_c<%- id %>">' +
'        <ul class="media-list">' +
'        <% _.each(pp.where({"company-id":id}), function (item) { %>' +
'            <%= view.itemblock(item, "#personitem") %>' +
'        <% }) %>' +
'        </ul>' +
'    </div>' +
'<% }) %>' +
'</div>' +
'</div>' +
'<% }} %>';
templates['#project-person'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var pp=view.collection; var item=pp.get(view.cur_item);' +
'if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">No people...</div>' +
'<% } else { %>' +
'<ul class="media-list">' +
'    <%= view.itemblock(item, "#personitem") %>' +
'</ul>' +
'<% } %>';
templates['#timeadd'] = '<% var pp=view.options.collections.people; var mid=view.options.mydata?view.options.mydata.id:0; %>' +
'<tr class="addtime">' +
'    <td><input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="input-small" name="date" placeholder="YYYY-MM-DD" value="<%- moment().format("YYYY-MM-DD") %>"></td>' +
'    <td><input type="text" class="input-small" name="hours" placeholder="hours" value="0"></td>' +
'    <td>' +
'        <div>' +
'            <i class="icon-user"></i><select name="person-id">' +
'                <% pp.each(function (i) { %>' +
'                    <option value="<%- i.id %>" <% if (i.id==mid) { %>selected="selected"<% } %>><%- i.name() %></option>' +
'                <% }) %>' +
'            </select>' +
'        </div>' +
'    </td>' +
'    <td>' +
'        <input type="text" class="input-small" name="description">' +
'    </td>' +
'    <td>' +
'        <button id="add" title="Add"><i class="icon-plus"></i></button>' +
'    </td>' +
'</tr>';
templates['#project-time'] = templates['#todo-time'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% if (view.collection.isEmpty()) { %>' +
'<div class="alert alert-info">No time entries...</div>' +
'<% } else { %>' +
'<%= view.block("#pager") %>' +
'<table class="table table-hover table-condensed table-bordered <%- view.pagerid %>">' +
'    <%= view.block("#time-thead") %>' +
'    <tbody>' +
'        <%= view.block("#timeadd") %>' +
'        <% view.collection.each(function (item) { %>' +
'            <%= view.itemblock(item, "#time") %>' +
'        <% }) %>' +
'    </tbody>' +
'</table>' +
'<%= view.block("#pager") %>' +
'<% } %>';
templates['#post'] = '<li class="thumbnail">' +
'    <h3>' +
'        <a href="#projects/<%- item.get("project-id") %>/posts/<%- item.id %>"><%- item.get("title") %></a>' +
'        <% if (item.get("private")) { %><i class="icon-lock"></i><% } %>' +
'        <a href="#projects/<%- item.get("project-id") %>/posts/<%- item.id %>/comments" title="<%- item.get("comments-count") %> comments" class="badge badge-inverse"><i class="icon-comment icon-white"></i><%- item.get("comments-count") %></a>' +
'    </h3>' +
'    <small>' +
'        by' +
'        <a href="#people/<%- item.get("author-id") %>"><i class="icon-user"></i><%- item.get("author-name") %></a>' +
'        <% if (item.get("category-id")) { %>' +
'        in' +
'        <a href="#projects/<%- item.get("project-id") %>/categories/<%- item.get("category-id") %>"><%- item.get("category-name") %></a>' +
'        <% } %>' +
'        on: <abbr title="<%- item.get("posted-on") %>"><%- moment(item.get("posted-on")).format("LLL") %></abbr>' +
'    </small>' +
'    <p><%= item.get("display-body") %></p>' +
'    <% if (item.get("attachments")) { %>' +
'    <ul>' +
'        <% _.each(item.get("attachments"),function (a) { %>' +
'        <li>' +
'            <a href="<%- a["download-url"] %>"><%- a.name %></a>' +
'            <small>' +
'                <%- a["byte-size"] %>B' +
'                <a href="#people/<%- a["person-id"] %>"><i class="icon-user"></i><%- a["author-name"] %></a>' +
'            </small>' +
'        </li>' +
'        <% }) %>' +
'    </ul>' +
'    <% } %>' +
'</li>';
templates['#project-posts'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var pp=view.collection; var prid=view.model.id;' +
'if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">No posts...</div>' +
'<% } else { %>' +
'<ul class="unstyled">' +
'<% pp.each(function (item) { %>' +
'    <%= view.itemblock(item, "#post") %>' +
'<% }) %>' +
'</ul>' +
'<% } %>';
templates['#project-post'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var pp=view.collection; var prid=view.model.id; var item=pp.get(view.cur_item);' +
'if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">No posts...</div>' +
'<% } else { %>' +
'<ul class="unstyled">' +
'    <%= view.itemblock(item, "#post") %>' +
'</ul>' +
'<% } %>';
templates['#project-post-comments'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var item=view.options.collections.project_posts.get_or_create(view.model.id).get(view.cur_item);' +
'if (item) { %>' +
'<ul class="unstyled">' +
'    <%= view.itemblock(item, "#post") %>' +
'</ul>' +
'<% } %>' +
'<%= view.block("#comments") %>';
templates['#file'] = '<% var prid=view.model.id; var pp=view.options.collections.people;' +
'var cc=view.options.collections.project_categories.get_or_create(prid); %>' +
'<li class="media well well-small">' +
'    <h3>' +
'        <a href="#projects/<%- prid %>/files/<%- item.id %>"><%- item.get("name") %><% if (item.get("private")) { %><i class="icon-lock"></i><% } %></a>' +
'    </h3>' +
'    <small>' +
'        by' +
'        <a href="#people/<%- item.get("person-id") %>"><i class="icon-user"></i><%- pp.get(item.get("person-id"))?pp.get(item.get("person-id")).name():item.get("person-id") %></a>' +
'        <% if (_.isFinite(item.get("category-id"))) { %>' +
'        in' +
'        <a href="#projects/<%- prid %>/categories/<%- item.get("category-id") %>"><%- cc.get(item.get("category-id"))?cc.get(item.get("category-id")).get("name"):item.get("category-id") %></a>' +
'        <% } %>' +
'        on' +
'        <abbr title="<%- item.get("created-on") %>"><%- moment(item.get("created-on")).format("LLL") %></abbr>,' +
'        <%- item.get("byte-size") %>B<br />' +
'        <% if (_.isFinite(item.get("owner-id"))) { %>' +
'        for <%- item.get("owner-type") %> #<%- item.get("owner-id") %><br />' +
'        <% } %>' +
'        version #<%- item.get("version") %>' +
'        <% if (item.get("current")) { %>' +
'        - <a href="#projects/<%- prid %>/files/<%- item.get("collection") %>">parent version</a>' +
'        <% } else { var current=view.collection.where({"current":true,"collection":item.id}); %>' +
'        - <a href="#projects/<%- prid %>/files/<%- current && current[0] && current[0].id %>">current version</a>' +
'        <% } %>' +
'    </small>' +
'    <br/>' +
'    <a class="btn btn-success" href="<%- item.get("download-url") %>">Download</a>' +
'</li>';
templates['#project-files'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var ff=view.collection;' +
'if (ff.isEmpty()) { %>' +
'<div class="alert alert-info">No files...</div>' +
'<% } else { %>' +
'<%= view.block("#pager") %>' +
'<ul class="media-list">' +
'<% ff.each(function (item) { %>' +
'    <%= view.itemblock(item, "#file") %>' +
'<% }) %>' +
'</ul>' +
'<%= view.block("#pager") %>' +
'<% } %>';
templates['#project-file'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var ff=view.collection; var item=ff.get(view.cur_item);' +
'if (ff.isEmpty()) { %>' +
'<div class="alert alert-info">No files...</div>' +
'<% } else { %>' +
'<ul class="media-list">' +
'    <%= view.itemblock(item, "#file") %>' +
'</ul>' +
'<% } %>';
templates['#calendar'] = '<li class="thumbnail">' +
'    <h3>' +
'        <a <% if (item.get("type")=="Milestone" && item.get("completed")) { %>class="muted" <% } %>href="#projects/<%- item.get("project-id") %>/calendar/<%- item.id %>"><%- item.get("title") %></a>' +
'        <a href="#projects/<%- item.get("project-id") %>/calendar/<%- item.id %>/comments" title="<%- item.get("comments-count") %> comments" class="badge badge-inverse"><i class="icon-comment icon-white"></i><%- item.get("comments-count") %></a>' +
'    </h3>' +
'    <small>' +
'        <% if (item.get("type")=="Milestone" && item.get("responsible-party-id")) { %>' +
'        <a href="#<%- item.get("responsible-party-type")=="Company"?"companies":"people" %>/<%- item.get("responsible-party-id") %>"><% if (item.get("responsible-party-type")=="Person") { %><i class="icon-user"></i><% } %><%- item.get("responsible-party-name") %></a><br />' +
'        <% } %>' +
'        Type: <%- item.get("type") %><br />' +
'        <% if (item.get("start-at")) { %>' +
'        Start at <abbr title="<%- item.get("start-at") %>"><%- moment(item.get("start-at")).format("LL") %></abbr><br />' +
'        <% } %>' +
'        <% if (item.get("type")=="CalendarEvent" && item.get("due-at")) { %>' +
'        Due at <abbr title="<%- item.get("due-at") %>"><%- moment(item.get("due-at")).format("LLL") %></abbr><br />' +
'        <% } %>' +
'        <% if (item.get("type")=="Milestone" && item.get("deadline")) { %>' +
'        Deadline at <abbr title="<%- item.get("deadline") %>"><%- moment(item.get("deadline")).format("LL") %></abbr><br />' +
'        <% } %>' +
'        Created by' +
'        <a href="#people/<%- item.get("creator-id") %>"><i class="icon-user"></i><%- item.get("creator-name") %></a>' +
'        on' +
'        <abbr title="<%- item.get("created-on") %>"><%- moment(item.get("created-on")).format("LLL") %></abbr>' +
'        <% if (item.get("type")=="Milestone" && item.get("completed")) { %>' +
'        <br />' +
'        Completed by' +
'        <a href="#people/<%- item.get("completer-id") %>"><i class="icon-user"></i><%- item.get("completer-name") %></a>' +
'        at' +
'        <abbr title="<%- item.get("completed-at") %>"><%- moment(item.get("completed-at")).format("LLL") %></abbr>' +
'        <% } %>' +
'    </small>' +
'</li>';
templates['#project-calendar'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var cc=view.collection; var prid=view.model.id;' +
'if (cc.isEmpty()) { %>' +
'<div class="alert alert-info">No events...</div>' +
'<% } else { %>' +
'<ul class="unstyled">' +
'<% cc.each(function (item) { %>' +
'    <%= view.itemblock(item, "#calendar") %>' +
'<% }) %>' +
'</ul>' +
'<% } %>';
templates['#project-calendar-entry'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var cc=view.collection; var prid=view.model.id; var item=cc.get(view.cur_item);' +
'if (cc.isEmpty()) { %>' +
'<div class="alert alert-info">No events...</div>' +
'<% } else { %>' +
'<ul class="unstyled">' +
'    <%= view.itemblock(item, "#calendar") %>' +
'</ul>' +
'<% } %>';
templates['#project-calendar-entry-comments'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var item=view.options.collections.project_calendar.get_or_create(view.model.id).get(view.cur_item);' +
'if (item) { %>' +
'<ul class="unstyled">' +
'    <%= view.itemblock(item, "#calendar") %>' +
'</ul>' +
'<% } %>' +
'<%= view.block("#comments") %>';
templates['#category'] = '<dt>' +
'    <h3>' +
'        <a href="#projects/<%- item.get("project-id") %>/categories/<%- item.id %>"><%- item.get("name") %></a>' +
'    </h3>' +
'</dt>' +
'<dd>' +
'    <%- item.get("type") %><br />Elements: <%- item.get("elements-count") %>' +
'</dd>';
templates['#project-categories'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var cc=view.collection; var prid=view.model.id;' +
'if (cc.isEmpty()) { %>' +
'<div class="alert alert-info">No categories...</div>' +
'<% } else { %>' +
'<%= view.block("#pager") %>' +
'<dl>' +
'<% cc.each(function (item) { %>' +
'    <%= view.itemblock(item, "#category") %>' +
'<% }) %>' +
'</dl>' +
'<%= view.block("#pager") %>' +
'<% } %>';
templates['#project-category'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var cc=view.collection; var prid=view.model.id; var item=cc.get(view.cur_item);' +
'if (cc.isEmpty()) { %>' +
'<div class="alert alert-info">No categories...</div>' +
'<% } else { %>' +
'<dl>' +
'    <%= view.itemblock(item, "#category") %>' +
'</dl>' +
'<% } %>';
templates['#todolist'] = '<dt>' +
'    <a <% if (item.get("completed")) { %>class="muted"<% } %>' +
'       href="#projects/<%- item.get("project-id") %>/todo_lists/<%- item.id %>"><%- item.get("name") %><% if (item.get("private")) { %><i class="icon-lock"></i><% } %></a>' +
'    <small><%= item.get("description") %></small>' +
'</dt>';
templates['#todo-lists'] = '<%= view.block("#header") %>' +
'<% var td=view.collection;' +
'var pp=view.options.collections.people;' +
'var prs=view.options.collections.projects;' +
'var party=view.collection.responsible_party;' +
'var mid=party==null?view.options.mydata.id:view.collection.responsible_party; %>' +
'<div>' +
'    <div class="pull-right">Show items assigned to:' +
'        <select name="target">' +
'            <option value="" <% if (party=="") { %>selected="selected"<% } %>>Nobody</option>' +
'            <% pp.each(function (i) { %>' +
'                <option value="<%- i.id %>" <% if (i.id==mid) { %>selected="selected"<% } %>><%- i.name() %></option>' +
'            <% }) %>' +
'        </select>' +
'    </div>' +
'    <h3><%- view.description() %> to-do items across all projects</h3>' +
'</div>' +
'<% if (td.isEmpty()) { %>' +
'<div class="alert alert-info">No todo lists...</div>' +
'<% } else { %>' +
'<dl>' +
'<% _.each(_.uniq(td.pluck("project-id")),function (prid) { %>' +
'    <dt><a href="#projects/<%- prid %>/todo_lists"><%- prs.get(prid)?prs.get(prid).get("name"):prid %></a></dt>' +
'    <dd>' +
'    <dl>' +
'        <% _.each(td.where({"project-id":prid}), function (list) { %>' +
'        <%= view.itemblock(list, "#todolist") %>' +
'        <dd>' +
'        <dl>' +
'        <% _.each(list.get("todo-items"), function (item) { %>' +
'        <dd>' +
'            <% if(false){if (item.completed) { %>' +
'            <i class="todo-lists icon-completed" data-todolist-id="<%- list.id %>" data-todoitem-id="<%- item.id %>"></i>' +
'            <% } else { %>' +
'            <i class="todo-lists icon-uncompleted" data-todolist-id="<%- list.id %>" data-todoitem-id="<%- item.id %>"></i>' +
'            <% } %>' +
'            <% if (list.get("tracked")) { %>' +
'            <a href="#projects/<%- prid %>/time_entries/todo_items/<%- item.id %>"><i class="icon-time"></i></a>' +
'            <% }} %>' +
'            <a href="#projects/<%- prid %>/todo_lists/<%- list.id %>/<%- item.id %>"><%= item.content %></a>' +
'            <% if(false){ %>' +
'            <a href="#projects/<%- prid %>/todo_lists/<%- list.id %>/<%- item.id %>/comments" title="<%- item["comments-count"] %> comments" class="badge badge-inverse"><i class="icon-comment icon-white"></i><%- item.get("comments-count") %></a>' +
'            <% } %>' +
'        </dd>' +
'        <% }) %>' +
'        </dl>' +
'        </dd>' +
'        <% }) %>' +
'    </dl>' +
'    </dd>' +
'<% }) %>' +
'</dl>' +
'<% } %>';
templates['#project-todo-lists'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var td=view.collection; var todo_items=view.options.collections.todo_items; var prid=view.model.id;' +
'if (td.isEmpty()) { %>' +
'<div class="alert alert-info">No todo lists...</div>' +
'<% } else { %>' +
'<div class="tabbable row-fluid">' +
'<ul class="nav nav-list span4 pull-right">' +
'<% var ftdst=_.first(td.pluck("completed"));' +
'   _.each(_.uniq(td.pluck("completed")), function (status) { %>' +
'    <li<% if (ftdst==status) { %> class="active"<% } %>>' +
'        <a href="#todolists_<%- status %>" data-toggle="tab"><% if (status==true) { %>Finished<% } else { %>Pending<% } %></a>' +
'    </li>' +
'<% }) %>' +
'</ul>' +
'<div class="tab-content span8">' +
'    <% _.each(td.groupBy(function(i){ return i.get("completed")}), function (tlgroup, status) { %>' +
'    <div class="tab-pane fade<% if (ftdst+""==status) { %> in active<% } %>" id="todolists_<%- status %>">' +
'        <dl>' +
'            <% _.each(tlgroup, function (list) { %>' +
'            <%= view.itemblock(list, "#todolist") %>' +
'            <dd>' +
'                <small>' +
'                    Completed: <%- list.get("completed-count") %>' +
'                    <br />' +
'                    Uncompleted: <%- list.get("uncompleted-count") %>' +
'                </small>' +
'            </dd>' +
'            <% }) %>' +
'        </dl>' +
'    </div>' +
'    <% }) %>' +
'</div>' +
'</div>' +
'<% } %>';
templates['#todo'] = '<% var prid=view.model.id; var tdlid=item.get("todo-list-id");' +
'var list=view.options.collections.project_todo_lists.get_or_create(prid).get(tdlid); %>' +
'<i class="todo icon-<%- item.get("completed")?"":"un" %>completed" data-id="<%- item.id %>" data-todolist-id="<%- item.get("todo-list-id") %>" data-todoitem-id="<%- item.id %>"></i>' +
'<% if (list&&list.get("tracked")) { %>' +
'<a href="#projects/<%- prid %>/time_entries/todo_items/<%- item.id %>"><i class="icon-time"></i></a>' +
'<% } %>&nbsp;' +
'<a href="#projects/<%- prid %>/todo_lists/<%- item.get("todo-list-id") %>/<%- item.id %>"><%= item.get("content") %></a>' +
'<% if (_.isFinite(item.get("responsible-party-id"))) { %><i class="icon-user"></i><% } %>' +
'<a href="#projects/<%- prid %>/todo_lists/<%- item.get("todo-list-id") %>/<%- item.id %>/comments" title="<%- item.get("comments-count") %> comments" class="badge badge-inverse"><i class="icon-comment icon-white"></i><%- item.get("comments-count") %></a>' +
'<i class="todo icon-pencil" data-id="<%- item.id %>"></i>' +
'<i class="todo icon-trash" data-id="<%- item.id %>"></i>';
templates['#todoedit'] = '<% var pp=view.options.collections.project_people.get_or_create(view.model.id); %>' +
'<div id="edit_todo_wrapper"><form id="edit_todo">' +
'<label for="todoContent">Todo content</label>' +
'<textarea id="todoContent" name="content" required><%= item.get("content") %></textarea>' +
'<label for="todoDueAt">Due date</label>' +
'<input id="todoDueAt" data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="input-small" name="due-at" placeholder="YYYY-MM-DD" value="<%= item.get("due-at") %>"><br />' +
'<label for="responsiblePerson">Responsible person</label>' +
'<select  id="responsiblePerson" name="responsible-party">' +
'<option value="">Nobody</option>' +
'<% pp.each(function (i) { %><option value="<%- i.id %>" <% if (i.id==item.get("responsible-party-id")) { %>selected="selected"<% } %>><%- i.name() %></option><% }) %>' +
'</select>' +
'<div class="checkbox"><label><input type="checkbox" name="notify" value="true"> Notify responsible person</label></div>' +
'<button id="save" data-id="<%- item.id %>" class="btn btn-default" title="Save"><i class="icon-ok"></i></button>' +
'<button id="reset" data-id="<%- item.id %>" class="btn btn-default" title="Cancel"><i class="icon-off"></i></button>' +
'</form></div>';
templates['#todoadd'] = '<% var pp=view.options.collections.project_people.get_or_create(view.model.id); %>' +
'<dd>' +
'<button type="button" class="btn" data-toggle="collapse" data-target="#add_todo_wrapper">Add an item</button>' +
'<div id="add_todo_wrapper" class="collapse"><form id="add_todo">' +
'<label for="todoContent">Todo content</label>' +
'<textarea id="todoContent" name="content" required></textarea>' +
'<label for="todoDueAt">Due date</label>' +
'<input id="todoDueAt" data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="input-small" name="due-at" placeholder="YYYY-MM-DD" value=""><br />' +
'<label for="responsiblePerson">Responsible person</label>' +
'<select  id="responsiblePerson" name="responsible-party">' +
'<option value="">Nobody</option>' +
'<% pp.each(function (i) { %><option value="<%- i.id %>"><%- i.name() %></option><% }) %>' +
'</select>' +
'<div class="checkbox"><label><input type="checkbox" name="notify" value="true"> Notify responsible person</label></div>' +
'<button id="add" class="btn btn-default" title="Add"><i class="icon-plus"></i></button>' +
'</form></div>' +
'</dd>';
templates['#project-todo-list'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var td=view.collection; var todo_items=view.options.collections.todo_items; var prid=view.model.id;' +
'var ci=view.cur_item; var list=td.get(ci); var ftdst=list&&list.get("completed");' +
'if (td.isEmpty()) { %>' +
'<div class="alert alert-info">No todo lists...</div>' +
'<% } else { %>' +
'<div class="row-fluid">' +
'<dl class="todoitemsholder span8 project-todo-list">' +
'    <%= view.itemblock(list, "#todolist") %>' +
'<% view.options.collections.todo_items.get_or_create(ci).each(function (item) { %>' +
'    <dd>' +
'<%= view.itemblock(item, "#todo") %>' +
'    </dd>' +
'<% }) %>' +
'<%= view.block("#todoadd") %>' +
'</dl>' +
'<div class="tabbable span4 pull-right">' +
'<ul class="nav nav-pills">' +
'<% _.each(_.uniq(td.pluck("completed")), function (status) { %>' +
'    <li<% if (ftdst==status) { %> class="active"<% } %>>' +
'        <a href="#todolists_<%- status %>" data-toggle="tab"><% if (status==true) { %>Finished<% } else { %>Pending<% } %></a>' +
'    </li>' +
'<% }) %>' +
'</ul>' +
'<div class="tab-content">' +
'<% _.each(td.groupBy(function(i){ return i.get("completed")}), function (tlgroup, status) { %>' +
'    <div class="tab-pane fade<% if (ftdst+""==status) { %> in active<% } %>" id="todolists_<%- status %>">' +
'    <ul class="nav nav-list">' +
'        <% _.each(tlgroup, function (l) { %>' +
'        <li<% if (ci==l.id) { %> class="active"<% } %>>' +
'            <a href="#projects/<%- prid %>/todo_lists/<%- l.id %>"><%- l.get("name") %><% if (l.get("private")) { %><i class="icon-lock"></i><% } %></a>' +
'        </li>' +
'        <% }) %>' +
'    </ul>' +
'    </div>' +
'<% }) %>' +
'</div>' +
'</div>' +
'</div>' +
'<% } %>';
templates['#project-todo-item'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var td=view.collection; var todo_items=view.options.collections.todo_items;' +
'var prid=view.model.id; var list_id=view.cur_item; var item_id=view.todo_item;' +
'var items=todo_items.get_or_create(list_id); var list=td.get(list_id);' +
'var item=items.get(item_id);' +
'if (td.isEmpty()||items.isEmpty()) { %>' +
'<div class="alert alert-info">No todo items...</div>' +
'<% } else { %>' +
'<dl class="todoitemsholder project-todo-item">' +
'    <%= view.itemblock(list, "#todolist") %>' +
'    <dd>' +
'<%= view.itemblock(item, "#todo") %>' +
'    </dd>' +
'</dl>' +
'<% } %>';
templates['#project-todo-item-comments'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var td=view.todo_lists; var todo_items=view.options.collections.todo_items;' +
'var prid=view.model.id; var list_id=view.cur_item; var item_id=view.todo_item;' +
'var items=todo_items.get_or_create(list_id);' +
'var item=items.get(item_id);' +
'var ccc=view.collection;' +
'if (td.isEmpty()||items.isEmpty()) { %>' +
'<div class="alert alert-info">No todo items...</div>' +
'<% } else { %>' +
'<dl class="todoitemsholder project-todo-item-comments">' +
'    <dd>' +
'<%= view.itemblock(item, "#todo") %>' +
'    </dd>' +
'</dl>' +
'<% } %>' +
'<%= view.block("#comments") %>';
templates['#nav'] = '\n' +
'<button data-target=".nav-collapse" data-toggle="collapse" class="btn btn-navbar" type="button">' +
'    <span class="icon-bar"></span>' +
'    <span class="icon-bar"></span>' +
'    <span class="icon-bar"></span>' +
'</button>' +
'<a class="brand" href="#">BB</a>' +
'<% if (_.isFinite(view.model.id)) { %>' +
'<ul class="nav nav-collapse">' +
'    <li><a href="#projects">Projects</a></li>' +
'    <li><a href="#companies">Companies</a></li>' +
'    <li><a href="#todos">To-Dos</a></li>' +
'    <li><a href="#time_report">Time</a></li>' +
'    <li><a href="#people">People</a></li>' +
'</ul>' +
'<ul class="nav pull-right">' +
'    <li>' +
'        <a href="#me" title="<%- view.model.get("user-name") %>" class="dropdown-toggle" data-toggle="dropdown"><%- view.model.name() %> <span class="caret"></span></a>' +
'        <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">' +
'            <li><a href="#me"><i class="icon-user"></i> My profile</a></li>' +
'            <li><a href="#todos"><i class="icon-tasks"></i> My todos</a></li>' +
'            <li><a href="#time_report"><i class="icon-time"></i> My time</a></li>' +
'            <li class="divider"></li>' +
'            <li><a href="/logout"><i class="icon-eject"></i> Logout</a></li>' +
'        </ul>' +
'    </li>' +
'</ul>' +
'<% } else { %>' +
'<ul class="nav pull-right">' +
'    <li>' +
'        <a href="/login" title="Login">Login</a>' +
'    </li>' +
'</ul>' +
'<% } %>' +
'\n';
return templates;
}));
