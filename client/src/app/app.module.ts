import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserInfomationComponent } from './pages/user-infomation/user-infomation.component';
import { ContactInfomationComponent } from './pages/contact-infomation/contact-infomation.component';
import { NgbDateAdapter, NgbDateNativeAdapter, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SideBarComponent } from './component/side-bar/side-bar.component';
import { RouterModule , Router } from '@angular/router';
import { AboutMeInfoComponent } from './pages/about-me-info/about-me-info.component';
import { HttpClientModule } from '@angular/common/http';
import { ListUserComponent } from './pages/list-user/list-user.component';

@NgModule({
  declarations: [
    AppComponent,
    UserInfomationComponent,
    ContactInfomationComponent,
    SideBarComponent,
    AboutMeInfoComponent,
    ListUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule,
    NgbModalModule,
    HttpClientModule
  ],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}],
  bootstrap: [AppComponent]
})
export class AppModule { }
