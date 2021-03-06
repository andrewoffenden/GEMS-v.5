# Generated by Django 3.0.5 on 2020-10-24 17:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('gems', '0004_classroom_day_hour_subject_teacher'),
    ]

    operations = [
        migrations.AlterField(
            model_name='classroom',
            name='room_number',
            field=models.IntegerField(),
        ),
        migrations.CreateModel(
            name='Class',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('classroom', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='gems.Classroom')),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gems.Subject')),
                ('teacher', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='gems.Teacher')),
            ],
        ),
    ]
