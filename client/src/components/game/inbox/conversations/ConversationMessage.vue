<template>
  <div class="container message-container"
    :class="{'left-message': !isFromUserPlayer, 'right-message': isFromUserPlayer,
            'bg-secondary': !message.pinned, 'bg-primary': message.pinned}">
    <div class="row mt-0" :style="{'background-color': getFriendlyColour(fromPlayer.colour.value)}" style="height:6px;"></div>
    <div class="row mt-0" v-if="message">
      <div class="col mt-1 mb-0">
        <span class="pointer" @click="onOpenPlayerDetailRequested(fromPlayer)">
          <player-icon :playerId="fromPlayer._id"/>
          <strong class="ml-2">{{fromPlayer.alias}}</strong>
        </span>
      </div>
      <div class="col-auto thumbtack" v-if="conversation.createdBy">
        <conversation-message-pin :conversationId="conversation._id" :messageId="message._id" :pinned="message.pinned" @onPinned="onPinned" @onUnpinned="onUnpinned" />
      </div>
      <div class="col-12">
        <p class="mt-0 mb-0">
          <i class="fas fa-envelope mr-2" v-if="!userPlayerHasReadMessage"></i>
          <small><em>{{dateText}}</em></small>
        </p>
      </div>
    </div>
    <div class="row mt-0">
        <div class="col">
            <p class="mt-2 mb-2 linebreaks" ref="messageElement" />
        </div>
    </div>
  </div>
</template>

<script>
import GameHelper from '../../../../services/gameHelper'
import GameContainer from '../../../../game/container'
import PlayerIconVue from '../../player/PlayerIcon'
import ConversationMessagePinVue from './ConversationMessagePin'
import mentionHelper from '../../../../services/mentionHelper'
import gameHelper from '../../../../services/gameHelper'

export default {
  components: {
    'player-icon': PlayerIconVue,
    'conversation-message-pin': ConversationMessagePinVue
  },
  props: {
    conversation: Object,
    message: Object
  },
  mounted () {
    let onStarClicked = (id) => {
      this.panToStar(id)

      if (this.$isMobile()) {
        this.$emit('onMinimizeConversationRequested')
      }
    }

    let onPlayerClicked = (id) => this.$emit('onOpenPlayerDetailRequested', id)
    
    mentionHelper.renderMessageWithMentionsAndLinks(this.$refs.messageElement, this.message.message, onStarClicked, onPlayerClicked)
  },
  methods: {
    getUserPlayer () {
      return GameHelper.getUserPlayer(this.$store.state.game)
    },
    getFriendlyColour (colour) {
      return GameHelper.getFriendlyColour(colour)
    },
    onOpenPlayerDetailRequested (player) {
      this.$emit('onOpenPlayerDetailRequested', player._id)
    },
    onPinned () {
      this.message.pinned = true
    },
    onUnpinned () {
      this.message.pinned = false
    },
    panToStar (id) {
      const star = gameHelper.getStarById(this.$store.state.game, id)

      if (star) {
        GameContainer.map.panToStar(star)
      } else {
        this.$toasted.show(`The location of the star is unknown.`, { type: 'error' })
      }
    }
  },
  computed: {
    isFromUserPlayer: function () {
      return this.message.fromPlayerId === this.getUserPlayer()._id
    },
    fromPlayer: function () {
      return GameHelper.getPlayerById(this.$store.state.game, this.message.fromPlayerId)
    },
    userPlayerHasReadMessage: function () {
      return this.message.readBy.find(x => this.getUserPlayer()._id === x) != null
    },
    dateText: function () {
      const date = GameHelper.getDateString(this.message.sentDate)
      let tick = ''
      if (this.message.sentTick || this.message.sentTick === 0) {
        tick = ` (tick ${this.message.sentTick})`
      }
      return date + tick
    }
  }
}
</script>

<style scoped>
.left-message {
  width: 85%;
  margin-left:0;
}

.right-message {
  width: 85%;
  margin-right:0;
}

.pointer {
  cursor: pointer;
}

.linebreaks {
  white-space: break-spaces;
}

.thumbtack {
  display: none;
}

.message-container:hover .thumbtack {
  display: block;
}
</style>
