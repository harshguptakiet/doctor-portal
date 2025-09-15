# Pharmacy Integration Test Plan 🧪

## Overview
This document outlines the complete testing procedure for the pharmacy portal integration into GarudX.

## 🎯 Test Objectives
- Verify complete pharmacy user workflow (signup → login → dashboard)
- Ensure UI consistency with GarudX orange theme
- Validate Firebase authentication and data storage
- Test error handling and edge cases
- Confirm navigation and routing work properly

## 📋 Test Scenarios

### 1. Navigation and UI Tests
**Test 1.1: Landing Page Navigation**
- [ ] Open `http://localhost:5173/`
- [ ] Verify GarudX branding and orange theme
- [ ] Click "Sign Up" or navigate to `/signup`
- [ ] Verify pharmacy role card is visible and enabled
- [ ] Check that pharmacy card uses purple theme (as designed)

**Test 1.2: Signup Page Flow**
- [ ] On signup page, click "Partner Pharmacy" card
- [ ] Verify navigation to `/signup/pharmacy`
- [ ] Check form styling matches GarudX theme
- [ ] Verify all form fields are present

### 2. Pharmacy Signup Flow Tests
**Test 2.1: Step 1 - Account Information**
- [ ] Fill in owner name: "Test Pharmacy Owner"
- [ ] Fill in email: "testpharmacy@example.com"
- [ ] Fill in password: "testpass123"
- [ ] Fill in confirm password: "testpass123"
- [ ] Click "Next" button
- [ ] Verify navigation to Step 2

**Test 2.2: Step 2 - Pharmacy Details**
- [ ] Fill in pharmacy name: "Test Medical Pharmacy"
- [ ] Fill in license number: "PH123456789"
- [ ] Fill in phone: "+91-9876543210"
- [ ] Fill in address: "123 Main St, Test City, State 123456"
- [ ] Click "Create Pharmacy Account"
- [ ] Verify loading state shows
- [ ] Check for successful navigation to verification pending page

**Test 2.3: Form Validation**
- [ ] Test empty fields validation
- [ ] Test password mismatch validation
- [ ] Test email format validation
- [ ] Verify error messages display properly

### 3. Authentication Tests
**Test 3.1: Login Flow**
- [ ] Navigate to `/login`
- [ ] Enter pharmacy credentials
- [ ] Click "Sign In"
- [ ] Verify redirect to `/pharmacy/dashboard`

**Test 3.2: Protected Routes**
- [ ] Try accessing `/pharmacy/dashboard` without login
- [ ] Verify redirect to login page
- [ ] After login, verify redirect back to pharmacy dashboard

### 4. Pharmacy Dashboard Tests
**Test 4.1: Dashboard Layout**
- [ ] Verify orange theme consistency
- [ ] Check sidebar navigation items
- [ ] Verify header shows pharmacy name
- [ ] Check stats cards display mock data
- [ ] Verify recent orders section
- [ ] Check low stock alerts section

**Test 4.2: Dashboard Navigation**
- [ ] Test sidebar navigation items
- [ ] Click "Inventory" - check view changes
- [ ] Click "Orders" - check view changes
- [ ] Click "Customers" - check view changes
- [ ] Click "Reports" - check view changes
- [ ] Click "Settings" - check view changes
- [ ] Click "Dashboard" - return to main view

**Test 4.3: User Profile & Logout**
- [ ] Click profile dropdown in header
- [ ] Verify pharmacy information displays
- [ ] Click "Logout"
- [ ] Verify confirmation dialog
- [ ] Confirm logout and check redirect to login

### 5. Firebase Integration Tests
**Test 5.1: User Creation**
- [ ] Check Firebase Authentication console
- [ ] Verify new pharmacy user created
- [ ] Check displayName is set correctly

**Test 5.2: Firestore Data**
- [ ] Check `/users/{uid}` document
- [ ] Verify role is set to "pharmacy"
- [ ] Check `/pharmacies/{uid}` document
- [ ] Verify all pharmacy details saved correctly

### 6. Error Handling Tests
**Test 6.1: Network Errors**
- [ ] Disable internet during signup
- [ ] Verify appropriate error message
- [ ] Re-enable internet and retry

**Test 6.2: Duplicate Email**
- [ ] Try signing up with existing email
- [ ] Verify error message displays
- [ ] Check no duplicate accounts created

**Test 6.3: Authentication Errors**
- [ ] Try login with wrong password
- [ ] Verify error message
- [ ] Try login with non-existent email
- [ ] Verify appropriate error

### 7. Cross-Role Integration Tests
**Test 7.1: Multi-Role Login**
- [ ] Login as doctor, verify redirect to doctor dashboard
- [ ] Logout and login as pharmacy, verify redirect to pharmacy dashboard
- [ ] Logout and login as patient, verify redirect to app download

**Test 7.2: Role-Based Access**
- [ ] As pharmacy user, try accessing `/doctor/dashboard`
- [ ] Verify appropriate access control
- [ ] As doctor user, try accessing `/pharmacy/dashboard`
- [ ] Verify appropriate access control

### 8. UI/UX Consistency Tests
**Test 8.1: Theme Consistency**
- [ ] Verify orange accents throughout pharmacy portal
- [ ] Check button styles match GarudX design
- [ ] Verify form styling consistency
- [ ] Check responsive design on mobile

**Test 8.2: Typography and Spacing**
- [ ] Verify font families match GarudX
- [ ] Check consistent spacing and padding
- [ ] Verify proper contrast ratios

### 9. Performance Tests
**Test 9.1: Load Times**
- [ ] Measure signup form load time
- [ ] Measure dashboard load time
- [ ] Check for console errors

**Test 9.2: Memory Usage**
- [ ] Check for memory leaks during navigation
- [ ] Verify proper cleanup on logout

### 10. Browser Compatibility Tests
**Test 10.1: Multiple Browsers**
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Edge
- [ ] Test in Safari (if available)

## 🚨 Critical Test Points
These tests MUST pass for integration to be considered successful:

1. **Signup Completion**: Pharmacy user can complete signup process
2. **Login Redirect**: Pharmacy users redirect to `/pharmacy/dashboard`
3. **Dashboard Load**: Dashboard loads without errors
4. **Firebase Storage**: User data saves correctly to Firestore
5. **Theme Consistency**: Orange theme applied throughout
6. **Navigation**: All navigation links work properly
7. **Logout**: Users can logout successfully

## 🔧 Test Environment Setup
1. Ensure Firebase is configured correctly
2. Verify all environment variables are set
3. Clear browser cache before testing
4. Use different email addresses for each test run

## 📊 Success Criteria
- All critical test points pass
- No console errors during normal operation
- UI matches GarudX design standards
- Performance is acceptable (< 3s load times)
- Error handling provides helpful feedback

## 🐛 Bug Tracking
Track any issues found during testing:
- Issue description
- Steps to reproduce
- Expected vs actual behavior
- Browser/device information
- Screenshot if applicable

## 📝 Test Execution Log
Use this template for each test session:

**Date**: ________
**Tester**: ________
**Environment**: ________
**Test Results**: 
- [ ] All critical tests passed
- [ ] Minor issues found (document separately)
- [ ] Major issues found (document separately)

**Notes**: ___________________________
