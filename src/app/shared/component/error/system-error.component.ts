import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-system-error',
  templateUrl: './system-error.component.html',
})
export class SystemErrorComponent implements OnInit {
  message: any = 'System Error';
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      if (data['message']) {
        this.message = data['message'];
      }
    });
    if (history.state.message) {
      this.message = history.state.message;
    }
  }
}
