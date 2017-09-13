// index.js
// 获取应用实例
var app = getApp()
var common = require('../../common/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayCourse: "-",
    todayCourseDetail: null, // 今天的课程详细信息
    showTimer: null, // timer信息
    bookTimer: "- 天",
    balance: "0.00", // 一卡通余额
    unclaimed: "0.00", // 一卡通待领
    libraryDebt: "0.00", // 图书馆欠费
    net: "0.00", // 校园网余额
    userImg: "../../images/user_none.png", // 用户头像
    status: 0, // 状态：0-数据正在加载，1-未登录，2-已登录，3-今天没有课
    indexData: null, // 存储此页面的数据
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

  /* 初始化 */
  init: function () {
    var that = this
    //  获取当前星期数
    common.getCurrentWeek()
    // 获取openId和sid
    this.getOpenId(function (openId) {
      // 根据openid获取学号
      wx.request({
        url: app.globalData.GET_SID,
        data: {
          openId: openId
        },
        success: function (res) {
          if (res.data.code == 0) {
            // 学号存入全局变量
            app.globalData.sid = res.data.sid
            console.log("学号获取成功")
            console.log(app.globalData.sid)
          } else {
            console.log("没有获取到学号")
            app.globalData.sid = null
          }
          // 获取用户信息
          that.checkLogin()
        }
      })
    })
  },

  /* 获取openId */
  getOpenId: function (cb) {
    var that = this
    // 从本地获取openid
    if (wx.getStorageSync('openId')) {
      // openId存入全局变量
      app.globalData.openId = wx.getStorageSync('openId')
      typeof cb == "function" && cb(app.globalData.openId)
    } else {
      // 调用登录接口重新获取openid
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              url: app.globalData.GET_OPENID,
              data: {
                code: res.code
              },
              success: function (res) {
                // openId存入全局变量
                app.globalData.openId = res.data.openid
                // openid存入缓存
                wx.setStorage({
                  key: "openId",
                  data: res.data.openid
                })
                console.log("openId获取成功")
                console.log(res.data.openid)
                typeof cb == "function" && cb(app.globalData.openId)
              }
            })
          }
        }
      })
    }
  },

  /* 检查登录状态 */
  checkLogin: function () {
    var that = this
    // 用学号进行数据获取
    if (app.globalData.sid) {
      // 已有学号，进行数据获取
      wx.showNavigationBarLoading() // 导航条显示加载
      // 检查本地缓存是否存有密码
      if (wx.getStorageSync('portalpw')) {
        // password存入全局变量
        app.globalData.portalpw = wx.getStorageSync('portalpw')
        // 检查数据有效性并接着进行数据设置
        that.checkIndexData()
      } else {
        // 没有缓存密码，提示重新登录
        wx.showModal({
          title: '',
          content: '登录过期，请重新登录。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              that.setData({
                status: 1
              })
              // 跳转到重新登录
              wx.navigateTo({
                url: '/pages/login/login'
              })
            } else if (res.cancel) {
              that.setData({
                status: 1
              })
              wx.hideNavigationBarLoading()
            }
          }
        })
      }
    } else {
      // 没有绑定学号，提示是否前往绑定
      wx.showModal({
        title: '',
        content: '你没有绑定学号，无法使用所有功能，是否前往绑定？',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              status: 1
            })
            // 跳转到重新登录
            wx.navigateTo({
              url: '/pages/login/login'
            })
          } else if (res.cancel) {
            that.setData({
              status: 1
            })
          }
        }
      })
    }
  },

  /* 检查数据的有效性 */
  checkIndexData: function () {
    this.data.indexData = wx.getStorageSync('indexData')
    // 如果距离上次获取数据的时间超过了两个小时则重新获取数据
    if (this.data.indexData && (new Date().getTime() - this.data.indexData.refreshTime) < 7200000) {
      // 从缓存中取得数据放到全局变量，准备进行数据设置
      this.setIndexData()
    } else {
      this.getIndexData() // 存在数据未获取完就进行了下一步的数据设置的问题
    }
  },

  /* 进行本页所需的数据获取 */
  getIndexData: function () {
    var that = this
    that.data.indexData = {}
    // 获取拱拱个人信息并设置到视图层
    common.getUserInfo(function (userInfo) {
      that.data.indexData.userInfo = userInfo
      that.endCheck()
    })
    // 获取课程信息并设置到视图层
    common.getCourse(function (courseInfo) {
      that.data.indexData.courseInfo = courseInfo
      that.endCheck()
    })
    // 获取图书馆信息并设置到视图层
    common.getLibrary(function (libraryInfo) {
      that.data.indexData.libraryInfo = libraryInfo
      that.endCheck()
    })
    // 获取一卡通信息并设置到视图层
    common.getEcard(function (eCardInfo) {
      that.data.indexData.eCardInfo = eCardInfo
      that.endCheck()
    })
    // 获取校园余额并设置到视图层
    common.getNetInfo(function (netInfo) {
      that.data.indexData.netInfo = netInfo
      that.endCheck()
    })
  },

  /* 设置数据到视图层 */
  setIndexData: function () {
    // 设置头像等信息
    this.setData({
      userImg: this.data.indexData.userInfo['img']
    })
    // 设置timer
    this.setData({
      showTimer: this.data.indexData.showTimer
    })
    // 设置今日课程信息
    this.setData({
      status: this.data.indexData.courseInfo.status,
      todayCourse: this.data.indexData.courseInfo.todayCourseNum,
      todayCourseDetail: this.data.indexData.courseInfo.todayCourseDetail
    })
    // 设置图书馆信息
    this.setData({
      bookTimer: this.data.indexData.libraryInfo.libraryBook['bookTimer'],
      libraryDebt: this.data.indexData.libraryInfo.libararyUser['debt']
    })
    // 设置e卡通信息
    this.setData({
      balance: this.data.indexData.eCardInfo.balance,
      unclaimed: this.data.indexData.eCardInfo.unclaimed
    })
    // 设置校园卡余额
    this.setData({
      net: this.data.indexData.netInfo.balance
    })
  },

  /* 数据加载检查 */
  endCheck: function () {
    // 本页面加载项：userinfo,timer,course,library*2,campus_net,ecard
    // 整个页面的加载态在课程信息加载完后结束
    console.log("当前加载状态：" + app.globalData.isEnd)
    if (app.globalData.isEnd == 7) {
      wx.hideNavigationBarLoading()
      this.data.indexData.refreshTime = new Date().getTime()
      wx.setStorageSync('indexData', this.data.indexData)
      app.globalData.isEnd = 0
      this.setIndexData()
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