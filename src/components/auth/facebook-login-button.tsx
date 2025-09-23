"use client";

import { useEffect, useState } from "react";
import { FacebookAuthPlaceholder } from "./facebook-auth-placeholder";

/**
 * Facebook Login Button Component for Child Actor 101 Directory
 * Shows placeholder while Facebook verification is pending, then renders actual button
 */
export function FacebookLoginButton() {
  const [isFacebookVerified, setIsFacebookVerified] = useState(false);

  useEffect(() => {
    // Check if Facebook verification is complete
    // This will be true once Facebook approves your business verification
    const checkFacebookStatus = () => {
      // For now, always show placeholder since verification is pending
      // Change this to true once Facebook approves your business verification
      const facebookApproved =
        process.env.NEXT_PUBLIC_FACEBOOK_VERIFIED === "true";
      setIsFacebookVerified(facebookApproved);
    };

    checkFacebookStatus();
  }, []);

  // Show placeholder while Facebook verification is pending
  if (!isFacebookVerified) {
    return <FacebookAuthPlaceholder />;
  }

  // Once Facebook is verified, show the actual login button
  return (
    <div className="facebook-login-container">
      <fb:login-button
        scope="public_profile,email"
        onlogin="checkLoginState();"
        data-size="large"
        data-button-type="continue_with"
        data-layout="default"
        data-auto-logout-link="false"
        data-use-continue-as="false"
        className="facebook-login-button"
      ></fb:login-button>

      <style jsx>{`
        .facebook-login-container {
          display: flex;
          justify-content: center;
          margin: 1rem 0;
        }
        
        .facebook-login-button {
          width: 100%;
          max-width: 300px;
        }
        
        /* Custom styling for Facebook button */
        :global(.fb-login-button) {
          width: 100% !important;
        }
        
        :global(.fb-login-button span) {
          width: 100% !important;
        }
      `}</style>
    </div>
  );
}
