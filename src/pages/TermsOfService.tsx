import React from "react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: July 5, 2025</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By downloading, installing, or using the Roots and Ritual application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
        <p className="mb-4">
          Roots and Ritual is a mobile and web application that helps users:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Create and track daily habits and rituals</li>
          <li>Organize habits into chains for sequential completion</li>
          <li>Visualize progress through a garden-themed interface</li>
          <li>Share progress with friends and community</li>
          <li>Access premium features through subscription plans</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. User Accounts and Registration</h2>
        <p className="mb-4">
          To access certain features of the App, you may need to create an account. You agree to:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Notify us immediately of any unauthorized use</li>
          <li>Be responsible for all activities under your account</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payment Terms</h2>
        <h3 className="text-xl font-medium mb-2">Free Tier</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Create and track up to 3 habits</li>
          <li>Basic visualization features</li>
          <li>No credit card required</li>
        </ul>

        <h3 className="text-xl font-medium mb-2">Paid Subscriptions</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Weekly Plan: $0.99 per week</li>
          <li>Yearly Plan: $19.99 per year</li>
          <li>Lifetime Access: $9.99 one-time purchase</li>
          <li>Subscriptions automatically renew unless cancelled</li>
          <li>Payment processed through our payment providers</li>
          <li>Cancellation must be done through your account settings</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. User Content and Intellectual Property</h2>
        <h3 className="text-xl font-medium mb-2">Your Content</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>You retain ownership of your habit data and personal information</li>
          <li>You grant us license to process your data to provide the service</li>
          <li>You are responsible for ensuring you have rights to uploaded content</li>
          <li>You must not upload inappropriate, illegal, or copyrighted content</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Prohibited Uses</h2>
        <p className="mb-4">
          You agree not to use the App for:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Creating or distributing inappropriate, offensive, or illegal content</li>
          <li>Impersonating others or creating deceptive content</li>
          <li>Violating the privacy or rights of others</li>
          <li>Reverse engineering or attempting to extract our code or algorithms</li>
          <li>Circumventing payment systems or subscription requirements</li>
          <li>Spamming or automated use of the service</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Service Availability</h2>
        <p className="mb-4">
          We strive to provide continuous service but cannot guarantee uninterrupted access. We reserve the right to:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Modify or discontinue features with reasonable notice</li>
          <li>Perform maintenance that may temporarily affect service</li>
          <li>Limit usage to prevent abuse or ensure fair access</li>
          <li>Suspend accounts that violate these Terms</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Privacy and Data Protection</h2>
        <p className="mb-4">
          Your privacy is important to us. Our collection and use of personal information is governed by our <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>, which is incorporated into these Terms by reference.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Disclaimers and Limitations</h2>
        <h3 className="text-xl font-medium mb-2">Service Disclaimer</h3>
        <p className="mb-4">
          The App is provided "as is" without warranties of any kind. We do not guarantee the accuracy, quality, or suitability of content.
        </p>
        <h3 className="text-xl font-medium mb-2">Limitation of Liability</h3>
        <p className="mb-4">
          To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the App.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
        <p className="mb-4">
          Either party may terminate these Terms at any time. Upon termination:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Your right to use the App ceases immediately</li>
          <li>Your account and associated data may be deleted</li>
          <li>Subscription benefits end (no refunds for partial periods)</li>
          <li>Certain provisions of these Terms shall survive termination</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
        <p className="mb-4">
          We may update these Terms from time to time. We will notify users of material changes through the App or other reasonable means. Continued use after changes constitutes acceptance of the updated Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
        <p className="mb-4">
          These Terms are governed by the laws of the United States. Any disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
        <p className="mb-4">
          If you have questions about these Terms, please contact us at:
        </p>
        <p className="mb-4">
          Email: legal@rootsandritual.com<br />
          Support: support@rootsandritual.com
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">14. Severability</h2>
        <p className="mb-4">
          If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.
        </p>
      </section>

      <div className="mt-8 border-t pt-6">
        <Link to="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default TermsOfService;
