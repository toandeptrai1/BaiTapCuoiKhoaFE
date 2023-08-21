import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { FooterComponent } from './component/common/footer.component';
import { HeaderComponent } from './component/common/header.component';
import { OverlayComponent } from './overlay/overlay.component';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [HeaderComponent, FooterComponent, OverlayComponent],
  exports: [HeaderComponent, FooterComponent, OverlayComponent],
  imports: [
    CommonModule,
    AppRoutingModule
  ]
})
export class SharedModule {
}
