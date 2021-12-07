from django.contrib.syndication.views import Feed
from gems.models import Student
from gems import views
#TODO:: remove if not deployed
class NewStudentFeed(Feed):
    title = "New Students"
    link = "/students/"
    description = "Updates on the student database"

    def items(self):
        return Student.objects.order_by('last_name')

    def item_title(self, item):
        return item.last_name

    def item_description(self, item):
        return item.IDOC
  