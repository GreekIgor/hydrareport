<<style scoped>

</style>

<script>

import CallingTelemarketolog from '../components/Dialogs/CallingDialogTelemarketolog'

export default {
  name: 'Telemarketolog',
  components: {CallingTelemarketolog},
  data: () => {
    return {
      filter_query: {'status': 0, date: '27.04.2022' },
      customer: {},
      busy_table: false,
      customer_extend_info: [],
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
        {key: 'date_time', label: 'Время', sortable: true},
        {key: 'fio', label: 'ФИО абонента', sortable: true},
        {key: 'adress', label: 'Адрес', sortable: true},
        {key: 'balance', label: 'Баланс', sortable: true},
        {key: 'services', label: 'Услуги', sortable: true},
        {key: 'last_comments', label: 'Комментарий', sortable: true},
        {key: 'last_call_status', label: 'Статус', sortable: false },
        {key: 'actions', label: 'Действие', sortable: false }
      ],
      data_customer: [{_id: 1, date_time: '30.03.2022 10:15', fio: 'test fio', adress: 'Каратал, д.17, кв 4', last_comments: 'комментарии', last_call_status: 1}],
      totalRows: 3,
      pageOptions: [5, 10, 15],
      filterOn: []
    }
  },
  methods: {
    Filter (type, value) {
      switch (type) {
        case 1: this.filter_query.status = value
          break
        case 2: this.filter_query.date = value
        break
      }
    },
    GetLocalCustomer () {
      this.busy_table = true
      var formData = new FormData()
      formData.append('data', JSON.stringify(this.calling_result))
      this.$http.post('get_local_customer', formData).then(response => {
        console.log(response.data)

        if ((response.data.success) && (response.data.error_code === 0)) {
          this.data_customer = response.data.data
        } else {
          // вывести ошибку
        }
        this.show = false
        this.busy_table = false
      }).catch(function (data, status, request) {
        console.log('произошла ошибка' + data)
        this.show_error = true
        this.error_text = 'Произошла Ошибка, Обновите страницу, Возможно проблема с соединением, страница будет перезагружена через 8 сек !'
      })
    },
    GetCustomerExtendInfo (customer_id) {
      this.$http.get('get_customer_info/extend/' + customer_id).then(response => {
        console.log(response.data)

        if ((response.data.success) && (response.data.error_code === 0)) {
          this.customer_extend_info = response.data.data
        } else {
          // вывести ошибку
        }
        this.show = false
        this.busy_table = false
      }).catch(function (data, status, request) {
        console.log('произошла ошибка' + data)
        this.show_error = true
        this.error_text = 'Произошла Ошибка, Обновите страницу, Возможно проблема с соединением, страница будет перезагружена через 8 сек !'
      })
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
    onRowClicked (item, index, event) {
      console.log(item)
      this.customer = item
      let customerId = item['billing_customer_id']
      this.GetCustomerExtendInfo(customerId)
      this.$bvModal.show('modal-calling_telemarketolog')
    },
    onRowSelected (items) {

    //  console.log(items);
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

                 <div class="row mb-2">

             <b-col lg="4" class="text-left">

                <b-button-group size="sm">
                  <b-button @click="GetLocalCustomer">Вчера </b-button>
                  <b-button >Сегодня </b-button>
                </b-button-group>
              </b-col>

            <b-col lg="8" class="text-right">

              <b-button-group size="sm">
                <b-button variant="secondary" >Необработанные </b-button>
                <b-button variant="success" >Дозвон</b-button>
                <b-button variant="info" >Перезвонить</b-button>
                <b-button variant="warning" >Потенциальный Клиент</b-button>
                <b-button variant="danger" >Недозвон </b-button>
                <b-button variant="primary" >Все </b-button>
              </b-button-group>
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

              <b-pagination
                v-model="currentPage"
                :total-rows="data_customer.length"
                :per-page="perPage"
                aria-controls="my-table"
                pills
                first-number
                last-number
              ></b-pagination>

              <b-table hover :items="data_customer"   :fields="fields" responsive="sm"
                       selectable
                       :isBusy = "busy_table"
                       :select-mode="'single'"
                       :filter="filter_material"
                       :filterIncludedFields="filterOn"
                       :per-page="perPage"
                       :current-page="currentPage"
                       @row-selected="onRowSelected"
                       @row-clicked="onRowClicked"
                       show-empty
                       empty-text="записей не обнаружено"
                       empty-filtered-text="записей по фильтру не обнаружено"
                       bordered>

                <template v-slot:cell(last_call_status)="row">
                  <b-badge v-if="row.item.last_call_status==1" variant="success">дозвон</b-badge>
                  <b-badge v-else-if="row.item.last_call_status==2" variant="danger">недозвон</b-badge>
                  <b-badge v-else-if="row.item.last_call_status==3" variant="danger">перезвонить</b-badge>
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

    <calling-telemarketolog :info="customer_extend_info" :customer="customer"></calling-telemarketolog>

  </div>
</template>
