import React from 'react';
import { Container, Typography, Box, Paper, useTheme } from '@mui/material';
import Head from 'next/head';
import Header from '/src/components/Header';
import Footer from '/src/components/Footer';

export default function TermsAndConditions() {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Terms & Conditions - Beauté Leville</title>
        <meta name="description" content="Read our terms and conditions for using our services" />
      </Head>

      <Box
        sx={{
          background: theme.palette.background.default,
          minHeight: "100vh",
          color: theme.palette.text.primary,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 8, flex: 1 }}>
          <Paper elevation={2} sx={{ p: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 1 }}>
              Terms & Conditions
            </Typography>
            
            <Typography variant="h6" component="p" gutterBottom sx={{ mb: 1, color: theme.palette.text.secondary }}>
              Beauté Leville Inc.
            </Typography>
            
            <Typography variant="body2" gutterBottom sx={{ mb: 3, color: theme.palette.text.secondary }}>
              Last updated: February 12th 2026
            </Typography>
            
            <Typography variant="body1" paragraph>
              These Terms & Conditions govern all purchases, transactions, and use of services provided by Beauté Leville Inc. ("Beauté Leville," "we," "us," or "our"). By placing an order or engaging in business with us, you agree to the terms outlined below.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              1. Company Role
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville Inc. operates as an independent distributor of fragrances, cosmetics, and personal care products sourced through established commercial suppliers operating within the open market.
            </Typography>
            
            <Typography variant="body1" paragraph>
              We are not affiliated with, endorsed by, or acting on behalf of any specific brand unless explicitly stated in writing.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              2. Product Authenticity
            </Typography>
            
            <Typography variant="body1" paragraph>
              All products supplied by Beauté Leville Inc. are authentic and sourced through vetted wholesale and distribution channels.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Our supplier onboarding process includes business verification, documentation review, and ongoing performance monitoring. We do not sell counterfeit, imitation, or knowingly misrepresented goods.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Products may be sourced from global distribution networks and open-market channels, which may include inventory originally intended for different geographic markets.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              3. Orders & Acceptance
            </Typography>
            
            <Typography variant="body1" paragraph>
              All orders are subject to review and acceptance by Beauté Leville Inc.
            </Typography>
            
            <Typography variant="body1" paragraph>
              We reserve the right to:<br />
              •	Refuse or cancel orders at our discretion<br />
              •	Limit quantities<br />
              •	Request additional verification prior to fulfillment<br />
              •	Correct pricing or listing errors
            </Typography>
            
            <Typography variant="body1" paragraph>
              An order is considered accepted only once it has been confirmed and processed by our team.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              4. Pricing & Payment
            </Typography>
            
            <Typography variant="body1" paragraph>
              All prices are listed in the currency specified at checkout or on the invoice.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Payment terms:<br />
              •	Payment must be completed and cleared prior to shipment unless written credit terms are granted.<br />
              •	Goods remain the property of Beauté Leville Inc. until the invoice balance is paid in full.<br />
              •	Failure to remit payment may result in order cancellation, account suspension, or collection procedures.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville reserves the right to adjust pricing at any time without notice.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              5. Shipping & Handling
            </Typography>
            
            <Typography variant="body1" paragraph>
              Orders are shipped via UPS.
            </Typography>
            
            <Typography variant="body1" paragraph>
              •	Handling time: typically 2–5 business days after payment confirmation<br />
              •	Transit times: subject to UPS service timelines<br />
              •	Shipments are uninsured unless insurance is requested prior to order placement
            </Typography>
            
            <Typography variant="body1" paragraph>
              Once goods leave our facility and are transferred to the carrier, the shipment becomes the responsibility of the buyer.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville Inc. is not liable for carrier delays, loss, or damage unless insurance coverage was requested and confirmed in advance.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              6. Risk of Loss
            </Typography>
            
            <Typography variant="body1" paragraph>
              Risk of loss transfers to the buyer once goods are released to the shipping carrier.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Customers are responsible for:<br />
              •	Monitoring shipment tracking<br />
              •	Coordinating with the carrier for delivery<br />
              •	Filing claims with UPS when applicable
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              7. Returns & Claims
            </Typography>
            
            <Typography variant="body1" paragraph>
              Due to the nature of distribution and wholesale fulfillment:
            </Typography>
            
            <Typography variant="body1" paragraph>
              •	All sales are final unless otherwise agreed in writing.<br />
              •	Returns may be considered only in cases of verified shipping damage or fulfillment error.<br />
              •	Claims must be submitted within 48 hours of delivery with supporting documentation and images.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville reserves sole discretion in evaluating and approving claims.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              8. Product Condition & Packaging Variations
            </Typography>
            
            <Typography variant="body1" paragraph>
              Products may vary in packaging, labeling language, or outer box presentation depending on distribution source and market origin.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Such variations do not affect product authenticity or performance.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              9. Limitation of Liability
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville Inc. shall not be liable for:
            </Typography>
            
            <Typography variant="body1" paragraph>
              •	Indirect, incidental, or consequential damages<br />
              •	Loss of business or resale revenue<br />
              •	Brand or marketplace restrictions imposed on the buyer<br />
              •	Misuse, improper storage, or third-party handling of products
            </Typography>
            
            <Typography variant="body1" paragraph>
              Our liability, if any, shall not exceed the purchase value of the specific goods supplied.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              10. Marketplace & Resale Responsibility
            </Typography>
            
            <Typography variant="body1" paragraph>
              Buyers are responsible for ensuring compliance with:
            </Typography>
            
            <Typography variant="body1" paragraph>
              •	Marketplace policies<br />
              •	Local regulations<br />
              •	Brand resale requirements
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville does not guarantee:
            </Typography>
            
            <Typography variant="body1" paragraph>
              •	Marketplace approval<br />
              •	Brand authorization status<br />
              •	Resale eligibility on any platform
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              11. Compliance & Regulatory Responsibility
            </Typography>
            
            <Typography variant="body1" paragraph>
              Customers are responsible for ensuring that products imported, resold, or distributed meet the regulatory requirements of their jurisdiction.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville Inc. assumes no liability for local compliance obligations once goods leave our control.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              12. Intellectual Property
            </Typography>
            
            <Typography variant="body1" paragraph>
              All trademarks, brand names, and product images remain the property of their respective owners.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Use of such materials by buyers must comply with applicable intellectual property laws and marketplace standards.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              13. Fraud Prevention
            </Typography>
            
            <Typography variant="body1" paragraph>
              We reserve the right to:
            </Typography>
            
            <Typography variant="body1" paragraph>
              •	Cancel suspicious transactions<br />
              •	Request identity or business verification<br />
              •	Refuse service where risk is identified
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              14. Force Majeure
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville Inc. shall not be liable for delays or failures caused by events beyond reasonable control, including:
            </Typography>
            
            <Typography variant="body1" paragraph>
              •	Carrier disruptions<br />
              •	Customs delays<br />
              •	Weather events<br />
              •	Supply chain interruptions<br />
              •	Government actions
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              15. Governing Law
            </Typography>
            
            <Typography variant="body1" paragraph>
              These Terms & Conditions are governed by the laws of the Province of Québec and the applicable federal laws of Canada.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              16. Modifications
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville Inc. reserves the right to update or modify these Terms at any time. Continued use of our services constitutes acceptance of any revised terms.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              17. Contact
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville Inc.<br />
              Address: 208-1960 rue Wellington, Montreal, H3K0A1, Quebec, Canada<br />
              [Email will be added after we launch website]<br />
              Phone Number: +1(263)-999-7776
            </Typography>
          </Paper>
        </Container>

        <Footer />
      </Box>
    </>
  );
}
