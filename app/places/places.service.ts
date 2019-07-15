import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhatan Mansion',
      'In the heart of New York City',
      'https://a.1stdibscdn.com/archivesE/upload/a_241/a_26038411520285183192/Architectural_024_mae_2018_master.jpg?width=768',
      149.99
    ),
    new Place(
      'p2',
      'L Amoure Tojoure',
      'A romantic place in Paris!',
      'https://louisfeedsdc.com/wp-content/uploads/french-style-home_383033.jpg',
      189.99
    ),
    new Place(
      'p3',
      'Foggy Palace',
      'Not your average city trip!',
      'https://i0.wp.com/www.photographyandtravel.com/wp-content/uploads/2017/05/B2.-Pena-Palace-043-Edit.jpg?resize=1090%2C807',
      99.99
    ),
  ];
  get places() {
    return [...this._places];
  }

  constructor() { }

  getPlace(id: string): Place {
    return {...this._places.find(p => p.id === id)}
  }
}
