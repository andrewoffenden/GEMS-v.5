# Generated by Django 3.0.5 on 2021-01-11 16:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gems', '0011_housingunit_institution_squashed_0022_auto_20210111_1635'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='enrollment',
            name='unique_enrollment_record',
        ),
        migrations.AddConstraint(
            model_name='enrollment',
            constraint=models.UniqueConstraint(fields=('student', 'day', 'class_timeslot'), name='unique_enrollment_record'),
        ),
    ]