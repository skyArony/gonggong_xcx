// grade.js
var app = getApp()
var common = require('../../common/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gradeData: null, // 本页面数据
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
      this.getGradeData()
      // this.setGradeData()
    }
  },

  getGradeData: function () {
    app.globalData.loginType = wx.getStorageSync('loginType')
    common.getGradeInfo(function (gradeData) {
      console.log(gradeData)
    })

  },

  setGradeData: function () {
    // that.setData({
    //   status: 1
    // })
    // that.setData({
    //   status: 2,
    //   gradeInfo: gradeArray,
    //   four2l: gradeArray["大四下学期"].length,
    //   four1l: gradeArray["大四上学期"].length,
    //   three2l: gradeArray["大三下学期"].length,
    //   three1l: gradeArray["大三上学期"].length,
    //   two2l: gradeArray["大二下学期"].length,
    //   two1l: gradeArray["大二上学期"].length,
    //   one2l: gradeArray["大一下学期"].length,
    //   one1l: gradeArray["大一上学期"].length,
    // })
  },

  /* 计算总学分和必修学分 */
  // countCredit: function (gradeArray) {
  //   console.log("正在统计学分")
  //   var totalCredit = 0 // 总学分
  //   var requiredCredit = 0 // 必修学分
  //   for(var x in gradeArray) {
  //     if (gradeArray[x]['type'] == '必修') {
  //       requiredCredit += parseFloat(gradeArray[x]['credit'])
  //     }
  //     totalCredit += parseFloat(gradeArray[x]['credit'])
  //   }
  //   var creditObj = {}
  //   creditObj.requiredCredit = requiredCredit
  //   creditObj.totalCredit = totalCredit
  //   return creditObj
  // },

  /* 此处用循环会出蜜汁问题，所以只能这么写，而且因为学校绩点获取很慢，所以重复进行两次获取以提高获取成功率 */
  // getEveryRank: function (cb) {
  //   var that = this
  //   if (that.data.gradeArray['大四下学期'].length > 0) {
  //     var creditObj8 = that.countCredit(that.data.gradeArray['大四下学期'])
  //     wx.request({
  //       url: app.globalData.EDU_RANK,
  //       data: {
  //         role: app.globalData.app_AU,
  //         hash: app.globalData.app_ID,
  //         sid: app.globalData.sid,
  //         password: app.globalData.portalpw,
  //         termcode: 8
  //       },
  //       success: function (res) {
  //         if (res.data.code == 0) {
  //           console.log("第8学期的绩点排名获取成功")
  //           console.log(res)
  //           that.data.gradeArray['大四下学期'].push(res.data.data)
  //           that.data.gradeArray['大四下学期'][that.data.gradeArray['大四下学期'].length - 1].totalCredit = creditObj8.totalCredit
  //           that.data.gradeArray['大四下学期'][that.data.gradeArray['大四下学期'].length - 1].requiredCredit = creditObj8.requiredCredit
  //           that.data.counter++
  //           typeof cb == "function" && cb(that.data.gradeArray)
  //         }
  //       },
  //       fail: function (res) {
  //         console.log("第8学期的绩点排名获取失败！！！！！！！！！！！")
  //         console.log(res)
  //         wx.request({
  //           url: app.globalData.EDU_RANK,
  //           data: {
  //             role: app.globalData.app_AU,
  //             hash: app.globalData.app_ID,
  //             sid: app.globalData.sid,
  //             password: app.globalData.portalpw,
  //             termcode: 8
  //           },
  //           success: function (res) {
  //             if (res.data.code == 0) {
  //               console.log("第8学期的绩点排名获取成功")
  //               console.log(res)
  //               that.data.gradeArray['大四下学期'].push(res.data.data)
  //               that.data.gradeArray['大四下学期'][that.data.gradeArray['大四下学期'].length - 1].totalCredit = creditObj8.totalCredit
  //               that.data.gradeArray['大四下学期'][that.data.gradeArray['大四下学期'].length - 1].requiredCredit = creditObj8.requiredCredit
  //               that.data.counter++
  //               typeof cb == "function" && cb(that.data.gradeArray)
  //             }
  //           },
  //           fail: function (res) {
  //             console.log("第8学期的绩点排名获取又失败了~~~~~~~~~~")
  //             console.log(res)
  //           }
  //         })
  //       }
  //     })
  //   }
  //   if (that.data.gradeArray['大四上学期'].length > 0) {
  //     var creditObj7 = that.countCredit(that.data.gradeArray['大四上学期'])
  //     wx.request({
  //       url: app.globalData.EDU_RANK,
  //       data: {
  //         role: app.globalData.app_AU,
  //         hash: app.globalData.app_ID,
  //         sid: app.globalData.sid,
  //         password: app.globalData.portalpw,
  //         termcode: 7
  //       },
  //       success: function (res) {
  //         if (res.data.code == 0) {
  //           console.log("第7学期的绩点排名获取成功")
  //           console.log(res)
  //           that.data.gradeArray['大四上学期'].push(res.data.data)
  //           that.data.gradeArray['大四上学期'][that.data.gradeArray['大四上学期'].length - 1].totalCredit = creditObj7.totalCredit
  //           that.data.gradeArray['大四上学期'][that.data.gradeArray['大四上学期'].length - 1].requiredCredit = creditObj7.requiredCredit
  //           that.data.counter++
  //           typeof cb == "function" && cb(that.data.gradeArray)
  //         }
  //       },
  //       fail: function (res) {
  //         console.log("第7学期的绩点排名获取失败！！！！！！！！！！！")
  //         console.log(res)
  //         wx.request({
  //           url: app.globalData.EDU_RANK,
  //           data: {
  //             role: app.globalData.app_AU,
  //             hash: app.globalData.app_ID,
  //             sid: app.globalData.sid,
  //             password: app.globalData.portalpw,
  //             termcode: 7
  //           },
  //           success: function (res) {
  //             if (res.data.code == 0) {
  //               console.log("第7学期的绩点排名获取成功")
  //               console.log(res)
  //               that.data.gradeArray['大四上学期'].push(res.data.data)
  //               that.data.gradeArray['大四上学期'][that.data.gradeArray['大四上学期'].length - 1].totalCredit = creditObj7.totalCredit
  //               that.data.gradeArray['大四上学期'][that.data.gradeArray['大四上学期'].length - 1].requiredCredit = creditObj7.requiredCredit
  //               that.data.counter++
  //               typeof cb == "function" && cb(that.data.gradeArray)
  //             }
  //           },
  //           fail: function (res) {
  //             console.log("第7学期的绩点排名获取又失败了~~~~~~~~~~~")
  //             console.log(res)
  //           }
  //         })
  //       }
  //     })
  //   }
  //   if (that.data.gradeArray['大三下学期'].length > 0) {
  //     var creditObj6 = that.countCredit(that.data.gradeArray['大三下学期'])
  //     wx.request({
  //       url: app.globalData.EDU_RANK,
  //       data: {
  //         role: app.globalData.app_AU,
  //         hash: app.globalData.app_ID,
  //         sid: app.globalData.sid,
  //         password: app.globalData.portalpw,
  //         termcode: 6
  //       },
  //       success: function (res) {
  //         if (res.data.code == 0) {
  //           console.log("第6学期的绩点排名获取成功")
  //           console.log(res)
  //           that.data.gradeArray['大三下学期'].push(res.data.data)
  //           that.data.gradeArray['大三下学期'][that.data.gradeArray['大三下学期'].length - 1].totalCredit = creditObj6.totalCredit
  //           that.data.gradeArray['大三下学期'][that.data.gradeArray['大三下学期'].length - 1].requiredCredit = creditObj6.requiredCredit
  //           that.data.counter++
  //           typeof cb == "function" && cb(that.data.gradeArray)
  //         }
  //       },
  //       fail: function (res) {
  //         console.log("第6学期的绩点排名获取失败！！！！！！！！！！！")
  //         console.log(res)
  //         wx.request({
  //           url: app.globalData.EDU_RANK,
  //           data: {
  //             role: app.globalData.app_AU,
  //             hash: app.globalData.app_ID,
  //             sid: app.globalData.sid,
  //             password: app.globalData.portalpw,
  //             termcode: 6
  //           },
  //           success: function (res) {
  //             if (res.data.code == 0) {
  //               console.log("第6学期的绩点排名获取成功")
  //               console.log(res)
  //               that.data.gradeArray['大三下学期'].push(res.data.data)
  //               that.data.gradeArray['大三下学期'][that.data.gradeArray['大三下学期'].length - 1].totalCredit = creditObj6.totalCredit
  //               that.data.gradeArray['大三下学期'][that.data.gradeArray['大三下学期'].length - 1].requiredCredit = creditObj6.requiredCredit
  //               that.data.counter++
  //               typeof cb == "function" && cb(that.data.gradeArray)
  //             }
  //           },
  //           fail: function (res) {
  //             console.log("第6学期的绩点排名获取又失败了~~~~~~~~~~~~~~")
  //             console.log(res)
  //           }
  //         })
  //       }
  //     })
  //   }
  //   if (that.data.gradeArray['大三上学期'].length > 0) {
  //     var creditObj5 = that.countCredit(that.data.gradeArray['大三上学期'])
  //     wx.request({
  //       url: app.globalData.EDU_RANK,
  //       data: {
  //         role: app.globalData.app_AU,
  //         hash: app.globalData.app_ID,
  //         sid: app.globalData.sid,
  //         password: app.globalData.portalpw,
  //         termcode: 5
  //       },
  //       success: function (res) {
  //         if (res.data.code == 0) {
  //           console.log("第5学期的绩点排名获取成功")
  //           console.log(res)
  //           that.data.gradeArray['大三上学期'].push(res.data.data)
  //           that.data.gradeArray['大三上学期'][that.data.gradeArray['大三上学期'].length - 1].totalCredit = creditObj5.totalCredit
  //           that.data.gradeArray['大三上学期'][that.data.gradeArray['大三上学期'].length - 1].requiredCredit = creditObj5.requiredCredit
  //           that.data.counter++
  //           typeof cb == "function" && cb(that.data.gradeArray)
  //         }
  //       },
  //       fail: function (res) {
  //         console.log("第5学期的绩点排名获取失败！！！！！！！！！！！")
  //         console.log(res)
  //         wx.request({
  //           url: app.globalData.EDU_RANK,
  //           data: {
  //             role: app.globalData.app_AU,
  //             hash: app.globalData.app_ID,
  //             sid: app.globalData.sid,
  //             password: app.globalData.portalpw,
  //             termcode: 5
  //           },
  //           success: function (res) {
  //             if (res.data.code == 0) {
  //               console.log("第5学期的绩点排名获取成功")
  //               console.log(res)
  //               that.data.gradeArray['大三上学期'].push(res.data.data)
  //               that.data.gradeArray['大三上学期'][that.data.gradeArray['大三上学期'].length - 1].totalCredit = creditObj5.totalCredit
  //               that.data.gradeArray['大三上学期'][that.data.gradeArray['大三上学期'].length - 1].requiredCredit = creditObj5.requiredCredit
  //               that.data.counter++
  //               typeof cb == "function" && cb(that.data.gradeArray)
  //             }
  //           },
  //           fail: function (res) {
  //             console.log("第5学期的绩点排名获取又失败了~~~~~~~~~~~~")
  //             console.log(res)
  //           }
  //         })
  //       }
  //     })
  //   }
  //   if (that.data.gradeArray['大二下学期'].length > 0) {
  //     var creditObj4 = that.countCredit(that.data.gradeArray['大二下学期'])
  //     wx.request({
  //       url: app.globalData.EDU_RANK,
  //       data: {
  //         role: app.globalData.app_AU,
  //         hash: app.globalData.app_ID,
  //         sid: app.globalData.sid,
  //         password: app.globalData.portalpw,
  //         termcode: 4
  //       },
  //       success: function (res) {
  //         if (res.data.code == 0) {
  //           console.log("第4学期的绩点排名获取成功")
  //           console.log(res)
  //           that.data.gradeArray['大二下学期'].push(res.data.data)
  //           that.data.gradeArray['大二下学期'][that.data.gradeArray['大二下学期'].length - 1].totalCredit = creditObj4.totalCredit
  //           that.data.gradeArray['大二下学期'][that.data.gradeArray['大二下学期'].length - 1].requiredCredit = creditObj4.requiredCredit
  //           that.data.counter++
  //           typeof cb == "function" && cb(that.data.gradeArray)
  //         }
  //       },
  //       fail: function (res) {
  //         console.log("第4学期的绩点排名获取失败！！！！！！！！！！！")
  //         console.log(res)
  //         wx.request({
  //           url: app.globalData.EDU_RANK,
  //           data: {
  //             role: app.globalData.app_AU,
  //             hash: app.globalData.app_ID,
  //             sid: app.globalData.sid,
  //             password: app.globalData.portalpw,
  //             termcode: 4
  //           },
  //           success: function (res) {
  //             if (res.data.code == 0) {
  //               console.log("第4学期的绩点排名获取成功")
  //               console.log(res)
  //               that.data.gradeArray['大二下学期'].push(res.data.data)
  //               that.data.gradeArray['大二下学期'][that.data.gradeArray['大二下学期'].length - 1].totalCredit = creditObj4.totalCredit
  //               that.data.gradeArray['大二下学期'][that.data.gradeArray['大二下学期'].length - 1].requiredCredit = creditObj4.requiredCredit
  //               that.data.counter++
  //               typeof cb == "function" && cb(that.data.gradeArray)
  //             }
  //           },
  //           fail: function (res) {
  //             console.log("第4学期的绩点排名获取又失败了~~~~~~~~~~~~~~~")
  //             console.log(res)

  //           }
  //         })
  //       }
  //     })
  //   }
  //   if (that.data.gradeArray['大二上学期'].length > 0) {
  //     var creditObj3 = that.countCredit(that.data.gradeArray['大二上学期'])
  //     wx.request({
  //       url: app.globalData.EDU_RANK,
  //       data: {
  //         role: app.globalData.app_AU,
  //         hash: app.globalData.app_ID,
  //         sid: app.globalData.sid,
  //         password: app.globalData.portalpw,
  //         termcode: 3
  //       },
  //       success: function (res) {
  //         if (res.data.code == 0) {
  //           console.log("第3学期的绩点排名获取成功")
  //           console.log(res)
  //           that.data.gradeArray['大二上学期'].push(res.data.data)
  //           that.data.gradeArray['大二上学期'][that.data.gradeArray['大二上学期'].length - 1].totalCredit = creditObj3.totalCredit
  //           that.data.gradeArray['大二上学期'][that.data.gradeArray['大二上学期'].length - 1].requiredCredit = creditObj3.requiredCredit
  //           that.data.counter++
  //           typeof cb == "function" && cb(that.data.gradeArray)
  //         }
  //       },
  //       fail: function (res) {
  //         console.log("第3学期的绩点排名获取失败！！！！！！！！！！！")
  //         console.log(res)
  //         wx.request({
  //           url: app.globalData.EDU_RANK,
  //           data: {
  //             role: app.globalData.app_AU,
  //             hash: app.globalData.app_ID,
  //             sid: app.globalData.sid,
  //             password: app.globalData.portalpw,
  //             termcode: 3
  //           },
  //           success: function (res) {
  //             if (res.data.code == 0) {
  //               console.log("第3学期的绩点排名获取成功")
  //               console.log(res)
  //               that.data.gradeArray['大二上学期'].push(res.data.data)
  //               that.data.gradeArray['大二上学期'][that.data.gradeArray['大二上学期'].length - 1].totalCredit = creditObj3.totalCredit
  //               that.data.gradeArray['大二上学期'][that.data.gradeArray['大二上学期'].length - 1].requiredCredit = creditObj3.requiredCredit
  //               that.data.counter++
  //               typeof cb == "function" && cb(that.data.gradeArray)
  //             }
  //           },
  //           fail: function (res) {
  //             console.log("第3学期的绩点排名获取又失败了~~~~~~~~~~~~~~~")
  //             console.log(res)
  //           }
  //         })
  //       }
  //     })
  //   }
  //   if (that.data.gradeArray['大一下学期'].length > 0) {
  //     var creditObj2 = that.countCredit(that.data.gradeArray['大一下学期'])
  //     wx.request({
  //       url: app.globalData.EDU_RANK,
  //       data: {
  //         role: app.globalData.app_AU,
  //         hash: app.globalData.app_ID,
  //         sid: app.globalData.sid,
  //         password: app.globalData.portalpw,
  //         termcode: 2
  //       },
  //       success: function (res) {
  //         if (res.data.code == 0) {
  //           console.log("第2学期的绩点排名获取成功")
  //           console.log(res)
  //           that.data.gradeArray['大一下学期'].push(res.data.data)
  //           that.data.gradeArray['大一下学期'][that.data.gradeArray['大一下学期'].length - 1].totalCredit = creditObj2.totalCredit
  //           that.data.gradeArray['大一下学期'][that.data.gradeArray['大一下学期'].length - 1].requiredCredit = creditObj2.requiredCredit
  //           that.data.counter++
  //           typeof cb == "function" && cb(that.data.gradeArray)
  //         }
  //       },
  //       fail: function (res) {
  //         console.log("第2学期的绩点排名获取失败！！！！！！！！！！！")
  //         console.log(res)
  //         wx.request({
  //           url: app.globalData.EDU_RANK,
  //           data: {
  //             role: app.globalData.app_AU,
  //             hash: app.globalData.app_ID,
  //             sid: app.globalData.sid,
  //             password: app.globalData.portalpw,
  //             termcode: 2
  //           },
  //           success: function (res) {
  //             if (res.data.code == 0) {
  //               console.log("第2学期的绩点排名获取成功")
  //               console.log(res)
  //               that.data.gradeArray['大一下学期'].push(res.data.data)
  //               that.data.gradeArray['大一下学期'][that.data.gradeArray['大一下学期'].length - 1].totalCredit = creditObj2.totalCredit
  //               that.data.gradeArray['大一下学期'][that.data.gradeArray['大一下学期'].length - 1].requiredCredit = creditObj2.requiredCredit
  //               that.data.counter++
  //               typeof cb == "function" && cb(that.data.gradeArray)
  //             }
  //           },
  //           fail: function (res) {
  //             console.log("第2学期的绩点排名获取又失败了~~~~~~~~~~~~~~~~")
  //             console.log(res)
  //           }
  //         })
  //       }
  //     })
  //   }
  //   if (that.data.gradeArray['大一上学期'].length > 0) {
  //     var creditObj = that.countCredit(that.data.gradeArray['大一上学期'])
  //     wx.request({
  //       url: app.globalData.EDU_RANK,
  //       data: {
  //         role: app.globalData.app_AU,
  //         hash: app.globalData.app_ID,
  //         sid: app.globalData.sid,
  //         password: app.globalData.portalpw,
  //         termcode: 1
  //       },
  //       success: function (res) {
  //         if (res.data.code == 0) {
  //           console.log("第1学期的绩点排名获取成功")
  //           console.log(res)
  //           that.data.gradeArray['大一上学期'].push(res.data.data)
  //           that.data.gradeArray['大一上学期'][that.data.gradeArray['大一上学期'].length - 1].totalCredit    = creditObj.totalCredit
  //           that.data.gradeArray['大一上学期'][that.data.gradeArray['大一上学期'].length - 1].requiredCredit = creditObj.requiredCredit
  //           that.data.counter++
  //           typeof cb == "function" && cb(that.data.gradeArray)
  //         }
  //       },
  //       fail: function (res) {
  //         console.log("第1学期的绩点排名获取失败！！！！！！！！！！！")
  //         console.log(res)
  //         wx.request({
  //           url: app.globalData.EDU_RANK,
  //           data: {
  //             role: app.globalData.app_AU,
  //             hash: app.globalData.app_ID,
  //             sid: app.globalData.sid,
  //             password: app.globalData.portalpw,
  //             termcode: 1
  //           },
  //           success: function (res) {
  //             if (res.data.code == 0) {
  //               console.log("第1学期的绩点排名获取成功")
  //               console.log(res)
  //               that.data.gradeArray['大一上学期'].push(res.data.data)
  //               that.data.gradeArray['大一上学期'][that.data.gradeArray['大一上学期'].length - 1].totalCredit = creditObj.totalCredit
  //               that.data.gradeArray['大一上学期'][that.data.gradeArray['大一上学期'].length - 1].requiredCredit = creditObj.requiredCredit
  //               that.data.counter++
  //               typeof cb == "function" && cb(that.data.gradeArray)
  //             }
  //           },
  //           fail: function (res) {
  //             console.log("第1学期的绩点排名获取又失败了")
  //             console.log(res)

  //           }
  //         })
  //       }
  //     })
  //   }
  // },
  // /* ----------------------不优雅的代码到此结束------------------------- */
  
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