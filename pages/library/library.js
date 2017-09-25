// library.js
var app = getApp()
var common = require('../../common/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, // 顶部tab栏位置
    searchRes: null, // 图书搜索结果
    libraryData: null, // 本页信息
    bookNum: 0, // 借阅的书籍数目
    debet: "0.00", //图书馆欠费
    validityTime: "0000-00-00", // 图书借阅有效期限
    rentList: null, // 图书借阅详情
    oldData: {}, // 上一次的数据
  },

  /**
   * 事件监听函数
   */
  /* 监听点击 */
  swichNav: function (e) {
    console.log(e);
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },

  /* 监听滑动 */
  swiperChange: function (e) {
    console.log(e);
    this.setData({
      currentTab: e.detail.current,
    })
  },

  /* 进行图书查询 */
  searchBook: function (e) {
    var that = this
    if (e.detail.value.keyword) {
      wx.request({
        url: app.globalData.LIBRARY_SEARCH,
        data: {
          role: app.globalData.app_AU,
          hash: app.globalData.app_ID,
          name: e.detail.value.keyword,
        },
        success: function (res) {
          if (res.data.code == 0) {
            console.log("图书信息查询成功")
            console.log(res)
            // typeof cb == "function" && cb(res.data.data)
            that.setData({
              searchRes: res.data.data,
            })
          }
        }
      })
    }
  },

  /* 初始化 */
  init: function () {
    this.data.libraryData = wx.getStorageSync('libraryData')
    app.globalData.loginType = wx.getStorageSync('loginType')
    if (this.data.libraryData && (new Date().getTime() - this.data.libraryData.refreshTime) < 7200000) {
      this.setLibraryInfo()
    } else {
      this.getLibraryInfo()
    }
  },

  /* 获取本页图书借阅信息 */
  getLibraryInfo: function () {
    var that = this
    this.data.oldData = this.data.libraryData
    wx.showNavigationBarLoading() // 导航条显示加载
    // 获取图书馆信息并设置到视图层
    common.getLibrary(function (libraryInfo) {
      common.getLibraryRentList(function (libraryInfo) {
        if (libraryInfo.libararyUser) that.data.libraryData = libraryInfo
        else if (that.data.oldData) that.data.libraryData = that.data.oldData
        else that.data.libraryData = {}
        that.endCheck("图书馆信息加载完毕")
      })
    })
  },

  setLibraryInfo: function () {
    // 设置页面信息
    wx.stopPullDownRefresh() // 停止下拉状态
    if (this.data.libraryData) {
      var bookNum = 0
      if (this.data.libraryData.libraryBook == null) bookNum = 0
      else bookNum = this.data.libraryData.libraryBook.length
      this.setData({
        bookNum: bookNum, // 借阅的书籍数目
        debet: this.data.libraryData.libararyUser['debt'], //图书馆欠费
        validityTime: this.data.libraryData.libararyUser['valid_date_end'], // 图书借阅有效期限
        rentList: this.data.libraryData.libraryBook // 设置借阅图书表
      })
    } else {
      this.setData({
        bookNum: "故障", // 借阅的书籍数目
      })
    }
  },

  /* 数据加载检查 */
  endCheck: function (type) {
    // 整个页面的加载态在课程信息加载完后结束
    console.log("当前加载状态：" + type)
    wx.hideNavigationBarLoading()
    this.data.libraryData.refreshTime = new Date().getTime()
    wx.setStorageSync('libraryData', this.data.libraryData)
    app.globalData.isEnd = 0
    this.setLibraryInfo()
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
    this.getLibraryInfo()
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