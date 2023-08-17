/**
 * Copyright(C) 2023 Luvina Software Company
 * ConfirmComponent.ts, July 15, 2023 Toannq
 */
import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
/**
 * Directive xử lý việc chỉ click 1 lần duy nhất nếu click
 * nhiều lần cùng 1 thời điểm
 * @author Toannq
 */
@Directive({
  selector: '[appDebounceClick]'
})
export class DebounceClickDirective implements OnDestroy, OnInit {

  private debounceClickSubject = new Subject<void>();
  //thời gian debounceTime
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
