import {
  Input,
  OnInit,
  Component,
  forwardRef,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Utils } from "shared-library/core/services";

@Component({
  selector: "app-check-display-name",
  templateUrl: "./check-display-name.component.html",
  styleUrls: ["./check-display-name.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckDisplayName),
      multi: true
    }
  ]
})
export class CheckDisplayName implements OnInit, ControlValueAccessor {
  @Input() placeholder;
  @Input() hint;
  @Input() isProfilePage;
  myValue: any = null;
  @Input() disabled: boolean;
  propagateChange = (_: any) => {};

  constructor(public utils: Utils) {}

  ngOnInit(): void {
    this.disabled = this.isProfilePage ? true : false;
  }

  writeValue(obj: any): void {
    this.myValue = obj;
  }

  onTextChange(event) {
    this.propagateChange(event);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    // do nothing
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
