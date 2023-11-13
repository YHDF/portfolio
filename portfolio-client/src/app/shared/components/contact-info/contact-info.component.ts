import {Component, Input, OnInit} from '@angular/core';
import {ContactService} from "../contact/contact.service";
import {LightingModeService} from "../../services/lighting-mode.service";

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit{
  @Input() actionType : string = "";
  @Input() contactType: string = "";
  @Input() contactValue: string = "";
  @Input() isDarkMode : boolean = false;
  colorHex = "#7d7d7d"


  constructor(private readonly contactService : ContactService, private lightingModeService: LightingModeService) {
    this.lightingModeService.lightingMode$.subscribe(mode => {
      this.isDarkMode = mode === 'dark';
      this.colorHex = this.isDarkMode ? "#FFC87C" : "#7d7d7d"
    });
  }

  ngOnInit(): void {
  }


}
