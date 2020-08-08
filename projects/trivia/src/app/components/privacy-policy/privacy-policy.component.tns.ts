import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Page } from '@nativescript/core/ui/page';
import { openUrl } from '@nativescript/core/utils/utils';
import { Utils } from 'shared-library/core/services';
import { FirebaseScreenNameConstants } from 'shared-library/shared/model';

@Component({
  selector: 'privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class PrivacyPolicyComponent implements OnInit, OnDestroy {
  renderView = false;
  constructor(
    private page: Page,
    private utils: Utils,
    private cd: ChangeDetectorRef
    ) {
  }

  ngOnInit() {
    this.page.on('loaded', () => { this.renderView = true; this.cd.markForCheck(); });
  }
  openUrl(url: any) {
    openUrl(url);
  }

  ngOnDestroy() {
    this.page.off('loaded');
    this.renderView = false;
  }

}
