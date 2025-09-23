/**
 * Facebook SDK TypeScript declarations for Child Actor 101 Directory
 * Provides type safety for Facebook SDK integration
 */

declare global {
  interface Window {
    FB: {
      init: (config: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      AppEvents: {
        logPageView: () => void;
      };
      getLoginStatus: (
        callback: (response: FacebookLoginResponse) => void,
      ) => void;
      login: (
        callback: (response: FacebookLoginResponse) => void,
        options?: {
          scope?: string;
          return_scopes?: boolean;
        },
      ) => void;
      logout: (callback: (response: FacebookLogoutResponse) => void) => void;
      api: (path: string, callback: (response: unknown) => void) => void;
    };
    statusChangeCallback: (response: FacebookLoginResponse) => void;
    checkLoginState: () => void;
  }
}

export interface FacebookLoginResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse?: {
    accessToken: string;
    expiresIn: number;
    signedRequest: string;
    userID: string;
  };
}

export interface FacebookLogoutResponse {
  status: "connected" | "not_authorized" | "unknown";
}
