<template>
<div class="menu-page">
  <div class="container">
      <menu-title title="Inbox" @onCloseRequested="onCloseRequested"/>
  </div>

  <conversation-list class="pt-2"
    @onViewConversationRequested="onViewConversationRequested"
    @onCreateNewConversationRequested="onCreateNewConversationRequested"/>
</div>
</template>

<script>
import MenuTitle from '../MenuTitle'
import ConversationListVue from './conversations/ConversationList'
import ConversationApiService from '../../../services/api/conversation'

export default {
  components: {
    'menu-title': MenuTitle,
    'conversation-list': ConversationListVue
  },
  data () {
    return {
      unreadMessages: 0
    }
  },
  created () {
    // TODO: This is duplicated on the menu header, is it possible to share this logic
    // to save API calls?
    this.sockets.subscribe('gameMessageSent', this.checkForUnreadMessages.bind(this))
    this.sockets.subscribe('gameConversationRead', this.checkForUnreadMessages.bind(this))
  },
  destroyed () {
    this.sockets.unsubscribe('gameMessageSent')
    this.sockets.unsubscribe('gameConversationRead')
  },
  async mounted () {
    await this.checkForUnreadMessages()
  },
  methods: {
    onCloseRequested (e) {
      this.$emit('onCloseRequested', e)
    },
    onViewConversationRequested (e) {
      this.$emit('onViewConversationRequested', e)
    },
    onViewConversationRequested (e) {
      this.$emit('onViewConversationRequested', e)
    },
    onOpenPlayerDetailRequested (e) {
      this.$emit('onOpenPlayerDetailRequested', e)
    },
    onCreateNewConversationRequested (e) {
      this.$emit('onCreateNewConversationRequested', e)
    },
    async checkForUnreadMessages () {
      try {
        let response = await ConversationApiService.getUnreadCount(this.$store.state.game._id)

        if (response.status === 200) {
          this.unreadMessages = response.data.unread
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>
</style>
