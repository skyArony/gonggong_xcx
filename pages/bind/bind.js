// bind.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginType: 0, // 登录方式:1:信息门户   2:教务
  },

  // 进行表单检查，然后调用函数绑定数据
  bindInfo: function (e) {
    if (app.globalData.loginType == 1) {
      if (!e.detail.value.library || !e.detail.value.phone) {
        wx.showModal({
          title: '',
          content: '有表单未填写。',
          showCancel: false
        })
      } else {
        wx.showNavigationBarLoading()
        this.bindLibrary(e)
      }
    } else if (app.globalData.loginType == 2) {
      if (!e.detail.value.library || !e.detail.value.phone || !e.detail.value.ecard) {
        wx.showModal({
          title: '',
          content: '有表单未填写。',
          showCancel: false
        })
      } else {
        wx.showNavigationBarLoading()
        this.bindLibrary(e)
      }
    }
  },
  // 绑定图书馆-成功后进行手机号绑定
  bindLibrary: function (e) {
    var that = this
    if (app.globalData.loginType == 1) {
      wx.request({
        url: app.globalData.SET_LIBRARY_PASSWORD,
        data: {
          role: app.globalData.app_AU,
          hash: app.globalData.app_ID,
          sid: app.globalData.sid,
          password: app.globalData.portalpw,
          lpassword: e.detail.value.library
        },
        success: function (res) {
          if (res.data.code == 0) {
            // 进行一卡通绑定
            that.bindPhone(e)
          } else {
            wx.hideNavigationBarLoading()
            // 绑定失败
            wx.showModal({
              title: '',
              content: '图书馆密码错误。',
              showCancel: false,
            })
          }
        }
      })
    } else if (app.globalData.loginType == 2) {
      wx.request({
        url: app.globalData.SET_LIBRARY_PASSWORD_OLD,
        data: {
          role: app.globalData.app_AU,
          hash: app.globalData.app_ID,
          sid: app.globalData.sid,
          eduPass: app.globalData.portalpw,
          password: e.detail.value.library,
          session_id: wx.getStorageSync("session_id")
        },
        success: function (res) {
          if (res.data.code == 0) {
            // 进行一卡通绑定
            wx.setStorageSync("session_id", res.data.session_id)
            that.bindEcard(e)
          } else {
            wx.hideNavigationBarLoading()
            // 绑定失败
            wx.showModal({
              title: '',
              content: '图书馆密码错误。',
              showCancel: false,
            })
          }
        }
      })
    }
  },

  /* 绑定手机号 */
  bindPhone: function (e) {
    var that = this
    if (app.globalData.loginType == 1) {
      wx.request({
        url: app.globalData.SET_PHONE,
        data: {
          role: app.globalData.app_AU,
          hash: app.globalData.app_ID,
          sid: app.globalData.sid,
          password: app.globalData.portalpw,
          phone: e.detail.value.phone
        },
        success: function (res) {
          if (res.data.code == 0) {
            // 手机号绑定成功
            wx.hideNavigationBarLoading()
            wx.reLaunch({
              url: '/pages/index/index',
            })
          } else if (res.data.code == 11){
            wx.hideNavigationBarLoading()
            // 出现了未知错误，请稍后重试
            wx.showModal({
              title: '',
              content: '手机号码格式错误',
              showCancel: false
            })
          }
        }
      })
    } else if (app.globalData.loginType == 2) {
      wx.request({
        url: app.globalData.SET_PHONE_OLD,
        data: {
          role: app.globalData.app_AU,
          hash: app.globalData.app_ID,
          sid: app.globalData.sid,
          eduPass: app.globalData.portalpw,
          phone: e.detail.value.phone,
          session_id: wx.getStorageSync("session_id")
        },
        success: function (res) {
          if (res.data.code == 0) {
            wx.setStorageSync("session_id", res.data.session_id)
            // 手机号绑定成功
            wx.hideNavigationBarLoading()
            wx.reLaunch({
              url: '/pages/index/index',
            })
          } else if (res.data.code == 11){
            wx.hideNavigationBarLoading()
            // 出现了未知错误，请稍后重试
            wx.showModal({
              title: '',
              content: '手机号码格式错误',
              showCancel: false
            })
          }
        }
      })
    }
  },

  /* 绑定一卡通 */
  bindEcard: function (e) {
    var that = this
    wx.request({
      url: app.globalData.SET_ECARD_PASSWORD_OLD,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        eduPass: app.globalData.portalpw,
        password: e.detail.value.ecard,
        session_id: wx.getStorageSync("session_id")
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.setStorageSync("session_id", res.data.session_id)
          // 进行手机号绑定
          that.bindPhone(e)
        } else {
          wx.hideNavigationBarLoading()
          // 出现了未知错误，请稍后重试
          wx.showModal({
            title: '',
            content: '一卡通密码错误,一卡通密码为身份证后六位数字。数字!,不算字母X!',
            showCancel: false
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.loginType = wx.getStorageSync('loginType')
    this.setData({
      loginType: app.globalData.loginType
    })
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