import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ResponseErrorModel } from './models/ErrorModel/ErrorModel';
import { AddTodoItemModel } from './models/TodoListModel/NewTodoItemModel';
import {
  NoTodoListData,
  TodoListModel,
} from './models/TodoListModel/TodoListModel';
import { DialogService } from './services/dialog.service';
import { TodolistService } from './services/todolist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private TodoListService: TodolistService,
    private dialogService: DialogService,
    private matDialog: MatDialog
  ) {
    this.dialogService = new DialogService(this.matDialog);
  }

  ngOnInit(): void {
    this.getTodoList();
  }

  title = 'todo-app';
  TodoList: any = [];
  noData: boolean = false;

  descriptionData: string = '';

  todoform: FormGroup = new FormGroup({
    description: new FormControl('', Validators.required),
  });

  SubmitTodoItem(TodoItem: string): void {
    this.TodoListService.AddNewTodoItem(TodoItem).subscribe(
      (NewTodoItemResponse: AddTodoItemModel) => {
        console.log(NewTodoItemResponse);
        switch (NewTodoItemResponse.StatusCode) {
          case 200:
            alert(NewTodoItemResponse.Message);

            this.refreshDataSource();

            this.getTodoList();

            break;

          case 500:
            alert(NewTodoItemResponse.Message);

            this.dialogService.CloseDialog();

            break;

          default:
            this.dialogService.CloseDialog();

            break;
        }
      },
      (error: HttpErrorResponse) => {
        switch (error.status) {
          case 500:
            alert(error.status + ' ' + error.message);

            this.dialogService.CloseDialog();

            break;

          default:
            this.dialogService.CloseDialog();

            break;
        }
      }
    );
  }

  getTodoList(): void {
    this.dialogService.ShowLoadingScreen();

    this.TodoListService.GetTodoList().subscribe(
      (TodoItem: TodoListModel[] | NoTodoListData[]) => {
        var Result = TodoItem.length > 0;

        switch (Result) {
          case true:
            TodoItem.map((element) => {
              this.TodoList.push(element);
            });

            this.dialogService.CloseDialog();

            break;

          case false:
            this.noData = true;
            this.dialogService.CloseDialog();

            break;

          default:
            this.dialogService.CloseDialog();

            break;
        }
      },
      (error: HttpErrorResponse) => {
        switch (error.status) {
          case 400:
            alert(error.status + ' ' + error.message);

            this.dialogService.CloseDialog();

            break;

          case 500:
            alert(error.status + ' ' + error.message);

            this.dialogService.CloseDialog();

            break;

          default:
            this.dialogService.CloseDialog();

            break;
        }
      }
    );
  }

  refreshDataSource(): void {
    this.TodoList = [];
  }
}
