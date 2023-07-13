import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(
    private router: Router,
  ) { }

  logout() {
    sessionStorage.removeItem('access_token');
    this.router.navigate(['login']);
    return false;
  }
  handleScroll(){
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
  });
  }
}
