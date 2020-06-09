import { Observable } from 'rxjs';
import { TagService } from 'shared-library/core/services';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { hot, cold } from 'jasmine-marbles';
import { testData } from 'test/data';
import { TagEffects } from './tag.effects';
import { TagActions } from '../actions';
import { RouterStateUrl } from 'shared-library/shared/model';
import { RoutesRecognized } from '@angular/router';
import { RouterNavigationPayload, RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';

describe('Effects: TagEffects', () => {
    let effects: TagEffects;
    let actions$: Observable<any>;
    let tagService: TagService;
    const tags: string[] = testData.tagList;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                TagActions,
                TagEffects,
                {
                    provide: TagService,
                    useValue: { getTags: jest.fn() }
                },
                provideMockActions(() => actions$),
            ],
        });
        effects = TestBed.get(TagEffects);
        tagService = TestBed.get(TagService);
        actions$ = TestBed.get(Actions);
    });

    it('Load route categories', () => {
        const completion = new TagActions().loadTagsSuccess(tags);
        const routerState: RouterStateUrl = { url: '/', queryParams: {}, params: {} };
        const event: RoutesRecognized = new RoutesRecognized(1, '/', '', null);
        const payload: RouterNavigationPayload<RouterStateUrl> = {
            routerState,
            event
        };
        const action: RouterNavigationAction<RouterStateUrl> = {
            type: ROUTER_NAVIGATION,
            payload
        };

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: tags });
        const expected = cold('--b', { b: completion });
        tagService.getTags = jest.fn(() => response);
        expect(effects.loadRouteCategories$).toBeObservable(expected);
    });

    it('Get top tags', () => {
        const action = new TagActions().loadTopTags();
        const completion = new TagActions().loadTopTagsSuccess(tags);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: tags });
        const expected = cold('--b', { b: completion });

        tagService.getTopTags = jest.fn(() => response);
        expect(effects.getTopTags$).toBeObservable(expected);
    });
});
