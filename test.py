#!/usr/bin/env python
import robotsuite
import unittest


def test_suite():
    return unittest.TestSuite([
        robotsuite.RobotTestSuite('test.txt'),
    ])

if __name__ == '__main__':
    unittest.main(defaultTest='test_suite')
