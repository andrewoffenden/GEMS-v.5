# Generated by Django 3.0.5 on 2021-02-18 17:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('gems', '0030_auto_20210218_1727'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='bookcheckout',
            options={'ordering': ['-checkout_date'], 'verbose_name': 'Book Checkout Record', 'verbose_name_plural': 'Book Checkout Records'},
        ),
        migrations.AlterModelOptions(
            name='itemcheckout',
            options={'ordering': ['-checkout_date'], 'verbose_name': 'Item Checkout Record', 'verbose_name_plural': 'Item Checkout Records'},
        ),
    ]
