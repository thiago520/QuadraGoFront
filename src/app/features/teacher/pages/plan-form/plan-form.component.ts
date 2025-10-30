
import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
  Optional,
  Inject,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

type Period = 'Mensal' | 'Bimestral' | 'Trimestral' | 'Semestral' | 'Anual';

interface PlanDto {
  id?: number;
  icon: string;
  title: string;
  price: number; // BRL (ex.: 59.9)
  period: Period;
  features: string[];
}

function atLeastOneNonEmptyFeature(): ValidatorFn {
  return (control: AbstractControl) => {
    const fa = control as FormArray<FormControl<string | null>>;
    const hasOne = fa.controls.some(
      (c) => (c.value ?? '').toString().trim().length > 0
    );
    return hasOne ? null : { minOneFeature: true };
  };
}

@Component({
  selector: 'app-plan-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogActions,
    MatDialogModule
],
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.scss'],
})
export class PlanFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  constructor(
    @Optional() private dialogRef?: MatDialogRef<PlanFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: Partial<PlanDto> | null
  ) {
    // Se vier via diálogo, já aplica
    if (data && (data.id != null || data.title || data.icon)) {
      this.applyIncomingData(data);
    }
  }

  planId = signal<number | null>(null);
  isEdit = computed(() => this.planId() !== null);
  pageTitle = computed(() =>
    this.isEdit() ? 'Editar Plano' : 'Criar Novo Plano'
  );
  pageSubtitle = 'Configure os detalhes do seu plano de assinatura';
  ctaLabel = computed(() => (this.isEdit() ? 'Atualizar' : 'Criar'));

  periods: Period[] = [
    'Mensal',
    'Bimestral',
    'Trimestral',
    'Semestral',
    'Anual',
  ];
  icons = [
  { value: 'group', label: 'Alunos' },
  { value: 'school', label: 'Educação' },
  { value: 'emoji_events', label: 'Troféu' },
  { value: 'api', label: 'Api' },
  { value: 'workspace_premium', label: 'Premium' },
  { value: 'star', label: 'Estrela' },
  { value: 'military_tech', label: 'Medalha' },
  { value: 'fitness_center', label: 'Academia' },
  { value: 'sports_soccer', label: 'Futebol' },
  { value: 'sports_basketball', label: 'Basquete' },
  { value: 'sports_tennis', label: 'Tênis' },
  { value: 'sports_handball', label: 'Handebol' },
  { value: 'sports_volleyball', label: 'Vôlei' },
  { value: 'self_improvement', label: 'Bem-estar' },
  { value: 'event', label: 'Agenda' },
  { value: 'insights', label: 'Relatórios' },
  { value: 'payments', label: 'Pagamentos' },
  { value: 'support_agent', label: 'Suporte' },
  { value: 'diamond', label: 'Diamante' },
];


  form: FormGroup = this.fb.group({
    icon: ['', Validators.required],
    title: ['', [Validators.required, Validators.minLength(3)]],
    price: ['', [Validators.required]], // máscara BRL string
    period: ['Mensal' as Period, Validators.required],
    features: this.fb.array<FormControl<string | null>>(
      [this.fb.control('', Validators.required)],
      { validators: [atLeastOneNonEmptyFeature()] }
    ),
  });

  get featuresFA(): FormArray<FormControl<string | null>> {
    return this.form.get('features') as FormArray<FormControl<string | null>>;
  }

  ngOnInit(): void {
    // Fallback por rota (edição navegada)
    if (!this.data) {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        const id = Number(idParam);
        if (!Number.isNaN(id)) {
          this.loadPlan(id);
        }
      }
    }
  }

  private applyIncomingData(dto: Partial<PlanDto>) {
    if (dto.id != null) this.planId.set(dto.id);
    this.form.patchValue({
      icon: dto.icon ?? '',
      title: dto.title ?? '',
      price: this.formatNumberToBRDecimal(dto.price ?? 0),
      period: dto.period ?? 'Mensal',
    });
    this.featuresFA.clear();
    (dto.features ?? ['']).forEach((f) =>
      this.featuresFA.push(this.fb.control(f, Validators.required))
    );
  }

  /** MOCK fallback por rota */
  private loadPlan(id: number) {
    const mock: PlanDto = {
      id,
      icon: 'emoji_events',
      title: 'Profissional',
      price: 59.9,
      period: 'Mensal',
      features: [
        'Até 200 alunos',
        'Agendamento avançado',
        'Relatórios detalhados',
      ],
    };
    this.applyIncomingData(mock);
  }

  // ===== Máscara BRL =====
  private formatNumberToBRDecimal(n: number): string {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  }
  private parseMaskedPriceToNumber(masked: string): number {
    if (!masked) return 0;
    const digits = masked.replace(/\D/g, '');
    const asNumber = Number(digits) / 100;
    return Number.isFinite(asNumber) ? asNumber : 0;
  }
  onPriceInput(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');
    const value = (Number(digits) || 0) / 100;
    const formatted = this.formatNumberToBRDecimal(value);
    this.form.get('price')?.setValue(formatted, { emitEvent: false });
  }
  onPriceBlur() {
    const ctrl = this.form.get('price');
    const numeric = this.parseMaskedPriceToNumber(ctrl?.value || '');
    ctrl?.setValue(this.formatNumberToBRDecimal(numeric), { emitEvent: false });
  }
  // =======================

  addFeature() {
    this.featuresFA.push(this.fb.control('', Validators.required));
  }
  removeFeature(i: number) {
    if (this.featuresFA.length > 1) {
      this.featuresFA.removeAt(i);
      this.featuresFA.updateValueAndValidity();
    }
  }

  cancel() {
    this.snack.open('Edição cancelada', 'Fechar', { duration: 2000 });
    if (this.dialogRef) {
      this.dialogRef.close(null);
    } else {
      this.router.navigate(['/dashboard/plans']);
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snack.open('Verifique os campos destacados.', 'Fechar', {
        duration: 2500,
        panelClass: 'snack-warn',
      });
      return;
    }

    const dto: PlanDto = {
      id: this.planId() ?? undefined,
      icon: this.form.value.icon,
      title: this.form.value.title.trim(),
      price: this.parseMaskedPriceToNumber(this.form.value.price),
      period: this.form.value.period,
      features: (this.form.value.features as string[])
        .map((s) => s.trim())
        .filter(Boolean),
    };

    // Aqui você chamaria a API. Vamos simular sucesso:
    const action = this.isEdit() ? 'Plano atualizado' : 'Plano criado';
    this.snack.open(action + ' com sucesso!', 'Fechar', {
      duration: 2500,
      panelClass: 'snack-success',
    });

    if (this.dialogRef) {
      this.dialogRef.close(dto); // retorna o DTO pra tela de planos atualizar a lista
      return;
    }

    // fallback por rota
    this.router.navigate(['/dashboard/plans']);
  }
}
