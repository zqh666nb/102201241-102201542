// project.ts
const myapp = getApp();

Page({
  data: {
    projects: [] // 存储项目列表
  },

  onLoad(options: any) {
    this.getProjects();
  },

  getProjects() {
    // 从全局数据中获取项目列表
    this.setData({
      projects: myapp.globalData.projects
    });
    //console.log('项目列表:', this.data.projects); // 用于调试
  },
  goBack() {
    wx.redirectTo({
      url: '/pages/index/index' // 主界面的路径
    });
  },
  goToDetail(event: any) {
    const { title, description } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/projectDetail/projectDetail?title=${title}&description=${description}`
    });
  }
  
});
