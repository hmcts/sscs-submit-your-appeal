'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, object, text, bool } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { setCYAValue } = require('steps/hearing/arrangements/cyaHearingArrangementsUtils');
const { errorFor } = require('@hmcts/one-per-page/src/forms/validator');
const { optionSelected, languageInList, emptyLanguageFieldValidation, validCharacters } = require('steps/hearing/arrangements/hearingArrangementsValidationUtils');
const cyaContent = require('steps/hearing/arrangements/content.en').cya;
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const languages = require('steps/hearing/arrangements/languages');

class HearingArrangements extends Question {

    static get path() {

        return paths.hearing.hearingArrangements;
    }

    get languagesList() {

        let list = [];

        languages.forEach(language => {
           const obj = {};
           obj.label = language;
           obj.value = language;
           list.push(obj);
        });

        return list;

    }

    get cyaArrangements() {

        const selectionValues = this.fields.selection.value;

        const setRequiredOrNotRequired = value => {
          return value ? cyaContent.required : cyaContent.notRequired;
        };

        const arrangementsAnswer = {
            interpreterLanguage: setRequiredOrNotRequired(selectionValues.interpreterLanguage.requested),
            signLanguage: setRequiredOrNotRequired(selectionValues.signLanguage.requested),
            hearingLoop: setRequiredOrNotRequired(selectionValues.hearingLoop.requested),
            accessibleHearingRoom: setRequiredOrNotRequired(selectionValues.accessibleHearingRoom.requested),
            anythingElse: setRequiredOrNotRequired(selectionValues.anythingElse.requested)
        };

        arrangementsAnswer.interpreterLanguage = setCYAValue(arrangementsAnswer.interpreterLanguage, selectionValues.interpreterLanguage.language);
        arrangementsAnswer.signLanguage = setCYAValue(arrangementsAnswer.signLanguage, selectionValues.signLanguage.language);
        arrangementsAnswer.anythingElse = setCYAValue(arrangementsAnswer.anythingElse, selectionValues.anythingElse.language);

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
                    value => languageInList(value)
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

    // values() {
    //
    //     const values = {
    //         hearing: {
    //             arrangements: {
    //                 languageInterpreter: false,
    //                 signLanguageInterpreter: false,
    //                 hearingLoop: false,
    //                 accessibleHearingRoom: false,
    //                 other: false
    //             },
    //             interpreterLanguageType: this.fields.interpreterLanguageType.value,
    //             signLanguageType: this.fields.signLanguageType.value,
    //             anythingElse: this.fields.anythingElse.value,
    //         }
    //     };
    //
    //     this.fields.selection.value.forEach((arrangement) => {
    //         values.hearing.arrangements[arrangement] = true;
    //     });
    //
    //
    //     console.log(values);
    //
    //     return values;
    // }

    next() {

        return goTo(this.journey.steps.HearingAvailability);
    }
}

module.exports = HearingArrangements;
