import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NgxJsonViewerModule } from "ngx-json-viewer";

import { DatepickerComponent } from "./datepicker/datepicker.component";

import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { UsersLoginComponent } from "./users/users-login/users-login.component";
import { UsersEditComponent } from "./users/users-edit/users-edit.component";
import { UsersFindPipe } from "./users/users-find.pipe";

import { AlertModule, TooltipModule } from "ngx-bootstrap";
import { ClientsComponent } from './clients/clients.component';
import { ClientsEditComponent } from './clients/clients-edit/clients-edit.component';
import { GatewaysComponent } from './gateways/gateways.component';
import { GatewaysEditComponent } from './gateways/gateways-edit/gateways-edit.component';
import { StatisticComponent } from './statistic/statistic.component';
import { BlacklistComponent } from './blacklist/blacklist.component';
import { TrunksComponent } from './trunks/trunks.component';
import { TrunksEditComponent } from './trunks/trunks-edit/trunks-edit.component';
import { SipBalancerEditComponent } from './sip-balancer/sip-balancer-edit/sip-balancer-edit.component';

@Pipe({name:"keys"})
export class KeysPipe implements PipeTransform {
    transform(value: Object) {
        return Object.keys(value);
    }
}

@Pipe({name:"length"})
export class LengthPipe implements PipeTransform {
    transform(value: any[]) {
        return value.length;
    }
}

const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'users/login', component: UsersLoginComponent },
  { path: 'users/edit/:id', component: UsersEditComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'clients/edit/:id', component: ClientsEditComponent },
  { path: 'gateways', component: GatewaysComponent },
  { path: 'gateways/edit/:id', component: GatewaysEditComponent },
  { path: 'statistic', component: StatisticComponent },
  { path: 'blacklist', component: BlacklistComponent },
  { path: 'trunks', component: TrunksComponent },
  { path: 'trunks/edit/:id', component: TrunksEditComponent },
  { path: 'sip-balancer/edit', component: SipBalancerEditComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UsersLoginComponent,
    UsersEditComponent,
    UsersFindPipe,
    ClientsComponent,
    ClientsEditComponent,
    ClientsEditComponent,
    ClientsEditComponent,
    ClientsEditComponent,
    GatewaysComponent,
    GatewaysEditComponent,
    KeysPipe,
    LengthPipe,
    DatepickerComponent,
    StatisticComponent,
    BlacklistComponent,
    TrunksComponent,
    TrunksEditComponent,
    SipBalancerEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes, { useHash: true }),
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    NgxJsonViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }