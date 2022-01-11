import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { timingSafeEqual } from 'crypto';
//import { url } from 'inspector';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModeloIdentificar } from '../modelos/identificar.modelo';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {
  url = 'http://localhost:3000';
  datosUsuarioEnSesion = new BehaviorSubject<ModeloIdentificar>(new ModeloIdentificar());
  constructor(private http: HttpClient) {
    this.verificarSesionActual();
   }

   verificarSesionActual(){
     let datos = this.obtenerInformacionSesion();
     if(datos){
       this.RefrescarDatosSesion(datos);
     }
   }

   RefrescarDatosSesion(datos: ModeloIdentificar){
     this.datosUsuarioEnSesion.next(datos)
   }

   ObtenerDatosUsuarioEnsesion(){
     return this.datosUsuarioEnSesion.asObservable();
   }

   Identificar(usuario:string, clave:string): Observable<ModeloIdentificar>{
     return this.http.post<ModeloIdentificar>(`${this.url}/identificarPersona`, {
       usuario: usuario,
       clave: clave
     },{
       headers: new HttpHeaders({

       })
     })

   }

   Almacenarsesion(datos: ModeloIdentificar){
    datos.estaIdentificado = true;
    let stringDatos = JSON.stringify(datos); 
    localStorage.setItem("datosSesion", stringDatos);
    this.RefrescarDatosSesion(datos);
   }

   obtenerInformacionSesion(){
     let datosString = localStorage.getItem("datosSesion");
     if(datosString){
       let datos = JSON.parse(datosString);
       return datos;
     }else{
       return null;
     }
   }

   ElimnarInformacionSesion(){
     localStorage.removeItem("datosSesion");
     this.RefrescarDatosSesion(new ModeloIdentificar());
   }

   SeHaIniciadoSesion(){
     let datosString = localStorage.getItem("datosSesion");
     return datosString;
   }

   obtenerToken(){
     let datosString = localStorage.getItem("datosSesion");
     if(datosString){
       let datos = JSON.parse(datosString);
       return datos.tk;
     }else{
       return '';
     }
   }
}
