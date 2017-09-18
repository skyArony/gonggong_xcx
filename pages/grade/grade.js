// grade.js
var app = getApp()
var common = require('../../common/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gradeData: null, // 本页下部分(各学期成绩绩点)数据
    rankInfo: null, // 本页上部分(总学期成绩绩点)数据
    avgGpa: "-", // 平均绩点
    classRank: "-", // 班级排名
    majorRank: "-", // 专业排名
    avgGrade: "-", // 平均成绩
    gradeInfo: null, // 成绩信息
    gradeArray: null, // 处理后的成绩信息
    status: 0, // 0-数据正在加载，1-无数据，新生？，2-数据获取成功
    four2l: 0,
    four1l: 0,
    three2l: 0,
    three1l: 0,
    two2l: 0,
    two1l: 0,
    one2l: 0,
    one1l: 0,
    counter: 0, // 计数器
    pastTerm: 0, // 已过学期数
  },

  /* 初始化 */
  init: function () {
    this.data.gradeData = wx.getStorageSync('gradeData')
    if (this.data.gradeData && (new Date().getTime() - this.data.gradeData.refreshTime) < /* 7200000 */ 3) {
      // 从缓存中取得数据放到全局变量，准备进行数据设置
      // this.setGradeData()
    } else {
      wx.showNavigationBarLoading() // 导航条显示加载
      this.getGradeData()
      // this.setGradeData()
    }
  },

  getGradeData: function () {
    var that = this
    app.globalData.loginType = wx.getStorageSync('loginType')
    common.getGradeInfo(function (gradeData) {
      console.log(gradeData)
      that.data.gradeData = gradeData
      that.endCheck("gradeData")
    })
    common.getRankInfo(function (rankInfo) {
      console.log(rankInfo)
      that.data.rankInfo = rankInfo
      that.endCheck("rankInfo")
    })
  },

  /* 总绩点获取及显示 */
  setGradeDataUp: function () {

  },

  /* 各学期绩点获取及显示 */
  setGradeDataDown: function () {

  },

  /* 数据加载检查 */
  endCheck: function (type) {
    // 本页面加载项：
    // 整个页面的加载态在课程信息加载完后结束
    console.log(type + "当前加载状态：" + app.globalData.isEnd)
    if(type = "gradeData") {
      this.data.gradeData.refreshTime = new Date().getTime()
      this.setGradeDataDown()
      wx.setStorageSync(type, this.data.gradeData)
    } 
    if(type = "rankInfo") {
      this.data.rankInfo.refreshTime = new Date().getTime()
      this.setGradeDataUp()
      wx.setStorageSync(type, this.data.rankInfo)
    } 
    if (this.data.gradeData && this.data.rankInfo) {
      wx.hideNavigationBarLoading()
    }
  },


  // /**
  //  * 生命周期函数--监听页面加载
  //  */
  onLoad: function (options) {
    this.init()


    //   var that = this
    //   app.getGradeInfo(function (gradeInfo) {
    //     if (gradeInfo.length == 0) {
    //       that.setData({
    //         status: 1
    //       })
    //     } else {
    //       // 将获取到的数据进行处理,以下九个数组分别为总数据容器和八个学期数据的容器
    //       var four2 = []
    //       var four1 = []
    //       var three2 = []
    //       var three1 = []
    //       var two2 = []
    //       var two1 = []
    //       var one2 = []
    //       var one1 = []
    //       for (var x in gradeInfo) {
    //         if (gradeInfo[x]['term'] == '1') {
    //           one1.push(gradeInfo[x])
    //         } else if (gradeInfo[x]['term'] == '2') {
    //           one2.push(gradeInfo[x])
    //         } else if (gradeInfo[x]['term'] == '3') {
    //           two1.push(gradeInfo[x])
    //         } else if (gradeInfo[x]['term'] == '4') {
    //           two2.push(gradeInfo[x])
    //         } else if (gradeInfo[x]['term'] == '5') {
    //           three1.push(gradeInfo[x])
    //         } else if (gradeInfo[x]['term'] == '6') {
    //           three2.push(gradeInfo[x])
    //         } else if (gradeInfo[x]['term'] == '7') {
    //           four1.push(gradeInfo[x])
    //         } else if (gradeInfo[x]['term'] == '8') {
    //           four2.push(gradeInfo[x])
    //         }
    //       }
    //       var gradeArray = {}
    //       gradeArray.大四下学期 = four2
    //       gradeArray.大四上学期 = four1
    //       gradeArray.大三下学期 = three2
    //       gradeArray.大三上学期 = three1
    //       gradeArray.大二下学期 = two2
    //       gradeArray.大二上学期 = two1
    //       gradeArray.大一下学期 = one2
    //       gradeArray.大一上学期 = one1
    //       that.data.gradeArray = gradeArray
    //       for (var y in gradeArray) {
    //         if (gradeArray[y].length > 0) {
    //           that.data.pastTerm++
    //         }
    //       }
    //       console.log(gradeArray)
    //       that.getEveryRank(function (gradeArray) {
    //         if (that.data.counter == that.data.pastTerm) {
    //           that.setData({
    //             status: 2,
    //             gradeInfo: gradeArray,
    //             four2l: gradeArray["大四下学期"].length,
    //             four1l: gradeArray["大四上学期"].length,
    //             three2l: gradeArray["大三下学期"].length,
    //             three1l: gradeArray["大三上学期"].length,
    //             two2l: gradeArray["大二下学期"].length,
    //             two1l: gradeArray["大二上学期"].length,
    //             one2l: gradeArray["大一下学期"].length,
    //             one1l: gradeArray["大一上学期"].length,
    //           })
    //         }
    //       })

    //     }
    //   })
    //   if (wx.getStorageSync('rankInfo')) {

    //   } else {

    //   }
    // app.getRankInfo(function (rankInfo) {
    //   var rankInfo = rankInfo

    // })
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