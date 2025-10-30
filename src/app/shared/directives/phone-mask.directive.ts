// app/shared/directives/phone-mask.directive.ts
import { Directive, HostListener, Input } from '@angular/core';

@Directive({ selector: '[phoneMask]', standalone: true })
export class PhoneMaskDirective {
  /** 'mobile' força 11 dígitos com 9; 'any' aceita 10 ou 11 (autoformata) */
  @Input('phoneMask') mode: 'mobile' | 'any' = 'any';

  @HostListener('input', ['$event'])
  onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    let d = input.value.replace(/\D/g, '');
    d = this.mode === 'mobile' ? d.slice(0, 11) : d.slice(0, 11);
    let out = d;

    if (d.length <= 10) {
      // (00) 0000-0000
      out = d
        .replace(/^(\d{0,2})/, '($1')
        .replace(/^\((\d{2})(\d{0,4})/, '($1) $2')
        .replace(/^\((\d{2})\) (\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else {
      // (00) 00000-0000
      out = d
        .replace(/^(\d{0,2})/, '($1')
        .replace(/^\((\d{2})(\d{0,5})/, '($1) $2')
        .replace(/^\((\d{2})\) (\d{5})(\d{0,4}).*/, '($1) $2-$3');
    }
    input.value = out;
  }
}
