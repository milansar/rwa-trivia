import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as userActions from '../../../user/store/actions';
import { User, GameStatus, Game } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { userState } from '../../store';
import { Subscription, Observable } from 'rxjs';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
@Component({
  selector: 'recent-games',
  templateUrl: './recent-games.component.html',
  styleUrls: ['./recent-games.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe()
export class RecentGamesComponent implements OnInit, OnDestroy, AfterViewInit {

  user: User;
  recentGames: Game[] = [];
  startIndex = 0;
  nextIndex = 4;
  maxIndex = 10;
  GameStatus = GameStatus;
  recentGames$: Observable<Game[]>;
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};

  constructor(private store: Store<AppState>,
    private cd: ChangeDetectorRef) {

    this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user;
      this.store.dispatch(new userActions.GetGameResult(user));
    });

    this.recentGames$ = this.store.select(userState).pipe(select(s => s.getGameResult));
  }

  ngOnInit(): void {

  }

  getMoreCard() {
    this.nextIndex = (this.recentGames.length > (this.maxIndex)) ?
      this.maxIndex : this.recentGames.length;
  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {
    this.recentGames$.subscribe((recentGames) => {
      this.recentGames = recentGames;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    });
  }
}
