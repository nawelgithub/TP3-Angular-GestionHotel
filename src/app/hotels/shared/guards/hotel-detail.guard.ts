import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, ResolveStart, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HotelListService } from '../services/hotel-list.service';
import { Ihotel } from '../models/hotel';

@Injectable({
  providedIn: 'root'
})
export class HotelDetailGuard implements CanActivate {


  
  NbHotels!: any;
  public hotels: Ihotel[] = [];

  constructor(private router: Router,
    private service: HotelListService) {
   this.getNber();
    //console.log('NombreHotels out =', this.NbHotels);//NombreHotels = undefined
  }

async getNber(){
await this.NumbrLenght();

}



NumbrLenght(){
  //return new Promise((resolve:any))
    this.service.getHotels().subscribe(
      res => {
        this.hotels = res;
        //console.log(this.hotels);
        const NombreHotels = res.length;
        //console.log(NombreHotels);
        this.NbHotels = NombreHotels;
      }
    );
  }



  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const id = +route.url[1].path;
    if (isNaN(id) || id <= 0) {
      alert('hotel est inconnu');
      this.router.navigate(['/hotels']);
      console.log(false);
      return false;
    }
    return true;
  }

}
