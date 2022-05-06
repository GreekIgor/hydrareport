<template>
    <div>
        <apexcharts height="300" type="bar" :options="LoadGroupChart" :series="series"></apexcharts>
    </div>
</template>

<script>

import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'InflowOutflowDays',
  components: {apexcharts: VueApexCharts},
  mounted: function () {
    this.GetReports()
  },
  data: function () {
    return {
      params_report: {type: 6, date: 1, number: 3, year: 2022},
      LoadGroupChart: {
        chart: {
          type: 'area',
          stacked: false
        },
        xaxis: {
          type: 'category',
          categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
        },
        yaxis: {
          title: {
            text: 'Приток/Отток за Апрель 2022 г.'
          }
        },
        fill: {
          opacity: 1,
          colors: ['#FF5722', '#17B978']
        }, dataLabels: {
          style: {
            textAnchor: 'start',
            fontSize: '10px',
            colors: ["#304758"]
          }
        }
      },
      series: [{
        name: 'Приток',
        data: [30, 40, 45, 50, 49, 60, 70, 91, 100, 20, 18, 69, 10, 17, 15, 19, 12, 20, 21, 25, 21, 23, 25, 27, 25, 26, 28, 29, 29, 30]
      },
      {
        name: 'Отток',
        data: [15, 27, 111, 72, 10, 2, 56, 77, 33, 54, 79, 81, 14, 15, 17, 20, 19, 20, 30, 31, 28, 45, 17, 16, 30, 25, 98, 10, 25, 30]
      }
      ]
    }
  },
  methods: {
    GetReports () {
      let request_data = new FormData()
      request_data.append('data', JSON.stringify(this.params_report))
      this.$http.post('get_report', request_data).then(response => {
        console.log(response)

        if (response.data.success) {
          let data = response.data.data

          this.series = data.series
          this.LoadGroupChart = { /*chart: {
            type: data.chart_type,
            stacked: data.stacked
          },*/
          xaxis: { categories: data.categories },
          yaxis: {
            title: {
              text: 'Приток/Отток'
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return 'количество ' + val + ' абонентов'
              }
            }
          }
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
