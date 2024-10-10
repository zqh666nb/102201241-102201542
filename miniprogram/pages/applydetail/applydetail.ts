// projectDetail.ts
Page({
    data: {
      application: {
        reason: '',
        
        contact: '',
       
        account_id: '',
  project_id:''
      },
  project:{}
    },
  
    onLoad(options: any) {
      const { reason, contact, account_id ,project_id} = options;
      this.setData({
        'application.reason': reason ,
        'application.contact': contact ,
        'application.account_id': account_id ,
  'application.project_id': project_id
      });
  console.log('列表:', this.data.application);
    },
  
    applyForProject() {
        wx.showToast({
      icon: 'none',
      title: '已同意',
    })  
    const db = wx.cloud.database();
    
    const projectId= String(this.data.application.project_id); // 替换为实际项目的 ID
    console.log('申请列表:', this.data.application);
    const newMemberAccountId = String(this.data.application.account_id); // 要添加的成员 account_id

    db.collection('projects').doc(projectId).get()
  .then(res => {
    console.log("项目数据:", res.data);
  })
  .catch(err => {
    console.error("获取项目数据失败:", err);
  });

  
    console.log("Updating project with ID:", projectId);
    console.log("Adding member ID:", newMemberAccountId);

    db.collection('projects').doc(projectId).update({
      data: {
        members: db.command.addToSet(newMemberAccountId) // 使用 addToSet 避免重复
        
      }
    
    }).then(res => {
      console.log("成员添加成功", res);

      wx.showToast({
        title: '成员添加成功',
        icon: 'success'
      });
      
    }).catch(err => {
      console.error("添加成员失败", err);
      wx.showToast({
        title: '添加成员失败',
        icon: 'none'
      });
    });
    
    },
  
  });
  