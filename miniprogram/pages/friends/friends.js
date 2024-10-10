const app = getApp();
const utils = require("../../utils/util");

Page({
  data: {
    searchKeyword: '', // 新增：用于保存搜索输入
    filteredUserList: [], // 新增：用于保存过滤后的用户列表
  },

  onShow() {
    this.getNewFriends();
    this.getMyfriend();
    this.getAllUser();
  },

  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo,
    });
  },

  // 获取所有用户信息
  getAllUser() {
    var that = this;
    const _ = wx.cloud.database().command;

    wx.cloud.database().collection('chat_user').where({
      _id: _.nin(that.data.userInfo.friends).and(_.neq(that.data.userInfo._id))
    }).get({
      success(res) {
        console.log("user_list");
        console.log(res.data);
        that.setData({
          user_list: res.data,
          filteredUserList: res.data, // 初始化时将完整用户列表赋值给 filteredUserList
        });
      },
    });
  },

  // 处理搜索输入
  onSearchInput(e) {
    const searchKeyword = e.detail.value.toLowerCase();
    this.setData({ searchKeyword });

    // 过滤用户列表
    const filteredUserList = this.data.user_list.filter((user) =>
      user.account_id.toLowerCase().includes(searchKeyword)
    );

    this.setData({ filteredUserList });
  },

  addFriend(e) {
    var index = e.currentTarget.dataset.index;
    var that = this;

    wx.cloud.database().collection('chat_record').add({
      data: {
        userA_id: that.data.userInfo._id,
        userA_account_id: that.data.userInfo.account_id,
        userA_avatarUrl: that.data.userInfo.avatarUrl,
        userB_id: that.data.filteredUserList[index]._id,
        userB_account_id: that.data.filteredUserList[index].account_id,
        userB_avatarUrl: that.data.filteredUserList[index].avatarUrl,
        record: [],
        friend_status: false,
        time: utils.formatTime(new Date()),
      },
      success(res) {
        console.log(res);
        wx.showToast({
          title: '已发送好友申请',
        });
      },
    });
  },

  getNewFriends() {
    this.setData({
      userInfo: app.globalData.userInfo,
    });
    var that = this;
    wx.cloud.database().collection('chat_record').where({
      userB_id: that.data.userInfo._id,
      friend_status: false,
    }).get({
      success(res) {
        console.log(res);
        that.setData({
          new_friends: res.data,
        });
      },
    });
  },

  acceptNewFriend(e) {
    var index = e.currentTarget.dataset.index;
    var that = this;
    wx.cloud.database().collection('chat_record').doc(that.data.new_friends[index]._id).update({
      data: {
        friend_status: true,
      },
      success(res) {
        wx.showToast({
          title: '已通过好友',
        });

        that.setData({
          new_accepted_friend_id: that.data.new_friends[index].userA_id,
        });
      },
    });

    // AB成为朋友
    wx.cloud.database().collection('chat_user').where({
      _id: that.data.userInfo._id,
    }).get({
      success(res) {
        var my_friends = res.data[0].friends;
        my_friends.push(that.data.new_friends[index].userA_id);
        app.globalData.userInfo.friends = my_friends;
        wx.cloud.database().collection('chat_user').where({
          _id: that.data.userInfo._id,
        }).update({
          data: {
            friends: my_friends,
          },
        });
      },
    });

    wx.cloud.database().collection('chat_user').where({
      _id: that.data.new_friends[index].userA_id,
    }).get({
      success(res) {
        var A_friends = res.data[0].friends;
        A_friends.push(that.data.userInfo._id);
        wx.cloud.database().collection('chat_user').where({
          _id: that.data.new_friends[index].userA_id,
        }).update({
          data: {
            friends: A_friends,
          },
        });
        that.onShow();
      },
    });
  },

  // 对话信息
  getMyfriend() {
    var that = this;
    const DB = wx.cloud.database().command;
    wx.cloud.database().collection('chat_record').where(
      DB.or([
        {
          userA_id: that.data.userInfo._id,
          friend_status: true,
        },
        {
          userB_id: that.data.userInfo._id,
          friend_status: true,
        },
      ])
    ).get({
      success(res) {
        that.setData({
          my_friends: res.data,
        });
      },
    });
  },

  startChat(e) {
    var index = e.currentTarget.dataset.index;

    wx.navigateTo({
      url: '/pages/chat/chat?id=' + this.data.my_friends[index]._id,
    });
  },
});
