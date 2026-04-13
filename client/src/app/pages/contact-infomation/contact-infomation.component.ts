import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ALL_SUBDISTRICTS } from 'src/app/models/adrees';
import { ContactDTO } from 'src/app/models/contact';
import { ContactService } from 'src/app/service/contact.service';

@Component({
  selector: 'app-contact-infomation',
  templateUrl: './contact-infomation.component.html',
  styleUrls: ['./contact-infomation.component.scss'],
})
export class ContactInfomationComponent implements OnInit {
  contactInfoForm: FormGroup;
  allDataAddres = ALL_SUBDISTRICTS;
  externalUsername: string | null = ""
  isReadOnly: boolean = false;

  subdistrictsList: any[] = [];
  districtsList: any[] = [];
  provincesList: any[] = [];
  zipcodeList: any[] = [];

  ngOnInit(): void {
    this.subdistrictsList = this.getSubDistricts();
    this.districtsList = this.getDistricts();
    this.provincesList = this.getProvinces();
    this.zipcodeList = this.getZipCodes();

    if (this.externalUsername) {
      this.loadUserData(this.externalUsername);
    }
  }

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private contactService: ContactService) {
    this.externalUsername = this.route.snapshot.paramMap.get('username');

    this.contactInfoForm = this.fb.group({
      address: ['', Validators.required],
      sub_district: ['', Validators.required],
      district: ['', Validators.required],
      province: ['', Validators.required],
      postal_code: ['', Validators.required],
      facebook: [''],
      line_id: [''],
      instagram: [''],
      user_id: ['']
    });
  }

  getDistricts() {
    const rawDistricts = this.allDataAddres.map(districtData => ({
      id: districtData.district.id,
      name_th: districtData.district.name_th,
      name_en: districtData.district.name_en,
      sud_district_id: districtData.id
    }));
    return [...new Map(rawDistricts.map((d) => [d.id, d])).values()];
  }

  getSubDistricts() {
    return this.allDataAddres.map(subDistrictsData => ({
      id: subDistrictsData.id,
      name_th: subDistrictsData.name_th,
      district_id: subDistrictsData.district_id,
      zip_code: subDistrictsData.zip_code,
    }));
  }

  getProvinces() {
    const rawProvinces = this.allDataAddres.map(provinceData => provinceData.district.province);
    return [...new Map(rawProvinces.map(p => [p.id, p])).values()];
  }

  getZipCodes() {
    const rawZip = this.allDataAddres.map(zip_codeData => zip_codeData.zip_code);
    return [...new Set(rawZip)].sort((a, b) => a - b);
  }

  onSubmit() {
    if (this.externalUsername) {
      if (this.contactInfoForm.valid) {
        this.contactInfoForm.patchValue({
          user_id: this.externalUsername
        });
        const contact: ContactDTO = this.contactInfoForm.getRawValue();

        this.contactService.createContact(contact).subscribe({
          next: (res) => {
            console.log("Update Contact sucessfully");
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
    } else {
      alert('ยังไม่ได้ลงทะเบียน username')
    }
  }

  loadUserData(username: string) {

    this.contactService.getContactById(username).subscribe(item => {
      if (item.Data.length > 0) {
        this.contactInfoForm.patchValue({
          address: item?.Data?.[0].address ?? '',
          sub_district: item?.Data?.[0].sub_district ?? '',
          district: item?.Data?.[0].district ?? '',
          province: item?.Data?.[0].province ?? '',
          postal_code: item?.Data?.[0].postal_code ?? '',
          facebook: item?.Data?.[0].facebook ?? '',
          line_id: item?.Data?.[0].line_id ?? '',
          instagram: item?.Data?.[0].instagram ?? '',
        });
        this.contactInfoForm.disable();
        this.isReadOnly = true;
      }

    });
  }
}
