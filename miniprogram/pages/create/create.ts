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

  onTitleChange(event:any) {
    this.setData({
      title: event.detail.value
    });
  },

  onDescriptionChange(event:any) {
    this.setData({
      description: event.detail.value
    });
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
    // 获取当前用户的昵称
wx.getUserProfile({
  desc: '用于获取创建者的昵称', // 授权说明
  success: (userProfile) => {
    const nickname = userProfile.userInfo.nickName; // 获取用户昵称
    const { title, description } = this.data; 

    // 将项目数据，包括昵称，添加到数据库
    wx.cloud.database().collection('projects').add({
      data: { 
        title, 
        description, 
        nickname // 添加创建者昵称
      }
    }).then(res => {
      const newProject = { 
        _id: res._id, 
        title, 
        description, 
        nickname // 包含昵称
      };

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

      // 使用 wx.switchTab 返回项目广场页面
      wx.switchTab({
        url: '/pages/project/project' // 确保路径正确
      });

    }).catch((err) => {
      console.error('发布项目失败:', err);
      wx.showToast({
        title: '发布失败: ' + (err.message || '未知错误'),
        icon: 'none'
      });
    });
  },
  fail: (err) => {
    console.error('获取用户信息失败', err);
    wx.showToast({
      title: '获取用户信息失败，请重试',
      icon: 'none'
    });
  }
});

  }
});
