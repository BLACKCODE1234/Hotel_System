import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Gift,
  Crown,
  Award,
  ArrowLeft,
  CheckCircle,
  Calendar,
  Hotel,
  Utensils,
  Wifi,
  Car,
  Heart,
  TrendingUp,
  Target
} from 'lucide-react';

interface MembershipTier {
  name: string;
  icon: React.ReactNode;
  pointsRequired: number;
  benefits: string[];
  perks: string[];
}

interface RewardItem {
  id: number;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  icon: React.ReactNode;
  available: boolean;
}

const RewardsPage: React.FC = () => {
  const [currentPoints] = useState(2750);
  const [currentTier] = useState('Gold');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const membershipTiers: MembershipTier[] = [
    {
      name: 'Silver',
      icon: <Award className="w-6 h-6 text-ink-muted" />,
      pointsRequired: 0,
      benefits: [
        '5% discount on all bookings',
        'Free Wi-Fi',
        'Late checkout until 1 PM',
        'Welcome drink on arrival'
      ],
      perks: [
        'Earn 10 points per $1 spent',
        'Birthday bonus: 100 points',
        'Member-only deals'
      ]
    },
    {
      name: 'Gold',
      icon: <Star className="w-6 h-6 text-brass" />,
      pointsRequired: 2500,
      benefits: [
        '10% discount on all bookings',
        'Free room upgrade (subject to availability)',
        'Late checkout until 3 PM',
        'Complimentary breakfast',
        'Priority customer support',
        'Free airport shuttle'
      ],
      perks: [
        'Earn 15 points per $1 spent',
        'Birthday bonus: 250 points',
        'Exclusive Gold member rates',
        'Free cancellation up to 2 hours before check-in'
      ]
    },
    {
      name: 'Platinum',
      icon: <Crown className="w-6 h-6 text-forest" />,
      pointsRequired: 5000,
      benefits: [
        '15% discount on all bookings',
        'Guaranteed room upgrade',
        'Late checkout until 6 PM',
        'Complimentary breakfast & dinner',
        'Dedicated concierge service',
        'Free spa access',
        'Complimentary minibar',
        'Priority reservations'
      ],
      perks: [
        'Earn 20 points per $1 spent',
        'Birthday bonus: 500 points',
        'Exclusive Platinum suites access',
        'Free cancellation anytime',
        'Personal travel advisor'
      ]
    }
  ];

  const rewardItems: RewardItem[] = [
    {
      id: 1,
      title: 'Free Night Stay',
      description: 'One complimentary night at any of our hotels',
      pointsCost: 2500,
      category: 'accommodation',
      icon: <Hotel className="w-5 h-5" />,
      available: true
    },
    {
      id: 2,
      title: '$50 Dining Credit',
      description: 'Credit for hotel restaurants and room service',
      pointsCost: 1000,
      category: 'dining',
      icon: <Utensils className="w-5 h-5" />,
      available: true
    },
    {
      id: 3,
      title: 'Airport Transfer',
      description: 'Complimentary airport pickup and drop-off',
      pointsCost: 750,
      category: 'transport',
      icon: <Car className="w-5 h-5" />,
      available: true
    },
    {
      id: 4,
      title: 'Spa Package',
      description: '90-minute premium spa treatment',
      pointsCost: 1500,
      category: 'wellness',
      icon: <Heart className="w-5 h-5" />,
      available: true
    },
    {
      id: 5,
      title: 'Room Upgrade',
      description: 'Upgrade to next room category',
      pointsCost: 500,
      category: 'accommodation',
      icon: <TrendingUp className="w-5 h-5" />,
      available: true
    },
    {
      id: 6,
      title: '$25 Discount',
      description: 'Instant discount on your next booking',
      pointsCost: 500,
      category: 'discount',
      icon: <Target className="w-5 h-5" />,
      available: true
    },
    {
      id: 7,
      title: 'Premium Wi-Fi',
      description: 'High-speed internet for entire stay',
      pointsCost: 200,
      category: 'amenities',
      icon: <Wifi className="w-5 h-5" />,
      available: true
    },
    {
      id: 8,
      title: 'Welcome Champagne',
      description: 'Bottle of champagne in your room',
      pointsCost: 300,
      category: 'amenities',
      icon: <Gift className="w-5 h-5" />,
      available: true
    }
  ];

  const getCurrentTierIndex = () => {
    return membershipTiers.findIndex(tier => tier.name === currentTier);
  };

  const getNextTier = () => {
    const currentIndex = getCurrentTierIndex();
    return currentIndex < membershipTiers.length - 1 ? membershipTiers[currentIndex + 1] : null;
  };

  const getProgressToNextTier = () => {
    const nextTier = getNextTier();
    if (!nextTier) return 100;

    const currentTierPoints = membershipTiers[getCurrentTierIndex()].pointsRequired;
    const nextTierPoints = nextTier.pointsRequired;
    const progress = ((currentPoints - currentTierPoints) / (nextTierPoints - currentTierPoints)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const filteredRewards = rewardItems.filter(item => {
    return selectedCategory === 'all' || item.category === selectedCategory;
  });

  const handleRedeem = (item: RewardItem) => {
    if (currentPoints >= item.pointsCost) {
      alert(`Successfully redeemed: ${item.title}! ${item.pointsCost} points have been deducted.`);
    } else {
      alert(`Insufficient points. You need ${item.pointsCost - currentPoints} more points to redeem this reward.`);
    }
  };

  const nextTier = getNextTier();

  return (
    <div className="min-h-screen py-8 animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="btn-ghost inline-flex items-center gap-2 mb-8 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <header className="mb-10">
          <p className="section-label mb-2">Loyalty program</p>
          <h1 className="page-title mb-3">Rewards</h1>
          <p className="text-ink-muted text-lg max-w-xl">
            Earn points with every stay and redeem them for on-property benefits.
          </p>
        </header>

        <div className="panel mb-10">
          <p className="section-label mb-6">Your membership</p>
          <div className="grid sm:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-sm text-ink-muted mb-1">Current points</p>
              <p className="font-display text-4xl text-ink">{currentPoints.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-ink-muted mb-1">Current tier</p>
              <div className="flex items-center gap-3">
                {membershipTiers[getCurrentTierIndex()].icon}
                <p className="font-display text-4xl text-ink">{currentTier}</p>
              </div>
            </div>
          </div>

          {nextTier && (
            <div className="border-t border-sand-deep pt-6">
              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="text-ink-muted">Progress to {nextTier.name}</span>
                <span className="font-medium text-ink">
                  {currentPoints.toLocaleString()} / {nextTier.pointsRequired.toLocaleString()} pts
                </span>
              </div>
              <div className="w-full bg-sand-deep h-2">
                <div
                  className="h-2 bg-brass transition-all duration-500"
                  style={{ width: `${getProgressToNextTier()}%` }}
                />
              </div>
              <p className="text-xs text-ink-muted mt-2">
                {nextTier.pointsRequired - currentPoints} points needed for {nextTier.name}
              </p>
            </div>
          )}
        </div>

        <section className="mb-12">
          <h2 className="font-display text-2xl text-ink mb-6">Membership tiers</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {membershipTiers.map((tier) => (
              <div
                key={tier.name}
                className={`panel ${
                  tier.name === currentTier ? 'border-brass ring-1 ring-brass/20' : ''
                }`}
              >
                <div className="mb-5 pb-5 border-b border-sand-deep">
                  <div className="flex items-center gap-3 mb-2">
                    {tier.icon}
                    <h3 className="font-display text-xl text-ink">{tier.name}</h3>
                  </div>
                  <p className="text-sm text-ink-muted">
                    {tier.pointsRequired === 0
                      ? 'Starting tier'
                      : `${tier.pointsRequired.toLocaleString()} points required`}
                  </p>
                  {tier.name === currentTier && (
                    <span className="status-chip status-chip--ok mt-3">Current tier</span>
                  )}
                </div>

                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-semibold tracking-wide uppercase text-brass mb-3">Benefits</h4>
                    <ul className="space-y-2">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-ink-muted">
                          <CheckCircle className="w-4 h-4 text-forest mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold tracking-wide uppercase text-brass mb-3">Perks</h4>
                    <ul className="space-y-2">
                      {tier.perks.map((perk, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-ink-muted">
                          <Star className="w-4 h-4 text-brass mt-0.5 flex-shrink-0" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel mb-12">
          <h2 className="font-display text-2xl text-ink mb-6 flex items-center gap-2">
            <Gift className="w-5 h-5 text-brass" />
            Redeem points
          </h2>

          <div className="mb-8 flex flex-wrap gap-2">
            {['all', 'accommodation', 'dining', 'transport', 'wellness', 'amenities', 'discount'].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-semibold tracking-wide border transition-colors ${
                  selectedCategory === category
                    ? 'bg-ink text-white border-ink'
                    : 'bg-white text-ink-muted border-sand-deep hover:border-ink hover:text-ink'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRewards.map((item) => (
              <div key={item.id} className="border border-sand-deep p-5 bg-sand-warm">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 border border-sand-deep bg-white flex items-center justify-center text-brass flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">{item.title}</h3>
                    <p className="text-sm text-brass font-medium">{item.pointsCost.toLocaleString()} points</p>
                  </div>
                </div>
                <p className="text-sm text-ink-muted mb-5 leading-relaxed">{item.description}</p>
                <button
                  type="button"
                  onClick={() => handleRedeem(item)}
                  disabled={currentPoints < item.pointsCost}
                  className={
                    currentPoints >= item.pointsCost
                      ? 'btn-primary w-full text-sm py-2'
                      : 'w-full py-2 text-sm font-semibold border border-sand-deep text-ink-muted bg-sand cursor-not-allowed'
                  }
                >
                  {currentPoints >= item.pointsCost ? 'Redeem' : 'Insufficient points'}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2 className="font-display text-2xl text-ink mb-6">How to earn points</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Hotel, title: 'Book stays', copy: '10–20 points per $1 based on tier' },
              { icon: Star, title: 'Write reviews', copy: '50 points per verified review' },
              { icon: Gift, title: 'Referrals', copy: '100 points per referred guest' },
              { icon: Calendar, title: 'Promotions', copy: 'Bonus points during special events' },
            ].map(({ icon: Icon, title, copy }) => (
              <div key={title} className="border-t border-sand-deep pt-5">
                <Icon className="w-5 h-5 text-brass mb-3" />
                <h3 className="font-semibold text-ink mb-1">{title}</h3>
                <p className="text-sm text-ink-muted">{copy}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RewardsPage;
