import { BirthdayValueObject } from '../../lib/utils/birthday.value-object';

describe('birthday.value-object', () => {
	it('should be defined', () => {
		const valueObject = BirthdayValueObject.create;
		expect(valueObject).toBeDefined();
	});

	it('should create a birthday with success', () => {
		const date = new Date();
		date.setFullYear(2000, 1, 1);
		const valueObject = BirthdayValueObject.create(date);
		expect(valueObject.isSuccess).toBe(true);
	});

	it('should get value with success', () => {
		const date = new Date();
		date.setFullYear(2000, 1, 1);
		const valueObject = BirthdayValueObject.create(date).getResult();
		expect(valueObject.value).toBe(date);
	});

	it('should fail if provide an invalid value', () => {
		const date = new Date();
		date.setFullYear(1900);
		const valueObject = BirthdayValueObject.create(date);
		expect(valueObject.isFailure).toBe(true);
	});

	it('should return age', () => {
		const birth = new Date();
		birth.setTime(1596939967044);

		const valueObject = BirthdayValueObject.create(birth).getResult();
		expect(valueObject.getAgeAsYearsOld()).toBeGreaterThanOrEqual(1);
	});

	it('should return age', () => {
		const birth = new Date();
		birth.setTime(965787967044);

		const valueObject = BirthdayValueObject.create(birth).getResult();
		expect(valueObject.getAgeAsYearsOld()).toBeGreaterThanOrEqual(21);
	});

	it('should check age value', () => {
		const birth = new Date();
		birth.setTime(965787967044); // 2000-01-01

		const age = BirthdayValueObject.create(birth).getResult();
		const userHasMoreThan16YearsOld = age.isAgeGreaterThan(16);
		expect(userHasMoreThan16YearsOld).toBeTruthy();
	});

	it('should check age value', () => {
		const birth = new Date();
		birth.setTime(965787967044); // 2000-01-01

		const age = BirthdayValueObject.create(birth).getResult();
		const userHas16YearsOld = age.isAgeEqualTo(16); //>21
		expect(userHas16YearsOld).toBeFalsy();
	});
});
