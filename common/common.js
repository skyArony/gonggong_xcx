/* 通用函数 */
var app = getApp()

/* ----------------------------全局方法------------------------- */

/* -----------------------------for:index:start------------------------ */

/* 获取头像、昵称等基础信息 */
function getUserInfo(cb) {
  if (app.globalData.loginType == 1) {
    wx.request({
      url: app.globalData.LOGIN,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw
      },
      success: function (res) {
        app.globalData.isEnd++
        if (res.data.code == 0) {
          app.globalData.userInfo = res.data.data
          if (app.globalData.userInfo.sex == "男" && app.globalData.userInfo.img == "") app.globalData.userInfo.img = "../../images/header.png"
          else if (app.globalData.userInfo.sex == "女" && app.globalData.userInfo.img == "") app.globalData.userInfo.img = "../../images/header2.png"
          if (app.globalData.userInfo.timer == "") app.globalData.userInfo.timer = "[]"
          typeof cb == "function" && cb(res.data.data)
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        app.globalData.isEnd++
        typeof cb == "function" && cb(null)
      }
    })
  } else if (app.globalData.loginType == 2) {
    wx.request({
      url: app.globalData.LOGIN_OLD,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw
      },
      success: function (res) {
        app.globalData.isEnd++
        if (res.data.code == 0) {
          app.globalData.userInfo = res.data.data
          if (app.globalData.userInfo.sex == "男" && app.globalData.userInfo.img == "") app.globalData.userInfo.img = "../../images/header.png"
          else if (app.globalData.userInfo.sex == "女" && app.globalData.userInfo.img == "") app.globalData.userInfo.img = "../../images/header2.png"
          if (app.globalData.userInfo.timer == "") app.globalData.userInfo.timer = "[]"
          typeof cb == "function" && cb(res.data.data)
        } else if (res.data.code == 5) {
          /* 可能会验证码识别错误,所以执行两次,但仍然无法保证两次都正确 */
          wx.request({
            url: app.globalData.LOGIN_OLD,
            data: {
              role: app.globalData.app_AU,
              hash: app.globalData.app_ID,
              sid: app.globalData.sid,
              password: app.globalData.portalpw
            },
            success: function (res) {
              if (res.data.code == 0) {
                app.globalData.userInfo = res.data.data
                if (app.globalData.userInfo.sex == "男" && app.globalData.userInfo.img == "") app.globalData.userInfo.img = "../../images/header.png"
                else if (app.globalData.userInfo.sex == "女" && app.globalData.userInfo.img == "") app.globalData.userInfo.img = "../../images/header2.png"
                if (app.globalData.userInfo.timer == "") app.globalData.userInfo.timer = "[]"
                typeof cb == "function" && cb(res.data.data)
              } else {
                typeof cb == "function" && cb(null)
              }
            },
            fail: function (res) {
              app.globalData.isEnd++
              typeof cb == "function" && cb(null)
            }
          })
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        app.globalData.isEnd++
        typeof cb == "function" && cb(null)
      }
    })
  }
}

/* 处理timer */
function getTimerInfo(cb) {
  var userInfo = app.globalData.userInfo
  // 将官方timer和私人timer进行合并然后再将数据并入用户信息中
  _handleTimer(function (officalTimer) {
    console.log(app.globalData.userInfo)
    var userTimer = JSON.parse(userInfo['timer']) // 私人计时
    var availableTimer = new Array() // 可用（未过期的官方计时和所有的私人计时）计时容器
    // 用户timer过期的还是要放入
    for (var x in userTimer) {
      availableTimer.push(userTimer[x])
    }
    for (var y in officalTimer) {
      if (new Date(officalTimer[y]['start_date'] + " " + officalTimer[y]['start_time']) > new Date()) {
        availableTimer.push(officalTimer[y])
      }
    }
    availableTimer.sort(by('start_date', by('start_time')));
    // 数据再处理\计算出天数
    var tempTimer = new Array()
    for (var z in availableTimer) {
      var remainDay = (new Date(availableTimer[z]['start_date']) - new Date()) / 1000 / 60 / 60 / 24
      remainDay = Math.ceil(remainDay)
      var obj = {
        name: availableTimer[z]['name'],
        location: availableTimer[z]['location'],
        start_date: availableTimer[z]['start_date'],
        start_time: availableTimer[z]['start_time'],
        remainDay: remainDay
      }
      tempTimer.push(obj)
    }
    availableTimer = tempTimer
    app.globalData.availableTimer = tempTimer
    // 将可以显示在index的timer取出
    var showTimer = new Array()
    for (var t in availableTimer) {
      if (availableTimer[t]['remainDay'] > 0) {
        showTimer.push(availableTimer[t])
      }
    }
    userInfo['showTimer'] = showTimer
    app.globalData.userInfo = userInfo
    typeof cb == "function" && cb(userInfo)
  })
}

