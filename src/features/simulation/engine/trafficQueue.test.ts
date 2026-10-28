import { describe, it, expect } from 'vitest';
import { TrafficQueueSimulationEngine } from './trafficQueue';
import { ScenarioComparisonEngine } from './comparisonEngine';
import { TrafficSimulationParams } from '../../../types/simulation';

describe('Frontend TrafficQueueSimulationEngine', () => {
  const baseParams: TrafficSimulationParams = {
    arrivalRateVehiclesPerMin: 28,
    initialQueueVehicles: 12,
    dischargeRateVehiclesPerMin: 30,
    signalCycleLengthSeconds: 90,
    effectiveGreenTimeSeconds: 30,
    amberAndAllRedSeconds: 4,
    pedestrianCrossingDurationSeconds: 20,
    simulationDurationMinutes: 15,
    randomSeed: 42,
  };

  it('computes valid non-negative queue length and KPIs', () => {
    const result = TrafficQueueSimulationEngine.run(baseParams);
    expect(result.kpis.totalArrivals).toBeGreaterThan(0);
    expect(result.kpis.totalDepartures).toBeGreaterThan(0);
    expect(result.kpis.remainingQueue).toBeGreaterThanOrEqual(0);
    expect(result.kpis.maxQueueLength).toBeGreaterThanOrEqual(result.kpis.remainingQueue);
  });

  it('rejects infeasible green time exceeding cycle', () => {
    expect(() =>
      TrafficQueueSimulationEngine.run({
        ...baseParams,
        effectiveGreenTimeSeconds: 88, // 88 + 4 = 92 > 90
      })
    ).toThrow(/Signal timing infeasible/);
  });

  it('evaluates Plan A and Plan B with safe percentage change', () => {
    const planA: TrafficSimulationParams = { ...baseParams, effectiveGreenTimeSeconds: 45 };
    const planB: TrafficSimulationParams = {
      ...baseParams,
      effectiveGreenTimeSeconds: 40,
      exclusivePedestrianPhase: true,
      signalCycleLengthSeconds: 100,
    };

    const resBase = TrafficQueueSimulationEngine.run(baseParams);
    const resA = TrafficQueueSimulationEngine.run(planA);
    const resB = TrafficQueueSimulationEngine.run(planB);

    const comp = ScenarioComparisonEngine.compare(resBase, resA, resB, 'balanced');
    expect(comp.differencesPlanA.length).toBeGreaterThan(0);
    expect(comp.tradeOffs.length).toBeGreaterThan(0);
    expect(comp.objectiveScores.scores.planA).toBeGreaterThanOrEqual(0);
  });
});
