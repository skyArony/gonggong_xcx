/* index页通用函数 */
var app = getApp()

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
                if (res.data.code == 0) {
                    app.globalData.userInfo = res.data.data
                    if (app.globalData.userInfo.sex == "男" && app.globalData.userInfo.img == "") app.globalData.userInfo.img = "../../images/header.jpg"
                    else if (app.globalData.userInfo.sex == "女" && app.globalData.userInfo.img == "") app.globalData.userInfo.img = "../../images/header2.jpg"
                    if (app.globalData.userInfo.timer == "") app.globalData.userInfo.timer = "[]"
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
                    if (app.globalData.userInfo.sex == "男" && app.globalData.userInfo.img == "") app.globalData.userInfo.img = "../../images/header.jpg"
                    else if (app.globalData.userInfo.sex == "女" && app.globalData.userInfo.img == "") app.globalData.userInfo.img = "../../images/header2.jpg"
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
                                if (app.globalData.userInfo.sex == "男" && app.globalData.userInfo.img == "") app.globalData.userInfo.img = "../../images/header.jpg"
                                else if (app.globalData.userInfo.sex == "女" && app.globalData.userInfo.img == "") app.globalData.userInfo.img = "../../images/header2.jpg"
                                if (app.globalData.userInfo.timer == "") app.globalData.userInfo.timer = "[]"
                                typeof cb == "function" && cb(res.data.data)
                            } else {
                                typeof cb == "function" && cb(null)
                            }
                        },
                        fail: function (res) {
                            typeof cb == "function" && cb(null)
                        }
                    })
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
        availableTimer.sort(_by('start_date', _by('start_time')));
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
                if (res.data.code == 0) {
                    typeof cb == "function" && cb(_getTodayCorse(res))
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
            url: app.globalData.EDU_COURSE_OLD,
            data: {
                role: app.globalData.app_AU,
                hash: app.globalData.app_ID,
                sid: app.globalData.sid,
                password: app.globalData.portalpw
            },
            success: function (res) {
                if (res.data.code == 0) {
                    typeof cb == "function" && cb(_getTodayCorse(res))
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
                if (res.data.code == 0) {
                    app.globalData.libraryInfo.libraryUser = res.data.data
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
            url: app.globalData.LIBRARY_READER_INFO_OLD,
            data: {
                role: app.globalData.app_AU,
                hash: app.globalData.app_ID,
                sid: app.globalData.sid,
                password: app.globalData.librarypw
            },
            success: function (res) {
                if (res.data.code == 0) {
                    app.globalData.libraryInfo.libraryUser = res.data.data
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

/* 获取图书馆读者借阅信息 */
function getLibraryRentList(cb) {
    var libraryInfo = {}
    var libraryUser = app.globalData.libraryInfo.libraryUser
    if (libraryUser) {
        // 欠费处理
        var debt = libraryUser.debt
        if (debt > 0) {
            debt = -debt
            debt = debt.toFixed(2)
        }
        else debt = "0.00"
        libraryUser['debt'] = debt
    } else {
        libraryUser = null
    }
    _getLibraryBook(function (libraryBook) {
        libraryInfo.libraryUser = libraryUser
        libraryInfo.libraryBook = libraryBook
        // 剩余还书天数
        if (libraryBook == null) {
            var bookTimer = "暂无"
        } else {
            var temp = 100
            for (var x in libraryBook) {
                if (libraryBook[x]['interval'] < temp) temp = libraryBook[x]['interval']
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
                if (res.data.code == 0) {
                    app.globalData.ecardInfo['balance'] = res.data.data
                    typeof cb == "function" && cb(app.globalData.ecardInfo)
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
            url: app.globalData.ECARD_BALANCE_OLD,
            data: {
                role: app.globalData.app_AU,
                hash: app.globalData.app_ID,
                sid: app.globalData.sid,
                password: app.globalData.ecardpw
            },
            success: function (res) {
                if (res.data.code == 0) {
                    app.globalData.ecardInfo['balance'] = res.data.data
                    typeof cb == "function" && cb(app.globalData.ecardInfo)
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
    //     if (res.data.code == 0) {
    //       typeof cb == "function" && cb(res.data.data)
    //     }else {
    //  typeof cb == "function" && cb(null)
    // }
    //   },
    //   fail: function (res) {
    //     console.log("校园网账户信息 获取失败了！！！！！！！！！！！！！！！！！！！")
    //     typeof cb == "function" && cb(null)
    //   }
    // })
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
  module.exports.getSelectCourse = getSelectCourse
  module.exports.getLibraryNoticeStatus = getLibraryNoticeStatus
  module.exports.setLibraryNoticeStatus = setLibraryNoticeStatus