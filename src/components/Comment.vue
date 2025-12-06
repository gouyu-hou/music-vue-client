<template>
  <div>
    <div class="comment">
      <h2>评论</h2>
      <div class="comment-msg">
        <div class="comment-img">
          <img :src="attachImageUrl(avator)" alt="" />
        </div>
        <el-input
          class="comment-input"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="textarea"
        >
        </el-input>
      </div>
      <el-button type="primary" class="sub-btn" @click="postComment()"
        >评论</el-button
      >
    </div>
    <p>精彩评论: 共 {{ commentList.length }} 条评论</p>
    <ul class="popular" v-for="(item, index) in commentList" :key="index">
      <li>
        <div class="popular-img">
          <img :src="attachImageUrl(item.avator)" alt="" />
        </div>
        <div class="popular-msg">
          <ul>
            <li class="name">{{ item.username }}</li>
            <li class="time">{{ item.createTime }}</li>
            <li class="content">{{ item.content }}</li>
          </ul>
        </div>
        <div class="up" ref="up" @click="postUp(item.id, item.up, index)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zan"></use>
          </svg>
          {{ item.up }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mixin } from "../mixins";
import { mapGetters } from "vuex";
import { getUserOfId, setComment, setLike, getAllComment } from "../api/index";

export default {
  name: "comment",
  mixins: [mixin],
  props: [
    "playId", // 歌曲ID或歌单ID
    "type", // 歌单（1）/歌曲（0）
  ],
  data() {
    return {
      commentList: [], // 存放评论内容
      // 🔥 修改点 3：删除了 userPic 和 userName 数组，不再需要它们
      textarea: "", // 存放输入内容
    };
  },
  computed: {
    ...mapGetters([
      "id",
      "userId", // 用户ID
      "index", // 列表中的序号
      "loginIn", // 用户是否登录
      "avator", // 用户头像
    ]),
  },
  watch: {
    id() {
      this.getComment();
    },
  },
  mounted() {
    this.getComment();
  },
  methods: {
    // 获取所有评论
    getComment() {
      getAllComment(this.type, this.playId)
        .then((res) => {
          this.commentList = res.list;
          for (let item of res.list) {
            // 🔥 修改点 4：将 item (评论对象) 传递过去
            this.getUsers(item.userId, item);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取评论用户的昵称和头像
    // 🔥 修改点 5：接收 item 参数，将数据直接挂载到 item 上
    getUsers(id, item) {
      getUserOfId(id)
        .then((res) => {
          // 使用 $set 保证 Vue 能检测到新添加属性的变化
          if (res.consumer) {
            this.$set(item, "avator", res.consumer.avator);
            this.$set(item, "username", res.consumer.username);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 提交评论
    postComment() {
      if (this.loginIn) {
        // 0 代表歌曲， 1 代表歌单
        let params = new URLSearchParams();
        if (this.type === 1) {
          params.append("songListId", this.playId);
        } else if (this.type === 0) {
          params.append("songId", this.playId);
        }
        params.append("userId", this.userId);
        params.append("type", this.type);
        params.append("content", this.textarea);
        setComment(params)
          .then((res) => {
            if (res.code === 1) {
              this.textarea = "";
              this.getComment();
              this.notify("评论成功", "success");
            } else {
              this.notify("评论失败", "error");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.notify("请先登录", "warning");
      }
    },
    // 点赞
    postUp(id, up, index) {
      if (this.loginIn) {
        let params = new URLSearchParams();
        params.append("id", id);
        params.append("up", up + 1);
        setLike(params)
          .then((res) => {
            if (res.code === 1) {
              this.$refs.up[index].children[0].style.color = "#2796dd";
              this.getComment();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.notify("请先登录", "warning");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/comment.scss";
</style>