/* timer数据获取及处理，此函数服务getTimerInfo，不向外暴露 */
function _handleTimer(cb) {
  wx.request({
    url: app.globalData.GONGGONG_OFFICALTIMER,
    data: {
      role: app.globalData.app_AU,
      hash: app.globalData.app_ID,
    },
    success: function (res) {
      app.globalData.isEnd++
      if (res.data.code == 0) {
        typeof cb == "function" && cb(res.data.data)
      } else {
        typeof cb == "function" && cb(null)
      }
    },
    fail: function (res) {
      app.globalData.isEnd++
      typeof cb == "function" && cb(null)
    }
  })
}

/* 获取课程表-全部信息放到全局变量-今天课程信息返回 */
function getCourse(cb) {
  if (app.globalData.loginType == 1) {
    wx.request({
      url: app.globalData.EDU_COURSE,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw
      },
      success: function (res) {
        app.globalData.isEnd++
        if (res.data.code == 0) {
          typeof cb == "function" && cb(_getTodayCorse(res))
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        app.globalData.isEnd++
        typeof cb == "function" && cb(null)
      }
    })
  } else if (app.globalData.loginType == 2) {
    wx.request({
      url: app.globalData.EDU_COURSE_OLD,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw
      },
      success: function (res) {
        app.globalData.isEnd++
        if (res.data.code == 0) {
          typeof cb == "function" && cb(_getTodayCorse(res))
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        app.globalData.isEnd++
        typeof cb == "function" && cb(null)
      }
    })
  }
}

/* 服务于getCourse的复用函数————获取今日课程 */
function _getTodayCorse(res) {
  app.globalData.courseInfo = res.data.data
  // 时令表
  var winter_start = ["8:00", "8:55", "10:10", "11:05", "14:00", "14:55", "16:10", "17:05", "19:00", "19:55", "20:50"]
  var winter_end = ["8:45", "9:40", "10:55", "11:50", "14:45", "15:40", "16:55", "17:50", "19:45", "20:40", "21:35"]
  var summer_start = ["8:00", "8:55", "10:10", "11:05", "14:30", "15:25", "16:40", "17:35", "19:30", "20:25", "21:20"]
  var summer_end = ["8:45", "9:40", "10:55", "11:50", "15:15", "16:10", "17:25", "18:20", "19:15", "21:10", "22:05"]
  // 今日课程信息
  var courseInfo = res.data.data
  var todayCourseNum = 0
  var todayCourseDetail = new Array()
  var week = new Date().getDay() // 星期
  var month = new Date().getMonth() // 月份
  for (var tCourse in courseInfo[week]) {
    for (var course in courseInfo[week][tCourse]) {
      var weekArray = courseInfo[week][tCourse][course]['week'].split(',')
      if (inArray(weekArray, app.globalData.currentWeek)) {
        todayCourseNum++
        if (month == 5 || month == 6 || month == 7 || month == 8 || month == 9) {
          courseInfo[week][tCourse][course]['start_time'] = summer_start[courseInfo[week][tCourse][course]['section_start'] - 1]
          courseInfo[week][tCourse][course]['end_time'] = summer_end[courseInfo[week][tCourse][course]['section_end'] - 1]
        } else {
          courseInfo[week][tCourse][course]['start_time'] = winter_start[courseInfo[week][tCourse][course]['section_start'] - 1]
          courseInfo[week][tCourse][course]['end_time'] = winter_end[courseInfo[week][tCourse][course]['section_end'] - 1]
        }
        todayCourseDetail.push(courseInfo[week][tCourse][course])
      }
    }
  }
  var todayCourse = {}
  todayCourse.todayCourseNum = todayCourseNum
  todayCourse.todayCourseDetail = todayCourseDetail
  if (todayCourseNum == 0) todayCourse.status = 3
  else todayCourse.status = 2
  return todayCourse
}

