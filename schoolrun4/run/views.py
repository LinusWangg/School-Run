from django.shortcuts import render
from django.http import HttpResponse,JsonResponse,FileResponse
from django.views import View
from . import models
from .models import Trace,base_trace,TotalPost
from utils.response import wrap_json_response,ReturnCode,CommonResponseMixin
from django.core import serializers
import json
import requests
import schoolrun4
import datetime
import numpy as np
from bson import json_util
import math

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

def cal_ang(point_1, point_2, point_3):
    """
    根据三点坐标计算夹角
    :param point_1: 点1坐标
    :param point_2: 点2坐标
    :param point_3: 点3坐标
    :return: 返回任意角的夹角值，这里只是返回点2的夹角
    """
    a=math.sqrt((point_2['latitude']-point_3['latitude'])*(point_2['latitude']-point_3['latitude'])+(point_2['longitude']-point_3['longitude'])*(point_2['longitude'] - point_3['longitude']))
    b=math.sqrt((point_1['latitude']-point_3['latitude'])*(point_1['latitude']-point_3['latitude'])+(point_1['longitude']-point_3['longitude'])*(point_1['longitude'] - point_3['longitude']))
    c=math.sqrt((point_1['latitude']-point_2['latitude'])*(point_1['latitude']-point_2['latitude'])+(point_1['longitude']-point_2['longitude'])*(point_1['longitude'] - point_2['longitude']))
    if(a==0 or b==0 or c==0):
        B=0
        A=0
        C=0
    else:
        if((b*b-a*a-c*c)/(-2*a*c)>1):
            temp = 0.99999999999
        elif((b*b-a*a-c*c)/(-2*a*c)<-1):
            temp = -0.99999999999
        else:
            temp = (b*b-a*a-c*c)/(-2*a*c)
        B=math.degrees(math.acos(temp))
    return B

def clear(In):
    out = []
    N = len(In)
    ER = 6378
    out.append(In[0])
    for i in range(1,N-1):
        lat1 = In[i-1]['latitude'] * math.pi / 180
        lng1 = In[i-1]['longitude'] * math.pi / 180
        lat2 = In[i]['latitude'] * math.pi / 180
        lng2 = In[i]['longitude'] * math.pi / 180
        lat3 = In[i+1]['latitude'] * math.pi / 180
        lng3 = In[i+1]['longitude'] * math.pi / 180
        angle = cal_ang(In[i-1],In[i],In[i+1])

        Cos1 = math.cos(lat2) * math.cos(lat1) * math.cos(lng2 -lng1) + math.sin(lat1) * math.sin(lat2)
        dis1 = ER*math.acos(Cos1)

        Cos2 = math.cos(lat3) * math.cos(lat2) * math.cos(lng3 -lng2) + math.sin(lat2) * math.sin(lat3)
        dis2 = ER*math.acos(Cos2)

        if((angle <= 80 and angle != 0) or (dis1 >= 0.03 and dis2 >= 0.03)):
            continue
        else:
            out.append(In[i])
    out.append(In[N-1])
    return out


