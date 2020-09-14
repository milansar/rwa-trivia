import { TestBed, getTestBed, inject } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';
import { UserService } from './user.service';
import { CONFIG } from '../../environments/environment';
import { DbService } from '../db-service';
import { Utils } from './utils';
import { testData } from 'test/data';
import { GameOperations, ResponseMessagesConstants, RoutesConstants } from './../../shared/model';
import { addressSuggestion } from '../../../../../../test/data/address-suggestion';

describe('UserService:', () => {
    let userService: UserService;
    let httpMock: HttpTestingController;
    const RC = RoutesConstants;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UserService, DbService, {
                provide: Utils,
                useValue: {
                }
            }],
            imports: [
                HttpClientTestingModule
            ],
        });
        userService = TestBed.get(UserService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });



    describe('#getUsers', () => {
        it(`it should tru`, () => {
            expect(true).toBeTruthy();
        });
    });

    it(`firstQuestionSetBits should return success message`, () => {
        const response = { status: ResponseMessagesConstants.BITS_ADDED };
        userService.firstQuestionSetBits('userId').subscribe(data => {
            expect(data.status).toBe(ResponseMessagesConstants.BITS_ADDED);
        });

        // We set the expectations for the HttpClient mock
        const req = httpMock.expectOne(`${CONFIG.functionsUrl}/user/add-bits-first-question`);
        expect(req.request.method).toEqual('GET');

        // Then we set the fake data to be returned by the mock
        req.flush(response);
    });

    it(`getAddressSuggestions should return address suggestion`, () => {
        const address = 'new york';
        const response = testData.addressSuggestion;
        userService.getAddressSuggestions(address).subscribe(addSuggestion => {
            expect(addSuggestion).toBe(response);
        });

        // We set the expectations for the HttpClient mock
        const req = httpMock.expectOne(`${CONFIG.functionsUrl}/${RC.USER}/${RC.ADDRESS_SUGGESTION}/${address}`);
        expect(req.request.method).toEqual('GET');

        // Then we set the fake data to be returned by the mock
        req.flush(response);
    });


    it(`getAddressByLatLang should return addSuggestion`, () => {

        const latlong = '23.0293504,72.55818239999999';
        const response = testData.addressUsingLongLat;
        userService.getAddressByLatLang(latlong).subscribe(addSuggestion => {
            expect(addSuggestion).toBe(response);
        });

        // We set the expectations for the HttpClient mock
        const req = httpMock.expectOne(`${CONFIG.functionsUrl}/${RC.USER}/${RC.ADDRESS_BY_LAT_LANG}/${latlong}`);
        expect(req.request.method).toEqual('GET');

        // Then we set the fake data to be returned by the mock
        req.flush(response);
    });

    it(`checkDisplayName should return true `, () => {

        const displayName = 'Mark Zukar';
        const response = true;
        userService.checkDisplayName(displayName).subscribe(res => {
            expect(res).toBe(response);
        });

        // We set the expectations for the HttpClient mock
        // tslint:disable-next-line: max-line-length
        const req = httpMock.expectOne(`${CONFIG.functionsUrl}/${RC.USER}/${RC.CHECK}/${RC.DISPLAY_NAME}/${encodeURIComponent(displayName)}`);
        // console.log(req.request);
        expect(req.cancelled).toBeFalsy();
        expect(req.request.responseType).toEqual('json');
        expect(req.request.method).toEqual('GET');
        // Then we set the fake data to be returned by the mock
        req.flush({ response });
    });


    it(`addressUsingLongLat should return list of address suggestion`, () => {

        const displayName = 'Mark Zukar';
        const response = testData.addressUsingLongLat;
        userService.checkDisplayName(displayName).subscribe(addSuggestion => {
            expect(addSuggestion).toBe(response);
        });

        // We set the expectations for the HttpClient mock
        // tslint:disable-next-line: max-line-length
        const req = httpMock.expectOne(`${CONFIG.functionsUrl}/${RC.USER}/${RC.CHECK}/${RC.DISPLAY_NAME}/${encodeURIComponent(displayName)}`);
        expect(req.request.method).toEqual('GET');

        // Then we set the fake data to be returned by the mock
        req.flush(response);
    });

    it(`addressUsingLongLat should return list of address suggestion`, () => {

        const displayName = 'Mark Zukar';
        const response = testData.addressUsingLongLat;
        userService.checkDisplayName(displayName).subscribe(addSuggestion => {
            expect(addSuggestion).toBe(response);
        });

        // We set the expectations for the HttpClient mock
        // tslint:disable-next-line: max-line-length
        const req = httpMock.expectOne(`${CONFIG.functionsUrl}/${RC.USER}/${RC.CHECK}/${RC.DISPLAY_NAME}/${encodeURIComponent(displayName)}`);
        expect(req.request.method).toEqual('GET');

        // Then we set the fake data to be returned by the mock
        req.flush(response);
    });

    it(`addUserLives should call api with post method and valid body`, () => {

        const userId = testData.userList[0].userId;
        const response = { 'status': ResponseMessagesConstants.LIVES_ADDED };
        userService.addUserLives(userId).subscribe(res => {
            expect(res).toBe(response);
        });

        // We set the expectations for the HttpClient mock
        // tslint:disable-next-line: max-line-length
        const req = httpMock.expectOne(`${CONFIG.functionsUrl}/user/update-lives`);
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual({ userId });

        // Then we set the fake data to be returned by the mock
        req.flush(response);
    });


    it(`rejectGameInvitation should call api with put method and valid body`, () => {

        const gameId = testData.games[0].gameId;
        const response = {};
        userService.rejectGameInvitation(gameId).subscribe(res => {
            expect(res).toBe({});
        });

        // We set the expectations for the HttpClient mock
        // tslint:disable-next-line: max-line-length
        const req = httpMock.expectOne(`${CONFIG.functionsUrl}/game/${gameId}`);
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body).toEqual({ operation: GameOperations.REJECT_GAME });

        // Then we set the fake data to be returned by the mock
        req.flush(response);
    });


    it(`checkInvitationToken should call api with post method and valid body`, () => {

        const gameId = testData.games[0].gameId;
        const response = { created_uid: testData.userList[0].userId };
        userService.checkInvitationToken(gameId).subscribe(res => {
            expect(res).toBe(response);
        });

        // We set the expectations for the HttpClient mock
        // tslint:disable-next-line: max-line-length
        const req = httpMock.expectOne(`${CONFIG.functionsUrl}/friend`);
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(gameId);

        // Then we set the fake data to be returned by the mock
        req.flush(response);
    });


    it(`saveUserInvitations should call api with post method and valid body`, () => {

        const invitation = testData.invitation;
        const response = { messages: testData.userList[0].email };
        userService.saveUserInvitations(invitation).subscribe((res: any) => {
            expect(res).toBe(response);
        });

        // We set the expectations for the HttpClient mock
        // tslint:disable-next-line: max-line-length
        const req = httpMock.expectOne(`${CONFIG.functionsUrl}/friend/invitation`);
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(invitation);

        // Then we set the fake data to be returned by the mock
        req.flush(response);
    });


    it(`loadOtherUserProfileWithExtendedInfo should call api with get method`, () => {

        const userId = testData.userList[0].userId;
        const response = { user: testData.userList[0] };
        userService.loadOtherUserProfileWithExtendedInfo(userId).subscribe((res: any) => {
            expect(res).toBe(response);
        });

        // We set the expectations for the HttpClient mock
        // tslint:disable-next-line: max-line-length
        const req = httpMock.expectOne(`${CONFIG.functionsUrl}/user/extendedInfo/${userId}`);
        expect(req.request.method).toEqual('GET');

        // Then we set the fake data to be returned by the mock
        req.flush(response);
    });

    it(`loadOtherUserProfile should call api with get method`, () => {

        const userId = testData.userList[0].userId;
        const response = { user: testData.userList[0] };
        userService.loadOtherUserProfile(userId).subscribe((res: any) => {
            expect(res).toBe(response);
        });

        // We set the expectations for the HttpClient mock
        // tslint:disable-next-line: max-line-length
        const req = httpMock.expectOne(`${CONFIG.functionsUrl}/user/${userId}`);
        expect(req.request.method).toEqual('GET');

        // Then we set the fake data to be returned by the mock
        req.flush(response);
    });


    it(`loadOtherUserProfile should call api with get method`, () => {

        const user = testData.userList[0];
        const u = testData.userList[0];
        delete u.authState;
        delete u.profilePictureUrl;
        const response = { user: u };
        userService.saveUserProfile(user).subscribe((res: any) => {
            expect(res).toBe(response);
        });

        // We set the expectations for the HttpClient mock
        // tslint:disable-next-line: max-line-length
        const req = httpMock.expectOne(`${CONFIG.functionsUrl}/user/profile`);
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual({ user });
        // Then we set the fake data to be returned by the mock
        req.flush(response);
    });

});
