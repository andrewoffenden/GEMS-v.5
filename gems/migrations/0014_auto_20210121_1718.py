# Generated by Django 3.0.5 on 2021-01-21 17:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('gems', '0013_auto_20210111_1647'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='enrollment',
            options={'ordering': ('student__last_name', 'class_timeslot__class_name', 'day'), 'verbose_name': 'Student Enrollment Record', 'verbose_name_plural': 'Student Enrollment Records'},
        ),
        migrations.AlterField(
            model_name='attendance',
            name='enrollment',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='gems.Enrollment'),
        ),
    ]
