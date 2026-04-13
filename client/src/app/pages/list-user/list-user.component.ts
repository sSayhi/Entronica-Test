import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/models/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {

  Datalist !: any[]

  ngOnInit(): void {
    this.getDatalistUser()
  }

  constructor(private userService : UserService , private router : Router){}

  getDatalistUser(){
    this.userService.getListData().subscribe(item =>{
      this.Datalist = item.Data;
    })
  }

   onRowClick(Username: string) {
    this.router.navigate([`/entronica/user-info`, Username]);
  }

}
