import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { delay } from 'rxjs/operators';
import { AppComponent } from './app.component';
import { TodoListModel } from './models/TodoListModel/TodoListModel';
import { TodolistService } from './services/todolist.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as Rx from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const TodoListTest: TodoListModel[] = [
  { Description: 'Interstellar' } as TodoListModel,
  { Description: 'The big Lebowski' } as TodoListModel,
  { Description: 'Fences' } as TodoListModel,
];

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let todoListService: TodolistService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatListModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatCardModule,
        MatInputModule,
        MatDialogModule,
      ],
      declarations: [AppComponent],
      providers: [TodolistService],
    }).compileComponents();
    todoListService = TestBed.inject(TodolistService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(AppComponent).toBeTruthy();
  });

  it('should have a title', () => {
    const titleElements = fixture.debugElement.queryAll(By.css('h1'));
    expect(titleElements.length).toBe(1);
    expect(titleElements[0].nativeElement.innerHTML).toBe('TodoList Project');
  });

  it('should have a form and sub elements', () => {
    const formElement = fixture.debugElement.queryAll(By.css('.form'));
    expect(formElement.length).toBe(1);

    const formGroupElement = fixture.debugElement.queryAll(
      By.css('.form-group')
    );
    expect(formGroupElement.length).toEqual(2);
  });

  it('should have a Chrome Tab Title', () => {
    expect(component.title).toBe('todo-app');
  });

  it('can show empty todo list', fakeAsync(() => {
    const service = fixture.debugElement.injector.get(TodolistService);
    let spyGetTodoList = spyOn(service, 'GetTodoList').and.callFake(() => {
      return Rx.of([]).pipe(delay(100));
    });

    component.getTodoList();
    tick(100);

    expect(component.noData).toEqual(true);

    expect(component.TodoList).toEqual([]);

    // const statusElement = fixture.debugElement.queryAll(By.css('.status'));
    // expect(statusElement.length).toBe(1);
    // expect(statusElement[0].nativeElement.innerHTML).toBe('No Todo Data!');
  }));

  it('can show some of the items of todo list', fakeAsync(() => {
    const service = fixture.debugElement.injector.get(TodolistService);
    let spyGetTodoList = spyOn(service, 'GetTodoList').and.callFake(() => {
      return Rx.of([{ Description: 'Angular Unit Testing!' }]).pipe(
        delay(2000)
      );
    });

    component.getTodoList();
    tick(2000);
    expect(component.TodoList.length).toBeGreaterThanOrEqual(1);
  }));

  it('can add todo item to database via API', fakeAsync(() => {
    const service = fixture.debugElement.injector.get(TodolistService);
    let spyAddNewTodoItem = spyOn(service, 'AddNewTodoItem').and.callFake(
      () => {
        return Rx.of([
          { Message: 'TodoItem is successfully added!', StatusCode: '200' },
        ]).pipe(delay(2000));
      }
    );

    component.SubmitTodoItem('Testing Angular');
    tick(2000);
  }));

  // it('can show error if todolist are fail', () => {
  //   const errorMsg = "Error"

  //   let spyGetTodoList = spyOn(todoListService, 'GetTodoList').and.returnValue(Rx.throwError([]));
  //   fixture.detectChanges();
  //   expect(component.TodoList.length).toBe(0);

  //   const errorElement = fixture.debugElement.queryAll(By.css('.status'));
  //   expect(errorElement.length).toBe(0);
  //   expect(errorElement[0].nativeElement.innerHTML).toContain(errorMsg);

  // });

});
