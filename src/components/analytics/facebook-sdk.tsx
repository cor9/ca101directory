"use client";

import Script from "next/script";

/**
 * Facebook SDK Component for Child Actor 101 Directory
 * Initializes Facebook SDK for OAuth authentication and social features
 */
export function FacebookSDK() {
  const facebookAppId =
    process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || process.env.FACEBOOK_CLIENT_ID;

  if (!facebookAppId) {
    console.warn("Facebook App ID not found in environment variables");
    return null;
  }

  return (
    <Script
      id="facebook-sdk"
      strategy="afterInteractive"
      // eslint-disable-next-line react/no-danger -- Required for Facebook SDK initialization
      dangerouslySetInnerHTML={{
        __html: `
          window.fbAsyncInit = function() {
            FB.init({
              appId: '${facebookAppId}',
              cookie: true,
              xfbml: true,
              version: 'v18.0'
            });
            
            FB.AppEvents.logPageView();
            
            // Check login status on page load
            FB.getLoginStatus(function(response) {
              statusChangeCallback(response);
            });
          };

          // Status change callback function
          function statusChangeCallback(response) {
            console.log('Facebook login status:', response);
            
            if (response.status === 'connected') {
              console.log('User is logged in via Facebook');
              // User is logged in and authenticated
              // You can access user info with: response.authResponse
            } else if (response.status === 'not_authorized') {
              console.log('User is logged in to Facebook but not authorized for this app');
            } else {
              console.log('User is not logged in to Facebook');
            }
          }

          // Check login state function for login button
          function checkLoginState() {
            FB.getLoginStatus(function(response) {
              statusChangeCallback(response);
            });
          }

          // Make functions globally available
          window.statusChangeCallback = statusChangeCallback;
          window.checkLoginState = checkLoginState;

          (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
        `,
      }}
    />
  );
}
