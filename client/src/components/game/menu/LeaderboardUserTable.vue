<template>
<div class="tab-pane fade show active" id="players">
  <loading-spinner :loading="isLoading"/>
  <h4 class="mb-1">Top {{limit}} Players</h4>
  <small class="text-warning">Total Players: {{totalPlayers}}</small>
  <div class="table-responsive">
    <sortable-leaderboard v-if="leaderboard && !isLoading" class="mt-2" :leaderboard="leaderboard" :sortingKey="sortingKey" @sortingRequested="sortLeaderboard">
      <template v-slot:header="actions">
        <th style="width: 5%">#</th>
        <th style="width: 30%">Player</th>
        <th style="width: 30%" class="d-none d-md-table-cell">Guild</th>
        <th style="width: 10%" class="text-right sortable-header col" :class="actions.getColumnClass('rank')" title="Rank" @click="actions.sort('rank')">
          <i class="fas fa-star text-info"></i>
          <i v-if="actions.isActive('rank')" class="fas fa-chevron-down ml-2"></i>
        </th>
        <th style="width: 10%" class="text-right sortable-header col" :class="actions.getColumnClass('victories')" title="Victories" @click="actions.sort('victories')">
          <i class="fas fa-trophy text-warning"></i>
          <i v-if="actions.isActive('victories')" class="fas fa-chevron-down ml-2"></i>
        </th>
        <th style="width: 10%" class="text-right sortable-header col" :class="actions.getColumnClass('renown')" title="Renown" @click="actions.sort('renown')">
          <i class="fas fa-heart text-danger"></i>
          <i v-if="actions.isActive('renown')" class="fas fa-chevron-down ml-2"></i>
        </th>
      </template>
      <template v-slot:row="{ value: player, getColumnClass }">
        <tr>
          <td>{{player.position}}</td>
          <td>
              <router-link :to="{ name: 'account-achievements', params: { userId: player._id }}">
                  <span>{{player.username}}</span>
              </router-link>
              <i class="fas fa-hands-helping ml-1" title="This player is a contributor" v-if="player.roles && player.roles.contributor"></i>
              <i class="fas fa-code ml-1" title="This player is an active developer" v-if="player.roles && player.roles.developer"></i>
              <i class="fas fa-user-friends ml-1" title="This player is an active community manager" v-if="player.roles && player.roles.communityManager"></i>
              <i class="fas fa-dice ml-1" title="This player is an active game master" v-if="player.roles && player.roles.gameMaster"></i>
          </td>
          <td class="d-none d-md-table-cell">
            <router-link v-if="player.guild" :to="{ name: 'guild-details', params: { guildId: player.guild._id }}">
              <span>{{player.guild.name}} [{{player.guild.tag}}]</span>
            </router-link>
          </td>
          <td align="right" :class="getColumnClass('rank')">{{player.achievements.rank}}</td>
          <td align="right" :class="getColumnClass('victories')">{{player.achievements.victories}}</td>
          <td align="right" :class="getColumnClass('renown')">{{player.achievements.renown}}</td>
        </tr>
      </template>
    </sortable-leaderboard>
  </div>
</div>
</template>

<script>
import SortableLeaderboard from './SortableLeaderboard';
import UserApiService from '../../../services/api/user';
import LoadingSpinner from '../../LoadingSpinner';

export default {
  components: {
    'sortable-leaderboard': SortableLeaderboard,
    'loading-spinner': LoadingSpinner
  },
  props: {
    limit: Number
  },
  data () {
    return {
      isLoading: false,
      sortingKey: 'rank',
      leaderboards: {},
      totalPlayers: 0
    }
  },
  async mounted () {
    await this.loadLeaderboard(this.sortingKey);
  },
  methods: {
    async sortLeaderboard (key) {
      this.sortingKey = key;
      await this.loadLeaderboard(key);
    },
    async loadLeaderboard (key) {
      if (this.leaderboards[key]) {
        return;
      }
      this.isLoading = true;
      try {
        const response = await UserApiService.getLeaderboard(this.limit, key, 0);
        if (response.status === 200) {
          this.$set(this.leaderboards, key, response.data.leaderboard);
          this.totalPlayers = response.data.totalPlayers;
        }
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    }
  },
  computed: {
    leaderboard () {
      return this.leaderboards[this.sortingKey];
    }
  }
}
</script>

<style scoped>
</style>
