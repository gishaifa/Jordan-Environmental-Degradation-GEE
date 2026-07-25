# 🌍 Jordan Environmental & Land Degradation Assessment Platform (LDAP)

[![Platform](https://img.shields.io/badge/Google%20Earth%20Engine-JavaScript-blue?logo=googleearthengine&logoColor=white)](https://earthengine.google.com/)
[![Data Source](https://img.shields.io/badge/Satellite-Sentinel--2%20MSI%20(10m)-green)](https://sentinels.copernicus.eu/)
[![SDG Alignment](https://img.shields.io/badge/SDG-15.3.1%20Land%20Degradation%20Neutrality-orange)](https://www.unccd.int/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An automated cloud-computing framework built on **Google Earth Engine (GEE)** to analyze, monitor, and assess national-level environmental indicators and **Land Degradation (LD)** trajectories across Jordan through 2025.

---

## 📌 Overview

This platform serves as an advanced geospatial Decision Support System (DSS) prototype designed to support **UN SDG Target 15.3.1**. Powered by high-resolution **Sentinel-2 MSI multi-spectral imagery**, it provides cloud-processed spatial proxies for monitoring baseline environmental health, tracking land degradation trends, and guiding sustainable land management decisions across Jordan.

### Core Capabilities
* **🌱 Soil Organic Carbon (SOC) Dynamics:** Monitors proxy changes in soil organic carbon tailored for arid and semi-arid environments.
* **🌿 Vegetation Productivity Trajectories:** Conducts multi-temporal anomaly detection (NDVI/SAVI) to map vegetation health under climatic stresses.
* **🗺️ Land Cover & Surface Dynamics (LULC):** Evaluates high-resolution satellite composites to track agricultural development versus degraded land.
* **🌍 Integrated LD Synthesis:** Combines spatial sub-indicators to deliver dynamic, national-scale land degradation priority maps.

---

## 🛠️ Key Spectral Indices

| Index | Full Name | Primary Application in Arid Environments |
| :--- | :--- | :--- |
| **NDVI** | Normalized Difference Vegetation Index | Vegetation density, greenness, and canopy health |
| **SAVI** | Soil-Adjusted Vegetation Index | Minimizes soil background reflection in sparse/arid regions |
| **NDWI** | Normalized Difference Water Index | Surface water body tracking & soil moisture proxies |
| **NBR** | Normalized Burn Ratio | Wildfire severity and post-fire vegetation recovery |

---

## 💻 Repository & Script Architecture

All algorithms are implemented using the **GEE JavaScript API** and optimized for server-side parallel execution across Jordan's national boundaries.

| Script File | Focused Environmental Indicator | Primary Inputs | SDG 15.3.1 Alignment | Key Spectral Metrics |
| :--- | :--- | :--- | :--- | :--- |
| **`01_Jordan_Vegetation_Productivity.js`** | Vegetation Dynamics & Trend Analysis | Sentinel-2 NDVI Time-Series | **Land Productivity Dynamics (LPD)** | NDVI, SAVI, EVI Trends |
| **`02_Jordan_SOC_Dynamics_Proxy.js`** | Soil Organic Carbon & Brightness Dynamics | Sentinel-2 Red/NIR/SWIR + DEM | **Soil Organic Carbon (SOC)** | NDWI, Bare Soil Index (BSI), Topography |
| **`03_Jordan_LULC_Environmental_Proxy.js`** | Land Cover Classification & Soil Bareness | Cloud-Masked Sentinel-2 Composites | **Land Cover Change (LCC)** | Multi-Spectral Thresholds, Machine Learning |
| **`04_Jordan_Integrated_Land_Degradation_Map.js`** | Comprehensive National Degradation Map | Combined SDG Sub-Indicators | **Integrated SDG 15.3.1** | Multi-Criteria Composite Matrix |

---

## 🚀 How to Run the Scripts

1. Navigate to the `scripts/` directory in this repository and open the target `.js` file.
2. Copy the entire JavaScript code snippet.
3. Open the **[Google Earth Engine Code Editor](https://code.earthengine.google.com/)**.
4. Paste the script into the main code editor panel.
5. Set your parameters (e.g., Target Year, Region of Interest) and click **Run**.

---

## 👤 Author & Geospatial Expertise

**Dr. Haifa AL Mohammad**  
* **Lead Geospatial Expert:** Remote Sensing, GIS & GeoAI Specialist  
* **Domain Focus:** Spatial Decision Support Systems (SDSS), Environmental Degradation Analysis, & Sustainable Land Management (SLM)

---
*License: [MIT](https://opensource.org/licenses/MIT) — Open-source tools for environmental monitoring and sustainability research.*
