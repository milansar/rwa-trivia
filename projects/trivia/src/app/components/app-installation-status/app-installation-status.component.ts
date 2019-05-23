import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from 'projects/trivia-admin/src/app/store';
import { Store } from '@ngrx/store';
import { UIStateActions } from 'shared-library/core/store/actions';

@Component({
  selector: 'app-app-installation-status',
  templateUrl: './app-installation-status.component.html'
})
export class AppInstallationStatusComponent implements OnInit {

  constructor(private _activatedRoute: ActivatedRoute,
     private store: Store<AppState>,
      private uiStateActions: UIStateActions,
      private router: Router) {
    _activatedRoute.queryParams.subscribe(
      params => {
        console.log('queryParams', params['status']);
        uiStateActions.setAppInstallationStatus(params['status']);
        router.navigate(['/dashboard']);
      });
  }

  ngOnInit() {
  }

}
