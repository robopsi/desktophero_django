import uuid
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

def generate_filename_js(instance, filename):
    return 'meshes/{}_{}.js'.format(instance.name, uuid.uuid4())

def generate_bone_group_filename_js(instance, filename):
    return 'bone_groups/{}_{}.js'.format(instance.name, uuid.uuid4())

def generate_pose_filename_js(instance, filename):
    return 'poses/{}_{}.js'.format(instance.name, uuid.uuid4())

def generate_preset_filename_js(instance, filename):
    return 'presets/{}_{}.js'.format(instance.name, uuid.uuid4())

def generate_filename_png(instance, filename):
    return 'thumbnails/{}_{}.jpg'.format(instance.name, uuid.uuid4())

def generate_processing_filename_stl(instance, filename):
    return 'processing/{}_{}.stl'.format(instance.name, uuid.uuid4())

def generate_processing_filename_obj(instance, filename):
    return 'processing/{}_{}.obj'.format(instance.name, uuid.uuid4())

LICENSE_CHOICES = (
    ('CC0', 'Creative Commons - Public Domain Dedication'),
    ('CC BY', 'Creative Commons - Attribution'),
    ('CC BY-SA', 'Creative Commons - Attribution - Share Alike'),
    ('CC BY-ND', 'Creative Commons - Attribution - No Derivatives'),
    ('CC BY-NC', 'Creative Commons - Attribution - Non-Commercial'),
    ('CC BY-NC-SA', 'Creative Commons - Attribution - Non-Commercial - Share Alike'),
    ('CC BY-NC-ND', 'Creative Commons - Attribution - Non-Commercial - No Derivatives')
)

LIBRARY_CHOICES = (
    ('official', 'official'),
    ('user_gen', 'user_generated')
)

PROCESSING_STATUS_CHOICES = (
    ('waiting', 'waiting'),
    ('processing', 'processing'),
    ('complete', 'complete'),
    ('error', 'error')
)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    subscribed = models.BooleanField(default=True)
    accepted_terms = models.NullBooleanField(null=True)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class Asset(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=30, blank=False)
    description = models.CharField(max_length=250, blank=True)
    author = models.ForeignKey(User)
    date_created = models.DateField(auto_now_add=True)
    category = models.CharField(max_length=30, default='unknown')
    thumbnail = models.FileField(upload_to=generate_filename_png)
    mesh = models.FileField(upload_to=generate_filename_js, blank=False)
    mesh_lowres = models.FileField(upload_to=generate_filename_js, null=True)
    mesh_hires = models.FileField(upload_to=generate_filename_js, null=True)
    license = models.CharField(max_length=14, choices=LICENSE_CHOICES, default='CC BY')
    reviewed = models.BooleanField(default=False)
    library = models.CharField(max_length=10, choices=LIBRARY_CHOICES, default='user_gen')
    published = models.BooleanField(default=False)

    def __str__(self):
        return '{}: {} by {}.'.format('Reviewed' if self.reviewed else 'Needs review',
                                      self.name,
                                      self.author)
    def category_safe(self):
        return self.category.replace(' ', '_')

class AssetForProcessing(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=30, blank=False)
    description = models.CharField(max_length=250, blank=True)
    author = models.ForeignKey(User)
    date_created = models.DateField(auto_now_add=True)
    category = models.CharField(max_length=30, default='unknown')
    mesh = models.FileField(upload_to=generate_processing_filename_obj, null=True)
    license = models.CharField(max_length=14, choices=LICENSE_CHOICES, default='CC BY')
    rigid = models.BooleanField(default=True)
    attachToGroup = models.CharField(max_length=30)
    attachToBone = models.CharField(max_length=30) # only filled if rigid is true
    px = models.FloatField(default=0.0);
    py = models.FloatField(default=0.0);
    pz = models.FloatField(default=0.0);
    rx = models.FloatField(default=0.0);
    ry = models.FloatField(default=0.0);
    rz = models.FloatField(default=0.0);
    sx = models.FloatField(default=1.0);
    sy = models.FloatField(default=1.0);
    sz = models.FloatField(default=1.0);

    processing_started = models.DateField(null=True)
    processing_finished = models.DateField(null=True)
    status = models.CharField(max_length=14, choices=PROCESSING_STATUS_CHOICES, default='waiting')
    message = models.CharField(max_length=100, blank=True)

    def category_safe(self):
        return self.category.replace(' ', '_')


class BoneGroup(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=30, blank=False)
    description = models.CharField(max_length=250, blank=True)
    author = models.ForeignKey(User)
    categories = models.CharField(max_length=300)
    date_created = models.DateField(auto_now_add=True)
    thumbnail = models.FileField(upload_to=generate_filename_png)
    file = models.FileField(upload_to=generate_bone_group_filename_js, blank=False)
    license = models.CharField(max_length=14, choices=LICENSE_CHOICES, default='CC BY')
    reviewed = models.BooleanField(default=False)
    library = models.CharField(max_length=10, choices=LIBRARY_CHOICES, default='user_gen')

    def name_safe(self):
        return self.name.replace(' ', '_')

    def categories_safe(self):
        return self.categories.replace(' ', '_')

class Pose(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=30, blank=False)
    description = models.CharField(max_length=250, blank=True)
    author = models.ForeignKey(User)
    category = models.CharField(max_length=30, default="full")
    date_created = models.DateField(auto_now_add=True)
    thumbnail = models.FileField(upload_to=generate_filename_png)
    file = models.FileField(upload_to=generate_pose_filename_js, blank=False)
    license = models.CharField(max_length=14, choices=LICENSE_CHOICES, default='CC BY')
    reviewed = models.BooleanField(default=False)
    library = models.CharField(max_length=10, choices=LIBRARY_CHOICES, default='user_gen')

class Preset(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=30, blank=False)
    description = models.CharField(max_length=250, blank=True)
    author = models.ForeignKey(User)
    category = models.CharField(max_length=30, blank=True)
    date_created = models.DateField(auto_now_add=True)
    thumbnail = models.FileField(upload_to=generate_filename_png)
    file = models.FileField(upload_to=generate_preset_filename_js, blank=False)
    license = models.CharField(max_length=14, choices=LICENSE_CHOICES, default='CC BY')
    reviewed = models.BooleanField(default=False)
    library = models.CharField(max_length=10, choices=LIBRARY_CHOICES, default='user_gen')

