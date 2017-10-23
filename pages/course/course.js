// course.js
var app = getApp()
var c_course = require('./c-course.js')
var c_index = require('../index/c-index.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekList: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周', '第9周', '第10周', '第11周', '第12周', '第13周', '第14周', '第15周', '第16周', '第17周', '第18周', '第19周', '第20周'],
    mon: 1,
    tues: 2,
    wed: 3,
    thur: 4,
    fri: 5,
    sat: 6,
    sun: 7,
    month: 9,
    currentWeek: 1, // 本星期
    selectWeek: 0, // 选择的星期
    oldData: {}, // 上一次的旧数据
    courseData: {}, // 设置到界面的数据
  },

  /* 初始化 */
  init: function (type) {
    this.setData({
      selectWeek: app.globalData.currentWeek - 1,
      currentWeek: app.globalData.currentWeek
    })
    if (app.loginCheck()) {
      wx.showNavigationBarLoading() // 导航条显示加载
      if (type == "refresh") this.getData()
      else this.checkData()
    }
  },

  /* 数据检查 */
  checkData: function () {
    this.data.oldData = wx.getStorageSync("courseData")
    if (this.data.oldData && (new Date().getTime() - this.data.oldData.refreshTime) < 604800000) {
      // 从缓存中取得数据放到全局变量，准备进行数据设置
      this.setDataTopage("", "")
    } else {
      this.getData()
    }
  },

  /* 数据获取 */
  getData: function () {
    var that = this
    if (this.data.oldData == '') this.data.oldData = {}
    if (app.globalData.apiStatus.edu) {
      c_index.getCourse(function (courseInfo) {
        app.globalData.errCodeTimes = 0
        if (app.errorCheck("课表信息", courseInfo)) {
          that.data.oldData.courseData = courseInfo.data.allCourse
          c_course.getWeekCourse(app.globalData.currentWeek, courseInfo.data.allCourse, function (courseData) {
            that.setDataTopage("courseData", courseData)
          })
        } else if (that.data.oldData.courseData) {
          c_course.getWeekCourse(app.globalData.currentWeek, that.data.oldData.courseData, function (courseData) {
            that.setDataTopage("courseData", courseData)
          })
        }
      })
    } else if (that.data.oldData.courseData) {
      c_course.getWeekCourse(app.globalData.currentWeek, that.data.oldData.courseData, function (courseData) {
        that.setDataTopage("courseData", courseData)
      })
      console.log("课程表:获取失败:开关被后台关闭")
    }
  },

  /* 设置数据到界面 */
  setDataTopage: function (type, data) {
    var that = this
    if (type == "courseData") {
      var dateInfo = this.getDateInfo()
      this.setData({
        courseData: data, // 课程信息
        mon: dateInfo.mon,
        tues: dateInfo.tues,
        wed: dateInfo.wed,
        thur: dateInfo.thur,
        fri: dateInfo.fri,
        sat: dateInfo.sat,
        sun: dateInfo.sun,
        month: dateInfo.month,
      })
    } else {
      c_course.getWeekCourse(this.data.selectWeek + 1, this.data.oldData.courseData, function (courseData) {
        that.setDataTopage("courseData", courseData)
      })
    }
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
    if (type != '') {
      this.data.oldData.refreshTime = new Date().getTime()
      wx.setStorageSync('courseData', this.data.oldData)
    }
  },

  getSelectCourse: function (week) {
    var that = this
    c_course.getWeekCourse(week, that.data.oldData.courseData, function (courseData) {
      that.setDataTopage("courseData", courseData)
    })
  },

  /* 星期和日期获取 */
  getDateInfo: function () {
    var addDay = (this.data.selectWeek - this.data.currentWeek + 1) * 7
    var dateInfo = {}
    var date = new Date()
    // 月
    var dateNeed = new Date()
    dateNeed.setDate(date.getDate() + addDay)
    dateInfo.month = dateNeed.getMonth() + 1
    // 天 
    var week = date.getDay()
    if (week == 0) week = 7
    var dateNeed = new Date()
    dateNeed.setDate(date.getDate() + (1 - week) + addDay)
    dateInfo.mon = dateNeed.getDate()
    var dateNeed = new Date()
    dateNeed.setDate(date.getDate() + (2 - week) + addDay)
    dateInfo.tues = dateNeed.getDate()
    var dateNeed = new Date()
    dateNeed.setDate(date.getDate() + (3 - week) + addDay)
    dateInfo.wed = dateNeed.getDate()
    var dateNeed = new Date()
    dateNeed.setDate(date.getDate() + (4 - week) + addDay)
    dateInfo.thur = dateNeed.getDate()
    var dateNeed = new Date()
    dateNeed.setDate(date.getDate() + (5 - week) + addDay)
    dateInfo.fri = dateNeed.getDate()
    var dateNeed = new Date()
    dateNeed.setDate(date.getDate() + (6 - week) + addDay)
    dateInfo.sat = dateNeed.getDate()
    var dateNeed = new Date()
    dateNeed.setDate(date.getDate() + (7 - week) + addDay)
    dateInfo.sun = dateNeed.getDate()
    return dateInfo
  },

  /* 选择星期课表 */
  selectWeek: function (e) {
    this.setData({
      selectWeek: e.detail.value,
      currentWeek: app.globalData.currentWeek
    })
    this.getSelectCourse(parseInt(this.data.selectWeek) + 1)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init('load')
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
    this.init("refresh")
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