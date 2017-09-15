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
  formLogin: function (e) {
    var that = this
    wx.showNavigationBarLoading()
    // 选择使用信息门户系列接口还是教务系统系列接口
    wx.setStorageSync('loginType', e.detail.value.loginType)
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
          that.loginSuccess(res, e)
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
          password: e.detail.value.password
        },
        success: function (res) {
          that.loginSuccess(res, e)
        }
      })
    }
  },

  /* 把信息门户地址粘贴到剪贴板 */
  setClipboard: function () {
    var that = this
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

  /* 将学号和openId绑定 */
  bindSid: function () {
    var that = this
    // 获取openId和sid
    this.getOpenId(function (openId) {
      // 根据openid获取学号
      wx.request({
        url: app.globalData.BIND_SID,
        data: {
          sid: app.globalData.sid,
          g_id: app.globalData.openId
        },
        success: function (res) {
          if (res.data.code == 0 || res.data.code == 1) {
            console.log("学号绑定成功！")
          }
        }
      })
    })
  },

  /* 获取openId */
  getOpenId: function (cb) {
    var that = this
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
                wx.setStorage({
                  key: "openId",
                  data: res.data.openid
                })
                console.log("用接口获取了openId：" + res.data.openid)
                typeof cb == "function" && cb(app.globalData.openId)
              }
            })
          }
        }
      })
    }
  },



  /* -------------------------------------------------------复用函数--------------------------------- */
  loginSuccess: function (res, e) {
    var that = this
    if (res.data.code == 0) {
      console.log("登录成功")
      // 登录成功,存储数据
      app.globalData.sid = e.detail.value.sid
      wx.setStorageSync('sid', e.detail.value.sid)
      wx.setStorageSync('portalpw', e.detail.value.password)
      app.globalData.portalpw = e.detail.value.portalpw
      // 绑定学号
      that.bindSid()
      wx.hideNavigationBarLoading()
      // 跳转到主页
      wx.reLaunch({
        url: '/pages/index/index'
      })
    } else if (res.data.code == 9) {
      wx.hideNavigationBarLoading()
      app.globalData.sid = e.detail.value.sid
      wx.setStorageSync('portalpw', e.detail.value.password)
      app.globalData.portalpw = e.detail.value.password
      // 绑定学号
      that.bindSid()
      // 电话或图书馆未绑定
      wx.showModal({
        title: '',
        content: '电话或图书馆未绑定,请前往绑定',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/bind/bind',
            })
          }
        }
      })
    }
    else if (res.data.code == 1) {
      // 密码错误
      wx.showModal({
        title: '',
        content: '学号或密码错误。',
        showCancel: false
      })
      wx.hideNavigationBarLoading()
    } else if (res.data.code == 65535) {
      // 学号或密码未填写
      wx.showModal({
        title: '',
        content: '学号或密码未填写。',
        showCancel: false
      })
      wx.hideNavigationBarLoading()
    } else if (res.data.code == -1) {
      // 内部错误
      wx.showModal({
        title: '',
        content: '程序内部错误。',
        showCancel: false
      })
      wx.hideNavigationBarLoading()
    } else if (res.data.code == 4 || res.data.code == 5) {
      // 未知错误
      wx.showModal({
        title: '',
        content: '未知错误。',
        showCancel: false
      })
      wx.hideNavigationBarLoading()
    } else if (res.data.code == 2) {
      // 超时
      wx.showModal({
        title: '',
        content: '获取信息超时。',
        showCancel: false
      })
      wx.hideNavigationBarLoading()
    } else if (res.data.code == 3) {
      // 网络故障
      wx.showModal({
        title: '',
        content: '网络故障',
        showCancel: false
      })
      wx.hideNavigationBarLoading()
    }
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