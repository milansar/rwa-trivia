import { Observable } from 'rxjs';
import { testData } from 'test/data';
import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { cold, hot } from 'jasmine-marbles';
import { TopicEffects } from './topic.effects';
import { TopicService } from 'shared-library/core/services';
import { TopicActions } from '../actions';

describe('Effects: TopicEffects', () => {
    let effects: TopicEffects;
    let actions$: Observable<any>;
    let topicService: TopicService;
    const topTopics: any[] = testData.topTopics;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                TopicActions,
                TopicEffects,
                {
                    provide: TopicService,
                    useValue: {}
                },
                provideMockActions(() => actions$),
            ],
        });
        effects = TestBed.get(TopicEffects);
        topicService = TestBed.get(TopicService);
        actions$ = TestBed.get(Actions);
    });

    it('Get top topics', () => {
        const action = new TopicActions().loadTopTopics();
        const completion = new TopicActions().loadTopTopicsSuccess(topTopics);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: topTopics });
        const expected = cold('--b', { b: completion });

        topicService.getTopTopics = jest.fn(() => response);
        expect(effects.getTopTopics$).toBeObservable(expected);
    });
});