/* 获取图书馆读者信息 */
function getLibrary(cb) {
  if (app.globalData.loginType == 1) {
    wx.request({
      url: app.globalData.LIBRARY_READER_INFO,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw
      },
      success: function (res) {
        app.globalData.isEnd++
        if (res.data.code == 0) {
          app.globalData.libraryInfo.libararyUser = res.data.data
          typeof cb == "function" && cb(res.data.data)
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        app.globalData.isEnd++
        typeof cb == "function" && cb(null)
      }
    })
  } else if (app.globalData.loginType == 2) {
    wx.request({
      url: app.globalData.LIBRARY_READER_INFO_OLD,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.librarypw
      },
      success: function (res) {
        app.globalData.isEnd++
        if (res.data.code == 0) {
          app.globalData.libraryInfo.libararyUser = res.data.data
          typeof cb == "function" && cb(res.data.data)
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        app.globalData.isEnd++
        typeof cb == "function" && cb(null)
      }
    })
  }
}

/* 获取图书馆读者借阅信息 */
function getLibraryRentList(cb) {
  var libraryInfo = {}
  var libararyUser = app.globalData.libraryInfo.libararyUser
  if (libararyUser) {
    // 欠费处理
    var debt = libararyUser.debt
    if (debt > 0) {
      debt = -debt
      debt = debt.toFixed(2)
    }
    else debt = "0.00"
    libararyUser['debt'] = debt
  } else {
    libararyUser = null
  }
  _getLibraryBook(function (libraryBook) {
    libraryInfo.libararyUser = libararyUser
    libraryInfo.libraryBook = libraryBook
    // 剩余还书天数
    if (libraryBook == null) {
      var bookTimer = "暂无"
    } else {
      var temp = 100
      for (var x in libararyBook) {
        if (libararyBook[x]['interval'] < temp) temp = libararyBook[x]['interval']
      }
      var bookTimer = temp + " 天"
    }
    libraryInfo.bookTimer = bookTimer
    app.globalData.libraryInfo = libraryInfo
    typeof cb == "function" && cb(libraryInfo)
  })
}

/* 图书借阅信息获取及处理，服务于getLibraryRentList，不向外暴露接口 */
function _getLibraryBook(cb) {
  if (app.globalData.loginType == 1) {
    wx.request({
      url: app.globalData.LIBRARY_RENT_LIST,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw
      },
      success: function (res) {
        app.globalData.isEnd++
        if (res.data.code == 0) {
          typeof cb == "function" && cb(res.data.data)
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        app.globalData.isEnd++
        typeof cb == "function" && cb(null)
      }
    })
  } else if (app.globalData.loginType == 2) {
    wx.request({
      url: app.globalData.LIBRARY_RENT_LIST_OLD,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.librarypw
      },
      success: function (res) {
        app.globalData.isEnd++
        if (res.data.code == 0) {
          typeof cb == "function" && cb(res.data.data)
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        app.globalData.isEnd++
        typeof cb == "function" && cb(null)
      }
    })
  }
}

/* 获取一卡通信息 */
function getEcard(cb) {
  if (app.globalData.loginType == 1) {
    wx.request({
      url: app.globalData.ECARD_BALANCE,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw
      },
      success: function (res) {
        app.globalData.isEnd++
        if (res.data.code == 0) {
          app.globalData.ecardInfo['balance'] = res.data.data
          typeof cb == "function" && cb(app.globalData.ecardInfo)
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        app.globalData.isEnd++
        typeof cb == "function" && cb(null)
      }
    })
  } else if (app.globalData.loginType == 2) {
    wx.request({
      url: app.globalData.ECARD_BALANCE_OLD,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.ecardpw
      },
      success: function (res) {
        app.globalData.isEnd++
        if (res.data.code == 0) {
          app.globalData.ecardInfo['balance'] = res.data.data
          typeof cb == "function" && cb(app.globalData.ecardInfo)
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        app.globalData.isEnd++
        typeof cb == "function" && cb(null)
      }
    })
  }
}

