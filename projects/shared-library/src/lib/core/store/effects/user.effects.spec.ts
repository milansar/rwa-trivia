import { Observable } from 'rxjs';
import { GameService, UserService, Utils } from 'shared-library/core/services';
import { TestBed, async } from '@angular/core/testing';
import { UserActions } from '../actions';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { hot, cold } from 'jest-marbles';
import { testData } from 'test/data';
import { User, Game } from 'shared-library/shared/model';
import { UserEffects } from './user.effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CoreState, coreState } from '../reducers';
import { Store, MemoizedSelector } from '@ngrx/store';
import { empty, of } from 'rxjs';

describe('Effects: UserEffects', () => {
    let effects: UserEffects;
    let actions$: Observable<any>;
    let gameService: GameService;
    let userService: UserService;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                UserActions,
                UserEffects,
                {
                    provide: Utils,
                    useValue: {
                        setLoginFirebaseAnalyticsParameter(user: User) {
                            return of(user);
                        }
                    }
                },
                {
                    provide: GameService,
                    useValue: {}
                },
                {
                    provide: UserService,
                    useValue: {}
                },
                provideMockStore({
                    selectors: [
                        {
                            selector: coreState,
                            value: {}
                        }
                    ]
                }),
                provideMockActions(() => actions$),
            ],
        });
        effects = TestBed.get(UserEffects);
        gameService = TestBed.get(GameService);
        userService = TestBed.get(UserService);
        actions$ = TestBed.get(Actions);
        mockStore = TestBed.get(Store);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    }));

    it('Load user profile', () => {
        const user: User = testData.userList[0];
        const action = new UserActions().loginSuccess(user);
        const completion = new UserActions().addUserWithRoles(user);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: user });
        const expected = cold('--b', { b: completion });
        userService.loadUserProfile = jest.fn(() => {
            return response;
        });
        expect(effects.loadUserProfile$).toBeObservable(expected);
    });

    it('Load user account', () => {
        const user: User = testData.userList[0];
        const action = new UserActions().loginSuccess(user);
        const completion = new UserActions().loadAccountsSuccess(user.account);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: user.account });
        const expected = cold('--b', { b: completion });
        userService.loadAccounts = jest.fn(() => {
            return response;
        });
        expect(effects.loadUserAccounts$).toBeObservable(expected);
    });

    // it('Load other user profile', () => {
    //     const user: User = testData.userList[0];
    //     mockCoreSelector.setResult(user);
    //     // mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, user);
    //     mockStore.refreshState();
    //     const action = new UserActions().loadOtherUserProfile(user.userId);
    //     const completion = new UserActions().loadOtherUserProfileSuccess(user);
    //     actions$ = hot('-a---', { a: action });
    //     const response = cold('-a|', { a: user.account });
    //     const expected = cold('--b', { b: completion });
    //     userService.loadOtherUserProfile = jest.fn(() => {
    //         return response;
    //     });
    //     expect(effects.loadOtherUserProfile$).toBeObservable(expected);
    // });

    // it('Load other user exiended info', () => {
    //     const user: User = testData.userList[0];
    //     const action = new UserActions().loadOtherUserExtendedInfo(user.userId);
    //     const completion = new UserActions().loadOtherUserProfileWithExtendedInfoSuccess(user);
    //     // mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, (user));
    //     // mockStore.refreshState();
    //     actions$ = hot('-a---', { a: action });
    //     const response = cold('-a|', { a: user.account });
    //     const expected = cold('--b', { b: completion });
    //     userService.loadOtherUserProfileWithExtendedInfo = jest.fn(() => {
    //         return response;
    //     });
    //     expect(effects.loadOtherUserExtendedInfo$).toBeObservable(expected);
    // });
});
