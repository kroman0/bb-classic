[![Build Status](https://travis-ci.org/kroman0/bb-classic.png?branch=master)](https://travis-ci.org/kroman0/bb-classic)
[![Sauce Status](https://saucelabs.com/buildstatus/kroman0)](https://saucelabs.com/u/kroman0)
BB Classic
==========

Basecamp on Backbone, Twitter Bootstrap, GAE

Installation
------------

- Clone repo `git clone git://github.com/kroman0/bb-classic.git`
- Bootstrap buildout `python bootstrap.py`
- Build buildout `bin/buildout`
- Run application `make`
- Open [url](http://localhost:8080/) in browser

- - -

Development
-----------

- Backup `make backup`
- Restore `make restory`
- Minify javascript `make minify`
- JShint `make jshint`
- Testing `make test`
- Update bootstrap `make bootstrap-update`
- Update backbone.js `make backbone-update`
- Update underscore.js `make underscore-update`

- - -

Updating GAE application
------------------------

- Deploy `make deploy`

- - -
