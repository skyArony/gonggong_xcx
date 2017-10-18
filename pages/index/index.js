// index.js
// 获取应用实例
var app = getApp()
var common = require('../../common/common.js')
var c_index = require('../../common/c-index.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayCourse: "-",
    todayCourseDetail: null, // 今天的课程详细信息
    showTimer: null, // timer信息
    bookTimer: "- 天",
    balance: "N/A", // 一卡通余额
    unclaimed: "N/A", // 一卡通待领
    libraryDebt: "N/A", // 图书馆欠费
    net: "N/A", // 校园网余额
    userImg: "../../images/user_none.png", // 用户头像
    page_status: "4", // 当前登录状态:0-未登录，1-已登录，2-今天有课，3-今天没有课，4-数据正在加载
    oldData: {}, // 上一次的数据
    isEnd: 0, //  页面加载状态
    userInfo: {}, // 用户信息,包括倒计时
    loading: 0, //加载态,为7时表示此页加载完毕,然后归零
  },

  /**
   * 函数
   */

  /* 敬请期待 */
  waiting: function () {
    wx.showModal({
      title: '',
      content: '敬请期待',
      showCancel: false,
    })
  },

  /* 初始化-数据准备 */
  init: function () {
    var that = this
    wx.showNavigationBarLoading() // 导航条显示加载-------------------这里
    // 获取图书馆密码和一卡通密码
    app.getOtherPw(function (status) {
      if (status) that.checkIndexData() // 获取用户信息
      else console.log("图书馆密码和一卡通密码获取fail" + ":23333")
    })
  },

  /* 数据检查 */
  checkIndexData: function () {
    // 优先课表显示判断
    if (wx.getStorageSync('firstCourse') == "1") {
      // 跳转到重新登录
      wx.navigateTo({
        url: '/pages/course/course'
      })
    }
    this.data.oldData = wx.getStorageSync('oldData')
    // 如果距离上次获取数据的时间超过了两个小时则重新获取数据
    if (this.data.oldData && (new Date().getTime() - this.data.oldData.refreshTime) < 7200000) {
      // 从缓存中取得数据放到全局变量，准备进行数据设置
      this.setIndexData("", "")
    } else {
      wx.startPullDownRefresh() // 开始刷数据
    }
  },

  /* 数据获取 */
  /**
   * 【数据获取】
   *  存入userInfo到全局
   */
  getIndexData: function () {
    var that = this
    if (this.data.oldData == '') this.data.oldData = {}
    // 获取拱拱个人信息并设置到视图层
    c_index.getUserInfo(function (userInfo) {
      that.loadingCheck()
      app.globalData.errCodeTimes = 0
      if (app.errorCheck("个人信息", userInfo)) {
        /* 把个人数据设置到页面和全局 */
        that.setIndexData("userInfo", userInfo.data)
        c_index.getTimerInfo(function (userInfo) {
          that.loadingCheck()
          if (userInfo) {
            that.setIndexData("timer", userInfo)
          } else if (that.data.oldData.userInfo) {
            that.setIndexData("timer", that.data.oldData.userInfo)
          }
        })
      } else if (that.data.oldData.userInfo) {
        that.setIndexData("userInfo", that.data.oldData.userInfo)
      } else {
        console.log("倒计时:获取失败:无法获取用户个人信息")
      }
    })
    // 获取课程信息并设置到视图层
    c_index.getCourse(function (courseInfo) {
      that.loadingCheck()
      app.globalData.errCodeTimes = 0
      if (app.errorCheck("课表信息", courseInfo)) {
        that.setIndexData("courseData", courseInfo.data)
      } else if (that.data.oldData.courseInfo) {
        that.setIndexData("courseData", that.data.oldData.courseInfo)
      }
    })
    // 获取图书馆用户信息并设置到视图层
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
        that.setIndexData("libraryUser", libraryUser.data)
      } else if (that.data.oldData.libraryUser) {
        that.setIndexData("libraryUser", that.data.oldData.libraryUser)
      }
    })
    // 获取图书馆借阅信息并计算最近一本书的剩余天数并设置到视图层
    c_index.getLibraryRentList(function (rentList) {
      that.loadingCheck()
      if (app.errorCheck("图书馆借阅信息", rentList)) {
        if (rentList.data == null) {
          var bookTimer = "暂无"
        } else {
          var temp = libraryBook[0]['interval']
          for (var x in libraryBook) {
            if (libraryBook[x]['interval'] < temp) temp = libraryBook[x]['interval']
          }
          var bookTimer = temp + " 天"
        }
        rentList.data = bookTimer
        that.setIndexData("rentList", rentList.data)
      } else if (that.data.oldData.rentList) {
        that.setIndexData("rentList", that.data.oldData.rentList)
      }
    })
    // 获取一卡通信息并设置到视图层
    c_index.getEcard(function (eCardInfo) {
      that.loadingCheck()
      if (app.errorCheck("一卡通信息", eCardInfo)) {
        that.setIndexData("eCardInfo", eCardInfo.data)
      } else if (that.data.oldData.eCardInfo) {
        that.setIndexData("eCardInfo", that.data.oldData.eCardInfo)
      }
    })
    // 获取校园余额并设置到视图层
    c_index.getNetInfo(function (netInfo) {
      that.loadingCheck()
      if (app.errorCheck("校园网余额")) {
        that.setIndexData("netInfo", netInfo.data)
      } else if (that.data.oldData.netInfo) {
        that.setIndexData("netInfo", that.data.oldData.netInfo)
      }
    })
  },

  /**
   * 检查页面加载状态
   */
  loadingCheck: function () {
    this.data.loading++
    if (this.data.loading == 7) {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
      this.data.loading = 0
    }
  },

  /**
   * 设置数据到界面，
   * 传入的参数表示数据类型和数据
   * 存储userInfo和courseData到全局
   * @param {*string} type
   * @param {*obj} data
   */
  setIndexData: function (type, data) {
    if (type == "userInfo") {
      app.globalData.userInfo = data
      this.data.oldData.userInfo = data
      this.setData({
        userImg: data['img']
      })
    } else if (type == "timer") {
      app.globalData.userInfo = data
      this.data.oldData.userInfo = data
      this.setData({
        showTimer: data.showTimer
      })
    } else if (type == "courseData") {
      app.globalData.courseData = data
      this.data.oldData.courseData = data
      this.setData({
        page_status: data.todayCourse.status,
        todayCourse: data.todayCourse.todayCourseNum,
        todayCourseDetail: data.todayCourse.todayCourseDetail
      })
    } else if (type == "libraryUser") {
      this.data.oldData.libraryUser = data
      this.setData({
        libraryDebt: data['debt']
      })
    } else if (type == "rentList") {
      this.data.oldData.rentList = data
      this.setData({
        bookTimer: data
      })
    } else if (type == "eCardInfo") {
      this.data.oldData.eCardInfo = data
      this.setData({
        balance: data.balance,
        unclaimed: data.unclaimed
      })
    } else if (type == "netInfo") {
      this.data.oldData.netInfo = data
      this.setData({
        net: data.balance
      })
    } else if (type == "") {
      if (this.data.oldData.userInfo)
        this.setData({
          userImg: this.data.oldData.userInfo['img'],
          showTimer: this.data.oldData.userInfo.showTimer,
        })
      if (this.data.oldData.courseData)
        this.setData({
          page_status: this.data.oldData.courseData.todayCourse.status,
          todayCourse: this.data.oldData.courseData.todayCourse.todayCourseNum,
          todayCourseDetail: this.data.oldData.courseData.todayCourse.todayCourseDetail,
        })
      if (this.data.oldData.libraryUser)
        this.setData({
          libraryDebt: this.data.oldData.libraryUser['debt'],
        })
      if (this.data.oldData.rentList)
        this.setData({
          bookTimer: this.data.oldData.rentList,
        })
      if (this.data.oldData.eCardInfo)
        this.setData({
          balance: this.data.oldData.eCardInfo.balance,
          unclaimed: this.data.oldData.eCardInfo.unclaimed,
        })
      if (this.data.oldData.netInfo)
        this.setData({
          net: this.data.oldData.netInfo.balance
        })
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
    }
    // 加载态判断
    this.data.oldData.refreshTime = new Date().getTime()
    wx.setStorageSync('oldData', this.data.oldData)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 检查session状态
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        that.init()
      },
      fail: function () {
        // 重新登录
        wx.login({
          success: function (res) {
            that.init()
          }
        })
      }
    })
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
    wx.showNavigationBarLoading() // 导航条显示加载
    if (app.loginCheck() == "1") {
      this.getIndexData()
    }
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