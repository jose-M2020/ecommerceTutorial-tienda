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
    // The reset-style class must be added when you wanna remove the default style class
    const resetBtn = this.class?.split(' ')?.includes('reset-style') ?? false;
    
    if(!resetBtn){
      this.class = this.class + ' ps-btn--black text-white';
    }
  }
}
