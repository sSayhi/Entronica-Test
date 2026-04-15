import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EducationDTO } from 'src/app/models/education';
import { ExperienceDTO } from 'src/app/models/experience';
import { interestsDTO } from 'src/app/models/interests';
import { SkillDto } from 'src/app/models/skill';
import { EducationService } from 'src/app/service/education.service';
import { ExperienceService } from 'src/app/service/experience.service';
import { InterestsService } from 'src/app/service/interests.service';
import { SkillService } from 'src/app/service/skill.service';

@Component({
  selector: 'app-about-me-info',
  templateUrl: './about-me-info.component.html',
  styleUrls: ['./about-me-info.component.scss'],
})
export class AboutMeInfoComponent implements OnInit {
  educationForm!: FormGroup;
  experienceForm!: FormGroup;
  skillForm!: FormGroup;
  InterestsForm!: FormGroup;
  GuildForm!: FormGroup;

  arrEducation: EducationDTO[] = [];
  arrExperience: ExperienceDTO[] = [];
  arrSkills: SkillDto[] = [];
  arrInterests: interestsDTO[] = [];
  arrGuild: interestsDTO[] = [];

  externalUsername!: string | null;
  isView: boolean = false;
  isLoading: boolean = false;

  @ViewChild('educationModal') modalEducation!: ElementRef;
  @ViewChild('experienceModal') modalExperience!: ElementRef;
  @ViewChild('skilModal') modalSkill!: ElementRef;
  @ViewChild('InterestModal') modalInterst!: ElementRef;
  @ViewChild('guildModal') modalGuld!: ElementRef;

  ngOnInit(): void {

    if (this.externalUsername) {
      this.loadDataEducation(this.externalUsername);
      this.loadDataExperience(this.externalUsername);
      this.loadDataSkill(this.externalUsername);
      this.loadDataInterest(this.externalUsername);
    }
    this.route.queryParamMap.subscribe(queryParams => {
      this.isView = queryParams.get('view') === 'true';
    });
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private educationService: EducationService,
    private experienceService: ExperienceService,
    private skillService: SkillService,
    private interestService: InterestsService,
  ) {
    this.externalUsername = this.route.snapshot.paramMap.get('username');

    this.educationForm = this.fb.group({
      year: ['', [Validators.required, Validators.maxLength(4), Validators.pattern(/^[0-9]+$/)]],
      location: ['', Validators.required],
      user_id: ['']
    });

    this.experienceForm = this.fb.group({
      start_date: ['', [Validators.maxLength(4), Validators.pattern(/^[0-9]+$/)],],
      end_date: ['', [Validators.maxLength(4), Validators.pattern(/^[0-9]+$/)]],
      company: [''],
      position: [''],
      user_id: ['']
    });

    this.skillForm = this.fb.group({
      skill: ['', Validators.required],
      level: ['', [Validators.required, Validators.min(1), Validators.max(10), Validators.pattern(/^[0-9]+$/),]],
      user_id: ['']
    });

    this.InterestsForm = this.fb.group({
      name: ['', Validators.required],
      category_id: 1,
      user_id: ['']
    });

    this.GuildForm = this.fb.group({
      name: ['', Validators.required],
      user_id: [''],
      category_id: 2,
    });
  }

  /*----------------- EDUCATION -----------------*/
  addToEducationList() {
    if (this.externalUsername) {
      if (this.educationForm.valid) {
        const year = this.educationForm.value.year;
        const location = this.educationForm.value.location;
        const user_id = this.externalUsername || null;
        this.arrEducation.push({ location, year, user_id });
        this.OnSaveEducation();
        this.educationForm.reset();
        const el = this.modalEducation.nativeElement;
        const modal = (window as any).bootstrap.Modal.getOrCreateInstance(el);
        modal?.hide();
      } else {
        console.log('educationForm form is invalid');
      }
    } else {
      alert('ยังไม่ได้ลงทะเบียน username')
    }
  }

