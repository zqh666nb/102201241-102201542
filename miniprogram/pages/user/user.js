const app = getApp();
var count = 0;

Page({
  data: {
    projects: [] // 存储项目列表
  },

  onShow() {
    this.setData({
      userInfo: app.globalData.userInfo,
      avatarUrl: app.globalData.userInfo.avatarUrl
    });
    this.getProjects();
  },

  onLoad() {
    // Any additional setup can go here
  },

  getProjects() {
    const db = wx.cloud.database();
    const Account_id = app.globalData.userInfo.account_id;

    db.collection('projects') // 替换为你的集合名称
      .where({
        account_id: Account_id // 使用 in 操作符筛选
      })
      .get()
      .then((res) => {
        this.setData({
          projects: res.data
        });
        console.log('项目列表:', this.data.projects); // 用于调试
      })
      .catch((err) => {
        console.error('获取项目列表失败:', err);
      });
  },

  changeUser() {
    app.globalData.userInfo = null;
    wx.navigateTo({
      url: '/pages/login/login',
    });
  },

  changeUserAvatar() {
    let a = this;
    wx.showActionSheet({
      itemList: ["从相册中选择", "拍照"],
      itemColor: "#f7982a",
      success: function(e) {
        e.cancel || (0 === e.tapIndex ? a.chooseWxImageShop("album") : 1 === e.tapIndex && a.chooseWxImageShop("camera"));
      }
    });
  },

  chooseWxImageShop: function(a) {
    var e = this;
    wx.chooseMedia({
      mediaType: ["image"],
      sizeType: ["original", "compressed"],
      sourceType: [a], // 类型
      count: 1,
      success: function(a) {
        if (a.tempFiles[0].size > 2097152) {
          wx.showModal({
            title: "提示",
            content: "选择的图片过大，请上传不超过2M的图片",
            showCancel: !1,
            success: function(a) {
              a.confirm;
            }
          });
        } else {
          //把图片上传到服务器
          e.upload_file(a.tempFiles[0].tempFilePath);
        }
      }
    });
  },

  upload_file: function(e) {
    console.log(e);
    var that = this;
    wx.showLoading({
      title: "上传中"
    });
    wx.cloud.uploadFile({
      filePath: e, // 图片路径
      cloudPath: app.globalData.userInfo.account_id + count + ".png",
      success(res) {
        count += 1;
        console.log(res.fileID);
        that.updateAvatar(res.fileID);
        wx.hideLoading();
        wx.showToast({
          title: "上传成功",
          icon: "success",
          duration: 1000
        });
      },
      fail: function(a) {
        wx.hideLoading();
        wx.showToast({
          title: "上传失败",
          icon: "none",
          duration: 3000
        });
      }
    });
  },
  goToDetail(event) {
    const { title, description,nickname,likecount,_id} = event.currentTarget.dataset;
    console.log('传入的点赞数:', likecount); // 检查传入的点赞数是否有效
    wx.navigateTo({
      url: `/pages/myprojectDetail/myprojectDetail?title=${title}&description=${description}&nickname=${nickname}&likecount=${likecount}&_id=${_id}`
    });
  },
  updateAvatar(url) {
    var that = this;
    console.log(url);

    // 更新聊天记录数据库中头像信息
    wx.cloud.database().collection('chat_record').where({
      userA_avatarUrl: app.globalData.userInfo.avatarUrl,
      userA_account_id: app.globalData.userInfo.account_id
    }).update({
      data: {
        userA_avatarUrl: url
      }
    });

    wx.cloud.database().collection('chat_record').where({
      userB_avatarUrl: app.globalData.userInfo.avatarUrl,
      userB_account_id: app.globalData.userInfo.account_id
    }).update({
      data: {
        userB_avatarUrl: url
      }
    });

    console.log(app.globalData.userInfo.avatarUrl);

    // 更新数据集中用户的头像信息
    wx.cloud.database().collection('chat_user').doc(app.globalData.userInfo._id).update({
      data: {
        avatarUrl: url
      },
      success(res) {
        console.log(res);
        wx.showToast({
          title: '头像更新成功',
        });
        that.setData({
          avatarUrl: url
        });
        app.globalData.userInfo.avatarUrl = url;
        wx.setStorageSync('userInfo', app.globalData.userInfo);
      }
    });

    this.onShow();
  }
});
