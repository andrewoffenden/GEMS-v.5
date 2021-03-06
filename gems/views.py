import json, datetime, os, csv

from django.shortcuts import get_object_or_404, get_list_or_404, render
from django.http import JsonResponse, HttpResponse, Http404
from django.views import View
from django.views.generic.base import TemplateView
from django.contrib import auth
from django.utils import timezone

from django.contrib.auth.models import User, Group
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib.auth.hashers import make_password
from django.template.response import TemplateResponse

from django.db.models import F, Q, When
from django.db import IntegrityError

from gems.models import *


"""
   GemsReq view classes take a json string of parameters.  These are processed by python's json.loads into a python dictionary.
"""

class index(View):
        site_name = SiteSetting.objects.get(setting_name='site_name').setting_value
        context = {
                'site_name':site_name,
        }

        def dispatch(self, request):
                return render(request, 'gems/index.html', self.context)

class GemsReqJobTitleSelect(View):
        def get(self, request):
                job_titles = get_list_or_404(JobTitle)
                data = [{"jobTitle": entry.jobTitle} for entry in job_titles]

                return JsonResponse(data, safe=False)

class GemsReqClassSelect(View):
        def get(self, reqeust):
                results = get_list_or_404(Class)
                data = [{"id": result.id,"name":result.__str__()} for result in results]

                return JsonResponse(data, safe=False)
                
class GemsReqClassroomSelect(View):
        def get(self, reqeust):
                results = get_list_or_404(Classroom)
                data = [{"id": result.id,"name":result.__str__()} for result in results]

                return JsonResponse(data, safe=False)

class GemsReqClassroomHourDaySelect(View):
        def get(self, request):
                data = {}

                results = get_list_or_404(Classroom)
                data["classroom"] = [{"id": result.id,"name":result.__str__()} for result in results]

                results = get_list_or_404(Hour)
                data["hour"] = [{"id": result.id,"name":result.__str__()} for result in results]

                results = get_list_or_404(Day)
                data["day"] = [{"id": result.id,"name":result.__str__()} for result in results]

                return JsonResponse(data, safe=False)

class GemsReqAddClassSelect(View):
        def get(self, request):
                data = {}
                results = get_list_or_404(Subject)
                data["subjects"] = [{"id":result.id,"subject":result.name} for result in results]
                results = get_list_or_404(Teacher)
                data["teachers"] = [{"id":result.id,"teacher":result.name} for result in results]
                results = get_list_or_404(Classroom)
                data["classrooms"] = [{"id":result.id,"classroom":result.room_number} for result in results]

                return JsonResponse(data,safe=False)

class GemsReqAddStudentSelect(View):
        def get(self, request):
                data = {}
                results = get_list_or_404(Institution)
                data["institution"] = [{"id":result.id, "name":result.name} for result in results]
                results = get_list_or_404(HousingUnit)
                data["housing_unit"] = [{"id":result.id, "name":result.name} for result in results]

                return JsonResponse(data, safe=False)

class GemsReqThemeSelect(View):
        def get(self, request):
                path = UserSetting.themes_path()
                themes = os.scandir(path)
                data = [{"theme":entry.name,"path":entry.path} for entry in themes]

                return JsonResponse(data, safe=False)

class GemsReqAvatarSelect(View):
        def get(self, request):
                path = UserSetting.images_path()
                avatars = os.scandir(path)
                data = [{"avatar":entry.name,"path":entry.path} for entry in avatars]

                return JsonResponse(data, safe=False)

class GemsReqEnrollmentRecordSelect(View):
        def get(self, request):
                data = {}
                results = get_list_or_404(Class)
                data["class"] = [{"id":result.id, "name":result.__str__()} for result in results]
                results = get_list_or_404(Day)
                data["day"] = [{"id":result.id, "name":result.day} for result in results]
                results = get_list_or_404(Hour)
                data["hour"] = [{"id":result.id, "name":result.hour.isoformat(timespec="minutes")} for result in results]

                return JsonResponse(data, safe=False)

class GemsReqTestRecordSelect(View):
        def get(self, request):
                data = {}
                results = get_list_or_404(Test)
                data["test"] = [{"id": result.id, "name":result.__str__()} for result in results]

                return JsonResponse(data, safe=False)

class GemsReqManualAttendanceSelect(View):
        def get(self, request):
                data = {}
                results = get_list_or_404(Class)
                data["class"] = [{"id":result.id, "name":result.__str__()} for result in results]
                results = get_list_or_404(Day)
                data["day"] = [{"id":result.id, "name":result.day} for result in results]

                return JsonResponse(data, safe=False) 

class GemsReqStudentSearch(View):
        def get(self, request, jsonstr):
                search_str = json.loads(jsonstr).get("search_str")
                result = get_list_or_404(Student, Q(IDOC__startswith=search_str) | Q(last_name__startswith=search_str))
                data = [{ "IDOC":x.IDOC,"last_name":x.last_name, "first_name":x.first_name, "housing_unit":x.housing_unit.name, 
                        "institution":x.institution.name, "entry_date":x.entry_date} for x in result]
                
                return JsonResponse(data, safe=False)

class GemsReqBookSearch(View):
        def get(self, request, jsonstr):
                search_str = json.loads(jsonstr)
                
                search = search_str.get("search")
                classroom = search_str.get("classroom_select")

                data = {}
                
                if classroom == "All":
                    results = get_list_or_404(Book,
                                    Q(barcode__startswith=search) |
                                    Q(name__contains=search) |
                                    Q(author__contains=search)
                    )
                else:
                     results = Book.objects.filter(
                                    Q(barcode__startswith=search) |
                                    Q(name__contains=search) |
                                    Q(author__contains=search) 
                    ).filter(classroom=classroom)

                data["search_results"] = [{
                        "id": result.id,
                        "barcode":result.barcode,
                        "name":result.name,
                        "author":result.author,
                        "classroom":result.classroom.room_number,
                        "status": result.get_checkout_status(verbose=True),
                } for result in results]

                return JsonResponse(data, safe=False)

class GemsReqItemSearch(View):
         def get(self, request, jsonstr):
                search_str = json.loads(jsonstr)
                
                search = search_str.get("search")
                classroom = search_str.get("classroom_select")

                data = {}

                if classroom == "All":
                        results = get_list_or_404(Item,
                                        Q(barcode__startswith=search) |
                                        Q(name__contains=search) 
                        )
                else:
                     results = Item.objects.filter(
                                    Q(barcode__startswith=search) |
                                    Q(name__contains=search) 
                    ).filter(classroom=classroom)

                data["search_results"] = [{
                        "id":result.id,
                        "barcode":result.barcode,
                        "name":result.name,
                        "category":result.category.name,
                        "classroom":result.classroom.room_number,
                        "status": result.get_checkout_status(verbose=True),
                } for result in results]
                        
                return JsonResponse(data, safe=False)

class GemsUserSearch(View):
        def get(self, request, jsonstr):
                search_str = json.loads(jsonstr).get("search_str")
                results = get_list_or_404(User, Q(username__startswith=search_str) | Q(last_name__startswith=search_str))
                data = [{
                        "username":result.username, "last_name":result.last_name, "first_name":result.first_name,
                        "jobTitle":result.employee.jobTitle.jobTitle, "payRate":result.employee.payRate, "date_joined":result.date_joined.date().isoformat()
                } for result in results]

                return JsonResponse(data, safe=False)

class GemsReqEditUserSearch(GemsUserSearch):
        pass

class GemsReqDelUserSearch(GemsUserSearch):
        pass

class GemsReqResetPasswordSearch(GemsUserSearch):
        pass

class GemsReqEditStudentSearch(GemsUserSearch):
        def get(self,request, jsonstr):
                search_str = json.loads(jsonstr).get("search_str")
                results = get_list_or_404(Student, Q(IDOC__startswith=search_str) | Q(last_name__startswith=search_str))
                data = [{
                        "IDOC":result.IDOC, "last_name":result.last_name, "first_name":result.first_name,
                        "institution":result.institution.name, "housing_unit":result.housing_unit.name, "entry_date":result.entry_date.isoformat()
                } for result in results]

                return JsonResponse(data, safe=False) 

class GemsReqDelStudentSearch(GemsUserSearch):
         def get(self,request, jsonstr):
                search_str = json.loads(jsonstr).get("search_str")
                results = get_list_or_404(Student, Q(IDOC__startswith=search_str) | Q(last_name__startswith=search_str))
                data = [{
                        "IDOC":result.IDOC, "last_name":result.last_name, "first_name":result.first_name,
                        "institution":result.institution.name, "housing_unit":result.housing_unit.name, "entry_date":result.entry_date.isoformat()
                } for result in results]

                return JsonResponse(data, safe=False) 

class GemsReqDisplayStudent(View):
        def post(self, request):
                idoc = json.loads(request.body.decode()).get("IDOC")
                results = get_object_or_404(Student, IDOC=idoc)
                data = [{
                        "IDOC":results.IDOC, "last_name":results.last_name,
                        "first_name":results.first_name, "institution":results.institution.name,
                        "housing_unit":results.housing_unit.name, "entry_date": results.entry_date,
                        "id":results.id
                }]
                return JsonResponse(data, safe=False)

class GemsReqClassInformation(View):
        def get(self, request, jsonstr):
                search_str = json.loads(jsonstr)
                
                try:
                        student_id = search_str.get("student_id")

                        #get set of all class_timeslots for students enrollment records
                        class_timeslots = {enrollment.class_timeslot for enrollment in get_list_or_404(Enrollment,student__id=student_id)}

                        #iterate through timeslots and collect days
                        data = [{
                                "student_id":student_id,
                                "class_timeslot_id":class_timeslot.id,
                                "subject":class_timeslot.class_name.subject.name, 
                                "teacher": class_timeslot.class_name.teacher.name,
                                "classroom": class_timeslot.class_name.classroom.room_number, 
                                "hour": class_timeslot.hour.hour.isoformat(),
                                "day": [enrollment.day.day for enrollment in class_timeslot.enrollment_set.filter(student=student_id)],
                        } for class_timeslot in class_timeslots]

                        return JsonResponse(data, safe=False)

                except Http404:
                        return JsonResponse([{"result": 1}], safe=False)

class GemsReqAddEnrollmentRecord(View):
        def post(self, request):
                search_str = json.loads(request.body.decode())

                #TODO::  students should not be able to enroll in two different classes for the same hour, fix this.
                try:
                        student = Student.objects.get(pk=search_str.get("student_id"))
                        class_timeslot= ClassTimeslot.objects.get(class_name__id=search_str.get("class"),hour_id=search_str.get("hour"))
                        enrollment_date = datetime.datetime.now()

                        day_data = search_str.get("day")
                        days = [Day.objects.get(id=day) for day in day_data if day_data.get(day) == 'True'] 
                        

                        for day in days:
                                enrollment_record = Enrollment(
                                        student=student,
                                        class_timeslot=class_timeslot,
                                        day=day,
                                        enrollment_date=enrollment_date,
                                )
                                enrollment_record.save()

                except Http404:
                        return JsonResponse({"result": 1})

                return JsonResponse({"result":0})

