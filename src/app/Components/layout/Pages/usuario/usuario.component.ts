import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements AfterViewInit,OnInit {

  columnasTable: string[] = ['nombreCompleto','correo','rolDescripcion','esActivo','acciones'];
  dataInicio:Usuario[]=[];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);
  

  constructor(
    private dialog:MatDialog,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) { }
  
  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  @ViewChild(MatPaginator) paginacionTabla!:MatPaginator;

  ngAfterViewInit(): void {
    console.log(this.dataListaUsuarios);
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLowerCase();
  }

  obtenerUsuarios(){
    this._usuarioServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          this.dataListaUsuarios.data = data.value
        }else{
          this._utilidadServicio.mostrarAlerta("No se encontraron datos","Oops")
        }
      },
      error: (e) => {
        this._utilidadServicio.mostrarAlerta("Hubo un error", "Opps")
      }
    })
  }


  nuevoUsuario(){
    this.dialog.open(ModalUsuarioComponent,{
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result === "true") {
        this.obtenerUsuarios();
      }
    });
  }

  editarUsuario(usuario:Usuario){
    this.dialog.open(ModalUsuarioComponent,{
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(result => {
      if (result === "true") {
        this.obtenerUsuarios();
      }
    });
  }

  eliminarUsuario(usuario:Usuario){
    Swal.fire({
      title:'¿Desea eliminar el usuario?',
      text: usuario.nombreCompleto,
      icon: 'warning',
      confirmButtonColor:'#3085d6',
      confirmButtonText:'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((result)=> {
      if (result.isConfirmed) {
        this._usuarioServicio.eliminar(usuario.idUsuario).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta("El usuario fue eliminado","Listo!");
              this.obtenerUsuarios();
            }else{
              this._utilidadServicio.mostrarAlerta("No se puede eliminar el usuario","Error")
            }
          },
          error: (e)=>{}
        });
      }
    });
  }

}
