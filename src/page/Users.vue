<<style scoped>

</style>

<script>

import UsersDialogChange from '../components/Dialogs/UsersDialogChange'

export default {
  name: 'Users',
  components: {UsersDialogChange},
  mounted: function(){
    this.GetUsers()
  },
  data: () => {
    return {
      filter_query: {'status': 0, date: '27.04.2022' },
      sel_users: {username: '', role_id: 1, login: '', passwd: ''},
      busy_table: false,
      filter_inner_find: '',
      filter_material: '',
      modalShow: false,
      isBusy: false,
      stickySplitLabels: false,
      currentPage: 1,
      perPage: 20,
      fields: [
        {key: '_id', label: '#', sortable: true},
        {key: 'username', label: 'Сотрудник', sortable: true},
        {key: 'role', label: 'Роль', sortable: true},
        {key: 'login', label: 'Логин', sortable: true},
        {key: 'lastdate', label: 'Дата/Входа', sortable: true},
        {key: 'actions', label: 'Действие', sortable: false }
      ],
      users_data: [{_id: 1, username: 'Телемаркетолог 1', role: 'Телемаркетолог', login: 'tm1', lastdate: '03.05.2022 10:55'}],
      totalRows: 3,
      pageOptions: [5, 10, 15],
      filterOn: []
    }
  },
  methods: {
    NewRecord () {
      this.sel_users = { username: '3545', role_id: 1, login: '', passwd: ''}
      this.$bvModal.show('modal-change-users')
    },
    DeleteUser (id) {
      this.$bvModal.msgBoxConfirm('Удалить сотрудника', {
        title: 'Удалить',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        cancelVariant: 'warning',
        okTitle: 'Удалить',
        cancelTitle: 'Отмена',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: false
      })
        .then(value => {
          if (value) {
            this.$http.get('delete_user/' + id).then(response => {
              if (response.data.success) {
                this.sms_params = response.data.data
              }
            })
          }
        })
        .catch(err => {
          // An error occurred
        })
    },

    GetUsers (){
      this.$http.get('get_users').then(response => {
        if (response.data.success) {
          this.users_data = response.data.data
        }
      })
    },

    SAVE () {
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
    OnShowDialogRepeat (repeat_user) {
    //  this.$bvModal.show('repeat_req_dialog_form')


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

               <b-button @click="NewRecord" variant="outline-secondary">
                 <b-icon icon="plus-circle"></b-icon>
                 Создать новую запись
               </b-button>
              </b-col>

            <b-col lg="8" class="text-right">


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
                :total-rows="users_data.length"
                :per-page="perPage"
                aria-controls="my-table"
                pills
                first-number
                last-number
              ></b-pagination>

              <b-table hover :items="users_data"   :fields="fields" responsive="sm"
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



                <template v-slot:cell(actions)="row">

                  <b-button-group>
                    <b-button v-b-tooltip.hover title="Изменить"  variant="outline-secondary">
                      <b-icon icon="gear"></b-icon>
                    </b-button>
                    <b-button  v-b-tooltip.hover title="Удалить" @click="DeleteUser(row.item.id)"  variant="outline-secondary">
                      <b-icon icon="x-circle"></b-icon>
                    </b-button>
                  </b-button-group>

                </template>


              </b-table>
            </b-card>
          </div>

        </div>

      </div>

    </div>


    <UsersDialogChange :user="sel_users"> </UsersDialogChange>

    <toast ref="toastRef"></toast>

  </div>
</template>
