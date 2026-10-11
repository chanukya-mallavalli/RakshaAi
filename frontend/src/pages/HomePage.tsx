
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquareText,
  Link2,
  Camera,
  QrCode,
  PhoneCall,
  ShieldCheck,
  ArrowRight,
  Lock,
  Award,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

import type { SupportedLanguage } from '../types';
import { getTranslation } from '../i18n';
import ShieldScene from '../components/ShieldScene';
import GlassCard from '../components/GlassCard';
import './HomePage.css';

interface HomePageProps {
  currentLang: SupportedLanguage;
}

export const HomePage: React.FC<HomePageProps> = ({ currentLang }) => {
  const t = getTranslation(currentLang);
  const navigate = useNavigate();

  const actionCards = [
    {
      id: 'message',
      title: t.actions.checkMessage,
      desc: 'Check suspicious SMS, WhatsApp messages, and emails before responding.',
      icon: MessageSquareText,
      badge: 'Popular',
    },
    {
      id: 'link',
      title: t.actions.checkLink,
      desc: 'Inspect a website address before opening it or sharing personal details.',
      icon: Link2,
      badge: 'Link safety',
    },
    {
      id: 'screenshot',
      title: t.actions.checkScreenshot,
      desc: 'Get help checking a screenshot of a suspicious message or phone screen.',
      icon: Camera,
      badge: 'Image check',
    },
    {
      id: 'qr',
      title: t.actions.checkQr,
      desc: 'Check a suspicious payment or website QR code where supported.',
      icon: QrCode,
      badge: 'QR safety',
    },
    {
      id: 'call',
      title: t.actions.checkCall,
      desc: 'Review suspicious caller conversations and possible impersonation attempts.',
      icon: PhoneCall,
      badge: 'Call safety',
    },
  ];

  return (
    <main className="ra-home-page">
      {/* Hero */}
      <section className="ra-hero">
        <div className="ra-hero-copy">
          <div className="ra-eyebrow">
            <span className="ra-eyebrow-icon">
              <ShieldCheck size={18} aria-hidden="true" />
            </span>
            <span>{t.tagline}</span>
          </div>

          <h1 className="ra-hero-title">
            {t.heroTitle}
          </h1>

          <p className="ra-hero-subtitle">
            {t.heroSubtitle}
          </p>

          <div className="ra-hero-actions">
            <button
              type="button"
              className="ra-button ra-button-primary"
              onClick={() => navigate('/check?type=message')}
            >
              <MessageSquareText size={20} aria-hidden="true" />
              <span>{t.actions.checkMessage}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>

            <button
              type="button"
              className="ra-button ra-button-secondary"
              onClick={() => navigate('/safety')}
            >
              Explore Safety Tips
            </button>
          </div>

          <div className="ra-trust-points">
            <span>
              <CheckCircle2 size={17} aria-hidden="true" />
              Simple explanations
            </span>
            <span>
              <CheckCircle2 size={17} aria-hidden="true" />
              Designed for everyday safety
            </span>
          </div>
        </div>

        <div className="ra-hero-visual">
          <div className="ra-visual-orb ra-visual-orb-one" />
          <div className="ra-visual-orb ra-visual-orb-two" />

          <div className="ra-visual-label">
            <span className="ra-live-dot" />
            DIGITAL PROTECTION
          </div>

          <ShieldScene
            label="RakshaAI protective shield representing digital scam protection"
          />

          <div className="ra-floating-note ra-floating-note-top">
            <span className="ra-note-icon">
              <Lock size={17} aria-hidden="true" />
            </span>
            <span>
              <strong>Stay alert</strong>
              <small>Think before you click</small>
            </span>
          </div>

          <div className="ra-floating-note ra-floating-note-bottom">
            <span className="ra-note-icon ra-note-icon-green">
              <ShieldCheck size={18} aria-hidden="true" />
            </span>
            <span>
              <strong>Your safety matters</strong>
              <small>Check suspicious messages</small>
            </span>
          </div>
        </div>
      </section>

      {/* Safety promise */}
      <section className="ra-promise">
        <div className="ra-promise-icon">
          <Lock size={25} aria-hidden="true" />
        </div>

        <div className="ra-promise-copy">
          <span className="ra-section-kicker">OUR SAFETY PROMISE</span>
          <h2>Your safety comes first.</h2>
          <p>{t.elderlyFriendlyNotice}</p>
        </div>

        <div className="ra-promise-decoration" aria-hidden="true">
          <ShieldCheck size={68} />
        </div>
      </section>

      {/* Analysis options */}
      <section className="ra-check-section">
        <div className="ra-section-heading">
          <div>
            <span className="ra-section-kicker">
              <Sparkles size={15} aria-hidden="true" />
              YOUR DIGITAL SAFETY TOOLKIT
            </span>

            <h2>What would you like to check?</h2>

            <p>
              Choose the option that matches what you received.
              We’ll help you understand the warning signs.
            </p>
          </div>

          <div className="ra-heading-badge">
            <ShieldCheck size={18} aria-hidden="true" />
            Stay protected
          </div>
        </div>

        <div className="ra-action-grid">
          {actionCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <GlassCard
                key={card.id}
                interactive
                className="ra-action-card"
              >
                <button
                  type="button"
                  className="ra-action-card-button"
                  onClick={() =>
                    navigate(`/check?type=${card.id}`)
                  }
                  aria-label={`Open ${card.title}`}
                >
                  <div className="ra-card-top">
                    <div className={`ra-card-icon ra-card-icon-${index}`}>
                      <Icon size={25} strokeWidth={1.9} aria-hidden="true" />
                    </div>

                    <span className="ra-card-badge">
                      {card.badge}
                    </span>
                  </div>

                  <h3>{card.title}</h3>

                  <p>{card.desc}</p>

                  <div className="ra-card-link">
                    <span>Open safety check</span>
                    <ArrowRight size={17} aria-hidden="true" />
                  </div>
                </button>
              </GlassCard>
            );
          })}
        </div>

        <p className="ra-capability-note">
          <Lock size={15} aria-hidden="true" />
          Some checks depend on the features supported by your current installation.
        </p>
      </section>

      {/* How it works */}
      <section className="ra-how-section">
        <div className="ra-how-heading">
          <span className="ra-section-kicker">A CLEARER WAY TO STAY SAFE</span>
          <h2>Pause. Check. Stay Safe.</h2>
          <p>
            Understand a suspicious message before taking action.
          </p>
        </div>

        <div className="ra-how-grid">
          <article className="ra-how-card">
            <span className="ra-step-number">01</span>
            <div className="ra-how-icon">
              <MessageSquareText size={24} aria-hidden="true" />
            </div>
            <h3>Check</h3>
            <p>
              Review a suspicious message, link, or other supported content.
            </p>
          </article>

          <article className="ra-how-card">
            <span className="ra-step-number">02</span>
            <div className="ra-how-icon">
              <ShieldCheck size={24} aria-hidden="true" />
            </div>
            <h3>Understand</h3>
            <p>
              Read the available warning signs and understand why they matter.
            </p>
          </article>

          <article className="ra-how-card">
            <span className="ra-step-number">03</span>
            <div className="ra-how-icon">
              <CheckCircle2 size={24} aria-hidden="true" />
            </div>
            <h3>Choose safely</h3>
            <p>
              Follow sensible safety steps before sharing money or information.
            </p>
          </article>
        </div>
      </section>

      {/* Final reassurance */}
      <section className="ra-final-banner">
        <div className="ra-final-icon">
          <Award size={28} aria-hidden="true" />
        </div>

        <div>
          <h2>When in doubt, check first.</h2>
          <p>
            Never share your OTP, PIN, or banking password with someone
            who contacts you unexpectedly.
          </p>
        </div>

        <button
          type="button"
          className="ra-button ra-button-primary"
          onClick={() => navigate('/check?type=message')}
        >
          Check a message
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </section>
    </main>
  );
};
