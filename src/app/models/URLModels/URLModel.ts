export class URLModel {
  private _ProductionURLS = {
    getTodoListUrl: 'http://35.242.245.169:9000/api/v1/getTodoList',
    addNewTodoItemUrl: 'http://35.242.245.169:9000/api/v1/addNewTodoItem',
  };

  public get ProductionURLS() {
    return this._ProductionURLS;
  }

  constructor() {}
}
