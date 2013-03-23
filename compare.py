#!/usr/bin/env python
from PIL import Image
from PIL import ImageChops
import math
import operator
from robot.libraries.BuiltIn import BuiltIn
from robot.api import logger
import base64
import httplib
import os
import json

try:
    # Inject keyword for getting the selenium session id
    import Selenium2Library
    Selenium2Library.keywords._browsermanagement.\
        _BrowserManagementKeywords.get_session_id = lambda self:\
        self._cache.current.session_id
except ImportError:
    pass

def compare_screenshot_to_base(baseline, diff=100):
    """
    Calculate the exact difference between two images.
    """
    driver = BuiltIn().get_library_instance('Selenium2Library')
    path, link = driver._get_screenshot_paths(None)

    if hasattr(driver._current_browser(), 'get_screenshot_as_file'):
        driver._current_browser().get_screenshot_as_file(path)
    else:
        driver._current_browser().save_screenshot(path)

    i1 = Image.open(path)
    i2 = Image.open(baseline)
    h1 = i1.histogram()
    h2 = i2.histogram()
    rms = math.sqrt(
        reduce(operator.add,
                map(lambda a, b: (a - b) ** 2, h1, h2)
                ) / len(h1))
    logger.info("RMS diff: %s" % rms)
    if rms > 0:
        d = ImageChops.difference(i1, i2)
        path = path.replace(".png", ".jpg")
        d.save(path)
        logger.info("diff image: %s" % path)
    if rms > diff:
        raise AssertionError(
            "Image: %s is different from baseline: %s" % (path, baseline))

def report_sauce_status(job_id, test_status, test_tags=[]):
    username = os.environ.get('SAUCE_USERNAME')
    access_key = os.environ.get('SAUCE_ACCESS_KEY')

    if not job_id:
        return u"No Sauce job id found. Skipping..."
    elif not username or not access_key:
        return u"No Sauce environment variables found. Skipping..."

    token = base64.encodestring('%s:%s' % (username, access_key))[:-1]
    body = json.dumps({'passed': test_status == 'PASS',
                        'tags': test_tags})

    connection = httplib.HTTPConnection('saucelabs.com')
    connection.request('PUT', '/rest/v1/%s/jobs/%s' % (
        username, job_id), body,
        headers={'Authorization': 'Basic %s' % token}
    )

    return connection.getresponse().status

def set_window_size(width, height):
    """Sets the `width` and `height` of the current window to the specified values.

    Example:
    | Set Window Size | ${800} | ${600} |
    | ${width} | ${height}= | Get Window Size |
    | Should Be Equal | ${width} | ${800} |
    | Should Be Equal | ${height} | ${600} |
    """
    driver = BuiltIn().get_library_instance('Selenium2Library')
    return driver._current_browser().set_window_size(width, height)
