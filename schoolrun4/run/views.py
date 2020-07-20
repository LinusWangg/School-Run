from django.shortcuts import render
from django.http import HttpResponse,JsonResponse,FileResponse
from django.views import View
from . import models
from utils.response import wrap_json_response,ReturnCode,CommonResponseMixin
from run.models import Trace,Point
from django.core import serializers
import json
import requests
import schoolrun4
import datetime

def get_ip_address(request):
    """
    获取ip地址
    :param request:
    :return:
    """
    ip = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if not ip:
        ip = request.META.get('REMOTE_ADDR', "")
    client_ip = ip.split(",")[-1].strip() if ip else ""
    return client_ip

def Get_Trace(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    open_id = post_data.get('open_id')
    student_id = post_data.get('student_id')
    points = post_data.get('points')
    length = post_data.get('length')
    time_cost = post_data.get('time_cost')
    month = post_data.get('month')
    day = post_data.get('day')
    oripoint = 0
    lastpoint = 0
    for i in range(len(points)):
        new_point = Point(latitude=points[i]['latitude'],longitude=points[i]['longitude'])
        new_point.save()
        if i==0:
            oripoint = new_point.id
        if i==len(points)-1:
            lastpoint = new_point.id
    new_Trace = Trace(start_point = oripoint,end_point = lastpoint,open_id = open_id,student_id = student_id,ip = get_ip_address(request),distance = length,time_cost = time_cost,month = month,day = day)
    new_Trace.save()
    response=wrap_json_response(code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

def draw(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    dataid = post_data.get('dataid')
    Trace = models.Trace.objects.get(pk=dataid)
    point_list = []
    start = Trace.start_point
    end = Trace.end_point
    for i in range(start,end):
        temp = models.Point.objects.get(pk=i)
        point = {'latitude':temp.latitude,'longitude':temp.longitude}
        point_list.append(point)
    print(point_list)
    response=wrap_json_response(data=point_list,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

def draw2(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    start_point = int(post_data.get('start_point'))
    end_point = int(post_data.get('end_point'))
    point_list = []
    for i in range(start_point,end_point):
        temp = models.Point.objects.get(pk=i)
        point = {'latitude':temp.latitude,'longitude':temp.longitude}
        point_list.append(point)
    print(point_list)
    response=wrap_json_response(data=point_list,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

def getmine(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    open_id = post_data.get('open_id')
    student_id = post_data.get('student_id')
    Trace_list = list(models.Trace.objects.filter(student_id=student_id).values('id','student_id','distance','month','day'))
    print(Trace_list)
    response=wrap_json_response(data=Trace_list,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

def runTrace(request):
    runTrace = list(models.runTrace.objects.all().values('start_point','end_point'))
    print(runTrace)
    response=wrap_json_response(data=runTrace,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

