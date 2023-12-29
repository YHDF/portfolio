import {AfterViewChecked, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {contactMailDto} from "./contact";
import {ContactService} from "./contact.service";
import {LightingModeService} from "../../services/lighting-mode.service";
import {SharedDataProviderService} from "../../services/shared-data-provider.service";
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ContactComponent implements OnInit, OnDestroy, AfterViewChecked {

  isDarkMode: boolean = false;
  contactForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    fullName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    subject: new FormControl('', Validators.required),
    message: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });

  globalErrorMessage: string = "";

  constructor(private readonly contactService : ContactService, private lightingModeService: LightingModeService,
  private readonly sharedDataProviderService : SharedDataProviderService) {
    this.sharedDataProviderService.showHeaderSubject$.next(true)
    this.lightingModeService.lightingMode$.subscribe(mode => {
      this.isDarkMode = mode === 'dark';
    });
  }

  ngOnInit(): void {
  }

  sendEmail() {
    if (this.isFormValid()) {
      const name = this.contactForm.controls.fullName.value!;
      const mail = this.contactForm.controls.email.value!;
      const subject = this.contactForm.controls.subject.value!;
      const message = this.contactForm.controls.message.value!;
      const contactMail = new contactMailDto(name, mail, subject, message);
      this.contactService.sendFormEmail(undefined, contactMail, undefined).subscribe(
        response => {
          // Handle the response here
          console.log('Response:', response);
          this.contactForm.reset();
        },
        error => {
          // Handle errors here
          console.error('Error:', error);
        }
      );
    }else{
      this.globalErrorMessage = `Failed to send. Form is invalid.`
    }
  }

   isFormValid = () => this.contactForm.valid ;


  ngOnDestroy(): void {
  }


  ngAfterViewChecked(): void {
  }
}

