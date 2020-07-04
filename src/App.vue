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
            <ul class="nav nav-pills mb-3 flex-column" id="pills-tab" role="tablist">
              <li class="nav-item">
                <a class="nav-link active"
                   id="manual"
                   data-toggle="pill"
                   role="tab"
                   aria-controls="manual-inputs"
                   href="#manual-inputs"
                   aria-selected="true"
                   @click="tabClick">Manual</a>
              </li>
              <li class="nav-item">
                <a class="nav-link"
                   id="addon"
                   data-toggle="pill"
                   role="tab"
                   aria-controls="addon-inputs"
                   href="#addon-inputs"
                   aria-selected="false"
                   @click="tabClick">Addon</a>
              </li>
            </ul>
          </th>
          <td colspan="2" class="tab-content" id="pills-tabContent">
            <div class="tab-pane fade show active" id="manual-inputs" role="tabpanel">
              <div class="d-flex">
                <user-input class="px-3" @inputLastDrop="inputValue" :type="BUFF_TYPE_ENUM.ONYX"
                            label="onyx"></user-input>
                <user-input class="px-3" @inputLastDrop="inputValue" :type="BUFF_TYPE_ENUM.REND"
                            label="rend"></user-input>
              </div>
            </div>
            <div class="tab-pane fade px-3" id="addon-inputs" role="tabpanel">
              <addon-input @addonInput="addonInput" label="addon input"></addon-input>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <user-input @inputLastDrop="inputValue" type="username" label="username"></user-input>
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
  import AddonInput from "./components/AddonInput";
  import firebaseConfig from './config/firebaseConfig'
  import firebase from 'firebase'
  import {ONYX_CD, REND_CD, BUFF_TYPE_ENUM} from './constants/constants';
  // const data = "[WorldBuffs] (Rend: 40 minutes 4 seconds) (Onyxia: No timer) (Nefarian: 5 hours 39 minutes)";

  export default {
    name: 'App',
    components: {
      Display,
      UserInput,
      AddonInput
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
      tabClick: function (e) {
        console.log(e.target.id)
      },
      inputValue: function (val, type) {
        this.uploadObj[type] = val;
      },
      onSubmit: function () {
        const dbref = this.database.ref('lastDrop/' + new Date().getTime());
        dbref.set(this.uploadObj).finally(() => {
          console.log(this.uploadObj)
        });
      },
      addonInput: function (val) {
        Object.keys(val).forEach((key) => (val[key] == null) && delete val[key]);
        Object.assign(this.uploadObj, val);
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

  .content {
    margin: 0 100px;
  }

  /*table{*/
  /*  table-layout: fixed;*/
  /*}*/
</style>
