<template>
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text" id="inputGroup-sizing-default">{{label}}</span>
    </div>
    <input type="text" class="form-control" v-model="inputs" @change="onChange"/>
  </div>
</template>

<script>
  import {ONYX_CD, REND_CD, BUFF_TYPE_ENUM} from '../constants/constants';

  export default {
    name: 'userInput',
    props: {
      type: null,
      label: String
    },
    data: function () {
      return {
        inputs: null,
        cd: Number,
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
        default:
          this.cd = null;
      }
    },
    methods: {
      onChange() {
        if (!this.cd) {
          this.$emit('inputLastDrop', this.inputs, this.type);
          return;
        }
        const formatedInput = this.inputs.replace(/\s+/g, '').trim();
        if (this.validateTimeInput(formatedInput)) {
          const inputlastDrop = this.getLastDrop(formatedInput, this.cd);
          this.$emit('inputLastDrop',inputlastDrop, this.type)
        }
      },
      validateTimeInput(input) {
        return !!input.match(/[0-24]{1,2}:[0-60]{1,2}:[0-60]{1,2}/)
      },
      getLastDrop(formatedInput, cd) {
        const timeArr = formatedInput.split(':').map(val => Number(val));
        const newDist = timeArr[0] * 60 * 60 * 1000
            + timeArr[1] * 60 * 1000
            + timeArr[2] * 1000;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
