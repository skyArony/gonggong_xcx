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
    if (wx.getStorageSync('courseData')) this.data.courseData = wx.getStorageSync('courseData')
    app.globalData.loginType = wx.getStorageSync('loginType')
    wx.showNavigationBarLoading() // 导航条显示加载
    this.data.courseData.currentWeek = app.globalData.currentWeek
    this.setData({
      selectWeek: this.data.courseData.currentWeek - 1
    })
    if (this.data.courseData.data && (new Date().getTime() - this.data.courseData.refreshTime) < 7200000) {    
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
        currentWeek: this.data.courseData.currentWeek,
      })
    }
  },

  getCourseData: function () {
    var that = this
    this.data.courseData = {}
    this.data.courseData.currentWeek = app.globalData.currentWeek
    common.getCompleteCourse(app.globalData.currentWeek, function (courseData) {
      if (courseData) that.data.courseData.data = courseData
      console.log(courseData)
      that.endCheck("courseData")
    })
  },

  getSelectCourse: function (week) {
    var that = this
    common.getSelectCourse(week, app.globalData.officalCourse, function (courseData) {
      if (courseData) that.data.courseData.data = courseData
      console.log(courseData)
      that.endCheck("courseData")
    })
  },

  /* 数据加载检查 */
  endCheck: function (type) {
    // 整个页面的加载态在课程信息加载完后结束
    this.data.courseData.refreshTime = new Date().getTime()
    this.data.courseData.dateInfo = this.getDateInfo()
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

  /* 选择星期课表 */
  selectWeek: function (e) {
    console.log(e)
    this.setData({
      selectWeek: e.detail.value,
    })
    this.getSelectCourse(parseInt(this.data.selectWeek) + 1)
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
      this.getCourseData()
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