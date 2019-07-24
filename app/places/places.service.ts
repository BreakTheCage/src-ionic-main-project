import { Injectable } from "@angular/core";
import { Place } from "./place.model";
import { AuthService } from "../auth/auth.service";
import { BehaviorSubject, of } from "rxjs";
import { take, map, tap, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { PlaceLocation } from './location.model';

interface PlaceData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  userId: string;
  availableFrom: string;
  availableTo: string;
  location: PlaceLocation
}

@Injectable({
  providedIn: "root"
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);
  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        "https://ionic-angular-booking-place.firebaseio.com/offered-places.json"
      )
      .pipe(
        map(resData => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId,
                  resData[key].location
                )
              );
            }
          }
          return places;
          // return [];
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://ionic-angular-booking-place.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map(placeData => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
            placeData.location
          );
        })
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      "https://i0.wp.com/www.photographyandtravel.com/wp-content/uploads/2017/05/B2.-Pena-Palace-043-Edit.jpg?resize=1090%2C807",
      price,
      dateFrom,
      dateTo,
      this.authService.userId,
      location
    );
    return this.http
      .post<{ name: string }>(
        "https://ionic-angular-booking-place.firebaseio.com/offered-places.json",
        { ...newPlace, id: null }
      )
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if(!places || places.length <= 0 ) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(
          `https://ionic-angular-booking-place.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}

// [
//   new Place(
//     'p1',
//     'Manhatan Mansion',
//     'In the heart of New York City',
//     'https://a.1stdibscdn.com/archivesE/upload/a_241/a_26038411520285183192/Architectural_024_mae_2018_master.jpg?width=768',
//     149.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p2',
//     'L Amoure Tojoure',
//     'A romantic place in Paris!',
//     'https://louisfeedsdc.com/wp-content/uploads/french-style-home_383033.jpg',
//     189.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p3',
//     'Foggy Palace',
//     'Not your average city trip!',
//     'https://i0.wp.com/www.photographyandtravel.com/wp-content/uploads/2017/05/B2.-Pena-Palace-043-Edit.jpg?resize=1090%2C807',
//     99.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   )
// ]
