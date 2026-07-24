/**
 * ==============================================================================
 * Project: Jordan Environmental & Land Degradation Platform
 * Indicator: Soil Organic Carbon (SOC) Dynamics & Soil Health Proxy (2018-2025)
 * Developer: Dr. Haifa AL Mohammad
 * Platform: Google Earth Engine (JavaScript API)
 * Description: National assessment of soil organic carbon proxy changes calibrated
 *              for Jordan's arid and semi-arid environment.
 * ==============================================================================
 */

// 1. Boundary of Jordan
var jordan = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
               .filter(ee.Filter.eq('country_na', 'Jordan'));

Map.centerObject(jordan, 7);
Map.addLayer(jordan, {color: 'black'}, 'Jordan National Boundary', false);

// 2. Multi-temporal Processing Pipeline (2018 vs 2025)
var bands = ['B2', 'B4', 'B8', 'B11', 'QA60'];

function maskS2clouds(image) {
  var qa = image.select('QA60');
  var mask = qa.bitwiseAnd(1<<10).eq(0).and(qa.bitwiseAnd(1<<11).eq(0));
  return image.updateMask(mask).divide(10000);
}

var s2_2018 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
                  .filterBounds(jordan)
                  .filterDate('2018-01-01', '2018-12-31')
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                  .select(bands).map(maskS2clouds).median().clip(jordan);

var s2_2025 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
                  .filterBounds(jordan)
                  .filterDate('2025-01-01', '2025-12-31')
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                  .select(bands).map(maskS2clouds).median().clip(jordan);

// 3. SOC Spectral Index Calibration (NDVI & Bare Soil Index - BSI)
function calculateSOCProxy(img) {
  var ndvi = img.normalizedDifference(['B8', 'B4']).rename('NDVI');
  var bsi = img.expression(
    '((RED + SWIR) - (NIR + BLUE)) / ((RED + SWIR) + (NIR + BLUE))', {
      'RED': img.select('B4'),
      'SWIR': img.select('B11'),
      'NIR': img.select('B8'),
      'BLUE': img.select('B2')
  }).rename('BSI');
  
  // Custom SOC Ratio Proxy for Arid Soils
  var socProxy = ndvi.subtract(bsi).divide(ndvi.add(bsi)).rename('SOC_Proxy');
  return socProxy;
}

var soc_2018 = calculateSOCProxy(s2_2018);
var soc_2025 = calculateSOCProxy(s2_2025);

// 4. Calculate SOC Dynamics (Difference 2018-2025)
var socChange = soc_2025.subtract(soc_2018).rename('SOC_Change');

// Reclassify SOC Health Status
var socStatus = ee.Image(0)
  .where(socChange.lt(-0.1), 1) // Loss in SOC / Soil Degradation
  .where(socChange.gte(-0.1).and(socChange.lte(0.1)), 2) // Stable SOC
  .where(socChange.gt(0.1), 3) // SOC Gain / Soil Improvement
  .clip(jordan);

var socVis = {
  min: 1, max: 3,
  palette: ['#8c510a', '#f5f5f5', '#01665e'] // Brown: Loss | Grey: Stable | Teal: Improvement
};

Map.addLayer(socStatus, socVis, 'Soil Organic Carbon (SOC) Dynamics (2018-2025)');

// 5. Dedicated SOC Legend
var legend = ui.Panel({style: {position: 'bottom-right', padding: '10px'}});
legend.add(ui.Label('SOC Health Dynamics (Jordan)', {fontWeight: 'bold', fontSize: '13px'}));

var addRow = function(color, name) {
  return ui.Panel({
    widgets: [
      ui.Label({style: {backgroundColor: color, padding: '7px', margin: '0 4px'}}),
      ui.Label(name, {style: {fontSize: '11px'}})
    ],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

legend.add(addRow('#8c510a', 'SOC Depletion / تراجع الكربون العضوي'));
legend.add(addRow('#f5f5f5', 'Stable / مستقر'));
legend.add(addRow('#01665e', 'SOC Accumulation / تحسن الكربون العضوي'));

Map.add(legend);
