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
    ></audio>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "song-audio",
  data() {
    return {
      autoPlayEnabled: false, // 标志位：是否允许自动播放（用于切歌时）
    };
  },
  computed: {
    ...mapGetters([
      "id",
      "url",
      "isPlay",
      "volume",
      "changeTime",
      "autoNext",
      "loginIn",
    ]),
  },
  watch: {
    // 监听播放状态 (手动控制的核心)
    isPlay(val) {
      this.togglePlay(val);
    },
    // 监听指定时间跳转
    changeTime() {
      // 增加非空判断，防止报错
      if (this.$refs.player) {
        this.$refs.player.currentTime = this.changeTime;
      }
    },
    // 监听音量
    volume(val) {
      if (this.$refs.player) {
        this.$refs.player.volume = val;
      }
    },
    // 监听切歌（URL变化）
    url() {
      // 只有切歌时，才开启自动播放权限
      this.autoPlayEnabled = true;
    },
  },
  methods: {
    // 统一控制播放/暂停
    togglePlay(isPlaying) {
      let player = this.$refs.player;
      if (isPlaying) {
        player.play().catch((err) => {
          console.log("手动播放被阻断:", err);
        });
      } else {
        player.pause();
      }
    },

    // 音频加载就绪时的逻辑
    startPlay() {
      let player = this.$refs.player;
      // 1. 记录总时长
      if (player && player.duration) {
        this.$store.commit("setDuration", player.duration);
      }

      // 2. 登录校验
      if (!this.loginIn) {
        this.$store.commit("setIsPlay", false);
        return;
      }

      // 3. 判断是否需要播放
      // (如果是切歌导致的加载，或者是当前已经是播放状态)
      if (this.autoPlayEnabled || this.isPlay) {
        player
          .play()
          .then(() => {
            // 播放成功，确保状态为播放
            this.$store.commit("setIsPlay", true);
            this.autoPlayEnabled = false; // 重置切歌标志
          })
          .catch((err) => {
            console.log("自动播放被阻断:", err);
            // 🔥🔥🔥 核心修复：这里不要强制 setIsPlay(false)！
            // 因为如果是重复调用导致的错误，状态其实是对的，强改会出 bug。
          });
      }
    },

    // 记录播放位置
    timeupdate() {
      this.$store.commit("setCurTime", this.$refs.player.currentTime);
    },

    // 播放结束
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
