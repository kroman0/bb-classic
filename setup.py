import sys
import os
from setuptools import setup, find_packages

version = '0.1'
test_require = [
    'robotsuite',
    'robotframework-selenium2library',
    'decorator',
    'selenium',
]

setup(name='bb-classic',
      version=version,
      description="Basecamp classic GAE application",
      long_description="",
      classifiers=[
          "Programming Language :: Python",
      ],
      keywords='basecamp classic python backbone',
      author='Roman Kozlovskyi',
      author_email='krzoman@gmail.com',
      url='https://github.com/kroman0/bb-classic',
      license='GPL',
      include_package_data=True,
      zip_safe=False,
      install_requires=[
      ],
      entry_points={
      },
      test_suite="test.test_suite",
      tests_require=test_require,
      )
