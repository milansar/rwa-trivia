import { Component, OnDestroy, ChangeDetectorRef, Input, SimpleChanges, OnChanges } from '@angular/core';
import { User, Question, Category } from 'shared-library/shared/model';
import { UntilDestroy } from '@ngneat/until-destroy';

@Component({
  selector: 'app-preview-question-dialog',
  templateUrl: './preview-question-dialog.component.html',
  styleUrls: ['./preview-question-dialog.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

@UntilDestroy({ arrayName: 'subscriptions' })
export class PreviewQuestionDialogComponent implements OnChanges, OnDestroy {

  user: User;
  navLinks = [];
  ref: any;
  subscriptions = [];
  categoryName = '';
  theme: string;
  @Input() question: Question;
  @Input() categoryDictionary: Category[];

  constructor(public cd: ChangeDetectorRef) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.categoryDictionary &&  this.question && this.question.categoryIds) {
      this.categoryName = this.question.categoryIds.map(category => {
        if (this.categoryDictionary[category]) {
          return this.categoryDictionary[category].categoryName;
        } else {
          return '';
        }
      }).join(',');
    }
  }

  ngOnDestroy() {

  }



}
