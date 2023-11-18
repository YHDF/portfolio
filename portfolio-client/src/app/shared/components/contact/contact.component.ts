import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {contactMailDto} from "./contact";
import {ContactService} from "./contact.service";
import {LightingModeService} from "../../services/lighting-mode.service";
import {SharedDataProviderService} from "../../services/shared-data-provider.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ContactComponent implements OnInit, OnDestroy {

  @ViewChildren('input') inputElements!: QueryList<ElementRef>;
  @ViewChild('textarea') textAreaField!: ElementRef;
  @ViewChild('button') buttonField!: ElementRef;

  isDarkMode: boolean = false;
  private inputName: string[] = ["mail", "name", "subject"]

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
    if (this.beforeSend()) {
      const name = this.getInputvalue("name");
      const mail = this.getInputvalue("mail");
      const subject = this.getInputvalue("subject");
      const message = this.textAreaField.nativeElement.value;
      const contactMail = new contactMailDto(name, mail, subject, message);
      console.log(contactMail)
      this.contactService.sendFormEmail(undefined, contactMail, undefined).subscribe(
        response => {
          // Handle the response here
          console.log('Response:', response);
        },
        error => {
          // Handle errors here
          console.error('Error:', error);
        }
      );
    }
  }

  getInputvalue(inputName: string): any {
    let inputValue : string = "";
    this.inputElements.map((item, index) => {
      if (item.nativeElement.name === inputName) {
        inputValue = item.nativeElement.value;
      }
    });
    return inputValue
  }

  beforeSend(): boolean {
    let readyToSend = true;
    console.log(this.inputElements.toArray().length)
    if (this.inputElements.toArray().length != 3) {
      console.error("Too many inputs");
      readyToSend = false;
    } else {
      this.inputElements.map(item => {
        if(!this.inputName.includes(item.nativeElement.name)){
          console.error("The form attributes were modified");
          readyToSend = false;
        }
      })
    }
    return readyToSend;
  }

  ngOnDestroy(): void {
  }


}
