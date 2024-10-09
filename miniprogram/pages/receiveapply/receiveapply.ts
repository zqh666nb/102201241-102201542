// project.ts
const myapp1 = getApp();
interface Project {
  title: string;
  description: string;
  nickname:string;
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
      const reversedProjects=res.data.reverse();
            this.setData({
              projects: reversedProjects,
    filteredProjects: reversedProjects
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
        this.setData({ filteredProjects: projects.reverse() }); // 反转原始项目数组
        return;
      }
    
      const filteredProjects = projects.filter(project =>
        (project.title || '').toLowerCase().includes(searchTerm) ||
        (project.description || '').toLowerCase().includes(searchTerm)||
        (project.nickname || '').toLowerCase().includes(searchTerm)
      );
    
      this.setData({ filteredProjects: filteredProjects.reverse() }); // 反转过滤后的数组
    },
  goToDetail(event: any) {
    const { title, nickname, description } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/applydetail/applydetail?title=${title}&nickname=${nickname}&description=${description}`
    });
  }
  
});
