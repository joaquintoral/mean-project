export class User {
    // ? makes field optional
    // adding public declares the property of the object without having to declare it on the class
    constructor(public email: string,
                public password: string,
                public firstName?: string,
                public lastName?: string) {
    }
}