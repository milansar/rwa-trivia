import { Component, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { User, Question } from 'shared-library/shared/model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@Component({
  selector: 'app-preview-question-dialog',
  templateUrl: './preview-question-dialog.component.html',
  styleUrls: ['./preview-question-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@UntilDestroy({ arrayName: 'subscriptions' })
export class PreviewQuestionDialogComponent implements OnDestroy {
  question: Question;
  user: User;
  navLinks = [];
  subscriptions = [];

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
    public cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<PreviewQuestionDialogComponent>) {
    this.question = data.question;
  }

  closeModel() {
    this.dialogRef.close();
  }

  ngOnDestroy() {

  }

}
