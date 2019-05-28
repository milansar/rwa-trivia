import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { android, AndroidActivityBackPressedEventData, AndroidApplication } from 'application';
import { RouterExtensions } from 'nativescript-angular/router';
import * as firebase from 'nativescript-plugin-firebase';
import * as Toast from 'nativescript-toast';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as Platform from 'platform';
import { filter } from 'rxjs/operators';
import { FirebaseAuthService } from 'shared-library/core/auth/firebase-auth.service';
import { NavigationService } from 'shared-library/core/services/mobile/navigation.service';
import { coreState } from 'shared-library/core/store';
import { ApplicationSettingsActions, UserActions } from 'shared-library/core/store/actions';
import { ApplicationEventData, on as applicationOn, resumeEvent } from 'tns-core-modules/application';
import * as gamePlayActions from '../../game-play/store/actions';
import { AppState } from '../../store';
import * as urlUtils from 'tns-core-modules/utils/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class AppComponent implements OnInit, OnDestroy {
  subscriptions = [];
  constructor(private store: Store<AppState>,
    private navigationService: NavigationService,
    private ngZone: NgZone,
    private routerExtension: RouterExtensions,
    private userActions: UserActions,
    private firebaseAuthService: FirebaseAuthService,
    private applicationSettingsAction: ApplicationSettingsActions) {


    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.newGameId), filter(g => g !== '')).subscribe(gameObj => {
      this.routerExtension.navigate(['/game-play', gameObj['gameId']]);
      this.store.dispatch(new gamePlayActions.ResetCurrentQuestion());
    }));

    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe(status => {
      if (status === 'MAKE FRIEND SUCCESS') {
        this.routerExtension.navigate(['user/my/invite-friends']);
      }
    }));

    this.handleBackPress();
  }

  ngOnInit() {

    firebase.init({
      onMessageReceivedCallback: (message) => {
        console.log('message', message);
        if (message.foreground) {
          Toast.makeText(message.body).show();
        }
        this.ngZone.run(() => this.navigationService.redirectPushRoutes(message.data));
      },
      showNotifications: true,
      showNotificationsWhenInForeground: true
    }).then(
      () => {
        console.log('firebase.init done');
        this.store.dispatch(this.applicationSettingsAction.loadApplicationSettings());
      },
      error => {
        console.log(`firebase.init error: ${error}`);
        this.store.dispatch(this.applicationSettingsAction.loadApplicationSettings());
      }
    );

    this.getDynamicLinkCallback();

    applicationOn(resumeEvent, (args: ApplicationEventData) => {
      firebase.getCurrentUser().then((user) => {
        this.firebaseAuthService.resumeState(user);
      });
      this.getDynamicLinkCallback();
    });

  }


  getDynamicLinkCallback(): void {
    firebase.addOnDynamicLinkReceivedCallback(
      (result) => {
        urlUtils.openUrl('http://192.168.0.23:4200/app-installation-status?status=true');
      }
    );

  }




  ngOnDestroy() {

  }


  handleBackPress() {
    if (!Platform.isAndroid) {
      return;
    }
    // every time app resume component is recreated
    // we want to ensure there is only one event listener in app
    android.off(AndroidApplication.activityBackPressedEvent);
    android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
      console.log(`can go back value${this.navigationService.canGoBack()}`);
      data.cancel = this.navigationService.canGoBack();
      this.ngZone.run(() => this.navigationService.back());
    }, this);
  }
}

