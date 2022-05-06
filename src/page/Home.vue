<template>
    <div>
       <div class="container col-lg">
           <div class="row">
               <div class="col-6">
                 <inflow-outflow></inflow-outflow>
               </div>
               <div class="col-6">
                <total-internet-t-v></total-internet-t-v>
               </div>
           </div>

           <div class="row">
               <div class="col-6">
                   <tarifs-internet></tarifs-internet>
               </div>
               <div class="col-6">
                    <tarifs-t-v></tarifs-t-v>
               </div>
           </div>

         <div class="row">
           <div class="col-6">
          <tarifs-domofon></tarifs-domofon>
           </div>
           <div class="col-6">

           </div>
         </div>

         <div class="row">
           <div class="col-12">
           <InflowOutflowDays></InflowOutflowDays>
           </div>
         </div>



       </div>

    </div>
</template>

<script>
  import InflowOutflow from '../components/InflowOutflow'
  import TotalInternetTV from '../components/TotalInternetTV'
  import TarifsInternet from '../components/TarifsInternet'
  import TarifsTV from '../components/TarifsTV'
  import TarifsDomofon from '../components/TarifsDomofon'
  import InflowOutflowDays from '../components/InflowOutflowDays'

  export default {
    name: "Home",
    components: { TotalInternetTV, InflowOutflow, TarifsInternet, TarifsTV, TarifsDomofon, InflowOutflowDays},
      mounted () {
        // this.GetReports();
      },
    data: function() {
      return {
        verrs: [],
        series: [],
        LoadGroupChart: {
          chart: {
            type: 'area',
            stacked: false
          },
          xaxis: {
            type: 'category',
            categories: []
          },
          fill: {
            opacity: 1
          }
        },
          params_report: {type: 1, date: '1' , number: 3 , year: 2022}

      }

    },
      methods:
          {
              GetReports()
              {
                  let request_data = new FormData()
                  request_data.append('data', JSON.stringify(this.params_report))
                  this.$http.post('get_report', request_data).then(response => {
                      console.log(response)

                      if (response.data.success) {
                          let data = response.data.data

                          this.series = data.series
                          this.LoadGroupChart = { chart: {
                                  type: data.chart_type,
                                  stacked: data.stacked
                              },
                              xaxis: { categories: data.categories } }
                      }


                  });
              }
          }
  };
</script>

<style scoped>

</style>
