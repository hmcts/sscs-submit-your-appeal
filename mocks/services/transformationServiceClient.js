/* eslint-disable max-len */
const success = {
  caseId: '1509031793780148',
  error: null,
  status: 'success'
};

const failure = {
  caseId: 0,
  error: 'Request Id : null and Exception message : 422 , Exception response body: {"exception":"uk.gov.hmcts.ccd.endpoint.exceptions.CaseValidationException","timestamp":"2017-11-01T10:52:09.018","status":422,"error":"Unprocessable Entity","message":"Case data validation failed","path":"/citizens/69/jurisdictions/DIVORCE/case-types/DIVORCE/cases","details":{"field_errors":[{"id":"D8DivorceWho","message":"significant-other is not a valid value"}]},"callbackErrors":null,"callbackWarnings":null}',
  status: 'error'
};

const mockSession = {
  screenHasMarriageBroken: 'Yes',
  screenHasRespondentAddress: 'Yes',
  screenHasMarriageCert: 'Yes',
  screenHasPrinter: 'Yes',
  divorceWho: 'husband',
  marriageDateDay: 2,
  marriageDateMonth: 2,
  marriageDateYear: 2001,
  marriageDate: '2001-02-02T00:00:00.000Z',
  marriageWhereMarried: 'england',
  helpWithFeesNeedHelp: 'Yes',
  helpWithFeesAppliedForFees: 'Yes',
  helpWithFeesReferenceNumber: 'HWF-123-456',
  marriedInUk: 'Yes',
  fetchedDraft: true
};

const mockedService = {
  submit: (_, _a, outcome = true) => new Promise(resolve => {
    resolve(outcome ? success : failure);
  }),

  update: (_, _a, outcome = true) => new Promise(resolve => {
    resolve(outcome ? success : failure);
  }),

  saveToDraftStore: (options, userToken, body, sendEmail, outcome = true) => new Promise((resolve, reject) => {
    if (outcome) {
      resolve();
    } else {
      reject(Error());
    }
  }),

  restoreFromDraftStore: (_, outcome = false) => new Promise((resolve, reject) => {
    if (outcome) {
      resolve(mockSession);
    } else {
      reject(Error());
    }
  }),

  removeFromDraftStore: (_, outcome = true) => new Promise((resolve, reject) => {
    if (outcome) {
      resolve();
    } else {
      reject(Error());
    }
  }),

  mockSession
};

module.exports = mockedService;
