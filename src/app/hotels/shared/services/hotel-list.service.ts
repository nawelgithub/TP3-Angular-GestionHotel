import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError, catchError, map, of } from 'rxjs';
import { Ihotel } from 'src/app/hotels/shared/models/hotel';


@Injectable({
  providedIn: 'root'
})
export class HotelListService {

  //private readonly HOTEL_API_URL = 'api/hotels.json';
  //j'ai aussi declarer la route dans angular.json,assests(src/api) car ici j'ai donner le chemin directe api
  //HOTEL_API_URL: en majuscule just une convention pour les variables redonly. on peut l'écrire en minuscule

  private readonly HOTEL_API_URL = 'api/hotels';//inMemoryApi

  constructor(private http: HttpClient) { }

  public getHotels(): Observable<Ihotel[]> {
    return this.http.get<Ihotel[]>(this.HOTEL_API_URL).pipe(
      tap(hotels => console.log('hotels = ', hotels)),
      catchError(this.handleError)
    );
  }

  getHotelById(id: number): Observable<Ihotel> {
    const url = `${this.HOTEL_API_URL}/${id}`
    if (id === 0) {
      return of(this.getDefaultHotel());
    }
    /*return this.getHotels().pipe(
      map(hotels => hotels.find(hotel => hotel.id === id)!))*/
    return this.http.get<Ihotel>(url).pipe(
      catchError(this.handleError)
    );
  }

  getDefaultHotel(): Ihotel {
    return {
      id: 0,
      hotelName: '',
      price: 0,
      rating: 0,
      description: '',
      imageUrl: ''
    }
  }


  updateHotel(hotel: Ihotel): Observable<Ihotel> {
    const url = `${this.HOTEL_API_URL}/${hotel.id}`;
    return this.http.put<Ihotel>(url, hotel).pipe(
      catchError(this.handleError)
    );
  }

  createHotel(hotel: Ihotel): Observable<Ihotel> {
    hotel = {
      ...hotel,
      imageUrl: 'assets/img/hotel-room.jpg',
      id: parseInt(''),
    };
    return this.http.post<Ihotel>(this.HOTEL_API_URL, hotel).pipe(
      catchError(this.handleError));
  }

  deleteHotel(id: number): Observable<{}> {
    const url = `${this.HOTEL_API_URL}/${id}`;
    return this.http.delete<Ihotel>(url).pipe(
      catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);

      errorMessage = `Backend returned code ${error.status},` + `body was: ${error.error}`;
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.' + 
    '\n'+ errorMessage));
  }


}
