
export class Repository {
  constructor(owner: Owner, id: number, node_id: string, name: string, full_name: string, myprivate: boolean,
              description: any, url: string, created_at: Date, updated_at: Date, language: string, license: any,
              visibility: string, html_url: string) {
    this._owner = owner;
    this._id = id;
    this._node_id = node_id;
    this._name = name;
    this._full_name = full_name;
    this._myprivate = myprivate;
    this._description = description;
    this._url = url;
    this._created_at = created_at;
    this._updated_at = updated_at;
    this._language = language;
    this._license = license;
    this._visibility = visibility;
    this._html_url = html_url;
  }

  private _owner: Owner;

  get owner(): Owner {
    return this._owner;
  }

  set owner(value: Owner) {
    this._owner = value;
  }

  private _id: number;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  private _node_id: string;

  get node_id(): string {
    return this._node_id;
  }

  set node_id(value: string) {
    this._node_id = value;
  }

  private _name: string;

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  private _full_name: string;

  get full_name(): string {
    return this._full_name;
  }

  set full_name(value: string) {
    this._full_name = value;
  }

  private _myprivate: boolean;

  get myprivate(): boolean {
    return this._myprivate;
  }

  set myprivate(value: boolean) {
    this._myprivate = value;
  }

  private _description: any;

  get description(): any {
    return this._description;
  }

  set description(value: any) {
    this._description = value;
  }

  private _url: string;

  get url(): string {
    return this._url;
  }

  set url(value: string) {
    this._url = value;
  }

  private _created_at: Date;

  get created_at(): Date {
    return this._created_at;
  }

  set created_at(value: Date) {
    this._created_at = value;
  }

  private _updated_at: Date;

  get updated_at(): Date {
    return this._updated_at;
  }

  set updated_at(value: Date) {
    this._updated_at = value;
  }

  private _language: string;

  get language(): string {
    return this._language;
  }

  set language(value: string) {
    this._language = value;
  }

  private _license: any;

  get license(): any {
    return this._license;
  }

  set license(value: any) {
    this._license = value;
  }

  private _visibility: string;

  get visibility(): string {
    return this._visibility;
  }

  set visibility(value: string) {
    this._visibility = value;
  }

  private _html_url: string;

  get html_url(): string {
    return this._html_url;
  }

  set html_url(value: string) {
    this._html_url = value;
  }
}

export class Owner {
  constructor(login: string, id: number, avatar_url: string, url: string, html_url: string) {
    this._login = login;
    this._id = id;
    this._avatar_url = avatar_url;
    this._url = url;
    this._html_url = html_url;
  }

  private _login: string;

  get login(): string {
    return this._login;
  }

  set login(value: string) {
    this._login = value;
  }

  private _id: number;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  private _avatar_url: string;

  get avatar_url(): string {
    return this._avatar_url;
  }

  set avatar_url(value: string) {
    this._avatar_url = value;
  }

  private _url: string;

  get url(): string {
    return this._url;
  }

  set url(value: string) {
    this._url = value;
  }

  private _html_url: string

  get html_url(): string {
    return this._html_url;
  }

  set html_url(value: string) {
    this._html_url = value;
  }
}


