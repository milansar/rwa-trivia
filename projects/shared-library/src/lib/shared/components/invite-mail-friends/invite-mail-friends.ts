import {
    Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ViewChildren, QueryList, ElementRef
  } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { Store, select } from '@ngrx/store';
  import { User } from 'shared-library/shared/model';
  import { coreState, CoreState, UserActions } from 'shared-library/core/store';
  import { Utils } from 'shared-library/core/services';
  import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

  const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  @Component({
    selector: 'app-invite-mail-friends',
    templateUrl: './invite-mail-friends.component.html',
    styleUrls: ['./invite-mail-friends.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  
  @AutoUnsubscribe({ 'arrayName': 'subscriptions' })
  export class InviteMailFriends implements OnInit, OnDestroy {
    user: User;
    invitationForm: FormGroup;
    showErrorMsg = false;
    invalidEmailList = [];
    errorMsg = '';
    showSuccessMsg: string;
    validEmail = [];
    emailCheck: Boolean = false;
    @ViewChildren('textField') textField: QueryList<ElementRef>;
    subscriptions = [];
  
    constructor(private fb: FormBuilder, private store: Store<CoreState>, private userAction: UserActions, private cd: ChangeDetectorRef,
      private utils: Utils) {
      this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.user)).subscribe(user => {
        if (user) {
          this.user = user;
        }
      }));
  
      this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe((status: string) => {
        if (status && status !== 'NONE' && status !== 'IN PROCESS' && status !== 'SUCCESS' && status !== 'MAKE FRIEND SUCCESS') {
          this.showSuccessMsg = status;
          this.cd.detectChanges();
        }
      }));
  
    }
  
    ngOnInit() {
      this.showSuccessMsg = undefined;
      this.invitationForm = this.fb.group({
        email: ['', Validators.required]
      });
    }
  
    isValid(email) {
      return EMAIL_REGEXP.test(String(email).toLowerCase());
    }
  
    onSubscribe() {
      this.emailCheck = true;
      if (!this.invitationForm.valid) {
        return;
      } else {
        let invalid = false;
        this.errorMsg = '';
        this.showErrorMsg = false;
        this.invalidEmailList = [];
        this.showSuccessMsg = undefined;
        this.validEmail = [];
  
        if (this.invitationForm.get('email').value.indexOf(',') > -1) {
          const emails = this.invitationForm.get('email').value.split(',');
          for (const e of emails) {
            invalid = this.isValid(e);
            if (!invalid) {
              this.invalidEmailList.push(e);
            } else {
              this.validEmail.push(e);
            }
          }
          if (this.invalidEmailList.length > 0) {
            this.errorMsg = 'Following emails are not valid address!';
            this.showErrorMsg = true;
          }
        } else {
          const email = this.invitationForm.get('email').value.split(',');
          if (email === '' || !this.isValid(email)) {
            invalid = true;
            this.invalidEmailList.push(email);
            this.errorMsg = 'Following email is not valid address!';
            this.showErrorMsg = true;
          } else {
            this.validEmail.push(this.invitationForm.get('email').value);
          }
  
        }
        if (this.invalidEmailList.length === 0) {
          this.store.dispatch(this.userAction.addUserInvitation(
            { userId: this.user.userId, emails: this.validEmail }));
        }
      }
    }
  
    ngOnDestroy(): void {
    }
  }
  
  