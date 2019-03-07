import { Component, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { User } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe()
export class SideNavComponent implements OnDestroy {
  @Input() user: User;
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};
  blogUrl = 'https://bitwiser.io';

  constructor(private store: Store<AppState>, private router: Router, private utils: Utils) {
    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.userDict$.subscribe(userDict => this.userDict = userDict);
  }

  ngOnDestroy() {

  }
}
