import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ItemsComponent } from './components/items/items.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDesignModule } from './common/mat-design/mat-design.module';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { SpinnerModule } from './common/spinner/spinner.module';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { SharedModule } from './common/shared/shared.module';
import { ItemComponent } from './components/item/item.component';
import { ItemValueComponent } from './components/item-value/item-value.component';
import { ItemEditDialogComponent } from './components/item-edit-dialog/item-edit-dialog.component';
import { ComplectsComponent } from './components/complects/complects.component';
import { ComplectItemsComponent } from './components/complect-items/complect-items.component';
import { ComplectEditDialogComponent } from './components/complect-edit-dialog/complect-edit-dialog.component';
import { DialogModule } from './common/dialog/dialog.module';
import { InputsModule } from './common/inputs/inputs.module';
import { ResizableModule } from 'angular-resizable-element';
import { ItemsDiagramComponent } from './components/items-diagram/items-diagram.component';




@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    HomeComponent,
    ItemsComponent,
    LoginComponent,
    RegisterComponent,
    ItemComponent,
    ItemValueComponent,
    ItemEditDialogComponent,
    ComplectsComponent,
    ComplectItemsComponent,
    ComplectEditDialogComponent,
    ItemsDiagramComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatDesignModule,
    ReactiveFormsModule,
    SpinnerModule,
    SharedModule,
    InputsModule,
    DialogModule,
    ResizableModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
