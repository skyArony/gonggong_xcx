/* index页通用函数 */
var app = getApp()

/**
 * 获取用户信息
 * @param {*function} cb 
 */
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
        if (res.data.code == 5 && app.globalData.errCodeTimes < 10) {
          app.globalData.errCodeTimes++ // 验证码错误次数的控制
          // 验证码错误时再次获取
          getUserInfo(cb)
        } else if (res.data.code == 0) {
          if (res.data.data.sex == "男" && res.data.data.img == "") res.data.data.img = "../../images/header.jpg"
          else if (res.data.data.sex == "女" && res.data.data.img == "") res.data.data.img = "../../images/header2.jpg"
          if (res.data.data.timer == "") res.data.data.timer = "[]"
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
      url: app.globalData.LOGIN_OLD,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.portalpw
      },
      success: function (res) {
        if (res.data.code == 5 && app.globalData.errCodeTimes < 10) {
          app.globalData.errCodeTimes++ // 验证码错误次数的控制
          // 验证码错误时再次获取
          getUserInfo(cb)
        } else if (res.data.code == 0) {
          if (res.data.data.sex == "男" && res.data.data.img == "") res.data.data.img = "../../images/header.jpg"
          else if (res.data.data.sex == "女" && res.data.data.img == "") res.data.data.img = "../../images/header2.jpg"
          if (res.data.data.timer == "") res.data.data.timer = "[]"
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

/**
 * 将用户的个人timer和官方的timer合并，
 * 存入用户倒计时列表availableTimer和处理完后的userInfo到全局
 * @param {*function} cb 
 */
function getTimerInfo(cb) {
  var userInfo = app.globalData.userInfo
  // 将官方timer和私人timer进行合并然后再将数据并入用户信息中
  __getOfficalTimer(function (officalTimer) {
    if (app.errorCheck("官方倒计时", officalTimer)) {
      officalTimer = officalTimer.data
      var availableTimer = new Array() // 可用（未过期的官方计时和所有的私人计时）计时容器
      var userTimer = JSON.parse(userInfo['timer']) // 私人计时
      // 放入用户timer
      for (var x in userTimer) {
        availableTimer.push(userTimer[x])
      }
      // 放入官方timer
      for (var y in officalTimer) {
        if (new Date(officalTimer[y]['start_date'] + " " + officalTimer[y]['start_time']) > new Date()) {
          availableTimer.push(officalTimer[y])
        }
      }
      // 排序
      availableTimer.sort(__by('start_date', __by('start_time')));
      // 数据再处理\计算出天数
      for (var z in availableTimer) {
        var remainDay = (new Date(availableTimer[z]['start_date']) - new Date()) / 1000 / 60 / 60 / 24
        remainDay = Math.floor(remainDay)
        availableTimer[z]['remainDay'] = remainDay
      }
      app.globalData.availableTimer = availableTimer
      // 将可以显示在index的timer取出
      var showTimer = new Array()
      for (var t in availableTimer) {
        if (availableTimer[t]['remainDay'] > 0) {
          showTimer.push(availableTimer[t])
        }
      }
      userInfo['showTimer'] = showTimer
      typeof cb == "function" && cb(userInfo)
    } else {
      typeof cb == "function" && cb(null)
    }
  })
}

/**
 * 获取官方倒计时
 * 服务于getTimerInfo
 * @param {*function} cb 
 */
function __getOfficalTimer(cb) {
  wx.request({
    url: app.globalData.GONGGONG_OFFICALTIMER,
    data: {
      role: app.globalData.app_AU,
      hash: app.globalData.app_ID,
    },
    success: function (res) {
      typeof cb == "function" && cb(res.data)
    },
    fail: function (res) {
      typeof cb == "function" && cb(null)
    }
  })
}

/**
 * 获取课程表信息
 * @param {*function} cb 
 */
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
        if (res.data.code == 5 && app.globalData.errCodeTimes < 10) {
          app.globalData.errCodeTimes++
          getCourse(cb)
        } else if (res.data.code == 0) {
          res.data.data = __dealCorse(res.data.data)
          typeof cb == "function" && cb(res.data)
        } else[
          typeof cb == "function" && cb(res.data)
        ]
      },
      fail: function (res) {
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
        if (res.data.code == 5 && app.globalData.errCodeTimes < 10) {
          app.globalData.errCodeTimes++
          getCourse(cb)
        } else if (res.data.code == 0) {
          res.data.data = __dealCorse(res.data.data)
          typeof cb == "function" && cb(res.data)
        } else[
          typeof cb == "function" && cb(res.data)
        ]
      },
      fail: function (res) {
        typeof cb == "function" && cb(null)
      }
    })
  }
}

