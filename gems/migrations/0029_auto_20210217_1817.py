# Generated by Django 3.0.5 on 2021-02-17 18:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('gems', '0028_auto_20210212_1756'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='classroom',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='gems.Classroom'),
        ),
        migrations.AlterField(
            model_name='item',
            name='classroom',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='gems.Classroom'),
        ),
    ]