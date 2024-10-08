// projectDetail.ts
Page({
  data: {
    project: {
      title: '',
      
      nickname: '',
     
      description: ''
    }
  },

  onLoad(options: any) {
    const { title, description ,nickname} = options;
    this.setData({
      'project.title': title || '项目名称',
      'project.nickname': nickname || '项目负责人昵称',
      'project.description': description || '项目描述'
    });
  },

  applyForProject() {
    wx.navigateTo({
      url: '/pages/apply/apply'
    });    
    
  },

  goToChat() {
    wx.navigateTo({
      url: '/pages/chat/chat'
    });
  }
});
