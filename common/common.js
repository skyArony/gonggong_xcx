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
        getUserInfoSuccess(res)
      },
      complete: function (res) {
        app.globalData.isEnd++
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
        getUserInfoSuccess(res)
      },
      complete: function (res) {
        app.globalData.isEnd++
      }
    })
  }
}

/* 服务于getUserInfo的复用函数 */
function getUserInfoSuccess(res) {
  if (res.data.code == 0) {
    console.log("登录成功!!!")
    var userInfo = res.data.data
    // 将官方timer和私人timer进行合并然后再将数据并入用户信息中
    getTimer(function (officalTimer) {
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
      console.log("拱拱个人信息获取并处理成功")
      console.log(userInfo)
      app.globalData.userInfo = userInfo
      typeof cb == "function" && cb(userInfo)
    })
  }
}

/* timer数据获取及处理，此函数服务getUserInfo，不向外暴露 */
function getTimer(cb) {
  wx.request({
    url: app.globalData.GONGGONG_OFFICALTIMER,
    data: {
      role: app.globalData.app_AU,
      hash: app.globalData.app_ID,
    },
    success: function (res) {
      if (res.data.code == 0) {
        console.log("官方到计时获取成功")
        console.log(res)
        typeof cb == "function" && cb(res.data.data)
      }
    },
    complete: function (res) {
      app.globalData.isEnd++
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
        getCourseSuccess(res)
      },
      complete: function (res) {
        app.globalData.isEnd++
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
        getCourseSuccess(res)
      },
      complete: function (res) {
        app.globalData.isEnd++
      }
    })
  }
}

/* 服务于getCourse的复用函数 */
function getCourseSuccess(res) {
  if (res.data.code == 0) {
    console.log("课程信息获取成功")
    console.log(res)
    app.globalData.courseInfo = res.data.data
    // 今日课程信息
    var courseInfo = res.data.data
    var todayCourseNum = 0
    var todayCourseDetail = new Array()
    var week = new Date().getDay() // 星期
    for (var tCourse in courseInfo[week]) {
      for (var course in courseInfo[week][tCourse]) {
        var weekArray = courseInfo[week][tCourse][course]['week'].split(',')
        if (inArray(weekArray, app.globalData.currentWeek)) {
          todayCourseNum++
          todayCourseDetail.push(courseInfo[week][tCourse][course])
        }
      }
    }
    var todayCourse = {}
    todayCourse.todayCourseNum = todayCourseNum
    todayCourse.todayCourseDetail = todayCourseDetail
    if (todayCourseNum == 0) todayCourse.status = 3
    else todayCourse.status = 2
    console.log("今日课程处理成功")
    console.log(todayCourse)
    typeof cb == "function" && cb(todayCourse)
  }
}

/* 获取图书馆信息 */
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
        getLibrarySuccess(res);
      },
      complete: function (res) {
        app.globalData.isEnd++
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
        getLibrarySuccess(res);
      },
      complete: function (res) {
        app.globalData.isEnd++
      }
    })
  }
}

/* 服务于getLibrary的复用函数 */
function getLibrarySuccess(res) {
  var libraryInfo = {}
  if (res.data.code == 0) {
    var libararyUser = res.data.data
    // 欠费处理
    var debt = libararyUser.debt
    if (debt > 0) debt = -debt
    else debt = "0.00"
    libararyUser['debt'] = debt
    getLibraryBook(function (libraryBook) {
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
      console.log("图书信息处理成功")
      console.log(libraryInfo)
      typeof cb == "function" && cb(libraryInfo)
    })
  }
}

/* 图书借阅信息获取及处理，服务于getLibrary，不向外暴露接口 */
function getLibraryBook(cb) {
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
          console.log("借阅信息获取成功")
          console.log(res)
          var libraryBook = res.data.data
          typeof cb == "function" && cb(libraryBook)
        }
      },
      complete: function (res) {
        app.globalData.isEnd++
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
          console.log("借阅信息获取成功")
          console.log(res)
          var libraryBook = res.data.data
          typeof cb == "function" && cb(libraryBook)
        }
      },
      complete: function (res) {
        app.globalData.isEnd++
      }
    })
  }
}