class GemsReqEditEnrollmentRecord(View):
        def post(self, request):
                search_str = json.loads(request.body.decode())

                #TODO::  students should not be able to enroll in two different classes for the same hour, fix this.
                try:
                        student = Student.objects.get(pk=search_str.get("student_id"))
                        class_timeslot= ClassTimeslot.objects.get(class_name__id=search_str.get("class"),hour_id=search_str.get("hour"))
                        enrollment_date = datetime.datetime.now()

                        day_data = search_str.get("day")

                except Http404:
                        return JsonResponse({"result": 1})


                for  day_id,enroll in day_data.items():
                        try:
                                day = get_object_or_404(Day,id=day_id)

                        except Http404:
                                return JsonResponse({"result":1})

                        if enroll == 'True':
                                #create enrollment record
                                try:
                                        enrollment_record = Enrollment(
                                                student=student,
                                                class_timeslot=class_timeslot,
                                                day=day,
                                                enrollment_date=enrollment_date,
                                        )
                                        enrollment_record.save()

                                except IntegrityError:
                                        continue
                                

                        else:
                                #delete enrollment record if it exists
                                try:
                                        enrollment_record = get_object_or_404(
                                                Enrollment,
                                                student=student,
                                                class_timeslot=class_timeslot,
                                                day=day,
                                        )
                                        enrollment_record.delete()

                                except Http404:
                                        #if it doesn't exist do nothing
                                        continue


                
                return JsonResponse({"result":0})

class GemsReqDelEnrollmentRecord(View):
        def post(self, request):
                search_str = json.loads(request.body.decode())

                try:
                        student = get_object_or_404(Student, id=search_str.get("student_id"))
                        class_timeslot = get_object_or_404(ClassTimeslot, id=search_str.get("class_timeslot_id"))
                        enrollment_records = get_list_or_404(
                                Enrollment,
                                student=student,
                                class_timeslot=class_timeslot,
                        )

                except Http404:
                        return JsonResponse({"result":1})

                for enrollment in enrollment_records:
                        enrollment.delete()

                return JsonResponse([{"results":0}], safe=False)

class GemsReqTestHistory(View):
        def get(self, request, jsonstr):
                search_str = json.loads(jsonstr)

                student_id = search_str.get("student_id")

                try:
                        results = get_list_or_404(TestHistory, student__id=student_id)
                        data = [{
                                "id":result.id, "test":result.test.name, "test_score":result.test_score,
                                "cert_printed":result.cert_printed, "test_date":result.test_date.isoformat(),
                        } for result in results]

                        return JsonResponse(data, safe=False)   
                        
                except Http404:
                        return JsonResponse([{"result":1}], safe=False)

class GemsReqAddTestRecord(View):
        def post(self, request):
                results = json.loads(request.body.decode())

                student = Student.objects.get(pk=results.get("student_id"))
                test = Test.objects.get(pk=results.get("test"))
                test_score = results.get("test_score")
                test_date = datetime.date.fromisoformat(results.get("test_date"))
                cert_printed = results.get("cert_printed")

                test_history = TestHistory(
                        student=student, test=test,
                        test_score=test_score, test_date=test_date,
                        cert_printed=cert_printed,
                )
                test_history.save()

                return JsonResponse([{"results":"Test record successfully added!"}], safe=False)

class GemsReqEditTestRecord(View):
        def post(self, request):
                results = json.loads(request.body.decode())

                test = Test.objects.get(pk=results.get("test"))
                test_score = results.get("test_score")
                test_date = datetime.date.fromisoformat(results.get("test_date"))
                cert_printed = results.get("cert_printed")

                test_history = TestHistory.objects.get(pk=results.get("id"))
                test_history.test = test
                test_history.test_score = test_score
                test_history.test_date = test_date
                test_history.cert_printed = cert_printed

                test_history.save()

                return JsonResponse([{"results":"Test record successfully updated!"}], safe=False)

class GemsReqDelTestRecord(View):
        def post(self, request):
                results = json.loads(request.body.decode())

                test_history = TestHistory.objects.get(pk=results.get("id"))
                test_history.delete()

                return JsonResponse([{"results":"Record successfully deleted."}], safe=False)

class GemsReqItemHistory(View):
        def get(self, request, jsonstr):
                search_str = json.loads(jsonstr)

                student_id = search_str.get("student_id")

                try:
                        book_checkout = get_list_or_404(BookCheckout, student__id=student_id)

                except Http404:
                        book_checkout = []

                try:        
                        item_checkout = get_list_or_404(ItemCheckout, student__id=student_id)

                except Http404:
                        item_checkout = []

                results = book_checkout + item_checkout

                data = [{
                        "id":result.id, "name":result.asset.name, "category":result.asset.get_asset_category(),
                        "classroom":result.asset.classroom.room_number, "checkout_date":result.checkout_date.isoformat(),
                        "due_date":result.due_date.isoformat(), "barcode":result.asset.barcode,
                } for result in results if result.asset.checked_in == 0 and result.checkin_date == None]

                return JsonResponse(data, safe=False)  

class GemsReqCheckinEducationalAsset(View):
        def post(self,request):
                search_str = json.loads(request.body.decode())

                checkout_id = search_str.get("id")
                category = search_str.get("category")
                today = datetime.date.today()
            
                if category == "Book": 
                        try:
                                result = get_object_or_404(BookCheckout, id=checkout_id)

                                result.asset.checked_in = 1
                                result.checkin_by = request.user.username
                                result.checkin_date = today

                                result.asset.save()
                                result.save()

                                return JsonResponse({"result": 0})

                        except Http404:
                                return JsonResponse({"result": 1})

                elif category == "Item":
                        try:
                                result = get_object_or_404(ItemCheckout, id=checkout_id)

                                result.asset.checked_in = 1
                                result.checkin_by = request.user.username
                                result.checkin_date = today

                                result.asset.save()
                                result.save()

                                return JsonResponse({"result": 0})

                        except Http404:
                                return JsonResponse({"result": 1})

                else:
                        return JsonResponse({"result":2})

class GemsReqCheckoutEducationalAsset(View):

        (SUCCESS, NOT_FOUND, FAILURE, NOT_PERMITTED, NOT_AVAILABLE) = (0,1,2,3,4)

        def post(self, request):
                search_str = json.loads(request.body.decode())

                student_id = search_str.get("student_id")
                barcode = search_str.get("barcode")
                category =search_str.get("category")
                today = datetime.date.today()

                if category == "Book": 
                        try:
                                asset = get_object_or_404(Book, barcode=barcode)
                                student = get_object_or_404(Student, id=student_id)
                                due_date = today + datetime.timedelta(days=asset.checkout_duration)

                                if asset.permit_checkout == 0:
                                        return JsonResponse({"result": self.NOT_PERMITTED})
                                
                                elif asset.checked_in == 0:
                                        return JsonResponse({"result":self.NOT_AVAILABLE})

                                else:
                                        asset.checked_in = 0
                                        asset.save()
                                
                                        checkout = BookCheckout.objects.create(
                                        asset=asset,
                                        student=student,
                                        checkout_by=request.user.username,
                                        checkout_date=today,
                                        due_date=due_date,
                                        )
                                        checkout.save()

                                        return JsonResponse({"result": self.SUCCESS})

                        except Http404:
                                return JsonResponse({"result": self.NOT_FOUND})

                elif category == "Item":
                        try:
                                asset = get_object_or_404(Item, barcode=barcode)
                                student = get_object_or_404(Student, id=student_id)
                                due_date = today + datetime.timedelta(days=asset.checkout_duration)

                                if asset.permit_checkout == 0:
                                        return JsonResponse({"result": self.NOT_PERMITTED})
                                
                                elif asset.checked_in == 0:
                                        return JsonResponse({"result":self.NOT_AVAILABLE})

                                else:
                                        asset.checked_in = 0
                                        asset.save()
                                
                                        checkout = ItemCheckout.objects.create(
                                        asset=asset,
                                        student=student,
                                        checkout_by=request.user.username,
                                        checkout_date=today,
                                        due_date=due_date,
                                        )
                                        checkout.save()

                                        return JsonResponse({"result": self.SUCCESS})


                        except Http404:
                                return JsonResponse({"result": self.NOT_FOUND})

                else:
                        return JsonResponse({"result":self.FAILURE})

class GemsReqRenewEducationalAsset(View):
        def post(self, request):
                search_str = json.loads(request.body.decode())

                checkout_id = search_str.get("id")
                category = search_str.get("category")
                today = datetime.date.today()
            
                if category == "Book": 
                        try:
                                result = get_object_or_404(BookCheckout, id=checkout_id)

                                result.due_date = today + datetime.timedelta(days=result.asset.checkout_duration)
                                result.checkout_by = request.user.username
                                result.checkout_date = today

                                result.save()

                                return JsonResponse({"result": 0})

                        except Http404:
                                return JsonResponse({"result": 1})

                elif category == "Item":
                        try:
                                result = get_object_or_404(ItemCheckout, id=checkout_id)

                                result.due_date = today + datetime.timedelta(days=result.asset.checkout_duration)
                                result.checkout_by = request.user.username
                                result.checkout_date = today

                                result.save()

                                return JsonResponse({"result": 0})

                        except Http404:
                                return JsonResponse({"result": 1})

                else:
                        return JsonResponse({"result":2})

class GemsReqStudentComment(View):
        def get(self, request, jsonstr):
                search_str = json.loads(jsonstr)

                student_id = search_str.get("student_id")

                try:
                        results = get_list_or_404(InstructorComment, student__id=student_id)

                except Http404:
                        return JsonResponse({"results": 1})

                data = [{
                        "id":result.id,
                        "user":result.user.username,
                        "last_name":result.user.last_name,
                        "entry_date":result.entry_date,
                        "comment":result.comment,
                } for result in results if result.active == True]

                return JsonResponse(data, safe=False)

class GemsReqAddStudentComment(View):
        def post(self, request):
                search_str = json.loads(request.body.decode())

                try:
                        student = get_object_or_404(Student, id=search_str.get("student_id"))
                        user = request.user
                        comment = search_str.get("comment")

                except Http404:
                        return JsonResponse({"result":1})

                instructor_comment = InstructorComment.objects.create(
                        student=student,
                        user=user,
                        comment=comment
                )      
                instructor_comment.save()

                return JsonResponse({"result":0}) 

