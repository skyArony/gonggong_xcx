var app = getApp()


/* 获取用户消费信息 */
function getBilling(add, cb) {
  var dateObj = __getQueryDate(add)
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
          var budget = __countBudget(res.data.data)
          var itemInfo = {}
          itemInfo.data = res.data.data
          itemInfo.month = dateObj.month
          itemInfo.year = dateObj.year
          itemInfo.recharge = budget.recharge
          itemInfo.expense = budget.expense
          res.data.data = itemInfo
          typeof cb == "function" && cb(res.data)
        } else if (res.data.code == 1 && app.globalData.errCodeTimes < 10) {
          app.globalData.errCodeTimes++
          getBilling(add, cb)
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
        if (res.data.code == 0) {
          // 通过遍历计算充值和支出
          var budget = __countBudget(res.data.data)
          var itemInfo = {}
          itemInfo.data = res.data.data
          itemInfo.month = dateObj.month
          itemInfo.year = dateObj.year
          itemInfo.recharge = budget.recharge
          itemInfo.expense = budget.expense
          res.data.data = itemInfo
          typeof cb == "function" && cb(res.data)
        } else if (res.data.code == 1 && app.globalData.errCodeTimes < 10) {
          app.globalData.errCodeTimes++
          getBilling(add, cb)
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

/* 计算每个月的充值和支出 */
function __countBudget(data) {
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

/* 获取账单查询的开始和结束日期 */
function __getQueryDate(add) {
  var dateObj = {}
  /* 现在的时间 */
  var dateNow = new Date()
  /* 查询开始的时间 */
  var dateStart = new Date()
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

module.exports.getBilling = getBilling