/* me页通用函数 */
var app = getApp()

function getLibraryNoticeStatus(cb) {
  if (app.globalData.loginType == 1) {
    wx.request({
      url: app.globalData.GET_LIBRARY_SMS_NOTICE_STATUS,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw,
      },
      success: function (res) {
        typeof cb == "function" && cb(res.data)
      },
      fail: function (res) {
        typeof cb == "function" && cb(null)
      }
    })
  } else if (app.globalData.loginType == 2) {
    wx.request({
      url: app.globalData.GET_LIBRARY_SMS_NOTICE_STATUS_OLD,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        eduPass: app.globalData.portalpw,
        session_id: wx.getStorageSync("session_id")
      },
      success: function (res) {
        if (res.data.code == 0) {
          typeof cb == "function" && cb(res.data)
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        typeof cb == "function" && cb(null)
      }
    })
  }
}

/* 设置短信提示状态 */
function setLibraryNoticeStatus(status) {
  var noticeData = {}
  noticeData.status = status ? true : false
  noticeData.refreshTime = new Date().getTime()
  wx.setStorageSync('noticeData', noticeData)
  if (app.globalData.loginType == 1) {
    if (status) {
      wx.request({
        url: app.globalData.ENABLE_LIBRARY_SMS_NOTICE,
        data: {
          role: app.globalData.app_AU,
          hash: app.globalData.app_ID,
          sid: app.globalData.sid,
          password: app.globalData.portalpw,
        }
      })
    } else {
      wx.request({
        url: app.globalData.DISABLE_LIBRARY_SMS_NOTICE,
        data: {
          role: app.globalData.app_AU,
          hash: app.globalData.app_ID,
          sid: app.globalData.sid,
          password: app.globalData.portalpw,
        }
      })
    }
  } else if (app.globalData.loginType == 2) {
    if (status) {
      wx.request({
        url: app.globalData.ENABLE_LIBRARY_SMS_NOTICE_OLD,
        data: {
          role: app.globalData.app_AU,
          hash: app.globalData.app_ID,
          sid: app.globalData.sid,
          eduPass: app.globalData.portalpw,
        }
      })
    } else {
      wx.request({
        url: app.globalData.DISABLE_LIBRARY_SMS_NOTICE_OLD,
        data: {
          role: app.globalData.app_AU,
          hash: app.globalData.app_ID,
          sid: app.globalData.sid,
          eduPass: app.globalData.portalpw,
        }
      })
    }
  }
}

/* 注销 */
function loginOut() {
  wx.clearStorage()
  wx.redirectTo({
    url: '/pages/login/login'
  })
}

module.exports.getLibraryNoticeStatus = getLibraryNoticeStatus
module.exports.setLibraryNoticeStatus = setLibraryNoticeStatus
module.exports.loginOut = loginOut