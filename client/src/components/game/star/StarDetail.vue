<template>
<div class="menu-page container" v-if="star">
    <menu-title :title="star.name + (star.homeStar ? ' - Capital': '')" @onCloseRequested="onCloseRequested">
      <ignore-bulk-upgrade v-if="star.ignoreBulkUpgrade && isOwnedByUserPlayer" :starId="star._id" class="mr-1"/>
      <modalButton modalName="abandonStarModal" v-if="!$isHistoricalMode() && isOwnedByUserPlayer && !userPlayer.defeated && isGameInProgress()" classText="btn btn-sm btn-secondary">
        <i class="fas fa-trash"></i>
      </modalButton>
      <button @click="viewOnMap" class="btn btn-sm btn-info ml-1"><i class="fas fa-eye"></i></button>
    </menu-title>

    <div class="row bg-secondary">
      <div class="col text-center pt-2">
        <p class="mb-2" v-if="userPlayer && star.ownedByPlayerId == userPlayer._id">A star under your command.</p>
        <p class="mb-2" v-if="star.ownedByPlayerId != null && (!userPlayer || star.ownedByPlayerId != userPlayer._id)">This star is controlled by <a href="javascript:;" @click="onOpenPlayerDetailRequested">{{starOwningPlayer.alias}}</a>.</p>
        <p class="mb-2" v-if="star.ownedByPlayerId == null">This star has not been claimed by any faction. Send a carrier here to claim it for yourself.</p>
        <p class="mb-2 text-danger" v-if="isDeadStar">This is a dead star.</p>
        <p class="mb-2 text-danger" v-if="star.targeted">This star has been targeted for destruction.</p>
      </div>
    </div>
    
    <div v-if="isCompactUIStyle && star.infrastructure">
      <div class="row mt-2" v-if="!isDeadStar">
        <div class="col">
          <span title="Natural Resources / Terraformed Resources">
            <i class="fas fa-globe"></i>
            {{star.naturalResources == null ? '???' : star.naturalResources}}
            <span v-if="star.ownedByPlayerId">/ {{star.terraformedResources || '???'}}</span>
          </span>
        </div>
        <div class="col-auto">
          <span :title="star.warpGate ? 'Warp Gate':'No Warp Gate'" :class="{'no-warp-gate':!star.warpGate}">
            <i class="fas fa-dungeon ml-1"></i>
          </span>
        </div>
      </div>
      
      <div class="row mt-2 pb-2">
        <div class="col">
          <span v-if="star.infrastructure && !isDeadStar" title="Economic Infrastructure">
              <i class="fas fa-money-bill-wave text-success"></i> {{star.infrastructure.economy}}
          </span>
          <span v-if="star.infrastructure && !isDeadStar" title="Industrial Infrastructure" class="ml-2">
              <i class="fas fa-tools text-warning"></i> {{star.infrastructure.industry}}
          </span>
          <span v-if="star.infrastructure && !isDeadStar" title="Scientific Infrastructure" class="ml-2">
              <i class="fas fa-flask text-info"></i> {{star.infrastructure.science}}
          </span>
        </div>
        <div class="col-auto">
          <span title="Total Known Garrison" v-if="star.ownedByPlayerId && star.infrastructure">
            {{star.ships == null ? '???' : star.ships}} <i class="fas fa-rocket ml-1"></i>
          </span>
        </div>
      </div>

      <div class="row pb-2" v-if="canShowSpecialist || (star.ownedByPlayerId && star.manufacturing != null)">
        <div class="col">
          <span v-if="canShowSpecialist && isOwnedByUserPlayer && canHireSpecialist">
            <specialist-icon :type="'star'" :defaultIcon="'user-astronaut'" :specialist="star.specialist"></specialist-icon>
            <a href="javascript:;" @click="onViewHireStarSpecialistRequested">
              <span class="ml-1" v-if="star.specialistId" :title="star.specialist.description">{{star.specialist.name}}</span>
              <span v-if="!star.specialistId">No Specialist</span>
            </a>
          </span>
          <span v-if="canShowSpecialist && (!isOwnedByUserPlayer || !canHireSpecialist)">
            <specialist-icon :type="'star'" :defaultIcon="'user-astronaut'" :specialist="star.specialist"></specialist-icon>
            <span v-if="star.specialist">
              {{star.specialist.name}}
            </span>
            <span v-if="!star.specialist">No Specialist</span>
          </span>
        </div>
        <div class="col-auto">
          <span v-if="star.ownedByPlayerId && star.manufacturing != null && !isDeadStar" title="Ship Production">
            {{star.manufacturing}} <i class="fas fa-wrench ml-1"></i>
          </span>
        </div>
      </div>

      <div class="row pb-2" v-if="star.specialist">
        <div class="col">
          <p class="mb-0"><small>{{star.specialist.description}}</small></p>
        </div>
      </div>

      <div class="mb-0" v-if="!isDeadStar">
        <infrastructureUpgradeCompact 
          v-if="isOwnedByUserPlayer && !userPlayer.defeated && star.upgradeCosts != null"
          :star="star"
          :availableCredits="userPlayer.credits"
          :economy="star.upgradeCosts.economy"
          :industry="star.upgradeCosts.industry"
          :science="star.upgradeCosts.science"
          v-on:onEditWaypointsRequested="onEditWaypointsRequested"
          v-on:onBuildCarrierRequested="onBuildCarrierRequested"/>
      </div>
    </div>

    <div v-if="isStandardUIStyle">
      <div v-if="star.ownedByPlayerId && star.infrastructure" class="row mb-0 pt-3 pb-3 bg-primary">
          <div class="col">
              Ships
          </div>
          <div class="col text-right">
              {{star.ships == null ? '???' : star.ships}} <i class="fas fa-rocket ml-1"></i>
          </div>
      </div>

      <div class="row pt-1 pb-1 bg-secondary" v-if="star.infrastructure && !isDeadStar">
          <div class="col">
              Natural Resources
          </div>
          <div class="col text-right">
              {{star.naturalResources == null ? '???' : star.naturalResources}} <i class="fas fa-globe ml-1"></i>
          </div>
      </div>

      <div v-if="star.ownedByPlayerId && star.infrastructure && !isDeadStar" class="row mb-2 pt-1 pb-1 bg-secondary">
          <div class="col">
              Terraformed Resources
          </div>
          <div class="col text-right">
              {{star.terraformedResources || '???'}} <i class="fas fa-globe ml-1"></i>
          </div>
      </div>
    </div>

    <div v-if="getCarriersInOrbit().length">
      <div class="row pt-2">
        <div class="col">
          <h4>Carriers</h4>
        </div>
        <div class="col-auto">
          <button title="Transfer all ships to the star" v-if="isOwnedByUserPlayer" type="button" class="btn btn-sm btn-primary" @click="transferAllToStar()"><i class="fas fa-chevron-up"></i></button>
        </div>
      </div>

      <div v-for="carrier in getCarriersInOrbit()" :key="carrier._id" class="row mb-1 pt-1 pb-0 bg-secondary">
        <div class="col-auto pr-0">
          <specialist-icon :type="'carrier'" :defaultIcon="'rocket'" :specialist="carrier.specialist"/>
        </div>
        <div class="col pl-1">
          <a href="javascript:;" @click="onOpenCarrierDetailRequested(carrier)">{{carrier.name}}</a>
        </div>
        <div class="col-auto pr-0">
          <i class="fas fa-map-marker-alt"></i>
          <i class="fas fa-sync ml-1" v-if="carrier.waypointsLooped"></i> {{carrier.waypoints.length}}
        </div>
        <div class="col-3 text-right">
          <i class="fas fa-rocket"></i> {{carrier.ships == null ? '???' : carrier.ships}}
        </div>
        <div class="col-auto pl-0">
          <a href="javascript:;" v-if="!$isHistoricalMode() && isOwnedByUserPlayer && !isGameFinished" title="Transfer ships" @click="onShipTransferRequested(carrier)"><i class="fas fa-exchange-alt"></i></a>
        </div>
      </div>
    </div>

    <div v-if="isStandardUIStyle && !isDeadStar">
      <div v-if="star.infrastructure">
        <h4 class="pt-2">Infrastructure</h4>

        <infrastructure :starId="star._id"/>

        <infrastructureUpgrade v-if="isOwnedByUserPlayer && !userPlayer.defeated && star.upgradeCosts != null"
          :star="star"
          :availableCredits="userPlayer.credits"
          :economy="star.upgradeCosts.economy"
          :industry="star.upgradeCosts.industry"
          :science="star.upgradeCosts.science"/>
      </div>

      <div class="row bg-secondary mt-2 mb-2" v-if="star.ownedByPlayerId && star.manufacturing != null">
        <div class="col text-center pt-3">
          <p>This star builds <b>{{star.manufacturing}}</b> ships every tick.</p>
        </div>
      </div>

      <!-- TODO: Turn these into components -->
      <div v-if="isOwnedByUserPlayer && !userPlayer.defeated && star.upgradeCosts != null" class="mb-2">
        <div class="row bg-secondary pt-2 pb-0 mb-1">
          <div class="col-8">
            <p class="mb-2">Build a carrier to transport ships through hyperspace.</p>
          </div>
          <div class="col-4">
            <button :disabled="$isHistoricalMode() || userPlayer.credits < star.upgradeCosts.carriers || star.ships < 1 || isGameFinished" class="btn btn-block btn-primary mb-2" @click="onBuildCarrierRequested">Build for ${{star.upgradeCosts.carriers}}</button>
          </div>
        </div>

        <div class="row bg-secondary pt-2 pb-0 mb-1" v-if="canBuildWarpGates">
          <div class="col-8">
            <p class="mb-2">Build a Warp Gate to accelerate carrier movement.</p>
          </div>
          <div class="col-4">
            <modalButton v-if="!star.warpGate" :disabled="$isHistoricalMode() || userPlayer.credits < star.upgradeCosts.warpGate || isGameFinished" modalName="buildWarpGateModal" classText="btn btn-block btn-primary mb-2">Build for ${{star.upgradeCosts.warpGate}}</modalButton>
            <modalButton v-if="star.warpGate" :disabled="$isHistoricalMode() || isGameFinished" modalName="destroyWarpGateModal" classText="btn btn-block btn-danger mb-2">Destroy Gate</modalButton>
          </div>
        </div>

        <div class="row bg-secondary pt-2 pb-0 mb-1" v-if="isGameInProgress()">
          <div class="col-8">
            <p class="mb-2">Abandon this star for another player to claim.</p>
          </div>
          <div class="col-4">
            <modalButton modalName="abandonStarModal" classText="btn btn-block btn-danger mb-2" :disabled="$isHistoricalMode()">Abandon Star</modalButton>
          </div>
        </div>
      </div>

      <h4 class="pt-2" v-if="canShowSpecialist">Specialist</h4>

      <star-specialist v-if="canShowSpecialist" :starId="star._id" @onViewHireStarSpecialistRequested="onViewHireStarSpecialistRequested"/>
    </div>

    <!-- Modals -->

    <dialogModal v-if="isOwnedByUserPlayer && star.upgradeCosts != null" modalName="buildWarpGateModal" titleText="Build Warp Gate" cancelText="No" confirmText="Yes" @onConfirm="confirmBuildWarpGate">
      <p>Are you sure you want build a Warp Gate at <b>{{star.name}}</b>?</p>
      <p>The upgrade will cost ${{star.upgradeCosts.warpGate}}.</p>
    </dialogModal>

    <dialogModal modalName="destroyWarpGateModal" titleText="Destroy Warp Gate" cancelText="No" confirmText="Yes" @onConfirm="confirmDestroyWarpGate">
      <p>Are you sure you want destroy Warp Gate at <b>{{star.name}}</b>?</p>
    </dialogModal>

    <dialogModal modalName="abandonStarModal" titleText="Abandon Star" cancelText="No" confirmText="Yes" @onConfirm="confirmAbandonStar">
      <p>Are you sure you want to abandon <b>{{star.name}}</b>?</p>
      <p>Its Economy, Industry and Science will remain, but all ships and carriers at this star will be destroyed.</p>
    </dialogModal>
