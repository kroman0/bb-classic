#!/usr/bin/env python
from PIL import Image
from PIL import ImageChops
import math
import operator
from robot.libraries.BuiltIn import BuiltIn
from robot.api import logger


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
