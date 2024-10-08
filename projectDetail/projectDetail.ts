// projectDetail.ts
Page({
  data: {
    title: '',
    description: ''
  },

  onLoad(options: any) {
    const { title, description } = options;
    this.setData({ title, description });
  },

  applyForProject() {
    wx.showToast({
      title: '已申请加入项目',
      icon: 'success'
    });
  },

  goToChat() {
    wx.navigateTo({
      url: '/pages/chat/chat'
    });
  }
});
