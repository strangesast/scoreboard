import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { GameElement } from '../classes';

import { Subscription, BehaviorSubject, Observable } from 'rxjs/Rx';

const GAME_STORE_NAME = 'games';
const DB_NAME = 'sportsync';
const STORE_VERSION = 1;
// indexes like '{ on: string,  name: string,  unique: boolean, multiEntry: boolean }'
const stores = [
  { name: GAME_STORE_NAME, keypath: 'id', indexes: []}
];

// for id generation
function random(): string {
  return (Math.random().toString(36) + '00000000000000000').slice(2, 10 + 2);
};

// probably a bit excessive
interface IDBEventTarget extends EventTarget {
  result: any;
  error: Error;
}

interface IDBEvent extends Event, ErrorEvent, IDBVersionChangeEvent {
  target: IDBEventTarget;
  getMessage(): string;
}

function initObjectStore(name: string, version: number): Promise<any> {
  return new Promise(function(resolve, reject) {
    let request = window.indexedDB.open(name, version);

    request.onupgradeneeded = function(evt: IDBEvent) {
      let db = evt.target.result;

      let createStore = function(storeName: string, keypath: string, indexes: any[]) {
        let store = db.createObjectStore(storeName, { keyPath: keypath });
        indexes.forEach(function(index) {
          store.createIndex(index.name, index.on, { unique: index.unique, multiEntry: !!index.multiEntry });
        });
      };

      let trans = (<any>evt.target).transaction;

      stores.forEach(function(store) {
        if (db.objectStoreNames.contains(store.name)) {
          db.deleteObjectStore(store.name);
        }
        createStore(store.name, store.keypath, store.indexes);
      });

      trans.onsuccess = function(e: IDBEvent) {
        resolve(db);
      };
    };

    request.onsuccess = function(evt: IDBEvent) {
      let db = evt.target.result;
      resolve(db);
    };
  });
};

function getAllFromStore(db: IDBDatabase, storeName: string): Promise<any[]> {
  return new Promise(function(resolve, reject) {
    let trans = db.transaction(storeName);
    let store = <any>trans.objectStore(storeName);
    let req = store.getAll();
    req.onsuccess = function(e: IDBEvent) {
      resolve(e.target.result);
    };
    req.onerror = function(e: IDBEvent) {
      reject(e.target.error);
    };
  });
};

function saveToStore(db: IDBDatabase, storeName: string, obj: any): Promise<any> {
  return new Promise(function(resolve, reject) {
    let trans = db.transaction(storeName, 'readwrite');
    let store = trans.objectStore(storeName);
    let req = store.put(obj);
    req.onsuccess = function(e: IDBEvent) {
      resolve(e.target.result);
    };
    req.onerror = function(e: IDBEvent) {
      reject(e.target.error);
    };
  });
};

function removeFromStore(db: IDBDatabase, storeName: string, id: string): Promise<any> {
  return new Promise(function(resolve, reject) {
    let trans = db.transaction(storeName, 'readwrite');
    let store = trans.objectStore(storeName);
    let req = store.delete(id);
    req.onsuccess = function(e: IDBEvent) {
      resolve(e.target.result);
    };
    req.onerror = function(e: IDBEvent) {
      reject(e.target.error);
    };
  });
};


@Injectable()
export class GameService implements Resolve<GameElement[]> {
  private objectStore: IDBDatabase;

  public games: BehaviorSubject<GameElement[]>;
  // game -> games -> indexeddb
  // indexeddb -> games -> game


  public ready: boolean = false;

  private gameSub: Subscription;

  constructor() { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.init();
  }

  init(): Promise<BehaviorSubject<GameElement[]>> {
    let resolveStore = this.objectStore ? Promise.resolve(this.objectStore) :
      initObjectStore(DB_NAME, STORE_VERSION).then(db => this.objectStore = db);

    return resolveStore.then(db => getAllFromStore(db, GAME_STORE_NAME)).then(results => {
      this.games = new BehaviorSubject(<GameElement[]>results.map(GameElement.fromObject.bind(GameElement)));
      if (this.gameSub) {
        this.gameSub.unsubscribe();
      }
      this.gameSub = this.monitorChanges(this.games);
      this.ready = true;
      return this.games;
    });
  }

  monitorChanges(ob) {
    // unnecessarily saves all games
    return ob.concatMap(arr => {
      return Observable.fromPromise(Promise.all(arr.map(game => {
        return saveToStore(this.objectStore, GAME_STORE_NAME, game);
      })));
    }).subscribe(saveResult => {
      console.log(this.games.getValue(), saveResult);
    });
  }

  getGames(): Observable<any> {
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
    return Observable.fromPromise(saveToStore(this.objectStore, GAME_STORE_NAME, game).then(id => {
      game.state = 'SAVED';
      return game;
    }));
  }

  removeGame(game) {
    // should error if game does not exist, etc
    let games = this.games.getValue();
    let i = games.indexOf(game);
    if (i !== -1) {
      return Observable.fromPromise(removeFromStore(this.objectStore, GAME_STORE_NAME, game.id).then(id => {
        games.splice(i, 1);
        this.games.next(games);
      })).ignoreElements().concat(this.games);
    }
    return this.games;
  }
}
