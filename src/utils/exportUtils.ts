import { ScenarioComparisonOutput } from '../types/simulation';

export function exportComparisonToCSV(comparison: ScenarioComparisonOutput, filename = 'whatif-city-scenario-comparison.csv') {
  try {
    const headers = [
      'Metric',
      'Unit',
      'Preferred Direction',
      'Baseline Value',
      'Plan A Value',
      'Plan A Absolute Change',
      'Plan A % Change',
      'Plan B Value',
      'Plan B Absolute Change',
      'Plan B % Change',
    ];

    const rows: string[][] = [headers];

    // Combine diffs
    comparison.differencesPlanA.forEach((diffA) => {
      const diffB = comparison.differencesPlanB.find((d) => d.metricKey === diffA.metricKey);
      rows.push([
        `"${diffA.metricLabel}"`,
        `"${diffA.unit}"`,
        `"${diffA.preferredDirection}"`,
        diffA.baselineValue.toString(),
        diffA.planValue.toString(),
        diffA.absoluteChange.toString(),
        diffA.percentageChange !== null ? `${diffA.percentageChange}%` : 'N/A',
        diffB ? diffB.planValue.toString() : 'N/A',
        diffB ? diffB.absoluteChange.toString() : 'N/A',
        diffB && diffB.percentageChange !== null ? `${diffB.percentageChange}%` : 'N/A',
      ]);
    });

    // Add metadata rows
    rows.push([]);
    rows.push(['# METADATA & ASSUMPTIONS']);
    rows.push(['Baseline Scenario Name', `"${comparison.baseline.scenarioName}"`]);
    rows.push(['Plan A Scenario Name', `"${comparison.planA.scenarioName}"`]);
    rows.push(['Plan B Scenario Name', `"${comparison.planB.scenarioName}"`]);
    rows.push(['Model Version', `"${comparison.baseline.modelVersion}"`]);
    rows.push(['Timestamp', `"${new Date().toISOString()}"`]);
    rows.push(['Disclaimer', `"${comparison.disclaimer}"`]);

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to generate CSV', err);
    return false;
  }
}

export function triggerPrintReport() {
  window.print();
}
