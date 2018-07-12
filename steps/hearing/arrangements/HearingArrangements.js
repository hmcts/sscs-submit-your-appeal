/* eslint-disable max-len, no-undefined, no-confusing-arrow  */

const { Question } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, object, text, bool } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { setCYAValue } = require('steps/hearing/arrangements/cyaHearingArrangementsUtils');
const { errorFor } = require('@hmcts/one-per-page/src/forms/validator');
const {
  optionSelected,
  languageInList,
  signLanguageInList,
  emptyLanguageFieldValidation,
  validCharacters
} = require('steps/hearing/arrangements/hearingArrangementsValidationUtils');
const cyaContent = require('steps/hearing/arrangements/content.en').cya;
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const languages = require('steps/hearing/arrangements/languages');
const signLanguages = require('steps/hearing/arrangements/signLanguages');

class HearingArrangements extends Question {
  static get path() {
    return paths.hearing.hearingArrangements;
  }

  get languagesList() {
    return HearingArrangements.selectify(languages);
  }

  get signLanguagesList() {
    return HearingArrangements.selectify(signLanguages);
  }

  static selectify(ar) {
    return ar.map(el => {
      return { label: el, value: el };
    });
  }

  get cyaArrangements() {
    const selectionValues = this.fields.selection.value;

    const setRequiredOrNotRequired = value => value ? cyaContent.required : cyaContent.notRequired;

    const arrangementsAnswer = {
      interpreterLanguage: setRequiredOrNotRequired(selectionValues.interpreterLanguage.requested),
      signLanguage: setRequiredOrNotRequired(selectionValues.signLanguage.requested),
      hearingLoop: setRequiredOrNotRequired(selectionValues.hearingLoop.requested),
      accessibleHearingRoom: setRequiredOrNotRequired(
        selectionValues.accessibleHearingRoom.requested),
      anythingElse: setRequiredOrNotRequired(selectionValues.anythingElse.requested)
    };

    arrangementsAnswer.interpreterLanguage = setCYAValue(
      arrangementsAnswer.interpreterLanguage, selectionValues.interpreterLanguage.language);

    arrangementsAnswer.signLanguage = setCYAValue(
      arrangementsAnswer.signLanguage, selectionValues.signLanguage.language);

    arrangementsAnswer.anythingElse = setCYAValue(
      arrangementsAnswer.anythingElse, selectionValues.anythingElse.language);

    return arrangementsAnswer;
  }

  get form() {
    const selectionField = this.content.fields.selection;
    return form({
      selection: object({
        interpreterLanguage: object({
          requested: bool.default(false),
          language: text
        }).check(
          errorFor('language', selectionField.languageInterpreter.language.error.required),
          value => emptyLanguageFieldValidation(value)
        ).check(
          errorFor('language', selectionField.languageInterpreter.language.error.invalid),
          value => languageInList(value)
        ),

        signLanguage: object({
          requested: bool.default(false),
          language: text
        }).check(
          errorFor('language', selectionField.signLanguage.language.error.required),
          value => emptyLanguageFieldValidation(value)
        ).check(
          errorFor('language', selectionField.signLanguage.language.error.invalid),
          value => signLanguageInList(value)
        ),

        anythingElse: object({
          requested: bool.default(false),
          language: text
        }).check(
          errorFor('language', selectionField.anythingElse.language.error.required),
          value => emptyLanguageFieldValidation(value)
        ).check(
          errorFor('language', selectionField.anythingElse.language.error.invalid),
          value => validCharacters(value)
        ),

        hearingLoop: object({
          requested: bool.default(false)
        }),

        accessibleHearingRoom: object({
          requested: bool.default(false)
        })

      }).check(
        selectionField.error.required,
        value => optionSelected(value)
      )

    });
  }

  answers() {
    return [
      answer(this, {
        section: sections.hearingArrangements,
        template: 'answer.html'
      })
    ];
  }

  values() {
    const fieldValues = this.fields.selection.value;
    const values = {
      hearing: {
        arrangements: {
          languageInterpreter: fieldValues.interpreterLanguage.requested,
          signLanguageInterpreter: fieldValues.signLanguage.requested,
          hearingLoop: fieldValues.hearingLoop.requested,
          accessibleHearingRoom: fieldValues.accessibleHearingRoom.requested,
          other: fieldValues.anythingElse.requested
        },
        interpreterLanguageType: fieldValues.interpreterLanguage.requested ? fieldValues.interpreterLanguage.language : undefined,
        signLanguageType: fieldValues.signLanguage.requested ? fieldValues.signLanguage.language : undefined,
        anythingElse: fieldValues.anythingElse.requested ? fieldValues.anythingElse.language : undefined
      }
    };
    return values;
  }

  next() {
    return redirectTo(this.journey.steps.HearingAvailability);
  }
}

module.exports = HearingArrangements;
