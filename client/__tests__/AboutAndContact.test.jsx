import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AboutPage from '../src/pages/AboutPage';
import ContactPage from '../src/pages/ContactPage';

describe('About and Contact Pages Tests', () => {
  it('AboutPage renders mission, key pillars, and tech sectors', () => {
    render(
      <BrowserRouter>
        <AboutPage />
      </BrowserRouter>
    );

    // Hero title
    expect(
      screen.getByRole('heading', { level: 1, name: /Empowering Smarter Hardware Decisions/i })
    ).toBeInTheDocument();

    // Mission and guiding principles
    expect(screen.getByText(/Solving the Problem of Fragmented Electronics Sourcing/i)).toBeInTheDocument();
    expect(screen.getByText(/Our Guiding Principles/i)).toBeInTheDocument();

    // Value pillars
    expect(screen.getByText(/Unified Hardware Aggregation/i)).toBeInTheDocument();
    expect(screen.getByText(/Real-Time Price Intelligence/i)).toBeInTheDocument();
    expect(screen.getByText(/100% Verified Authentic Merchants/i)).toBeInTheDocument();

    // Sector cards
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Healthcare')).toBeInTheDocument();
    expect(screen.getByText('Industrial')).toBeInTheDocument();
  });

  it('ContactPage renders channels, interactive support form, and FAQ accordion', async () => {
    render(
      <BrowserRouter>
        <ContactPage />
      </BrowserRouter>
    );

    // Header & Channels
    expect(
      screen.getByRole('heading', { level: 1, name: /We’re Here to Help You Find the Right Tech/i })
    ).toBeInTheDocument();
    expect(screen.getByText('support@aryanelectronics.com')).toBeInTheDocument();
    expect(screen.getByText('+91 (800) 279-2601')).toBeInTheDocument();

    // FAQ Accordion interaction
    const faqButton = screen.getByText(/Are all products sold through Aryan Electronics genuine with valid warranties\?/i);
    fireEvent.click(faqButton);
    expect(screen.getByText(/Yes, 100%. We enforce strict seller onboarding standards/i)).toBeInTheDocument();

    // Fill contact form
    const nameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Work \/ Personal Email/i);
    const subjectInput = screen.getByLabelText(/Subject/i);
    const messageInput = screen.getByLabelText(/Detailed Message/i);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Spec Inquiry for Siemens PLC' } });
    fireEvent.change(messageInput, { target: { value: 'Need data sheet and multi-merchant discount details.' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submitButton);

    // Await ticket submission confirmation
    await waitFor(() => {
      expect(screen.getByText(/Message Received!/i)).toBeInTheDocument();
      expect(screen.getByText(/Ticket Reference:/i)).toBeInTheDocument();
    });
  });
});