def linersmooth(In):
    out = [{'latitude':0,'longitude':0,'time':0} for x in range(0,len(In))]
    N = len(In)
    if(len(In) < 7):
        out = In
        return out
    else:
        out[0]['latitude'] = ( 13.0 * In[0]['latitude'] + 10.0 * In[1]['latitude'] + 7.0 * In[2]['latitude'] + 4.0 * In[3]['latitude'] + In[4]['latitude'] - 2.0 * In[5]['latitude'] - 5.0 * In[6]['latitude'] ) / 28.0

        out[1]['latitude'] = ( 5.0 * In[0]['latitude'] + 4.0 * In[1]['latitude'] + 3 * In[2]['latitude'] + 2 * In[3]['latitude'] + In[4]['latitude'] - In[6]['latitude'] ) / 14.0

        out[2]['latitude'] = ( 7.0 * In[0]['latitude'] + 6.0 * In[1]['latitude'] + 5.0 * In[2]['latitude'] + 4.0 * In[3]['latitude'] + 3.0 * In[4]['latitude'] + 2.0 * In[5]['latitude'] + In[6]['latitude'] ) / 28.0

        for i in range(3,N-3):
            out[i]['latitude'] = ( In[i - 3]['latitude'] + In[i - 2]['latitude'] + In[i - 1]['latitude'] + In[i]['latitude'] + In[i + 1]['latitude'] + In[i + 2]['latitude'] + In[i + 3]['latitude'] ) / 7.0;

        out[N - 3]['latitude'] = ( 7.0 * In[N - 1]['latitude'] + 6.0 * In[N - 2]['latitude'] + 5.0 * In[N - 3]['latitude'] + 4.0 * In[N - 4]['latitude'] + 3.0 * In[N - 5]['latitude'] + 2.0 * In[N - 6]['latitude'] + In[N - 7]['latitude'] ) / 28.0

        out[N - 2]['latitude'] = ( 5.0 * In[N - 1]['latitude'] + 4.0 * In[N - 2]['latitude'] + 3.0 * In[N - 3]['latitude'] + 2.0 * In[N - 4]['latitude'] + In[N - 5]['latitude'] - In[N - 7]['latitude'] ) / 14.0

        out[N - 1]['latitude'] = ( 13.0 * In[N - 1]['latitude'] + 10.0 * In[N - 2]['latitude'] + 7.0 * In[N - 3]['latitude'] + 4 * In[N - 4]['latitude'] + In[N - 5]['latitude'] - 2 * In[N - 6]['latitude'] - 5 * In[N - 7]['latitude'] ) / 28.0

        out[0]['longitude'] = ( 13.0 * In[0]['longitude'] + 10.0 * In[1]['longitude'] + 7.0 * In[2]['longitude'] + 4.0 * In[3]['longitude'] + In[4]['longitude'] - 2.0 * In[5]['longitude'] - 5.0 * In[6]['longitude'] ) / 28.0

        out[1]['longitude'] = ( 5.0 * In[0]['longitude'] + 4.0 * In[1]['longitude'] + 3 * In[2]['longitude'] + 2 * In[3]['longitude'] + In[4]['longitude'] - In[6]['longitude'] ) / 14.0

        out[2]['longitude'] = ( 7.0 * In[0]['longitude'] + 6.0 * In[1]['longitude'] + 5.0 * In[2]['longitude'] + 4.0 * In[3]['longitude'] + 3.0 * In[4]['longitude'] + 2.0 * In[5]['longitude'] + In[6]['longitude'] ) / 28.0

        for i in range(3,N-3):
            out[i]['longitude'] = ( In[i - 3]['longitude'] + In[i - 2]['longitude'] + In[i - 1]['longitude'] + In[i]['longitude'] + In[i + 1]['longitude'] + In[i + 2]['longitude'] + In[i + 3]['longitude'] ) / 7.0;

        out[N - 3]['longitude'] = ( 7.0 * In[N - 1]['longitude'] + 6.0 * In[N - 2]['longitude'] + 5.0 * In[N - 3]['longitude'] + 4.0 * In[N - 4]['longitude'] + 3.0 * In[N - 5]['longitude'] + 2.0 * In[N - 6]['longitude'] + In[N - 7]['longitude'] ) / 28.0

        out[N - 2]['longitude'] = ( 5.0 * In[N - 1]['longitude'] + 4.0 * In[N - 2]['longitude'] + 3.0 * In[N - 3]['longitude'] + 2.0 * In[N - 4]['longitude'] + In[N - 5]['longitude'] - In[N - 7]['longitude'] ) / 14.0

        out[N - 1]['longitude'] = ( 13.0 * In[N - 1]['longitude'] + 10.0 * In[N - 2]['longitude'] + 7.0 * In[N - 3]['longitude'] + 4 * In[N - 4]['longitude'] + In[N - 5]['longitude'] - 2 * In[N - 6]['longitude'] - 5 * In[N - 7]['longitude'] ) / 28.0
        
        for i in range(0,N):
            out[i]['time'] = In[i]['time']
        
        return out
