import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 0) {
          errorMessage = 'Unable to connect to the server';
        } else if (error.status === 404) {
          errorMessage = 'Resource not found';
        } else if (error.status === 403) {
          errorMessage = 'Access forbidden';
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized access';
        } else if (error.status >= 500) {
          errorMessage = 'Server error. Please try again later';
        }
      }

      console.error('HTTP Error:', error);
      return throwError(() => new Error(errorMessage));
    })
  );
};