/* 获取校园网账户信息 */
function getNetInfo(cb) {
  // wx.request({
  //   url: app.globalData.CAMPUS_NET,
  //   data: {
  //     role: app.globalData.app_AU,
  //     hash: app.globalData.app_ID,
  //     sid: app.globalData.sid,
  //   },
  //   success: function (res) {
  //     app.globalData.isEnd++
  //     if (res.data.code == 0) {
  //       typeof cb == "function" && cb(res.data.data)
  //     }else {
  //  typeof cb == "function" && cb(null)
  // }
  //   },
  //   fail: function (res) {
  //     app.globalData.isEnd++
  //     console.log("校园网账户信息 获取失败了！！！！！！！！！！！！！！！！！！！")
  //     typeof cb == "function" && cb(null)
  //   }
  // })
  app.globalData.isEnd++
  typeof cb == "function" && cb(null)
}

/* 错误收集 */
// function checkError(res, requestName) {
//   if (res.errMsg != "request:fail timeout") {
//     typeof cb == "function" && cb(res.data.data)
//   } else {
//     var tempData = null
//     typeof cb == "function" && cb(tempData)
//     // 错误收集并提示或者发送
//   }
// }

/* -----------------------------for:index:end------------------------ */

/* -----------------------------for:grade:start------------------------ */

/* 对成绩数据进行处理,返回各学期的绩点和成绩 */
function getGradeInfo(cb) {
  _getAllGrade(function (gradeInfo) {
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
      _getAllRank(gradeData, function (gradeData) {
        if (gradeData.counter == gradeData.pastTerm) {
          typeof cb == "function" && cb(gradeData)
        }
      })
    }
  })
}

/* 获取所有学期的绩点成绩 */
function _getAllRank(gradeData, cb) {
  var termcode = 8
  for (var x in gradeData.termGrade) {
    // 以下是一个闭包函数
    (function (x) {
      if (gradeData.termGrade[x].length > 0) {
        var creditObj = _countCredit(gradeData.termGrade[x])
        _getAllRankWhenFail(cb, termcode, x, gradeData, creditObj)
      } else {
        termcode--
      }
    })(x)
  }
}

/* 服务于_getALLRank */
function _getAllRankWhenFail(cb, termcode, x, gradeData, creditObj) {
  if (app.globalData.loginType == 1) {
    wx.request({
      url: app.globalData.EDU_RANK,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw,
        termcode: termcode--
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(x + "绩点排名获取成功")
          console.log(res.data.data.gpa)
          console.log(x)
          gradeData.termGrade[x].push(res.data.data)
          gradeData.termGrade[x][gradeData.termGrade[x].length - 1].totalCredit = creditObj.totalCredit
          gradeData.termGrade[x][gradeData.termGrade[x].length - 1].requiredCredit = creditObj.requiredCredit
          gradeData.counter++
          typeof cb == "function" && cb(gradeData)
        } else if (res.data.code == 5) {
          console.log(x + "的绩点排名获取失败___验证码错误")
          termcode++
          _getAllRankWhenFail(cb, termcode, x, gradeData, creditObj)
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        console.log(x + "绩点排名获取失败！！！！！！！！！！！")
        console.log(res)
        termcode++
        _getAllRankWhenFail(cb, termcode, x, gradeData, creditObj)
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
        termcode: termcode--
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(x + "的绩点排名获取成功")
          console.log(res.data.data.gpa)
          console.log(x)
          gradeData.termGrade[x].push(res.data.data)
          gradeData.termGrade[x][gradeData.termGrade[x].length - 1].totalCredit = creditObj.totalCredit
          gradeData.termGrade[x][gradeData.termGrade[x].length - 1].requiredCredit = creditObj.requiredCredit
          gradeData.counter++
          typeof cb == "function" && cb(gradeData)
        } else if (res.data.code == 5) {
          console.log(x + "的绩点排名获取失败___验证码错误")
          termcode++
          _getAllRankWhenFail(cb, termcode, x, gradeData, creditObj)
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        console.log(x + "绩点排名获取失败！！！！！！！！！！！")
        console.log(res)
        termcode++
        _getAllRankWhenFail(cb, termcode, x, gradeData, creditObj)
      }
    })
  }
}

/* 获取所有成绩信息 */
function _getAllGrade(cb) {
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
        if (res.data.code == 0) {
          typeof cb == "function" && cb(res.data.data)
        } else if (res.data.code == 5) {
          _getAllGrade(cb)
        } else {
          typeof cb == "function" && cb(null)
        }
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
        all: "all"
      },
      success: function (res) {
        if (res.data.code == 0) {
          typeof cb == "function" && cb(res.data.data)
        } else if (res.data.code == 5) {
          _getAllGrade(cb)
        } else {
          typeof cb == "function" && cb(null)
        }
      }
    })
  }
}

