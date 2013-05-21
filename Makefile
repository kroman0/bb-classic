#!/usr/bin/make
#

all: run

run:
	bin/dev_appserver app --skip_sdk_update_check --datastore_path=app.ds

test:	clean
	bin/pybot -e screenshots tests

xtest:	clean
	xvfb-run bin/pybot -e screenshots tests

screenshots:
	bin/pybot -i screenshots tests/

xscreenshots:
	xvfb-run bin/pybot -i screenshots tests/

backup:
	cp app.ds app.ds.backup

restore:
	cp app.ds.backup app.ds

deploy: clean minify
	bin/appcfg update app --oauth2

minify:
	uglifyjs app/static/js/json2.js -o app/static/js/json2.min.js
	uglifyjs app/static/js/jquery.deserialize.js -o app/static/js/jquery.deserialize-min.js
	uglifyjs app/static/js/bootstrap-datepicker.js -o app/static/js/bootstrap-datepicker.min.js
	uglifyjs app/static/js/backbone.analytics.js -o app/static/js/backbone.analytics-min.js
	uglifyjs app/static/js/general.js -o app/static/js/general.min.js
	uglifyjs app/static/js/models.js -o app/static/js/models.min.js
	uglifyjs app/static/js/collections.js -o app/static/js/collections.min.js
	uglifyjs app/static/js/views.js -o app/static/js/views.min.js
	uglifyjs app/static/js/main.js -o app/static/js/main.min.js

jshint:
	jshint app/static/js/general.js app/static/js/models.js app/static/js/collections.js app/static/js/views.js app/static/js/main.js app/static/js/deps.js app/static/js/deps.min.js

jslint:
	jslint app/static/js/general.js app/static/js/models.js app/static/js/collections.js app/static/js/views.js app/static/js/main.js app/static/js/deps.js app/static/js/deps.min.js

clean:
	find . -name \*~ -exec rm {} \;
	find . -name \*.pyc -exec rm {} \;
	rm -rf robot_* selenium-screenshot-* output.xml log.html report.html

sauceget:
	wget http://saucelabs.com/downloads/Sauce-Connect-latest.zip -O /tmp/Sauce-Connect-latest.zip
	unzip -oj /tmp/Sauce-Connect-latest.zip Sauce-Connect.jar -d /tmp

sauceconnect: clean
	java -jar /tmp/Sauce-Connect.jar $(SAUCE_USERNAME) $(SAUCE_ACCESS_KEY)

sauce:	clean
	ROBOT_DESIRED_CAPABILITIES=platform:Windows ROBOT_BROWSER=internetexplorer ROBOT_REMOTE_URL=http://$(SAUCE_USERNAME):$(SAUCE_ACCESS_KEY)@ondemand.saucelabs.com:80/wd/hub bin/pybot -e screenshots tests

bootstrap-update:
	wget -q http://twitter.github.com/bootstrap/assets/bootstrap.zip -O /tmp/bootstrap.zip
	unzip -oj /tmp/bootstrap.zip bootstrap/css/* -d app/static/css/
	unzip -oj /tmp/bootstrap.zip bootstrap/img/* -d app/static/img/
	unzip -oj /tmp/bootstrap.zip bootstrap/js/* -d app/static/js/

bootstrap-datepicker-update:
	wget -q https://raw.github.com/eternicode/bootstrap-datepicker/master/js/bootstrap-datepicker.js -O app/static/js/bootstrap-datepicker.js
	wget -q https://raw.github.com/eternicode/bootstrap-datepicker/master/css/datepicker.css -O app/static/css/datepicker.css

backbone-update:
	wget -q http://backbonejs.org/backbone.js -O app/static/js/backbone.js
	wget -q http://backbonejs.org/backbone-min.js -O app/static/js/backbone-min.js

underscore-update:
	wget -q http://underscorejs.org/underscore.js -O app/static/js/underscore.js
	wget -q http://underscorejs.org/underscore-min.js -O app/static/js/underscore-min.js

backbone-pageable-update:
	wget -q https://raw.github.com/wyuenho/backbone-pageable/master/lib/backbone-pageable.js -O app/static/js/backbone-pageable.js
	wget -q https://raw.github.com/wyuenho/backbone-pageable/master/lib/backbone-pageable.min.js -O app/static/js/backbone-pageable.min.js

backbone-fetch-cache-update:
	wget -q https://raw.github.com/mrappleton/backbone-fetch-cache/master/backbone.fetch-cache.js -O app/static/js/backbone.fetch-cache.js
	wget -q https://raw.github.com/mrappleton/backbone-fetch-cache/master/backbone.fetch-cache.min.js -O app/static/js/backbone.fetch-cache.min.js

requirejs-update:
	wget -q http://requirejs.org/docs/release/2.1.6/comments/require.js -O app/static/js/require.js
	wget -q http://requirejs.org/docs/release/2.1.6/minified/require.js -O app/static/js/require.min.js

update-all: bootstrap-update bootstrap-datepicker-update backbone-update underscore-update backbone-pageable-update backbone-fetch-cache-update requirejs-update

pylint:
	pylint -f colorized --rcfile=.pylintrc -r n app/*.py tests/*.py

pylint-html:
	pylint -f html --rcfile=.pylintrc app/*.py tests/*.py >/tmp/pylint.html; firefox /tmp/pylint.html

pep8:
	pep8 app/ tests/

flake8:
	flake8 --max-complexity=10 app/ tests/

pyflakes:
	pyflakes app/*.py tests/*.py

pytest: pep8 pyflakes flake8 pylint

jstest: jshint jslint
