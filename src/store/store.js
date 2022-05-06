import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showLoading: true,
    loading_message: '',
    config: [],
    count: 10208,
    request: [],
    req_filter: { group: 0, status: -1, plan_date: new Date(), field_value: '' },
    org_info: {org_name: '"Кайнар ТВ"', key_access: 'n/a'},
    selected_req: {},
    personals: [],
    group_personals: [],
    group_request: [],
    type_request: [],
    cities: [],
    streets: [],
    houses: [],
    materials: [],
    role_id: localStorage.getItem('role_id') || 1,
    token: localStorage.getItem('token') || 'token',
    userName: localStorage.getItem('name') || 'n/a',
    lang: localStorage.getItem('lang') || 'ru',
    user_info: {username: 'n/a', user_id: 0, role_id: 0, sip: 0},
    language: [],
    personals_status: [],
    personals_materials: [],
    operating_mode: {'type': 'socket', 'id': 1}
  },
  getters: {
    get_conf : (state) => (param_name) =>
    {
      return state.config.find(item => item.param_name === param_name)
    },
    get_materials (state) {
      return state.materials;
    },
    get_personal_status_map (state) {
      return state.personals_status.filter(item => item.role_id === 2).filter(item => item.lat > 0)
    },
    get_request_filter_data (state) {
      return state.req_filter.plan_date
    },
    get_request_filter (state) {
      try {
        if ((state.req_filter.group === 0) && (state.req_filter.status !== -1)) {
          return state.request.filter(item => item.status === state.req_filter.status)
        } else if ((state.req_filter.status === -1) && (state.req_filter.group !== 0)) {
          return state.request.filter(item => item.members.find(arrs => arrs.group_id === state.req_filter.group))
        } else if ((state.req_filter.status === -1) && (state.req_filter.group === 0)) {
          return state.request
        } else {
          return state.request.filter(item => item.members.find(arrs => arrs.group_id == state.req_filter.group)).filter(item => item.status === state.req_filter.status)
        }
      } catch (e) {
        return null
      }
    },
    get_request_from_excel (state) {
      try {
        let res = []
        let obj = {}

        res = this.state.request.map(function (item) {
          obj = new Object()
          obj = item
          var result_type_split = item.code_type_req.map(function (elem) {
            return elem.name
          }).join(';')
          obj.type_req_split = result_type_split
          return obj
        })

        return res
      } catch (e) { return [] }
    },
    get_group_req_count (state) {
      try {
        let res = []
        let obj = {}
        res = state.group_personals.map(function (item) {
          obj = new Object()
          obj.group_id = item.id_group
          obj.group_name = item.group_name

          obj.request_time = 0
          obj.request_hour_time = ''

          //  let req_from_group =  state.request.filter(item => item.members.find(arrs => arrs.group_id == item.id_group))
          let id_group = Number.parseInt(item.id_group)

          let req_from_group = state.request.filter(item => item.members.find(args => args.group_id == id_group)).filter(item => item.status == 1 || item.status == 2 || item.status == 4)

          req_from_group.forEach(function (item, i, arr) {
            obj.request_time = obj.request_time + item.itog_time_req
          })

          let hours = Math.trunc(obj.request_time / 60)
          let minutes = obj.request_time % 60

          obj.request_hour_time = hours + ':' + minutes

          obj.request_count = req_from_group.length

          return obj
        })

        return res
      } catch (e) {
        console.log('error message - ' + e)
        return []
      }
    },

    get_split_group (state) {
      let res = []
      let obj = {}
      res = state.group_personals.map(function (item) {
        obj = new Object()
        obj.id = item.id_group
        obj.label = item.group_name
        // obj.hide = false
        // obj.class = "";

        return obj
      })

      return res
    },
    get_personal_combo (state) {
      let res = []
      let obj = {}
      res = state.personals.map(function (item) {
        obj = new Object()
        obj.name = item.fio
        obj.code = {id: item.id_pers, type: 1}
        obj.type = 1
        obj.group_id = item.group_id

        return obj
      })

      return res
    },
    get_streets_combo (state) {
      let res = []
      let obj = {}
      res = state.streets.map(function (item) {
        obj = new Object()
        obj.name = item.street_name
        obj.code = item.id_street
        return obj
      })

      return res
    },
    get_typereq_combo (state) {
      let res = []
      let obj = {}
      res = state.type_request.map(function (item) {
        obj = new Object()
        obj.name = item.type_name
        obj.code = item.id_type
        obj.group_id = item.group_id
        obj.time_req = item.time_req
        return obj
      })

      return res
    },
    get_cities_combo (state) {
      let res = []
      let obj = {}
      res = state.cities.map(function (item) {
        obj = new Object()
        obj.name = item.city_name
        obj.code = item.id_city
        return obj
      })

      return res
    },
    get_group_request_combo (state) {
      let res = []
      let obj = {}
      res = state.group_request.map(function (item) {
        obj = new Object()
        obj.name = item.group_name
        obj.code = item.id_group
        obj.group_id = item.id_group
        return obj
      })

      return res
    },
    get_group_personal_combo (state) {
      let res = []
      let obj = {}
      res = state.group_personals.map(function (item) {
        obj = new Object()
        obj.name = item.group_name
        obj.code = {id: item.id_group, type: 2}
        obj.type = 2
        obj.group_id = item.id_group
        return obj
      })

      return res
    },
    get_events_calendar (state) {
      let events = []
      state.request.forEach(function (item, i, arr) {
        if (item.date_end > 0) {
          item.members.forEach(function (member) {
            let obj = new Object()

            obj.start = item.event_start
            obj.end = item.event_end
            obj.title = item.adress
            obj.content = item.request_name
            obj.split = member.group_id
            obj.class = 'new'
            obj.id = item._id
            events.push(obj)
          })
        }
      })

      return events
    }

  },
  mutations: {
    set_user_info(state, payload)
    {
      this.state.user_info = payload
    },
    set_conf(state, payload)
    {
      this.state.config = payload
    },
    set_request(state, payload)
    {
      this.state.request = payload
    },
    set_orginfo (state, payload) {
      this.state.org_info = payload
    },
    set_language (state, payload) {
      this.state.language = payload
    },
    set_loadingChange (state, payload) {
      this.state.showLoading = payload
    },
    set_change_material_group (state, payload) {
      this.state.personals_materials = payload.data
    },
    set_operating_mode (state, payload) {
      state.operating_mode.id = payload.id
      if (payload.id == 1) { state.operating_mode.type = 'socket' } else { state.operating_mode.type = 'longpooling' }
    },
    set_filter_date (state, date_filter) {
      state.req_filter.plan_date = date_filter
    },
    set_request_add (state, payload) {
      state.request.push(payload)
    },
    set_request_change (state, payload) {
      var index_req = state.request.findIndex(item => item._id === payload._id)
      if (index_req > -1) { state.request.splice(index_req, 1, payload) } else { state.request.push(payload) }
    },
    set_personal_change (state, payload) {
      var index_pers = state.personals.findIndex(item => item.id_pers === payload.id_pers)
      if (index_pers != undefined) { state.request.splice(index_pers, 1, payload) } else { state.personals.push(payload) }
    },
    set_group_change (state, payload) {
      var index_group = state.group_personals.findIndex(item => item.id_group === payload.group_id)
      if (index_group != undefined) { state.group_personals.splice(index_group, 1, payload) } else { state.group_personals.push(payload) }
    },
    set_status_change (state, payload) {
      var index_state = state.personals_status.findIndex(item => item.id === payload.id)
      if (index_state != undefined) { state.personals_status.splice(index_state, 1, payload) } else { state.personals_status.push(payload) }
    }
  },
  actions: {
    get_materials_group ({commit}) {
      Vue.http.get('materials_combo/get').then(response => {
        if (response.data.success) {
          this.state.materials = response.data.data
        }
      })
    },
    get_personals_status ({commit}) {
      Vue.http.get('personals/get_status').then(response => {
        if (response.data.success) {
          this.state.personals_status = response.data.data
        }
      })
    },
    get_request (context, datafilter) {
      var plan_date = this.state.req_filter.plan_date
      var field_name = this.state.req_filter.field_value
      var req_str = ''
      if (field_name.length > 2) { req_str = datafilter + '/' + field_name } else { req_str = datafilter }


      let request_data = new FormData()
      if (field_name.length > 2) {
        request_data.append('datafilter', datafilter)
        request_data.append('field_name', field_name)
      }
      else
      {
        request_data.append('datafilter', datafilter)
      }

      Vue.http.post('requests/get',request_data).then(response => {
        this.state.request = [];
        this.state.request = response.data.data
        // console.log('curreq')
        //  console.log(this.state.request)
        //  console.log('newreq')
        //  console.log(response.data.data)
      })


    /*  Vue.http.get('requests/get/' + req_str).then(response => {
        this.state.request = [];
        this.state.request = response.data.data
       // console.log('curreq')
      //  console.log(this.state.request)
      //  console.log('newreq')
      //  console.log(response.data.data)
     })*/
    },
    set_logout (context) {
      Vue.http.get('logout/' + this.state.token).then(response => {
        if (response.data.success) {
          localStorage.removeItem('token')
          this.state.token = 'token'
          this.$socket.client.close()
        }
        return response.data.success
      }).catch(function (data, status, request) {
        console.log('произошла ошибка' + data)
        this.$socket.client.close()
      })

      return false
    },

    add_element_pers (context, payload) {
      this.state.personals.push(payload)
    },
    get_personals ({commit}) {
      Vue.http.get('personals')
        .then(res => {
          this.state.personals = (res.body)
        })
    },
    get_group_personals ({commit}) // получение списка групп персонала
    {
      Vue.http.get('groups/personal').then(response => {
        this.state.group_personals = response.data.data
      })
    },
    get_group_request ({commit}) {
      Vue.http.get('groups/request').then(response => {
        this.state.group_request = response.data.data
      })
    },
    get_type_request ({commit}) {
      Vue.http.get('request/types/all').then(response => {
        this.state.type_request = response.data.data
      })
    },
    get_cities ({commit}) {
      Vue.http.get('adress/cities').then(response => {
        this.state.cities = response.data.data
      })
    },
    get_streets ({commit}) {
      Vue.http.get('adress/streets').then(response => {
        this.state.streets = response.data.data
      })
    },
    get_houses ({commit}) {
      Vue.http.get('adress/houses').then(response => {
        this.state.houses = response.data.data
      })
    },
    change_language (context, language) {
      Vue.http.get('language/change/' + language).then(response => {
        this.state.lang = language
        localStorage.setItem('lang', language)
        this.state.language = response.data.data
      })
    }

  }
})
