declare type ROLE = 'ADMIN' | 'FARMER';

declare type OrderStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

declare type User = {
    id: string;
    role: ROLE;
    email: string;
    password?: string;
    details?: FarmerDetails;
    createdAt?: Date;
    updatedAt?: Date;
}

declare type Order = {
    id: string;
    farmerID: string;
    orderUnit: OrderUnit[];
    totalAmt: number;
    paid: boolean;
    status: OrderStatus;
    farmer?: User;
    createdAt?: Date;
    updatedAt?: Date;
}

declare type OrderUnit = {
    landSize: number;
    fertilizerID: string;
    fertilizerName: string;
    seedsID: string;
    seedsName: string;
    fertilizerQty: number;
    seedsQty: number;
    fertilizerAmt: number;
    seedsAmt: number;
}

declare type Fertilizer = {
    id: string;
    name: string;
    price: number;
    seedsIDs: string[];
    seeds?: Seeds[];
    createdAt?: Date;
    updatedAt?: Date;
}

declare type Seeds = {
    id: string;
    name: string;
    price: number;
    fertilizerIDs: string[];
    fertilizers?: Fertilizer[];
    createdAt?: Date;
    updatedAt?: Date;
}

declare type FarmerDetails = {
    id: string;
    farmerID: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    createdAt?: Date;
    updatedAt?: Date;
}