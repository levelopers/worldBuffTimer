<template>
  <div>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="inputGroup-sizing-default">{{label}}</span>
      </div>
      <input type="text"
             class="form-control userInput"
             :placeholder="placeholder"
             v-model="inputs"
             @change="onChange"/>

    </div>
    <div class="error text-danger">
      {{error}}
    </div>
  </div>
</template>

<script>

  export default {
    name: 'username-input',
    props: {
      label: String,
      placeholder: String
    },
    data: function () {
      return {
        inputs: null,
        error: '',
        maxLength: 25
      }
    },
    watch: {
      inputs: function () {
        const formatedInput = this.inputs.replace(/\s+/g, '').trim();
        if (!this.validate(formatedInput)) {
          return this.error = "invalid input"
        }
        this.error = null
      }
    },
    methods: {
      onChange() {
        if (!this.error) {
          this.$emit('usernameOutput', this.inputs);
        } else {
          this.$emit('usernameOutput', "anonymous cool guy");
        }
      },
      validate(input) {
        return input.length <= this.maxLength;
      }
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
