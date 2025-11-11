import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Gift, 
  Crown, 
  Award, 
  ArrowLeft,
  Sparkles,
  Trophy,
  Zap,
  CheckCircle,
  Clock,
  Calendar,
  Hotel,
  Plane,
  Coffee,
  Wifi,
  Car,
  Utensils,
  Shield,
  Heart,
  TrendingUp,
  Target
} from 'lucide-react';

interface MembershipTier {
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
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
      icon: <Award className="w-8 h-8" />,
      color: 'text-gray-600',
      gradient: 'from-gray-400 to-gray-600',
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
      icon: <Star className="w-8 h-8" />,
      color: 'text-yellow-600',
      gradient: 'from-yellow-400 to-yellow-600',
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
      icon: <Crown className="w-8 h-8" />,
      color: 'text-purple-600',
      gradient: 'from-purple-400 to-purple-600',
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
      icon: <Hotel className="w-6 h-6" />,
      available: true
    },
    {
      id: 2,
      title: '$50 Dining Credit',
      description: 'Credit for hotel restaurants and room service',
      pointsCost: 1000,
      category: 'dining',
      icon: <Utensils className="w-6 h-6" />,
      available: true
    },
    {
      id: 3,
      title: 'Airport Transfer',
      description: 'Complimentary airport pickup and drop-off',
      pointsCost: 750,
      category: 'transport',
      icon: <Car className="w-6 h-6" />,
      available: true
    },
    {
      id: 4,
      title: 'Spa Package',
      description: '90-minute premium spa treatment',
      pointsCost: 1500,
      category: 'wellness',
      icon: <Heart className="w-6 h-6" />,
      available: true
    },
    {
      id: 5,
      title: 'Room Upgrade',
      description: 'Upgrade to next room category',
      pointsCost: 500,
      category: 'accommodation',
      icon: <TrendingUp className="w-6 h-6" />,
      available: true
    },
    {
      id: 6,
      title: '$25 Discount',
      description: 'Instant discount on your next booking',
      pointsCost: 500,
      category: 'discount',
      icon: <Target className="w-6 h-6" />,
      available: true
    },
    {
      id: 7,
      title: 'Premium Wi-Fi',
      description: 'High-speed internet for entire stay',
      pointsCost: 200,
      category: 'amenities',
      icon: <Wifi className="w-6 h-6" />,
      available: true
    },
    {
      id: 8,
      title: 'Welcome Champagne',
      description: 'Bottle of champagne in your room',
      pointsCost: 300,
      category: 'amenities',
      icon: <Sparkles className="w-6 h-6" />,
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

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('/userdashboard.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-emerald-900/20"></div>
      
      {/* Floating Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-yellow-400/10 to-orange-600/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-bounce-slow"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mb-6 shadow-2xl">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent mb-4">
            Rewards Program
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Earn points with every stay and unlock exclusive benefits and rewards
          </p>
        </div>

        {/* Current Status Card */}
        <div className="mb-12 animate-slide-up">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Your Membership Status</h2>
              <p className="text-white/80">Track your progress and see what's next</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Current Points */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Current Points</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {currentPoints.toLocaleString()}
                </p>
              </div>

              {/* Current Tier */}
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${membershipTiers[getCurrentTierIndex()].gradient} rounded-full mb-4`}>
                  {membershipTiers[getCurrentTierIndex()].icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Current Tier</h3>
                <p className={`text-4xl font-bold ${membershipTiers[getCurrentTierIndex()].color}`}>
                  {currentTier}
                </p>
              </div>
            </div>

            {/* Progress to Next Tier */}
            {getNextTier() && (
              <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-medium">Progress to {getNextTier()?.name}</span>
                  <span className="text-white/80">
                    {currentPoints} / {getNextTier()?.pointsRequired} points
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className={`h-3 bg-gradient-to-r ${getNextTier()?.gradient} rounded-full transition-all duration-500`}
                    style={{ width: `${getProgressToNextTier()}%` }}
                  ></div>
                </div>
                <p className="text-white/60 text-sm mt-2">
                  {getNextTier()?.pointsRequired! - currentPoints} points needed for {getNextTier()?.name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Membership Tiers */}
        <div className="mb-12 animate-slide-in-left">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Membership Tiers & Benefits</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {membershipTiers.map((tier, index) => (
              <div 
                key={tier.name}
                className={`bg-white/10 backdrop-blur-xl rounded-3xl p-8 border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  tier.name === currentTier 
                    ? 'border-yellow-400/50 bg-yellow-400/5 shadow-yellow-400/20 shadow-2xl' 
                    : 'border-white/20 hover:border-white/30'
                }`}
              >
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${tier.gradient} rounded-full mb-4`}>
                    {tier.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-white/80">
                    {tier.pointsRequired === 0 ? 'Starting tier' : `${tier.pointsRequired.toLocaleString()} points required`}
                  </p>
                  {tier.name === currentTier && (
                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-yellow-400/20 text-yellow-300 rounded-full text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Current Tier
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Benefits</h4>
                    <ul className="space-y-2">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-white/80">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Perks</h4>
                    <ul className="space-y-2">
                      {tier.perks.map((perk, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-white/80">
                          <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Redeem Points Section */}
        <div className="animate-slide-in-right">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
              <Gift className="w-8 h-8 text-pink-400" />
              Redeem Your Points
            </h2>

            {/* Category Filter */}
            <div className="mb-8 flex flex-wrap gap-2 justify-center">
              {['all', 'accommodation', 'dining', 'transport', 'wellness', 'amenities', 'discount'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Rewards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <p className="text-pink-300 font-medium">{item.pointsCost.toLocaleString()} points</p>
                    </div>
                  </div>
                  
                  <p className="text-white/80 mb-4 text-sm leading-relaxed">{item.description}</p>
                  
                  <button
                    onClick={() => handleRedeem(item)}
                    disabled={currentPoints < item.pointsCost}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      currentPoints >= item.pointsCost
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 hover:shadow-lg'
                        : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {currentPoints >= item.pointsCost ? 'Redeem Now' : 'Insufficient Points'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How to Earn Points */}
        <div className="mt-12 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">How to Earn Points</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Hotel className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Book Stays</h3>
                <p className="text-white/80 text-sm">Earn 10-20 points per $1 spent based on your tier</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Write Reviews</h3>
                <p className="text-white/80 text-sm">Get 50 points for each verified review</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Referrals</h3>
                <p className="text-white/80 text-sm">Earn 100 points for each friend you refer</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Special Events</h3>
                <p className="text-white/80 text-sm">Bonus points during promotions and holidays</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
