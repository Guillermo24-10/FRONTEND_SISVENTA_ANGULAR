import { Injectable } from '@angular/core';

import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Login } from '../Interfaces/login';
import { Observable } from 'rxjs';
import { ResponseApi } from '../Interfaces/response-api';
import { Usuario } from '../Interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlAPI:string = environment.endpoint + "Usuario/"

  constructor(
    private http:HttpClient
  ) { }

  iniciarSesion(request:Login):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlAPI}iniciarSesion`,request)
  }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlAPI}Lista`)
  }

  guardar(request:Usuario):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlAPI}Guardar`,request)
  }

  editar(request:Usuario):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlAPI}Editar`,request)
  }

  eliminar(id:number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlAPI}Eliminar/${id}`)
  }
}
