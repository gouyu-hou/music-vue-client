<template>
  <div class="play-bar" :class="{ show: !toggle }">
    <div @click="toggle = !toggle" class="item-up" :class="{ turn: toggle }">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-jiantou-xia-cuxiantiao"></use>
      </svg>
    </div>
    <div class="kongjian">
      <div class="item" @click="prev">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-ziyuanldpi"></use>
        </svg>
      </div>

      <div class="item" @click="togglePlay">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="playButtonUrl || '#icon-bofang'"></use>
        </svg>
      </div>

      <div class="item" @click="next">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-ziyuanldpi1"></use>
        </svg>
      </div>
      <div class="item-img" @click="goPlayerPage">
        <img :src="picUrl" alt="" />
      </div>
      <div class="playing-speed">
        <div class="current-time">{{ nowTime }}</div>
        <div class="progress-box">
          <div class="item-song-title">
            <div>{{ this.title }}</div>
            <div>{{ this.artist }}</div>
          </div>
          <div ref="progress" class="progress" @mousemove="mousemove">
            <div ref="bg" class="bg" @click="updatemove">
              <div
                ref="curProgress"
                class="cur-progress"
                :style="{ width: curLength + '%' }"
              ></div>
            </div>
            <div
              ref="idot"
              class="idot"
              :style="{ left: curLength + '%' }"
              @mousedown="mousedown"
              @mouseup="mouseup"
            ></div>
          </div>
        </div>
        <div class="left-time">{{ songTime }}</div>
      </div>
      <div class="item icon-volume">
        <svg v-if="volume !== 0" class="icon" aria-hidden="true">
          <use xlink:href="#icon-yinliang1"></use>
        </svg>
        <svg v-else class="icon" aria-hidden="true">
          <use xlink:href="#icon-yinliangjingyinheix"></use>
        </svg>
        <el-slider class="volume" v-model="volume" :vertical="true"></el-slider>
      </div>
      <div class="item" @click="collection">
        <svg :class="{ active: isActive }" class="icon" aria-hidden="true">
          <use xlink:href="#icon-xihuan-shi"></use>
        </svg>
      </div>
      <div class="item" @click="download">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xiazai"></use>
        </svg>
      </div>
      <div class="item" @click="changeAside">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-liebiao"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mixin } from "../mixins";
import { setCollection, download } from "../api/index";

