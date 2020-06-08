import {
    activeGames, newGameId, gameCreateStatus, updateUserReactionStatus, getUserReactionStatus,
    getQuestionSuccess, updateQuestionStatSuccess
} from './game.reducer';
import { GameActions, UserActions } from '../actions';
import { Game, Question } from 'shared-library/shared/model';
import { testData } from 'test/data';

describe('GameReducer: activeGames', () => {
    const _testReducer = activeGames;

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual([]);
    });

    it('Verify activeGames function when action type is `GET_ACTIVE_GAMES_SUCCESS`', () => {
        const games: Game[] = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });

        const newState: Game[] = _testReducer(games, { type: GameActions.GET_ACTIVE_GAMES_SUCCESS, payload: games });
        expect(newState).toEqual(games);
    });

    it('Verify activeGames function when action type is `LOGOFF`', () => {
        const newState: Game[] = _testReducer([], { type: UserActions.LOGOFF, payload: [] });
        expect(newState).toEqual([]);
    });
});

describe('GameReducer: newGameId', () => {
    const _testReducer = newGameId;

    it('Initial State', () => {
        const state: string = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual('');
    });

    it('Verify newGameId function when action type is `CREATE_NEW_SUCCESS`', () => {
        const games: Game[] = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });

        const newState: string = _testReducer(games[0].gameId, { type: GameActions.CREATE_NEW_SUCCESS, payload: games[0].gameId });
        expect(newState).toEqual(games[0].gameId);
    });

    it('Verify newGameId function when action type is `RESET_NEW`', () => {
        const newState: string = _testReducer(undefined, { type: GameActions.RESET_NEW, payload: null });
        expect(newState).toEqual('');
    });
});

describe('GameReducer: gameCreateStatus', () => {
    const _testReducer = gameCreateStatus;

    it('Initial State', () => {
        const state: String = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Verify gameCreateStatus function when action type is `CREATE_NEW_GAME_ERROR`', () => {
        const errorMsg = 'Something went wrong please try again later';

        const newState: String = _testReducer(errorMsg, { type: GameActions.CREATE_NEW_GAME_ERROR, payload: errorMsg });
        expect(newState).toEqual(errorMsg);
    });
});

describe('GameReducer: updateUserReactionStatus', () => {
    const _testReducer = updateUserReactionStatus;

    it('Initial State', () => {
        const state: any = _testReducer(undefined, { type: null });
        expect(state).toEqual(undefined);
    });

    it('Verify updateUserReactionStatus function when action type is `UPADTE_USER_REACTION_SUCCESS`', () => {
        const newState: any = _testReducer(null, { type: GameActions.UPADTE_USER_REACTION_SUCCESS, payload: null });
        expect(newState).toEqual(null);
    });
});

describe('GameReducer: getUserReactionStatus', () => {
    const _testReducer = getUserReactionStatus;

    it('Initial State', () => {
        const state: String = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Verify getUserReactionStatus function when action type is `GET_USER_REACTION_SUCCESS`', () => {
        const status = 'SUCCESS';

        const newState: any = _testReducer(status, { type: GameActions.GET_USER_REACTION_SUCCESS, payload: status });
        expect(newState).toEqual(status);
    });
});

describe('GameReducer: getQuestionSuccess', () => {
    const _testReducer = getQuestionSuccess;

    it('Initial State', () => {
        const state: String = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Verify getQuestionSuccess function when action type is `GET_QUESTION_SUCCESS`', () => {
        const question: Question = testData.question;

        const newState: any = _testReducer(question, { type: GameActions.GET_QUESTION_SUCCESS, payload: question });
        expect(newState).toEqual(question);
    });
});

describe('GameReducer: updateQuestionStatSuccess', () => {
    const _testReducer = updateQuestionStatSuccess;

    it('Initial State', () => {
        const state: String = _testReducer(undefined, { type: null });
        expect(state).toEqual(undefined);
    });

    it('Verify updateQuestionStatSuccess function when action type is `UPDATE_QUESTION_STAT_SUCCESS`', () => {
        const newState: any = _testReducer(null, { type: GameActions.UPDATE_QUESTION_STAT_SUCCESS, payload: null });
        expect(newState).toEqual(null);
    });
});
