const COMPANIES = [
  'Sharma & Co. Chartered Accountants', 'Dutta Digital Solutions', 'Patel Exports Ltd.',
  'Nair Legal Associates', 'Kulkarni Interiors', 'Mehra Travels', 'Iyer Architects',
  'Reddy Logistics', 'Banerjee Creative Studio', 'Chopra Consulting',
  'Rao Biotech', 'Sinha Marketing', 'Agarwal Jewellers Head Office', 'Joshi Tax Advisors',
  'Kapoor Fintech', 'Verma Realty', 'Desai Pharmaceuticals', 'Singh Logistics LLP',
  'Pillai Exports', 'Ghosh Media Group',
];

const TENANTS = [
  'Anil Sharma', 'Priya Dutta', 'Raj Patel', 'Meera Nair', 'Suresh Kulkarni',
  'Deepak Mehra', 'Lakshmi Iyer', 'Karthik Reddy', 'Anamika Banerjee', 'Rohit Chopra',
  'Vikram Rao', 'Neha Sinha', 'Harish Agarwal', 'Sunita Joshi', 'Arjun Kapoor',
  'Ritu Verma', 'Sameer Desai', 'Harpreet Singh', 'Kiran Pillai', 'Sudipta Ghosh',
];

const RATINGS = ['Excellent', 'Good', 'Average', 'Poor'];
const NOISE_SOURCES = ['Traffic', 'Nearby shops', 'Construction'];
const LOCATION_CHALLENGES = ['Parking', 'Accessibility', 'Visibility'];
const ADDITIONAL_SERVICES = ['Meeting Rooms', 'Reception Services', 'Storage Space', 'Parking'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickSome = (arr) => arr.filter(() => Math.random() > 0.55);
const yesNo = () => (Math.random() > 0.25 ? 'Yes' : 'No');

function randomDateWithin(days = 90) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * days));
  return d.toISOString();
}

export function makeSeedRows() {
  return Array.from({ length: 20 }, (_, i) => {
    const satisfaction = Math.max(3, Math.min(10, Math.round(6 + (Math.random() - 0.4) * 5)));
    const recommends = satisfaction >= 6 ? 'Yes' : pick(['Yes', 'No']);
    return {
      date: randomDateWithin(),
      companyName: COMPANIES[i % COMPANIES.length],
      tenantName: TENANTS[i % TENANTS.length],
      email: `tenant${i + 1}@example.com`,
      phone: `+91 98${Math.floor(10000000 + Math.random() * 89999999)}`,
      satisfactionScore: satisfaction,
      wouldRecommend: recommends,
      recommendReason: recommends === 'Yes' ? 'Good amenities and central location.' : 'Some facilities need improvement.',
      officeSize: pick(RATINGS),
      furnitureComfort: pick(RATINGS),
      infraIssues: Math.random() > 0.6 ? 'AC cooling is weak in the afternoon.' : '',
      improvementSuggestion: Math.random() > 0.5 ? 'More natural light in the cabin area.' : '',
      commonAreaCleanliness: pick(RATINGS),
      maintenanceSpeed: pick(['Very Fast', 'Acceptable', 'Slow']),
      recurringProblems: Math.random() > 0.7 ? 'Occasional water leakage during monsoon.' : '',
      internetQuality: pick([...RATINGS, 'Not Applicable']),
      powerBackup: pick(RATINGS),
      washroom: pick(RATINGS),
      pantry: pick(RATINGS),
      noiseDisturbance: pick(['Never', 'Sometimes', 'Frequently']),
      noiseSources: pickSome(NOISE_SOURCES),
      noiseSourceOther: '',
      antiSocialBehavior: Math.random() > 0.85 ? 'Yes' : 'No',
      antiSocialDetails: Math.random() > 0.85 ? 'Loitering near parking after hours.' : '',
      comfortableAllHours: yesNo(),
      locationRating: pick(RATINGS),
      locationChallenges: pickSome(LOCATION_CHALLENGES),
      locationChallengeOther: '',
      staffBehavior: pick(RATINGS),
      staffFeedback: Math.random() > 0.5 ? 'Reception staff is responsive and polite.' : '',
      rentJustified: yesNo(),
      rentVsMarket: pick(['High', 'Fair', 'Low']),
      justifyHigherRent: Math.random() > 0.5 ? 'Better meeting rooms and faster internet.' : '',
      managementResponsiveness: pick(RATINGS),
      communicationClarity: pick(RATINGS),
      managementSuggestions: Math.random() > 0.5 ? 'A monthly tenant newsletter would help.' : '',
      continuePlan: pick(['Yes', 'Yes', 'Yes', 'No', 'Not Sure']),
      futureSpaceSize: pick(['Bigger', 'Same', 'Smaller']),
      additionalServices: pickSome(ADDITIONAL_SERVICES),
      additionalServicesOther: '',
      likeMost: pick([
        'The location is fantastic.', 'Professional environment and clean premises.',
        'Reliable power backup and internet.', 'Friendly staff and well-maintained common areas.',
        'Safe, secure and family-friendly.',
      ]),
      dislikeMost: pick([
        'Parking is always a struggle.', 'Afternoon AC cooling is weak.',
        'Pantry options are limited.', 'Washrooms need more frequent cleaning.',
        'Lift waiting time in mornings.',
      ]),
      ownerChange: pick([
        'Expand meeting room availability.', 'Introduce a visitor management system.',
        'Better signage inside the building.', 'Dedicated parking per tenant.',
        'Improve HVAC and ventilation.',
      ]),
      upgradeWillingness: pick(['Yes', 'Maybe', 'No']),
    };
  });
}
