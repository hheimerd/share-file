import {ipcRenderer} from 'electron';
import {IpcMessage} from '../../electron/main/ipc-message';
import {sleep} from '@/utils/sleep';

export class FSApi {
  public static getFileIcon(path: string) {
    return Promise.race([
      new Promise<string>((resolve) => {
        ipcRenderer.once(IpcMessage.GetFileIcon + path, (e, base64image: string) => {
          resolve(base64image);
        });

        ipcRenderer.send(IpcMessage.GetFileIcon, path);
      }),
      sleep(300),
    ]);
  }
}
