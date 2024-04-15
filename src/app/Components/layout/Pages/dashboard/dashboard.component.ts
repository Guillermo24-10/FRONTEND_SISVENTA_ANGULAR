import { Component, OnInit } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { DashboardService } from 'src/app/Services/dashboard.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalIngresos: string = "0";
  totalVenta: string = "0";
  totalProductos: string = "0";


  constructor(
    private _dashboardServicio: DashboardService
  ) { }

  mostrarGrafico(labelGrafico: any[],dataGrafico: any[]) {
    const chartBarras = new Chart('chartBarras',{
      type: 'bar',
      data: {
        labels: labelGrafico,
        datasets:[{
          label:"# de Ventas",
          data: dataGrafico,
          backgroundColor: [
            'rgb(54,162,235,0.2)'
          ],
          borderColor:[
            'rgb(54,162,235,1)'
          ],
          borderWidth: 1
        }]
      },
      options:{
        maintainAspectRatio:false,
        responsive:true,
        scales:{
          y:{
            beginAtZero:true
          }
        }
      }
    })
  }

  ngOnInit(): void {

    this._dashboardServicio.resumen().subscribe({
      next:(data)=>{
        if (data.status) {
          this.totalIngresos = data.value.totalIngresos;
          this.totalVenta = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;

          const arrayData : any[] = data.value.ventasUltimaSemana;
          

          const labelTemp = arrayData.map((value) => value.fecha);
          const dataTemp = arrayData.map((value) => value.total);
          console.log(labelTemp,dataTemp);
          this.mostrarGrafico(labelTemp,dataTemp);
        }
      },
      error:(e)=>{}
    })
  }


}
