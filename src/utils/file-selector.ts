export async function openFSSelector({selectDirectory = false, mime = '', multiple = false} = {}) {
  return new Promise<FileList | null>(resolve => {
    const input = document.createElement('input');

    input.webkitdirectory = selectDirectory;
    input.type = 'file';
    input.multiple = multiple;
    input.accept = mime;

    input.addEventListener('change', () => {
      resolve(input.files);
    });

    input.click();
  });
}
