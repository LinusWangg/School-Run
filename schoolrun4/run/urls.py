"""schoolrun4 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path,include
from run import views
from django.conf.urls.static import static
from django.views.static import serve
from django.conf.urls import url
from schoolrun4 import settings

urlpatterns = [
    path('Trace',views.Get_Trace,name='Trace'),
    path('Draw',views.draw,name='Draw'),
    path('Draw2',views.draw2,name='Draw2'),
    path('getmine',views.getmine,name='getmine'),
    path('runTrace',views.runTrace,name='runTrace'),
]