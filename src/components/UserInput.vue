<template>
  <div>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="inputGroup-sizing-default">{{label}}</span>
      </div>
      <input type="text"
             class="form-control userInput"
             :placeholder="placeholder"
             v-model="inputs"/>
    </div>
    <div class="text-danger">
      {{error}}
    </div>
  </div>
</template>

<script>
  import {ONYX_CD, REND_CD, NEF_CD, BUFF_TYPE_ENUM} from '../constants/constants';

  export default {
    name: 'userInput',
    props: {
      type: null,
      label: String,
      placeholder: String
    },
    data: function () {
      return {
        inputs: null,
        cd: Number,
        error: ''
      }
    },
    mounted() {
      if (!this.type) {
        return;
      }
      switch (this.type) {
        case BUFF_TYPE_ENUM.ONYX:
          this.cd = ONYX_CD;
          break;
        case BUFF_TYPE_ENUM.REND:
          this.cd = REND_CD;
          break;
        case BUFF_TYPE_ENUM.NEF:
          this.cd = NEF_CD;
          break;
        default:
          this.cd = null;
      }
    },
    watch: {
      inputs: function (val) {
        this.inputs = val.replace(/\s+/g, '').trim();
        if (!this.validateTimeInput(this.inputs)) {
          this.error = 'invalid input'
        } else {
          this.error = null;
        }
        this.onChange();
      }
    },
    methods: {
      onChange() {
        if (!this.error && !!this.inputs) {
          const inputlastDrop = this.getLastDrop(this.inputs, this.cd);
          this.$emit('inputLastDrop', inputlastDrop, this.type)
        } else {
          this.$emit('inputLastDrop', null, this.type)
        }
      },
      validateTimeInput(input) {
        return !!input.match(/^(00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])$/)
            || !!input.match(/^([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])$/)
            || !!input.match(/^([0-9]|[0-5][0-9])$/)
            || !input
      },
      getLastDrop(formatedInput, cd) {
        if (!formatedInput) {
          return;
        }
        const timeArr = formatedInput.split(':').map(val => Number(val));
        let hours = 0, minutes = 0, seconds = 0;
        if (timeArr.length === 3) {
          hours = timeArr[0];
          minutes = timeArr[1];
          seconds = timeArr[2];
        } else if (timeArr.length === 2) {
          minutes = timeArr[0];
          seconds = timeArr[1];
        } else if (timeArr.length === 1) {
          seconds = timeArr[0];
        }
        const newDist = hours * 60 * 60 * 1000
            + minutes * 60 * 1000
            + seconds * 1000;
        const nextDrop = this.getNow() + newDist;
        const lastDrop = nextDrop - cd;
        return lastDrop;
      },
      getNow() {
        return new Date().getTime();
      },
    }
  }
</script>

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
