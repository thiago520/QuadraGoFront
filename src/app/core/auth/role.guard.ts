import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { map } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const required = (route.data?.['roles'] as string[]) || [];

  return auth.currentUser$.pipe(
    map((user) => {
      if (!user) {
        router.navigateByUrl('/login');
        return false;
      }
      if (required.length === 0) return true;
      const ok = user.roles?.some((r) => required.includes(r));
      if (!ok) router.navigateByUrl('/forbidden');
      return !!ok;
    })
  );
};
