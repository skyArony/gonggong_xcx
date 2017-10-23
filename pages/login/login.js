// login.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginType: 2, // 登录类型：1是信息门户，2是教务系统
  },

  /* 进行登录 */
  login: function (e) {
    var that = this
    wx.showNavigationBarLoading()
    wx.setStorageSync('loginType', e.detail.value.loginType)
    that.formSubmit(e, function (loginData) {
      app.globalData.errCodeTimes = 0
      that.loginSuccess(loginData, e)
    })
  },

  /* 进行登录 */
  formSubmit: function (e, cb) {
    if (e.detail.value.loginType == 1) {
      wx.request({
        url: app.globalData.LOGIN,
        data: {
          role: app.globalData.app_AU,
          hash: app.globalData.app_ID,
          sid: e.detail.value.sid,
          password: e.detail.value.password
        },
        success: function (res) {
          if (res.data.code == 5 && app.globalData.errCodeTimes < 10) {
            app.globalData.errCodeTimes++
            that.formSubmit(e)
          } else {
            typeof cb == "function" && cb(res.data)
          }
        },
        fail: function (res) {
          typeof cb == "function" && cb(null)
        }
      })
    }
    else if (e.detail.value.loginType == 2) {
      wx.request({
        url: app.globalData.LOGIN_OLD,
        data: {
          role: app.globalData.app_AU,
          hash: app.globalData.app_ID,
          sid: e.detail.value.sid,
          password: e.detail.value.password,
          session_id: wx.getStorageSync("session_id")
        },
        success: function (res) {
          if (res.data.code == 5 && app.globalData.errCodeTimes < 10) {
            app.globalData.errCodeTimes++
            that.formSubmit(e)
          } else {
            typeof cb == "function" && cb(res.data)
          }
        },
        fail: function (res) {
          typeof cb == "function" && cb(null)
        }
      })
    }
  },

  loginSuccess: function (loginData, e) {
    wx.hideNavigationBarLoading()
    if (loginData.code == 0 || loginData.code == 6) {
      app.globalData.sid = e.detail.value.sid
      app.globalData.portalpw = e.detail.value.password
      wx.setStorageSync('sid', e.detail.value.sid)
      wx.setStorageSync('portalpw', e.detail.value.password)
      // 绑定学号
      this.bindSid(e.detail.value.sid)
      // 跳转到主页
      wx.reLaunch({
        url: '/pages/index/index'
      })
    } else if (loginData.code == 9) {
      app.globalData.sid = e.detail.value.sid
      app.globalData.portalpw = e.detail.value.password
      wx.setStorageSync('sid', e.detail.value.sid)
      wx.setStorageSync('portalpw', e.detail.value.password)
      // 绑定学号
      this.bindSid(e.detail.value.sid)
      // 电话或图书馆未绑定
      wx.showModal({
        title: '',
        content: '三翼通行证未绑定完整,请前往绑定',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/bind/bind',
            })
          }
        }
      })
    } else if (loginData.code == 1) {
      // 密码错误
      wx.showModal({
        title: '',
        content: '学号或密码错误。',
        showCancel: false
      })
    } else if (loginData.code == 65535) {
      // 学号或密码未填写
      wx.showModal({
        title: '',
        content: '学号或密码未填写。',
        showCancel: false
      })
    } else if (loginData.code == -1) {
      // 内部错误
      wx.showModal({
        title: '',
        content: '程序内部错误。',
        showCancel: false
      })
    } else if (loginData.code == 4 || loginData.code == 5) {
      // 未知错误
      wx.showModal({
        title: '',
        content: '未知错误。',
        showCancel: false
      })
    } else if (loginData.code == 2) {
      // 超时
      wx.showModal({
        title: '',
        content: '获取信息超时。',
        showCancel: false
      })
    } else if (loginData.code == 3) {
      // 网络故障
      wx.showModal({
        title: '',
        content: '网络故障',
        showCancel: false
      })
    }
  },

  /* 将学号和openId绑定 */
  bindSid: function (sid) {
    this.getOpenId(function (openId) {
      // 根据openid获取学号
      wx.request({
        url: app.globalData.BIND_SID,
        data: {
          sid: sid,
          g_id: openId
        },
        success: function (res) {
          if (res.data.code == 0 || res.data.code == 1) {
            console.log("学号绑定成功！")
          }
        }
      })
    })
  },

  /* 获取openId和登录状态 */
  getOpenId: function (cb) {
    // 从本地获取openid
    if (wx.getStorageSync('openId')) {
      // openId存入全局变量
      app.globalData.openId = wx.getStorageSync('openId')
      typeof cb == "function" && cb(app.globalData.openId)
    } else {
      // 调用登录接口重新获取openid
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              url: app.globalData.GET_OPENID,
              data: {
                code: res.code
              },
              success: function (res) {
                // openId存入全局变量
                app.globalData.openId = res.data.openid
                // openid存入缓存
                wx.setStorageSync("openId", res.data.openid)
                typeof cb == "function" && cb(res.data.openid)
              }
            })
          }
        }
      })
    }
  },

  /* 把信息门户地址粘贴到剪贴板 */
  setClipboard: function () {
    wx.setClipboardData({
      data: 'http://202.197.224.171/zfca/login',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showModal({
              title: '',
              content: '已将信息门户网址复制到剪贴板，请在浏览器中粘贴打开。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('已将信息门户网址复制到剪贴板')
                }
              }
            })
          }
        })
      }
    })
  },

  /* -----------------------------------------监控函数------------------------------------ */
  radioChange: function (e) {
    // 修改密码表单
    this.setData({
      loginType: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})