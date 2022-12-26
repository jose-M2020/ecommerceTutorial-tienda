import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuestService } from 'src/app/services/guest.service';
import { URL_SERVICES } from 'src/environments/environment';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  public url = URL_SERVICES;
  public token;
  public ordenes : Array<any> = [];
  public load_data = true;
  public user : any = {};

  public page = 1;
  public pageSize = 15;

  constructor(
    private __guestService:GuestService,
    private _router:Router
  ) { 
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data(){
    this.__guestService.obtener_ordenes_cliente(localStorage.getItem('_id'),this.token).subscribe(
      response=>{
        console.log(response);
        
        this.ordenes = response.data;
        this.load_data =false;
      }
    );
  }

}
