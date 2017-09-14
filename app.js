//app.js
// var common = require('./common/common.js')
App({
  onLaunch: function () {
    this.globalData.portalpw = wx.getStorageSync('portalpw')
  },

  /* 全局属性 */
  globalData: {
    openId: null,
    sid: null,
    portalpw: null, // 登录密码——作为登录的状态的标志
    librarypw: null, // 图书馆密码
    ecardpw: null, // e卡通密码
    userInfo: null, // 用户信息
    libraryInfo: null, // 图书馆信息
    courseInfo: null, // 课程信息
    ecardInfo: {}, // e卡通信息
    availableTimer: null, // 当前有效的Timer
    currentWeek: null, // 当前周数
    isEnd: 0, // 数据加载的结束判断，用来检验页面数据是否加载完成
    loginType: 1, // 登录类型：1是信息门户，2是教务系统
    /* 以下用作全局宏定义 */
    START_TIME: "2017/9/4",
    app_AU: "gonggong-wechat", // api调用账户
    app_ID: "5c7bgy61b4uu2p753654c581c624tyg9", // api调用密钥
    GET_OPENID: "https://wechat.sky31.com/xcx/gonggong/getOpenId.php",
    GET_SID: "https://wechat.sky31.com/xcx/gonggong/getSid.php",

    LOGIN: "https://api.sky31.com/PortalCode/GongGong/login.php",

    SET_LIBRARY_PASSWORD: "https://api.sky31.com/PortalCode/GongGong/set_library_password.php",
    SET_LIBRARY_PHONE: "https://api.sky31.com/PortalCode/GongGong/set_phone.php",
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
    PASSWORD_GET: "https://wechat.sky31.com/xcx/gonggong/getOtherPw.php", // 获取图书馆和一卡通密码
    LIBRARY_READER_INFO_OLD: "https://api.sky31.com/library/reader_info.php",
    LIBRARY_RENT_LIST_OLD: "https://api.sky31.com/library/rent_list.php", 
    ECARD_BALANCE_OLD: "https://api.sky31.com/ecard/balance.php",
    ECARD_BILLING_OLD: "https://api.sky31.com/ecard/billing.php",
  }
})