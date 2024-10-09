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
      wx.navigateTo({
        url: '/pages/apply/apply'
      });    
      
    },
  
    goToChat() {
      wx.navigateTo({
        url: '/pages/chat/chat'
      });
    }
  });
  