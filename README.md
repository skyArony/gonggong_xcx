# 拱拱小程序——V1.0.171026_Alpha
版本号规则：
- 第一个数表示大版本：结构底层完全更新时更新此代号。
- 第二个数表示中版本：代码结构、UI变更时更新此代号。
- 第三个数表示小版本：添加功能时更新此代号。
- 第四个日期：日常更新、bug修复等时更新此代号。
- 第五部分:Alpha：内测；Beta：公测。
- Beta.1：bug紧急修复，版本追加。  

版本控制规则：
- master分支是稳定的可用版本————此分支只接受合并而不接受推送
- dev是小版本测试版本————每次本地修改后请推送到这个分支
- 用户名 分支是每个人干活的分支————用`git push origin <用户分支名>`提交到远程

## 首批功能
### 图书馆

### 查课表

### 查成绩

### 查消费



---



# 微信小程序拱拱——介绍文档



# 一、简介

微信小程序拱拱是一个服务本校学生的小程序，提供了成绩、课表、图书馆馆藏、校园卡消费记录登录查询功能。目前用户数目已经达到1.1万。

“拱拱”的取名灵感来自于本校有名的建筑物——“三拱门”校门。

# 二、界面和功能展示

## 1. 登录
提供学号和教务系统密码即可登录。

