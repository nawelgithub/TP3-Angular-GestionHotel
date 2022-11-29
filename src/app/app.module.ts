import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { HotelModule } from './hotels/hotel.module'
import { HttpClientModule } from '@angular/common/http';

registerLocaleData(localeFr,'fr');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HotelModule,
    AppRoutingModule
    
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
