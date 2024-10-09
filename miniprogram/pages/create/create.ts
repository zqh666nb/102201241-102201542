const app = getApp();

Page({
  data: {
    nickname: '',
    title: '',
    description: '',
    titleMaxLength: 15,
    nicknameMaxLength: 10,
    descriptionMaxLength: 30 // 最大字数限制
  },

  // 在页面加载时初始化输入框
  onLoad() {
    this.resetForm(); // 这里调用重置方法
  },

  // 当页面显示时重置输入框
  onShow() {
    this.resetForm(); // 每次显示页面时重置
  },

  // 重置输入框的值
  resetForm() {
    this.setData({
      nickname: '',
      title: '',
      description: ''
    });
  },

  onnameChange(event:any) {
    const inputValue = event.detail.value;
    // 如果输入超出最大长度，截取并更新
    if (inputValue.length > this.data.nicknameMaxLength) {
      this.setData({
        nickname: inputValue.slice(0, this.data.nicknameMaxLength) // 只保留前10个字符
      });
      wx.showToast({
        title: '昵称不能超过10个字',
        icon: 'none'
      });
    } else {
      this.setData({
        nickname: inputValue // 更新昵称
      });
    }
  },

  onTitleChange(event:any) {
    const inputValue = event.detail.value;
    // 如果输入超出最大长度，截取并更新
    if (inputValue.length > this.data.titleMaxLength) {
      this.setData({
        title: inputValue.slice(0, this.data.titleMaxLength) // 只保留前15个字符
      });
      wx.showToast({
        title: '标题不能超过15个字',
        icon: 'none'
      });
    } else {
      this.setData({
        title: inputValue // 更新标题
      });
    }
  },

  onDescriptionChange(event:any) {
    const inputValue = event.detail.value;
    // 如果输入超出最大长度，截取并更新
    if (inputValue.length > this.data.descriptionMaxLength) {
      this.setData({
        description: inputValue.slice(0, this.data.descriptionMaxLength) // 只保留前30个字符
      });
      wx.showToast({
        title: '内容不能超过30个字',
        icon: 'none'
      });
    } else {
      this.setData({
        description: inputValue // 更新描述
      });
    }
  },

  submitProject() {
    const { nickname, title, description } = this.data;

    if (!nickname) {
      wx.showToast({
        title: '请填写创建者昵称',
        icon: 'none'
      });
      return;
    }
    if (!title) {
      wx.showToast({
        title: '请填写项目标题',
        icon: 'none'
      });
      return;
    }
    if (!description) {
      wx.showToast({
        title: '请填写项目描述',
        icon: 'none'
      });
      return;
    }

    // 发布项目到数据库
    wx.getUserProfile({
      desc: '用于获取创建者的昵称', // 授权说明
      success: () => {
        const { nickname, title, description } = this.data;

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
          this.resetForm();

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
