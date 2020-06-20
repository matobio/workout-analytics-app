import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { reduce, count } from 'rxjs/operators';
import { stringify } from 'querystring';
import { keyframes } from '@angular/animations';
import { MatGridList } from '@angular/material/grid-list';
import { MediaChange, MediaObserver } from '@angular/flex-layout';


const COLORS = ['rgb(226,0,60,0.6)',
  'rgb(30,200,255,0.6)',
  'rgb(0,255,0,0.6)',
  'rgb(255,255,0,0.6)'
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterContentInit {

  @ViewChild('grid') grid: MatGridList;

  gridByBreakpoint = {
    xl: 3,
    lg: 3,
    md: 3,
    sm: 2,
    xs: 1
  }
  form: FormGroup
  users: any;
  last_color = 0;

  constructor(private apiService: ApiService, private fb: FormBuilder, private observableMedia: MediaObserver) { }

  ngOnInit() {
    this.getData();

    this.form = this.fb.group({
      user: [''],
      taskIdToAdd: ['']
    })
  }

  ngAfterContentInit() {
    this.observableMedia.media$.subscribe((change: MediaChange) => {
      this.grid.cols = this.gridByBreakpoint[change.mqAlias];
    });

  }

  getData() {

    this.apiService.getUsers().subscribe((data: any[]) => {
      console.log(data);
      this.users = data;
    });
  }

  getUsersByName(name: string) {
    if (name == '') {
      this.getData();
    } else {
      this.users = this.users.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
    }
  }


  getTareas(user: any) {

    if (!user.tasks) {
      return "";
    }

    let tasksShow = [];

    let tasks = user.tasks;
    for (let i = 0; i < Object.entries(tasks).length; i++) {
      tasksShow.push(tasks[i].taskId);
    }

    return tasksShow;
  }



  getInterruptions(user: any) {

    if (!user.interruptions) {
      return "";
    }

    return user.interruptions;
  }



  addNewTask(user: any) {

    let newTaskId = String(this.form.value.taskIdToAdd);
    if (this.form.value.taskIdToAdd) {
      this.addTask(user, newTaskId);
    }
    this.form.reset();
  }

  addTask(user: any, newTaskId: string) {
    let tasks = [];
    if (user.tasks) {
      tasks = user.tasks;
    }
    let newTasksToAdd = {
      "taskId": newTaskId,
      "date": new Date()
    };
    tasks.push(newTasksToAdd);
    this.apiService.updateUser(user, { "tasks": tasks });
  }



  addInterrupt(user: any) {

    user.interruptions.push(new Date());


    this.apiService.updateUser(user, { "interruptions": user.interruptions });
  }

  getRandomColor(user) {
    let option = (Math.floor(Math.random() * 100)) % 6;

    if (this.last_color == COLORS.length) {
      this.last_color = 0;
    }
    if (!user.color) {
      user.color = COLORS[this.last_color++];
    }
    return user.color;
  }
}
