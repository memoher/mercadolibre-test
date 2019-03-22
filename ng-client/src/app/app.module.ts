import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { APIService } from './api.service';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ItemListComponent,
        ItemDetailsComponent,
        SearchBarComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [
        APIService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
