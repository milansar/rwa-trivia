import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import { ActionWithPayload, UIStateActions } from '../actions';

export function loginRedirectUrl(state: any = null, action: ActionWithPayload<string>): string {
  switch (action.type) {
    case UIStateActions.LOGIN_REDIRECT_URL:
      return action.payload;
    default:
      return state;
  }
};

export function resetPasswordLogs(state: any = [], action: ActionWithPayload<string[]>): string[] {
  switch (action.type) {
    case UIStateActions.RESET_PASSWORD_NOTIFICATION_LOGS:
      return action.payload;
    default:
      return state;
  }
};


export function appInstallationStatus(state: boolean = false, action: ActionWithPayload<boolean>): boolean {
  switch (action.type) {
    case UIStateActions.APP_INSTALLATION_STATUS:
      return action.payload;
    default:
      return state;
  }
}


