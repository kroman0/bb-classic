from setuptools import setup, find_packages
import os

version = '0.1'

setup(name='bb-classic',
      version=version,
      description="Basecamp on Backbone, Twitter Bootstrap, GAE",
      long_description="",
      classifiers=[
        "Programming Language :: Python",
        "Topic :: Software Development :: Libraries :: Python Modules",
        ],
      keywords='basecamp api backbone gae python',
      author='Roman Kozlovskyi',
      author_email='krzroman@gmail.com',
      url='https://github.com/kroman0/bb-classic',
      license='GPL',
      packages=find_packages(exclude=['ez_setup']),
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          'robotframework-selenium2library',
          'google-appengine',
          # -*- Extra requirements: -*-
      ],
      entry_points="""
      # -*- Entry points: -*-
      """,
      )
