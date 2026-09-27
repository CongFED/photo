import { AvailabilityEntry } from '@/types/availability';

/**
 * Mock availability data
 * Simulates rental reservations for demo
 * Dates use ISO format (YYYY-MM-DD)
 */
export const availabilityData: AvailabilityEntry[] = [
  {
    productId: 'sony-a7iv',
    totalUnits: 5,
    reservations: [
      { startDate: '2026-10-20', endDate: '2026-10-22', bookedUnits: 3 },
      { startDate: '2026-10-25', endDate: '2026-10-28', bookedUnits: 2 },
      { startDate: '2026-11-01', endDate: '2026-11-05', bookedUnits: 4 },
      { startDate: '2026-11-10', endDate: '2026-11-12', bookedUnits: 1 },
    ],
  },
  {
    productId: 'sony-a7cii',
    totalUnits: 3,
    reservations: [
      { startDate: '2026-10-20', endDate: '2026-10-23', bookedUnits: 2 },
      { startDate: '2026-10-28', endDate: '2026-10-30', bookedUnits: 1 },
      { startDate: '2026-11-05', endDate: '2026-11-08', bookedUnits: 3 },
    ],
  },
  {
    productId: 'canon-r6ii',
    totalUnits: 3,
    reservations: [
      { startDate: '2026-10-20', endDate: '2026-10-23', bookedUnits: 3 },
      { startDate: '2026-10-30', endDate: '2026-11-02', bookedUnits: 2 },
      { startDate: '2026-11-08', endDate: '2026-11-10', bookedUnits: 1 },
    ],
  },
  {
    productId: 'fujifilm-xt5',
    totalUnits: 4,
    reservations: [
      { startDate: '2026-10-22', endDate: '2026-10-25', bookedUnits: 2 },
      { startDate: '2026-11-01', endDate: '2026-11-03', bookedUnits: 3 },
    ],
  },
  {
    productId: 'fujifilm-x100vi',
    totalUnits: 2,
    reservations: [
      { startDate: '2026-10-18', endDate: '2026-10-25', bookedUnits: 2 },
      { startDate: '2026-10-28', endDate: '2026-11-01', bookedUnits: 1 },
      { startDate: '2026-11-05', endDate: '2026-11-10', bookedUnits: 2 },
    ],
  },
  {
    productId: 'nikon-z6iii',
    totalUnits: 2,
    reservations: [
      { startDate: '2026-10-20', endDate: '2026-10-24', bookedUnits: 1 },
      { startDate: '2026-11-01', endDate: '2026-11-05', bookedUnits: 2 },
    ],
  },
  {
    productId: 'sony-2470-gmii',
    totalUnits: 4,
    reservations: [
      { startDate: '2026-10-20', endDate: '2026-10-22', bookedUnits: 2 },
      { startDate: '2026-10-25', endDate: '2026-10-28', bookedUnits: 3 },
      { startDate: '2026-11-03', endDate: '2026-11-06', bookedUnits: 1 },
    ],
  },
  {
    productId: 'sony-35-14gm',
    totalUnits: 3,
    reservations: [
      { startDate: '2026-10-21', endDate: '2026-10-24', bookedUnits: 1 },
      { startDate: '2026-11-01', endDate: '2026-11-03', bookedUnits: 2 },
    ],
  },
  {
    productId: 'sigma-2470-art',
    totalUnits: 5,
    reservations: [
      { startDate: '2026-10-22', endDate: '2026-10-25', bookedUnits: 2 },
    ],
  },
  {
    productId: 'tamron-2875',
    totalUnits: 6,
    reservations: [
      { startDate: '2026-10-20', endDate: '2026-10-23', bookedUnits: 3 },
      { startDate: '2026-10-26', endDate: '2026-10-29', bookedUnits: 1 },
    ],
  },
  {
    productId: 'dji-rs4',
    totalUnits: 4,
    reservations: [
      { startDate: '2026-10-20', endDate: '2026-10-22', bookedUnits: 2 },
      { startDate: '2026-11-01', endDate: '2026-11-04', bookedUnits: 3 },
    ],
  },
  {
    productId: 'dji-osmo-pocket3',
    totalUnits: 5,
    reservations: [
      { startDate: '2026-10-21', endDate: '2026-10-24', bookedUnits: 4 },
      { startDate: '2026-10-28', endDate: '2026-10-30', bookedUnits: 2 },
    ],
  },
  {
    productId: 'godox-v1',
    totalUnits: 8,
    reservations: [
      { startDate: '2026-10-20', endDate: '2026-10-22', bookedUnits: 5 },
    ],
  },
  {
    productId: 'rode-wireless-go2',
    totalUnits: 5,
    reservations: [
      { startDate: '2026-10-20', endDate: '2026-10-25', bookedUnits: 3 },
      { startDate: '2026-11-02', endDate: '2026-11-05', bookedUnits: 2 },
    ],
  },
  {
    productId: 'manfrotto-190go',
    totalUnits: 6,
    reservations: [
      { startDate: '2026-10-22', endDate: '2026-10-25', bookedUnits: 2 },
    ],
  },
];
