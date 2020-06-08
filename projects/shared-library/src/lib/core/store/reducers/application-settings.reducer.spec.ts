import { applicationSettings } from './application-settings.reducer';
import { ApplicationSettingsActions } from '../actions';
import { testData } from 'test/data';

describe('ApplicationSettingsReducer: applicationSettings', () => {
    const _testReducer = applicationSettings;

    it('Initial State', () => {
        const state: any[] = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual([]);
    });

    it('Verify applicationSettings function when action type is `LOAD_APPLICATION_SETTINGS_SUCCESS`', () => {
        const applicationSetting: any[] = [];
        applicationSetting.push(testData.applicationSettings);

        const newState = _testReducer(applicationSetting,
            { type: ApplicationSettingsActions.LOAD_APPLICATION_SETTINGS_SUCCESS, payload: applicationSetting });

        expect(newState).toEqual(applicationSetting);
    });
});
