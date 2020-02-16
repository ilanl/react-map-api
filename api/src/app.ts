
import { Application, Request, Response } from 'express';
import { Server } from 'socket.io';

import bodyParser from 'body-parser';
import cors from 'cors';
import uuid from 'uuid/v1';

// TODO: Rename IEntity with interface that correspond to your business (IVenue)
interface IEntity {
  id?: string,
  name: string,
  latitude: number,
  longitude: number
}

// TODO: Rename EntityModel (VenueModel)
class EntityModel implements IEntity {
  id: string;
  name: string;
  latitude: number;
  longitude: number;

  constructor(id: string, name: string, latitude: number, longitude: number) {
    console.log('new entity', id, name, latitude, longitude);
    this.id = id;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

class App {
  
  // TODO: Rename your routes
  private ROUTE: string = `/items`;
  private ROUTE_BY_ID: string = `/item/:id`;
  
  public service: Service = new Service();
  public app: Application;
  public io: Server;
  
  constructor(express: Application, io: Server) {
    this.app = express;
    this.io = io;
    this.setUpMiddlewares();
    this.setUpRoutes();
    this.setUpSocket();
  }

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

  private setUpMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
  }
  
  private async pushData() {
    let items = await this.service.getAll();
    this.io.sockets.in('channel/push').emit('push', { type: 'PUSH', data: items} );
  } 
  
  private setUpRoutes() {

    this.app.route(this.ROUTE).get(async (req: Request, res: Response) => {
      let items = await this.service.getAll();
      res.json(items);
     });

    this.app.route(this.ROUTE).post(async (req: Request, res: Response) => { 
      let { name, latitude, longitude } = req.body;
      let added = await this.service.add({name, latitude, longitude});
      res.json(added);
      this.pushData();
    });
    
    this.app.route(this.ROUTE+'/cleanup').delete(async (req: Request, res: Response) => {
      await this.service.deleteAll();
      res.send(true);
      this.pushData();
    })

    this.app.route(this.ROUTE_BY_ID).delete(async (req: Request, res: Response) => {
      let id = req.params.id;
      await this.service.delete(id);
      res.send(true);
      this.pushData();
    })

    this.app.route(this.ROUTE_BY_ID).put(async (req: Request, res: Response) => { 
      let updated = await this.service.update(req.params.id, { ...req.body});
      res.json(updated);
      this.pushData();
    });
  }
}

class Service {
  
  // TODO Rename IEntity (IVenue)
  public db:IEntity[] = []

  // TODO: Rename signature
  public async getAll(): Promise<IEntity[]> {
    return new Promise((resolve) => {
      console.log('get all', this.db);
      resolve(this.db)
    })
  }
  
  // TODO: Rename signature to match needs venue: IVenue
  public async add(entity: IEntity): Promise<IEntity> {
    let { name, latitude, longitude } = entity;
    let newModel = new EntityModel(uuid(), name, latitude, longitude)
    this.db = [...this.db, newModel];
    console.log('added', {...newModel});
    return newModel;
  }

  public async delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.db = this.db.filter((entity) => entity.id !== id);
      console.log('deleted', id);
      resolve(true);
    })
  }

  public async deleteAll(): Promise<boolean> {
    return new Promise((resolve) => {
      this.db = [];
      console.log('dropped all');
      resolve(true);
    })
  }
  
  // TODO - Rename signature (IVenue)
  public async update(id: string, entity: IEntity): Promise<IEntity> {
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
}

export default App;