# apps/urls.py

from django.urls import path
from . import apps

urlpatterns = [
    # layer 1
    # interface 1
    path('camp/retrieveAllCamps', apps.retrieveAllCamps, name='retrieveAllCamps'),

    # layer 2
    # interface 2.1
    path('camp/addCamp', apps.addCamp, name='addCamp'),
    # interface 2.1.1
    path('pic/uploadPic', apps.uploadPic, name='uploadPic'),

    # interface 2.2
    path('camp/retrieveCamp', apps.retrieveCamp, name='retrieveCamp'),
    # interface 2.2.1
    path('pic/retrievePics', apps.retrievePics, name='retrievePics'),

    # layer 3
    # interface 3.1
    path('comment/retrieveComments', apps.retrieveComments, name='retrieveComments'),
    # interface 3.2
    path('comment/addComment', apps.commentAdd, name='addComment'),

]
