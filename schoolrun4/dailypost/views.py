from django.shortcuts import render
from django.http import HttpResponse,JsonResponse,FileResponse
from django.views import View
from utils.response import wrap_json_response,ReturnCode,CommonResponseMixin
from dailypost.models import dailypost,Totalpost,codemodel
import json
import requests
import schoolrun4
import qrcode
from django.utils.six import BytesIO
import django.utils.timezone as timezone
import hashlib
import time
import random
import string
import datetime
from schoolrun4 import settings
import os
# Create your views here.

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


def check(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    open_id = post_data.get('open_id')
    student_id = post_data.get('student_id')
    hour = post_data.get('hour')
    minute = post_data.get('minute')
    code = post_data.get('code')
    latitude = post_data.get('latitude')
    longitude = post_data.get('longitude')
    ip = get_ip_address(request)
    minute = minute//10
    if minute == 0:
        preminute = 5
        prehour = hour-1
    else:
        preminute = minute-1
        prehour = hour
    if minute == 5:
        afterminute = 0
        afterhour = hour+1
    else:
        afterminute = minute+1
        afterhour = hour
    response={}
    if not open_id or not student_id:
        response['message']='failed'
        response['code']=ReturnCode.BROKEN_AUTHORIZED_DATA
        return JsonResponse(data=response,safe=False)
    
    if not dailypost.objects.filter(open_id=open_id):
        data={}
        data['is_post']=False
        data['student_id']=student_id
        codeinfo=codemodel.objects.filter(hour=hour,minute=minute).first()
        precodeinfo=codemodel.objects.filter(hour=prehour,minute=preminute).first()
        aftercodeinfo=codemodel.objects.filter(hour=afterhour,minute=afterminute).first()
        if codeinfo:
            if(code==codeinfo.code or code==precodeinfo.code or code== aftercodeinfo.code):
                data['result']=True
                ticks=time.time()
                local_time=time.localtime(time.time())
                new_info=dailypost(open_id=open_id,student_id=student_id,post_time=local_time,latitude=latitude,longitude=longitude,ip=ip)
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
                data['result']=False
        else:
            data['result']=False
             
    else:
        data={}
        data['is_post']=True
        data['student_id']=student_id

    response=wrap_json_response(data=data,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)

def makeqrcode(request):

    qr = qrcode.QRCode(
	version=2,
	error_correction=qrcode.constants.ERROR_CORRECT_L,
	box_size=10,
	border=1
    )#设置二维码的大小

    ticks=time.time()
    local_time=time.localtime(time.time())

    hour = datetime.datetime.now().hour
    minute = datetime.datetime.now().minute // 10
    if not codemodel.objects.filter(hour=hour,minute=minute):
        code1 = ''.join(random.sample(string.ascii_letters + string.digits, 8))
        dest = os.path.join(settings.MEDIA_ROOT, "qrcode")
        if not os.path.exists(dest):
            os.mkdir(dest)
        b=code1.encode(encoding='utf-8')
        qr.add_data(b)
        qr.make(fit=True)
        img = qr.make_image()
        imgurl = os.path.join(dest, "qrcode-%d-%d.png" % (hour,minute))
        img.save(imgurl, "png")
        new_code = codemodel(hour=hour,minute=minute,code=code1,url=imgurl)
        new_code.save()
    else:
        imgurl = codemodel.objects.filter(hour=hour,minute=minute).first().url
    print(imgurl)
    return render(request, 'QRCode.html',{'img':imgurl})