class GemsReqDelStudentComment(View):
        def post(self, request):
                search_str = json.loads(request.body.decode())

                try:
                        instructor_comment = get_object_or_404(InstructorComment, id=search_str.get("id"))

                except Http404:
                        return JsonResponse({"result":1})

                instructor_comment.active = False;
                instructor_comment.modified_by = request.user.username
                instructor_comment.modified_date = datetime.date.today()

                instructor_comment.save()

                return JsonResponse({"result":0})

class GemsReqAddStudent(View):
        def post(self, request):
                results = json.loads(request.body.decode())

                institution = Institution.objects.get(pk=results.get("institution"))
                housing_unit = HousingUnit.objects.get(pk=results.get("housing_unit"))
                try:
                        student = Student(
                                IDOC=results.get("IDOC"), first_name=results.get("first_name"),
                                last_name=results.get("last_name"), institution=institution,
                                housing_unit=housing_unit, entry_date=results.get("entry_date")
                        )
                        student.save()

                except IntegrityError:
                        return JsonResponse({"result": 1})

                return JsonResponse({"result": 0})                  

class GemsReqEditStudent(View):
        def post(self, request):
                results = json.loads(request.body.decode())

                student = Student.objects.get(IDOC=results.get("IDOC"))
                entry_date = datetime.date.fromisoformat(results.get("entry_date"))

                student.IDOC = results.get("IDOC")
                student.first_name = results.get("first_name")
                student.last_name = results.get("last_name")
                student.entry_date = entry_date
                student.institution = Institution.objects.get(pk=results.get("institution"))
                student.housing_unit = HousingUnit.objects.get(pk=results.get("housing_unit"))                
                
                student.save()

                return JsonResponse([{"result":"Student Updated!"}], safe=False)

class GemsReqDelStudent(PermissionRequiredMixin, View):
        permission_required = ("gems.delete_student")

        def post(self, request):
                results = json.loads(request.body.decode())

                student = Student.objects.get(IDOC=results.get("IDOC"))
                student.delete()

                return JsonResponse([{"results":"Student entry deleted."}], safe=False)

class GemsReqMoodleInformation(View):
        #response codes
        (SUCCESS, STUDENT_NOT_FOUND, DB_CONNECTION_ERROR,) = (0,1,2)

        def get(self, request, jsonstr):
                import mysql.connector

                search_str = json.loads(jsonstr)
                student_id = search_str.get("student_id")
                host = "localhost"
                user = "root"
                database = "moodle"

                try:
                        student = get_object_or_404(Student, id=student_id)

                        moodle_db =  mysql.connector.connect(host=host, user=user, database=database)
                        sql = "SELECT mdl_grade_items.itemname, mdl_grade_grades.finalgrade,mdl_grade_items.gradepass,mdl_grade_grades.timemodified FROM mdl_grade_items,mdl_grade_grades, mdl_user WHERE  mdl_grade_grades.userid=mdl_user.id and mdl_grade_grades.itemid=mdl_grade_items.id  and mdl_grade_grades.finalgrade IS NOT NULL and mdl_grade_items.itemname IS NOT NULL and mdl_user.idnumber = %s;"
                        params = (int(student.IDOC),)

                        cursor = moodle_db.cursor()
                        cursor.execute(sql, params)

                        results = cursor.fetchall()

                        moodle_db.close()

                except Http404:
                        return JsonResponse({"result":self.STUDENT_NOT_FOUND})

                except mysql.connector.errors.ProgrammingError:
                        return JsonResponse({"result":self.DB_CONNECTION_ERROR})

               

                data = [{
                        "itemname":result[0],
                        "finalgrade":result[1],
                        "gradepass":result[2],
                        "timemod":datetime.date.fromtimestamp(result[3]).isoformat(),
                } for result in results]

                return JsonResponse(data, safe=False)

class GemsReqPrintStudentBarcodes(TemplateView):
        
        template_name = "gems/student_barcodes.html"

        def setup(self,*args,jsonstr,**kwargs):
                super().setup(*args,**kwargs)
                self.jsonstr = jsonstr

        def get_context_data(self,**kwargs):
                context = super().get_context_data(**kwargs)
                context["barcodes"] = json.loads(self.jsonstr).get("barcodes")
                return context

class GemsReqUserTimesheet(View):
        def get(self, request, jsonstr):
                month = json.loads(jsonstr).get("reqMonth")

                if month == "0":
                        month = datetime.date.today().month

                results = UserTimesheet.objects.filter(entryDate__month=month).filter(user__username=self.request.user)
                data = [{
                        "IDOC":result.user.username, "timeInAM":result.timeInAM.isoformat(),
                        "timeOutAM":result.timeOutAM.isoformat(),"timeInPM":result.timeInPM.isoformat(),
                        "timeOutPM":result.timeOutPM.isoformat(),"entryDate":result.entryDate.isoformat(),
                } for result in results]
                data.append({"reqMonth":str(month)})
                return JsonResponse(data, safe=False)

class GemsReqUserTimesheetAddEntry(View):
        def post(self, request):
                results = json.loads(request.body.decode())
                entry = UserTimesheet(
                        user_id=request.user.id, timeInAM=results.get("timeInAM"), timeOutAM=results.get("timeOutAM"),
                        timeInPM=results.get("timeInPM"), timeOutPM=results.get("timeOutPM"), entryDate=results.get("entryDate")
                )
                entry.save()
                return JsonResponse([{"result":"New Timesheet Entry Created!"}], safe=False)

class GemsReqUserTimesheetEditEntry(View):
        def post(self, request):
                results = json.loads(request.body.decode())
                user = UserTimesheet.objects.filter(user_id=request.user.id).filter(entryDate=results.get("entryDate")).first()

                user.timeInAM = datetime.time().fromisoformat(results.get("timeInAM"))
                user.timeOutAM = datetime.time().fromisoformat(results.get("timeOutAM"))
                user.timeInPM = datetime.time().fromisoformat(results.get("timeInPM"))
                user.timeOutPM = datetime.time().fromisoformat(results.get("timeOutPM"))

                user.save()
                return JsonResponse({"results":1}, safe=False)

class GemsReqUserTimesheetDelEntry(View):
        def post(self, request):
                results = json.loads(request.body.decode())
                
                entry = UserTimesheet.objects.filter(user_id=request.user.id).filter(entryDate=results.get("entryDate")).first()

                entry.delete()
                
                return JsonResponse({"results":1}, safe=False)

class GemsReqDisplayUserTimesheet(TemplateView):
        template_name = "gems/user_timesheet.html"

        def getHours(self, result):
                """
                        1.  result is a query object entry of UserTimesheet model
                        2.  all values expressed in minutes for easy conversion
                """
                timeInAM = result.timeInAM.hour * 60 + result.timeInAM.minute
                timeOutAM = result.timeOutAM.hour * 60 + result.timeOutAM.minute
                timeInPM = result.timeInPM.hour  * 60 + result.timeInPM.minute
                timeOutPM = result.timeOutPM.hour * 60 + result.timeOutPM.minute

                hours = ((timeOutAM - timeInAM) + (timeOutPM - timeInPM))/60

                return hours
        
        def getTotalHours(self, results):
                """
                        results is a query result object list
                        get total number of hours from all records
                """
                total_hours= 0

                for result in results:
                        total_hours += self.getHours(result)

                return total_hours

        def setup(self,*args,jsonstr,**kwargs):
                super().setup(*args,**kwargs)
                self.jsonstr = json.loads(jsonstr)

        def get_context_data(self,**kwargs):
                context = super().get_context_data(**kwargs)

                #add context variables, including timesheet entries from date range supplied
                site_name = SiteSetting.objects.get(setting_name='site_name').setting_value
                date_from = datetime.datetime.fromisoformat(self.jsonstr.get("date_from"))
                date_to = datetime.datetime.fromisoformat(self.jsonstr.get("date_to"))
                user_id = self.jsonstr.get("user_id")

                try:
                        results = get_list_or_404(UserTimesheet,
                                                  entryDate__range=(date_from,date_to),
                                                  user__id=user_id
                                                  )
                        
                        context["timesheet_entries"] = [{
                                "entryDate":result.entryDate.isoformat(),
                                "timeInAM":result.timeInAM.isoformat(),
                                "timeOutAM":result.timeOutAM.isoformat(),
                                "timeInPM":result.timeInPM.isoformat(),
                                "timeOutPM":result.timeOutPM.isoformat(),
                                "hours":self.getHours(result),

                        } for result in results]

                        context["site_name"] = site_name
                        context["total_hours"] = self.getTotalHours(results)
                        
                        return context


                except Http404:
                        #return JsonResponse([{"results": 1 }], safe=False)
                        return context

class GemsReqUserChangePassword(View):
        def post(self, request):
                results = json.loads(request.body.decode())

                user = User.objects.get(pk=request.user.id)

                new_pass = make_password(results.get("password"))
                user.password = new_pass
                user.save()

                return JsonResponse([{"result":"Password changed!"}], safe=False)

class GemsReqUserChangeTheme(View):
        def post(self, request):
                results = json.loads(request.body.decode())

                user = User.objects.get(pk=request.user.id)

                theme = results.get("theme")

             
                user.usersetting.theme = theme
                user.usersetting.save()

                return JsonResponse([{"result":"Theme changed!"}], safe=False)

class GemsReqPreviewTheme(TemplateView):
        template_name = "gems/theme_preview.html"

        def setup(self, *args, jsonstr, **kwargs):
                super().setup(*args, **kwargs)
                self.jsonstr = jsonstr

        def get_context_data(self, **kwargs):
                context = super().get_context_data(**kwargs)

                search_str =  json.loads(self.jsonstr)
                theme =search_str.get("theme")

                context["theme"] = "" if theme == None else "gems/css/themes/"+theme
                
              

                return context

class GemsReqUserChangeAvatar(View):
        def post(self, request):
                results = json.loads(request.body.decode())

                user = User.objects.get(pk=request.user.id)

                avatar = results.get("avatar")
                user.usersetting.avatar = avatar
                user.usersetting.save()

                return JsonResponse([{"result":"Avatar changed!"}], safe=False)

