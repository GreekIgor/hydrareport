<template>
  <b-modal id="modal-change-sms-params" title="Изменение Значении для группы заявок">

    <b-form-group label="Основные параметры">

      <b-list-group size="sm">
        <b-list-group-item class="d-flex align-items-center">
          <b-avatar class="mr-3" icon="briefcase"></b-avatar>
          <span class="mr-auto">Выбрано Номеров :</span>
          <b-badge>{{this.sms_group.length}}</b-badge>
        </b-list-group-item>
        <b-list-group-item class="d-flex align-items-center">
          <b-avatar variant="primary" icon="clock" class="mr-3"></b-avatar>
          <span class="mr-auto">Сумма к Оплате :</span>
          <b-badge>{{itogSMSSummAmount}} тг</b-badge>
        </b-list-group-item>
        <b-list-group-item class="d-flex align-items-center">
          <b-avatar variant="info" icon="people-fill" class="mr-3"></b-avatar>
          <span class="mr-auto">Количество Символов : </span>
          <b-badge>{{sms_symbols.length}}</b-badge>
        </b-list-group-item>
      </b-list-group>

    </b-form-group>

    <b-form-group label="">
      <b-form-radio-group
        id="btn-radios-1"
        v-model="params_send.flash"
        :options="[{text :'Мигать СМС',value:1},{text:'Немигать СМС',value:0}]"
        buttons
        button-variant="outline-success"
        name="radios-btn-default"
      ></b-form-radio-group>
    </b-form-group>


    <VueCtkDateTimePicker v-model="params_send.time_send"
                          :button-now-translation="'Сеичас'"
                          :minute-interval="10"
                          :locale="'ru'"
                          :label = "'Выберите время когда нужно сделать рассылку'"
                          :format = "'YYYY-MM-DD HH:mm'"
    />


    <b-form-group label="Кодировка СМС">
      <b-form-select v-model="params_send.charset" :options="charset_option"></b-form-select>
    </b-form-group>

    <b-form-group label="Фразы для подстановки">
      <b-form-select v-model="selected" @change="PhasesChange" :options="subtition_phrases"></b-form-select>
    </b-form-group>

    <b-button @click="RecalcSummSMS">dfdsf</b-button>
    <b-button size="sm">сохранить фразу</b-button>

      <b-form-group label="Текст к СМС">
        <b-form-textarea
          id="textarea"
          v-model="sms_symbols"
          placeholder="Напишите текст к смс"
          rows="5"
          max-rows="5"

        ></b-form-textarea>
      </b-form-group>

    <template v-slot:modal-footer="{ ok, cancel}">
      <!-- Emulate built in modal footer ok and cancel button actions -->
      <b-button variant="success" @click="SendToSMSArhive">
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
  props: ['sms_group'],
  mounted: function () {
    this.GetParamsSMS()
  },
  data: () => {
    return ({
      sms_params: {},
      params_send: {customers: [], time_send: '', flash: 0, charset: '', cost: 0, status: 0},
      count_symbols: 0,
      itogSMSSummAmount: 0,
      sms_symbols: '',
      isLoading: {adress: false, members: false},
      innerParams: {group_time_all: 0, group_avalaible_time: 0},
      adress_arr: [],
      options_status: [{text: 'Невыдано', value: 0}, {text: 'Выдано', value: 1}, {text: 'Выполнено', value: 2}, {text: 'Отменена', value: 3}, {text: 'Невозможно', value: 4}],
      disabledhours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '19', '20', '21', '22', '23'],
      charset_option: [ {value: 'utf-8', text: 'UNICODE utf8'},{value: 'windows-1251', text: 'Windows 1251'},{value: 'koi8-r', text: 'KOI8R'} ],
      subtition_phrases: [
        { value: '{FIO}', text: '{FIO} Подставить ФИО Абонента' },
        { value: '{BALANCE}', text: '{BALANCE} Подставить Баланс Абонента' },
        { value: '{SERVICES}', text: '{SERVICES} Подставить Услуги Абонента' },
        { value: 'Уважаемый {FIO}, Просим вас оплатить за услуги Кайнар ТВ', text: 'Уважаемый {FIO}, Просим вас оплатить за услуги Кайнар ТВ' },
        { value: '{SERVICES}', text: '{SERVICES} Подставить Услуги Абонента' }
      ]
    })
  },
  methods:
      {

        SendToSMSArhive () {
          console.log(this.sms_group)
          this.params_send.customers = this.sms_group
          this.params_send.charset = 'utf-8'
          this.params_send.flash = 0
          this.params_send.status = 0
          this.params_send.time_send = ''

          var formData = new FormData()
          formData.append('data', JSON.stringify(this.params_send))
          this.$http.post('set_sms_arhive', formData).then(response => {

          //  this.$refs.toastRef.makeToast(response.data.success, 'Системное Сообщение', response.data.message)
          })
        },
        RecalcSummSMS () {
          let smsSymbol = this.sms_symbols
          let itogSummaSMS = 0
          let operator_arr = this.sms_params.operator
          let cost_arr = this.sms_params.cost
          let finish_cost = 0
          let symbol_arr = this.sms_params.symbol
          const valuesSymbol = Object.values(symbol_arr)
          let kiriliza = valuesSymbol[0]
          let latiniza = valuesSymbol[1]

          const keysOperator = Object.keys(operator_arr)
          const valuesOperator = Object.values(operator_arr)
          const keysCost = Object.keys(cost_arr)
          const valuesCost = Object.values(cost_arr)

          let new_smsgroup = []

          this.sms_group.map(function (obj, index) {
            let phone_number = obj.phone_number
            let sms = obj.sms
            let cost = obj.cost

            let newSymbol = smsSymbol.replace('{FIO}', obj.fio)
            newSymbol = newSymbol.replace('{BALANCE}', obj.balance)
            obj.message = newSymbol

            let oper_three = '777'

            if (phone_number.includes('+')) {
              oper_three = phone_number.substr(2, 3)
            } else {
              oper_three = phone_number.substr(1, 3)
            }

            let indexFind = keysOperator.indexOf(oper_three)
            if (indexFind > -1) {
              let operatorName = valuesOperator[indexFind]

              let indexFindCost = keysCost.indexOf(operatorName)
              if (indexFindCost > -1) {
                let operatorCost = valuesCost[indexFindCost]
                console.log(kiriliza)
                console.log(latiniza)
                // console.log(sms.length)
                if (newSymbol.length > kiriliza) { finish_cost = (operatorCost * Math.ceil(newSymbol.length / kiriliza)) } else { finish_cost = (operatorCost) }

                // console.log(phone_number + ' ' + oper_three + ' opername '+ operatorName + ' cost ' + operatorCost + ' finish cost '+ finish_cost)
              }
            }
            itogSummaSMS = itogSummaSMS + finish_cost

            new_smsgroup.push(obj)

            console.log(phone_number + ' ' + oper_three + ' finish cost ' + finish_cost)
          })
          this.itogSMSSummAmount = itogSummaSMS
          this.sms_group = new_smsgroup
          console.log(new_smsgroup)
        },

        GetParamsSMS () {
          this.$http.get('get_smsc_tarif').then(response => {
            if (response.data.success) {
              this.sms_params = response.data.data
            }
          })
        },

        PhasesChange (val) {
          this.sms_symbols = this.sms_symbols + val
          this.RecalcSummSMS()
        },
        ChangeDateGroupReq (val) {
          this.RecalcTimeMember(val, this.group_req_params.members.group_id)
        },
        selectMemberReq (val) {
          this.RecalcTimeMember(this.group_req_params.event_start, val.group_id)
        },
        RecalcTimeMember (date_select, id_group) {
          var d = new Date(date_select)
          var data_filter2 = d.getFullYear().toString() + '-' + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : '0' + (d.getMonth() + 1).toString()) + '-' + (d.getDate().toString().length == 2 ? d.getDate().toString() : '0' + d.getDate().toString())
          this.$http.get('groups/personal/' + data_filter2 + '/' + id_group).then(response => {
            this.innerParams.group_time_all = response.data.data.itog_all_time
          })
        },
        MinToHourTime (time_min) {
          let hours = Math.trunc(time_min / 60)
          let minutes = time_min % 60

          return hours + ':' + minutes
        },
        SaveGroupReqParam () {
          this.$store.commit('set_loadingChange', true)
          let members = this.group_req_params.members
          let event_start = this.group_req_params.event_start
          let status = this.group_req_params.status

          this.selected_group_req.map(function (item) {
            item.members = members
            item.event_start = event_start
            item.status = status
            return item
          })

          var request_data = new FormData()
          request_data.append('data', JSON.stringify(this.selected_group_req))
          request_data.append('token', this.$store.state.token)
          let url = 'request/group/save'

          this.$http.post(url, request_data).then(response => {
            console.log(response.data)
            if (response.data.success) {
              // this.$store.commit('set_group_change', response.data.data)
            }

            this.$store.commit('set_loadingChange', false)
            this.$refs.toastRef.makeToast(response.data.success, 'Системное Сообщение', response.data.message)
          }).catch(error => {
            this.$store.commit('set_loadingChange', false)
            this.$refs.toastRef.makeToast(false, 'Системное Сообщение', error.toString())
          })
          this.$bvModal.hide('modal-change-req-params')
        }
      }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>

</style>
