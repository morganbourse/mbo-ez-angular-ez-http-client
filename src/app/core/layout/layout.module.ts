import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FeaturesModule } from 'src/app/features/features.module';
import { CoreModule } from '../core.module';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { LayoutComponent } from './layout.component';

@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HeaderModule,
    FooterModule,
    CoreModule,
    FeaturesModule,
    MDBBootstrapModule.forRoot()
  ],
  exports: [
      LayoutComponent
  ]
})
export class LayoutModule { }
