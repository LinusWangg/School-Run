from django.shortcuts import render
from django.http import HttpResponse,JsonResponse,FileResponse
from django.views import View
from utils.response import wrap_json_response,ReturnCode,CommonResponseMixin
from dailypost.models import dailypost,Totalpost
import json
import requests
import schoolrun4
from django.utils.six import BytesIO
import django.utils.timezone as timezone
import hashlib
import time

# Create your views here.

def check(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    open_id = post_data.get('open_id')
    student_id = post_data.get('student_id')
    response={}
    if not open_id or not student_id:
        response['message']='failed'
        response['code']=ReturnCode.BROKEN_AUTHORIZED_DATA
        return JsonResponse(data=response,safe=False)
    
    if not dailypost.objects.filter(open_id=open_id):
        data={}
        data['is_post']=False
        data['student_id']=student_id
        ticks=time.time()
        local_time=time.localtime(time.time())
        new_info=dailypost(open_id=open_id,student_id=student_id,post_time=local_time)
        print('new info:openid:%s,student_id:%s'%(open_id,student_id))
        new_info.save()
        if not Totalpost.objects.filter(open_id=open_id):
            total=1
            new_user=Totalpost(open_id=open_id,student_id=student_id,Total_time=total)
            print('new user:openid:%s,student_id:%s'%(open_id,student_id))
            new_user.save()
        else:
            temp=Totalpost.objects.filter(open_id=open_id).first()
            temptime=temp.Total_time
            temp.Total_time=temptime+1
            temp.save()
    
    else:
        data={}
        data['is_post']=True
        data['student_id']=student_id

    response=wrap_json_response(data=data,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

