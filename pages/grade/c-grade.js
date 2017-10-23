var app = getApp()

/* 对成绩数据进行处理,返回各学期的绩点和成绩 */
function getAllRank(gradeInfo, cb) {
  var gradeData = {}
  gradeData.pastTerm = 0
  gradeData.counter = 0
  gradeData.termGrade = {}
  // 将获取到的数据进行处理,以下九个数组分别为总数据容器和八个学期数据的容器
  gradeData.termGrade.大四下学期 = []
  gradeData.termGrade.大四上学期 = []
  gradeData.termGrade.大三下学期 = []
  gradeData.termGrade.大三上学期 = []
  gradeData.termGrade.大二下学期 = []
  gradeData.termGrade.大二上学期 = []
  gradeData.termGrade.大一下学期 = []
  gradeData.termGrade.大一上学期 = []
  if (gradeInfo.length == 0) {
    gradeData.status = 1
  } else {
    for (var x in gradeInfo) {
      gradeData.status = 2
      if (gradeInfo[x]['term'] == '1') {
        gradeData.termGrade.大一上学期.push(gradeInfo[x])
      } else if (gradeInfo[x]['term'] == '2') {
        gradeData.termGrade.大一下学期.push(gradeInfo[x])
      } else if (gradeInfo[x]['term'] == '3') {
        gradeData.termGrade.大二上学期.push(gradeInfo[x])
      } else if (gradeInfo[x]['term'] == '4') {
        gradeData.termGrade.大二下学期.push(gradeInfo[x])
      } else if (gradeInfo[x]['term'] == '5') {
        gradeData.termGrade.大三上学期.push(gradeInfo[x])
      } else if (gradeInfo[x]['term'] == '6') {
        gradeData.termGrade.大三下学期.push(gradeInfo[x])
      } else if (gradeInfo[x]['term'] == '7') {
        gradeData.termGrade.大四上学期.push(gradeInfo[x])
      } else if (gradeInfo[x]['term'] == '8') {
        gradeData.termGrade.大四下学期.push(gradeInfo[x])
      }
    }
    for (var y in gradeData.termGrade) {
      if (gradeData.termGrade[y].length > 0) {
        gradeData.pastTerm++
      }
    }
    __getAllRank(gradeData, function (dealData) {
      if (app.errorCheck("各个学期绩点", dealData)) {
        if (dealData.data.counter == dealData.data.pastTerm) {
          typeof cb == "function" && cb(dealData.data)
        }
      } else {
        typeof cb == "function" && cb(null)
      }
    })
  }
}

/* 获取所有学期的绩点成绩 */
function __getAllRank(gradeData, cb) {
  var termcode = 8
  for (var x in gradeData.termGrade) {
    // 以下是一个闭包函数
    (function (x) {
      if (gradeData.termGrade[x].length > 0) {
        var creditObj = __countCredit(gradeData.termGrade[x])
        __getEveryRank(cb, termcode, x, gradeData, creditObj)
        termcode--
        app.globalData.errCodeTimes == 0
      } else {
        termcode--
      }
    })(x)
  }
}

