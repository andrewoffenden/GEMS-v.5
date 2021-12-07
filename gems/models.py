import os, datetime
from django.conf import settings
from django.db import models
from django.db.models import Q

from django.contrib.auth.models import User, Group


class SiteSetting(models.Model):
    setting_name = models.CharField(max_length=70)
    setting_value = models.CharField(max_length=70)

    def __str__(self):
        return self.setting_name

class HousingUnit(models.Model):
    name = models.CharField(max_length=25)

    def __str__(self):
        return "{name}".format_map({"name":self.name})

class Institution(models.Model):
    name = models.CharField(max_length=25)

    def __str__(self):
        return "{name}".format_map({"name":self.name})
        
class Student(models.Model):
    IDOC = models.CharField(max_length=6)
    first_name = models.CharField(max_length=35)
    last_name = models.CharField(max_length=35)
    institution = models.ForeignKey(Institution, on_delete=models.SET_NULL, null=True)
    housing_unit = models.ForeignKey(HousingUnit, on_delete=models.SET_NULL, null=True)
    entry_date = models.DateField('Date Entered',null=True)

    def __str__(self):
        return "Student: (#{IDOC}, {last_name}, {first_name})".format_map(
                    {"IDOC":self.IDOC,"last_name":self.last_name,"first_name":self.first_name})

    def get_absolute_url(self):
        from django.urls import reverse
        return "/students/%i/" % self.id
        # return reverse("/students/%i/", kwargs={"pk": self.pk})

    class Meta:
        constraints = [models.UniqueConstraint(fields=['IDOC',],name='unique_student'),]
        ordering = ("IDOC",)
    
class UserSetting(models.Model):
    def images_path():
            return os.path.join(settings.BASE_DIR,'gems/static/gems/img/avatar')

    def themes_path():
        return os.path.join(settings.BASE_DIR, 'gems/static/gems/css/themes')

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    theme = models.FilePathField(path=themes_path, null=True)
    avatar = models.FilePathField(path=images_path,null=True)
    
    def __str__(self):
        return "User: #{username}, {last_name}, {first_name}".format_map({
                    "username":self.user.username, "last_name":self.user.last_name, "first_name":self.user.first_name
        })

    def avatar_static_file(self):
           return '/'.join(self.avatar.split('/')[-4:])

    def theme_static_file(self):
        return '/'.join(self.theme.split('/')[-4:])

class UserTimesheet(models.Model):
    #TODO::error on weekend or message on 8 hrs +
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    timeInAM = models.TimeField()
    timeOutAM = models.TimeField()
    timeInPM = models.TimeField()
    timeOutPM = models.TimeField()
    entryDate = models.DateField()

    class Meta:
        ordering = ["entryDate"]
        constraints = [models.UniqueConstraint(fields=['user','entryDate'],name='unique_user_timesheet_entry'),]
        verbose_name = ("Employee Timesheet Record")
        verbose_name_plural = ("Employee Timesheet Records")

    def __str__(self):
        return "{username} Timesheet entry for the Date: {entryDate}".format_map(
                        {"username":self.user.username,"entryDate":self.entryDate.isoformat()})

class JobTitle(models.Model):
    jobTitle = models.CharField(max_length=35)

    def __str__(self):
        return self.jobTitle

class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    jobTitle = models.ForeignKey(JobTitle, null=True, on_delete=models.SET_NULL)
    payRate = models.FloatField()

    class Meta:
        permissions = [('can_view_admin_panel','Can view the admin panel')]

    def __str__(self):
        return "Employee: (#{IDOC}, {last_name}, {jobTitle})".format_map(
                    {"IDOC":self.user.username,"last_name":self.user.last_name,"jobTitle":self.jobTitle.jobTitle})

class Test(models.Model):
    name = models.CharField(max_length=75)
    passing_score = models.CharField(max_length=25)
    active = models.BooleanField('Test active?',default=False)
    certificate = models.BooleanField('Test has a certificate',default=False)

    def __str__(self):
        return "Test: {name}".format_map({"name":self.name})

