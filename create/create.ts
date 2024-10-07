const app = getApp();

Page({
  data: {
    title: '',
    description: ''
  },

  onTitleChange(e: any) {
    this.setData({ title: e.detail.value });
  },

  onDescriptionChange(e: any) {
    this.setData({ description: e.detail.value });
  },

  submitProject() {
    const { title, description } = this.data;
  
    if (!title || !description) {
      wx.showToast({
        title: '请填写项目名称和描述',
        icon: 'none'
      });
      return;
    }
  
    // 发布项目到数据库
    wx.cloud.database().collection('projects').add({
      data: { title, description }
    }).then(res => {
      const newProject = { _id: res._id, title, description };
  
      // 成功后，将新项目添加到全局项目列表
      app.globalData.projects.push(newProject);
  
      // 成功后返回项目广场页面
      wx.navigateTo({ url: '/pages/project/project' });
    }).catch((err: any) => {
      console.error('发布项目失败:', err); // 输出错误信息
      wx.showToast({
        title: '发布失败: ' + (err.message || '未知错误'),
        icon: 'none'
      });
    });
  },
  goBack() {
    wx.redirectTo({
      url: '/pages/index/index' // 主界面的路径
    });
  }
  
});
