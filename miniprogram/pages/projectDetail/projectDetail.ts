// projectDetail.ts
Page({
  data: {
      project: {
          title: '',
          nickname: '',
          description: '',
          likecount: 0,
          _id: '',
          members: []  // 新增字段用于存储项目成员
      }
  },

  onLoad(options: any) {
      const { title, nickname, description, likecount, _id } = options;
      console.log('传入的项目 ID:', _id); // 检查传入的 ID
      
      this.setData({
          'project.title': title || '项目名称',
          'project.nickname': nickname || '项目负责人昵称',
          'project.description': description || '项目描述',
          'project.likecount': Number(likecount) || 0,
          'project._id': _id || '' // 确保 ID 被正确设置
      });

      // 获取项目成员
      this.getProjectMembers(_id);
  },

  getProjectMembers(projectId:any) {
      const db = wx.cloud.database();
      db.collection('projects').doc(projectId).get().then(res => {
          // 更新项目的成员数据
          this.setData({
              'project.members': res.data.members || [] // 获取成员数组
          });
          console.log("项目成员:", res.data.members);
      }).catch(err => {
          console.error("获取项目成员失败", err);
      });
  },

  // 点赞按钮的点击事件处理函数
  increaseLikeCount: function() {
      const newLikeCount = this.data.project.likecount + 1;

      // 更新本地点赞数
      this.setData({
          'project.likecount': newLikeCount
      });

      // 直接更新数据库中的点赞数
      const db = wx.cloud.database();
      db.collection('projects').doc(this.data.project._id).update({
          data: {
              likecount: newLikeCount
          },
          success: (res) => {
              console.log('点赞数更新成功', res);
          },
          fail: (err) => {
              console.error('点赞数更新失败', err);
          }
      });
  },

  applyForProject() {
      const projectId = this.data.project._id; // 获取项目的 _id
      wx.navigateTo({
          url: `/pages/apply/apply?id=${projectId}` // 将 _id 作为参数传递
      });
  },

  goToChat() {
      
      wx.switchTab({
          url: `/pages/friends/friends` // 将 _id 作为参数传递
      });
  }
});
