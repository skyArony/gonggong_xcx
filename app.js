//app.js

App({
  onLaunch: function () {
    // this.loginCheck()
    this.getCurrentWeek()
  },

  /**
   * 【登录检查】
   *  存储sid\portalpw\loginType到全局，
   *  返回当前登录状态:"0"-未登录,"1"-已登录
   */
  loginCheck: function () {
    if (wx.getStorageSync('sid')) {
      // 已有学号，存入全局变量,进行数据获取
      this.globalData.sid = wx.getStorageSync('sid')
      // 检查本地缓存是否存有密码
      if (wx.getStorageSync('portalpw') && wx.getStorageSync('loginType')) {
        // password存入全局变量
        this.globalData.portalpw = wx.getStorageSync('portalpw')
        // 登录方式存入全局变量
        this.globalData.loginType = wx.getStorageSync('loginType')
        // 设置当前状态为:已登录
        this.globalData.loginStatus = "1"
      } else {
        // 设置当前状态为:未登录
        this.globalData.loginStatus = "0"
        // 没有缓存密码，提示重新登录
        wx.showModal({
          title: '',
          content: '登录过期，请重新登录。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              // 跳转到重新登录
              wx.navigateTo({
                url: '/pages/login/login'
              })
            }
          }
        })
      }
    } else {
      // 设置当前状态为:未登录
      this.globalData.loginStatus = "0"
      // 没有绑定学号，提示是否前往绑定
      wx.showModal({
        title: '',
        content: '你没有绑定学号，无法使用所有功能，请先登录。',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // 跳转到重新登录
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
    }
    return this.globalData.loginStatus
  },

  /**
   * 【获取当前周数】
   *  存储currentWeek到全局，
   *  返回当前周数。
   */
  getCurrentWeek: function () {
    // 现在距离开学的天数
    var thePastDay = (new Date() - new Date(this.globalData.START_TIME)) / 1000 / 60 / 60 / 24
    thePastDay = thePastDay >= 0 ? Math.ceil(thePastDay) : Math.floor(thePastDay)
    // 计算周数,负数为开学前星期
    var currentWeek = thePastDay / 7
    this.globalData.currentWeek = thePastDay >= 0 ? Math.ceil(currentWeek) : Math.floor(currentWeek)
    return this.globalData.currentWeek
  },

  /**
   * 【获取图书馆和一卡通密码】
   * 存储librarypw\ecardpw到全局
   * 将获取到的结果作为参数返回执行
   */
  getOtherPw: function (cb) {
    var that = this
    wx.request({
      url: that.globalData.GET_PASSWORD,
      data: {
        role: that.globalData.app_AU,
        hash: that.globalData.app_ID,
        sid: that.globalData.sid,
      },
      success: function (res) {
        that.globalData.librarypw = res.data.libraryPw
        that.globalData.ecardpw = res.data.ecardPw
        console.log("密码设置成功")
        typeof cb == "function" && cb(true)
      },
      fail: function () {
        typeof cb == "function" && cb(false)
      }
    })
  },

  /**
   * 【错误检查】
   *  存储session_id到缓存
   *  打印错误到控制台和界面
   *  返回数据的可用状态
   */
  errorCheck: function (type, data) {
    var dataStatus // 0-数据不可用,1-数据可用
    if (data == null) {
      dataStatus = 0
      console.log(type + "获取fail" + ":23333")
      /* 以后要在这加自编写的toast */
    } else {
      if (data.code == 0 || data.code == 6) {
        dataStatus = 1
      } else {
        dataStatus = 0
        console.log(type + ":" + data.msg + ":" + data.code)
        /* 以后要在这加自编写的toast */
      }
    }
    return dataStatus
  },

  /* 全局属性 */
  globalData: {
    sid: null,
    portalpw: null, // 登录密码——作为登录的状态的标志
    librarypw: null, // 图书馆密码
    ecardpw: null, // e卡通密码
    userInfo: null, // 用户信息
    courseData: {}, // 课程信息
    libraryInfo: {}, // 图书馆信息
    ecardInfo: {}, // e卡通信息
    currentWeek: null, // 当前周数
    loginType: 0, // 登录类型：1是信息门户，2是教务系统,0-未登录
    errCodeTimes: 0, // 验证码错误次数
    apiStatus: '{course:"1",library:"1",ecard:"1",net:"1"}',
    /* 以下用作全局宏定义 */
    START_TIME: "2017/9/4", //本学期开始时间
    app_AU: "gonggong-wechat", // api调用账户
    app_ID: "5c7bgy61b4uu2p753654c581c624tyg9", // api调用密钥
    loginStatus: "0", // 当前登录状态:0-未登录，1-已登录
    GET_OPENID: "https://wechat.sky31.com/xcx/gonggong/getOpenId.php",
    GET_SID: "https://wechat.sky31.com/xcx/gonggong/getSid.php",

    LOGIN: "https://api.sky31.com/PortalCode/GongGong/login.php",

    SET_LIBRARY_PASSWORD: "https://api.sky31.com/PortalCode/GongGong/set_library_password.php",
    SET_PHONE: "https://api.sky31.com/PortalCode/GongGong/set_phone.php",
    BIND_SID: "https://wechat.sky31.com/xcx/gonggong/bindSid.php",

    EDU_COURSE: "https://api.sky31.com/PortalCode/edu-new/course.php",
    EDU_EXAM: "https://api.sky31.com/PortalCode/edu-new/exam_arrange.php",
    EDU_RANK: "https://api.sky31.com/PortalCode/edu-new/rank.php",
    EDU_GRADE_DETAILS: "https://api.sky31.com/PortalCode/edu-new/grade_details.php",



    ECARD_BALANCE: "https://api.sky31.com/PortalCode/ecard/balance.php",
    ECARD_BILLING: "https://api.sky31.com/PortalCode/ecard/billing.php",
    CAMPUS_NET: "https://api.sky31.com/others/campus_net_balance.php",
    GONGGONG_OFFICALTIMER: "https://api.sky31.com/GongGong/officaltimer.php",
    // 图书馆相关
    LIBRARY_SEARCH: "https://api.sky31.com/PortalCode/library/search.php",
    LIBRARY_SEARCH_DETAILS: "https://api.sky31.com/PortalCode/library/book_details.php",
    LIBRARY_READER_INFO: "https://api.sky31.com/PortalCode/library/reader_info.php",
    LIBRARY_RENT_LIST: "https://api.sky31.com/PortalCode/library/rent_list.php",
    LIBRARY_RENEW: "https://api.sky31.com/PortalCode/library/renew.php",
    ENABLE_LIBRARY_SMS_NOTICE: "https://api.sky31.com/PortalCode/GongGong/enable_library_sms_notice.php",
    DISABLE_LIBRARY_SMS_NOTICE: "https://api.sky31.com/PortalCode/GongGong/disable_library_sms_notice.php",
    GET_LIBRARY_SMS_NOTICE_STATUS: "https://api.sky31.com/PortalCode/GongGong/get_library_sms_notice_status.php",

    /* -------------------------------------------教务系统接口----------------------------------- */
    LOGIN_OLD: "https://api.sky31.com/GongGong/login.php",
    EDU_COURSE_OLD: "https://api.sky31.com/edu-new/course.php",
    EDU_EXAM_OLD: "https://api.sky31.com/edu-new/exam_arrange.php",
    EDU_RANK_OLD: "https://api.sky31.com/edu-new/rank.php",
    EDU_GRADE_DETAILS_OLD: "https://api.sky31.com/edu-new/grade_details.php",
    GET_PASSWORD: "https://wechat.sky31.com/xcx/gonggong/getOtherPw.php", // 获取图书馆和一卡通密码
    LIBRARY_READER_INFO_OLD: "https://api.sky31.com/library/reader_info.php",
    LIBRARY_RENT_LIST_OLD: "https://api.sky31.com/library/rent_list.php",
    ECARD_BALANCE_OLD: "https://api.sky31.com/ecard/balance.php",
    ECARD_BILLING_OLD: "https://api.sky31.com/ecard/billing.php",
    SET_ECARD_PASSWORD_OLD: "https://passport.sky31.com/api-s/set_ecard_password.php",
    SET_LIBRARY_PASSWORD_OLD: "https://passport.sky31.com/api-s/set_library_password.php",
    SET_PHONE_OLD: "https://passport.sky31.com/api-s/set_phone.php",
    ENABLE_LIBRARY_SMS_NOTICE_OLD: "https://passport.sky31.com/api-s/enable_library_sms_notice.php",
    DISABLE_LIBRARY_SMS_NOTICE_OLD: "https://passport.sky31.com/api-s/disable_library_sms_notice.php",
    GET_LIBRARY_SMS_NOTICE_STATUS_OLD: "https://passport.sky31.com/api-s/get_library_sms_notice_status.php",


    /* -------------------------------------------颜色配置----------------------------------- */
    /* 课程表格子 */
    COURSE_BLOCK: ["#F2C973", "#83D3D4", "#98D362", "#EB9FA1", "#74C0AD", "#E097B5", "#60C0E6", "#F3AB8B", "#93B8D7", "#79D4A3", "#BEA49D"],
    /* -------------------------------------------版本信息----------------------------------- */
    VERSION: "V0.0.0.20171011_Alpha",
    VERSION_INFO: "内部抢先版,bug众多,请一一反馈-.-"
  }
})