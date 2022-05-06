<template>
    <div>
        <apexcharts height="300" type="bar" :options="LoadGroupChart" :series="series"></apexcharts>
    </div>
</template>

<script>

  import VueApexCharts from 'vue-apexcharts'

  export default {
    name: "InflowOutflow",
    components: {apexcharts: VueApexCharts},
    mounted: function () {
      this.GetReports()
    },
    data: function() {
      return {
        params_report: {type: 1, date: 2 , number: 3 , year: 2022},
        LoadGroupChart: {
          chart: {
            type: 'pie',
            width: 500
           // stacked: false
          },
          xaxis: {
            type: 'category',
            categories: []
          },
          fill: {
            opacity: 1,
            colors: ['#FF5722','#17B978']
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
          data: [30, 40, 45, 50, 49, 60, 70, 91,100,20,18,69]
        },
          {
            name: 'Отток',
            data: [15, 27, 111, 72, 10, 2, 56, 77,33,54,79,81]
          }
        ]
      }
    },
    methods: {
      GetReports ()
      {
        let request_data = new FormData()
        request_data.append('data', JSON.stringify(this.params_report))
        this.$http.post('get_report', request_data).then(response => {
          console.log(response)

          if (response.data.success) {
            let data = response.data.data

            this.series = data.series
            this.LoadGroupChart = { chart: {
                type: 'bar',
                stacked: false
              },
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
                  formatter: function(val) {
                    return "количество " + val + " абонентов"
                  }
                }
              }
            }
          }


        });
      }
    }
  };
</script>

<style scoped>

</style>
