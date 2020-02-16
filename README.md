
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
  public async getAll(): Promise<ILocation[]> {
    return new Promise((resolve) => {
      console.log('get all', this.db);
      resolve(this.db)
    })
  }
```

3. Add Location
```
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
  public async delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.db = this.db.filter((entity) => entity.id !== id);
      console.log('deleted', id);
      resolve(true);
    })
  }
```

## Controllers

I'm using inline controllers, since there's not much logic here.

After each add, update, delete operations we'll also send a broadcast message to update all clients via web socket


```
    this.app.route(this.ROUTE).post(async (req: Request, res: Response) => { 
      let { name, latitude, longitude } = req.body;
      let added = await this.service.add({name, latitude, longitude});
      res.json(added);
      this.pushData();
    });
```

## Socket Server

When initializing the server, the socket is configured. Since we have no login we'll simply register the connected socket to a channel where all the data will be updated realtime after receiving a custom message from client, for example: <em>ready</em>.

```
private setUpSocket() {

    this.io.on("connection", function(socket: any) {
      socket.on('error', (error: Error) => {
        console.error('socket error', error)
      })
      
      socket.on('ready', () => {
        socket.join(`channel/push`);
      })
    });
  }
```

After each update operation, server will push a message to relevant clients: 

```
private async pushData() {
    let items = await this.service.getAll();
    this.io.sockets.in('channel/push').emit('push', { type: 'PUSH', data: items} );
  }
```

## Testing via Postman

1. ADD

![ADD](/images/add.png)

2. GET

![GET](/images/get.png)

3. UPDATE

![UPDATE](/images/update.png)

4. DELETE

![DELETE](/images/delete.png)

# Client

## Create React App

We'll use facebook create react app to kick-start the app.

Follow these steps: https://github.com/facebook/create-react-app

## Context, Reducers, State

While I used in the past [React Redux](https://redux.js.org/basics/usage-with-react/), I decided to check how React Context API would help me reduce my code significantly. You can read me about React-Context [here] (https://reactjs.org/docs/context.html).

## Components

We'll have the following components:

1. View
2. List
3. ItemDetails
4. EditForm
5. AddForm
6. Map

NB: While useContext hook is great, it's not recommended to put everything in the global context.

# Instructions

Don't forget to replace the ```GOOGLE_MAP_API_KEY = '<YOUR API KEY>'``` with your own **GOOGLE_MAP_API_KEY**

Go to api directory:

```npm install```

```npm start```

Same to run the app from app directory.