class GemsReqAdminAddUser(PermissionRequiredMixin, View):
        permission_required = ('auth.add_user','auth.change_user')

        def post(self, request):
                results = json.loads(request.body.decode())

                passwd = make_password(results.get("password"))
                new_user = User(
                        username=results.get("username"), first_name=results.get("first_name"), last_name=results.get("last_name"),
                        is_active=True, password=make_password(results.get("password")), 
                )
                new_user.save()

                gems_user = Group.objects.get(name="gems_user")
                new_user.groups.add(gems_user)
                new_user.save()
                
                user_setting = UserSetting.objects.create(
                        user = new_user,
                        avatar = os.path.join(settings.BASE_DIR,'gems/static/gems/img/avatar/avatar1.png'),
                        theme = os.path.join(settings.BASE_DIR, 'gems/static/gems/css/themes/w3-theme-grey.css')
                )
                user_setting.save()


                job_title = JobTitle.objects.get(jobTitle=results.get("jobTitle"))
                new_employee = Employee(
                        user_id=User.objects.get(username=results.get("username")).id , payRate=results.get("payRate"), jobTitle=job_title
                )
                new_employee.save()

                return JsonResponse([{"result":"New User Added!"}], safe=False)
                
class GemsReqAdminEditUser(PermissionRequiredMixin, View):
        permission_required = ('auth.change_user', 'auth.add_user')

        def post(self, request):
                results = json.loads(request.body.decode())

                user = User.objects.get(username=results.get("username"))

                user.username = results.get("new_username")
                user.first_name = results.get("first_name")
                user.last_name = results.get("last_name")
                user.date_joined = results.get("date_joined")
                user.employee.jobTitle = JobTitle.objects.get(jobTitle=results.get("jobTitle"))
                user.employee.payRate = results.get("payRate")
                
                user.save()
                user.employee.save()

                return JsonResponse([{"result":"User updated!"}], safe=False)
                
class GemsReqAdminDelUser(PermissionRequiredMixin, View):
        permission_required = ('auth.delete_user')

        def post(self, request):
                results = json.loads(request.body.decode())

                user = User.objects.get(username=results.get("username"))
                user.delete()

                return JsonResponse([{"result":"User entry deleted."}], safe=False)

class GemsReqAdminResetPassword(PermissionRequiredMixin, View):
        permission_required = ("auth.change_user","auth.add_user")

        def post(self, request):
                results = json.loads(request.body.decode())

                user = User.objects.get(username=results.get("username"))

                new_pass = make_password(results.get("password"))
                user.password = new_pass
                user.save()

                return JsonResponse([{"result":"Password changed!"}], safe=False)

class GemsReqAdminTestManagement(View):
        def post(self, request):
                results = get_list_or_404(Test)
                data = [{
                        "id":result.id, "name":result.name, "passing_score":result.passing_score,
                        "active":result.active, "certificate": result.certificate
                } for result in results]

                return JsonResponse(data, safe=False)

class GemsReqAdminAddTest(View):
        def post(self, request):
                results = json.loads(request.body.decode())
                entry = Test(   
                        name=results.get("name"), passing_score=results.get("passing_score"),
                        active=results.get("active"), certificate=results.get("certificate")
                )
                entry.save()
                return JsonResponse([{"result":"New Test added."}], safe=False)

class GemsReqAdminEditTest(View):
        def post(self, request):
                results =  json.loads(request.body.decode())
                entry = Test.objects.get(id=results.get("id"))
                
                entry.name = results.get("name")
                entry.passing_score = results.get("passing_score")
                entry.active = results.get("active")
                entry.certificate = results.get("certificate")

                entry.save()
                return JsonResponse([{"result":"Test changed."}], safe=False)

class GemsReqAdminDelTest(View):
        def post(self, request):
                results = json.loads(request.body.decode())

                entry = Test.objects.get(id=results.get("id"))
                entry.delete()
                
                return JsonResponse([{"result":"Test deleted."}], safe=False)

class GemsReqAdminClassTSManagement(View):
        def post(self, request):
                results = get_list_or_404(ClassTimeslot)
                data = [{
                        "id":result.id, "subject":result.class_name.subject.name, "teacher":result.class_name.teacher.name,
                        "classroom":result.class_name.classroom.__str__(),"hour":result.hour.hour.isoformat()
                } for result in results]

                return JsonResponse(data, safe=False)

class GemsReqAddClassTimeslot(View):
        def post(self, request):
                results = json.loads(request.body.decode())

                _class = Class.objects.get(pk=results.get("id"))
                hour = Hour.objects.get(hour=results.get("hour"))

                entry = ClassTimeslot(class_name=_class, hour=hour)
                entry.save()

                return JsonResponse([{"result":"New ClassTimeslot created."}], safe=False)

class GemsReqEditClassTimeslot(View):
        def post(self, request):
                results = json.loads(request.body.decode())
                entry = ClassTimeslot.objects.get(id=results.get("id"))

                hour = Hour.objects.get(hour=results.get("hour"))
                entry.hour = hour
                entry.save()

                return JsonResponse([{"results":"Class Timeslot Changed."}], safe=False)

class GemsReqDelClassTimeslot(View):
        def post(self, request):
                results = json.loads(request.body.decode())

                entry = ClassTimeslot.objects.get(id=results.get("id"))
                entry.delete()
                
                return JsonResponse([{"results":"Class timeslot removed."}], safe=False)

class GemsReqAdminClassManagement(View):
        def post(self, request):
                results = get_list_or_404(Class)
                data = [{
                        "id":result.id, "subject":result.subject.name, 
                        "teacher": result.teacher.name, "classroom":result.classroom.room_number
                } for result in results]

                return JsonResponse(data, safe=False)

class GemsReqAdminAddClass(View):
        def post(self, request):
                results = json.loads(request.body.decode())

                subject = Subject.objects.get(pk=results.get("subject"))
                teacher = Teacher.objects.get(pk=results.get("teacher"))
                classroom = Classroom.objects.get(pk=results.get("classroom"))

                entry = Class(subject=subject, teacher=teacher, classroom=classroom)
                entry.save()

                return JsonResponse([{"result":"New Class created!"}], safe=False)

class GemsReqAdminEditClass(View):
        def post(self, request):
                results = json.loads(request.body.decode())

                _class = Class.objects.get(id = results.get("id"))

                subject = Subject.objects.get(id = results.get("subject"))
                teacher = Teacher.objects.get(id  = results.get("teacher"))
                classroom = Classroom.objects.get(id = results.get("classroom"))

                _class.subject = subject
                _class.teacher = teacher
                _class.classroom = classroom
                _class.save()

                return JsonResponse([{"results":"Class Updated!"}], safe=False)

class GemsReqAdminSubjectManagement(View):
        def post(self, request):
                try:
                        results = get_list_or_404(Subject)

                except Http404:
                        return JsonResponse({"result":1})

                data = [{
                        "id":result.id,
                        "name":result.name,
                } for result in results]

                return JsonResponse(data, safe=False)

class GemsReqAdminAddSubject(View):
        def post(self, request):
                search_str = json.loads(request.body.decode())

                subject_name = search_str.get("subject")

                subject = Subject.objects.create(
                        name=subject_name
                )
                subject.save()

                return JsonResponse({"result": 0})

class GemsReqAdminDelSubject(View):
        def post(self, request):
                search_str = json.loads(request.body.decode())

                subject_id = search_str.get("id")
                
                try:
                        subject = get_object_or_404(Subject,id=subject_id)
                
                except Http404:
                        return JsonResponse({"result":1})

                subject.delete()

                return JsonResponse({"result": 0})         

class GemsReqAdminDelClass(View):
        def post(self, request):
                results = json.loads(request.body.decode())

                _class = Class.objects.get(id=results.get("id"))
                _class.delete()

                return JsonResponse([{"results":"Class deleted."}], safe=False)

class GemsWebAttendance(TemplateView):
        
        template_name = "gems/web_attendance.html"

        def setup(self,*args,jsonstr,**kwargs):
                super().setup(*args,**kwargs)
                self.jsonstr = jsonstr

        def get_context_data(self,**kwargs):
                context = super().get_context_data(**kwargs)

                search_str = json.loads(self.jsonstr)
                
                classroom = get_object_or_404(Classroom, id=search_str.get("classroom"))

                # convert to my table , here weekday returns monday:0, my table is monday pk=1
                day = datetime.date.today().weekday() + 1
                day_name = Day.objects.get(pk=day)

                context = {
                        "school_name":SiteSetting.objects.get(setting_name="school_name").setting_value,
                        "classroom": classroom, 
                        "day": day,
                        "day_name": day_name,
                }


                return context

class GemsReqAddAttendanceRecord(View):
        (SUCCESS, NO_CLASSES_SCHEDULED, STUDENT_NOT_ENROLLED, UNSCHEDULED_ATTENDANCE, STUDENT_NOT_FOUND) = (0,1,2,3,4)
        response = {}

        def get(self, request, jsonstr):
                results = json.loads(jsonstr)

                # get class timeslot based on current hour and class from web_attend
                try:        
                        class_timeslots = get_list_or_404(ClassTimeslot, Q(class_name__classroom=results.get("classroom")) & Q(hour__hour__hour=results.get("hour"))) 

                except Http404:
                        return JsonResponse([{"result":self.NO_CLASSES_SCHEDULED}], safe=False)
                    
                try:
                                student = get_object_or_404(Student,
                                        Q(IDOC=results.get("IDOC"))
                                ) 

                except Http404:
                        return JsonResponse([{"result":self.STUDENT_NOT_FOUND}], safe=False)
                    
                #check to see if student is enrolled in any of the available class timeslots at this hour in this room
                for class_timeslot in class_timeslots:
                        #get enrollment where student, class timeslot, and day match. assemble components of an attendance record.
                        try:
                                enrollment = get_object_or_404(Enrollment, 
                                                Q(student__IDOC=results.get("IDOC")) &
                                                Q(day__id=results.get("day")) &
                                                Q(class_timeslot__id=class_timeslot.id)
                                )

                        except Http404:
                                self.response = {}
                                continue

                        
                                
                        scan_date = datetime.datetime.now().date()
                        scan_time = datetime.time().fromisoformat(results.get("scan_time"))
                        subject = class_timeslot.class_name.subject.name
                        teacher = class_timeslot.class_name.teacher.name
                        location = class_timeslot.class_name.classroom.room_number
                        hour = class_timeslot.hour.hour.isoformat(timespec='minutes')
                        day = enrollment.day.day
                        
                        attendance = Attendance(
                                                student=student,
                                                enrollment=enrollment, 
                                                scan_date=scan_date, 
                                                scan_time=scan_time, 
                                                subject=subject,
                                                teacher=teacher,
                                                location=location,
                                                hour=hour,
                                                day=day,
                        )
                        attendance.save()

                        self.response["result"] = self.SUCCESS

                if self.response == {}:
                        #if here, student is not enrolled in the class.  Create attendance record for an Unscheduled Attendance
                        
                        try:
                            #get the unscheduled attendance object for this classroom and hour if available.
                            unscheduled_attendance = Class.objects.get(subject__name="Unscheduled Attendance",classroom=results.get("classroom"))
                            today = datetime.date.today()
                            
                            class_timeslot = get_object_or_404(ClassTimeslot,
                                                               Q(class_name=unscheduled_attendance) &
                                                               Q(class_name__classroom=results.get("classroom")) &
                                                               Q(hour__hour__hour=results.get("hour"))
                                                               )
                            
                            scan_date = datetime.datetime.now().date()
                            scan_time = datetime.time().fromisoformat(results.get("scan_time"))
                            subject = class_timeslot.class_name.subject.name
                            teacher = class_timeslot.class_name.teacher.name
                            location = class_timeslot.class_name.classroom.room_number
                            hour = class_timeslot.hour.hour.isoformat(timespec='minutes')
                            day = Day.objects.get(id=today.weekday()+1).day
                            
                            attendance = Attendance(
                                                    student=student,
                                                    scan_date=scan_date, 
                                                    scan_time=scan_time, 
                                                    subject=subject,
                                                    teacher=teacher,
                                                    location=location,
                                                    hour=hour,
                                                    day=day,
                            )
                            attendance.save()
                            
                            return JsonResponse([{"result":self.STUDENT_NOT_ENROLLED}], safe=False)
                        
                        except Http404:
                            
                            return JsonResponse([{"result":self.UNSCHEDULED_ATTENDANCE}], safe=False)
                        
                        
                else:
                        return JsonResponse([self.response], safe=False)

