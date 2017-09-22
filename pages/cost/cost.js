// cost.js
var app = getApp()
var common = require('../../common/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ecard_id: "00000", // 校园卡ID
    balance: "N/A",  // 余额
    unclaimed: "N/A", // 待圈存
    status: '~', // 校园卡状态
    topData: {}, // 校园卡信息----在页面上部所以取名up
    downData: {}, // 消费信息
    add: 2, // 所需查询的月数
  },

  /* 初始化 */
  init: function () {
    this.data.topData = wx.getStorageSync('topData')
    this.data.downData  = wx.getStorageSync('downData')
    app.globalData.loginType = wx.getStorageSync('loginType')
    if (this.data.topData && (new Date().getTime() - this.data.topData.refreshTime) < /* 7200000 */ 3) {
      this.setDataDown()
    } else {
      this.getDataDown()
    }
    if (this.data.downData && (new Date().getTime() - this.data.downData.refreshTime) < /* 7200000 */ 3) {
      this.setDataTop()
    } else {
      this.getDataTop()
    }
  },

  getDataTop: function () {
    var that = this
    wx.showNavigationBarLoading() // 导航条显示加载
    common.getEcard(function (topData) {
      if (topData) {
        if (topData.balance.status == 0) topData.balance.status = "正常可用"
        else if (topData.balance.status == 1) topData.balance.status = "卡已冻结"
        else if (topData.balance.status == 2) topData.balance.status = "卡已挂失"
        that.data.topData = topData
      } 
      that.endCheck("topData")
    })
  },

  getDataDown: function () {
    var that = this
    wx.showNavigationBarLoading() // 导航条显示加载
    common.getBilling(that.data.add, function (downData) {
      console.log(downData)
      if (downData) that.data.downData = downData
      that.endCheck("downData")
    })
  },

  /* 获取更下一个月的信息 */
  getMoreInfo: function () {
    this.data.add++
    this.getDataDown()
  },

  /* 校园卡信息获取及显示 */
  setDataTop: function () {
    if (this.data.topData) {
      this.setData({
        ecard_id: this.data.topData.balance.ecard_id, // 校园卡ID
        balance: this.data.topData.balance.balance,  // 余额
        unclaimed: this.data.topData.balance.unclaimed, // 待圈存
        status: this.data.topData.balance.status, // 校园卡状态
      })
    }
  },

  /* 消费信息获取及显示 */
  setDataDown: function () {
    if (this.data.downData) {
      this.setData({
        
      })
    }
  },

  /* 数据加载检查 */
  endCheck: function (type) {
    // 本页面加载项：
    // 整个页面的加载态在课程信息加载完后结束
    if (type == "topData") {
      this.data.topData.refreshTime = new Date().getTime()
      this.setDataTop()
      wx.setStorageSync(type, this.data.topData)
      this.data.isEnd++
    }
    if (type == "downData") {
      this.data.downData.refreshTime = new Date().getTime()
      this.setDataDown()
      wx.setStorageSync(type, this.data.downData)
      this.data.isEnd++
    }
    if (this.data.isEnd == 2) {
      this.data.isEnd = 0
      app.globalData.isEnd = 0
      wx.stopPullDownRefresh() // 停止下拉状态
      wx.hideNavigationBarLoading()
    }
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