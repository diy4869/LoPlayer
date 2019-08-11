export default `
  <div class="playerBox">
    <video preload="auto" id="video"></video>
    <div class="controlBox">
    <!-- 
      <ul class="controls" v-show="showSetting">
        <li class="list">
          <span class="title">速度控制</span>
          <div class="content slider">
            <el-slider
              v-model="options.speed"
              :min="0"
              :max="2"
              :step="0.1"
              :show-tooltip="false"
              @change="change">
            </el-slider>
          </div>
        </li>
        <li class="list">
          <span class="title">播放模式</span>
          <div class="content">
            <div class="playMode" v-for="(item, index) in playModeList" :key="index" @click="playMode(item)">{{item}}</div>
          </div>
        </li>
      </ul> 
      -->
      <!-- 点击设置调整播放模式、播放速度 -->
      <div class="progressBox">
        <div class="progressLine">
          <div class="progress"></div>
          <div class="preload"></div>
        </div>
        <div class="progressBar"></div>
      </div>
      <div class="left">
        <!-- 播放按钮 -->
        <div class="play">
          <span class="icon iconfont icon-step-backward"></span>
          <span class="icon iconfont icon-caret-right" id="play"></span>
          <span class="icon iconfont icon-step-forward"></span>
        </div>
        <!-- 时间显示 -->
        <div class="duration">
          <span>00:00:00</span>
          <span>/</span>
          <span>00:00:00</span>
        </div>
      </div>
      <div class="right">
        <!-- 音量控制 -->
        <span class="volume icon iconfont"></span>
        <div class="volumeBox">
          <div class="progressLine">
            <div class="progress"></div>
          </div>
          <div class="progressBar"></div>
        </div>
        <!-- 设置部分 -->
        <span class="icon iconfont icon-kongzhi"></span>
        <!-- 全屏 -->
        <span class="fullscreen icon iconfont icon-fullscreen"></span>
      </div>
    </div>
    <!-- video加载部分 -->
    <div class="loading" style="display:none;">
      <span class="icon iconfont icon-loading"></span>
    </div>
    <!-- 暂停显示的部分 -->
    <div class="playStatus" style="display:none;">
      <span class="icon iconfont icon-video1"></span>
    </div>
  </div>
`
