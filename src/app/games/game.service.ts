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

function getOneFromStore(db: IDBDatabase, storeName: string, id: string, key?: string): Promise<any> {
  return new Promise(function(resolve, reject) {
    let trans = db.transaction(storeName);
    let store = <any>trans.objectStore(storeName);
    if (key!=null) {
      store = store.index(key);
    }
    let req = store.get(id);
    req.onsuccess = function(e: IDBEvent) {
      resolve(e.target.result);
    };
    req.onerror = function(e: IDBEvent) {
      reject(e.target.error);
    };
  });
}

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

function unloadFunction(e) {
  let message = 'There are unsaved changes. Are you sure you want to leave?';
  if(e) {
    e.returnValue = message;
  }
  return message;
}

function enableUnloadWarning(enabled=true) {
  window.onbeforeunload = enabled ? unloadFunction : null;
}


@Injectable()
export class GameService implements Resolve<GameElement[]> {
  private objectStore: IDBDatabase;

  public games = new BehaviorSubject<GameElement[]>([]);

  public loaded = {};
  public isSaving: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private gameSub: Subscription;

  constructor() { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.init();
  }

  init(): Promise<BehaviorSubject<GameElement[]>> {
    let resolveStore = this.objectStore ? Promise.resolve(this.objectStore) :
      initObjectStore(DB_NAME, STORE_VERSION).then(db => this.objectStore = db);

    this.isSaving.subscribe(isSaving => enableUnloadWarning(isSaving));

    return this.games.getValue().length ? Promise.resolve(this.games) : resolveStore
      .then(db => getAllFromStore(db, GAME_STORE_NAME))
      .then(results => {
        this.games.next(<GameElement[]>results.map(GameElement.fromObject.bind(GameElement)))
        return this.games;
      });
  }

  monitor(bs:BehaviorSubject<GameElement>) {
    // errors here are silent
    return bs
      .switchMap(game => {
        this.isSaving.next(true);
        game.state = 'UNSAVED';
        return Observable.of(game).delay(1000);
      })
      .switchMap(game => {
        return this.saveOne(game).then(()=>{
          game.state = 'SAVED';
          // this breaks if there are multiple changes (in different stream) within 1s window
          this.isSaving.next(false);
          return game;
        });
      })
      // merge w/ game array
      .withLatestFrom(this.games)
      .map(([game, games]:[GameElement, GameElement[]]) => {
        let g = games.find(g => g.id==game.id)
        if (g == null) {
          return games.concat(game);
        } else {
          games.splice(games.indexOf(g), 1, game);
          return games;
        }
      })
      .subscribe((val)=> this.games.next(val), (err) => console.error(err));
  }

  saveOne(game: GameElement): Promise<GameElement> {
    let obj = game.toJSON();
    return saveToStore(this.objectStore, GAME_STORE_NAME, obj).then(()=> {
      return game;
    });
  }

  getGameById(id:string): Promise<BehaviorSubject<GameElement>> {
    if(id in this.loaded) return Promise.resolve(this.loaded[id]);
    return getOneFromStore(this.objectStore, GAME_STORE_NAME, id).then(record => {
      if(record == null) return Promise.reject(new Error('no record with that id'));
      let bs = new BehaviorSubject(GameElement.fromObject(record));
      this.loaded[id] = bs;
      this.monitor(bs);
      return Promise.resolve(bs);
    });
  }

  getGames() {
    return this.games;
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
