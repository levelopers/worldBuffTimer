<template>
  <div>
    {{time}}
  </div>
</template>

<script>

  export default {
    name: 'last-updated-time',
    props: {
      lastUpdated: null,
    },
    data: function () {
      return {
        time: null,
      }
    },
    mounted() {
      this.time = this.getDisplay();
    },
    methods: {
      getDisplay: function () {
        const dist = this.getDistanceFromNow(this.lastUpdated);
        return this.logTime(dist);
      },
      getDistanceFromNow(lastUpdated) {
        return this.getNow() - lastUpdated;
      },
      logTime: function (distance) {
        if (!distance || distance < 0) {
          return 'no time available'
        }
        let days = Math.floor((distance % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if (days >= 2) {
          return "more than 2 days ago"
        } else if (days > 0 && days < 2) {
          return `${days} days ago`
        } else if (hours > 0) {
          return `${hours} hours ago`;
        } else if (minutes > 0) {
          return `${minutes} minutes ago`;
        } else if (seconds > 0) {
          return `${seconds} seconds ago`;
        } else {
          return "just updated"
        }
      },
      getNow() {
        return new Date().getTime();
      },
    }
  }
</script>

<style scoped>
</style>
