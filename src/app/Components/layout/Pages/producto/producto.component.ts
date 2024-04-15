import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';
import { Producto } from 'src/app/Interfaces/producto';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements AfterViewInit,OnInit {

  columnasTable: string[] = ['nombre','categoria','stock','precio','estado','acciones'];
  dataInicio:Producto[]=[];
  dataListaProductos = new MatTableDataSource(this.dataInicio);

  constructor(
    private dialog:MatDialog,
    private _productoServicio: ProductoService,
    private _utilidadServicio: UtilidadService
  ) { }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  @ViewChild(MatPaginator) paginacionTabla!:MatPaginator;

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator = this.paginacionTabla;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProductos.filter = filterValue.trim().toLowerCase();
  }

  obtenerProductos(){
    this._productoServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          this.dataListaProductos.data = data.value
        }else{
          this._utilidadServicio.mostrarAlerta("No se encontraron datos","Oops")
        }
      },
      error: (e) => {
        this._utilidadServicio.mostrarAlerta("Hubo un error", "Opps")
      }
    })
  }

  nuevoProducto(){
    this.dialog.open(ModalProductoComponent,{
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result === "true") {
        this.obtenerProductos();
      }
    });
  }

  editarProducto(producto:Producto){
    this.dialog.open(ModalProductoComponent,{
      disableClose: true,
      data: producto
    }).afterClosed().subscribe(result => {
      if (result === "true") {
        this.obtenerProductos();
      }
    });
  }

  eliminarProducto(producto:Producto){
    Swal.fire({
      title:'¿Desea eliminar el producto?',
      text: producto.nombre,
      icon: 'warning',
      confirmButtonColor:'#3085d6',
      confirmButtonText:'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((result)=> {
      if (result.isConfirmed) {
        this._productoServicio.eliminar(producto.idProducto).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta("El prodducto fue eliminado","Listo!");
              this.obtenerProductos();
            }else{
              this._utilidadServicio.mostrarAlerta("No se puede eliminar el producto","Error")
            }
          },
          error: (e)=>{}
        });
      }
    });
  }

}
