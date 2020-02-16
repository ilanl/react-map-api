
# Google group map

Your mission, should you choose to accept it, is to create a webapp to manage
and display a shared pool of locations on a map.
Feel free to use any library or framework, as you see fit.

## Requirements

The webapp should have a single page: A map component and the list of
locations next to it.
No login is required, the webapp should open directly on the main page.
The list of locations is shared, that means:
Everyone who opens the webapp should see the same locations.

GoogleMap API Key

Instruction on how to generate an API Key can be found here:

https://developers.google.com/maps/documentation/javascript/adding-a-google-map#key

![PrintScreen](/images/screen.png)

No Testing is required. Time 1h30

Code must be as clean as possible (SOLID)

# Server

## Modeling

I'm making a very simple entity model (id, name, latitude, longitude).

```
interface ILocation {
  id?: string,
  name: string,
  latitude: number,
  longitude: number
}
```

```
class LocationModel implements ILocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;

  constructor(id: string, name: string, latitude: number, longitude: number) {
    this.id = id;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
```

## Service

1. Since there's no requirement for a real db. The service entity will hold the db

```
class Service {
  
  public db:ILocation[] = []

```

2. Get Locations

```
  ...
  public async getAll(): Promise<ILocation[]> {
    return new Promise((resolve) => {
      console.log('get all', this.db);
      resolve(this.db)
    })
  }
```

3. Add Location
```
  ...
  public async add(entity: ILocation): Promise<ILocation> {
    let { name, latitude, longitude } = entity;
    let newModel = new EntityModel(uuid(), name, latitude, longitude)
    this.db = [...this.db, newModel];
    console.log('added', {...newModel});
    return newModel;
  }
```

4. Update Location

```
  ...
  public async update(id: string, entity: ILocation): Promise<ILocation> {
      return new Promise((resolve, reject) => {
        let existing = this.db.filter((entity) => entity.id === id)[0];
        if (!existing) {
          reject(new Error('Not Found'))
        }
        Object.assign(existing, {...entity});
        console.log('updated', {...existing});
        resolve(existing);
      })
    }
```

5. Delete Location

```
...
  public async delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.db = this.db.filter((entity) => entity.id !== id);
      console.log('deleted', id);
      resolve(true);
    })
  }
```

## Express REST API

The server will contain the following entities:


1. server: starts app (express & socket)
2. routes

We use Express to setup a server, while separating the App (Express) from the Server.
The Server will instanciate the AppServer with Express and SocketIO. 
I'm using an in memory DB for the sake of the exercise.

## Testing via Postman

1. ADD

![ADD](/images/add.png)

2. GET

![GET](/images/get.png)

3. UPDATE

![UPDATE](/images/update.png)

4. DELETE

![DELETE](/images/delete.png)


# How to run

Replace the ```GOOGLE_MAP_API_KEY = '<YOUR API KEY>'``` with your own **GOOGLE_MAP_API_KEY**

Go to api directory:

```npm install```

```npm start```

Same to run the app from app directory.












