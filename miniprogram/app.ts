// app.ts
// app.ts
App({
  onLaunch() {
    // 初始化云开发环境
    wx.cloud.init({
      env: 'aaaaaauv-0gjpjfhg1fee2e90', // 替换为你的环境 ID
      traceUser: true // 可选，是否开启用户访问记录
    });
  },
  globalData: {
    projects: [] // 用于存储项目列表
  }
});
/*App<IAppOption>({
  globalData: {},
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },
})*/