import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { InicioComponent } from "./pages/inicio/inicio.component";
import { LoginComponent } from "./pages/login/login.component";
import { CuentaComponent } from "./pages/perfil/cuenta/cuenta.component";
import { DireccionesComponent } from "./pages/perfil/direcciones/direcciones.component";
import { IndexProductoComponent } from "./pages/productos/index-producto/index-producto.component";
import { ShowProductoComponent } from "./pages/productos/show-producto/show-producto.component";
import { CarritoComponent } from "./pages/carrito/carrito.component";
import { CheckoutComponent } from "./pages/checkout/checkout.component";
import { PedidosComponent } from "./pages/perfil/pedidos/pedidos.component";
import { DpedidosComponent } from "./pages/perfil/dpedidos/dpedidos.component";
import { VerifyPagoComponent } from "./pages/verify-pago/verify-pago.component";
import { ReviewsComponent } from "./pages/perfil/reviews/reviews.component";
import { EmbajadorasComponent } from "./pages/static/embajadoras/embajadoras.component";
import { ImpactoComponent } from "./pages/static/impacto/impacto.component";
import { NosotrosComponent } from "./pages/static/nosotros/nosotros.component";
import { PoliticasEnvioComponent } from "./pages/static/politicas-envio/politicas-envio.component";
import { TerminosCondicionesComponent } from "./pages/static/terminos-condiciones/terminos-condiciones.component";
import { ContactoComponent } from "./pages/static/contacto/contacto.component";
import { NotfoundComponent } from "./components/notfound/notfound.component";
import { AuthGuard } from "../app/guards/auth.guard";

const appRoute : Routes = [
    {path: '', component: InicioComponent},
    {path: 'login', component: LoginComponent},

    {path: 'cuenta/perfil', component: CuentaComponent, canActivate:[AuthGuard]},
    {path: 'cuenta/direcciones', component: DireccionesComponent, canActivate:[AuthGuard]},
    {path: 'cuenta/pedidos', component: PedidosComponent, canActivate:[AuthGuard]},
    {path: 'cuenta/pedidos/:id', component: DpedidosComponent, canActivate:[AuthGuard]},
    {path: 'cuenta/reviews', component: ReviewsComponent, canActivate:[AuthGuard]},

    {path: 'verificar-pago/:tipo/:direccion/:cupon/:envio/:tipo_descuento/:valor_descuento/:total_pagar/:subtotal', component: VerifyPagoComponent},

    {path: 'carrito', component: CarritoComponent},
    {path: 'checkout', component: CheckoutComponent, canActivate:[AuthGuard]},

    {path: 'productos', component: IndexProductoComponent},
    {path: 'productos/categoria/:categoria', component: IndexProductoComponent},
    {path: 'productos/:slug', component: ShowProductoComponent},

    {path: 'contacto', component: ContactoComponent},
    {path: 'embajadoras', component: EmbajadorasComponent},
    {path: 'impacto-social', component: ImpactoComponent},
    {path: 'nosotros', component: NosotrosComponent},
    {path: 'politicas-envio', component: PoliticasEnvioComponent},
    {path: 'terminos-condiciones', component: TerminosCondicionesComponent},
    {path: '**', component: NotfoundComponent}
]

export const appRoutingPorviders : any[]=[];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute, { onSameUrlNavigation: 'reload' });