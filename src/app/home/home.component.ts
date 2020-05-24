import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { reduce, count } from 'rxjs/operators';
import { stringify } from 'querystring';
import { keyframes } from '@angular/animations';

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
export class HomeComponent implements OnInit {

  form: FormGroup

  users: any;

  last_color = 0;

  constructor(private apiService: ApiService, private fb: FormBuilder) { }

  ngOnInit() {
    this.getData();

    this.form = this.fb.group({
      user: [''],
      taskIdToAdd: ['']
    })
  }

  getData() {

    // this.users = this.apiService.getUsers();

    this.apiService.getUsers().subscribe((data: any[]) => {
      console.log(data);
      this.users = data;
    });
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

  getRandomColor() {
    let option = (Math.floor(Math.random() * 100)) % 6;

    if (this.last_color == COLORS.length) {
      this.last_color = 0;
    }
    return COLORS[this.last_color++];
  }
}
