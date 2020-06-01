
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import 'hammerjs';
import { DebugElement, Component, Input, Renderer2, ElementRef, Output, EventEmitter, NO_ERRORS_SCHEMA
} from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { RippleEffectDirective } from './ripple-effect.directive';

@Component({
    template: `<Label class="label" stlRippleEffect stlOpacity="0.50"
    stlBackgroundColor="transparent" stlBackgroundColorAfter="transparent" text="LABEL with ripple effect"
     style="color: #077ad6" android:fontSize="18"></Label>`
})

class RippleEffectComponent {
    @Input() stlBackgroundColor: string;
    @Input() stlOpacity: number;
    @Input() stlBackgroundColorAfter: string;
    @Input() tapWithoutAnimate: boolean;
    @Input() animationDuration: number;
    templateRef: any;
    renderer: Renderer2;
    defaultColor: '#F8F8F8';

    @Input() rippleEffect: any;
    @Output() rippleTap = new EventEmitter<string>();

    constructor(templateRef: ElementRef, renderer: Renderer2) {
        this.renderer = renderer;
        this.templateRef = templateRef;

    }
}

describe('RippleEffectDirective', () => {
    let component: RippleEffectComponent;
    let fixture: ComponentFixture<RippleEffectComponent>;
    let inputEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [
                RippleEffectComponent,
                RippleEffectDirective
            ],
            providers: [
                { provide: APP_BASE_HREF, useValue: '/' }
            ]
        });

        fixture = TestBed.createComponent(RippleEffectComponent);
        component = fixture.componentInstance;
        component.templateRef = ElementRef;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('Initial value of the user should be Truthy', () => {
        expect(component.stlOpacity).toBeFalsy();
        expect(component.stlBackgroundColor).toBeFalsy();
        expect(component.stlBackgroundColorAfter).toBeFalsy();
        expect(component.tapWithoutAnimate).toBeFalsy();
        expect(component.animationDuration).toBeFalsy();
    });

    it('Ripple effect should be apply on element on tap', () => {
        component.templateRef = ElementRef;
        inputEl = fixture.debugElement.query(By.css('label'));
        inputEl.triggerEventHandler('tap', null);
        fixture.detectChanges();
        expect(component.stlOpacity).toEqual(0.50);
      });


});