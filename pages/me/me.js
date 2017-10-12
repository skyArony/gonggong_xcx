// me.js
var app = getApp()
var common = require('../../common/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userImg: "../../images/user_none.png", // 用户头像
    sid: "0000000000", // 学号
    nickName: "粉猪!", //昵称
    libraryNoticeStatus: "1", // 1开启,0关闭
    firstCourse: "0", // 1开启,0关闭
  },

  /* 初始化 */
  init: function () {
    if (wx.getStorageSync('firstCourse')) {
      this.setData({
        firstCourse: wx.getStorageSync('firstCourse')
      })
    }
    else wx.setStorageSync('firstCourse', '0') // 设置优先课表设置为关
    app.globalData.loginType = wx.getStorageSync('loginType')
    // 设置图书短信提醒的状态
    this.getLibraryNoticeStatus()
    // 设置头像等信息
    if (wx.getStorageSync('portalpw')) {
      this.data.userInfo = app.globalData.userInfo
      console.log("以下是获取到的个人信息")
      console.log(this.data.userInfo)
      // if判断可以防止数据为空时的报错，且在数据接口出问题是仍然采用旧数据
      if (this.data.userInfo)
        this.setData({
          userImg: this.data.userInfo['img'],
          sid: this.data.userInfo['sid'],
          nickName: this.data.userInfo['nickname'],
        })
    } else {
      // 跳转到重新登录
      wx.redirectTo({
        url: '/pages/login/login'
      })
    }
  },

  /* 开启\关闭图书短信提醒 */
  libraryNotice: function (e) {
    common.setLibraryNoticeStatus(e.detail.value) 
  },

  /* 获取 */
  getLibraryNoticeStatus: function () {
    var that = this
    common.getLibraryNoticeStatus(function (status){
      if (status) {
        that.setData({
          libraryNoticeStatus: status.status
        })
      }
    }) 
  },

  /* 开启\关闭优先课表 */
  firstCourse: function (e) {
    if (e.detail.value) wx.setStorageSync('firstCourse', '1')
    else wx.setStorageSync('firstCourse', '0')
  },

  /* 获取数据 */
  getUserInfo: function () {
    var that = this
    wx.showNavigationBarLoading() // 导航条显示加载
    app.globalData.loginType = wx.getStorageSync('loginType')
    // 获取拱拱个人信息并设置到视图层
    common.getUserInfo(function (userInfo) {
      common.getTimerInfo(function (userInfo) {
        if (userInfo) that.data.userInfo = userInfo
        else that.data.userInfo = app.globalData.userInfo
        that.endCheck("个人信息加载完毕，")
      })
    })
  },

  /* 设置数据到视图层 */
  setUserInfo: function () {
    // 设置头像等信息
    console.log("以下是获取到的个人信息")
    console.log(this.data.userInfo)
    wx.stopPullDownRefresh() // 停止下拉状态
    // if判断可以防止数据为空时的报错，且在数据接口出问题是仍然采用旧数据
    if (this.data.userInfo)
      this.setData({
        userImg: this.data.userInfo['img'],
        sid: this.data.userInfo['sid'],
        nickName: this.data.userInfo['nickname'],
      })
  },

  /* 数据加载检查 */
  endCheck: function (type) {
    console.log(type + "当前加载状态：" + app.globalData.isEnd)
    wx.hideNavigationBarLoading()
    app.globalData.isEnd = 0
    this.setUserInfo()
  },

  /* 注销 */
  loginOut: function () {
    common.loginOut()
  },

  /* 重新绑定 */
  reBind: function () {
    wx.navigateTo({
      url: '/pages/bind/bind'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
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
    var that = this
    // 没有缓存密码，提示重新登录
    if (wx.getStorageSync('portalpw')) {
      this.getUserInfo()
    } else {
      wx.showModal({
        title: '',
        content: '登录过期，请重新登录。',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // 跳转到重新登录
            wx.redirectTo({
              url: '/pages/login/login'
            })
          }
        }
      })
    }
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