import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { delay } from 'rxjs/operators';
import * as Rx from 'rxjs';
import {
  NoTodoListData,
  TodoListModel,
} from '../models/TodoListModel/TodoListModel';

import { TodolistService } from './todolist.service';
import { AddTodoItemModel } from '../models/TodoListModel/NewTodoItemModel';
import { environment } from 'src/environments/environment';
import { ResponseErrorModel } from '../models/ErrorModel/ErrorModel';
import { throwError } from 'rxjs';

const TodoListTest: TodoListModel[] = [
  { Description: 'Interstellar' } as TodoListModel,
  { Description: 'The big Lebowski' } as TodoListModel,
  { Description: 'Fences' } as TodoListModel,
];

const PostTodoResponse = {
  Message: 'TodoItem is successfully added!',
  StatusCode: 200,
};

const TodoEmptyListTest: TodoListModel[] = [];

describe('TodolistService', () => {
  let todoListService: TodolistService;
  let http: HttpTestingController;
  const PostTodoItemMsg =
    'Http failure response for http://35.242.245.169:9000/api/v1/todoList: 404 Not Found';
  const GetTodoItemMsg =
    'Http failure response for http://35.242.245.169:9000/api/v1/todoList: 404 Not Found';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
    }).compileComponents();

    TestBed.configureTestingModule({});
    todoListService = TestBed.inject(TodolistService);
    http = TestBed.inject(HttpTestingController);
  });

  // afterEach(() => {
  //   // After every test, assert that there are no more pending requests.
  //   http.verify();
  // });

  it('should be created', () => {
    expect(todoListService).toBeTruthy();
  });

  it('can return empty todolist', () => {
    todoListService
      .GetTodoList()
      .subscribe((data: TodoListModel[] | NoTodoListData[]) => {
        return Rx.of([]).pipe();
      });

    const req = http.expectOne(environment.GetTodoUrl);

    expect(req.request.method).toEqual('GET');
    expect(req.request.url).toBe(environment.GetTodoUrl);
    expect(req.request.body).toEqual(null);

    req.flush(TodoEmptyListTest);

    expect(TodoEmptyListTest.length).toBe(0);

    http.verify();
  });

  it('can return some todo items', () => {
    todoListService
      .GetTodoList()
      .subscribe((data: TodoListModel[] | NoTodoListData[]) => {
        expect(data.length).toBeGreaterThanOrEqual(1);
      });

    const req = http.expectOne(environment.GetTodoUrl);

    expect(req.request.method).toEqual('GET');
    expect(req.request.url).toBe(environment.GetTodoUrl);
    expect(req.request.body).toEqual(null);

    // Respond with mock error
    req.flush(TodoListTest);

    expect(TodoListTest.length).toBeGreaterThanOrEqual(1);
    http.verify();
  });

  it('should add todo item to mongodb', async () => {
    todoListService
      .AddNewTodoItem('Testing...')
      .subscribe((data: AddTodoItemModel) => { });
    const req = http.expectOne(environment.PostTodoUrl);

    expect(req.request.method).toEqual('POST');
    expect(req.request.url).toBe(environment.PostTodoUrl);
    expect(req.request.headers.has('Content-Type'));
    expect(req.request.body).toEqual({ Description: 'Testing...' });

    req.flush(PostTodoResponse);
    expect(PostTodoResponse.StatusCode).toBe(200);
    http.verify();
  });

  it('test error handling at addTodoItem endpoint', () => {
    spyOn(todoListService, 'errorHandel').and.callThrough();

    todoListService.AddNewTodoItem('Testing...').subscribe(
      (data: AddTodoItemModel) => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(todoListService.errorHandel).toHaveBeenCalled(); // check if executed

        expect(error.status).toEqual(404);
        expect(error.message).toEqual(PostTodoItemMsg);
      }
    );
    const req = http.expectOne(environment.PostTodoUrl);

    // Respond with mock error
    req.flush(PostTodoItemMsg, { status: 404, statusText: 'Not Found' });
  });

  it('test error handling at getTodoItem endpoint', () => {
    spyOn(todoListService, 'errorHandel').and.callThrough();

    todoListService.GetTodoList().subscribe(
      (data: AddTodoItemModel) => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(todoListService.errorHandel).toHaveBeenCalled(); // check if executed
        expect(error.status).toEqual(404);
        expect(error.message).toEqual(GetTodoItemMsg);
      }
    );
    const req = http.expectOne(environment.GetTodoUrl);

    // Respond with mock error
    req.flush(GetTodoItemMsg, { status: 404, statusText: 'Not Found' });
  });

  it('test retry count at getTodoList endpoint', fakeAsync(() => {
    spyOn(todoListService, 'errorHandel').and.callThrough();

    todoListService.GetTodoList().subscribe(
      (data: AddTodoItemModel) => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(todoListService.errorHandel).toHaveBeenCalled(); // check if executed

        console.log(error);
        expect(error.status).toEqual(404);
        expect(error.message).toEqual(GetTodoItemMsg);
      }
    );

    const retry = 5;
    for (let i = 0, c = retry + 1; i < c; i++) {
      const req = http.expectOne(environment.GetTodoUrl);
      expect(req.request.method).toEqual('GET');
      expect(req.request.url).toBe(environment.GetTodoUrl);
      expect(req.request.body).toEqual(null);
      req.flush(GetTodoItemMsg, { status: 404, statusText: 'Not Found' });
    }
  }));

  it('test retry count at addNewTodoItem endpoint', fakeAsync(() => {
    spyOn(todoListService, 'errorHandel').and.callThrough();

    todoListService.AddNewTodoItem('Testing...').subscribe(
      (data: AddTodoItemModel) => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(todoListService.errorHandel).toHaveBeenCalled(); // check if executed

        console.log(error);
        expect(error.status).toEqual(404);
        expect(error.message).toEqual(PostTodoItemMsg);
      }
    );

    const retry = 5;
    for (let i = 0, c = retry + 1; i < c; i++) {
      const req = http.expectOne(environment.PostTodoUrl);
      expect(req.request.method).toEqual('POST');
      expect(req.request.url).toBe(environment.PostTodoUrl);
      expect(req.request.headers.has('Content-Type'));
      expect(req.request.body).toEqual({ Description: 'Testing...' });
      req.flush(PostTodoItemMsg, { status: 404, statusText: 'Not Found' });
    }
  }));

  it('should return the list of todoitem if the backend returns an error 5 times and than succeds', fakeAsync(() => {
    spyOn(todoListService, 'errorHandel').and.callThrough();

    todoListService.GetTodoList().subscribe(
      (data: AddTodoItemModel) => { },
      (error: HttpErrorResponse) => {
      }
    );

    const retry = 4;
    for (let i = 0, c = retry + 1; i < c; i++) {
      const req = http.expectOne(environment.GetTodoUrl);
      expect(req.request.method).toEqual('GET');
      expect(req.request.url).toBe(environment.GetTodoUrl);
      expect(req.request.body).toEqual(null);
      req.flush(GetTodoItemMsg, { status: 404, statusText: 'Not Found' });
    }

    const req = http.expectOne(environment.GetTodoUrl);
    expect(req.request.method).toEqual('GET');
    expect(req.request.url).toBe(environment.GetTodoUrl);
    expect(req.request.body).toEqual(null);
    req.flush(TodoListTest);

    expect(TodoListTest.length).toBeGreaterThanOrEqual(1);
  }));

  it('should return the info of adding new todoitem if the backend returns an error 4 times and than succeds', fakeAsync(() => {
    spyOn(todoListService, 'errorHandel').and.callThrough();

    todoListService.AddNewTodoItem('Testing...').subscribe(
      (data: AddTodoItemModel) => { },
      (error: HttpErrorResponse) => {
      }
    );

    const retry = 4;
    for (let i = 0, c = retry + 1; i < c; i++) {
      const req = http.expectOne(environment.PostTodoUrl);
      expect(req.request.method).toEqual('POST');
      expect(req.request.url).toBe(environment.PostTodoUrl);
      expect(req.request.headers.has('Content-Type'));
      expect(req.request.body).toEqual({ Description: 'Testing...' });
      req.flush(PostTodoItemMsg, { status: 404, statusText: 'Not Found' });
    }

    const req = http.expectOne(environment.PostTodoUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.url).toBe(environment.PostTodoUrl);
    expect(req.request.headers.has('Content-Type'));
    expect(req.request.body).toEqual({ Description: 'Testing...' });
    req.flush(PostTodoResponse);

    expect(PostTodoResponse.StatusCode).toBe(200);
  }));
});
