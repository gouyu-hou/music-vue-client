<template>
  <div class="song-audio">
    <audio
      :src="url"
      controls="controls"
      ref="player"
      preload="true"
      @canplay="startPlay"
      @timeupdate="timeupdate"
      @ended="ended"
    >
      <!--（1）属性：controls，preload（2）事件：canplay，timeupdate，ended（3）方法：play()，pause() -->
      <!--controls：向用户显示音频控件（播放/暂停/进度条/音量）-->
      <!--preload：属性规定是否在页面加载后载入音频-->
      <!--canplay：当音频/视频处于加载过程中时，会发生的事件-->
      <!--timeupdate：当目前的播放位置已更改时-->
      <!--ended：当目前的播放列表已结束时-->
    </audio>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "song-audio",
  data() {
    return {
      // 【修改点1】新增一个标志位，默认不允许自动播放
      autoPlayEnabled: false,
    };
  },
  computed: {
    ...mapGetters([
      "id", // 音乐id
      "url", // 音乐链接
      "listOfSongs", // 存放的音乐
      "isPlay", // 播放状态
      "volume", // 音量
      "curTime", // 当前音乐的播放位置
      "changeTime", // 指定播放时刻
      "autoNext", // 用于触发自动播放下一首
      "loginIn", // 【修改点 1】添加 loginIn 获取登录状态
    ]),
  },
  watch: {
    // 监听播放还是暂停
    isPlay() {
      this.togglePlay();
    },
    // 跳到指定时刻播放
    changeTime() {
      let player = this.$refs.player;
      player.currentTime = this.changeTime;
    },
    volume(val) {
      this.$refs.player.volume = val;
    },
    // 【修改点2】监听 URL 变化
    // 只有当 URL 真正发生变化（用户切歌）时，才允许自动播放
    url() {
      this.autoPlayEnabled = true;
    },
  },
  methods: {
    // 开始/暂停
    togglePlay() {
      let player = this.$refs.player;
      if (this.isPlay) {
        player.play();
      } else {
        player.pause();
      }
    },
    // 获取歌曲链接后准备播放
    // 【修改点3】修改准备播放的逻辑
    startPlay() {
      // 登录拦截逻辑（之前加的）
      if (!this.loginIn) {
        this.$store.commit("setIsPlay", false);
        return;
      }

      let player = this.$refs.player;
      this.$store.commit("setDuration", player.duration);

      // 核心修改：判断是否允许自动播放
      if (this.autoPlayEnabled) {
        // 如果是切歌引起的，播放
        player.play();
        this.$store.commit("setIsPlay", true);
        // 播放一次后，重置标志位（防止其他意外触发）
        this.autoPlayEnabled = false;
      } else {
        // 如果是页面加载/刷新引起的，不播放，并更新状态为暂停
        this.$store.commit("setIsPlay", false);
      }
    },
    // 音乐播放时记录音乐的播放位置
    timeupdate() {
      let player = this.$refs.player;
      this.$store.commit("setCurTime", player.currentTime);
    },
    // 音乐播放结束时触发
    ended() {
      this.$store.commit("setIsPlay", false);
      this.$store.commit("setCurTime", 0);
      this.$store.commit("setAutoNext", !this.autoNext);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/song-audio.scss";
</style>
