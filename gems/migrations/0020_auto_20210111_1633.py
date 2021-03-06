# Generated by Django 3.0.5 on 2021-01-11 16:33

from django.db import migrations, models
import django.db.models.expressions


class Migration(migrations.Migration):

    dependencies = [
        ('gems', '0019_auto_20210111_1630'),
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
