/**
 * Copyright(C) 2023 Luvina Software Company
 * ConfirmComponent.ts, July 15, 2023 Toannq
 */
import { Component, Input } from '@angular/core';
/**
 * Componet overlay loading
 * @author Toannq
 */
@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent {
  @Input() isShowLoading = true;
  constructor() {

  }

}