class GemsReqUpdateWebAttendance(View):
        def get(self, request, jsonstr):
                search_str = json.loads(jsonstr)

                try:
                        """
                                Note: if a student is no longer enrolled they will not show up in this table.
                                Should be okay as this is the web worker script that updates the web attendance
                                page.  Only displayed for a current hour. In which case an enrollment record will
                                exist.
                        """
                        location = Classroom.objects.get(id=search_str.get("classroom")).room_number
                        hour = Hour.objects.get(hour__hour=search_str.get("hour")).hour.isoformat(timespec='minutes')
                        day = Day.objects.get(id=search_str.get("day")).day
                        
                        results = Attendance.objects.filter(
                               location=location,
                               hour=hour,
                               day=day,
                        )
                        
                        data = [{
                                "student":result.student.__str__(), 
                                "classroom":result.location,
                                "hour":result.hour,
                                "subject":result.subject,
                                "scan_time":result.scan_time.strftime("%I:%M:%S %p"),
                        } for result in results]

                        return JsonResponse(data, safe=False)

                except Http404:
                        return JsonResponse([{"result": 1}], safe=False)
        
class GemsReqManualAttendance(View):
        def post(self, request):
                results = json.loads(request.body.decode())
                
                #get enrollment where student, class timeslot, and day match. assemble components of an attendance record.
                try:        
                        time_string = results.get("hour")
                        hour = datetime.time.fromisoformat(time_string).hour

                        class_timeslot = get_object_or_404(ClassTimeslot, Q(class_name__id=results.get("class")) & Q(hour__hour__hour=hour)) 

                except Http404:
                        return JsonResponse([{"result":1}], safe=False)

                try:
                        enrollment = get_object_or_404(Enrollment, 
                                        Q(student__IDOC=results.get("IDOC")) &
                                        Q(day__id=results.get("day")) &
                                        Q(class_timeslot__id=class_timeslot.id)
                        )

                except Http404:
                        return JsonResponse([{"result":2}], safe=False)
                
                try:
                        student = get_object_or_404(Student,
                                       Q(IDOC=results.get("IDOC"))
                        ) 

                except Http404:
                        return JsonResponse([{"result":3}], safe=False)
                
                scan_date = datetime.datetime.now().date()
                scan_time = datetime.time().fromisoformat(results.get("scan_time"))
                subject = class_timeslot.class_name.subject.name
                teacher = class_timeslot.class_name.teacher.name
                location = class_timeslot.class_name.classroom.room_number
                hour = class_timeslot.hour.hour.isoformat(timespec='minutes')
                day = enrollment.day.day
                
                attendance = Attendance(
                                        student=student,
                                        enrollment=enrollment, 
                                        scan_date=scan_date, 
                                        scan_time=scan_time, 
                                        subject=subject,
                                        teacher=teacher,
                                        location=location,
                                        hour=hour,
                                        day=day,
                )
                attendance.save()
                
                return JsonResponse([{"result":"0"}], safe=False)

class GemsReqDisplayDailyAttendance(View):
        def get(self, request, jsonstr):
                search_str = json.loads(jsonstr)

                #need to get all attendance recs of certain class, hour/timeslot, and scan_date
                try:
                        data = {}

                        _class = get_object_or_404(Class, Q(pk=search_str.get("class")))
                        hour = search_str.get("hour")
                        scan_date = search_str.get("scan_date")

                        results = get_list_or_404(Attendance,
                                Q(subject=_class.subject.name) &
                                Q(location=_class.classroom.room_number) &
                                Q(scan_date=scan_date) &
                                Q(hour=hour)
                                )

                        data["attendance"] = [{
                                "IDOC": result.student.IDOC,
                                "last_name":result.student.last_name,
                                "first_name":result.student.first_name,
                                "scan_date":result.scan_date.isoformat(),
                                "scan_time":result.scan_time.isoformat(),
                                "class":"{subject} , Room {location}".format_map({
                                        "subject":result.subject,
                                        "location":result.location})
                        } for result in results]
                        data["class_timeslot"] = "{class} at {hour}".format_map({
                                "class": _class.__str__(),
                                "hour":hour,
                        })
                        data["display_date"] = scan_date
                        
                        return JsonResponse(data, safe=False)

                except Http404:
                        return JsonResponse([{"result":1}], safe=False)

class GemsReqDisplayIndividualAttendance(View):
        def get(self, request, jsonstr):
                search_str = json.loads(jsonstr)

                try:
                        
                        data = {}

                        date_from = datetime.datetime.fromisoformat(search_str.get("date_from"))
                        date_to = datetime.datetime.fromisoformat(search_str.get("date_to"))

                        student = get_object_or_404(Student, Q(IDOC=search_str.get("IDOC")))

                        results = get_list_or_404(Attendance,
                                Q(student__IDOC=search_str.get("IDOC")) &
                                # Q(enrollment__class_timeslot__id=class_timeslot.id) & 
                                Q(scan_date__range=(date_from,date_to))
                                )

                        data["attendance"] = [{
                                "IDOC": result.student.IDOC,
                                "last_name":result.student.last_name,
                                "first_name":result.student.first_name,
                                "scan_date":result.scan_date.isoformat(),
                                "scan_time":result.scan_time.isoformat(),
                                "class":"{subject} , Room {location}".format_map({
                                        "subject":result.subject,
                                        "location":result.location})
                        } for result in results]

                        data["student"] = {
                                "IDOC":student.IDOC,
                                "first_name":student.first_name,
                                "last_name":student.last_name,
                        }
                        
                        return JsonResponse(data, safe=False)

                except Http404:
                        return JsonResponse([{"result":1}], safe=False)

class GemsReqGenerateCalloutCSV(View):
        def get(self, request, jsonstr):
                search_str = json.loads(jsonstr)

                #get stuff need enrollment record based on class and day
                try: 
                        response =  HttpResponse(content_type='text/csv')
                        response['Content-Disposition'] = 'callout.csv'

                        writer = csv.writer(response)

                        classroom_id = search_str.get("classroom")
                        day_id = search_str.get("day")

                        results = get_list_or_404(Enrollment, 
                                        class_timeslot__class_name__classroom=classroom_id,
                                        day=search_str.get("day")
                        )
                                
                        [writer.writerow([
                                        result.student.last_name, 
                                        result.student.IDOC,
                                        "UNIT",
                                        result.student.housing_unit.name,
                                        "TO BLDG",
                                        "25",
                                        "FOR",
                                        result.class_timeslot.class_name.subject.name,
                                        "DAY",
                                        result.day.day,
                                        "TIME",
                                        result.class_timeslot.hour.hour.isoformat(timespec='minutes'),
                                        str(result.class_timeslot.hour.hour.hour + 1) + ":00",
                                ]
                                ) for result in results]
                        
                        return response

                except Http404:
                        return JsonResponse([{"result": 1 }], safe=False)

class GemsReqGenerateClassRoster(TemplateView):
        template_name = "gems/class_roster.html"
        context = {}

        def setup(self,*args,jsonstr,**kwargs):
                super().setup(*args,**kwargs)
                self.jsonstr = jsonstr

        def get_context_data(self,**kwargs):
                context = super().get_context_data(**kwargs)
                context["class_roster"] = self.context
                return context

        def get(self, request, jsonstr):
                search_str = json.loads(jsonstr)
                self.context = {}

                if search_str.get("csv") == "True":
                                #csv code here.
                        response = HttpResponse(content_type='text/csv')
                        response['Content-Disposition'] = 'class_roster.csv'
                        
                        writer = csv.writer(response)
                        hours = [hour.id for hour in Hour.objects.all()]
                        classroom_id = search_str.get("classroom")

                        for hour in hours:
                                try:
                                        class_timeslots = get_list_or_404(
                                                ClassTimeslot,
                                                hour=hour,
                                                class_name__classroom__id=classroom_id
                                        )

                                        #write headers for hour
                                        writer.writerow([Hour.objects.get(pk=hour).hour.isoformat(timespec='minutes')])
                                        writer.writerow(['IDOC','Last Name', 'First Name', 'Subject', 'Class Room','Days'])

                                        for class_timeslot in class_timeslots:
                                                #get set of student enrolled in classes during timeslot
                                                students = {enrollment.student for enrollment in class_timeslot.enrollment_set.all()}

                                                #now write rows
                                                [writer.writerow([
                                                        student.IDOC,
                                                        student.last_name,
                                                        student.first_name,
                                                        class_timeslot.class_name.subject.name,
                                                        str(class_timeslot.class_name.classroom.room_number),
                                                        ', '.join([
                                                                enrollment.day.day for enrollment in student.enrollment_set.filter(
                                                                        class_timeslot=class_timeslot,
                                                                ).order_by('day')
                                                        ])
                                                ]) for student in students]


                                except Http404:
                                        continue

                        return response

                else:
                        #template response code here.
                        try:
                                hours = [hour.id for hour in Hour.objects.all()]
                                classroom_id = search_str.get("classroom")

                                for hour in hours:
                                        try:
                                                class_timeslots = get_list_or_404(
                                                        ClassTimeslot,
                                                        hour=hour,
                                                        class_name__classroom__id=classroom_id
                                                )

                                                self.context[Hour.objects.get(id=hour).hour.isoformat(timespec='minutes')] = []

                                                for class_timeslot in class_timeslots:
                                                        students = {enrollment.student for enrollment in class_timeslot.enrollment_set.all()}

                                                        #write to context at hour
                                                        self.context[Hour.objects.get(id=hour).hour.isoformat(timespec='minutes')] += [{
                                                                "IDOC":student.IDOC,
                                                                "last_name":student.last_name,
                                                                "first_name":student.first_name,
                                                                "subject":class_timeslot.class_name.subject.name,
                                                                "classroom":str(class_timeslot.class_name.classroom.room_number),
                                                                "days":', '.join([
                                                                        enrollment.day.day for enrollment in student.enrollment_set.filter(
                                                                                class_timeslot=class_timeslot,
                                                                        ).order_by('day')
                                                                ])
                                                        } for student in students]

                                        except Http404:
                                                continue

                                return TemplateResponse(request, self.template_name, self.get_context_data())

                        except Http404:
                                return JsonResponse([{"result"}], safe=False)

