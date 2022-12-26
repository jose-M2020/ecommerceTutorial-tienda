import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from '@auth0/angular-jwt';
import { URL_SERVICES } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  public url;
  private _headers = new HttpHeaders().set('Content-Type','application/json');

  constructor(
    private _http: HttpClient,
  ) { 
    this.url = URL_SERVICES;
  }

  obtener_ip_cliente():Observable<any>{
    return this._http.get('https://api.ipify.org/?format=json');
  }

  obtener_data_cliente(ip:any):Observable<any>{
    return this._http.get('https://ipapi.co/'+ip+'/json');
  }

  // PRODUCTOS
  // -------------------------------------------

  listar_productos_destacados_publico():Observable<any>{
    return this._http.get(this.url + 'producto/destacados',{headers: this._headers});
  }

  listar_productos_nuevos_publico():Observable<any>{
    return this._http.get(this.url + 'producto/nuevos',{headers: this._headers});
  }

  listar_productos_publico():Observable<any>{
    return this._http.get(this.url+'producto',{headers: this._headers});
  }

  obtener_variedades_productos_cliente(id:any):Observable<any>{
    return this._http.get(this.url+'producto/variedades/'+id,{headers: this._headers});
  }

  obtener_productos_slug_publico(slug:any):Observable<any>{
    return this._http.get(this.url+'producto/slug/'+slug,{headers: this._headers});
  }

  listar_productos_recomendados_publico(categoria:any):Observable<any>{
    return this._http.get(this.url+'producto/recomendados/'+categoria,{headers: this._headers});
  }

  getProductInventario(id:any):Observable<any>{
    return this._http.get(`${this.url}producto/${id}/inventario`,{headers: this._headers});
  }

  // CLIENTE
  // -------------------------------------------

  registro_cliente(data:any):Observable<any>{
    return this._http.post(this.url + 'registro',data, {headers: this._headers});
  }

  login_cliente(data:any):Observable<any>{
    return this._http.post(this.url+'login',data, {headers: this._headers});
  }

  obtener_cliente_guest(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'cliente/'+id,  {headers});
  }

  actualizar_perfil_cliente_guest(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url + 'cliente/'+id, data, {headers});
  }



  // -------------------------------------------

  get_Regiones():Observable<any>{
    return this._http.get('./assets/regiones.json');
  }
  get_Distritos():Observable<any>{
    return this._http.get('./assets/distritos.json');
  }
  get_Procincias():Observable<any>{
    return this._http.get('./assets/provincias.json');
  }
  get_Zonas():Observable<any>{
    return this._http.get('./assets/zonas.json');
  }

  // DIRECCIONES
  // -------------------------------------------

  registro_direccion_cliente(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url + 'direccion',data, {headers});
  }

  obtener_direccion_todos_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'direccion/cliente/'+id, {headers});
  }

  cambiar_direccion_principal_cliente(id:any,cliente:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'direccion/setDefault/'+id+'/'+cliente,{data: true, headers});
  }

  eliminar_direccion_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'direccion/delete/'+id, {headers});
  }

  // -------------------------------------------

  get_categorias():Observable<any>{
    return this._http.get('./assets/categorias.json');
  }

  // CARRITO
  // -------------------------------------------
  
  agregar_carrito_cliente(data:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'carrito', data,  {headers});
  }

  obtener_carrito_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'carrito/'+id,  {headers});
  }

  eliminar_carrito_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url+'carrito/'+id,  {headers});
  }

  comprobar_carrito_cliente(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'carrito/check', data,  {headers});
  }

  // VENTA
  // -------------------------------------------

  pedido_compra_cliente(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'venta/pedido', data, {headers});
  }

  obtener_ordenes_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'venta/cliente/'+id,  {headers});
  }

  obtener_detalles_ordenes_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'venta/'+id,  {headers});
  }

  consultarIDPago(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'venta/consultarIDPago/'+id,  {headers});
  }

  registro_compra_cliente(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'venta', data, {headers});
  }

  // -------------------------------------------

  validar_cupon_admin(cupon:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'cupon/validar/'+cupon, {headers});
  }

  // REVIEWS
  // -------------------------------------------

  emitir_review_producto_cliente(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url + 'review', data,  {headers});
  }

  obtener_review_producto_cliente(id:any):Observable<any>{
    return this._http.get(this.url+'review/producto/'+id, {headers: this._headers});
  }

  obtener_reviews_producto_publico(id:any):Observable<any>{
    return this._http.get(this.url+'review/producto/'+id+'/clientInfo',{headers: this._headers});
  }

  obtener_reviews_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'review/cliente/'+id, {headers});
  }

  // MERCADO PAGO
  // -------------------------------------------

  createToken(data:any):Observable<any>{
    let headers = new HttpHeaders()
    .set('Content-Type','application/json')
    .set('Authorization','Bearer TEST-1969113897364750-112421-c18d39f0a612f245314ee366ae06f407-242440663');
    return this._http.post('https://api.mercadopago.com/checkout/preferences',data, {headers});
  }

  obtenerPago(id:any):Observable<any>{
    let headers = new HttpHeaders()
    .set('Content-Type','application/json')
    .set('Authorization','Bearer TEST-1969113897364750-112421-c18d39f0a612f245314ee366ae06f407-242440663');
    return this._http.get('https://api.mercadopago.com/v1/payments/'+id, {headers});
  }

  // -------------------------------------------

  
  enviar_mensaje_contacto(data:any):Observable<any>{
    return this._http.post(this.url+'contacto',data, {headers: this._headers});
  }

  obtener_config_admin():Observable<any>{
    return this._http.get(this.url + 'config',{headers: this._headers});
  }
  verificar_token(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'verifyToken', {headers});
  }

  isAuthenticate(){
    const token : any = localStorage.getItem('token');
  
    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(token);

      if(!token){
        localStorage.clear();
        return false;
      }

      if(!decodedToken){
        localStorage.clear();
        return false;
      }
    
      if(helper.isTokenExpired(token)){
        localStorage.clear();
        return false;
      }

    } catch (error) {
      console.log(error);
      
      localStorage.clear();
      return false;
    }

    return true;
  }
}
