Vue.component('titleapp',{
    template: //html 
        `
        <div>
            <h1>  {{titulo}}  <img src="img/iconHipo.png" width="40" height="40" style="margin-bottom:12px;">  </h1> 
            
        </div>
        `,
    data(){
        return{
            titulo: 'Calculadora Hipotecaria'
            }
        }

});