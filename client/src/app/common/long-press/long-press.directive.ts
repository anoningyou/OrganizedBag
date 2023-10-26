import {Directive, ElementRef, EventEmitter, OnDestroy, Output,
  HostBinding,
  HostListener,
  Input,
  Renderer2} from '@angular/core';
import { fromEvent, merge, of, Subscription, timer } from 'rxjs';
import { filter, map, switchMap, take, timeout } from 'rxjs/operators';

// @Directive({
//   selector: '[appLongPress]',
// })
// export class LongPressDirective implements OnDestroy {
//   //private eventSubscribe: Subscription;
//   threshold = 500;
//   private clickTimerSubsctiption: Subscription | undefined;
//   private subsctiptions: Subscription[] = [];

//   @Output()
//   mouseLongPress = new EventEmitter<MouseEvent>();
//   // mouseup = new EventEmitter();
//   // touchEnd = new EventEmitter();

//   constructor(private elementRef: ElementRef) {
//     const mousedown = fromEvent<MouseEvent>(elementRef.nativeElement, "mousedown").subscribe((event) =>{
//       this.clickTimerSubsctiption = timer(this.threshold).pipe(take(1))
//         .subscribe(() => this.mouseLongPress.emit(event))
//     });
//     this.subsctiptions.push(mousedown);

//     const mouseup = fromEvent<MouseEvent>(elementRef.nativeElement, "mouseup").subscribe((event) =>{
//       if (this.clickTimerSubsctiption)
//         this.clickTimerSubsctiption.unsubscribe();
//     });

//     this.subsctiptions.push(mouseup);
//   }

//   ngOnDestroy(): void {
//     // if (this.eventSubscribe) {
//     //   this.eventSubscribe.unsubscribe();
//     // }

//     this.subsctiptions.forEach(s =>{
//       if (s)
//         s.unsubscribe();
//     });

//     if (this.clickTimerSubsctiption)
//       this.clickTimerSubsctiption.unsubscribe();
//   }
// }


@Directive({
  selector: "[longPress]"
})
export class LongPressDirective implements OnDestroy {
  private enabled = true;
  @Input() set longPress(enable: boolean) {
    if (enable === false) {
      this.endPress();
    }
    this.enabled = enable;
  }
  @Input() longPressDuration = 500;
  @Input() longPressingInterval = 50;
  pressing: boolean = false;
  longPressing: boolean = false;
  timeout: any;
  interval: number = 0;

  private mouseUpSubscription: Subscription | undefined;

  @Output()
  onLongPress = new EventEmitter();

  @Output()
  onLongPressing = new EventEmitter();

  @Output()
  onLongPressEnd = new EventEmitter<any>();


  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  @HostListener("touchstart", ["$event"])
  @HostListener("mousedown", ["$event"])
  onMouseDown(event: MouseEvent) {
    if (this.enabled) {
      // this.renderer.addClass(this.elRef.nativeElement, "ripple-press");
      this.pressing = true;
      this.longPressing = false;

    
      this.timeout = setTimeout(() => {
        this.longPressing = true;
        this.onLongPress.emit(event);

        this.mouseUpSubscription = fromEvent<MouseEvent>(document, "mouseup").pipe(take(1)).subscribe((event) =>{
          this.onLongPressEnd.emit(this.elRef.nativeElement)
        });
        // if (this.longPressingInterval > 0) {
        //   this.interval = setInterval(() => {
        //     this.onLongPressing.emit(event);
        //   }, this.longPressingInterval);
        // }
      }, this.longPressDuration);
    }
  }

  @HostListener("touchend")
  @HostListener("mouseup")
  @HostListener("mouseleave")
  // @HostListener("touchmove")
  // @HostListener("mousemove")
  endPress() {
    try {
      clearTimeout(this.timeout);
      clearInterval(this.interval);
    } catch (e) {}
    this.longPressing = false;
    this.pressing = false;
  }

  ngOnDestroy(): void {    
    if (this.mouseUpSubscription)
      this.mouseUpSubscription.unsubscribe();
  }
}
