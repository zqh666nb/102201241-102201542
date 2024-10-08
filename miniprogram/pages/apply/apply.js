const app = getApp();

Page({
  data: {
    reason: '', // 申请理由
    contact: '' // 联系方式
  },

  onReasonInput(event) {
    this.setData({
      reason: event.detail.value
    });
  },

  onContactInput(event) {
    this.setData({
      contact: event.detail.value
    });
  },

  submitApplication() {
    const { reason, contact } = this.data;

    if (!reason || !contact) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    // 提交申请到数据库
    wx.cloud.database().collection('applications').add({
      data: {
        reason: reason,
        contact: contact,
        _openid: app.globalData.userInfo._openid, // 使用用户的 OpenID
        createdAt: new Date() // 记录创建时间
      }
    }).then(() => {
      wx.showToast({
        title: '申请提交成功',
        icon: 'success'
      });
      // 重置表单
      this.setData({
        reason: '',
        contact: ''
      });
    }).catch(err => {
      wx.showToast({
        title: '申请提交失败',
        icon: 'none'
      });
      console.error('提交申请失败:', err);
    });
  }
});
