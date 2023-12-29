import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {FormControl} from "@angular/forms";

@Directive({
  selector: '[appErrorMessage]'
})
export class ErrorMessageDirective implements OnInit {
  @Input('controlledFormCtrl') controlledFormCtrl!: FormControl;

  @Input('customTemplate') customTemplate!: TemplateRef<any>;

  constructor(private viewContainer: ViewContainerRef) {}

  static getValidatorErrorMessage(errorKey: string): string {
    type VType = keyof typeof ValidatorErrorMessage;
    const errorMessage = ValidatorErrorMessage[errorKey as VType];
    return `${errorMessage}`;
  }

  ngOnInit() {
    this.controlledFormCtrl.statusChanges.subscribe(() => {
      this.updateView();
    });
  }

  private updateView() {
    this.viewContainer.clear();
    if (this.controlledFormCtrl.invalid && (this.controlledFormCtrl.dirty || this.controlledFormCtrl.touched)) {
      Object.keys(this.controlledFormCtrl.errors!).forEach((errorKey) => {
        const context = { errorMessage: ErrorMessageDirective.getValidatorErrorMessage(errorKey) };
        const evr = this.viewContainer.createEmbeddedView(this.customTemplate, context);
        evr.detectChanges();
      });
    }
  }
}

enum ValidatorErrorMessage {
  email = "Entry is not valid. Value must be a valid email address.",
  minlength = "Entry is too short.",
  maxlength = "Entry is too long.",
  required = "Field(s) is required.",
}
