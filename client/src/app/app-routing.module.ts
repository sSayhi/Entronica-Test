import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserInfomationComponent } from './pages/user-infomation/user-infomation.component';
import { ContactInfomationComponent } from './pages/contact-infomation/contact-infomation.component';
import { AboutMeInfoComponent } from './pages/about-me-info/about-me-info.component';
import { ListUserComponent } from './pages/list-user/list-user.component';

const routes: Routes = [
  {
    path: 'entronica',
    children: [
      { path: 'list-user-info', component: ListUserComponent },
      { path: 'user-info', component: UserInfomationComponent },
      { path: 'user-info/:username', component: UserInfomationComponent },
      { path: 'contact-info', component: ContactInfomationComponent },
      { path: 'contact-info/:username', component: ContactInfomationComponent },
      { path: 'about-info', component: AboutMeInfoComponent },
      { path: 'about-info/:username', component: AboutMeInfoComponent },
    ],
  },
  { path: '', redirectTo: 'entronica/list-user-info', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
