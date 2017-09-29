// course.js
var app = getApp()
var common = require('../../common/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekList: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周', '第9周', '第10周', '第11周', '第12周', '第13周', '第14周', '第15周', '第16周', '第17周', '第18周', '第19周', '第20周'],
    courseData: {}, // 课表数据
    mon: 1,
    tues: 2,
    wed: 3,
    thur: 4,
    fri: 5,
    sat: 6,
    sun: 7,
    month: 9,
    currentWeek: 1,
    selectWeek: 0,
  },

  /* 初始化 */
  init: function () {
    this.data.courseData = wx.getStorageSync('courseData')
    app.globalData.loginType = wx.getStorageSync('loginType')
    if (this.data.courseData.data && (new Date().getTime() - this.data.courseData.refreshTime) < 7200000 ) {
      this.setCourseData()
    } else {
      this.getCourseData()
    }
  },

  setCourseData: function () {
    if (this.data.courseData.data) {
      this.setData({
        courseData: this.data.courseData.data, // 课程信息
        mon: this.data.courseData.dateInfo.mon,
        tues: this.data.courseData.dateInfo.tues,
        wed: this.data.courseData.dateInfo.wed,
        thur: this.data.courseData.dateInfo.thur,
        fri: this.data.courseData.dateInfo.fri,
        sat: this.data.courseData.dateInfo.sat,
        sun: this.data.courseData.dateInfo.sun,
        month: this.data.courseData.dateInfo.month,
        selectWeek: this.data.courseData.currentWeek - 1,
        currentWeek: this.data.courseData.currentWeek,
      })
    }
  },

  getCourseData: function () {
    var that = this
    this.data.courseData = {}
    wx.showNavigationBarLoading() // 导航条显示加载
    common.getCompleteCourse(app.globalData.currentWeek, function (courseData) {
      if (courseData) that.data.courseData.data = courseData
      that.endCheck("courseData")
    })
  },

  /* 数据加载检查 */
  endCheck: function (type) {
    // 整个页面的加载态在课程信息加载完后结束
    this.data.courseData.refreshTime = new Date().getTime()
    this.data.courseData.dateInfo = this.getDateInfo()
    this.data.courseData.currentWeek = app.globalData.currentWeek
    console.log(this.data.courseData)
    this.setCourseData()
    wx.setStorageSync(type, this.data.courseData)
    wx.stopPullDownRefresh() // 停止下拉状态
    wx.hideNavigationBarLoading()
  },

  /* 星期和日期获取 */
  getDateInfo: function () {
    var dateInfo = {}
    var date = new Date()
    dateInfo.month = date.getMonth() + 1
    var week = date.getDay()
    if (week == 0) week = 7
    var dateNeed = new Date()
    dateNeed.setDate(date.getDate() + (1 - week))
    dateInfo.mon = dateNeed.getDate()
    var dateNeed = new Date()
    dateNeed.setDate(date.getDate() + (2 - week))
    dateInfo.tues = dateNeed.getDate()
    var dateNeed = new Date()
    dateNeed.setDate(date.getDate() + (3 - week))
    dateInfo.wed = dateNeed.getDate()
    var dateNeed = new Date()
    dateNeed.setDate(date.getDate() + (4 - week))
    dateInfo.thur = dateNeed.getDate()
    var dateNeed = new Date()
    dateNeed.setDate(date.getDate() + (5 - week))
    dateInfo.fri = dateNeed.getDate()
    var dateNeed = new Date()
    dateNeed.setDate(date.getDate() + (6 - week))
    dateInfo.sat = dateNeed.getDate()
    var dateNeed = new Date()
    dateNeed.setDate(date.getDate() + (7 - week))
    dateInfo.sun = dateNeed.getDate()
    return dateInfo
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