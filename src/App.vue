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
                   @click="toggleTab"
                   aria-selected="true">Manual</a>
              </li>
              <li class="nav-item">
                <a class="nav-link"
                   id="addon"
                   data-toggle="pill"
                   role="tab"
                   aria-controls="addon-inputs"
                   href="#addon-inputs"
                   @click="toggleTab"
                   aria-selected="false">Addon</a>
              </li>
            </ul>
          </th>
          <td colspan="4" class="tab-content" id="pills-tabContent">
            <div class="tab-pane fade show active" id="manual-inputs" role="tabpanel">
              <div class="d-flex">
                <user-input class="px-3"
                            ref="user-input-onyx"
                            @inputLastDrop="manualLastDrop"
                            :type="BUFF_TYPE_ENUM.ONYX"
                            placeholder="hh:mm:ss / mm:ss / ss"
                            label="onyx"></user-input>
                <user-input class="px-3"
                            ref="user-input-rend"
                            @inputLastDrop="manualLastDrop"
                            :type="BUFF_TYPE_ENUM.REND"
                            placeholder="hh:mm:ss / mm:ss / ss"
                            label="rend"></user-input>
                <user-input class="px-3"
                            ref="user-input-nef"
                            @inputLastDrop="manualLastDrop"
                            :type="BUFF_TYPE_ENUM.NEF"
                            placeholder="hh:mm:ss / mm:ss / ss"
                            label="nef"></user-input>
              </div>
            </div>
            <div class="tab-pane fade px-3" id="addon-inputs" role="tabpanel">
              <addon-input ref="addon-input"
                           @addonInput="addonInput"
                           label="addon input"></addon-input>
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
          <td>
            <span style="font-size:1rem">thank you!&#128536;</span>
          </td>
        </tr>
        </tbody>
      </table>
      <username-input ref="username-input"
                      @usernameOutput="usernameOutput"
                      placeholder="your name here... (optional)"
                      label="username"></username-input>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary d-flex"
                type="button"
                :disabled="isSubmitDisabled"
                @click="onSubmit">submit
          <template v-if="uploadStatus===REQUEST_STATUS.PENDING">
            <div class="my-icon">
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          </template>
          <template v-if="uploadStatus===REQUEST_STATUS.SUCCESS">
            <div class="my-icon text-success">
              <i class="fas fa-check"></i>
            </div>
          </template>
          <template v-if="uploadStatus===REQUEST_STATUS.FAIL">
            <div class="my-icon text-danger">
              <i class="fas fa-times"></i>
            </div>
          </template>
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
  import {BUFF_TYPE_ENUM, REQUEST_STATUS} from './constants/constants';

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
        isSubmitDisabled: true,
        uploadStatus: null,
        REQUEST_STATUS: REQUEST_STATUS
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
      this.initFirebase();
      this.initTable();
    },
    methods: {
      manualLastDrop: function (val, type) {
        this.uploadObj[type] = val;
      },
      usernameOutput: function (username) {
        this.uploadObj['username'] = username;
      },
      onSubmit: function () {
        this.uploadStatus = REQUEST_STATUS.PENDING;
        this.isSubmitDisabled = true;
        const dbref = this.database.ref('lastDrop/' + new Date().getTime());
        dbref.set(this.uploadObj).catch((err) => {
          this.uploadStatus = REQUEST_STATUS.FAIL;
          return err;
        }).finally(() => {
          this.uploadStatus = REQUEST_STATUS.SUCCESS;
          setTimeout(() => {
            this.uploadStatus = null;
            this.resetInputs();
            this.initTable();
          }, 2000)
        });
      },
      addonInput: function (val) {
        Object.assign(this.uploadObj, val);
      },
      toggleTab: function () {
        this.resetInputs();
      },
      initTable() {
        this.database.ref('lastDrop/').orderByKey().once("value").then(snapshot => {
          const snapshotObj = snapshot.val();
          if (!snapshotObj) {
            return;
          }
          const snapshotObjKeys = Object.keys(snapshotObj).reverse();
          this.fixedTimer = null;
          this.usersTimer = [];
          for (let key of snapshotObjKeys) {
            if (!!snapshotObj[key] && snapshotObj[key].username === 'boosted') {
              if (!this.fixedTimer) {
                this.fixedTimer = snapshotObj[key];
                this.fixedTimer['lastUpdated'] = key;
              }
            } else if (this.usersTimer.length < 5) {
              const userTimer = snapshotObj[key];
              userTimer['lastUpdated'] = key;
              this.usersTimer.push(userTimer)
            }
          }
        });
      },
      initFirebase() {
        const fa = firebase.initializeApp(firebaseConfig);
        this.database = fa.database();
      },
      resetInputs() {
        this.$refs['user-input-onyx'].inputs = '';
        this.$refs['user-input-rend'].inputs = '';
        this.$refs['user-input-nef'].inputs = '';
        this.$refs['addon-input'].inputs = '';
        // this.$refs['username-input'].inputs = '';
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

  .my-icon {
    margin-left: .3rem;
  }

  table {
    table-layout: fixed;
  }

  @media (max-width: 768px) {
    html {
      font-size: 10px;
    }

    .input-group-text {
      padding: 0;
    }

    .content {
      margin: 0;
      padding: 5vw;
    }
  }
</style>
