<template>
<div id="app">
  <b-toast></b-toast>
  <b-alert  :show="show_error" variant="danger">{{error_text}}</b-alert>
  <b-overlay :show="this.$store.state.showLoading" rounded="lg">

    <Header v-if="$route.path!=='/login'"></Header>

        <router-view class="view"></router-view>

    <template #overlay>
      <div class="text-center">
        <b-icon icon="stopwatch" font-scale="3" animation="throb" variant="info"></b-icon>
        <p id="cancel-label">Идет загрузка ожидаите...</p>
      </div>
    </template>

  </b-overlay>

  </div>
</template>

<script>

  import Header from './components/HeaderMenu'

export default
{
  name: 'App',
  components: {Header},
  data: function () {
    return {
      show: true,
      show_error: false,
      error_text: '',
      ws: null,
      longPoolingTimer: null
    }
  },
  mounted: function () {
    let token = this.$store.state.token
    this.show = false
    this.$store.commit('set_loadingChange', false)
    this.$http.get('login/' + token).then(response => {
      console.log(response.data)

      if ((response.data.success) && (response.data.error_code === 0)) {
        this.$store.commit('set_user_info', response.data.data)
      } else {
        this.$router.push('/login')
      }
      this.show = false
      this.$store.commit('set_loadingChange', false)
    }).catch(function (data, status, request) {
      console.log('произошла ошибка' + data)
      this.show_error = true
      this.error_text = 'Произошла Ошибка, Обновите страницу, Возможно проблема с соединением, страница будет перезагружена через 8 сек !'
      setInterval(() => location.reload(), 8000)
    })
  },
  methods:
    {
      test () {}
    }
}

</script>
