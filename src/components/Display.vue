<template>
    <div>
        {{time}}
    </div>
</template>

<script>
    import {BUFF_TYPE_ENUM, REND_CD, ONYX_CD} from '../constants/constants';

    export default {
        name: 'display',
        props: {
            lastDrop: null,
            buffType: null
        },
        data: function() {
          return {
              time: null,
          }
        },
        mounted() {
            this.time = this.getDisplay();
            setInterval(()=> {
                this.time = this.getDisplay();
            },1000)
        },
        methods: {
            getDisplay: function () {
                let CD;
                if (this.buffType === BUFF_TYPE_ENUM.REND) {
                    CD = REND_CD
                }else {
                    CD = ONYX_CD
                }
                const dist = this.getDistance(this.lastDrop, CD);
                return this.logTime(dist);
            },
            getDistance(lastDrop, cd) {
                let nextDrop = lastDrop + cd;
                while (nextDrop < this.getNow()) {
                    nextDrop += cd;
                }
                return nextDrop - this.getNow();
            },
            logTime: function (distance) {
                if (!distance || distance < 0) {
                    return 'no time available'
                }
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
