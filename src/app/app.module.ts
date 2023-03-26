import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { routing } from "./app.routing";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { InicioComponent } from './pages/inicio/inicio.component';
import { NavComponent } from './components/nav/nav.component';
import { NgbModule,NgbPaginationModule  } from "@ng-bootstrap/ng-bootstrap";

//Translation
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './pages/login/login.component';
import { CuentaComponent } from './pages/perfil/cuenta/cuenta.component';
import { DireccionesComponent } from './pages/perfil/direcciones/direcciones.component';
import { IndexProductoComponent } from './pages/productos/index-producto/index-producto.component';
import { ShowProductoComponent } from './pages/productos/show-producto/show-producto.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { PedidosComponent } from './pages/perfil/pedidos/pedidos.component';
import { DpedidosComponent } from './pages/perfil/dpedidos/dpedidos.component';
import { RatingModule } from 'ng-starrating';
import { VerifyPagoComponent } from './pages/verify-pago/verify-pago.component';
import { ReviewsComponent } from './pages/perfil/reviews/reviews.component';
import { EmbajadorasComponent } from './pages/static/embajadoras/embajadoras.component';
import { ImpactoComponent } from './pages/static/impacto/impacto.component';
import { NosotrosComponent } from './pages/static/nosotros/nosotros.component';
import { PoliticasEnvioComponent } from './pages/static/politicas-envio/politicas-envio.component';
import { TerminosCondicionesComponent } from './pages/static/terminos-condiciones/terminos-condiciones.component';
import { ContactoComponent } from './pages/static/contacto/contacto.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { ProductoComponent } from './components/producto/producto.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    NavComponent,
    FooterComponent,
    LoginComponent,
    CuentaComponent,
    DireccionesComponent,
    IndexProductoComponent,
    ShowProductoComponent,
    CarritoComponent,
    CheckoutComponent,
    PedidosComponent,
    DpedidosComponent,
    VerifyPagoComponent,
    ReviewsComponent,
    EmbajadorasComponent,
    ImpactoComponent,
    NosotrosComponent,
    PoliticasEnvioComponent,
    TerminosCondicionesComponent,
    ContactoComponent,
    NotfoundComponent,
    ProductoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    routing,
    FormsModule,
    HttpClientModule,
    NgbPaginationModule,
    RatingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [ HttpClient ]
      }
    }),
    NgxSkeletonLoaderModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
