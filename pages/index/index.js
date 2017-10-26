// index.js
// 获取应用实例
var app = getApp()
var c_index = require('./c-index.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayCourseNum: "-",
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
    loading: 0, //加载态,为7时表示此页加载完毕,然后归零
  },

  /**
   * 函数
   */

  /* 敬请期待 */
  // waiting: function () {
  //   wx.showModal({
  //     title: '',
  //     content: '敬请期待',
  //     showCancel: false,
  //   })
  // },

  /* 初始化-登录状态检查-数据准备 */
  init: function (type) {
    var that = this
    if (app.loginCheck()) {
      wx.showNavigationBarLoading() // 导航条显示加载
      that.setData({ page_status: 1 })
      // 获取图书馆密码和一卡通密码
      app.getOtherPw(function (status) {
        if (status) {
          if (type == "refresh") that.getData()
          else that.checkData()
        } else {
          console.log("图书馆密码和一卡通密码获取fail" + ":23333")
          if (type == "refresh") that.getData()
          else that.checkData()
        }
      })
    } else that.setData({ page_status: 0 })
  },

  /* 数据检查 */
  checkData: function () {
    // 优先课表显示判断
    if (wx.getStorageSync('firstCourse')) {
      // 跳转到重新登录
      wx.navigateTo({
        url: '/pages/course/course'
      })
    }
    this.data.oldData = wx.getStorageSync('indexOldData')
    // 如果距离上次获取数据的时间超过了两个小时则重新获取数据
    if (this.data.oldData && (new Date().getTime() - this.data.oldData.refreshTime) < 7200000) {
      // 从缓存中取得数据放到全局变量，准备进行数据设置
      this.setDataTopage("", "")
    } else {
      this.getData()
    }
  },

  /**
   * 【数据获取】
   *  存入userInfo到全局
   */
  getData: function () {
    var that = this
    if (this.data.oldData == '') this.data.oldData = {}
    // 获取拱拱个人信息并设置到视图层
    c_index.getUserInfo(function (userInfo) {
      that.loadingCheck()
      app.globalData.errCodeTimes = 0
      if (app.errorCheck("个人信息", userInfo)) {
        /* 把个人数据设置到页面和全局 */
        that.setDataTopage("userInfo", userInfo.data)
        c_index.getTimerInfo(function (userInfo) {
          that.loadingCheck()
          if (userInfo) {
            that.setDataTopage("timer", userInfo)
          } else if (that.data.oldData.userInfo) {
            that.setDataTopage("timer", that.data.oldData.userInfo)
          }
        })
      } else if (that.data.oldData.userInfo) {
        that.setDataTopage("userInfo", that.data.oldData.userInfo)
      } else {
        console.log(userInfo)
        console.log("倒计时:获取失败:无法获取用户个人信息")
      }
    })
    // 获取课程信息并设置到视图层
    if (app.globalData.apiStatus.edu) {
      c_index.getCourse(function (courseInfo) {
        that.loadingCheck()
        app.globalData.errCodeTimes = 0
        if (app.errorCheck("课表信息", courseInfo)) {
          that.setDataTopage("courseData", courseInfo.data)
        } else if (that.data.oldData.courseInfo) {
          that.setDataTopage("courseData", that.data.oldData.courseInfo)
        }
      })
    } else if (that.data.oldData.courseInfo) {
      that.loadingCheck()
      that.setDataTopage("courseData", that.data.oldData.courseInfo)
      console.log("课程表:获取失败:开关被后台关闭")
    } else that.loadingCheck()
    // 获取图书馆用户信息并设置到视图层
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
          if (rentList.data == null) {
            var bookTimer = "暂无"
          } else {
            var temp = rentList.data[0]['interval']
            for (var x in rentList.data) {
              if (rentList.data[x]['interval'] < temp) temp = rentList.data[x]['interval']
            }
            var bookTimer = temp + " 天"
          }
          rentList.data = bookTimer
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
    // 获取一卡通信息并设置到视图层
    if (app.globalData.apiStatus.ecard) {
      c_index.getEcard(function (eCardInfo) {
        app.globalData.errCodeTimes = 0
        that.loadingCheck()
        if (app.errorCheck("一卡通信息", eCardInfo)) {
          that.setDataTopage("eCardInfo", eCardInfo.data)
        } else if (that.data.oldData.eCardInfo) {
          that.setDataTopage("eCardInfo", that.data.oldData.eCardInfo)
        }
      })
    } else if (that.data.oldData.eCardInfo) {
      that.loadingCheck()
      that.setDataTopage("eCardInfo", that.data.oldData.eCardInfo)
      console.log("一卡通:获取失败:开关被后台关闭")
    } else that.loadingCheck()
    // 获取校园余额并设置到视图层
    if (app.globalData.apiStatus.net) {
      c_index.getNetInfo(function (netInfo) {
        that.loadingCheck()
        if (app.errorCheck("校园网余额")) {
          that.setDataTopage("netInfo", netInfo.data)
        } else if (that.data.oldData.netInfo) {
          that.setDataTopage("netInfo", that.data.oldData.netInfo)
        }
      })
    } else if (that.data.oldData.netInfo) {
      that.loadingCheck()
      that.setDataTopage("netInfo", that.data.oldData.netInfo)
      console.log("校园网:获取失败:开关被后台关闭")
    } else that.loadingCheck()
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
  setDataTopage: function (type, data) {
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
      this.data.oldData.courseData = data
      this.setData({
        page_status: data.todayCourse.status,
        todayCourseNum: data.todayCourse.todayCourseNum,
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
      if (this.data.oldData.userInfo) {
        app.globalData.userInfo = this.data.oldData.userInfo
        this.setData({
          userImg: this.data.oldData.userInfo['img'],
          showTimer: this.data.oldData.userInfo.showTimer,
        })
      }
      if (this.data.oldData.courseData) {
        this.setData({
          page_status: this.data.oldData.courseData.todayCourse.status,
          todayCourseNum: this.data.oldData.courseData.todayCourse.todayCourseNum,
          todayCourseDetail: this.data.oldData.courseData.todayCourse.todayCourseDetail,
        })
      }
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
    if (type != '') {
      this.data.oldData.refreshTime = new Date().getTime()
      wx.setStorageSync('indexOldData', this.data.oldData)
    }
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
        that.init('load')
      },
      fail: function () {
        // 重新登录
        wx.login({
          success: function (res) {
            that.init('load')
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