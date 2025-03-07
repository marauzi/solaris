<template>
  <view-container>
    <view-title title="Join Game" />

    <ul class="nav nav-tabs">
      <li class="nav-item">
          <a class="nav-link active" data-toggle="tab" href="#newGames">New Games</a>
      </li>
      <li class="nav-item">
          <a class="nav-link" data-toggle="tab" href="#inProgressGames">In Progress</a>
      </li>
    </ul>

    <div class="tab-content pt-2">
        <div class="tab-pane fade show active" id="newGames">
          <h4>Standard Games</h4>

          <p>These are official games and have standard settings.</p>

          <loading-spinner :loading="isLoading"/>

          <p v-if="!isLoading && !serverGames.length" class="text-danger mb-2">
            There are no official games available.
          </p>
          
          <div class="row no-gutters" v-if="!isLoading">
            <!-- Featured -->
            <div class="col-sm-12 col-md-12 col-lg-12" v-if="games.featured">
              <div class="card featured-card bg-dark text-white" @click="routeToPath('/game/detail', { id: games.featured._id })">
                <img class="card-img" :src="require('../assets/screenshots/featured.png')" alt="Featured Game">
                <div class="card-img-overlay">
                  <h4 class="card-title featured-card-title">
                    <i class="fas fa-star"></i>
                    <span class="ml-0">
                      {{games.featured.settings.general.name}}
                    </span>
                  </h4>
                  <h6 class="card-title card-subtitle">
                    {{getGameTypeFriendlyText(games.featured)}}
                    ({{games.featured.state.players}}/{{games.featured.settings.general.playerLimit}})
                  </h6>
                </div>
              </div>
            </div>

            <!-- New Player -->
            <div class="col-sm-12 col-md-4 col-lg-4 pr-1" v-if="games.newPlayerRT">
              <div class="card bg-dark text-white new-player-game" @click="routeToPath('/game/detail', { id: games.newPlayerRT._id })">
                <img class="card-img" :src="require('../assets/screenshots/new_player_rt.png')" alt="View New Player Game">
                <div class="card-img-overlay">
                  <h5 class="card-title new-player-card-title">
                    <i class="fas fa-user-graduate"></i>
                    <span class="ml-2">{{getGameTypeFriendlyText(games.newPlayerRT)}}</span>
                  </h5>
                  <h6 class="card-title card-subtitle new-player-card-subtitle">
                    {{games.newPlayerRT.settings.general.name}}
                    ({{games.newPlayerRT.state.players}}/{{games.newPlayerRT.settings.general.playerLimit}})
                  </h6>
                </div>
              </div>
            </div>

            <!-- Standard -->
            <div class="col-sm-12 col-md-8 col-lg-8 pl-1" v-if="games.standardRT">
              <div class="card bg-dark text-white" @click="routeToPath('/game/detail', { id: games.standardRT._id })">
                <img class="card-img" :src="require('../assets/screenshots/standard_rt.png')" alt="Standard Game">
                <div class="card-img-overlay">
                  <h5 class="card-title">
                    <i class="fas fa-user-astronaut"></i>
                    <span class="ml-2">{{games.standardRT.settings.general.name}}</span>
                  </h5>
                  <h6 class="card-title card-subtitle">
                    {{getGameTypeFriendlyText(games.standardRT)}}
                    ({{games.standardRT.state.players}}/{{games.standardRT.settings.general.playerLimit}})
                  </h6>
                </div>
              </div>
            </div>

            <!-- Standard TB -->
            <div class="col-sm-12 col-md-3 col-lg-3 pr-1" v-if="games.standardTB">
              <div class="card bg-dark text-white" @click="routeToPath('/game/detail', { id: games.standardTB._id })">
                <img class="card-img" :src="require('../assets/screenshots/standard_tb.png')" alt="Standard Turn Based Game">
                <div class="card-img-overlay">
                  <h5 class="card-title">
                    <i class="fas fa-user-astronaut"></i>
                    <span class="ml-2">{{games.standardTB.settings.general.name}}</span>
                  </h5>
                  <h6 class="card-title card-subtitle">
                    {{getGameTypeFriendlyText(games.standardTB)}}
                    ({{games.standardTB.state.players}}/{{games.standardTB.settings.general.playerLimit}})
                  </h6>
                </div>
              </div>
            </div>

            <!-- Dark -->
            <div class="col-sm-12 col-md-3 col-lg-3 pr-1 pl-1" v-if="games.standardDarkRT">
              <div class="card bg-dark text-white" @click="routeToPath('/game/detail', { id: games.standardDarkRT._id })">
                <img class="card-img" :src="require('../assets/screenshots/standard_dark_rt.png')" alt="Dark Mode Game">
                <div class="card-img-overlay">
                  <h5 class="card-title">
                    <i class="fas fa-moon"></i>
                    <span class="ml-2">{{games.standardDarkRT.settings.general.name}}</span>
                  </h5>
                  <h6 class="card-title card-subtitle">
                    {{getGameTypeFriendlyText(games.standardDarkRT)}}
                    ({{games.standardDarkRT.state.players}}/{{games.standardDarkRT.settings.general.playerLimit}})
                  </h6>
                </div>
              </div>
            </div>

            <!-- 1v1 -->
            <div class="col-sm-12 col-md-3 col-lg-3 pr-1 pl-1" v-if="games.oneVsOneRT">
              <div class="card bg-dark text-white" @click="routeToPath('/game/detail', { id: games.oneVsOneRT._id })">
                <img class="card-img" :src="require('../assets/screenshots/1v1_rt.png')" alt="1 vs. 1 Game">
                <div class="card-img-overlay">
                  <h5 class="card-title">
                    <i class="fas fa-user-friends"></i>
                    <span class="ml-2">{{games.oneVsOneRT.settings.general.name}}</span>
                  </h5>
                  <h6 class="card-title card-subtitle">
                    {{getGameTypeFriendlyText(games.oneVsOneRT)}}
                    ({{games.oneVsOneRT.state.players}}/{{games.oneVsOneRT.settings.general.playerLimit}})
                  </h6>
                </div>
              </div>
            </div>

            <!-- 1v1 TB -->
            <div class="col-sm-12 col-md-3 col-lg-3 pr-1 pl-1" v-if="games.oneVsOneTB">
              <div class="card bg-dark text-white" @click="routeToPath('/game/detail', { id: games.oneVsOneTB._id })">
                <img class="card-img" :src="require('../assets/screenshots/1v1_tb.png')" alt="1 vs. 1 Turn Based Game">
                <div class="card-img-overlay">
                  <h5 class="card-title">
                    <i class="fas fa-user-friends"></i>
                    <span class="ml-2">{{games.oneVsOneTB.settings.general.name}}</span>
                  </h5>
                  <h6 class="card-title card-subtitle">
                    {{getGameTypeFriendlyText(games.oneVsOneTB)}}
                    ({{games.oneVsOneTB.state.players}}/{{games.oneVsOneTB.settings.general.playerLimit}})
                  </h6>
                </div>
              </div>
            </div>

            <!-- 32 Player -->
            <div class="col-sm-12 col-md-12 col-lg-12" v-if="games.thirtyTwoPlayerRT">
              <div class="card bg-dark text-white" @click="routeToPath('/game/detail', { id: games.thirtyTwoPlayerRT._id })">
                <img class="card-img" :src="require('../assets/screenshots/32_player.png')" alt="32 Player Game">
                <div class="card-img-overlay">
                  <h5 class="card-title">
                    <i class="fas fa-users"></i>
                    <span class="ml-2">{{games.thirtyTwoPlayerRT.settings.general.name}}</span>
                  </h5>
                  <h6 class="card-title card-subtitle">
                    {{getGameTypeFriendlyText(games.thirtyTwoPlayerRT)}}
                    ({{games.thirtyTwoPlayerRT.state.players}}/{{games.thirtyTwoPlayerRT.settings.general.playerLimit}})
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <div class="text-right" v-if="!isLoading">
            <router-link to="/game/create" tag="button" class="btn btn-info mr-1"><i class="fas fa-gamepad"></i> Create Game</router-link>
            <router-link to="/game/active-games" tag="button" class="btn btn-success ml-1"><i class="fas fa-dice"></i> View My Games</router-link>
          </div>

          <hr/>

          <h4>Special Games</h4>

          <p>These are official games with interesting twists.</p>

          <div class="row">
            <!-- Special Ultra Dark -->
            <div class="col-sm-12 col-md-8 col-lg-8 pr-1" v-if="games.specialUltraDark">
              <div class="card bg-dark text-white" @click="routeToPath('/game/detail', { id: games.specialUltraDark._id })">
                <img class="card-img" :src="require('../assets/screenshots/special_ultraDark.png')" alt="Special - Ultra Dark">
                <div class="card-img-overlay">
                  <h5 class="card-title special-card-title">
                    <i class="fas fa-moon"></i>
                    <span class="ml-2">{{games.specialUltraDark.settings.general.name}}</span>
                  </h5>
                  <h6 class="card-title card-subtitle">
                    {{getGameTypeFriendlyText(games.specialUltraDark)}}
                    ({{games.specialUltraDark.state.players}}/{{games.specialUltraDark.settings.general.playerLimit}})
                  </h6>
                </div>
              </div>
            </div>

            <!-- Battle Royale -->
            <div class="col-sm-12 col-md-4 col-lg-4 pl-1" v-if="games.specialBattleRoyale">
              <div class="card bg-dark text-white" @click="routeToPath('/game/detail', { id: games.specialBattleRoyale._id })">
                <img class="card-img" :src="require('../assets/screenshots/special_battleRoyale.png')" alt="Special - Battle Royale">
                <div class="card-img-overlay">
                  <h5 class="card-title special-card-title">
                    <i class="fas fa-drumstick-bite"></i>
                    <span class="ml-2">{{games.specialBattleRoyale.settings.general.name}}</span>
                  </h5>
                  <h6 class="card-title card-subtitle">
                    {{getGameTypeFriendlyText(games.specialBattleRoyale)}}
                    ({{games.specialBattleRoyale.state.players}}/{{games.specialBattleRoyale.settings.general.playerLimit}})
                  </h6>
                </div>
              </div>
            </div>

            <!-- Orbital -->
            <div class="col-sm-12 col-md-4 col-lg-4 pr-1" v-if="games.specialOrbital">
              <div class="card bg-dark text-white" @click="routeToPath('/game/detail', { id: games.specialOrbital._id })">
                <img class="card-img" :src="require('../assets/screenshots/special_orbital.png')" alt="Special - Orbital Game">
                <div class="card-img-overlay">
                  <h5 class="card-title special-card-title">
                    <i class="fas fa-satellite"></i>
                    <span class="ml-2">{{games.specialOrbital.settings.general.name}}</span>
                  </h5>
                  <h6 class="card-title card-subtitle">
                    {{getGameTypeFriendlyText(games.specialOrbital)}}
                    ({{games.specialOrbital.state.players}}/{{games.specialOrbital.settings.general.playerLimit}})
                  </h6>
                </div>
              </div>
            </div>

            <!-- Home Stars -->
            <div class="col-sm-12 col-md-4 col-lg-4 pr-1 pl-1" v-if="games.specialHomeStar">
              <div class="card bg-dark text-white" @click="routeToPath('/game/detail', { id: games.specialHomeStar._id })">
                <img class="card-img" :src="require('../assets/screenshots/special_homeStar.png')" alt="Special - Capital Stars Game">
                <div class="card-img-overlay">
                  <h5 class="card-title special-card-title">
                    <i class="fas fa-home"></i>
                    <span class="ml-2">{{games.specialHomeStar.settings.general.name}}</span>
                  </h5>
                  <h6 class="card-title card-subtitle">
                    {{getGameTypeFriendlyText(games.specialHomeStar)}}
                    ({{games.specialHomeStar.state.players}}/{{games.specialHomeStar.settings.general.playerLimit}})
                  </h6>
                </div>
              </div>
            </div>

            <!-- Anonymous -->
            <div class="col-sm-12 col-md-4 col-lg-4 pl-1" v-if="games.specialAnonymous">
              <div class="card bg-dark text-white" @click="routeToPath('/game/detail', { id: games.specialAnonymous._id })">
                <img class="card-img" :src="require('../assets/screenshots/special_anonymous.png')" alt="Special - Capital Stars Game">
                <div class="card-img-overlay">
                  <h5 class="card-title special-card-title">
                    <i class="fas fa-user-secret"></i>
                    <span class="ml-2">{{games.specialAnonymous.settings.general.name}}</span>
                  </h5>
                  <h6 class="card-title card-subtitle">
                    {{getGameTypeFriendlyText(games.specialAnonymous)}}
                    ({{games.specialAnonymous.state.players}}/{{games.specialAnonymous.settings.general.playerLimit}})
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <hr/>

          <h4 class="mb-0">User Created Games</h4>

          <p class="mb-2"><small class="text-warning" v-if="userGames.length">Total Games: {{userGames.length}}</small></p>

          <loading-spinner :loading="isLoading"/>

          <div v-if="!isLoading && !userGames.length" class="text-warning mb-2">
            There are no user created games available.
          </div>

          <table v-if="!isLoading && userGames.length" class="table table-striped table-hover">
              <thead>
                  <tr class="bg-primary">
                      <td>Name</td>
                      <td class="d-none d-md-block text-center">Players</td>
                      <td></td>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="game in userGames" v-bind:key="game._id">
                      <td>{{game.settings.general.name}}</td>
                      <td class="d-none d-md-block text-center">{{game.state.players}}/{{game.settings.general.playerLimit}}</td>
                      <td>
                          <router-link :to="{ path: '/game/detail', query: { id: game._id } }" tag="button" class="btn btn-success float-right">
                            <span class="d-none d-md-block">View</span>
                            <span class="d-xs-block d-sm-block d-md-none">
                              {{game.state.players}}/{{game.settings.general.playerLimit}}
                            </span>
                          </router-link>
                      </td>
                  </tr>
              </tbody>
          </table>

          <div class="text-right" v-if="!isLoading">
            <router-link to="/game/create" tag="button" class="btn btn-info mr-1"><i class="fas fa-gamepad"></i> Create Game</router-link>
            <router-link to="/game/active-games" tag="button" class="btn btn-success ml-1"><i class="fas fa-dice"></i> View My Games</router-link>
          </div>
        </div>
        
        <div class="tab-pane fade" id="inProgressGames">
          <h4>In Progress Games</h4>

          <p class="mb-1">These games are in progress, you can join games with open slots. <b>Fill slots to earn additional rank!</b></p>

          <p class="mb-2"><small class="text-warning" v-if="inProgressGames.length">Total Games: {{inProgressGames.length}}</small></p>

          <loading-spinner :loading="isLoading"/>

          <p v-if="!isLoading && !inProgressGames.length" class="text-danger mb-2">
            There are no games currently in progress.
          </p>

          <table v-if="!isLoading && inProgressGames.length" class="table table-striped table-hover">
              <thead>
                  <tr class="bg-primary">
                      <td>Name</td>
                      <td class="d-none d-md-block text-center">Players</td>
                      <td></td>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="game in inProgressGames" v-bind:key="game._id">
                      <td>{{game.settings.general.name}}</td>
                      <td class="d-none d-md-block text-center">{{game.state.players}}/{{game.settings.general.playerLimit}}</td>
                      <td>
                          <router-link :to="{ path: '/game/detail', query: { id: game._id } }" tag="button" class="btn btn-success float-right">
                            <span class="d-none d-md-block">View</span>
                            <span class="d-xs-block d-sm-block d-md-none">
                              {{game.state.players}}/{{game.settings.general.playerLimit}}
                            </span>
                          </router-link>
                      </td>
                  </tr>
              </tbody>
          </table>

          <div class="text-right" v-if="!isLoading">
            <router-link to="/game/create" tag="button" class="btn btn-info mr-1"><i class="fas fa-gamepad"></i> Create Game</router-link>
            <router-link to="/game/active-games" tag="button" class="btn btn-success ml-1"><i class="fas fa-dice"></i> View My Games</router-link>
          </div>
        </div>
    </div>
  </view-container>
