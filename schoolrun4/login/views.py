from django.shortcuts import render
from django.http import HttpResponse,JsonResponse,FileResponse
from django.views import View
from utils.response import wrap_json_response,ReturnCode,CommonResponseMixin
import json
import requests
import schoolrun4

# Create your views here.

def hello(request):
    print('request method:',request.method)
    print('request META:',request.META)
    return HttpResponse(content='OK',status=200)

class UserView(View, CommonResponseMixin):
    def get(self,request):
        pass
    
    def post(self,request):
        pass

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
    nickname = post_data.get('nickname')

    response={}
    if not code or not app_id:
        response['message']='failed'
        response['code']=ReturnCode.BROKEN_AUTHORIZED_DATA
        return JsonResponse(data=response,safe=False)
    data=c2s(app_id,code)
    openid=data.get('openid')
    print('get openid:',openid)
    response=wrap_json_response(code=ReturnCode.SUCCESS,message='auth success')
    return JsonResponse(data=response,safe=False)

def authorize(request):
    return __authorize_by_code(request)