class ReturnCode:
    """
    返回码的类
    """
    SUCCESS = 0

    FAILED = -100
    WRONG_PARMAS = -101
    RESOURCE_NOT_FOUND = -102

    UNAUTHORIZED = -500
    BROKEN_AUTHORIZED_DATA = -501

    @classmethod
    def message(cls, code):
        if code == cls.SUCCESS:
            return 'success'
        elif code == cls.FAILED:
            return 'failed'
        elif code == cls.UNAUTHORIZED:
            return 'unauthorized'
        elif code == cls.WRONG_PARMAS:
            return 'wrong params'
        elif code == cls.RESOURCE_NOT_FOUND:
            return 'resources not found'




class CommonResponseMixin(object):
    @classmethod
    def wrap_json_response(cls, data=None, code=None, message=None):
        response = {}
        if not code:
            code = ReturnCode.SUCCESS
        if not message:
            message = ReturnCode.message(code)
        if data:
            response['data'] = data
        response['result_code'] = code
        response['message'] = message
        return response


def wrap_json_response(data=None,code=None,message=None):
    response={}
    if not code:
        code=ReturnCode.SUCCESS
    if not message:
        message=ReturnCode.message(code)
    if data:
        response["data"]=data
    response["result_code"]=code
    response["message"]=message
    return response
