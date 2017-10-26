// library.js
var app = getApp()
var c_index = require('../index/c-index.js')

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
    loading: 0, //加载态,为2时表示此页加载完毕,然后归零
    buttonText: "查询",
  },

  /**
   * 事件监听函数
   */

  /* 初始化 */
  init: function (type) {
    var that = this
    if (app.loginCheck()) {
      wx.showNavigationBarLoading() // 导航条显示加载
      if (type == "refresh") {
        this.getData()
      } else {
        if (app.globalData.librarypw && app.globalData.ecardpw) {
          this.checkData()
        } else console.log(" 图书馆:获取失败:没有及时取得密码")
      }
    }
  },

  /* 数据检查 */
  checkData: function () {
    this.data.oldData = wx.getStorageSync('libraryOldData')
    if (this.data.oldData && (new Date().getTime() - this.data.oldData.refreshTime) < 86400000) {
      this.setDataTopage("", "")
    } else {
      this.getData()
    }
  },

  /* 数据获取 */
  getData: function () {
    var that = this
    if (this.data.oldData == '') this.data.oldData = {}
    if (app.globalData.apiStatus.library) {
      c_index.getLibraryUser(function (libraryUser) {
        that.loadingCheck()
        if (app.errorCheck("图书馆用户信息", libraryUser)) {
          var debt = libraryUser.data.debt
          if (debt > 0) {
            debt = -debt
            debt = debt.toFixed(2)
          }
          else debt = "0.00"
          libraryUser.data.debt = debt
          that.setDataTopage("libraryUser", libraryUser.data)
        } else if (that.data.oldData.libraryUser) {
          that.setDataTopage("libraryUser", that.data.oldData.libraryUser)
        }
      })
      // 获取图书馆借阅信息并计算最近一本书的剩余天数并设置到视图层
      c_index.getLibraryRentList(function (rentList) {
        that.loadingCheck()
        if (app.errorCheck("图书馆借阅信息", rentList)) {
          that.setDataTopage("rentList", rentList.data)
        } else if (that.data.oldData.rentList) {
          that.setDataTopage("rentList", that.data.oldData.rentList)
        }
      })
    } else if (that.data.oldData.libraryUser && that.data.oldData.rentList) {
      that.loadingCheck()
      that.loadingCheck()
      that.setDataTopage("libraryUser", that.data.oldData.libraryUser)
      that.setDataTopage("rentList", that.data.oldData.rentList)
      console.log("图书馆信息:获取失败:开关被后台关闭")
    } else {
      that.loadingCheck()
      that.loadingCheck()
    }
  },

  /* 设置数据到页面 */
  setDataTopage: function (type, data) {
    if (type == "libraryUser") {
      this.data.oldData.libraryUser = data
      this.setData({
        debet: data['debt'], //图书馆欠费
        validityTime: data['valid_date_end'], // 图书借阅有效期限
      })
    } else if (type == "rentList") {
      this.data.oldData.rentList = data
      var bookNum = 0
      if (data == null) bookNum = 0
      else bookNum = data.length
      this.setData({
        bookNum: bookNum, // 借阅的书籍数目
        rentList: data // 设置借阅图书表
      })
    } else if (type == '') {
      if (this.data.oldData.libraryUser)
        this.setData({
          debet: this.data.oldData.libraryUser['debt'],
          validityTime: this.data.oldData.libraryUser['valid_date_end'], // 图书借阅有效期限
        })
      if (this.data.oldData.rentList) {
        var bookNum = 0
        if (this.data.oldData.rentList == null) bookNum = 0
        else bookNum = this.data.oldData.rentList.length
        this.setData({
          bookNum: bookNum, // 借阅的书籍数目
          rentList: this.data.oldData.rentList // 设置借阅图书表
        })
      }
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
    }
    if (type != '') {
      this.data.oldData.refreshTime = new Date().getTime()
      wx.setStorageSync('libraryOldData', this.data.oldData)
    }
  },

  /* 检查页面加载状态 */
  loadingCheck: function () {
    this.data.loading++
    if (this.data.loading == 2) {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
      this.data.loading = 0
    }
  },

  /* 监听点击 */
  swichNav: function (e) {
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
    this.setData({
      currentTab: e.detail.current,
    })
  },

  /* 进行图书查询 */
  searchBook: function (e) {
    var that = this
    if (e.detail.value.keyword) {
      this.setData({ searchIng: true, buttonText: "查询中" })
      if (e.detail.value.keyword) {
        wx.request({
          url: app.globalData.LIBRARY_SEARCH,
          data: {
            role: app.globalData.app_AU,
            hash: app.globalData.app_ID,
            name: e.detail.value.keyword,
          },
          success: function (res) {
            if (app.errorCheck("查询图书", res.data)) {
              if (res.data.data.length > 0) {
                console.log("找到" + res.data.data.length + "本书籍")
                that.setData({
                  searchRes: res.data.data,
                })
              } else {
                // 临时
                wx.showModal({
                  title: '',
                  content: '没有搜索到你要的书~',
                  showCancel: false,
                })
              }
            }
          },
          fail: function () {
            console.log("查询图书获取fail" + ":23333")
          },
          complete: function () {
            that.setData({ searchIng: false, buttonText: "查询" })
          }
        })
      }
    } else {
      wx.showModal({
        title: '',
        content: '请输入查询关键字!',
        showCancel: false,
      })
    }
  },

  /* 获取图书细节 */
  getDetail: function (e) {
    var that = this
    var bookUrl = e.currentTarget.dataset.url
    var index = e.currentTarget.dataset.index
    that.data.searchRes[index].detail = "ing"
    this.setData({
      searchRes: that.data.searchRes
    })
    wx.request({
      url: app.globalData.LIBRARY_SEARCH_DETAILS,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        id: bookUrl,
      },
      success: function (res) {
        if (res.data.code == 7) {
          console.log("图书细节:获取失败:没有对应的图书ID")
        } else if (res.data.code == 0) {
          that.data.searchRes[index].detail = res.data.data.restbooks
          that.setData({
            searchRes: that.data.searchRes
          })
          console.log(that.data.searchRes)
        } else {
          console.log("图书细节:获取失败:" + res.data.code)
          that.setData({
            searchRes: "0"
          })
        } 
      },
      fail: function (res) {
        console.log("图书细节:获取失败:233333")
        that.setData({
          searchRes: "0"
        })
      }
    })
    
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
    this.init('refresh')
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