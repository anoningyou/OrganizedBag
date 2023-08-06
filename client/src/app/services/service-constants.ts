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
    Login = `${this._root}/login`;
}

export class ServiceConstants {
    public static Account: Account = new Account();
    public static Properties: Properties = new Properties();
}