from django.test import TestCase

from gems.models import *


class ContactHoursViewTests(TestCase):

    def test_no_contact_hours(self):
        """
            If a student did not scan for a given class for a given hour does the report indicate no contact hours.
        """
        #create a bogus student

        #enroll that student

        #run report test context

        pass

    #if a student scans in 'hour A'  does his contact hour only increase in 'hour A', and not any other hour.

    #if a student scans in multiple hours on a given day in multiple classes does the class specific report show only increases in that class.

    #if a student scans in multiple hours on a given day in multiple classes does the all classes report show increases in appropriate hours.


#attendance scan view tests:
    #if a student did scan once in a given range of dates, do they not appear in the attendance scan report

    #if a student did not scan in a given range of dates, do they appear on the attendance scan report

    #if a student did scan, but not in the given range of dates do they appear on the attendance scan report



