from django.shortcuts import render
from django.http import HttpResponse,JsonResponse,FileResponse
from django.views import View
from django.shortcuts import render
from .import models
from .models import notice
import markdown
from utils.response import wrap_json_response,ReturnCode,CommonResponseMixin
from django.core import serializers
import json
import requests
import schoolrun4
import datetime
import numpy as np
from bson import json_util
import math
# Create your views here.

def content_list(request):
    content_list = notice.objects.all()
    data = []
    for elem in content_list:
        data.append([json_util.dumps(elem.id)[10:34],elem.title,elem.content,elem.creatTime,elem.author])
    response=wrap_json_response(data=data,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

def content(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    contentid = post_data.get('contentid')
    article = notice.objects.get(pk=contentid)
    data = [json_util.dumps(article.id)[10:34],article.title,article.content,article.creattime,article.author]
    response=wrap_json_response(data=data,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)