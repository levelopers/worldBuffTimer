<template>
  <div id="app">
    <div class="content table-responsive-md">
      <h2 class="mb-3">World Buffs Timer</h2>
      <table class="table table-hover table-dark">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Onyx</th>
          <th scope="col">Rend</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th scope="row">fixed timer</th>
          <td>
            <display v-if="fixedTimer && fixedTimer.length> 0"
                     :last-drop="fixedTimer[0].onyx"
                     :buff-type="BUFF_TYPE_ENUM.ONYX"></display>
          </td>
          <td>
            <display v-if="fixedTimer && fixedTimer.length> 0"
                     :last-drop="fixedTimer[0].rend"
                     :buff-type="BUFF_TYPE_ENUM.REND"></display>
          </td>
          <td></td>
        </tr>
        <tr v-for="(userTimer, index) in usersTimer"
            v-bind:key="index">
          <th>{{userTimer.username}}</th>
          <td>
            <display :last-drop="userTimer.onyx"
                     :buff-type="BUFF_TYPE_ENUM.ONYX"></display>
          </td>
          <td>
            <display :last-drop="userTimer.rend"
                     :buff-type="BUFF_TYPE_ENUM.REND"></display>
          </td>
        </tr>
        <tr>
          <th>
            <user-input @inputLastDrop="inputValue" type="username" label="username"></user-input>
          </th>
          <td>
            <user-input @inputLastDrop="inputValue" :type="BUFF_TYPE_ENUM.ONYX" label="onyx"></user-input>
          </td>
          <td>
            <user-input @inputLastDrop="inputValue" :type="BUFF_TYPE_ENUM.REND" label="rend"></user-input>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="d-flex justify-content-end">
        <button class="btn btn-outline-primary"
                type="button"
                @click="onSubmit">submit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import Display from './components/Display'
  import UserInput from "./components/UserInput";
  import firebaseConfig from './config/firebaseConfig'
  import firebase from 'firebase'
  import {ONYX_CD, REND_CD, BUFF_TYPE_ENUM} from './constants/constants';
  // const data = "[WorldBuffs] (Rend: 40 minutes 4 seconds) (Onyxia: No timer) (Nefarian: 5 hours 39 minutes)";

  export default {
    name: 'App',
    components: {
      Display,
      UserInput
    },
    data: function () {
      return {
        fixedTimer: [],
        usersTimer: [],
        uploadObj: {
          username: "anonymous cool guy",
          onyx: null,
          rend: null
        },
        BUFF_TYPE_ENUM: BUFF_TYPE_ENUM,
        ONYX_CD: ONYX_CD,
        REND_CD: REND_CD
      }
    },
    mounted() {
      var fa = firebase.initializeApp(firebaseConfig);
      this.database = fa.database();
      this.database.ref('lastDrop/').orderByKey().once("value").then(snapshot => {
        console.log(snapshot.val());
        const snapshotObj = snapshot.val();
        const snapshotObjKeys = Object.keys(snapshotObj);
        for (let key of snapshotObjKeys) {
          if (!!snapshotObj[key] && snapshotObj[key].username === 'boosted') {
            this.fixedTimer = [snapshotObj[key]]
          } else {
            this.usersTimer.push(snapshotObj[key])
          }
        }
        this.usersTimer = this.usersTimer.reverse();
      });
    },
    methods: {
      inputValue: function (val, type) {
        this.uploadObj[type] = val;
      },
      onSubmit: function () {
        const dbref = this.database.ref('lastDrop/' + new Date().getTime());
        dbref.set(this.uploadObj).finally(() => {
          console.log(this.uploadObj)
        });
      }
    }
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    width: 100vw;
    height: 100vh;
  }
  .content{
    margin: 0 100px;
  }
</style>
