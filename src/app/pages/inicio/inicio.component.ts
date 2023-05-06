import { Component, OnInit } from '@angular/core';
import { isAvailable } from 'src/app/helpers/producto';
import { GuestService } from 'src/app/services/guest.service';
import { URL_SERVICES } from 'src/environments/environment';
declare function navigateCarousel():any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  public geo : any = {};
  public country = '';
  public currency = 'MXN';

  public mas_vendidos : Array<any> = [];
  public producto_destacado_uno :any = null;
  public producto_destacado_dos :any = null;
  public producto_destacado_tres :any = null;
  public producto_destacado_cuatro :any = null;
  public loadingDestacados: boolean = false;
  public url = URL_SERVICES;
  public productImgUrl = this.url + 'producto/portada/';
  public isAvailable = isAvailable;

  public newProducts: Array<any> = [];
  public loadingNewProductos: boolean = true;
  public items = [1,2,3,4,5,6];
  
  constructor(
    private _guestService:GuestService
  ) { 
    let lc_geo :any= localStorage.getItem('geo');
    this.geo = JSON.parse(lc_geo);
    this.country = this.geo.country_name;
    this.currency = this.geo.currency;
  }

  ngOnInit(): void {
    var head= document.getElementsByTagName('head')[0];
    var script= document.createElement('script');
    script.src= 'assets/js/main.js';
    head.appendChild(script);
    
    this.getFeaturedProducts();
    this.getNewProducts();
  }

  getFeaturedProducts(){
    this.loadingDestacados = true;
    this._guestService.listar_productos_destacados_publico().subscribe(
      response=>{
        this.mas_vendidos = response.data;
        
        if(this.mas_vendidos[0] != undefined){
          this.producto_destacado_uno =this.mas_vendidos[0];
        }else{
          this.producto_destacado_uno = null;
        }
        if(this.mas_vendidos[1] != undefined){
          this.producto_destacado_dos =this.mas_vendidos[1];
        }else{
          this.producto_destacado_dos = null;
        }
        if(this.mas_vendidos[2] != undefined){
          this.producto_destacado_tres =this.mas_vendidos[2];
        }else{
          this.producto_destacado_tres = null;
        }
        if(this.mas_vendidos[3] != undefined){
          this.producto_destacado_cuatro =this.mas_vendidos[3];
        }else{
          this.producto_destacado_cuatro = null;
        }
        
        this.loadingDestacados = false;
      }
    );
  }

  getNewProducts(){
    this.loadingNewProductos = true;
    this._guestService.listar_productos_nuevos_publico().subscribe(
      response=>{
        for(var item of response.data){
          item.producto.review = item.review,
          this.newProducts.push(item.producto);
        }
        
        this.loadingNewProductos = false;
      }
    );
  }

}
