<template>
  <view-container>
    <view-title title="Game Settings" navigation="main-menu"/>

    <loading-spinner :loading="isLoadingGame"/>

    <div v-if="!isLoadingGame">
      <view-subtitle v-bind:title="game.settings.general.name" class="mt-2"/>

      <p v-if="game.settings.general.description">{{game.settings.general.description}}</p>

      <div class="row mb-4">
        <div class="col">
          <router-link to="/game/list" tag="button" class="btn btn-primary"><i class="fas fa-arrow-left"></i> Return to List</router-link>
        </div>
        <div class="col-auto">
          <button class="btn btn-danger" v-if="!game.state.startDate && game.settings.general.isGameAdmin" @click="deleteGame">Delete Game</button>
          <router-link :to="{ path: '/game', query: { id: game._id } }" tag="button" class="btn btn-success ml-1">Open Game <i class="fas fa-arrow-right"></i></router-link>
        </div>
      </div>

      <div class="row mb-2" v-if="game.settings.general.type === 'new_player_rt' || game.settings.general.type === 'new_player_tb'">
        <div class="embed-responsive embed-responsive-16by9">
          <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/cnRXQMQ43Gs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>

      <game-settings :game="game"/>
    </div>
  </view-container>
</template>

<script>
import LoadingSpinnerVue from '../components/LoadingSpinner'
import ViewTitle from '../components/ViewTitle'
import ViewSubtitle from '../components/ViewSubtitle'
import ViewContainer from '../components/ViewContainer'
import GameSettings from '../components/game/settings/GameSettings'
import gameService from '../services/api/game'
import router from '../router'

export default {
  components: {
    'loading-spinner': LoadingSpinnerVue,
    'view-container': ViewContainer,
    'view-title': ViewTitle,
    'view-subtitle': ViewSubtitle,
    'game-settings': GameSettings
  },
  data () {
    return {
      isLoadingGame: true,
      game: {
        _id: null,
        settings: {
          general: {
            name: null,
            description: null
          }
        }
      }
    }
  },
  created () {
    this.game._id = this.$route.query.id
  },
  async mounted () {
    this.isLoadingGame = true

    try {
      let response = await gameService.getGameInfo(this.game._id)

      this.game = response.data
    } catch (err) {
      console.error(err)
    }

    this.isLoadingGame = false
  },
  methods: {
    async deleteGame () {
      if (await this.$confirm('Delete game', 'Are you sure you want to delete this game?')) {
        this.isDeletingGame = true

        try {
          let response = await gameService.delete(this.game._id)

          if (response.status === 200) {
            router.push({ name: 'main-menu' })
          }
        } catch (err) {
          console.error(err)
        }

        this.isDeletingGame = false
      }
    }
  }
}
</script>

<style scoped>
</style>
