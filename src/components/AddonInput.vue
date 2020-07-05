<template>
  <div>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="inputGroup-sizing-default">{{label}}</span>
      </div>
      <input type="text"
             class="form-control"
             placeholder="(Rend: 40 minutes 4 seconds) (Onyxia: No timer) (Nefarian: 5 hours 39 minutes)"
             v-model="inputs"/>
      <div class="input-group-append">
        <button class="btn btn-secondary" type="button" @click="clear"><i class="fas fa-times"></i></button>
      </div>
    </div>
    <div class="error text-danger">
      {{error}}
    </div>
  </div>
</template>

<script>
  import {NEF_CD, ONYX_CD, REND_CD} from '../constants/constants';
  // const data = "[WorldBuffs] (Rend: 40 minutes 4 seconds) (Onyxia: No timer) (Nefarian: 5 hours 39 minutes)";

  export default {
    name: 'addon-input',
    props: {
      label: String
    },
    data: function () {
      return {
        inputs: null,
        outputObj: {
          rend: null,
          onyx: null,
          nef: null
        },
        error: null
      }
    },
    watch: {
      inputs: function () {
        this.onChange();
        if (this.outputObj && (this.outputObj['rend'] || this.outputObj['onyx'] || this.outputObj['nef'])) {
          this.error = null;
        } else {
          this.error = "invalid input"
        }
        this.emitValue(this.outputObj);
      }
    },
    methods: {
      emitValue(val) {
        this.$emit('addonInput', val)
      },
      onChange() {
        let regexp = /\((.*?)\)/g;
        let array = [...this.inputs.matchAll(regexp)];
        if (array.length < 1) {
          Object.keys(this.outputObj).map(key => {
            this.outputObj[key] = null;
          });
        }
        for (let item of array) {
          if (!!item[0] && item[0].match(/rend/gi)) {
            this.outputObj['rend'] = this.getLastDrop(item[0], REND_CD)
          } else if (!!item[0] && item[0].match(/onyx/gi)) {
            this.outputObj['onyx'] = this.getLastDrop(item[0], ONYX_CD)
          } else if (!!item[0] && item[0].match(/nef/gi)) {
            this.outputObj['nef'] = this.getLastDrop(item[0], NEF_CD)
          }
        }
      },
      getLastDrop(timeStr, cd) {
        if (!timeStr) {
          return null;
        }
        let hours = this.getNumber(/\d{1,2}\s*(hr|hour|hours)/g, timeStr);
        let minutes = this.getNumber(/\d{1,2}\s*(min|minute|minutes)/g, timeStr);
        let seconds = this.getNumber(/\d{1,2}\s*(sec|second|seconds)/g, timeStr);
        hours = hours < 24 ? hours : 0;
        minutes = minutes < 60 ? minutes : 0;
        seconds = seconds < 60 ? seconds : 0;
        let newDist = hours * 1000 * 60 * 60
            + minutes * 1000 * 60
            + seconds * 1000;
        if (!newDist) {
          return null;
        }
        newDist += 10; //compensation
        const nextDrop = this.getNow() + newDist;
        const lastDrop = nextDrop - cd;
        return lastDrop;
      },
      getNow() {
        return new Date().getTime();
      },
      getNumber(matchRegex, str) {
        matchRegex = new RegExp(matchRegex);
        let r1, r2;
        r1 = str.match(matchRegex);
        r1 = r1 ? r1[0] : '';
        r2 = r1.match(/\d{1,2}/g);
        return r2 ? parseInt(r2[0]) : 0
      },
      clear() {
        this.inputs = null;
        this.error = null;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  ::-webkit-input-placeholder {
    font-size: .8rem !important;
  }

  :-moz-placeholder { /* Firefox 18- */
    font-size: .8rem !important;
  }

  ::-moz-placeholder { /* Firefox 19+ */
    font-size: .8rem !important;
  }

  :-ms-input-placeholder { /* Internet Explorer 10-11 */
    font-size: .8rem !important;
  }

  ::-ms-input-placeholder { /* Microsoft Edge */
    font-size: .8rem !important;
  }
</style>