class TestHistory(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE,null=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    test_score = models.CharField(max_length=25)
    test_date = models.DateField('Date tested',null=True)
    cert_printed  = models.BooleanField('Certificate printed?', default=False)

    def __str__(self):
        return " Test record: {student}, {test}.".format_map(
                        {"student":self.student.__str__(),"test":self.test.name}) 
    class Meta:
        verbose_name = ("Test History Record")
        verbose_name_plural = ("Test History Records")

class Subject(models.Model):
    name = models.CharField(max_length=75)

    class Meta:
        ordering = ("name",)

    def __str__(self):
        return self.name

class Classroom(models.Model):
    room_number = models.IntegerField()

    def __str__(self):
        return "Room: {}".format(self.room_number)

class Teacher(models.Model):
    name = models.CharField(max_length=75)

    def __str__(self):
        return self.name
    
class Day(models.Model):
    day = models.CharField(max_length=25)
    abbreviated = models.CharField(max_length=5,null=True )

    def __str__(self):
        return self.day

class Hour(models.Model):
    hour = models.TimeField()

    def __str__(self):
        return self.hour.isoformat()

class Class(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True)
    classroom = models.ForeignKey(Classroom, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return "{subject},  {teacher},  {classroom}".format_map({
                     "subject":self.subject,"teacher":self.teacher,"classroom":self.classroom})
    
    class Meta:
        verbose_name = ("Class")
        verbose_name_plural = ("Classes")

class ClassTimeslot(models.Model):
    """
        Scheduling of a class to a given timeslot:

        This model represents a timeslot during which a class will be conducted.  Students are
        therefore not assigned to a class timeslot but rather when enrolled they are \n
        associated with a given class timeslot on  a given day in an enrollment record.  
        The class timeslot is therefore a reservation in time only.
    """
    class_name = models.ForeignKey(Class, on_delete=models.CASCADE)
    hour = models.ForeignKey(Hour, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return "{class_name}, [{hour}]".format_map({
                    "class_name":self.class_name, "hour":self.hour })
    
    class Meta:
        verbose_name = ("Class Timeslot")
        verbose_name_plural = ("Class Timeslots")
        constraints = [models.UniqueConstraint(fields=['class_name','hour'],name='unique_class_timeslot'),]
        ordering = ("class_name","hour")

class Enrollment(models.Model):
    """
        Record of enrollment of a class timeslot on a given day:

        This model assigns an actual day , and a student to a class timeslot.  
        It represents the final element in scheduling a student for a class.  It is \n
        used throughout gems for validation in attendance taking.  Therefore if an 
        enrollment record is deleted a student will not be able to scan attendance \n
        for a given class, day, and time.
    """
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    class_timeslot = models.ForeignKey(ClassTimeslot, on_delete=models.CASCADE)
    day = models.ForeignKey(Day, on_delete=models.SET_NULL, null=True)
    enrollment_date = models.DateField("Enrollment Date")

    def __str__(self):
        return "Enrollment record: {class_timeslot} for Student: #{IDOC}, {last_name},{first_name} on {day}s".format_map({
                    "class_timeslot":self.class_timeslot, "IDOC": self.student.IDOC, "day":self.day,
                    "last_name":self.student.last_name, "first_name":self.student.first_name
        })
    
    class Meta:
        verbose_name = ("Student Enrollment Record")
        verbose_name_plural = ("Student Enrollment Records")
        constraints = [models.UniqueConstraint(fields=['student','day','class_timeslot'],name='unique_enrollment_record'),]
        ordering = ("student__last_name","class_timeslot__class_name","day",)

class Attendance(models.Model):
    """
        Records of student attendance:

        These are intended to be a record of a student attending an enrolled subject, at a class with a certain teacher. \n
        Most fields are not, therefore, a foreign key as these are not intended to be dynamic but a static record.  \n
        It is recommended not to attempt adding an attendance record in the django admin site,  but instead, \n 
        use the gems interface as this will ensure that all associated reports will function correctly. \n\n

            The enrollment field is used to validate that a student is enrolled in a class.  It is therefore \n
            possible that a student will have a null enrollment field if they are no longer enrolled in a class \n
            All other fields, with the exception of the student field, serve as a record of attendance.
    """
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    enrollment = models.ForeignKey(Enrollment, on_delete=models.SET_NULL, null=True)
    
    scan_date = models.DateField(null=True)
    scan_time = models.TimeField(null=True)
    location = models.CharField(max_length=75)
    subject = models.CharField(max_length=75)
    teacher = models.CharField(max_length=25)
    hour = models.CharField(max_length=12)
    day = models.CharField(max_length=12)

    def __str__(self):
        return "[{student} attended {class} on {scan_date} at {scan_time}]".format_map({
                    "student":self.student.__str__(),
                    "class":self.subject + " room " + self.location,
                    "scan_date":self.scan_date.isoformat(),
                    "scan_time":self.scan_time.isoformat(timespec="minutes"),
        })

    class Meta:
        verbose_name = ("Student Attendance Record")
        verbose_name_plural = ("Student Attendance Records")
        constraints = [models.UniqueConstraint(fields=['enrollment','scan_date'],name='unique_attendance_record'),]
        ordering = ("-scan_date","-scan_time")

class ItemCategory(models.Model):
    name = models.CharField(max_length = 45)

    def __str__(self):
        return "Item Category {name}".format_map({
            "name":self.name,
        })

    class Meta:
        verbose_name = ("Item Category")
        verbose_name_plural = ("Item Categories")
        
class EducationalAsset(models.Model):
    """
    ClassroomAsset superclass:

    General categories that are applicable to books and electronics/inventory items. \n
    Done for compatability with legacy database, subclasses added for additional data \n
    for all future records.
    """

    CHECKED_IN, CHECKED_OUT, OVERDUE = (0,1,2)

    name = models.CharField(max_length=125)
    barcode = models.CharField(max_length=8)
    notes = models.TextField(null=True)
    description = models.TextField(null=True)
    permit_checkout = models.BooleanField()
    classroom = models.ForeignKey(Classroom, on_delete=models.SET_NULL, null=True)
    entry_date = models.DateField(auto_now_add=True)
    entered_by = models.CharField(max_length=8,null=True)
    modified_date = models.DateField(null=True)
    modified_by = models.CharField(max_length=8,null=True)
    checkout_duration = models.IntegerField(null=True, default=14)
    checked_in = models.BooleanField(default=True)

    def get_checkout_status(self, verbose=False):
        """
        Reference item checkout table to determine checkout status dynamically.
        Default returns 0, 1, 2 for checked_in, checked_out, overdue, 
        or a more user friendly string if verbose.
        """
        today = datetime.date.today()

        if self.__class__ == Book:
            #iterate through associated checkout records
            results = BookCheckout.objects.filter(asset=self)
            
            for result in results:
                if self.checked_in == 1:
                    continue
                elif self.checked_in == 0 and today <= result.due_date:
                    return "checked-out" if verbose else 1
                else:
                    return "overdue" if verbose else 2

            return "checked-in" if verbose else 0

        elif self.__class__ == Item:
            results = ItemCheckout.objects.filter(asset=self)

            for result in results:
                if self.checked_in == 1:
                    continue
                elif self.checked_in == 0 and today <= result.due_date:
                    return "checked-out" if verbose else 1
                else:
                    return "overdue" if verbose else 2

            return "checked-in" if verbose else 0
           
        else:
            return "Invalid Category"

    def get_asset_category(self):
        """
            convenience function to return a human readable string
            representation of a class name
        """
        if self.__class__ == Book:
            return "Book"
        elif self.__class__ == Item:
            return "Item"
        else:
            return "invalid category"

    def __str__(self):
        return "Asset: {name} Barcode: {barcode}".format_map({
            "name":self.name,
            "barcode":self.barcode,
        })
    
    class Meta:
        abstract = True
        ordering = ("barcode",)
        
class Book(EducationalAsset):
    author = models.CharField(max_length=45,null=True)
    isbn = models.CharField(max_length=45,null=True)
    publisher = models.CharField(max_length=45,null=True)
    #TODO::create copies annotation in view

    class Meta(EducationalAsset.Meta):
        verbose_name = ("Book Record")
        verbose_name_plural = ("Book Records")
        constraints = [models.UniqueConstraint(fields=['barcode'], name='unique_book_record'),]

class Item(EducationalAsset):
    model_number = models.CharField(max_length=45,null=True)
    serial_number = models.CharField(max_length=45,null=True)
    #TODO::create total number annotation in view
    manufacturer = models.CharField(max_length=45,null=True)
    category = models.ForeignKey(ItemCategory, on_delete=models.SET_NULL, null=True)

    class Meta(EducationalAsset.Meta):
        verbose_name = ("Item Record")
        verbose_name_plural = ("Item Records")
        constraints = [models.UniqueConstraint(fields=['barcode'], name='unique_item_record'),]

class EducationalAssetCheckout(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    checkout_by = models.CharField(max_length=12)
    checkout_date = models.DateField()
    checkin_by = models.CharField(max_length=12, null=True)
    checkin_date = models.DateField(null=True)
    due_date = models.DateField()

    class Meta:
        abstract = True
        ordering = ['-checkout_date',]

class BookCheckout(EducationalAssetCheckout):
    asset = models.ForeignKey(Book, on_delete=models.CASCADE)

    def __str__(self):
            return "Asset: {name} [{barcode}], to {student}".format_map({
            "name":self.asset.name,
            "barcode":self.asset.barcode,
            "student":self.student.IDOC,
        })

    class Meta(EducationalAssetCheckout.Meta):
        verbose_name = ("Book Checkout Record")
        verbose_name_plural = ("Book Checkout Records")

class ItemCheckout(EducationalAssetCheckout):
    asset = models.ForeignKey(Item, on_delete=models.CASCADE)

    def __str__(self):
            return "Asset: {name} [{barcode}], to {student}".format_map({
            "name":self.asset.name,
            "barcode":self.asset.barcode,
            "student":self.student.IDOC,
        })

    class Meta(EducationalAssetCheckout.Meta):
        verbose_name = ("Item Checkout Record")
        verbose_name_plural = ("Item Checkout Records")

class InstructorComment(models.Model):
    """
        Instructor Comments:

        These are intended as a method of fostering continuity in our management of students.  \n
        Given the nature of the original purpose of GEMS, in a correctional setting, additional logging measures  have been implemented. \n
        When a comment is deleted it's \"active\" flag is set to \"False\".  This prevents it from being viewed in the GEMS interface.  \n
        The comment still exists in the database and must be removed \n
        through the gems administrative panel.  This adds a layer of security and accountability.\n
            
            The modified_by and modified_date fields are intended for logging.  They are filled when the comment \n
            is deleted in the interface.  They log when and who attempted to remove the comment. \n
            The only way to completely remove the comments is through the administrative interfaces.
    """
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    active = models.BooleanField(default=True)
    modified_by = models.CharField(max_length=25, null=True)
    modified_date = models.DateField(null=True)
    entry_date = models.DateField(auto_now=True)

    def __str__(self):
        return "Instructor Comment:[ #{IDOC}, {instructor}, {date} ]".format_map({
                "IDOC":self.student.IDOC,
                "instructor": self.user.last_name,
                "date":self.entry_date.isoformat(),       
        })

    class Meta:
        ordering = ("entry_date",)
        permissions = [('can_view_instructor_comments','Can view the instructor comments section.')]
        verbose_name = ("Instructor Comment")
        verbose_name_plural = ("Instructor Comments")