/* 服务于_getALLRank */
function __getEveryRank(cb, termcode, x, gradeData, creditObj) {
  if (app.globalData.loginType == 1) {
    wx.request({
      url: app.globalData.EDU_RANK,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw,
        termcode: termcode
      },
      success: function (res) {
        if (res.data.code == 5 && app.globalData.errCodeTimes < 10) {
          app.globalData.errCodeTimes++
          __getEveryRank(cb, termcode, x, gradeData, creditObj)
        } else if (res.data.code == 2 && app.globalData.errCodeTimes < 10) {
          app.globalData.errCodeTimes++
          __getEveryRank(cb, termcode, x, gradeData, creditObj)
        } else if (res.data.code == 3) {
          gradeData.counter++
        } else if (res.data.code == 0) {
          console.log(x + ":" + res.data.data.gpa)
          gradeData.termGrade[x].push(res.data.data)
          gradeData.termGrade[x][gradeData.termGrade[x].length - 1].totalCredit = creditObj.totalCredit
          gradeData.termGrade[x][gradeData.termGrade[x].length - 1].requiredCredit = creditObj.requiredCredit
          gradeData.counter++
          res.data.data = gradeData
          typeof cb == "function" && cb(res.data)
        } else {
          typeof cb == "function" && cb(res.data)
        }
      },
      fail: function (res) {
        typeof cb == "function" && cb(null)
      }
    })
  } else if (app.globalData.loginType == 2) {
    wx.request({
      url: app.globalData.EDU_RANK_OLD,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw,
        termcode: termcode,
        session_id: wx.getStorageSync("session_id")
      },
      success: function (res) {
        if (res.data.code == 5 && app.globalData.errCodeTimes < 10) {
          app.globalData.errCodeTimes++
          __getEveryRank(cb, termcode, x, gradeData, creditObj)
        } else if (res.data.code == 2 && app.globalData.errCodeTimes < 10) {
          app.globalData.errCodeTimes++
          __getEveryRank(cb, termcode, x, gradeData, creditObj)
        } else if (res.data.code == 3) {
          gradeData.counter++
        } else if (res.data.code == 0) {
          console.log(x + ":" + res.data.data.gpa)
          gradeData.termGrade[x].push(res.data.data)
          gradeData.termGrade[x][gradeData.termGrade[x].length - 1].totalCredit = creditObj.totalCredit
          gradeData.termGrade[x][gradeData.termGrade[x].length - 1].requiredCredit = creditObj.requiredCredit
          gradeData.counter++
          res.data.data = gradeData
          typeof cb == "function" && cb(res.data)
        } else {
          typeof cb == "function" && cb(res.data)
        }
      },
      fail: function (res) {
        typeof cb == "function" && cb(null)
      }
    })
  }
}

/* 获取所有成绩信息 */
function getAllGrade(cb) {
  if (app.globalData.loginType == 1) {
    wx.request({
      url: app.globalData.EDU_GRADE_DETAILS,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw,
        all: "all"
      },
      success: function (res) {
        if (res.data.code == 5 && app.globalData.errCodeTimes < 10) {
          app.globalData.errCodeTimes++
          getAllGrade(cb)
        } else {
          typeof cb == "function" && cb(res.data)
        }
      },
      fail: function (res) {
        typeof cb == "function" && cb(null)
      }
    })
  } else if (app.globalData.loginType == 2) {
    wx.request({
      url: app.globalData.EDU_GRADE_DETAILS_OLD,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw,
        all: "all",
        session_id: wx.getStorageSync("session_id")
      },
      success: function (res) {
        if (res.data.code == 5 && app.globalData.errCodeTimes < 10) {
          app.globalData.errCodeTimes++
          getAllGrade(cb)
        } else {
          typeof cb == "function" && cb(res.data)
        }
      },
      fail: function (res) {
        typeof cb == "function" && cb(null)
      }
    })
  }
}

/* 获取总排名 */
function getTotalRank(cb) {
  if (app.globalData.loginType == 1) {
    wx.request({
      url: app.globalData.EDU_RANK,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw,
        termcode: "all"
      },
      success: function (res) {
        if (res.data.code == 5) getTotalRank(cb)
        else typeof cb == "function" && cb(res.data)
      },
      fail: function (res) {
        typeof cb == "function" && cb(null)
      }
    })
  } else if (app.globalData.loginType == 2) {
    wx.request({
      url: app.globalData.EDU_RANK_OLD,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw,
        termcode: "all",
        session_id: wx.getStorageSync("session_id")
      },
      success: function (res) {
        if (res.data.code == 5) getTotalRank(cb)
        else typeof cb == "function" && cb(res.data)
      },
      fail: function (res) {
        typeof cb == "function" && cb(null)
      }
    })
  }
}

/* 计算总学分和必修学分 */
function __countCredit(termGrade) {
  var totalCredit = 0 // 总学分
  var requiredCredit = 0 // 必修学分
  for (var x in termGrade) {
    if (termGrade[x]['type'] == '必修') {
      requiredCredit += parseFloat(termGrade[x]['credit'])
    }
    totalCredit += parseFloat(termGrade[x]['credit'])
  }
  var creditObj = {}
  creditObj.requiredCredit = requiredCredit.toFixed(1)
  creditObj.totalCredit = totalCredit.toFixed(1)
  return creditObj
}

module.exports.getAllRank = getAllRank
module.exports.getAllGrade = getAllGrade
module.exports.getTotalRank = getTotalRank