/**
 * 处理课程，返回今日课程和所有课程，
 * 服务于getCourse
 * @param {*obj} res 
 */
function __dealCorse(data) {
  var courseData = {}
  courseData.allCourse = data
  // 时令表
  var winter_start = ["8:00", "8:55", "10:10", "11:05", "14:00", "14:55", "16:10", "17:05", "19:00", "19:55", "20:50"]
  var winter_end = ["8:45", "9:40", "10:55", "11:50", "14:45", "15:40", "16:55", "17:50", "19:45", "20:40", "21:35"]
  var summer_start = ["8:00", "8:55", "10:10", "11:05", "14:30", "15:25", "16:40", "17:35", "19:30", "20:25", "21:20"]
  var summer_end = ["8:45", "9:40", "10:55", "11:50", "15:15", "16:10", "17:25", "18:20", "19:15", "21:10", "22:05"]
  // 今日课程信息
  var courseInfo = data
  var todayCourseNum = 0
  var todayCourseDetail = new Array()
  var week = new Date().getDay() // 星期
  var month = new Date().getMonth() // 月份
  for (var tCourse in courseInfo[week]) {
    for (var course in courseInfo[week][tCourse]) {
      var weekArray = courseInfo[week][tCourse][course]['week'].split(',')
      if (_inArray(weekArray, app.globalData.currentWeek)) {
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
  courseData.todayCourse = todayCourse
  return courseData
}

/* 获取图书馆读者信息 */
function getLibraryUser(cb) {
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
        typeof cb == "function" && cb(res.data)
      },
      fail: function (res) {
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
        typeof cb == "function" && cb(res.data)
      },
      fail: function (res) {
        typeof cb == "function" && cb(null)
      }
    })
  }
}

/* 获取图书馆借阅信息 */
function getLibraryRentList(cb) {
  console.log("准备获取图书信息")
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
        typeof cb == "function" && cb(res.data)
      },
      fail: function (res) {
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
        typeof cb == "function" && cb(res.data)
      },
      fail: function (res) {
        typeof cb == "function" && cb(null)
      }
    })
  }
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
        if (res.data.code == 0) {
          typeof cb == "function" && cb(res.data.data)
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
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
        if (res.data.code == 0) {
          typeof cb == "function" && cb(res.data.data)
        } else {
          typeof cb == "function" && cb(null)
        }
      },
      fail: function (res) {
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
        if (res.data.code == 5 && app.globalData.errCodeTimes < 10) {
          app.globalData.errCodeTimes++
          getEcard(cb)
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
      url: app.globalData.ECARD_BALANCE_OLD,
      data: {
        role: app.globalData.app_AU,
        hash: app.globalData.app_ID,
        sid: app.globalData.sid,
        password: app.globalData.ecardpw
      },
      success: function (res) {
        if (res.data.code == 5 && app.globalData.errCodeTimes < 10) {
          app.globalData.errCodeTimes++
          getEcard(cb)
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

/* 获取校园网账户信息 */
function getNetInfo(cb) {
  wx.request({
    url: app.globalData.CAMPUS_NET,
    data: {
      role: app.globalData.app_AU,
      hash: app.globalData.app_ID,
      sid: app.globalData.sid,
    },
    success: function (res) {
      typeof cb == "function" && cb(res.data)
    },
    fail: function (res) {
      typeof cb == "function" && cb(null)
    }
  })
}


module.exports.getUserInfo = getUserInfo
module.exports.getTimerInfo = getTimerInfo
module.exports.getCourse = getCourse
module.exports.getLibraryUser = getLibraryUser
module.exports.getLibraryRentList = getLibraryRentList
module.exports.getEcard = getEcard
module.exports.getNetInfo = getNetInfo
