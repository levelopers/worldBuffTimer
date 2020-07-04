<template>
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text" id="inputGroup-sizing-default">{{label}}</span>
    </div>
    <input type="text" class="form-control" v-model="inputs" @change="onChange"/>
  </div>
</template>

<script>
  import {REND_CD, ONYX_CD} from '../constants/constants';

  export default {
    name: 'addon-input',
    props: {
      label: String
    },
    data: function () {
      return {
        inputs: null,
        outputObj: {
          rend:Number,
          onyx:Number
        }
      }
    },
    mounted() {
    },
    methods: {
      onChange() {
        let regexp = /\((.*?)\)/g;
        let array = [...this.inputs.matchAll(regexp)];
        console.log(array);
        for (let item of array) {
          if (!!item[0] && item[0].match(/rend/gi)) {
            this.outputObj['rend'] = this.getLastDrop(item[0], REND_CD)
          } else if (!!item[0] && item[0].match(/onyx/gi)) {
            this.outputObj['onyx'] = this.getLastDrop(item[0], ONYX_CD)
          }
          // else if (!!item[0] && item[0].match(/nef/gi)) {
          //   this.outputObj['nef'] = this.getLastDrop(item[0], REND_CD)
          // }
        }
        this.$emit('addonInput', this.outputObj)
      },
      getLastDrop(timeStr, cd) {
        if (!timeStr) {
          return null;
        }
        let hours = this.getNumber(/\d{1,2}\s*(hr|hour|hours)/g,timeStr);
        let minutes = this.getNumber(/\d{1,2}\s*(min|minute|minutes)/g,timeStr);
        let seconds = this.getNumber(/\d{1,2}\s*(sec|second|seconds)/g,timeStr);
        hours = hours < 24 ? hours : 0;
        minutes = minutes < 60 ? minutes : 0;
        seconds = seconds < 60 ? seconds : 0;
        const newDist = hours * 1000 * 60 * 60
            + minutes * 1000 * 60
            + seconds * 1000;
        if (!newDist){
          return null;
        }
        const nextDrop = this.getNow() + newDist;
        const lastDrop = nextDrop - cd;
        return lastDrop;
      },
      getNow() {
        return new Date().getTime();
      },
      getNumber(matchRegex, str) {
        matchRegex = new RegExp(matchRegex)
        let r1, r2;
        r1 = str.match(matchRegex);
        r1 = r1 ? r1[0] : '';
        r2 = r1.match(/\d{1,2}/g);
        return r2 ? parseInt(r2[0]) : 0
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
