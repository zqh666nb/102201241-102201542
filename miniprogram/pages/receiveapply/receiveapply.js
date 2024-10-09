// project.js
const myapp1 = getApp();

Page({
  data: {
    applications: [], // 存储申请列表
    filteredApplications: [], // 存储过滤后的申请列表
    searchTerm: '', // 用户输入的搜索关键词
    project_id: '',
    account_id:''
  },

  onLoad(options) {
    // 从页面参数获取 projectId
    const { project_id } = options; // 假设参数名称是 projectId
    this.setData({
      project_id: project_id || '' // 设置 projectId，默认值为空
    });
    this.getApplications(project_id); // 调用获取申请的方法
    console.log('申请id:', project_id); // 用于调试

  },

  getApplications(project_id) {
    const db = wx.cloud.database();
    // 从 applications 集合中获取所有申请，筛选出 project_id 等于传递的 projectId
    db.collection('applications')
      .where({ project_id: project_id }) // 筛选条件
      .get()
      .then((res) => {
        // 获取申请数据
        const applicationsData = res.data; 
        this.setData({
          applications: applicationsData,
          filteredApplications: applicationsData // 初始时显示所有申请
        });
        console.log('申请列表:', this.data.applications); // 用于调试
      })
      .catch((err) => {
        console.error('获取申请列表失败:', err);
        wx.showToast({
          title: '获取申请列表失败，请重试',
          icon: 'none'
        });
      });
  },
  filterApplications() {
    const { applications, searchTerm } = this.data;
    if (!searchTerm) {
      this.setData({ filteredApplications: applications }); // 显示所有申请
      return;
    }

    const filteredApplications = applications.filter(application =>
      (application.reason || '').toLowerCase().includes(searchTerm) ||
      (application.contact || '').toLowerCase().includes(searchTerm)
    );

    this.setData({ filteredApplications }); // 更新过滤后的申请列表
  },

  goToDetail(event) {
    const { reason, contact, account_id } = event.currentTarget.dataset; // 从事件中获取数据
    wx.navigateTo({
      url: `/pages/applydetail/applydetail?reason=${reason}&contact=${contact}&account_id=${account_id}`
   });
}
});