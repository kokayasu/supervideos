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
        <h1>Terms of Service for [Your Website Name]</h1>
        <p>Last Updated: [Date]</p>
        <p>
          This Terms of Service (&quot;Agreement&quot;) is entered into between
          [Your Company/Your Name] (&quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;) and the user (&quot;you&quot; or &quot;user&quot;)
          regarding the use of [Your Website Name] (&quot;the Website&quot;).
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using the Website, you agree to be bound by these
          Terms of Service. If you do not agree to these terms, please refrain
          from using the Website.
        </p>

        <h2>2. Age Restriction</h2>
        <p>
          a. You must comply with the age restrictions applicable in your
          country to access and view content on this Website.
        </p>
        <p>
          b. By using the Website, you affirm that you meet the age requirements
          specified by your country of residence.
        </p>

        <h2>3. User Registration</h2>
        <p>
          If registration is required to access certain features of the Website,
          you agree to provide accurate and complete information. You are
          responsible for maintaining the confidentiality of your account
          information.
        </p>

        <h2>4. Content Guidelines</h2>
        <p>
          a. The Website may contain videos and other content with age
          restrictions. By accessing such content, you affirm that you meet the
          age requirements specified by your country of residence.
        </p>
        <p>
          b. Users are prohibited from attempting to bypass age restrictions or
          providing false information regarding their age.
        </p>

        <h2>5. Intellectual Property</h2>
        <p>
          a. The content on the Website, including videos, is protected by
          intellectual property laws. You agree not to reproduce, distribute, or
          modify any content without our written consent.
        </p>

        <h2>6. User Conduct</h2>
        <p>
          a. Users are prohibited from engaging in any activities that violate
          these terms or applicable laws.
        </p>
        <p>
          b. You agree not to use the Website for any unlawful purpose,
          including the distribution of harmful or inappropriate content.
        </p>

        <h2>7. Termination</h2>
        <p>
          We reserve the right to terminate or suspend your access to the
          Website at our discretion, without notice, for any reason, including a
          violation of these terms.
        </p>

        <h2>8. Disclaimer of Liability</h2>
        <p>
          a. We are not responsible for the accuracy, completeness, or
          reliability of any content on the Website.
        </p>
        <p>
          b. We disclaim liability for any damages arising from the use or
          inability to use the Website.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          This Agreement is governed by and construed in accordance with the
          laws of [Your Jurisdiction].
        </p>

        <h2>10. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Your continued
          use of the Website after changes are posted constitutes your
          acceptance of the modified terms.
        </p>
      </Container>
    </PageContainer>
  );
}
