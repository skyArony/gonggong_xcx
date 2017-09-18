// grade.js
var app = getApp()
var common = require('../../common/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gradeData: {}, // 本页下部分(各学期成绩绩点)数据
    rankInfo: {}, // 本页上部分(总学期成绩绩点)数据
    avgGpa: "-", // 平均绩点
    classRank: "-", // 班级排名
    majorRank: "-", // 专业排名
    avgGrade: "-", // 平均成绩
    gradeInfo: null, // 本页下部分(各学期成绩绩点)数据
    status: 0, // 0-数据正在加载，1-无数据，新生？，2-数据获取成功
    isEnd: 0, // 判断加载态
  },

  /* 初始化 */
  init: function () {
    this.data.gradeData = wx.getStorageSync('gradeData')
    this.data.rankInfo  = wx.getStorageSync('rankInfo')
    app.globalData.loginType = wx.getStorageSync('loginType')
    if (this.data.gradeData && (new Date().getTime() - this.data.gradeData.refreshTime) < 7200000 ) {
      this.setGradeDataDown()
    } else {
      this.getGradeDataDown()
    }
    if (this.data.rankInfo && (new Date().getTime() - this.data.rankInfo.refreshTime) < 7200000 ) {
      this.setGradeDataUp()
    } else {
      this.getGradeDataUp()
    }
  },

  getGradeDataUp: function () {
    var that = this
    wx.showNavigationBarLoading() // 导航条显示加载
    common.getRankInfo(function (rankInfo) {
      that.endCheck("rankInfo", rankInfo)
    })
  },

  getGradeDataDown: function () {
    var that = this
    wx.showNavigationBarLoading() // 导航条显示加载
    common.getGradeInfo(function (gradeData) {
      that.endCheck("gradeData", gradeData)
    })
  },

  /* 总绩点获取及显示 */
  setGradeDataUp: function () {
    if (this.data.rankInfo) {
      this.setData({
        avgGpa: this.data.rankInfo.gpa, // 平均绩点
        classRank: this.data.rankInfo.gpa_class_rank, // 班级排名
        majorRank: this.data.rankInfo.gpa_major_rank, // 专业排名
        avgGrade: this.data.rankInfo.average_grade, // 平均成绩
      })
    }
  },

  /* 各学期绩点获取及显示 */
  setGradeDataDown: function () {
    if (this.data.gradeData) {
      this.setData({
        status: this.data.gradeData.status,
        gradeInfo: this.data.gradeData.termGrade
      })
    }
  },

  /* 数据加载检查 */
  endCheck: function (type, data) {
    // 本页面加载项：
    // 整个页面的加载态在课程信息加载完后结束
    if (type == "gradeData") {
      data.refreshTime = new Date().getTime()
      this.data.gradeData = data
      this.setGradeDataDown()
      wx.setStorageSync(type, this.data.gradeData)
      this.data.isEnd++
    }
    if (type == "rankInfo") {
      data.refreshTime = new Date().getTime()
      this.data.rankInfo = data
      this.setGradeDataUp()
      wx.setStorageSync(type, this.data.rankInfo)
      this.data.isEnd++
    }
    if (this.data.isEnd == 2) {
      this.data.isEnd = 0
      wx.stopPullDownRefresh() // 停止下拉状态
      wx.hideNavigationBarLoading()
    }
  },


  // /**
  //  * 生命周期函数--监听页面加载
  //  */
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
    this.getGradeDataDown()
    this.getGradeDataUp()
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