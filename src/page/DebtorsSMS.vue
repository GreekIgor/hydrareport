<<style scoped>

</style>

<script>

import ChangeGroupSMS from '../components/Dialogs/ChangeGroupSMSParams'

import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'

export default {
  name: 'DebtorsSMS',
  components: {ChangeGroupSMS, VueCtkDateTimePicker},
  data: () => {
    return {
      sms_group: [],
      balance_smsc: 0,
      sel_load: 1,
      options: [
        { item: 1, name: 'Должники по балансу' },
        { item: 2, name: 'СМС из Архива' },
        { item: 3, name: 'Option C', notEnabled: true },
        { item: { d: 1 }, name: 'Option D' }
      ],

      option1: {name: '1'},
      option2: {name: '2'},
      filter_inner_find: '',
      filter_material: '',
      date_filter: new Date(),
      modalShow: false,
      isBusy: false,
      stickySplitLabels: false,
      currentPage: 1,
      perPage: 20,
      fields: [
        {key: '_id', label: '#', sortable: true},
        {key: 'phone_number', label: 'Телефон', sortable: true},
        {key: 'fio', label: 'ФИО абонента', sortable: true},
        {key: 'adress', label: 'Адрес', sortable: true},
        {key: 'balance', label: 'Баланс', sortable: true},
        {key: 'services', label: 'Услуги', sortable: true},
        {key: 'sms', label: 'СМС', sortable: true},
        {key: 'cost', label: 'Стоимость СМС', sortable: false },
        {key: 'status', label: 'Статус', sortable: false },
        {key: 'actions', label: 'Действие', sortable: false }
      ],
      data: [],
      totalRows: 3,
      pageOptions: [5, 10, 15],
      filterOn: []
    }
  },
  methods: {
    ChangeSelectAllSMS (checked) {
      if (checked) { this.$refs.selectableSMSTable.selectAllRows() } else { this.$refs.selectableSMSTable.clearSelected() }
    },
    GetBalanceSMSC () {
      this.$store.commit('set_loadingChange', true)
      this.$http.get('get_smsc_balance').then(response => {
        console.log(response.data)

        if ((response.data.success) && (response.data.error_code === 0)) {
          this.balance_smsc = response.data.data
        } else {
          // вывести ошибку
        }
        this.show = false
        this.$store.commit('set_loadingChange', false)
      }).catch(function (data, status, request) {
        console.log('произошла ошибка' + data)
        this.show_error = true
        this.error_text = 'Произошла Ошибка, Обновите страницу, Возможно проблема с соединением, страница будет перезагружена через 8 сек !'
      })
    },
    GetDebitorSMS () {
      this.$store.commit('set_loadingChange', true)

      let url_load = 'get_debitor_sms'
      switch (this.sel_load) {
        case 1: url_load = 'get_debitor_sms'
          break
        case 2: url_load = 'get_sms_arhive'
      }

      this.$http.get(url_load).then(response => {
        if (response.data.success) {
          this.data = response.data.data
        }
        this.$store.commit('set_loadingChange', false)
      }).catch(function (data, status, request) {
        console.log('произошла ошибка' + data)
        this.show_error = true
        this.error_text = 'Произошла Ошибка, Обновите страницу, Возможно проблема с соединением, страница будет перезагружена через 8 сек !'
        this.$store.commit('set_loadingChange', false)
      })
    },
    ShowGroupSMSChange () {
      if(this.sms_group.length>0) {
        this.$bvModal.show('modal-change-sms-params')
      }
      else
      {
        this.$bvModal.msgBoxOk('Выберите хотя бы один номер', {
          title: 'Не выбран ни один из номеров',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'success',
          okTitle: 'ОК',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: false
        });
      }
    },
    OnShowDialogRepeat (repeat_user) {
    //  this.$bvModal.show('repeat_req_dialog_form')

      this.$bvModal.msgBoxConfirm('Переотправка Всех заявок', {
        title: 'Переотправить',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'success',
        cancelVariant: 'danger',
        okTitle: 'Переотправить',
        cancelTitle: 'Отмена',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: false
      })
        .then(value => {
          if (value) {
            let request_data = new FormData()

            request_data.append('repeated', repeat_user)
            request_data.append('token', this.$store.state.token)

            this.$http.post('requests/repeat/' + repeat_user, request_data).then(response => {

            })
          }
        })
        .catch(err => {
          // An error occurred
        })
    },
    onRowSelected (items) {
      this.$bvModal.show('modal-calling_telemarketolog')
      this.sms_group = items
      //    console.log(items);
      /* let itog_all = 0
      this.selected_request_arr = items
      this.group_req_params.count_req = items.length
      items.map(function (elem) {
        itog_all= itog_all + Number(elem.itog_time_req)
      })

      this.group_req_params.req_itog_time = itog_all */
    }
  },
  computed: {
    balloonTemplate () {
      return 'hello'
    }

  },
  watch: {
    date_filter: function (data_filter) {
      var d = new Date(data_filter)
      data_filter = d.getFullYear().toString() + '-' + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : '0' + (d.getMonth() + 1).toString()) + '-' + (d.getDate().toString().length == 2 ? d.getDate().toString() : '0' + d.getDate().toString())

      this.$store.dispatch('get_request', data_filter)
      this.$store.commit('set_filter_date', data_filter)
    }
  }
}
</script>

