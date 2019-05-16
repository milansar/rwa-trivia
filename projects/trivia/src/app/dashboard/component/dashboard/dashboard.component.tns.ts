import {
  Component, OnInit, Inject, NgZone, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { PLATFORM_ID } from '@angular/core';
import { QuestionActions, GameActions, UserActions } from 'shared-library/core/store/actions';
import { PlayerMode, GameStatus } from 'shared-library/shared/model';
import { WindowRef, Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { Dashboard } from './dashboard';
import { RouterExtensions } from 'nativescript-angular/router';
import { User, Game } from 'shared-library/shared/model';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Page } from 'tns-core-modules/ui/page/page';
import { Label } from 'tns-core-modules/ui/label';
import { AnimationCurve } from 'tns-core-modules/ui/enums';
import { Animation, AnimationDefinition } from 'tns-core-modules/ui/animation';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class DashboardComponent extends Dashboard implements OnInit, OnDestroy {

  gameStatus: any;
  subscriptions = [];
  // This is magic variable
  // it delay complex UI show Router navigation can finish first to have smooth transition
  renderView = false;

  userBits: Label;
  userBytes: Label;
  userLives: Label;
  dashboardAnimation: StackLayout;


  constructor(public store: Store<AppState>,
    questionActions: QuestionActions,
    gameActions: GameActions,
    userActions: UserActions, windowRef: WindowRef,
    @Inject(PLATFORM_ID) platformId: Object,
    ngZone: NgZone,
    utils: Utils,
    cd: ChangeDetectorRef,
    private routerExtension: RouterExtensions,
    private page: Page
  ) {

    super(store,
      questionActions,
      gameActions,
      userActions, windowRef,
      platformId,
      ngZone,
      utils,
      cd);
    this.gameStatus = GameStatus;
  }

  ngOnInit() {

    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => { this.userDict = userDict; this.cd.markForCheck(); }));
    // update to variable needed to do in ngZone otherwise it did not understand it
    this.page.on('loaded', () => this.ngZone.run(() => {
      this.renderView = true;
      this.cd.markForCheck();
      setTimeout(() => {
        this.animation();
      }, 800);
    }
    ));
  }

  async animation() {

    this.userBits = <Label>this.page.getViewById('userBits');
    this.userBytes = <Label>this.page.getViewById('userBytes');
    this.userLives = <Label>this.page.getViewById('userLives');
    this.dashboardAnimation = <StackLayout>this.page.getViewById('dashboard-animation');

    const definitions = new Array<AnimationDefinition>();

    const bits: AnimationDefinition = {
      target: this.userBits,
      duration: 3000,
      curve: AnimationCurve.easeInOut,
      rotate: 360
    };
    definitions.push(bits);

    const bytes: AnimationDefinition = {
      target: this.userBytes,
      duration: 3000,
      curve: AnimationCurve.easeInOut,
      rotate: 360
    };
    definitions.push(bytes);

    const lives: AnimationDefinition = {
      target: this.userLives,
      duration: 3000,
      curve: AnimationCurve.easeInOut,
      rotate: 360
    };
    definitions.push(lives);

    const first: AnimationDefinition = {
      target: this.dashboardAnimation,
      translate: { x: 0, y: -100 },
      duration: 3000
    };
    definitions.push(first);

    const animationSet = new Animation(definitions);

    try {
      await animationSet.play();
    } catch (error) {
      console.log(error);
    }

  }

  startNewGame() {
    if (this.applicationSettings && this.applicationSettings.lives.enable) {
      if (this.account.lives > 0) {
        this.routerExtension.navigate(['/game-play'], { clearHistory: true });
      }
    } else {
      this.routerExtension.navigate(['/game-play'], { clearHistory: true });
    }
  }

  filterGame(game: Game): boolean {
    return game.GameStatus === GameStatus.AVAILABLE_FOR_OPPONENT ||
      game.GameStatus === GameStatus.JOINED_GAME ||
      game.GameStatus === GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE
      || game.GameStatus === GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE;
  }


  filterSinglePlayerGame(game: Game): boolean {
    return Number(game.gameOptions.playerMode) === Number(PlayerMode.Single) && game.playerIds.length === 1;
  }

  filterTwoPlayerGame = (game: Game): boolean => {
    return Number(game.gameOptions.playerMode) === Number(PlayerMode.Opponent) &&
      (game.nextTurnPlayerId === this.user.userId);
  }

  filterTwoPlayerWaitNextQGame = (game: Game): boolean => {
    return game.GameStatus === GameStatus.WAITING_FOR_NEXT_Q && game.nextTurnPlayerId !== this.user.userId;
  }

  ngOnDestroy(): void {
    this.page.off('loaded');
  }
}


