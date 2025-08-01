export const EVENT_CATEGORIES = [
  {
    id: 'academic',
    name: 'Academic',
    icon: '📚',
    color: '#4CAF50',
    description: 'Study groups, workshops, lectures, academic events'
  },
  {
    id: 'social',
    name: 'Social',
    icon: '🎉',
    color: '#FF9800',
    description: 'Parties, meetups, social gatherings, networking'
  },
  {
    id: 'sports',
    name: 'Sports & Recreation',
    icon: '⚽',
    color: '#2196F3',
    description: 'Sports games, fitness activities, outdoor recreation'
  },
  {
    id: 'cultural',
    name: 'Cultural',
    icon: '🎭',
    color: '#9C27B0',
    description: 'Cultural events, performances, art exhibitions'
  },
  {
    id: 'career',
    name: 'Career & Professional',
    icon: '💼',
    color: '#607D8B',
    description: 'Career fairs, workshops, professional development'
  },
  {
    id: 'outdoor',
    name: 'Outdoor Activities',
    icon: '🏔️',
    color: '#8BC34A',
    description: 'Hiking, camping, outdoor adventures, nature activities'
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    color: '#00BCD4',
    description: 'Tech meetups, hackathons, coding workshops'
  },
  {
    id: 'music',
    name: 'Music & Entertainment',
    icon: '🎵',
    color: '#E91E63',
    description: 'Concerts, music events, entertainment shows'
  },
  {
    id: 'food',
    name: 'Food & Dining',
    icon: '🍕',
    color: '#FF5722',
    description: 'Food events, cooking classes, dining experiences'
  },
  {
    id: 'volunteer',
    name: 'Volunteer & Community',
    icon: '🤝',
    color: '#795548',
    description: 'Volunteer opportunities, community service'
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: '🧘',
    color: '#4CAF50',
    description: 'Yoga, meditation, health workshops, wellness activities'
  },
  {
    id: 'other',
    name: 'Other',
    icon: '📌',
    color: '#9E9E9E',
    description: 'Other events that don\'t fit the above categories'
  }
];

export const getCategoryById = (categoryId) => {
  return EVENT_CATEGORIES.find(category => category.id === categoryId) || EVENT_CATEGORIES[EVENT_CATEGORIES.length - 1]; // Default to 'Other'
};

export const getCategoryColor = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category.color;
};

export const getCategoryIcon = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category.icon;
};

export const getCategoryName = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category.name;
}; 