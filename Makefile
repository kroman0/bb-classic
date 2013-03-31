#!/usr/bin/make
#

.PHONY: run

run:
	bin/dev_appserver app --skip_sdk_update_check --high_replication --datastore_path=app.ds

test:	clean
	bin/pybot tests

backup:
	cp app.ds app.ds.backup

restore:
	cp app.ds.backup app.ds

deploy: clean minify
	bin/appcfg update app --oauth2

minify:
	uglifyjs app/static/js/json2.js -o app/static/js/json2.min.js
	uglifyjs app/static/js/jquery.deserialize.js -o app/static/js/jquery.deserialize-min.js
	uglifyjs app/static/js/backbone.analytics.js -o app/static/js/backbone.analytics-min.js
	uglifyjs app/static/js/general.js app/static/js/models.js app/static/js/collections.js app/static/js/views.js app/static/js/main.js -o app/static/js/main-min.js

jshint:
	jshint app/static/js/general.js app/static/js/models.js app/static/js/collections.js app/static/js/views.js app/static/js/main.js

clean:
	find . -name \*~ -exec rm {} \;
	rm -rf *.pyc robot_* selenium-screenshot-* output.xml log.html report.html

sauce:
	wget -q http://saucelabs.com/downloads/Sauce-Connect-latest.zip -O /tmp/Sauce-Connect-latest.zip
	unzip -p Sauce-Connect-latest.zip Sauce-Connect.jar >/tmp/Sauce-Connect.jar
	java -jar /tmp/Sauce-Connect.jar

bootstrap-update:
	wget -q http://twitter.github.com/bootstrap/assets/bootstrap.zip -O /tmp/bootstrap.zip
	unzip -p /tmp/bootstrap.zip bootstrap/css/bootstrap-responsive.css >app/static/css/bootstrap-responsive.css
	unzip -p /tmp/bootstrap.zip bootstrap/css/bootstrap-responsive.min.css >app/static/css/bootstrap-responsive.min.css
	unzip -p /tmp/bootstrap.zip bootstrap/css/bootstrap.css >app/static/css/bootstrap.css
	unzip -p /tmp/bootstrap.zip bootstrap/css/bootstrap.min.css >app/static/css/bootstrap.min.css
	unzip -p /tmp/bootstrap.zip bootstrap/img/glyphicons-halflings-white.png >app/static/img/glyphicons-halflings-white.png
	unzip -p /tmp/bootstrap.zip bootstrap/img/glyphicons-halflings.png >app/static/img/glyphicons-halflings.png
	unzip -p /tmp/bootstrap.zip bootstrap/js/bootstrap.js >app/static/js/bootstrap.js
	unzip -p /tmp/bootstrap.zip bootstrap/js/bootstrap.min.js >app/static/js/bootstrap.min.js

backbone-update:
	wget -q http://backbonejs.org/backbone.js -O app/static/js/backbone.js
	wget -q http://backbonejs.org/backbone-min.js -O app/static/js/backbone-min.js

underscore-update:
	wget -q http://underscorejs.org/underscore.js -O app/static/js/underscore.js
	wget -q http://underscorejs.org/underscore-min.js -O app/static/js/underscore-min.js
