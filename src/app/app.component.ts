import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument 
} from 'angularfire2/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  postRef: AngularFirestoreDocument<any>;
  post$: Observable<any>;

  commentsRef: AngularFirestoreCollection<any>;
  comments$: Observable<any>;

  formValue: string;

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.postRef = this.afs.doc('posts/testPost')
    this.commentsRef = this.postRef.collection('comments', ref => ref.orderBy('createdAt', 'desc') )
    this.post$ = this.postRef.valueChanges();
  }

  addComment() {
    this.commentsRef.add({ content: this.formValue, createdAt: new Date() })
    this.formValue = '';
  }

  loadMore() {
    this.comments$ = this.commentsRef.valueChanges();
  }


}
