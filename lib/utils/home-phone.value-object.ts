import { ValueObject } from '../core/value-object';
import Result from '../core/result';
const regexHash = /^\([1-9]{2}\)\s[2-5][0-9]{3}\-[0-9]{4}$/;
const regexHashSpecialChars = /\(|\)|-|\s/g;

interface Prop {
	value: string;
}

/**
 * @description Brazilian Home Phone Number
 * @default (XX) XXXX-XXXX
 */
class HomePhoneValueObject extends ValueObject<Prop> {
	private constructor(prop: Prop) {
		super(prop);
	}

	/**
	 *
	 * @param value Phone number (XX) XXXX-XXXX
	 * @returns true if pattern match and false if not.
	 */
	public static isValidValue(value: string): boolean {
		return regexHash.test(value);
	}

	/**
	 * @returns value (XX) XXXX-XXXX as string
	 */
	get value(): string {
		return this.props.value;
	}

	/**
	 *
	 * @returns only numbers without special chars. Includes DDD.
	 * @example 1122502301
	 */
	getOnlyNumbers(): number {
		const onlyNumbersAsString = this.props.value.replace(
			regexHashSpecialChars,
			''
		);
		return parseInt(onlyNumbersAsString);
	}

	/**
	 *
	 * @returns DDD only as number
	 * @example 11
	 */
	getDDD(): number {
		return parseInt(this.props.value.slice(1, 3));
	}

	/**
	 *
	 * @param value Brazilian home phone number
	 * @example (XX) XXXX-XXXX
	 * @returns Result of HomePhoneValueObject
	 */
	public static create(value: string): Result<HomePhoneValueObject> {
		if (!HomePhoneValueObject.isValidValue(value)) {
			return Result.fail<HomePhoneValueObject>(
				'Invalid Home Phone Number'
			);
		}
		return Result.ok<HomePhoneValueObject>(
			new HomePhoneValueObject({ value })
		);
	}
}

export { HomePhoneValueObject };
export default HomePhoneValueObject;
