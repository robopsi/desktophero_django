# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from resources.models import Asset, BoneGroup, Pose, Preset

class AssetAdmin(admin.ModelAdmin):
	list_display = ('name', 'author', 'thumbnail', 'reviewed', 'category')
	list_filter = ('reviewed', 'author', 'category')
	list_per_page = 1000

	def mark_reviewed(modeladmin, request, queryset):
		queryset.update(reviewed=True)
	mark_reviewed.short_description = 'Mark reviewed'

class BoneGroupAdmin(admin.ModelAdmin):
	pass

class PoseAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'description', 'author', 'category', 'date_created', 'thumbnail', 'file', 'license', 'reviewed', 'library')
	list_filter = ('author', 'category')
	list_per_page = 1000
	pass

class PresetAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'description', 'author', 'category', 'date_created', 'thumbnail', 'file', 'license', 'reviewed', 'library')
	list_filter = ('author', 'category')
	list_per_page = 1000
	pass

admin.site.register(Asset, AssetAdmin)
admin.site.register(BoneGroup, BoneGroupAdmin)
admin.site.register(Pose, PoseAdmin)
admin.site.register(Preset, PresetAdmin)