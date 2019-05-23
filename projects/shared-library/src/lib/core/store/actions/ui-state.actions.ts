import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ActionWithPayload } from './action-with-payload';


@Injectable()
export class UIStateActions {

  static LOGIN_REDIRECT_URL = 'LOGIN_REDIRECT_URL';
  static APP_INSTALLATION_STATUS = 'APP_INSTALLATION_STATUS';
  static RESET_PASSWORD_NOTIFICATION_LOGS = 'RESET_PASSWORD_NOTIFICATION_LOGS';

  setLoginRedirectUrl(url?: string): ActionWithPayload<string> {
    return {
      type: UIStateActions.LOGIN_REDIRECT_URL,
      payload: url
    };
  }

  saveResetPasswordNotificationLogs(notificationLogs?: string[]): ActionWithPayload<string[]> {
    return {
      type: UIStateActions.RESET_PASSWORD_NOTIFICATION_LOGS,
      payload: notificationLogs
    };
  }

  setAppInstallationStatus(status?: boolean): ActionWithPayload<boolean> {
    return {
      type: UIStateActions.APP_INSTALLATION_STATUS,
      payload: status
    };
  }
}
