import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelListService } from 'src/app/hotels/shared/services/hotel-list.service';
import { Ihotel } from '../shared/models/hotel';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.css']
})
export class HotelDetailComponent implements OnInit {

  public hotel: any = <Ihotel>{};

  constructor(private route: ActivatedRoute,
    private hotelListService: HotelListService,
    private router: Router) { }

  ngOnInit(): void {
    const id: number = +this.route.snapshot.paramMap.get('id')!;
    //get('id'): la chaine de caractère declaré entre '' doit étre la méme écrite 
    //dans le path de AppRoutingModule 'hotel/:id'
    // le signe + sert à transformer la chaine de string à un number (du javascript)

    //console.log('id = ', id);

    this.hotelListService.getHotels().subscribe(
      (hotels: Ihotel[]) => {
        this.hotel = hotels.find(hotel => hotel.id == id);
        console.log(this.hotel);
      }
    );
  }
  backToList() {
    this.router.navigate(['/hotels'])
   }

}
