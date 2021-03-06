# Generated by Django 3.0.5 on 2020-10-20 16:37

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import gems.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='JobTitle',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('jobTitle', models.CharField(max_length=35)),
            ],
        ),
        migrations.CreateModel(
            name='SiteSetting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('setting_name', models.CharField(max_length=70)),
                ('setting_value', models.CharField(max_length=70)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('IDOC', models.CharField(max_length=6)),
                ('first_name', models.CharField(max_length=35)),
                ('last_name', models.CharField(max_length=35)),
                ('institution', models.CharField(max_length=35)),
                ('housing_unit', models.CharField(max_length=35)),
                ('entry_date', models.DateField(null=True, verbose_name='Date Entered')),
            ],
        ),
        migrations.CreateModel(
            name='Test',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=75)),
                ('passing_score', models.CharField(max_length=25)),
                ('active', models.BooleanField(default=False, verbose_name='Test active?')),
                ('certificate', models.BooleanField(default=False, verbose_name='Test has a certificate')),
            ],
        ),
        migrations.CreateModel(
            name='UserTimesheet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timeInAM', models.TimeField()),
                ('timeOutAM', models.TimeField()),
                ('timeInPM', models.TimeField()),
                ('timeOutPM', models.TimeField()),
                ('entryDate', models.DateField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['entryDate'],
            },
        ),
        migrations.CreateModel(
            name='UserSetting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('theme', models.FilePathField(path=gems.models.UserSetting.themes_path)),
                ('avatar', models.FilePathField(path=gems.models.UserSetting.images_path)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TestHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('test_score', models.CharField(max_length=25)),
                ('test_date', models.DateField(null=True, verbose_name='Date tested')),
                ('cert_printed', models.BooleanField(default=False, verbose_name='Certificate printed?')),
                ('student_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gems.Student')),
                ('test_name', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='gems.Test')),
            ],
        ),
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('payRate', models.FloatField()),
                ('jobTitle', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='gems.JobTitle')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'permissions': [('can_view_admin_panel', 'Can view the admin panel')],
            },
        ),
        migrations.AddConstraint(
            model_name='usertimesheet',
            constraint=models.UniqueConstraint(fields=('user', 'entryDate'), name='unique_user_timesheet_entry'),
        ),
    ]
