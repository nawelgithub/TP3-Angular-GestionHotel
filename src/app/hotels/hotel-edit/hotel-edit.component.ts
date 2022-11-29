import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounce, debounceTime, EMPTY, fromEvent, merge, Observable, timer } from 'rxjs';
import { Ihotel } from '../shared/models/hotel';
import { HotelListService } from '../shared/services/hotel-list.service';
import { GlobalGenericValidator } from '../shared/validators/global-generic.validator';
import { NumberValidators } from '../shared/validators/number.validators';

@Component({
  selector: 'app-hotel-edit',
  templateUrl: './hotel-edit.component.html',
  styleUrls: ['./hotel-edit.component.css']
})
export class HotelEditComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) inputElements!: ElementRef[];

  hotelForm!: FormGroup;
  hotel!: Ihotel;
  pageTitle!: string;
  errorMessage!: string;
  private validationMessage: { [key: string]: { [key: string]: string } } = {
    hotelName: {
      required: 'le nom de l\'hotel est obligatoir',
      minlength: 'Le nom de l\'hôtel doit comporter au moins quatre caractères.'
    },
    price: {
      required: 'le prix de l\'hotel est obligatoir',
      pattern: 'le prix de l\'hotel doit étre un nombre'
    },

    rating: {
      range: 'Donnez une note comprise entre 1 et 5'
    }

  };
  public formErrors: { [key: string]: string } = {};
  private globalGenericValidator!: GlobalGenericValidator;
  private isFormSubmitted!: boolean;


  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private hotelService: HotelListService,
    private router: Router) {

  }


  ngOnInit(): void {
    this.globalGenericValidator = new GlobalGenericValidator(this.validationMessage);

    this.hotelForm = this.fb.group(
      {
        hotelName: ['', [Validators.required, Validators.minLength(4)]],
        price: [0, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
        rating: [0, NumberValidators.range(1,5)],
        description: [''],
        tags: this.fb.array([]),
      });

    this.route.paramMap.subscribe(params => {
      const idH = params.get('id');
      const id = +idH!;// le mm const id = parseInt(idH!);
      //console.log('c id=',id);
      //console.log('type', typeof id);
      this.getSelectedHotel(id);
    });

  }

  ngAfterViewInit() {
    const formControlBlurs: Observable<unknown>[] = this.inputElements.map(
      (formControlElemRef: ElementRef) => fromEvent(formControlElemRef.nativeElement, 'blur'));

    merge(this.hotelForm.valueChanges, ...formControlBlurs)
      .pipe(debounce(() => this.isFormSubmitted ? EMPTY : timer(600)))
      .subscribe(() => {
        this.formErrors = this.globalGenericValidator.createErrorMessage(this.hotelForm, this.isFormSubmitted);
        console.log('errors =', this.formErrors);
      });

  }

  saveHotel() {
    //console.log(this.hotelForm.value);

    this.isFormSubmitted = true;
    this.hotelForm.updateValueAndValidity({
      onlySelf: true,
      emitEvent: true
    });

    if (this.hotelForm.valid) {
      if (this.hotelForm.dirty) {
        const hotel: Ihotel = {
          //...this.hotel, 
          id: this.hotel?.id,
          imageUrl: this.hotel?.imageUrl,

          ...this.hotelForm.value,

        };

        if (this.hotel.id === 0) {
          this.hotelService.createHotel(hotel).subscribe({
            next: () => this.saveCompleted(),
            error: (err) => this.errorMessage = err
          });
        } else {
          console.log({ hotel })
          this.hotelService.updateHotel(hotel).subscribe({

            next: () => this.saveCompleted(),
            error: (err) => this.errorMessage = err
          });
        }
      }
    } else {
      this.errorMessage = 'Corriger les erreurs SVP'
    }
    console.log(this.hotelForm.value);
  }


  saveCompleted(): void {
    this.hotelForm.reset();
    this.router.navigate(['/hotels']);
  }
  deleteHotel(): void {
    if (confirm(`voulez-vous réelement supprimer ${this.hotel.hotelName}`)) {
      this.hotelService.deleteHotel(this.hotel.id).subscribe({
        next: () => this.saveCompleted()
      });
    }
  }
  getSelectedHotel(id: number) {
    this.hotelService.getHotelById(id).subscribe(
      (hotel: Ihotel) => {
        this.displayHotel(hotel);
      });
  }

  displayHotel(hotel: Ihotel): void {
    this.hotel = hotel;
    if (this.hotel.id === 0) {
      this.pageTitle = 'Ajouter un nouveau hotel';
    } else {
      this.pageTitle = `Modifier l\'hotel ${this.hotel.hotelName}`;
    }

    this.hotelForm.patchValue(
      {
        hotelName: hotel.hotelName,
        price: hotel.price,
        rating: hotel.rating,
        description: hotel.description,
      });
    this.hotelForm.setControl('tags', this.fb.array(this.hotel.tags || []));
  }
  //recupérer la réference de formArray tags
  public get tags(): FormArray {
    return this.hotelForm.get('tags') as FormArray;
    //as FormArray: convertir en formarray pour étre reconnu par typescript comme une array
  }

  public addTags(): void {
    this.tags.push(new FormControl());
  }

  public deleteTags(index: number): void {
    this.tags.removeAt(index);
    this.tags.markAsDirty();
  }

  public hideError(): void {
    this.errorMessage = '';
  }
}
