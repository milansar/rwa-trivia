import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DbService } from './../db.service';
import { firestore } from '@nativescript/firebase/app';
import { firebase } from '@nativescript/firebase';


@Injectable()
export class TNSDbService extends DbService {

    constructor(private zone: NgZone,
        protected _store: Store<any>
    ) {
        super();
    }

    public createDoc(collectionName: string, document: any) {
        const collectionRef = firebase.firestore.collection(collectionName);
        return collectionRef.add(document).then((documentRef) => {
            document.id = documentRef.id;
            return this.setDoc(collectionName, documentRef.id, document);
        });
    }

    public CreateDocWithoutDocID(collectionName: string, document: any) {
        const collectionRef = firebase.firestore.collection(collectionName);
        return collectionRef.add(document);
    }

    public setDoc(collectionName: string, docId: any, document: any, timeStamp = null) {
        if (timeStamp !== null && timeStamp) {
            if (timeStamp.createdOn) {
                document = { ...document, createdOn: firebase.firestore.FieldValue.serverTimestamp()};
            }
            if (timeStamp.updatedOn) {
                document = { ...document, updatedOn: firebase.firestore.FieldValue.serverTimestamp() };
            }
        }
        const userCollection = firebase.firestore.collection(collectionName);
        return userCollection.doc(docId).set(document, { merge: true });
    }

    public updateDoc(collectionName, docId, document) {
        const userCollection = firebase.firestore.collection(collectionName);
        userCollection.doc(docId).set(document, { merge: true });
    }

    public valueChanges(collectionName: string, path?: any, queryParams?: any): Observable<any> {
        let query;
        const collectionRef = firebase.firestore.collection(collectionName);
        if (path) {
            query = collectionRef.doc(path);
        } else {
            query =  collectionRef.where;
            if (queryParams) {
                for (const param of queryParams.condition) {
                    query = query.where(param.name, param.comparator, param.value);
                }
                if (queryParams.orderBy) {
                    for (const param of queryParams.orderBy) {
                        query = query.orderBy(param.name, param.value);
                    }
                }
                if (queryParams.limit) {
                    query = query.limit(queryParams.limit);
                }
            }

        }
        return new Observable(observer => {
            const unsubscribe = query.onSnapshot((snapshot: any) => {

                let results = [];
                if (snapshot && snapshot.forEach) {
                    snapshot.forEach(doc => results.push({
                        id: doc.id,
                        ...doc.data()
                    }));
                } else {
                    results = snapshot.data();
                }
                this.zone.run(() => {
                    if (results !== undefined) {
                        observer.next(results);
                    } else {
                        observer.next(undefined);
                    }
                });
            });
            return () => unsubscribe();
        });
    }
    public createId() {
        return firebase.firestore.collection('_').doc().id;
    }

    public getFireStorageReference(filePath: string) {

    }

    public getFireStore() {

    }

    public getStore(): any {

    }

    public getDoc(collectionName: string, docId: any): any {
        const collectionRef = firebase.firestore.collection(collectionName);
        return collectionRef.doc(docId);
    }

    public upload(filePath: string, imageBlob: any): any {

    }

    public deleteDoc(collectionName: string, docId: any): any {
        const collectionRef = firebase.firestore.collection(collectionName);
        return collectionRef.doc(docId).delete();
    }

}
