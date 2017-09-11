// about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  // 把拱拱官网地址粘贴到剪贴板
  setClipboard: function () {
    var that = this
    wx.setClipboardData({
      data: 'https://g.sky31.com/',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showModal({
              title: '',
              content: '已将拱拱官网地址复制到剪贴板，请在浏览器中粘贴打开。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('已将拱拱官网地址复制到剪贴板')
                }
              }
            })
          }
        })
      }
    })
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