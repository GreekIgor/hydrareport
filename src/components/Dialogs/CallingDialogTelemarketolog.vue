<template>

  <b-modal id="modal-calling_telemarketolog" title="ФИО Абонента" size="lg">

    <b-form-group>
    <b-alert variant="secondary" show>Адрес : Каратал, д.16, кв 6</b-alert>
      <b-alert variant="secondary" show>ФИО : {{customer.fio}}</b-alert>


      <b-alert
        :show="dismissCountDown"
        dismissible
        variant="warning"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="countDownChanged"
      >
        <p>Произвожу звонок на номер  {{ dismissCountDown }} секунд...</p>
        <b-progress
          variant="warning"
          :max="dismissSecs"
          :value="dismissCountDown"
          height="4px"
        ></b-progress>
      </b-alert>

       <b-button-group size="sm">
         <b-button v-for="phone in info.phones"  variant="outline-primary" @click="CallingPhone(phone.param_value)"><b-icon icon="telephone-outbound" aria-hidden="true" class="mr-1"/>{{phone.param_value}}</b-button>
       </b-button-group>
     </b-form-group>


    <b-form-rating
      id="rating-calling"
      v-model="calling_result.rating" size="lg"
      show-value
      show-value-max
      variant="success"
    ></b-form-rating>

    <div role="tablist">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block v-b-toggle.accordion-1 variant="success">История Звонков</b-button>

        </b-card-header>
        <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">

          <b-card-body>

            <b-table hover :items="info.calling"   :fields="calling_fields" responsive="sm"
                     selectable
                     :isBusy = "false"
                     :select-mode="'single'"
                     show-empty
                     empty-text="записей не обнаружено"
                     empty-filtered-text="записей по фильтру не обнаружено"
                     bordered>

              <template v-slot:cell(status)="row">
                <b-badge v-if="row.item.status==1" variant="success">Дозвон</b-badge>
                <b-badge v-else-if="row.item.status==2" variant="danger">Недозвон</b-badge>
                <b-badge v-else-if="row.item.status==3" variant="danger">Перезвонить</b-badge>
                <b-badge v-else-if="row.item.status==4" variant="danger">Заявка</b-badge>
                <b-badge v-else-if="row.item.status==5" variant="danger">Возврат</b-badge>
                <b-badge v-else variant="secondary">Не установлен</b-badge>
              </template>

             </b-table>

          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
{{this.$store.state.user_info.sip}}
        <b-form-group label="Комментарии">
      <b-form-textarea
        id="textarea"
        v-model="calling_result.comment"
        placeholder="Напишите комментарии"
        rows="3"
        max-rows="6"
      ></b-form-textarea>
        </b-form-group>

    <b-form-group>
      <b-form-checkbox-group
        v-model="calling_result.operator"
        :options="button_status"
        name="buttons-1"
        buttons
      ></b-form-checkbox-group>

    </b-form-group>

   <b-form-group >
      <b-button-group >
        <b-button variant="success" @click="SetChangeStatus(1)">Дозвон</b-button>
        <b-button variant="danger" @click="SetChangeStatus(2)" >Недозвон</b-button>
        <b-button variant="info" @click="SetChangeStatus(3)" >Перезвонить</b-button>
        <b-button variant="warning" @click="SetChangeStatus(4)" >Заявка</b-button>
      </b-button-group>

     <span>Выставлен статус :
     <b-badge variant="success" v-if="calling_result.status==1">Дозвон</b-badge>
     <b-badge variant="info" v-if="calling_result.status==3">Перезвонить</b-badge>
     <b-badge variant="danger" v-if="calling_result.status==2">Недозвон</b-badge>
     <b-badge variant="warning" v-if="calling_result.status==4">Заявка</b-badge>

     </span>

    </b-form-group>

    <toast ref="toastRef"></toast>

    <template v-slot:modal-footer="{ ok, cancel}">
      <!-- Emulate built in modal footer ok and cancel button actions -->
      <b-button variant="success" @click="SaveCalling">
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

export default {
  name: 'CallingDialogTelemarketolog',
  components: {Multiselect},
  props: ['info', 'customer'],
  mounted: function () {
    //* ***
  },
  data: () => {
    return ({
      calling_result: {customer_id: 0, rating: 0, comment: '', operator: [{text: 'нету', value: 'нету'}], status: 0},
      cur_status: 1,
      calling_status: [
        {'datetime_calling': '11.04.2022 10:42:00', 'comments': 'Абонент отказался от дополнительных услуг', 'status': 1, 'who_calling': 'Телемаркетолог 1' }
      ],
      calling_fields: [
        {key: 'datetime_calling', label: 'Дата/Время', sortable: true},
        {key: 'comments', label: 'Комментарий', sortable: true},
        {key: 'status', label: 'Статус', sortable: false},
        {key: 'who_calling', label: 'Кто звонил', sortable: false}
      ],
      dismissSecs: 10,
      dismissCountDown: 0,
      showDismissibleAlert: false,
      isLoading: false,
      limitText: 2,
      groups: [{name: 'Настройка', code: 1, name: 'Ремонт', code: 2}],
      selected_group: [],
      time_to_req: '00:10',
      test: '',
      button_status: [
        { text: 'Казтелеком', value: 'Казтелеком' },
        { text: 'Beeline', value: 'Beeline' },
        { text: 'AlmaTV', value: 'AlmaTV' },
        { text: 'другое', value: 'другое' },
        { text: 'нету', value: 'нету' }
      ]
    })
  },
  methods: {
    SetChangeStatus (val) {
      this.calling_result.status = val
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    CallingPhone (phone) {
      console.log(phone)
      this.dismissCountDown = this.dismissSecs

       var formData = new FormData()

      formData.append('data', JSON.stringify({token: this.$store.state.token, 'phone': phone}))
      this.$http.post('calling', formData).then(response => {
        this.$refs.toastRef.makeToast(response.data.success, 'Системное Сообщение', response.data.message)
      })
    },
    SaveCalling () {
      this.calling_result.customer_id = this.customer.billing_customer_id
      var formData = new FormData()
      formData.append('data', JSON.stringify(this.calling_result))
      this.$http.post('calling/save', formData).then(response => {
        this.$refs.toastRef.makeToast(response.data.success, 'Системное Сообщение', response.data.message)
      })
      this.$bvModal.hide('modal-calling_telemarketolog')
    }
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>

</style>
