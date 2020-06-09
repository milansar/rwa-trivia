import { ApplicationSettingsEffects } from './application-settings.effects';
import { Observable } from 'rxjs';
import { testData } from 'test/data';
import { ApplicationSettingsActions } from '../actions';
import { ApplicationSettingsService } from '../../../core/services/application-settings.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { cold, hot } from 'jasmine-marbles';

describe('Effects: ApplicationSettingsEffects', () => {
    let effects: ApplicationSettingsEffects;
    let actions$: Observable<any>;
    let applicationSettingsService: ApplicationSettingsService;
    const applicationSettings: any[] = [];
    applicationSettings.push(testData.applicationSettings);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                ApplicationSettingsActions,
                ApplicationSettingsEffects,
                {
                    provide: ApplicationSettingsService,
                    useValue: { getQuestionOfTheDay: jest.fn() }
                },
                provideMockActions(() => actions$),
            ],
        });
        effects = TestBed.get(ApplicationSettingsEffects);
        applicationSettingsService = TestBed.get(ApplicationSettingsService);
        actions$ = TestBed.get(Actions);
    });

    it('Load application settings', () => {
        const action = new ApplicationSettingsActions().loadApplicationSettings();
        const completion = new ApplicationSettingsActions().loadApplicationSettingsSuccess(applicationSettings);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: applicationSettings });
        const expected = cold('--b', { b: completion });

        applicationSettingsService.getApplicationSettings = jest.fn(() => response);
        expect(effects.loadApplicationSettings$).toBeObservable(expected);
    });
});
