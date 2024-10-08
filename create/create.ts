const app = getApp();

Page({
  data: {
    title: '',
    description: ''
  },

  onLoad() {
    // 确保在页面加载时清空输入框
    this.setData({
      title: '',
      description: ''
    });
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

      // 确保全局项目数组存在
      if (!app.globalData.projects) {
        app.globalData.projects = [];
      }
      app.globalData.projects.push(newProject);

      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });

      // 清空输入框
      this.setData({
        title: '',
        description: ''
      });

      // 使用 wx.redirectTo 返回项目广场页面
      wx.switchTab({
        url: '/pages/project/project'
      });

    }).catch((err: any) => {
      console.error('发布项目失败:', err);
      wx.showToast({
        title: '发布失败: ' + (err.message || '未知错误'),
        icon: 'none'
      });
    });
  }
});
