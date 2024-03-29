import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { GuestService } from 'src/app/services/guest.service';
declare var Slick:any;
declare var lightGallery:any;
declare var iziToast:any;
import { io } from "socket.io-client";
import { SOCKET, URL_SERVICES } from 'src/environments/environment';
import { isAvailable } from 'src/app/helpers/producto';
import { calcAverageRating } from '../../../helpers/producto';
declare var $:any;
declare function productLightbox():any;
declare function slickConfig():any;

@Component({
  selector: 'app-show-producto',
  templateUrl: './show-producto.component.html',
  styleUrls: ['./show-producto.component.css']
})
export class ShowProductoComponent implements OnInit {

  //GEO
  public geo : any = {};
  public country = '';
  public currency = 'MXN';
  public user_lc : any = undefined;
  public token :any = '';

  public data = false;
  public load_producto = true;
  public producto : any = {};
  public url = URL_SERVICES;
  public urlImg = this.url + 'producto/portada/';
  public reviews: Array<any> = [];
  public rating: any = {
    averageRating: 0
  };

  public isAvailable = isAvailable;

  public selectedVariety = '';
  public obj_variedad_select : any= {
    id: '',
    stock: 0,
    variedad: ''
  }
  public inventario :Array<any> = [];
  public carrito_data : any = {
    variedad: '',
    cantidad: 0
  };
  public addingItem: Boolean = false;

  public page = 1;
  public pageSize = 15;
  public productos_rec : Array<any> = [];
  public slug = '';

  public categoria_producto : any= {};
  public option_nav = 1;
  public socket = io(SOCKET);

  items = [1,2,3]

  constructor(
    private _guestService:GuestService,
    private _route:ActivatedRoute
  ) { 
    let obj_lc :any= localStorage.getItem('user_data');
    this.user_lc = JSON.parse(obj_lc);

    this.token = localStorage.getItem('token');
    this.url = URL_SERVICES;

    let lc_geo :any= localStorage.getItem('geo');
    this.geo = JSON.parse(lc_geo);
    this.country = this.geo.country_name;
    this.currency = this.geo.currency;

  }

  ngOnInit(): void {

    this._route.params.subscribe(
      params=>{
        this.slug = params['slug'];
        this.load_producto = true;
        this._guestService.obtener_productos_slug_publico(this.slug).subscribe(
          response=>{            
            if(response.data != undefined){
              this.producto = response.data;
              this.init_productos_recomendados();
              this._guestService.get_categorias().subscribe(
                response=>{
                  for(var item of response){
                    if(item._id == this.producto.categoria){
                      this.categoria_producto = item;
                    }
                  }
                }
              );
             
              
              setTimeout(() => {
                productLightbox();
                slickConfig();
              }, 100);

              this._guestService.obtener_reviews_producto_publico(this.producto._id).subscribe(
                response=>{
                  this.reviews = response.data;
                  this.rating.averageRating = calcAverageRating(this.reviews);
                }
              );


              /* this._guestService.listar_productos_recomendados_publico(this.producto.categoria).subscribe(
                response=>{
                  this.productos_rec = response.data;

                }
              ); */
              this.init_variedades();
              this.data = true;
              this.load_producto = false;
            }else{
              this.data = false;
              this.load_producto = false;
            }
          }
        );

      }
    );
  }

  init_variedades(){
    this._guestService.getProductInventario(this.producto._id).subscribe(
      response=>{
        this.inventario = response.data;
      }
    );
  }

  select_variedad(){
    const arrVariedad = this.selectedVariety.split('_');
    this.obj_variedad_select.id = arrVariedad[0];
    this.obj_variedad_select.variedad = arrVariedad[1];
    this.obj_variedad_select.stock = arrVariedad[2];
  }

  SumCant(){
    this.carrito_data.cantidad = this.carrito_data.cantidad + 1;
  }

  RestCant(){
    if(this.carrito_data.cantidad >= 1){
      this.carrito_data.cantidad = this.carrito_data.cantidad - 1;
    }
  }

  init_productos_recomendados(){
    this._guestService.listar_productos_recomendados_publico(this.producto.categoria).subscribe(
      response=>{
        for(var item of response.data){
          item.producto.review = item.review,
          this.productos_rec.push(item.producto);
        }
      }
    );
  }

  addItemToCart(){
    if(this.addingItem) return;

    if(this.obj_variedad_select.variedad){
      if(this.carrito_data.cantidad >= 1){

        if(this.carrito_data.cantidad <= this.obj_variedad_select.stock){
          let data = {
            producto: this.producto._id,
            cliente: localStorage.getItem('_id'),
            cantidad: this.carrito_data.cantidad,
            inventario: this.obj_variedad_select.id,
          }
          this.addingItem = true;
          
          this._guestService.agregar_carrito_cliente(data, this.token).subscribe(
            response=>{
              if(response.data == undefined){
                iziToast.show({
                    title: 'ERROR',
                    titleColor: '#FF0000',
                    color: '#FFF',
                    class: 'text-danger',
                    position: 'topRight',
                    message: response.message
                });
                this.addingItem =false;
              }else{

                iziToast.show({
                    title: 'SUCCESS',
                    titleColor: '#1DC74C',
                    color: '#FFF',
                    class: 'text-success',
                    position: 'topRight',
                    message: 'Se agregó el producto al carrito.'
                });
                this.socket.emit('add-carrito-add',{data:true});
                this.addingItem =false;
              }
            }, err => console.log(err)
          );
        }else{
          iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: 'La cantidad máxima del producto es.' + this.obj_variedad_select.stock
          });
        }
      }else{
        iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Ingrese una cantidad válida por favor.'
        });
      }
   }else{
    iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Seleccione una variedad de producto'
    });
  }
  }

  addItemToGuestCart(){
    if(this.obj_variedad_select.variedad){
     

      if(this.carrito_data.cantidad >= 1){
        if(this.carrito_data.cantidad <= this.obj_variedad_select.stock){
          let data = {
            producto: this.producto,
            variedad: this.obj_variedad_select,
            cantidad: this.carrito_data.cantidad,
          }
          let ls_carrito_guest = localStorage.getItem('cart');
          if(ls_carrito_guest == null){
            let arr_carrito = [];
            arr_carrito.push(data);
            localStorage.setItem('cart',JSON.stringify(arr_carrito));
          }else{
            let arr_carrito = JSON.parse(ls_carrito_guest);
            localStorage.removeItem('cart');
            arr_carrito.push(data);
            localStorage.setItem('cart',JSON.stringify(arr_carrito));
          }
  
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se agregó el producto a tu carrito.'
          });
  
          this.obj_variedad_select= {
            id: '',
            stock: 0,
            variedad: ''
          }
          this.carrito_data.cantidad = 0;
          this.selectedVariety = '';
          this.socket.emit('add-carrito-add',{data:true});
        }else{
          iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: 'La cantidad máxima del producto es.' + this.obj_variedad_select.stock
          });
        }
      }else{
        iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Ingrese una cantidad valida.'
        });
      }
    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Seleccione una variedad de producto.'
      });
    }
  }

  change_option(op:any){
    this.option_nav = op;
  }
}
