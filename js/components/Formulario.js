Vue.component('formhipoteca',{
    template: //html 
        `
        <div class="mt-4">
            <div class="text-center mt-4">
            <h4> 
                Valor de la UF {{ hoy }} : <span class="numResult"> {{ UFvalor }} </span> 
            </h4>
            </div>

            <div class="row mt-3">
                <div class="col">
                    <div class="justify-content-center">
                        <form name="infoHipo" class="form-group">

                            <label for="valueViviendaUF"> Valor de la vivienda en UF </label>
                            <input type="text" maxlength="6" id="valorViviendaUF" ref="valorViviendaUF" name="valorViviendaUF" class="form-control text-right" placeholder="Valor de la vivienda en UF" v-model="valueViviendaUF" v-on:keyup="soloNumeros">
                            
                            <br>

                            <label for="porcentajePie"> % de Pie </label>
                            <input type="number" placeholder="% de Pie    " class="form-control text-right" max="100" min="1" v-model="porcentajePie" v-on:keyup="soloNumeros">
                            
                            <br>
                            
                            <label for="plazoCredito"> Plazo del credito en años</label>
                            <input type="number" placeholder="Plazo del crédito en años    " class="form-control text-right" max="30" min="5" v-model="plazoCredito" v-on:keyup="soloNumeros">

                            <br>

                            <label for="tasa"> Tasa</label>
                            <input type="text" placeholder="Tasa del Crèdito    " class="form-control text-right" v-model="tasa" v-on:keyup="soloNumeros">

                        </form>
                    </div>
                    <div class="text-right">
                        <button class="btn btn-res" @click="resultados">  Calcular  </button>
                    </div>
                </div>
                <div class="col">
                    <table class="table table-bordered mt-2">
                        <thead>
                            <tr>
                            <th scope="col" class="numResult text-center"> Información </th>
                            <th scope="col" class="numResult text-center">Resultados</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <th scope="row">Vivienda en CLP (UF: {{  valueViviendaUF }}) </th>
                            <td class="calculateRes">  {{  formatCurrency(valorViviendaCLP)  }}  </td>
                            </tr>
                            <tr>
                            <th scope="row"> % Pie ({{ porcentajePie }} %)</th>
                            <td class="calculateRes"> {{  formatCurrency(pie)  }} </td>
                            
                            </tr>
                            <tr>
                            <th scope="row"> Financiamento del Crédito ({{ finaCreditoPor }}%)  </th>
                            <td class="calculateRes"> {{ formatCurrency(finaCreditoCLP) }} ({{finaCreditoUF}} UF) </td>
                            </tr>

                            <tr>
                            <th scope="row"> Valor del Crédito + Intereses (Tasa {{ tasa }} %) </th>
                            <td class="calculateRes"> {{ formatCurrency(creditoInteres) }} </td>
                            </tr>

                            <tr>
                            <th scope="row"> Dividendo aproximado ({{ plazoCredito }} años)  </th>
                            <td class="calculateRes"> {{  formatCurrency(dividendo)  }} </td>
                            </tr>

                            <tr>
                            <th scope="row"> Sueldo aproximado  </th>
                            <td class="calculateRes">  {{  formatCurrency(sueldoAprox)   }} </td>
                            </tr>


                        </tbody>
                    </table>
                </div>
            </div>


        </div>
        `,
        data(){
            return{
                valueViviendaUF: '',
                valorViviendaCLP: 0,
                plazoCredito: 5,
                hoy: '',
                porcentajePie: '',
                pie: 0,
                finaCreditoPor: 0,
                finaCreditoCLP: 0,
                finaCreditoUF: 0,
                creditoInteres: 0,
                dividendo: 0,
                tasa: '',
                sueldoAprox: 0,
                UFvalor:[]
            }
        },
        methods:{
            
            date_function: function () {
                var formatted_date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
                var splitFecha = formatted_date.split("/");
                this.hoy = splitFecha[2] + "-" + splitFecha[1] + "-" + splitFecha[0];
         
            },
            getUFToday(){
                
                var url = 'https://mindicador.cl/api/uf/' + this.hoy;
                axios
                    .get(url).then( response => {
                        this.UFvalor = response.data.serie[0].valor
                        console.log(this.UFvalor)
                    })
                    .catch( e => console.log(e))
            },
            resultados(){
                this.valorViviendaCLP = Math.round(this.UFvalor * this.valueViviendaUF)
                this.pie = Math.round(this.valorViviendaCLP * (this.porcentajePie / 100))
                this.finaCreditoPor = 100 - this.porcentajePie
                this.finaCreditoCLP = Math.round(this.valorViviendaCLP * (this.finaCreditoPor / 100))
                this.finaCreditoUF = this.finaCreditoCLP / this.UFvalor
                this.creditoInteres = Math.round(this.tasa * this.finaCreditoCLP)
                this.dividendo = Math.round(this.creditoInteres / (this.plazoCredito * 12) )
                this.sueldoAprox = Math.round( this.dividendo * 4 )
                //Dejar al menos 2 decimales al round
                this.finaCreditoUF = Math.round((this.finaCreditoUF  + Number.EPSILON) * 100) / 100
            },
            formatCurrency(number){
                const formatter = new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                    minimumFractionDigits: 2
                  })
                return formatter.format(number).replace(',00','')                  
            },
            soloNumeros(evento){
                //alert(evento.key + ' ' + evento.code + ' ' + evento.keyCode)
                if(parseInt(evento.keyCode == 190) || parseInt(evento.keyCode) >= 48 && parseInt(evento.keyCode) <= 57 ){
                    //alert('dsds')
                    return true;
                }else{
                    this.valueViviendaUF = this.valueViviendaUF.slice(0, -1) 
                }
            }
        },
        computed:{

        },
        mounted(){
            this.$refs.valorViviendaUF.focus()
            this.date_function()
            this.getUFToday()      
        }
});
