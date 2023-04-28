import {join} from 'path';
import {app} from 'electron';
import {spawn} from 'child_process';
import {Subject} from 'rxjs';

export enum Action {
  Changed = 'changed',
  Created = 'created',
  Deleted = 'deleted',
  Renamed = 'renamed',
  Error = 'error',
}

type FileChange = {
  action: Action.Changed | Action.Created | Action.Deleted,
  path: string
} | {
  action: Action.Error,
  message: string
} | {
  action: Action.Renamed,
  oldName: string,
  newName: string
}

export class FileWatcher {
  private readonly _filter: string;
  private _fileChange = new Subject<FileChange>();
  private _child: ReturnType<typeof spawn>;

  public get fileChange() {return this._fileChange.asObservable();}

  public constructor(filter: string) {
    this._filter = filter;
  }

  public start() {
    const cmd = join(app.getAppPath(), 'resources', 'FileWatcher.exe');
    const child = spawn(cmd, [this._filter]);
    child.stdout.setEncoding('utf8');

    child.stdout.on('data', (data: string) => {
      const lines = data
        .split('\n')
        .map(x => x.trim())
        .filter(x => x.length > 0);

      for (const dataLine of lines) {
        const prepared = dataLine.split('\\\\').join('/');
        this._fileChange.next(JSON.parse(prepared));
      }
    });

    child.addListener('error', e => {
      this._fileChange.next({action: Action.Error, message: e.message});
    });
    this._child = child;
  }

  public dispose() {
    this._child.kill(0);
  }

}

