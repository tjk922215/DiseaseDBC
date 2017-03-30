export default {
  isEmpty (ele) {
    return ele === '' || ele === null
  },
  isInt (ele) {
    if (!isNaN(ele)) {
      var tmp = parseInt(ele)
      return tmp - ele === 0
    } else {
      return false
    }
  },
  contains (arr, ele) {
    for (let i in arr) {
      if (arr[i] === ele) {
        return true
      }
    }
    return false
  },
  checkForm (form, type) {
    var requiredCols = []
    var intCols = []
    var floatCols = []
    switch (type) {
      case 'Basic Sources':
        requiredCols = [
          'ReportID', 'Reporter', 'Disease', 'Country', 'DocumentCategory', 'Journal',
          'Title', 'Authors', 'YearOfPub', 'AuthorContactNeeded', 'OpenAccess'
        ]
        intCols = [ 'ReportID', 'YearOfPub', 'Volume', 'Issue', 'PageFrom', 'PageTo' ]
        break
      case 'Survey Description':
        requiredCols = [ 'SurveyID', 'BasicSourcesReportID', 'DataType', 'SurveyType' ]
        intCols = [ 'SurveyID', 'BasicSourcesReportID', 'YearStart', 'YearFinish' ]
        break
      case 'Location Information':
        requiredCols = [ 'LocationID', 'SurveyDescriptionBasicSourcesReportID', 'SurveyDescriptionSurveyID' ]
        intCols = [ 'LocationID', 'SurveyDescriptionBasicSourcesReportID', 'SurveyDescriptionSurveyID' ]
        floatCols = [ 'Latitude', 'Longitude' ]
        break
      case 'Disease Data':
        requiredCols = [
          'DiseaseID', 'Species', 'LReportID',
          'LocationInformationSurveyDescriptionSurveyID',
          'LocationInformationLocationID', 'LocationInformationLocationID1'
        ]
        intCols = [
          'LocationInformationSurveyDescriptionSurveyID',
          'LocationInformationLocationID1', 'LReportID',
          'DiseaseID', 'NumPositiveMale', 'NumPositiveFemale',
          'NumPositive', 'NumExamineMale', 'NumExamineFemale',
          'NumExamine', 'AgeUpper', 'AgeLower'
        ]
        floatCols = [ 'PercentPositiveMale', 'PercentPositiveFemale', 'PercentPositive' ]
        break
      case 'Intervention Data':
        requiredCols = [
          'InterventionID', 'DiseaseDataDiseaseID', 'DiseaseDataLocationInformationLocationID1',
          'DiseaseDataLReportID', 'DiseaseDataLocationInformationSurveyDescriptionSurveyID'
        ]
        intCols = [
          'InterventionID', 'DiseaseDataDiseaseID', 'DiseaseDataLocationInformationLocationID1',
          'DiseaseDataLReportID', 'DiseaseDataLocationInformationSurveyDescriptionSurveyID',
          'MonthsAfterBaseline', 'FrequencyPerYear', 'PeriodMonths', 'INumExamine',
          'INumPositive', 'INumExamineMale', 'INumPositiveMale', 'INumExamineFemale', 'INumPositiveFemale'
        ]
        floatCols = [ 'Coverage', 'IPercentPositive', 'IPercentPositiveMale', 'IPercentPositiveFemale' ]
    }
    var msg = ''
    for (let i in form) {
      if (this.contains(requiredCols, i)) {
        if (this.isEmpty(form[i])) {
          msg = i + '不能为空'
          return msg
        }
      }
      if (this.contains(intCols, i)) {
        if (!this.isInt(form[i]) && form[i] !== '' && form[i] !== null) {
          msg = i + '必须是整数'
          return msg
        }
      }
      if (this.contains(floatCols, i)) {
        if (isNaN(form[i]) && form[i] !== '' && form[i] !== null) {
          msg = i + '必须是数字'
          return msg
        }
      }
    }
    return msg
  }
}
