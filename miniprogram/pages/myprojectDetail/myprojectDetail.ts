// projectDetail.ts
Page({
    data: {
      project: {
        title: '',
        
        nickname: '',
       
        description: '',

        likecount:0,
        
        _id: ''
      }
    },
  
    onLoad(options: any) {
      const { title, nickname, description,likecount ,_id} = options;
      this.setData({
        'project.title': title || '项目名称',
        'project.nickname': nickname || '项目负责人昵称',
        'project.description': description || '项目描述',
  'project.likecount': Number(likecount)||0,
        'project._id': _id ||''
      });
    },
  
    applyForProject() {
      const project_id = this.data.project._id; // 获取项目的 _id
      console.log('项目id', project_id); // 用于调试
      wx.navigateTo({
        url: `/pages/receiveapply/receiveapply?project_id=${project_id}` // 将 _id 作为参数传递
      });    
      
    },
  
  });