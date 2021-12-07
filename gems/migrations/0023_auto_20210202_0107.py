# Generated by Django 3.0.5 on 2021-02-02 01:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('gems', '0022_auto_20210123_1648'),
    ]

    operations = [
        migrations.CreateModel(
            name='ItemCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=45)),
            ],
        ),
        migrations.AlterModelOptions(
            name='attendance',
            options={'ordering': ('-scan_date', '-scan_time'), 'verbose_name': 'Student Attendance Record', 'verbose_name_plural': 'Student Attendance Records'},
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=125)),
                ('barcode', models.CharField(max_length=8)),
                ('notes', models.TextField()),
                ('description', models.TextField()),
                ('permit_checkout', models.BooleanField()),
                ('entry_date', models.DateField(auto_now_add=True)),
                ('entered_by', models.CharField(max_length=8)),
                ('modified_date', models.DateField()),
                ('modified_by', models.CharField(max_length=8)),
                ('model_number', models.CharField(max_length=45)),
                ('serial_number', models.CharField(max_length=45)),
                ('manufacturer', models.CharField(max_length=45)),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='gems.ItemCategory')),
                ('classroom', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='gems.Classroom')),
            ],
            options={
                'verbose_name': 'Classroom Asset Record',
                'verbose_name_plural': 'Classroom Asset Records',
                'ordering': ('barcode',),
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=125)),
                ('barcode', models.CharField(max_length=8)),
                ('notes', models.TextField()),
                ('description', models.TextField()),
                ('permit_checkout', models.BooleanField()),
                ('entry_date', models.DateField(auto_now_add=True)),
                ('entered_by', models.CharField(max_length=8)),
                ('modified_date', models.DateField()),
                ('modified_by', models.CharField(max_length=8)),
                ('author', models.CharField(max_length=45)),
                ('isbn', models.CharField(max_length=45)),
                ('publisher', models.CharField(max_length=45)),
                ('classroom', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='gems.Classroom')),
            ],
            options={
                'verbose_name': 'Book Record',
                'verbose_name_plural': 'Book Records',
                'ordering': ('barcode',),
                'abstract': False,
            },
        ),
        migrations.AddConstraint(
            model_name='item',
            constraint=models.UniqueConstraint(fields=('barcode',), name='unique_item_record'),
        ),
        migrations.AddConstraint(
            model_name='book',
            constraint=models.UniqueConstraint(fields=('barcode',), name='unique_book_record'),
        ),
    ]