class GemsReqGenerateEnrolledStudents(TemplateView):
        template_name = 'gems/enrolled_students.html'

        def setup(self,*args,jsonstr,**kwargs):
                super().setup(*args,**kwargs)
                self.jsonstr = jsonstr

        def get_context_data(self,**kwargs):
                context = super().get_context_data(**kwargs)

                try:
                        #template response includes a list of students enrolled without duplicates
                        search_str = json.loads(self.jsonstr)
                        classroom = get_object_or_404(Classroom, Q(id=search_str.get("classroom")))

                        # results = get_list_or_404(Student, enrollment__class_timeslot__class_name=_class)
                        results = Student.objects.filter(enrollment__class_timeslot__class_name__classroom=classroom).distinct().order_by(search_str.get("sort_order"))

                        context["classroom"] = classroom.__str__()
                        
                        context["enrolled_students"] = [{
                                "IDOC":result.IDOC,
                                "last_name":result.last_name,
                                "classroom":classroom.__str__(),
                                "housing_unit": result.housing_unit.name,
                        }for result in results]

                except Http404:
                        context["result"] = 1

                return context

class GemsReqGenerateDailyAttendance(TemplateView):
        template_name = 'gems/attendance.html'

        def setup(self,*args,jsonstr,**kwargs):
                super().setup(*args,**kwargs)
                self.jsonstr = jsonstr

        def get_context_data(self,**kwargs):
                context = super().get_context_data(**kwargs)

                search_str = json.loads(self.jsonstr)

                try: 
                        classroom = get_object_or_404(Classroom, id=search_str.get("classroom"))
                        hour = search_str.get("hour")
                        scan_date = search_str.get("scan_date")

                        results = Attendance.objects.filter(
                                location=classroom.room_number,
                                scan_date=scan_date,
                                hour=hour,
                        ).order_by('student__'+search_str.get('sort_order'))

                        context["attendance"] = [{
                                "IDOC":result.student.IDOC,
                                "last_name":result.student.last_name,
                                "first_name":result.student.first_name,
                                "scan_date":result.scan_date.isoformat(),
                                "scan_time":result.scan_time.isoformat(),
                                "class":"{subject} , Room {location}".format_map({
                                                "subject":result.subject,
                                                "location":result.location})
                        } for result in results]
                        context["classroom"] = classroom.__str__()
                        context["date"] = scan_date
                        context["hour"] = hour
                        
                except Http404:
                        context["result"] = 1

                return context

class GemsReqGenerateContactHours(TemplateView):
        template_name = "gems/contact_hours.html"
        
        def setup(self,*args, jsonstr, **kwargs):
                super().setup(*args,**kwargs)
                self.jsonstr = jsonstr

        def get_context_data(self, **kwargs):
                context = super().get_context_data(**kwargs)

                search_str = json.loads(self.jsonstr)

                date_from = search_str.get("date_from")
                date_to = search_str.get("date_to")
                sort_order = search_str.get("sort_order")
                context["hours"] = {}

                try:
                        #if % then user selected all classes.
                        hours = [get_object_or_404(Hour,id= hour).hour.isoformat(timespec='minutes') for hour in search_str.get("hour")]

                        if search_str.get("classroom") == "%":
                                #create a query set of attendance entries for a range of dates.
                                records = Attendance.objects.filter(scan_date__range=(date_from, date_to))

                                for hour in hours:
                                        #results set for all classes at given hour
                                        results = records.filter(hour=hour)

                                        #set of students for iteration below
                                        students = {result.student for result in results}

                                        context["hours"][hour] = [{
                                                "IDOC":student.IDOC,
                                                "last_name":student.last_name,
                                                "first_name":student.first_name,
                                                "contact_hours":results.filter(student=student).count(),
                                        } for student in students]
                                        
                                context["classroom"] = "All Classrooms"

                        else:
                                # _class = (get_object_or_404(Class,id=search_str.get("class")))
                                classroom = get_object_or_404(Classroom, id=search_str.get("classroom"))

                                #create a query set of attendance entries for a class in a range of dates
                                records = Attendance.objects.filter(
                                                                location=classroom.room_number,
                                                                scan_date__range=(date_from,date_to),
                                )

                                for hour in hours:
                                        results = records.filter(hour=hour)

                                        #set of students for iteration below
                                        students = {result.student for result in results}

                                        context["hours"][hour] = [{
                                                "IDOC":student.IDOC,
                                                "last_name":student.last_name,
                                                "first_name":student.first_name,
                                                "contact_hours":results.filter(student=student).count(),
                                        } for student in students]

                                context["classroom"] = classroom.__str__()

                except Http404:
                        context["result"] = 1
                
                context["date_from"] = date_from
                context["date_to"] = date_to
                
                return context

class GemsReqGenerateAttendanceScan(TemplateView):
        template_name = "gems/attendance_scan.html"
        
        def setup(self, *args, jsonstr, **kwargs):
                super().setup(*args, **kwargs)
                self.jsonstr = jsonstr

        def get_context_data(self, **kwargs):
                context = super().get_context_data(**kwargs)

                search_str =  json.loads(self.jsonstr)
                
                try:
                        classroom = get_object_or_404(Classroom, id=search_str.get("classroom"))

                        date_from = search_str.get("date_from")
                        date_to = search_str.get("date_to")

                        #get the students who are enrolled in the class
                        enrolled_students = Student.objects.filter(
                                enrollment__class_timeslot__class_name__classroom=classroom).distinct()

                        #subset of enrolled_students, those who did not scan in range of dates
                        absent_students = enrolled_students.exclude(
                                attendance__enrollment__class_timeslot__class_name__classroom=classroom,
                                attendance__scan_date__range=(date_from,date_to)
                                ).order_by(search_str.get("sort_order"))

                        context["attendance"] = [{
                                "IDOC":student.IDOC,
                                "last_name":student.last_name,
                                "first_name":student.first_name,
                                "classroom":classroom.__str__(),
                        } for student in absent_students]

                        context["classroom"] = classroom.__str__()

                        context["date_from"] = date_from
                        context["date_to"] = date_to
                                        
                except Http404:
                        context["result"] = 1

                return context

class GemsReqGenerateAssetsOut(TemplateView):
        template_name = "gems/assets_out.html"
        
        def setup(self, *args, jsonstr, **kwargs):
                super().setup(*args, **kwargs)
                self.jsonstr = jsonstr

        def get_context_data(self, **kwargs):
                context = super().get_context_data(**kwargs)

                search_str =  json.loads(self.jsonstr)
                classroom_id = search_str.get("classroom")
                category = search_str.get("category")

                if category == "Book":
                        try:
                                classroom = get_object_or_404(Classroom, id=classroom_id)

                                results = BookCheckout.objects.filter(
                                        Q(asset__classroom=classroom) &
                                        Q(checkin_date__isnull=True) &
                                        Q(asset__checked_in=False)
                                )

                                context["records"] = [{
                                        "IDOC":result.student.IDOC,
                                        "last_name":result.student.last_name,
                                        "housing_unit":result.student.housing_unit.__str__(),
                                        "barcode":result.asset.barcode,
                                        "name":result.asset.name,
                                        "classroom":result.asset.classroom.__str__(),
                                        "checkout_date":result.checkout_date.isoformat(),
                                        "due_date":result.due_date.isoformat(),
                                } for result in results]

                                context["classroom"] = classroom.__str__()
                                context["category"] = category

                        except Http404:
                                context["result"] = 1

                        return context

                elif category == "Item":
                        try:
                                classroom = get_object_or_404(Classroom, id=classroom_id)

                                results = ItemCheckout.objects.filter(
                                        Q(asset__classroom=classroom) &
                                        Q(checkin_date__isnull=True) &
                                        Q(asset__checked_in=False)
                                )

                                context["records"] = [{
                                        "IDOC":result.student.IDOC,
                                        "last_name":result.student.last_name,
                                        "housing_unit":result.student.housing_unit.__str__(),
                                        "barcode":result.asset.barcode,
                                        "name":result.asset.name,
                                        "classroom":result.asset.classroom.__str__(),
                                        "checkout_date":result.checkout_date.isoformat(),
                                        "due_date":result.due_date.isoformat(),
                                } for result in results]

                                context["classroom"] = classroom.__str__()
                                context["category"] = category

                        except Http404:
                                context["result"] = 1

                        return context
                
                elif category == "All":
                        try:
                                classroom = get_object_or_404(Classroom, id=classroom_id)
                        except Http404:
                                context["result"] = 1
                                
                        try:
                            item_history = get_list_or_404(ItemCheckout,
                                    Q(asset__classroom=classroom) &
                                    Q(checkin_date__isnull=True) &
                                    Q(asset__checked_in=False)
                            )
                        except Http404:
                            item_history = []
                            
                        try:    
                            book_history = get_list_or_404(BookCheckout,
                                    Q(asset__classroom=classroom) &
                                    Q(checkin_date__isnull=True) &
                                    Q(asset__checked_in=False)
                            )
                        except Http404:
                            book_history = []
                            
                        results =  book_history + item_history

                        context["records"] = [{
                                "IDOC":result.student.IDOC,
                                "last_name":result.student.last_name,
                                "barcode":result.asset.barcode,
                                "name":result.asset.name,
                                "classroom":result.asset.classroom.__str__(),
                                "checkout_date":result.checkout_date.isoformat(),
                                "due_date":result.due_date.isoformat(),
                        } for result in results]

                        context["classroom"] = classroom.__str__()
                        context["category"] = "Assets"

                        return context 

                else:
                        context["result"] = 2

                        return context 
                    
