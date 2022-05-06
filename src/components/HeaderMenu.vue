<template>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand href="#">Панель Телемаркетологов</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav pills>

             <router-link class="nav-link" to="/telemarketolog" exact active-class="active" > <b-icon icon="cart-plus" aria-hidden="true" class="mr-1"></b-icon>Телемаркетолог</router-link>
              <router-link class="nav-link" to="/ob" exact active-class="active" > <b-icon icon="alarm" aria-hidden="true" class="mr-1"></b-icon>Возврат Оборудования</router-link>
              <router-link class="nav-link" to="/" exact active-class="active" > <b-icon icon="bar-chart-line" aria-hidden="true" class="mr-1"></b-icon>Графики</router-link>
            </b-nav>
          </b-navbar-nav>



          <b-navbar-nav>

            <b-nav-item-dropdown left>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <b-icon icon="cart-plus" aria-hidden="true" class="mr-1"></b-icon><em>Меню</em>
              </template>
              <b-dropdown-item href="#"> <router-link to="/debtors" >Должники с номерами телефонов</router-link></b-dropdown-item>
              <b-dropdown-item href="#" >Абоненты на подключение</b-dropdown-item>
              <b-dropdown-item href="#"> <router-link to="/users" >Пользователи</router-link></b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">

            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>Пользователь</em>
              </template>
              <b-dropdown-item href="#">Профиль</b-dropdown-item>
              <b-dropdown-item href="#" @click="Logout">Завершить сеанс</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>

    </div>
</template>

<script>
export default {
  name: 'HeaderMenu',
  methods: {
    Logout () {
      if (this.$store.dispatch('set_logout')) { setTimeout(() => location.reload(), 1000) }
    }
  }
}
</script>

<style scoped>

</style>
