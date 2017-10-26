// me.js
var app = getApp()
var c_me = require('./c-me.js')
var c_index = require('../index/c-index.js')

/* 这个页一直会在栈里面,所以其实没有必要对它的数据userInfo进行存储,直接判断是否能
 * 从index中获得有效数据,不能再进行获取.另外因为图书馆通知开关一般不会经常开关所以可以存一下 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userImg: "../../images/user_none.png", // 用户头像
    sid: "0000000000", // 学号
    nickName: "粉猪!", //昵称
    libraryNoticeStatus: true, // 1开启,0关闭
    firstCourse: false, // 1开启,0关闭
  },

  /* 初始化 */
  init: function () {
    var that = this
    if (app.loginCheck()) {
      wx.showNavigationBarLoading() // 导航条显示加载
      this.setSwitch()
      // 设置头像等信息
      if (app.globalData.userInfo) {
        this.setDataTopage("userInfo", app.globalData.userInfo)
      } else {
        c_index.getUserInfo(function (userInfo) {
          app.globalData.errCodeTimes = 0
          if (app.errorCheck("个人信息", userInfo)) {
            /* 把个人数据设置到页面和全局 */
            that.setDataTopage("userInfo", userInfo.data)
          }
        })
      }
    }
  },

  /* 设置数据到视图层 */
  setDataTopage: function (type, data) {
    if (type == "libraryNoticeStatus") {
      this.setData({
        libraryNoticeStatus: data ? true : false
      })
    } else if (type == "userInfo") {
      this.setData({
        userImg: data['img'],
        sid: data['sid'],
        nickName: data['nickname'],
      })
    }
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },

  /* 设置switch开关状态 */
  setSwitch: function () {
    var that = this
    // 设置图书馆短信通知的开关
    var libraryNotice = wx.getStorageSync("noticeData")
    if ((new Date().getTime() - libraryNotice.refreshTime) < 604800000)
      that.setDataTopage("libraryNoticeStatus", libraryNotice.status)
    else
      c_me.getLibraryNoticeStatus(function (libraryNotice) {
        if (app.errorCheck("获取图书馆短信提示状态", libraryNotice)) {
          that.setDataTopage("libraryNoticeStatus", libraryNotice.status)
          var noticeData = {}
          noticeData.status = libraryNotice.status ? true : false
          noticeData.refreshTime = new Date().getTime()
          wx.setStorageSync('noticeData', noticeData)
        }
      })
    // 设置优先课表的开关
    if (wx.getStorageSync('firstCourse')) {
      this.setData({
        firstCourse: wx.getStorageSync('firstCourse')
      })
    }
    // else wx.setStorageSync('firstCourse', '0') // 设置优先课表设置为关
  },

  /* 开启\关闭图书短信提醒 */
  setLibraryNotice: function (e) {
    c_me.setLibraryNoticeStatus(e.detail.value)
  },

  /* 开启\关闭优先课表 */
  setFirstCourse: function (e) {
    if (e.detail.value) wx.setStorageSync('firstCourse', true)
    else wx.setStorageSync('firstCourse', false)
  },

  /* 注销 */
  loginOut: function () {
    c_me.loginOut()
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
    this.init()
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