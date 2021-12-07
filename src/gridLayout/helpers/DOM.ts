let currentDir: 'ltr' | 'rtl' | 'auto' = 'auto';
// let currentDir = "auto";

function hasDocument() {
  return typeof document !== 'undefined';
}

function hasWindow() {
  return typeof window !== 'undefined';
}

export function getDocumentDir(): string {
  if (!hasDocument()) {
    return currentDir;
  }
  const direction =
    typeof document.dir !== 'undefined'
      ? document.dir
      : document.getElementsByTagName('html')[0].getAttribute('dir') || 'auto';
  return direction;
}

export function setDocumentDir(dir: 'ltr' | 'rtl' | 'auto'): boolean {
  // export function setDocumentDir(dir){
  if (!hasDocument) {
    currentDir = dir;
    return false;
  }

  const html = document.getElementsByTagName('html')[0];
  html.setAttribute('dir', dir);
  return true;
}

export function addWindowEventListener(event: string, callback: () => any): boolean {
  if (!hasWindow) {
    callback();
    return false;
  }
  window.addEventListener(event, callback);
  return true;
}

export function removeWindowEventListener(event: string, callback: () => any): boolean {
  if (!hasWindow) {
    return false;
  }
  window.removeEventListener(event, callback);
  return true;
}
