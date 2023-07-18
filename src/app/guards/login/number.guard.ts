import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';


export const numberGuard: CanActivateFn = (route, state) => {

  if (inject(AuthService).getNumberIn() == false) {
    return inject(Router).navigate(['/number']);
  } else
  return true;
};






