from django.contrib import admin
from django.urls import path,include
from django.conf.urls.static import static
from django.views.static import serve
from django.conf.urls import url
from schoolrun4 import settings
from forum import views

urlpatterns = [
    path('content_list',views.content_list,name='content_list'),
    path('content',views.content,name='content'),
]