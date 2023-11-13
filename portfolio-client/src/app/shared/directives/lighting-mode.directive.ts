import {Directive, ElementRef, Input, OnInit, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appLightingMode]'
})
export class LightingModeDirective implements OnInit {


  @Input() lightingClasses!: string[];
  @Input() defaultClasses!: string[];
  @Input() isDarkMode: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.updateCssClasses();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('baseClasses' in changes || 'isDarkMode' in changes) {
      this.updateCssClasses();
    }
  }

  private updateCssClasses() {
    const modePrefix = this.isDarkMode ? 'dark' : 'light';

    // First, remove all classes to avoid duplicates
    this.el.nativeElement.className = '';

    // Apply default classes
    this.defaultClasses.forEach(defaultClass => {
      this.renderer.addClass(this.el.nativeElement, defaultClass);
    });

    this.lightingClasses.forEach(lightingClass => {
      const className = `${modePrefix}-${lightingClass}`;
      this.renderer.addClass(this.el.nativeElement, className);
    });
  }

}
