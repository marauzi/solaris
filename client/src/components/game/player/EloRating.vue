<template>
<span title="ELO Rating"><i class="fas fa-chess-knight mr-1"></i>{{user.achievements.eloRating || 1200}}</span>
</template>

<script>
export default {
  props: {
    user: Object
  }
}
</script>

<style scoped>
</style>
