import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GuestService } from 'src/app/services/guest.service';
import { URL_SERVICES, URL_TIENDA } from 'src/environments/environment';
declare var $:any;
declare var iziToast:any;
declare var paypal:any;

interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
} 

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  @ViewChild('paypalButton',{static:true}) paypalElement : ElementRef;

  public direcciones :Array<any> = [];
  public token = localStorage.getItem('token');
  public load_data = false;
  public direccion : any = {
    pais: '',
    region: '',
    provincia: '',
    distrito: '',
    principal: false,
    zona: ''
  };

  public geo : any = {};
  public country = '';
  public currency = '';
  public defaultCurrency = 'MXN';
  public currencyPrice = '';

  public regiones:Array<any> = [];
  public provincias:Array<any> = [];
  public distritos:Array<any> = [];

  public regiones_arr:Array<any> = [];
  public provincias_arr:Array<any> = [];
  public distritos_arr:Array<any> = [];

  public zonas:Array<any> = [];
  public str_pais = '';
  public carrito_arr : Array<any> = [];
  public user_lc : any = undefined;  
  public subtotal = 0;
  public envio = 0;
  public total_pagar = 0;
  public url = URL_SERVICES;

  public direccion_envio : any = undefined;
  public metodo_pago = '';
  public btn_load = false;

  /***************************** */

  public venta : any = {};
  public dventa : Array<any> = [];
  public nota = '';
  public tipo_descuento = undefined;
  public valor_descuento = 0;

   /***************************** */

   public descuento = 0;
   public total_pagar_const = 0;
   public config: any = {};
   public envio_gratis= false;

  constructor(
    private _guestService:GuestService,
    private _router:Router
  ) { 

    let obj_lc :any= localStorage.getItem('user_data');
    this.user_lc = JSON.parse(obj_lc);
    let lc_geo :any= localStorage.getItem('geo');
    this.geo = JSON.parse(lc_geo);
    this.country = this.geo.country_name;
    this.currency = this.geo.currency;
    this.currencyPrice = this.currency === this.defaultCurrency ? 'precio' : 'precio_dolar';

    this._guestService.get_Regiones().subscribe(
      response=>{
        this.regiones_arr = response;
      }
    );

    this._guestService.get_Procincias().subscribe(
      response=>{
        this.provincias_arr = response;
      }
    );

    this._guestService.get_Distritos().subscribe(
      response=>{
        this.distritos_arr = response;
      }
    );

    this._guestService.get_Zonas().subscribe(
      response=>{
        let respuesta :Array<any> = response;
        this.zonas = respuesta.sort(function (a, b) {
          if (a.country > b.country) {
            return 1;
          }
          if (a.country < b.country) {
            return -1;
          }
          // a must be equal to b
          return 0;
        }); 
      }
    );
  }

  ngOnInit(): void {
    this.obtener_direccion();
    this.obtener_carrito();

    this._guestService.obtener_config_admin().subscribe(
      response=>{
        this.config = response.data;
        console.log(this.config);
        
      }
    );

    setTimeout(() => {
      $('.contpaypal').addClass('ocultar-paypal');
    }, 150);

    paypal.Buttons({
      style: {
          layout: 'horizontal',
          tagline : true
      },
      createOrder: (data:any,actions:any)=>{
        return actions.order.create({
          purchase_units : [{
            description : 'Pago en mi tienda',
            amount : {
              currency_code : 'USD',
              value: this.total_pagar
            },
          }]
        });
        
      },
      onApprove : async (data:any,actions:any)=>{
        const order = await actions.order.capture();
        console.log(order);

        this.venta.transaccion = order.purchase_units[0].payments.captures[0].id;
        this.venta.currency = this.currency === this.defaultCurrency ? this.defaultCurrency : 'USD';
        this.venta.subtotal = this.subtotal;
        this.venta.total_pagar = this.total_pagar;
        this.venta.envio_precio = this.envio;
        this.venta.detalles = this.dventa;
        this.venta.metodo_pago = 'Paypal';
        this.venta.nota = this.nota;
        this.venta.direccion = this.direccion_envio._id;
        this.venta.tipo_descuento = this.tipo_descuento;
        this.venta.valor_descuento = this.valor_descuento;
        let idcliente = localStorage.getItem('_id');
        this.venta.cliente = idcliente;

        this.btn_load = true;
        this._guestService.registro_compra_cliente(this.venta,this.token).subscribe(
          response=>{
            this.btn_load = false;
            this._router.navigate(['/cuenta/pedidos/'+response.data._id]);
          },
          error=>{
            console.log(error);
            
          }
        );
        
      },
      onError : (err:any) =>{
       
      },
      onCancel: function (data:any, actions:any) {
        
      }
    }).render(this.paypalElement.nativeElement);
  }

  obtener_direccion(){
    this._guestService.obtener_direccion_todos_cliente(localStorage.getItem('_id'),this.token).subscribe(
      response=>{
        this.direcciones = response.data;
        console.log(this.direcciones);
        
        this.load_data = false;
      }
    );
  }

  select_pais(){
    let str_select_pais = this.str_pais.split('_');
    let pais =str_select_pais[0];
    this.direccion.zona = str_select_pais[1];
    this.direccion.pais = pais;
    
    if(pais == 'México'){
      setTimeout(() => {
        $('#sl-region').prop('disabled', false);
      }, 50);
      // TODO: Get regiones by country
      this._guestService.get_Regiones().subscribe(
        response=>{
          response.forEach((element:any) => {
            this.regiones.push({
              id: element.id,
              name: element.name
            });
          });

        }
      );
    }else{
      setTimeout(() => {
        $('#sl-region').prop('disabled', true);
        $('#sl-provincia').prop('disabled', true);
        $('#sl-distrito').prop('disabled', true);
      }, 50);
      this.regiones = [];
      this.provincias = [];
      this.distritos = [];

      this.direccion.region = '';
      this.direccion.provincia = '';
      this.direccion.distrito = '';
      
    }
  }

  select_region(){
    this.provincias = [];
    setTimeout(() => {
      $('#sl-provincia').prop('disabled', false);
      $('#sl-distrito').prop('disabled', true);
    }, 50);
    this.direccion.provincia = '';
    this.direccion.distrito = '';
    // TODO: Get provincias by regiones
    this._guestService.get_Procincias().subscribe(
      response=>{
        response.forEach((element:any) => {
            if(element.department_id == this.direccion.region){
              this.provincias.push(
                element
              );
            }
        });
        console.log(this.provincias);
        
        
      }
    );
  }

  select_provincia(){
    this.distritos = [];
    setTimeout(() => {
      $('#sl-distrito').prop('disabled', false);
    }, 50);
    this.direccion.distrito= '';
    // TODO: Get distritos by  provincias
    this._guestService.get_Distritos().subscribe(
      response=>{
        response.forEach((element:any) => {
          if(element.province_id == this.direccion.provincia){
            this.distritos.push(
              element
            );
          }
      });
      console.log(this.distritos);
        
      }
    );
  }

  registrar(registroForm:any){
    if(registroForm.valid){
      
      this.regiones_arr.forEach(element => {
        if(parseInt(element.id) == parseInt(this.direccion.region)){
          this.direccion.region = element.name;
        }
      });

      this.provincias_arr.forEach(element => {
        if(parseInt(element.id) == parseInt(this.direccion.provincia)){
          this.direccion.provincia = element.name;
        }
      });

      this.distritos_arr.forEach(element => {
        if(parseInt(element.id) == parseInt(this.direccion.distrito)){
          this.direccion.distrito = element.name;
        }
      });

      let data = {
        nombres: this.direccion.nombres,
        apellidos: this.direccion.nombres,
        dni: this.direccion.dni,
        zip: this.direccion.zip,
        direccion: this.direccion.direccion,
        referencia: this.direccion.referencia,
        telefono: this.direccion.telefono,
        pais: this.direccion.pais,
        zona: this.direccion.zona,
        region: this.direccion.region,
        provincia: this.direccion.provincia,
        distrito: this.direccion.distrito,
        principal: this.direccion.principal,
        cliente: localStorage.getItem('_id')
      }

      console.log(data);
      this._guestService.registro_direccion_cliente(data,this.token).subscribe(
        response=>{
          this.direccion = {
            pais: '',
            region: '',
            provincia: '',
            distrito: '',
            principal: false,
            referencia: ''
          };
          $('#sl-region').prop('disabled', true);
          $('#sl-provincia').prop('disabled', true);
          $('#sl-distrito').prop('disabled', true);
          this.obtener_direccion();
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se agregó la nueva direccion correctamente.'
          });
        }
      );
     

    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son validos'
    });
    }
  }
  
  obtener_carrito(){
    this._guestService.obtener_carrito_cliente(this.user_lc._id,this.token).subscribe(
      response=>{
        this.carrito_arr = response.data;
        this.carrito_arr.forEach(element => { 
          this.dventa.push({
            producto: element.producto._id,
            subtotal: element.producto[this.currencyPrice],
            inventario: element.inventario._id,
            cantidad: element.cantidad,
            cliente: localStorage.getItem('_id')
          });  
        });
        this.calcular_carrito();
      }
    );
  }

  calcular_carrito(){
    this.subtotal = 0;

    this.carrito_arr.forEach(element => {
      let sub_precio = parseInt(element.producto[this.currencyPrice]) * element.cantidad;
      this.subtotal = this.subtotal + sub_precio;
      console.log('carrito', element.producto[this.currencyPrice])
    });

    this.total_pagar = this.subtotal;
    this.total_pagar_const = this.subtotal;
  }

  select_direccion_envio(item:any){
    this.envio_gratis = false;
    this.direccion_envio = item;
    if(this.direccion_envio?.pais != 'México'){
      if(this.direccion_envio?.zona == 'Zona 1'){
        this.envio = 12;
      }else if(this.direccion_envio?.zona == 'Zona 2'){
        this.envio = 18;
      }else if(this.direccion_envio?.zona == 'Zona 3'){
        this.envio = 24;
      }else if(this.direccion_envio?.zona == 'Zona 4'){
        this.envio = 35;
      }
    }else if(this.direccion_envio?.pais == 'México'){
      if(this.direccion_envio?.region == 'Lima'){
        this.envio = 10;
      }else if(this.direccion_envio?.region != 'Lima'){
        this.envio = 15;
      }
    }

    if(this.currency == this.defaultCurrency){
      if(this.total_pagar >= this.config.envio.monto_min_mexicanos){
        this.envio = 0;
        this.envio_gratis = true;
      }
    }else if(this.currency != this.defaultCurrency){
      if(this.total_pagar >= this.config.envio.monto_min_dolares){
        this.envio = 0;
        this.envio_gratis = true;
      }
    }

    if(this.venta.cupon != undefined){
      this.total_pagar = (this.total_pagar_const -this.descuento)+this.envio;
    }else{
      this.total_pagar = this.total_pagar_const +this.envio;
    }

    this.showPaypalButton();
  }

  get_token_culqi(){
    this._guestService.comprobar_carrito_cliente({detalles:this.dventa},this.token).subscribe(
      response=>{
        if(response.venta){
          const currency = this.currency === this.defaultCurrency ? this.defaultCurrency : 'USD'
          let items = [];
          
          this.carrito_arr.forEach(element => {
            items.push({
              title: element.producto.titulo,
              description: element.producto.descripcion,
              quantity: element.cantidad,
              currency_id: currency,
              unit_price: element.producto.precio
            });
          });

          items.push({
            title: 'Envio',
              description: 'Concepto de transporte y logistica',
              quantity: 1,
              currency_id: currency,
              unit_price: this.envio
          });

          if(this.venta.cupon){
            items.push({
              title: 'Descuento',
                description: 'Cupón aplicado ' + this.venta.cupon,
                quantity: 1,
                currency_id: currency,
                unit_price: -(this.descuento)
            });
          }

          const urlParams = `${this.direccion_envio._id}/${this.venta.cupon}/${this.envio}/${this.tipo_descuento}/${this.valor_descuento}/${this.total_pagar}/${this.subtotal}`;
          const data = {
            notification_url: 'https://hookb.in/6JlGBe8MYbsoRnwwRd1Z',
            items: items,
            back_urls: {
                failure: `${URL_TIENDA}verificar-pago/failure/${urlParams}`,
                pending: `${URL_TIENDA}verificar-pago/pending/${urlParams}`,
                success: `${URL_TIENDA}verificar-pago/success/${urlParams}`
            },
            auto_return: "approved"
          }

        
          this._guestService.createToken(data).subscribe(
            response=>{
              console.log(response);
              window.location.href =response.sandbox_init_point;
              
            }
          );
        }else{
          iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: response.message
          });
          this.btn_load = false;
        }
      }
    );
  }

  generar_pedido(tipo:any){
    this.venta.transaccion = 'Venta pedido';
    this.venta.currency = this.currency === this.defaultCurrency ? this.defaultCurrency : 'USD';
    this.venta.subtotal = this.subtotal;
    this.venta.total_pagar = this.total_pagar;
    this.venta.envio_precio = this.envio;
    this.venta.detalles = this.dventa;
    this.venta.metodo_pago = this.metodo_pago;
    this.venta.nota = this.nota;
    this.venta.direccion = this.direccion_envio._id;
    this.venta.tipo_descuento = this.tipo_descuento;
    this.venta.valor_descuento = this.valor_descuento;
    let idcliente = localStorage.getItem('_id');
    this.venta.cliente = idcliente;
    // console.log(this.venta);
    
    this.btn_load = true;
    this._guestService.pedido_compra_cliente(this.venta,this.token).subscribe(
      response=>{
        // console.log(response);
        
        if(response.venta != undefined){
          this.btn_load = false;
          this._router.navigate(['/cuenta/pedidos',response.venta._id]);
        }else{
          iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: response.message
          });
          this.btn_load = false;
        }
      }
    );
  }

  addCupon() {
    this.descuento = 0;
    if(this.venta.cupon){
      if(this.venta.cupon.toString().length <= 25){
        this._guestService.validar_cupon_admin(this.venta.cupon,this.token).subscribe(
          response=>{            
            if(response.data != undefined){
              this.tipo_descuento =  response.data.tipo;

              const isValid = this.validateCupon(response.data);
              
              if(isValid){
                if(response.data.tipo == 'Valor fijo'){
                  this.descuento = response.data.valor;
                  this.valor_descuento = this.descuento;
                  this.total_pagar = (this.total_pagar_const - this.descuento) + this.envio;
                }else if(response.data.tipo == 'Porcentaje'){
                  this.descuento =Math.round((this.total_pagar_const * response.data.valor)/100);
                  this.valor_descuento = this.descuento;
                  this.total_pagar = (this.total_pagar_const - this.descuento) + this.envio;
                }
                this.select_direccion_envio(this.direccion_envio);
              }
            }else{
              iziToast.show({
                  title: 'ERROR',
                  titleColor: '#ff0000',
                  color: '#FFF',
                  class: 'text-success',
                  position: 'topRight',
                  message: response.message
              });
            }
          }
        );
      }else{
        iziToast.show({
            title: 'ERROR',
            titleColor: '#ff0000',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'El cupon debe ser menos de 25 caracteres.'
        });
      }
    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#ff0000',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'El cupon no es valido.'
      });

    }
  }

  validateCupon(cupon: any): any {
    const establishedCurrency = this.currency === this.defaultCurrency ? 'MXN' : 'USD';
    const currency: any = {
      Mexico: 'MXN',
      Exterior: 'USD'
    }

    if(currency[cupon.disponibilidad] !== establishedCurrency){
      iziToast.show({
        title: 'ERROR',
        titleColor: '#ff0000',
        color: '#FFF',
        class: 'text-success',
        position: 'topRight',
        message: 'El cupón no es valido para tu país'
      });
      return false;
    }

    return true;
  }

  showPaypalButton(){
    if(this.direccion_envio != undefined && this.carrito_arr.length >= 1 && this.metodo_pago === 'PayPal'){
      $('.contpaypal').removeClass('ocultar-paypal');
    }else{
      $('.contpaypal').addClass('ocultar-paypal');
    }
  }

  metodoPagoChanged(event: any){
    this.metodo_pago = event.target.value;
    this.showPaypalButton();
  }
}
