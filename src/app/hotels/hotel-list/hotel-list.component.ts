import { Component, OnInit } from '@angular/core';
import { HotelListService } from '../shared/services/hotel-list.service';

import { Ihotel } from '../shared/models/hotel';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {
  public title = 'Liste Hotels';
  public hotels: Ihotel[] = [];
  public showBadge: boolean = true;

  private _hotelFilter = 'Recherche';
  public filteredHotels: Ihotel[] = [];
  public receiveRating!: string;

  errMsg!: any;
  constructor(private hotelListService: HotelListService) { }

  ngOnInit(): void {
    this.hotelListService.getHotels().subscribe({
      next: res => {
        this.hotels = res,
        this.filteredHotels = this.hotels;
      },
      error: err => this.errMsg = err,
    });
    this.hotelFilter = '';
  }


  public toggleIsNewBadge(): void {
    this.showBadge = !this.showBadge;
  }


  public get hotelFilter(): string {
    return this._hotelFilter;
  }

  public set hotelFilter(filter: string) {
    this._hotelFilter = filter;
    this.filteredHotels = this.hotelFilter ? this.filterHotels(this.hotelFilter) : this.hotels;
  }

  private filterHotels(criteria: string): Ihotel[] {
    criteria = criteria.toLocaleLowerCase();
    const res = this.hotels.filter(
      (hotel: Ihotel) => hotel.hotelName.toLocaleLowerCase().indexOf(criteria) !== -1
    );
    return res;
  }

  receiveRatingClick(eventMessage: string): void {
    this.receiveRating = eventMessage;
  }

}