/* 获取总排名 */
function getRankInfo(cb) {
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
        if (res.data.code == 0) {
          console.log("总绩点排名信息获取成功")
          console.log(res)
          typeof cb == "function" && cb(res.data.data)
        } else if (res.data.code == 5) {
          getRankInfo(cb)
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        getRankInfo(cb)
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
        termcode: "all"
      },
      success: function (res) {
        if (res.data.code == 0) {
          typeof cb == "function" && cb(res.data.data)
        } else if (res.data.code == 5) {
          getRankInfo(cb)
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        getRankInfo(cb)
      }
    })
  }
}



/* -----------------------------for:ecard:start------------------------ */
/* 获取用户消费信息 */
function getBilling(add, cb) {
  var dateObj = _getQueryDate(add)
  console.log(dateObj)
  if (app.globalData.loginType == 1) {
    wx.request({
      url: app.globalData.ECARD_BILLING,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw,
        start_date: dateObj.start_date,
        end_date: dateObj.end_date
      },
      success: function (res) {
        if (res.data.code == 0) {
          // 通过遍历计算充值和支出
          var budget = _countBudget(res.data.data)
          var itemInfo = {}
          itemInfo.data = res.data.data
          itemInfo.month = dateObj.month
          itemInfo.year = dateObj.year
          itemInfo.recharge = budget.recharge
          itemInfo.expense = budget.expense
          typeof cb == "function" && cb(itemInfo)
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        app.globalData.isEnd++
        typeof cb == "function" && cb(null)
      }
    })
  } else if (app.globalData.loginType == 2) {
    wx.request({
      url: app.globalData.ECARD_BILLING_OLD,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.ecardpw,
        start_date: dateObj.start_date,
        end_date: dateObj.end_date
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          // 通过遍历计算充值和支出
          var budget = _countBudget(res.data.data)
          var itemInfo = {}
          itemInfo.data = res.data.data
          itemInfo.month = dateObj.month
          itemInfo.recharge = budget.recharge
          itemInfo.expense = budget.expense
          typeof cb == "function" && cb(itemInfo)
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        app.globalData.isEnd++
        typeof cb == "function" && cb(null)
      }
    })
  }
}

/* -----------------------------for:ecard:end------------------------ */

/* -----------------------------for:course:start------------------------ */
/* 获取课表页的用户课表信息 */
function getCompleteCourse(cb) {
  if (app.globalData.loginType == 1) {
    wx.request({
      url: app.globalData.EDU_COURSE,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw,
        style: 2
      },
      success: function (res) {
        if (res.data.code == 0) {
          typeof cb == "function" && cb(_mergeCorse(res))
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        app.globalData.isEnd++
        typeof cb == "function" && cb(null)
      }
    })
  } else if (app.globalData.loginType == 2) {
    wx.request({
      url: app.globalData.EDU_COURSE_OLD,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw,
        style: 2
      },
      success: function (res) {
        if (res.data.code == 0) {
          typeof cb == "function" && cb(_mergeCorse(res))
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
        app.globalData.isEnd++
        typeof cb == "function" && cb(null)
      }
    })
  }
}

/* 合并学校课表和学生自主添加的课表 */
function _mergeCorse(res) {
  var officalCourse = res.data.data
  var userCourse = JSON.parse(app.globalData.userInfo.course)
  /* 先要将官方课表中的课提取到上一层 */
  /* 合并用户课表 */
  /* 课表排序 */
  var allCourse = {}
  var x = 7
  while (x > 0) {
    if (officalCourse[x] && userCourse[x]) allCourse[x] = officalCourse[x].concat(userCourse[x])
    else if (officalCourse[x] && !userCourse[x]) allCourse[x] = officalCourse[x]
    else if (!officalCourse[x] && userCourse[x]) allCourse[x] = userCourse[x]
    else if (!officalCourse[x] && !userCourse[x]) allCourse[x] = null
    x--
  }
  for (var y in allCourse) {
    by('start_date', by('start_time'))
  } 
  console.log("allCourse")
  console.log(allCourse)
}


