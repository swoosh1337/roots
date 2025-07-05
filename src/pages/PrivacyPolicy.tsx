import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: July 5, 2025</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p className="mb-4">
          We collect minimal information to provide you with the Roots and Ritual habit tracking service:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Account information: Email address for authentication</li>
          <li>Habit data: Information about habits you create and track</li>
          <li>Usage data: How you interact with our application</li>
          <li>Device information: Basic information about your device and browser</li>
        </ul>
        <p>
          All habit data is stored securely and is only accessible to you unless you explicitly choose to share it.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">
          We use your information for the following purposes:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>To provide and maintain our service</li>
          <li>To notify you about changes to our service</li>
          <li>To allow you to participate in interactive features when you choose to do so</li>
          <li>To provide customer support</li>
          <li>To gather analysis or valuable information so that we can improve our service</li>
          <li>To monitor the usage of our service</li>
          <li>To detect, prevent and address technical issues</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Data Storage and Security</h2>
        <p className="mb-4">
          Your privacy is protected through secure processing and responsible data retention:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>All data is transmitted using encrypted connections (HTTPS)</li>
          <li>We use industry-standard security measures to protect your data</li>
          <li>Habit data is stored in our secure database</li>
          <li>We do not sell or rent your personal information to third parties</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Data Retention</h2>
        <p className="mb-4">
          We retain your data for as long as your account is active or as needed to provide you with our services.
          If you delete your account, we will delete or anonymize your personal information within 30 days.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
        <p className="mb-4">
          You have the right to:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Access your personal data</li>
          <li>Correct inaccurate information</li>
          <li>Delete your account and associated data</li>
          <li>Export your habit data</li>
          <li>Opt-out of marketing communications</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Subscription Information</h2>
        <p className="mb-4">
          Our app offers a free tier that allows users to create up to 3 habits. For additional features, we offer the following subscription options:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Weekly subscription: $0.99 per week</li>
          <li>Annual subscription: $19.99 per year</li>
          <li>Lifetime access: One-time payment of $9.99</li>
        </ul>
        <p className="mb-4">
          Payment information is processed securely through our payment providers. We do not store your full payment details on our servers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
        <p className="mb-4">
          Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. International Users</h2>
        <p className="mb-4">
          If you are accessing our service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p className="mb-4">
          Email: privacy@rootsandritual.com
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

export default PrivacyPolicy;
