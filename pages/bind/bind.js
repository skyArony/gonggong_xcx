// bind.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  // 进行表单检查，然后调用函数绑定数据
  bindInfo: function (e) {
    if (!e.detail.value.library || !e.detail.value.phone) {
      wx.showModal({
        title: '',
        content: '图书馆密码或手机号未填写。',
        showCancel: false
      })
    } else {
      wx.showNavigationBarLoading()
      this.bindLibrary(e)
    }
  },
  // 绑定图书馆-成功后进行手机号绑定
  bindLibrary: function (e) {
    var that = this
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
          // 进行手机号绑定
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
  },
  // 绑定手机号
  bindPhone: function (e) {
    wx.request({
      url: app.globalData.SET_LIBRARY_PHONE,
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
        } else {
          wx.hideNavigationBarLoading()
          // 出现了未知错误，请稍后重试
          wx.showModal({
            title: '',
            content: '手机号格式不正确。',
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