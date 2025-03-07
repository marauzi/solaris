<template>
<div>
    <div class="row text-center bg-primary">
        <div class="col">
            <p class="mb-0 mt-2 mb-2">Select a colour and starting location.</p>
        </div>
    </div>

    <div class="row">
      <div class="table-responsive">
        <table class="table table-sm table-striped">
            <tbody>
                <tr v-for="player in players" v-bind:key="player._id">
                    <td :style="{'width': '8px', 'background-color': getFriendlyColour(player.colour.value)}"></td>
                    <td class="col-avatar" :title="player.colour.alias + ' ' + player.shape" @click="onOpenPlayerDetailRequested(player)">
                        <player-avatar :player="player"/>
                    </td>
                    <td class="pl-2 pt-3 pb-2">
                        <h5 class="alias-title" style="vertical-align: middle;">
                          {{player.alias}}
                          <span v-if="player.defeated" :title="getPlayerStatus(player)">
                            <i v-if="!player.afk" class="fas fa-skull-crossbones" title="Defeated"></i>
                            <i v-if="player.afk" class="fas fa-user-clock" title="AFK"></i>
                          </span>
                        </h5>
                    </td>
                    <td class="fit pl-2 pt-2 pb-2 pr-2">
                        <button class="btn btn-info" @click="panToPlayer(player)"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-success ml-1" @click="onJoinRequested(player)" v-if="!$isHistoricalMode() && (player.isEmptySlot || player.afk)">Join</button>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
</div>
</template>

<script>
import gameContainer from '../../../game/container'
import gameHelper from '../../../services/gameHelper'
import PlayerAvatarVue from '../menu/PlayerAvatar'

export default {
  components: {
    'player-avatar': PlayerAvatarVue
  },
  data () {
    return {
      players: []
    }
  },
  mounted () {
    this.players = this.$store.state.game.galaxy.players
  },

  methods: {
    getFriendlyColour (colour) {
      return gameHelper.getFriendlyColour(colour)
    },
    onJoinRequested (player) {
      this.$emit('onJoinRequested', player._id)
    },
    onOpenPlayerDetailRequested (e) {
      this.$emit('onOpenPlayerDetailRequested', e._id)
    },
    panToPlayer (player) {
      gameContainer.map.panToPlayer(this.$store.state.game, player)
    },
    getAvatarImage (player) {
      try {
        return require(`../../../assets/avatars/${player.avatar}.png`)
      } catch (err) {
        console.error(err)
        
        return null
      }
    },
    getPlayerStatus (player) {
      return gameHelper.getPlayerStatus(player)
    }
  }
}
</script>

<style scoped>
img {
    height: 55px;
}

.col-avatar {
  position:absolute;
  width: 59px;
  cursor: pointer;
}

.alias-title {
  padding-left: 59px;
}

table tr {
  height: 59px;
}

.table-sm td {
    padding: 0;
}

.table td.fit,
.table th.fit {
    white-space: nowrap;
    width: 1%;
}

@media screen and (max-width: 576px) {
  table tr {
    height: 45px;
  }

  .alias-title {
    padding-left: 45px;
  }

  .col-avatar {
    width: 45px;
    padding-top: 0.25rem !important;
  }
}
</style>
