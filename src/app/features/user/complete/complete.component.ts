import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.css']
})
export class CompleteComponent implements OnInit{
  constructor(private router:Router){
    
  }
  ngOnInit(): void {
    
  }
  /**
   * Xử lý navigate về màn employeeList và truyền lại trạng thái được lưu từ localstorage sang màn list user.
   */
  navigateToEmployeeList(){
    const employeeState=JSON.parse(localStorage.getItem("employeeListState")||"null");
    if(employeeState){
      this.router.navigate(['/user/list'],{state:{
        currentPage: employeeState.currentPage,
        departmentId: employeeState.departmentId,
        employeeName: employeeState.employeeName,
        itemsPerPage: employeeState.itemsPerPage,
        sortByCertiName: employeeState.sortByCertiName,
        sortByEndDate: employeeState.sortByEndDate,
        sortByName: employeeState.sortByName,
      }})
    }
    else{
      this.router.navigate(['/user/list'])
    }
    localStorage.removeItem("employeeListState");
  }
}
