"""
Keywords for tests
==================

"""
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


def compare_screenshot_to_base(baseline, diff=100):
    """Calculate the exact difference between two images.

    :param string baseline: [required] base screenshot to compare
    :param int diff: value of maximum difference

    Example::

        Compare screenshot to base  base_screenshot.jpg

    """
    driver = BuiltIn().get_library_instance('Selenium2Library')
    # pylint: disable=W0212
    path = driver._get_screenshot_paths(None)[0]

    current_browser = driver._current_browser()

    if hasattr(current_browser, 'get_screenshot_as_file'):
        current_browser.get_screenshot_as_file(path)
    else:
        current_browser.save_screenshot(path)

    img1 = Image.open(path)
    img2 = Image.open(baseline)
    his1 = img1.histogram()
    his2 = img2.histogram()
    sqrtdiff = lambda a, b: (a - b) ** 2
    # pylint: disable=W0141
    rms = math.sqrt(
        reduce(operator.add,
               map(sqrtdiff, his1, his2)
               ) / len(his1))
    logger.info("RMS diff: %s" % rms)
    if rms > 0:
        idiff = ImageChops.difference(img1, img2)
        path = path.replace(".png", ".jpg")
        idiff.save(path)
        logger.info("diff image: %s" % path)
    if rms > diff:
        raise AssertionError(
            "Image: %s is different from baseline: %s" % (path, baseline))


def report_sauce_status(job_id, test_status):
    """Report test status to Sauce service

    :param string job_id: [required] saucelabs job id
    :param string test_status: [required] status of test
    :returns: request status code
    :rtype: int or string

    Example::

        Report sauce status  ${SESSION_ID}  ${TEST_STATUS}

    """
    username = os.environ.get('SAUCE_USERNAME')
    access_key = os.environ.get('SAUCE_ACCESS_KEY')

    if not job_id:
        return u"No Sauce job id found. Skipping..."
    elif not username or not access_key:
        return u"No Sauce environment variables found. Skipping..."

    token = base64.encodestring('%s:%s' % (username, access_key))[:-1]
    body = json.dumps({'passed': test_status == 'PASS'})

    connection = httplib.HTTPConnection('saucelabs.com')
    connection.request('PUT', '/rest/v1/%s/jobs/%s' % (
        username, job_id), body,
        headers={'Authorization': 'Basic %s' % token}
    )

    return connection.getresponse().status


def set_window_size(width, height):
    """Sets the `width` and `height` of the current window to the specified
    values.

    :param string|int width: [required] window width
    :param string|int height: [required] window height

    Example::

        Set Window Size  ${800}  ${600}

    """
    driver = BuiltIn().get_library_instance('Selenium2Library')
    # pylint: disable=W0212
    return driver._current_browser().set_window_size(int(width), int(height))


def get_session_id():
    """Get session id

    :returns: session id
    :rtype: string

    Example::

        ${SESSION_ID} =  Get Session Id

    """
    driver = BuiltIn().get_library_instance('Selenium2Library')
    try:
        # pylint: disable=W0212
        session_id = driver._cache.current.session_id
    except AttributeError:
        session_id = ""
    return session_id
