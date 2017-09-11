// library.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    searchRes: null, // 图书搜索结果
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