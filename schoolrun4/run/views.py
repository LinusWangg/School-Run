from django.shortcuts import render
from django.http import HttpResponse,JsonResponse,FileResponse
from django.views import View
from . import models
from .models import Trace,runTrace
from utils.response import wrap_json_response,ReturnCode,CommonResponseMixin
from django.core import serializers
import json
import requests
import schoolrun4
import datetime
import numpy as np
from bson import json_util

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

def dtw(ts_run,ts_unique,d=lambda x,y: abs(float(x['latitude'])-float(y['latitude']))+abs(float(x['longitude'])-float(y['longitude']))):
    ts_run,ts_unique = np.array(ts_run),np.array(ts_unique)
    M,N = len(ts_run),len(ts_unique)
    cost = np.ones((M,N))

    cost[0,0] = d(ts_run[0],ts_unique[0])
    for i in range(1,M):
        cost[i,0] = cost[i-1,0] + d(ts_run[i],ts_unique[0])

    for j in range(1,N):
        cost[0,j] = cost[0,j-1] + d(ts_run[0],ts_unique[j])

    for i in range(1,M):
        for j in range(1,N):
            choices = cost[i-1,j-1],cost[i,j-1],cost[i-1,j]
            cost[i,j] = min(choices) + d(ts_run[i],ts_unique[j])

    return cost[-1,-1]

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
    #Traceid = post_data.get('id')
    #runTrace = runTrace.objects.get(pk=Traceid).trace
    #print(runTrace)
    #DTW = dtw(runTrace,points)
    #print(DTW)
    new_Trace = Trace(trace = points,open_id = open_id,student_id = student_id,ip = get_ip_address(request),distance = length,time_cost = time_cost,month = month,day = day)
    new_Trace.save()
    response=wrap_json_response(code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

def draw(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    dataid = post_data.get('dataid')
    Trac = Trace.objects.get(pk=dataid).trace
    print(Trac)
    response=wrap_json_response(data=Trac,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

def draw2(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    dataid = post_data.get('dataid')
    Trace = runTrace.objects.get(pk=dataid).trace
    print(Trace)
    response=wrap_json_response(data=Trace,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

def getmine(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    open_id = post_data.get('open_id')
    student_id = post_data.get('student_id')
    Trace_list = []
    for i in Trace.objects.filter(student_id=student_id):
        Trace_list.append([json_util.dumps(i.id)[10:34],i.student_id,i.distance,i.month,i.day])
    print(Trace_list)
    response=wrap_json_response(data=Trace_list,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

def ruTrace(request):
    rTrace = []
    for i in runTrace.objects.all():
        rTrace.append([json_util.dumps(i.id)[10:34]])
    print(rTrace)
    response=wrap_json_response(data=rTrace,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