def Get_Trace(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    open_id = post_data.get('open_id')
    student_id = str(post_data.get('student_id'))
    points = post_data.get('points')
    length = post_data.get('length')
    time_cost = post_data.get('time_cost')
    month = post_data.get('month')
    day = post_data.get('day')
    Traceid = post_data.get('id')
    data = {}
    if not Trace.objects.filter(open_id = open_id,month = month,day = day):
        data['is_post'] = False
        rTrace = base_trace.objects.get(pk=Traceid).trace
        DTW = dtw(rTrace,points)
        print(DTW)
        if(DTW <= 0.03 and length >= 2):
            data['success'] = True
            new_Trace = Trace(base_id = Traceid,trace = points,open_id = open_id,student_id = student_id,ip = get_ip_address(request),distance = length,time_cost = time_cost,month = month,day = day,DTW = DTW)
            new_Trace.save()
            if not TotalPost.objects.filter(open_id = open_id):
                total = 1
                new_user=TotalPost(open_id=open_id,student_id=student_id,Total_time=total)
                new_user.save()
            else:
                temp=TotalPost.objects.filter(open_id=open_id).first()
                temptime=temp.Total_time
                temp.Total_time=temptime+1
                temp.save()
        else:
            data['success'] = False
    else:
        #data['is_post'] = True
        data['is_post'] = False
        rTrace = base_trace.objects.get(pk=Traceid).trace
        DTW = dtw(rTrace,points)
        print(DTW)
        if(DTW <= 0.03 and length >= 2):
            data['success'] = True
            new_Trace = Trace(trace = points,open_id = open_id,student_id = student_id,ip = get_ip_address(request),distance = length,time_cost = time_cost,month = month,day = day,DTW = DTW)
            new_Trace.save()
            if not TotalPost.objects.filter(open_id = open_id):
                total = 1
                new_user=TotalPost(open_id=open_id,student_id=student_id,Total_time=total)
                new_user.save()
            else:
                temp=TotalPost.objects.filter(open_id=open_id).first()
                temptime=temp.Total_time
                temp.Total_time=temptime+1
                temp.save()
        else:
            data['success'] = False
    response=wrap_json_response(data=data,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

def Get_Trace2(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    open_id = post_data.get('open_id')
    student_id = str(post_data.get('student_id'))
    points = post_data.get('points')
    length = post_data.get('length')
    time_cost = post_data.get('time_cost')
    month = post_data.get('month')
    day = post_data.get('day')
    new_Trace = Trace(trace = points,open_id = open_id,student_id = student_id,ip = get_ip_address(request),distance = length,time_cost = time_cost,month = month,day = day)
    new_Trace.save()
    response=wrap_json_response(code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

def draw(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    dataid = post_data.get('dataid')
    Trac = Trace.objects.get(pk=dataid).trace
    response=wrap_json_response(data=Trac,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

def draw2(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    dataid = post_data.get('dataid')
    Trace = base_trace.objects.get(pk=dataid).trace
    response=wrap_json_response(data=Trace,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

def getmine(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    open_id = post_data.get('open_id')
    student_id = str(post_data.get('student_id'))
    Trace_list = []
    for i in Trace.objects.filter(student_id=student_id):
        Trace_list.append([json_util.dumps(i.id)[10:34],i.student_id,i.distance,i.month,i.day,i.DTW])
    print(Trace_list)
    response=wrap_json_response(data=Trace_list,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

def ruTrace(request):
    rTrace = []
    for i in base_trace.objects.all():
        rTrace.append([json_util.dumps(i.id)[10:34]])
    print(rTrace)
    response=wrap_json_response(data=rTrace,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

def Trans(request):
    Oid = '5f166b4eaf2ec19d2082cea4'
    temp = Trace.objects.get(pk=Oid).trace
    temp = clear(temp)
    temp = linersmooth(temp)
    temp = linersmooth(temp)
    new_run = base_trace(trace = temp)
    new_run.save()
    response=wrap_json_response(code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

def Cal(request):
    Oid1 = '5f166b4eaf2ec19d2082cea4'
    Oid2 = '5f16693eaf2ec19d2082cea3'
    temp1 = Trace.objects.get(pk=Oid1).trace
    temp2 = Trace.objects.get(pk=Oid2).trace
    DTW = dtw(temp1,temp2)
    response=wrap_json_response(data=DTW,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)