class GemsReqGenerateAssetsIn(TemplateView):
        template_name = "gems/assets_in.html"
        
        def setup(self, *args, jsonstr, **kwargs):
                super().setup(*args, **kwargs)
                self.jsonstr = jsonstr

        def get_context_data(self, **kwargs):
                context = super().get_context_data(**kwargs)

                search_str =  json.loads(self.jsonstr)
                classroom_id = search_str.get("classroom")
                category = search_str.get("category")

                if category == "Book":
                        try:
                                classroom = get_object_or_404(Classroom, id=classroom_id)

                                results = Book.objects.filter(
                                        Q(classroom=classroom) &
                                        Q(checked_in=True)
                                )

                                context["records"] = [{
                                       "barcode":result.barcode,
                                       "name":result.name,
                                       "author":result.author,
                                       "publisher":result.publisher,
                                       "isbn":result.isbn,
                                       "checked_in":result.get_checkout_status(verbose=True),
                                } for result in results]

                                context["classroom"] = classroom.__str__()
                                context["category"] = category

                        except Http404:
                                context["result"] = 1

                        return context

                elif category == "Item":
                        try:
                                classroom = get_object_or_404(Classroom, id=classroom_id)

                                results = Item.objects.filter(
                                        Q(asset__classroom=classroom) &
                                        Q(asset__checked_in=True)
                                )

                                context["records"] = [{
                                        "barcode":result.barcode,
                                        "name":result.name,
                                        "manufacturer":result.manufacturer,
                                        "model_number":result.model_number,
                                        "serial_number":result.serial_number,
                                        "category":result.category.__str__(),
                                        "checked_in":result.get_checkout_status(verbose=True),
                                } for result in results]

                                context["classroom"] = classroom.__str__()
                                context["category"] = category

                        except Http404:
                                context["result"] = 1

                        return context
                
                elif category == "All":
                        try:
                                classroom = get_object_or_404(Classroom, id=classroom_id)
                        except Http404:
                                context["result"] = 1
                                
                        try:
                            item_history = get_list_or_404(Item,
                                    Q(classroom=classroom) &
                                    Q(checked_in=True)
                            )
                        except Http404:
                            item_history = []
                            
                        try:    
                            book_history = get_list_or_404(Book,
                                    Q(classroom=classroom) &
                                    Q(checked_in=True)
                            )
                        except Http404:
                            book_history = []
                            
                        results =  book_history + item_history

                        context["records"] = [{
                                "barcode":result.barcode,
                                "name":result.name,
                                "checked_in":result.get_checkout_status(verbose=True),
                        } for result in results]

                        context["classroom"] = classroom.__str__()
                        context["category"] = "Assets"

                        return context 

                else:
                        context["result"] = 2

                        return context 

class GemsReqGenerateClassroomInventory(TemplateView):
        template_name = "gems/classroom_inventory.html"
        
        def setup(self, *args, jsonstr, **kwargs):
                super().setup(*args, **kwargs)
                self.jsonstr = jsonstr

        def get_context_data(self, **kwargs):
                context = super().get_context_data(**kwargs)

                search_str =  json.loads(self.jsonstr)
                classroom_id = search_str.get("classroom")
                category = search_str.get("category")

                if category == "Book":
                        try:
                                classroom = get_object_or_404(Classroom, id=classroom_id)

                                results = Book.objects.filter(classroom=classroom)

                                context["records"] = [{
                                       "barcode":result.barcode,
                                       "name":result.name,
                                       "author":result.author,
                                       "publisher":result.publisher,
                                       "isbn":result.isbn,
                                       "checked_in":result.get_checkout_status(verbose=True),
                                       
                                } for result in results]

                                context["classroom"] = classroom.__str__()
                                context["category"] = category

                        except Http404:
                                context["result"] = 1

                        return context

                elif category == "Item":
                        try:
                            classroom = get_object_or_404(Classroom, id=classroom_id)

                            results = Item.objects.filter(classroom=classroom)

                            context["records"] = [{
                                    "barcode":result.barcode,
                                    "name":result.name,
                                    "manufacturer":result.manufacturer,
                                    "model_number":result.model_number,
                                    "serial_number":result.serial_number,
                                    "category":result.category.__str__(),
                                    "checked_in":result.get_checkout_status(verbose=True),
                                    
                            } for result in results]

                            context["classroom"] = classroom.__str__()
                            context["category"] = category

                        except Http404:
                                context["result"] = 1

                        return context
                
                elif category == "All":
                        try:
                                classroom = get_object_or_404(Classroom, id=classroom_id)

                                items = get_list_or_404(Item,
                                        classroom=classroom,
                                )
                                books = get_list_or_404(Book,
                                        classroom=classroom, 
                                )
                                results = items + books

                                context["records"] = [{
                                        "barcode":result.barcode,
                                        "name":result.name,
                                        "checked_in":result.get_checkout_status(verbose=True)
                                } for result in results]

                                context["classroom"] = classroom.__str__()
                                context["category"] = "Assets"

                                return context 

                        except Http404:
                                context["result"] = 1


                else:
                        context["result"] = 2

                        return context 
    
class GemsReqGenerateTestHistory(TemplateView):
        template_name = "gems/test_history.html"
        
        def setup(self, *args, jsonstr, **kwargs):
                super().setup(*args, **kwargs)
                self.jsonstr = jsonstr

        def get_context_data(self, **kwargs):
                context = super().get_context_data(**kwargs)

                search_str =  json.loads(self.jsonstr)
                test_id = search_str.get("test")
                date_from = datetime.date.fromisoformat(search_str.get("date_from"))
                date_to = datetime.date.fromisoformat(search_str.get("date_to"))

                try:
                        test = get_object_or_404(Test, id=test_id)

                        results = get_list_or_404(TestHistory,
                                        test=test,
                                        test_date__range=(date_from,date_to)
                        )

                        context["records"] = [{
                                "IDOC":result.student.IDOC,
                                "last_name":result.student.last_name,
                                "first_name":result.student.first_name,
                                "test":result.test.name,
                                "test_score":result.test_score,
                                "passing_score":result.test.passing_score,
                                "test_date":result.test_date.isoformat(),
                        } for result in results]
                        context["test"] = test.__str__()
                        context["date_from"] = date_from.isoformat()
                        context["date_to"] = date_to.isoformat()

                except Http404:
                        context["result"] = 1

                return context

class GemsReqGenerateDetails(View):
        def get(self, request, jsonstr):
                search_str = json.loads(jsonstr)

                asset_id = search_str.get("id")
                category = search_str.get("category")

                if category == "Book":
                        try:
                                result = get_object_or_404(Book, id=asset_id)

                                data = [{
                                        "name": result.name,
                                        "author":result.author,
                                        "publisher":result.publisher,
                                        "isbn":result.isbn,
                                        "classroom":result.classroom.room_number,
                                        "permit_checkout":result.permit_checkout,
                                        "checkout_duration":result.checkout_duration,
                                        "notes":result.notes,
                                        "description":result.description,
                                },]

                                return JsonResponse(data, safe=False)

                        except Http404:
                                return JsonResponse({"result": 1})

                elif category == "Item":
                        try:
                                result = get_object_or_404(Item, id=asset_id)

                                data = [{
                                        "name": result.name,
                                        "manufacturer":result.manufacturer,
                                        "model_number":result.model_number,
                                        "serial_number":result.serial_number,
                                        "category":result.category.name,
                                        "classroom":result.classroom.room_number,
                                        "permit_checkout":result.permit_checkout,
                                        "checkout_duration":result.checkout_duration,
                                        "notes":result.notes,
                                        "description":result.description,
                                },]

                                return JsonResponse(data, safe=False)

                        except Http404:
                                return JsonResponse({"result": 1})
                else:
                        return JsonResponse({"result":2})

class GemsReqGenerateHistory(View):
        def get(self, request, jsonstr):
                search_str = json.loads(jsonstr)

                asset_id = search_str.get("id")
                category = search_str.get("category")
                data = {}

                if category == "Book":
                        try:
                                results = get_list_or_404(BookCheckout, asset__id=asset_id)

                                data["records"] = [{
                                      "student":result.student.IDOC,
                                      "student_name":result.student.last_name,
                                      "checkout_date":result.checkout_date,
                                      "checkout_by":result.checkout_by,
                                      "checkin_date":result.checkin_date,
                                      "checkin_by":result.checkin_by,
                                      "due_date":result.due_date,
                                }for result in results]
                                data["asset"] = Book.objects.get(id=asset_id).__str__()

                                return JsonResponse(data, safe=False)

                        except Http404:
                                return JsonResponse({"result": 1})

                elif category == "Item":
                        try:
                                results = get_list_or_404(ItemCheckout, asset__id=asset_id)

                                data["records"] = [{
                                      "student":result.student.IDOC,
                                      "student_name":result.student.last_name,
                                      "checkout_date":result.checkout_date,
                                      "checkout_by":result.checkout_by,
                                      "checkin_date":result.checkin_date,
                                      "checkin_by":result.checkin_by,
                                      "due_date":result.due_date,
                                }for result in results]
                                data["asset"] = Item.objects.get(id=asset_id).__str__()

                                return JsonResponse(data, safe=False)

                        except Http404:
                                return JsonResponse({"result": 1})
                else:
                        return JsonResponse({"result":2})

