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

const appPath = app.getAppPath();
const resourcesRoot = appPath.endsWith('asar') ? join(appPath, '..') :  join(appPath, 'resources');

export class FileWatcher {
  private readonly _filter: string;
  private _fileChange = new Subject<FileChange>();
  private _child: ReturnType<typeof spawn>;

  public get fileChange() {return this._fileChange.asObservable();}

  public constructor(filter: string) {
    this._filter = filter;
  }

  public start() {
    const cmd = join(resourcesRoot, 'FileWatcher.exe');
    const child = spawn(cmd, [this._filter]);
    child.stdout.setEncoding('utf8');

    child.stdout.on('data', (data: string) => {
      const lines = splitJson(data);

      for (const dataLine of lines) {
        const prepared = dataLine.split('\\\\').join('/');
        try {
          this._fileChange.next(JSON.parse(prepared));
        } catch (e) {
          console.error(e, dataLine);
        }
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

function splitJson(str: string) {
  const result = [];
  const bracketsStack = [];
  let start = 0;

  for (let charIndex = 0; charIndex < str.length; charIndex++) {
    const char = str[charIndex];

    if (char == '"') {
      if (bracketsStack[bracketsStack.length - 1] == '"')
        bracketsStack.pop();
      else
        bracketsStack.push('"');

      continue;
    }

    if (char == '{') {
      if (bracketsStack.length == 0)
        start = charIndex;
      bracketsStack.push(char);
    }

    if (char == '}') {
      if (bracketsStack[bracketsStack.length - 1] != '{')
        throw new Error('Parse brackets error');

      bracketsStack.pop();
      if (bracketsStack.length == 0)
        result.push(str.slice(start, charIndex + 1));
    }
  }

  return result;
}
