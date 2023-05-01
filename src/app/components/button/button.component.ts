import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  @Input() text: String;
  @Input() path: String;
  @Input() btnType: String = 'button';
  @Input() loading: Boolean = false;
  @Input() loadingText: String = 'Loading';
  @Input() class: String;

  constructor() { }

  ngOnInit(): void {
  }
}
