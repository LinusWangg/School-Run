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
import time,datetime
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
    student_id = str(post_data.get('student_id'))
    ptime = post_data.get('time')
    dateArray = datetime.datetime.fromtimestamp(ptime/1000)
    otherStyleTime = dateArray.strftime("%m-%d-%H-%M")
    otherStyleTime = otherStyleTime.split('-')
    month = int(otherStyleTime[0])
    day = int(otherStyleTime[1])
    hour = int(otherStyleTime[2])
    minute = int(otherStyleTime[3])
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

    last_post_timestamp = dailypost.objects.filter(open_id=open_id).order_by('-id').first()
    if not last_post_timestamp:
        data={}
        data['is_post']=False
        data['student_id']=student_id
        codeinfo=codemodel.objects.filter(month=month,day=day,hour=hour,minute=minute).first()
        precodeinfo=codemodel.objects.filter(month=month,day=day,hour=prehour,minute=preminute).first()
        aftercodeinfo=codemodel.objects.filter(month=month,day=day,hour=afterhour,minute=afterminute).first()
        if codeinfo:
            if(code==codeinfo.code or code==precodeinfo.code or code==aftercodeinfo.code):
                data['result']=True
                ticks=time.time()
                local_time=time.localtime(time.time())
                new_info=dailypost(open_id=open_id,student_id=student_id,post_time=ptime,latitude=latitude,longitude=longitude,ip=str(ip))
                new_info.save()
                if not Totalpost.objects.filter(open_id=open_id):
                    total=1
                    new_user=Totalpost(open_id=open_id,student_id=student_id,Total_time=total)
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
        response=wrap_json_response(data=data,code=ReturnCode.SUCCESS,message='ok')
        return JsonResponse(data=response,safe=False)
    
    last_post_timestamp = last_post_timestamp.post_time
    dateArray2 = datetime.datetime.fromtimestamp(last_post_timestamp/1000)
    otherStyleTime2 = dateArray2.strftime("%m-%d")
    otherStyleTime2 = otherStyleTime2.split('-')
    month2 = int(otherStyleTime2[0])
    day2 = int(otherStyleTime2[1])

    if month2 != month or day2 != day:
        data={}
        data['is_post']=False
        data['student_id']=student_id
        codeinfo=codemodel.objects.filter(month=month,day=day,hour=hour,minute=minute).first()
        precodeinfo=codemodel.objects.filter(month=month,day=day,hour=prehour,minute=preminute).first()
        aftercodeinfo=codemodel.objects.filter(month=month,day=day,hour=afterhour,minute=afterminute).first()
        if codeinfo:
            if(code==codeinfo.code or code==precodeinfo.code or code==aftercodeinfo.code):
                data['result']=True
                ticks=time.time()
                local_time=time.localtime(time.time())
                new_info=dailypost(open_id=open_id,student_id=student_id,post_time=ptime,latitude=latitude,longitude=longitude,ip=str(ip))
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
    month = datetime.datetime.now().month
    day = datetime.datetime.now().day
    hour = datetime.datetime.now().hour
    minute = datetime.datetime.now().minute // 10
    if not codemodel.objects.filter(month=month,day=day,hour=hour,minute=minute):
        code1 = ''.join(random.sample(string.ascii_letters + string.digits, 8))
        dest = os.path.join(settings.MEDIA_ROOT, "qrcode")
        if not os.path.exists(dest):
            os.mkdir(dest)
        b=code1.encode(encoding='utf-8')
        qr.add_data(b)
        qr.make(fit=True)
        img = qr.make_image()
        imgurl = os.path.join(dest, "qrcode-%d-%d-%d-%d.png" % (month,day,hour,minute))
        img.save(imgurl, "png")
        new_code = codemodel(month=month,day=day,hour=hour,minute=minute,code=code1,url=imgurl)
        new_code.save()
    else:
        imgurl = codemodel.objects.filter(month=month,day=day,hour=hour,minute=minute).first().url
    imgurl  = imgurl[31:]
    print(imgurl)
    return render(request, 'QRCode.html',{'img':imgurl})