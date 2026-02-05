import AxeBuilder from '@axe-core/playwright';

async function axeTest(page) {
  const violations = [];
  // accessibility testing function
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags([
      'wcag2a',
      'wcag2aa',
      'wcag21a',
      'wcag21aa',
      'wcag22a',
      'wcag22aa'
    ])
    .analyze();
  if (accessibilityScanResults.violations.length > 0) {
    accessibilityScanResults.violations.forEach((violationType) => {
      const instances = violationType.nodes.map((violationInstance) => {
        return {
          issue: violationType.help,
          impact: violationType.impact,
          failureSummary: violationInstance.failureSummary,
          targetHtmlObject: violationInstance.target,
          fullHtml: violationInstance.html,
          pageUrl: accessibilityScanResults.url
        };
      });
      violations.push(...instances);
    });
  }
  return violations;
}

module.exports = { axeTest };
