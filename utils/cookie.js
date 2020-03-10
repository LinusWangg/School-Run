const key='cookie'

function getSessionIDFromResponse(res){
  var cookie=res.header['Set-Cookie']
  console.log('get cookie from response:'+cookie)
  return cookie
}

function setCookieToStorage(cookie){
  try{
    wx.setStorageSync(key, cookie)
  }catch(e){
    console.log(e)
  }
}

function getCookieFromStorage(){
  var value=wx.getStorageSync(key)
  return value
}

module.exports={
  setCookieToStorage:setCookieToStorage,
  getCookieFromStorage: getCookieFromStorage,
  getSessionIDFromResponse: getSessionIDFromResponse,
}