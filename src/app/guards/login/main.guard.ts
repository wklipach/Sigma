import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';



export const mainGuard: CanActivateFn = (route, state) => {
 
  if (inject(AuthService).getLoggedIn()){
    return true
  } else {

    return inject(Router).navigate(['/login']);

  }

};

