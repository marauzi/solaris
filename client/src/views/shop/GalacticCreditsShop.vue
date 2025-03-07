<template>
  <view-container>
    <view-title title="Galactic Credit Packs" />

    <p>
      Purchase <span class="text-warning">Galactic Credits</span> to spend in the <router-link :to="{ name: 'avatars'}"><i class="fas fa-shopping-basket"></i> Avatar Store</router-link>!
    </p>

    <p>
      By purchasing packs, you help support the continued development of <strong>Solaris</strong>, any purchase will award you with the <span class="text-info"><i class="fas fa-hands-helping"></i> Contributor</span> badge on your player profile.
    </p>

    <h5 v-if="userInfo">You have <span class="text-warning"><strong>{{userInfo.credits}}</strong> Galactic Credits</span>.</h5>

    <hr/>

    <loading-spinner :loading="isLoading"/>

    <div class="card-deck mb-3 text-center">
      <div class="card mb-4 box-shadow">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">Pathfinder</h4>
        </div>
        <div class="card-body">
          <h2 class="card-title pricing-card-title"><i class="fas fa-coins"></i> 1</h2>
          <ul class="list-unstyled mt-3 mb-4">
            <li>1 Galactic Credit</li>
          </ul>
          <button type="button" class="btn btn-lg btn-block btn-default" @click="buyCreditPack(1)" :disabled="isLoading"><i class="fas fa-money-bill-wave"></i> £1</button>
        </div>
      </div>
      <div class="card mb-4 box-shadow">
        <div class="card-header bg-primary">
          <h4 class="my-0 font-weight-normal">Lieutenant</h4>
        </div>
        <div class="card-body">
          <h2 class="card-title pricing-card-title"><i class="fas fa-coins"></i> 5</h2>
          <ul class="list-unstyled mt-3 mb-4">
            <li>5 Galactic Credits</li>
            <li><small class="text-muted">Recommended</small></li>
          </ul>
          <button type="button" class="btn btn-lg btn-block btn-primary" @click="buyCreditPack(5)" :disabled="isLoading"><i class="fas fa-money-bill-wave"></i> £5</button>
        </div>
      </div>
      <div class="card mb-4 box-shadow">
        <div class="card-header bg-success">
          <h4 class="my-0 font-weight-normal">Admiral</h4>
        </div>
        <div class="card-body">
          <h2 class="card-title pricing-card-title"><i class="fas fa-coins"></i> 10</h2>
          <ul class="list-unstyled mt-3 mb-4">
            <li>10 Galactic Credits</li>
            <li><small class="text-muted">10% off</small></li>
          </ul>
          <button type="button" class="btn btn-lg btn-block btn-success" @click="buyCreditPack(10)" :disabled="isLoading"><i class="fas fa-money-bill-wave"></i> £9</button>
        </div>
      </div>
    </div>

    <div class="card-deck mb-3 text-center">
      <div class="card mb-4 box-shadow">
        <div class="card-header bg-info">
          <h4 class="my-0 font-weight-normal">Colonel</h4>
        </div>
        <div class="card-body">
          <h2 class="card-title pricing-card-title"><i class="fas fa-coins"></i> 25</h2>
          <ul class="list-unstyled mt-3 mb-4">
            <li>25 Galactic Credits</li>
            <li><small class="text-muted">20% off</small></li>
          </ul>
          <button type="button" class="btn btn-lg btn-block btn-info" @click="buyCreditPack(25)" :disabled="isLoading"><i class="fas fa-money-bill-wave"></i> £20</button>
        </div>
      </div>
      <div class="card mb-4 box-shadow">
        <div class="card-header bg-warning">
          <h4 class="my-0 font-weight-normal">General</h4>
        </div>
        <div class="card-body">
          <h2 class="card-title pricing-card-title"><i class="fas fa-coins"></i> 50</h2>
          <ul class="list-unstyled mt-3 mb-4">
            <li>50 Galactic Credits</li>
            <li><small class="text-muted">30% off</small></li>
          </ul>
          <button type="button" class="btn btn-lg btn-block btn-warning" @click="buyCreditPack(50)" :disabled="isLoading"><i class="fas fa-money-bill-wave"></i> £35</button>
        </div>
      </div>
      <div class="card mb-4 box-shadow">
        <div class="card-header bg-danger">
          <h4 class="my-0 font-weight-normal">Destroyer</h4>
        </div>
        <div class="card-body">
          <h2 class="card-title pricing-card-title"><i class="fas fa-coins"></i> 100</h2>
          <ul class="list-unstyled mt-3 mb-4">
            <li>100 Galactic Credits</li>
            <li><small class="text-muted">50% off</small></li>
          </ul>
          <button type="button" class="btn btn-lg btn-block btn-danger" @click="buyCreditPack(100)" :disabled="isLoading"><i class="fas fa-money-bill-wave"></i> £50</button>
        </div>
      </div>
    </div>
  </view-container>
</template>

<script>
import ViewTitle from '../../components/ViewTitle'
import ViewContainer from '../../components/ViewContainer'
import LoadingSpinner from '../../components/LoadingSpinner'
import ShopApiService from '../../services/api/shop'
import UserApiService from '../../services/api/user'

export default {
  components: {
    'view-container': ViewContainer,
    'view-title': ViewTitle,
    'loading-spinner': LoadingSpinner,
  },
  data () {
    return {
      isLoading: false,
      userInfo: null,
    }
  },
  async mounted () {
    this.isLoading = true
    await this.loadGalacticCredits()
    this.isLoading = false
  },
  methods: {
    async loadGalacticCredits () {
      try {
        let response = await UserApiService.getMyUserInfo()

        if (response.status === 200) {
            this.userInfo = response.data
        }
      } catch (err) {
          console.error(err)
      }
    },
    async buyCreditPack (credits) {
      this.isLoading = true

      try {
        let response = await ShopApiService.purchaseGalacticCredits(credits)

        if (response.status === 200) {
          window.location = response.data.approvalUrl
        }
      } catch (err) {
        console.error(err)
      }

      this.isLoading = false
    }
  }
}
</script>

<style scoped>
</style>
