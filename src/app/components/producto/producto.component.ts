import { Component, Input, OnInit } from '@angular/core';
import { calcAverageRating } from 'src/app/helpers/producto';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  @Input() producto: any;
  @Input() currency: String;
  
  public rating: Number = 0;

  constructor() { }

  ngOnInit(): void {
    this.rating = calcAverageRating(this.producto.review)
  }

}
