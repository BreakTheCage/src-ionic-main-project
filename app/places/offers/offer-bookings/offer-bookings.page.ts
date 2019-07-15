import { Component, OnInit } from '@angular/core';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {
  place: Place;
  constructor(private route: ActivatedRoute, private navCtrl: NavController ,private placesService: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      console.log('ParamMap: ', paramMap);
      if(!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      console.log('Starting extract place with placeId of: ', paramMap.get('placeId'));
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
      console.log('Selected Place: ', this.place);

    });
  }

}
