// library.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    searchRes: null, // 图书搜索结果
    libraryInfo: null,
    bookNum: 0, // 借阅的书籍数目
    debet: "0.00", //图书馆欠费
    validityTime: "0000-00-00", // 图书借阅有效期限
    rentList: null, // 图书借阅详情
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

  /* 检查数据的有效性 */
  checkLibraryInfo: function () {
    this.data.libraryInfo = wx.getStorageSync('libraryInfo')
    // 如果距离上次获取数据的时间超过了两个小时则重新获取数据
    if (this.data.libraryInfo && (new Date().getTime() - this.data.libraryInfo.refreshTime) < 7200000) {
      // 从缓存中取得数据放到全局变量，准备进行数据设置
      this.setLibraryInfo()
    } else {
      this.getLibraryInfo()
      this.setLibraryInfo()
    }
  },

  /* 获取本页图书借阅信息 */
  getLibraryInfo: function () {
    var that = this
    common.getRentData(function (libraryInfo) {
      that.data.libraryInfo = libraryInfo
      that.endCheck()
    })
  },

  setLibraryInfo: function () {
    // 设置页面信息
    this.setData({
      bookNum: this.data.libraryInfo.bookNum, // 借阅的书籍数目
      debet: this.data.libraryInfo.libararyUser['debt'], //图书馆欠费
      validityTime: this.data.libraryInfo.libararyUser['valid_date_end'], // 图书借阅有效期限
    })
  },

  /* 数据加载检查 */
  endCheck: function () {
    // 本页面加载项：userinfo,timer,course,library*2,campus_net,ecard
    // 整个页面的加载态在课程信息加载完后结束
    console.log("当前加载状态：" + app.globalData.isEnd)
    if (app.globalData.isEnd == 1) {
      wx.hideNavigationBarLoading()
      this.data.libraryInfo.refreshTime = new Date().getTime()
      wx.setStorageSync('libraryInfo', this.data.libraryInfo)
      app.globalData.isEnd = 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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