</template>

<script>
import router from '../router'
import LoadingSpinnerVue from '../components/LoadingSpinner'
import ViewTitle from '../components/ViewTitle'
import ViewContainer from '../components/ViewContainer'
import gameService from '../services/api/game'

export default {
  components: {
    'loading-spinner': LoadingSpinnerVue,
    'view-container': ViewContainer,
    'view-title': ViewTitle
  },
  data () {
    return {
      serverGames: [],
      userGames: [],
      inProgressGames: [],
      isLoading: true,
      games: {
        featured: null,
        newPlayerRT: null,
        standardRT: null,
        standardTB: null,
        standardDarkRT: null,
        oneVsOneRT: null,
        oneVsOneTB: null,
        thirtyTwoPlayerRT: null,
        specialUltraDark: null,
        specialBattleRoyale: null,
        specialOrbital: null,
        specialHomeStar: null,
        specialAnonymous: null
      }
    }
  },
  async mounted () {
    this.isLoading = true

    try {
      let requests = [
        gameService.listOfficialGames(),
        gameService.listUserGames(),
        gameService.listInProgressGames()
      ]

      let responses = await Promise.all(requests)

      this.serverGames = responses[0].data
      this.userGames = responses[1].data
      this.inProgressGames = responses[2].data

      this.games.featured = this.getFeaturedGame()
      this.games.newPlayerRT = this.getOfficialGame('new_player_rt')
      this.games.standardRT = this.getOfficialGame('standard_rt')
      this.games.standardTB = this.getOfficialGame('standard_tb')
      this.games.standardDarkRT = this.getOfficialGame('standard_dark_rt')
      this.games.oneVsOneRT = this.getOfficialGame('1v1_rt')
      this.games.oneVsOneTB = this.getOfficialGame('1v1_tb')
      this.games.thirtyTwoPlayerRT = this.getOfficialGame('32_player_rt')
      this.games.specialUltraDark = this.getOfficialGame('special_ultraDark')
      this.games.specialBattleRoyale = this.getOfficialGame('special_battleRoyale')
      this.games.specialOrbital = this.getOfficialGame('special_orbital')
      this.games.specialHomeStar = this.getOfficialGame('special_homeStar')
      this.games.specialAnonymous = this.getOfficialGame('special_anonymous')
    } catch (err) {
      console.error(err)
    }

    this.isLoading = false
  },
  methods: {
    routeToPath (path, query) {
      router.push({path, query})
    },
    getOfficialGame (type) {
      return this.serverGames.find(x => x.settings.general.type === type)
    },
    getFeaturedGame () {
      let featuredOfficial = this.serverGames.find(x => x.settings.general.featured)

      if (featuredOfficial) {
        return featuredOfficial
      }

      return this.userGames.find(x => x.settings.general.featured)
    },
    getGameTypeFriendlyText (game) {
      return {     
        'new_player_rt': 'New Player Game',
        'standard_rt': 'Standard',
        'standard_tb': 'Standard - TB',
        'standard_dark_rt': 'Dark Galaxy',
        '1v1_rt': '1 vs. 1',
        '1v1_tb': '1 vs. 1 - TB',
        '32_player_rt': '32 Players',
        'custom': 'Custom Game',
        'special_ultraDark': 'Ultra Dark Galaxy',
        'special_orbital': 'Orbital',
        'special_battleRoyale': 'Battle Royale',
        'special_homeStar': 'Capital Stars',
        'special_anonymous': 'Anonymous',
      }[game.settings.general.type]
    }
  }
}
</script>

<style scoped>
.card {
  max-height: 150px;
  margin-bottom: 1rem;
  cursor: pointer;
}

.featured-card {
  max-height: 250px;
}

.card-img {
  object-fit: cover;
  max-height: 150px;
}

.featured-card .card-img {
  max-height: 250px;
}

.card-img-overlay {
  padding: 0.5rem;
}

.card-title {
  background-color: #375a7f;
  padding: 0.25rem;
  display: inline-block;
  border-radius: 3px;
}

.featured-card-title {
  background-color: #00bc8c;
}

.new-player-card-title {
  background-color: #f39c12;
}

.special-card-title {
  background-color: #d62c1a;
}

.card-subtitle {
  font-size: 12px;
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 8px;
  background-color: #3498DB;
}

.new-player-card-subtitle {
  background-color: #f39c12;
}

.new-player-game {
  border: 3px solid #f39c12;
}
</style>
