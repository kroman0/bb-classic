"""
Keywords for tests
==================

"""
from PIL.Image import open as Iopen
from PIL.ImageChops import difference
from base64 import encodestring
from httplib import HTTPConnection
from itertools import imap
from json import dumps
from math import sqrt
from operator import add
from os import environ
from robot.api import logger
from robot.libraries.BuiltIn import BuiltIn


def _get_driver():
    """Get Selenium2Library driver

    :returns: Selenium2Library driver
    :rtype: instance
    """
    return BuiltIn().get_library_instance('Selenium2Library')


def _get_browser():
    """Get current browser

    :returns: current browser
    :rtype: instance
    """
    return getattr(_get_driver(), '_current_browser')()


def _get_screenshot():
    """Get screenshot path

    :returns: path to screenshot
    :rtype: string
    """
    return getattr(_get_driver(), '_get_screenshot_paths')(None)[0]


def compare_screenshot_to_base(baseline, diff=100):
    """Calculate the exact difference between two images.

    :param string baseline: [required] base screenshot to compare
    :param int diff: value of maximum difference

    Example::

        Compare screenshot to base  base_screenshot.jpg

    """
    path = _get_screenshot()

    current_browser = _get_browser()

    if hasattr(current_browser, 'get_screenshot_as_file'):
        current_browser.get_screenshot_as_file(path)
    else:
        current_browser.save_screenshot(path)

    img1 = Iopen(path)
    img2 = Iopen(baseline)
    his1 = img1.histogram()
    his2 = img2.histogram()
    sqrtdiff = lambda a, b: (a - b) ** 2
    rms = sqrt(reduce(add, imap(sqrtdiff, his1, his2)) / len(his1))
    logger.info("RMS diff: %s" % rms)
    if rms > 0:
        idiff = difference(img1, img2)
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
    username = environ.get('SAUCE_USERNAME')
    access_key = environ.get('SAUCE_ACCESS_KEY')

    if not job_id:
        return u"No Sauce job id found. Skipping..."
    elif not username or not access_key:
        return u"No Sauce environment variables found. Skipping..."

    token = encodestring('%s:%s' % (username, access_key))[:-1]
    body = dumps({'passed': test_status == 'PASS'})

    connection = HTTPConnection('saucelabs.com')
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
    return _get_browser().set_window_size(int(width), int(height))


def get_session_id():
    """Get session id

    :returns: session id
    :rtype: string

    Example::

        ${SESSION_ID} =  Get Session Id

    """
    try:
        session_id = _get_browser().session_id
    except AttributeError:
        session_id = ""
    return session_id