  removeEducation(EducationceNum: number) {
    this.arrEducation.splice(EducationceNum, 1);
    console.log('Remaining Experience:', this.arrEducation);
  }

  loadDataEducation(username: string) {
    this.educationService.getEducationById(username).subscribe(item => {
      if (item.Data.length > 0) {
        for (const element of item.Data) {
          this.arrEducation.push({
            location: element.location,
            year: element.year,
            user_id: this.externalUsername
          });
        }
      }
    });
  }

  OnSaveEducation() {
    this.isLoading = true;
    if (this.externalUsername) {
      if (this.educationForm.valid) {
        this.educationForm.patchValue({
          user_id: this.externalUsername
        });
        const education: EducationDTO = this.educationForm.getRawValue();
        this.educationService.createEducation(education).subscribe({
          next: (res) => {
            console.log("Update Education sucessfully");
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
    this.isLoading = false;
  }

  /* ----------------- Experience -----------------*/
  addToExperienceList() {
    if (this.externalUsername) {
      if (this.experienceForm.valid) {
        const company = this.experienceForm.value.company;
        const start_date = this.experienceForm.value.start_date;
        const end_date = this.experienceForm.value.end_date;
        const position = this.experienceForm.value.position;
        const user_id = this.externalUsername || null;
        this.arrExperience.push({ company, start_date, end_date, position, user_id });
        this.OnSaveExperience();
        this.experienceForm.reset();
        const el = this.modalExperience.nativeElement;
        const modal = (window as any).bootstrap.Modal.getOrCreateInstance(el);
        modal?.hide();
      } else {
        console.log('experienceForm form is invalid');
      }
    } else {
      alert('ยังไม่ได้ลงทะเบียน username')
    }
  }

  removeExperience(ExperienceNum: number) {
    this.experienceService.deleteExperience(this.arrExperience[ExperienceNum]).subscribe({
      next: (res) => {
        console.log("remove Experience sucessfully");
        this.arrExperience.splice(ExperienceNum, 1);
      },
      error(err) {
        console.error('Error :', err);
      },
      complete() {
        console.log('Upload complete');
      },
    })

  }

  loadDataExperience(username: string) {
    this.experienceService.getExperienceById(username).subscribe(item => {
      if (item.Data.length > 0) {
        for (const element of item.Data) {
          this.arrExperience.push({
            user_id: this.externalUsername,
            company: element.company,
            start_date: element.start_date,
            end_date: element.end_date,
            position: element.position
          });
        }
      }
    });
  }

  OnSaveExperience() {
    this.isLoading = true;
    if (this.experienceForm.valid) {
      this.experienceForm.patchValue({
        user_id: this.externalUsername
      });
      const experience: ExperienceDTO = this.experienceForm.getRawValue();

      this.experienceService.createExperience(experience).subscribe({
        next: (res) => {
          console.log("Update Experience sucessfully");
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
    this.isLoading = false;
  }


  /*----------------- SKILL -----------------*/
  addToSkillList() {
    if (this.externalUsername) {
      if (this.skillForm.valid) {
        const skill = this.skillForm.value.skill;
        const level = this.skillForm.value.level;
        const user_id = this.externalUsername;
        this.arrSkills.push({ skill, level, user_id });
        this.OnSaveSkill();
        this.skillForm.reset();
        const el = this.modalSkill.nativeElement;
        const modal = (window as any).bootstrap.Modal.getOrCreateInstance(el);
        modal?.hide();
      } else {
        console.log('Skill form is invalid');
      }
    } else {
      alert('ยังไม่ได้ลงทะเบียน username')
    }
  }
  loadDataSkill(username: string) {
    this.skillService.getSkilById(username).subscribe(item => {
      if (item.Data.length > 0) {
        for (const element of item.Data) {
          this.arrSkills.push({
            user_id: this.externalUsername,
            level: element.level,
            skill: element.skill
          });
        }

      }
    });
  }

  OnSaveSkill() {
    this.isLoading = true;
    if (this.skillForm.valid) {
      this.skillForm.patchValue({
        user_id: this.externalUsername
      });
      const skill: SkillDto = this.skillForm.getRawValue();

      this.skillService.createSkillInfo(skill).subscribe({
        next: (res) => {
          console.log("Update Skill sucessfully");
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
    this.isLoading = false;
  }

  /* ----------------- INTERESTS ----------------- */

  addToInterestList() {
    if (this.externalUsername) {
      if (this.InterestsForm.valid) {
        const name = this.InterestsForm.value.name;
        const category_id = this.InterestsForm.value.category_id;
        const user_id = this.externalUsername;
        this.arrInterests.push({ name, category_id, user_id });
        this.OnSaveInterest(1);
        this.InterestsForm.reset();
        const el = this.modalInterst.nativeElement;
        const modal = (window as any).bootstrap.Modal.getOrCreateInstance(el);
        modal?.hide();
      } else {
        console.log('InterestsForm is invalid');
      }
    } else {
      alert('ยังไม่ได้ลงทะเบียน username')
    }
  }

  removeInterest(interestsNum: number) {
    this.interestService.deleteInterest(this.arrInterests[interestsNum]).subscribe({
      next: (res) => {
        this.arrInterests.splice(interestsNum, 1);
        console.log('Remaining Guild:', this.arrGuild);
      },
      error(err) {
        console.error('Error :', err);
      },
      complete() {
        console.log('Upload complete');
      },
    })

    console.log('Remaining interests:', this.arrInterests);
  }

  /* GUILD */

  addToGuildList() {
    if (this.externalUsername) {
      if (this.GuildForm.valid) {
        const name = this.GuildForm.value.name;
        const category_id = this.GuildForm.value.category_id;
        const user_id = this.externalUsername;
        this.arrGuild.push({ name, category_id, user_id });
        this.OnSaveInterest(2);
        this.GuildForm.reset();

        const el = this.modalGuld.nativeElement;
        const modal = (window as any).bootstrap.Modal.getOrCreateInstance(el);
        modal?.hide();
      } else {
        console.log('GuildFormis invalid');
      }
    } else {
      alert('ยังไม่ได้ลงทะเบียน username')
    }
  }

  removeGuild(GuildNum: number) {
    this.interestService.deleteInterest(this.arrGuild[GuildNum]).subscribe({
      next: (res) => {
        this.arrGuild.splice(GuildNum, 1);
        console.log('Remaining Guild:', this.arrGuild);
      },
      error(err) {
        console.error('Error :', err);
      },
      complete() {
        console.log('Upload complete');
      },
    })

  }


  loadDataInterest(username: string) {
    this.interestService.getExperienceById(username).subscribe(item => {
      if (item.Data.length > 0) {
        for (const element of item.Data) {
          if (element.category_id === 1) {
            this.arrInterests.push({
              name: element.name,
              category_id: element.category_id,
              user_id: this.externalUsername
            })
          }
          if (element.category_id === 2) {
            this.arrGuild.push({
              name: element.name,
              category_id: element.category_id,
              user_id: this.externalUsername
            })
          }

        }
      }
    });
  }

  OnSaveInterest(category: number) {
    this.isLoading = true;
    if (category === 1) { // Interest
      if (this.InterestsForm.valid) {
        this.InterestsForm.patchValue({
          user_id: this.externalUsername,
          category_id: 1
        });
        const interest: interestsDTO = this.InterestsForm.getRawValue();

        this.interestService.createInterest(interest).subscribe({
          next: (res) => {
            console.log("Update Interest sucessfully");
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
    if (category === 2) { // Guild
      if (this.GuildForm.valid) {
        this.GuildForm.patchValue({
          user_id: this.externalUsername,
          category_id: 2
        });
        const guild: interestsDTO = this.GuildForm.getRawValue();

        this.interestService.createInterest(guild).subscribe({
          next: (res) => {
            console.log("Update Guild sucessfully");
          },
          error(err) {
            console.error('Error :', err);
          },
          complete() {
            console.log('Upload complete');
          },
        })
      }
    }
    this.isLoading = false;
  }
}
