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
	wget http://saucelabs.com/downloads/Sauce-Connect-latest.zip
	unzip Sauce-Connect-latest.zip
	java -jar Sauce-Connect.jar