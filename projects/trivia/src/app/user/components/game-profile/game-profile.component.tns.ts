import { ChangeDetectionStrategy, Component, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { GameProfile } from './game-profile';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Router, ActivatedRoute } from '@angular/router';
import { UserActions } from 'shared-library/core/store';
import * as utils from 'tns-core-modules/utils/utils';
import { Utils } from 'shared-library/core/services';
import { Page } from 'tns-core-modules/ui/page';
@Component({
    selector: 'game-profile',
    templateUrl: './game-profile.component.html',
    styleUrls: ['./game-profile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe({ 'arrayName': 'subscriptions' })

export class GameProfileComponent extends GameProfile implements OnDestroy, OnInit {
    renderView = false;

    constructor(public route: ActivatedRoute,
        public router: Router,
        public store: Store<AppState>,
        public userAction: UserActions,
        public cd: ChangeDetectorRef,
        public _utils: Utils,
        private page: Page
    ) {
        super(route, router, store, userAction, cd, _utils);
    }

    ngOnInit() {
        this.page.on('loaded', () => { this.renderView = true; this.cd.markForCheck(); });
    }

    ngOnDestroy() {
        this.page.off('loaded');
        this.renderView = false;
    }

    openLink(url: string) {
        utils.openUrl(url);
    }

}
