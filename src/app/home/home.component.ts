import { Component, OnInit, ViewChild, AfterContentInit, ElementRef } from '@angular/core';
import { ApiService } from '../api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { reduce, count } from 'rxjs/operators';
import { stringify } from 'querystring';
import { keyframes } from '@angular/animations';
import { MatGridList } from '@angular/material/grid-list';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatFormField } from '@angular/material/form-field';


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
  @ViewChild('taskIdToAdd') inputTask: ElementRef

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



  addNewTask(user: any, value: any) {

    let newTaskId = String(value);
    if (value) {
      this.addTask(user, newTaskId);
    }
    // this.taskIdToAdd.value = '';
    // this.inputTask.nativeElement.value = '';
    // this.form.value.taskIdToAdd = '';
    // this.inputTask.nativeElement.value = '';
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

    if (user.interruptions) {
      user.interruptions.push(new Date());
    }
    else {
      user['interruptions'] = [new Date()];
    }


    this.apiService.updateUser(user, { "interruptions": user.interruptions });
  }

  getRandomColor(user: any, index: number) {

    // let option = (Math.floor(Math.random() * 100)) % 6;
    if (index == 0 || this.last_color == COLORS.length) {
      this.last_color = 0;
    }
    if (user.color) {
      return user.color;
    }
    if (!user.color) {
      user.color = COLORS[this.last_color++];
    }
    return user.color;
  }
}
