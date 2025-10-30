// app/shared/directives/cpf-cnpj-mask.directive.ts
import { Directive, HostListener } from '@angular/core';

@Directive({ selector: '[cpfMask]', standalone: true })
export class CpfMaskDirective {
  @HostListener('input', ['$event'])
  onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 11);
    let out = digits;
    if (digits.length > 3) out = digits.replace(/(\d{3})(\d)/, '$1.$2');
    if (digits.length > 6) out = out.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    if (digits.length > 9) out = out.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    input.value = out;
  }
}

@Directive({ selector: '[cnpjMask]', standalone: true })
export class CnpjMaskDirective {
  @HostListener('input', ['$event'])
  onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 14);
    let out = digits;
    if (digits.length > 2) out = digits.replace(/(\d{2})(\d)/, '$1.$2');
    if (digits.length > 5) out = out.replace(/(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    if (digits.length > 8) out = out.replace(/(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
    if (digits.length > 12) out = out.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
    input.value = out;
  }
}
