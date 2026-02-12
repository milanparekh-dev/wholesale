import React from 'react';
import { Container, Typography, Box, Paper, useTheme } from '@mui/material';
import Head from 'next/head';
import Header from '/src/components/Header';
import Footer from '/src/components/Footer';

export default function AboutUs() {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>About Us - Beauté Leville</title>
        <meta name="description" content="Learn more about Beauté Leville Inc." />
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
            <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 3 }}>
              About Us
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville Inc. is a Québec based Canadian distribution and e-commerce company specializing in authentic fragrances, cosmetics, and personal care products sourced from established suppliers across North America and Europe. We operate at the intersection of retail, wholesale, and marketplace distribution, serving businesses and consumers who value reliability, transparency, and competitive access to globally recognized beauty brands.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Our core mission is simple: provide genuine products, sourced responsibly, and delivered with operational excellence.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Authenticity & Sourcing Standards
            </Typography>
            
            <Typography variant="body1" paragraph>
              Product authenticity is the foundation of our business. Every supplier undergoes a structured vetting process that includes business verification, trade documentation review, and ongoing performance monitoring. We work exclusively with legitimate distributors and wholesalers operating within the open market, ensuring traceable supply chains and verifiable procurement.
            </Typography>
            
            <Typography variant="body1" paragraph>
              We do not deal in replicas, unauthorized imitations, or diverted goods of unknown origin. Our inventory consists solely of authentic, brand-name products sourced through recognized commercial channels and made available within the global beauty marketplace.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Operational Discipline
            </Typography>
            
            <Typography variant="body1" paragraph>
              Beauté Leville Inc. maintains structured procurement, warehousing, and fulfillment processes designed for scale and accountability. Our operations are supported by documented inventory controls, standardized handling procedures, and a logistics infrastructure capable of servicing both retail and B2B partners.
            </Typography>
            
            <Typography variant="body1" paragraph>
              This operational discipline allows us to:
            </Typography>
            
            <Typography variant="body1" paragraph>
              •	Maintain consistent product integrity<br />
              •	Ensure reliable order fulfillment<br />
              •	Support high-volume distribution partners<br />
              •	Provide transparent documentation when required
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Our Role in the Beauty Ecosystem
            </Typography>
            
            <Typography variant="body1" paragraph>
              The global beauty industry is supported by a complex open market that connects brands, distributors, retailers, and consumers. Beauté Leville Inc. participates in this ecosystem as a professional distribution partner — facilitating access to authentic products while respecting brand positioning, regulatory requirements, and commercial best practices.
            </Typography>
            
            <Typography variant="body1" paragraph>
              We believe in:
            </Typography>
            
            <Typography variant="body1" paragraph>
              •	Responsible commerce<br />
              •	Professional supplier relationships<br />
              •	Compliance with applicable market and trade standards<br />
              •	Long-term partnerships built on trust and performance
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Built for Partners. Designed for Growth.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Whether working with retailers, marketplaces, or institutional buyers, Beauté Leville Inc. is structured to operate with the professionalism expected of a modern distribution company. Our focus is long-term: building durable supply relationships, maintaining strict authenticity standards, and delivering a polished, dependable experience at every touchpoint.
            </Typography>
            
            <Typography variant="body1" paragraph>
              We are proud to operate in one of the world's most dynamic industries — and committed to doing so with credibility, precision, and respect for the brands and partners we serve.
            </Typography>
          </Paper>
        </Container>

        <Footer />
      </Box>
    </>
  );
}
