import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-system-error',
  templateUrl: './system-error.component.html',
})
export class SystemErrorComponent implements OnInit {
  message:any="System Error";

  ngOnInit(): void {
    this.message=history.state.message;


  }

}
