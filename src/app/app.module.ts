import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutComponent } from './core/layout/layout.component';
import { LayoutModule } from './core/layout/layout.module';


@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
