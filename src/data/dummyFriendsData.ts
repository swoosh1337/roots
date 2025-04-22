// src/data/dummyFriendsData.ts

export interface Habit {
  id: string;
  name: string;
  streak: number;
  currentDay: number; // Assuming this relates to streak or overall progress
  stage: number; // Determines tree visual (e.g., 1: sprout, 2: small tree, 3: medium tree)
}

export interface FriendData {
  id: string;
  name: string;
  avatar: string;
  habits: Habit[];
}

export const friendsData: FriendData[] = [
  {
    id: '1',
    name: "Polina",
    avatar: "/avatars/polina.png",
    habits: [
      {
        id: 'h1',
        name: "Reading",
        streak: 5,
        currentDay: 6,
        stage: 2
      },
      {
        id: 'h2',
        name: "Meditation",
        streak: 9,
        currentDay: 10,
        stage: 3
      },
      {
        id: 'h3',
        name: "Workout",
        streak: 2,
        currentDay: 3,
        stage: 1
      }
    ]
  },
  {
    id: '2',
    name: "Taylor",
    avatar: "/avatars/taylor.png",
    habits: [
      {
        id: 'h4',
        name: "Journaling",
        streak: 15,
        currentDay: 16,
        stage: 4
      },
      {
        id: 'h5',
        name: "Yoga",
        streak: 3,
        currentDay: 4,
        stage: 2
      }
    ]
  },
  {
    id: '3',
    name: "Jordan",
    avatar: "/avatars/jordan.png",
    habits: [] // Jordan has no habits yet
  }
]; 