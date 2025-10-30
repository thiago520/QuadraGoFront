// app/shared/validators/br-validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** -------- CPF -------- */
export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = (control.value ?? '').toString();
    const digits = v.replace(/\D/g, '');
    if (!digits) return null; // required cuida do vazio
    if (digits.length !== 11) return { cpfInvalid: true };
    if (/^(\d)\1{10}$/.test(digits)) return { cpfInvalid: true };

    const calc = (base: string, factor: number) => {
      let total = 0;
      for (const n of base.split('')) total += parseInt(n, 10) * factor--;
      const rest = total % 11;
      return rest < 2 ? 0 : 11 - rest;
    };
    const d1 = calc(digits.slice(0, 9), 10);
    const d2 = calc(digits.slice(0, 9) + d1, 11);
    return digits.endsWith(`${d1}${d2}`) ? null : { cpfInvalid: true };
  };
}

/** -------- CNPJ -------- */
export function cnpjValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = (control.value ?? '').toString();
    const digits = v.replace(/\D/g, '');
    if (!digits) return null;
    if (digits.length !== 14) return { cnpjInvalid: true };
    if (/^(\d)\1{13}$/.test(digits)) return { cnpjInvalid: true };

    const calc = (base: string) => {
      const weights = [6,5,4,3,2,9,8,7,6,5,4,3,2];
      let sum = 0;
      for (let i = 0; i < base.length; i++) {
        sum += parseInt(base[i], 10) * weights[i + (weights.length - base.length)];
      }
      const rest = sum % 11;
      return rest < 2 ? 0 : 11 - rest;
    };
    const d1 = calc(digits.slice(0, 12));
    const d2 = calc(digits.slice(0, 12) + d1);
    return digits.endsWith(`${d1}${d2}`) ? null : { cnpjInvalid: true };
  };
}

/** -------- Telefone BR --------
 * Celular: 11 dígitos (com 9)
 * Fixo: 10 dígitos
 */
export function phoneValidator(kind: 'mobile' | 'any' = 'any'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = (control.value ?? '').toString();
    const d = v.replace(/\D/g, '');
    if (!d) return null; // required cuida do vazio
    if (kind === 'mobile') {
      // Ex.: (11) 9 8765-4321 => 11 dígitos e 3º dígito deve ser 9 (após DDD)
      const ok = d.length === 11 && d[2] === '9';
      return ok ? null : { phoneInvalid: true };
    }
    // any: aceita 10 (fixo) ou 11 (celular)
    const ok = d.length === 10 || d.length === 11;
    return ok ? null : { phoneInvalid: true };
  };
}

/** -------- Data de nascimento: não pode ser futura -------- */
export function notFutureDate(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (!v) return null;
    const d = new Date(v);
    if (isNaN(d.getTime())) return { invalidDate: true };
    const today = new Date();
    // Zera horas para comparar apenas a data
    today.setHours(0,0,0,0);
    d.setHours(0,0,0,0);
    return d <= today ? null : { futureDate: true };
  };
}
