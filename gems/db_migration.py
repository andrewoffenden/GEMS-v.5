
from gems.models import *
import csv
import datetime
from django.core.exceptions import ObjectDoesNotExist, ValidationError
#write function to compile list of csv in directory for functions to iterate through


def migrateStudentTable(file=""):

    with open(file) as csvfile:
        reader = csv.reader(csvfile, delimiter= " ", quotechar="|")

        for row in reader:
            record = row[0].split(',')

            try:
                institution = Institution.objects.get(
                    name=record[4].strip("\"")
                )

            except :
                institution = Institution.objects.get(
                    name='Unknown'
                )
            try:
                entry_date = record[5].strip("\"")

            except:
                entry_date = datetime.date.today()
                
            try:
                print(record)                                                   #TRACE
                
                student = Student.objects.create(
                    IDOC=record[0].strip("\""),
                    last_name=record[1].strip("\""),
                    first_name=record[2].strip("\""),
                    institution=institution,
                    housing_unit=HousingUnit.objects.get(name='Unknown'),
                    entry_date=entry_date,
                )

                student.save()

            except:
                pass

def migrateTestHistoryTable(file=""):

    with open(file) as csvfile:
        reader = csv.reader(csvfile, delimiter= " ", quotechar="|")

        for row in reader:
            record = row[0].split(',')

            print(record)                                                       #TRACE

            try:
                    print(record[1].strip("\""))                                    #TRACE

                    IDOC = int(record[1].strip("\""))
                    student = Student.objects.get(
                        IDOC=IDOC
                        )
                    
                    test_id = record[2].strip("\"")
                    test = Test.objects.get(
                        id=test_id
                        )

                    test_date = datetime.date.fromisoformat(record[4].strip("\""))

                    
            except ObjectDoesNotExist:
                pass
            
            except ValueError:
                print("reached")
                test_date = datetime.date.today()

            finally:
                test_history = TestHistory.objects.create(
                    test = test,
                    student = student,
                    test_score = record[3].strip("\""),
                    test_date = test_date,
                    cert_printed = 1 if (record[5].strip("\"") == "Yes") else 0,
                    )
                test_history.save()

def migrateEducationalAssetTable(file=""):

    with open(file) as csvfile:
        dialect = csv.Sniffer().sniff(csvfile.read(1024))
        csvfile.seek(0)

        reader = csv.reader(csvfile, dialect)

        for row in reader:

            print(row)

            try:
                barcode = row[0]
                name = row[1]
                author = row[2]
                publisher = row[3]
                permit_checkout = row[6]
                classroom = Classroom.objects.get(
                    room_number = row[7]
                )
                notes =row[11]
            
            except ObjectDoesNotExist:
                pass

            finally:
                if author == '' and publisher == '':
                    #presumably an item
                    item = Item.objects.create(
                        barcode = barcode,
                        name = name,
                        permit_checkout = 1 if (permit_checkout == "Yes") else 0,
                        classroom = classroom,

                    )
                    item.save()

                else:
                #probably a book
                    book = Book.objects.create(
                        barcode = barcode,
                        name = name,
                        permit_checkout = 1 if (permit_checkout == "Yes") else 0,
                        classroom = classroom,
                        author = author,
                        publisher = publisher,
                        
                    )
                    book.save()
            
def migrateEducationalAssetCheckout(file=""):
    with open(file) as csvfile:
        dialect = csv.Sniffer().sniff(csvfile.read(1024))
        csvfile.seek(0)

        reader = csv.reader(csvfile, dialect)

        for row in reader:

            print(row)

            try:
                student = Student.objects.get(
                    IDOC = row[1]
                )

            except ObjectDoesNotExist:
                pass

            try:
                #try book first
                asset = Book.objects.get(
                    barcode = row[2]
                )
                asset_category = "Book"

            except ObjectDoesNotExist:
                #try item if book doesn't exist
                asset = Item.objects.get(
                    barcode = row[2]
                )
                asset_category = "Item"

            checkout_date = row[3]
            checkout_by = row[4]

            checkin_by = row[5]
            checkin_date = row[6] if (row[6] != 'NULL') else None
            
            due_date = row[7] if (row[7] != 'NULL') else None

            if checkin_date == None:
                asset.checked_in = 0
                asset.save()

            else:
                asset.checked_in = 1
                asset.save()
        
            if asset_category == "Book":
                record = BookCheckout.objects.create(
                    student = student,
                    asset = asset,
                    checkout_by = checkout_by,
                    checkout_date = checkout_date,
                    checkin_by = checkin_by,
                    checkin_date = checkin_date,
                    due_date = due_date
                )
                record.save()


            else:
                record = ItemCheckout.objects.create(
                    student = student,
                    asset = asset,
                    checkout_by = checkout_by,
                    checkout_date = checkout_date,
                    checkin_by = checkin_by,
                    checkin_date = checkin_date,
                    due_date = due_date
                )
                record.save()


# if __name__ == "__main__":

    #migrateStudentTable(file="tblStudentInfo.csv")
    #migrateTestHistoryTable(file="tblTestHistory.csv")
    #migrateEducationalAssetTable(file="tblBooks.csv")
    #migrateEducationalAssetCheckout(file="tblBookCheckOut.csv")