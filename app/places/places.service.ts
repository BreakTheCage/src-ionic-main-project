import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhatan Mansion',
      'In the heart of New York City',
      'https://a.1stdibscdn.com/archivesE/upload/a_241/a_26038411520285183192/Architectural_024_mae_2018_master.jpg?width=768',
      149.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      'L Amoure Tojoure',
      'A romantic place in Paris!',
      'https://louisfeedsdc.com/wp-content/uploads/french-style-home_383033.jpg',
      189.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p3',
      'Foggy Palace',
      'Not your average city trip!',
      'https://i0.wp.com/www.photographyandtravel.com/wp-content/uploads/2017/05/B2.-Pena-Palace-043-Edit.jpg?resize=1090%2C807',
      99.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    )
  ]);
  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) { }

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map(places => {
        return {...places.find(p=> p.id === id)}
      })
      )
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new Place(
      Math.random().toString(), 
      title, description,
      'https://i0.wp.com/www.photographyandtravel.com/wp-content/uploads/2017/05/B2.-Pena-Palace-043-Edit.jpg?resize=1090%2C807',
      price,
      dateFrom, 
      dateTo,
      this.authService.userId
     );
     this.places.pipe(take(1)).subscribe(places => {
       this._places.next(places.concat(newPlace))
     });
  }
}