export default {
  name: "play-bar",
  mixins: [mixin],
  data() {
    return {
      tag: false,
      nowTime: "00:00",
      songTime: "00:00",
      curLength: 0,
      progressLength: 0,
      mouseStartX: 0,
      toggle: true,
      volume: 50,
    };
  },
  // 🔥🔥🔥 核心修复：确保只有一个 computed，且包含 loginIn 和 playButtonUrl
  computed: {
    ...mapGetters([
      "loginIn",
      "userId",
      "isPlay",
      "playButtonUrl", // 即使 Vuex 返回 null，模板中的 || 会处理它
      "id",
      "url",
      "title",
      "artist",
      "picUrl",
      "curTime",
      "duration",
      "listOfSongs",
      "listIndex",
      "showAside",
      "autoNext",
      "isActive",
    ]),
  },
  watch: {
    isPlay(val) {
      if (val) {
        this.$store.commit("setPlayButtonUrl", "#icon-zanting");
      } else {
        this.$store.commit("setPlayButtonUrl", "#icon-bofang");
      }
    },
    volume() {
      this.$store.commit("setVolume", this.volume / 100);
    },
    curTime() {
      this.nowTime = this.formatSeconds(this.curTime);
      this.songTime = this.formatSeconds(this.duration);
      this.curLength = (this.curTime / this.duration) * 100;
    },
    autoNext() {
      this.next();
    },
  },
  mounted() {
    this.progressLength = this.$refs.progress.getBoundingClientRect().width;
    document.querySelector(".icon-volume").addEventListener(
      "click",
      (e) => {
        document.querySelector(".volume").classList.add("show-volume");
        e.stopPropagation();
      },
      false
    );
    document.querySelector(".volume").addEventListener(
      "click",
      (e) => {
        e.stopPropagation();
      },
      false
    );
    document.addEventListener(
      "click",
      () => {
        document.querySelector(".volume").classList.remove("show-volume");
      },
      false
    );
  },
  methods: {
    download() {
      if (!this.loginIn) {
        this.notify("请先登录", "warning");
        return;
      }
      download(this.url)
        .then((res) => {
          let content = res.data;
          let eleLink = document.createElement("a");
          eleLink.download = `${this.artist}-${this.title}.mp3`;
          eleLink.style.display = "none";
          let blob = new Blob([content]);
          eleLink.href = URL.createObjectURL(blob);
          document.body.appendChild(eleLink);
          eleLink.click();
          document.body.removeChild(eleLink);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeAside() {
      this.$store.commit("setShowAside", !this.showAside);
    },
    togglePlay() {
      if (!this.loginIn) {
        this.notify("请先登录", "warning");
        return;
      }
      if (this.isPlay) {
        this.$store.commit("setIsPlay", false);
      } else {
        this.$store.commit("setIsPlay", true);
      }
    },
    formatSeconds(value) {
      let theTime = parseInt(value);
      let result = "";
      let minute = 0;
      let hour = 0;
      if (theTime > 60) {
        minute = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (minute > 60) {
          hour = parseInt(minute / 60);
          minute = parseInt(minute % 60);
        }
      }
      if (parseInt(theTime) < 10) {
        result = "0:0" + parseInt(theTime);
      } else {
        result = "0:" + parseInt(theTime);
      }
      if (minute > 0) {
        if (parseInt(theTime) < 10) {
          result = "0" + parseInt(theTime);
        } else {
          result = parseInt(theTime);
        }
        result = parseInt(minute) + ":" + result;
      }
      if (hour > 0) {
        result = parseInt(hour) + ":" + parseInt(minute) + ":" + result;
      }
      return result;
    },
    mousedown(e) {
      this.mouseStartX = e.clientX;
      this.tag = true;
    },
    mouseup() {
      this.tag = false;
    },
    mousemove(e) {
      if (!this.duration) return false;
      if (this.tag) {
        let movementX = e.clientX - this.mouseStartX;
        let curLength = this.$refs.curProgress.getBoundingClientRect().width;
        this.progressLength = this.$refs.progress.getBoundingClientRect().width;
        let newPercent = ((curLength + movementX) / this.progressLength) * 100;
        if (newPercent > 100) newPercent = 100;
        this.curLength = newPercent;
        this.mouseStartX = e.clientX;
        this.changeTime(newPercent);
      }
    },
    changeTime(percent) {
      let newCurTime = this.duration * (percent * 0.01);
      this.$store.commit("setChangeTime", newCurTime);
    },
    updatemove(e) {
      if (!this.tag) {
        let curLength = this.$refs.bg.offsetLeft;
        this.progressLength = this.$refs.progress.getBoundingClientRect().width;
        let newPercent = ((e.clientX - curLength) / this.progressLength) * 100;
        if (newPercent < 0) newPercent = 0;
        else if (newPercent > 100) newPercent = 100;
        this.curLength = newPercent;
        this.changeTime(newPercent);
      }
    },
    prev() {
      if (!this.loginIn) {
        this.notify("请先登录", "warning");
        return;
      }
      if (this.listIndex !== -1 && this.listOfSongs.length > 1) {
        if (this.listIndex > 0) {
          this.$store.commit("setListIndex", this.listIndex - 1);
        } else {
          this.$store.commit("setListIndex", this.listOfSongs.length - 1);
        }
        this.toPlay(this.listOfSongs[this.listIndex].url);
      }
    },
    next() {
      if (!this.loginIn) {
        this.notify("请先登录", "warning");
        return;
      }
      if (this.listIndex !== -1 && this.listOfSongs.length > 1) {
        if (this.listIndex < this.listOfSongs.length - 1) {
          this.$store.commit("setListIndex", this.listIndex + 1);
        } else {
          this.$store.commit("setListIndex", 0);
        }
        this.toPlay(this.listOfSongs[this.listIndex].url);
      }
    },
    toPlay(url) {
      if (url && url !== this.url) {
        const song = this.listOfSongs[this.listIndex];
        this.$store.commit("setId", song.id);
        this.$store.commit("setUrl", this.$store.state.configure.HOST + url);
        this.$store.commit(
          "setpicUrl",
          this.$store.state.configure.HOST + song.pic
        );
        this.$store.commit("setTitle", this.replaceFName(song.name));
        this.$store.commit("setArtist", this.replaceLName(song.name));
        this.$store.commit("setLyric", this.parseLyric(song.lyric));
      }
    },
    goPlayerPage() {
      this.$router.push({ path: `/lyric/${this.id}` });
    },
    collection() {
      if (this.loginIn) {
        var params = new URLSearchParams();
        params.append("userId", this.userId);
        params.append("type", 0);
        params.append("songId", this.id);
        setCollection(params)
          .then((res) => {
            if (res.code === 1) {
              this.$store.commit("setIsActive", true);
              this.notify("收藏成功", "success");
            } else if (res.code === 2) {
              this.notify("已收藏", "warning");
            } else {
              this.$notify.error({
                title: "收藏失败",
                showClose: false,
              });
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
@import "../assets/css/play-bar.scss";
</style>
