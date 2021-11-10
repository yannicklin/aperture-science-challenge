/**
 * @jest-environment jsdom
 */

 import React from 'react'
 import { render, screen } from '@testing-library/react'
 import Home from '../pages/index'
 
 describe('Home', () => {
   beforeEach(() => {
    render(<Home />)
   })

   it('renders a heading', () => {
     const heading = screen.getByRole('heading', {
       name: "Please login",
     })
 
     expect(heading).toBeInTheDocument()
   })

   it('renders a login form', () => {
    const form = screen.getByTestId("login-form")
    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password')
    expect(form).toBeInTheDocument()
    expect(email).toBeInTheDocument()
    expect(password).toBeInTheDocument()
  })
 })