class KeyboardManager {
  private keysSet = new Set<string>();

  constructor() {
    document.addEventListener('keydown', (e) => {
      this.keysSet.add(e.key);
    });

    document.addEventListener('keyup', (e) => {
      this.keysSet.delete(e.key);
    });

    window.addEventListener('focus', () => {
      this.keysSet.clear();
    });
  }

  get shift() {return this.keysSet.has('Shift');}

  get ctrlCmd() {return this.cmd || this.ctrl;}

  get ctrl() {return this.keysSet.has('Control');}

  get cmd() {return this.keysSet.has('Command');}

  get alt() {return this.keysSet.has('Alt');}

}

export const keyboardManager = new KeyboardManager();
