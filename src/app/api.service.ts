import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

const COLLECTION_NAME = "users";

@Injectable({
  providedIn: 'root',
})


export class ApiService {

  constructor(private firestore: AngularFirestore) { }

  createUser(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(COLLECTION_NAME)
        .add(data)
        .then(res => { }, err => reject(err));
    });
  }

  getUsers() {
    return this.firestore.collection(COLLECTION_NAME).valueChanges({ idField: 'id' });
  }

  updateUser(user: any, dataToUpdate: any) {
    return this.firestore
      .collection(COLLECTION_NAME)
      .doc(user.id)
      .set(dataToUpdate, { merge: true });
  }

  deleteUser(data) {
    return this.firestore
      .collection(COLLECTION_NAME)
      .doc(data.payload.doc.id)
      .delete();
  }
}