/* 获取一卡通信息 */
function getEcard(cb) {
  wx.request({
    url: app.globalData.ECARD_BALANCE,
    data: {
      role: app.globalData.app_AU,
      hash: app.globalData.app_ID,
      sid: app.globalData.sid,
      password: app.globalData.portalpw
    },
    success: function (res) {
      if (res.data.code == 0) {
        console.log("一卡通信息获取成功")
        console.log(res)
        typeof cb == "function" && cb(res.data.data)
      }
    },
    complete: function (res) {
      app.globalData.isEnd++
    }
  })
}

/* 获取校园网账户信息 */
function getNetInfo(cb) {
  console.log("校园网账户信息获取成功-----------------------------------")
  wx.request({
    url: app.globalData.CAMPUS_NET,
    data: {
      role: app.globalData.app_AU,
      hash: app.globalData.app_ID,
      sid: app.globalData.sid,
    },
    success: function (res) {
      if (res.data.code == 0) {
        console.log("校园网账户信息获取成功")
        console.log(res)
        typeof cb == "function" && cb(res.data.data)
      }
    },
    complete: function (res) {
      console.log("校园网账户信息获取成功!!!!!!!!!!!!!!!!!!!!!!")
      app.globalData.isEnd++
    }
  })
}

/* -----------------------------for:index:end------------------------ */

/* -----------------------------for:grade:start------------------------ */

/* 获取所有成绩信息 */
function getGradeInfo(cb) {
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
        console.log("成绩详情信息获取成功")
        console.log(res)
        typeof cb == "function" && cb(res.data.data)
      }
    },
    complete: function (res) {
      app.globalData.isEnd++
    }
  })
}

/* 获取总排名 */
function getRankInfo(cb) {
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
      }
    },
    complete: function (res) {
      app.globalData.isEnd++
    }
  })
}

/* -----------------------------for:library:start------------------------ */
/* 获取图书管页面借阅信息 */
function getLibraryInfo(cb) {
  wx.request({
    url: app.globalData.LIBRARY_RENT_LIST,
    data: {
      role: app.globalData.app_AU,
      hash: app.globalData.app_ID,
      sid: app.globalData.sid,
      password: app.globalData.portalpw,
    },
    success: function (res) {
      if (res.data.code == 0) {
        console.log("图书借阅信息获取成功")
        console.log(res)
        app.globalData.libraryInfo.rentList = res.data.data
        app.globalData.libraryInfo.bookNum = res.data.data.length
        typeof cb == "function" && cb(app.globalData.libraryInfo)
      }
    },
    complete: function (res) {
      app.globalData.isEnd++
    }
  })
}

/* -----------------------------for:library:end------------------------ */

/* ----------------------------------------tools------------------------------------- */

/* 获取当前周数 */
function getCurrentWeek() {
  // 现在距离开学的天数
  var thePastDay = (new Date() - new Date(app.globalData.START_TIME)) / 1000 / 60 / 60 / 24
  thePastDay = thePastDay >= 0 ? Math.ceil(thePastDay) : Math.floor(thePastDay)
  // 计算周数,负数为开学前星期
  var currentWeek = thePastDay / 7
  app.globalData.currentWeek = thePastDay >= 0 ? Math.ceil(currentWeek) : Math.floor(currentWeek)
  console.log(app.globalData.currentWeek)
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

/* 数组按元素进行排序 */
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

/* -----------------全局函数------------------ */
module.exports.getUserInfo = getUserInfo
module.exports.getCourse = getCourse
module.exports.getLibrary = getLibrary
module.exports.getEcard = getEcard
module.exports.getNetInfo = getNetInfo
module.exports.getGradeInfo
module.exports.getRankInfo

/* ---------------------tools--------------------- */
module.exports.getCurrentWeek = getCurrentWeek
module.exports.inArray
module.exports.by