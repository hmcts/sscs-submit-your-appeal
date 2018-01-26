const { expect } = require('test/util/chai');
const { titleise, splitBenefitType } = require('utils/stringUtils');
const benefitTypes = require('steps/start/benefit-type/types');

describe('stringUtils.js', () => {

    describe('titleise', () => {

        it('should titleise a string from hello to Hello', () => {
            expect(titleise('hello')).to.equal('Hello');
        });

        it('should return an empty string when undefined is passed', () => {
            expect(titleise(undefined)).to.equal('');
        });

        it('should return an empty string when being passed one', () => {
            const str = '';
            expect(titleise(str)).to.equal(str);
        });

    });

});

describe('splitBenefitType()', () => {

    it("should split 'Attendance Allowance' into an array", ()=> {
        const obj = splitBenefitType(benefitTypes.attendanceAllowance);
        expect(obj).to.include({code: '', description: benefitTypes.attendanceAllowance });
    });

    it("should split 'Bereavement Benefit' into an array", ()=> {
        const obj = splitBenefitType(benefitTypes.bereavementBenefit);
        expect(obj).to.include({code: '', description: benefitTypes.bereavementBenefit });
    });

    it("should split 'Carer`\'s Allowance' into an array", ()=> {
        const obj = splitBenefitType(benefitTypes.carersAllowance);
        expect(obj).to.include({code: '', description: benefitTypes.carersAllowance });
    });

    it("should split 'Child Benefit' into an array", ()=> {
        const obj = splitBenefitType(benefitTypes.childBenefit);
        expect(obj).to.include({code: '', description: benefitTypes.childBenefit });
    });

    it('should split Disability Living Allowance (DLA) into an array', ()=> {
        const obj = splitBenefitType(benefitTypes.disabilityLivingAllowance);
        expect(obj).to.include({code: 'DLA', description: 'Disability Living Allowance' });
    });

    it('should split Employment and Support Allowance (ESA) into an array', ()=> {
        const obj = splitBenefitType(benefitTypes.employmentAndSupportAllowance);
        expect(obj).to.include({code: 'ESA', description: 'Employment and Support Allowance' });
    });

    it("should split 'Home Responsibilities Protection' into an array", ()=> {
        const obj = splitBenefitType(benefitTypes.homeResponsibilitiesProtection);
        expect(obj).to.include({code: '', description: benefitTypes.homeResponsibilitiesProtection });
    });

    it("should split 'Housing Benefit' into an array", ()=> {
        const obj = splitBenefitType(benefitTypes.housingBenefit);
        expect(obj).to.include({code: '', description: benefitTypes.housingBenefit });
    });

    it("should split 'Incapacity Benefit' into an array", ()=> {
        const obj = splitBenefitType(benefitTypes.incapacityBenefit);
        expect(obj).to.include({code: '', description: benefitTypes.incapacityBenefit });
    });

    it("should split 'Income Support' into an array", ()=> {
        const obj = splitBenefitType(benefitTypes.incomeSupport);
        expect(obj).to.include({code: '', description: benefitTypes.incomeSupport });
    });

    it("should split 'Industrial Injuries Disablement' into an array", ()=> {
        const obj = splitBenefitType(benefitTypes.industrialInjuriesDisablement);
        expect(obj).to.include({code: '', description: benefitTypes.industrialInjuriesDisablement });
    });

    it('should split Jobseeker’s Allowance (JSA) into an array', ()=> {
        const obj = splitBenefitType(benefitTypes.jobseekersAllowance);
        expect(obj).to.include({code: 'JSA', description: 'Jobseeker’s Allowance' });
    });

    it("should split 'Maternity Allowance' into an array", ()=> {
        const obj = splitBenefitType(benefitTypes.maternityAllowance);
        expect(obj).to.include({code: '', description: benefitTypes.maternityAllowance });
    });

    it('should split Personal Independence Payment (PIP) into an array', ()=> {
        const obj = splitBenefitType(benefitTypes.personalIndependencePayment);
        expect(obj).to.include({code: 'PIP', description: 'Personal Independence Payment' });
    });

    it("should split 'Severe Disablement Allowance' into an array", ()=> {
        const obj = splitBenefitType(benefitTypes.severeDisablementAllowance);
        expect(obj).to.include({code: '', description: benefitTypes.severeDisablementAllowance });
    });

    it("should split 'Social Fund' into an array", ()=> {
        const obj = splitBenefitType(benefitTypes.socialFund);
        expect(obj).to.include({code: '', description: benefitTypes.socialFund });
    });

    it('should split Universal Credit (UC) into an array', ()=> {
        const obj = splitBenefitType(benefitTypes.universalCredit);
        expect(obj).to.include({code: 'UC', description: 'Universal Credit' });
    });

});
