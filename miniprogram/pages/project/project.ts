// project.ts
const myapp = getApp();
interface Project {
  title: string;
  description: string;
}
Page({
  data: {
    projects: [] as Project[],
    filteredProjects: [] as Project[],
    searchTerm: '',      // 用户输入的搜索关键词
  },

  onShow() {  // 在页面显示时重新加载数据
    this.getProjects();
  },

   getProjects(): void {
        const db = wx.cloud.database();
        db.collection('projects') 
          .get()
          .then((res: any) => {
            this.setData({
              projects: res.data,
    filteredProjects: res.data
            });
            console.log('项目列表:', this.data.projects); // 用于调试
          })
          .catch((err: any) => {
            console.error('获取项目列表失败:', err);
          });
      },
    onSearchInput(e:any) {
      const searchTerm = e.detail.value.trim().toLowerCase(); // 获取输入内容并转为小写
      this.setData({ searchTerm }, this.filterProjects);
    },
  
    filterProjects() {
      const { projects, searchTerm } = this.data;
      if (!searchTerm) {
        this.setData({ filteredProjects: projects });
        return;
      }
  
      const filteredProjects = projects.filter(project =>
        (project.title || '').toLowerCase().includes(searchTerm) ||
        (project.description || '').toLowerCase().includes(searchTerm)
      );
  
      this.setData({ filteredProjects });
    },
  goToDetail(event: any) {
    const { title, description } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/projectDetail/projectDetail?title=${title}&description=${description}`
    });
  }
  
});
