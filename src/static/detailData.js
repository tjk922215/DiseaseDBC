const detail = {
  basicDetail: {
    reporterOptions: [
      'Lai Yingsi',
      'Du zhiheng',
      'Huang Yun',
      'Wang Xinwei',
      'He Wenjun',
      'Dai Bofeng'
    ],
    diseaseOptions: [
      'STH', 'dengue',
      'foodborne trematodiases',
      'malaria hfmd', 'TB',
      'Hepatitis B', 'diarrhea',
      'iron deficient anemia',
      'other'
    ],
    countryOptions: [
      'China', 'Myanmar', 'Cambodia',
      'Indonesia', 'Laos', 'Malaysia',
      'Philippines', 'Thailand', 'Vietnam',
      'India', 'Bangladesh', 'Bhutan',
      'Nepal', 'Pakistan'
    ],
    //
    documentCategoryOptions: [
      'peer-review literature',
      'working report',
      'thesis',
      'personal communication',
      'other database',
      'others'
    ]
  },
  surveyDetail: {
    dataTypeOptions: [
      'prevalence', 'incidence',
      'outbreak', 'others'
    ],
    surveyTypeOptions: [
      'community',
      'school-based',
      'hospital-based',
      'under-school-aged children',
      'others'
    ],
    monthOptions: [
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'
    ]
  },
  locationDetail: {
    pointTypeOptions: [
      'school', 'village', 'town',
      'county', 'area', 'region',
      'AMD3', 'ADM2', 'ADM1'
    ],
    grSourceOptions: [
      'NA', 'google map', 'wikimapia',
      'GEOnet Names Server', 'GeoPostcodes',
      'provided by authors', 'others'
    ]
  },
  diseaseDetail: {
    informationOptions: [
      'Ascaris lumbricoides', 'Trichuris trichiura', 'hookworm',
      'Necator americanus', 'Ancylostoma duodenale', 'Dengue',
      'Opisthorchis viverrini', 'Clonorchis sinensis', 'Plasmodium falciparum',
      'Plasmodium vivax', 'Plasmodium malariae', 'Plasmodium ovale',
      'Plasmodium knowlesi', 'hfmd', 'CA16',
      'EV71', 'hfmd_other species', 'others'
    ]
  },
  interventionDetail: {
    groupOptions: [
      'intervention group', 'control group', 'others'
    ]
  }
}

module.exports = detail
