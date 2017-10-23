// cost.js
var app = getApp()
var c_cost = require('./c-cost.js')
var c_index = require('../index/c-index.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ecard_id: "00000", // 校园卡ID
    balance: "N/A",  // 余额
    unclaimed: "N/A", // 待圈存
    status: '~', // 校园卡状态
    // topData: {}, // 校园卡信息----在页面上部所以取名up
    downData: {}, // 消费信息
    dataList: [], // 存储每个月数据的数组
    add: 0, // 所需查询的月数
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
    this.data.oldData = wx.getStorageSync('costOldData')
    if (this.data.oldData && (new Date().getTime() - this.data.oldData.refreshTime) < 7200000) {
      // 从缓存中取得数据放到全局变量，准备进行数据设置
      console.log("使用就是怇")
      this.setDataTopage("", "")
    } else {
      this.getData()
    }
  },

  /* 获取数据 */
  getData: function () {
    var that = this
    if (this.data.oldData == '') this.data.oldData = {}
    if (app.globalData.apiStatus.ecard) {
      c_index.getEcard(function (cardInfo) {
        app.globalData.errCodeTimes = 0
        that.loadingCheck()
        if (app.errorCheck("一卡通卡数据", cardInfo)) {
          if (cardInfo.data.status == 0) cardInfo.data.status = "正常可用"
          else if (cardInfo.data.status == 1) cardInfo.data.status = "卡已冻结"
          else if (cardInfo.data.status == 2) cardInfo.data.status = "卡已挂失"
          that.setDataTopage("topData", cardInfo.data)
        }
      })
      c_cost.getBilling(that.data.add, function (billInfo) {
        app.globalData.errCodeTimes = 0
        that.loadingCheck()
        if (app.errorCheck("消费数据", billInfo)) {
          that.data.dataList.push(billInfo.data)
          that.setDataTopage("downData", that.data.dataList)
        }
      })
    } else if (that.data.oldData.downData && that.data.oldData.topData) {
      that.loadingCheck()
      that.loadingCheck()
      that.setDataTopage("downData", that.data.oldData.downData)
      that.setDataTopage("topData", that.data.oldData.topData)
      console.log("消费:获取失败:开关被后台关闭")
    } else that.loadingCheck()
  },

  setDataTopage: function (type, data) {
    if (type == "downData") {
      this.data.oldData.downData = data
      this.setData({
        dataList: data
      })
    } else if (type == "topData") {
      this.data.oldData.topData = data
      this.setData({
        ecard_id: data.ecard_id, // 校园卡ID
        balance: data.balance,  // 余额
        unclaimed: data.unclaimed, // 待圈存
        status: data.status, // 校园卡状态
      })
    } else if (type == "") {
      if (this.data.oldData.downData) {
        this.setData({
          dataList: this.data.oldData.downData
        })
      }
      if (this.data.oldData.topData) {
        this.setData({
          ecard_id: this.data.oldData.topData.ecard_id, // 校园卡ID
          balance: this.data.oldData.topData.balance,  // 余额
          unclaimed: this.data.oldData.topData.unclaimed, // 待圈存
          status: this.data.oldData.topData.status, // 校园卡状态
        })
      }
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
    }
    if (type != "") {
      this.data.oldData.refreshTime = new Date().getTime()
      wx.setStorageSync('costOldData', this.data.oldData)
    }
  },

  /**
  * 检查页面加载状态
  */
  loadingCheck: function () {
    this.data.loading++
    if (this.data.loading == 2) {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
      this.data.loading = 0
    }
  },

  /* 再获取一个月数据 */
  getDataDown: function () {
    var that = this
    wx.showNavigationBarLoading() // 导航条显示加载
    c_cost.getBilling(that.data.add, function (billInfo) {
      app.globalData.errCodeTimes = 0
      that.loadingCheck()
      if (app.errorCheck("消费数据", billInfo)) {
        that.data.dataList.push(billInfo.data)
        that.setDataTopage("downData", that.data.dataList)
      }
    })
  },

  /* 获取更下一个月的信息 */
  getMoreInfo: function () {
    this.data.add++
    this.data.loading = 1
    this.getDataDown()
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