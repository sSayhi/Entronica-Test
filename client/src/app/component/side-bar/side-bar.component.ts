import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  isView = false
  menuItems : any[] = []

  @Input() externalUsername: string | null = null;

  ngOnInit(): void {
    this.externalUsername = this.route.snapshot.paramMap.get('username');
    this.route.queryParamMap.subscribe(queryParams => {
      this.isView = queryParams.get('view') === 'true';
      console.log(this.isView);
      this.menuItems = [
        { path: '/entronica/list-user-info', label: 'Home', withParams: false, hide: false },
        { path: '/entronica/user-info', label: 'user-information', withParams: true, hide: this.isView },
        { path: '/entronica/contact-info', label: 'contact-information', withParams: true, hide: this.isView },
        { path: '/entronica/about-info', label: 'About-Me', withParams: true, hide: this.isView }
      ];
    });
  }

  constructor(private router: Router, private route: ActivatedRoute) { }



}
