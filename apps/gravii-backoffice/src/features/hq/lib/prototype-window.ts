export type PrototypeWindow = Window & {
  filterPartnerList?: () => void;
  handleSuggestion?: (key: string) => void;
  navTo?: (element: HTMLElement) => void;
  navToPage?: (pageId: string) => void;
  resetF?: (button: HTMLElement) => void;
  searchUser?: () => void;
  sendChat?: () => void;
  showPartnerDetail?: (name: string) => void;
  togF?: (element: HTMLElement) => void;
  toggleChat?: () => void;
};

declare global {
  interface Window {
    filterPartnerList?: () => void;
    handleSuggestion?: (key: string) => void;
    navTo?: (element: HTMLElement) => void;
    navToPage?: (pageId: string) => void;
    resetF?: (button: HTMLElement) => void;
    searchUser?: () => void;
    sendChat?: () => void;
    showPartnerDetail?: (name: string) => void;
    togF?: (element: HTMLElement) => void;
    toggleChat?: () => void;
  }
}

export function getPrototypeWindow() {
  return window as PrototypeWindow;
}
