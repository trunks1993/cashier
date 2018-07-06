<template>
  <div class="showCodeImg">
    <div class="FacePhoto" v-show="isFace">
      <div class="photo" id="videoBox">
        <p>请让消费者面部对准摄像头</p>
        <!-- <video id="video" width="600" height="330" preload loop muted style="position:absolute;top:-1000px;left:-1000px;"></video> -->
        <canvas id="showCanvas" width="594" height="324"></canvas>
        <button @click="closeFace">取消识别</button>
      </div>
    </div>
    <div class="notface" v-show="Isnotface">
      <div>
        <p>未找到对应的会员，是否去绑定头像？</p>
        <button @click="Isnotface=false;">直接收银</button>
        <button @click="toFace">重新识别</button>
        <button @click="showqrCode">去绑定</button>
      </div>
    </div>
  </div>
</template>
<script>
import { getMembersByScanCode, getMemberByMemberCard, getMemberByImageForRecharge, getMemberByImage } from '@/api'
export default {
  name: 'qrface',
  props: {
    url: {
      type: String,
      default: '' //这样可以指定默认的值
    },
    member: {
      type: Object,
      default: null //这样可以指定默认的值
    },
    isFace: {
      type: Boolean,
      default: false //这样可以指定默认的值
    }
  },
  data() {
    return {
      //   member:null,
      memberCode: "",
      faceImg: "",
      faceImg2: "",
      IsfistFace: true,
      Isnotface: false,
      faceStart: false,
      mystream: null,
      trackerObj: null,
      initQCode: "http://",
    }
  },
  watch: {
    isFace: function(val) {
      if (val) {
        this.faceStart = true;
        if (this.IsfistFace) {
          this.faceInit();
        } else {
          this.trackerObj.run();
        }
      } else {
        this.trackerObj.stop();
      }
    }
  },
  methods: {
    showqrCode: function() {
      this.$emit("showqrCode");
      this.Isnotface = false;
    },
    GetMember: function(memberCode) {
      var self = this;
      const requestApi = this.url === "chargeMoney" ? getMembersByScanCode : getMemberByMemberCard
      setTimeout(function() {
        var code = memberCode;
        if (memberCode != "") {
          requestApi(code).then(function(response) {
            if (!response.data.success) {
              if (self.url !== "chargeMoney" && !/^1[34578]\d{9}$/.test(memberCode)) {
                self.$toast('请输入合法手机号')
                return
              } else {
                self.$emit("noMenber", memberCode, response.data.cardName)
              }
              if (self.url === "chargeMoney") self.$toast(response.data.msg)
            } else {
              console.log(response.data)
              self.$store.dispatch('SetVipInfo', response.data.data)
              self.$emit("getMenber", response.data)
            }
          })
        }
      }, 250);
    },
    toFace: function() {
      this.Isnotface = false;
      this.$emit("toFace");
    },
    closeFace: function() {
      this.$emit("closeFace");
    },
    faceInit: function() {
      var self = this;
      var mediaStreamTrack;
      var video = document.createElement("video");
      video.id = "video";
      document.getElementById("videoBox").appendChild(video);
      if (navigator.getUserMedia) {
        navigator.getUserMedia({ video: true }, function(stream) {
          video.src = window.webkitURL.createObjectURL(stream);
          video.play();
          self.IsfistFace = false;
          self.isFace = true;
        }, function(error) {
          alert("请检查摄像头是否正确连接");
        });
      } else if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia({ video: true }, function(stream) {
          video.src = window.webkitURL.createObjectURL(stream);
          video.play();
          self.IsfistFace = false;
          self.isFace = true;
        }, function(error) {
          alert("请检查摄像头是否正确连接");
        });
      }
      var canvas = document.getElementById('showCanvas');
      var context = canvas.getContext('2d');
      if (!tracker) {
        var tracker = new tracking.ObjectTracker('face');
        console.log(tracking)
        tracker.setInitialScale(4);
        tracker.setStepSize(2);
        tracker.setEdgesDensity(0.1);
        self.trackerObj = tracking.track('#video', tracker, { camera: true });
        console.log(tracking)
        tracker.on('track', function(event) {
          if (self.isFace) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(video, 0, 0, 594, 324);
            event.data.forEach(function(rect) {
              if (self.faceStart) {
                getMemberByImage();
              }
              context.strokeStyle = '#12f312';
              context.lineWidth = 5;
              context.strokeRect(rect.x - 25, rect.y - 25, rect.width + 50, rect.height + 50);
            });
          }
        });
      }



      function getMemberByImage() {

        const requestApi = self.url == "chargeMoney" ? getMemberByImageForRecharge : getMemberByImage
        self.faceStart = false;
        var minicanvas = document.createElement("canvas");
        var minictx = minicanvas.getContext('2d');
        minicanvas.width = 300;
        minicanvas.height = 165;
        minictx.drawImage(video, 0, 0, 300, 165);
        var img = minicanvas.toDataURL("image/png", 0.5);
        self.faceImg = minicanvas.toDataURL("image/png", 0.5);
        requestApi({ img: img.split(",")[1] }).then(function(response) {
          if (response.data.success) {
            if (self.url == "chargeMoney") {
              var rdata = response.data.data.member;
            } else {
              var rdata = response.data.data;
            }
            var name = rdata.nick && rdata.nick != "" ? rdata.nick : rdata.userName;
            self.$toast("会员 " + name + ",您好!");
            self.$emit("getMenber", response.data);
          } else {
            if (response.data.type == "hasface") {
              self.Isnotface = true;
              self.$emit("closeFace");
            } else {
              self.faceStart = true;
            }
          }
        })
      }
    },
  }
}

</script>
<style scoped="scoped">


</style>
