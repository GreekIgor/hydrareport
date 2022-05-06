<template>
  <b-modal id="modal-change-users" title="Изменение/Добавление Пользователя">

    <b-form-group label="Имя Сотрудника">
      <b-form-input v-model="user.username" placeholder="Введите имя сотрудника"></b-form-input>
    </b-form-group>

    <b-form-group label="Логин">
      <b-form-input v-model="user.login" placeholder="Введите логин сотрудника"></b-form-input>
    </b-form-group>

    <b-form-group label="Пароль">
      <b-form-input v-model="user.passwd" placeholder="Введите пароль сотрудника"></b-form-input>
    </b-form-group>


    <b-form-group label="Роль">
      <b-form-radio-group
        id="btn-radios-1"
        v-model="user.role_id"
        :options="[{text :'Мигать СМС',value:1},{text:'Немигать СМС',value:0}]"
        buttons
        button-variant="outline-success"
        name="radios-btn-default"
      ></b-form-radio-group>
    </b-form-group>



    <b-form-group label="Кодировка СМС">
      <b-form-select v-model="user.charset" :options="charset_option"></b-form-select>
    </b-form-group>



    <template v-slot:modal-footer="{ ok, cancel}">
      <!-- Emulate built in modal footer ok and cancel button actions -->
      <b-button variant="success" @click="SaveUser">
        Сохранить
      </b-button>
      <b-button  variant="danger" @click="cancel()">
        Отмена
      </b-button>
      <!-- Button with custom close trigger value -->
    </template>

  </b-modal>
</template>

<script>

import Multiselect from 'vue-multiselect'

import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'

export default {
  name: 'ChangeGroupSMSParams',
  components: {Multiselect, VueCtkDateTimePicker},
  props: ['user'],
  data: () => {
    return ({

    })
  },
  methods:
      {

        SaveUser () {
          console.log(this.user)
          var formData = new FormData()
          formData.append('data', JSON.stringify(this.user))
          this.$http.post('set_users', formData).then(response => {

          //  this.$refs.toastRef.makeToast(response.data.success, 'Системное Сообщение', response.data.message)
          })
        },
           GetParamsSMS () {
          this.$http.get('get_smsc_tarif').then(response => {
            if (response.data.success) {
              this.sms_params = response.data.data
            }
          })
        }
      }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>

</style>
