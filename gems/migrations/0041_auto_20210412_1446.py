# Generated by Django 3.0.5 on 2021-04-12 14:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gems', '0040_auto_20210315_1602'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='student',
            options={'ordering': ('IDOC',)},
        ),
        migrations.AddConstraint(
            model_name='student',
            constraint=models.UniqueConstraint(fields=('IDOC',), name='unique_student'),
        ),
    ]
