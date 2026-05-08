/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MiniApp {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  accentColor: 'blue' | 'red';
  iconName: string;
}

export const MINI_APPS: MiniApp[] = [
  {
    id: 'active-listening',
    name: 'Active Listening',
    description: "Hear what isn't being said and reflect it back.",
    estimatedTime: '5 min',
    accentColor: 'blue',
    iconName: 'Ear',
  },
  {
    id: 'curiosity-lab',
    name: 'Curiosity Lab',
    description: 'Master the art of open, non-judgmental questions.',
    estimatedTime: '7 min',
    accentColor: 'red',
    iconName: 'Lightbulb',
  },
  {
    id: 'reframing-bias',
    name: 'Reframing Bias',
    description: 'Identify and pivot away from assumptions.',
    estimatedTime: '5 min',
    accentColor: 'blue',
    iconName: 'Scale',
  },
  {
    id: 'empathy-check',
    name: 'Empathy Check',
    description: 'Validate feelings without necessarily agreeing.',
    estimatedTime: '4 min',
    accentColor: 'red',
    iconName: 'Heart',
  },
  {
    id: 'common-ground',
    name: 'Finding Common Ground',
    description: 'Discover shared values in tough conversations.',
    estimatedTime: '8 min',
    accentColor: 'blue',
    iconName: 'Users',
  },
  {
    id: 'de-escalation',
    name: 'De-escalation',
    description: 'Cooling down heated exchanges effectively.',
    estimatedTime: '6 min',
    accentColor: 'red',
    iconName: 'ShieldAlert',
  },
];
