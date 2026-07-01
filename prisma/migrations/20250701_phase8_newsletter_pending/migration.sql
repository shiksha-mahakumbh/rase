-- Phase 8 newsletter double opt-in support
ALTER TYPE "NewsletterStatus" ADD VALUE IF NOT EXISTS 'pending' BEFORE 'subscribed';
