import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { GameElement } from '../classes';

import { BehaviorSubject, Observable } from 'rxjs/Rx';

const GAME_STORE_NAME = 'games';

// indexes like "{ on: string,  name: string,  unique: boolean, multiEntry: boolean }"
const stores = [
  { name: GAME_STORE_NAME, keypath: 'id', indexes: []}
]; 

// for id generation
function random():string {
  return (Math.random().toString(36)+'00000000000000000').slice(2, 10+2);
}

const STORE_NAME = "sportsync";
const STORE_VERSION = 1;
let initObjectStore = function(): Promise<any> {
  let name = STORE_NAME;
  let version = STORE_VERSION;
  return new Promise((resolve, reject) => {
    let request = indexedDB.open(name, version);

    request.onupgradeneeded = (e:any) => {
      let db = e.target.result;

      let createStore = (name, keypath, indexes) => {
        let store = db.createObjectStore(name, { keyPath: keypath });
        indexes.forEach((index)=> {
          store.createIndex(index.name, index.on, { unique: index.unique, multiEntry: !!index.multiEntry });
        });
      }

      let trans = e.target.transaction;

      stores.forEach((store)=> {
        if(db.objectStoreNames.contains(store.name)) {
          db.deleteObjectStore(store.name);
        }
        createStore(store.name, store.keypath, store.indexes);
      });

      trans.onsuccess = (e) => {
        resolve(db);
      }
    };

    request.onsuccess = (e:any) => {
      let db = e.target.result;
      resolve(db);
    };
  });
}
let getAllFromStore = function(db, storeName): Promise<any[]> {
  return new Promise((resolve, reject) => {
    let trans = db.transaction([storeName]);
    let store = trans.objectStore(storeName);
    let req = store.getAll();
    req.onsuccess = (e)=>{
      resolve(e.target.result);
    }
    req.onerror = (e)=>{
      reject(e.target.error);
    }
  });
}

let saveToStore = function(db, storeName, obj): Promise<any> {
  return new Promise((resolve, reject) => {
    let trans = db.transaction([storeName], 'readwrite');
    let store = trans.objectStore(storeName);
    let req = store.put(obj);
    req.onsuccess = (e) => {
      resolve(e.target.result);
    }
    req.onerror = (e) => {
      reject(e.target.error);
    }
  });
}

let removeFromStore = function(db, storeName, id): Promise<any> {
  return new Promise((resolve, reject) => {
    let trans = db.transaction([storeName], 'readwrite');
    let store = trans.objectStore(storeName);
    let req = store.delete(id);
    req.onsuccess = (e) => {
      resolve(e.target.result);
    }
    req.onerror = (e) => {
      reject(e.target.error);
    }
  });
}


@Injectable()
export class GameService {
  private objectStore: IDBObjectStore;
  private games: BehaviorSubject<GameElement[]>;
  public ready: boolean = false;

  constructor() { }

  resolve() {
    return this.init()
  }

  init():any {
    return this.objectStore ? Promise.resolve(this.objectStore) : initObjectStore().then(db=>{
      this.objectStore = db;
      return db;
    }).then(db=>{
      return getAllFromStore(db, GAME_STORE_NAME).then(results => {
        this.games = new BehaviorSubject(<GameElement[]>results.map(GameElement.fromObject.bind(GameElement)));
        this.ready = true;
        return this.games;
      });
    });
  }

  getGames(): Observable<any>{
    return this.games.startWith(this.games.getValue());
  }

  saveNewGame(gameObj) {
    let games = this.games.getValue();

    let game = new GameElement(
      random(), // id
      gameObj.name,
      gameObj.description
    );
    this.games.next(games.concat(game));
    // should add artifical delay
    return this.saveGame(game).startWith(game);
  }

  saveGame(game) {
    return Observable.fromPromise(saveToStore(this.objectStore, GAME_STORE_NAME, game).then(id=>{
      game.state = 'SAVED';
      return game;
    }));
  }

  removeGame(game) {
    // should error if game does not exist, etc
    let games = this.games.getValue();
    let i = games.indexOf(game);
    if(i != -1) {
      return Observable.fromPromise(removeFromStore(this.objectStore, GAME_STORE_NAME, game.id).then(id=>{
        games.splice(i, 1)
        this.games.next(games);
      })).ignoreElements().concat(this.games);
    }
    return this.games;
  }
}
