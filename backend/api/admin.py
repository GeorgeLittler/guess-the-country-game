from django.contrib import admin
from .models import User, Country, ClueCategory, Clue

class ClueAdmin(admin.ModelAdmin):
    list_display = ('text', 'country', 'category', 'status', 'submitted_by', 'created_at')
    list_filter = ('status', 'country', 'category')
    actions = ['approve_clues']

    def approve_clues(self, request, queryset):
        queryset.update(status='approved')
    approve_clues.short_description = "Approve selected clues"

admin.site.register(User)
admin.site.register(Country)
admin.site.register(ClueCategory)
admin.site.register(Clue, ClueAdmin)