class GemsReqEditEducationalAsset(View):
        def get(self, request, jsonstr):
                #get the record respond with fields
                search_str = json.loads(jsonstr)

                asset_id = search_str.get("id")
                category = search_str.get("category")
                data = {}

                if category == "Book":
                        try:
                                result = get_object_or_404(Book, id=asset_id)
                                classrooms = get_list_or_404(Classroom)

                                data["record"] = {
                                        "id":result.id,
                                        "name":result.name,
                                        "author":result.author,
                                        "publisher":result.publisher,
                                        "isbn":result.isbn,
                                        "classroom":result.classroom.id,
                                        "permit_checkout":result.permit_checkout,
                                        "checkout_duration":result.checkout_duration,
                                        "notes":result.notes,
                                        "description":result.description,
                                }
                                data["classroom_select"] = [{
                                        "id":classroom.id,
                                        "name":classroom.room_number,
                                } for classroom in classrooms]
                                        
                                return JsonResponse(data, safe=False)

                        except Http404:
                                return JsonResponse({"result": 1})

                elif category == "Item":
                        try:
                                result = get_object_or_404(Item, id=asset_id)
                                classrooms = get_list_or_404(Classroom)
                                item_categories = get_list_or_404(ItemCategory)

                                data["record"] = {
                                        "id":result.id,
                                        "name":result.name,
                                        "manufacturer":result.manufacturer,
                                        "model_number":result.model_number,
                                        "serial_number":result.serial_number,
                                        "category":result.category.id,
                                        "classroom":result.classroom.id,
                                        "permit_checkout":result.permit_checkout,
                                        "checkout_duration":result.checkout_duration,
                                        "notes":result.notes,
                                        "description":result.description,
                                }
                                data["classroom_select"] = [{
                                        "id":classroom.id,
                                        "name":classroom.room_number,
                                } for classroom in classrooms]
                                data["item_category_select"] = [{
                                        "id":item_category.id,
                                        "name":item_category.name,
                                } for item_category in item_categories]

                                        
                                return JsonResponse(data, safe=False)

                        except Http404:
                                return JsonResponse({"result": 1})

                else:
                        return JsonResponse({"result": 2})

        
        def post(self, request):
                search_str = json.loads(request.body.decode())

                #if edit make sure to update modified by and modified date log
                asset_id = search_str.get("id")
                category = search_str.get("asset_category")

                if category == "Book":
                        try:
                                book = get_object_or_404(Book, id=asset_id)
                                classroom = get_object_or_404(Classroom, id=search_str.get("classroom"))
                                checkout_duration = search_str.get("checkout_duration") if (search_str.get("checkout_duration") != "") else None 

                                book.name = search_str.get("name")
                                book.author = search_str.get("author")
                                book.publisher = search_str.get("publisher")
                                book.isbn = search_str.get("isbn")
                                book.permit_checkout = search_str.get("permit_checkout")
                                book.checkout_duration = checkout_duration
                                book.classroom = classroom
                                book.notes = search_str.get("notes")
                                book.description = search_str.get("description")
                                book.modified_date = datetime.date.today()
                                book.modified_by = request.user.username
                                
                                book.save()

                                return JsonResponse({"result":0})



                        except Http404:
                                return JsonResponse({"result": 1})

                elif category == "Item":
                        try:
                                item = get_object_or_404(Item, id=asset_id)
                                classroom = get_object_or_404(Classroom, id=search_str.get("classroom"))
                                item_category = get_object_or_404(ItemCategory, id=search_str.get("category"))
                                checkout_duration = search_str.get("checkout_duration") if (search_str.get("checkout_duration") != "") else None 

                                item.name = search_str.get("name")
                                item.manufacturer = search_str.get("manufacturer")
                                item.model_number = search_str.get("model_number")
                                item.serial_number = search_str.get("serial_number")
                                item.category = item_category
                                item.permit_checkout = search_str.get("permit_checkout")
                                item.checkout_duration = checkout_duration
                                item.classroom = classroom
                                item.notes = search_str.get("notes")
                                item.description = search_str.get("description")
                                item.modified_date = datetime.date.today()
                                item.modified_by = request.user.username
                                
                                item.save()

                                return JsonResponse({"result":0})



                        except Http404:
                                return JsonResponse({"result": 1})
                else:
                        return JsonResponse({"result": 2})

class GemsReqDeleteEducationalAsset(View):
        def post(self, request):
                search_str = json.loads(request.body.decode())

                asset_id = search_str.get("id")
                category = search_str.get("category")

                if category == "Book":
                        try:
                                result = get_object_or_404(Book, id=asset_id)

                                result.delete()
                                
                                return JsonResponse({"result": 0})
                        except Http404:
                                return JsonResponse({"result":1})

                elif category == "Item":
                        try:
                                result = get_object_or_404(Item, id=asset_id)

                                result.delete()
                                
                                return JsonResponse({"result": 0})
                                
                        except Http404:
                                return JsonResponse({"result":1})

                else:
                        return JsonResponse({"result": 2})    

class GemsReqAddEducationalAsset(View):

        def get(self, request, jsonstr):
                search_str = json.loads(jsonstr)
                category = search_str.get("category")
                data = {}
                try:
                        #get classroom select for book
                        if category == "Book": 
                                results = get_list_or_404(Classroom)

                                data["classroom_select"] = [{
                                        "id": result.id,
                                        "name":result.room_number,
                                } for result in results]

                                return JsonResponse(data, safe=False)

                        #get classroom select, and category select for item
                        elif category == "Item":
                                results = get_list_or_404(Classroom)

                                data["classroom_select"] = [{
                                        "id": result.id,
                                        "name":result.room_number,
                                } for result in results]

                                results = get_list_or_404(ItemCategory)

                                data["item_category_select"] = [{
                                        "id":result.id,
                                        "name":result.name,
                                } for result in results]

                                return JsonResponse(data, safe=False)
                                
                        else:
                                return JsonResponse({"result": 3})

                except Http404:
                        return JsonResponse({"result": 2})

        def post(self, request):
                search_str = json.loads(request.body.decode())
                category = search_str.get("asset_category")

                if category == "Book":
                        try:
                                classroom = get_object_or_404(Classroom, id=search_str.get("classroom"))

                                last_book = int(Book.objects.last().barcode) 
                                last_item = int(Item.objects.last().barcode)
                                next_barcode = (last_book if last_book > last_item else last_item) + 1
                                checkout_duration = search_str.get("checkout_duration") if (search_str.get("checkout_duration") != "") else None 

                                book = Book.objects.create(
                                        barcode=next_barcode,
                                        name = search_str.get("name"),
                                        author = search_str.get("author"),
                                        publisher = search_str.get("publisher"),
                                        isbn = search_str.get("isbn"),
                                        permit_checkout = search_str.get("permit_checkout"),
                                        checkout_duration = checkout_duration,
                                        classroom = classroom,
                                        notes = search_str.get("notes"),
                                        description = search_str.get("description"),
                                )
                               
                                book.save()

                                return JsonResponse({"result":0, "barcode":next_barcode})


                        except Http404:
                                return JsonResponse({"result": 1})

                elif category == "Item":
                        try:
                                classroom = get_object_or_404(Classroom, id=search_str.get("classroom"))
                                item_category = get_object_or_404(ItemCategory, id=search_str.get("category"))

                                last_book = int(Book.objects.last().barcode) 
                                last_item = int(Item.objects.last().barcode)
                                next_barcode = (last_book if last_book > last_item else last_item) + 1
                                checkout_duration = search_str.get("checkout_duration") if (search_str.get("checkout_duration") != "") else None 

                                item = Item.objects.create(
                                        barcode=next_barcode,
                                        name = search_str.get("name"),
                                        manufacturer=search_str.get("manufacturer"),
                                        model_number=search_str.get("model_number"),
                                        serial_number=search_str.get("serial_number"),
                                        category=item_category,
                                        permit_checkout = search_str.get("permit_checkout"),
                                        checkout_duration = checkout_duration,
                                        classroom = classroom,
                                        notes = search_str.get("notes"),
                                        description = search_str.get("description"),
                                )
                               
                                item.save()

                                return JsonResponse({"result":0, "barcode":next_barcode})

                        except Http404:
                                return JsonResponse({"result": 1})
                else:
                        return JsonResponse({"result": 2})

class GemsReqCopyEducationalAsset(View):
        def post(self, request):
                search_str = json.loads(request.body.decode())
                asset_id = search_str.get("id")
                category = search_str.get("category")

                if category == "Book":
                        try:
                                original  = get_object_or_404(Book, id=asset_id)

                                last_book = int(Book.objects.last().barcode) 
                                last_item = int(Item.objects.last().barcode)
                                next_barcode = (last_book if last_book > last_item else last_item) + 1

                                new_copy = Book.objects.create(
                                        barcode=next_barcode,
                                        name = original.name,
                                        author = original.author,
                                        publisher = original.publisher,
                                        isbn = original.isbn,
                                        permit_checkout = original.permit_checkout,
                                        checkout_duration = original.checkout_duration,
                                        classroom = original.classroom,
                                        description = original.description,
                                )
                               
                                new_copy.save()

                                return JsonResponse({"result":0, "barcode":next_barcode})


                        except Http404:
                                return JsonResponse({"result": 1})

                elif category == "Item":
                        try:
                                original  = get_object_or_404(Item, id=asset_id)

                                last_book = int(Book.objects.last().barcode) 
                                last_item = int(Item.objects.last().barcode)
                                next_barcode = (last_book if last_book > last_item else last_item) + 1

                                new_copy = Item.objects.create(
                                        barcode=next_barcode,
                                        name = original.name,
                                        manufacturer = original.manufacturer,
                                        model_number = original.model_number,
                                        serial_number = original.serial_number,
                                        category = original.category,
                                        permit_checkout = original.permit_checkout,
                                        checkout_duration = original.checkout_duration,
                                        classroom = original.classroom,
                                        description = original.description,
                                )
                               
                                new_copy.save()

                                return JsonResponse({"result":0, "barcode":next_barcode})

                        except Http404:
                                return JsonResponse({"result": 1})
                else:
                        return JsonResponse({"result": 2})

class GemsReqQuickCheckin(View):
        (SUCCESS,NOT_FOUND,ERROR,CURRENTLY_CHECKED_IN) = (0,1,2,3)

        def post(self, request):
                search_str = json.loads(request.body.decode())
                barcode = search_str.get("barcode")
                today = datetime.date.today()
                
                try:
                        asset = get_object_or_404(Book, barcode=barcode)

                        if asset.checked_in == 0:
                                #in case of erroneous records check all and iterate
                                results = BookCheckout.objects.filter(
                                        Q(asset=asset) &
                                        Q(checkin_date__isnull=True)
                                )
                                asset.checked_in = 1
                                asset.save()

                                for result in results:
                                        result.checkin_by = request.user.username
                                        result.checkin_date = today
                                        result.save()

                                return JsonResponse({"result":self.SUCCESS})


                        else:
                                return JsonResponse({"result":self.CURRENTLY_CHECKED_IN})

                except Http404:
                        pass

                try:
                        asset = get_object_or_404(Item, barcode=barcode)

                        if asset.checked_in == 0:
                                #in case of erroneous records check all and iterate
                                results = ItemCheckout.objects.filter(
                                        Q(asset=asset) &
                                        Q(checkin_date__isnull=True)
                                )
                                asset.checked_in = 1
                                asset.save()

                                for result in results:
                                        result.checkin_by = request.user.username
                                        result.checkin_date = today
                                        result.save()

                                return JsonResponse({"result":self.SUCCESS})


                        else:
                                return JsonResponse({"result":self.CURRENTLY_CHECKED_IN})

                except Http404:
                        return JsonResponse({"result":self.NOT_FOUND})

class GemsReqPrintAssetBarcodes(TemplateView):
        
        template_name = "gems/barcodes.html"

        def setup(self,*args,jsonstr,**kwargs):
                super().setup(*args,**kwargs)
                self.jsonstr = jsonstr

        def get_context_data(self,**kwargs):
                context = super().get_context_data(**kwargs)
                context["barcodes"] = json.loads(self.jsonstr).get("barcodes")
                return context

