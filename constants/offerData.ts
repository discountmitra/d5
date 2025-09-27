export interface CategoryOffers {
  normal: string[];
  vip: string[];
}

export const categoryOffers: Record<string, CategoryOffers> = {
  'home-service': {
    normal: [
      'Basic service call: ₹200',
      'Standard repair: 10% off',
      'Emergency service: ₹300',
      'Warranty: 30 days'
    ],
    vip: [
      'Free service call',
      'Premium repair: 25% off',
      'Priority emergency: Free',
      'Extended warranty: 90 days',
      'Free maintenance check'
    ]
  },
  'event': {
    normal: [
      'Basic event planning: ₹5000',
      'Standard decoration: 15% off',
      'Photography package: ₹3000',
      'Catering: 10% off'
    ],
    vip: [
      'Premium event planning: 30% off',
      'Luxury decoration: 25% off',
      'Professional photography: 20% off',
      'Premium catering: 20% off',
      'Free event coordination'
    ]
  },
  'construction': {
    normal: [
      'Material supply: 5% off',
      'Labor charges: Standard rate',
      'Consultation: ₹500',
      'Project timeline: As per standard'
    ],
    vip: [
      'Premium materials: 15% off',
      'Skilled labor: 20% off',
      'Free consultation',
      'Priority project completion',
      'Free site supervision'
    ]
  },
  'beauty': {
    normal: [
      'Haircut: ₹110 (was ₹130)',
      'Facial: ₹180 (was ₹200)',
      'Hair coloring: 10% off',
      'Spa treatment: 15% off'
    ],
    vip: [
      'Premium haircut: ₹99 (was ₹130)',
      'Luxury facial: ₹149 (was ₹200)',
      'Hair coloring: 25% off',
      'Premium spa: 30% off',
      'Free consultation'
    ]
  }
};
