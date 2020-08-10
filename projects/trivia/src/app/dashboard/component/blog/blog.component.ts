import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState, appState } from '../../../store';
import { UntilDestroy } from '@ngneat/until-destroy';

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@UntilDestroy({ arrayName: 'subscriptions' })
export class BlogComponent implements OnDestroy, OnInit {
  @Input() blogId: number;
  blogData = [];

  subscriptions: Subscription[] = [];
  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef) {
  }

  onNotify(info: any) {
    this.blogData[this.blogData.findIndex(blog => blog.blogNo === info.blogNo)].share_status = info.share_status;
  }

  ngOnDestroy() {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.store.select(appState.dashboardState).pipe(select(s => s.blogs)).subscribe(blogs => {
      this.blogData = blogs;
      this.cd.markForCheck();
    }));
  }
}
