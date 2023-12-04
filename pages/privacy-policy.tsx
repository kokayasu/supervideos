import Head from "next/head";
import Container from '@mui/material/Container';

import PageContainer from "@src/PageContainer";

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default function TermsOfService() {
  return (
    <PageContainer>
      <Head>
        <title>Super Videos</title>
        <meta name="description" content="" />
        <meta name="keywords" content="" />
      </Head>
      <Container maxWidth="md">
        <h1>Privacy Policy for [Your Website Name]</h1>
        <p>Last Updated: [Date]</p>
        <p>
          This Privacy Policy (&quot;Policy&quot;) describes how [Your
          Company/Your Name] (&quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;) collects, uses, and protects the personal information
          of users (&quot;you&quot; or &quot;user&quot;) on [Your Website Name]
          (&quot;the Website&quot;).
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We may collect various types of information, including but not limited
          to:
        </p>
        <ul>
          <li>
            Personal information such as name, email address, and contact
            details provided voluntarily by users through forms or account
            registration.
          </li>
          <li>
            Non-personal information such as browser type, IP address, and
            device information collected through cookies and similar
            technologies.
          </li>
        </ul>

        <h2>2. Use of Cookies</h2>
        <p>
          We use cookies to enhance your experience on our Website. Cookies are
          small text files stored on your device that help us track your
          preferences, analyze usage patterns, and improve our services. You can
          manage cookie preferences through your browser settings.
        </p>

        <h2>3. Advertising</h2>
        <p>
          We may display ads on our Website served by third-party advertisers.
          These advertisers may use cookies and similar technologies to collect
          and track information such as your IP address and browsing behavior
          for ad targeting purposes. We do not have control over the practices
          of these third-party advertisers.
        </p>

        <h2>4. How We Use Your Information</h2>
        <p>We may use your information for the following purposes:</p>
        <ul>
          <li>To provide and personalize our services.</li>
          <li>
            To communicate with you, respond to inquiries, and provide support.
          </li>
          <li>
            To analyze usage patterns and improve the functionality of the
            Website.
          </li>
        </ul>

        <h2>5. Information Sharing</h2>

        <p>
          We do not sell, trade, or otherwise transfer your personal information
          to third parties without your consent, except as described in this
          Policy or as required by law.
        </p>

        <h2>6. Security Measures</h2>
        <p>
          We take reasonable steps to protect your personal information from
          unauthorized access, disclosure, or alteration. However, no method of
          transmission over the internet or electronic storage is entirely
          secure, and we cannot guarantee absolute security.
        </p>

        {/* <h2>6. Your Choices</h2>
        <p>You have the right to:</p>

        <ul>
          <li>Access, correct, or update your personal information.</li>
          <li>Opt-out of receiving promotional communications.</li>
          <li>
            Request the deletion of your account and personal information.
          </li>
        </ul>
        */}
        <h2>7. Changes to this Policy</h2>

        <p>
          We may update this Policy periodically. We will notify you of any
          changes by posting the updated Policy on the Website. Your continued
          use of the Website after the changes are posted constitutes your
          acceptance of the modified Policy.
        </p>
      </Container>
    </PageContainer>
  );
}
