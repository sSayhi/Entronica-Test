import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {

  @Input() externalUsername: string | null = null;
  
  menuItems = [
    { path: '/entronica/list-user-info', label: 'Home', withParams: false },
    { path: '/entronica/user-info', label: 'user-information', withParams: true },
    { path: '/entronica/contact-info', label: 'contact-information', withParams: true },
    { path: '/entronica/about-info', label: 'About-Me', withParams: true }
  ];

}
