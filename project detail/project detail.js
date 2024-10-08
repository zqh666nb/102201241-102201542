Page({
  data: {
    project: {
      title: '项目名称',
      leader: {
        avatarUrl: 'https://example.com/avatar.jpg', // 替换为真实头像URL
        nickname: '项目负责人昵称'
      },
      description: '1111'
    }
  },

  // 跳转到聊天界面
  goToChat() {
    wx.navigateTo({
      url: '/pages/chat/chat' // 替换为聊天界面的路径
    });
  }
});
