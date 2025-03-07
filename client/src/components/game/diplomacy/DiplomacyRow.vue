<template>
<tr>
  <td :style="{'width': '8px', 'background-color': getFriendlyColour(diplomaticStatus.playerIdTo)}"></td>
  <td class="col-avatar" :title="getPlayerAlias(diplomaticStatus.playerIdTo)">
    <player-avatar @onClick="onPlayerDetailRequested(diplomaticStatus.playerIdTo)" :player="getPlayer(diplomaticStatus.playerIdTo)"/>
  </td>
  <td class="pl-2 pt-3 pb-2">
    <h5 class="alias-title">{{getPlayerAlias(diplomaticStatus.playerIdTo)}}</h5>
  </td>
  <td class="fit pt-3 pr-1">
    <i :class="getStatusIcon(diplomaticStatus.statusFrom)" :title="diplomaticStatus.statusFrom"></i> (<i :class="getStatusIcon(diplomaticStatus.actualStatus)" :title="diplomaticStatus.actualStatus"></i>) <i :class="getStatusIcon(diplomaticStatus.statusTo)" :title="diplomaticStatus.statusTo"></i>
  </td>
  <td class="fit pt-3 pb-2 pr-2">
    <div class="btn-group">
      <button class="btn btn-sm btn-success" :disabled="isGameFinished || diplomaticStatus.statusTo === 'allies'" @click="declareAlly(diplomaticStatus)" title="Declare Allies"><i class="fas fa-handshake"></i></button>
      <button class="btn btn-sm btn-danger" :disabled="isGameFinished || diplomaticStatus.statusTo === 'enemies'" @click="declareEnemy(diplomaticStatus)" title="Declare Enemies"><i class="fas fa-skull"></i></button>
    </div>
  </td>
</tr>
</template>

<script>
import PlayerAvatarVue from '../menu/PlayerAvatar'
import DiplomacyApiService from '../../../services/api/diplomacy'
import gameHelper from '../../../services/gameHelper'

export default {
  components: {
    'player-avatar': PlayerAvatarVue
  },
  props: {
    'diplomaticStatus': Object
  },
  methods: {
    getPlayer (playerId) {
      return gameHelper.getPlayerById(this.$store.state.game, playerId)
    },
    getPlayerAlias (playerId) {
      return this.getPlayer(playerId).alias
    },
    getFriendlyColour (playerId) {
      return gameHelper.getPlayerColour(this.$store.state.game, playerId)
    },
    onPlayerDetailRequested(playerId) {
      this.$emit('onOpenPlayerDetailRequested', playerId)
    },
    async declareAlly (diplomaticStatus) {
      let playerAlias = this.getPlayerAlias(diplomaticStatus.playerIdTo)

      if (await this.$confirm('Declare Allies', `Are you sure you want to change your diplomatic status to ${playerAlias} to allied?`)) {
        try {
          let response = await DiplomacyApiService.declareAlly(this.$store.state.game._id, diplomaticStatus.playerIdTo)

          if (response.status === 200) {
            this.$toasted.show(`Your diplomatic status to ${playerAlias} is now allied.`, { type: 'success' })
          }

          diplomaticStatus.statusFrom = response.data.statusFrom
          diplomaticStatus.statusTo = response.data.statusTo
          diplomaticStatus.actualStatus = response.data.actualStatus
        } catch (err) {
          console.error(err)
        }
      }
    },
    async declareEnemy (diplomaticStatus) {
      let playerAlias = this.getPlayerAlias(diplomaticStatus.playerIdTo)

      if (await this.$confirm('Declare Enemy', `Are you sure you want to change your diplomatic status to ${playerAlias} to enemies?`)) {
        try {
          let response = await DiplomacyApiService.declareEnemy(this.$store.state.game._id, diplomaticStatus.playerIdTo)

          if (response.status === 200) {
            this.$toasted.show(`Your diplomatic status to ${playerAlias} is now enemies.`, { type: 'success' })
          }

          diplomaticStatus.statusFrom = response.data.statusFrom
          diplomaticStatus.statusTo = response.data.statusTo
          diplomaticStatus.actualStatus = response.data.actualStatus
        } catch (err) {
          console.error(err)
        }
      }
    },
    getStatusIcon (status) {
      switch (status) {
        case 'allies':
          return 'fas fa-handshake text-success'
        case 'enemies':
          return 'fas fa-skull text-danger'
      }
    }
  },
  computed: {
    isGameFinished: function () {
      return gameHelper.isGameFinished(this.$store.state.game)
    }
  }
}
</script>

<style scoped>
.col-avatar {
  position:absolute;
  width: 59px;
  height: 59px;
  cursor: pointer;
}

.alias-title {
  padding-left: 59px;
}

tr {
  height: 59px;
}

td {
    padding: 0;
}

.table td.fit,
.table th.fit {
    white-space: nowrap;
    width: 1%;
}

@media screen and (max-width: 576px) {
  tr {
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
