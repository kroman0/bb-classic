from PIL import Image
from PIL import ImageChops
import math, operator
from robot.libraries.BuiltIn import BuiltIn
from robot.api import logger


class Compare(object):
    def __init__(self):
        self._driver = BuiltIn().get_library_instance('Selenium2Library')

    def compare_screenshot_to_base(self, baseline, diff=100):
        """
        Calculate the exact difference between two images.
        """
        path, link = self._driver._get_screenshot_paths(None)

        if hasattr(self._driver._current_browser(), 'get_screenshot_as_file'):
            self._driver._current_browser().get_screenshot_as_file(path)
        else:
            self._driver._current_browser().save_screenshot(path)

        i1 = Image.open(path)
        i2 = Image.open(baseline)
        h1 = i1.histogram()
        h2 = i2.histogram()
        rms = math.sqrt(reduce(operator.add, map(lambda a,b: (a-b)**2, h1, h2))/len(h1))
        logger.info("RMS diff: %s"%rms)
        if rms>0:
            d = ImageChops.difference(i1,i2)
            dpath, link = self._driver._get_screenshot_paths(None)
            d.save(dpath)
            logger.info("diff image: %s"%dpath)
        if rms>diff:
            raise AssertionError("Image: %s is different from baseline: %s" % (path, baseline))