/* -----------------------------for:course:end------------------------ */

/* ----------------------------------------tools------------------------------------- */

/* 获取当前周数 */
function getCurrentWeek() {
  // 现在距离开学的天数
  var thePastDay = (new Date() - new Date(app.globalData.START_TIME)) / 1000 / 60 / 60 / 24
  thePastDay = thePastDay >= 0 ? Math.ceil(thePastDay) : Math.floor(thePastDay)
  // 计算周数,负数为开学前星期
  var currentWeek = thePastDay / 7
  app.globalData.currentWeek = thePastDay >= 0 ? Math.ceil(currentWeek) : Math.floor(currentWeek)
}

/* 检查数组中是否存在某元素 */
function inArray(arrayToSearch, stringToSearch) {
  for (var s = 0; s < arrayToSearch.length; s++) {
    var thisEntry = arrayToSearch[s].toString();
    if (thisEntry == stringToSearch) {
      return true;
    }
  }
  return false;
}

/* 数组按元素进行排序_第一个参数相同是可按第二个参数排序 */
function by(name, minor) {
  return function (o, p) {
    var a, b;
    if (o && p && typeof o === 'object' && typeof p === 'object') {
      a = o[name];
      b = p[name];
      if (a === b) {
        return typeof minor === 'function' ? minor(o, p) : 0;
      }
      if (typeof a === typeof b) {
        return a < b ? -1 : 1;
      }
      return typeof a < typeof b ? -1 : 1;
    } else {
      thro("error");
    }
  }
}

/* 获取图书馆和一卡通密码 */
function getOtherPw(cb) {
  wx.request({
    url: app.globalData.PASSWORD_GET,
    data: {
      sid: app.globalData.sid,
    },
    success: function (res) {
      app.globalData.librarypw = res.data.libraryPw
      app.globalData.ecardpw = res.data.ecardPw
      typeof cb == "function" && cb(app.globalData.librarypw, app.globalData.ecardpw)
    }
  })
}

/* 获取openId和登录状态 */
function getOpenId(cb) {
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
              typeof cb == "function" && cb(res.data.openid)
            }
          })
        }
      }
    })
  }
}

/* 计算总学分和必修学分 */
function _countCredit(termGrade) {
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

/* 获取账单查询的开始和结束日期 */
function _getQueryDate(add) {
  var dateObj = {}
  /* 现在的时间 */
  var dateNow = new Date()
  /* 查询开始的时间 */
  var dateStart = new Date();
  dateStart.setMonth(dateNow.getMonth() - add);
  var year = dateStart.getFullYear() + ""
  var month = dateStart.getMonth() + 1
  var dayStart = "01"
  var dayEnd = "31"
  dateObj.month = month
  dateObj.year = year
  /* 转换位所需格式 */
  if (month < 10) month = "0" + month
  else month = "" + month
  var end_date = year + month + dayEnd
  var start_date = year + month + dayStart
  dateObj.start_date = start_date
  dateObj.end_date = end_date
  return dateObj
}

/* 计算每个月的充值和支出 */
function _countBudget(data) {
  var expense = 0 // 支出
  var recharge = 0 // 充值
  var budget = {}
  for (var x in data) {
    if (parseFloat(data[x].amount) > 0) recharge += parseFloat(data[x].amount)
    else expense += parseFloat(data[x].amount)
  }
  budget.expense = Math.abs(expense).toFixed(2)
  budget.recharge = recharge.toFixed(2)
  return budget
}

/* -----------------全局函数------------------ */
module.exports.getUserInfo = getUserInfo
module.exports.getTimerInfo = getTimerInfo
module.exports.getCourse = getCourse
module.exports.getLibrary = getLibrary
module.exports.getLibraryRentList = getLibraryRentList
module.exports.getEcard = getEcard
module.exports.getNetInfo = getNetInfo
module.exports.getGradeInfo = getGradeInfo
module.exports.getRankInfo = getRankInfo
module.exports.getBilling = getBilling
module.exports.getCompleteCourse = getCompleteCourse
module.exports.getRankInfo

/* ---------------------tools--------------------- */
module.exports.getCurrentWeek = getCurrentWeek
module.exports.getOtherPw = getOtherPw
module.exports.getOpenId = getOpenId
module.exports.inArray
module.exports.by