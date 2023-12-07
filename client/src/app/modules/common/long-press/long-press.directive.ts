import {Directive, ElementRef, EventEmitter, OnDestroy, Output, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: "[longPress]"
})
export class LongPressDirective implements OnDestroy {
  private enabled = true;
  private timeout: ReturnType<typeof setTimeout> | undefined;
  private interval: ReturnType<typeof setTimeout> | undefined;

  pressing: boolean = false;
  longPressing: boolean = false;

  @Input() set longPress(enable: boolean) {
    if (enable === false) {
      this.endPress();
    }
    this.enabled = enable;
  }

  @Input() longPressDuration = 500;
  @Input() longPressingInterval = 0;

  @Output()
  onLongPress = new EventEmitter<MouseEvent>();

  @Output()
  onLongPressing = new EventEmitter<MouseEvent>();

  @Output()
  onLongPressEnd = new EventEmitter<any>();


  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  @HostListener("touchstart", ["$event"])
  @HostListener("mousedown", ["$event"])
  onMouseDown(event: MouseEvent) {
    if (this.enabled) {
      this.renderer.addClass(this.elRef.nativeElement, "ripple-press");
      this.pressing = true;
      this.longPressing = false;
  
      this.timeout  = setTimeout(() => {
        this.longPressing = true;
        this.onLongPress.emit(event);

        if (this.longPressingInterval > 0) {
          this.interval = setInterval(() => {
            this.onLongPressing.emit(event);
          }, this.longPressingInterval);
        }
      }, this.longPressDuration);
    }
  }

  @HostListener("touchend")
  @HostListener("mouseup")
  @HostListener("mouseleave")
  endPress() {
    if (this.longPressing)
      this.onLongPressEnd.emit(this.elRef.nativeElement);

    try {
      clearTimeout(this.timeout);
      clearInterval(this.interval);
    } catch (e) {}

    this.longPressing = false;
    this.pressing = false;
  }

  ngOnDestroy(): void {    
    try {
      clearTimeout(this.timeout);
      clearInterval(this.interval);
    } catch (e) {}
  }
}
