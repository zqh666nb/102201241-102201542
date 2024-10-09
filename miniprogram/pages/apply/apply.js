const app = getApp();

// apply.ts
Page({
  data: {
    reason: '', // 申请理由
    contact: '',// 联系方式
    projectId: ''
  },
  onLoad(options) {
    this.setData({
      projectId: options.id // 获取传递的项目 _id
    });
    console.log('接收到的项目 ID:', this.data.projectId); // 检查接收到的 ID
  },

  onReasonInput(event) {
    this.setData({
      reason: event.detail.value
    });
  },

  onContactInput(event) {
    this.setData({
      contact: event.detail.value
    });
  },

  submitApplication() {
    const { reason, contact,projectId } = this.data;

    if (!reason || !contact) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    const account_id = app.globalData.userInfo.account_id;
    wx.cloud.database().collection('applications').add({
      
        data: {
          reason: reason,
          contact: contact,
          account_id: account_id,
          project_id: projectId,
          createdAt: new Date()
        }
    }).then(res => {
      const newapplication = {
        reason,
        contact,
        account_id: account_id,
        project_id: projectId
         // 包含昵称
      };

      // 确保全局项目数组存在
      if (!app.globalData.applications) {
        app.globalData.applications = [];
      }
      app.globalData.applications.push(newapplication);

      wx.showToast({
        title: '申请提交成功',
        icon: 'success'
      });
      // 重置表单
      this.setData({
        reason: '',
        contact: ''
      });
      wx.switchTab({
        url: '/pages/project/project'
      });    
    }).catch(err => {
      wx.showToast({
        title: '申请提交失败',
        icon: 'none'
      });
      console.error('提交申请失败:', err);
    });
  }
});
