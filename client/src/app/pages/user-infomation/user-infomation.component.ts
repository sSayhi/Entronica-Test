import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { UserDTO } from 'src/app/models/user';
import { UserService } from 'src/app/service/user.service';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { Inject, LOCALE_ID } from '@angular/core';

interface CustomFile {
  file: File;
  category: string;
}

@Component({
  selector: 'app-user-infomation',
  templateUrl: './user-infomation.component.html',
  styleUrls: ['./user-infomation.component.scss'],
  // standalone: true,
})
export class UserInfomationComponent implements OnInit {
  userInfoForm: FormGroup;
  coverUrl: string = '';
  profileUrl: string = '';
  arr_File: CustomFile[] = [];
  externalUsername !: string | null;
  isLoading: boolean = false;
  isReadOnly: boolean = false;
  isView: boolean = false;

  ngOnInit(): void {
    this.externalUsername = this.route.snapshot.paramMap.get('username');
    
    this.route.queryParamMap.subscribe(queryParams => {
      this.isView = queryParams.get('view') === 'true';

      if (this.isView) {
        this.userInfoForm.disable()
        this.isReadOnly = true;
      }
    });
    if (this.externalUsername) {
      this.loadUserData(this.externalUsername);
    }
  }

  constructor(private fb: FormBuilder, private http: HttpClient, private userService: UserService, private router: Router, private route: ActivatedRoute) {
    this.userInfoForm = this.fb.group({
      username: ['', Validators.required],
      firstname: [''],
      lastname: [''],
      nickname: [''],
      position: [''],
      phone: ['', [Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      nationality: [''],
      start_date: [null],
    });
  }

  onUploadCoverImgae(event: any) {
    const file: File = event.target.files[0]; // ดึงไฟล์ที่เลือกมา

    if (file) {
      this.coverUrl = file.name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.coverUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      for (let i = this.arr_File.length - 1; i >= 0; i--) {
        if (this.arr_File[i].category === '1') {
          this.arr_File.splice(i, 1);
        }
      }
      this.arr_File.push({
        file: event.target.files[0],
        category: '1'
      });
    }
  }

  onUploadProfile(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.profileUrl = file.name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      for (let i = this.arr_File.length - 1; i >= 0; i--) {
        if (this.arr_File[i].category === '2') {
          this.arr_File.splice(i, 1);
        }
      }
      this.arr_File.push({
        file: event.target.files[0],
        category: '2'
      });
    }
  }

  onSubmit() {
    this.isLoading = true;
    if (!this.externalUsername) {
      // Create
      if (this.userInfoForm.valid) {
        const User: UserDTO = this.userInfoForm.getRawValue();
        const fd = new FormData();
        fd.append('User', JSON.stringify(User));
        this.arr_File.forEach((item) => {
          fd.append('BG_File', item.file, item.file.name);
          fd.append('Category', item.category);
        });

        this.userService.createUserProfile(fd).subscribe({
          next: (res) => {
            console.log("Create User sucessfully");
            alert("บันทึกสำเร็จ")
            this.router.navigate([`/entronica/user-info/`, res.userId])
          },
          error(err) {
            console.error('Error :', err);
          },
          complete() {
            console.log('Upload complete');

          },
        })
      } else {
        console.log('form form is invalid');
      }
    } else {
      //Update
      if (this.userInfoForm.valid) {
        const User: UserDTO = this.userInfoForm.getRawValue();
        const fd = new FormData();
        fd.append('User', JSON.stringify(User));
        this.arr_File.forEach((item) => {
          fd.append('BG_File', item.file, item.file.name);
          fd.append('Category', item.category);
        });
        this.userService.editUserProfile(fd).subscribe({
          next: (res) => {
            console.log("Edit User sucessfully");
            alert("บันทึกสำเร็จ")
            window.location.reload();
          },
          error(err) {
            console.error('Error :', err);
          },
          complete() {
            console.log('Upload complete');

          },
        })
      } else {
        console.log('form form is invalid');
      }
    }
    this.isLoading = false;
  }

  loadUserData(username: string) {
    this.userService.getByUsername(username).subscribe(item => {
      if (item.Data.length > 0) {
        this.userInfoForm.patchValue({
          username: item?.Data?.[0].username ?? '',
          firstname: item?.Data?.[0].firstname ?? '',
          lastname: item?.Data?.[0].lastname ?? '',
          nickname: item?.Data?.[0].nickname ?? '',
          position: item?.Data?.[0].position ?? '',
          phone: item?.Data?.[0].phone ?? '',
          nationality: item?.Data?.[0].nationality ?? '',
          start_date: this.formatDate(item?.Data?.[0].start_date ?? ''),
        });
        this.coverUrl = item.displayImage.find((Categoryimg: any) => Categoryimg.category === 1)?.url || '';
        this.profileUrl = item.displayImage.find((Categoryimg: any) => Categoryimg.category === 2)?.url || '';
        this.isReadOnly = true
      }
    });

  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);

    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
