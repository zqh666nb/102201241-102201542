// projectDetail.ts
Page({
    data: {
      applications: {
        reason: '',
        
        contact: '',
       
        account_id: ''
      }
    },
  
    onLoad(options: any) {
      const { reason, contact, account_id } = options;
      this.setData({
        'application.reason': reason ,
        'application.contact': contact ,
        'application.account_id': account_id 
      });
    },
  
    applyForProject() {
        wx.showToast({
      icon: 'none',
      title: '已同意',
    })  
      
    },
  
  });
  