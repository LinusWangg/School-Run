from django.shortcuts import render
from django.http import HttpResponse,JsonResponse,FileResponse
from django.views import View
from utils.response import wrap_json_response,ReturnCode,CommonResponseMixin
from login.models import User
import json
import requests
import schoolrun4
import qrcode
from django.utils.six import BytesIO
import django.utils.timezone as timezone
import hashlib
import time
from dailypost.models import Totalpost
# Create your views here.

def already_authorized(request):
    is_authorized=False

    if request.session.get('is_authorized'):
        is_authorized=True
    return is_authorized

def get_user(request):
    if not already_authorized(requests):
        raise Exception('not authorized request')
    open_id = request.session.get('open_id')
    user=User.objects.get(open_id=open_id)
    return user

def hello(request):
    print('request method:',request.method)
    print('request META:',request.META)
    return HttpResponse(content='OK',status=200)

class UserView(View, CommonResponseMixin):
    def get(self,request):
        if not already_authorized(request):
            response=self.wrap_json_response(code=ReturnCode.SUCCESS)
            return JsonResponse(data=response,safe=False)
        open_id=request.session.get('open_id')
        user=User.objects.get(open_id=open_id)
        data={}
        data['student_id']=json.loads(user.student_id)
        response=self.wrap_json_response(data=data,code=ReturnCode.SUCCESS,message='ok')
        return JsonResponse(data=response,safe=False)

    def post(self,request):
        if not already_authorized(request):
            response=self.wrap_json_response(code=ReturnCode.SUCCESS)
            return JsonResponse(data=response,safe=False)
        open_id=request.session.get('open_id')
        user=User.objects.get(open_id=open_id)

        received_body=request.body.decode('utf-8')
        received_body=eval(received_body)

        student_id=received_body.get('student_id')

        user.student_id=student_id

        response=self.wrap_json_response(data=data,code=ReturnCode.SUCCESS,message='modify')
        return JsonResponse(data=response,safe=False)

def c2s(appid,code):
    API='https://api.weixin.qq.com/sns/jscode2session'
    params = 'appid=%s&secret=%s&js_code=%s&grant_type=authorization_code' % \
         (appid, schoolrun4.settings.WX_APP_SECRET, code)
    url=API+'?'+params
    response=requests.get(url=url)
    data=json.loads(response.text)
    print(data)
    return data

def __authorize_by_code(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    code = post_data.get('code')
    app_id = post_data.get('appid')
    student_id = post_data.get('student_id')
    is_submit = post_data.get('is_submit')
    response={}
    if not code or not app_id:
        response['message']='failed'
        response['code']=ReturnCode.BROKEN_AUTHORIZED_DATA
        return JsonResponse(data=response,safe=False)
    data=c2s(app_id,code)
    openid=data.get('openid')
    print('get openid:',openid)
    if not openid:
        response=wrap_json_response(code=ReturnCode.FAILED,message='auth failed')
        return JsonResponse(data=response,safe=False)
    
    request.session['open_id']=openid
    request.session['is_authorized']=True

    if not User.objects.filter(open_id=openid):
        new_user=User(open_id=openid,student_id=student_id,is_register=is_submit)
        print('new user:openid:%s,student_id:%s'%(openid,student_id))
        new_user.save()

    response=wrap_json_response(code=ReturnCode.SUCCESS,message='auth success')
    return JsonResponse(data=response,safe=False)
    


def authorize(request):
    return __authorize_by_code(request)

def _flash_(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    code = post_data.get('code')
    app_id = post_data.get('appid')
    response={}
    if not code or not app_id:
        response['message']='failed'
        response['code']=ReturnCode.BROKEN_AUTHORIZED_DATA
        return JsonResponse(data=response,safe=False)
    data=c2s(app_id,code)
    openid=data.get('openid')
    if not openid:
        response=wrap_json_response(code=ReturnCode.FAILED,message='auth failed')
        return JsonResponse(data=response,safe=False)

    request.session['open_id']=openid
    request.session['is_authorized']=True

    user=User.objects.get(open_id=openid)
    data={}
    data['student_id']=json.loads(user.student_id)
    data['is_register']=user.is_register
    data['open_id']=user.open_id
    response=wrap_json_response(data=data,code=ReturnCode.SUCCESS,message='ok')
    return JsonResponse(data=response,safe=False)


def md(url):
    md5 = hashlib.md5()
    md5.update(url.encode())
    result = md5.hexdigest()
    return result

def makeqrcode(request):

    qr = qrcode.QRCode(
	version=2,
	error_correction=qrcode.constants.ERROR_CORRECT_L,
	box_size=10,
	border=1
    )#设置二维码的大小

    ticks=time.time()
    local_time=time.localtime(time.time())

    code="nuaa-001-"
    code+=time.strftime("%Y%m%d%H",local_time)
    min=int(time.strftime("%M",local_time))
    min=int(min/10)
    code+=str(min)
    b=code.encode(encoding='utf-8')
    m=hashlib.md5()
    m.update(b)
    src=m.hexdigest()
    qr.add_data(src)
    qr.make(fit=True)
    img = qr.make_image()
    buf = BytesIO()
    img.save(buf)
    image_stream = buf.getvalue()
    response = HttpResponse(image_stream,content_type="image/jpg")
    return response

def getinfo(request):
    post_data = request.body.decode("utf-8")
    post_data = json.loads(post_data)
    code = post_data.get('code')
    app_id = post_data.get('appid')
    response={}
    if not code or not app_id:
        response['message']='failed'
        response['code']=ReturnCode.BROKEN_AUTHORIZED_DATA
        return JsonResponse(data=response,safe=False)
    data=c2s(app_id,code)
    openid=data.get('openid')
    if not openid:
        response=wrap_json_response(code=ReturnCode.FAILED,message='auth failed')
        return JsonResponse(data=response,safe=False)

    request.session['open_id']=openid
    request.session['is_authorized']=True

    user=User.objects.filter(open_id=openid).first()
    total=Totalpost.objects.filter(open_id=openid).first()

    if not user:
        data={}
        data['is_register']=False
        response=wrap_json_response(data=data,code=ReturnCode.SUCCESS,message='ok')
        return JsonResponse(data=response,safe=False)

    else:
        data={}
        data['is_register']=True
        data['open_id']=user.open_id
        data['student_id']=json.loads(user.student_id)
        data['time']=total.Total_time
        response=wrap_json_response(data=data,code=ReturnCode.SUCCESS,message='ok')
        return JsonResponse(data=response,safe=False)