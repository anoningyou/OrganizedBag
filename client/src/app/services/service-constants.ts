class Account
{
    private _root = 'Account';
    Register = `${this._root}/Register`;
    Login = `${this._root}/Login`;
}

class Properties
{
    private _root = 'Properties';
    GetAll = `${this._root}/GetAll`;
    Add = `${this._root}/Add`;
    Edit = `${this._root}/Edit`;
}

class Items
{
    private _root = 'Items';
    GetAll = `${this._root}/GetAll`;
    Add = `${this._root}/Add`;
    Edit = `${this._root}/Edit`;
}

class Complects
{
    private _root = 'Complects';
    GetAll = `${this._root}/GetAll`;
    Add = `${this._root}/Add`;
    Edit = `${this._root}/Edit`;
}

export class ServiceConstants {
    public static Account: Account = new Account();
    public static Properties: Properties = new Properties();
    public static Items: Items = new Items();
    public static Complects: Complects = new Complects();
}