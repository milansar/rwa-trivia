import { Observable } from 'rxjs';
import { testData } from 'test/data';
import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { cold, hot } from 'jasmine-marbles';
import { CategoryEffects } from './category.effects';
import { CategoryActions } from '../actions';
import { CategoryService } from 'shared-library/core/services';
import { Category } from 'shared-library/shared/model';

describe('Effects: CategoryEffects', () => {
    let effects: CategoryEffects;
    let actions$: Observable<any>;
    let categoryService: CategoryService;
    const categories: Category[] = testData.categoryList;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                CategoryActions,
                CategoryEffects,
                {
                    provide: CategoryService,
                    useValue: { getQuestionOfTheDay: jest.fn() }
                },
                provideMockActions(() => actions$),
            ],
        });
        effects = TestBed.get(CategoryEffects);
        categoryService = TestBed.get(CategoryService);
        actions$ = TestBed.get(Actions);
    });

    it('Load route categories', () => {
        const action = new CategoryActions().loadCategories();
        const completion = new CategoryActions().loadCategoriesSuccess(categories);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: categories });
        const expected = cold('--b', { b: completion });

        categoryService.getCategories = jest.fn(() => response);
        expect(effects.loadRouteCategories$).toBeObservable(expected);
    });

    it('Get top categories', () => {
        const action = new CategoryActions().loadTopCategories();
        const completion = new CategoryActions().loadTopCategoriesSuccess(categories);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: categories });
        const expected = cold('--b', { b: completion });

        categoryService.getTopCategories = jest.fn(() => response);
        expect(effects.getTopCategories$).toBeObservable(expected);
    });
});