<template>
  <div class="mt-2">
    <div class="container-fluid">

      <div class="row">

           <div class="col-10 float-right text-right">

             <b-col class="col-1 float-left text-left pr-0">
               <b-form-checkbox @change="ChangeSelectAllSMS" size="lg">
                 {{this.sms_group.length}}

               </b-form-checkbox>

             </b-col>

                 <div class="row mb-2">

                   <b-col lg="2" class="text-left">
                   <div class="text-center">
                     <b-button variant="primary" @click="GetBalanceSMSC">
                       Баланс <b-badge variant="light">{{this.balance_smsc}} тг</b-badge>
                     </b-button>
                   </div>
                   </b-col>

             <b-col lg="4" class="text-left">

              <b-form-select
                 v-model="sel_load"
                 :options="options"
                 class="mb-3"
                 value-field="item"
                 text-field="name"
                 disabled-field="notEnabled"
               ></b-form-select>
              </b-col>

                   <b-col lg="1" class="text-left mr-2">
                   <div class="text-center">
                     <b-button  @click="GetDebitorSMS"  variant="primary">
                       Загрузить
                     </b-button>
                   </div>
                 </b-col>

                   <b-col lg="1" class="text-right">
                     <div class="text-center">
                       <b-button @click="ShowGroupSMSChange" variant="primary">
                         Группа
                       </b-button>
                     </div>
                   </b-col>

            <b-col lg="4" class="text-right">

              <b-button-group size="sm">
                <b-button variant="secondary" >Необработанные </b-button>
                <b-button variant="success" >Дозвон</b-button>
              </b-button-group>
            </b-col>

          </div>

             <div class="row">
               <b-col lg="2">
                 <VueCtkDateTimePicker v-model="selec2t"
                                       :button-now-translation="'Сеичас'"
                                       :locale="'ru'"
                                       :label = "'Выберите'"
                                       :format = "'YYYY-MM-DD'"
                                       :onlydate="'true'"
                 />
               </b-col>

             </div>

             <div class="row mb-2">
               <b-col lg="2" class="text-left">
               <b-badge variant="primary">Общая стоимость смс : 11.8 тг</b-badge>
               </b-col>
               <b-col lg="2" class="text-left ml-4">
                 <b-badge variant="success">Всего номеров : {{this.data.length}} ед.</b-badge>
               </b-col>
             </div>

          <div>
            <b-card no-body>
              <b-col lg="4" class="my-1 pl-0">
                <b-form-group >
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="filter_material"
                      type="search"
                      id="filterInput"
                      placeholder="Введите текст для поиска"
                    ></b-form-input>
                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="filter = ''">Сбросить</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>

              <b-table hover :items="data"   :fields="fields" responsive="sm"
                       selectable
                       :isBusy = "false"
                       select-mode="multi"
                       :filter="filter_material"
                       :filterIncludedFields="filterOn"
                       @row-selected="onRowSelected"
                       show-empty
                       ref="selectableSMSTable"
                       empty-text="записей не обнаружено"
                       empty-filtered-text="записей по фильтру не обнаружено"
                       bordered>

                <template v-slot:cell(mat_quant)="row">
                  {{row.item.mat_quant +' '+ row.item.units}}
                </template>

                <template v-slot:cell(status)="row">
                  <b-badge v-if="row.item.status==-99" variant="success">новое</b-badge>
                  <b-badge v-else-if="row.item.status==-3" variant="danger">сообщение не найдено</b-badge>
                  <b-badge v-else-if="row.item.status==-2" variant="warning">остановлено</b-badge>
                  <b-badge v-else-if="row.item.status==-1" variant="warning">ожидает отправки</b-badge>
                  <b-badge v-else-if="row.item.status==0" variant="primaty">передано оператору</b-badge>
                  <b-badge v-else-if="row.item.status==1" variant="success">доставлено</b-badge>
                  <b-badge v-else-if="row.item.status==2" variant="success">прочитано</b-badge>
                  <b-badge v-else-if="row.item.status==3" variant="danger">просрочено</b-badge>
                  <b-badge v-else-if="row.item.status==20" variant="danger">невозможно доставить</b-badge>
                  <b-badge v-else-if="row.item.status==22" variant="danger">неверный номер</b-badge>
                  <b-badge v-else-if="row.item.status==24" variant="danger">недостаточно средств</b-badge>
                  <b-badge v-else-if="row.item.status==25" variant="danger">недоступныц номер</b-badge>
                  <b-badge v-else variant="secondary">не установлен</b-badge>
                </template>

                <template v-slot:cell(personal)="row">
                  <b-badge v-if="row.item.group_id==0" variant="success">{{row.item.fio}}</b-badge>
                  <b-badge v-else variant="secondary">{{row.item.group_name}}</b-badge>
                </template>

              </b-table>
            </b-card>
          </div>

        </div>

      </div>

    </div>

    <toast ref="toastRef"></toast>

    <change-group-s-m-s :sms_group="sms_group"></change-group-s-m-s>

  </div>
</template>
