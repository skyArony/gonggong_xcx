// grade.js
var app = getApp()
var c_grade = require('./c-grade.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avgGpa: "-", // 平均绩点
    classRank: "-", // 班级排名
    majorRank: "-", // 专业排名
    avgGrade: "-", // 平均成绩
    pageStatus: 0, // 0-数据正在加载，1-无数据，新生？，2-数据获取成功
    oldData: {}, // 上次获取的旧数据
    pageStatus: 0, // 0-数据正在加载，1-无数据，新生？，2-数据获取成功
    loading: 0,
  },

  /* 初始化 */
  init: function (type) {
    var that = this
    if (app.loginCheck()) {
      wx.showNavigationBarLoading() // 导航条显示加载
      if (type == "refresh") that.getData()
      else that.checkData()
    }
  },

  /* 数据检查 */
  checkData: function () {
    this.data.oldData = wx.getStorageSync('gradeOldData')
    if (this.data.oldData && (new Date().getTime() - this.data.oldData.refreshTime) < 604800000) {
      // 从缓存中取得数据放到全局变量，准备进行数据设置
      this.setDataTopage("", "")
    } else {
      this.getData()
    }
  },

  /* 获取数据 */
  getData: function () {
    var that = this
    if (this.data.oldData == '') this.data.oldData = {}
    if (app.globalData.apiStatus.edu) {
      // 获取每学期的成绩和绩点
      c_grade.getAllGrade(function (gradeData) {
        that.loadingCheck()
        app.globalData.errCodeTimes = 0
        if (app.errorCheck("成绩信息-底部", gradeData)) {
          c_grade.getAllRank(gradeData.data, function (dealData) {
            that.loadingCheck()
            if (dealData) {
              console.log(dealData)
              that.setDataTopage("downData", dealData)
            }
          })
        } else if (that.data.oldData.downData) {
          that.loadingCheck()
          that.setDataTopage("downData", that.data.oldData.downData)
        } else {
          that.loadingCheck()
        }
      })
      // 获取总学期和绩点
      c_grade.getTotalRank(function (topData) {
        that.loadingCheck()
        app.globalData.errCodeTimes = 0
        if (app.errorCheck("成绩信息-顶部", topData)) {
          that.setDataTopage("topData", topData.data)
        } else if (that.data.oldData.topData) {
          that.setDataTopage("topData", that.data.oldData.topData)
        }
      })
    } else if (that.data.oldData.downData && that.data.oldData.topData) {
      that.loadingCheck()
      that.loadingCheck()
      that.loadingCheck()
      that.setDataTopage("downData", that.data.oldData.downData)
      that.setDataTopage("topData", that.data.oldData.topData)
      console.log("成绩:获取失败:开关被后台关闭")
    } else {
      that.loadingCheck()
      that.loadingCheck()
      that.loadingCheck()
    }
  },

  /* 设置数据到页面 */
  setDataTopage: function (type, data) {
    if (type == "downData") {
      this.data.oldData.downData = data
      this.setData({
        pageStatus: data.status,
        gradeInfo: data.termGrade
      })
    } else if (type == "topData") {
      console.log(data)
      this.data.oldData.topData = data
      this.setData({
        avgGpa: data.gpa, // 平均绩点
        classRank: data.gpa_class_rank, // 班级排名
        majorRank: data.gpa_major_rank, // 专业排名
        avgGrade: data.average_grade, // 平均成绩
      })
    } else if (type == "") {
      if (this.data.oldData.downData) {
        this.setData({
          pageStatus: this.data.oldData.downData.status,
          gradeInfo: this.data.oldData.downData.termGrade
        })
      }
      if (this.data.oldData.topData) {
        this.setData({
          avgGpa: this.data.oldData.topData.gpa, // 平均绩点
          classRank: this.data.oldData.topData.gpa_class_rank, // 班级排名
          majorRank: this.data.oldData.topData.gpa_major_rank, // 专业排名
          avgGrade: this.data.oldData.topData.average_grade, // 平均成绩
        })
      }
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
    }
    if (type != "") {
      this.data.oldData.refreshTime = new Date().getTime()
      wx.setStorageSync('gradeOldData', this.data.oldData)
    }
  },

  /**
  * 检查页面加载状态
  */
  loadingCheck: function () {
    this.data.loading++
    if (this.data.loading == 3) {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
      this.data.loading = 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init("load")
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