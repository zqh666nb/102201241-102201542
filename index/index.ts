Page({
  data: {},

  createProject() {
    wx.navigateTo({ url: '/pages/create/create' });
  },

  viewProjects() {
    wx.navigateTo({ url: '/pages/project/project' });
  }
});
