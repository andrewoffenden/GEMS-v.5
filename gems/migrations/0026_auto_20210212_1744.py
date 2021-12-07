# Generated by Django 3.0.5 on 2021-02-12 17:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('gems', '0025_auto_20210202_2039'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='checkout_duration',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='item',
            name='checkout_duration',
            field=models.IntegerField(null=True),
        ),
        migrations.CreateModel(
            name='ItemCheckout',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('checkout_by', models.CharField(max_length=12)),
                ('checkout_date', models.DateField()),
                ('checkin_by', models.CharField(max_length=12, null=True)),
                ('checkin_date', models.DateField(null=True)),
                ('due_date', models.DateField()),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gems.Item')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gems.Student')),
            ],
            options={
                'verbose_name': 'Item Checkout Record',
                'verbose_name_plural': 'Item Checkout Records',
                'ordering': ['-checkout_date'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='BookCheckout',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('checkout_by', models.CharField(max_length=12)),
                ('checkout_date', models.DateField()),
                ('checkin_by', models.CharField(max_length=12, null=True)),
                ('checkin_date', models.DateField(null=True)),
                ('due_date', models.DateField()),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gems.Book')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gems.Student')),
            ],
            options={
                'verbose_name': 'Book Checkout Record',
                'verbose_name_plural': 'Book Checkout Records',
                'ordering': ['-checkout_date'],
                'abstract': False,
            },
        ),
    ]