![未登录](http://osv9x79o9.bkt.clouddn.com/18-3-13/18685152.jpg)

![登录界面](http://osv9x79o9.bkt.clouddn.com/18-3-13/67859398.jpg)

## 2. 主页
主页提供了快捷功能入口和各种信息快速检索：

**快捷功能:**

- 图书馆
- 课表
- 成绩
- 一卡通

**信息快速检索：**

- 今天的课程
- 最近要换的一本书剩余天数
- 校园卡余额
- 校园网余额
- 重大时刻倒计时（开学、考试、节假日）

![主页](http://osv9x79o9.bkt.clouddn.com/18-3-13/83149745.jpg)

## 3. 个人页面
个人页面可以查看个人信息（头像、学号、昵称），以及进行相关设置。

- 图书到期短信提醒
  绑定手机号后，打开此项设置，用户借阅的图书快到期时，系统会发送短信提醒用户尽快还书，避免图书馆欠费。

- 打开应用先进入课表
  通过数据分析，很多用户打开本应用是为了查看课表，所以增加了此项设置，打开后，用户进入小程序会自动调到课表，提高用户体验。

![个人页面](http://osv9x79o9.bkt.clouddn.com/18-3-13/39300129.jpg)

## 4. 消费查询
绑定一卡通系统账号后，学生可以查看校园卡余额以及每天的消费记录。

![消费查询](http://osv9x79o9.bkt.clouddn.com/18-3-13/92889695.jpg)

## 5. 成绩查询
通过成绩查询功能，学生可以通过本小程序查询各个学期的成绩和绩点。

![成绩查询](http://osv9x79o9.bkt.clouddn.com/18-3-13/59105617.jpg)

## 6. 查询图书馆馆藏和图书借阅记录
绑定图书馆账号后，学生可以查询图书馆馆藏、书籍剩余可借天数，还能进行在线续借。

![图书借阅](http://osv9x79o9.bkt.clouddn.com/18-3-13/91419076.jpg)

![馆藏查询](http://osv9x79o9.bkt.clouddn.com/18-3-13/95234566.jpg)

![图书位置查询](http://osv9x79o9.bkt.clouddn.com/18-3-13/99813379.jpg)

## 7. 课表查询
通过课表查询功能，学生可以查询本学期的课表，还能选择对应周数，在选择周数不会开课的课，显示为灰色。

![课表查询](http://osv9x79o9.bkt.clouddn.com/18-3-13/31106334.jpg)

![选择周数](http://osv9x79o9.bkt.clouddn.com/18-3-13/94896484.jpg)





# 三、概要设计
由于本校教务系统没有推出手机版，而大多数学生日常操作都是在手机上进行的，所以我开发了这款小程序，将教务系统上常用的查询操作放到了微信小程序上面，并整合了学校图书馆、一卡通等其他系统。用户能够在本小程序上查看各种常用的信息。

## 1. 登录\绑定逻辑

```flow
toLogin=>start: 登录页
inSid=>inputoutput: 输入学号和教务/信息门户密码
isRight=>condition: 是否正确？
rError=>inputoutput: 返回错误信息
isBind=>condition: 是否绑定了其他系统
toBind=>operation: 跳转绑定页
toHome=>end: 到达首页
inOther=>inputoutput: 输入一卡通、图书馆密码和手机号
isRight2=>condition: 是否正确？
rError2=>inputoutput: 返回错误信息
toHome2=>end: 到达首页

toLogin->inSid->isRight
isRight(yes)->isBind
isRight(no)->rError
isBind(yes)->toHome
isBind(no)->toBind->inOther->isRight2
isRight2(yes)->toHome2
isRight2(no)->rError2
```

## 2. 首页跳转操作逻辑

### 2.1 图书馆功能

```flow
home=>start: 首页
library=>operation: 图书馆
showBorrowInfo=>inputoutput: 显示图书借阅信息
toRight=>operation: 右滑
inKeyword=>inputoutput: 输入查询关键字，点击查询
showBooksInfo=>inputoutput: 显示查询结果
click=>operation: 点击任意一个结果
showBooksDetail=>inputoutput: 显示点击书籍的具体信息
end=>end: 结束

home->library->showBorrowInfo->toRight->inKeyword->showBooksInfo->click->showBooksDetail->end
```

### 2.2 课表功能

```flow
home=>start: 首页
course=>inputoutput: 本周课表信息显示
select=>inputoutput: 选择显示周数
show=>inputoutput: 选择周数的课表信息显示
end=>end: 结束

home->course->select->show->end
```
### 2.3 成绩功能

```flow
home=>start: 首页
grade=>operation: 显示所有成绩
end=>end: 结束

home->grade->end
```

### 2.4 消费功能

```flow
home=>start: 首页
cost=>inputoutput: 显示本月消费
click=>operation: 点击底部“加载更多”
cost2=>inputoutput: 追显示下个月消费
end=>end: 结束

home->cost->click->cost2->end
```


## 3. 个人页跳转操作逻辑

## 3.1 重新绑定各系统

```flow
me=>start: 个人页
click=>operation: 点击“重新绑定三翼通行证”
reBind=>operation: 进入重新绑定页面（查看绑定逻辑）
end=>end: 结束

me->click->reBind->end
```

## 3.2 查看开发信息/反馈错误

```flow
me=>start: 个人页
click=>operation: 点击“关于拱拱”
showInfo=>inputoutput: 显示开发信息
click2=>operation: 点击“我要反馈（公测版）”
outQQ=>inputoutput: 输出反馈群号到剪切板
end=>end: 结束

me->click->showInfo->click2->outQQ->end
```

## 3.3 退出登录

```flow
me=>start: 个人页
click=>operation: 点击“退出登录”
end=>end: 退出登录

me->click->end
```

## 3.4 开关-图书到期短信提醒

```flow
me=>start: 个人页
click=>operation: 点击“图书到期短信提醒”
end=>end: 开关功能

me->click->end
```

## 3.5 开关-打开应用先进入课表

```flow
me=>start: 个人页
click=>operation: 点击“打开应用先进入课表”
end=>end: 开关功能

me->click->end
```

# 四、特色说明
本小程序的特色主要有以下几点：

1. 界面简洁、美观，操作效率高
  本小程序面向的用户为在线学生，所以在界面设计上进行了简洁大方的设计，没有花哨没用的内容，操作效率高。

2. 功能实用
  本小程序提炼了学生用户日常生活中对学习各个系统最常用的功能，并将其集合在了一个小程序中，能够最大程度的便利学生生活。

3. 针对用户操作习惯，提供了便利操作
  我分析了用户最常使用的功能，并将其优化，添加了便利其操作的设置，如“打开应用先进入课表”，提高了用户体验。

# 五、运营状态
本小程序当前已经有 1.1w用户

![用户量](http://osv9x79o9.bkt.clouddn.com/18-3-13/67555852.jpg)

# 六、体验小程序

![打开微信-扫一扫](http://osv9x79o9.bkt.clouddn.com/18-3-13/91806757.jpg)


