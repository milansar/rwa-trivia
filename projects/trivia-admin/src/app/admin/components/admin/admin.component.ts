import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { UntilDestroy } from '@ngneat/until-destroy';
import { User } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';


@Component({
  selector: 'admin-dashboard',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

@UntilDestroy()
export class AdminComponent implements OnInit, OnDestroy {
  user: User;
  sub: any;

  constructor(private store: Store<AppState>,
    private router: Router) {
    this.sub = store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      if (!user || !user.roles['admin']) {
        this.router.navigate(['/']);

      }

      this.user = user;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {

  }
}
