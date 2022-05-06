<template>

  <div class="container-fluid ">
    <div class="row d-flex justify-content-center">

      <div class="col-md-offset-3 col-md-4">
        <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
          Неверный Логин/Пароль
        </b-alert>
        <form class="form-horizontal" @submit.prevent="LoginOk">
          <span class="heading">АВТОРИЗАЦИЯ</span>
          <div class="form-group">
            <input type="text" class="form-control" id="inputEmail" placeholder="Login" v-model="Login">
            <i class="fa fa-user"></i>
          </div>
          <div class="form-group help">
            <input type="password" class="form-control" id="inputPassword" placeholder="Password" v-model="Pwd">
            <i class="fa fa-lock"></i>
            <a href="#" class="fa fa-question-circle"></a>
          </div>
          <div class="form-group">
            <div class="main-checkbox">
              <input type="checkbox" value="none" id="checkbox1" name="check"/>
              <label for="checkbox1"></label>
            </div>
            <span class="text">Запомнить</span>
            <button type="submit"  class="btn btn-default">ВХОД</button>
          </div>
        </form>
      </div>

    </div><!-- /.row -->
  </div><!-- /.container -->
</template>

<script>


export default {
  name: 'Login',
  data: () => {
    return ({
      Login: '',
      Pwd: '',
      showDismissibleAlert: false
    })
  },
  methods: {
    LoginOk: function () {
      console.log(this.Login)

      this.$http.get('login/' + this.Login + '/' + this.Pwd).then(response => {
        console.log(response.data.data)

        if ((response.data.success) && (response.data.error_code === 0)) {
          let token = response.data.data.token
          let name = response.data.data.fio
          let roleid = response.data.data.role_id
          this.$store.state.userName = name

          this.$store.state.token = token
          localStorage.setItem('token', token)
          localStorage.setItem('name', name)
          this.$store.state.role_id = roleid
          localStorage.setItem('role_id', roleid)
          this.$store.commit('set_user_info', response.data.data)
          //

          this.$router.push('/')
        } else {
          this.showDismissibleAlert = true
        }
      }).catch(function (data, status, request) {
        console.log('произошла ошибка' + data)
      })
    }
  },
  mounted: function () {
    let token = this.$store.state.token

    this.$http.get('login/' + token).then(response => {
      console.log(response.data)

      if ((response.data.success) && (response.data.error_code === 0)) {
        this.$router.push('/')
      } else {
      }
    }).catch(function (data, status, request) {
      console.log('произошла ошибка' + data)
    })
  }
}
</script>

<style scoped>
  /* Demo Background */
  body{background:url(/images/bg/bg-6.png)}

  /* Form Style */
  .form-horizontal{
    background: #fff;
    padding-bottom: 40px;
    border-radius: 15px;
    text-align: center;
  }
  .form-horizontal .heading{
    display: block;
    font-size: 35px;
    font-weight: 700;
    padding: 35px 0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 30px;
  }
  .form-horizontal .form-group{
    padding: 0 40px;
    margin: 0 0 25px 0;
    position: relative;
  }
  .form-horizontal .form-control{
    background: #f0f0f0;
    border: none;
    border-radius: 20px;
    box-shadow: none;
    padding: 0 20px 0 45px;
    height: 40px;
    transition: all 0.3s ease 0s;
  }
  .form-horizontal .form-control:focus{
    background: #e0e0e0;
    box-shadow: none;
    outline: 0 none;
  }
  .form-horizontal .form-group i{
    position: absolute;
    top: 12px;
    left: 60px;
    font-size: 17px;
    color: #c8c8c8;
    transition : all 0.5s ease 0s;
  }
  .form-horizontal .form-control:focus + i{
    color: #00b4ef;
  }
  .form-horizontal .fa-question-circle{
    display: inline-block;
    position: absolute;
    top: 12px;
    right: 60px;
    font-size: 20px;
    color: #808080;
    transition: all 0.5s ease 0s;
  }
  .form-horizontal .fa-question-circle:hover{
    color: #000;
  }
  .form-horizontal .main-checkbox{
    float: left;
    width: 20px;
    height: 20px;
    background: #11a3fc;
    border-radius: 50%;
    position: relative;
    margin: 5px 0 0 5px;
    border: 1px solid #11a3fc;
  }
  .form-horizontal .main-checkbox label{
    width: 20px;
    height: 20px;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
  }
  .form-horizontal .main-checkbox label:after{
    content: "";
    width: 10px;
    height: 5px;
    position: absolute;
    top: 5px;
    left: 4px;
    border: 3px solid #fff;
    border-top: none;
    border-right: none;
    background: transparent;
    opacity: 0;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .form-horizontal .main-checkbox input[type=checkbox]{
    visibility: hidden;
  }
  .form-horizontal .main-checkbox input[type=checkbox]:checked + label:after{
    opacity: 1;
  }
  .form-horizontal .text{
    float: left;
    margin-left: 7px;
    line-height: 20px;
    padding-top: 5px;
    text-transform: capitalize;
  }
  .form-horizontal .btn{
    float: right;
    font-size: 14px;
    color: #fff;
    background: #00b4ef;
    border-radius: 30px;
    padding: 10px 25px;
    border: none;
    text-transform: capitalize;
    transition: all 0.5s ease 0s;
  }
  @media only screen and (max-width: 479px){
    .form-horizontal .form-group{
      padding: 0 25px;
    }
    .form-horizontal .form-group i{
      left: 45px;
    }
    .form-horizontal .btn{
      padding: 10px 20px;
    }
  }

  .top-name {
    margin-left: auto;
    margin-right: auto;
  }

</style>
