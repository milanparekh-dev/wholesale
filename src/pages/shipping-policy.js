import React from 'react';
import { Container, Typography, Box, Paper, useTheme } from '@mui/material';
import Head from 'next/head';
import Header from '/src/components/Header';
import Footer from '/src/components/Footer';

export default function ShippingPolicy() {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Shipping Policy - Beauté Leville</title>
        <meta name="description" content="Learn about our shipping policy and delivery options" />
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
              Shipping Policy
            </Typography>
            
            <Typography variant="h6" component="p" gutterBottom sx={{ mb: 3, color: theme.palette.text.secondary }}>
              Beauté Leville Inc.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville Inc. is committed to processing and shipping orders with efficiency, accuracy, and care. The following policy outlines our shipping procedures, timelines, and responsibilities.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Shipping Carrier
            </Typography>
            
            <Typography variant="body1" paragraph>
              All orders are shipped via UPS. Carrier selection, service level, and routing are determined based on destination, order size, and operational efficiency.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Order Handling & Processing
            </Typography>
            
            <Typography variant="body1" paragraph>
              Orders are typically processed within 2–5 business days from the time payment is confirmed and cleared. Handling times may vary depending on order volume, product availability, and operational conditions.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Once an order is released for shipment, transit times are subject to UPS Standard delivery timelines and may vary by region.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Packaging & Damage Prevention
            </Typography>
            
            <Typography variant="body1" paragraph>
              We follow strict packaging and handling protocols to protect product integrity during transit. Our fulfillment procedures are designed to minimize the risk of damage, and damage-related claims are rare. Products are secured, protected, and prepared according to internal quality control standards prior to leaving our facility.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Insurance
            </Typography>
            
            <Typography variant="body1" paragraph>
              Shipments are sent uninsured by default.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Shipping insurance is available upon request and must be arranged prior to order placement. Customers who require insured shipments are responsible for notifying our team before purchasing so that insurance can be added and quoted accordingly.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Risk & Responsibility in Transit
            </Typography>
            
            <Typography variant="body1" paragraph>
              Once an order leaves our facility and is transferred to the carrier, the shipment becomes the responsibility of the buyer. Beauté Leville Inc. is not liable for delays, loss, or damage occurring during transit unless insurance coverage has been requested and confirmed in advance.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Customers are encouraged to track shipments and coordinate directly with UPS for delivery updates or carrier-related issues.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Title of Goods
            </Typography>
            
            <Typography variant="body1" paragraph>
              All goods remain the property of Beauté Leville Inc. until the invoice has been paid in full and funds have been successfully received and cleared. Title does not transfer to the buyer until payment obligations are satisfied.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Shipping Delays
            </Typography>
            
            <Typography variant="body1" paragraph>
              While we strive to meet all handling and dispatch timelines, delays may occur due to weather conditions, carrier disruptions, customs processes, or other external factors beyond our control. Transit timelines provided by UPS are estimates and not guarantees.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Contact
            </Typography>
            
            <Typography variant="body1" paragraph>
              For shipping-related inquiries, insurance requests, or order support, customers should contact Beauté Leville Inc. prior to placing an order to ensure requirements are properly accommodated.
            </Typography>
          </Paper>
        </Container>

        <Footer />
      </Box>
    </>
  );
}
