# Morphfit Campaign Platform TODO

## Phase 1: Database & Schema
- [ ] Create `campaigns` table to store campaign metadata
- [ ] Create `gym_locations` table with 22 gym entries (name, location, redirect_url)
- [ ] Create `qr_scans` table to log each QR scan (location_id, timestamp, redirect_destination)
- [ ] Create `email_signups` table for early access email capture
- [ ] Set up database migrations and push to live database

## Phase 2: Coming Soon Landing Page
- [ ] Design and implement Coming Soon page with Morphfit branding
- [ ] Implement 24-hour countdown timer (client-side)
- [ ] Add email capture form with validation
- [ ] Style with Energy Orange and Bangladesh Green palette
- [ ] Add responsive design for mobile/desktop
- [ ] Test countdown timer accuracy

## Phase 3: Tracking System (/scan/:id)
- [ ] Create tRPC procedure for scan logging
- [ ] Implement /scan/:id route that logs gym location, timestamp
- [ ] Set up redirect logic (WhatsApp, Instagram, or morphfit.shop)
- [ ] Add error handling for invalid scan IDs
- [ ] Test all 22 tracking URLs

## Phase 4: QR Code Generation & Poster Design
- [ ] Generate 22 unique QR codes (one per gym location)
- [ ] Create poster template with Bangladesh-flag aesthetic
- [ ] Integrate QR codes into poster designs
- [ ] Generate 22 high-resolution print-ready posters
- [ ] Verify poster quality and QR code scannability
- [ ] Create poster export/download functionality

## Phase 5: Admin Dashboard
- [ ] Build admin authentication and access control
- [ ] Create analytics dashboard showing scan counts per location
- [ ] Display real-time scan activity feed
- [ ] Add Hostinger DNS configuration instructions panel
- [ ] Implement location-based performance metrics
- [ ] Add export functionality for analytics data

## Phase 6: Real-Time Notifications & Deployment
- [ ] Set up real-time scan notifications to owner
- [ ] Implement notification UI in admin dashboard
- [ ] Configure Hostinger DNS settings documentation
- [ ] Test all notification flows
- [ ] Prepare deployment checklist
- [ ] Deploy to morphfit.shop

## Completed
- [x] Project initialized with web-db-user scaffold
- [x] Design 22 unique poster concepts (completed in previous session)
- [x] Create 15 Morphfit Original product renders (completed in previous session)