</div>
</template>

<script>
import starService from '../../../services/api/star'
import AudioService from '../../../game/audio'
import GameHelper from '../../../services/gameHelper'
import MenuTitle from '../MenuTitle'
import Infrastructure from '../shared/Infrastructure'
import InfrastructureUpgrade from './InfrastructureUpgrade'
import InfrastructureUpgradeCompact from './InfrastructureUpgradeCompact'
import ModalButton from '../../modal/ModalButton'
import DialogModal from '../../modal/DialogModal'
import StarSpecialistVue from './StarSpecialist'
import SpecialistIconVue from '../specialist/SpecialistIcon'
import GameContainer from '../../../game/container'
import gameHelper from '../../../services/gameHelper'
import IgnoreBulkUpgradeVue from './IgnoreBulkUpgrade'

export default {
  components: {
    'menu-title': MenuTitle,
    'infrastructure': Infrastructure,
    'infrastructureUpgrade': InfrastructureUpgrade,
    'infrastructureUpgradeCompact': InfrastructureUpgradeCompact,
    'modalButton': ModalButton,
    'dialogModal': DialogModal,
    'star-specialist': StarSpecialistVue,
    'specialist-icon': SpecialistIconVue,
    'ignore-bulk-upgrade': IgnoreBulkUpgradeVue
  },
  props: {
    starId: String
  },
  data () {
    return {
      audio: null,
      userPlayer: null,
      currentPlayerId: null,
      canBuildWarpGates: false,
      isSpecialistsEnabled: false,
      isStandardUIStyle: false,
      isCompactUIStyle: false
    }
  },
  mounted () {
    this.isStandardUIStyle = this.$store.state.settings.interface.uiStyle === 'standard'
    this.isCompactUIStyle = this.$store.state.settings.interface.uiStyle === 'compact'

    this.userPlayer = GameHelper.getUserPlayer(this.$store.state.game)

    this.canBuildWarpGates = this.$store.state.game.settings.specialGalaxy.warpgateCost !== 'none'
    
    // Can display specialist section if sepcialists are enabled and the star is owned by a player.
    // Otherwise if the star is unowned then display only if the star is within scanning range and it has a specialist on it.
    this.isSpecialistsEnabled = this.$store.state.game.settings.specialGalaxy.specialistCost !== 'none'
  },
  methods: {
    onCloseRequested (e) {
      this.$emit('onCloseRequested', e)
    },
    onViewConversationRequested (e) {
      this.$emit('onViewConversationRequested', e)
    },
    onViewCompareIntelRequested (e) {
      this.$emit('onViewCompareIntelRequested', e)
    },
    onViewHireStarSpecialistRequested (e) {
      this.$emit('onViewHireStarSpecialistRequested', this.starId)
    },
    onShipTransferRequested (e) {
      if (e.orbiting) {
        this.$emit('onShipTransferRequested', e._id)
      }
    },
    getCarriersInOrbit () {
      return GameHelper.getCarriersOrbitingStar(this.$store.state.game, this.star)
    },
    isGameInProgress () {
      return GameHelper.isGameInProgress(this.$store.state.game)
    },
    onOpenPlayerDetailRequested (e) {
      this.$emit('onOpenPlayerDetailRequested', this.star.ownedByPlayerId)
    },
    onOpenCarrierDetailRequested (carrier) {
      this.$emit('onOpenCarrierDetailRequested', carrier._id)
    },
    onEditWaypointsRequested (carrierId) {
      this.$emit('onEditWaypointsRequested', carrierId)
    },
    onBuildCarrierRequested () {
      this.$emit('onBuildCarrierRequested', this.star._id)
    },
    viewOnMap (e) {
      GameContainer.map.panToStar(this.star)
    },
    async confirmAbandonStar (e) {
      try {
        let response = await starService.abandonStar(this.$store.state.game._id, this.star._id)

        if (response.status === 200) {
          this.$toasted.show(`${this.star.name} has been abandoned.`)

          this.$store.commit('gameStarAbandoned', {
            starId: this.star._id
          })

          AudioService.leave()
        }
      } catch (err) {
        console.error(err)
      }
    },
    async confirmBuildWarpGate (e) {
      try {
        let response = await starService.buildWarpGate(this.$store.state.game._id, this.star._id)

        if (response.status === 200) {
          this.$toasted.show(`Warp Gate built at ${this.star.name}.`)

          this.$store.commit('gameStarWarpGateBuilt', response.data)
          
          AudioService.join()
        }
      } catch (err) {
        console.error(err)
      }
    },
    async confirmDestroyWarpGate (e) {
      try {
        let response = await starService.destroyWarpGate(this.$store.state.game._id, this.star._id)

        if (response.status === 200) {
          this.$toasted.show(`Warp Gate destroyed at ${this.star.name}.`)

          this.$store.commit('gameStarWarpGateDestroyed', {
            starId: this.star._id
          })
          
          AudioService.leave()
        }
      } catch (err) {
        console.error(err)
      }
    },
    async transferAllToStar() {
      try {
        let response = await starService.transferAllToStar(this.$store.state.game._id, this.star._id)
        
        if (response.status === 200) {
          let carriers = response.data.carriersAtStar

          carriers.forEach(responseCarrier => {
            let mapObjectCarrier = gameHelper.getCarrierById(this.$store.state.game, responseCarrier._id) 
            mapObjectCarrier.ships = responseCarrier.ships
          })

          this.$toasted.show(`All ships transfered to ${this.star.name}.`)
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
  computed: {
    star: function () {
      return GameHelper.getStarById(this.$store.state.game, this.starId)
    },
    starOwningPlayer: function () {
      return GameHelper.getStarOwningPlayer(this.$store.state.game, this.star)
    },
    canShowSpecialist: function () {
      return this.isSpecialistsEnabled && (this.star.specialistId || this.isOwnedByUserPlayer) && !this.isDeadStar
    },
    canHireSpecialist: function () {
      return this.canShowSpecialist 
        && !GameHelper.isGameFinished(this.$store.state.game) 
        && !this.isDeadStar
        && (!this.star.specialistId || !this.star.specialist.oneShot)
    },
    isOwnedByUserPlayer: function() {
      let owner = GameHelper.getStarOwningPlayer(this.$store.state.game, this.star)

      return owner && this.userPlayer && owner._id === this.userPlayer._id
    },
    isGameFinished: function () {
      return GameHelper.isGameFinished(this.$store.state.game)
    },
    isDeadStar: function () {
      return GameHelper.isDeadStar(this.star)
    }
  }
}
</script>

<style scoped>
.no-warp-gate {
  opacity: 0.1;
}
</style>
