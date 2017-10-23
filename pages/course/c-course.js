/* course也函数 */
var app = getApp()

/* 处理指定周数的课表 */
function getWeekCourse(week, courseData, cb) {
  var officalCourse = courseData
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.course) var userCourse = JSON.parse(app.globalData.userInfo.course)
    else var userCourse = JSON.parse('{}')
  } else console.log("用户数据不存在,课表无法继续处理,请再此添加错误处理")
  // 将学校课程分到11个课程格子
  var newOfficalCourse = {}
  var x = 7
  while (x > 0) {
    newOfficalCourse[x] = []
    newOfficalCourse[x][11] = null
    // 如果今天有课,下一步处理
    if (officalCourse[x]) {
      var y = 5
      while (y > 0) {
        if (officalCourse[x][y]) {
          if (officalCourse[x][y].length > 1) {
            var suitableCourse = __getSuitableCourse(week, officalCourse[x][y])
            var suitableCourse = suitableCourse.course
            var z = suitableCourse.section_length - 1
            while (z >= 0) {
              newOfficalCourse[x][parseInt(suitableCourse.section_start) + z] = suitableCourse
              z--
            }
          } else {
            var z = officalCourse[x][y][0].section_length - 1
            while (z >= 0) {
              newOfficalCourse[x][parseInt(officalCourse[x][y][0].section_start) + z] = officalCourse[x][y][0]
              z--
            }
          }
        } else {
          newOfficalCourse[x][y * 2 - 1] = null
          newOfficalCourse[x][y * 2] = null
        }
        y--
      }
    } else {
      // 如果今天无课,全部置为null
      var y = 11
      while (y > 0) {
        newOfficalCourse[x][y] = null
        y--
      }
    }
    x--
  }
  // 将个人课程分到11个课程格子
  var newUserCourse = {}
  var u = 7
  while (u > 0) {
    newUserCourse[u] = []
    if (userCourse[u]) {
      for (var v in userCourse[u]) {
        var end = userCourse[u][v]["section_end"]
        var start = userCourse[u][v]["section_start"]
        while (start <= end) {
          if (newUserCourse[u][start]) {
            var courseArray = []
            courseArray.push(newUserCourse[u][start])
            courseArray.push(userCourse[u][v])
            var suitableCourse = __getSuitableCourse(week, courseArray)
            newUserCourse[u][start] = suitableCourse.course
          } else {
            newUserCourse[u][start] = userCourse[u][v]
          }
          start++
        }
      }
    }
    u--
  }
  // 将官方课和个人课表结合
  var combineCourse = {}
  var a = 7
  while (a > 0) {
    combineCourse[a] = []
    if (newUserCourse[a]) {
      for (var b in newOfficalCourse[a]) {
        if (newOfficalCourse[a][b] && newUserCourse[a][b]) {
          var courseArray = []
          courseArray.push(newUserCourse[a][b])
          courseArray.push(newOfficalCourse[a][b])
          var suitableCourse = __getSuitableCourse(week, courseArray)
          combineCourse[a][b] = suitableCourse.course
        } else if (!newOfficalCourse[a][b] && newUserCourse[a][b]) {
          combineCourse[a][b] = newUserCourse[a][b]
        } else if (newOfficalCourse[a][b] && !newUserCourse[a][b]) {
          combineCourse[a][b] = newOfficalCourse[a][b]
        } else if (!newOfficalCourse[a][b] && !newUserCourse[a][b]) {
          combineCourse[a][b] = null
        }
      }
    } else {
      combineCourse[a] = newOfficalCourse[a]
    }
    a--
  }
  // 课程的颜色处理
  var colorArray = app.globalData.COURSE_BLOCK.concat() // 这里要用到数组的深拷贝,否则会出问题
  var pairArray = {} // 颜色课程配对数组
  for (var r in combineCourse) {
    for (var q in combineCourse[r]) {
      if (combineCourse[r][q]) {
        var courseName = combineCourse[r][q]['course']
        var weekArray = combineCourse[r][q]['week'].split(',')
        if (__inArray(weekArray, week)) {
          if (__inArray2(pairArray, courseName)) {
            combineCourse[r][q].color = pairArray[courseName]
          } else {
            if (colorArray.length > 0) {
              pairArray[courseName] = colorArray.shift()
              combineCourse[r][q].color = pairArray[courseName]
            } else {
              colorArray = app.globalData.COURSE_BLOCK.concat()
              pairArray[courseName] = colorArray.shift()
              combineCourse[r][q].color = pairArray[courseName]
            }
          }
        } else {
          combineCourse[r][q].color = "#dadada"
        }
      }
    }
  }
  // 每门超过一节课时间的课保留第一个,去掉后面的
  for (var t in combineCourse) {
    for (var g in combineCourse[t]) {
      if (combineCourse[t][g]) {
        var z = combineCourse[t][g].section_end - combineCourse[t][g].section_start
        while (z > 0) {
          combineCourse[t][parseInt(g) + z] = { section_start: 0 }
          z--
        }
      }
    }
  }
  // 去除第一个元素,以让0号元素表示第一节课
  for (var h in combineCourse) {
    combineCourse[h].shift();
  }
  typeof cb == "function" && cb(combineCourse)
}


/* 从一个课表数组中选出最适合当前周的课 */
function __getSuitableCourse(week, courseArray) {
  var isOk = []
  var isNo = []
  var res = {}
  for (var x in courseArray) {
    var weekArray = courseArray[x]['week'].split(',')
    if (__inArray(weekArray, week)) isOk.push(courseArray[x])
    else isNo.push(courseArray[x])
  }
  if (isOk.length > 1) {
    res.status = "2" // 状态2表示课表冲突
    res.course = isOk[0]
    return res
  }
  if (isOk.length == 1) {
    res.status = "1" // 状态1表示刚刚好
    res.course = isOk[0]
    return res
  }
  if (isOk.length == 0) {
    var count = week
    while (count <= 20) {
      count++
      for (var x in isOk) {
        var weekArray = isOk[x]['week'].split(',')
        if (__inArray(weekArray, count)) {
          res.status = "0" // 状态0表示从多个过期的课程中选出了最合适的
          res.course = isOk[x]
          return res
        }
      }
    }
    var count = week
    while (count >= 1) {
      count--
      for (var y in isOk) {
        var weekArray = isOk[y]['week'].split(',')
        if (__inArray(weekArray, count)) {
          res.status = "0" // 状态0表示从多个过期的课程中选出了最合适的
          res.course = isOk[y]
          return res
        }
      }
    }
  }
}

/* 检查数组中是否存在某元素--无键数组 */
function __inArray(arrayToSearch, stringToSearch) {
  for (var s = 0; s < arrayToSearch.length; s++) {
    var thisEntry = arrayToSearch[s].toString();
    if (thisEntry == stringToSearch) {
      return true;
    }
  }
  return false;
}

/* 检查数组中是否存在某元素--有键数组 */
function __inArray2(arrayToSearch, stringToSearch) {
  for (var key in arrayToSearch) {
    if (key == stringToSearch) {
      return true;
    }
  }
  return false;
}

module.exports.getWeekCourse = getWeekCourse