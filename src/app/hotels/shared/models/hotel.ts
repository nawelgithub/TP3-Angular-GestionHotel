

export interface Ihotel {
    id: number;
    hotelName: string;
    description: string;
    price: number;
    imageUrl: string;
    rating: number;
    tags?: string[];
}

//type de declaration de class qui implements une interface
/*export class Hotel implements Ihotel {
    id: number;
    hotelName: string;
    description: string;
    price: number;
    imageUrl: string;
    rating!: number;
    tags?: string[];

    constructor(id: number, hotelName: string,description: string,
        price: number,imageUrl: string;) {
        this.id = id;
        this.hotelName=hotelName;
        this.description=description;
        this.price=price;
        this.imageUrl=imageUrl;
       }
    }*/
