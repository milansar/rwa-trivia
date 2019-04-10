import { Component, OnDestroy, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { QuestionActions } from 'shared-library/core/store/actions/question.actions';
import { QuestionAddUpdate } from './question-add-update';
import { Question, Answer, Subscription } from 'shared-library/shared/model';
import { debounceTime, map } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
@Component({
  templateUrl: './question-add-update.component.html',
  styleUrls: ['./question-add-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class QuestionAddUpdateComponent extends QuestionAddUpdate implements OnDestroy {

  get tagsArray(): FormArray {
    return this.questionForm.get('tagsArray') as FormArray;
  }
  subscriptions = [];
  @ViewChild('cropper') cropper: ImageCropperComponent;
  @ViewChild('fileUpload') fileUpload: ElementRef;
  cropperSettings: CropperSettings;
  questionImageValidation: String;
  questionImageFile: File;
  questionImage: { image: any } = { image: '' };


  // Constructor
  constructor(public fb: FormBuilder,
    public store: Store<AppState>,
    public utils: Utils,
    public router: Router,
    public snackBar: MatSnackBar,
    public questionAction: QuestionActions) {

    super(fb, store, utils, questionAction);

    this.setCropperSettings();
    this.question = new Question();
    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings) {
        this.applicationSettings = appSettings[0];
        this.createForm(this.question);
      }
    }));

    const questionControl = this.questionForm.get('questionText');

    this.subscriptions.push(questionControl.valueChanges.pipe(debounceTime(500)).subscribe(v => this.computeAutoTags()));
    this.subscriptions.push(this.answers.valueChanges.pipe(debounceTime(500)).subscribe(v => this.computeAutoTags()));


    this.filteredTags$ = this.questionForm.get('tags').valueChanges
      .pipe(map(val => val.length > 0 ? this.filter(val) : []));

    this.subscriptions.push(store.select(appState.coreState).pipe(select(s => s.questionSaveStatus)).subscribe((status) => {
      if (status === 'SUCCESS') {
        this.snackBar.open('Question saved!', '', { duration: 2000 });
        this.router.navigate(['/my/questions']);
        this.store.dispatch(this.questionAction.resetQuestionSuccess());
      }
    }));
  }

  private setCropperSettings() {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 700;
    this.cropperSettings.height = 150;
    this.cropperSettings.croppedWidth = 700;
    this.cropperSettings.croppedHeight = 150;
    this.cropperSettings.canvasWidth = 700;
    this.cropperSettings.canvasHeight = 150;
    this.cropperSettings.minWidth = 10;
    this.cropperSettings.minHeight = 10;
    this.cropperSettings.rounded = false;
    this.cropperSettings.keepAspect = false;
    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
  }

  removeQuestionImage() {
    this.questionImage.image = '';
    this.questionImageValidation = '';
    this.questionImageFile = undefined;
    this.fileUpload.nativeElement.value = '';
  }
  onFileChange($event) {
    this.validateImage($event.target.files);
    if (!this.questionImageValidation) {
      const image = new Image();
      this.questionImageFile = $event.target.files[0];
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(this.questionImageFile);
      reader.onloadend = (loadEvent: any) => {
        image.src = loadEvent.target.result;
        this.question.originalImageUrl = image.src;
        this.cropper.setImage(image);
      };
    }
  }

  saveQuestionImage() {
    if (!this.questionImageValidation) {
      const fileName = `${new Date().getTime()}-${this.questionImageFile.name}`;
      this.question.questionImage = fileName;
      this.question.croppedImageUrl =  this.questionImage.image;
      this.question.imageType = this.questionImageFile.type;
      this.questionImageFile = undefined;
      this.questionForm.get('questionImage').setValue(fileName);
      this.questionForm.updateValueAndValidity();
    }
  }


  validateImage(fileList: FileList) {
    if (fileList.length === 0) {
      this.questionImageValidation = 'Please select Question Image';
    } else {
      const file: File = fileList[0];
      const fileName = file.name;
      const fileSize = file.size;
      const fileType = file.type;

      if (fileSize > 2097152) {
        this.questionImageValidation = 'Your uploaded question image should not be larger than 2 MB.';
      } else {
        if (fileType === 'image/jpeg' || fileType === 'image/jpg' || fileType === 'image/png' || fileType === 'image/gif') {
          this.questionImageValidation = undefined;
        } else {
          this.questionImageValidation = 'Only PNG, GIF, JPG and JPEG Type Allow.';
        }
      }
    }
  }

  createForm(question: Question) {

    const answersFA: FormArray = super.createDefaultForm(question);

    let fcs: FormControl[] = question.tags.map(tag => {
      const fc = new FormControl(tag);
      return fc;
    });
    if (fcs.length === 0) {
      fcs = [new FormControl('')];
    }

    const tagsFA = new FormArray(fcs);

    this.questionForm = this.fb.group({
      category: [(question.categories.length > 0 ? question.categories[0] : ''), Validators.required],
      questionText: [question.questionText,
      Validators.compose([Validators.required, Validators.maxLength(this.applicationSettings.question_max_length)])],
      questionImage: [''],
      tags: '',
      tagsArray: tagsFA,
      answers: answersFA,
      ordered: [question.ordered],
      explanation: [question.explanation]
    }, { validator: questionFormValidator }
    );
  }


  // Event Handlers
  addTag() {
    const tag = this.questionForm.get('tags').value;
    if (tag) {
      super.addTag(tag);
      this.questionForm.get('tags').setValue('');
    }
    this.setTagsArray();
  }

  removeEnteredTag(tag) {
    super.removeEnteredTag(tag);
    this.setTagsArray();
  }


  computeAutoTags() {
    super.computeAutoTags();
    this.setTagsArray();
  }

  setTagsArray() {
    this.tagsArray.controls = [];
    [...this.autoTags, ...this.enteredTags].forEach(tag => this.tagsArray.push(new FormControl(tag)));
  }

  submit() {

    const question: Question = super.onSubmit();

    if (question) {
      // call saveQuestion
      if (this.question.questionImage) {
        question.questionImage = this.question.questionImage;
        question.imageType = this.question.imageType;
        question.croppedImageUrl = this.question.croppedImageUrl;
        question.originalImageUrl = this.question.originalImageUrl;
      }
      this.saveQuestion(question);

      this.filteredTags$ = this.questionForm.get('tags').valueChanges
        .pipe(map(val => val.length > 0 ? this.filter(val) : []));
    }

  }

  ngOnDestroy() {

  }
}


// Custom Validators
function questionFormValidator(fg: FormGroup): { [key: string]: boolean } {
  const answers: Answer[] = fg.get('answers').value;
  if (answers.filter(answer => answer.correct).length !== 1) {
    return { 'correctAnswerCountInvalid': true };
  }

  const tags: string[] = fg.get('tagsArray').value;
  if (tags.length < 3) {
    return { 'tagCountInvalid': true };
  }

  return null;
}
