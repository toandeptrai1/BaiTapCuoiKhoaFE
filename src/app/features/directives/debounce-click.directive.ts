import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Directive({
  selector: '[appDebounceClick]'
})
export class DebounceClickDirective implements OnDestroy, OnInit {

  private debounceClickSubject = new Subject<void>();
  @Input()
  debounceTime = 500;

  @Output() appDebounceClick = new EventEmitter<void>();

  constructor() {

  }
  ngOnInit(): void {
    this.debounceClickSubject.pipe(debounceTime(this.debounceTime)).subscribe(() => {
      this.appDebounceClick.emit();
    });

  }

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.debounceClickSubject.next();
  }

  ngOnDestroy() {
    this.debounceClickSubject.unsubscribe();
  }

}
