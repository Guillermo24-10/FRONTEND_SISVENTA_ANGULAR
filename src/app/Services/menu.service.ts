import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private urlAPI:string = environment.endpoint + "Menu/"
  
  constructor(
    private http:HttpClient
  ) { }

  lista(idUsuario:number):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlAPI}Lista?idUsuario=${idUsuario}`)
  }
}
