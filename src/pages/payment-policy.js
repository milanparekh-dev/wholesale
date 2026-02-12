import React from 'react';
import { Container, Typography, Box, Paper, useTheme } from '@mui/material';
import Head from 'next/head';
import Header from '/src/components/Header';
import Footer from '/src/components/Footer';

export default function PaymentPolicy() {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Payment Policy - Beauté Leville</title>
        <meta name="description" content="Learn about our payment methods and policies" />
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
              Payment Policy
            </Typography>
            
            <Typography variant="h6" component="p" gutterBottom sx={{ mb: 3, color: theme.palette.text.secondary }}>
              Beauté Leville Inc.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville Inc. maintains structured payment standards to ensure operational stability, fair commercial practices, and compliance with applicable laws in Québec and Canada.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Accepted Payment Methods
            </Typography>
            
            <Typography variant="body1" paragraph>
              We accept the following forms of payment:
            </Typography>
            
            <Typography variant="body1" paragraph>
              •	Interac e-Transfer<br />
              •	Wire transfer<br />
              •	Business cheque<br />
              •	Cash (where permitted and documented)
            </Typography>
            
            <Typography variant="body1" paragraph>
              All payments must be made in the currency specified on the invoice unless otherwise agreed in writing.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Orders will not be processed or released for shipment until payment has been received and cleared, unless credit terms have been formally approved.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Credit Terms
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville Inc. may, at its sole discretion, extend credit terms to select business clients based on:
            </Typography>
            
            <Typography variant="body1" paragraph>
              •	Established commercial relationship<br />
              •	Transaction history<br />
              •	Financial reliability<br />
              •	Operational considerations
            </Typography>
            
            <Typography variant="body1" paragraph>
              Credit is not guaranteed and is not an entitlement. Beauté Leville Inc. reserves the absolute right to approve, decline, modify, suspend, or revoke credit privileges at any time without prior notice.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Where credit is granted, payment terms will be outlined on the invoice or in a written agreement.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Ownership of Goods
            </Typography>
            
            <Typography variant="body1" paragraph>
              All goods remain the property of Beauté Leville Inc. until the invoice has been paid in full and funds have been received and cleared.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville Inc. reserves the right to suspend future shipments, cancel open orders, or take appropriate recovery action in the event of non-payment.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Late Payments
            </Typography>
            
            <Typography variant="body1" paragraph>
              Invoices not paid within the agreed terms may be subject to:
            </Typography>
            
            <Typography variant="body1" paragraph>
              •	Suspension of account privileges<br />
              •	Cancellation of pending orders<br />
              •	Collection procedures permitted under applicable law
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville Inc. reserves the right to charge reasonable administrative or interest fees on overdue balances where permitted by Québec law and disclosed in advance.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Payment Verification & Fraud Prevention
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville Inc. reserves the right to:
            </Typography>
            
            <Typography variant="body1" paragraph>
              •	Verify payment sources<br />
              •	Request business identification or documentation<br />
              •	Delay order fulfillment pending payment confirmation<br />
              •	Refuse transactions deemed high-risk or non-compliant
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Cash Transactions
            </Typography>
            
            <Typography variant="body1" paragraph>
              Cash payments are accepted only where permitted under applicable laws and must be documented and receipted in accordance with Québec and federal regulatory requirements.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Disputed Charges
            </Typography>
            
            <Typography variant="body1" paragraph>
              Any concerns regarding invoices or payment amounts must be reported within five (5) business days of issuance. Failure to notify within this timeframe may be considered acceptance of the invoice.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Compliance
            </Typography>
            
            <Typography variant="body1" paragraph>
              This Payment Policy is intended to comply with applicable commercial practices and legal requirements in the Province of Québec and Canada, including consumer protection, financial reporting, and anti-fraud obligations.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville Inc. reserves the right to update this policy at any time to maintain compliance and operational integrity.
            </Typography>
          </Paper>
        </Container>

        <Footer />
      </Box>
    </>
  );
}
