import { Component, Input, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Utils } from '../../../core/services';
import { Question } from 'shared-library/shared/model';


@Component({
    selector: 'question-image',
    templateUrl: './question-image.component.html',
    styleUrls: ['./question-image.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuestionImageComponent {

    @Input() question:  Question;

    constructor(private utils: Utils, private cd: ChangeDetectorRef) {

    }

    getQuetionImageUrl(question: Question) {
        return this.utils.getQuetionImageUrl(question);
    }
}
