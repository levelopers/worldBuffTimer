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
          <th scope="col">Nef</th>
          <th scope="col">Last updated</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="fixedTimer">
          <th scope="row">fixed timer</th>
          <td>
            <display :last-drop="fixedTimer.onyx"
                     :buff-type="BUFF_TYPE_ENUM.ONYX"></display>
          </td>
          <td>
            <display :last-drop="fixedTimer.rend"
                     :buff-type="BUFF_TYPE_ENUM.REND"></display>
          </td>
          <td>
            <display :last-drop="fixedTimer.nef"
                     :buff-type="BUFF_TYPE_ENUM.NEF"></display>
          </td>
          <td>
            <last-updated-time :lastUpdated="fixedTimer.lastUpdated"></last-updated-time>
          </td>
        </tr>
        <tr v-for="(userTimer, index) in usersTimer"
            v-bind:key="index">
          <template v-if="userTimer">
            <th>{{userTimer.username}}</th>
            <td>
              <display :last-drop="userTimer.onyx"
                       :buff-type="BUFF_TYPE_ENUM.ONYX"></display>
            </td>
            <td>
              <display :last-drop="userTimer.rend"
                       :buff-type="BUFF_TYPE_ENUM.REND"></display>
            </td>
            <td>
              <display :last-drop="userTimer.nef"
                       :buff-type="BUFF_TYPE_ENUM.NEF"></display>
            </td>
            <td>
              <last-updated-time :lastUpdated="userTimer.lastUpdated"></last-updated-time>
            </td>
          </template>
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
                   aria-selected="true">Manual</a>
              </li>
              <li class="nav-item">
                <a class="nav-link"
                   id="addon"
                   data-toggle="pill"
                   role="tab"
                   aria-controls="addon-inputs"
                   href="#addon-inputs"
                   aria-selected="false">Addon</a>
              </li>
            </ul>
          </th>
          <td colspan="4" class="tab-content" id="pills-tabContent">
            <div class="tab-pane fade show active" id="manual-inputs" role="tabpanel">
              <div class="d-flex">
                <user-input class="px-3"
                            @inputLastDrop="manualLastDrop"
                            :type="BUFF_TYPE_ENUM.ONYX"
                            placeholder="hh:mm:ss / mm:ss / ss"
                            label="onyx"></user-input>
                <user-input class="px-3"
                            @inputLastDrop="manualLastDrop"
                            :type="BUFF_TYPE_ENUM.REND"
                            placeholder="hh:mm:ss / mm:ss / ss"
                            label="rend"></user-input>
                <user-input class="px-3"
                            @inputLastDrop="manualLastDrop"
                            :type="BUFF_TYPE_ENUM.NEF"
                            placeholder="hh:mm:ss / mm:ss / ss"
                            label="nef"></user-input>
              </div>
            </div>
            <div class="tab-pane fade px-3" id="addon-inputs" role="tabpanel">
              <addon-input @addonInput="addonInput" label="addon input"></addon-input>
            </div>
          </td>
        </tr>
        <tr v-if="uploadObj">
          <th scope="row">your submission</th>
          <td>
            <display :last-drop="uploadObj.onyx"
                     :buff-type="BUFF_TYPE_ENUM.ONYX"
                     :freezed="true"></display>
          </td>
          <td>
            <display :last-drop="uploadObj.rend"
                     :buff-type="BUFF_TYPE_ENUM.REND"
                     :freezed="true"></display>
          </td>
          <td>
            <display :last-drop="uploadObj.nef"
                     :buff-type="BUFF_TYPE_ENUM.NEF"
                     :freezed="true"></display>
          </td>
        </tr>
        </tbody>
      </table>
      <username-input @usernameOutput="usernameOutput"
                      placeholder="your name here... (optional)"
                      label="username"></username-input>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary"
                type="button"
                :disabled="isSubmitDisabled"
                @click="onSubmit">submit
        </button>
      </div>
      <footer class="footer-copyright text-center py-3">© 2020 Copyright:
        <a href="https://github.com/levelopers"> levelopers</a>
      </footer>
    </div>
  </div>
</template>

<script>
  import Display from './components/Display'
  import LastUpdatedTime from "./components/LastUpdatedTime";
  import UserInput from "./components/UserInput";
  import AddonInput from "./components/AddonInput";
  import UsernameInput from "./components/UsernameInput";
  import firebaseConfig from './config/firebaseConfig'
  import firebase from 'firebase'
  import {BUFF_TYPE_ENUM} from './constants/constants';

  export default {
    name: 'App',
    components: {
      Display,
      LastUpdatedTime,
      UserInput,
      AddonInput,
      UsernameInput
    },
    data: function () {
      return {
        fixedTimer: null,
        usersTimer: [],
        uploadObj: {
          username: "anonymous cool guy",
          onyx: null,
          rend: null,
          nef: null,
          lastUpdated: null
        },
        BUFF_TYPE_ENUM: BUFF_TYPE_ENUM,
        isSubmitDisabled: true
      }
    },
    watch: {
      uploadObj: {
        deep: true,
        handler(uploadObj) {
          if (uploadObj['rend'] || uploadObj['onyx'] || uploadObj['nef']) {
            this.isSubmitDisabled = false;
          } else {
            this.isSubmitDisabled = true;
          }
        }
      }
    },
    mounted() {
      var fa = firebase.initializeApp(firebaseConfig);
      this.database = fa.database();
      this.database.ref('lastDrop/').orderByKey().once("value").then(snapshot => {
        console.log(snapshot.val());
        const snapshotObj = snapshot.val();
        if (!snapshotObj) {
          return;
        }
        const snapshotObjKeys = Object.keys(snapshotObj).reverse();
        for (let key of snapshotObjKeys) {
          if (!!snapshotObj[key] && snapshotObj[key].username === 'boosted') {
            this.fixedTimer = snapshotObj[key];
            this.fixedTimer['lastUpdated'] = key;
          } else if (this.usersTimer.length < 5) {
            const userTimer = snapshotObj[key];
            userTimer['lastUpdated'] = key;
            this.usersTimer.push(userTimer)
          }
        }
      });
    },
    methods: {
      manualLastDrop: function (val, type) {
        this.uploadObj[type] = val;
      },
      usernameOutput: function (username) {
        this.uploadObj['username'] = username;
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
    height: 100%;
  }

  table {
    table-layout: fixed;
  }
</style>
