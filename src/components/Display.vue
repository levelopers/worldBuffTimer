<template>
  <div>
    {{time}}
  </div>
</template>

<script>
  import {BUFF_TYPE_ENUM, REND_CD, ONYX_CD, NEF_CD} from '../constants/constants';

  export default {
    name: 'display',
    props: {
      lastDrop: null,
      buffType: null,
      freezed: Boolean(false)
    },
    data: function () {
      return {
        time: null,
        cd: null
      }
    },
    mounted() {
      if (this.buffType === BUFF_TYPE_ENUM.REND) {
        this.cd = REND_CD
      } else if (this.buffType === BUFF_TYPE_ENUM.ONYX) {
        this.cd = ONYX_CD
      } else if (this.buffType === BUFF_TYPE_ENUM.NEF) {
        this.cd = NEF_CD
      }
      this.time = this.getDisplay();
      if (!this.freezed) {
        setInterval(() => {
          this.time = this.getDisplay();
        }, 1050)
      }
    },
    watch: {
      lastDrop: function () {
        this.time = this.getDisplay();
      }
    },
    methods: {
      getDisplay: function () {
        const dist = this.getDistance(this.lastDrop, this.cd);
        return this.logTime(dist);
      },
      getDistance(lastDrop, cd) {
        if (!lastDrop) {
          return;
        }
        let nextDrop = lastDrop + cd;
        while (nextDrop < this.getNow()) {
          nextDrop += cd;
        }
        return nextDrop - this.getNow();
      },
      logTime: function (distance) {
        if (!distance || distance <= 0) {
          return 'no time available'
        }
        distance += 10; // compensation
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        return `${hours} : ${minutes} : ${seconds}`;
      },
      getNow() {
        return new Date().getTime();
      },
    }
  }
</script>

<style scoped>
</style>
